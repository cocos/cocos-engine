/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

import { removeProperty, markAsWarning, replaceProperty } from '../core/utils/x-deprecated';
import { Director, director } from './director';
import { game } from './game';
import { assetManager } from '../asset/asset-manager';
import type { ISceneInfo } from '../asset/asset-manager/config';

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

replaceProperty(director, 'director', [
    {
        name: '_getSceneUuid',
        targetName: 'assetManager.main',
        newName: 'getSceneInfo',
        customFunction: (sceneName) => {
            if (assetManager.main) {
                return assetManager.main.getSceneInfo(sceneName)?.uuid;
            }
            return '';
        },
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

replaceProperty(game, 'game', [
    {
        name: '_sceneInfos',
        targetName: 'assetManager.main',
        newName: 'getSceneInfo',
        customGetter: () => {
            const scenes: ISceneInfo[] = [];
            if (assetManager.main) {
                assetManager.main.config.scenes.forEach((val) => {
                    scenes.push(val);
                });
            }
            return scenes;
        },
    },
]);
