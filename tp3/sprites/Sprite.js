import * as THREE from "three";

export class Sprite extends THREE.Mesh {
    constructor(texture, width, height) {
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
        });

        super(new THREE.PlaneGeometry(width, height), material);
    }
}
