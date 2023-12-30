import { Game } from "../../../Game.js";
import Vehicle from "../../../vehicles/Vehicle.js";
import Obstacle, { PICKUP_INTERVAL } from "./Obstacle.js";

const DEBUFF_DURATION = 5000;

export default class MaxSpeedObstacle extends Obstacle {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game);

        this.pickedUp = false;
    }

    /**
     * @param {Vehicle} vehicle
     */
    onCollision(vehicle) {
        if (this.pickedUp) return;

        this.pickedUp = true;
        setTimeout(() => (this.pickedUp = false), PICKUP_INTERVAL);

        this.displayEffectTime(DEBUFF_DURATION);

        vehicle.applyEffect((vehicle) => {
            const currentMaxSpeed = vehicle.maxSpeed;
            vehicle.maxSpeed *= 0.7;

            setTimeout(() => {
                vehicle.maxSpeed = currentMaxSpeed;
            }, DEBUFF_DURATION);
        });
    }
}
