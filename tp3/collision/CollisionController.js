import * as THREE from "three";
import { Game } from "../Game.js";
import Collider from "./Collider.js";
import Vehicle from "../vehicles/Vehicle.js";
import { HELPERS } from "../Layers.js";
import BoxCollider from "./BoxCollider.js";

export default class CollisionController {
    /**
     * 
     * @param {Game} game 
     * @param {Vehicle} object
     * @param {Collider[]} otherColliders
     */
    constructor(game, object, otherColliders) {
        this.game = game
        this.otherColliders = otherColliders ?? [];

        this.object = object;

        // Need to use the model here since helpers increase the bounding box of an object
        // @ts-ignore
        this.collider = new BoxCollider(game, object.model, (other) => void 0)
    }

    /**
     * 
     * @param {number} delta 
     */
    update(delta) {

        this.collider.update(delta);

        for (const otherCollider of this.otherColliders) {
            if (this.collider.collidesWith(otherCollider)) {
                otherCollider.onCollision(this.object)

                // We are not colliding with more than one object
                break;
            }
        }
    }
}