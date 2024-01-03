import * as THREE from "three";
import { Game } from "../game/Game.js";

/**
 * @abstract
 */
export default class Menu extends THREE.Object3D {
    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super();

        this.game = game;
    }
}
