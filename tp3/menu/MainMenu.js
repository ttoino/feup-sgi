import * as THREE from "three";
import Menu from "./Menu.js";
import { MAIN_MENU, UI } from "../Layers.js";
import { Game } from "../Game.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Font } from "three/addons/loaders/FontLoader.js";

export class MainMenu extends Menu {
    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super();

        this.game = game;

        this.#init();

        this.nameValueXPos = 7;
        this.textSize = .75;
    }

    #init() {
        this.game.fontManager.loadFont('fonts/tron_typeface.json', (gameFont) => {

            this.gameFont = gameFont;

            const mainMenu = new THREE.Group();

            const mainMenuFrameGeometry = new THREE.TorusGeometry(7, 1, 4, 4);

            const playButtonGeom = new TextGeometry('Play Game', {
                font: gameFont,
                size: this.textSize,
                height: this.textSize / 4,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelOffset: 0,
                bevelSegments: 1
            });
            playButtonGeom.computeBoundingBox();
            const playButton = new THREE.Mesh(
                playButtonGeom,
                new THREE.MeshStandardMaterial({
                    color: 0x2f8ca3,
                    emissive: 0x2f8ca3,
                    emissiveIntensity: 5
                })
            );
            playButton.name = "play_button";
            playButton.layers.enable(UI);
            playButton.layers.enable(MAIN_MENU);

            playButton.position.x = -4;

            const exitButtonGeom = new TextGeometry('Exit', {
                font: gameFont,
                size: this.textSize,
                height: this.textSize / 4,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelOffset: 0,
                bevelSegments: 1
            });
            exitButtonGeom.computeBoundingBox();
            const exitButton = new THREE.Mesh(
                exitButtonGeom,
                new THREE.MeshStandardMaterial({
                    color: 0xf4af2d,
                    emissive: 0xf4af2d,
                    emissiveIntensity: 2
                })
            );
            exitButton.name = "exit_button";
            exitButton.layers.enable(UI);
            exitButton.layers.enable(MAIN_MENU);

            exitButton.position.y = -3;
            exitButton.position.x = -4;

            this.playerName = new THREE.Group();

            const playerNameLabelGeom = new TextGeometry('Name :', {
                font: gameFont,
                size: this.textSize,
                height: this.textSize / 4,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelOffset: 0,
                bevelSegments: 1
            });
            playerNameLabelGeom.computeBoundingBox();
            const playerNameLabel = new THREE.Mesh(
                playerNameLabelGeom,
                new THREE.MeshStandardMaterial({
                    color: 0xf4af2d,
                    emissive: 0xf4af2d,
                    emissiveIntensity: 2
                })
            );
            this.playerName.add(playerNameLabel)

            this.playerNameValue = this.#createTextGeometryForName("", gameFont, this.textSize)
            this.playerNameValue.position.x = this.nameValueXPos;
            this.playerName.add(this.playerNameValue)

            this.add(this.playerName)

            const frame = new THREE.Mesh(
                mainMenuFrameGeometry,
                new THREE.MeshStandardMaterial({ color: 0xffff00 })
            );

            frame.name = "main_menu_frame";

            frame.position.y = -1.5;
            frame.rotation.z = Math.PI / 4;

            const scale = 3;

            mainMenu.add(frame);

            mainMenu.add(playButton);
            mainMenu.add(exitButton);

            mainMenu.scale.x = scale
            playButton.scale.x = 1 / scale;
            exitButton.scale.x = 1 / scale;

            this.add(mainMenu);
        })
    }

    /**
     * 
     * @param {string} newName 
     */
    updateNameValue(newName) {
        if (this.playerNameValue && this.gameFont && this.playerName) {
            this.playerName.remove(this.playerNameValue)

            this.playerNameValue = this.#createTextGeometryForName(newName, this.gameFont, this.textSize)

            this.playerNameValue.position.x = this.nameValueXPos;

            this.playerName.add(this.playerNameValue)
        }
    }

    /**
     * 
     * @param {string} name
     * @param {Font} font 
     * @param {number} textSize 
     * @returns 
     */
    #createTextGeometryForName(name, font, textSize) {
        const nameValueGeom = new TextGeometry(name, {
            font: font,
            size: textSize,
            height: textSize / 4,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 1
        });
        nameValueGeom.computeBoundingBox();
        const nameValue = new THREE.Mesh(
            nameValueGeom,
            new THREE.MeshStandardMaterial({
                color: 0xf4af2d,
                emissive: 0xf4af2d,
                emissiveIntensity: 2
            })
        );

        return nameValue;
    }
}
