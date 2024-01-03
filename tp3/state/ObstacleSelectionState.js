import * as THREE from "three";
import { Game } from "../game/Game.js";
import { MenuState } from "./MenuState.js";
import { OBSTACLE_SELECTION_MENU } from "../renderer/Layers.js";
import ObstaclePlacementState from "./ObstaclePlacementState.js";
import Obstacle from "../track/items/obstacle/Obstacle.js";
import { PauseState } from "./PauseState.js";

export default class ObstacleSelectionState extends MenuState {

    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super(game, game.contents.obstacleSelectionMenu, OBSTACLE_SELECTION_MENU);

        this.boundOnKeyDown = this.#onKeyDown.bind(this);

        this.initialTarget = new THREE.Vector3();
    }

    init() {
        super.init();

        document.addEventListener("keydown", this.boundOnKeyDown);

        this.initialTarget.copy(new THREE.Vector3(0, this.game.gameplayControls.targetDistance, this.game.gameplayControls.targetHeight));

        this.game.gameplayControls.targetRotation = 0;
        this.game.gameplayControls.targetDistance = 15;
        this.game.gameplayControls.targetHeight = 15;
    }

    destroy() {
        super.destroy();

        document.removeEventListener("keydown", this.boundOnKeyDown);

        this.game.gameplayControls.targetRotation = this.initialTarget.x;
        this.game.gameplayControls.targetDistance = this.initialTarget.y;
        this.game.gameplayControls.targetHeight = this.initialTarget.z;
    }

    /**
     * @param {KeyboardEvent} event
     */
    #onKeyDown(event) {
        if (event.key === "p" || event.key === "P") {
            this.stateManager.pushState(new PauseState(this.game));
        }
    }

    /**
     * @override
     *
     * @param {THREE.Object3D} object
     */
    onPick(object) {
        if (object instanceof Obstacle) {
            // Should always be true but types...

            this.game.stateManager.pushState(new ObstaclePlacementState(this.game, object));
        }

        return;
    }
}