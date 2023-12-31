import { Game } from "../Game.js";

/**
 * @abstract
 */
export class GameState {
    /**
     * @param {Game} game
     */
    constructor(game) {
        this.game = game;
        this.stateManager = game.stateManager;

        /** @type {{update(delta: number): unknown}[]} */
        this.updaters = [];

        /** @type {((delta: number) => boolean)[]} */
        this.stateEffects = []
    }

    init() { }

    destroy() { }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.updaters.forEach((updater) => updater?.update(delta));

        this.stateEffects = this.stateEffects.filter((effect) => !effect(delta))
    }

    /**
     * 
     * @param {() => void} handler 
     * @param {number} timeout 
     */
    setTimeout(handler, timeout) {
        let localTimeout = timeout;
        this.stateEffects.push((delta) => {

            localTimeout -= delta * 1000;
            if (localTimeout <= 0) {
                handler();
                return true;
            }

            return false;
        });
    }
}
