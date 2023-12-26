/// @ts-check

/**
 * @abstract
 */
export default class GameState {

    constructor(app) {
        this.app = app;
    }

    update(delta) {
        throw new Error("Not implemented");
    }
}
