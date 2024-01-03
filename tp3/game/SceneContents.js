import * as THREE from "three";
import { Background } from "../background/Background.js";
import { HELPERS } from "../renderer/Layers.js";
import { MainMenu } from "../menu/MainMenu.js";
import { PauseMenu } from "../menu/PauseMenu.js";
import { Game } from "./Game.js";
import { PlayerVehicleSelectionMenu } from "../menu/PlayerVehicleSelectionMenu.js";
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
import { VehiclePark } from "../park/VehiclePark.js";
import { OpponentPark } from "../park/OpponentPark.js";
import { ObstaclePark } from "../park/ObstaclePark.js";
import ControlReverseObstacle from "../track/items/obstacle/ControlReverseObstacle.js";
import { OpponentVehicleSelectionMenu } from "../menu/OpponentVehicleSelectionMenu.js";

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

        this.cycle = new LightCycle(this.game);
        this.game.scene.add(this.cycle);

        this.cycleRed = new LightCycle(this.game);
        this.game.scene.add(this.cycleRed);

        this.car = new LightCar(this.game);
        this.game.scene.add(this.car);

        this.carRed = new LightCar(this.game);
        this.game.scene.add(this.carRed);

        /** @type {Vehicle[]} */
        this.vehicles = [this.cycle, this.car];

        /** @type {Vehicle[]} */
        this.opponentVehicles = [this.cycleRed, this.carRed];

        // Parks
        this.vehiclePark = new VehiclePark(this.game);

        this.opponentPark = new OpponentPark(this.game);

        this.obstaclePark = new ObstaclePark(this.game);
        this.game.scene.add(this.obstaclePark);

        // Track
        this.track = new Track(this.game);
        this.game.scene.add(this.track);

        // PowerUps
        this.powerUps = [];

        const powerUp = new MaxSpeedPowerup(this.game);
        powerUp.position.x = 50;
        powerUp.position.z = 50;
        this.powerUps.push(powerUp);

        this.powerUps.forEach((powerUp) => {
            powerUp.position.y = 1.5;
            this.game.scene.add(powerUp);
        });

        // Obstacles
        /**
         * @type {Obstacle[]}
         */
        this.obstacles = [];

        const maxSpeedObstacle = new MaxSpeedObstacle(this.game);
        maxSpeedObstacle.position.x = 53;
        maxSpeedObstacle.position.z = 53;
        this.obstacles.push(maxSpeedObstacle);

        const reverseControlObstacle = new ControlReverseObstacle(this.game);
        maxSpeedObstacle.position.x = 53;
        maxSpeedObstacle.position.z = 53;
        this.obstacles.push(reverseControlObstacle);

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

        // Player Vehicle Selection Menu
        this.playerVehicleSelectionMenu = new PlayerVehicleSelectionMenu(this.game);
        this.playerVehicleSelectionMenu.position.z = 150;
        this.playerVehicleSelectionMenu.position.x = -10;
        this.playerVehicleSelectionMenu.rotateY(Math.PI);
        this.game.scene.add(this.playerVehicleSelectionMenu);

        // Opponent Vehicle Selection Menu
        this.opponentVehicleSelectionMenu = new OpponentVehicleSelectionMenu(this.game);
        this.opponentVehicleSelectionMenu.position.z = 140;
        this.opponentVehicleSelectionMenu.position.x = 60;
        this.opponentVehicleSelectionMenu.rotateY(Math.PI);
        this.game.scene.add(this.opponentVehicleSelectionMenu);

        // Obstacle Selection Menu
        this.obstacleSelectionMenu = new ObstacleSelectionMenu(this.game);
        this.obstacleSelectionMenu.position.z = -150;
        this.obstacleSelectionMenu.position.x = -7;
        this.obstacleSelectionMenu.position.y = 1;
        this.obstacleSelectionMenu.rotateY(Math.PI);
        this.game.scene.add(this.obstacleSelectionMenu);
    }

    onLoaded() {
        this.game.materials.changeGlow(this.cycleRed, "glow_red");
        this.game.materials.changeGlow(this.carRed, "glow_red");
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.background.update(delta);

        this.obstacles.forEach((obstacle) => {
            obstacle.update(delta);
        });
    }
}
