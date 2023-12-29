import { Box3, Plane, Sphere } from "three"
import Vehicle from "./Vehicle.js"

// TODO: implement better abstractions

export default class Collider {
    /**
    *
    * @constructor
    * @param {{
    *   type: 'plane',
    *   object: Plane,
    * } | {
    *   type: 'box',
    *   object: Box3,
    * } | {
    *   type: 'sphere',
    *   object: Sphere,
    * }} options
    * @param {(other: Vehicle) => void} handler
    */
    constructor(options, handler) {

        // TODO: better type magic
        this.options = options

        this.handler = handler
    }

    /**
     * 
     * @param {Collider} other 
     * @returns {boolean}
     */
    collidesWith(other) {
        if (other.options.type === 'box') {
            return this.options.object.intersectsBox(other.options.object)
        } else if (other.options.type === 'sphere') {
            return this.options.object.intersectsSphere(other.options.object)
        } else {
            if (this.options.type === 'plane') {
                return Math.abs(this.options.object.normal.dot(other.options.object.normal)) === 1
            } else {
                return this.options.object.intersectsPlane(other.options.object)
            }
        }
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