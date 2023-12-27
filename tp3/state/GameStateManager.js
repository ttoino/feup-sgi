/// @ts-check

import { GameState } from "./GameState.js";

/**
 * @extends {GameState}
 */
export class GameStateManager {
    constructor() {
        /**
         * @private
         * @type {GameState[]}
         */
        this.stateStack = [];
    }

    get current() {
        return this.stateStack[this.stateStack.length - 1];
    }

    /**
     * @param {GameState} state
     */
    pushState(state) {
        this.current?.destroy();
        this.stateStack.push(state);
        this.current?.init();
    }

    popState() {
        if (this.stateStack.length > 1) {
            this.current?.destroy();
            this.stateStack.pop();
            this.current?.init();
        }
    }

    /**
     * @param {{new(...params: any[]): GameState}} type
     */
    popUntil(type) {
        while (!(this.current instanceof type) && this.stateStack.length > 1)
            this.popState();
    }

    popAll() {
        this.stateStack = [this.stateStack[0]];
    }
}
