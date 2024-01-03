import * as THREE from "three";

export class ObstacleMaterial extends THREE.MeshStandardMaterial {
    /**
     * @param {THREE.Material} parent
     */
    constructor(parent) {
        super();

        this.copy(parent);

        this.uniforms = {
            time: { value: 0 },
        };

        this.customProgramCacheKey = () => Math.random().toString();
    }

    /**
     * @param {THREE.ShaderLibShader} shader
     */
    onBeforeCompile(shader) {
        shader.uniforms.time = this.uniforms.time;

        shader.vertexShader = shader.vertexShader
            .replace(
                /#include <common>/,
                /* glsl */ `
#include <common>
uniform float time;
                `.trim()
            )
            .replace(
                /#include <displacementmap_pars_vertex>/,
                /* glsl */ `
#ifdef USE_DISPLACEMENTMAP

	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;

#else
    
    uniform float displacementScale;
    uniform float displacementBias;

#endif
                `.trim()
            )
            .replace(
                /\t*#include <displacementmap_vertex>/,
                /* glsl */ `
#if defined(USE_DISPLACEMENTMAP)

    transformed += normalize(objectNormal) * (
        texture2D(displacementMap, vUv).x *
        (sin(time * PI) + 1.0) *
        displacementScale +
        displacementBias
    );

#else
    
    transformed += normalize(objectNormal) * (
        (sin(time * PI) + 1.0) *
        displacementScale +
        displacementBias
    );

#endif
                `.trim()
            );
    }
}
