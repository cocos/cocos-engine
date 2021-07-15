/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 * @module ui
 */

import { ccclass, disallowMultiple, executeInEditMode, executionOrder, requireComponent } from 'cc.decorator';
import { Batcher2D } from '../renderer/batcher-2d';
import { Component } from '../../core/components/component';
import { UITransform } from './ui-transform';
import { Node } from '../../core/scene-graph';
import { Stage } from '../renderer/stencil-manager';

/**
 * @en Legacy 2D base class for rendering component, please use [[Renderable2D]] instead.
 * This component will setup [[NodeUIProperties.uiComp]] in its owner [[Node]]
 * @zh 旧的 2D 渲染组件基类，请使用 [[Renderable2D]] 替代。
 * 这个组件会设置 [[Node]] 上的 [[NodeUIProperties.uiComp]]。
 * @deprecated
 */
@ccclass('cc.UIComponent')
@requireComponent(UITransform)
@executionOrder(110)
@disallowMultiple
@executeInEditMode
export class UIComponent extends Component {
    protected _lastParent: Node | null = null;

    private _isRender2D = false;
    get isRender2D () {
        return this._isRender2D;
    }

    public __preload () {
        this.node._uiProps.uiComp = this;
    }

    public onEnable () {
    }

    public onDisable () {

    }

    public onDestroy () {
        if (this.node._uiProps.uiComp === this) {
            this.node._uiProps.uiComp = null;
        }
    }

    /**
     * @en Render data submission procedure, it update and assemble the render data to 2D data buffers before all children submission process.
     * Usually called each frame when the ui flow assemble all render data to geometry buffers.
     * Don't call it unless you know what you are doing.
     * @zh 渲染数据组装程序，这个方法会在所有子节点数据组装之前更新并组装当前组件的渲染数据到 UI 的顶点数据缓冲区中。
     * 一般在 UI 渲染流程中调用，用于组装所有的渲染数据到顶点数据缓冲区。
     * 注意：不要手动调用该函数，除非你理解整个流程。
     */
    public updateAssembler (render: Batcher2D) {
    }

    /**
     * @en Post render data submission procedure, it's executed after assembler updated for all children.
     * It may assemble some extra render data to the geometry buffers, or it may only change some render states.
     * Don't call it unless you know what you are doing.
     * @zh 后置渲染数据组装程序，它会在所有子节点的渲染数据组装完成后被调用。
     * 它可能会组装额外的渲染数据到顶点数据缓冲区，也可能只是重置一些渲染状态。
     * 注意：不要手动调用该函数，除非你理解整个流程。
     */
    public postUpdateAssembler (render: Batcher2D) {
    }

    public markForUpdateRenderData (enable = true) {
    }

    public stencilStage : Stage = Stage.DISABLED;
}
