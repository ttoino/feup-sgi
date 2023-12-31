import { Game } from "../Game.js";
import BoxCollider from "../collision/BoxCollider.js";
import Vehicle from "../vehicles/Vehicle.js";

export const EFFECT_DURATION = 5000;

export default class OpponentController {

    /**
     * 
     * @param {Game} game 
     * @param {Vehicle} opponentVehicle 
     */
    constructor(game, opponentVehicle) {
        this.game = game;

        this.opponentVehicle = opponentVehicle;

        this.collider = new BoxCollider(this.game, this.opponentVehicle, this.#onPlayerCollision.bind(this));
    }

    get vehicle() { return this.opponentVehicle; }

    /**
     * 
     * @param {number} delta 
     */
    update(delta) {
        this.opponentVehicle.update(delta);
        this.collider.update(delta);
    }

    /**
     * 
     * @param {Vehicle} otherVehicle 
     */
    #onPlayerCollision(otherVehicle) {

        console.log("Opponent collided with player")

        otherVehicle.applyEffect((vehicle) => {
            const currentMaxSpeed = vehicle.maxSpeed;
            vehicle.maxSpeed *= 0.7;

            setTimeout(() => {
                vehicle.maxSpeed = currentMaxSpeed;
            }, EFFECT_DURATION);
        });
    }
}