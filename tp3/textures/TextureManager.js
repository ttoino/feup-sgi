import * as THREE from "three";
import { AssetManager } from "../AssetManager.js";

/**
 * @extends {AssetManager<THREE.Texture>}
 */
export class TextureManager extends AssetManager {
    constructor() {
        super(new THREE.TextureLoader());
    }
}
