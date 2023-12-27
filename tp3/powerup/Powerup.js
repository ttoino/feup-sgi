import * as THREE from 'three';
import { Game } from '../Game.js';

export default class Powerup extends THREE.Object3D {

    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super()

        this.game = game

        this.time = 0
        this.initialY = undefined

        this.#init();
    }

    #init() {

        const powerup = new THREE.Group()

        const geometry = new THREE.CylinderGeometry(1, 1, 0.5)
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffff })
        const mesh = new THREE.Mesh(geometry, material)

        mesh.rotation.x = Math.PI / 2

        powerup.add(mesh)

        this.add(powerup)
    }

    /**
     * 
     * @param {number} delta 
     */
    update(delta) {
        this.time += delta

        if (this.initialY === undefined) {
            this.initialY = this.position.y
        }

        this.position.y = this.initialY + Math.sin(this.time * 2) * 0.5 + 0.5
        this.rotateOnAxis(new THREE.Vector3(0, 1, 0), delta * 0.5)
    }

    onCollision() {
        throw new Error('onCollision() not implemented for base powerup class')
    }

}