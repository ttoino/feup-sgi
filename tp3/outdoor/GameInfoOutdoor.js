import * as THREE from "three";
import { Game } from "../game/Game.js";
import { GameInfoDisplay } from "../GameInfoDisplay.js";

export class GameInfoOutdoor extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.game = game;

        this.display = new GameInfoDisplay(this.game);
        this.display.position.set(-3, 4.7, 1);
        this.add(this.display);

        game.modelManager.load("models/hud_outdoor.glb").then((gltf) => {
            this.add(gltf);
        });
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.display.update(delta);
    }
}
