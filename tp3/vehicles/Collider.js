import { Box3, Plane, Sphere } from "three"

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
    */
    constructor(options) {

        // TODO: better type magic
        this.options = options
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
}