/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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
        customFunction: (sceneName): string | undefined => {
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
        customGetter: (): ISceneInfo[] => {
            const scenes: ISceneInfo[] = [];
            if (assetManager.main) {
                assetManager.main.config.scenes.forEach((val): void => {
                    scenes.push(val);
                });
            }
            return scenes;
        },
    },
]);
