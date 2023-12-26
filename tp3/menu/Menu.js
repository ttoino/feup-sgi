/// @ts-check

import * as THREE from "three";
import { UI } from "../Layers.js";


/**
 * @abstract
 */
export default class Menu extends THREE.Object3D {

    constructor(app) {
        super();

        this.app = app;

        this.layers.enable(UI);
    }

}