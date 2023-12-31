import * as THREE from "three";
import { ALL_VEHICLES, HELPERS } from "../Layers.js";
import { Game } from "../Game.js";
import Vehicle from "./Vehicle.js";

export class LightCar extends Vehicle {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game);

        this.game = game;

        /** @type {THREE.Object3D[]} */
        this.steers = [];
        /** @type {THREE.Object3D[]} */
        this.wheels = [];

        this.game.modelManager.loadModel(`models/light_car.glb`, (gltf) => {
            this.model = gltf;
            this.add(gltf);

            gltf.traverse((child) => {
                if (child.name.includes("steer")) {
                    this.steers.push(child);
                } else if (child.name.includes("wheel")) {
                    this.wheels.push(child);
                } else if (child.name.includes("center")) {
                    this.center = child;
                    this.cubeCamera.position.copy(child.position);
                }

                if (
                    child instanceof THREE.Mesh &&
                    child.material instanceof THREE.MeshStandardMaterial
                ) {
                    child.material.envMap = this.cubeRenderTarget.texture;
                }
            });
        });

        this.layers.enable(ALL_VEHICLES);

        this.directionHelper = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 1),
            ]),
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        this.directionHelper.layers.set(HELPERS);
        this.add(this.directionHelper);

        this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
            type: THREE.FloatType,
        });
        this.cubeCamera = new THREE.CubeCamera(
            0.1,
            1000,
            this.cubeRenderTarget
        );
        this.add(this.cubeCamera);
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        super.update(delta);
        this.directionHelper.scale.z = this.forwardSpeed;

        this.steers.forEach((steer) => {
            steer.rotation.y = THREE.MathUtils.lerp(
                steer.rotation.y,
                (this.rotationRad * Math.PI) / 6,
                Math.min(1, delta * 4)
            );
        });

        this.wheels.forEach((wheel) => {
            wheel.rotation.x += this.forwardSpeed * delta;
        });

        if (this.model) this.model.visible = false;
        this.cubeCamera.update(this.game.renderer.renderer, this.game.scene);
        if (this.model) this.model.visible = true;
    }
}
