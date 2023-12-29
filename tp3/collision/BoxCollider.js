import * as THREE from 'three';
import { Game } from "../Game.js";
import Vehicle from "../vehicles/Vehicle.js";
import Collider from "./Collider.js";
import { HELPERS } from '../Layers.js';

export default class BoxCollider extends Collider {

    /**
     * 
     * @param {Game} game 
     * @param {THREE.Object3D} object 
     * @param {(vehicle: Vehicle) => void} handler 
     */
    constructor(game, object, handler) {
        super(game, object, handler);

        this.collider = new THREE.Box3().setFromObject(object);

        const colliderHelper = new THREE.Box3Helper(this.collider, 0xffff00);
        colliderHelper.layers.set(HELPERS);
        this.game.scene.add(colliderHelper);
    }

    /**
     * 
     * @param {number} delta 
     */
    update(delta) {
        // no need to apply world matrix since setFromObject apparently already does that.
        this.collider.setFromObject(this.object)
    }


    /**
     * 
     * @param {Collider} other 
     * @returns {boolean}
     */
    collidesWith(other) {
        return other.collider?.intersectsBox(this.collider) ?? false;
    }
}