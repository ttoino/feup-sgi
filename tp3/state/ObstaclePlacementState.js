import * as THREE from "three";
import { Game } from "../Game.js";
import Obstacle from "../track/items/obstacle/Obstacle.js";
import { GameState } from "./GameState.js";
import { PlayState } from "./PlayState.js";

export default class ObstaclePlacementState extends GameState {

    /**
     * 
     * @param {Game} game 
     * @param {Obstacle} obstacle
     */
    constructor(game, obstacle) {
        super(game);

        /**
         * @type {Obstacle | undefined}
         */
        this.obstacle = obstacle;

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        this.boundOnPointerMove = this.onPointerMove.bind(this);
    }

    init() {
        document.addEventListener("pointermove", this.boundOnPointerMove);
        this.game.gameplayControls.target = this.game.contents.track;
        this.game.gameplayControls.targetRotation = 0;
        this.setTimeout(() => {
            this.game.stateManager.popUntil(PlayState);
        }, 3000);
    }

    destroy() {
        document.removeEventListener("pointermove", this.boundOnPointerMove);
    }

    /**
     * @override
     *
     * @param {number} delta
     */
    update(delta) {
        super.update(delta);
    }

    /**
 * @param {PointerEvent} e
 */
    onPointerMove(e) {
        this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.game.activeCamera);

        const intersections = this.raycaster.intersectObject(this.game.contents.track);

        console.log(intersections);
    }
}