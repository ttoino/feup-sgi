import { Game } from "../Game.js";
import { MenuState } from "./MenuState.js";
import { VEHICLE_SELECTION_MENU } from "../Layers.js";
import { PlayState } from "./PlayState.js";
import VehicleController from "../vehicles/VehicleControler.js";
import Vehicle from "../vehicles/Vehicle.js";

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

            this.stateManager.pushState(
                new PlayState(
                    this.game,
                    new VehicleController(this.game, this.kart),
                    // @ts-ignore
                    this.opponent,
                    this.game.contents.powerups
                )
            );
            return;
        } else {
            console.error("HUHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHhh...")
        }
    }
}