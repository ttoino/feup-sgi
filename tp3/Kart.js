/// @ts-check

import * as THREE from "three";
import { ALL_VEHICLES, HELPERS } from "./Layers.js";
import { MyApp } from "./MyApp.js";

// @ts-expect-error
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const ACCEL = 5;
const MIN_SPEED = 0
const MAX_SPEED = 20

export class Kart extends THREE.Object3D {
    /**
     * @param {MyApp} app
     */
    constructor(app) {
        super();

        this.acceleration = 0;

        this.app = app;
        this.maxSpeed = MAX_SPEED;
        this.forwardSpeed = 0;
        this.rotationSpeedRadS = 0;
        this.rotationRad = 0;

        this.position.set(0, 1, 0);

        // this.material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        // this.geometry = new THREE.BoxGeometry(2, 2, 2);
        // this.mesh = new THREE.Mesh(this.geometry, this.material);
        // this.add(this.mesh);

        /** @type {THREE.Object3D[]} */
        this.steers = [];
        /** @type {THREE.Object3D[]} */
        this.wheels = [];

        const loader = new GLTFLoader();
        loader.load(
            "models/light_cycle.glb",
            (gltf) => {
                console.debug(gltf);
                this.add(gltf.scene);

                gltf.scene.traverse((child) => {
                    if (child.name.includes("steer")) {
                        this.steers.push(child);
                    } else if (child.name.includes("wheel")) {
                        this.wheels.push(child);
                    }
                });
            },
        );

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
        this.acceleration = ACCEL;
    }

    #speedDown() {
        this.acceleration = -ACCEL;
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
     * Applies an effect to this kart's max speed.
     * 
     * @param {(previousMaxSpeed: number) => number} effect 
     */
    applySpeedEffect(effect) {
        this.maxSpeed = effect(this.maxSpeed);
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.forwardSpeed = Math.min(Math.max(
            this.forwardSpeed + this.acceleration * delta,
            MIN_SPEED
        ), this.maxSpeed);
        this.helper.scale.z = this.forwardSpeed;

        // TODO: Kart rotation should be based on the speed
        this.rotation.y += this.rotationRad * delta;

        // TODO: Max speed, maybe using drag
        this.position.x += this.forwardSpeed * Math.sin(this.rotation.y) * delta;
        this.position.z += this.forwardSpeed * Math.cos(this.rotation.y) * delta;

        this.steers.forEach((steer) => {
            steer.rotation.y = THREE.MathUtils.lerp(steer.rotation.y, this.rotationRad * Math.PI / 6, Math.min(1, delta * 4));
        });

        this.wheels.forEach((wheel) => {
            wheel.rotation.x += this.forwardSpeed * delta;
        });
    }
}