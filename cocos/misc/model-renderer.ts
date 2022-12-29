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

import {
    ccclass, serializable,
} from 'cc.decorator';
import { scene } from '../render-scene';
import { Layers } from '../scene-graph/layers';
import { Renderer } from './renderer';

/**
 * @en Base class for all rendering components containing model.
 * @zh 所有包含 model 的渲染组件基类。
 */
@ccclass('cc.ModelRenderer')
export class ModelRenderer extends Renderer {
    /**
     * @en The visibility which will be applied to the committed models.
     * @zh 应用于所有提交渲染的 Model 的可见性
     */
    get visibility () {
        return this._visFlags;
    }

    set visibility (val) {
        this._visFlags = val;
        this._onVisibilityChange(val);
    }

    /**
     * @en The priority which will be applied to the committed models.(Valid only in transparent queues)
     * @zh 应用于所有提交渲染的 Model 的排序优先级（只在半透明渲染队列中起效）
     */
    get priority () {
        return this._priority;
    }

    set priority (val) {
        if (val === this._priority) return;
        this._priority = val;
        this._updatePriority();
    }

    @serializable
    protected _visFlags = Layers.Enum.NONE;
    protected _models: scene.Model[] = [];
    protected _priority = 0;

    /**
     * @zh 收集组件中的 models
     * @en Collect the models in this component.
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _collectModels (): scene.Model[] {
        return this._models;
    }

    protected onEnable () {
        this._updatePriority();
    }

    protected _attachToScene () {
    }

    protected _detachFromScene () {
    }

    protected _onVisibilityChange (val) {
    }

    protected _updatePriority () {
        if (this._models.length > 0) {
            for (let i = 0; i < this._models.length; i++) {
                this._models[i].priority = this._priority;
            }
        }
    }
}
