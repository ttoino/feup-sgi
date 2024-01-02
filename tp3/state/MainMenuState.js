import * as THREE from "three";
import { Game } from "../game/Game.js";
import { MAIN_MENU } from "../renderer/Layers.js";
import { MenuState } from "./MenuState.js";
import VehicleSelectionState from "./VehicleSelectionState.js";
import { MainMenu } from "../menu/MainMenu.js";

export class MainMenuState extends MenuState {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game, game.contents.mainMenu, MAIN_MENU);

        this.boundKeyDownController = this.#onKeyDown.bind(this);

        this.name = "";
        this.difficulty = "easy";
    }

    init() {
        super.init();

        this.initialTarget = new THREE.Vector3(Math.PI, this.game.gameplayControls.targetDistance, this.game.gameplayControls.targetHeight);

        this.game.gameplayControls.targetRotation = 0;
        this.game.gameplayControls.targetDistance = 20;

        document.addEventListener(
            "keydown",
            this.boundKeyDownController
        );
    }

    destroy() {

        super.destroy();

        if (this.initialTarget) {
            this.game.gameplayControls.targetRotation = this.initialTarget.x;
            this.game.gameplayControls.targetDistance = this.initialTarget.y;
            this.game.gameplayControls.targetHeight = this.initialTarget.z;
        }

        document.removeEventListener(
            "keydown",
            this.boundKeyDownController
        );
    }

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    #onKeyDown(e) {

        switch (e.key) {
            case "Backspace": {
                this.name = this.name.slice(0, -1)
                break;
            }
            default: {
                if (e.key.length > 1 || this.name.length >= 3) return;

                this.name += e.key

                break
            }
        }

        if (this.menuObject instanceof MainMenu) {
            // it should be but types

            this.menuObject.updateNameValue(this.name)
        }
    }

    /**
     * @override
     *
     * @param {THREE.Object3D} object
     */
    onPick(object) {
        switch (object.name) {
            case "play_button":

                this.game.info.playerName = this.name;
                this.game.info.difficulty = this.difficulty;

                this.stateManager.pushState(
                    new VehicleSelectionState(this.game),
                );
                return;
            case "exit_button":
                window.close();
                return;
        }
    }
}
