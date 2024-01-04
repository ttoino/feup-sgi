import * as THREE from "three";
import { Game } from "../game/Game.js";
import { Particles } from "./Particles.js";
import { randRange } from "../MathUtils.js";

export class FireworkExplosion extends Particles {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game, {
            geometry: new THREE.IcosahedronGeometry(0.05),
            material: new THREE.MeshLambertMaterial({
                emissive: 0x009fff,
                emissiveIntensity: 10,
                transparent: true,
            }),
            count: 100,
            gravity: 1,
            velocity: () =>
                new THREE.Vector3().setFromSpherical(
                    new THREE.Spherical(
                        5,
                        randRange(0, Math.PI),
                        randRange(0, Math.PI * 2)
                    )
                ),
            lifeTime: 1,
        });

        this.dead = false;
    }

    /**
     * @param {number} i
     */
    reset(i) {
        if (i in this.positions) {
            this.dispose();
            this.removeFromParent();
            this.dead = true;
        }

        super.reset(i);
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        super.update(delta);

        if (!(this.material instanceof THREE.Material)) return;

        this.material.opacity = this.lifeTimes[0];
        this.material.needsUpdate = true;
    }
}
