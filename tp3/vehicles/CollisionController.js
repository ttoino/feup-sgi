import * as THREE from "three";
import { Game } from "../Game.js";
import Collider from "./Collider.js";
import Vehicle from "./Vehicle.js";
import { HELPERS } from "../Layers.js";

export default class CollisionController {
    /**
     * 
     * @param {Game} game 
     * @param {Vehicle} object
     * @param {Collider[]} otherColliders
     */
    constructor(game, object, otherColliders) {
        this.game = game

        this.object = object;
        // @ts-ignore
        this.boxCollider = new THREE.Box3().setFromObject(object.model)

        const colliderHelper = new THREE.Box3Helper(this.boxCollider, 0xffff00);
        colliderHelper.layers.set(HELPERS);
        this.game.scene.add(colliderHelper);

        this.collider = new Collider({ object: this.boxCollider, type: 'box' });
        this.otherColliders = otherColliders
    }

    /**
     * 
     * @param {number} delta 
     */
    update(delta) {
        // TODO: update collider pos?

        // @ts-ignore
        this.boxCollider.setFromObject(this.object.model);

        for (const otherCollider of this.otherColliders) {
            if (this.collider.collidesWith(otherCollider)) {
                console.log("WAHHHH", otherCollider, this.collider)

                // We are not colliding with more than one object
                break;
            }
        }
    }
}