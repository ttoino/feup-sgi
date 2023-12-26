/// @ts-check

import GameStateManager from "./GameStateManager.js";

import GameState from "./GameState.js";

/**
 * @abstract
 */
export default class PlayState extends GameState {

    /**
     * 
     * @param {GameStateManager} stateManager 
     */
    constructor(app, stateManager, mainMenu) {
        super(app);

        this.stateManager = stateManager;

        this.updaters = [];

        this.mainMenu = mainMenu;
    }

    init() {
        document.addEventListener("mouseenter", this.#onKeyDown);
    }

    destroy() {
        document.removeEventListener("mouseenter", this.#onKeyDown);
    }

    #onKeyDown = (event) => {
        console.log(event);
    }

    update(delta) {
        this.updaters.forEach((updater) => {
            updater?.update(delta);
        });
    }
}
