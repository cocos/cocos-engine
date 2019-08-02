/**
 * @hidden
 */

import { deprecatedWrapper, replaceProperty, removeProperty, markAsWarning } from './deprecated';
import { math } from './core';

const vmath = {};
deprecatedWrapper({
    oldTarget: vmath,
    oldPrefix: 'vmath',
    newTarget: math,
    newPrefix: 'math',
    pairs: [
        ['approx', 'approx'],
        ['EPSILON', 'EPSILON'],
        ['equals', 'equals'],
        ['clamp', 'clamp'],
        ['clamp01', 'clamp01'],
        ['lerp', 'lerp'],
        ['toRadian', 'toRadian'],
        ['toDegree', 'toDegree'],
        ['random', 'random'],
        ['randomRange', 'randomRange'],
        ['randomRangeInt', 'randomRangeInt'],
        ['pseudoRandom', 'pseudoRandom'],
        ['pseudoRandomRangeInt', 'pseudoRandomRangeInt'],
        ['nextPow2', 'nextPow2'],
        ['repeat', 'repeat'],
        ['pingPong', 'pingPong'],
        ['inverseLerp', 'inverseLerp'],
        ['vec2', 'Vec2'],
        ['vec3', 'Vec3'],
        ['vec4', 'Vec4'],
        ['quat', 'Quat'],
        ['mat3', 'Mat3'],
        ['mat4', 'Mat4'],
        ['color4', 'Color'],
        ['rect', 'Rect'],
    ],
});

// replaceProperty(vmath, 'vmath', [
//     {
//         name: 'vec2',
//         newName: 'Vec2',
//         target: math,
//         targetName: 'math',
//         'logTimes': 1
//     },
//     {
//         name: 'EPSILON',
//         target: math,
//         targetName: 'math',
//         'logTimes': 2
//     },
//     {
//         name: 'equals',
//         target: math,
//         targetName: 'math',
//         'logTimes': 3
//     }
// ]);

// removeProperty(vmath, 'vmath', [
//     {
//         'name': 'random'
//     }
// ]);

// markAsWarning(math, 'math', [
//     {
//         'name': 'toRadian'
//     }
// ]);

cc.vmath = vmath;

export { vmath };