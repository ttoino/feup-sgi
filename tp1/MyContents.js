import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { NURBSSurface } from "three/addons/curves/NURBSSurface.js";
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

        this.setupMaterials();
    }

    setupMaterials() {
        this.floorTexture = new THREE.TextureLoader().load(
            "textures/Asphalt_002_COLOR.jpg"
        );
        this.floorTexture.wrapS = THREE.RepeatWrapping;
        this.floorTexture.wrapT = THREE.RepeatWrapping;
        this.floorTexture.repeat.set(4, 4);
        this.floorNormalMap = new THREE.TextureLoader().load(
            "textures/Asphalt_002_NORM.jpg"
        );
        this.floorNormalMap.wrapS = THREE.RepeatWrapping;
        this.floorNormalMap.wrapT = THREE.RepeatWrapping;
        this.floorNormalMap.repeat.set(4, 4);
        this.floorMaterial = new THREE.MeshPhongMaterial({
            // color: "darkgray",
            map: this.floorTexture,
            normalMap: this.floorNormalMap,
            specular: "#ffffff",
            shininess: 5,
        });

        this.wallTexture = new THREE.TextureLoader().load(
            "textures/Plaster_Rough_001_COLOR.jpg"
        );
        this.wallTexture.wrapS = THREE.RepeatWrapping;
        this.wallTexture.wrapT = THREE.RepeatWrapping;
        this.wallTexture.repeat.set(4, 4);
        this.wallNormalMap = new THREE.TextureLoader().load(
            "textures/Plaster_Rough_001_NORM.jpg"
        );
        this.wallNormalMap.wrapS = THREE.RepeatWrapping;
        this.wallNormalMap.wrapT = THREE.RepeatWrapping;
        this.wallNormalMap.repeat.set(4, 4);
        this.wallMaterial = new THREE.MeshPhongMaterial({
            // color: "white",
            map: this.wallTexture,
            normalMap: this.wallNormalMap,
            specular: "#ffffff",
            shininess: 5,
        });

        this.tableTexture = new THREE.TextureLoader().load(
            "textures/Wood_027_basecolor.jpg"
        );
        this.tableTexture.wrapS = THREE.RepeatWrapping;
        this.tableTexture.wrapT = THREE.RepeatWrapping;
        this.tableNormalMap = new THREE.TextureLoader().load(
            "textures/Wood_027_normal.jpg"
        );
        this.tableNormalMap.wrapS = THREE.RepeatWrapping;
        this.tableNormalMap.wrapT = THREE.RepeatWrapping;
        this.tableMaterial = new THREE.MeshPhongMaterial({
            // color: "sienna",
            map: this.tableTexture,
            normalMap: this.tableNormalMap,
            specular: "#ffffff",
            shininess: 5,
        });

        this.tableLegTexture = new THREE.TextureLoader().load(
            "textures/Metal_006_basecolor.jpg"
        );
        this.tableLegTexture.wrapS = THREE.RepeatWrapping;
        this.tableLegTexture.wrapT = THREE.RepeatWrapping;
        this.tableLegNormalMap = new THREE.TextureLoader().load(
            "textures/Metal_006_normal.jpg"
        );
        this.tableLegNormalMap.wrapS = THREE.RepeatWrapping;
        this.tableLegNormalMap.wrapT = THREE.RepeatWrapping;
        this.tableLegMaterial = new THREE.MeshPhongMaterial({
            // color: "gray",
            map: this.tableLegTexture,
            normalMap: this.tableLegNormalMap,
            specular: "#ffffff",
            shininess: 30,
        });

        this.plateMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#ffffff",
            shininess: 100,
        });

        this.cakeTexture = new THREE.TextureLoader().load(
            "textures/Chocolate_001_baseColor.jpg"
        );
        this.cakeTexture.wrapS = THREE.RepeatWrapping;
        this.cakeTexture.wrapT = THREE.RepeatWrapping;
        this.cakeNormalMap = new THREE.TextureLoader().load(
            "textures/Chocolate_001_normal.jpg"
        );
        this.cakeNormalMap.wrapS = THREE.RepeatWrapping;
        this.cakeNormalMap.wrapT = THREE.RepeatWrapping;
        this.cakeMaterial = new THREE.MeshPhongMaterial({
            // color: "lavenderblush",
            map: this.cakeTexture,
            normalMap: this.cakeNormalMap,
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

        this.lineMaterial = new THREE.LineBasicMaterial({
            color: "#000000",
        });

        this.frameTexture = new THREE.TextureLoader().load(
            "textures/Wood_027_basecolor.jpg"
        );
        this.frameTexture.wrapS = THREE.RepeatWrapping;
        this.frameTexture.wrapT = THREE.RepeatWrapping;
        this.frameTexture.repeat.set(4, 4);
        this.frameNormalMap = new THREE.TextureLoader().load(
            "textures/Wood_027_normal.jpg"
        );
        this.frameNormalMap.wrapS = THREE.RepeatWrapping;
        this.frameNormalMap.wrapT = THREE.RepeatWrapping;
        this.frameNormalMap.repeat.set(4, 4);
        this.frameMaterial = new THREE.MeshPhongMaterial({
            // color: "darkgray",
            map: this.frameTexture,
            normalMap: this.frameNormalMap,
            specular: "#ffffff",
            shininess: 5,
        });

        this.toinoTexture = new THREE.TextureLoader().load("images/toino.jpg");
        this.toinoMaterial = new THREE.MeshPhongMaterial({
            map: this.toinoTexture,
            specular: "#ffffff",
            shininess: 30,
        });

        this.perasTexture = new THREE.TextureLoader().load("images/peras.png");
        this.perasMaterial = new THREE.MeshPhongMaterial({
            map: this.perasTexture,
            specular: "#ffffff",
            shininess: 30,
        });

        this.windowsTexture = new THREE.TextureLoader().load(
            "images/windows_wpp.jpg"
        );
        this.windowsMaterial = new THREE.MeshPhongMaterial({
            emissiveMap: this.windowsTexture,
            emissive: "#ffffff",
        });

        this.newspaperTexture = new THREE.TextureLoader().load(
            "images/newspaper.jpg"
        );
        this.newspaperMaterial = new THREE.MeshPhongMaterial({
            map: this.newspaperTexture,
            specular: "#ffffff",
            shininess: 5,
            side: THREE.DoubleSide,
        });

        this.potMaterial = new THREE.MeshPhongMaterial({
            color: "#77eeff",
            specular: "#ffffff",
            shininess: 100,
            side: THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
        });

        this.shadowMapSize = 512;
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
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 0, 1);
        pointLight.position.set(0, 2.75, 0);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = this.shadowMapSize;
        pointLight.shadow.mapSize.height = this.shadowMapSize;
        this.app.scene.add(pointLight);

        // add a point light helper for the previous point light
        const sphereSize = 0.25;
        const pointLightHelper = new THREE.PointLightHelper(
            pointLight,
            sphereSize
        );
        this.app.scene.add(pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight("#ffffff", 0.2);
        this.app.scene.add(ambientLight);

        // room
        {
            let floor = new THREE.PlaneGeometry(5, 5);
            this.floorMesh = new THREE.Mesh(floor, this.floorMaterial);
            this.floorMesh.rotation.x = -Math.PI / 2;
            this.floorMesh.position.y = -0;
            this.floorMesh.receiveShadow = true;
            this.app.scene.add(this.floorMesh);

            let wall = new THREE.PlaneGeometry(5, 3);

            this.wallMesh1 = new THREE.Mesh(wall, this.wallMaterial);
            this.wallMesh1.position.y = 1.5;
            this.wallMesh1.position.z = -2.5;
            this.wallMesh1.receiveShadow = true;
            this.wallMesh1.castShadow = true;
            this.app.scene.add(this.wallMesh1);

            this.wallMesh2 = new THREE.Mesh(wall, this.wallMaterial);
            this.wallMesh2.rotation.y = Math.PI;
            this.wallMesh2.position.y = 1.5;
            this.wallMesh2.position.z = 2.5;
            this.wallMesh2.receiveShadow = true;
            this.wallMesh2.castShadow = true;
            this.app.scene.add(this.wallMesh2);

            this.wallMesh3 = new THREE.Mesh(wall, this.wallMaterial);
            this.wallMesh3.rotation.y = Math.PI / 2;
            this.wallMesh3.position.x = -2.5;
            this.wallMesh3.position.y = 1.5;
            this.wallMesh3.receiveShadow = true;
            this.wallMesh3.castShadow = true;
            this.app.scene.add(this.wallMesh3);

            let wallH = new THREE.PlaneGeometry(5, (3 - 0.85) / 2);
            let wallV = new THREE.PlaneGeometry((5 - 0.85) / 2, 0.85);

            const wallMesh41 = new THREE.Mesh(wallH, this.wallMaterial);
            wallMesh41.rotation.y = -Math.PI / 2;
            wallMesh41.position.x = 2.5;
            wallMesh41.position.y = wallH.parameters.height / 2;
            const wallMesh42 = new THREE.Mesh(wallH, this.wallMaterial);
            wallMesh42.rotation.y = -Math.PI / 2;
            wallMesh42.position.x = 2.5;
            wallMesh42.position.y = 3 - wallH.parameters.height / 2;
            const wallMesh43 = new THREE.Mesh(wallV, this.wallMaterial);
            wallMesh43.rotation.y = -Math.PI / 2;
            wallMesh43.position.x = 2.5;
            wallMesh43.position.y = 1.5;
            wallMesh43.position.z = 2.5 - wallV.parameters.width / 2;
            const wallMesh44 = new THREE.Mesh(wallV, this.wallMaterial);
            wallMesh44.rotation.y = -Math.PI / 2;
            wallMesh44.position.x = 2.5;
            wallMesh44.position.y = 1.5;
            wallMesh44.position.z = -2.5 + wallV.parameters.width / 2;

            const wall4 = BufferGeometryUtils.mergeBufferGeometries(
                [wallMesh41, wallMesh42, wallMesh43, wallMesh44].map((m) => {
                    m.updateMatrixWorld();

                    return m.geometry.clone().applyMatrix4(m.matrixWorld);
                }),
                true
            );

            this.wallMesh4 = new THREE.Mesh(wall4, this.wallMaterial);
            this.wallMesh4.receiveShadow = true;
            this.wallMesh4.castShadow = true;
            this.app.scene.add(this.wallMesh4);

            let ceiling = new THREE.PlaneGeometry(5, 5);
            this.ceilingMesh = new THREE.Mesh(ceiling, this.wallMaterial);
            this.ceilingMesh.rotation.x = Math.PI / 2;
            this.ceilingMesh.position.y = 3;
            this.ceilingMesh.receiveShadow = true;
            this.ceilingMesh.castShadow = true;
            this.app.scene.add(this.ceilingMesh);
        }

        // table
        {
            let table = new THREE.BoxGeometry(1, 0.1, 2);
            this.tableMesh = new THREE.Mesh(table, this.tableMaterial);
            this.tableMesh.position.y = 0.8;
            this.tableMesh.receiveShadow = true;
            this.tableMesh.castShadow = true;
            this.app.scene.add(this.tableMesh);

            let tableLeg = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 32);

            this.tableLegMesh1 = new THREE.Mesh(
                tableLeg,
                this.tableLegMaterial
            );
            this.tableLegMesh1.position.y = 0.4;
            this.tableLegMesh1.position.x = 0.45;
            this.tableLegMesh1.position.z = 0.95;
            this.tableLegMesh1.receiveShadow = true;
            this.tableLegMesh1.castShadow = true;
            this.app.scene.add(this.tableLegMesh1);

            this.tableLegMesh2 = new THREE.Mesh(
                tableLeg,
                this.tableLegMaterial
            );
            this.tableLegMesh2.position.y = 0.4;
            this.tableLegMesh2.position.x = -0.45;
            this.tableLegMesh2.position.z = 0.95;
            this.tableLegMesh2.receiveShadow = true;
            this.tableLegMesh2.castShadow = true;
            this.app.scene.add(this.tableLegMesh2);

            this.tableLegMesh3 = new THREE.Mesh(
                tableLeg,
                this.tableLegMaterial
            );
            this.tableLegMesh3.position.y = 0.4;
            this.tableLegMesh3.position.x = 0.45;
            this.tableLegMesh3.position.z = -0.95;
            this.tableLegMesh3.receiveShadow = true;
            this.tableLegMesh3.castShadow = true;
            this.app.scene.add(this.tableLegMesh3);

            this.tableLegMesh4 = new THREE.Mesh(
                tableLeg,
                this.tableLegMaterial
            );
            this.tableLegMesh4.position.y = 0.4;
            this.tableLegMesh4.position.x = -0.45;
            this.tableLegMesh4.position.z = -0.95;
            this.tableLegMesh4.receiveShadow = true;
            this.tableLegMesh4.castShadow = true;
            this.app.scene.add(this.tableLegMesh4);
        }

        let plate = new THREE.CylinderGeometry(0.16, 0.14, 0.02, 32);
        this.plateMesh = new THREE.Mesh(plate, this.plateMaterial);
        this.plateMesh.position.y = 0.85;
        this.plateMesh.position.x = 0;
        this.plateMesh.position.z = 0;
        this.plateMesh.receiveShadow = true;
        this.plateMesh.castShadow = true;
        this.app.scene.add(this.plateMesh);

        // cake
        {
            let cake = new THREE.CylinderGeometry(
                0.1,
                0.1,
                0.1,
                64,
                1,
                false,
                0,
                (Math.PI * 11) / 6
            );
            this.cakeMesh = new THREE.Mesh(cake, this.cakeMaterial);
            this.cakeMesh.position.y = 0.9;
            this.cakeMesh.position.x = 0;
            this.cakeMesh.position.z = 0;
            this.cakeMesh.receiveShadow = true;
            this.cakeMesh.castShadow = true;
            this.app.scene.add(this.cakeMesh);

            let cakeSlice = new THREE.PlaneGeometry(0.1, 0.1);

            this.cakeSliceMesh1 = new THREE.Mesh(cakeSlice, this.cakeMaterial);
            this.cakeSliceMesh1.rotation.y = -Math.PI / 2;
            this.cakeSliceMesh1.position.y = 0.9;
            this.cakeSliceMesh1.position.x = 0;
            this.cakeSliceMesh1.position.z = 0.05;
            this.cakeSliceMesh1.receiveShadow = true;
            this.cakeSliceMesh1.castShadow = true;
            this.app.scene.add(this.cakeSliceMesh1);

            this.cakeSliceMesh2 = new THREE.Mesh(cakeSlice, this.cakeMaterial);
            this.cakeSliceMesh2.rotation.y = (2 * Math.PI) / 6;
            this.cakeSliceMesh2.position.y = 0.9;
            this.cakeSliceMesh2.position.x = -Math.sin(Math.PI / 6) * 0.05;
            this.cakeSliceMesh2.position.z = Math.cos(Math.PI / 6) * 0.05;
            this.cakeSliceMesh2.receiveShadow = true;
            this.cakeSliceMesh2.castShadow = true;
            this.app.scene.add(this.cakeSliceMesh2);

            let candle = new THREE.CylinderGeometry(0.005, 0.005, 0.025, 8);
            this.candleMesh = new THREE.Mesh(candle, this.candleMaterial);
            this.candleMesh.position.y = 0.9625;
            this.candleMesh.position.x = 0;
            this.candleMesh.position.z = 0;
            this.candleMesh.receiveShadow = true;
            this.candleMesh.castShadow = true;
            this.app.scene.add(this.candleMesh);

            let flame = new THREE.ConeGeometry(0.005, 0.01, 8);
            this.flameMesh = new THREE.Mesh(flame, this.flameMaterial);
            this.flameMesh.position.y = 0.98;
            this.flameMesh.position.x = 0;
            this.flameMesh.position.z = 0;
            this.app.scene.add(this.flameMesh);

            let flameLight = new THREE.PointLight("orange", 0.05, 0);
            flameLight.position.set(0, 0.98, 0);
            flameLight.castShadow = true;
            flameLight.shadow.mapSize.width = this.shadowMapSize;
            flameLight.shadow.mapSize.height = this.shadowMapSize;
            this.app.scene.add(flameLight);
        }

        // CAROCHA
        {
            const carocha1 = new THREE.CubicBezierCurve3(
                new THREE.Vector3(-0.8, 2 - 0.8, 2.49),
                new THREE.Vector3(-0.8, 2 - 0.8 + 0.552284749831 * 0.8, 2.49),
                new THREE.Vector3(0 - 0.8 * 0.552284749831, 2, 2.49),
                new THREE.Vector3(0, 2, 2.49)
            );
            this.app.scene.add(
                new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(
                        carocha1.getPoints(50)
                    ),
                    this.lineMaterial
                )
            );
            const carocha2 = new THREE.CubicBezierCurve3(
                new THREE.Vector3(0, 2, 2.49),
                new THREE.Vector3(0 + 0.4 * 0.552284749831, 2, 2.49),
                new THREE.Vector3(0.4, 2 - 0.4 + 0.552284749831 * 0.4, 2.49),
                new THREE.Vector3(0.4, 2 - 0.4, 2.49)
            );
            this.app.scene.add(
                new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(
                        carocha2.getPoints(50)
                    ),
                    this.lineMaterial
                )
            );
            const carocha3 = new THREE.CubicBezierCurve3(
                new THREE.Vector3(0.4, 2 - 0.4, 2.49),
                new THREE.Vector3(0.4 + 0.552284749831 * 0.4, 2 - 0.4, 2.49),
                new THREE.Vector3(0.8, 2 - 0.8 + 0.552284749831 * 0.4, 2.49),
                new THREE.Vector3(0.8, 2 - 0.8, 2.49)
            );
            this.app.scene.add(
                new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(
                        carocha3.getPoints(50)
                    ),
                    this.lineMaterial
                )
            );
            const carocha4 = new THREE.CubicBezierCurve3(
                new THREE.Vector3(0.8, 2 - 0.8, 2.49),
                new THREE.Vector3(0.8, 2 - 0.8 + 0.552284749831 * 0.3, 2.49),
                new THREE.Vector3(0.5 + 0.552284749831 * 0.3, 2 - 0.5, 2.49),
                new THREE.Vector3(0.5, 2 - 0.5, 2.49)
            );
            this.app.scene.add(
                new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(
                        carocha4.getPoints(50)
                    ),
                    this.lineMaterial
                )
            );
            const carocha5 = new THREE.CubicBezierCurve3(
                new THREE.Vector3(0.5, 2 - 0.5, 2.49),
                new THREE.Vector3(0.5 - 0.552284749831 * 0.3, 2 - 0.5, 2.49),
                new THREE.Vector3(0.2, 2 - 0.8 + 0.552284749831 * 0.3, 2.49),
                new THREE.Vector3(0.2, 2 - 0.8, 2.49)
            );
            this.app.scene.add(
                new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(
                        carocha5.getPoints(50)
                    ),
                    this.lineMaterial
                )
            );
            const carocha6 = new THREE.CubicBezierCurve3(
                new THREE.Vector3(-0.8, 2 - 0.8, 2.49),
                new THREE.Vector3(-0.8, 2 - 0.8 + 0.552284749831 * 0.3, 2.49),
                new THREE.Vector3(-0.5 - 0.552284749831 * 0.3, 2 - 0.5, 2.49),
                new THREE.Vector3(-0.5, 2 - 0.5, 2.49)
            );
            this.app.scene.add(
                new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(
                        carocha6.getPoints(50)
                    ),
                    this.lineMaterial
                )
            );
            const carocha7 = new THREE.CubicBezierCurve3(
                new THREE.Vector3(-0.5, 2 - 0.5, 2.49),
                new THREE.Vector3(-0.5 + 0.552284749831 * 0.3, 2 - 0.5, 2.49),
                new THREE.Vector3(-0.2, 2 - 0.8 + 0.552284749831 * 0.3, 2.49),
                new THREE.Vector3(-0.2, 2 - 0.8, 2.49)
            );
            this.app.scene.add(
                new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints(
                        carocha7.getPoints(50)
                    ),
                    this.lineMaterial
                )
            );
        }

        // PICTURES
        {
            const frameGeometry = new THREE.TorusGeometry(0.3, 0.03, 4, 4);

            const frame1 = new THREE.Mesh(frameGeometry, this.frameMaterial);

            frame1.rotation.z = Math.PI / 4;
            frame1.position.y = 1.5;
            frame1.position.x = -0.5;
            frame1.position.z = -2.5;
            frame1.receiveShadow = true;

            this.app.scene.add(frame1);

            const frame2 = new THREE.Mesh(frameGeometry, this.frameMaterial);

            frame2.rotation.z = Math.PI / 4;
            frame2.position.y = 1.5;
            frame2.position.x = 0.5;
            frame2.position.z = -2.5;
            frame2.receiveShadow = true;

            this.app.scene.add(frame2);

            let picture = new THREE.PlaneGeometry(0.4, 0.4);

            let toinoPicture = new THREE.Mesh(picture, this.toinoMaterial);
            toinoPicture.position.y = 1.5;
            toinoPicture.position.x = -0.5;
            toinoPicture.position.z = -2.49;
            toinoPicture.receiveShadow = true;
            this.app.scene.add(toinoPicture);

            let perasPicture = new THREE.Mesh(picture, this.perasMaterial);
            perasPicture.position.y = 1.5;
            perasPicture.position.x = 0.5;
            perasPicture.position.z = -2.49;
            perasPicture.receiveShadow = true;
            this.app.scene.add(perasPicture);
        }

        // FLASHLIGHT
        {
            const flashLightBodyHeight = 0.15;
            const flashLightHeadHeight = 0.05;

            this.flashLightBodyGeometry = new THREE.CylinderGeometry(
                0.025,
                0.025,
                flashLightBodyHeight,
                32,
                1,
                false,
                0,
                2 * Math.PI
            );
            this.flashLightBody = new THREE.Mesh(
                this.flashLightBodyGeometry,
                this.plateMaterial
            );

            this.flashLightHeadGeometry = new THREE.CylinderGeometry(
                0.025,
                0.04,
                flashLightHeadHeight,
                32,
                1,
                true,
                0,
                2 * Math.PI
            );
            this.flashLightHead = new THREE.Mesh(
                this.flashLightHeadGeometry,
                this.plateMaterial
            );
            this.flashLightHead.translateY(
                -(flashLightBodyHeight + flashLightHeadHeight) / 2
            );

            this.flashLightGlowGeometry = new THREE.CylinderGeometry(
                0.03,
                0.03,
                0.001,
                32,
                1,
                false,
                0,
                2 * Math.PI
            );
            this.flashLightGlowMaterial = this.flameMaterial.clone();
            this.flashLightGlowMaterial.emissive = new THREE.Color("#efefef");
            this.flashLightGlowMaterial.shininess = 50;
            this.flashLightGlow = new THREE.Mesh(
                this.flashLightGlowGeometry,
                this.flashLightGlowMaterial
            );
            this.flashLightGlow.position.y = -0.1;

            const meshes = [this.flashLightBody, this.flashLightHead];

            /** @type {THREE.BufferGeometry} */
            const flashLightGeometry = BufferGeometryUtils.mergeGeometries(
                meshes.map((m) => {
                    m.updateMatrixWorld();

                    return m.geometry.clone().applyMatrix4(m.matrixWorld);
                }),
                true
            );

            const flashLightMaterial = this.plateMaterial.clone();
            flashLightMaterial.side = THREE.DoubleSide;

            const flashLight = new THREE.Mesh(
                flashLightGeometry,
                flashLightMaterial
            );

            const flashLightLightSource = new THREE.SpotLight(
                "white",
                2.5,
                5,
                Math.PI / 7,
                0.2,
                1
            );

            flashLightLightSource.castShadow = true;
            flashLightLightSource.shadow.mapSize.width = this.shadowMapSize;
            flashLightLightSource.shadow.mapSize.height = this.shadowMapSize;
            flashLightLightSource.position.y = -flashLightBodyHeight / 2;
            flashLightLightSource.target.position.x = 0;
            flashLightLightSource.target.position.y = 1;
            flashLightLightSource.target.position.z = 0;

            // For SOME reason this needs to be instantiated
            const h = new THREE.SpotLightHelper(flashLightLightSource, 0.5);

            flashLight.add(flashLightLightSource);
            flashLight.add(this.flashLightGlow);

            flashLight.position.y = 0.88;
            flashLight.position.z = 0.6;
            flashLight.position.x = 0.2;
            flashLight.rotation.x = Math.PI / 2 + 0.079;
            flashLight.rotation.z = -0.3;
            flashLight.castShadow = true;
            flashLight.receiveShadow = true;

            this.app.scene.add(flashLight);
        }

        // window
        {
            const displacement = 0.21;

            const windowQuarterGeometry = new THREE.TorusGeometry(
                0.3,
                0.03,
                4,
                4
            );
            const window1 = new THREE.Mesh(
                windowQuarterGeometry,
                this.frameMaterial
            );
            window1.position.x = displacement;
            window1.position.y = displacement;
            const window2 = new THREE.Mesh(
                windowQuarterGeometry,
                this.frameMaterial
            );
            window2.position.x = displacement;
            window2.position.y = -displacement;
            const window3 = new THREE.Mesh(
                windowQuarterGeometry,
                this.frameMaterial
            );
            window3.position.x = -displacement;
            window3.position.y = displacement;
            const window4 = new THREE.Mesh(
                windowQuarterGeometry,
                this.frameMaterial
            );
            window4.position.x = -displacement;
            window4.position.y = -displacement;

            const windowMeshes = [window1, window2, window3, window4];
            for (const mesh of windowMeshes) {
                mesh.rotation.z = Math.PI / 4;
            }

            /** @type {THREE.BufferGeometry} */
            const windowGeometry = BufferGeometryUtils.mergeGeometries(
                windowMeshes.map((m) => {
                    m.updateMatrixWorld();

                    return m.geometry.clone().applyMatrix4(m.matrixWorld);
                }),
                true
            );

            const windowMaterial = this.frameMaterial.clone();
            windowMaterial.side = THREE.DoubleSide;

            this.windowFrame = new THREE.Mesh(windowGeometry, windowMaterial);

            this.windowFrame.rotation.y = Math.PI / 2;
            this.windowFrame.position.y = 1.5;
            // this.windowFrame.position.z = 1.5;
            this.windowFrame.position.x = 2.5;
            this.windowFrame.castShadow = true;
            this.windowFrame.receiveShadow = true;

            this.sceneryGeometry = new THREE.PlaneGeometry(0.85, 0.85);
            this.scenery = new THREE.Mesh(
                this.sceneryGeometry,
                this.windowsMaterial
            );
            this.scenery.rotation.y = Math.PI;

            this.windowFrame.add(this.scenery);

            this.app.scene.add(this.windowFrame);

            this.sun = new THREE.DirectionalLight("white", 1);
            this.sun.castShadow = true;
            this.sun.shadow.mapSize.width = this.shadowMapSize;
            this.sun.shadow.mapSize.height = this.shadowMapSize;
            this.sun.position.y = 5;
            this.sun.position.z = 5;
            this.sun.position.x = 5;
            this.app.scene.add(this.sun);
        }

        // spring
        {
            const HEIGHT_STEP = 0.0125;

            const generateRevolution = (
                numPoints = 50,
                radius = 0.05,
                heightStep = HEIGHT_STEP,
                startingHeight = 0
            ) => {
                const points = [];

                const yStep = heightStep / numPoints;

                for (let i = 0; i < numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;

                    points.push(
                        new THREE.Vector3(
                            Math.cos(angle) * radius,
                            yStep * i + startingHeight,
                            Math.sin(angle) * radius
                        )
                    );
                }

                return points;
            };

            const points = [];
            const num_revolutions = 7;

            for (let i = 0; i < num_revolutions; i++) {
                points.push(
                    ...generateRevolution(
                        50,
                        0.025,
                        HEIGHT_STEP,
                        i * HEIGHT_STEP
                    )
                );
            }

            const curve = new THREE.CatmullRomCurve3(points);

            const curvePoints = curve.getPoints(50 * num_revolutions);
            const geometry = new THREE.BufferGeometry().setFromPoints(
                curvePoints
            );

            const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

            // Create the final object to add to the scene
            const curveObject = new THREE.Line(geometry, material);

            curveObject.castShadow = true;
            curveObject.position.y = 0.85;
            curveObject.position.z = -0.4;
            curveObject.position.x = -0.4;

            this.app.scene.add(curveObject);
        }

        // newspaper
        {
            const controlPoints = [
                // U = 0
                [
                    // V = 0..1;
                    [-0.251, -0.13, 0.15, 1],
                    [0.251, -0.13, 0.15, 1],
                ],
                // U = 1
                [
                    // V = 0..1;
                    [-0.25, -0.15, 0.1, 1],
                    [0.25, -0.15, 0.1, 1],
                ],
                // U = 2
                [
                    // V = 0..1;
                    [-0.25, -0.25, 0.15, 1],
                    [0.25, -0.25, 0.15, 1],
                ],
                // U = 3
                [
                    // V = 0..1
                    [-0.25, -0.15, 0.2, 1],
                    [0.25, -0.15, 0.2, 1],
                ],
                // U = 4
                [
                    // V = 0..1
                    [-0.251, -0.11, 0.17, 1],
                    [0.251, -0.11, 0.17, 1],
                ],
            ];

            const knots1 = [];
            const knots2 = [];

            const degree1 = controlPoints.length - 1,
                degree2 = 1;
            const samples1 = 30,
                samples2 = 10;

            // build knots1 = [ 0, 0, 0, 1, 1, 1 ];
            for (var i = 0; i <= degree1; i++) {
                knots1.push(0);
            }
            for (var i = 0; i <= degree1; i++) {
                knots1.push(1);
            }

            // build knots2 = [ 0, 0, 0, 0, 1, 1, 1, 1 ];
            for (var i = 0; i <= degree2; i++) {
                knots2.push(0);
            }
            for (var i = 0; i <= degree2; i++) {
                knots2.push(1);
            }

            let stackedPoints = [];

            for (var i = 0; i < controlPoints.length; i++) {
                let row = controlPoints[i];
                let newRow = [];
                for (var j = 0; j < row.length; j++) {
                    let item = row[j];
                    newRow.push(
                        new THREE.Vector4(item[0], item[1], item[2], item[3])
                    );
                }
                stackedPoints[i] = newRow;
            }

            const nurbsSurface = new NURBSSurface(
                degree1,
                degree2,
                knots1,
                knots2,
                stackedPoints
            );
            const newspaperGeometry = new ParametricGeometry(
                getSurfacePoint,
                samples1,
                samples2
            );

            const newspaper = new THREE.Mesh(
                newspaperGeometry,
                this.newspaperMaterial
            );

            newspaper.position.y = 1.035;
            newspaper.position.x = 0.15;
            newspaper.position.z = -0.75;
            newspaper.rotation.y = Math.PI / 5;
            newspaper.castShadow = true;
            newspaper.receiveShadow = true;

            this.app.scene.add(newspaper);

            function getSurfacePoint(u, v, target) {
                return nurbsSurface.getPoint(u, v, target);
            }
        }

        // flower and pot
        {
            const r = 0.05;
            const R = 0.15;
            const h = 0.05;
            const H = 0.15;

            const controlPoints = [
                // U = 0
                [
                    // V = 0..1;
                    [r, H, 0, 1],
                    [r, H, -r, .707],
                    [0, H, -r, 1],
                ],
                // U = 1
                [
                    // V = 0..1;
                    [R, h, 0, 1],
                    [R, h, -R, .707],
                    [0, h, -R, 1],
                ],
                // U = 2
                [
                    // V = 0..1;
                    [r, -H, 0, 1],
                    [r, -H, -r, .707],
                    [0, -H, -r, 1],
                ],
            ];

            const knots1 = [];
            const knots2 = [];

            const degree1 = controlPoints.length - 1,
                degree2 = controlPoints[0].length - 1;
            const samples1 = 30,
                samples2 = 10;

            // build knots1 = [ 0, 0, 0, 1, 1, 1 ];
            for (var i = 0; i <= degree1; i++) {
                knots1.push(0);
            }
            for (var i = 0; i <= degree1; i++) {
                knots1.push(1);
            }

            // build knots2 = [ 0, 0, 0, 0, 1, 1, 1, 1 ];
            for (var i = 0; i <= degree2; i++) {
                knots2.push(0);
            }
            for (var i = 0; i <= degree2; i++) {
                knots2.push(1);
            }

            let stackedPoints = [];

            for (var i = 0; i < controlPoints.length; i++) {
                let row = controlPoints[i];
                let newRow = [];
                for (var j = 0; j < row.length; j++) {
                    let item = row[j];
                    newRow.push(
                        new THREE.Vector4(item[0], item[1], item[2], item[3])
                    );
                }
                stackedPoints[i] = newRow;
            }

            const nurbsSurface = new NURBSSurface(
                degree1,
                degree2,
                knots1,
                knots2,
                stackedPoints
            );

            const potGeometry = new ParametricGeometry(
                getSurfacePoint,
                samples1,
                samples2
            );

            const pot = new THREE.Mesh(potGeometry, this.potMaterial);
            pot.position.y = 1;
            pot.position.x = -0.2;
            pot.position.z = 0.4;
            pot.castShadow = true;
            pot.receiveShadow = true;

            const pot2 = pot.clone();
            pot2.rotation.y = Math.PI / 2;

            const pot3 = pot.clone();
            pot3.rotation.y = Math.PI;

            const pot4 = pot.clone();
            pot4.rotation.y = -Math.PI / 2;

            this.app.scene.add(pot);
            this.app.scene.add(pot2);
            this.app.scene.add(pot3);
            this.app.scene.add(pot4);

            function getSurfacePoint(u, v, target) {
                return nurbsSurface.getPoint(u, v, target);
            }
        }
    }

    update() {}
}

export { MyContents };
