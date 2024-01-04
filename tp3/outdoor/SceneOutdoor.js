import * as THREE from "three";
import { Game } from "../game/Game.js";
import Outdoor from "./Outdoor.js";

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
        this.material = new THREE.MeshStandardMaterial({
            map: this.renderTarget.texture,
        });
    }

    onLoad() {
        if (
            this.screen instanceof THREE.Mesh &&
            this.screen.material instanceof THREE.MeshStandardMaterial
        ) {
            this.material = this.screen.material;
            // this.material.emissiveMap = this.renderTarget.texture;
            // this.material.displacementMap = this.renderTarget.depthTexture;
            this.material.emissiveIntensity = 0;
            this.material.color.set("#ffffff");
            this.material.map = this.renderTarget.depthTexture;
        }

        this.time = 50;
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.time += delta;

        if (this.time > 60) {
            this.time %= 60;

            this.game.renderer.renderPass.render(
                this.game.renderer.renderer,
                this.renderTarget,
                this.renderTarget,
                0,
                false
            );

            console.log(this.material);
        }
    }
}
