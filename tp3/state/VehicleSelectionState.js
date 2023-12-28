import { Game } from "../Game.js";
import { MenuState } from "./MenuState.js";
import { VEHICLE_SELECTION_MENU } from "../Layers.js";
import { PlayState } from "./PlayState.js";
import VehicleController from "../vehicles/VehicleControler.js";

export default class VehicleSelectionState extends MenuState {

    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super(game, game.contents.vehicleSelectionMenu, VEHICLE_SELECTION_MENU);

        this.kart = undefined;
        this.opponent = undefined;
    }

    /**
     * @override
     *
     * @param {THREE.Object3D} object
     */
    onPick(object) {
        switch (object.name) {
            case "info_text":
                this.stateManager.pushState(
                    new PlayState(
                        this.game,
                        new VehicleController(this.game, this.game.contents.kart),
                        this.game.contents.kart,
                        this.game.contents.powerups
                    )
                );
                return;
        }
    }
}