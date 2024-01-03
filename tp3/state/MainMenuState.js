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

        /** @type {number | null} */
        this.difficulty = null;
        /** @type {THREE.Object3D | null} */
        this.highlightedDifficultyButton = null;
    }

    init() {
        super.init();

        this.initialTarget = new THREE.Vector3(Math.PI, this.game.gameplayControls.targetDistance, this.game.gameplayControls.targetHeight);

        this.game.gameplayControls.targetRotation = 0;
        this.game.gameplayControls.targetDistance = 30;

        document.addEventListener(
            "keydown",
            this.boundKeyDownController
        );

        this.game.renderer.gameOutlinePass.selectedObjects = [];

        this.lookerInterval = setInterval(() => {
            if (this.menuObject instanceof MainMenu) {
                this.menuObject.authors?.lookAt(this.game.activeCamera.position);
            }
        }, 10)
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

        this.game.renderer.gameOutlinePass.selectedObjects = [];

        clearInterval(this.lookerInterval);
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

                if (this.name.length === 0 || !this.difficulty) return;

                this.game.info.playerName = this.name;
                this.game.info.difficulty = this.difficulty;

                this.stateManager.pushState(
                    new VehicleSelectionState(this.game),
                );
                return;
            case "exit_button":
                window.close();
                return;
            case "easy_button":
                this.difficulty = 1;
                this.highlightedDifficultyButton = object;
                break;
            case "hard_button":
                this.difficulty = 2;
                this.highlightedDifficultyButton = object;
                break;
        }

        if (this.highlightedDifficultyButton) {
            this.game.renderer.gameOutlinePass.selectedObjects.splice(this.game.renderer.gameOutlinePass.selectedObjects.indexOf(this.highlightedDifficultyButton), 1)

            this.game.renderer.gameOutlinePass.selectedObjects.push(this.highlightedDifficultyButton);
        }
    }
}
