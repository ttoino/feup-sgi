import * as THREE from "three";
import Menu from "./Menu.js";
import { OBSTACLE_SELECTION_MENU, UI, VEHICLE_SELECTION_MENU } from "../Layers.js";
import { Game } from "../Game.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export class ObstacleSelectionMenu extends Menu {
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

            const infoTextGeom = new TextGeometry('Pick an obstacle to place on the track', {
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

            infoText.position.x = -4.3;
            infoText.position.y = 4.5;
            infoText.position.z = -1;
            infoText.rotation.x = -0.4;
            infoText.scale.multiplyScalar(0.5);

            vehicleSelectionMenu.add(infoText);

            this.add(vehicleSelectionMenu);

            const baseX = -1;
            for (let i = 0; i < this.game.contents.obstacles.length; i++) {

                const obstacle = this.game.contents.obstacles[i];

                obstacle.position.x = baseX + i * 3;
                obstacle.position.y = 0;
                obstacle.position.z = 0;
                obstacle.rotation.x = 0;
                obstacle.rotation.y = 0;
                obstacle.rotation.z = 0;
                obstacle.scale.x = obstacle.scale.y = obstacle.scale.z = 1;
                obstacle.layers.enable(OBSTACLE_SELECTION_MENU);
                this.add(obstacle);
            }
        })
    }
}
