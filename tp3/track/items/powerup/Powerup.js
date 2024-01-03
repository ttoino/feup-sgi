import { Game } from "../../../game/Game.js";
import TrackItem from "../TrackItem.js";

export const PICKUP_INTERVAL = 5000;
export default class Powerup extends TrackItem {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game);

        game.modelManager.load("models/powerup.glb").then((model) => {
            this.add(model);

            model.traverse((child) => {
                if (child.name.includes("view")) this.view = child;
            });
        });
    }

    /**
     * @param {number} maxTime
     */
    displayEffectTime(maxTime) {
        super.displayEffectTime(maxTime, true);
    }
}
