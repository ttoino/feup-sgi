/// @ts-check

import * as THREE from "three";
import Menu from "./Menu.js";
import { MAIN_MENU, UI } from "../Layers.js";

export class MainMenu extends Menu {
    constructor(app) {
        super();

        this.app = app;

        this.#init();
    }

    #init() {
        const playButtonGeometry = new THREE.BoxGeometry(2, 4, 2);

        const playButton = new THREE.Mesh(
            playButtonGeometry,
            new THREE.MeshStandardMaterial({ color: 0xffff00 })
        );
        playButton.name = "play_button";
        playButton.layers.enable(UI);
        playButton.layers.enable(MAIN_MENU);
        this.app.scene.add(playButton);
    }
}
