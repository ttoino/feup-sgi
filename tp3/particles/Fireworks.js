import * as THREE from "three";
import { Game } from "../game/Game.js";
import { Particles } from "./Particles.js";
import { randRange } from "../MathUtils.js";
import { FireworkExplosion } from "./FireworkExplosion.js";

export class Fireworks extends Particles {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game, {
            geometry: new THREE.IcosahedronGeometry(0.1),
            material: new THREE.MeshLambertMaterial({
                emissive: 0x009fff,
                emissiveIntensity: 10,
            }),
            count: 10,
            gravity: 1,
            position: () =>
                new THREE.Vector3(
                    randRange(-0.1, 0.1),
                    0,
                    randRange(-0.1, 0.1)
                ),
            velocity: () =>
                new THREE.Vector3().setFromSpherical(
                    new THREE.Spherical(
                        randRange(3, 4),
                        randRange(0, Math.PI / 12),
                        randRange(0, Math.PI * 2)
                    )
                ),
            lifeTime: () => randRange(2, 4),
        });

        this.game = game;

        /** @type {Set<FireworkExplosion>} */
        this.explosions = new Set();
    }

    /**
     * @param {number} i
     */
    reset(i) {
        if (i in this.positions) {
            const explosion = new FireworkExplosion(this.game);
            explosion.position.copy(this.positions[i]);
            this.add(explosion);
            this.explosions.add(explosion);
        }

        super.reset(i);
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        super.update(delta);

        for (const explosion of this.explosions) {
            explosion.update(delta);
            if (explosion.dead) this.explosions.delete(explosion);
        }
    }
}
