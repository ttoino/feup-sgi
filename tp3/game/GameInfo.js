import Vehicle from "../vehicles/Vehicle.js";
import { Game } from "./Game.js";

export default class GameInfo {
    /**
     * @param {Game} game
     * @param {string} playerName 
     * @param {Vehicle | null} playerCar 
     * @param {Vehicle | null} opponentCar 
     * @param {number} difficulty 
     * @param {number} playerTime
     * @param {number} opponentTime
     * @param {Vehicle | null} winner
     * @param {Vehicle | null} loser 
     */
    constructor(game, playerName, playerCar, opponentCar, difficulty, playerTime, opponentTime, winner, loser) {
        this.game = game;

        this.playerName = playerName;

        this.playerCar = playerCar;
        this.opponentCar = opponentCar;

        this.difficulty = difficulty;

        this.playerTime = playerTime;
        this.opponentTime = opponentTime;

        this.winner = winner;
        this.loser = loser;
    }
}
