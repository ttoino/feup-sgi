import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import { MySceneData } from "./parser/MySceneData.js";
import { MyApp } from "./MyApp.js";

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
        for (var key in data.nodes) {
            let node = data.nodes[key];
            this.output(node, 1);
            for (let i = 0; i < node.children.length; i++) {
                let child = node.children[i];
                if (child.type === "primitive") {
                    console.log(
                        new Array(2 * 4).join(" "),
                        "-",
                        child.type,
                        "with",
                        child.representations.length,
                        child.subtype,
                        "representation(s)"
                    );
                    if (child.subtype === "nurbs") {
                        console.log(
                            new Array(3 * 4).join(" "),
                            "-",
                            child.representations[0].controlpoints.length,
                            "control points"
                        );
                    }
                } else {
                    this.output(child, 2);
                }
            }
        }
    }

    update() {}
}

export { MyContents };
