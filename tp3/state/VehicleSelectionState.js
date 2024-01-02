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

export default class VehicleSelectionState extends MenuState {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super(game, game.contents.vehicleSelectionMenu, VEHICLE_SELECTION_MENU);

        /**
         * @type {Vehicle | undefined}
         */
        this.kart = undefined;

        /**
         * @type {Vehicle | undefined}
         */
        this.opponent = undefined;
    }

    /**
     * @override
     *
     * @param {THREE.Object3D} object
     */
    onPick(object) {
        if (!(object instanceof Vehicle)) return;
        // TODO: improve this... A LOT

        if (this.kart === undefined) {
            this.kart = object;

            this.menuObject.remove(object);
            this.game.scene.add(object);
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
        } else if (this.opponent === undefined) {
            this.opponent = object;
            this.menuObject.remove(object);
            this.game.scene.add(object);
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

            object.updateMatrix();
            console.log(
                new THREE.Euler().setFromQuaternion(
                    object.getWorldQuaternion(new THREE.Quaternion())
                ),
                object.getWorldDirection(new THREE.Vector3())
            );

            const opponentController = new OpponentController(
                this.game,
                this.opponent
            );

            const playerController = new PlayerController(
                this.game,
                new VehicleController(this.game, this.kart),
                new CollisionController(
                    this.game,
                    this.kart,
                    opponentController
                )
            );

            this.stateManager.pushState(
                new PlayState(this.game, playerController, opponentController)
            );
        } else {
            console.error("HUHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHhh...");
        }
    }
}
