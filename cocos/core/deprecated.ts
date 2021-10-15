/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @hidden
 */

import { replaceProperty, removeProperty, markAsWarning } from './utils/x-deprecated';
import * as math from './math';
import { Scheduler } from './scheduler';
import { legacyCC } from './global-exports';
import { SubModel } from './renderer/scene/submodel';
import { Root } from './root';
import { game } from './game';
import System from './components/system';
import { Director } from './director';

// VMATH

const vmath = {};
replaceProperty(vmath, 'vmath', [
    {
        name: 'vec2',
        newName: 'Vec2',
        target: math,
        targetName: 'math',
    },
    {
        name: 'vec3',
        newName: 'Vec3',
        target: math,
        targetName: 'math',
    },
    {
        name: 'vec4',
        newName: 'Vec4',
        target: math,
        targetName: 'math',
    },
    {
        name: 'quat',
        newName: 'Quat',
        target: math,
        targetName: 'math',
    },
    {
        name: 'mat3',
        newName: 'Mat3',
        target: math,
        targetName: 'math',
    },    {
        name: 'mat4',
        newName: 'Mat4',
        target: math,
        targetName: 'math',
    },
    {
        name: 'color4',
        newName: 'Color',
        target: math,
        targetName: 'math',
    },
    {
        name: 'rect',
        newName: 'Rect',
        target: math,
        targetName: 'math',
    },
    {
        name: 'approx',
        newName: 'approx',
        target: math,
        targetName: 'math',
    },
    {
        name: 'EPSILON',
        newName: 'EPSILON',
        target: math,
        targetName: 'math',
    },
    {
        name: 'equals',
        newName: 'equals',
        target: math,
        targetName: 'math',
    },
    {
        name: 'clamp',
        newName: 'clamp',
        target: math,
        targetName: 'math',
    },
    {
        name: 'clamp01',
        newName: 'clamp01',
        target: math,
        targetName: 'math',
    },
    {
        name: 'lerp',
        newName: 'lerp',
        target: math,
        targetName: 'math',
    },
    {
        name: 'toRadian',
        newName: 'toRadian',
        target: math,
        targetName: 'math',
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
        targetName: 'math',
    },
    {
        name: 'randomRange',
        newName: 'randomRange',
        target: math,
        targetName: 'math',
    },
    {
        name: 'randomRangeInt',
        newName: 'randomRangeInt',
        target: math,
        targetName: 'math',
    },
    {
        name: 'pseudoRandom',
        newName: 'pseudoRandom',
        target: math,
        targetName: 'math',
    },
    {
        name: 'pseudoRandomRangeInt',
        newName: 'pseudoRandomRangeInt',
        target: math,
        targetName: 'math',
    },
    {
        name: 'nextPow2',
        newName: 'nextPow2',
        target: math,
        targetName: 'math',
    },
    {
        name: 'repeat',
        newName: 'repeat',
        target: math,
        targetName: 'math',
    },
    {
        name: 'pingPong',
        newName: 'pingPong',
        target: math,
        targetName: 'math',
    },
    {
        name: 'inverseLerp',
        newName: 'inverseLerp',
        target: math,
        targetName: 'math',
    },
]);

legacyCC.vmath = vmath;

export { vmath };

// Scheduler

replaceProperty(Scheduler.prototype, 'Scheduler.prototype', [
    {
        name: 'enableForTarget',
        newName: 'enableForTarget',
        target: Scheduler,
        targetName: 'Scheduler',
    },
]);

// replace Scheduler static property
replaceProperty(Scheduler, 'Scheduler', [
    {
        name: 'PRIORITY_SYSTEM',
        newName: 'System.Priority.SCHEDULER',
        customGetter () {
            return System.Priority.SCHEDULER;
        },
    },
]);

// remove Scheduler static property
removeProperty(Scheduler, 'Scheduler', [
    {
        name: 'PRIORITY_NON_SYSTEM',
        suggest: 'Use enum` System.Priority` instead',
    },
]);

// Render scene

replaceProperty(SubModel.prototype, 'SubModel.prototype', [
    {
        name: 'subMeshData',
        newName: 'subMesh',
    },
]);

removeProperty(SubModel.prototype, 'SubModel.prototype', [
    {
        name: 'getSubModel',
        suggest: 'Use `subModels[i]` instead',
    },
    {
        name: 'subModelNum',
        suggest: 'Use `subModels.length` instead',
    },
]);

// Root

replaceProperty(Root.prototype, 'Root.prototype', [
    {
        name: 'ui',
        newName: 'batcher2D',
    },
]);

// game

markAsWarning(game, 'game', [
    {
        name: 'collisionMatrix',
    },
    {
        name: 'groupList',
    },
]);

// Director

markAsWarning(Director.prototype, 'director', [
    {
        name: 'calculateDeltaTime',
    },
    {
        name: 'getDeltaTime',
        suggest: 'Use game.deltaTime instead',
    },
    {
        name: 'getTotalTime',
        suggest: 'Use game.totalTime instead',
    },
    {
        name: 'getCurrentTime',
        suggest: 'Use game.frameStartTime instead',
    },
]);

removeProperty(Director.prototype, 'director', [
    {
        name: 'setAnimationInterval',
        suggest: 'please use game.frameRate instead',
    },
    {
        name: 'getAnimationInterval',
        suggest: 'please use game.frameRate instead',
    },
    {
        name: 'getRunningScene',
        suggest: 'please use getScene instead',
    },
    {
        name: 'setDepthTest',
        suggest: 'please use camera API instead',
    },
    {
        name: 'setClearColor',
        suggest: 'please use camera API instead',
    },
    {
        name: 'getWinSize',
        suggest: 'please use view.getVisibleSize instead',
    },
    {
        name: 'getWinSizeInPixels',
    },
    {
        name: 'purgeCachedData',
        suggest: 'please use assetManager.releaseAll instead',
    },
    {
        name: 'convertToGL',
    },
    {
        name: 'convertToUI',
    },
]);
