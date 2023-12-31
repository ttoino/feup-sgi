import { GameState } from "./GameState.js";
import { PauseState } from "./PauseState.js";
import { Game } from "../Game.js";
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

        // Unfortunately, due to the way I coded this, the order in which these objects are added matters:
        // if we place the player last, everything else will hopefully have already updated at least once
        // and the player will be able to collide with them correctly.

        this.updaters.push(...this.game.contents.powerups);
        this.updaters.push(...this.game.contents.obstacles);

        this.updaters.push(this.opponentController);
        this.updaters.push(this.playerController);
    }

    init() {
        this.game.gameplayControls.target =
            this.playerController.vehicle.center ??
            this.playerController.vehicle;
        this.game.gameplayControls.targetRotation = Math.PI;

        this.playerController.install();

        document.addEventListener("keydown", this.#onKeyDown.bind(this));
        document.addEventListener("keyup", this.#onKeyUp.bind(this));
    }

    destroy() {
        this.playerController.remove();

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
