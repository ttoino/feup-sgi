import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import { MySceneData } from "./parser/MySceneData.js";
import { MyApp } from "./MyApp.js";
import { degreesToRadians } from "./MyMath.js";

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

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.reader.open("scenes/demo/demo.xml");
    }

    /**
     * initializes the contents
     */
    init() {
        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this);
            this.app.scene.add(this.axis);
        }
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
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log(new Array(indent * 4).join(" "), "-", obj);
    }

    /**
     * @param {MySceneData} data
     */
    onAfterSceneLoadedAndBeforeRender(data) {
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item

        this.output(data.options);

        this.app.renderer.setClearColor(data.options.background);

        console.log("textures:");
        /** @type {Record<string, THREE.Texture>} */
        this.textures = {};
        for (var id in data.textures) {
            let texture = data.textures[id];
            this.output(texture, 1);

            // TODO: isVideo, magFilter, minFilter, mipmaps, anisotropy
            this.textures[id] = new THREE.TextureLoader().load(
                texture.filepath
            );
        }

        console.log("materials:");
        /** @type {Record<string, THREE.Material>} */
        this.materials = {};
        for (var id in data.materials) {
            let material = data.materials[id];
            this.output(material, 1);

            // TODO: texlength_s, texlength_t, shading = none
            this.materials[id] = new THREE.MeshPhongMaterial({
                color: material.color,
                specular: material.specular,
                emissive: material.emissive,
                shininess: material.shininess,
                wireframe: material.wireframe,
                flatShading: material.shading === "flat",
                map: this.textures[material.textureref],
                side: material.twosided ? THREE.DoubleSide : THREE.FrontSide,
                bumpMap: this.textures[material.bump_ref],
                bumpScale: material.bump_scale,
            });
        }

        console.log("cameras:");
        /** @type {Record<string, THREE.Camera>} */
        this.app.cameras = {};
        const aspect = window.innerWidth / window.innerHeight;
        for (var id in data.cameras) {
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

        console.log("nodes:");
        /** @type {Record<string, THREE.Object3D>} */
        this.nodes = {};
        this.app.scene.add(this.generateSceneGraph(data));
    }

    /**
     * @param {MySceneData} data
     * @param {string} node
     * @param {boolean} castShadow
     * @param {boolean} receiveShadow
     * @param {THREE.Material | undefined} material
     *
     * @returns {THREE.Object3D}
     */
    generateSceneGraph(
        data,
        node = data.rootId,
        pCastShadow = false,
        pReceiveShadow = false,
        pMaterial = undefined
    ) {
        const nodeData = data.nodes[node];

        const castShadow = nodeData.castShadow || pCastShadow;
        const receiveShadow = nodeData.receiveShadow || pReceiveShadow;
        const material = this.materials[nodeData.materialIds[0]] ?? pMaterial;

        const group = new THREE.Group();

        group.add(
            ...nodeData.children.map((child) =>
                this.generateNode(
                    data,
                    child,
                    castShadow,
                    receiveShadow,
                    material
                )
            )
        );

        group.castShadow = castShadow;
        group.receiveShadow = receiveShadow;

        nodeData.transformations.forEach((transformation) => {
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
     * @param {MySceneData} data
     * @param {any} node
     * @param {boolean} castShadow
     * @param {boolean} receiveShadow
     * @param {THREE.Material | undefined} material
     *
     * @returns {THREE.Object3D}
     */
    generateNode(data, node, castShadow, receiveShadow, material) {
        switch (node.type) {
            case "primitive":
                return this.generatePrimitive(
                    node,
                    castShadow,
                    receiveShadow,
                    material
                );
            case "node":
                return this.generateSceneGraph(
                    data,
                    node.id,
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
                light.castShadow = node.castShadow;
                light.shadow.camera.far = node.shadowfar;
                light.shadow.mapSize = node.shadowmapsize;
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
                light.castShadow = node.castShadow;
                light.shadow.camera.far = node.shadowfar;
                light.shadow.mapSize = node.shadowmapsize;
                return light;
            }
            case "directionallight": {
                const light = new THREE.DirectionalLight(
                    node.color,
                    node.intensity
                );
                light.position.set(...node.position);
                light.castShadow = node.castShadow;
                light.shadow.camera.left = node.shadowleft;
                light.shadow.camera.right = node.shadowright;
                light.shadow.camera.top = node.shadowtop;
                light.shadow.camera.bottom = node.shadowbottom;
                light.shadow.camera.far = node.shadowfar;
                light.shadow.mapSize = node.shadowmapsize;
                return light;
            }
        }

        console.log(node.type);

        return new THREE.Object3D();
    }

    /**
     * @param {any} primitive
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

                mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(
                        width,
                        height,
                        representation.parts_x,
                        representation.parts_y
                    ),
                    material
                );

                mesh.position.set(x, y, 0);

                break;
            }
            case "triangle": {
                // TODO
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
                        !representation.capsclose,
                        representation.thetaStart,
                        representation.thetaLength
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
                        representation.phiStart,
                        representation.phiLength,
                        representation.thetaStart,
                        representation.thetaLength
                    ),
                    material
                );

                break;
            }
        }

        if (mesh) {
            mesh.castShadow = castShadow;
            mesh.receiveShadow = receiveShadow;
        }

        return mesh ?? new THREE.Object3D();
    }

    update() {}
}

export { MyContents };
