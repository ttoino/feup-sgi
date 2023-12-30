import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

export class ModelManager {
    /**
     * @param {unknown | undefined} options
     */
    constructor(options = {}) {
        this.options = options;

        /** @type {Record<string, THREE.Object3D>} */
        this.models = {};

        this.gltfLoader = new GLTFLoader();
        this.objLoader = new OBJLoader();
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

        /** @param {THREE.Object3D} model */
        const onLoad = (model) => {
            console.info(`Loaded model at ${modelPath}`);
            this.models[modelPath] = model;
            onModelLoaded(model);
        };

        /** @param {ProgressEvent} e */
        const onProgress = (e) =>
            console.log(`${modelPath}: ${(e.loaded / e.total) * 100}% loaded`);

        /** @param {unknown} e */
        const onError = (e) =>
            console.error(`An error happened while loading ${modelPath}: ${e}`);

        if (modelPath.match(/\.gl(b|tf)$/))
            this.gltfLoader.load(
                modelPath,

                (model) => {
                    model.scene.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            // Blender exports models with double-sided materials
                            if (child.material instanceof THREE.Material)
                                child.material.side = THREE.FrontSide;

                            // Transparent materials
                            if (
                                child.material instanceof
                                    THREE.MeshStandardMaterial &&
                                child.material.opacity < 1
                            ) {
                                child.material.transparent = true;
                            }
                        }
                    });

                    onLoad(model.scene);
                },

                onProgress,
                onError
            );
        else if (modelPath.match(/\.obj$/))
            this.objLoader.load(modelPath, onLoad, onProgress, onError);
        else console.error(`Unsupported format for model ${modelPath}`);
    }
}
