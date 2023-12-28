import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export class ModelManager {
    /**
     * @param {unknown | undefined} options
     */
    constructor(options = {}) {
        this.options = options;

        /** @type {Record<string, THREE.Object3D>} */
        this.models = {};

        this.gltfLoader = new GLTFLoader();
    }

    /**
     * @param {string} modelPath
     * @param {(model: THREE.Object3D) => void} onModelLoaded
     */
    loadModel(modelPath, onModelLoaded) {
        if (this.models[modelPath]) {
            onModelLoaded(this.models[modelPath]);
            return;
        }

        if (modelPath.match(/\.gl(b|tf)$/))
            this.gltfLoader.load(
                modelPath,

                (model) => {
                    console.info(`Loaded model at ${modelPath}`);

                    model.scene.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;

                            if (
                                child.material instanceof
                                    THREE.MeshStandardMaterial &&
                                child.material.opacity < 1
                            ) {
                                child.material.transparent = true;
                            }
                        }
                    });

                    this.models[modelPath] = model.scene;
                    onModelLoaded(model.scene);
                },

                function (xhr) {
                    console.log(
                        `${modelPath}: ${
                            (xhr.loaded / xhr.total) * 100
                        }% loaded`
                    );
                },

                function (err) {
                    console.error(
                        `An error happened while loading ${modelPath}: ${err}`
                    );
                }
            );
        else console.error(`Unsupported format for model ${modelPath}`);
    }
}
