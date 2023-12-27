declare module "three/addons/loaders/GLTFLoader.js" {
    import * as THREE from "three";

    interface GLTF {
        animations: THREE.AnimationClip[];
        asset: Record<string, unknown>;
        cameras: THREE.Camera[];
        scene: THREE.Group;
        scenes: THREE.Group[];
        userData: Record<string, unknown>;
    }

    export class GLTFLoader extends THREE.Loader<GLTF, string> {
        constructor(manager?: THREE.LoadingManager);
    }
}
