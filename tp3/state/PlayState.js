/// @ts-check

import GameStateManager from "./GameStateManager.js";

import GameState from "./GameState.js";
import PauseState from "./PauseState.js";
import { Kart } from "../Kart.js";
import { MyApp } from "../MyApp.js";

/**
 * @abstract
 */
export default class PlayState extends GameState {
    /**
     * @param {MyApp} app
     * @param {GameStateManager} stateManager
     * @param {Kart} kart
     * @param {Kart} opponent
     */
    constructor(app, stateManager, kart, opponent) {
        super(app, stateManager);

        this.kart = kart;
        this.opponent = opponent;

        this.updaters.push(this.kart);
        this.updaters.push(this.opponent);
    }

    init() {
        this.app.contents.followControls.target = this.kart;

        document.addEventListener("keydown", this.#onKeyDown);
    }

    destroy() {
        document.removeEventListener("keydown", this.#onKeyDown);
    }

    #onKeyDown = (event) => {
        if (event.key === "p" || event.key === "P") {
            this.stateManager.pushState(
                new PauseState(this.app, this.stateManager, this.app.contents.pauseMenu)
            );
        }
    };
}
