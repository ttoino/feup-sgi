/// @ts-check

import { Game } from "../Game.js";
import { Picker } from "../Picker.js";
import { GameState } from "./GameState.js";

/**
 * @abstract
 */
export class MenuState extends GameState {
    /**
     * @param {Game} game
     * @param {THREE.Object3D} menuObject
     * @param {number} layer
     */
    constructor(game, menuObject, layer) {
        super(game);

        this.menuObject = menuObject;

        this.picker = new Picker(game, layer);
    }

    init() {
        this.picker.pickOnClick().then((object) => this.onPick(object));
        this.game.controls.target = this.menuObject;
    }

    destroy() {
        this.picker.finishPicking();
    }

    /**
     * @abstract
     *
     * @param {THREE.Object3D} object
     */
    onPick(object) {
        throw new Error("Not implemented");
    }

    /**
     * @override
     *
     * @param {number} delta
     */
    update(delta) {
        super.update(delta);

        if (!this.picker.picking)
            this.picker.pickOnClick().then((object) => this.onPick(object));
    }
}
