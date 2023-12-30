import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { Game } from "./Game.js";

export class Renderer {
    /**
     * @param {Game} game
     */
    constructor(game) {
        this.game = game;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor("#000000");
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

        // Append Renderer to DOM
        document
            .getElementById("canvas")
            ?.appendChild(this.renderer.domElement);

        this.composer = new EffectComposer(this.renderer);

        this.renderPass = new RenderPass(
            this.game.scene,
            this.game.activeCamera
        );
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
            this.game.scene,
            this.game.activeCamera
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
        this.composer.addPass(this.outputPass);
    }

    updateCamera() {
        this.renderPass.camera = this.game.activeCamera;
        this.outlinePass.renderCamera = this.game.activeCamera;
    }

    /**
     * @param {number} width
     * @param {number} height
     */
    setSize(width, height) {
        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
    }

    /**
     * @param {number} delta
     */
    render(delta) {
        this.composer.render(delta);
    }
}
