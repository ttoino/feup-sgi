import * as THREE from "three";
import Vehicle from "../vehicles/Vehicle.js";
import { Game } from "../Game.js";

/**
 * @typedef {THREE.Box3 | THREE.Sphere | THREE.Plane} CollisionObject
 */

/**
 * @abstract
 */
export default class Collider {
    /**
    *
    * @constructor
    * @param {Game} game
    * @param {THREE.Object3D} object}
    * @param {(other: Vehicle) => void} handler
    */
    constructor(game, object, handler) {

        this.game = game

        this.object = object

        /**
         * @type {CollisionObject | null}
         */
        this.collider = null

        this.handler = handler
    }

    /**
     * @abstract
     * @param {Collider} other 
     * @returns {boolean}
     */
    collidesWith(other) {
        throw new Error("Not implemented")
    }

    /**
     * 
     * @param {number} delta 
     */
    update(delta) {
        throw new Error("Not implemented")
    }

    // TODO: this typing is awkward
    /**
     * 
     * @param {Vehicle} other 
     */
    onCollision(other) {
        this.handler(other)
    }
}