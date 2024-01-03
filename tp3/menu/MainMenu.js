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

        this.nameValueXPos = 8.5;
        this.textSize = 0.75;
    }

    #init() {
        this.game.fontManager
            .load("fonts/tron_typeface.json")
            .then((gameFont) => {
                this.gameFont = gameFont;
                const mainMenu = new THREE.Group();

                const xTextScale = 4;
                const yTextScale = 2;

                {
                    const mainMenuLabelGeom = new TextGeometry("F E U P e r  W a v e", {
                        font: gameFont,
                        size: this.textSize,
                        height: this.textSize / 4,
                        bevelEnabled: true,
                        bevelThickness: 0.1,
                        bevelSize: 0.1,
                        bevelOffset: 0,
                        bevelSegments: 1,
                    });
                    mainMenuLabelGeom.computeBoundingBox();
                    const mainMenuLabel = new THREE.Mesh(
                        mainMenuLabelGeom,
                        new THREE.MeshStandardMaterial({
                            color: 0x2f8ca3,
                            emissive: 0x2f8ca3,
                            emissiveIntensity: 5,
                        })
                    );
                    mainMenuLabel.position.y = 5;
                    mainMenuLabel.position.x = -8.5;
                    mainMenu.add(mainMenuLabel);
                }

                const playButtonGeom = new TextGeometry("P l a y  G a m e", {
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

                const exitButtonGeom = new TextGeometry("E x i t", {
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

                {
                    this.playerName = new THREE.Group();

                    const playerNameLabelGeom = new TextGeometry("N a m e  :", {
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

                    this.playerName.position.x = -35;

                    this.add(this.playerName);
                }

                {
                    this.difficulty = new THREE.Group();

                    const difficultyLabelGeom = new TextGeometry(
                        "D i f f i c u l t y  :",
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

                    const easyButtonGeom = new TextGeometry("E a s y", {
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

                    easyButton.position.x = 18;

                    const hardButtonGeom = new TextGeometry("H a r d", {
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

                    hardButton.position.x = 25;

                    this.difficulty.add(easyButton);
                    this.difficulty.add(hardButton);

                    this.difficulty.position.x = -35;
                    this.difficulty.position.y = -3;

                    this.add(this.difficulty);
                }

                {
                    this.authors = new THREE.Group();

                    const perasLabelGeom = new TextGeometry(
                        "N u n o  P e r e i r a,  U P 2 0 2 0 0 7 8 6 5",
                        {
                            font: gameFont,
                            size: this.textSize / 2,
                            height: this.textSize / 4,
                            bevelEnabled: true,
                            bevelThickness: 0.1,
                            bevelSize: 0.1,
                            bevelOffset: 0,
                            bevelSegments: 1,
                        }
                    );
                    perasLabelGeom.computeBoundingBox();
                    const perasLabel = new THREE.Mesh(
                        perasLabelGeom,
                        new THREE.MeshStandardMaterial({
                            color: 0xf4af2d,
                            emissive: 0xf4af2d,
                            emissiveIntensity: 2,
                        })
                    );

                    perasLabel.position.x = -12

                    this.authors.add(perasLabel);

                    const toinoLabelGeometry = new TextGeometry("J o a o  P e r e i r a, U P 2 0 2 0 0 7 1 4 5", {
                        font: gameFont,
                        size: this.textSize / 2,
                        height: this.textSize / 4,
                        bevelEnabled: true,
                        bevelThickness: 0.1,
                        bevelSize: 0.1,
                        bevelOffset: 0,
                        bevelSegments: 1,
                    });
                    toinoLabelGeometry.computeBoundingBox();
                    const toinoLabel = new THREE.Mesh(
                        toinoLabelGeometry,
                        new THREE.MeshStandardMaterial({
                            color: 0xf4af2d,
                            emissive: 0xf4af2d,
                            emissiveIntensity: 2,
                        })
                    );

                    toinoLabel.position.x = -12;
                    toinoLabel.position.y = -2;

                    this.authors.add(toinoLabel);

                    this.authors.position.x = -18;
                    this.authors.position.y = -9;

                    this.add(this.authors);
                }

                {
                    const selectPlayerVehicleButtonGeom = new TextGeometry("S e l e c t  P l a y e r  V e h i c l e", {
                        font: gameFont,
                        size: this.textSize,
                        height: this.textSize / 4,
                        bevelEnabled: true,
                        bevelThickness: 0.1,
                        bevelSize: 0.1,
                        bevelOffset: 0,
                        bevelSegments: 1,
                    });
                    selectPlayerVehicleButtonGeom.computeBoundingBox();
                    const selectPlayerVehicleButton = new THREE.Mesh(
                        selectPlayerVehicleButtonGeom,
                        new THREE.MeshStandardMaterial({
                            color: 0x2f8ca3,
                            emissive: 0x2f8ca3,
                            emissiveIntensity: 5,
                        })
                    );
                    selectPlayerVehicleButton.name = "select_player_vehicle";
                    selectPlayerVehicleButton.layers.enable(UI);
                    selectPlayerVehicleButton.layers.enable(MAIN_MENU);

                    selectPlayerVehicleButton.scale.x = 1 / xTextScale;
                    selectPlayerVehicleButton.scale.y = 1 / yTextScale;

                    mainMenu.add(selectPlayerVehicleButton);
                }

                {
                    const selectOpponentVehicleButtonGeom = new TextGeometry("S e l e c t  O p p o n e n t  V e h i c l e", {
                        font: gameFont,
                        size: this.textSize,
                        height: this.textSize / 4,
                        bevelEnabled: true,
                        bevelThickness: 0.1,
                        bevelSize: 0.1,
                        bevelOffset: 0,
                        bevelSegments: 1,
                    });
                    selectOpponentVehicleButtonGeom.computeBoundingBox();
                    const selectOpponentVehicleButton = new THREE.Mesh(
                        selectOpponentVehicleButtonGeom,
                        new THREE.MeshStandardMaterial({
                            color: 0xf4af2d,
                            emissive: 0xf4af2d,
                            emissiveIntensity: 2,
                        })
                    );
                    selectOpponentVehicleButton.name = "select_opponent_vehicle";
                    selectOpponentVehicleButton.layers.enable(UI);
                    selectOpponentVehicleButton.layers.enable(MAIN_MENU);

                    selectOpponentVehicleButton.position.y = -1.5;

                    selectOpponentVehicleButton.scale.x = 1 / xTextScale;
                    selectOpponentVehicleButton.scale.y = 1 / yTextScale;

                    mainMenu.add(selectOpponentVehicleButton);
                }

                mainMenu.add(playButton);
                mainMenu.add(exitButton);

                mainMenu.scale.x = xTextScale;
                playButton.scale.x = 1 / xTextScale;
                exitButton.scale.x = 1 / xTextScale;

                mainMenu.scale.y = yTextScale;
                playButton.scale.y = 1 / yTextScale;
                exitButton.scale.y = 1 / yTextScale;

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
