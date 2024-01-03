import * as THREE from "three";
import { Game } from "../game/Game.js";
import BoxCollider from "../collision/BoxCollider.js";
import Vehicle from "../vehicles/Vehicle.js";
import { signedAngleTo } from "../MathUtils.js";

export const EFFECT_DURATION = 5000;

export default class OpponentController {
    /**
     * @param {Game} game
     * @param {Vehicle} opponentVehicle
     */
    constructor(game, opponentVehicle) {
        this.game = game;

        this.opponentVehicle = opponentVehicle;

        this.collider = new BoxCollider(
            this.game,
            this.opponentVehicle.model ?? this.opponentVehicle,
            this.#onPlayerCollision.bind(this)
        );

        this.nextWaypoint = 1;
    }

    get vehicle() {
        return this.opponentVehicle;
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.animate();

        this.opponentVehicle.update(delta);
        this.collider.update(delta);
    }

    /**
     * @returns {void}
     */
    animate() {
        const nextWaypoint =
            this.game.contents.track.opponentRoute[this.nextWaypoint];

        console.log(nextWaypoint.name);

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

        console.log(angleToWaypoint);

        if (
            distanceToWaypoint < 0.5 ||
            Math.abs(angleToWaypoint) > Math.PI / 2
        ) {
            this.nextWaypoint =
                (this.nextWaypoint + 1) %
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
