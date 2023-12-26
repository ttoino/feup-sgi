/// @ts-check

import * as THREE from "three";

export class FloorMaterial extends THREE.MeshPhongMaterial {
    constructor({ divisions = 1 }) {
        super();

        this.map = new THREE.TextureLoader().load("textures/floor.png");
        this.map.wrapS = THREE.RepeatWrapping;
        this.map.wrapT = THREE.RepeatWrapping;
        this.map.repeat.set(divisions, divisions);

        this.emissiveMap = new THREE.TextureLoader().load("textures/floor-emissive.png");
        this.emissiveMap.wrapS = THREE.RepeatWrapping;
        this.emissiveMap.wrapT = THREE.RepeatWrapping;
        this.emissiveMap.repeat.set(divisions, divisions);
        this.emissive = new THREE.Color(0xffffff);
        this.emissiveIntensity = 15;

        this.displacementMap = new THREE.TextureLoader().load(
            "textures/floor-disp.png"
        );
        this.displacementScale = 250;

        this.noiseMap = new THREE.TextureLoader().load("textures/noise.png");
        this.noiseMap.wrapS = THREE.RepeatWrapping;
        this.noiseMap.wrapT = THREE.RepeatWrapping;
        this.noiseScale = 2;

        this.customProgramCacheKey = () => Math.random().toString();
    }

    /**
     * @param {THREE.Shader} shader
     */
    onBeforeCompile(shader) {
        // console.log(shader);
        // console.log(shader.vertexShader);

        shader.uniforms.time = { value: 0 };
        shader.uniforms.noiseScale = { value: this.noiseScale };
        shader.uniforms.noiseMap = {
            value: this.noiseMap,
        };

        shader.vertexShader = shader.vertexShader
            .replace(
                /#include <common>/,
                /* glsl */ `
#include <common>
#define USE_UV
uniform float time;
uniform float noiseScale;
uniform sampler2D noiseMap;
                `.trim()
            )
            .replace(
                /\t*#include <displacementmap_vertex>/,
                /* glsl */ `
#if defined(USE_DISPLACEMENTMAP)

    transformed += normalize(objectNormal) * (
        texture2D(displacementMap, vUv).x *
        texture2D(noiseMap, vUv * noiseScale).x *
        displacementScale +
        displacementBias
    );

#endif
                `.trim()
            );
    }
}
