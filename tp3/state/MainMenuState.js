import { Game } from "../Game.js";
import { MAIN_MENU } from "../Layers.js";
import { PlayState } from "./PlayState.js";
import { MenuState } from "./MenuState.js";
import VehicleSelectionState from "./VehicleSelectionState.js";

export class MainMenuState extends MenuState {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game, game.contents.mainMenu, MAIN_MENU);
    }

    /**
     * @override
     *
     * @param {THREE.Object3D} object
     */
    onPick(object) {
        switch (object.name) {
            case "play_button":
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
