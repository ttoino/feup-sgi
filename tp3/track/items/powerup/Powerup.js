import { Game } from "../../../game/Game.js";
import TrackItem from "../TrackItem.js";

export const PICKUP_INTERVAL = 5000;
export default class Powerup extends TrackItem {
    /**
     * @param {Game} game
     * @param {Parameters<typeof this.game.materials.changeGlow>[1] | undefined} glow
     */
    constructor(game, glow) {
        super(game);

        this.glow = glow;

        game.modelManager.load("models/powerup.glb").then((gltf) => {
            const model = gltf.clone();

            this.add(model);

            this.game.materials.changeGlow(this, glow);

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
