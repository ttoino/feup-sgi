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
        // add a folder to the gui interface for the box
        const boxFolder = this.datgui.addFolder('Box');
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange(() => { this.contents.rebuildBox() });
        boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.open()

        const data = {
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder('Plane');
        planeFolder.addColor(data, 'diffuse color').onChange((value) => { this.contents.updateDiffusePlaneColor(value) });
        planeFolder.addColor(data, 'specular color').onChange((value) => { this.contents.updateSpecularPlaneColor(value) });
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange((value) => { this.contents.updatePlaneShininess(value) });
        planeFolder.open();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', ['Perspective', 'Left', 'Top', 'Front']).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()

        const spotLightFolder = this.datgui.addFolder('Empty');
        spotLightFolder.addColor({
            white: "white",
            blue: "blue",
            black: "black",
            red: "red"
        }, 'white').onChange((value) => { this.contents.updateSpotlightColor(value); });
        spotLightFolder.add(this.contents, 'spotLightIntensity', 0, 100).name('spotlight intensity');
        spotLightFolder.add(this.contents, 'spotLightDistance', 0, 100).name('spotlight distance');
        spotLightFolder.add(this.contents, 'spotLightAngle', 0, Math.PI/2).name('spotlight angle');
        spotLightFolder.add(this.contents, 'spotLightPenumbra', 0, 1).name('spotlight penumbra');
        spotLightFolder.add(this.contents, 'spotLightDecay', 0, 1).name('spotlight decay');
        spotLightFolder.add(this.contents, 'spotLightTargetY', -10, 10).name('spotlight target');
        spotLightFolder.open();
    }
}

export { MyGuiInterface };