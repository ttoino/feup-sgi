import * as THREE from "three";
import { FontSpriteSheet } from "./FontSpriteSheet.js";

const PROP_PATTERN = /(\w+)=(?:(-?\d+(?:,-?\d+)+)|(-?\d+)|"([^"]*)")/g;

/**
 * @extends THREE.Loader<FontSpriteSheet>
 */
export class FontSpriteSheetLoader extends THREE.Loader {
    /**
     * @param {THREE.LoadingManager} [manager]
     */
    constructor(manager = THREE.DefaultLoadingManager) {
        super(manager);
    }

    /**
     * @param {string} url
     * @param {(font: FontSpriteSheet) => void} onLoad
     * @param {(progress: ProgressEvent) => void} onProgress
     * @param {(error: unknown) => void} onError
     */
    load(url, onLoad, onProgress, onError) {
        const loader = new THREE.FileLoader(this.manager);
        loader.setPath(this.path);
        loader.setResponseType("text/plain");
        loader.load(
            url,
            async (file) => {
                if (typeof file !== "string")
                    return onError(new Error("File is not a string"));

                onLoad(await this.parse(url, file));
            },
            onProgress,
            onError
        );
    }

    /**
     * @param {string} url
     * @param {string} file
     *
     * @returns {Promise<FontSpriteSheet>}
     */
    async parse(url, file) {
        const lines = file.split("\n");

        const font = new FontSpriteSheet();

        await Promise.allSettled(
            lines.map(async (line) => {
                const type = line.slice(0, line.indexOf(" "));

                const props = line.matchAll(PROP_PATTERN);

                /** @type {any} */
                const obj = {};

                for (const prop of props) {
                    const key = prop[1];

                    if (prop[2])
                        obj[key] = prop[2].split(",").map((v) => parseInt(v));
                    else if (prop[3]) obj[key] = parseInt(prop[3]);
                    else if (prop[4]) obj[key] = prop[4];
                }

                switch (type) {
                    case "info":
                        font.info = obj;
                        break;
                    case "common":
                        font.common = obj;
                        break;
                    case "page":
                        obj.texture = await new THREE.TextureLoader().loadAsync(
                            `${url.slice(0, url.lastIndexOf("/"))}/${obj.file}`
                        );

                        font.pages.set(obj.id, obj);
                        break;
                    case "char":
                        font.chars.set(obj.id, obj);
                        break;
                    case "kerning":
                        font.kernings.push(obj);
                        break;
                }
            })
        );

        return font;
    }
}
