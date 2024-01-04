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

        const hud = document.querySelector("#hud") ?? (() => {
            const hud = document.createElement("div");
            hud.id = "hud";
            document.body.appendChild(hud);
            return hud;
        })();

        /** @type{HTMLSpanElement} */
        this.hudTime = hud.querySelector("#time") ?? (() => {

            const time = document.createElement("span");

            time.id = "time";

            hud.appendChild(time);

            return time;
        })();

        /** @type{HTMLSpanElement} */
        this.hudState = hud.querySelector("#state") ?? (() => {

            const state = document.createElement("span");

            state.id = "state";

            hud.appendChild(state);

            return state;
        })();

        /** @type{HTMLSpanElement} */
        this.hudLaps = hud.querySelector("#laps") ?? (() => {

            const laps = document.createElement("span");

            laps.id = "lap";

            hud.appendChild(laps);

            return laps;
        })();

        /** @type{HTMLSpanElement} */
        this.hudSpeed = hud.querySelector("#speed") ?? (() => {

            const speed = document.createElement("span");

            speed.id = "cur";

            hud.appendChild(speed);

            return speed;
        })();

        /** @type{HTMLSpanElement} */
        this.hudMaxSpeed = hud.querySelector("#max-speed") ?? (() => {

            const maxSpeed = document.createElement("span");

            maxSpeed.id = "max";

            hud.appendChild(maxSpeed);

            return maxSpeed;
        })();


        const textMaterial = new THREE.MeshLambertMaterial({
            emissive: 0x009fff,
            emissiveIntensity: 5,
            transparent: true,
        });

        this.game.fontSpriteSheetManager
            .load("sprites/text/tron.fnt")
            .then((font) => {
                this.timeText = new TextSprite("0s", font, 1, textMaterial);
                this.timeText.position.set(0.5, 2.5, 0);
                this.add(this.timeText);

                this.lapsText = new TextSprite(
                    "1'st lap",
                    font,
                    1,
                    textMaterial
                );
                this.lapsText.position.set(0.5, 1.5, 0);
                this.add(this.lapsText);

                this.speedText = new TextSprite(
                    "Cur: 0 km/h",
                    font,
                    1,
                    textMaterial
                );
                this.speedText.position.set(0.5, 0.5, 0);
                this.add(this.speedText);

                this.maxSpeedText = new TextSprite(
                    "Max: 0 km/h",
                    font,
                    1,
                    textMaterial
                );
                this.maxSpeedText.position.set(0.5, -0.5, 0);
                this.add(this.maxSpeedText);
            });
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        if (this.timeText) {
            this.timeText.text = `${Math.floor(this.game.info.elapsedTime)}s`;
            this.timeText.create();

            this.hudTime.innerText = `${Math.floor(this.game.info.elapsedTime)}s`;
        }

        this.hudState.innerText = `State: ${this.game.info.paused ? "Paused" : "Running"}`;

        if (this.lapsText) {
            const lap = Math.max(
                Math.min(this.game.contents.track.playerLap, 3),
                1
            );
            const suffix = ["st", "nd", "rd"][lap - 1] || "th";
            this.lapsText.text = `${lap}'${suffix} lap`;
            this.lapsText.create();

            this.hudLaps.innerText = `Lap: ${lap}'${suffix}`;
        }

        if (this.speedText) {
            this.speedText.text = `Cur: ${Math.floor(
                (this.game.info.playerCar?.forwardSpeed ?? 0) * 3.6
            )}km/h`;
            this.speedText.create();

            this.hudSpeed.innerText = `Cur: ${Math.floor(
                (this.game.info.playerCar?.forwardSpeed ?? 0) * 3.6
            )}km/h`;
        }

        if (this.maxSpeedText) {
            this.maxSpeedText.text = `Max: ${Math.floor(
                (this.game.info.playerCar?.maxSpeed ?? 0) * 3.6
            )}km/h`;
            this.maxSpeedText.create();

            this.hudMaxSpeed.innerText = `Max: ${Math.floor(
                (this.game.info.playerCar?.maxSpeed ?? 0) * 3.6
            )}km/h`;
        }
    }
}