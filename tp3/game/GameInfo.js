import { Game } from "./Game";

export default class GameInfo {

    /**
     * 
     * @param {Game} game
     * @param {string} playerName 
     * @param {string | null} playerCar 
     * @param {string | null} opponentCar 
     * @param {string} difficulty 
     */
    constructor(game, playerName, playerCar, opponentCar, difficulty) {
        this.game = game;
        this.playerName = playerName;
        this.playerCar = playerCar;
        this.opponentCar = opponentCar;
        this.difficulty = difficulty;
    }
}