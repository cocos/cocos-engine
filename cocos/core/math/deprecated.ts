/**
 * @hidden
 */

import { removeProperty, replaceProperty } from '../utils/deprecated';
import { Color } from './color';
import { Mat3 } from './mat3';
import { Mat4 } from './mat4';
import { Quat } from './quat';
import { Vec2 } from './vec2';
import { Vec3 } from './vec3';
import { Vec4 } from './vec4';
import { legacyCC } from '../global-exports';

replaceProperty(Vec2, 'Vec2', [
    {
        name: 'sub',
        newName: 'subtract',
        target: Vec2,
        targetName: 'Vec2',
    },
    {
        name: 'mul',
        newName: 'multiply',
        target: Vec2,
        targetName: 'Vec2',
    },
    {
        name: 'div',
        newName: 'divide',
        target: Vec2,
        targetName: 'Vec2',
    },
    {
        name: 'dist',
        newName: 'distance',
        target: Vec2,
        targetName: 'Vec2',
    },
    {
        name: 'sqrDist',
        newName: 'squaredDistance',
        target: Vec2,
        targetName: 'Vec2',
    },
    {
        name: 'mag',
        newName: 'len',
        target: Vec2,
        targetName: 'Vec2',
    },
    {
        name: 'sqrMag',
        newName: 'lengthSqr',
        target: Vec2,
        targetName: 'Vec2',
    },
    {
        name: 'scale',
        newName: 'multiplyScalar',
        target: Vec2,
        targetName: 'Vec2',
    },
    {
        name: 'exactEquals',
        newName: 'strictEquals',
        target: Vec2,
        targetName: 'Vec2',
    },
]);

replaceProperty(Vec2.prototype, 'Vec2', [
    {
        name: 'mag',
        newName: 'length',
        target: Vec2.prototype,
        targetName: 'Vec2',
    },
    {
        name: 'magSqr',
        newName: 'lengthSqr',
        target: Vec2.prototype,
        targetName: 'Vec2',
    },
    {
        name: 'scale',
        newName: 'multiplyScalar',
        target: Vec2.prototype,
        targetName: 'Vec2',
    },
    {
        name: 'exactEquals',
        newName: 'strictEquals',
        target: Vec2.prototype,
        targetName: 'Vec2',
    },
]);

// 与新添加API 接口重名，需尽快更改后删除此弃用
removeProperty(Vec2.prototype, 'vmath', [
    {
        name: 'divide',
    },
]);

replaceProperty(Vec3, 'Vec3', [
    {
        name: 'sub',
        newName: 'subtract',
        target: Vec3,
        targetName: 'Vec3',
    },
    {
        name: 'mul',
        newName: 'multiply',
        target: Vec3,
        targetName: 'Vec3',
    },
    {
        name: 'div',
        newName: 'divide',
        target: Vec3,
        targetName: 'Vec3',
    },
    {
        name: 'dist',
        newName: 'distance',
        target: Vec3,
        targetName: 'Vec3',
    },
    {
        name: 'sqrDist',
        newName: 'squaredDistance',
        target: Vec3,
        targetName: 'Vec3',
    },
    {
        name: 'mag',
        newName: 'len',
        target: Vec3,
        targetName: 'Vec3',
    },
    {
        name: 'sqrMag',
        newName: 'lengthSqr',
        target: Vec3,
        targetName: 'Vec3',
    },
    {
        name: 'scale',
        newName: 'multiplyScalar',
        target: Vec3,
        targetName: 'Vec3',
    },
    {
        name: 'exactEquals',
        newName: 'strictEquals',
        target: Vec3,
        targetName: 'Vec3',
    },
]);

replaceProperty(Vec3.prototype, 'Vec3', [
    {
        name: 'mag',
        newName: 'length',
        target: Vec3.prototype,
        targetName: 'Vec3',
    },
    {
        name: 'magSqr',
        newName: 'lengthSqr',
        target: Vec3.prototype,
        targetName: 'Vec3',
    },
    {
        name: 'scale',
        newName: 'multiplyScalar',
        target: Vec3.prototype,
        targetName: 'Vec3',
    },
    {
        name: 'exactEquals',
        newName: 'strictEquals',
        target: Vec3.prototype,
        targetName: 'Vec3',
    },
]);

// 与新添加API 接口重名，需尽快更改后删除此弃用
removeProperty(Vec3.prototype, 'vmath', [
    {
        name: 'divide',
    },
]);

replaceProperty(Vec4, 'Vec4', [
    {
        name: 'sub',
        newName: 'subtract',
        target: Vec4,
        targetName: 'Vec4',
    },
    {
        name: 'mul',
        newName: 'multiply',
        target: Vec4,
        targetName: 'Vec4',
    },
    {
        name: 'div',
        newName: 'divide',
        target: Vec4,
        targetName: 'Vec4',
    },
    {
        name: 'dist',
        newName: 'distance',
        target: Vec4,
        targetName: 'Vec4',
    },
    {
        name: 'sqrDist',
        newName: 'squaredDistance',
        target: Vec4,
        targetName: 'Vec4',
    },
    {
        name: 'mag',
        newName: 'len',
        target: Vec4,
        targetName: 'Vec4',
    },
    {
        name: 'sqrMag',
        newName: 'lengthSqr',
        target: Vec4,
        targetName: 'Vec4',
    },
    {
        name: 'scale',
        newName: 'multiplyScalar',
        target: Vec4,
        targetName: 'Vec4',
    },
    {
        name: 'exactEquals',
        newName: 'strictEquals',
        target: Vec4,
        targetName: 'Vec4',
    },
]);

replaceProperty(Vec4.prototype, 'Vec4', [
    {
        name: 'mag',
        newName: 'length',
        target: Vec4.prototype,
        targetName: 'Vec4',
    },
    {
        name: 'magSqr',
        newName: 'lengthSqr',
        target: Vec4.prototype,
        targetName: 'Vec4',
    },
    {
        name: 'scale',
        newName: 'multiplyScalar',
        target: Vec4.prototype,
        targetName: 'Vec4',
    },
    {
        name: 'exactEquals',
        newName: 'strictEquals',
        target: Vec4.prototype,
        targetName: 'Vec4',
    },
]);

// 与新添加API 接口重名，需尽快更改后删除此弃用
removeProperty(Vec4.prototype, 'vmath', [
    {
        name: 'divide',
    },
]);

replaceProperty(Quat, 'Quat', [
    {
        name: 'mag',
        newName: 'len',
        target: Quat,
        targetName: 'Quat',
    },
    {
        name: 'mul',
        newName: 'multiply',
        target: Quat,
        targetName: 'Quat',
    },
    {
        name: 'sqrMag',
        newName: 'lengthSqr',
        target: Quat,
        targetName: 'Quat',
    },
    {
        name: 'scale',
        newName: 'multiplyScalar',
        target: Quat,
        targetName: 'Quat',
    },
    {
        name: 'exactEquals',
        newName: 'strictEquals',
        target: Quat,
        targetName: 'Quat',
    },
]);

replaceProperty(Quat.prototype, 'Quat', [
    {
        name: 'scale',
        newName: 'multiplyScalar',
        target: Quat.prototype,
        targetName: 'Quat',
    },
    {
        name: 'exactEquals',
        newName: 'strictEquals',
        target: Quat.prototype,
        targetName: 'Quat',
    },
]);

replaceProperty(Color, 'Color', [
    {
        name: 'sub',
        newName: 'subtract',
        target: Color,
        targetName: 'Color',
    },
    {
        name: 'mul',
        newName: 'multiply',
        target: Color,
        targetName: 'Color',
    },
    {
        name: 'div',
        newName: 'divide',
        target: Color,
        targetName: 'Color',
    },
    {
        name: 'exactEquals',
        newName: 'strictEquals',
        target: Color,
        targetName: 'Color',
    },
    {
        name: 'fromHex',
        newName: 'fromHEX',
        customFunction: function (...args: any) {
            let arg1 = args[1].toString(16);
            return legacyCC.Color.fromHEX(args[0], arg1);
        },
    },
]);

replaceProperty(Mat3, 'Mat3', [
    {
        name: 'sub',
        newName: 'subtract',
        target: Mat3,
        targetName: 'Mat3',
    },
    {
        name: 'mul',
        newName: 'multiply',
        target: Mat3,
        targetName: 'Mat3',
    },
    {
        name: 'exactEquals',
        newName: 'strictEquals',
        target: Mat3,
        targetName: 'Mat3',
    },
]);

replaceProperty(Mat3.prototype, 'Mat3', [
    {
        name: 'sub',
        newName: 'subtract',
        target: Mat3.prototype,
        targetName: 'Mat3',
    },
    {
        name: 'mul',
        newName: 'multiply',
        target: Mat3.prototype,
        targetName: 'Mat3',
    },
    {
        name: 'mulScalar',
        newName: 'multiplyScalar',
        target: Mat3.prototype,
        targetName: 'Mat3',
    },
    {
        name: 'exactEquals',
        newName: 'strictEquals',
        target: Mat3.prototype,
        targetName: 'Mat3',
    },
]);

replaceProperty(Mat4, 'Mat4', [
    {
        name: 'sub',
        newName: 'subtract',
        target: Mat4,
        targetName: 'Mat4',
    },
    {
        name: 'mul',
        newName: 'multiply',
        target: Mat4,
        targetName: 'Mat4',
    },
    {
        name: 'exactEquals',
        newName: 'strictEquals',
        target: Mat4,
        targetName: 'Mat4',
    },
]);

replaceProperty(Mat4.prototype, 'Mat4', [
    {
        name: 'sub',
        newName: 'subtract',
        target: Mat4.prototype,
        targetName: 'Mat4',
    },
    {
        name: 'mul',
        newName: 'multiply',
        target: Mat4.prototype,
        targetName: 'Mat4',
    },
    {
        name: 'mulScalar',
        newName: 'multiplyScalar',
        target: Mat4.prototype,
        targetName: 'Mat4',
    },
    {
        name: 'exactEquals',
        newName: 'strictEquals',
        target: Mat4.prototype,
        targetName: 'Mat4',
    },
]);
