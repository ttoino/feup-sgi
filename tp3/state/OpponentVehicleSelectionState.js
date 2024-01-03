import { Game } from "../game/Game.js";
import VehicleSelectionState from "./VehicleSelectionState.js";

export default class OpponentVehicleSelectionState extends VehicleSelectionState {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(
            game,
            game.contents.opponentVehicleSelectionMenu,
            game.contents.opponentPark,
            game.contents.track.opponentStart,
            (vehicle) => {
                game.info.opponentCar = vehicle;
            },
            "updateOpponentVehicleName"
        );
    }
}
