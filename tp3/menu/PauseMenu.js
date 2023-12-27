import * as THREE from "three";
import Menu from "./Menu.js";
import { PAUSE_MENU, UI } from "../Layers.js";
import { Game } from "../Game.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export class PauseMenu extends Menu {
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

            const pauseMenu = new THREE.Group();

            const pauseMenuFrameGeometry = new THREE.TorusGeometry(7, 1, 4, 4);

            const resumeButtonGeom = new TextGeometry('Resume', {
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
            resumeButtonGeom.computeBoundingBox();
            const resumeButton = new THREE.Mesh(
                resumeButtonGeom,
                new THREE.MeshStandardMaterial({
                    color: 0x2f8ca3,
                    emissive: 0x2f8ca3,
                    emissiveIntensity: 5
                })
            );
            resumeButton.name = "resume_button";
            resumeButton.layers.enable(UI);
            resumeButton.layers.enable(PAUSE_MENU);

            resumeButton.position.y = 1;
            resumeButton.position.x = -2.5;

            const mainMenuButtonGeom = new TextGeometry('Back to\nMain Menu', {
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
            mainMenuButtonGeom.computeBoundingBox();
            const mainMenuButton = new THREE.Mesh(
                mainMenuButtonGeom,
                new THREE.MeshStandardMaterial({
                    color: 0xf4af2d,
                    emissive: 0xf4af2d,
                    emissiveIntensity: 2
                })
            );
            mainMenuButton.name = "main_menu_button";
            mainMenuButton.layers.enable(UI);
            mainMenuButton.layers.enable(PAUSE_MENU);

            mainMenuButton.position.y = -2;
            mainMenuButton.position.x = -2.7;

            const frame = new THREE.Mesh(
                pauseMenuFrameGeometry,
                new THREE.MeshStandardMaterial({ color: 0xffff00 })
            );

            frame.name = "pause_frame";

            frame.position.y = -1.5;
            frame.rotation.z = Math.PI / 4;

            const xScale = 2;
            const yScale = 1.2;

            pauseMenu.add(frame);

            pauseMenu.add(resumeButton);
            pauseMenu.add(mainMenuButton);

            pauseMenu.scale.x = xScale
            pauseMenu.scale.y = yScale

            resumeButton.scale.x = 1 / xScale;
            resumeButton.scale.y = 1 / yScale;
            mainMenuButton.scale.x = 1 / xScale;
            mainMenuButton.scale.y = 1 / yScale;

            this.add(pauseMenu);
        })
    }
}
