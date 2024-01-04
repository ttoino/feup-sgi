import * as THREE from "three";
import { Game } from "../game/Game.js";
import Outdoor from "./Outdoor.js";
import { SceneOutdoorMaterial } from "./SceneOutdoorMaterial.js";

export class SceneOutdoor extends Outdoor {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game);

        this.time = 0;
        this.renderTarget = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight,
            {
                type: THREE.HalfFloatType,
                depthTexture: new THREE.DepthTexture(
                    window.innerWidth,
                    window.innerHeight
                ),
            }
        );
        this.renderTarget.texture.flipY = true;
        this.material = new SceneOutdoorMaterial();
        this.material.uniforms.cameraNear.value = this.game.activeCamera.near;
        this.material.uniforms.cameraFar.value = this.game.activeCamera.far;
    }

    onLoad() {
        if (
            this.screen instanceof THREE.Mesh &&
            this.screen.material instanceof THREE.MeshStandardMaterial
        ) {
            this.material.copy(this.screen.material);
            this.screen.material = this.material;
            this.material.emissiveMap = this.renderTarget.texture;
            this.material.displacementMap = this.renderTarget.depthTexture;
        }

        this.time = 50;
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.time += delta;

        if (this.time > 5) {
            this.time %= 5;

            this.game.renderer.renderPass.render(
                this.game.renderer.renderer,
                this.renderTarget,
                this.renderTarget,
                0,
                false
            );
        }
    }
}
