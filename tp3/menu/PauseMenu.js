import * as THREE from "three";
import Menu from "./Menu.js";
import { PAUSE_MENU, UI } from "../renderer/Layers.js";
import { Game } from "../game/Game.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export class PauseMenu extends Menu {
    /**
     *
     * @param {Game} game
     */
    constructor(game) {
        super(game);

        this.game = game;

        this.#init();
    }

    #init() {
        this.game.fontManager
            .load("fonts/tron_typeface.json")
            .then((gameFont) => {
                const pauseMenu = new THREE.Group();

                const resumeButtonGeom = new TextGeometry("Resume", {
                    font: gameFont,
                    size: 1,
                    height: 0.25,
                    bevelEnabled: true,
                    bevelThickness: 0.1,
                    bevelSize: 0.1,
                    bevelOffset: 0,
                    bevelSegments: 1,
                });
                resumeButtonGeom.computeBoundingBox();
                const resumeButton = new THREE.Mesh(
                    resumeButtonGeom,
                    new THREE.MeshStandardMaterial({
                        color: 0x2f8ca3,
                        emissive: 0x2f8ca3,
                        emissiveIntensity: 5,
                    })
                );
                resumeButton.name = "resume_button";
                resumeButton.layers.enable(UI);
                resumeButton.layers.enable(PAUSE_MENU);

                resumeButton.position.y = 1;
                resumeButton.position.x = -2.5;

                const mainMenuButtonGeom = new TextGeometry(
                    "Back to\nMain Menu",
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
                mainMenuButtonGeom.computeBoundingBox();
                const mainMenuButton = new THREE.Mesh(
                    mainMenuButtonGeom,
                    new THREE.MeshStandardMaterial({
                        color: 0xf4af2d,
                        emissive: 0xf4af2d,
                        emissiveIntensity: 2,
                    })
                );
                mainMenuButton.name = "main_menu_button";
                mainMenuButton.layers.enable(UI);
                mainMenuButton.layers.enable(PAUSE_MENU);

                mainMenuButton.position.y = -2;
                mainMenuButton.position.x = -2.7;

                const xScale = 2;
                const yScale = 1.2;

                pauseMenu.add(resumeButton);
                pauseMenu.add(mainMenuButton);

                pauseMenu.scale.x = xScale;
                pauseMenu.scale.y = yScale;

                resumeButton.scale.x = 1 / xScale;
                resumeButton.scale.y = 1 / yScale;
                mainMenuButton.scale.x = 1 / xScale;
                mainMenuButton.scale.y = 1 / yScale;

                this.add(pauseMenu);
            });
    }
}
