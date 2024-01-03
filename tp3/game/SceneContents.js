import * as THREE from "three";
import { Background } from "../background/Background.js";
import { HELPERS } from "../renderer/Layers.js";
import { MainMenu } from "../menu/MainMenu.js";
import { PauseMenu } from "../menu/PauseMenu.js";
import { Game } from "./Game.js";
import { VehicleSelectionMenu } from "../menu/VehicleSelectionMenu.js";
import { LightCycle } from "../vehicles/LightCycle.js";
import { LightCar } from "../vehicles/LightCar.js";
import Vehicle from "../vehicles/Vehicle.js";
import MaxSpeedPowerup from "../track/items/powerup/MaxSpeedPowerup.js";
import MaxSpeedObstacle from "../track/items/obstacle/MaxSpeedObstacle.js";
import { Particles } from "../particles/Particles.js";
import { Fireworks } from "../particles/Fireworks.js";
import { Track } from "../track/Track.js";
import { ObstacleSelectionMenu } from "../menu/ObstacleSelectionMenu.js";
import Obstacle from "../track/items/obstacle/Obstacle.js";

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

        this.track = new Track(this.game);
        this.game.scene.add(this.track);

        // Powerups
        this.powerups = [];
        const powerup = new MaxSpeedPowerup(this.game);
        powerup.position.x = 50;
        powerup.position.z = 50;
        this.powerups.push(powerup);
        this.powerups.forEach((powerup) => {
            powerup.position.y = 1.5;
            this.game.scene.add(powerup);
        });

        // Obstacles
        /**
         * @type {Obstacle[]}
         */
        this.obstacles = [];
        const obstacle = new MaxSpeedObstacle(this.game);
        obstacle.position.x = 53;
        obstacle.position.z = 53;
        this.obstacles.push(obstacle);
        this.obstacles.forEach((obstacle) => {
            obstacle.position.y = 1.5;
            this.game.scene.add(obstacle);
        });

        // Main menu UI
        this.mainMenu = new MainMenu(this.game);
        this.mainMenu.position.z = 170;
        this.mainMenu.position.x = 377;
        this.mainMenu.position.y = 470;
        this.mainMenu.rotateY(Math.PI);
        this.mainMenu.rotateX(-Math.PI / 8);
        this.game.scene.add(this.mainMenu);

        // Pause menu UI
        this.pauseMenu = new PauseMenu(this.game);
        this.pauseMenu.position.z = 170;
        this.pauseMenu.position.x = -377;
        this.pauseMenu.position.y = 140;
        this.pauseMenu.rotateY(Math.PI);
        this.game.scene.add(this.pauseMenu);

        // Vehicle Selection Menu
        this.vehicleSelectionMenu = new VehicleSelectionMenu(this.game);
        this.vehicleSelectionMenu.position.z = 150;
        this.vehicleSelectionMenu.position.x = -7;
        this.vehicleSelectionMenu.position.y = 1;
        this.vehicleSelectionMenu.rotateY(Math.PI);
        this.game.scene.add(this.vehicleSelectionMenu);

        // Obstacle Selection Menu
        this.obstacleSelectionMenu = new ObstacleSelectionMenu(this.game);
        this.obstacleSelectionMenu.position.z = -150;
        this.obstacleSelectionMenu.position.x = -7;
        this.obstacleSelectionMenu.position.y = 1;
        this.obstacleSelectionMenu.rotateY(Math.PI);
        this.game.scene.add(this.obstacleSelectionMenu);

        this.fireworks = new Fireworks(this.game);
        this.game.scene.add(this.fireworks);
    }
}