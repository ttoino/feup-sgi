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

        this.shadowMapSize = 512;
        this.helpersVisible = true;
        /** @type {THREE.Light[]} */
        this.lights = [];
        /** @type {THREE.Object3D[]} */
        this.helpers = [];

        this.loadTextures();
        this.setupMaterials();
    }

    /**
     * Loads the textures used in the scene.
     */
    loadTextures() {
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

        this.newspaperTexture = new THREE.TextureLoader().load(
            "images/newspaper.jpg"
        );

        this.soilTexture = new THREE.TextureLoader().load(
            "textures/soil.avif"
        );
    }

    /**
     * Sets up the materials used in the scene.
     */
    setupMaterials() {

        this.floorMaterial = new THREE.MeshPhongMaterial({
            // color: "darkgray",
            map: this.floorTexture,
            normalMap: this.floorNormalMap,
            specular: "#ffffff",
            shininess: 5,
        });

        this.wallMaterial = new THREE.MeshPhongMaterial({
            // color: "white",
            map: this.wallTexture,
            normalMap: this.wallNormalMap,
            specular: "#ffffff",
            shininess: 5,
        });

        this.tableMaterial = new THREE.MeshPhongMaterial({
            // color: "sienna",
            map: this.tableTexture,
            normalMap: this.tableNormalMap,
            specular: "#ffffff",
            shininess: 5,
        });

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

        this.frameMaterial = new THREE.MeshPhongMaterial({
            // color: "darkgray",
            map: this.frameTexture,
            normalMap: this.frameNormalMap,
            specular: "#ffffff",
            shininess: 5,
        });


        this.windowsMaterial = new THREE.MeshPhongMaterial({
            emissiveMap: this.windowsTexture,
            emissive: "#ffffff",
        });

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

        this.lampMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#ffffff",
            shininess: 100,
            side: THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
        });

        this.flowerBodyMaterial = new THREE.LineBasicMaterial({
            color: "#00ff33",
        });

        this.flowerLeafMaterial = new THREE.MeshPhongMaterial({
            color: "#00ff33",
            shininess: 100,
            side: THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
        });

        this.flowerHeadCoreMaterial = new THREE.MeshPhongMaterial({
            color: "#f0f0ff",
            shininess: 10,
            side: THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
        });

        this.flowerHeadRing1Material = new THREE.MeshPhongMaterial({
            color: "yellow",
            shininess: 10,
            side: THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
        });

        this.flowerHeadRing2Material = new THREE.MeshPhongMaterial({
            color: "#8B4000",
            shininess: 10,
            side: THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
        });

        this.potSoilMaterial = new THREE.MeshPhongMaterial({
            color: "brown",
            shininess: 10,
            side: THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
        });

        this.soilMaterial = new THREE.MeshPhongMaterial({
            map: this.soilTexture,
            specular: "#ffffff",
            shininess: 5,
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

        // add an ambient light
        const ambientLight = new THREE.AmbientLight("#ffffff", 0.1);
        this.app.scene.add(ambientLight);

        // Build the scene itself
        const sceneContents = this.buildScene();
        this.app.scene.add(sceneContents);

        this.updateLights();
    }

    /**
     * Updates the contents of the scene every frame.
     */
    update() {
        this.flameLight.intensity = Math.random() * 0.02 + 0.04;
    }

    /**
     * Updates the lights of the scene at scene startup.
     */
    updateLights() {
        this.lights.forEach((l) => {
            l.castShadow = true;
            l.shadow.mapSize.width = this.shadowMapSize;
            l.shadow.mapSize.height = this.shadowMapSize;
            l.shadow.map?.dispose();
            l.shadow.map = null;
        });
    }

    /**
     * Updates the helpers of the scene on user input (controlled through the GUI).
     */
    updateHelpers() {
        this.helpers.forEach((h) => (h.visible = this.helpersVisible));
    }

    /**
     * Builds the NURB  defined by the given control points using the given samples along the U and V directions.
     * The material is applied to the resulting geometry and the resulting mesh is returned.
     * 
     * @type NURBControlPoints = number[][][]
     * @param {NURBControlPoints} controlPoints the points that control the surface shape
     * @param {number} samples1 the number of samples along the U direction
     * @param {number} samples2 the number of samples along the V direction
     * @param {THREE.Material} material the material to apply to the computed geometry
     * @returns {THREE.Mesh}
     */
    buildNURBS(controlPoints, samples1, samples2, material) {
        const degree1 = controlPoints.length - 1,
            degree2 = (controlPoints[0]?.length ?? 0) - 1;

        if (degree1 < 0 || degree2 < 0) return;

        const knots1 = new Array(degree1 + 1)
            .fill(0)
            .concat(new Array(degree1 + 1).fill(1));
        const knots2 = new Array(degree2 + 1)
            .fill(0)
            .concat(new Array(degree2 + 1).fill(1));

        const vControlPoints = controlPoints.map((row) =>
            row.map((item) => new THREE.Vector4(...item))
        );

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

    /**
     * Calls all the scene builders to build their respective objects.
     * 
     * @returns {THREE.Group} the scene contents
     */
    buildScene() {

        const sceneContents = new THREE.Group();

        // room
        const room = this.buildRoom();
        sceneContents.add(room);

        // table
        const table = this.buildTable();
        sceneContents.add(table);

        // cake
        this.buildCake()

        // CAROCHA
        this.buildCarocha();

        // PICTURES
        this.buildPictures()

        // FLASHLIGHT
        this.buildFlashlight();

        // window
        this.buildWindow();

        // spring
        this.buildSpring();

        // newspaper
        this.buildNewspaper()

        // flower and pot
        this.buildFlowerAndPot();

        // lamp
        this.buildLamp();

        // chair
        this.buildChair();

        return sceneContents;
    }

    /**
     *  Builds a plane to be used when constructing the room.
     * 
     * @type RoomPlaneGeometryParams = {
     *    width?: number;
     *   height?: number;
     * }
     * @type ShadowParams = {
     *    receive?: boolean;
     *    cast?: boolean;
     * }
     * @param {THREE.Geometry | undefined} geometry 
     * @param {RoomPlaneGeometryParams} dimensions 
     * @param {ShadowParams|null} param2
     * @param {THREE.Material} material 
     * @returns {THREE.Mesh} the plane to be used when building the room
     */
    buildRoomPlane(geometry, {
        width, height
    } = {}, {
        cast, receive
    } = {}, material) {
        const wallGeometry = geometry ?? new THREE.PlaneGeometry(width ?? 5, height ?? 5);

        const wall = new THREE.Mesh(
            wallGeometry,
            material,
        );

        wall.castShadow = cast ?? true;
        wall.receiveShadow = receive ?? true;

        return wall;
    }

    /**
     * Builds the room.
     */
    buildRoom() {
        const room = new THREE.Group();

        const floor = this.buildRoomPlane(null, {
            width: 5,
            height: 5
        }, {
            cast: true,
            receive: true
        }, this.floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0;
        floor.receiveShadow = true;
        room.add(floor);

        let wallGeometry = new THREE.PlaneGeometry(5, 3);

        const wall1 = this.buildRoomPlane(wallGeometry, undefined, {
            cast: true,
            receive: true
        }, this.wallMaterial);
        wall1.position.y = 1.5;
        wall1.position.z = -2.5;
        room.add(wall1);

        const wall2 = this.buildRoomPlane(wallGeometry, undefined, {
            cast: true,
            receive: true
        }, this.wallMaterial);
        wall2.rotation.y = Math.PI;
        wall2.position.y = 1.5;
        wall2.position.z = 2.5;
        room.add(wall2);

        const wall3 = this.buildRoomPlane(wallGeometry, undefined, {
            cast: true,
            receive: true
        }, this.wallMaterial);
        wall3.rotation.y = Math.PI / 2;
        wall3.position.x = -2.5;
        wall3.position.y = 1.5;
        room.add(wall3);

        const wallHGeometry = new THREE.PlaneGeometry(5, (3 - 0.85) / 2);
        const wallVGeometry = new THREE.PlaneGeometry((5 - 0.85) / 2, 0.85);

        const wallMesh41 = new THREE.Mesh(wallHGeometry, this.wallMaterial);
        wallMesh41.rotation.y = -Math.PI / 2;
        wallMesh41.position.x = 2.5;
        wallMesh41.position.y = wallHGeometry.parameters.height / 2;
        const wallMesh42 = new THREE.Mesh(wallHGeometry, this.wallMaterial);
        wallMesh42.rotation.y = -Math.PI / 2;
        wallMesh42.position.x = 2.5;
        wallMesh42.position.y = 3 - wallHGeometry.parameters.height / 2;
        const wallMesh43 = new THREE.Mesh(wallVGeometry, this.wallMaterial);
        wallMesh43.rotation.y = -Math.PI / 2;
        wallMesh43.position.x = 2.5;
        wallMesh43.position.y = 1.5;
        wallMesh43.position.z = 2.5 - wallVGeometry.parameters.width / 2;
        const wallMesh44 = new THREE.Mesh(wallVGeometry, this.wallMaterial);
        wallMesh44.rotation.y = -Math.PI / 2;
        wallMesh44.position.x = 2.5;
        wallMesh44.position.y = 1.5;
        wallMesh44.position.z = -2.5 + wallVGeometry.parameters.width / 2;

        const wall4Geometry = BufferGeometryUtils.mergeBufferGeometries(
            [wallMesh41, wallMesh42, wallMesh43, wallMesh44].map((m) => {
                m.updateMatrixWorld();

                return m.geometry.clone().applyMatrix4(m.matrixWorld);
            }),
            true
        );

        this.wall4 = new THREE.Mesh(wall4Geometry, this.wallMaterial);
        this.wall4.receiveShadow = true;
        this.wall4.castShadow = true;
        room.add(this.wall4);

        const ceiling = this.buildRoomPlane(undefined, {
            width: 5,
            height: 5
        }, undefined, this.wallMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 3;
        room.add(ceiling);

        return room;
    }

    /**
     * Builds a parameterized table leg. The given material is applied to the computed geometry.
     * 
     * @type CylinderGeometryParams = {
     *    radiusTop?: number;
     *    radiusBottom?: number;
     *    height?: number;
     *    radialSegments?: number;
     * }
     * @type ShadowParams = {
     *     receive?: boolean;
     *    cast?: boolean;
     * }
     * @param {THREE.Geometry | null} geometry the geometry to use when building this mesh
     * @param {CylinderGeometryParams | null} dimensions the dimensions of the geometry in case {geometry} is {null}
     * @param {ShadowParams|null} shadows shadow controls
     * @param {THREE.Material|null} material the material to apply to the computed geometry
     * @returns {THREE.Mesh} the table leg mesh with the given material applied
     */
    buildTableLeg(geometry, {
        radiusTop,
        radiusBottom,
        height,
        radialSegments
    } = {}, {
        receive,
        cast
    } = {}, material = null) {
        let tableLegGeometry = geometry ?? new THREE.CylinderGeometry(radiusTop ?? 0.05, radiusBottom ?? 0.05, height ?? 0.8, radialSegments ?? 32);

        const tableLeg = new THREE.Mesh(
            tableLegGeometry,
            material ?? this.tableLegMaterial,
        );
        tableLeg.receiveShadow = receive ?? true;
        tableLeg.castShadow = cast ?? true;

        return tableLeg;
    }

    /**
     * Builds the table.
     * 
     * @return {THREE.Group} the table
     */
    buildTable() {
        const table = new THREE.Group()

        let tableTopGeometry = new THREE.BoxGeometry(1, 0.1, 2);
        this.tableTop = new THREE.Mesh(tableTopGeometry, this.tableMaterial);
        this.tableTop.position.y = 0.8;
        this.tableTop.receiveShadow = true;
        this.tableTop.castShadow = true;
        table.add(this.tableTop);

        const tableLegGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 32);

        const tableLeg1 = this.buildTableLeg(tableLegGeometry);
        tableLeg1.position.y = 0.4;
        tableLeg1.position.x = 0.45;
        tableLeg1.position.z = 0.95;
        table.add(tableLeg1);

        const tableLeg2 = this.buildTableLeg(tableLegGeometry);
        tableLeg2.position.y = 0.4;
        tableLeg2.position.x = -0.45;
        tableLeg2.position.z = 0.95;
        table.add(tableLeg2);

        const tableLeg3 = this.buildTableLeg(tableLegGeometry);
        tableLeg3.position.y = 0.4;
        tableLeg3.position.x = 0.45;
        tableLeg3.position.z = -0.95;
        table.add(tableLeg3);

        const tableLeg4 = this.buildTableLeg(tableLegGeometry);
        tableLeg4.position.y = 0.4;
        tableLeg4.position.x = -0.45;
        tableLeg4.position.z = -0.95;
        table.add(tableLeg4);

        return table;
    }

    /**
     * Builds the cake.
     */
    buildCake() {
        let plate = new THREE.CylinderGeometry(0.16, 0.14, 0.02, 32);
        this.plateMesh = new THREE.Mesh(plate, this.plateMaterial);
        this.plateMesh.position.y = 0.85;
        this.plateMesh.position.x = 0;
        this.plateMesh.position.z = 0;
        this.plateMesh.receiveShadow = true;
        this.plateMesh.castShadow = true;
        this.app.scene.add(this.plateMesh);

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

        this.flameLight = new THREE.PointLight("orange", 0.05, 0);
        this.flameLight.position.set(0, 0.98, 0);
        this.app.scene.add(this.flameLight);
        this.lights.push(this.flameLight);

        let flameLightHelper = new THREE.PointLightHelper(
            this.flameLight,
            0.1
        );
        this.app.scene.add(flameLightHelper);
        this.helpers.push(flameLightHelper);
    }

    /**
     * Builds the "carocha" figure.
     */
    buildCarocha() {
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

    /**
     * Builds the pictures.
     */
    buildPictures() {
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

    /**
     * Builds the flashlight.
     */
    buildFlashlight() {
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
            1,
            5,
            Math.PI / 7,
            0.2,
            1
        );

        flashLightLightSource.position.y = -flashLightBodyHeight / 2;
        flashLightLightSource.target.position.x = 0;
        flashLightLightSource.target.position.y = 1;
        flashLightLightSource.target.position.z = 0;
        this.lights.push(flashLightLightSource);

        flashLight.add(flashLightLightSource);
        flashLight.add(this.flashLightGlow);

        flashLight.position.y = 0.88;
        flashLight.position.z = 0.6;
        flashLight.position.x = 0.2;
        flashLight.rotation.x = Math.PI / 2 + 0.079;
        flashLight.rotation.z = -0.3;
        flashLight.castShadow = true;
        flashLight.receiveShadow = true;

        // For SOME reason this needs to be instantiated
        const h = new THREE.SpotLightHelper(flashLightLightSource);
        this.helpers.push(h);
        this.app.scene.add(h);

        this.app.scene.add(flashLight);
    }

    /**
     * Builds the window.
     */
    buildWindow() {
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

        this.sun = new THREE.DirectionalLight("white", 5);
        this.sun.position.y = 5;
        this.sun.position.z = 5;
        this.sun.position.x = 5;
        this.app.scene.add(this.sun);
        this.lights.push(this.sun);

        this.sunHelper = new THREE.DirectionalLightHelper(this.sun, 0.5);
        this.app.scene.add(this.sunHelper);
        this.helpers.push(this.sunHelper);
    }

    /**
     * Builds the spring.
     */
    buildSpring() {
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

    /**
     * Builds the newspaper.
     */
    buildNewspaper() {
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

        const newspaper = this.buildNURBS(
            controlPoints,
            30,
            10,
            this.newspaperMaterial
        );
        newspaper.position.y = 1.035;
        newspaper.position.x = 0.15;
        newspaper.position.z = -0.75;
        newspaper.rotation.y = Math.PI / 5;
        newspaper.castShadow = true;
        newspaper.receiveShadow = true;

        this.app.scene.add(newspaper);
    }

    /**
     * Builds the flower and pot.
     */
    buildFlowerAndPot() {
        const r = 0.05;
        const R = 0.15;
        const h = 0.05;
        const H = 0.15;

        const vaseControlPoints = [
            // U = 0
            [
                // V = 0..1;
                [r, H, 0, 1],
                [r, H, -r, 0.707],
                [0, H, -r, 1],
            ],
            // U = 1
            [
                // V = 0..1;
                [R, h, 0, 1],
                [R, h, -R, 0.707],
                [0, h, -R, 1],
            ],
            // U = 2
            [
                // V = 0..1;
                [r, -H, 0, 1],
                [r, -H, -r, 0.707],
                [0, -H, -r, 1],
            ],
        ];

        const pot1 = this.buildNURBS(
            vaseControlPoints,
            10,
            10,
            this.potMaterial
        );
        pot1.position.y = 1;
        pot1.position.x = -0.2;
        pot1.position.z = 0.4;
        pot1.castShadow = true;
        pot1.receiveShadow = true;

        const pot2 = pot1.clone();
        pot2.rotation.y = Math.PI / 2;

        const pot3 = pot1.clone();
        pot3.rotation.y = Math.PI;

        const pot4 = pot1.clone();
        pot4.rotation.y = -Math.PI / 2;

        this.pot = new THREE.Group();

        this.pot.add(pot1);
        this.pot.add(pot2);
        this.pot.add(pot3);
        this.pot.add(pot4);
        this.app.scene.add(this.pot);

        const flowerBodyPoints = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-0.08, .2 - 0.08, 0),
            new THREE.Vector3(-0.08, .2 - 0.08 + 0.552284749831 * 0.08, 0),
            new THREE.Vector3(0 - 0.08 * 0.552284749831, .2, 0),
            new THREE.Vector3(0, .2, 0)
        );
        this.flowerBody = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(
                flowerBodyPoints.getPoints(50)
            ),
            this.flowerBodyMaterial
        )

        const scale = .10;
        const leafBaseHalfLength = 0.0
        const leafControlPoints = [
            // U = 0
            [
                // V = 0..1;
                [r * scale, H * scale, -r * scale, 1],
                [r * scale, H * scale, -r * scale, 0.207],
                [r * scale, H * scale, -r * scale, 1],
            ],
            // U = 1
            [
                // V = 0..1;
                [R * scale, h * scale, 0, 1],
                [R * scale, h * scale, -R * scale, 0.507],
                [0, h * scale, -R * scale, 1],
            ],
            // U = 2
            [
                // V = 0..1;
                [r * scale + leafBaseHalfLength * scale, -H * scale, 0, 1],
                [r * scale, -H * scale, 0, 0.207],
                [r * scale, -H * scale, -leafBaseHalfLength * scale, 1],
            ],
        ];

        this.leaf = this.buildNURBS(
            leafControlPoints,
            10,
            10,
            this.flowerLeafMaterial
        );
        this.leaf.position.y = .169;
        this.leaf.position.x = -0.058;
        this.leaf.position.z = this.flowerBody.position.z + 0.015;
        this.leaf.rotation.z = Math.PI / 2;
        this.leaf.rotation.y = -3 * Math.PI / 2;
        this.leaf.rotation.x = -0.1 * Math.PI / 9;
        this.flowerBody.add(this.leaf);

        const headScale = 0.5;

        this.flowerHeadCoreGeometry = new THREE.CylinderGeometry(headScale * 0.05, headScale * 0.05, headScale * 0.0125);
        this.flowerHeadCore = new THREE.Mesh(this.flowerHeadCoreGeometry, this.flowerHeadCoreMaterial);

        this.flowerHeadRing1Geometry = new THREE.TorusGeometry(headScale * 0.05, headScale * 0.01, 40, 40);
        this.flowerHeadRing1 = new THREE.Mesh(this.flowerHeadRing1Geometry, this.flowerHeadRing1Material);
        this.flowerHeadRing1.rotation.x = Math.PI / 2;

        this.flowerHeadRing2Geometry = new THREE.TorusGeometry(headScale * 0.065, headScale * 0.01, 40, 40);
        this.flowerHeadRing2 = new THREE.Mesh(this.flowerHeadRing2Geometry, this.flowerHeadRing2Material);
        this.flowerHeadRing2.rotation.x = Math.PI / 2;

        this.flowerHead = new THREE.Group();
        this.flowerHead.add(this.flowerHeadCore);
        this.flowerHead.add(this.flowerHeadRing1);
        this.flowerHead.add(this.flowerHeadRing2);
        this.flowerHead.position.y = .2;
        this.flowerHead.rotation.z = - Math.PI / 2;

        this.flower = new THREE.Group();
        this.flower.add(this.flowerBody);
        this.flower.add(this.flowerHead);

        this.flower.castShadow = true;
        this.flower.receiveShadow = true;

        this.flower.position.y = 1;
        this.flower.position.x = -0.1;
        this.flower.position.z = 0.4;

        this.potSoilGeometry = new THREE.CylinderGeometry(0.07, 0.09, 0.05, 32);
        this.potSoil = new THREE.Mesh(this.potSoilGeometry, this.soilMaterial);
        this.potSoil.position.y = 0.095;
        this.potSoil.castShadow = true;
        this.potSoil.receiveShadow = true;
        pot1.add(this.potSoil);

        this.app.scene.add(this.flower);
    }

    /**
     * Builds the ceiling lamp.
     */
    buildLamp() {
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 0, 1);
        pointLight.position.set(0, 2.75, 0);
        this.app.scene.add(pointLight);
        this.lights.push(pointLight);

        const pointLightHelper = new THREE.PointLightHelper(
            pointLight,
            0.25
        );
        this.app.scene.add(pointLightHelper);
        this.helpers.push(pointLightHelper);

        const lamp = new THREE.CylinderGeometry(
            0.15,
            0.2,
            0.3,
            32,
            1,
            true
        );
        const lampMesh = new THREE.Mesh(lamp, this.lampMaterial);
        lampMesh.position.y = 2.75;
        lampMesh.castShadow = true;
        lampMesh.receiveShadow = true;
        this.app.scene.add(lampMesh);
    }

    /**
     * Builds the chair.
     */
    buildChair() {
        const chair = new THREE.BoxGeometry(0.5, 0.05, 0.5);
        const chairMesh = new THREE.Mesh(chair, this.tableMaterial);
        chairMesh.position.y = 0.5;
        chairMesh.position.z = 1;
        chairMesh.position.x = -1;
        chairMesh.rotation.y = (3 * Math.PI) / 4;
        chairMesh.castShadow = true;
        chairMesh.receiveShadow = true;
        this.app.scene.add(chairMesh);

        const chairLeg = new THREE.CylinderGeometry(0.025, 0.025, 0.5, 32);

        const chairLegMesh1 = new THREE.Mesh(
            chairLeg,
            this.tableLegMaterial
        );
        chairLegMesh1.position.y = -0.25;
        chairLegMesh1.position.x = 0.2;
        chairLegMesh1.position.z = 0.2;
        chairLegMesh1.castShadow = true;
        chairLegMesh1.receiveShadow = true;
        chairMesh.add(chairLegMesh1);

        const chairLegMesh2 = new THREE.Mesh(
            chairLeg,
            this.tableLegMaterial
        );
        chairLegMesh2.position.y = -0.25;
        chairLegMesh2.position.x = -0.2;
        chairLegMesh2.position.z = 0.2;
        chairLegMesh2.castShadow = true;
        chairLegMesh2.receiveShadow = true;
        chairMesh.add(chairLegMesh2);

        const chairLegMesh3 = new THREE.Mesh(
            chairLeg,
            this.tableLegMaterial
        );
        chairLegMesh3.position.y = -0.25;
        chairLegMesh3.position.x = 0.2;
        chairLegMesh3.position.z = -0.2;
        chairLegMesh3.castShadow = true;
        chairLegMesh3.receiveShadow = true;
        chairMesh.add(chairLegMesh3);

        const chairLegMesh4 = new THREE.Mesh(
            chairLeg,
            this.tableLegMaterial
        );
        chairLegMesh4.position.y = -0.25;
        chairLegMesh4.position.x = -0.2;
        chairLegMesh4.position.z = -0.2;
        chairLegMesh4.castShadow = true;
        chairLegMesh4.receiveShadow = true;
        chairMesh.add(chairLegMesh4);

        const chairBack = new THREE.BoxGeometry(0.5, 0.5, 0.05);
        const chairBackMesh = new THREE.Mesh(chairBack, this.tableMaterial);
        chairBackMesh.position.y = 0.25;
        chairBackMesh.position.z = -0.225;
        chairBackMesh.castShadow = true;
        chairBackMesh.receiveShadow = true;
        chairMesh.add(chairBackMesh);

        let plate = new THREE.CylinderGeometry(0.1, 0.08, 0.01, 32);
        const plateMesh = new THREE.Mesh(plate, this.plateMaterial);
        plateMesh.position.y = 0.025;
        plateMesh.position.x = 0;
        plateMesh.position.z = 0;
        plateMesh.castShadow = true;
        plateMesh.receiveShadow = true;
        chairMesh.add(plateMesh);

        let cakeSliceCylinder = new THREE.CylinderGeometry(
            0.1,
            0.1,
            0.1,
            64,
            1,
            false,
            0,
            Math.PI / 6
        );
        const cakeSliceMesh1 = new THREE.Mesh(
            cakeSliceCylinder,
            this.cakeMaterial
        );
        cakeSliceMesh1.rotation.z = Math.PI / 2;
        cakeSliceMesh1.position.y = 0.0275;
        cakeSliceMesh1.position.z = -0.05;
        cakeSliceMesh1.receiveShadow = true;
        cakeSliceMesh1.castShadow = true;
        chairMesh.add(cakeSliceMesh1);

        let cakeSlice = new THREE.PlaneGeometry(0.1, 0.1);
        const cakeSliceMesh2 = new THREE.Mesh(cakeSlice, this.cakeMaterial);
        cakeSliceMesh2.rotation.y = (4 * Math.PI) / 6;
        cakeSliceMesh2.position.x = Math.sin(Math.PI / 6) * 0.05;
        cakeSliceMesh2.position.z = Math.cos(Math.PI / 6) * 0.05;
        cakeSliceMesh2.receiveShadow = true;
        cakeSliceMesh2.castShadow = true;
        cakeSliceMesh1.add(cakeSliceMesh2);
    }


}
export { MyContents };
