/// @ts-check

import * as THREE from "three";
import { MyApp } from "../MyApp.js";
import { MyFloor} from "./MyFloor.js";

export class MyBackground extends THREE.Object3D {
    /**
     * @param {MyApp} app
     */
    constructor(app) {
        super();

        this.app = app;

        this.init();
    }

    init() {
        this.floor = new MyFloor()
        this.add(this.floor);
    }
}