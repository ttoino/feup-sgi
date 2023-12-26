/// @ts-check

import GameStateManager from "./GameStateManager.js";

import GameState from "./GameState.js";
import { FollowControls } from "../FollowControls.js";

/**
 * @abstract
 */
export default class PlayState extends GameState {

    /**
     * 
     * @param {GameStateManager} stateManager 
     */
    constructor(app, stateManager) {
        super(app);

        this.stateManager = stateManager;

        this.updaters = [];
    }

    init() {
        document.addEventListener("keydown", this.#onKeyDown);
    }

    destroy() {
        document.removeEventListener("keydown", this.#onKeyDown);
    }

    #onKeyDown = (event) => {
        if (event.key === "p" || event.key === "P") {
            this.stateManager.popState();
        }
    }

    update(delta) {
        this.updaters.forEach((updater) => {
            updater?.update(delta);
        });
    }
}
