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
    }
}
