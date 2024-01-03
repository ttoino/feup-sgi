import * as THREE from "three";
import { Game } from "../../Game.js";
import { FontSpriteSheet } from "./FontSpriteSheet.js";
import { Sprite } from "../Sprite.js";

export class TextSprite extends THREE.Object3D {
    /**
     * @param {Game} game
     * @param {string} text
     * @param {FontSpriteSheet} font
     * @param {number} size
     * @param {THREE.Material & { map: THREE.Texture | null }} material
     */
    constructor(game, text, font, size, material) {
        super();

        this.game = game;

        this.text = text;
        this.font = font;
        this.size = size;
        /** @type {Map<number, THREE.Material & { map: THREE.Texture }>} */
        this.pageMaterials = new Map();

        this.font.pages.forEach((page) => {
            const pageMaterial = material.clone();
            pageMaterial.map = page.texture;
            pageMaterial.map.generateMipmaps = false;
            pageMaterial.map.magFilter = THREE.NearestFilter;
            pageMaterial.map.minFilter = THREE.NearestFilter;
            // @ts-ignore
            this.pageMaterials.set(page.id, pageMaterial);
        });

        this.create();
    }

    create() {
        this.clear();

        const textureSize = new THREE.Vector2(
            this.font.common.scaleW,
            this.font.common.scaleH
        );
        const position = new THREE.Vector3(0, 0, 0);
        this.scale.setScalar(this.size / this.font.common.base);

        for (const char of this.text) {
            if (char === "\n") {
                position.x = 0;
                position.y -= this.font.common.lineHeight;
                continue;
            }

            const charData = this.font.chars.get(char.charCodeAt(0));

            if (!charData) continue;

            const material = this.pageMaterials.get(charData.page);

            if (!material) continue;

            console.log(charData);

            const sprite = new Sprite(
                new THREE.Box2(
                    new THREE.Vector2(
                        charData.x,
                        textureSize.y - (charData.y + charData.height)
                    ).divide(textureSize),
                    new THREE.Vector2(
                        charData.x + charData.width,
                        textureSize.y - charData.y
                    ).divide(textureSize)
                ),
                charData.width,
                charData.height,
                material
            );
            sprite.position
                .copy(position)
                .add(new THREE.Vector3(charData.xoffset, -charData.yoffset, 0));

            this.add(sprite);

            position.x += charData.xadvance;
        }
    }
}
