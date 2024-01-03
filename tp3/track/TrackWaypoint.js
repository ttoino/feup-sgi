import * as THREE from 'three';
import { Game } from '../game/Game.js';
import { HELPERS } from '../renderer/Layers.js';
import { OBB } from 'three/addons/math/OBB.js';
import { WINNER_TO_GLOW } from './Track.js';
export class WaypointLight extends THREE.Object3D {

    /**
     * 
     * @param {Game} game
     * @param {THREE.Object3D | undefined} on 
     * @param {THREE.Object3D | undefined} off 
     */
    constructor(game, on, off) {
        super();

        this.game = game;

        this.on = on;
        this.off = off;

        this.turnOff();
    }

    turnOff() {
        if (this.on) this.on.visible = false;
        if (this.off) this.off.visible = true;
    }

    turnOn() {
        if (this.on) this.on.visible = true;
        if (this.off) this.off.visible = false;
    }

    /**
     * 
     * @param {(typeof WINNER_TO_GLOW)[keyof typeof WINNER_TO_GLOW]} color 
     */
    changeLightColor(color) {
        if (this.on) {
            const material = this.on.visible
                ? "glow_yellow"
                : color;

            this.on.visible = true;
            this.game.materials.changeGlow(this.on, material);
        }
        if (this.off) {
            this.off.visible = false;
        }
    }

}

export default class TrackWaypoint extends THREE.Object3D {

    /**
     * 
     * @param {Game} game 
     * @param {THREE.Object3D} model 
     */
    constructor(game, model) {
        super();

        this.game = game;
        this.model = model;
        this.name = this.model.name;

        this.lights = ([1, 2, 3]).map((i) => {
            return new WaypointLight(
                this.game,
                this.model.getObjectByName(
                    `${this.model.name}_${i}_on`
                ), this.model.getObjectByName(
                    `${this.model.name}_${i}_off`
                )
            );
        });
        this.currentLightIndex = 0;

        this.model.updateMatrixWorld();

        const helper = new THREE.Mesh(
            new THREE.BoxGeometry(24, 0.2, 24),
            new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                wireframe: true,
            })
        );
        helper.applyMatrix4(this.model.matrixWorld);
        helper.layers.set(HELPERS);
        this.game.scene.add(helper);

        this.collider = new OBB(
            new THREE.Vector3(),
            new THREE.Vector3(12, 0.1, 12)
        ).applyMatrix4(this.model.matrixWorld);
    }

    reset() {
        this.lights.forEach((light) => {
            light.turnOff();
        });
    }

    /**
     * 
     * @param {(typeof WINNER_TO_GLOW)[keyof typeof WINNER_TO_GLOW]} color 
     * @param {number} lightIndex
     */
    changeLightColor(color, lightIndex) {
        if (0 <= lightIndex && lightIndex < this.lights.length) {
            const light = this.lights[lightIndex];

            light.changeLightColor(color);
        }
    }
}