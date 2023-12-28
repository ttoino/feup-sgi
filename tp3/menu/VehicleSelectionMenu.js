import * as THREE from "three";
import Menu from "./Menu.js";
import { UI, VEHICLE_SELECTION_MENU } from "../Layers.js";
import { Game } from "../Game.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export class VehicleSelectionMenu extends Menu {
    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super();

        this.game = game;

        this.#init();
    }

    #init() {
        this.game.fontManager.loadFont('fonts/tron_typeface.json', (gameFont) => {

            const vehicleSelectionMenu = new THREE.Group();

            const infoTextGeom = new TextGeometry('Pick your and\nyour opponent\'s\nvehicles', {
                // @ts-ignore
                font: gameFont,
                size: 1,
                height: 0.25,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelOffset: 0,
                bevelSegments: 1
            });
            infoTextGeom.computeBoundingBox();
            const infoText = new THREE.Mesh(
                infoTextGeom,
                new THREE.MeshStandardMaterial({
                    color: 0xf4af2d,
                    emissive: 0xf4af2d,
                    emissiveIntensity: 2
                })
            );
            infoText.name = "info_text";
            infoText.layers.enable(UI);
            infoText.layers.enable(VEHICLE_SELECTION_MENU)

            infoText.position.x = -4.3;
            infoText.position.y = 4.5;
            infoText.position.z = -1;
            infoText.rotation.x = -0.4;
            infoText.scale.multiplyScalar(0.5);

            const fence = new THREE.Mesh(
                new THREE.TorusGeometry(5, 0.5, 4, 4),
                new THREE.MeshStandardMaterial({ color: 0xffff00 })
            );
            fence.rotation.x = Math.PI / 2;
            fence.rotation.z = Math.PI / 4;

            fence.scale.x = fence.scale.y = 2;

            vehicleSelectionMenu.add(infoText);
            vehicleSelectionMenu.add(fence);

            this.add(vehicleSelectionMenu);
        })
    }
}
