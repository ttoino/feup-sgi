import * as THREE from "three";
import Menu from "./Menu.js";
import { OBSTACLE_SELECTION_MENU, UI } from "../renderer/Layers.js";
import { Game } from "../game/Game.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export class ObstacleSelectionMenu extends Menu {
    /**
     *
     * @param {Game} game
     */
    constructor(game) {
        super(game);

        this.game = game;

        this.game.fontManager
            .load("fonts/tron_typeface.json")
            .then((gameFont) => {
                const vehicleSelectionMenu = new THREE.Group();

                const infoTextGeom = new TextGeometry(
                    "P i c k  a n  o b s t a c l e  t o \np l a c e  o n  t h e  t r a c k",
                    {
                        font: gameFont,
                        size: 1,
                        height: 0.25,
                        bevelEnabled: true,
                        bevelThickness: 0.1,
                        bevelSize: 0.1,
                        bevelOffset: 0,
                        bevelSegments: 1,
                    }
                );
                infoTextGeom.computeBoundingBox();
                const infoText = new THREE.Mesh(
                    infoTextGeom,
                    new THREE.MeshStandardMaterial({
                        color: 0xf4af2d,
                        emissive: 0xf4af2d,
                        emissiveIntensity: 2,
                    })
                );
                infoText.name = "info_text";
                infoText.layers.enable(UI);

                infoText.position.x = 10;
                infoText.position.y = 10;
                infoText.position.z = 1;

                infoText.rotateX(0.4);
                infoText.rotateY(Math.PI);

                infoText.scale.multiplyScalar(0.5);

                vehicleSelectionMenu.add(infoText);

                this.add(vehicleSelectionMenu);

                this.add(this.game.contents.obstaclePark);

                for (const obstacle of this.game.contents.obstacles) {
                    obstacle.layers.enable(OBSTACLE_SELECTION_MENU);

                    this.game.contents.obstaclePark.addToSpot(obstacle);
                }
            });
    }
}
