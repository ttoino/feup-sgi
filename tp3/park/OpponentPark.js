import { Game } from "../game/Game.js";
import { Park } from "./Park.js";

export class OpponentPark extends Park {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game);
    }

    addObjects() {
        this.nextSpot = 0;

        this.game.materials.changeGlow(this, "glow_red");

        this.addToSpot(this.game.contents.cycleRed);
        this.addToSpot(this.game.contents.carRed);
    }
}
