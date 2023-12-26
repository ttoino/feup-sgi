/// @ts-check

import GameStateManager from "./GameStateManager.js";

import GameState from "./GameState.js";
import { MyApp } from "../MyApp.js";
import { Picker } from "../Picker.js";
import { PAUSE_MENU } from "../Layers.js";

/**
 * @abstract
 */
export default class PauseState extends GameState {
    /**
     * @param {MyApp} app
     * @param {GameStateManager} stateManager
     */
    constructor(app, stateManager, pauseMenu) {

        super(app, stateManager);

        this.pauseMenu = pauseMenu;

        this.picker = new Picker(app, PAUSE_MENU);
        this.picker.pickOnClick().then((object) => this.onPick(object));

    }

    destroy() {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        this.picker.finishPicking();
    }

    /**
     * @param {THREE.Object3D} object
     */
    onPick(object) {
        switch (object.name) {
            case "resume_button":
                this.stateManager.popState();
                break;
        }

        if (!this.picker.picking)
            this.picker.pickOnClick().then((object) => this.onPick(object));
    }

    init() {
        this.app.contents.followControls.target = this.pauseMenu;
    }
}
