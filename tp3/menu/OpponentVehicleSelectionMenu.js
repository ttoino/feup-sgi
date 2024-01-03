import * as THREE from "three";
import Menu from "./Menu.js";
import { UI, VEHICLE_SELECTION_MENU } from "../renderer/Layers.js";
import { Game } from "../game/Game.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export class OpponentVehicleSelectionMenu extends Menu {
    /**
     *
     * @param {Game} game
     */
    constructor(game) {
        super(game);

        this.#init();
    }

    #init() {
        this.game.fontManager
            .load("fonts/tron_typeface.json")
            .then((gameFont) => {
                const vehicleSelectionMenu = new THREE.Group();

                const infoTextGeom = new TextGeometry(
                    "P i c k  y o u r\no p p o n e n t ' s  v e h i c l e",
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

                infoText.position.x = -8;
                infoText.position.y = 10;
                infoText.position.z = -1;
                infoText.rotation.x = -0.4;
                infoText.scale.multiplyScalar(0.5);

                vehicleSelectionMenu.add(infoText);

                this.add(vehicleSelectionMenu);

                this.add(this.game.contents.opponentPark);

                for (const vehicle of this.game.contents.opponentVehicles) {
                    vehicle.layers.enable(VEHICLE_SELECTION_MENU);

                    this.game.contents.opponentPark.addToSpot(vehicle);
                }
            });
    }
}
