import * as THREE from "three";
import { Game } from "../Game.js";
import Vehicle, { MAX_SPEED } from "./Vehicle.js";

export default class VehicleController {
    /**
     * @param {Game} game
     * @param {Vehicle} vehicle
     */
    constructor(game, vehicle) {
        this.game = game;
        this.vehicle = vehicle;

        this.trackTracker = new THREE.Raycaster(this.vehicle.position.clone(), new THREE.Vector3(0, -1, 0));
    }

    installPlayerControls() {
        document.addEventListener(
            "keydown",
            this.movementKeyDownController.bind(this)
        );
        document.addEventListener(
            "keyup",
            this.movementKeyUpController.bind(this)
        );
    }

    removePlayerControls() {
        document.removeEventListener(
            "keydown",
            this.movementKeyDownController.bind(this)
        );
        document.removeEventListener(
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
                this.vehicle.speedUp();
                break;
            case "ArrowDown":
            case "s":
            case "S":
                this.vehicle.speedDown();
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                this.vehicle.rotateLeft();
                break;
            case "ArrowRight":
            case "d":
            case "D":
                this.vehicle.rotateRight();
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
                this.vehicle.resetAcceleration();
                break;
            case "ArrowLeft":
            case "a":
            case "A":
            case "ArrowRight":
            case "d":
            case "D":
                this.vehicle.resetRotation();
                break;
        }
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.vehicle.update(delta);

        this.#checkOnTrack();
    }

    #checkOnTrack() {

        const position = new THREE.Vector3().copy(this.vehicle.position.clone());
        position.y = 1;

        this.trackTracker.set(position, new THREE.Vector3(0, -1, 0));

        const intersects = this.trackTracker.intersectObjects(this.game.contents.track.children);

        if (intersects.length <= 0) {
            // Out of track
            if (this.previousMaxSpeed === undefined) {
                this.vehicle.applyEffect((vehicle) => {
                    this.previousMaxSpeed = vehicle.maxSpeed;
                    vehicle.maxSpeed *= 0.7;
                })
            }

        } else {
            if (this.previousMaxSpeed !== undefined) {
                // this is to make the types happy
                const previousMaxSpeed = this.previousMaxSpeed;

                this.vehicle.applyEffect((vehicle) => {
                    vehicle.maxSpeed = previousMaxSpeed;
                })
                delete this.previousMaxSpeed;
            }
        }
    }
}
