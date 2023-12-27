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

declare module "three/addons/loaders/FontLoader.js" {
    import * as THREE from "three";

    export interface Font {
        isFont: true;
        type: 'Font';
        data: unknown
    }

    export class FontLoader extends THREE.Loader<Font, string> {
        constructor(manager?: THREE.LoadingManager);
    }
}
