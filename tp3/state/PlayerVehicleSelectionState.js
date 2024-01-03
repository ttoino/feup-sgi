import * as THREE from "three";
import { Game } from "../game/Game.js";
import { MenuState } from "./MenuState.js";
import { VEHICLE_SELECTION_MENU } from "../renderer/Layers.js";
import Vehicle from "../vehicles/Vehicle.js";

export default class PlayerVehicleSelectionState extends MenuState {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game, game.contents.playerVehicleSelectionMenu, VEHICLE_SELECTION_MENU);

        this.initialTarget = new THREE.Vector3();
    }

    init() {
        super.init();

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
            this.game.contents.track.playerStart.getWorldPosition(
                new THREE.Vector3()
            )
        );
        object.rotation.copy(
            new THREE.Euler().setFromQuaternion(
                this.game.contents.track.playerStart.getWorldQuaternion(
                    new THREE.Quaternion()
                ),
                "YXZ"
            )
        );

        this.game.info.playerCar = object;

        console.log("Player car selected:", object.name);

        this.game.stateManager.popState();
    }
}
