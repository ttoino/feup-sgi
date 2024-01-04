import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Renderer } from "../renderer/Renderer.js";
import { SceneContents } from "./SceneContents.js";
import { DebugInterface } from "../renderer/DebugInterface.js";
import { FollowControls } from "../renderer/FollowControls.js";
import { GameStateManager } from "../state/GameStateManager.js";
import { MainMenuState } from "../state/MainMenuState.js";
import { FontManager } from "../fonts/FontManager.js";
import { ModelManager } from "../models/ModelManager.js";
import { HELPERS } from "../renderer/Layers.js";
import GameInfo from "./GameInfo.js";
import { TextureManager } from "../textures/TextureManager.js";
import { FontSpriteSheetManager } from "../sprites/text/FontSpriteSheetManager.js";
import { Materials } from "../models/Materials.js";

export class Game {
    /**
     * the constructor
     */
    constructor() {
        // Handle loading screen
        THREE.DefaultLoadingManager.onLoad = () => {
            console.info("Loading complete!");

            const loadingScreen = document.querySelector("#loading");

            if (loadingScreen) loadingScreen.classList.add("loaded");

            this.contents.onLoaded();
        };

        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x101010);

        // Show fps
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        // Init cameras
        const aspect = window.innerWidth / window.innerHeight;

        const gameplayCamera = new THREE.PerspectiveCamera(
            75,
            aspect,
            0.1,
            1000
        );
        gameplayCamera.position.set(10, 10, 3);
        gameplayCamera.name = "gameplay";
        this.gameplayControls = new FollowControls(gameplayCamera, this.scene);

        const topCamera = new THREE.OrthographicCamera(
            -aspect * 10,
            aspect * 10,
            10,
            -10,
            0.1,
            1000
        );
        topCamera.position.set(0, 10, 0);
        topCamera.lookAt(0, 0, 0);
        topCamera.name = "top";

        const noclipCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        noclipCamera.position.set(0, 10, 10);
        noclipCamera.lookAt(0, 0, 0);
        noclipCamera.name = "noclip";

        this.cameras = {
            gameplay: gameplayCamera,
            top: topCamera,
            noclip: noclipCamera,
        };

        for (const camera of Object.values(this.cameras)) {
            const helper = new THREE.CameraHelper(camera);
            helper.layers.set(HELPERS);
            helper.traverse((child) => {
                child.layers.set(HELPERS);
            });
            this.scene.add(helper);
        }

        /** @type {THREE.Camera} */
        this._activeCamera = this.cameras.gameplay;
        this.activeCameraElement = document.querySelector("#camera");
        if (this.activeCameraElement)
            this.activeCameraElement.innerHTML = this.activeCamera.name;

        this.fontManager = new FontManager();
        this.modelManager = new ModelManager();
        this.textureManager = new TextureManager();
        this.fontSpriteSheetManager = new FontSpriteSheetManager();

        this.materials = new Materials(this);

        // Init contents
        this.contents = new SceneContents(this);

        // Init game info
        this.info = new GameInfo(this, "", null, null, 1, 0, 0, 0, null, null);

        // Init renderer
        this.renderer = new Renderer(this);

        // Init state manager
        this.stateManager = new GameStateManager();
        this.stateManager.pushState(new MainMenuState(this));

        // Initialize it here, as it needs the renderer
        this.noclipControls = new OrbitControls(
            noclipCamera,
            this.renderer.renderer.domElement
        );
        this.noclipControls.enableDamping = true;
        this.noclipControls.enabled = this.activeCamera == noclipCamera;

        // Init gui
        this.gui = new DebugInterface(this);

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
        this.renderer.updateCamera();
        this.onResize();

        if (this.activeCamera == this.cameras.noclip) {
            this.noclipControls.enabled = true;
        } else {
            this.noclipControls.enabled = false;
        }

        if (this.activeCameraElement)
            this.activeCameraElement.innerHTML = camera.name;
    }

    /**
     * the window resize handler
     */
    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (this.activeCamera instanceof THREE.PerspectiveCamera) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
        } else if (this.activeCamera instanceof THREE.OrthographicCamera) {
            const aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.left = -aspect * this.activeCamera.top;
            this.activeCamera.right = aspect * this.activeCamera.top;
            this.activeCamera.updateProjectionMatrix();
        }
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
        this.gameplayControls.update(delta);
        this.noclipControls.update(delta);

        this.contents.update(delta);

        this.renderer.render(delta);

        // subsequent async calls to the render loop
        requestAnimationFrame(this.update.bind(this));
    }
}
