import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { HELPERS } from "./Layers.js";
import { Game } from "../game/Game.js";

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

        // GRAPHICS ////////////////////////////////////////////////
        const graphicsFolder = this.gui.addFolder("Graphics");
        graphicsFolder
            .add(this.game.renderer, "antialiasing", {
                None: "none",
                "FXAA (Fast Approximate Antialiasing)": "fxaa",
                "SMAA (Subpixel Morphological Antialiasing)": "smaa",
                "SSAA (Supersampling Antialiasing)": "ssaa",
            })
            .name("Antialiasing")
            .onFinishChange((value) => ssaaStrength.enable(value === "ssaa"));
        const ssaaStrength = graphicsFolder
            .add(this.game.renderer.ssaaRenderPass, "sampleLevel", 1, 5, 1)
            .name("SSAA strength")
            .enable(this.game.renderer.antialiasing === "ssaa");
        graphicsFolder
            .add(this.game.renderer, "ambientOcclusion", {
                None: "none",
                "SAO (Scalable Ambient Occlusion)": "sao",
                "SSAO (Screen Space Ambient Occlusion)": "ssao",
                "GTAO (Ground Truth Ambient Occlusion)": "gtao",
            })
            .name("Ambient occlusion");
        graphicsFolder
            .add(this.game.renderer, "bloom", {
                None: "none",
                Low: "low",
                High: "high",
            })
            .name("Bloom quality");
        graphicsFolder
            .add(this.game.renderer.filmPass, "enabled")
            .name("Film noise");
        graphicsFolder
            .add(this.game.renderer.ssrPass, "enabled")
            .name("Screen space reflections");

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
            .name("Active camera")
            .onChange((value) => {
                this.game.activeCamera =
                    this.game.cameras[
                        /** @type {keyof typeof this.game.cameras} */ (value)
                    ];
            });
        cameraFolder.open();

        // MISC ////////////////////////////////////////////////////
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
