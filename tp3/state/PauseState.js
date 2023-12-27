import { Game } from "../Game.js";
import { PAUSE_MENU } from "../Layers.js";
import { MenuState } from "./MenuState.js";
import { PlayState } from "./PlayState.js";

export class PauseState extends MenuState {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game, game.contents.pauseMenu, PAUSE_MENU);
    }

    /**
     * @param {THREE.Object3D} object
     */
    onPick(object) {
        switch (object.name) {
            case "resume_button":
                this.stateManager.popUntil(PlayState);
                break;
        }
    }
}
