import { Game } from "../../../Game.js";
import Vehicle from "../../../vehicles/Vehicle.js";
import Powerup, { PICKUP_INTERVAL } from "./Obstacle.js";

const POWERUP_DURATION = 5000;

export default class MaxSpeedPowerup extends Powerup {

    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super(game)

        this.pickedUp = false;
    }

    /**
     * 
     * @param {Vehicle} vehicle 
     */
    onCollision(vehicle) {

        if (this.pickedUp) return;

        this.pickedUp = true;
        setTimeout(() => this.pickedUp = false, PICKUP_INTERVAL);

        this.displayPowerupTime(POWERUP_DURATION, true);

        vehicle.applyEffect((vehicle) => {
            const currentMaxSpeed = vehicle.maxSpeed;
            vehicle.maxSpeed *= 1.5;

            setTimeout(() => {
                vehicle.maxSpeed = currentMaxSpeed
            }, POWERUP_DURATION);
        })
    }
}