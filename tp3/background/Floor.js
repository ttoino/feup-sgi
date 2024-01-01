import * as THREE from "three";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { FloorMaterial } from "./FloorMaterial.js";
import { Game } from "../Game.js";
import { HELPERS } from "../Layers.js";
import { ReflectorForSSRPass } from "three/addons/objects/ReflectorForSSRPass.js";

const size = 1000;
const divisions = 100;

export class Floor extends THREE.Mesh {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.geometry = new THREE.PlaneGeometry(
            size,
            size,
            divisions,
            divisions
        );

        this.material = new FloorMaterial({
            divisions,
        });
        this.rotation.x = -Math.PI / 2;

        this.light = new THREE.RectAreaLight(0xffffff, 0.3, size, size);
        this.light.rotateY(Math.PI);
        this.add(this.light);

        // const helper = new RectAreaLightHelper(this.light);
        // helper.layers.set(HELPERS);
        // helper.traverse((child) => {
        //     child.layers.set(HELPERS);
        // });
        // game.scene.add(helper);

        this.reflector = new ReflectorForSSRPass(this.geometry, {
            clipBias: 0.003,
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            color: 0x777777,
            useDepthTexture: true,
        });
        this.reflector.material.depthWrite = false;
        this.reflector.layers.set(HELPERS);
    }
}
