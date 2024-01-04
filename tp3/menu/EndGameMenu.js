
import * as THREE from "three"
import { Game } from "../game/Game.js";
import { TextSprite } from "../sprites/text/TextSprite.js";
import Menu from "./Menu.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { END_GAME_MENU, UI } from "../renderer/Layers.js";

export class EndGameMenu extends Menu {

    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super(game)

        const textMaterial = new THREE.MeshStandardMaterial({
            color: 0xf4af2d,
            emissive: 0xf4af2d,
            emissiveIntensity: 5,
            transparent: true,
        })

        const textSize = 1.5;
        const vehicleZOffset = 20;
        const vehicleXOffset = 10;

        this.game.fontManager.load("fonts/tron_typeface.json").then((font) => {

            const mainMenuButtonGeom = new TextGeometry("M a i n  M e n u", {
                font: font,
                size: textSize,
                height: textSize / 4,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelOffset: 0,
                bevelSegments: 1,
            });
            mainMenuButtonGeom.computeBoundingBox();
            const mainMenuButton = new THREE.Mesh(
                mainMenuButtonGeom,
                new THREE.MeshStandardMaterial({
                    color: 0x2f8ca3,
                    emissive: 0x2f8ca3,
                    emissiveIntensity: 5,
                })
            );
            mainMenuButton.name = "main_menu_button";
            mainMenuButton.layers.enable(UI);
            mainMenuButton.layers.enable(END_GAME_MENU);

            mainMenuButton.position.y = 21;
            mainMenuButton.position.x = -12;

            this.add(mainMenuButton);

            const playAgainButtonGeom = new TextGeometry("P l a y  A g a i n", {
                font: font,
                size: textSize,
                height: textSize / 4,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelOffset: 0,
                bevelSegments: 1,
            });
            playAgainButtonGeom.computeBoundingBox();
            const playAgainButton = new THREE.Mesh(
                playAgainButtonGeom,
                new THREE.MeshStandardMaterial({
                    color: 0xf4af2d,
                    emissive: 0xf4af2d,
                    emissiveIntensity: 2,
                })
            );
            playAgainButton.name = "play_again_button";
            playAgainButton.layers.enable(UI);
            playAgainButton.layers.enable(END_GAME_MENU);

            playAgainButton.position.y = 18;
            playAgainButton.position.x = -12;

            this.add(playAgainButton);
        });

        this.game.fontSpriteSheetManager.load("sprites/text/tron.fnt").then((spriteFont) => {
            this.winner = new TextSprite("WINNER: N/A", spriteFont, 3, textMaterial);
            this.winner.position.y = 15;
            this.winner.position.x = -25;

            this.add(this.winner);

            this.playerInfo = new TextSprite("Player: N/A", spriteFont, 3, textMaterial);
            this.opponentInfo = new TextSprite("Opponent: N/A", spriteFont, 3, textMaterial);

            this.playerInfo.position.y = 12;
            this.playerInfo.position.x = -25;

            this.opponentInfo.position.y = 9;
            this.opponentInfo.position.x = -25;

            this.add(this.playerInfo);
            this.add(this.opponentInfo);

            this.difficulty = new TextSprite("Difficulty: N/A", spriteFont, 3, textMaterial);

            this.difficulty.position.y = 6;
            this.difficulty.position.x = -25;

            this.add(this.difficulty);
        });

        const background = new THREE.Mesh(new THREE.PlaneGeometry(100, 50), new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0.5,
        }));

        background.position.z = -1;

        this.add(background);

        this.winnerPosition = new THREE.Object3D();
        this.winnerPosition.position.z = vehicleZOffset;
        this.winnerPosition.position.x = -vehicleXOffset;
        this.add(this.winnerPosition);
        this.winnerPosition.updateMatrixWorld()

        this.loserPosition = new THREE.Object3D();
        this.loserPosition.position.z = vehicleZOffset;
        this.loserPosition.position.x = vehicleXOffset;
        this.add(this.loserPosition);
        this.loserPosition.updateMatrixWorld()
    }

    refresh() {
        this.winner.text = `WINNER: ${this.game.info.winner === this.game.info.playerCar ? this.game.info.playerName : "Opponent"}`;

        this.playerInfo.text = `Player: car=${this.game.info.playerName} time=${this.game.info.playerTime / 1000}s`;
        this.opponentInfo.text = `Opponent: car=Autonomous Opponent time=${this.game.info.opponentTime / 1000}s`;

        this.difficulty.text = `Difficulty: ${this.game.info.difficulty === 1 ? "Easy" : this.game.info.difficulty === 2 ? "Hard" : "N/A"}`;

        this.winner.create();
        this.playerInfo.create();
        this.opponentInfo.create();
        this.difficulty.create();
    }
}