/**
 * @hidden
 */

import { replaceProperty } from './utils/deprecated';
import { math } from '.';
import { Scheduler } from './scheduler';

// VMATH

const vmath = {};
replaceProperty(vmath,'vmath',[
    {
        name: 'vec2',
        newName: 'Vec2',
        target: math,
        targetName: 'math'
    },
    {
        name: 'vec3',
        newName: 'Vec3',
        target: math,
        targetName: 'math'
    },
    {
        name: 'vec4',
        newName: 'Vec4',
        target: math,
        targetName: 'math'
    },
    {
        name: 'quat',
        newName: 'Quat',
        target: math,
        targetName: 'math'
    },
    {
        name: 'mat3',
        newName: 'Mat3',
        target: math,
        targetName: 'math'
    },    {
        name: 'mat4',
        newName: 'Mat4',
        target: math,
        targetName: 'math'
    },
    {
        name: 'color4',
        newName: 'Color',
        target: math,
        targetName: 'math'
    },
    {
        name: 'rect',
        newName: 'Rect',
        target: math,
        targetName: 'math'
    },
    {
        name: 'approx',
        newName: 'approx',
        target: math,
        targetName: 'math'
    },
    {
        name: 'EPSILON',
        newName: 'EPSILON',
        target: math,
        targetName: 'math'
    },
    {
        name: 'equals',
        newName: 'equals',
        target: math,
        targetName: 'math'
    },
    {
        name: 'clamp',
        newName: 'clamp',
        target: math,
        targetName: 'math'
    },
    {
        name: 'clamp01',
        newName: 'clamp01',
        target: math,
        targetName: 'math'
    },
    {
        name: 'lerp',
        newName: 'lerp',
        target: math,
        targetName: 'math'
    },
    {
        name: 'toRadian',
        newName: 'toRadian',
        target: math,
        targetName: 'math'
    },
    {
        name: 'toDegree',
        newName: 'toDegree',
        target: math,
        targetName: 'math',
    },
    {
        name: 'random',
        newName: 'random',
        target: math,
        targetName: 'math'
    },
    {
        name: 'randomRange',
        newName: 'randomRange',
        target: math,
        targetName: 'math'
    },
    {
        name: 'randomRangeInt',
        newName: 'randomRangeInt',
        target: math,
        targetName: 'math'
    },
    {
        name: 'pseudoRandom',
        newName: 'pseudoRandom',
        target: math,
        targetName: 'math'
    },
    {
        name: 'pseudoRandomRangeInt',
        newName: 'pseudoRandomRangeInt',
        target: math,
        targetName: 'math'
    },
    {
        name: 'nextPow2',
        newName: 'nextPow2',
        target: math,
        targetName: 'math'
    },
    {
        name: 'repeat',
        newName: 'repeat',
        target: math,
        targetName: 'math'
    },
    {
        name: 'pingPong',
        newName: 'pingPong',
        target: math,
        targetName: 'math'
    },
    {
        name: 'inverseLerp',
        newName: 'inverseLerp',
        target: math,
        targetName: 'math'
    },
]);

cc.vmath = vmath;

export { vmath };

// Scheduler

replaceProperty(Scheduler.prototype, 'Scheduler.prototype', [
    {
        name: 'enableForTarget',
        newName: 'enableForTarget',
        target: Scheduler,
        targetName: 'Scheduler'
    }
]);