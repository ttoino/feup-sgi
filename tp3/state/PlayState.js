import { GameState } from "./GameState.js";
import { PauseState } from "./PauseState.js";
import { Kart } from "../Kart.js";
import { Game } from "../Game.js";

export class PlayState extends GameState {
    /**
     * @param {Game} game
     * @param {Kart} kart
     * @param {Kart} opponent
     */
    constructor(game, kart, opponent) {
        super(game);

        this.kart = kart;
        this.opponent = opponent;

        this.updaters.push(this.kart);
        this.updaters.push(this.opponent);
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
