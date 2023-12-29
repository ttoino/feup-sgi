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
        // @ts-ignore
        this.boxCollider = new THREE.Box3().setFromObject(object.model)

        // @ts-ignore
        this.collider = new BoxCollider(game, object.model, (other) => void 0)
    }

    /**
     * 
     * @param {number} delta 
     */
    update(delta) {

        this.collider.update(delta);

        // @ts-ignore
        this.boxCollider.setFromObject(this.object.model);

        for (const otherCollider of this.otherColliders) {
            if (this.collider.collidesWith(otherCollider)) {
                otherCollider.onCollision(this.object)

                // We are not colliding with more than one object
                break;
            }
        }
    }
}