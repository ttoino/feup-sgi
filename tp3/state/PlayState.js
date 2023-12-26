/// @ts-check

import GameStateManager from "./GameStateManager.js";

import GameState from "./GameState.js";
import PauseState from "./PauseState.js";
import { FollowControls } from "../FollowControls.js";

/**
 * @abstract
 */
export default class PlayState extends GameState {

    /**
     * 
     * @param {GameStateManager} stateManager 
     * @param {*} kart 
     * @param {*} opponent 
     */
    constructor(app, stateManager, kart, opponent) {
        super(app);

        this.stateManager = stateManager;

        this.kart = kart;
        this.opponent = opponent;

        this.updaters = [];
    }

    init() {

        document.addEventListener("keydown", this.#onKeyDown);
    }

    destroy() {

        this.updaters.length = 0;

        document.removeEventListener("keydown", this.#onKeyDown);
    }

    #onKeyDown = (event) => {
        if (event.key === "p" || event.key === "P") {
            this.stateManager.pushState(new PauseState(this.app, this.stateManager));
        }
    }

    update(delta) {
        this.kart?.update(delta);
        this.opponent?.update(delta);

        this.updaters.forEach((updater) => {
            updater?.update(delta);
        });
    }
}
