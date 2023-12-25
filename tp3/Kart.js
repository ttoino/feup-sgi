/// @ts-check

import * as THREE from "three";
import { ALL_VEHICLES, HELPERS } from "./Layers.js";
import { MyApp } from "./MyApp.js";

export class Kart extends THREE.Object3D {
    /**
     * @param {MyApp} app
     */
    constructor(app) {
        super();

        this.acceleration = 0;

        this.app = app;
        this.forwardSpeed = 0;
        this.rotationSpeedRadS = 0;
        this.rotationRad = 0;

        this.position.set(0, 1, 0);

        this.material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        this.geometry = new THREE.BoxGeometry(2, 2, 2);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);

        this.layers.enable(ALL_VEHICLES);

        document.addEventListener(
            "keydown",
            this.movementKeyDownController.bind(this)
        );
        document.addEventListener(
            "keyup",
            this.movementKeyUpController.bind(this)
        );

        this.helper = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 1),
            ]),
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        this.helper.layers.set(HELPERS);
        this.add(this.helper);
    }

    #speedUp() {
        this.acceleration = 1;
    }

    #speedDown() {
        this.acceleration = -1;
    }

    #resetAcceleration() {
        this.acceleration = 0;
    }

    #rotateLeft() {
        this.rotationRad = 1;
    }

    #rotateRight() {
        this.rotationRad = -1;
    }

    #resetRotation() {
        this.rotationRad = 0;
    }

    movementKeyDownController(event) {
        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
                this.#speedUp();
                break;
            case "ArrowDown":
            case "s":
            case "S":
                this.#speedDown();
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                this.#rotateLeft();
                break;
            case "ArrowRight":
            case "d":
            case "D":
                this.#rotateRight();
                break;
        }
    }

    movementKeyUpController(event) {
        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
            case "ArrowDown":
            case "s":
            case "S":
                this.#resetAcceleration();
                break;
            case "ArrowLeft":
            case "a":
            case "A":
            case "ArrowRight":
            case "d":
            case "D":
                this.#resetRotation();
                break;
        }
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.forwardSpeed = Math.max(
            this.forwardSpeed + this.acceleration * delta,
            0
        );
        this.helper.scale.z = this.forwardSpeed;

        console.log(this.forwardSpeed, this.rotationRad);

        this.rotation.y += this.rotationRad * delta;

        this.position.x += this.forwardSpeed * Math.sin(this.rotation.y) * delta;
        this.position.z += this.forwardSpeed * Math.cos(this.rotation.y) * delta;
    }
}
