import * as THREE from "three";
import * as MathUtils from "./MathUtils.js";

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
        const targetPosition = this.target.getWorldPosition(
            new THREE.Vector3()
        );
        const targetQuaternion = this.target.getWorldQuaternion(
            new THREE.Quaternion()
        );
        const targetRotation = new THREE.Euler().setFromQuaternion(
            targetQuaternion,
            "XZY"
        );

        const cylindrical = new THREE.Cylindrical().setFromVector3(
            this.camera.position.clone().add(targetPosition.clone().negate())
        );
        const targetCylindrical = new THREE.Cylindrical(
            this.targetDistance,
            this.targetRotation + targetRotation.y,
            this.targetHeight
        );
        const lerpedCylindrical = MathUtils.clerp(
            cylindrical,
            targetCylindrical,
            this.positionSpeed * delta,
            this.rotationSpeed * delta
        );

        this.camera.position
            .setFromCylindrical(targetCylindrical)
            .add(targetPosition);
        const prevRotation = this.camera.quaternion.clone();
        this.camera.lookAt(targetPosition);

        this.camera.position
            .setFromCylindrical(lerpedCylindrical)
            .add(targetPosition);
        this.camera.quaternion.slerp(
            prevRotation,
            1 - Math.min(1, this.rotationSpeed * delta)
        );
    }
}
