/// @ts-check

import * as THREE from "three";
// @ts-expect-error
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { MyFloorMaterial } from "./MyFloorMaterial.js";
import { MyApp } from "../MyApp.js";
import { HELPERS } from "../Layers.js";

const size = 1000;
const divisions = 100;

export class MyFloor extends THREE.Mesh {
    /**
     * @param {MyApp} app
     */
    constructor(app) {
        super();

        this.geometry = new THREE.PlaneGeometry(
            size,
            size,
            divisions,
            divisions
        );

        this.material = new MyFloorMaterial({
            divisions,
        });
        this.rotation.x = -Math.PI / 2;

        this.light = new THREE.RectAreaLight(0xffffff, .3, size, size);
        this.light.rotateY(Math.PI)
        this.add(this.light);

        const helper = new RectAreaLightHelper(this.light);
        helper.layers.set(HELPERS);
        helper.traverse((child) => {
            child.layers.set(HELPERS);
        });
        app.scene.add(helper);
    }
}
