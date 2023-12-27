declare module 'three/addons/geometries/TextGeometry.js' {

    import * as THREE from 'three'

    import type { Font } from 'three/addons/loaders/FontLoader.js'

    interface TextGeometryParameters {
        font: Font;
        size?: number;
        height?: number;
        curveSegments?: number;
        bevelEnabled?: boolean;
        bevelThickness?: number;
        bevelSize?: number;
        bevelOffset?: number;
        bevelSegments?: number;
    }

    export class TextGeometry extends THREE.ExtrudeGeometry {
        type: 'TextGeometry';
        constructor(text: string, parameters: TextGeometryParameters): TextGeometry
    }
}