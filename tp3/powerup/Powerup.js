import * as THREE from "three";
import { Game } from "../Game.js";
import Vehicle from "../vehicles/Vehicle.js";
import SphereCollider from "../collision/SphereCollider.js";

export const PICKUP_INTERVAL = 5000;
export default class Powerup extends THREE.Object3D {

    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.game = game;

        this.time = 0;

        /**
         * @type {HTMLDivElement}
         */
        this.effectDisplay = document.querySelector("div#effect-display") ?? (() => { const element = document.createElement("div"); element.classList.add("effect-display"); return element; })()

        /**
         * @type {((delta: number) => boolean)[]}
         */
        this.effects = [];

        this.#init();
    }

    #init() {
        const powerUp = new THREE.Group();

        const geometry = new THREE.CylinderGeometry(1, 1, 0.5);
        geometry.computeBoundingBox();
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffff });
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.rotation.x = Math.PI / 2;

        powerUp.add(this.mesh);

        this.add(powerUp);

        this.collider = new SphereCollider(this.game, this, this.onCollision.bind(this));
    }

    /**
     * 
     * @param {number} maxTime 
     */
    displayPowerupTime(maxTime, buff = true) {

        const effectElement = document.createElement("div");
        effectElement.classList.add("effect");

        const timeLabel = document.createElement("span");
        timeLabel.classList.add("time");

        const timeLabelValue = document.createElement("span");
        timeLabelValue.classList.add("value");
        timeLabelValue.innerText = `${maxTime / 1000}s`;

        const labelSeconds = document.createTextNode('s')

        const progressElement = document.createElement("div");
        progressElement.classList.add("progress", `${buff ? '' : 'de'}buff`);
        progressElement.style.width = '100%';

        timeLabel.appendChild(timeLabelValue);
        timeLabel.appendChild(labelSeconds);

        effectElement.appendChild(timeLabel);
        effectElement.appendChild(progressElement);

        this.effectDisplay.appendChild(effectElement);

        let currentTime = maxTime;
        this.effects.push((delta) => {
            currentTime -= delta * 1000;

            if (currentTime <= 0) {
                effectElement.remove()
                return true;
            }

            progressElement.style.width = `${(currentTime / maxTime) * 100}%`;
            timeLabelValue.innerText = `${(currentTime / 1000).toFixed(2)}s`;

            return false;
        })
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        this.time += delta;

        this.position.y += Math.sin(this.time * 2) * 0.125;
        this.rotateOnAxis(new THREE.Vector3(0, 1, 0), delta * 0.5);

        this.collider?.update(delta)

        this.effects = this.effects.filter(effect => !effect(delta));
    }

    /**
     * 
     * @param {Vehicle} vehicle 
     */
    onCollision(vehicle) {

        console.log("onCollision() not implemented for base powerup class", vehicle);

        // throw new Error("onCollision() not implemented for base powerup class");
    }
}
