/// @ts-check

import * as THREE from "three";
// @ts-expect-error
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MyContents } from "./MyContents.js";
import { MyGuiInterface } from "./MyGuiInterface.js";
// @ts-expect-error
import Stats from "three/addons/libs/stats.module.js";
// @ts-expect-error
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
// @ts-expect-error
import { SSAARenderPass as RenderPass } from "three/addons/postprocessing/SSAARenderPass.js";
// @ts-expect-error
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
// @ts-expect-error
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
// @ts-expect-error
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
// @ts-expect-error
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
// @ts-expect-error
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

/**
 * This class contains the application object
 */
class MyApp {
    /**
     * the constructor
     */
    constructor() {
        /** @type {THREE.Scene} */
        this.scene = null;
        this.stats = null;

        // camera related attributes
        /** @type {THREE.PerspectiveCamera | THREE.OrthographicCamera} */
        this.activeCamera = null;
        /** @type {string} */
        this.activeCameraName = null;
        /** @type {string} */
        this.lastCameraName = null;
        /** @type {Record<string, THREE.PerspectiveCamera | THREE.OrthographicCamera>} */
        this.cameras = {};
        /** @type {number} */
        this.frustumSize = 20;

        // other attributes
        /** @type {THREE.WebGLRenderer} */
        this.renderer = null;
        this.controls = null;
        this.gui = null;
        this.axis = null;
        /** @type {MyContents} */
        this.contents = null;
    }
    /**
     * initializes the application
     */
    init() {
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x101010);

        this.stats = new Stats();
        this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);

        this.initCameras();
        this.setActiveCamera("Perspective");

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor("#000000");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Configure renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Append Renderer to DOM
        document
            .getElementById("canvas")
            ?.appendChild(this.renderer.domElement);

        // manage window resizes
        window.addEventListener("resize", this.onResize.bind(this), false);

        // add effect composer
        this.composer = new EffectComposer(this.renderer);

        this.renderPass = new RenderPass(this.scene, this.activeCamera);
        this.composer.addPass(this.renderPass);

        // this.bokehPass = new BokehPass(this.scene, this.activeCamera, {
        //     focus: 200,
        //     aperture: 0.025,
        //     maxblur: 0.01,
        // });
        // this.composer.addPass(this.bokehPass);

        // this.dotScreenPass = new DotScreenPass();
        // this.composer.addPass(this.dotScreenPass);

        this.outlinePass = new OutlinePass(
            this.renderer.getSize(new THREE.Vector2()),
            this.scene,
            this.activeCamera
        );
        this.composer.addPass(this.outlinePass);

        this.bloomPass = new UnrealBloomPass(
            this.renderer.getSize(new THREE.Vector2()),
            0.25,
            0,
            1
        );
        this.composer.addPass(this.bloomPass);

        this.filmPass = new FilmPass();
        this.composer.addPass(this.filmPass);

        this.outputPass = new OutputPass();
        this.outputPass.toneMapping = THREE.ACESFilmicToneMapping;
        this.composer.addPass(this.outputPass);
    }

    /**
     * initializes all the cameras
     */
    initCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        perspective.position.set(10, 10, 3);
        this.cameras["Perspective"] = perspective;
    }

    /**
     * sets the active camera by name
     * @param {String} cameraName
     */
    setActiveCamera(cameraName) {
        this.activeCameraName = cameraName;
        this.activeCamera = this.cameras[this.activeCameraName];
        if (this.renderPass) this.renderPass.camera = this.activeCamera;
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {
        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName];
            document.getElementById("camera").innerHTML = this.activeCameraName;

            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize();

            // are the controls yet?
            // if (this.controls === null) {
            //     // Orbit controls allow the camera to orbit around a target.
            //     this.controls = new OrbitControls(
            //         this.activeCamera,
            //         this.renderer.domElement
            //     );
            //     this.controls.enableZoom = true;
            //     this.controls.update();
            // } else {
            //     this.controls.object = this.activeCamera;
            // }
        }
    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    /**
     *
     * @param {MyContents} contents the contents object
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * @param {MyGuiInterface} gui the gui interface object
     */
    setGui(gui) {
        this.gui = gui;
    }

    /**
     * the main render function. Called in a requestAnimationFrame loop
     */
    render() {
        this.stats.begin();
        this.updateCameraIfRequired();

        // update the animation if contents were provided
        this.contents.update();

        // required if controls.enableDamping or controls.autoRotate are set to true
        this.controls?.update();

        // render the scene
        this.composer.render();

        // subsequent async calls to the render loop
        requestAnimationFrame(this.render.bind(this));

        this.lastCameraName = this.activeCameraName;
        this.stats.end();
    }
}

export { MyApp };
