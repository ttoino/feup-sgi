import * as THREE from "three";
import Menu from "./Menu.js";
import { MAIN_MENU, UI } from "../renderer/Layers.js";
import { Game } from "../game/Game.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Font } from "three/addons/loaders/FontLoader.js";

export class MainMenu extends Menu {
    /**
     *
     * @param {Game} game
     */
    constructor(game) {
        super(game);

        this.#init();

        this.nameValueXPos = 7;
        this.textSize = 0.75;
    }

    #init() {
        this.game.fontManager
            .load("fonts/tron_typeface.json")
            .then((gameFont) => {
                this.gameFont = gameFont;
                const mainMenu = new THREE.Group();

                const playButtonGeom = new TextGeometry("Play Game", {
                    font: gameFont,
                    size: this.textSize,
                    height: this.textSize / 4,
                    bevelEnabled: true,
                    bevelThickness: 0.1,
                    bevelSize: 0.1,
                    bevelOffset: 0,
                    bevelSegments: 1,
                });
                playButtonGeom.computeBoundingBox();
                const playButton = new THREE.Mesh(
                    playButtonGeom,
                    new THREE.MeshStandardMaterial({
                        color: 0x2f8ca3,
                        emissive: 0x2f8ca3,
                        emissiveIntensity: 5,
                    })
                );
                playButton.name = "play_button";
                playButton.layers.enable(UI);
                playButton.layers.enable(MAIN_MENU);

                playButton.position.x = -1.15;
                playButton.position.y = -4;

                const exitButtonGeom = new TextGeometry("Exit", {
                    font: gameFont,
                    size: this.textSize,
                    height: this.textSize / 4,
                    bevelEnabled: true,
                    bevelThickness: 0.1,
                    bevelSize: 0.1,
                    bevelOffset: 0,
                    bevelSegments: 1,
                });
                exitButtonGeom.computeBoundingBox();
                const exitButton = new THREE.Mesh(
                    exitButtonGeom,
                    new THREE.MeshStandardMaterial({
                        color: 0xf4af2d,
                        emissive: 0xf4af2d,
                        emissiveIntensity: 2,
                    })
                );
                exitButton.name = "exit_button";
                exitButton.layers.enable(UI);
                exitButton.layers.enable(MAIN_MENU);

                exitButton.position.y = -5;
                exitButton.position.x = -.3;

                {
                    this.playerName = new THREE.Group();

                    const playerNameLabelGeom = new TextGeometry("Name :", {
                        font: gameFont,
                        size: this.textSize,
                        height: this.textSize / 4,
                        bevelEnabled: true,
                        bevelThickness: 0.1,
                        bevelSize: 0.1,
                        bevelOffset: 0,
                        bevelSegments: 1,
                    });
                    playerNameLabelGeom.computeBoundingBox();
                    const playerNameLabel = new THREE.Mesh(
                        playerNameLabelGeom,
                        new THREE.MeshStandardMaterial({
                            color: 0xf4af2d,
                            emissive: 0xf4af2d,
                            emissiveIntensity: 2,
                        })
                    );
                    this.playerName.add(playerNameLabel);

                    this.playerNameValue = this.#createTextGeometryForName(
                        "",
                        gameFont,
                        this.textSize
                    );
                    this.playerNameValue.position.x = this.nameValueXPos;
                    this.playerName.add(this.playerNameValue);

                    this.playerName.position.x = -15;

                    this.add(this.playerName);
                }

                {
                    this.difficulty = new THREE.Group();

                    const difficultyLabelGeom = new TextGeometry(
                        "Difficulty :",
                        {
                            font: gameFont,
                            size: this.textSize,
                            height: this.textSize / 4,
                            bevelEnabled: true,
                            bevelThickness: 0.1,
                            bevelSize: 0.1,
                            bevelOffset: 0,
                            bevelSegments: 1,
                        }
                    );
                    difficultyLabelGeom.computeBoundingBox();
                    const difficultyLabel = new THREE.Mesh(
                        difficultyLabelGeom,
                        new THREE.MeshStandardMaterial({
                            color: 0xf4af2d,
                            emissive: 0xf4af2d,
                            emissiveIntensity: 2,
                        })
                    );

                    this.difficulty.add(difficultyLabel);

                    const easyButtonGeom = new TextGeometry("Easy", {
                        font: gameFont,
                        size: this.textSize,
                        height: this.textSize / 4,
                        bevelEnabled: true,
                        bevelThickness: 0.1,
                        bevelSize: 0.1,
                        bevelOffset: 0,
                        bevelSegments: 1,
                    });
                    easyButtonGeom.computeBoundingBox();
                    const easyButton = new THREE.Mesh(
                        easyButtonGeom,
                        new THREE.MeshStandardMaterial({
                            color: 0xf4af2d,
                            emissive: 0xf4af2d,
                            emissiveIntensity: 2,
                        })
                    );
                    easyButton.name = "easy_button";
                    easyButton.layers.enable(UI);
                    easyButton.layers.enable(MAIN_MENU);

                    easyButton.position.x = 12;

                    const hardButtonGeom = new TextGeometry("Hard", {
                        font: gameFont,
                        size: this.textSize,
                        height: this.textSize / 4,
                        bevelEnabled: true,
                        bevelThickness: 0.1,
                        bevelSize: 0.1,
                        bevelOffset: 0,
                        bevelSegments: 1,
                    });
                    hardButtonGeom.computeBoundingBox();
                    const hardButton = new THREE.Mesh(
                        hardButtonGeom,
                        new THREE.MeshStandardMaterial({
                            color: 0xf4af2d,
                            emissive: 0xf4af2d,
                            emissiveIntensity: 2,
                        })
                    );
                    hardButton.name = "hard_button";
                    hardButton.layers.enable(UI);
                    hardButton.layers.enable(MAIN_MENU);

                    hardButton.position.x = 17;

                    this.difficulty.add(easyButton);
                    this.difficulty.add(hardButton);

                    this.difficulty.position.x = -15;
                    this.difficulty.position.y = -3;

                    this.add(this.difficulty);
                }

                const xScale = 4;
                const yScale = 2;

                mainMenu.add(playButton);
                mainMenu.add(exitButton);

                mainMenu.scale.x = xScale;
                playButton.scale.x = 1 / xScale;
                exitButton.scale.x = 1 / xScale;

                mainMenu.scale.y = yScale;
                playButton.scale.y = 1 / yScale;
                exitButton.scale.y = 1 / yScale;

                this.add(mainMenu);
            });
    }

    /**
     *
     * @param {string} newName
     */
    updateNameValue(newName) {
        if (this.playerNameValue && this.gameFont && this.playerName) {
            this.playerName.remove(this.playerNameValue);

            this.playerNameValue = this.#createTextGeometryForName(
                newName,
                this.gameFont,
                this.textSize
            );

            this.playerNameValue.position.x = this.nameValueXPos;

            this.playerName.add(this.playerNameValue);
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
            bevelSegments: 1,
        });
        nameValueGeom.computeBoundingBox();
        const nameValue = new THREE.Mesh(
            nameValueGeom,
            new THREE.MeshStandardMaterial({
                color: 0xf4af2d,
                emissive: 0xf4af2d,
                emissiveIntensity: 2,
            })
        );

        return nameValue;
    }
}
