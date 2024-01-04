import * as THREE from "three";
import { Game } from "../game/Game.js";
import BoxCollider from "../collision/BoxCollider.js";
import Vehicle from "../vehicles/Vehicle.js";
import { signedAngleTo } from "../MathUtils.js";
import { TrackPosition } from "../track/Track.js";
import { LAPS } from "../state/PlayState.js";

export const EFFECT_DURATION = 5000;

export default class OpponentController {
    /**
     * @param {Game} game
     * @param {Vehicle} vehicle
     */
    constructor(game, vehicle) {
        this.game = game;

        this.vehicle = vehicle;

        this.collider = new BoxCollider(
            this.game,
            this.vehicle.model ?? this.vehicle,
            this.#onPlayerCollision.bind(this)
        );

        this.nextRouteWaypoint = 1;

        this.trackPosition = new TrackPosition();
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.animate();

        this.vehicle.update(delta);
        this.collider.update(delta);

        this.game.contents.track.checkWaypoint(this.collider.collider, this.trackPosition, true);

        if (this.trackPosition.lap < LAPS)
            this.game.info.opponentTime += delta;
    }

    /**
     * @returns {void}
     */
    animate() {
        const nextWaypoint =
            this.game.contents.track.opponentRoute[this.nextRouteWaypoint];

        const waypointPosition = nextWaypoint.getWorldPosition(
            new THREE.Vector3()
        );
        const waypointDirection = nextWaypoint.getWorldDirection(
            new THREE.Vector3()
        );

        const vehicleDirection = this.vehicle.getWorldDirection(
            new THREE.Vector3()
        );
        const directionToWaypoint = waypointPosition
            .clone()
            .sub(this.vehicle.getWorldPosition(new THREE.Vector3()));
        const distanceToWaypoint = directionToWaypoint.length();

        let angleToWaypoint =
            distanceToWaypoint < 1
                ? signedAngleTo(vehicleDirection, waypointDirection)
                : signedAngleTo(vehicleDirection, directionToWaypoint);

        if (angleToWaypoint > Math.PI) angleToWaypoint -= Math.PI * 2;

        if (
            distanceToWaypoint < 0.5 ||
            Math.abs(angleToWaypoint) > Math.PI / 2
        ) {
            this.nextRouteWaypoint =
                (this.nextRouteWaypoint + 1) %
                this.game.contents.track.opponentRoute.length;
            return this.animate();
        }

        if (angleToWaypoint > Math.PI / 12) {
            this.vehicle.rotateLeft();

            if (this.vehicle.forwardSpeed > (this.vehicle.maxSpeed * 2) / 3)
                this.vehicle.speedDown();
            else if (this.vehicle.forwardSpeed < this.vehicle.maxSpeed / 3)
                this.vehicle.speedUp();
            else this.vehicle.resetAcceleration();
        } else if (angleToWaypoint < -Math.PI / 12) {
            this.vehicle.rotateRight();

            if (this.vehicle.forwardSpeed > (this.vehicle.maxSpeed * 2) / 3)
                this.vehicle.speedDown();
            else if (this.vehicle.forwardSpeed < this.vehicle.maxSpeed / 3)
                this.vehicle.speedUp();
            else this.vehicle.resetAcceleration();
        } else {
            this.vehicle.resetRotation();
            this.vehicle.speedUp();
        }
    }

    /**
     * @param {Vehicle} otherVehicle
     */
    #onPlayerCollision(otherVehicle) {
        if (this.collided) return;

        this.collided = true;
        this.game.stateManager.current.setTimeout(
            () => (this.collided = false),
            1000
        );

        otherVehicle.applyEffect((vehicle) => {
            const currentMaxSpeed = vehicle.maxSpeed;
            vehicle.maxSpeed *= 0.4;

            this.game.stateManager.current.setTimeout(() => {
                vehicle.maxSpeed = currentMaxSpeed;
            }, EFFECT_DURATION);
        });
    }
}
