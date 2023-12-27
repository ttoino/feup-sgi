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
        this.game.controls.target = this.kart;

        document.addEventListener("keydown", this.#onKeyDown.bind(this));
    }

    destroy() {
        document.removeEventListener("keydown", this.#onKeyDown.bind(this));
    }

    /**
     * @param {KeyboardEvent} event
     */
    #onKeyDown(event) {
        if (event.key === "p" || event.key === "P") {
            this.stateManager.pushState(new PauseState(this.game));
        }
    }
}
