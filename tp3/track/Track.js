import * as THREE from "three";
import { OBB } from "three/addons/math/OBB.js";
import { Game } from "../game/Game.js";
import { HELPERS, TRACK } from "../renderer/Layers.js";

export class Track extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

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

        this.lap = -1;
        this.nextWaypoint = 0;

        game.modelManager.load("models/track.glb").then((model) => {
            this.add(model);

            /** @type {THREE.Object3D[]} */
            const waypoints = [];

            model.traverse((child) => {
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

    reset() {
        this.lap = -1;
        this.nextWaypoint = 0;

        for (const light of this.waypointLights.flat()) {
            if (light.on) light.on.visible = false;
            if (light.off) light.off.visible = true;
        }
    }

    /**
     * @param {OBB} collider
     */
    checkWaypoint(collider) {
        if (collider.intersectsOBB(this.waypointColliders[this.nextWaypoint])) {
            if (this.nextWaypoint === 0) this.lap++;

            if (this.lap >= 3) return;

            const light = this.waypointLights[this.nextWaypoint][this.lap];

            if (light.on) light.on.visible = true;
            if (light.off) light.off.visible = false;

            this.nextWaypoint =
                (this.nextWaypoint + 1) % this.waypointColliders.length;
        }
    }
}
