import * as THREE from "three";
import { Game } from "../Game.js";
import Collider from "../vehicles/Collider.js";

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
        const powerup = new THREE.Group();

        const geometry = new THREE.CylinderGeometry(1, 1, 0.5);
        geometry.computeBoundingBox();
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.rotation.x = Math.PI / 2;

        powerup.add(this.mesh);

        this.add(powerup);

        this.boxCollider = new THREE.Box3()

        // @ts-ignore
        this.boxCollider.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.matrixWorld);

        this.collider = new Collider({
            object: this.boxCollider,
            type: "box",
        });

        this.game.scene.add(new THREE.Box3Helper(this.boxCollider, 0xffff00));
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.time += delta;

        this.position.y += Math.sin(this.time * 2) * 0.125;
        this.rotateOnAxis(new THREE.Vector3(0, 1, 0), delta * 0.5);

        // @ts-ignore
        this.boxCollider.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
    }

    onCollision() {
        throw new Error("onCollision() not implemented for base powerup class");
    }
}
