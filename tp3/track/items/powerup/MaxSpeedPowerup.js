import { Game } from "../../../Game.js";
import ObstacleSelectionState from "../../../state/ObstacleSelectionState.js";
import Vehicle from "../../../vehicles/Vehicle.js";
import Powerup, { PICKUP_INTERVAL } from "./Powerup.js";

const POWERUP_DURATION = 5000;

export default class MaxSpeedPowerup extends Powerup {
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
        this.game.stateManager.current.setTimeout(() => {
            this.pickedUp = false
        }, PICKUP_INTERVAL);

        this.game.stateManager.current.setTimeout(() => {
            this.displayEffectTime(POWERUP_DURATION);
        }, 0);

        vehicle.applyEffect((vehicle) => {
            const currentMaxSpeed = vehicle.maxSpeed;
            vehicle.maxSpeed *= 1.5;

            this.game.stateManager.current.setTimeout(() => {
                vehicle.maxSpeed = currentMaxSpeed;
            }, POWERUP_DURATION);
        });

        this.game.stateManager.pushState(new ObstacleSelectionState(this.game))
    }
}
