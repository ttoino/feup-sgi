import { Game } from "../Game.js";
import { MenuState } from "./MenuState.js";
import { VEHICLE_SELECTION_MENU } from "../Layers.js";
import { PlayState } from "./PlayState.js";
import VehicleController from "../vehicles/VehicleController.js";
import Vehicle from "../vehicles/Vehicle.js";
import PlayerController from "../controller/PlayerController.js";
import CollisionController from "../collision/CollisionController.js";
import OpponentController from "../controller/OpponentController.js";

export default class VehicleSelectionState extends MenuState {

    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super(game, game.contents.vehicleSelectionMenu, VEHICLE_SELECTION_MENU);

        /**
         * @type {Vehicle | undefined}
         */
        this.kart = undefined;

        /**
         * @type {Vehicle | undefined}
         */
        this.opponent = undefined;
    }

    /**
     * @override
     *
     * @param {THREE.Object3D} object
     */
    onPick(object) {

        // TODO: improve this... A LOT

        if (this.kart === undefined) {
            // @ts-ignore
            this.kart = object;

            this.menuObject.remove(object);
            this.game.scene.add(object);

            return;
        } else if (this.opponent === undefined) {
            // @ts-ignore
            this.opponent = object;
            this.menuObject.remove(object);
            this.game.scene.add(object);

            const opponentController = new OpponentController(
                this.game,
                // @ts-ignore
                this.opponent,
            );

            const playerController = new PlayerController(
                this.game,
                new VehicleController(this.game, this.kart),
                // @ts-ignore
                new CollisionController(this.game, this.kart, [...this.game.contents.powerups, ...this.game.contents.obstacles, opponentController].map((object) => {
                    return object.collider; // TODO: brah
                })),
            );

            this.stateManager.pushState(
                new PlayState(
                    this.game,
                    playerController,
                    opponentController,
                )
            );
            return;
        } else {
            console.error("HUHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHhh...")
        }
    }
}