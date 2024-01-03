import * as THREE from "three";

/**
 * @typedef {{
 *     face: string;
 *     size: number;
 *     bold: boolean;
 *     italic: boolean;
 *     charset: string;
 *     unicode: boolean;
 *     stretchH: number;
 *     smooth: boolean;
 *     aa: number;
 *     padding: [number, number, number, number];
 *     spacing: [number, number];
 *     outline: number;
 * }} FontSpriteSheetInfo
 *
 * @typedef {{
 *     lineHeight: number;
 *     base: number;
 *     scaleW: number;
 *     scaleH: number;
 *     pages: number;
 *     packed: boolean;
 *     alphaChnl: 0 | 1 | 2 | 3 | 4;
 *     redChnl: 0 | 1 | 2 | 3 | 4;
 *     greenChnl: 0 | 1 | 2 | 3 | 4;
 *     blueChnl: 0 | 1 | 2 | 3 | 4;
 * }} FontSpriteSheetCommon
 *
 * @typedef {{
 *     id: number;
 *     file: string;
 *     texture: THREE.Texture;
 * }} FontSpriteSheetPage
 *
 * @typedef {{
 *     id: number;
 *     x: number;
 *     y: number;
 *     width: number;
 *     height: number;
 *     xoffset: number;
 *     yoffset: number;
 *     xadvance: number;
 *     page: number;
 *     chnl: number;
 * }} FontSpriteSheetChar
 *
 * @typedef {{
 *     first: number;
 *     second: number;
 *     amount: number;
 * }} FontSpriteSheetKerning
 */

export class FontSpriteSheet {
    /**
     * @param {{
     *     info?: FontSpriteSheetInfo;
     *     common?: FontSpriteSheetCommon;
     *     pages?: FontSpriteSheetPage[];
     *     chars?: FontSpriteSheetChar[];
     *     kernings?: FontSpriteSheetKerning[];
     * }} params
     */
    constructor({
        info = {
            face: "",
            size: 0,
            bold: false,
            italic: false,
            charset: "",
            unicode: false,
            stretchH: 0,
            smooth: false,
            aa: 0,
            padding: [0, 0, 0, 0],
            spacing: [0, 0],
            outline: 0,
        },
        common = {
            lineHeight: 0,
            base: 0,
            scaleW: 0,
            scaleH: 0,
            pages: 0,
            packed: false,
            alphaChnl: 0,
            redChnl: 0,
            greenChnl: 0,
            blueChnl: 0,
        },
        pages = [],
        chars = [],
        kernings = [],
    } = {}) {
        this.info = info;
        this.common = common;
        this.pages = new Map(pages.map((page) => [page.id, page]));
        this.chars = new Map(chars.map((char) => [char.id, char]));
        this.kernings = kernings;
    }
}
