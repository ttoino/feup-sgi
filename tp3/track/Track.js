import * as THREE from "three";
import { OBB } from "three/addons/math/OBB.js";
import { Game } from "../game/Game.js";
import { HELPERS, TRACK } from "../renderer/Layers.js";

const WINNER_TO_GLOW = {
    player: "glow_blue",
    opponent: "glow_red",
    tie: "glow_yellow",
};

export class Track extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.game = game;

        this.playerStart = new THREE.Object3D();
        this.opponentStart = new THREE.Object3D();
        /** @type {OBB[]} */
        this.waypointColliders = [];
        /**
         * @typedef {{
         *     on?: THREE.Object3D;
         *     off?: THREE.Object3D;
         * }} WaypointLight
         * @type {WaypointLight[][]}
         */
        this.waypointLights = [];
        /** @type {THREE.Object3D[]} */
        this.itemSpots = [];
        /** @type {THREE.Object3D[]} */
        this.opponentRoute = [];
        /** @type {THREE.Object3D} */
        this.glow = new THREE.Object3D();

        this.playerLap = -1;
        this.nextPlayerWaypoint = 0;

        this.opponentLap = -1;
        this.nextOpponentWaypoint = 0;

        game.modelManager.load("models/track.glb").then((model) => {
            this.add(model);

            /** @type {THREE.Object3D[]} */
            const waypoints = [];

            model.traverse((child) => {
                if (child.name.includes("glow")) this.glow = child;

                if (child.name.includes("collider")) child.layers.set(TRACK);

                if (child.name.includes("start_player"))
                    this.playerStart = child;

                if (child.name.includes("start_opponent"))
                    this.opponentStart = child;

                if (child.name.match(/waypoint_\d+$/)) waypoints.push(child);

                if (child.name.match(/item_\d+$/)) this.itemSpots.push(child);

                if (child.name.match(/opponent_route_\d+$/))
                    this.opponentRoute.push(child);
            });

            this.opponentRoute.sort((a, b) =>
                a.name.localeCompare(b.name, ["en"])
            );
            this.opponentRoute.unshift(this.opponentStart);

            this.waypointLights = waypoints.map((waypoint) =>
                /** @type {const} */ ([1, 2, 3]).map((i) => {
                    const light = {
                        on: waypoint.getObjectByName(
                            `${waypoint.name}_${i}_on`
                        ),
                        off: waypoint.getObjectByName(
                            `${waypoint.name}_${i}_off`
                        ),
                    };

                    if (light.on) light.on.visible = false;
                    if (light.off) light.off.visible = true;

                    return light;
                })
            );

            this.waypointColliders = waypoints
                .sort((a, b) => a.name.localeCompare(b.name, ["en"]))
                .map((waypoint) => {
                    waypoint.updateMatrixWorld();

                    const helper = new THREE.Mesh(
                        new THREE.BoxGeometry(24, 0.2, 24),
                        new THREE.MeshBasicMaterial({
                            color: 0x00ff00,
                            wireframe: true,
                        })
                    );
                    helper.applyMatrix4(waypoint.matrixWorld);
                    helper.layers.set(HELPERS);
                    game.scene.add(helper);

                    return new OBB(
                        new THREE.Vector3(),
                        new THREE.Vector3(12, 0.1, 12)
                    ).applyMatrix4(waypoint.matrixWorld);
                });
        });
    }

    get winner() {
        if (
            this.playerLap === this.opponentLap &&
            this.nextPlayerWaypoint === this.nextOpponentWaypoint
        )
            return "tie";
        else if (
            this.playerLap > this.opponentLap ||
            (this.playerLap === this.opponentLap &&
                this.nextPlayerWaypoint > this.nextOpponentWaypoint)
        )
            return "player";
        else return "opponent";
    }

    reset() {
        this.lap = -1;
        this.nextWaypoint = 0;

        for (const light of this.waypointLights.flat()) {
            if (light.on) light.on.visible = false;
            if (light.off) light.off.visible = true;
        }

        this.game.materials.changeGlow(this);
    }

    /**
     * @param {OBB} collider
     */
    checkWaypoint(collider, opponent = false) {
        const scope = this;
        const proxy = {
            get nextWaypoint() {
                return opponent
                    ? scope.nextOpponentWaypoint
                    : scope.nextPlayerWaypoint;
            },
            set nextWaypoint(value) {
                if (opponent) scope.nextOpponentWaypoint = value;
                else scope.nextPlayerWaypoint = value;
            },
            get lap() {
                return opponent ? scope.opponentLap : scope.playerLap;
            },
            set lap(value) {
                if (opponent) scope.opponentLap = value;
                else scope.playerLap = value;
            },
        };

        if (
            collider.intersectsOBB(this.waypointColliders[proxy.nextWaypoint])
        ) {
            if (proxy.nextWaypoint === 0) {
                proxy.lap++;
            }

            if (proxy.lap >= 3) return;

            const light = this.waypointLights[proxy.nextWaypoint][proxy.lap];

            proxy.nextWaypoint =
                (proxy.nextWaypoint + 1) % this.waypointColliders.length;

            const material = WINNER_TO_GLOW[this.winner];
            this.game.materials.changeGlow(this.glow, material);

            if (light.on) {
                const material = light.on.visible
                    ? "glow_yellow"
                    : opponent
                    ? "glow_red"
                    : "glow_blue";

                light.on.visible = true;
                this.game.materials.changeGlow(light.on, material);
            }
            if (light.off) {
                light.off.visible = false;
            }
        }
    }
}
