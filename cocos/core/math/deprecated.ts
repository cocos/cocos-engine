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
    oldTarget: Vec2,
    oldPrefix: 'Vec2',
    newTarget: Vec2,
    newPrefix: 'Vec2',
    pairs: [
        ['sub', 'subtract'],
        ['mul', 'multiply'],
        ['div', 'divide'],
        ['dist', 'distance'],
        ['sqrDist', 'squaredDistance'],
        ['mag', 'len'],
        ['sqrMag', 'lengthSqr'],
        ['scale', 'multiplyScalar'],
        ['exactEquals', 'strictEquals'],
    ],
});

deprecatedWrapper({
    oldTarget: Vec2.prototype,
    oldPrefix: 'Vec2',
    newTarget: Vec2.prototype,
    newPrefix: 'Vec2',
    pairs: [
        ['mag', 'length'],
        ['magSqr', 'lengthSqr'],
        ['exactEquals', 'strictEquals'],
        ['scale', 'multiplyScalar'],
    ],
});

// 与新添加API 接口重名，需尽快更改后删除此弃用
deprecatedWrapper({
    oldTarget: Vec2.prototype,
    oldPrefix: "Vec2",
    pairs: [
        ['divide'],
    ]
});

deprecatedWrapper({
    oldTarget: Vec3,
    oldPrefix: 'Vec3',
    newTarget: Vec3,
    newPrefix: 'Vec3',
    pairs: [
        ['sub', 'subtract'],
        ['mul', 'multiply'],
        ['div', 'divide'],
        ['dist', 'distance'],
        ['sqrDist', 'squaredDistance'],
        ['mag', 'len'],
        ['sqrMag', 'lengthSqr'],
        ['scale', 'multiplyScalar'],
        ['exactEquals', 'strictEquals'],
    ],
});

deprecatedWrapper({
    oldTarget: Vec3.prototype,
    oldPrefix: 'Vec3',
    newTarget: Vec3.prototype,
    newPrefix: 'Vec3',
    pairs: [
        ['mag', 'length'],
        ['magSqr', 'lengthSqr'],
        ['exactEquals', 'strictEquals'],
        ['scale', 'multiplyScalar'],
    ],
});

// 与新添加API 接口重名，需尽快更改后删除此弃用
deprecatedWrapper({
    oldTarget: Vec3.prototype,
    oldPrefix: "Vec3",
    pairs: [
        ['divide'],
    ]
});

deprecatedWrapper({
    oldTarget: Vec4,
    oldPrefix: 'Vec4',
    newTarget: Vec4,
    newPrefix: 'Vec4',
    pairs: [
        ['sub', 'subtract'],
        ['mul', 'multiply'],
        ['div', 'divide'],
        ['dist', 'distance'],
        ['sqrDist', 'squaredDistance'],
        ['mag', 'len'],
        ['sqrMag', 'lengthSqr'],
        ['scale', 'multiplyScalar'],
        ['exactEquals', 'strictEquals'],
    ],
});

deprecatedWrapper({
    oldTarget: Vec4.prototype,
    oldPrefix: 'Vec4',
    newTarget: Vec4.prototype,
    newPrefix: 'Vec4',
    pairs: [
        ['mag', 'length'],
        ['magSqr', 'lengthSqr'],
        ['exactEquals', 'strictEquals'],
        ['scale', 'multiplyScalar'],
    ],
});

// 与新添加API 接口重名，需尽快更改后删除此弃用
deprecatedWrapper({
    oldTarget: Vec4.prototype,
    oldPrefix: "Vec4",
    pairs: [
        ['divide'],
    ]
});

deprecatedWrapper({
    oldTarget: Quat,
    oldPrefix: 'Quat',
    newTarget: Quat,
    newPrefix: 'Quat',
    pairs: [
        ['mul', 'multiply'],
        ['mag', 'len'],
        ['sqrMag', 'lengthSqr'],
        ['scale', 'multiplyScalar'],
        ['exactEquals', 'strictEquals'],
    ],
});

deprecatedWrapper({
    oldTarget: Quat.prototype,
    oldPrefix: 'Quat',
    newTarget: Quat.prototype,
    newPrefix: 'Quat',
    pairs: [
        ['scale', 'multiplyScalar'],
        ['exactEquals', 'strictEquals'],
    ],
});

deprecatedWrapper({
    oldTarget: Color,
    oldPrefix: 'Color',
    newTarget: Color,
    newPrefix: 'Color',
    pairs: [
        ['sub', 'subtract'],
        ['mul', 'multiply'],
        ['div', 'divide'],
        ['exactEquals','strictEquals'],
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
        ['exactEquals','strictEquals'],
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
        ['mulScalar', 'multiplyScalar'],
        ['exactEquals','strictEquals'],
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
        ['exactEquals','strictEquals'],
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
        ['mulScalar', 'multiplyScalar'],
        ['exactEquals','strictEquals'],
    ],
});
