import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { AssetManager } from "../AssetManager.js";

/**
 * @extends {AssetManager<import('three/addons/loaders/FontLoader.js').Font>}
 */
export class FontManager extends AssetManager {
    constructor() {
        super(new FontLoader());
    }
}
