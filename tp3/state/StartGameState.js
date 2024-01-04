import { Game } from "../game/Game.js";
import { GameState } from "./GameState.js";
import { PlayState } from "./PlayState.js";

export class StartGameState extends GameState {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game);
    }

    init() {
        this.game.contents.track.reset();

        if (this.game.info.playerCar) this.game.info.playerCar.reset();
        if (this.game.info.opponentCar) this.game.info.opponentCar.reset();

        this.stateManager.pushState(new PlayState(this.game));
    }
}
