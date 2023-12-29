import * as THREE from 'three';
import { Game } from "../Game.js";
import Vehicle from "../vehicles/Vehicle.js";
import Collider from "./Collider.js";
import { HELPERS } from '../Layers.js';

export default class SphereCollider extends Collider {

    /**
     * 
     * @param {Game} game 
     * @param {THREE.Object3D} object 
     * @param {(vehicle: Vehicle) => void} handler 
     */
    constructor(game, object, handler) {
        super(game, object, handler);

        this.collider = new THREE.Sphere()
        new THREE.Box3().setFromObject(object).getBoundingSphere(this.collider).applyMatrix4(object.matrixWorld);

        this.sphereWireframe = new THREE.Mesh(
            new THREE.SphereGeometry(this.collider.radius, 10, 10),
            new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
        )
        this.sphereWireframe.layers.set(HELPERS);

        // @ts-ignore
        this.game.scene.add(this.sphereWireframe);
    }

    /**
     * 
     * @param {number} delta 
     */
    update(delta) {
        // We are working under the assumption that, if something gets a spherical collider,
        // chances are they are somewhat spherical and wont change significantly in size or shape.

        this.collider.center.copy(this.object.position);

        this.sphereWireframe.position.copy(this.collider.center);
    }

    /**
     * 
     * @param {Collider} other 
     * @returns {boolean}
     */
    collidesWith(other) {
        return other.collider?.intersectsSphere(this.collider) ?? false;
    }
}