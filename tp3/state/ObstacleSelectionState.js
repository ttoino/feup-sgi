import { Game } from "../Game.js";
import { MenuState } from "./MenuState.js";
import { OBSTACLE_SELECTION_MENU } from "../Layers.js";
import ObstaclePlacementState from "./ObstaclePlacementState.js";
import Obstacle from "../track/items/obstacle/Obstacle.js";

export default class ObstacleSelectionState extends MenuState {

    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super(game, game.contents.obstacleSelectionMenu, OBSTACLE_SELECTION_MENU);
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