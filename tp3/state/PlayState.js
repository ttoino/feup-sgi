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
     * @param {*} kart 
     * @param {*} opponent 
     */
    constructor(app, stateManager, kart, opponent) {
        super(app);

        this.stateManager = stateManager;

        this.kart = kart;
        this.opponent = opponent;


        this.updaters = [];
    }

    init() {
        if (this.kart) {
            this.app.scene.add(this.kart);

            const controls = new FollowControls(this.app.activeCamera, this.kart, {
                targetRotation: Math.PI,
            });

            this.updaters.push(controls);
        }

        if (this.opponent) {
            this.app.scene.add(this.opponent);
        }

        document.addEventListener("keydown", this.#onKeyDown);
    }

    destroy() {

        if (this.kart) {
            this.app.scene.remove(this.kart);
        }

        if (this.opponent) {
            this.app.scene.remove(this.opponent);
        }

        this.updaters.length = 0;

        document.removeEventListener("keydown", this.#onKeyDown);
    }

    #onKeyDown = (event) => {
        if (event.key === "p" || event.key === "P") {

            console.log("Pause");

            this.paused ??= false;
            this.paused = !this.paused;

            // this.stateManager.pushState(new PauseState());
        }
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    update(delta) {
        if (!this.paused) {
            this.kart?.update(delta);
            this.opponent?.update(delta);

            this.updaters.forEach((updater) => {
                updater?.update(delta);
            });
        }
    }
}
