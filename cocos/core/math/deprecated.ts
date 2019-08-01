/**
 * @hidden
 */

import { deprecatedWrapper } from '../../deprecated';
import { Vec2 } from './vec2';
import { Vec3 } from './vec3';
import { Vec4 } from './vec4';
import { Quat } from './quat';
import { Mat3 } from './mat3';
import { Mat4 } from './mat4';
import { Color } from './color';

deprecatedWrapper({
    oldTarget: Vec2.prototype,
    oldPrefix: 'Vec2',
    newTarget: Vec2.prototype,
    newPrefix: 'Vec2',
    pairs: [
        ['sub', 'subtract'],
        ['mul', 'multiply'],
        ['div', 'divide'],
        ['dist', 'distance'],
        ['sqrDist', 'squaredDistance'],
        ['mag', 'len'],
        ['sqrMag', 'lengthSqr'],
    ],
});

deprecatedWrapper({
    oldTarget: Vec2,
    oldPrefix: 'Vec2',
    newTarget: Vec2,
    newPrefix: 'Vec2',
    pairs: [
        ['mag', 'length'],
        ['magSqr', 'lengthSqr'],
    ],
});

deprecatedWrapper({
    oldTarget: Vec3.prototype,
    oldPrefix: 'Vec3',
    newTarget: Vec3.prototype,
    newPrefix: 'Vec3',
    pairs: [
        ['sub', 'subtract'],
        ['mul', 'multiply'],
        ['div', 'divide'],
        ['dist', 'distance'],
        ['sqrDist', 'squaredDistance'],
        ['mag', 'len'],
        ['sqrMag', 'lengthSqr'],
    ],
});

deprecatedWrapper({
    oldTarget: Vec3,
    oldPrefix: 'Vec3',
    newTarget: Vec3,
    newPrefix: 'Vec3',
    pairs: [
        ['mag', 'length'],
        ['magSqr', 'lengthSqr'],
    ],
});

deprecatedWrapper({
    oldTarget: Vec4.prototype,
    oldPrefix: 'Vec4',
    newTarget: Vec4.prototype,
    newPrefix: 'Vec4',
    pairs: [
        ['sub', 'subtract'],
        ['mul', 'multiply'],
        ['div', 'divide'],
        ['dist', 'distance'],
        ['sqrDist', 'squaredDistance'],
        ['mag', 'len'],
        ['sqrMag', 'lengthSqr'],
    ],
});

deprecatedWrapper({
    oldTarget: Vec4,
    oldPrefix: 'Vec4',
    newTarget: Vec4,
    newPrefix: 'Vec4',
    pairs: [
        ['mag', 'length'],
        ['magSqr', 'lengthSqr'],
    ],
});

deprecatedWrapper({
    oldTarget: Quat.prototype,
    oldPrefix: 'Quat',
    newTarget: Quat.prototype,
    newPrefix: 'Quat',
    pairs: [
        ['mul', 'multiply'],
        ['mag', 'len'],
        ['sqrMag', 'lengthSqr'],
    ],
});

deprecatedWrapper({
    oldTarget: Color.prototype,
    oldPrefix: 'Color',
    newTarget: Color.prototype,
    newPrefix: 'Color',
    pairs: [
        ['sub', 'subtract'],
        ['mul', 'multiply'],
        ['div', 'divide'],
    ],
});

deprecatedWrapper({
    oldTarget: Mat3.prototype,
    oldPrefix: 'Mat3',
    newTarget: Mat3.prototype,
    newPrefix: 'Mat3',
    pairs: [
        ['sub', 'subtract'],
        ['mul', 'multiply'],
    ],
});

deprecatedWrapper({
    oldTarget: Mat3,
    oldPrefix: 'Mat3',
    newTarget: Mat3,
    newPrefix: 'Mat3',
    pairs: [
        ['sub', 'subtract'],
        ['mul', 'multiply'],
        ['mulScalar', 'multiplyScalar'],
    ],
});

deprecatedWrapper({
    oldTarget: Mat4.prototype,
    oldPrefix: 'Mat4',
    newTarget: Mat4.prototype,
    newPrefix: 'Mat4',
    pairs: [
        ['sub', 'subtract'],
        ['mul', 'multiply'],
    ],
});

deprecatedWrapper({
    oldTarget: Mat4,
    oldPrefix: 'Mat4',
    newTarget: Mat4,
    newPrefix: 'Mat4',
    pairs: [
        ['sub', 'subtract'],
        ['mul', 'multiply'],
        ['mulScalar', 'multiplyScalar'],
    ],
});
