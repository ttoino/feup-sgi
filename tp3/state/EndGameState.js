import * as THREE from "three";
import { Game } from "../game/Game.js";
import { EndGameMenu } from "../menu/EndGameMenu.js";
import { END_GAME_MENU } from "../renderer/Layers.js";
import { MenuState } from "./MenuState.js";

export default class EndGameState extends MenuState {
    /**
     *
     * @param {Game} game
     */
    constructor(game) {
        super(game, game.contents.endGameMenu, END_GAME_MENU);

        this.initialTarget = new THREE.Vector3();
    }

    init() {
        super.init();

        if (this.menuObject instanceof EndGameMenu) {
            this.menuObject.refresh();

            this.game.contents.fireworks.position.copy(
                this.menuObject.winnerPosition.position
            );
            this.game.contents.fireworks.position.z -= 1;
            this.game.contents.fireworks.position.x -= 1;
            this.menuObject.add(this.game.contents.fireworks);

            if (this.game.info.winner) {
                this.game.info.winner.position.copy(
                    this.menuObject.winnerPosition.getWorldPosition(
                        new THREE.Vector3()
                    )
                );

                this.game.info.winner.rotation.y = (4 * Math.PI) / 3;
            }

            if (this.game.info.loser) {
                this.game.info.loser.position.copy(
                    this.menuObject.loserPosition.getWorldPosition(
                        new THREE.Vector3()
                    )
                );

                this.game.info.loser.rotation.y = -Math.PI / 3;
            }

            if (this.game.info.winner === this.game.info.playerCar) {
                this.game.contents.fireworks.color = 0x009fff;
                this.game.contents.fireworks.material.emissive.set(0x009fff);
            } else {
                this.game.contents.fireworks.color = 0xff0007;
                this.game.contents.fireworks.material.emissive.set(0xff0007);
            }
        }

        this.initialTarget.copy(
            new THREE.Vector3(
                0,
                this.game.gameplayControls.targetDistance,
                this.game.gameplayControls.targetHeight
            )
        );

        this.game.gameplayControls.targetRotation = 0;
        this.game.gameplayControls.targetDistance = 45;
        this.game.gameplayControls.targetHeight = 20;
    }

    destroy() {
        super.destroy();

        this.game.gameplayControls.targetRotation = this.initialTarget.x;
        this.game.gameplayControls.targetDistance = this.initialTarget.y;
        this.game.gameplayControls.targetHeight = this.initialTarget.z;
    }
}
