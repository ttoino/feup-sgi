import * as THREE from "three";
import { Game } from "../Game.js";
import { ALL_VEHICLES, HELPERS } from "../Layers.js";

export const ACCEL = 5;
export const ANGULAR_ACCEL = 10;
export const MIN_SPEED = 0;
export const MAX_SPEED = 50;

export default class Vehicle extends THREE.Object3D {
    /**
     * @param {Game} game
     * @param {string} model
     */
    constructor(game, model) {
        super();

        this.game = game;

        this.forwardSpeed = 0;
        this.rotationSpeedRadS = 0;
        this.rotationRad = 0;
        this.acceleration = 0;
        this.maxSpeed = MAX_SPEED;

        /** @type {THREE.Object3D | undefined} */
        this.center = undefined;

        /** @type {THREE.Object3D | undefined} */
        this.model = undefined;

        /** @type {THREE.Object3D[]} */
        this.steers = [];
        /** @type {THREE.Object3D[]} */
        this.wheels = [];

        this.game.modelManager.loadModel(`models/${model}.glb`, (gltf) => {
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
        });

        this.layers.enable(ALL_VEHICLES);

        this.directionHelper = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 1),
            ]),
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        this.directionHelper.layers.set(HELPERS);
        this.add(this.directionHelper);

        this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
            type: THREE.FloatType,
        });
        this.cubeCamera = new THREE.CubeCamera(
            0.1,
            1000,
            this.cubeRenderTarget
        );
        this.add(this.cubeCamera);
    }

    /**
     * Applies an effect to this vehicle.
     *
     * @param {(vehicle: this) => void} effect
     */
    applyEffect(effect) {
        effect(this);
    }

    /**
     *
     * @param {number} delta
     */
    update(delta) {
        this.forwardSpeed = Math.min(
            Math.max(this.forwardSpeed + this.acceleration * delta, MIN_SPEED),
            this.maxSpeed
        );

        this.rotation.y = THREE.MathUtils.lerp(
            this.rotation.y,
            this.rotation.y +
                this.rotationRad * delta * this.forwardSpeed * 0.1,
            Math.min(1, delta * 4)
        );

        // TODO: Max speed, maybe using drag
        this.position.addScaledVector(
            this.getWorldDirection(new THREE.Vector3()),
            this.forwardSpeed * delta
        );

        this.directionHelper.scale.z = this.forwardSpeed;

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

        this.visible = false;
        this.cubeCamera.update(this.game.renderer.renderer, this.game.scene);
        this.visible = true;
    }

    speedUp(amount = ACCEL) {
        this.acceleration = amount;
    }

    speedDown(amount = ACCEL) {
        this.acceleration = -amount;
    }

    resetAcceleration() {
        this.acceleration = 0;
    }

    rotateLeft(amount = ANGULAR_ACCEL) {
        this.rotationRad = amount;
    }

    rotateRight(amount = ANGULAR_ACCEL) {
        this.rotationRad = -amount;
    }

    resetRotation() {
        this.rotationRad = 0;
    }
}
