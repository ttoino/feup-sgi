import { Game } from "../Game.js";
import { MAIN_MENU } from "../Layers.js";
import { PlayState } from "./PlayState.js";
import { MenuState } from "./MenuState.js";

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
                    new PlayState(
                        this.game,
                        this.game.contents.kart,
                        this.game.contents.kart
                    )
                );
                return;
        }
    }
}
