import { GameState } from "./GameState.js";
import { PauseState } from "./PauseState.js";
import { Game } from "../Game.js";
import Powerup from "../powerup/Powerup.js";
import Vehicle from "../vehicles/Vehicle.js";
import VehicleController from "../vehicles/VehicleControler.js";

export class PlayState extends GameState {
    /**
     * @param {Game} game
     * @param {VehicleController} playerController
     * @param {Vehicle} opponent
     * @param {Powerup[]} powerups
     */
    constructor(game, playerController, opponent, powerups) {
        super(game);

        this.playerController = playerController;
        this.opponent = opponent;
        this.powerups = powerups ?? [];

        this.updaters.push(this.playerController);
        this.updaters.push(this.opponent);

        this.updaters.push(...this.powerups);
    }

    init() {
        this.game.controls.target = this.playerController.vehicle.center ?? this.playerController.vehicle;
        this.game.controls.targetRotation = Math.PI;

        this.playerController.installPlayerControls()

        document.addEventListener("keydown", this.#onKeyDown.bind(this));
        document.addEventListener("keyup", this.#onKeyUp.bind(this));
    }

    destroy() {
        this.playerController.removePlayerControls();

        document.removeEventListener("keydown", this.#onKeyDown.bind(this));
        document.removeEventListener("keyup", this.#onKeyUp.bind(this));
    }

    /**
     * @param {KeyboardEvent} event
     */
    #onKeyDown(event) {
        if (event.key === "p" || event.key === "P") {
            this.stateManager.pushState(new PauseState(this.game));
        } else if (event.key === "Shift") {
            this.game.controls.targetRotation = 0;
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    #onKeyUp(event) {
        if (event.key === "Shift") {
            this.game.controls.targetRotation = Math.PI;
        }
    }
}
