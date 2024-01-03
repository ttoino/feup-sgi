import * as THREE from "three";
import { Game } from "../game/Game.js";
import { MenuState } from "./MenuState.js";
import { VEHICLE_SELECTION_MENU } from "../renderer/Layers.js";
import { PlayState } from "./PlayState.js";
import VehicleController from "../vehicles/VehicleController.js";
import Vehicle from "../vehicles/Vehicle.js";
import PlayerController from "../controller/PlayerController.js";
import CollisionController from "../collision/CollisionController.js";
import OpponentController from "../controller/OpponentController.js";
import { MainMenuState } from "./MainMenuState.js";
import { MainMenu } from "../menu/MainMenu.js";

export default class OpponentVehicleSelectionState extends MenuState {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game, game.contents.opponentVehicleSelectionMenu, VEHICLE_SELECTION_MENU);

        this.initialTarget = new THREE.Vector3();
    }

    init() {
        super.init();

        this.game.contents.opponentPark.addObjects();

        this.initialTarget.copy(new THREE.Vector3(Math.PI, this.game.gameplayControls.targetDistance, this.game.gameplayControls.targetHeight));

        this.game.gameplayControls.targetRotation = 0;
        this.game.gameplayControls.targetDistance = 15;
        this.game.gameplayControls.targetHeight = 15;
    }

    destroy() {

        this.game.gameplayControls.targetRotation = this.initialTarget.x;
        this.game.gameplayControls.targetDistance = this.initialTarget.y;
        this.game.gameplayControls.targetHeight = this.initialTarget.z;

    }

    /**
     * @override
     *
     * @param {THREE.Object3D} object
     */
    onPick(object) {
        if (!(object instanceof Vehicle)) return;

        object.position.copy(
            this.game.contents.track.opponentStart.getWorldPosition(
                new THREE.Vector3()
            )
        );
        object.rotation.copy(
            new THREE.Euler().setFromQuaternion(
                this.game.contents.track.opponentStart.getWorldQuaternion(
                    new THREE.Quaternion()
                ),
                "YXZ"
            )
        );

        this.game.info.opponentCar = object;

        console.log("Opponent car selected:", object.name);

        this.game.stateManager.popUntil(MainMenuState);

        if (this.game.stateManager.current instanceof MainMenuState) {
            if (this.game.stateManager.current.menuObject instanceof MainMenu) {
                this.game.stateManager.current.menuObject.updateOpponentVehicleName(object.name);
            }
        }
    }
}
