import { GameState } from "./GameState.js";
import { PauseState } from "./PauseState.js";
import { Game } from "../game/Game.js";
import Vehicle from "../vehicles/Vehicle.js";
import PlayerController from "../controller/PlayerController.js";
import OpponentController from "../controller/OpponentController.js";

export class PlayState extends GameState {
    /**
     * @param {Game} game
     * @param {PlayerController} playerController
     * @param {OpponentController} opponentController
     */
    constructor(game, playerController, opponentController) {
        super(game);

        this.playerController = playerController;
        this.opponentController = opponentController;

        this.updaters.push(...this.game.contents.powerups);
        this.updaters.push(...this.game.contents.obstacles);

        this.boundOnKeyDown = this.#onKeyDown.bind(this);
        this.boundOnKeyUp = this.#onKeyUp.bind(this);
    }

    /**
     * 
     * @param {number} delta 
     */
    update(delta) {
        super.update(delta);

        // The order in which this state's updaters are first updated matters,
        // so just explicitly update the controllers last here.

        this.opponentController.update(delta);
        this.playerController.update(delta);
    }

    init() {
        this.game.gameplayControls.target =
            this.playerController.vehicle.center ??
            this.playerController.vehicle;
        this.game.gameplayControls.targetRotation = Math.PI;

        this.playerController.install();

        document.addEventListener("keydown", this.boundOnKeyDown);
        document.addEventListener("keyup", this.boundOnKeyUp);
    }

    destroy() {
        this.playerController.remove();

        document.removeEventListener("keydown", this.boundOnKeyDown);
        document.removeEventListener("keyup", this.boundOnKeyUp);
    }

    /**
     * @param {KeyboardEvent} event
     */
    #onKeyDown(event) {
        if (event.key === "p" || event.key === "P") {
            this.stateManager.pushState(new PauseState(this.game));
        } else if (event.key === "Shift") {
            this.game.gameplayControls.targetRotation = 0;
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    #onKeyUp(event) {
        if (event.key === "Shift") {
            this.game.gameplayControls.targetRotation = Math.PI;
        }
    }
}
