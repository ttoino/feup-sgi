import * as THREE from "three";
import { Game } from "../game/Game.js";
import Obstacle from "../track/items/obstacle/Obstacle.js";
import { GameState } from "./GameState.js";
import { PlayState } from "./PlayState.js";
import { PauseState } from "./PauseState.js";

export default class ObstaclePlacementState extends GameState {
    /**
     *
     * @param {Game} game
     * @param {Obstacle} obstacle
     */
    constructor(game, obstacle) {
        super(game);

        /**
         * @type {Obstacle}
         */
        this.obstacle = obstacle;

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        this.placementPosition = null;

        this.boundOnPointerMove = this.onPointerMove.bind(this);
        this.boundOnKeyDown = this.#onKeyDown.bind(this);
    }

    init() {
        document.addEventListener("pointermove", this.boundOnPointerMove);
        document.addEventListener("keydown", this.boundOnKeyDown);

        this.game.gameplayControls.target = this.game.contents.track;

        const initialTarget = new THREE.Vector3(
            Math.PI,
            this.game.gameplayControls.targetDistance,
            this.game.gameplayControls.targetHeight
        );

        this.game.gameplayControls.targetRotation = 0;
        this.game.gameplayControls.targetDistance = 10;
        this.game.gameplayControls.targetHeight = 100;

        this.pickOnClick().then((position) => {
            const obstacle = this.obstacle.makeClone();

            obstacle.position.copy(position);

            this.game.contents.items.push(obstacle);
            this.game.scene.add(obstacle);

            this.game.stateManager.popUntil(PlayState);

            this.game.gameplayControls.targetRotation = initialTarget.x;
            this.game.gameplayControls.targetDistance = initialTarget.y;
            this.game.gameplayControls.targetHeight = initialTarget.z;
        });
    }

    destroy() {
        document.removeEventListener("pointermove", this.boundOnPointerMove);
        document.removeEventListener("keydown", this.boundOnKeyDown);
    }

    /**
     * @param {KeyboardEvent} event
     */
    #onKeyDown(event) {
        if (event.key === "p" || event.key === "P") {
            this.stateManager.pushState(new PauseState(this.game));
        }
    }

    /**
     *
     * @returns {Promise<THREE.Vector3>}
     */
    pickOnClick() {
        return new Promise((resolve, reject) => {
            const clickListener = () => {
                if (this.placementPosition) {
                    document.removeEventListener("click", clickListener);
                    resolve(this.placementPosition);
                }
            };

            document.addEventListener("click", clickListener);
        });
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

        const intersections = this.raycaster.intersectObject(
            this.game.contents.track
        );

        if (intersections.length > 0) {
            const intersection = intersections[0];
            this.placementPosition = new THREE.Vector3();
            this.placementPosition.copy(intersection.point);
            this.placementPosition.y += 1.5;
        } else {
            this.placementPosition = null;
        }
    }
}
