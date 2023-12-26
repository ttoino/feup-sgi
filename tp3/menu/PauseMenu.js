/// @ts-check

import * as THREE from "three";
import Menu from "./Menu.js";
import { PAUSE_MENU, UI } from "../Layers.js";

export class PauseMenu extends Menu {
    constructor(app) {
        super();

        this.app = app;

        this.#init();
    }

    #init() {
        const pauseMenu = new THREE.Group();

        const resumeButtonGeometry = new THREE.BoxGeometry(4, 4, 2);

        const resumeButton = new THREE.Mesh(
            resumeButtonGeometry,
            new THREE.MeshStandardMaterial({ color: 0x0000ff })
        );
        resumeButton.name = "resume_button";
        resumeButton.layers.enable(UI);
        resumeButton.layers.enable(PAUSE_MENU);

        pauseMenu.add(resumeButton);

        this.add(pauseMenu);
    }
}
