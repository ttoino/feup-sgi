import * as THREE from "three";
import { Game } from "../game/Game.js";
import Collider from "./Collider.js";
import Vehicle from "../vehicles/Vehicle.js";
import { HELPERS } from "../renderer/Layers.js";
import BoxCollider from "./BoxCollider.js";
import OpponentController from "../controller/OpponentController.js";

export default class CollisionController {
    /**
     * @param {Game} game
     * @param {Vehicle} object
     * @param {OpponentController} opponentController
     */
    constructor(game, object, opponentController) {
        this.game = game;

        this.opponentController = opponentController;

        this.object = object;

        // Need to use the model here since helpers increase the bounding box of an object
        this.collider = new BoxCollider(
            game,
            object.model ?? object,
            (other) => void 0
        );

        this.nextWaypoint = 0;
        this.lap = 0;
    }

    get otherColliders() {
        return [
            ...this.game.contents.powerUps,
            ...this.game.contents.obstacles,
            this.opponentController,
        ];
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.collider.update(delta);

        for (const otherCollider of this.otherColliders) {
            const collider = otherCollider.collider;

            if (!collider) continue;

            if (this.collider.collidesWith(collider)) {
                collider.onCollision(this.object);

                // We are not colliding with more than one object
                break;
            }
        }

        this.game.contents.track.checkWaypoint(this.collider.collider);
    }
}
