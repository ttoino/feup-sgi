import { Game } from "../Game.js";
import { MenuState } from "./MenuState.js";
import { OBSTACLE_SELECTION_MENU } from "../Layers.js";
import { PlayState } from "./PlayState.js";
import VehicleController from "../vehicles/VehicleController.js";
import PlayerController from "../controller/PlayerController.js";
import CollisionController from "../collision/CollisionController.js";
import OpponentController from "../controller/OpponentController.js";
import Obstacle from "../track/items/obstacle/Obstacle.js";

export default class ObstacleSelectionState extends MenuState {

    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super(game, game.contents.obstacleSelectionMenu, OBSTACLE_SELECTION_MENU);

        /**
         * @type {Obstacle | undefined}
         */
        this.obstacle = undefined;
    }

    /**
     * @override
     *
     * @param {THREE.Object3D} object
     */
    onPick(object) {

        // @ts-ignore
        this.obstacle = object;

        this.game.stateManager.popState();
        return;
    }
}