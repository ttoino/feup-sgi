import * as THREE from "three";
import { Game } from "../Game.js";
import { Particles } from "./Particles.js";
import { randRange } from "../MathUtils.js";

export class Fireworks extends Particles {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game, {
            geometry: new THREE.IcosahedronGeometry(0.01),
            material: new THREE.MeshLambertMaterial({
                emissive: 0x009fff,
                emissiveIntensity: 10,
            }),
            count: 1000,
            gravity: 1,
            velocity: () =>
                new THREE.Vector3().setFromSpherical(
                    new THREE.Spherical(
                        randRange(2, 4),
                        randRange(0, Math.PI / 12),
                        randRange(0, Math.PI * 2)
                    )
                ),
            lifeTime: () => randRange(3, 6),
        });
    }
}
