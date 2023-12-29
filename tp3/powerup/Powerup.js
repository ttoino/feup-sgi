import * as THREE from "three";
import { Game } from "../Game.js";
import Collider from "../collision/Collider.js";
import { HELPERS } from "../Layers.js";
import Vehicle from "../vehicles/Vehicle.js";
import SphereCollider from "../collision/SphereCollider.js";

export default class Powerup extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.game = game;

        this.time = 0;

        this.#init();
    }

    #init() {
        const powerUp = new THREE.Group();

        const geometry = new THREE.CylinderGeometry(1, 1, 0.5);
        geometry.computeBoundingBox();
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.rotation.x = Math.PI / 2;

        powerUp.add(this.mesh);

        this.add(powerUp);

        this.collider = new SphereCollider(this.game, this, this.onCollision);
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.time += delta;

        this.position.y += Math.sin(this.time * 2) * 0.125;
        this.rotateOnAxis(new THREE.Vector3(0, 1, 0), delta * 0.5);

        this.collider?.update(delta)
    }

    /**
     * 
     * @param {Vehicle} vehicle 
     */
    onCollision(vehicle) {

        console.log("onCollision() not implemented for base powerup class", vehicle);

        // throw new Error("onCollision() not implemented for base powerup class");
    }
}
