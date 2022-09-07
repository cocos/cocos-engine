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

import { ccclass, disallowMultiple, editable, menu, range, serializable, type } from 'cc.decorator';
import { clamp } from '../core/math';
import { SortingLayers } from './sorting-layers';
import { Component } from '../core/components/component';
import { ModelRenderer } from '../core/components/model-renderer';

const MAX_INT16 = (1 << 15) - 1;
const MIN_INT16 = -1 << 15;

@ccclass('cc.Sorting')
@menu('Sorting/Sorting')
@disallowMultiple
export class Sorting extends Component {
    /**
     * @zh 组件所属排序层 id，影响组件的渲染排序。
     * @en The sorting layer id of the component, which affects the rendering order of the component.
     */
    // Todo,how to show on inspector
    @editable
    @type(SortingLayers.Enum)
    get sortingLayer () {
        return this._sortingLayer;
    }
    set sortingLayer (val) {
        if (val === this._sortingLayer || !SortingLayers.isLayerValid(val)) return;
        this._sortingLayer = val;
        this._updateSortingPriority();
    }

    /**
     * @zh 组件在当前排序层中的顺序。
     * @en Model Renderer's order within a sorting layer.
     */
    @range([MIN_INT16, MAX_INT16, 1])
    get sortingOrder () {
        return this._sortingOrder;
    }
    set sortingOrder (val) {
        if (val === this._sortingOrder) return;
        this._sortingOrder = clamp(val, MIN_INT16, MAX_INT16);
        this._updateSortingPriority();
    }

    @serializable
    protected _sortingLayer = SortingLayers.Enum.default; // Actually saved id
    @serializable
    protected _sortingOrder = 0;

    private _modelRenderer: ModelRenderer | null = null;

    protected __preload () {
        this._modelRenderer = this.getComponent('cc.ModelRenderer') as ModelRenderer;
        if (!this._modelRenderer) {
            console.warn(`node '${this.node && this.node.name}' doesn't have any ModelRenderer component`);
        }
    }

    protected onEnable () {
        if (!this._modelRenderer) {
            this._modelRenderer = this.getComponent('cc.ModelRenderer') as ModelRenderer;
            if (!this._modelRenderer) {
                console.warn(`node '${this.node && this.node.name}' doesn't have any ModelRenderer component`);
            }
        }
        this._updateSortingPriority();
    }

    protected onDestroy () {
        this._modelRenderer = null;
    }

    protected _updateSortingPriority () {
        const sortingLayerValue = SortingLayers.getLayerIndex(this._sortingLayer);
        const sortingPriority = SortingLayers.getSortingPriority(sortingLayerValue, this._sortingOrder);
        if (this._modelRenderer) {
            this._modelRenderer.priority = sortingPriority;
        }
    }
}
