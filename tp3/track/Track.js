import * as THREE from "three";
import { OBB } from "three/addons/math/OBB.js";
import { Game } from "../game/Game.js";
import { TRACK } from "../renderer/Layers.js";
import TrackWaypoint, { WINNER_TO_GLOW } from "./TrackWaypoint.js";

export class Track extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.game = game;

        this.playerStart = new THREE.Object3D();
        this.opponentStart = new THREE.Object3D();

        /** @type {THREE.Object3D[]} */
        this.itemSpots = [];

        /** @type {THREE.Object3D[]} */
        this.opponentRoute = [];

        /** @type {THREE.Object3D} */
        this.glow = new THREE.Object3D();

        /** @type {TrackWaypoint[]} */
        this.waypoints = [];

        this.playerLap = -1;
        this.nextPlayerWaypoint = 0;

        this.opponentLap = -1;
        this.nextOpponentWaypoint = 0;

        game.modelManager.load("models/track.glb").then((model) => {
            this.add(model);


            model.traverse((child) => {
                if (child.name.includes("glow")) this.glow = child;

                if (child.name.includes("collider")) child.layers.set(TRACK);

                if (child.name.includes("start_player"))
                    this.playerStart = child;

                if (child.name.includes("start_opponent"))
                    this.opponentStart = child;

                if (child.name.match(/waypoint_\d+$/)) this.waypoints.push(new TrackWaypoint(this.game, child));

                if (child.name.match(/item_\d+$/)) this.itemSpots.push(child);

                if (child.name.match(/opponent_route_\d+$/))
                    this.opponentRoute.push(child);
            });

            this.opponentRoute.sort((a, b) =>
                a.name.localeCompare(b.name, ["en"])
            );
            this.opponentRoute.unshift(this.opponentStart);

            this.waypoints.sort((a, b) =>
                a.name.localeCompare(b.name, ["en"])
            );
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
        this.playerLap = -1;
        this.opponentLap = -1;
        this.nextWaypoint = 0;

        this.waypoints.forEach((waypoint) => waypoint.reset());

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

        const nextWaypoint = this.waypoints[proxy.nextWaypoint];

        if (
            collider.intersectsOBB(nextWaypoint.collider)
        ) {
            if (proxy.nextWaypoint === 0) {
                proxy.lap++;
            }

            if (proxy.lap >= 3) return;

            proxy.nextWaypoint =
                (proxy.nextWaypoint + 1) % this.waypoints.length;

            const material = WINNER_TO_GLOW[this.winner];
            this.game.materials.changeGlow(this.glow, material);

            nextWaypoint.changeLightColor(
                opponent
                    ? "glow_red"
                    : "glow_blue",
                proxy.lap)
        }
    }
}
