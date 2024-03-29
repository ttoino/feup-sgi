import * as THREE from "three";
import { OBB } from "three/addons/math/OBB.js";
import { Game } from "../game/Game.js";
import { TRACK } from "../renderer/Layers.js";
import TrackWaypoint from "./TrackWaypoint.js";
import Powerup from "./items/powerup/Powerup.js";

export const WINNER_TO_GLOW = {
    player: "glow_blue",
    opponent: "glow_red",
    tie: "glow_yellow",
};

export class TrackPosition {
    /**
     * @param {number} lap
     * @param {number} nextWaypoint
     */
    constructor(lap = -1, nextWaypoint = 0) {
        this.lap = lap;
        this.nextWaypoint = nextWaypoint;
    }
}

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

                if (child.name.match(/waypoint_\d+$/))
                    this.waypoints.push(new TrackWaypoint(this.game, child));

                if (child.name.match(/item_\d+$/)) this.itemSpots.push(child);

                if (child.name.match(/opponent_route_\d+$/))
                    this.opponentRoute.push(child);
            });

            this.opponentRoute.sort((a, b) =>
                a.name.localeCompare(b.name, ["en"])
            );
            this.opponentRoute.unshift(this.opponentStart);

            this.waypoints.sort((a, b) => a.name.localeCompare(b.name, ["en"]));
        });
    }

    reset() {
        this.playerLap = -1;
        this.opponentLap = -1;
        this.nextWaypoint = 0;

        this.waypoints.forEach((waypoint) => waypoint.reset());

        this.game.materials.changeGlow(this);

        const items = [
            ...this.game.contents.obstacles,
            ...this.game.contents.powerUps,
        ];

        this.game.contents.items.length = 0;

        this.itemSpots.forEach((spot) => {
            if (Math.random() < 0.2) {
                const item =
                    items[Math.floor(Math.random() * items.length)]

                if (this.game.info.difficulty === 2 && item instanceof Powerup && Math.random() < 0.55) return

                const newItem = item.makeClone();

                newItem.position.copy(spot.getWorldPosition(new THREE.Vector3()));
                this.game.contents.items.push(newItem);
                this.game.scene.add(newItem);
            }
        });
    }

    /**
     * @param {OBB} collider
     * @param {TrackPosition} position
     */
    checkWaypoint(collider, position, opponent = false) {
        const nextWaypoint = this.waypoints[position.nextWaypoint];

        // FIXME: use better semantics
        if (collider.intersectsOBB(nextWaypoint.collider)) {
            if (position.nextWaypoint === 0) {
                position.lap++;
            }

            if (position.lap >= 3) return;

            position.nextWaypoint =
                (position.nextWaypoint + 1) % this.waypoints.length;

            nextWaypoint.changeLightColor(
                opponent ? "glow_red" : "glow_blue",
                position.lap
            );
        }
    }
}
