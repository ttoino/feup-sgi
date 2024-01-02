import * as THREE from "three";
import { BloomPass } from "three/addons/postprocessing/BloomPass.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SAOPass } from "three/addons/postprocessing/SAOPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
import { SSAARenderPass } from "three/addons/postprocessing/SSAARenderPass.js";
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
import { SSRPass } from "three/addons/postprocessing/SSRPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { Game } from "../game/Game.js";

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

        this.ssaaRenderPass = new SSAARenderPass(
            this.game.scene,
            this.game.activeCamera
        );
        this.ssaaRenderPass.sampleLevel = 1;
        this.ssaaRenderPass.enabled = false;
        this.composer.addPass(this.ssaaRenderPass);

        this.smaaPass = new SMAAPass(
            window.innerWidth * this.renderer.getPixelRatio(),
            window.innerHeight * this.renderer.getPixelRatio()
        );
        this.smaaPass.enabled = false;
        this.composer.addPass(this.smaaPass);

        this.fxaaPass = new ShaderPass(FXAAShader);
        this.fxaaPass.enabled = false;
        this.composer.addPass(this.fxaaPass);

        this.saoPass = new SAOPass(
            this.game.scene,
            this.game.activeCamera,
            this.renderer.getSize(new THREE.Vector2())
        );
        this.saoPass.enabled = false;
        this.composer.addPass(this.saoPass);

        this.ssaoPass = new SSAOPass(
            this.game.scene,
            this.game.activeCamera,
            window.innerWidth * this.renderer.getPixelRatio(),
            window.innerHeight * this.renderer.getPixelRatio()
        );
        this.ssaoPass.enabled = false;
        this.composer.addPass(this.ssaoPass);

        this.gtaoPass = new GTAOPass(
            this.game.scene,
            this.game.activeCamera,
            window.innerWidth * this.renderer.getPixelRatio(),
            window.innerHeight * this.renderer.getPixelRatio()
        );
        this.gtaoPass.enabled = false;
        this.composer.addPass(this.gtaoPass);

        this.ssrPass = new SSRPass({
            renderer: this.renderer,
            scene: this.game.scene,
            camera: this.game.activeCamera,
            width: window.innerWidth * this.renderer.getPixelRatio(),
            height: window.innerHeight * this.renderer.getPixelRatio(),
            selects: null,
            groundReflector: this.game.contents.background.floor.reflector,
        });
        this.ssrPass.enabled = false;
        this.composer.addPass(this.ssrPass);

        this.outlinePass = new OutlinePass(
            this.renderer.getSize(new THREE.Vector2()),
            this.game.scene,
            this.game.activeCamera
        );
        this.composer.addPass(this.outlinePass);

        this.unrealBloomPass = new UnrealBloomPass(
            this.renderer.getSize(new THREE.Vector2()),
            0.25,
            0,
            1
        );
        this.composer.addPass(this.unrealBloomPass);

        this.bloomPass = new BloomPass(0.25, 0, 1);
        this.bloomPass.enabled = false;
        this.composer.addPass(this.bloomPass);

        this.filmPass = new FilmPass();
        this.composer.addPass(this.filmPass);

        this.outputPass = new OutputPass();
        this.composer.addPass(this.outputPass);
    }

    get antialiasing() {
        return this.ssaaRenderPass.enabled
            ? "ssaa"
            : this.smaaPass.enabled
                ? "smaa"
                : this.fxaaPass.enabled
                    ? "fxaa"
                    : "none";
    }

    set antialiasing(value) {
        switch (value) {
            case "none":
                this.renderPass.enabled = true;
                this.ssaaRenderPass.enabled = false;
                this.smaaPass.enabled = false;
                this.fxaaPass.enabled = false;
                break;
            case "ssaa":
                this.renderPass.enabled = false;
                this.ssaaRenderPass.enabled = true;
                this.smaaPass.enabled = false;
                this.fxaaPass.enabled = false;
                break;
            case "smaa":
                this.renderPass.enabled = true;
                this.ssaaRenderPass.enabled = false;
                this.smaaPass.enabled = true;
                this.fxaaPass.enabled = false;
                break;
            case "fxaa":
                this.renderPass.enabled = true;
                this.ssaaRenderPass.enabled = false;
                this.smaaPass.enabled = false;
                this.fxaaPass.enabled = true;
                break;
        }
    }

    get ambientOcclusion() {
        return this.saoPass.enabled
            ? "sao"
            : this.ssaoPass.enabled
                ? "ssao"
                : this.gtaoPass.enabled
                    ? "gtao"
                    : "none";
    }

    set ambientOcclusion(value) {
        switch (value) {
            case "none":
                this.saoPass.enabled = false;
                this.ssaoPass.enabled = false;
                this.gtaoPass.enabled = false;
                break;
            case "sao":
                this.saoPass.enabled = true;
                this.ssaoPass.enabled = false;
                this.gtaoPass.enabled = false;
                break;
            case "ssao":
                this.saoPass.enabled = false;
                this.ssaoPass.enabled = true;
                this.gtaoPass.enabled = false;
                break;
            case "gtao":
                this.saoPass.enabled = false;
                this.ssaoPass.enabled = false;
                this.gtaoPass.enabled = true;
                break;
        }
    }

    get bloom() {
        return this.unrealBloomPass.enabled
            ? "high"
            : this.bloomPass.enabled
                ? "low"
                : "none";
    }

    set bloom(value) {
        switch (value) {
            case "none":
                this.unrealBloomPass.enabled = false;
                this.bloomPass.enabled = false;
                break;
            case "low":
                this.unrealBloomPass.enabled = false;
                this.bloomPass.enabled = true;
                break;
            case "high":
                this.unrealBloomPass.enabled = true;
                this.bloomPass.enabled = false;
                break;
        }
    }

    updateCamera() {
        this.renderPass.camera = this.game.activeCamera;
        this.outlinePass.renderCamera = this.game.activeCamera;
        this.ssrPass.camera = this.game.activeCamera;
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
