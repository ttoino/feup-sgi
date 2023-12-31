import * as THREE from "three";
import { Game } from "../Game.js";
import { HELPERS } from "../Layers.js";

export const ACCEL = 5;
export const ANGULAR_ACCEL = 10;
export const MIN_SPEED = 0;
export const MAX_SPEED = 50;

export default class Vehicle extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.forwardSpeed = 0;
        this.rotationSpeedRadS = 0;
        this.rotationRad = 0;
        this.acceleration = 0;
        this.maxSpeed = MAX_SPEED;

        /** @type {THREE.Object3D | undefined} */
        this.center = undefined;

        /** @type {THREE.Object3D | undefined} */
        this.model = undefined;

        this.game = game;
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
        this.position.x +=
            this.forwardSpeed * Math.sin(this.rotation.y) * delta;
        this.position.z +=
            this.forwardSpeed * Math.cos(this.rotation.y) * delta;
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
