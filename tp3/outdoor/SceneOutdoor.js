import * as THREE from "three";
import { Game } from "../game/Game.js";
import { SceneOutdoorMaterial } from "./SceneOutdoorMaterial.js";

export class SceneOutdoor extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.game = game;

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

        game.modelManager.load("models/scene_outdoor.glb").then((gltf) => {
            const model = gltf.clone();

            this.add(model);

            model.traverse((child) => {
                if (child.name.includes("screen")) {
                    this.screen = child;

                    if (!(this.screen instanceof THREE.Mesh)) return;

                    this.material.copy(this.screen.material);
                    this.screen.material = this.material;
                    this.material.emissiveMap = this.renderTarget.texture;
                    this.material.displacementMap =
                        this.renderTarget.depthTexture;
                }
            });
        });
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
