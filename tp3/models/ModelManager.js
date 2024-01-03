import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { AssetManager } from "../AssetManager.js";

/**
 * @extends {AssetManager<THREE.Object3D>}
 */
export class ModelManager extends AssetManager {
    constructor() {
        super();

        this.gltfLoader = new GLTFLoader();
        this.objLoader = new OBJLoader();
    }

    /**
     * @protected
     * @override
     *
     * @param {string} modelPath
     * @param {(model: THREE.Object3D) => void} onModelLoaded
     * @param {(progress: ProgressEvent) => void} onProgress
     * @param {(error: unknown) => void} onError
     */
    loadNoCache(modelPath, onModelLoaded, onProgress, onError) {
        if (modelPath.match(/\.gl(b|tf)$/))
            this.gltfLoader.load(
                modelPath,
                (gltf) => {
                    gltf.scene.traverse((child) => {
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

                    onModelLoaded(gltf.scene);
                },
                onProgress,
                onError
            );
        else if (modelPath.match(/\.obj$/))
            this.objLoader.load(modelPath, onModelLoaded, onProgress, onError);
        else console.error(`Unsupported format for model ${modelPath}`);
    }
}
