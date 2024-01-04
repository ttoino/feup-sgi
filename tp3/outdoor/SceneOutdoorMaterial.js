import * as THREE from "three";

export class SceneOutdoorMaterial extends THREE.MeshStandardMaterial {
    constructor() {
        super();

        this.customProgramCacheKey = () => Math.random().toString();

        this.uniforms = {
            cameraNear: { value: 0 },
            cameraFar: { value: 0 },
        }
    }

    /**
     * @param {THREE.ShaderLibShader} shader
     */
    onBeforeCompile(shader) {
        shader.uniforms.cameraNear = this.uniforms.cameraNear;
        shader.uniforms.cameraFar = this.uniforms.cameraFar;

        shader.vertexShader = shader.vertexShader
            .replace(
                /#include <common>/,
                /* glsl */ `
#include <common>
#include <packing>
#define USE_UV
uniform float cameraNear;
uniform float cameraFar;
                `.trim()
            )
            .replace(
                /\t*#include <displacementmap_vertex>/,
                /* glsl */ `
#if defined(USE_DISPLACEMENTMAP)

    transformed += normalize(objectNormal) * (
        (1.0 - viewZToOrthographicDepth(
            perspectiveDepthToViewZ(
                texture2D(displacementMap, vUv).x,
                cameraNear,
                cameraFar
            ),
            cameraNear,
            cameraFar
        )) *
        displacementScale +
        displacementBias
    );

#endif
                `.trim()
            );
    }
}
