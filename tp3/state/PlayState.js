import { GameState } from "./GameState.js";
import { PauseState } from "./PauseState.js";
import { Kart } from "../Kart.js";
import { Game } from "../Game.js";
import Powerup from "../powerup/Powerup.js";

export class PlayState extends GameState {
    /**
     * @param {Game} game
     * @param {Kart} kart
     * @param {Kart} opponent
     * @param {Powerup[]} powerups
     */
    constructor(game, kart, opponent, powerups) {
        super(game);

        this.kart = kart;
        this.opponent = opponent;
        this.powerups = powerups ?? [];

        this.updaters.push(this.kart);
        this.updaters.push(this.opponent);

        this.updaters.push(...this.powerups);
    }

    init() {
        this.game.controls.target = this.kart.center ?? this.kart;
        this.game.controls.targetRotation = Math.PI;

        document.addEventListener("keydown", this.#onKeyDown.bind(this));
        document.addEventListener("keyup", this.#onKeyUp.bind(this));
    }

    destroy() {

        console.log("destroying play state");

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
