import Vehicle from "../vehicles/Vehicle.js";
import { Game } from "./Game.js";

export default class GameInfo {
    /**
     * @param {Game} game
     * @param {string} playerName 
     * @param {Vehicle | null} playerCar 
     * @param {Vehicle | null} opponentCar 
     * @param {number} difficulty 
     */
    constructor(game, playerName, playerCar, opponentCar, difficulty) {
        this.game = game;
        this.playerName = playerName;
        this.playerCar = playerCar;
        this.opponentCar = opponentCar;
        this.difficulty = difficulty;
    }
}
