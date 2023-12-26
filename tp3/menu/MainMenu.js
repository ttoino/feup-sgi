/// @ts-check

import * as THREE from "three";
import Menu from "./Menu.js";
import { UI } from "../Layers.js";

export class MainMenu extends Menu {

    constructor(app) {
        super();

        this.app = app;

        this.#init();
    }

    #init() {
        const playButtonGeometry = new THREE.BoxGeometry(2, 4, 2);

        const playButton = new THREE.Mesh(playButtonGeometry, new THREE.MeshPhongMaterial({ color: 0xffff00 })); 7

        this.app.scene.add(playButton);
    }
}