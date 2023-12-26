/// @ts-check

import GameStateManager from "./GameStateManager.js";

import GameState from "./GameState.js";
import { MyApp } from "../MyApp.js";
import { MainMenu } from "../menu/MainMenu.js";
import { Picker } from "../Picker.js";
import { MAIN_MENU } from "../Layers.js";
import PlayState from "./PlayState.js";

/**
 * @abstract
 */
export default class MainMenuState extends GameState {
    /**
     * @param {MyApp} app
     * @param {GameStateManager} stateManager
     * @param {MainMenu} mainMenu
     */
    constructor(app, stateManager, mainMenu) {
        super(app, stateManager);

        this.mainMenu = mainMenu;

        this.picker = new Picker(app, MAIN_MENU);
        this.picker.pickOnClick().then((object) => this.onPick(object));
    }

    destroy() {
        this.picker.finishPicking();
    }

    /**
     * @param {THREE.Object3D} object
     */
    onPick(object) {
        switch (object.name) {
            case "play_button":
                this.stateManager.pushState(
                    new PlayState(
                        this.app,
                        this.stateManager,
                        this.app.contents.kart,
                        this.app.contents.kart
                    )
                );
                break;
        }

        if (!this.picker.picking)
            this.picker.pickOnClick().then((object) => this.onPick(object));
    }
}
