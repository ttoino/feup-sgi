import * as THREE from "three";
import { OBB } from "three/addons/math/OBB.js";
import { Game } from "../Game.js";
import { HELPERS, TRACK } from "../Layers.js";

export class Track extends THREE.Object3D {
    /**
     * @param {Game} game
     */
    constructor(game) {
        super();

        this.playerStart = new THREE.Object3D();
        this.opponentStart = new THREE.Object3D();
        /** @type {OBB[]} */
        this.waypointColliders = [];
        /**
         * @typedef {{
         *     on: THREE.Object3D;
         *     off: THREE.Object3D;
         * }} WaypointLight
         * @type {[WaypointLight, WaypointLight, WaypointLight][]}
         */
        this.waypointLights = [];

        this.lap = -1;
        this.nextWaypoint = 0;

        game.modelManager.loadModel("models/track.glb", (model) => {
            this.add(model);

            /** @type {THREE.Object3D[]} */
            const waypoints = [];

            model.traverse((child) => {
                if (child.name.includes("collider")) child.layers.set(TRACK);

                if (child.name.includes("start_player"))
                    this.playerStart = child;

                if (child.name.includes("start_opponent"))
                    this.opponentStart = child;

                if (child.name.match(/waypoint_\d+$/)) waypoints.push(child);
            });

            // @ts-ignore
            this.waypointLights = waypoints.map((waypoint) =>
                [1, 2, 3].map((i) => {
                    const light = {
                        on: waypoint.getObjectByName(
                            `${waypoint.name}_${i}_on`
                        ),
                        off: waypoint.getObjectByName(
                            `${waypoint.name}_${i}_off`
                        ),
                    };

                    light.on.visible = false;
                    light.off.visible = true;

                    return light;
                })
            );

            this.waypointColliders = waypoints
                .sort((a, b) => a.name.localeCompare(b.name, ["en"]))
                .map((waypoint) => {
                    waypoint.updateMatrixWorld();

                    const helper = new THREE.Mesh(
                        new THREE.BoxGeometry(24, 0.2, 24),
                        new THREE.MeshBasicMaterial({
                            color: 0x00ff00,
                            wireframe: true,
                        })
                    );
                    helper.applyMatrix4(waypoint.matrixWorld);
                    helper.layers.set(HELPERS);
                    game.scene.add(helper);

                    return new OBB(
                        new THREE.Vector3(),
                        new THREE.Vector3(12, 0.1, 12)
                    ).applyMatrix4(waypoint.matrixWorld);
                    // new THREE.Plane().setFromNormalAndCoplanarPoint(
                    //     waypoint.localToWorld(new THREE.Vector3(0, 1, 0)),
                    //     waypoint.getWorldPosition(new THREE.Vector3())
                    // )
                });
        });
    }

    /**
     * @param {OBB} collider
     */
    checkWaypoint(collider) {
        if (collider.intersectsOBB(this.waypointColliders[this.nextWaypoint])) {
            if (this.nextWaypoint === 0) this.lap++;

            if (this.lap >= 3) return;

            this.waypointLights[this.nextWaypoint][this.lap].on.visible = true;
            this.waypointLights[this.nextWaypoint][
                this.lap
            ].off.visible = false;

            this.nextWaypoint =
                (this.nextWaypoint + 1) % this.waypointColliders.length;
        }
    }
}
