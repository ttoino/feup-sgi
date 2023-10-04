import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0, 2, 0)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess
        });

        // spotligh related attributes
        this.spotLightColor = "#ffffff";
        this.spotLightIntensity = 15;
        this.spotLightDistance = 8;
        this.spotLightAngle = 2 * Math.PI / 9;
        this.spotLightPenumbra = 0;
        this.spotLightDecay = 0;
        this.spotLightTargetY = 0;
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000", emissive: "#000000", shininess: 90
        })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(this.boxMeshSize, this.boxMeshSize, this.boxMeshSize);
        this.boxMesh = new THREE.Mesh(box, boxMaterial);
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    /**
     * initializes the contents
     */
    init() {

        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        // const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        // pointLight.position.set( 0, 20, 0 );
        // this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        // const sphereSize = 0.5;
        // const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        // this.app.scene.add( pointLightHelper );

        // this.light2 = new THREE.DirectionalLight(0xffffff, 3);
        // this.light2.position.set(-5, 10, -2);
        // if (this.boxMesh)
        //     this.light2.target = this.boxMesh;

        // this.app.scene.add(this.light2);

        // const directionalLightHelper = new THREE.DirectionalLightHelper(this.light2);
        // this.app.scene.add(directionalLightHelper);

        this.spotLight = new THREE.SpotLight(this.spotLightColor, this.spotLightIntensity, this.spotLightDistance, this.spotLightAngle, this.spotLightPenumbra, this.spotLightDecay);
        this.spotLight.position.set(2, 5, 1);
        this.spotLight.target.position.set(1, this.spotLightTargetY, 1);

        this.app.scene.add(this.spotLight);

        this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
        this.app.scene.add(this.spotLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555, 4);
        this.app.scene.add(ambientLight);

        this.buildBox()

        // Create a Plane Mesh with basic material

        let plane = new THREE.PlaneGeometry(10, 10);
        this.planeMesh = new THREE.Mesh(plane, this.planeMaterial);
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add(this.planeMesh);
    }

    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }

    /**
    * updates the diffuse plane color and the material
    * @param {THREE.Color} value 
    */
    updateSpotlightColor(value) {
        this.spotLightColor = value;
        this.spotLight.color.set(this.spotLightColor);
    }

    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }

    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }

    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    updateSpotlight() {
        this.spotLight.angle = this.spotLightAngle;
        this.spotLight.decay = this.spotLightDecay;
        this.spotLight.intensity = this.spotLightIntensity;
        this.spotLight.distance = this.spotLightDistance;
        this.spotLight.penumbra = this.spotLightPenumbra;

        this.spotLight.target.position.set(1, this.spotLightTargetY, 1);

        this.app.scene.remove(this.spotLightHelper);
        this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
        this.app.scene.add(this.spotLightHelper);
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()
        this.updateSpotlight();

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
    }

}

export { MyContents };