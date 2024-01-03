import { Game } from "../game/Game.js";
import VehicleSelectionState from "./VehicleSelectionState.js";

export default class PlayerVehicleSelectionState extends VehicleSelectionState {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(
            game,
            game.contents.playerVehicleSelectionMenu,
            game.contents.vehiclePark,
            game.contents.track.playerStart,
            (vehicle) => {
                game.info.playerCar = vehicle;
            },
            "updatePlayerVehicleName"
        );
    }
}
