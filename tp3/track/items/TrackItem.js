import * as THREE from "three";
import { Game } from "../../game/Game.js";
import Vehicle from "../../vehicles/Vehicle.js";
import SphereCollider from "../../collision/SphereCollider.js";

export const PICKUP_INTERVAL = 5000;
export default class TrackItem extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.game = game;

        this.view = new THREE.Object3D();

        /**
         * @type {HTMLDivElement}
         */
        this.effectDisplay =
            document.querySelector("div#effect-display") ??
            (() => {
                const element = document.createElement("div");
                element.classList.add("effect-display");
                document.body.appendChild(element);
                return element;
            })();

        /**
         * @type {((delta: number) => boolean)[]}
         */
        this.effects = [];

        this.collider = new SphereCollider(
            this.game,
            this,
            this.onCollision.bind(this)
        );

        this.rotateX(Math.PI / 6);
    }

    /**
     * @param {number} maxTime
     */
    displayEffectTime(maxTime, buff = true) {
        const effectElement = document.createElement("div");
        effectElement.classList.add("effect");

        const timeLabel = document.createElement("span");
        timeLabel.classList.add("time");

        const timeLabelValue = document.createElement("span");
        timeLabelValue.classList.add("value");
        timeLabelValue.innerText = `${(maxTime / 1000).toFixed(2)}s`;

        const progressElement = document.createElement("div");
        progressElement.classList.add("progress", `${buff ? "" : "de"}buff`);
        progressElement.style.width = "100%";

        timeLabel.appendChild(timeLabelValue);

        effectElement.appendChild(timeLabel);
        effectElement.appendChild(progressElement);

        this.effectDisplay.appendChild(effectElement);

        let currentTime = maxTime;
        this.effects.push((delta) => {
            currentTime -= delta * 1000;

            if (currentTime <= 0) {
                effectElement.remove();
                return true;
            }

            progressElement.style.width = `${(currentTime / maxTime) * 100}%`;
            timeLabelValue.innerText = `${(currentTime / 1000).toFixed(2)}s`;

            return false;
        });
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.view.rotateY(delta * 0.5);

        this.collider?.update(delta);

        this.effects = this.effects.filter((effect) => !effect(delta));
    }

    /**
     *
     * @param {Vehicle} vehicle
     */
    onCollision(vehicle) {
        console.error(
            "onCollision() not implemented for base powerup class",
            vehicle
        );
    }
}
