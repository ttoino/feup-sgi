import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui = new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {

        // CAMERAS /////////////////////////////////////////////////

        const cameraFolder = this.datgui.addFolder("Camera");
        cameraFolder
            .add(this.app, "activeCameraName", Object.keys(this.app.cameras))
            .name("active camera");
        cameraFolder.open();

        // FOG /////////////////////////////////////////////////

        const fogFolder = this.datgui.addFolder("Fog");

        fogFolder
            .add(this.app.scene.fog, "far", 300, 1000)
            .name("Far distance");

        fogFolder
            .add(this.app.scene.fog, "near", 0, 300)
            .name("Near distance");

        fogFolder.addColor(this.app.scene.fog, "color").name("Fog Color")

        // LIGHTS /////////////////////////////////////////////////

        const lightTypeMap = {}
        const lightFolder = this.datgui.addFolder("Lights");
        lightFolder
            .add(this.contents, "showHelpers")
            .name("Show helpers")
            .onChange((value) => {
                this.contents.updateHelpers();
            });

        for (const helper of this.contents.helpers) {

            const lightType = helper.type.replace('Helper', '');
            if (lightTypeMap[lightType] === undefined) {
                lightTypeMap[lightType] = 0;
            }
            lightTypeMap[lightType]++;

            const helperFolder = lightFolder.addFolder(`${lightType} ${lightTypeMap[lightType]}`);

            helperFolder
                .add(helper.light, "visible")
                .name("Toggle light");
        }

        // SCENE OBJECTS /////////////////////////////////////////////////

        const objectsFolder = this.datgui.addFolder("Objects");

        const subObjects = [];

        const allWireframe = objectsFolder
            .add(this.contents, "showAllWireframes")
            .name("Show All Wireframes")
            .onChange((value) => {
                this.contents.updateWireframeAll();

                if (value)
                    subObjects.forEach((o) => {
                        o.updateDisplay();
                        this.contents[o.property] = value
                    });
            }).listen();

        const resetAll = () => {
            this.contents[allWireframe.property] = subObjects.every((o) => this.contents[o.property] === true);
            allWireframe.updateDisplay();
        }

        const planeFolder = objectsFolder.addFolder("Plane");
        subObjects.push(planeFolder
            .add(this.contents, "showPlaneWireframes")
            .name("Show Plane Wireframes")
            .onChange((value) => {
                this.contents.updateWireframePlane();

                resetAll();
            }).listen());


        const hangarFolder = objectsFolder.addFolder("Hangar");
        subObjects.push(hangarFolder
            .add(this.contents, "showHangarWireframes")
            .name("Show Hangar Wireframes")
            .onChange((value) => {
                this.contents.updateWireframeHangar();

                resetAll();
            }).listen());

        const cratesFolder = objectsFolder.addFolder("Crates");
        subObjects.push(cratesFolder
            .add(this.contents, "showCratesWireframes")
            .name("Show Crates Wireframes")
            .onChange((value) => {
                this.contents.updateWireframeCrates();

                resetAll();
            }).listen());

        const groundFolder = objectsFolder.addFolder("Ground");
        subObjects.push(groundFolder
            .add(this.contents, "showGroundWireframes")
            .name("Show Ground Wireframes")
            .onChange((value) => {
                this.contents.updateWireframeGround();

                resetAll();
            }).listen());

        const skyboxFolder = objectsFolder.addFolder("Skybox");
        subObjects.push(skyboxFolder
            .add(this.contents, "showSkyboxWireframes")
            .name("Show Skybox Wireframes")
            .onChange((value) => {
                this.contents.updateWireframeSkybox();

                resetAll();
            }).listen());
    }
}

export { MyGuiInterface };