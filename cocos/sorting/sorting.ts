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

import { ccclass, disallowMultiple, editable, executeInEditMode, help, menu, range, serializable, type } from 'cc.decorator';
import { clamp } from '../core/math';
import { SortingLayers } from './sorting-layers';
import { Component } from '../scene-graph/component';
import { ModelRenderer } from '../misc/model-renderer';
import { warnID } from '../core/platform/debug';

const MAX_INT16 = (1 << 15) - 1;
const MIN_INT16 = -1 << 15;

/**
 * @en
 * Render sort component. This component must be placed on a node with a [[MeshRenderer]] or [[SpriteRenderer]] component.
 *
 * @zh
 * 渲染排序组件。该组件必须放置在带有 [[MeshRenderer]] 或者 [[SpriteRenderer]] 组件的节点上。
 */
@ccclass('cc.Sorting')
@menu('Sorting/Sorting')
@help('i18n:cc.Sorting')
@disallowMultiple
@executeInEditMode
export class Sorting extends Component {
    /**
     * @zh 组件所属排序层 id，影响组件的渲染排序。
     * @en The sorting layer id of the component, which affects the rendering order of the component.
     */
    @editable
    @type(SortingLayers.Enum)
    get sortingLayer (): number {
        return this._sortingLayer;
    }
    set sortingLayer (val) {
        if (val === this._sortingLayer || !SortingLayers.isLayerValid(val)) return;
        this._sortingLayer = val;
        this._updateSortingPriority();
    }

    /**
     * @zh 组件在当前排序层中的顺序，在默认排序规则中，越小越先渲染。
     * @en Model Renderer's order within a sorting layer. In the default sorting rule, smaller values are rendered first.
     */
    @range([MIN_INT16, MAX_INT16, 1])
    get sortingOrder (): number {
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

    protected __preload (): void {
        this._modelRenderer = this.getComponent('cc.ModelRenderer') as ModelRenderer;
        if (!this._modelRenderer) {
            warnID(16301, this.node.name);
        }
        this._updateSortingPriority();
    }

    protected _updateSortingPriority (): void {
        const sortingLayerValue = SortingLayers.getLayerIndex(this._sortingLayer);
        const sortingPriority = SortingLayers.getSortingPriority(sortingLayerValue, this._sortingOrder);
        if (this._modelRenderer && this._modelRenderer.isValid) {
            this._modelRenderer.priority = sortingPriority;
        }
    }
}
