import { FontLoader } from 'three/addons/loaders/FontLoader.js';

export default class FontManager {

    /**
     * 
     * @param {unknown | undefined} options 
     */
    constructor(options = {}) {
        this.options = options

        /**
         * @type {Record<string, import('three/addons/loaders/FontLoader.js').Font>}
         */
        this.fonts = {}

        this.fontLoader = new FontLoader();
    }

    /**
     * 
     * @param {string} fontPath 
     * @param {(font: import('three/addons/loaders/FontLoader.js').Font) => void} onFontLoaded
     */
    loadFont(fontPath, onFontLoaded) {

        if (this.fonts[fontPath]) {
            onFontLoaded(this.fonts[fontPath]);
            return;
        }

        this.fontLoader.load(fontPath,
            // onLoad callback
            (font) => {
                // do something with the font
                console.log(`Loaded font at ${fontPath}`);

                this.fonts[fontPath] = font;
                onFontLoaded(font);
            },

            // onProgress callback
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },

            // onError callback
            function (err) {
                console.log('An error happened');
            }
        );
    }
}