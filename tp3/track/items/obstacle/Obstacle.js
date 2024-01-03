import * as THREE from "three";
import { Game } from "../../../game/Game.js";
import TrackItem from "../TrackItem.js";
import { ObstacleMaterial } from "./ObstacleMaterial.js";

export const PICKUP_INTERVAL = 5000;
export default class Obstacle extends TrackItem {
    /**
     * @param {Game} game
     * @param {Parameters<typeof this.game.materials.changeGlow>[1] | undefined} glow
     */
    constructor(game, glow = undefined) {
        super(game);

        this.glow = glow;

        /** @type {ObstacleMaterial[]} */
        this.materials = [];

        game.modelManager.load("models/obstacle.glb").then((gltf) => {
            const model = gltf.clone();

            this.add(model);

            model.traverse((child) => {
                if (child.name.includes("view")) this.view = child;

                if (child instanceof THREE.Mesh && child.material) {
                    child.material = new ObstacleMaterial(child.material);
                    this.materials.push(child.material);
                }
            });

            if (this.glow)
                this.game.materials.changeGlow(this, glow);
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
        const clone = new Obstacle(this.game, this.glow);

        clone.position.copy(this.position);
        clone.rotation.copy(this.rotation);
        clone.scale.copy(this.scale);

        return clone;
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        super.update(delta);

        this.materials.forEach(
            (material) =>
            (material.uniforms.time.value =
                (material.uniforms.time.value + delta) % 1)
        );
    }
}
