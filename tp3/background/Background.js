/// @ts-check

import * as THREE from "three";
import { MyApp } from "../MyApp.js";
import { Floor} from "./Floor.js";

export class Background extends THREE.Object3D {
    /**
     * @param {MyApp} app
     */
    constructor(app) {
        super();

        this.app = app;

        this.floor = new Floor(app)
        this.add(this.floor);
    }
}