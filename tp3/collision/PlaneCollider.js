import * as THREE from "three"
import { Game } from "../Game.js";
import Vehicle from "../vehicles/Vehicle.js";
import Collider from "./Collider.js";

export default class PlaneCollider extends Collider {

    /**
     * 
     * @param {Game} game 
     * @param {THREE.Object3D} object 
     * @param {(vehicle: Vehicle) => void} handler 
     */
    constructor(game, object, handler) {
        super(game, object, handler);

        this.collider = new THREE.Plane();
    }

    /**
     * 
     * @param {Collider} other 
     * @returns {boolean}
     */
    collidesWith(other) {
        if (/* other instanceof PlaneCollider && */ other.collider instanceof THREE.Plane) {
            return Math.abs(this.collider.normal.dot(other.collider.normal)) === 1
        } else {
            return other.collider?.intersectsPlane(this.collider) ?? false;
        }
    }
}