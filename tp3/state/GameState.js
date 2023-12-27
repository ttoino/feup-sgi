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
    }

    init() { }

    destroy() { }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.updaters.forEach((updater) => updater?.update(delta));
    }
}
