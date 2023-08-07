/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

import { System, cclegacy } from '../../core';
import { Director, director } from '../../game/director';
import { uiRendererManager } from './ui-renderer-manager';
import { uiLayoutManager } from './ui-layout-manager';
import { Batcher2D } from '../renderer/batcher-2d';

class FunctionCallbackInfo {
    public callback: AnyFunction;
    public target: any;
    constructor (callback: AnyFunction, target: any) {
        this.callback = callback;
        this.target = target;
    }
}

export class UISystem extends System {
    private _batcher: Batcher2D | null = null;
    private _extraPartBeforeUpdate: FunctionCallbackInfo[] = [];

    /**
     * @en The draw batch manager for 2D UI, for engine internal usage, user do not need to use this.
     * @zh 2D UI 渲染合批管理器，引擎内部使用，用户无需使用此接口
     * @engineInternal
     */
    public get batcher2D (): Batcher2D {
        return this._batcher as Batcher2D;
    }

    public init (): void {
        if (!this._batcher) {
            this._batcher = new Batcher2D(director.root!);
        }
        director.on(Director.EVENT_AFTER_SCENE_LAUNCH, this.afterSceneLaunch, this);
        director.on(Director.EVENT_BEFORE_UPDATE, this.beforeUpdate, this);
        director.on(Director.EVENT_AFTER_UPDATE, this.afterUpdate, this);
        director.on(Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
        director.on(Director.EVENT_UPDATE_UI, this.tick, this);
        director.on(Director.EVENT_BEFORE_COMMIT, this.render, this);
        director.on(Director.EVENT_AFTER_DRAW, this.afterDraw, this);
    }

    public destroy (): void {
        if (this._batcher) {
            this._batcher.destroy();
            this._batcher = null;
        }
    }

    public afterSceneLaunch (): void {
        cclegacy._widgetManager.refreshScene();
    }

    public beforeUpdate (): void {
        cclegacy._widgetManager.refreshScene();
    }

    public afterUpdate (): void {

    }

    public tick (): void {
        uiLayoutManager.updateAllDirtyLayout();
        uiRendererManager.updateAllDirtyRenderers();
    }

    public render (): void {
        if (this._batcher) {
            this._batcher.update();
            this._batcher.uploadBuffers();
        }
    }

    public afterDraw (): void {
        if (this._batcher) {
            this._batcher.reset();
        }
    }

    private beforeDraw (): void {
        for (let i = 0, length = this._extraPartBeforeUpdate.length; i < length; i++) {
            const info = this._extraPartBeforeUpdate[i];
            const callback = info.callback;
            const target = info.target;
            callback.call(target);
        }
        this._extraPartBeforeUpdate.length = 0;
    }

    public addCallbackToBeforeUpdate (callback: AnyFunction, target: any): void {
        this._extraPartBeforeUpdate.push(new FunctionCallbackInfo(callback, target));
    }
}

export const uiSystem = new UISystem();
director.registerSystem('ui-system', uiSystem, 0);
cclegacy.internal.uiSystem = uiSystem;
