import * as THREE from 'three';
import { Game } from "../Game.js";
import Vehicle from "../vehicles/Vehicle.js";
import Collider from "./Collider.js";
import { HELPERS } from '../Layers.js';
import { OBB } from 'three/addons/math/OBB.js';
import SphereCollider from './SphereCollider.js';
import PlaneCollider from './PlaneCollider.js';

export default class BoxCollider extends Collider {

    /**
     * 
     * @param {Game} game 
     * @param {THREE.Object3D} object 
     * @param {(vehicle: Vehicle) => void} handler 
     */
    constructor(game, object, handler) {
        super(game, object, handler);

        this.collider = new OBB().fromBox3(new THREE.Box3().setFromObject(object));

        const size = new THREE.Vector3();
        this.collider.getSize(size);
        this.boxWireframe = new THREE.Mesh(
            new THREE.BoxGeometry(size.x, size.y, size.z),
            new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
        )
        this.boxWireframe.layers.set(HELPERS);
        this.game.scene.add(this.boxWireframe);
    }

    /**
     * 
     * @param {number} delta 
     */
    update(delta) {
        this.collider.fromBox3(new THREE.Box3().setFromObject(this.object));

        this.boxWireframe.position.copy(this.collider.center);
        // @ts-ignore
        this.boxWireframe.rotation.copy(new THREE.Euler().setFromRotationMatrix(this.object.matrixWorld));
    }


    /**
     * 
     * @param {Collider} other 
     * @returns {boolean}
     */
    collidesWith(other) {
        // TODO: yuck

        if (other instanceof SphereCollider) {
            return this.collider.intersectsSphere(other.collider);
        } else if (other instanceof BoxCollider) {
            return this.collider.intersectsOBB(other.collider);
        } else if (other instanceof PlaneCollider) {
            return this.collider.intersectsPlane(other.collider);
        }

        return false;
    }
}