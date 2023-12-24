/// @ts-check

import GameState from "./GameState";

/**
 * @extends {GameState}
 */
export default class GameStateManager extends GameState {
    /**
     * @param {GameState} initial
     */
    constructor(initial) {
        super();

        /**
         * @private
         * @type {GameState[]}
         */
        this.stateStack = [initial];
    }

    get current() {
        return this.stateStack[this.stateStack.length - 1];
    }

    /**
     * @param {GameState} state
     */
    pushState(state) {
        this.stateStack.push(state);
    }

    popState() {
        if (this.stateStack.length > 1) this.stateStack.pop();
    }

    /**
     * @param {{new(): GameState}} type
     */
    popUntil(type) {
        while (!(this.current instanceof type) && this.stateStack.length > 1)
            this.popState();
    }

    popAll() {
        this.stateStack = [this.stateStack[0]];
    }
}
