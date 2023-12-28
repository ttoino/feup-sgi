import * as THREE from 'three';
import { Game } from '../Game.js';

const ACCEL = 5;
const MIN_SPEED = 0;
const MAX_SPEED = 20;

export default class Vehicle extends THREE.Object3D {

    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super()

        this.forwardSpeed = 0;
        this.rotationSpeedRadS = 0;
        this.rotationRad = 0;
        this.acceleration = 0;
        this.maxSpeed = MAX_SPEED;

        /** @type {THREE.Object3D | undefined} */
        this.center = undefined;

        this.game = game
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
            this.rotation.y + this.rotationRad * delta * this.forwardSpeed * .1,
            Math.min(1, delta * 4)
        );

        // TODO: Max speed, maybe using drag
        this.position.x +=
            this.forwardSpeed * Math.sin(this.rotation.y) * delta;
        this.position.z +=
            this.forwardSpeed * Math.cos(this.rotation.y) * delta;
    }

    speedUp() {
        this.acceleration = ACCEL;
    }

    speedDown() {
        this.acceleration = -ACCEL;
    }

    resetAcceleration() {
        this.acceleration = 0;
    }

    rotateLeft() {
        this.rotationRad = 1;
    }

    rotateRight() {
        this.rotationRad = -1;
    }

    resetRotation() {
        this.rotationRad = 0;
    }
}