import * as THREE from "three";
import { Background } from "./background/Background.js";
import { Kart } from "./Kart.js";
import { HELPERS } from "./Layers.js";
import { MainMenu } from "./menu/MainMenu.js";
import { PauseMenu } from "./menu/PauseMenu.js";
import { Game } from "./Game.js";

/**
 *  This class contains the contents of our application
 */
export class SceneContents {
    /**
     * Constructs the object
     * @param {Game} game The application object
     */
    constructor(game) {
        this.game = game;

        // Axis helper
        this.axis = new THREE.AxesHelper();
        this.axis.layers.set(HELPERS);
        this.game.scene.add(this.axis);

        // Ambient light
        this.ambient = new THREE.AmbientLight(0xffffff, 0.2);
        this.game.scene.add(this.ambient);

        // Scene background
        this.background = new Background(this.game);
        this.game.scene.add(this.background);

        // Mario kart
        this.kart = new Kart(this.game);
        this.game.scene.add(this.kart);

        // Main menu UI
        this.mainMenu = new MainMenu(this.game);
        this.mainMenu.position.z = 170;
        this.mainMenu.position.x = 377;
        this.mainMenu.position.y = 140;
        this.mainMenu.rotateY(Math.PI);
        this.game.scene.add(this.mainMenu);

        // Pause menu UI
        this.pauseMenu = new PauseMenu(this.game);
        this.pauseMenu.position.z = 10;
        this.game.scene.add(this.pauseMenu);
    }
}
