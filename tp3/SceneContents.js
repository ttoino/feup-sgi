import * as THREE from "three";
import { Background } from "./background/Background.js";
import { HELPERS } from "./Layers.js";
import { MainMenu } from "./menu/MainMenu.js";
import { PauseMenu } from "./menu/PauseMenu.js";
import { Game } from "./Game.js";
import Powerup from "./powerup/Powerup.js";
import { VehicleSelectionMenu } from "./menu/VehicleSelectionMenu.js";
import { LightCycle } from "./vehicles/LightCycle.js";
import { LightCar } from "./vehicles/LightCar.js";
import Vehicle from "./vehicles/Vehicle.js";

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
        this.cycle = new LightCycle(this.game);
        // this.game.scene.add(this.cycle);

        this.car = new LightCar(this.game);
        // this.game.scene.add(this.car);

        /**
         * @type {Vehicle[]}
         */
        this.vehicles = [this.cycle, this.car];

        this.kart = this.car;

        // Powerups
        this.powerups = [];
        const powerup = new Powerup(this.game);
        powerup.position.x = 50;
        powerup.position.z = 50;
        this.powerups.push(powerup);
        this.powerups.forEach((powerup) => {
            powerup.position.y = 1.5;
            this.game.scene.add(powerup);
        });

        // Obstacles
        /**
         * @type {THREE.Object3D[]}
         */
        this.obstacles = [];

        // Main menu UI
        this.mainMenu = new MainMenu(this.game);
        this.mainMenu.position.z = 170;
        this.mainMenu.position.x = 377;
        this.mainMenu.position.y = 140;
        this.mainMenu.rotateY(Math.PI);
        this.game.scene.add(this.mainMenu);

        // Pause menu UI
        this.pauseMenu = new PauseMenu(this.game);
        this.pauseMenu.position.z = 170;
        this.pauseMenu.position.x = -377;
        this.pauseMenu.position.y = 140;
        this.pauseMenu.rotateY(Math.PI);
        this.game.scene.add(this.pauseMenu);

        this.vehicleSelectionMenu = new VehicleSelectionMenu(this.game);
        this.vehicleSelectionMenu.position.z = 150;
        this.vehicleSelectionMenu.position.x = -7;
        this.vehicleSelectionMenu.position.y = 1;
        this.vehicleSelectionMenu.rotateY(Math.PI);
        this.game.scene.add(this.vehicleSelectionMenu);
    }
}
