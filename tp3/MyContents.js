/// @ts-check

import * as THREE from "three";
import { MyApp } from "./MyApp.js";
import { MyBackground } from "./background/MyBackground.js";
import { Kart } from "./Kart.js";
import { Picker } from "./Picker.js";
import { ALL_VEHICLES, HELPERS } from "./Layers.js";
import { FollowControls } from "./FollowControls.js";

/**
 *  This class contains the contents of out application
 */
export class MyContents {
    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app;

        this.axis = new THREE.AxesHelper();
        this.axis.layers.set(HELPERS);
        this.app.scene.add(this.axis);

        this.showHelpers = true;
        /** @type {(THREE.SpotLightHelper|THREE.PointLightHelper|THREE.DirectionalLightHelper)[]} */
        this.helpers = [];

        /** @type {{update(delta: number): unknown}[]} */
        this.updaters = [];

        this.ambient = new THREE.AmbientLight(0xffffff);
        this.app.scene.add(this.ambient);

        this.background = new MyBackground(this.app);
        this.app.scene.add(this.background);

        this.kart = new Kart(this.app);
        this.app.scene.add(this.kart);

        this.updaters.push(this.kart);

        this.timestamp = null;

        this.vehiclePicker = new Picker(app, ALL_VEHICLES);
        this.vehiclePicker.startPicking();

        this.controls = new FollowControls(this.app.activeCamera, this.kart, {
            targetRotation: Math.PI,
        });
        this.updaters.push(this.controls);
    }

    /**
     * initializes the contents
     */
    init() {
        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new THREE.AxesHelper();
            this.app.scene.add(this.axis);
        }
    }

    /**
     * Updates the helpers of the scene on user input (controlled through the GUI).
     */
    updateHelpers() {
        this.helpers.forEach((h) => (h.visible = this.showHelpers));
    }

    update() {
        if (this.timestamp === null) {
            this.timestamp = performance.now();
            return;
        }

        const deltaMs = performance.now() - this.timestamp;
        const deltaS = deltaMs / 1000;

        for (const updater of this.updaters) {
            updater.update?.(deltaS);
        }

        this.timestamp = performance.now();
    }
}
