/*
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

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

import { ccclass, disallowMultiple, editable, executeInEditMode, help, menu, range, serializable, type, requireComponent } from 'cc.decorator';
import { clamp } from '../core/math';
import { SortingLayers } from './sorting-layers';
import { Component } from '../scene-graph/component';
import { warnID } from '../core/platform/debug';
import { UIRenderer } from '../2d/framework/ui-renderer';
import { _setSorting2DCount } from '../2d/renderer/batcher-2d';

const MAX_INT16 = (1 << 15) - 1;
const MIN_INT16 = -1 << 15;

let sorting2DCount = 0;

/**
 * @en
 * 2D Render sort component.
 *
 * @zh
 * 2D 渲染排序组件。
 */
@ccclass('cc.Sorting2D')
@menu('Sorting/Sorting2D')
@help('i18n:cc.Sorting2D')
@disallowMultiple
@executeInEditMode
@requireComponent(UIRenderer)
export class Sorting2D extends Component {
    private _isSorting2DEnabled = false;

    constructor () {
        super();
    }

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

    private _uiRenderer: UIRenderer | null = null;

    protected override __preload (): void {
        this._uiRenderer = this.getComponent(UIRenderer);
        if (!this._uiRenderer) {
            warnID(16300, this.node.name);
        }
    }

    protected override onEnable (): void {
        this._isSorting2DEnabled = true;
        this._updateSortingPriority();
        ++sorting2DCount;
        _setSorting2DCount(sorting2DCount);
    }

    protected override onDisable (): void {
        this._isSorting2DEnabled = false;
        this._updateSortingPriority();
        --sorting2DCount;
        _setSorting2DCount(sorting2DCount);
    }

    protected _updateSortingPriority (): void {
        const uiRenderer = this._uiRenderer;
        if (uiRenderer && uiRenderer.isValid) {
            if (this._isSorting2DEnabled) {
                const sortingLayerValue = SortingLayers.getLayerIndex(this._sortingLayer);
                const sortingPriority = SortingLayers.getSortingPriority(sortingLayerValue, this._sortingOrder);
                uiRenderer.priority = sortingPriority;
            } else {
                uiRenderer.priority = SortingLayers.getDefaultPriority();
            }
        }
    }
}
