/// <reference path="../types/three/addons/loaders.d.ts"/>

import * as THREE from "three";
import { ALL_VEHICLES, HELPERS } from "../Layers.js";
import { Game } from "../Game.js";
import Vehicle from "./Vehicle.js";

export class LightCar extends Vehicle {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game);

        this.game = game;

        /** @type {THREE.Object3D[]} */
        this.steers = [];
        /** @type {THREE.Object3D[]} */
        this.wheels = [];
        /** @type {THREE.Object3D | undefined} */
        this.model = undefined;

        this.game.modelManager.loadModel(
            `models/light_car.glb`,
            (gltf) => {
                this.model = gltf;
                this.add(gltf);

                gltf.traverse((child) => {
                    if (child.name.includes("steer")) {
                        this.steers.push(child);
                    } else if (child.name.includes("wheel")) {
                        this.wheels.push(child);
                    } else if (child.name.includes("center")) {
                        this.center = child;
                        this.cubeCamera.position.copy(child.position);
                    }

                    if (
                        child instanceof THREE.Mesh &&
                        child.material instanceof THREE.MeshStandardMaterial
                    ) {
                        child.material.envMap = this.cubeRenderTarget.texture;
                    }
                });
            }
        );

        this.layers.enable(ALL_VEHICLES);

        this.helper = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 1),
            ]),
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        this.helper.layers.set(HELPERS);
        this.add(this.helper);

        this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024, {
            type: THREE.FloatType,
        });
        this.cubeCamera = new THREE.CubeCamera(
            0.1,
            1000,
            this.cubeRenderTarget
        );
        this.add(this.cubeCamera);

        document.addEventListener(
            "keydown",
            this.movementKeyDownController.bind(this)
        );
        document.addEventListener(
            "keyup",
            this.movementKeyUpController.bind(this)
        );
    }

    /**
     * @param {KeyboardEvent} event
     */
    movementKeyDownController(event) {
        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
                this.speedUp();
                break;
            case "ArrowDown":
            case "s":
            case "S":
                this.speedDown();
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                this.rotateLeft();
                break;
            case "ArrowRight":
            case "d":
            case "D":
                this.rotateRight();
                break;
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    movementKeyUpController(event) {
        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
            case "ArrowDown":
            case "s":
            case "S":
                this.resetAcceleration();
                break;
            case "ArrowLeft":
            case "a":
            case "A":
            case "ArrowRight":
            case "d":
            case "D":
                this.resetRotation();
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
        super.update(delta)
        this.helper.scale.z = this.forwardSpeed;

        this.steers.forEach((steer) => {
            steer.rotation.y = THREE.MathUtils.lerp(
                steer.rotation.y,
                (this.rotationRad * Math.PI) / 6,
                Math.min(1, delta * 4)
            );
        });

        this.wheels.forEach((wheel) => {
            wheel.rotation.x += this.forwardSpeed * delta;
        });

        if (this.model) this.model.visible = false;
        this.cubeCamera.update(this.game.renderer.renderer, this.game.scene);
        if (this.model) this.model.visible = true;
    }
}
