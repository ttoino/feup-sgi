import * as THREE from "three";
import { Game } from "../game/Game.js";

/**
 * @abstract
 */
export class Park extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.game = game;

        /** @type {THREE.Object3D[]} */
        this.spots = [];
        this.nextSpot = 0;

        game.modelManager.load("models/park.glb").then((m) => {
            const model = m.clone();

            this.add(model);

            model.traverse((child) => {
                if (child.name.match(/spot_\d+$/)) this.spots.push(child);
            });

            this.spots.sort((a, b) => a.name.localeCompare(b.name, ["en"]));

            this.addObjects();
        });
    }

    /**
     * @abstract
     */
    addObjects() {
        throw new Error("Not implemented");
    }

    /**
     * @param {THREE.Object3D} object
     */
    addToSpot(object) {
        if (this.nextSpot >= this.spots.length) return;

        const spot = this.spots[this.nextSpot++];
        object.position.copy(spot.getWorldPosition(new THREE.Vector3()));
        object.quaternion.copy(spot.getWorldQuaternion(new THREE.Quaternion()));
    }
}
