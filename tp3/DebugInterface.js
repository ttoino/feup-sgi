import { GUI } from "lil-gui";
import { HELPERS } from "./Layers.js";
import { Game } from "./Game.js";

/**
    This class customizes the gui interface for the game
*/
export class DebugInterface {
    /**
     * @param {Game} game The application object
     */
    constructor(game) {
        this.game = game;
        this.gui = new GUI();
        this.contents = game.contents;
    }

    /**
     * Initialize the gui interface
     */
    init() {
        // CAMERAS /////////////////////////////////////////////////

        const cameraFolder = this.gui.addFolder("Camera");
        cameraFolder
            .add(this.game, "activeCameraName", Object.keys(this.game.cameras))
            .name("active camera");
        cameraFolder.open();

        // LIGHTS /////////////////////////////////////////////////

        this.gui
            .add({ showHelpers: false }, "showHelpers")
            .name("Show helpers")
            .onChange((value) => {
                if (value) this.game.activeCamera.layers.enable(HELPERS);
                else this.game.activeCamera.layers.disable(HELPERS);
            });
    }
}
