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

import {
    ccclass, serializable,
} from 'cc.decorator';
import { scene } from '../renderer';
import { Layers } from '../scene-graph/layers';
import { Renderer } from './renderer';

/**
 * @en Base class for all rendering components containing model.
 * @zh 所有包含 model 的渲染组件基类。
 */
@ccclass('cc.ModelRenderer')
export class ModelRenderer extends Renderer {
    @serializable
    protected _visFlags = Layers.Enum.NONE;

    /**
     * @zh 组件所属层，影响该组件下的所有 model 的 visFlags
     * @en The layer of the current component, which affects all the visFlags of the models belonging to this component.
     */
    get visibility () {
        return this._visFlags;
    }

    set visibility (val) {
        this._visFlags = val;
        this._onVisibilityChange(val);
    }

    protected _models: scene.Model[] = [];

    /**
     * @zh 收集组件中的 models
     * @en Collect the models in this component.
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _collectModels (): scene.Model[] {
        return this._models;
    }

    protected _attachToScene () {
    }

    protected _detachFromScene () {
    }

    protected _onVisibilityChange (val) {
    }
}
