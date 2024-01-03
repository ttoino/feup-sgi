import { AssetManager } from "../../AssetManager.js";
import { FontSpriteSheet } from "./FontSpriteSheet.js";
import { FontSpriteSheetLoader } from "./FontSpriteSheetLoader.js";

/**
 * @extends AssetManager<FontSpriteSheet>
 */
export class FontSpriteSheetManager extends AssetManager {
    constructor() {
        super(new FontSpriteSheetLoader());
    }
}
