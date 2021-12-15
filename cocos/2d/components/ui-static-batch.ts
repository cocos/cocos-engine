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

import { ccclass, help, menu, executionOrder, visible, override } from 'cc.decorator';
import { UI_GPU_DRIVEN } from 'internal:constants';
import { Renderable2D } from '../framework/renderable-2d';
import { IBatcher } from '../renderer/i-batcher';
import { MeshBuffer } from '../renderer/mesh-buffer';
import { DrawBatch2D } from '../renderer/draw-batch';
import { director, Color, warnID } from '../../core';
import { vfmtPosUvColor } from '../renderer/vertex-format';
import { BlendFactor } from '../../core/gfx';

/**
 * @en
 * Static batch component of UI.
 * This component is placed on the root node of all node objects that need to be batch.
 * Only sprites and label participate in the batch.
 * Static batch must be enabled manually, otherwise dynamic batch is still used.
 * Note: Do not place mask, Graphics, and objects such as UI models or particles under child nodes,
 * otherwise rendering will be skipped after static batching is enabled.
 *
 * @zh
 * UI 静态合批组件。
 * 该组件放在所有需要被静态合批的节点对象的根节点上，子节点放置对象必须是精灵和文本，其余对象不参与静态合批。
 * 用户必须通过手动方式启用收集静态合批数据[[markAsDirty]]，否则合批方式仍然采用动态合批（采集数据的流程相同）。此后渲染的内容是采用收集到的合批渲染数据，子节点的任何修改将不再有效。
 * 注意：子节点下不要放置 Mask，Graphics，以及 UI 模型或者粒子之类对象，否则会在启用完静态合批后跳过渲染。
 */
@ccclass('cc.UIStaticBatch')
@help('i18n:cc.UIStaticBatch')
@menu('2D/UIStaticBatch')
@executionOrder(110)
export class UIStaticBatch extends Renderable2D {
    @override
    @visible(false)
    get color (): Readonly<Color> {
        return this._color;
    }

    set color (value) {
        if (this._color === value) {
            return;
        }

        this._color.set(value);
    }

    get drawBatchList () {
        return this._uiDrawBatchList;
    }

    protected _init = false;
    protected _meshBuffer: MeshBuffer | null = null;
    protected _dirty = true;
    private _lastMeshBuffer: MeshBuffer | null = null;
    private _uiDrawBatchList: DrawBatch2D[] = [];

    public onLoad () {
        const ui = this._getBatcher();
        if (!ui) {
            return;
        }
        if (UI_GPU_DRIVEN) return;

        const attr = vfmtPosUvColor;
        const buffer = new MeshBuffer(ui);
        buffer.initialize(attr, this._arrivalMaxBuffer.bind(this));
        this._meshBuffer = buffer;
    }

    public onDestroy () {
        super.onDestroy();

        this._clearData();
        if (this._meshBuffer) {
            this._meshBuffer.destroy();
            this._meshBuffer = null;
        }
    }

    public updateAssembler (render: IBatcher) {
        if (UI_GPU_DRIVEN) return;
        render.currIsStatic = true;
        if (this._dirty) {
            render.finishMergeBatches();
            this._lastMeshBuffer = render.currBufferBatch;
            render.currBufferBatch = this._meshBuffer;
            render.currStaticRoot = this;
        }

        if (this._init) {
            render.finishMergeBatches();
            render.commitStaticBatch(this);
        }
    }

    public postUpdateAssembler (render: IBatcher) {
        if (UI_GPU_DRIVEN) return;
        if (this._dirty) {
            render.finishMergeBatches();
            render.currBufferBatch = this._lastMeshBuffer;
            render.currStaticRoot = null;
            this._dirty = false;
            this._init = true;
            this.node._static = true;

            this._meshBuffer!.uploadBuffers();
        }
        render.currIsStatic = false;
    }

    /**
     * @en
     * Recollect data tags.
     * The render data will be recollected during the render phase of the current frame, and the next frame will be rendered using fixed data.
     * Note: 尽量不要频繁调用此接口, 会有一定内存损耗.
     *
     * @zh
     * 重新采集数据标记，会在当前帧的渲染阶段重新采集渲染数据，下一帧开始将会使用固定数据进行渲染。
     * 注意：尽量不要频繁调用此接口，因为会清空原先存储的 ia 数据重新采集，会有一定内存损耗。
     */
    public markAsDirty () {
        if (UI_GPU_DRIVEN) return;
        if (!this._getBatcher()) {
            return;
        }

        this.node._static = false;
        this._dirty = true;
        this._init = false;

        this._clearData();
    }

    /**
     * @deprecated_to_user
     */
    public _requireDrawBatch () {
        const batch = new DrawBatch2D();
        batch.isStatic = true;
        this._uiDrawBatchList.push(batch);
        return batch;
    }

    protected _clearData () {
        if (this._meshBuffer) {
            this._meshBuffer.reset();

            const ui = this._getBatcher()!;
            for (let i = 0; i < this._uiDrawBatchList.length; i++) {
                const element = this._uiDrawBatchList[i];
                element.destroy(ui);
            }
        }

        this._uiDrawBatchList.length = 0;
        this._init = false;
    }

    protected _getBatcher () {
        if (director.root && director.root.batcher2D) {
            return director.root.batcher2D;
        }

        warnID(9301);
        return null;
    }

    protected _arrivalMaxBuffer () {
        const ui = this._getBatcher();
        if (ui) {
            ui.autoMergeBatches();
        }
        warnID(9300);
    }
}
