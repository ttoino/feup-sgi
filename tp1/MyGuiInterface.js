import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MyApp } from "./MyApp.js";
import { MyContents } from "./MyContents.js";
import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {
    /**
     *
     * @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app;
        this.datgui = new GUI();
        this.contents = null;
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * Initialize the gui interface
     */
    init() {
        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder("Camera");
        cameraFolder
            .add(this.app, "activeCameraName", Object.keys(this.app.cameras))
            .name("active camera");
        cameraFolder.open();

        const shadowFolder = this.datgui.addFolder("Shadows");
        shadowFolder
            .add(this.contents, "shadowMapSize", 0, 2048, 512)
            .name("Map size")
            .onChange((value) => {
                this.contents.updateLights();
            });

        const lightFolder = this.datgui.addFolder("Lights");
        lightFolder
            .add(this.contents, "helpersVisible")
            .name("Show helpers")
            .onChange((value) => {
                this.contents.updateHelpers();
            });
    }
}

export { MyGuiInterface };
