import * as THREE from "three";

export const emod = THREE.MathUtils.euclideanModulo;

export const lerp = THREE.MathUtils.lerp;

/**
 * @param {number} a
 * @param {number} b
 * @param {number} t
 *
 * @returns {number}
 */
export const rlerp = (a, b, t) => {
    const max = Math.PI * 2;
    const da = emod(b - a, max);
    const dist = emod(2 * da, max) - da;
    return a + dist * t;
};

/**
 * @param {THREE.Cylindrical} c1
 * @param {THREE.Cylindrical} c2
 * @param {number} t
 * @param {number} [at=t]
 * @returns {THREE.Cylindrical}
 */
export const clerp = (c1, c2, t, at = t) => {
    return new THREE.Cylindrical(
        lerp(c1.radius, c2.radius, t),
        rlerp(c1.theta, c2.theta, at),
        lerp(c1.y, c2.y, t)
    );
};

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const randRange = (min, max) => Math.random() * (max - min) + min;

/**
 * @param {THREE.Vector3} a
 * @param {THREE.Vector3} b
 *
 * @returns {number}
 */
export const signedAngleTo = (a, b) =>
    Math.atan2(a.clone().cross(b).dot(new THREE.Vector3(0, 1, 0)), a.dot(b));
