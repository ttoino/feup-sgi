import * as THREE from "three";
import { Game } from "../game/Game.js";
import { MenuState } from "./MenuState.js";
import { VEHICLE_SELECTION_MENU } from "../renderer/Layers.js";
import Vehicle from "../vehicles/Vehicle.js";
import { MainMenuState } from "./MainMenuState.js";
import { MainMenu } from "../menu/MainMenu.js";
import { Park } from "../park/Park.js";
import { PauseState } from "./PauseState.js";

export default class VehicleSelectionState extends MenuState {
    /**
     * @param {Game} game
     * @param {THREE.Object3D} menuObject
     * @param {Park} park
     * @param {THREE.Object3D} vehiclePosition
     * @param {(vehicle: Vehicle) => void} selectVehicle
     * @param {string} menuUpdateFunction 
     */
    constructor(game, menuObject, park, vehiclePosition, selectVehicle, menuUpdateFunction) {
        super(game, menuObject, VEHICLE_SELECTION_MENU);

        this.initialTarget = new THREE.Vector3();

        this.park = park;
        this.vehiclePosition = vehiclePosition;
        this.selectVehicle = selectVehicle;

        // HACK: this is not the best way to do this, in the slightest. It is ugly code but there are more pressing matters to attend to.
        this.menuUpdateFunction = menuUpdateFunction;

    }
    init() {
        super.init();

        this.park.addObjects();

        this.initialTarget.copy(new THREE.Vector3(Math.PI, this.game.gameplayControls.targetDistance, this.game.gameplayControls.targetHeight));

        this.game.gameplayControls.targetRotation = 0;
        this.game.gameplayControls.targetDistance = 15;
        this.game.gameplayControls.targetHeight = 15;
    }

    destroy() {
        super.destroy();

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
            this.vehiclePosition.getWorldPosition(
                new THREE.Vector3()
            )
        );
        object.rotation.copy(
            new THREE.Euler().setFromQuaternion(
                this.vehiclePosition.getWorldQuaternion(
                    new THREE.Quaternion()
                ),
                "YXZ"
            )
        );

        this.selectVehicle(object);

        this.game.stateManager.popState();

        this.game.stateManager.popUntil(MainMenuState);
        if (this.game.stateManager.current instanceof MainMenuState) {
            if (this.game.stateManager.current.menuObject instanceof MainMenu) {

                // HACK: yuck
                if (
                    this.menuUpdateFunction in this.game.stateManager.current.menuObject &&
                    // @ts-ignore
                    typeof this.game.stateManager.current.menuObject[this.menuUpdateFunction] === "function"
                )
                    // @ts-ignore
                    this.game.stateManager.current.menuObject[this.menuUpdateFunction](object.name);
            }
        }
    }
}
