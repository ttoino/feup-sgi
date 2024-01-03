import * as THREE from "three";

export class Sprite extends THREE.Mesh {
    /**
     * @param {THREE.Box2} box2
     * @param {number} width
     * @param {number} height
     * @param {THREE.Material & { map: THREE.Texture }} material
     */
    constructor(box2, width, height, material) {
        const geometry = new THREE.PlaneGeometry(width, height);

        const uvs = geometry.attributes.uv.array.map(
            (coord, i) => box2[coord ? "max" : "min"][i % 2 ? "y" : "x"]
        );

        console.log(uvs)

        geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

        super(geometry, material);
    }
}
