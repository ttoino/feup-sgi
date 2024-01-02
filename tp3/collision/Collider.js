import * as THREE from "three";
import Vehicle from "../vehicles/Vehicle.js";
import { Game } from "../game/Game.js";

/**
 * @abstract
 */
export default class Collider {
    /**
     * @param {Game} game
     * @param {THREE.Object3D} object}
     * @param {(other: Vehicle) => void} handler
     */
    constructor(game, object, handler) {
        this.game = game;

        this.object = object;

        this.handler = handler;
    }

    /**
     * @abstract
     *
     * @param {Collider} other
     * @returns {boolean}
     */
    collidesWith(other) {
        throw new Error("Not implemented");
    }

    /**
     * @abstract
     *
     * @param {number} delta
     */
    update(delta) {
        throw new Error("Not implemented");
    }

    // TODO: this typing is awkward
    /**
     * @param {Vehicle} other
     */
    onCollision(other) {
        this.handler(other);
    }
}
