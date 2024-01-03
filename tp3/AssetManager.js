import * as THREE from "three";

/**
 * @abstract
 *
 * @template A
 * @template {THREE.Loader<A>} [L=THREE.Loader<A>]
 */
export class AssetManager {
    /**
     * @param {L} [loader]
     */
    constructor(loader) {
        /** @type {Record<string, Promise<A> | undefined>} */
        this.assets = {};

        /** @type {L | undefined} */
        this.loader = loader;
    }

    /**
     * @protected
     *
     * @param {string} assetPath
     * @param {(asset: A) => void} onAssetLoaded
     * @param {(progress: ProgressEvent) => void} onProgress
     * @param {(error: unknown) => void} onError
     */
    loadNoCache(assetPath, onAssetLoaded, onProgress, onError) {
        this.loader?.load(assetPath, onAssetLoaded, onProgress, onError);
    }

    /**
     * @param {string} assetPath
     *
     * @returns {Promise<A>}
     */
    load(assetPath) {
        console.log(`Loading ${assetPath}`);

        let promise = this.assets[assetPath];
        if (promise) return promise;

        promise = new Promise((resolve, reject) => {
            this.loadNoCache(
                assetPath,
                (asset) => {
                    console.info(`Loaded ${assetPath}`);
                    resolve(asset);
                },
                (progress) => {
                    console.log(
                        `${assetPath}: ${
                            (progress.loaded / progress.total) * 100
                        }% loaded`
                    );
                },
                (error) => {
                    console.error(
                        `Got error while loading ${assetPath}: ${error}`
                    );
                }
            );
        });

        this.assets[assetPath] = promise;
        return promise;
    }
}
