/// @ts-check

import GameStateManager from "./GameStateManager.js";

import GameState from "./GameState.js";
import { MyApp } from "../MyApp.js";

/**
 * @abstract
 */
export default class PauseState extends GameState {
    /**
     * @param {MyApp} app
     * @param {GameStateManager} stateManager
     */
    constructor(app, stateManager) {
        super(app, stateManager);
    }
}
