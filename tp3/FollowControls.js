/// @ts-check

import * as THREE from "three";

export class FollowControls {
    /**
     * @param {THREE.Camera} camera
     * @param {THREE.Object3D} target
     * @param {{
     *   speed?: number,
     *   targetHeight?: number,
     *   targetDistance?: number,
     *   targetRotation?: number
     * }} [options]
     */
    constructor(camera, target, options = {}) {
        this.camera = camera;
        this.target = target;

        this.speed = options.speed ?? 2;

        this.targetHeight = options.targetHeight ?? 5;
        this.targetDistance = options.targetDistance ?? 10;
        this.targetRotation = options.targetRotation ?? 0;

        this.camera.position.lerp(
            new THREE.Vector3()
                .setFromCylindricalCoords(
                    this.targetDistance,
                    this.targetRotation + this.target.rotation.y,
                    this.targetHeight
                )
                .add(this.target.position),
            1
        );
        this.camera.lookAt(this.target.position);
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        const targetPos = new THREE.Vector3()
            .setFromCylindricalCoords(
                this.targetDistance,
                this.targetRotation + this.target.rotation.y,
                this.targetHeight
            )
            .add(this.target.position);

        this.camera.position.lerp(targetPos, Math.min(1, this.speed * delta));

        this.camera.lookAt(this.target.position);
    }
}
