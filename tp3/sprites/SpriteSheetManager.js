import { FontLoader } from "three/addons/loaders/FontLoader.js";

export class FontManager {
    /**
     * @param {unknown | undefined} options
     */
    constructor(options = {}) {
        this.options = options;

        /**
         * @type {Record<string, import('three/addons/loaders/FontLoader.js').Font>}
         */
        this.fonts = {};

        this.fontLoader = new FontLoader();
    }

    /**
     * @param {string} fontPath
     * @param {(font: import('three/addons/loaders/FontLoader.js').Font) => void} onFontLoaded
     */
    loadFont(fontPath, onFontLoaded) {

        console.log(`Loading font at ${fontPath}`);
        console.log(this.fonts, this.fonts[fontPath], fontPath);

        if (this.fonts[fontPath]) {
            onFontLoaded(this.fonts[fontPath]);
            return;
        }

        this.fontLoader.load(
            fontPath,

            (font) => {
                console.info(`Loaded font at ${fontPath}`);

                this.fonts[fontPath] = font;
                onFontLoaded(font);
            },

            function (xhr) {
                console.log(
                    `${fontPath}: ${(xhr.loaded / xhr.total) * 100}% loaded`
                );
            },

            function (err) {
                console.error(
                    `An error happened while loading ${fontPath}: ${err}`
                );
            }
        );
    }
}
