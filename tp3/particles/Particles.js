import { Game } from "../Game.js";
import * as THREE from "three";

export class Particles extends THREE.InstancedMesh {
    /**
     * @param {Game} game
     * @param {{
     *     geometry?: THREE.BufferGeometry,
     *     material?: THREE.Material,
     *     count?: number,
     *     gravity?: number,
     *     position?: ((i: number) => THREE.Vector3) | THREE.Vector3,
     *     velocity?: ((i: number) => THREE.Vector3) | THREE.Vector3,
     *     lifeTime?: ((i: number) => number) | number,
     * }} params
     */
    constructor(
        game,
        { geometry, material, count, gravity, position, velocity, lifeTime }
    ) {
        super(
            geometry ?? new THREE.BufferGeometry(),
            material ?? new THREE.MeshBasicMaterial(),
            count ?? 100
        );

        this.positionGenerator =
            position instanceof Function
                ? position
                : () => position?.clone() ?? new THREE.Vector3();
        this.velocityGenerator =
            velocity instanceof Function
                ? velocity
                : () => velocity?.clone() ?? new THREE.Vector3().random();
        this.lifeTimeGenerator =
            lifeTime instanceof Function ? lifeTime : () => lifeTime ?? 1;

        /** @type {THREE.Vector3[]} */
        this.positions = [];
        /** @type {THREE.Vector3[]} */
        this.velocities = [];
        /** @type {number[]} */
        this.lifeTimes = [];
        this.gravity = gravity ?? 0;

        this.reset();
    }

    /**
     * @param {number} [i]
     */
    reset(i) {
        if (i == null) {
            for (let i = 0; i < this.count; i++) this.reset(i);
            return;
        }

        this.positions[i] = this.positionGenerator(i);
        this.velocities[i] = this.velocityGenerator(i);
        this.lifeTimes[i] = this.lifeTimeGenerator(i);
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        for (let i = 0; i < this.count; i++) {
            this.lifeTimes[i] -= delta;

            if (this.lifeTimes[i] <= 0) {
                this.reset(i);
            } else {
                this.positions[i].addScaledVector(this.velocities[i], delta);
                this.velocities[i].y -= this.gravity * delta;

                this.setMatrixAt(
                    i,
                    new THREE.Matrix4().makeTranslation(this.positions[i])
                );
            }
        }

        this.instanceMatrix.needsUpdate = true;
    }
}
