import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";

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

        this.setupMaterials();
    }

    setupMaterials() {
        this.floorMaterial = new THREE.MeshPhongMaterial({
            color: "darkgray",
            specular: "#ffffff",
            shininess: 5,
        });

        this.wallMaterial = new THREE.MeshPhongMaterial({
            color: "whitesmoke",
            specular: "#ffffff",
            shininess: 5,
        });

        this.ceilingMaterial = new THREE.MeshPhongMaterial({
            color: "whitesmoke",
            specular: "#ffffff",
            shininess: 5,
        });

        this.tableMaterial = new THREE.MeshPhongMaterial({
            color: "sienna",
            specular: "#ffffff",
            shininess: 5,
        });

        this.plateMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#ffffff",
            shininess: 100,
        });

        this.cakeMaterial = new THREE.MeshPhongMaterial({
            color: "lavenderblush",
            specular: "#ffffff",
            shininess: 1,
        });

        this.candleMaterial = new THREE.MeshPhongMaterial({
            color: "ivory",
            specular: "#ffffff",
            shininess: 100,
        });

        this.flameMaterial = new THREE.MeshPhongMaterial({
            color: "orange",
            specular: "#ffffff",
            emissive: "orange",
            shininess: 0,
        });
    }

    /**
     * initializes the contents
     */
    init() {
        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this);
            this.axis.visible = false;
            this.app.scene.add(this.axis);
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight(0xffffff, 1, 0, 1);
        pointLight.position.set(0, 2.75, 0);
        this.app.scene.add(pointLight);

        // add a point light helper for the previous point light
        const sphereSize = 0.25;
        const pointLightHelper = new THREE.PointLightHelper(
            pointLight,
            sphereSize
        );
        this.app.scene.add(pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight("#ffffff", 0.1);
        this.app.scene.add(ambientLight);

        let floor = new THREE.PlaneGeometry(5, 5);
        this.floorMesh = new THREE.Mesh(floor, this.floorMaterial);
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y = -0;
        this.app.scene.add(this.floorMesh);

        let wall = new THREE.PlaneGeometry(5, 3);

        this.wallMesh1 = new THREE.Mesh(wall, this.wallMaterial);
        this.wallMesh1.position.y = 1.5;
        this.wallMesh1.position.z = -2.5;
        this.app.scene.add(this.wallMesh1);

        this.wallMesh2 = new THREE.Mesh(wall, this.wallMaterial);
        this.wallMesh2.rotation.y = Math.PI;
        this.wallMesh2.position.y = 1.5;
        this.wallMesh2.position.z = 2.5;
        this.app.scene.add(this.wallMesh2);

        this.wallMesh3 = new THREE.Mesh(wall, this.wallMaterial);
        this.wallMesh3.rotation.y = Math.PI / 2;
        this.wallMesh3.position.x = -2.5;
        this.wallMesh3.position.y = 1.5;
        this.app.scene.add(this.wallMesh3);

        this.wallMesh4 = new THREE.Mesh(wall, this.wallMaterial);
        this.wallMesh4.rotation.y = -Math.PI / 2;
        this.wallMesh4.position.x = 2.5;
        this.wallMesh4.position.y = 1.5;
        this.app.scene.add(this.wallMesh4);

        let ceiling = new THREE.PlaneGeometry(5, 5);
        this.ceilingMesh = new THREE.Mesh(ceiling, this.ceilingMaterial);
        this.ceilingMesh.rotation.x = Math.PI / 2;
        this.ceilingMesh.position.y = 3;
        this.app.scene.add(this.ceilingMesh);

        let table = new THREE.BoxGeometry(1, 0.1, 2);
        this.tableMesh = new THREE.Mesh(table, this.tableMaterial);
        this.tableMesh.position.y = .8;
        this.app.scene.add(this.tableMesh);

        let tableLeg = new THREE.CylinderGeometry(0.05, 0.05, .8, 32);

        this.tableLegMesh1 = new THREE.Mesh(tableLeg, this.tableMaterial);
        this.tableLegMesh1.position.y = 0.4;
        this.tableLegMesh1.position.x = 0.45;
        this.tableLegMesh1.position.z = 0.95;
        this.app.scene.add(this.tableLegMesh1);

        this.tableLegMesh2 = new THREE.Mesh(tableLeg, this.tableMaterial);
        this.tableLegMesh2.position.y = 0.4;
        this.tableLegMesh2.position.x = -0.45;
        this.tableLegMesh2.position.z = 0.95;
        this.app.scene.add(this.tableLegMesh2);

        this.tableLegMesh3 = new THREE.Mesh(tableLeg, this.tableMaterial);
        this.tableLegMesh3.position.y = 0.4;
        this.tableLegMesh3.position.x = 0.45;
        this.tableLegMesh3.position.z = -0.95;
        this.app.scene.add(this.tableLegMesh3);

        this.tableLegMesh4 = new THREE.Mesh(tableLeg, this.tableMaterial);
        this.tableLegMesh4.position.y = 0.4;
        this.tableLegMesh4.position.x = -0.45;
        this.tableLegMesh4.position.z = -0.95;
        this.app.scene.add(this.tableLegMesh4);

        let plate = new THREE.CylinderGeometry(0.16, 0.14, 0.02, 32);
        this.plateMesh = new THREE.Mesh(plate, this.plateMaterial);
        this.plateMesh.position.y = .85;
        this.plateMesh.position.x = 0;
        this.plateMesh.position.z = 0;
        this.app.scene.add(this.plateMesh);

        let cake = new THREE.CylinderGeometry(
            0.1,
            0.1,
            0.1,
            64,
            1,
            false,
            0,
            Math.PI * 11/6
        );
        this.cakeMesh = new THREE.Mesh(cake, this.cakeMaterial);
        this.cakeMesh.position.y = .9;
        this.cakeMesh.position.x = 0;
        this.cakeMesh.position.z = 0;
        this.app.scene.add(this.cakeMesh);

        let cakeSlice = new THREE.PlaneGeometry(0.1, 0.1);

        this.cakeSliceMesh1 = new THREE.Mesh(cakeSlice, this.cakeMaterial);
        this.cakeSliceMesh1.rotation.y = -Math.PI/2;
        this.cakeSliceMesh1.position.y = .9
        this.cakeSliceMesh1.position.x = 0;
        this.cakeSliceMesh1.position.z = 0.05;
        this.app.scene.add(this.cakeSliceMesh1);

        this.cakeSliceMesh2 = new THREE.Mesh(cakeSlice, this.cakeMaterial);
        this.cakeSliceMesh2.rotation.y = 2*Math.PI/6;
        this.cakeSliceMesh2.position.y = .9;
        this.cakeSliceMesh2.position.x = -Math.sin(Math.PI/6) * 0.05;
        this.cakeSliceMesh2.position.z = Math.cos(Math.PI/6) * 0.05;
        this.app.scene.add(this.cakeSliceMesh2);

        let candle = new THREE.CylinderGeometry(0.005, 0.005, 0.05, 8);
        this.candleMesh = new THREE.Mesh(candle, this.candleMaterial);
        this.candleMesh.position.y = .95;
        this.candleMesh.position.x = 0;
        this.candleMesh.position.z = 0;
        this.app.scene.add(this.candleMesh);

        let flame = new THREE.ConeGeometry(0.005, 0.01, 8);
        this.flameMesh = new THREE.Mesh(flame, this.flameMaterial);
        this.flameMesh.position.y = .98;
        this.flameMesh.position.x = 0;
        this.flameMesh.position.z = 0;
        this.app.scene.add(this.flameMesh);

        let flameLight = new THREE.PointLight("orange", .05, 0);
        flameLight.position.set(0, .98, 0);
        this.app.scene.add(flameLight);
    }

    update() {}
}

export { MyContents };
