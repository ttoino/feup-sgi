import * as THREE from "three";
import { Game } from "../Game.js";
import { TRACK } from "../Layers.js";

export class Track extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        game.modelManager.loadModel("models/track.glb", (model) => {
            this.add(model);

            model.layers.enable(TRACK);

            console.log(model);
        });
    }
}
