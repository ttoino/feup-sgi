import * as THREE from "three";

interface SceneData {
    options: OptionsData;
    fog: FogData;

    skyboxes: Record<string, SkyboxData>;
    textures: Record<string, TextureData>;
    materials: Record<string, MaterialData>;
    cameras: Record<string, CameraData>;
    nodes: Record<string, NodeData>;
    lods: Record<string, LodData>;

    activeCameraId: string;
    rootId: string;
}

interface Data<T extends string = string> {
    type: T;
    custom: Record<string | number | symbol, unknown>;
}

type Vector2 = [number, number];
type Vector3 = [number, number, number];
type Vector4 = [number, number, number, number];

interface OptionsData extends Data<"globals"> {
    ambient: THREE.Color;
    background: THREE.Color;
}

interface FogData extends Data<"fog"> {
    color: THREE.Color;
    near: number;
    far: number;
}

interface SkyboxData extends Data<"skybox"> {
    size: Vector3;
    center: Vector3;
    emissive: THREE.Color;
    intensity: number;
    front: string;
    back: string;
    up: string;
    down: string;
    left: string;
    right: string;
}

type MagFilter = "LinearFilter" | "NearestFilter";
type MinFilter =
    | "LinearMipMapLinearFilter"
    | "LinearMipMapNearestFilter"
    | "NearestMipMapLinearFilter"
    | "NearestMipMapNearestFilter";

interface TextureData extends Data<"texture"> {
    id: string;
    filepath: string;
    anisotropy: number;
    isVideo: boolean;
    magFilter: MagFilter;
    minFilter: MinFilter;
    mipmaps: boolean;
    mipmap0?: string;
    mipmap1?: string;
    mipmap2?: string;
    mipmap3?: string;
    mipmap4?: string;
    mipmap5?: string;
    mipmap6?: string;
    mipmap7?: string;
}

type Shading = "smooth" | "flat" | "none";

interface MaterialData extends Data<"material"> {
    id: string;
    color: THREE.Color;
    specular: THREE.Color;
    emissive: THREE.Color;
    shading: Shading;
    shininess: number;
    wireframe: boolean;
    twosided: boolean;
    textureref?: string;
    texlength_s: number;
    texlength_t: number;
    bumpref?: string;
    bumpscale: number;
    specularref?: string;
}

type CameraData = PerspectiveCameraData | OrthographicCameraData;

interface PerspectiveCameraData extends Data<"perspective"> {
    id: string;
    near: number;
    far: number;
    angle: number;
    location: Vector3;
    target: Vector3;
}

interface OrthographicCameraData extends Data<"orthogonal"> {
    id: string;
    near: number;
    far: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    location: Vector3;
    target: Vector3;
}

type ChildData = NodeData | LodData | LightData | PrimitiveData;

interface NodeData extends Data<"node"> {
    id: string;
    castShadows: boolean;
    receiveShadows: boolean;
    children: ChildData[];
    materialIds: string[];
    transformations: TransformationData[];
}

interface LodData extends Data<"lod"> {
    id: string;
    children: LodChildData[];
}

interface LodChildData extends Data<"lodnoderef"> {
    mindist: number;
    node: NodeData;
}

type LightData = PointLightData | SpotLightData | DirectionalLightData;

interface PointLightData extends Data<"pointlight"> {
    id: string;
    position: Vector3;
    color: THREE.Color;
    intensity: number;
    distance: number;
    decay: number;
    enabled: boolean;
    castshadow: boolean;
    shadowfar: number;
    shadowmapsize: number;
    // blink_enabled: boolean;
    // blink_period: number;
}

interface SpotLightData extends Data<"spotlight"> {
    id: string;
    position: Vector3;
    target: Vector3;
    color: THREE.Color;
    intensity: number;
    distance: number;
    angle: number;
    penumbra: number;
    decay: number;
    enabled: boolean;
    castshadow: boolean;
    shadowfar: number;
    shadowmapsize: number;
}

interface DirectionalLightData extends Data<"directionallight"> {
    id: string;
    position: Vector3;
    // FIXME: there is no target for directional lights
    // target: Vector3;
    color: THREE.Color;
    intensity: number;
    enabled: boolean;
    castshadow: boolean;
    shadowfar: number;
    shadowleft: number;
    shadowright: number;
    shadowtop: number;
    shadowbottom: number;
    shadowmapsize: number;
}

type PrimitiveData =
    | RectangleData
    | TriangleData
    | BoxData
    | CylinderData
    | SphereData
    | NurbsData
    | PolygonData;

interface BasePrimitiveData<R, T extends string = string>
    extends Data<"primitive"> {
    subtype: T;
    representations: (R & {
        type: T;
        distance: number;
    })[];
}

type RectangleData = BasePrimitiveData<
    {
        xy1: Vector2;
        xy2: Vector2;
        parts_x: number;
        parts_y: number;
    },
    "rectangle"
>;

type TriangleData = BasePrimitiveData<
    {
        xyz1: Vector3;
        xyz2: Vector3;
        xyz3: Vector3;
    },
    "triangle"
>;

type BoxData = BasePrimitiveData<
    {
        xyz1: Vector3;
        xyz2: Vector3;
        parts_x: number;
        parts_y: number;
        parts_z: number;
    },
    "box"
>;

type CylinderData = BasePrimitiveData<
    {
        height: number;
        top: number;
        base: number;
        stacks: number;
        slices: number;
        capsclose: boolean;
        thetastart: number;
        thetalength: number;
    },
    "cylinder"
>;

type SphereData = BasePrimitiveData<
    {
        radius: number;
        slices: number;
        stacks: number;
        thetastart: number;
        thetalength: number;
        phistart: number;
        philength: number;
    },
    "sphere"
>;

type NurbsData = BasePrimitiveData<
    {
        degree_u: number;
        degree_v: number;
        controlpoints: ControlPointData[];
        parts_u: number;
        parts_v: number;
    },
    "nurbs"
>;

interface ControlPointData {
    type: "controlpoint";
    xx: number;
    yy: number;
    zz: number;
}

type PolygonData = BasePrimitiveData<
    {
        radius: number;
        stacks: number;
        slices: number;
        color_c: THREE.Color;
        color_p: THREE.Color;
    },
    "polygon"
>;

type TransformationData = TranslationData | RotationData | ScaleData;

interface TranslationData extends Data<"T"> {
    translate: Vector3;
}

interface RotationData extends Data<"R"> {
    rotation: Vector3;
}

interface ScaleData extends Data<"S"> {
    scale: Vector3;
}
