/// @ts-check

import * as THREE from "three";
import { MyApp } from "./MyApp.js";
import { ALL, HELPERS } from "./Layers.js";

export class Picker {
    /**
     *
     * @param {MyApp} app
     * @param {number} [layer=0]
     */
    constructor(app, layer = ALL) {
        this.app = app;
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.layers = new THREE.Layers();
        this.layers.set(layer);
        this.helperLayers = new THREE.Layers();
        this.helperLayers.set(HELPERS);

        /** @type {THREE.Object3D?} */
        this.picked = null;

        this.picking = false;

        this.helper = new THREE.Mesh(
            new THREE.SphereGeometry(0.1),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        this.helper.layers = this.helperLayers;

        document.addEventListener("pointermove", this.onPointerMove.bind(this));
    }

    startPicking() {
        this.picking = true;
    }

    finishPicking() {
        this.picking = false;
    }

    pick() {
        const intersections = this.raycaster.intersectObject(this.app.scene);

        console.debug(intersections);

        let found = false;

        for (const intersection of intersections) {
            if (this.layers.test(intersection.object.layers) && !this.helperLayers.test(intersection.object.layers)) {
                this.picked = intersection.object;
                found = true;
            }

            intersection.object.traverseAncestors((parent) => {
                if (!found && this.layers.test(parent.layers) && !this.helperLayers.test(parent.layers)) {
                    this.picked = parent;
                    found = true;
                }
            });

            if (found) break;
        }

        if (!found) this.picked = null;
    }

    pickOnClick(cancelable = false) {
        return new Promise((resolve, reject) => {
            this.startPicking();

            const clickListener = (e) => {
                if (this.picked) {
                    this.finishPicking();
                    document.removeEventListener("click", clickListener);
                    resolve(this.picked);
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

        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);

        if (this.picking) {
            this.pick();

            this.app.outlinePass.selectedObjects = this.picked
                ? [this.picked]
                : [];
        }
    }
}
