import * as THREE from "three";
import { Game } from "../game/Game.js";
import { Floor } from "./Floor.js";

export class Background extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.game = game;

        this.floor = new Floor(game);
        this.add(this.floor);
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.floor.update(delta);
    }
}
