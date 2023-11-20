/// @ts-check
/// <reference path="types.d.ts"/>

import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import { MySceneData } from "./parser/MySceneData.js";
import { MyApp } from "./MyApp.js";
import { degreesToRadians } from "./MyMath.js";
// @ts-expect-error
import { NURBSSurface } from "three/addons/curves/NURBSSurface.js";
// @ts-expect-error
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

/**
 *  This class contains the contents of out application
 */
class MyContents {
    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app;
        this.axis = null;

        this.showHelpers = true;
        this.helpers = [];

        this.showAllWireframes = false;
        this.showPlaneWireframes = false;
        this.showHangarWireframes = false;
        this.showCratesWireframes = false;
        this.showGroundWireframes = false;
        this.showSkyboxWireframes = false;

        /** @type {Record<string, THREE.Object3D>} */
        this.skyboxes = {};

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.reader.open("scenes/hangar/scene.xml");
    }

    /**
     * initializes the contents
     */
    init() {
        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this.app);
            this.app.scene.add(this.axis);
        }
    }

    /**
     * Updates the helpers of the scene on user input (controlled through the GUI).
     */
    updateHelpers() {
        this.helpers.forEach((h) => (h.visible = this.showHelpers));
    }

    updateWireframeAll() {

        this.showPlaneWireframes = this.showAllWireframes;
        this.showHangarWireframes = this.showAllWireframes;
        this.showCratesWireframes = this.showAllWireframes;
        this.showGroundWireframes = this.showAllWireframes;
        this.showSkyboxWireframes = this.showAllWireframes;

        const helperRegex = /.*[Hh]elper.*/;

        this.app.scene.traverse((node) => {

            console.log(node);

            if (helperRegex.test(node.type)) return;

            if (node instanceof THREE.Mesh) {
                node.material.wireframe = this.showAllWireframes;
            }
        });
    }

    updateWireframePlane() {

        if (!this.showPlaneWireframes) this.showAllWireframes = false;

        const nameRegex = /.*plane.*/;

        this.app.scene.traverse((node) => {
            if (node instanceof THREE.Mesh) {
                if (nameRegex.test(node.material.name))
                    node.material.wireframe = this.showPlaneWireframes;
            }
        });
    }

    updateWireframeHangar() {

        if (!this.showHangarWireframes) this.showAllWireframes = false;

        const nameRegex = /.*hangar.*/

        this.app.scene.traverse((node) => {
            if (node instanceof THREE.Mesh) {
                if (nameRegex.test(node.material.name))
                    node.material.wireframe = this.showHangarWireframes;
            }
        });
    }

    updateWireframeCrates() {

        if (!this.showCratesWireframes) this.showAllWireframes = false;

        const nameRegex = /.*crate.*/

        this.app.scene.traverse((node) => {
            if (node instanceof THREE.Mesh) {
                if (nameRegex.test(node.material.name))
                    node.material.wireframe = this.showCratesWireframes;
            }
        });
    }

    updateWireframeGround() {

        if (!this.showGroundWireframes) this.showAllWireframes = false;

        const nameRegex = /.*ground.*/

        this.app.scene.traverse((node) => {
            if (node instanceof THREE.Mesh) {
                if (nameRegex.test(node.material.name))
                    node.material.wireframe = this.showGroundWireframes;
            }
        });
    }

    updateWireframeSkybox() {

        if (!this.showSkyboxWireframes) this.showAllWireframes = false;

        Object.values(this.skyboxes).forEach((skybox) => {
            skybox.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.wireframe = this.showSkyboxWireframes;
                }
            });
        });
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info(
            "scene data loaded",
            data,
            "visit MySceneData javascript class to check contents for each data item."
        );
        // @ts-expect-error
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log(new Array(indent * 4).join(" "), "-", obj);
    }

    /**
     * @param {import("./types.js").SceneData} data
     */
    onAfterSceneLoadedAndBeforeRender(data) {
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item

        this.output(data.options);

        this.app.renderer.setClearColor(data.options.background);
        this.ambientLight = new THREE.AmbientLight(data.options.ambient);
        this.app.scene.add(this.ambientLight);

        this.app.scene.fog = new THREE.Fog(
            data.fog.color,
            data.fog.near,
            data.fog.far
        );

        const textureLoader = new THREE.TextureLoader();

        for (let id in data.skyboxes) {
            let skybox = data.skyboxes[id];

            const baseMaterial = new THREE.MeshLambertMaterial({
                emissive: skybox.emissive,
                emissiveIntensity: skybox.intensity,
                color: 0x000000,
                fog: false,
            });
            const size = new THREE.Vector3(...skybox.size);

            const frontMaterial = baseMaterial.clone();
            frontMaterial.emissiveMap = textureLoader.load(skybox.front);

            const backMaterial = baseMaterial.clone();
            backMaterial.emissiveMap = textureLoader.load(skybox.back);

            const upMaterial = baseMaterial.clone();
            upMaterial.emissiveMap = textureLoader.load(skybox.up);

            const downMaterial = baseMaterial.clone();
            downMaterial.emissiveMap = textureLoader.load(skybox.down);

            const leftMaterial = baseMaterial.clone();
            leftMaterial.emissiveMap = textureLoader.load(skybox.left);

            const rightMaterial = baseMaterial.clone();
            rightMaterial.emissiveMap = textureLoader.load(skybox.right);

            this.skyboxes[id] = new THREE.Group();
            this.skyboxes[id].position.set(...skybox.center);

            const front = new THREE.Mesh(
                new THREE.PlaneGeometry(size.x, size.y),
                frontMaterial
            );
            front.position.set(0, 0, size.z / 2);
            front.rotation.y = Math.PI;

            const back = new THREE.Mesh(
                new THREE.PlaneGeometry(size.x, size.y),
                backMaterial
            );
            back.position.set(0, 0, -size.z / 2);

            const up = new THREE.Mesh(
                new THREE.PlaneGeometry(size.x, size.z),
                upMaterial
            );
            up.position.set(0, size.y / 2, 0);
            up.rotation.x = Math.PI / 2;
            up.rotation.z = Math.PI;

            const down = new THREE.Mesh(
                new THREE.PlaneGeometry(size.x, size.z),
                downMaterial
            );
            down.position.set(0, -size.y / 2, 0);
            down.rotation.x = -Math.PI / 2;
            down.rotation.z = Math.PI;

            const left = new THREE.Mesh(
                new THREE.PlaneGeometry(size.z, size.y),
                leftMaterial
            );
            left.position.set(size.x / 2, 0, 0);
            left.rotation.y = -Math.PI / 2;

            const right = new THREE.Mesh(
                new THREE.PlaneGeometry(size.z, size.y),
                rightMaterial
            );
            right.position.set(-size.x / 2, 0, 0);
            right.rotation.y = Math.PI / 2;

            this.skyboxes[id].add(front, back, up, down, left, right);
            this.app.scene.add(this.skyboxes[id]);
        }

        console.log("textures:");
        /** @type {Record<string, THREE.Texture>} */
        this.textures = {};
        for (let id in data.textures) {
            let texture = data.textures[id];
            this.output(texture, 1);

            // TODO: isVideo, mipmaps, anisotropy
            this.textures[id] = textureLoader.load(texture.filepath);
            this.textures[id].magFilter = THREE[texture.magFilter];
            this.textures[id].minFilter = THREE[texture.minFilter];
            this.textures[id].wrapS = THREE.RepeatWrapping;
            this.textures[id].wrapT = THREE.RepeatWrapping;
        }

        console.log("materials:");
        /** @type {Record<string, THREE.MeshPhongMaterial>} */
        this.materials = {};
        for (let id in data.materials) {
            let material = data.materials[id];
            this.output(material, 1);

            // TODO: shading = none
            this.materials[id] = new THREE.MeshPhongMaterial({
                name: `Material ${id}`,
                color: material.color,
                specular: material.specular,
                emissive: material.emissive,
                shininess: material.shininess,
                wireframe: material.wireframe,
                flatShading: material.shading === "flat",
                map: material.textureref
                    ? this.textures[material.textureref]
                    : undefined,
                side: material.twosided ? THREE.DoubleSide : THREE.FrontSide,
                bumpMap: material.bumpref
                    ? this.textures[material.bumpref]
                    : undefined,
                bumpScale: material.bumpscale,
                specularMap: material.specularref
                    ? this.textures[material.specularref]
                    : undefined,
            });

            this.materials[id].map?.repeat.set(
                1 / material.texlength_s,
                1 / material.texlength_t
            );
            this.materials[id].bumpMap?.repeat.set(
                1 / material.texlength_s,
                1 / material.texlength_t
            );
            this.materials[id].specularMap?.repeat.set(
                1 / material.texlength_s,
                1 / material.texlength_t
            );
        }

        console.log("cameras:");
        /** @type {Record<string, THREE.Camera>} */
        this.app.cameras = {};
        const aspect = window.innerWidth / window.innerHeight;
        for (let id in data.cameras) {
            let camera = data.cameras[id];
            this.output(camera, 1);

            let threeCamera = null;
            switch (camera.type) {
                case "orthogonal":
                    threeCamera = new THREE.OrthographicCamera(
                        camera.left,
                        camera.right,
                        camera.top,
                        camera.bottom,
                        camera.near,
                        camera.far
                    );
                    break;
                case "perspective":
                    threeCamera = new THREE.PerspectiveCamera(
                        camera.angle,
                        aspect,
                        camera.near,
                        camera.far
                    );
                    break;
            }

            threeCamera.position.set(...camera.location);
            threeCamera.lookAt(new THREE.Vector3(...camera.target));

            this.app.cameras[id] = threeCamera;
        }
        this.app.setActiveCamera(data.activeCameraId);

        this.app.scene.add(this.generateNode(data.nodes[data.rootId]));
    }

    /**
     * @param {import("./types.js").NodeData} node
     * @param {boolean} pCastShadow
     * @param {boolean} pReceiveShadow
     * @param {THREE.Material | undefined} pMaterial
     *
     * @returns {THREE.Object3D}
     */
    generateNode(
        node,
        pCastShadow = false,
        pReceiveShadow = false,
        pMaterial = undefined
    ) {
        const castShadow = node.castShadows || pCastShadow;
        const receiveShadow = node.receiveShadows || pReceiveShadow;
        const material = this.materials?.[node.materialIds[0]] ?? pMaterial;

        const group = new THREE.Group();

        group.add(
            ...node.children.map((child) =>
                this.generateChild(child, castShadow, receiveShadow, material)
            )
        );

        group.castShadow = castShadow;
        group.receiveShadow = receiveShadow;

        node.transformations.forEach((transformation) => {
            switch (transformation.type) {
                case "T":
                    group.translateX(transformation.translate[0]);
                    group.translateY(transformation.translate[1]);
                    group.translateZ(transformation.translate[2]);
                    break;
                case "R":
                    group.rotateX(degreesToRadians(transformation.rotation[0]));
                    group.rotateY(degreesToRadians(transformation.rotation[1]));
                    group.rotateZ(degreesToRadians(transformation.rotation[2]));
                    break;
                case "S":
                    group.scale.set(...transformation.scale);
                    break;
            }
        });

        return group;
    }

    /**
     *
     * @param {import("./types.js").LodData} lod
     * @param {boolean} castShadow
     * @param {boolean} receiveShadow
     * @param {THREE.Material | undefined} material
     *
     * @returns {THREE.Object3D}
     */
    generateLod(lod, castShadow, receiveShadow, material) {
        const lod3 = new THREE.LOD();

        lod.children.forEach((c) =>
            lod3.addLevel(
                this.generateNode(c.node, castShadow, receiveShadow, material),
                c.mindist
            )
        );

        return lod3;
    }

    /**
     * @param {import("./types.js").ChildData} node
     * @param {boolean} castShadow
     * @param {boolean} receiveShadow
     * @param {THREE.Material | undefined} material
     *
     * @returns {THREE.Object3D}
     */
    generateChild(node, castShadow, receiveShadow, material) {
        switch (node.type) {
            case "primitive":
                return this.generatePrimitive(
                    node,
                    castShadow,
                    receiveShadow,
                    material
                );
            case "node":
                return this.generateNode(
                    node,
                    castShadow,
                    receiveShadow,
                    material
                );
            case "lod":
                return this.generateLod(
                    node,
                    castShadow,
                    receiveShadow,
                    material
                );
            case "pointlight": {
                const light = new THREE.PointLight(
                    node.color,
                    node.intensity,
                    node.distance,
                    node.decay
                );
                light.position.set(...node.position);
                light.castShadow = node.castshadow;
                light.shadow.camera.far = node.shadowfar;
                light.shadow.mapSize.set(
                    node.shadowmapsize,
                    node.shadowmapsize
                );
                light.visible = node.enabled;

                const helper = new THREE.PointLightHelper(light, 1);
                this.app.scene.add(helper);
                this.helpers.push(helper);

                return light;
            }
            case "spotlight": {
                const light = new THREE.SpotLight(
                    node.color,
                    node.intensity,
                    node.distance,
                    degreesToRadians(node.angle),
                    node.penumbra,
                    node.decay
                );
                light.position.set(...node.position);
                light.target.position.set(...node.target);
                light.castShadow = node.castshadow;
                light.shadow.camera.far = node.shadowfar;
                light.shadow.mapSize.set(
                    node.shadowmapsize,
                    node.shadowmapsize
                );
                light.visible = node.enabled;

                const helper = new THREE.SpotLightHelper(light);
                this.app.scene.add(helper);
                this.helpers.push(helper);

                return light;
            }
            case "directionallight": {
                const light = new THREE.DirectionalLight(
                    node.color,
                    node.intensity
                );
                light.position.set(...node.position);
                light.castShadow = node.castshadow;
                light.shadow.camera.left = node.shadowleft;
                light.shadow.camera.right = node.shadowright;
                light.shadow.camera.top = node.shadowtop;
                light.shadow.camera.bottom = node.shadowbottom;
                light.shadow.camera.far = node.shadowfar;
                light.shadow.mapSize.set(
                    node.shadowmapsize,
                    node.shadowmapsize
                );
                light.visible = node.enabled;

                const helper = new THREE.DirectionalLightHelper(light, 1);
                this.app.scene.add(helper);
                this.helpers.push(helper);

                return light;
            }
        }

        // @ts-expect-error
        console.log(node.type);

        return new THREE.Object3D();
    }

    /**
     * @param {import("./types.js").PrimitiveData} primitive
     * @param {boolean} castShadow
     * @param {boolean} receiveShadow
     * @param {THREE.Material | undefined} material
     *
     * @returns {THREE.Object3D}
     */
    generatePrimitive(primitive, castShadow, receiveShadow, material) {
        let mesh;

        switch (primitive.subtype) {
            case "rectangle": {
                const representation = primitive.representations[0];

                const x = (representation.xy2[0] + representation.xy1[0]) / 2;
                const y = (representation.xy2[1] + representation.xy1[1]) / 2;

                const width = representation.xy2[0] - representation.xy1[0];
                const height = representation.xy2[1] - representation.xy1[1];

                const geometry = new THREE.PlaneGeometry(
                    width,
                    height,
                    representation.parts_x,
                    representation.parts_y
                );
                const uvs = geometry.getAttribute("uv").array;
                geometry.setAttribute(
                    "uv",
                    new THREE.Float32BufferAttribute(
                        uvs.map((uv, i) => (i % 2 ? uv * height : uv * width)),
                        2
                    )
                );

                mesh = new THREE.Mesh(geometry, material);

                mesh.position.set(x, y, 0);

                break;
            }
            case "triangle": {
                const representation = primitive.representations[0];

                const p1 = representation.xyz1;
                const p2 = representation.xyz2;
                const p3 = representation.xyz3;

                const geom = new THREE.BufferGeometry().setFromPoints(
                    [p1, p2, p3].map((p) => new THREE.Vector3(...p))
                );
                geom.computeVertexNormals();

                mesh = new THREE.Mesh(geom, material);

                break;
            }
            case "box": {
                const representation = primitive.representations[0];

                const x = (representation.xyz2[0] + representation.xyz1[0]) / 2;
                const y = (representation.xyz2[1] + representation.xyz1[1]) / 2;
                const z = (representation.xyz2[2] + representation.xyz1[2]) / 2;

                const width = representation.xyz2[0] - representation.xyz1[0];
                const height = representation.xyz2[1] - representation.xyz1[1];
                const depth = representation.xyz2[2] - representation.xyz1[2];

                mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(
                        width,
                        height,
                        depth,
                        representation.parts_x,
                        representation.parts_y,
                        representation.parts_z
                    ),
                    material
                );

                mesh.position.set(x, y, z);

                break;
            }
            case "cylinder": {
                const representation = primitive.representations[0];

                mesh = new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        representation.top,
                        representation.base,
                        representation.height,
                        representation.slices,
                        representation.stacks,
                        representation.capsclose,
                        representation.thetastart,
                        representation.thetalength
                    ),
                    material
                );

                break;
            }
            case "sphere": {
                const representation = primitive.representations[0];

                mesh = new THREE.Mesh(
                    new THREE.SphereGeometry(
                        representation.radius,
                        representation.slices,
                        representation.stacks,
                        representation.phistart,
                        representation.philength,
                        representation.thetastart,
                        representation.thetalength
                    ),
                    material
                );

                break;
            }
            case "nurbs": {
                const representation = primitive.representations[0];

                console.log(representation);

                mesh = this.buildNURBS(
                    representation.controlpoints.map((p) => [
                        p.xx,
                        p.yy,
                        p.zz,
                        1,
                    ]),
                    representation.parts_u,
                    representation.parts_v,
                    representation.degree_u,
                    representation.degree_v,
                    material
                );

                break;
            }
            case "polygon": {
                const representation = primitive.representations[0]

                const radius = representation.radius;
                const slices = representation.slices;
                const stacks = representation.stacks;
                const color_c = representation.color_c;
                const color_p = representation.color_p;

                // Cannot use indexed geometry because of the custom color 

                const vertexCoords = [];
                const colorCoords = [];

                for (let slice = 0; slice < slices; slice++) {
                    const angle = (2 * Math.PI * slice) / slices;
                    const nextAngle = (2 * Math.PI * (slice + 1)) / slices;

                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);

                    const nextCos = Math.cos(nextAngle);
                    const nextSin = Math.sin(nextAngle);

                    // add "- 1" to account for the center stacks
                    // Even though we can just run the loop in the "usual" manner, this is a small optimization that can be done to render less vertices at the center stacks
                    for (let stack = 0; stack < stacks; stack++) {

                        // These ratios tell us how far from the center we are
                        const ratio = 1 - (stack / stacks);
                        const nextRatio = 1 - ((stack + 1) / stacks);

                        const currentRadius = radius * ratio;
                        const nextRadius = radius * nextRatio;

                        const color = color_c.lerp(color_p, ratio);
                        const nextColor = color_c.lerp(color_p, nextRatio);

                        if (stack + 1 !== stacks) {

                            // This probably isn't the most efficient way to do this, but brain no work - Nuno + GH Copilot

                            /*
                             * The following configuration is something like this
                             *
                             * B---A
                             * |  /|
                             * | / |
                             * |/  |
                             * C---D
                             */
                            const pointA = [cos * currentRadius, 0, sin * currentRadius];
                            const pointB = [nextCos * currentRadius, 0, nextSin * currentRadius];
                            const pointC = [nextCos * nextRadius, 0, nextSin * nextRadius];
                            const pointD = [cos * nextRadius, 0, sin * nextRadius];

                            // First triangle
                            vertexCoords.push(...pointA);
                            colorCoords.push(...color);

                            vertexCoords.push(...pointC);
                            colorCoords.push(...nextColor);

                            vertexCoords.push(...pointB);
                            colorCoords.push(...color);

                            // Second triangle
                            vertexCoords.push(...pointA);
                            colorCoords.push(...color);

                            vertexCoords.push(...pointD);
                            colorCoords.push(...nextColor);

                            vertexCoords.push(...pointC);
                            colorCoords.push(...nextColor);
                        } else {

                            console.log("BVoas")

                            // last stack, create less points since this will always be a triangle

                            const pointA = [cos * currentRadius, 0, sin * currentRadius];
                            const pointB = [nextCos * currentRadius, 0, nextSin * currentRadius];
                            const pointC = [nextCos * nextRadius, 0, nextSin * nextRadius];

                            vertexCoords.push(...pointA);
                            colorCoords.push(...color);

                            vertexCoords.push(...pointC);
                            colorCoords.push(...nextColor);

                            vertexCoords.push(...pointB);
                            colorCoords.push(...color);
                        }
                    }
                }

                const vertices = new Float32Array(vertexCoords);
                const colors = new Float32Array(colorCoords);

                const geom = new THREE.BufferGeometry()
                    .setAttribute('position', new THREE.BufferAttribute(vertices, 3))
                    .setAttribute('color', new THREE.BufferAttribute(colors, 3));

                mesh = new THREE.Mesh(geom);

                break;
            }
            default: {
                // @ts-expect-error
                console.log(primitive.subtype);
            }
        }

        if (mesh) {
            mesh.castShadow = castShadow;
            mesh.receiveShadow = receiveShadow;
        }

        return mesh ?? new THREE.Object3D();
    }

    /**
     * Builds the NURB  defined by the given control points using the given samples along the U and V directions.
     * The material is applied to the resulting geometry and the resulting mesh is returned.
     *
     * @param {import("./types.js").Vector4[]} controlPoints the points that control the surface shape
     * @param {number} samples1 the number of samples along the U direction
     * @param {number} samples2 the number of samples along the V direction
     * @param {number} degree1 the number of samples along the U direction
     * @param {number} degree2 the number of samples along the V direction
     * @param {THREE.Material | undefined} material the material to apply to the computed geometry
     * @returns {THREE.Mesh | undefined}
     */
    buildNURBS(controlPoints, samples1, samples2, degree1, degree2, material) {
        if (degree1 < 0 || degree2 < 0) return;

        const knots1 = new Array(degree1 + 1)
            .fill(0)
            .concat(new Array(degree1 + 1).fill(1));
        const knots2 = new Array(degree2 + 1)
            .fill(0)
            .concat(new Array(degree2 + 1).fill(1));

        /** @type {THREE.Vector4[][]} */
        const vControlPoints = [];

        for (let i = 0; i <= degree1; i++) {
            vControlPoints.push([]);

            for (let j = 0; j <= degree2; j++) {
                vControlPoints[i].push(
                    new THREE.Vector4(...controlPoints[i * (degree2 + 1) + j])
                );
            }
        }

        const nurbsSurface = new NURBSSurface(
            degree1,
            degree2,
            knots1,
            knots2,
            vControlPoints
        );

        const geometry = new ParametricGeometry(
            nurbsSurface.getPoint.bind(nurbsSurface),
            samples1,
            samples2
        );

        return new THREE.Mesh(geometry, material);
    }

    update() { }
}

export { MyContents };
