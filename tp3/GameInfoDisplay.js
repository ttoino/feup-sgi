import * as THREE from "three";
import { Game } from "./game/Game.js";
import { TextSprite } from "./sprites/text/TextSprite.js";

export class GameInfoDisplay extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.game = game;

        this.timeText = null;
        this.lapsText = null;
        this.speedText = null;

        const textMaterial = new THREE.MeshLambertMaterial({
            emissive: 0x009fff,
            emissiveIntensity: 5,
            transparent: true,
        });

        this.game.fontSpriteSheetManager
            .load("sprites/text/tron.fnt")
            .then((font) => {
                this.timeText = new TextSprite("0s", font, 0.1, textMaterial);
                this.timeText.position.set(0.5, 0.5, 0);
                this.add(this.timeText);

                this.lapsText = new TextSprite(
                    "1st lap",
                    font,
                    0.1,
                    textMaterial
                );
                this.lapsText.position.set(0.5, 0.4, 0);
                this.add(this.lapsText);

                this.speedText = new TextSprite(
                    "0km/h",
                    font,
                    0.1,
                    textMaterial
                );
                this.speedText.position.set(0.5, 0.3, 0);
                this.add(this.speedText);

                this.maxSpeedText = new TextSprite(
                    "0km/h",
                    font,
                    0.1,
                    textMaterial
                );
                this.maxSpeedText.position.set(0.5, 0.2, 0);
                this.add(this.maxSpeedText);
            });
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        if (this.timeText) {
            this.timeText.text = `${Math.floor(this.game.info.time)}s`;
            this.timeText.create();
        }

        if (this.lapsText) {
            const lap = Math.max(
                Math.min(this.game.contents.track.playerLap, 3),
                1
            );
            const suffix = ["st", "nd", "rd"][lap - 1] || "th";
            this.lapsText.text = `${lap}${suffix} lap`;
            this.lapsText.create();
        }

        if (this.speedText) {
            this.speedText.text = `${Math.floor(
                (this.game.info.playerCar?.forwardSpeed ?? 0) * 3.6
            )}km/h`;
            this.speedText.create();
        }

        if (this.maxSpeedText) {
            this.maxSpeedText.text = `${Math.floor(
                (this.game.info.playerCar?.maxSpeed ?? 0) * 3.6
            )}km/h`;
            this.maxSpeedText.create();
        }
    }
}
