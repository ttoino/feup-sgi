import * as THREE from "three";

export class MyDude extends THREE.Object3D {

    constructor(app) {
        super();

        this.acceleration = 0;

        this.app = app;
        this.forwardSpeed = 0;
        this.rotationSpeedRadS = 0;
        this.rotationRad = 0;

        this.material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        this.geometry = new THREE.BoxGeometry(5, 5, 5);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);

        document.addEventListener("keydown", this.movementKeyDownController.bind(this));
        document.addEventListener("keyup", this.movementKeyUpController.bind(this));
    }

    #speedUp() {
        this.acceleration = 1;
    }

    #speedDown() {
        this.acceleration = -1
    }

    #resetAcceleration() {
        this.acceleration = 0;
    }

    #rotateLeft() {
        this.rotationRad = 1;
    }

    #rotateRight() {
        this.rotationRad -= 1;
    }

    #resetRotation() {
        this.rotationRad = 0;
    }

    movementKeyDownController(event) {
        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
                this.#speedUp();
                break;
            case "ArrowDown":
            case "s":
            case "S":
                this.#speedDown();
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                this.#rotateLeft();
                break;
            case "ArrowRight":
            case "d":
            case "D":
                this.#rotateRight();
                break;
        }
    }

    movementKeyUpController(event) {
        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
            case "ArrowDown":
            case "s":
            case "S":
                this.#resetAcceleration();
                break;
            case "ArrowLeft":
            case "a":
            case "A":
            case "ArrowRight":
            case "d":
            case "D":
                this.#resetRotation();
                break;
        }
    }

    update(delta) {
        this.forwardSpeed = Math.max(this.forwardSpeed + this.acceleration * delta, 0);

        console.log(this.forwardSpeed, this.rotationRad);

        this.rotation.y += this.rotationRad * delta;

        this.position.x += this.forwardSpeed * Math.cos(-this.rotation.y);
        this.position.z += this.forwardSpeed * Math.sin(-this.rotation.y);
    }
}