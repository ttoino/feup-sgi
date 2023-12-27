declare module "three/addons/postprocessing/EffectComposer.js" {
    import * as THREE from "three";
    import { Pass } from "three/addons/postprocessing/Pass.js";
    import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

    export class EffectComposer {
        constructor(
            renderer: THREE.WebGLRenderer,
            renderTarget?: THREE.RenderTarget
        );

        renderer: THREE.WebGLRenderer;

        renderTarget1: THREE.RenderTarget;
        writeBuffer: THREE.RenderTarget;

        renderTarget2: THREE.RenderTarget;
        readBuffer: THREE.RenderTarget;

        renderToScreen: boolean;

        passes: Pass[];

        copyPass: ShaderPass;

        clock: THREE.Clock;

        swapBuffers(): void;

        addPass(pass: Pass): void;

        insertPass(pass: Pass, index: number): void;

        removePass(pass: Pass): void;

        isLastEnabledPass(passIndex: number): boolean;

        render(deltaTime?: number): void;

        reset(renderTarget?: THREE.RenderTarget): void;

        setSize(width: number, height: number): void;

        setPixelRatio(pixelRatio: number): void;

        dispose(): void;
    }
}

declare module "three/addons/postprocessing/FilmPass.js" {
    import * as THREE from "three";
    import { Pass, FullscreenQuad } from "three/addons/postprocessing/Pass.js";

    export class FilmPass extends Pass {
        constructor(intensity = 0.5, grayscale = false);

        uniforms: { [uniform: string]: THREE.IUniform };

        material: THREE.ShaderMaterial;

        fsQuad: FullscreenQuad;

        override render(
            renderer: THREE.WebGLRenderer,
            writeBuffer: THREE.RenderTarget,
            readBuffer: THREE.RenderTarget,
            delta: number,
            maskActive: boolean
        ): void;
    }
}

declare module "three/addons/postprocessing/OutlinePass.js" {
    import * as THREE from "three";
    import { Pass, FullscreenQuad } from "three/addons/postprocessing/Pass.js";

    export class OutlinePass extends Pass {
        constructor(
            resolution: THREE.Vector2 = new THREE.Vector2(256, 256),
            scene: THREE.Scene,
            camera: THREE.Camera,
            selectedObjects: THREE.Object3D[] = []
        );

        renderScene: THREE.Scene;
        renderCamera: THREE.Camera;
        selectedObjects: THREE.Object3D[];
        visibleEdgeColor: THREE.Color;
        hiddenEdgeColor: THREE.Color;
        edgeGlow: number;
        usePatternTexture: boolean;
        edgeThickness: number;
        edgeStrength: number;
        downSampleRatio: number;
        pulsePeriod: number;

        resolution: THREE.Vector2;

        renderTargetMaskBuffer: THREE.WebGLRenderTarget;

        depthMaterial: THREE.MeshDepthMaterial;

        prepareMaskMaterial: THREE.ShaderMaterial;

        renderTargetDepthBuffer: THREE.WebGLRenderTarget;

        renderTargetMaskDownSampleBuffer: THREE.WebGLRenderTarget;

        renderTargetBlurBuffer1: THREE.WebGLRenderTarget;

        edgeDetectionMaterial: THREE.ShaderMaterial;

        separableBlurMaterial1: THREE.ShaderMaterial;

        overlayMaterial: THREE.ShaderMaterial;

        copyUniforms: { [uniform: string]: THREE.IUniform };

        materialCopy: THREE.ShaderMaterial;

        oldClearAlpha: number;

        fsQuad: FullscreenQuad;

        tempPulseColor1: THREE.Color;
        tempPulseColor2: THREE.Color;
        textureMatrix: THREE.Matrix4;

        override render(
            renderer: THREE.WebGLRenderer,
            writeBuffer: THREE.RenderTarget,
            readBuffer: THREE.RenderTarget,
            delta: number,
            maskActive: boolean
        ): void;
    }
}

declare module "three/addons/postprocessing/OutputPass.js" {
    import * as THREE from "three";
    import { Pass, FullscreenQuad } from "three/addons/postprocessing/Pass.js";

    export class OutputPass extends Pass {
        constructor();

        uniforms: { [uniform: string]: THREE.IUniform };

        material: THREE.RawShaderMaterial;

        fsQuad: FullscreenQuad;

        override render(
            renderer: THREE.WebGLRenderer,
            writeBuffer: THREE.RenderTarget,
            readBuffer: THREE.RenderTarget,
            delta: number,
            maskActive: boolean
        ): void;
    }
}

declare module "three/addons/postprocessing/Pass.js" {
    import * as THREE from "three";

    export abstract class Pass {
        constructor();

        isPass: true;
        enabled: boolean;
        needsSwap: boolean;
        clear: boolean;
        renderToScreen: boolean;

        setSize(width: number, height: number): void;

        abstract render(
            renderer: THREE.WebGLRenderer,
            writeBuffer: THREE.RenderTarget,
            readBuffer: THREE.RenderTarget,
            delta: number,
            maskActive: boolean
        ): void;

        dispose(): void;
    }

    export class FullscreenQuad {
        constructor(material: THREE.Material);

        material: THREE.Material;
        render(renderer: THREE.WebGLRenderer): void;
        dispose(): void;
    }
}

declare module "three/addons/postprocessing/ShaderPass.js" {
    import * as THREE from "three";
    import { Pass, FullscreenQuad } from "three/addons/postprocessing/Pass.js";

    export class ShaderPass extends Pass {
        constructor(shader: THREE.Shader, textureID?: string);

        textureID: string;

        uniforms: { [uniform: string]: THREE.IUniform };

        material: THREE.ShaderMaterial;

        fsQuad: FullscreenQuad;

        override render(
            renderer: THREE.WebGLRenderer,
            writeBuffer: THREE.RenderTarget,
            readBuffer: THREE.RenderTarget,
            delta: number,
            maskActive: boolean
        ): void;
    }
}

declare module "three/addons/postprocessing/SSAARenderPass.js" {
    import * as THREE from "three";
    import { Pass, FullscreenQuad } from "three/addons/postprocessing/Pass.js";

    export class SSAARenderPass extends Pass {
        constructor(
            scene: THREE.Scene,
            camera: THREE.Camera,
            clearColor: THREE.Color | string | number = 0x000000,
            clearAlpha: number = 0
        );

        scene: THREE.Scene;
        camera: THREE.Camera;
        clearColor: THREE.Color | string | number;
        clearAlpha: number;

        sampleLevel: number;
        unbiased: boolean;

        copyUniforms: { [uniform: string]: THREE.IUniform };

        copyMaterial: THREE.ShaderMaterial;

        fsQuad: FullscreenQuad;

        override render(
            renderer: THREE.WebGLRenderer,
            writeBuffer: THREE.RenderTarget,
            readBuffer: THREE.RenderTarget,
            delta: number,
            maskActive: boolean
        ): void;
    }
}

declare module "three/addons/postprocessing/UnrealBloomPass.js" {
    import * as THREE from "three";
    import { Pass, FullscreenQuad } from "three/addons/postprocessing/Pass.js";

    export class UnrealBloomPass extends Pass {
        constructor(
            resolution: THREE.Vector2 = new THREE.Vector2(256, 256),
            strength: number = 1,
            radius?: number,
            threshold?: number
        );

        strength: number;
        radius: number;
        threshold: number;
        resolution: THREE.Vector2;

        clearColor: THREE.Color;

        renderTargetsHorizontal: THREE.WebGLRenderTarget[];
        renderTargetsVertical: THREE.WebGLRenderTarget[];
        nMips: number;

        renderTargetBright: THREE.WebGLRenderTarget;

        highPassUniforms: { [uniform: string]: THREE.IUniform };

        materialHighPassFilter: THREE.ShaderMaterial;

        separableBlurMaterials: THREE.ShaderMaterial[];

        compositeMaterial: THREE.ShaderMaterial;

        bloomTintColors: THREE.Vector3[];

        copyUniforms: { [uniform: string]: THREE.IUniform };

        blendMaterial: THREE.ShaderMaterial;

        basic: THREE.MeshBasicMaterial;

        fsQuad: FullscreenQuad;

        override render(
            renderer: THREE.WebGLRenderer,
            writeBuffer: THREE.RenderTarget,
            readBuffer: THREE.RenderTarget,
            delta: number,
            maskActive: boolean
        ): void;
    }
}
