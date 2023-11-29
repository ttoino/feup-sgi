/// @ts-check

// @ts-expect-error
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MyApp } from "./MyApp.js";
import { MyContents } from "./MyContents.js";

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {
    /**
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
        // CAMERAS /////////////////////////////////////////////////

        const cameraFolder = this.datgui.addFolder("Camera");
        cameraFolder
            .add(this.app, "activeCameraName", Object.keys(this.app.cameras))
            .name("active camera");
        cameraFolder.open();

        // LIGHTS /////////////////////////////////////////////////

        const lightTypeMap = {};
        const lightFolder = this.datgui.addFolder("Lights");
        lightFolder
            .add(this.contents, "showHelpers")
            .name("Show helpers")
            .onChange((value) => {
                this.contents?.updateHelpers();
            });

        for (const helper of this.contents?.helpers ?? []) {
            const lightType = helper.type.replace("Helper", "");
            if (lightTypeMap[lightType] === undefined) {
                lightTypeMap[lightType] = 0;
            }
            lightTypeMap[lightType]++;

            const helperFolder = lightFolder.addFolder(
                `${lightType} ${lightTypeMap[lightType]}`
            );

            helperFolder.add(helper.light, "visible").name("Toggle light");

            helperFolder.addColor(helper.light, "color").name("Color");
        }
    }
}

export { MyGuiInterface };
