import { Game } from "../../../game/Game.js";
import ObstacleSelectionState from "../../../state/ObstacleSelectionState.js";
import Vehicle from "../../../vehicles/Vehicle.js";
import Powerup, { PICKUP_INTERVAL } from "./Powerup.js";

const TIME_REDUCTION = 1;

export default class TimeReducerPowerup extends Powerup {
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
        this.game.stateManager.current.setTimeout(() => {
            this.pickedUp = false
        }, PICKUP_INTERVAL);

        this.game.info.playerTime -= TIME_REDUCTION;

        this.game.stateManager.pushState(new ObstacleSelectionState(this.game))
    }

    makeClone() {
        return new TimeReducerPowerup(this.game);
    }
}
