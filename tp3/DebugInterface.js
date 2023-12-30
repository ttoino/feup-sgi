import { GUI } from "three/addons/libs/lil-gui.module.min.js";
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
            .add(
                {
                    activeCamera: this.game.activeCamera.name,
                },
                "activeCamera",
                Object.keys(this.game.cameras)
            )
            .name("active camera")
            .onChange((value) => {
                this.game.activeCamera =
                    this.game.cameras[
                        /** @type {keyof typeof this.game.cameras} */ (value)
                    ];
            });
        cameraFolder.open();

        // LIGHTS /////////////////////////////////////////////////

        this.gui
            .add({ showHelpers: false }, "showHelpers")
            .name("Show helpers")
            .onChange((value) => {
                for (const camera of Object.values(this.game.cameras)) {
                    camera.layers.toggle(HELPERS);
                }
            });
    }
}
