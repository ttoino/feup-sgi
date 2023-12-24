/// @ts-check

// @ts-expect-error
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MyApp } from "./MyApp.js";
import { MyContents } from "./MyContents.js";
import { HELPERS } from "./Layers.js";

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {
    /**
     * @param {MyApp} app The application object
     * @param {MyContents} contents the contents objects
     */
    constructor(app, contents) {
        this.app = app;
        this.datgui = new GUI();
        this.contents = contents;
    }

    /**
     * Initialize the gui interface
     */
    init() {
        // CAMERAS /////////////////////////////////////////////////

        const cameraFolder = this.datgui.addFolder("Camera");
        cameraFolder
            .add(this.app, "activeCameraName", Object.keys(this.app.cameras))
            .name("active camera");
        cameraFolder.open();

        // LIGHTS /////////////////////////////////////////////////

        this.datgui
            .add({ showHelpers: false }, "showHelpers")
            .name("Show helpers")
            .onChange((value) => {
                if (value) this.app.activeCamera.layers.enable(HELPERS);
                else this.app.activeCamera.layers.disable(HELPERS);
            });
    }
}

export { MyGuiInterface };
