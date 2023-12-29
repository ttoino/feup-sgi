import * as THREE from "three";
import { Game } from "../Game.js";
import Collider from "../vehicles/Collider.js";
import { HELPERS } from "../Layers.js";
import Vehicle from "../vehicles/Vehicle.js";

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

        // TODO: there's gotta be a simpler way o doing this


        this.sphereCollider = new THREE.Sphere();
        // @ts-ignore
        this.mesh.geometry.boundingBox.getBoundingSphere(this.sphereCollider).applyMatrix4(this.matrixWorld)

        this.collider = new Collider({
            object: this.sphereCollider,
            type: "sphere",
        }, this.onCollision);

        this.sphereWireframe = new THREE.Mesh(
            new THREE.SphereGeometry(this.sphereCollider.radius, 10, 10),
            new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
        )
        this.sphereWireframe.layers.set(HELPERS);

        // @ts-ignore
        this.game.scene.add(this.sphereWireframe);
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.time += delta;

        this.position.y += Math.sin(this.time * 2) * 0.125;
        this.rotateOnAxis(new THREE.Vector3(0, 1, 0), delta * 0.5);

        // @ts-ignore
        this.mesh.geometry.boundingBox?.getBoundingSphere(this.sphereCollider).applyMatrix4(this.matrixWorld)

        // @ts-ignore
        this.sphereWireframe.position.y = this.sphereCollider.center.y;
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
