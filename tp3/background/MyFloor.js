/// @ts-check

import * as THREE from "three";
import { MyFloorMaterial } from "./MyFloorMaterial.js";

const size = 1000;
const divisions = 100;

export class MyFloor extends THREE.Mesh {
    constructor() {
        super();

        this.geometry = new THREE.PlaneGeometry(
            size,
            size,
            divisions,
            divisions
        );

        this.material = new MyFloorMaterial({
            divisions
        });
        this.rotation.x = -Math.PI / 2;
    }
}
