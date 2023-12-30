import { Game } from "../../../Game.js";
import TrackItem from "../TrackItem.js";

export const PICKUP_INTERVAL = 5000;
export default class Powerup extends TrackItem {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game);
    }

    /**
     * @param {number} maxTime
     */
    displayEffectTime(maxTime) {
        super.displayEffectTime(maxTime, true);
    }
}
