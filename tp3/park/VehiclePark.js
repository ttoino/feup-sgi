import { Game } from "../game/Game.js";
import { Park } from "./Park.js";

export class VehiclePark extends Park {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game);
    }

    addObjects() {
        this.nextSpot = 0;
        this.addToSpot(this.game.contents.cycle);
        this.addToSpot(this.game.contents.car);
    }
}