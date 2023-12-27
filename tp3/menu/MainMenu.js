import * as THREE from "three";
import Menu from "./Menu.js";
import { MAIN_MENU, UI } from "../Layers.js";

export class MainMenu extends Menu {
    constructor(game) {
        super();

        this.game = game;

        this.#init();
    }

    #init() {
        const mainMenu = new THREE.Group();

        const mainMenuButtonGeometry = new THREE.BoxGeometry(4, 2, 2);
        const mainMenuFrameGeometry = new THREE.TorusGeometry(7, 1, 4, 4);

        const playButton = new THREE.Mesh(
            mainMenuButtonGeometry,
            new THREE.MeshStandardMaterial({ color: 0xffff00 })
        );
        playButton.name = "play_button";
        playButton.layers.enable(UI);
        playButton.layers.enable(MAIN_MENU);

        const exitButton = new THREE.Mesh(
            mainMenuButtonGeometry,
            new THREE.MeshStandardMaterial({ color: 0xffff00 })
        );
        exitButton.name = "exit_button";
        exitButton.layers.enable(UI);
        exitButton.layers.enable(MAIN_MENU);

        exitButton.position.y = -3;

        const frame = new THREE.Mesh(
            mainMenuFrameGeometry,
            new THREE.MeshStandardMaterial({ color: 0xffff00 })
        );

        frame.name = "frame";

        frame.position.y = -1.5;
        frame.rotation.z = Math.PI / 4;

        mainMenu.add(frame);

        mainMenu.add(playButton);
        mainMenu.add(exitButton);

        this.add(mainMenu);
    }
}
