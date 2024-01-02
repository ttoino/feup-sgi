import * as THREE from "three";
import { Game } from "./Game.js";
import { ALL, HELPERS } from "./Layers.js";

export class Picker {
    /**
     *
     * @param {Game} game
     * @param {number} [layer=0]
     */
    constructor(game, layer = ALL) {
        this.game = game;
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.layers = new THREE.Layers();
        this.layers.set(layer);
        this.helperLayers = new THREE.Layers();
        this.helperLayers.set(HELPERS);

        /** @type {THREE.Object3D?} */
        this.picked = null;

        this.picking = false;

        document.addEventListener("pointermove", this.onPointerMove.bind(this));
    }

    startPicking() {
        this.picking = true;
    }

    finishPicking() {
        this.picking = false;
        this.game.renderer.outlinePass.selectedObjects = [];
    }

    pick() {
        const intersections = this.raycaster.intersectObject(this.game.scene);

        let found = false;

        for (const intersection of intersections) {
            if (
                this.layers.test(intersection.object.layers) &&
                !this.helperLayers.test(intersection.object.layers)
            ) {
                this.picked = intersection.object;
                found = true;
            }

            intersection.object.traverseAncestors((parent) => {
                if (
                    !found &&
                    this.layers.test(parent.layers) &&
                    !this.helperLayers.test(parent.layers)
                ) {
                    this.picked = parent;
                    found = true;
                }
            });

            if (found) break;
        }

        if (!found) this.picked = null;
    }

    /**
     * @param {boolean} [cancelable=false]
     *
     * @returns {Promise<THREE.Object3D>}
     */
    pickOnClick(cancelable = false) {
        return new Promise((resolve, reject) => {
            this.startPicking();

            const clickListener = () => {
                if (!this.picking) {
                    document.removeEventListener("click", clickListener);
                    reject();
                }

                if (this.picked) {
                    const pickedObject = this.picked;
                    this.picked = null;

                    this.finishPicking();
                    document.removeEventListener("click", clickListener);
                    resolve(pickedObject);
                } else if (cancelable) {
                    this.finishPicking();
                    document.removeEventListener("click", clickListener);
                    reject();
                }
            };

            document.addEventListener("click", clickListener);
        });
    }

    /**
     * @param {PointerEvent} e
     */
    onPointerMove(e) {
        this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.game.activeCamera);

        if (this.picking) {
            this.pick();

            this.game.renderer.outlinePass.selectedObjects = this.picked
                ? [this.picked]
                : [];
        }
    }
}
