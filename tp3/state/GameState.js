/// @ts-check

import { MyApp } from "../MyApp.js";
import { GameStateManager } from "./GameStateManager.js";

/**
 * @abstract
 */
export class GameState {
    /**
     * @param {MyApp} app
     * @param {GameStateManager} stateManager
     */
    constructor(app, stateManager) {
        this.app = app;
        this.stateManager = stateManager;

        /** @type {{update(delta: number): unknown}[]} */
        this.updaters = [];
    }

    init() {}

    destroy() {}

    /**
     * @param {number} delta
     */
    update(delta) {
        this.updaters.forEach((updater) => updater?.update(delta));
    }
}
