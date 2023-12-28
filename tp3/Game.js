/// <reference path="./types/three/addons/libs.d.ts"/>
/// <reference path="./types/three/addons/lights.d.ts"/>

import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { Renderer } from "./Renderer.js";
import { SceneContents } from "./SceneContents.js";
import { DebugInterface } from "./DebugInterface.js";
import { FollowControls } from "./FollowControls.js";
import { GameStateManager } from "./state/GameStateManager.js";
import { MainMenuState } from "./state/MainMenuState.js";
import { FontManager } from "./fonts/FontManager.js";
import { ModelManager } from "./models/ModelManager.js";

export class Game {
    /**
     * the constructor
     */
    constructor() {
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x101010);

        // Show fps
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        // Init cameras
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        perspective.position.set(10, 10, 3);

        this.cameras = {
            default: perspective,
        };

        this.activeCameraElement = document.querySelector("#camera");
        this._activeCamera = this.cameras.default;

        // Init controls
        this.controls = new FollowControls(this.activeCamera, this.scene);

        this.fontManager = new FontManager();
        this.modelManager = new ModelManager();

        // Init contents
        this.contents = new SceneContents(this);

        // Init state manager
        this.stateManager = new GameStateManager();
        this.stateManager.pushState(new MainMenuState(this));

        // Init gui
        this.gui = new DebugInterface(this);

        // Init renderer
        this.renderer = new Renderer(this);

        // manage window resizes
        window.addEventListener("resize", this.onResize.bind(this), false);

        // Needed for rect area lights
        RectAreaLightUniformsLib.init();
    }

    get activeCamera() {
        return this._activeCamera;
    }

    set activeCamera(camera) {
        this._activeCamera = camera;
        this.onResize();

        if (this.activeCameraElement)
            this.activeCameraElement.innerHTML = camera.name;
    }

    /**
     * the window resize handler
     */
    onResize() {
        this.activeCamera.aspect = window.innerWidth / window.innerHeight;
        this.activeCamera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * the main update function. Called in a requestAnimationFrame loop
     */
    update() {
        this.stats.update();

        const deltaMs = this.timestamp ? Date.now() - this.timestamp : 16;
        this.timestamp = Date.now();
        const delta = deltaMs / 1000;

        this.stateManager.current?.update(delta);
        this.controls.update(delta);

        this.renderer.render(delta);

        // subsequent async calls to the render loop
        requestAnimationFrame(this.update.bind(this));
    }
}
