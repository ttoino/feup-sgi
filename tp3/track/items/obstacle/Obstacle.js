import { Game } from "../../../game/Game.js";
import TrackItem from "../TrackItem.js";

export const PICKUP_INTERVAL = 5000;
export default class Obstacle extends TrackItem {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game);

        game.modelManager.load("models/obstacle.glb").then((model) => {
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
        super.displayEffectTime(maxTime, false);
    }

    /**
     *
     * @returns {Obstacle}
     */
    makeClone() {
        const clone = new Obstacle(this.game);

        clone.position.copy(this.position);
        clone.rotation.copy(this.rotation);
        clone.scale.copy(this.scale);

        return clone;
    }
}
