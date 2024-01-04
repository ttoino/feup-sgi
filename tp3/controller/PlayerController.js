import { Game } from "../game/Game.js";
import CollisionController from "../collision/CollisionController.js";
import VehicleController from "../vehicles/VehicleController.js";
import { TrackPosition } from "../track/Track.js";
import { LAPS } from "../state/PlayState.js";

export default class PlayerController {
    /**
     * @param {Game} game
     * @param {VehicleController} vehicleController
     * @param {CollisionController} collisionController
     */
    constructor(game, vehicleController, collisionController) {
        this.game = game;
        this.vehicleController = vehicleController;
        this.collisionController = collisionController;

        this.trackPosition = new TrackPosition();
    }

    get vehicle() {
        return this.vehicleController.vehicle;
    }

    install() {
        this.vehicleController.installPlayerControls();
    }

    remove() {
        this.vehicleController.removePlayerControls();
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.vehicleController.update(delta);
        this.collisionController.update(delta);

        this.game.contents.track.checkWaypoint(this.collisionController.collider.collider, this.trackPosition);

        if (this.trackPosition.lap < LAPS)
            this.game.info.playerTime += delta;
    }
}
