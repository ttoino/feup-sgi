import * as THREE from "three";

export class FollowControls {
    /**
     * @param {THREE.Camera} camera
     * @param {THREE.Object3D} target
     * @param {{
     *   positionSpeed?: number,
     *   rotationSpeed?: number,
     *   targetHeight?: number,
     *   targetDistance?: number,
     *   targetRotation?: number
     * }} [options]
     */
    constructor(camera, target, options = {}) {
        this.camera = camera;
        this.target = target;

        this.positionSpeed = options.positionSpeed ?? 5;
        this.rotationSpeed = options.rotationSpeed ?? 20;

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
        
        const prevPos = this.camera.position.clone();
        this.camera.position.set(targetPos.x, targetPos.y, targetPos.z);
        const prevRotation = this.camera.quaternion.clone();
        this.camera.lookAt(this.target.position);
        
        this.camera.position.lerp(
            prevPos,
            1 - Math.min(1, this.positionSpeed * delta)
        );
        this.camera.quaternion.slerp(
            prevRotation,
            1 - Math.min(1, this.rotationSpeed * delta)
        );
    }
}
