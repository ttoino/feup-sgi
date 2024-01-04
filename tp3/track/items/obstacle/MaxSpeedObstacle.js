import { Game } from "../../../game/Game.js";
import Vehicle from "../../../vehicles/Vehicle.js";
import Obstacle, { PICKUP_INTERVAL } from "./Obstacle.js";

const DEBUFF_DURATION = 5000;

export default class MaxSpeedObstacle extends Obstacle {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game, "glow_red");

        this.pickedUp = false;
    }

    /**
     * @param {Vehicle} vehicle
     */
    onCollision(vehicle) {
        if (this.pickedUp) return;

        this.pickedUp = true;
        this.game.stateManager.current.setTimeout(() => (this.pickedUp = false), PICKUP_INTERVAL);

        this.game.stateManager.current.setTimeout(() => {
            this.displayEffectTime(DEBUFF_DURATION);
        }, 0);

        vehicle.applyEffect((vehicle) => {
            const currentMaxSpeed = vehicle.maxSpeed;
            vehicle.maxSpeed *= 0.7;

            this.game.stateManager.current.setTimeout(() => {
                vehicle.maxSpeed = currentMaxSpeed;
            }, DEBUFF_DURATION);
        });
    }

    makeClone() {
        // const clone = super.makeClone()
        // clone.onCollision = this.onCollision.bind(clone);

        const clone = new MaxSpeedObstacle(this.game);

        clone.position.copy(this.position);
        clone.rotation.copy(this.rotation);
        clone.scale.copy(this.scale);

        clone.pickedUp = this.pickedUp;

        return clone;
    }
}
