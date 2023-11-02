import * as THREE from "three";

interface SceneData {
    public options: OptionsData;
    public fog: FogData;

    public textures: Record<string, TextureData>;
    public materials: Record<string, MaterialData>;
    public cameras: Record<string, CameraData>;
    public nodes: Record<string, NodeData>;

    public activeCameraId: string;
    public rootId: string;
}

interface Data<T extends string = string> {
    type: T;
    custom: unknown;
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

type MagFilter = "LinearFilter" | "NearestFilter";
type MinFilter =
    | "LinearMipMapLinearFilter"
    | "LinearMipMapNearestFilter"
    | "NearestFilter";

interface TextureData extends Data<"texture"> {
    id: string;
    filepath: string;
    anisotropy: number;
    isVideo: boolean;
    magFilter: MagFilter;
    minFilter: MinFilter;
    mipmaps: boolean;
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
    bump_ref?: string;
    bump_scale: number;
    texlength_s: number;
    texlength_t: number;
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

type ChildData = NodeData | LightData | PrimitiveData;

interface NodeData extends Data<"node"> {
    id: string;
    children: ChildData[];
    materialIds: string[];
    transformations: TransformationData[];
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
    | NurbsData;

interface BasePrimitiveData<T extends string = string, R>
    extends Data<"primitive"> {
    subtype: T;
    representations: (R & {
        type: T;
        distance: number;
    })[];
}

type RectangleData = BasePrimitiveData<
    "rectangle",
    {
        xy1: Vector2;
        xy2: Vector2;
        parts_x: number;
        parts_y: number;
    }
>;

type TriangleData = BasePrimitiveData<
    "triangle",
    {
        xyz1: Vector3;
        xyz2: Vector3;
        xyz3: Vector3;
    }
>;

type BoxData = BasePrimitiveData<
    "box",
    {
        xyz1: Vector3;
        xyz2: Vector3;
        parts_x: number;
        parts_y: number;
        parts_z: number;
    }
>;

type CylinderData = BasePrimitiveData<
    "cylinder",
    {
        height: number;
        top: number;
        base: number;
        stacks: number;
        slices: number;
        capsclose: boolean;
        thetastart: number;
        thetalength: number;
    }
>;

type SphereData = BasePrimitiveData<
    "sphere",
    {
        radius: number;
        slices: number;
        stacks: number;
        thetastart: number;
        thetalength: number;
        phistart: number;
        philength: number;
    }
>;

type NurbsData = BasePrimitiveData<
    "nurbs",
    {
        degree_u: number;
        degree_v: number;
        controlpoints: ControlPointData[];
        parts_u: number;
        parts_v: number;
    }
>;

interface ControlPointData {
    type: "controlpoint";
    xx: number;
    yy: number;
    zz: number;
}

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
