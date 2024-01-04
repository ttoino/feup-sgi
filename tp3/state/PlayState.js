import { GameState } from "./GameState.js";
import { PauseState } from "./PauseState.js";
import { Game } from "../game/Game.js";
import PlayerController from "../controller/PlayerController.js";
import OpponentController from "../controller/OpponentController.js";
import { WINNER_TO_GLOW } from "../track/Track.js";
import VehicleController from "../vehicles/VehicleController.js";
import CollisionController from "../collision/CollisionController.js";
import EndGameState from "./EndGameState.js";

export const LAPS = 1;

export class PlayState extends GameState {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game);

        this.opponentController = new OpponentController(
            this.game,
            // @ts-ignore
            this.game.info.opponentCar
        );

        this.playerController = new PlayerController(
            this.game,
            // @ts-ignore
            new VehicleController(this.game, this.game.info.playerCar),
            new CollisionController(
                this.game,
                // @ts-ignore
                this.game.info.playerCar,
                this.opponentController
            )
        );

        this.boundOnKeyDown = this.#onKeyDown.bind(this);
        this.boundOnKeyUp = this.#onKeyUp.bind(this);

        this.inverseCamera = false;
    }

    get currentWinner() {
        if (
            this.playerController.trackPosition.lap ===
                this.opponentController.trackPosition.lap &&
            this.playerController.trackPosition.nextWaypoint ===
                this.opponentController.trackPosition.nextWaypoint
        )
            return "tie";
        else if (
            this.playerController.trackPosition.lap >
                this.opponentController.trackPosition.lap ||
            (this.playerController.trackPosition.lap ===
                this.opponentController.trackPosition.lap &&
                (this.playerController.trackPosition.nextWaypoint >
                    this.opponentController.trackPosition.nextWaypoint ||
                    this.playerController.trackPosition.nextWaypoint === 0)) // this takes into account the moment when the player is winning and crosses the last waypoint.
        )
            return "player";
        else return "opponent";
    }

    get isGameOver() {
        return (
            this.playerController.trackPosition.lap >= LAPS &&
            this.opponentController.trackPosition.lap >= LAPS
        );
    }

    /**
     *
     * @param {number} delta
     */
    update(delta) {
        super.update(delta);

        for (const item of this.game.contents.items) item.update(delta);

        // The order in which this state's updaters are first updated matters,
        // so just explicitly update the controllers last here.

        this.opponentController.update(delta);
        this.playerController.update(delta);

        if (this.isGameOver) {
            this.stateManager.pushState(new EndGameState(this.game));
            return;
        } else {
            if (this.playerController.trackPosition.lap >= LAPS) {
                this.game.info.winner = this.game.info.playerCar;
                this.game.info.loser = this.game.info.opponentCar;
            } else if (this.opponentController.trackPosition.lap >= LAPS) {
                this.game.info.winner = this.game.info.opponentCar;
                this.game.info.loser = this.game.info.playerCar;
            }
        }

        const material = WINNER_TO_GLOW[this.currentWinner];
        this.game.materials.changeGlow(this.game.contents.track.glow, material);

        if (
            this.inverseCamera ||
            this.playerController.vehicle.forwardSpeed < 0
        ) {
            this.game.gameplayControls.targetRotation = 0;
        } else {
            this.game.gameplayControls.targetRotation = Math.PI;
        }
    }

    init() {
        this.game.gameplayControls.target =
            this.playerController.vehicle.center ??
            this.playerController.vehicle;
        this.game.gameplayControls.targetRotation = Math.PI;

        this.playerController.install();

        document.addEventListener("keydown", this.boundOnKeyDown);
        document.addEventListener("keyup", this.boundOnKeyUp);
    }

    destroy() {
        this.playerController.remove();

        document.removeEventListener("keydown", this.boundOnKeyDown);
        document.removeEventListener("keyup", this.boundOnKeyUp);
    }

    /**
     * @param {KeyboardEvent} event
     */
    #onKeyDown(event) {
        if (event.key === "p" || event.key === "P") {
            this.stateManager.pushState(new PauseState(this.game));
        } else if (event.key === "Shift") {
            this.inverseCamera = true;
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    #onKeyUp(event) {
        if (event.key === "Shift") {
            this.inverseCamera = false;
        }
    }
}
