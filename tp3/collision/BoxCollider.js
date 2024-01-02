import * as THREE from "three";
import { Game } from "../game/Game.js";
import Vehicle from "../vehicles/Vehicle.js";
import Collider from "./Collider.js";
import { HELPERS } from "../renderer/Layers.js";
import { OBB } from "three/addons/math/OBB.js";
import SphereCollider from "./SphereCollider.js";
import PlaneCollider from "./PlaneCollider.js";

export default class BoxCollider extends Collider {
    /**
     * @param {Game} game
     * @param {THREE.Object3D} object
     * @param {(vehicle: Vehicle) => void} handler
     */
    constructor(game, object, handler) {
        super(game, object, handler);

        this.aabb = new THREE.Box3().setFromObject(object.clone());
        console.log(this.aabb);

        object.updateMatrixWorld();
        this.collider = new OBB()
            .fromBox3(this.aabb)
            .applyMatrix4(object.matrixWorld);

        const size = this.aabb.getSize(new THREE.Vector3());
        const center = this.aabb.getCenter(new THREE.Vector3());
        const helperMesh = new THREE.Mesh(
            new THREE.BoxGeometry(size.x, size.y, size.z),
            new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
        );
        helperMesh.position.copy(center);
        helperMesh.layers.set(HELPERS);
        this.helper = new THREE.Object3D();
        this.helper.add(helperMesh);
        this.helper.matrixAutoUpdate = false;
        this.helper.matrix.copy(object.matrixWorld);
        this.helper.layers.set(HELPERS);
        this.game.scene.add(this.helper);
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.object.updateMatrixWorld();
        this.collider.fromBox3(this.aabb).applyMatrix4(this.object.matrixWorld);
        this.helper.matrix.copy(this.object.matrixWorld);
    }

    /**
     * @param {Collider} other
     * @returns {boolean}
     */
    collidesWith(other) {
        // TODO: yuck

        if (other instanceof SphereCollider)
            return this.collider.intersectsSphere(other.collider);
        else if (other instanceof BoxCollider)
            return this.collider.intersectsOBB(other.collider);
        else if (other instanceof PlaneCollider)
            return this.collider.intersectsPlane(other.collider);

        return false;
    }
}
