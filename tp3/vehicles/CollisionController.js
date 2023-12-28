import * as THREE from "three";
import { Game } from "../Game.js";
import Collider from "./Collider.js";
import Vehicle from "./Vehicle.js";

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
        this.game.scene.add(new THREE.BoxHelper(this.object, 0xffff00));

        this.collider = new Collider({ object: new THREE.Box3().setFromObject(object), type: 'box' });
        this.otherColliders = otherColliders
    }

    /**
     * 
     * @param {number} delta 
     */
    update(delta) {
        // TODO: update collider pos?

        // this.collider.options.object.applyMatrix4(this.object.matrixWorld);

        for (const otherCollider of this.otherColliders) {
            if (this.collider.collidesWith(otherCollider)) {
                console.log("WAHHHH", otherCollider, this.collider)

                // We are not colliding with more than one object
                break;
            }
        }
    }
}