import { Game } from "../game/Game.js";
import { Park } from "./Park.js";

export class ObstaclePark extends Park {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game);
    }

    addObjects() {
        this.nextSpot = 0;

        this.game.materials.changeGlow(this, "glow_yellow");

        this.game.contents.obstacles.forEach((obstacle) => {
            this.addToSpot(obstacle);
        });
    }
}
