import * as THREE from "three";
import { Game } from "../game/Game.js";

export default class Outdoor extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.game = game;

        this.screen = new THREE.Object3D();

        game.modelManager.load("models/outdoor.glb").then((gltf) => {
            const model = gltf.clone();

            this.add(model);

            model.traverse((child) => {
                if (child.name.includes("screen")) this.screen = child;
            });

            this.onLoad();
        });
    }

    onLoad() {}

    /**
     * @param {number} delta
     */
    update(delta) {}
}
