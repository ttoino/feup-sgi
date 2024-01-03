import * as THREE from "three";
import { Game } from "../game/Game.js";

export class Materials {
    /**
     * @param {Game} game
     */
    constructor(game) {
        /** @type {Map<string, THREE.Material>} */
        this.map = new Map();

        game.modelManager.load("models/materials.glb").then((model) => {
            model.traverse((child) => {
                if (
                    child instanceof THREE.Mesh &&
                    child.material &&
                    child.material.name
                )
                    this.map.set(child.material.name, child.material);
            });
        });
    }

    /**
     * @param {THREE.Object3D} [object]
     * @param {THREE.Material | string} [material]
     */
    changeGlass(object, material) {
        if (!object) return;

        if (!material) material = this.map.get("glass_simple");
        else if (typeof material === "string")
            material = this.map.get(material);

        object.traverse((child) => {
            if (
                child instanceof THREE.Mesh &&
                child.material &&
                child.material.name.includes("glass")
            )
                child.material = material;
        });
    }

    /**
     * @param {THREE.Object3D} [object]
     * @param {THREE.Material | string} [material]
     */
    changeGlow(object, material) {
        if (!object) return;

        if (!material) material = this.map.get("glow_blue");
        else if (typeof material === "string")
            material = this.map.get(material);

        object.traverse((child) => {
            if (
                child instanceof THREE.Mesh &&
                child.material &&
                child.material.name.includes("glow")
            )
                child.material = material;
        });
    }
}
