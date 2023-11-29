/// @ts-check

import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyApp } from "./MyApp.js";
import { MyBackground } from "./background/MyBackground.js";

/**
 *  This class contains the contents of out application
 */
class MyContents {
    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app;
        this.axis = null;

        this.showHelpers = true;
        /** @type {(THREE.SpotLightHelper|THREE.PointLightHelper|THREE.DirectionalLightHelper)[]} */
        this.helpers = [];

        this.background = new MyBackground(this.app);
        this.app.scene.add(this.background);
    }

    /**
     * initializes the contents
     */
    init() {
        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this.app);
            this.app.scene.add(this.axis);
        }
    }

    /**
     * Updates the helpers of the scene on user input (controlled through the GUI).
     */
    updateHelpers() {
        this.helpers.forEach((h) => (h.visible = this.showHelpers));
    }

    update() {}
}

export { MyContents };
