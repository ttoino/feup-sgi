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

        this.soilTexture = new THREE.TextureLoader().load("textures/soil.avif");
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
     * @param {number} degree1 the number of samples along the U direction
     * @param {number} degree2 the number of samples along the V direction
     * @param {THREE.Material} material the material to apply to the computed geometry
     * @returns {THREE.Mesh}
     */
    buildNURBS(controlPoints, samples1, samples2, degree1, degree2, material) {
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
        const cakeAndPlate = this.buildCakeAndPlate();
        sceneContents.add(cakeAndPlate);

        // CAROCHA
        const carocha = this.buildCarocha();
        sceneContents.add(carocha);

        // FLASHLIGHT
        const flashlight = this.buildFlashlight();
        sceneContents.add(flashlight);

        // window
        const window = this.buildWindow();
        sceneContents.add(window);

        // spring
        const spring = this.buildSpring();
        sceneContents.add(spring);

        // newspaper
        const newspaper = this.buildNewspaper();
        sceneContents.add(newspaper);

        // flower and pot
        const flowerAndPot = this.buildFlowerAndPot();
        sceneContents.add(flowerAndPot);

        // lamp
        const lamp = this.buildLamp();
        sceneContents.add(lamp);

        // chair
        const chair = this.buildChair();
        sceneContents.add(chair);

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
     * @param {THREE.Geometry | undefined} geometry the geometry to use when building this mesh.
     * @param {RoomPlaneGeometryParams} dimensions the dimensions to use when building the plane geometry if {geometry} does not exist
     * @param {ShadowParams|null} shadow the shadow controls to use
     * @param {THREE.Material} material the material to apply to the computed plane geometry
     * @returns {THREE.Mesh} the plane to be used when building the room
     */
    buildRoomPlane(
        geometry,
        { width, height } = {},
        { cast, receive } = {},
        material
    ) {
        const wallGeometry =
            geometry ?? new THREE.PlaneGeometry(width ?? 5, height ?? 5);

        const wall = new THREE.Mesh(wallGeometry, material);

        wall.castShadow = cast ?? true;
        wall.receiveShadow = receive ?? true;

        return wall;
    }

    /**
     * Builds the room.
     *
     * @returns {THREE.Group} the room
     */
    buildRoom() {
        const room = new THREE.Group();

        const floor = this.buildRoomPlane(
            null,
            {
                width: 5,
                height: 5,
            },
            {
                cast: true,
                receive: true,
            },
            this.floorMaterial
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0;
        floor.receiveShadow = true;
        room.add(floor);

        let wallGeometry = new THREE.PlaneGeometry(5, 3);

        const wall1 = this.buildRoomPlane(
            wallGeometry,
            undefined,
            {
                cast: true,
                receive: true,
            },
            this.wallMaterial
        );
        wall1.position.y = 1.5;
        wall1.position.z = -2.5;

        const [peras, toino] = this.buildPictures();
        wall1.add(toino);
        wall1.add(peras);

        room.add(wall1);

        const wall2 = this.buildRoomPlane(
            wallGeometry,
            undefined,
            {
                cast: true,
                receive: true,
            },
            this.wallMaterial
        );
        wall2.rotation.y = Math.PI;
        wall2.position.y = 1.5;
        wall2.position.z = 2.5;
        room.add(wall2);

        const wall3 = this.buildRoomPlane(
            wallGeometry,
            undefined,
            {
                cast: true,
                receive: true,
            },
            this.wallMaterial
        );
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

        const ceiling = this.buildRoomPlane(
            undefined,
            {
                width: 5,
                height: 5,
            },
            undefined,
            this.wallMaterial
        );
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
    buildTableLeg(
        geometry,
        { radiusTop, radiusBottom, height, radialSegments } = {},
        { receive, cast } = {},
        material = null
    ) {
        let tableLegGeometry =
            geometry ??
            new THREE.CylinderGeometry(
                radiusTop ?? 0.05,
                radiusBottom ?? 0.05,
                height ?? 0.8,
                radialSegments ?? 32
            );

        const tableLeg = new THREE.Mesh(
            tableLegGeometry,
            material ?? this.tableLegMaterial
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
        const table = new THREE.Group();

        let tableTopGeometry = new THREE.BoxGeometry(1, 0.1, 2);
        this.tableTop = new THREE.Mesh(tableTopGeometry, this.tableMaterial);
        this.tableTop.position.y = 0.8;
        this.tableTop.receiveShadow = true;
        this.tableTop.castShadow = true;
        table.add(this.tableTop);

        const tableLegGeometry = new THREE.CylinderGeometry(
            0.05,
            0.05,
            0.8,
            32
        );

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
     * Builds the plate used to hold the cake.
     *
     * @returns {THREE.Group} the plate used to hold the cake
     */
    buildPlate() {
        const plateGeometry = new THREE.CylinderGeometry(0.16, 0.14, 0.02, 32);
        const plate = new THREE.Mesh(plateGeometry, this.plateMaterial);
        plate.receiveShadow = true;
        plate.castShadow = true;

        return plate;
    }

    /**
     * Builds the cake.
     *
     * @returns {THREE.Group} the cake
     */
    buildCake() {
        const cake = new THREE.Group();

        const cakeBodyGeometry = new THREE.CylinderGeometry(
            0.1,
            0.1,
            0.1,
            64,
            1,
            false,
            0,
            (Math.PI * 11) / 6
        );
        const cakeBody = new THREE.Mesh(cakeBodyGeometry, this.cakeMaterial);
        cakeBody.position.y = 0.05;
        cakeBody.receiveShadow = true;
        cakeBody.castShadow = true;
        cake.add(cakeBody);

        let cakeSliceGeometry = new THREE.PlaneGeometry(0.1, 0.1);

        const cakeSlice1 = new THREE.Mesh(cakeSliceGeometry, this.cakeMaterial);
        cakeSlice1.rotation.y = -Math.PI / 2;
        cakeSlice1.position.y = 0.05;
        cakeSlice1.position.z = 0.05;
        cakeSlice1.receiveShadow = true;
        cakeSlice1.castShadow = true;
        cake.add(cakeSlice1);

        const cakeSlice2 = new THREE.Mesh(cakeSliceGeometry, this.cakeMaterial);
        cakeSlice2.rotation.y = (2 * Math.PI) / 6;
        cakeSlice2.position.y = 0.05;
        cakeSlice2.position.x = -Math.sin(Math.PI / 6) * 0.05;
        cakeSlice2.position.z = Math.cos(Math.PI / 6) * 0.05;
        cakeSlice2.receiveShadow = true;
        cakeSlice2.castShadow = true;
        cake.add(cakeSlice2);

        const candle = this.buildCandle();
        candle.position.y = 0.1125;

        cake.add(candle);

        return cake;
    }

    /**
     * Builds the candle that sits on top of the cake.
     *
     * @returns {THREE.Group} the candle that sits on top of the cake
     */
    buildCandle() {
        const candle = new THREE.Group();

        const candleBodyGeometry = new THREE.CylinderGeometry(
            0.005,
            0.005,
            0.025,
            8
        );

        const candleBody = new THREE.Mesh(
            candleBodyGeometry,
            this.candleMaterial
        );
        candleBody.receiveShadow = true;
        candleBody.castShadow = true;

        candle.add(candleBody);

        let flameGeometry = new THREE.ConeGeometry(0.005, 0.01, 8);

        const flame = new THREE.Mesh(flameGeometry, this.flameMaterial);
        flame.position.y = 0.025;
        flame.position.x = 0;
        flame.position.z = 0;

        // make this a member of the class so we can change the intensity later
        this.flameLight = new THREE.PointLight("orange", 0.05, 0);

        flame.add(this.flameLight);

        const flameLightHelper = new THREE.PointLightHelper(
            this.flameLight,
            0.1
        );
        this.app.scene.add(flameLightHelper);
        this.helpers.push(flameLightHelper);

        candle.add(flame);

        return candle;
    }

    /**
     * Builds the cake.
     *
     * @returns {THREE.Group} the cake and the plate
     */
    buildCakeAndPlate() {
        const cakeAndPlate = new THREE.Group();

        const plate = this.buildPlate();
        cakeAndPlate.add(plate);

        const cake = this.buildCake();
        cake.position.y = plate.position.y + 0.0;
        cakeAndPlate.add(cake);

        cakeAndPlate.position.y = 0.85;

        return cakeAndPlate;
    }

    /**
     * Builds the "carocha" figure.
     *
     * @returns {THREE.Group} the "carocha" figure
     */
    buildCarocha() {
        const carocha = new THREE.Group();

        const carocha1 = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-0.8, 2 - 0.8, 2.49),
            new THREE.Vector3(-0.8, 2 - 0.8 + 0.552284749831 * 0.8, 2.49),
            new THREE.Vector3(0 - 0.8 * 0.552284749831, 2, 2.49),
            new THREE.Vector3(0, 2, 2.49)
        );
        carocha.add(
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
        carocha.add(
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
        carocha.add(
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
        carocha.add(
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
        carocha.add(
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
        carocha.add(
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
        carocha.add(
            new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(
                    carocha7.getPoints(50)
                ),
                this.lineMaterial
            )
        );

        return carocha;
    }

    /**
     * Builds the picture frame.
     *
     * @param {THREE.Geometry} frameGeometry the geometry of the frame
     * @returns {THREE.Mesh} the picture frame
     */
    buildFrame(frameGeometry) {
        const frame = new THREE.Mesh(frameGeometry, this.frameMaterial);

        frame.rotation.z = Math.PI / 4;
        frame.receiveShadow = true;

        return frame;
    }

    /**
     * Builds a frame with a picture.
     *
     * @param {THREE.Geometry} frameGeometry the geometry of the frame
     * @param {THREE.Geometry} pictureGeometry the geometry of the picture
     * @param {THREE.Material} pictureMaterial the material of the picture
     * @returns {THREE.Mesh} the frame with a picture
     */
    buildPicture(frameGeometry, pictureGeometry, pictureMaterial) {
        const frame = this.buildFrame(frameGeometry);

        const picture = new THREE.Mesh(pictureGeometry, pictureMaterial);

        picture.position.z = 0.01;
        picture.receiveShadow = true;
        picture.rotation.z = -Math.PI / 4;

        frame.add(picture);

        return frame;
    }

    /**
     * Builds the Peras
     *
     * @param {THREE.Geometry} frameGeometry the frame geometry
     * @param {THREE.Geometry} pictureGeometry the picture geometry
     * @returns {THREE.Group} the Peras
     */
    buildPeras(frameGeometry, pictureGeometry) {
        return this.buildPicture(
            frameGeometry,
            pictureGeometry,
            this.perasMaterial
        );
    }

    /**
     * Builds the Toino
     *
     * @param {THREE.Geometry} frameGeometry the frame geometry
     * @param {THREE.Geometry} pictureGeometry the picture geometry
     * @returns {THREE.Group} the Toino
     */
    buildToino(frameGeometry, pictureGeometry) {
        return this.buildPicture(
            frameGeometry,
            pictureGeometry,
            this.toinoMaterial
        );
    }

    /**
     * Builds the pictures.7
     *
     * @returns {THREE.Group[]} the pictures
     */
    buildPictures() {
        const frameGeometry = new THREE.TorusGeometry(0.3, 0.03, 4, 4);

        const pictureGeometry = new THREE.PlaneGeometry(0.4, 0.4);

        const peras = this.buildPeras(frameGeometry, pictureGeometry);
        const toino = this.buildToino(frameGeometry, pictureGeometry);

        peras.position.x = -0.5;
        peras.receiveShadow = true;

        toino.position.x = 0.5;
        toino.receiveShadow = true;

        return [peras, toino];
    }

    /**
     * Builds the flashlight.
     *
     * @returns {THREE.Group} the flashlight
     */
    buildFlashlight() {
        const flashlight = new THREE.Group();

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

        const flashLightMesh = new THREE.Mesh(
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

        flashLightMesh.add(flashLightLightSource);
        flashLightMesh.add(this.flashLightGlow);

        flashLightMesh.position.y = 0.88;
        flashLightMesh.position.z = 0.6;
        flashLightMesh.position.x = 0.2;
        flashLightMesh.rotation.x = Math.PI / 2 + 0.079;
        flashLightMesh.rotation.z = -0.3;
        flashLightMesh.castShadow = true;
        flashLightMesh.receiveShadow = true;

        // For SOME reason this needs to be instantiated
        const h = new THREE.SpotLightHelper(flashLightLightSource);
        this.helpers.push(h);
        flashlight.add(h);

        flashlight.add(flashLightMesh);

        return flashlight;
    }

    /**
     * Builds the window.
     *
     * @returns {THREE.Group} the window
     */
    buildWindow() {
        const window = new THREE.Group();

        const displacement = 0.21;

        const windowQuarterGeometry = new THREE.TorusGeometry(0.3, 0.03, 4, 4);
        const window1 = this.buildFrame(windowQuarterGeometry);
        window1.position.x = displacement;
        window1.position.y = displacement;

        const window2 = this.buildFrame(windowQuarterGeometry);
        window2.position.x = displacement;
        window2.position.y = -displacement;

        const window3 = this.buildFrame(windowQuarterGeometry);
        window3.position.x = -displacement;
        window3.position.y = displacement;

        const window4 = this.buildFrame(windowQuarterGeometry);
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

        window.add(this.windowFrame);

        this.sun = new THREE.DirectionalLight("white", 5);
        this.sun.position.y = 5;
        this.sun.position.z = 5;
        this.sun.position.x = 5;
        window.add(this.sun);
        this.lights.push(this.sun);

        this.sunHelper = new THREE.DirectionalLightHelper(this.sun, 0.5);
        window.add(this.sunHelper);
        this.helpers.push(this.sunHelper);

        return window;
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
                ...generateRevolution(50, 0.025, HEIGHT_STEP, i * HEIGHT_STEP)
            );
        }

        const curve = new THREE.CatmullRomCurve3(points);

        const curvePoints = curve.getPoints(50 * num_revolutions);
        const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

        // Create the final object to add to the scene
        const spring = new THREE.Line(geometry, material);

        spring.castShadow = true;
        spring.position.y = 0.85;
        spring.position.z = -0.4;
        spring.position.x = -0.4;

        return spring;
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

        return newspaper;
    }

    /**
     * Builds the pot.
     *
     * @returns {THREE.Group} the pot
     */
    buildVase() {
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

        const vaseQuarter = this.buildNURBS(
            vaseControlPoints,
            10,
            10,
            this.potMaterial
        );
        vaseQuarter.position.y = 1;
        vaseQuarter.position.x = -0.2;
        vaseQuarter.position.z = 0.4;
        vaseQuarter.castShadow = true;
        vaseQuarter.receiveShadow = true;

        const pot2 = vaseQuarter.clone();
        pot2.rotation.y = Math.PI / 2;

        const pot3 = vaseQuarter.clone();
        pot3.rotation.y = Math.PI;

        const pot4 = vaseQuarter.clone();
        pot4.rotation.y = -Math.PI / 2;

        const pot = new THREE.Group();

        pot.add(vaseQuarter);
        pot.add(pot2);
        pot.add(pot3);
        pot.add(pot4);

        return pot;
    }

    /**
     * Builds the flower.
     *
     * @returns {THREE.Group} the flower
     */
    buildFlower() {
        const r = 0.05;
        const R = 0.15;
        const h = 0.05;
        const H = 0.15;

        const flowerBodyPoints = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-0.08, 0.2 - 0.08, 0),
            new THREE.Vector3(-0.08, 0.2 - 0.08 + 0.552284749831 * 0.08, 0),
            new THREE.Vector3(0 - 0.08 * 0.552284749831, 0.2, 0),
            new THREE.Vector3(0, 0.2, 0)
        );
        const flowerBody = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(
                flowerBodyPoints.getPoints(50)
            ),
            this.flowerBodyMaterial
        );

        const scale = 0.1;
        const leafBaseHalfLength = 0.0;
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

        const leaf = this.buildNURBS(
            leafControlPoints,
            10,
            10,
            this.flowerLeafMaterial
        );
        leaf.position.y = 0.169;
        leaf.position.x = -0.058;
        leaf.position.z = flowerBody.position.z + 0.015;
        leaf.rotation.z = Math.PI / 2;
        leaf.rotation.y = (-3 * Math.PI) / 2;
        leaf.rotation.x = (-0.1 * Math.PI) / 9;
        flowerBody.add(leaf);

        const headScale = 0.5;

        const flowerHeadCoreGeometry = new THREE.CylinderGeometry(
            headScale * 0.05,
            headScale * 0.05,
            headScale * 0.0125
        );
        const flowerHeadCore = new THREE.Mesh(
            flowerHeadCoreGeometry,
            this.flowerHeadCoreMaterial
        );

        const flowerHeadRing1Geometry = new THREE.TorusGeometry(
            headScale * 0.05,
            headScale * 0.01,
            40,
            40
        );
        const flowerHeadRing1 = new THREE.Mesh(
            flowerHeadRing1Geometry,
            this.flowerHeadRing1Material
        );
        flowerHeadRing1.rotation.x = Math.PI / 2;

        const flowerHeadRing2Geometry = new THREE.TorusGeometry(
            headScale * 0.065,
            headScale * 0.01,
            40,
            40
        );
        const flowerHeadRing2 = new THREE.Mesh(
            flowerHeadRing2Geometry,
            this.flowerHeadRing2Material
        );
        flowerHeadRing2.rotation.x = Math.PI / 2;

        const flowerHead = new THREE.Group();
        flowerHead.add(flowerHeadCore);
        flowerHead.add(flowerHeadRing1);
        flowerHead.add(flowerHeadRing2);
        flowerHead.position.y = 0.2;
        flowerHead.rotation.z = -Math.PI / 2;

        const flower = new THREE.Group();
        flower.add(flowerBody);
        flower.add(flowerHead);

        flower.castShadow = true;
        flower.receiveShadow = true;

        const potSoilGeometry = new THREE.CylinderGeometry(
            0.07,
            0.09,
            0.05,
            32
        );
        const potSoil = new THREE.Mesh(potSoilGeometry, this.soilMaterial);
        potSoil.position.y = 0.095;
        potSoil.position.x = -0.05;
        potSoil.castShadow = true;
        potSoil.receiveShadow = true;
        flower.add(potSoil);

        return flower;
    }

    /**
     * Builds the flower and pot.
     *
     * @returns {THREE.Group} the flower and pot
     */
    buildFlowerAndPot() {
        const flowerAndPot = new THREE.Group();

        const vase = this.buildVase();

        flowerAndPot.add(vase);

        const flower = this.buildFlower();

        flower.position.y = 1;
        flower.position.x = -0.15;
        flower.position.z = 0.4;

        flowerAndPot.add(flower);

        return flowerAndPot;
    }

    /**
     * Builds the ceiling lamp.
     */
    buildLamp() {
        const lamp = new THREE.Group();

        const lampGeometry = new THREE.CylinderGeometry(
            0.15,
            0.2,
            0.3,
            32,
            1,
            true
        );
        const lampBody = new THREE.Mesh(lampGeometry, this.lampMaterial);
        lampBody.position.y = 2.75;
        lampBody.castShadow = true;
        lampBody.receiveShadow = true;
        lamp.add(lampBody);

        const pointLight = new THREE.PointLight(0xffffff, 0.5, 0, 1);
        pointLight.position.set(0, 2.75, 0);
        lamp.add(pointLight);
        this.lights.push(pointLight);

        const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.25);
        lamp.add(pointLightHelper);
        this.helpers.push(pointLightHelper);

        return lamp;
    }

    /**
     * Builds a leg of the chair
     *
     * @param {*} geometry the geometry of the leg
     * @param {*} dimensions the dimensions of the leg
     * @param {*} shadow the shadow properties of the leg
     * @param {*} material the material to apply to the leg (defaults to the table leg material)
     * @returns a chair leg
     */
    buildChairLeg(
        geometry,
        { radiusTop, radiusBottom, height, radialSegments } = {},
        { receive, cast } = {},
        material = null
    ) {
        let tableLegGeometry =
            geometry ??
            new THREE.CylinderGeometry(
                radiusTop ?? 0.025,
                radiusBottom ?? 0.025,
                height ?? 0.5,
                radialSegments ?? 32
            );

        const tableLeg = new THREE.Mesh(
            tableLegGeometry,
            material ?? this.tableLegMaterial
        );
        tableLeg.receiveShadow = receive ?? true;
        tableLeg.castShadow = cast ?? true;

        return tableLeg;
    }

    /**
     * Builds the chair.
     *
     * @returns {THREE.Group} the chair
     */
    buildChair() {
        const chair = new THREE.Group();

        const chairGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.5);
        const chairBase = new THREE.Mesh(chairGeometry, this.tableMaterial);
        chairBase.castShadow = true;
        chairBase.receiveShadow = true;
        chair.add(chairBase);

        const chairLegHeight = 0.5;

        const chairLegGeometry = new THREE.CylinderGeometry(
            0.025,
            0.025,
            chairLegHeight,
            32
        );

        const chairLeg1 = this.buildChairLeg(chairLegGeometry);
        chairLeg1.position.y = -chairLegHeight / 2;
        chairLeg1.position.x = 0.2;
        chairLeg1.position.z = 0.2;
        chair.add(chairLeg1);

        const chairLeg2 = this.buildChairLeg(chairLegGeometry);
        chairLeg2.position.y = -chairLegHeight / 2;
        chairLeg2.position.x = -0.2;
        chairLeg2.position.z = 0.2;
        chair.add(chairLeg2);

        const chairLeg3 = this.buildChairLeg(chairLegGeometry);
        chairLeg3.position.y = -chairLegHeight / 2;
        chairLeg3.position.x = 0.2;
        chairLeg3.position.z = -0.2;
        chair.add(chairLeg3);

        const chairLeg4 = this.buildChairLeg(chairLegGeometry);
        chairLeg4.position.y = -chairLegHeight / 2;
        chairLeg4.position.x = -0.2;
        chairLeg4.position.z = -0.2;
        chair.add(chairLeg4);

        const chairBackGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.05);
        const chairBack = new THREE.Mesh(chairBackGeometry, this.tableMaterial);
        chairBack.position.y = 0.25;
        chairBack.position.z = -0.225;
        chairBack.castShadow = true;
        chairBack.receiveShadow = true;
        chair.add(chairBack);

        let plate = new THREE.CylinderGeometry(0.1, 0.08, 0.01, 32);
        const plateMesh = new THREE.Mesh(plate, this.plateMaterial);
        plateMesh.position.y = 0.025;
        plateMesh.position.x = 0;
        plateMesh.position.z = 0;
        plateMesh.castShadow = true;
        plateMesh.receiveShadow = true;
        chair.add(plateMesh);

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
        chair.add(cakeSliceMesh1);

        let cakeSlice = new THREE.PlaneGeometry(0.1, 0.1);
        const cakeSliceMesh2 = new THREE.Mesh(cakeSlice, this.cakeMaterial);
        cakeSliceMesh2.rotation.y = (4 * Math.PI) / 6;
        cakeSliceMesh2.position.x = Math.sin(Math.PI / 6) * 0.05;
        cakeSliceMesh2.position.z = Math.cos(Math.PI / 6) * 0.05;
        cakeSliceMesh2.receiveShadow = true;
        cakeSliceMesh2.castShadow = true;
        cakeSliceMesh1.add(cakeSliceMesh2);

        chair.position.y = chairLegHeight;
        chair.position.x = -1;
        chair.position.z = 1;
        chair.rotation.y = (3 * Math.PI) / 4;

        return chair;
    }
}
export { MyContents };
