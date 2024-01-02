import { Game } from "../Game.js";
import Vehicle from "./Vehicle.js";

export class LightCar extends Vehicle {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game, "light_car");
    }
}
