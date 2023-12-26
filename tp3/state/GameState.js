/// @ts-check

/**
 * @abstract
 */
export default class GameState {

    constructor(app) {
        this.app = app;
    }

    init() {
        throw new Error("Not implemented");
    }

    destroy() {
        throw new Error("Not implemented");
    }

    update(delta) {
        throw new Error("Not implemented");
    }
}
