/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

import { ccclass, help, menu, executionOrder, visible, override } from 'cc.decorator';
import { UIRenderer } from '../framework/ui-renderer';
import { IBatcher } from '../renderer/i-batcher';
import { DrawBatch2D } from '../renderer/draw-batch';
import { Color, warnID } from '../../core';
import { StaticVBAccessor } from '../renderer/static-vb-accessor';
import { director } from '../../game';
import type { Batcher2D } from '../renderer/batcher-2d';

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
 *
 * @deprecated Since v3.4.1, We have adopted a new rendering batching policy in v3.4.1,
 * which will result in an effective performance improvement for normal dynamic batching components,
 * so manual management with the UIStaticBatch component is no longer recommended and will be removed in the future
 */
@ccclass('cc.UIStaticBatch')
@help('i18n:cc.UIStaticBatch')
@menu('2D/UIStaticBatch')
@executionOrder(110)
export class UIStaticBatch extends UIRenderer {
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

    get drawBatchList (): DrawBatch2D[] {
        return this._uiDrawBatchList;
    }

    protected _init = false;
    protected _bufferAccessor: StaticVBAccessor | null = null;
    protected _dirty = true;
    private _uiDrawBatchList: DrawBatch2D[] = [];

    public postUpdateAssembler (render: IBatcher): void {
        // if (this._dirty) {
        //     this._dirty = false;
        //     this._init = true;
        //     this.node._static = true;
        //     render.endStaticBatch();
        //     this._bufferAccessor!.uploadBuffers();
        // }
        // render.currIsStatic = false;
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
    public markAsDirty (): void {

        // this.node._static = false;
        // this._dirty = true;
        // this._init = false;
        // this._clearData();
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _requireDrawBatch (): DrawBatch2D {
        const batch = new DrawBatch2D();
        batch.isStatic = true;
        this._uiDrawBatchList.push(batch);
        return batch;
    }

    protected _clearData (): void {
        if (this._bufferAccessor) {
            this._bufferAccessor.reset();

            const ui = this._getBatcher()!;
            for (let i = 0; i < this._uiDrawBatchList.length; i++) {
                const element = this._uiDrawBatchList[i];
                element.destroy(ui);
            }
        }

        this._uiDrawBatchList.length = 0;
        this._init = false;
    }

    protected _getBatcher (): Batcher2D | null {
        if (director.root && director.root.batcher2D) {
            return director.root.batcher2D;
        }
        warnID(9301);
        return null;
    }
}
