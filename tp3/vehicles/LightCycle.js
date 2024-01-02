import * as THREE from "three";
import { ALL_VEHICLES, HELPERS } from "../Layers.js";
import { Game } from "../Game.js";
import Vehicle from "./Vehicle.js";

export class LightCycle extends Vehicle {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game, "light_cycle");
    }
}
