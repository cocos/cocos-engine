/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { Color, Rect } from '../../gfx';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardStagePriority } from '../forward/enum';
import { UIFlow } from './ui-flow';
import { ForwardPipeline } from '../forward/forward-pipeline';
import { RenderQueueDesc, RenderQueueSortMode } from '../pipeline-serialization';
import { getPhaseID } from '../pass-phase';
import { opaqueCompareFn, RenderQueue, transparentCompareFn } from '../render-queue';
import { IRenderPass, SetIndex } from '../define';

const colors: Color[] = [];

/**
 * @en The UI render stage
 * @zh UI渲阶段。
 */
@ccclass('UIStage')
export class UIStage extends RenderStage {
    public static initInfo: IRenderStageInfo = {
        name: 'UIStage',
        priority: ForwardStagePriority.UI,
        tag: 0,
        renderQueues: [
            {
                isTransparent: true,
                stages: ['default'],
                sortMode: RenderQueueSortMode.BACK_TO_FRONT,
            }
        ]
    };

    @type([RenderQueueDesc])
    @serializable
    @displayOrder(2)
    protected renderQueues: RenderQueueDesc[] = [];
    protected _renderQueues: RenderQueue[] = [];

    private _renderArea = new Rect();

    public initialize (info: IRenderStageInfo): boolean {
        super.initialize(info);
        if (info.renderQueues) {
            this.renderQueues = info.renderQueues;
        }
        return true;
    }
    public activate (pipeline: ForwardPipeline, flow: UIFlow) {
        super.activate(pipeline, flow);
        for (let i = 0; i < this.renderQueues.length; i++) {
            let phase = 0;
            for (let j = 0; j < this.renderQueues[i].stages.length; j++) {
                phase |= getPhaseID(this.renderQueues[i].stages[j]);
            }
            let sortFunc: (a: IRenderPass, b: IRenderPass) => number = opaqueCompareFn;
            switch (this.renderQueues[i].sortMode) {
                case RenderQueueSortMode.BACK_TO_FRONT:
                    sortFunc = transparentCompareFn;
                    break;
                case RenderQueueSortMode.FRONT_TO_BACK:
                    sortFunc = opaqueCompareFn;
                    break;
            }

            this._renderQueues[i] = new RenderQueue({
                isTransparent: this.renderQueues[i].isTransparent,
                phases: phase,
                sortFunc,
            });
        }
    }

    public destroy () {
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        const isHDR = pipeline.isHDR;
        pipeline.isHDR = false;

        const device = pipeline.device;
        this._renderQueues[0].clear();

        const renderObjects = pipeline.renderObjects;
        for (let i = 0; i < renderObjects.length; i++) {
            const ro = renderObjects[i];
            const subModels = ro.model.subModels;
            for (let j = 0; j < subModels.length; j++) {
                const passes = subModels[j].passes;
                for (let k = 0; k < passes.length; k++) {
                    this._renderQueues[0].insertRenderPass(ro, j, k);
                }
            }
        }
        this._renderQueues[0].sort();

        const camera = view.camera!;
        const vp = camera.viewport;
        // render area is not oriented
        const w = view.window.hasOnScreenAttachments && device.surfaceTransform % 2 ? camera.height : camera.width;
        const h = view.window.hasOnScreenAttachments && device.surfaceTransform % 2 ? camera.width : camera.height;
        this._renderArea!.x = vp.x * w;
        this._renderArea!.y = vp.y * h;
        this._renderArea!.width = vp.width * w;
        this._renderArea!.height = vp.height * h;

        colors[0] = camera.clearColor as Color;

        const cmdBuff = pipeline.commandBuffers[0];

        const framebuffer = view.window.framebuffer;
        const renderPass = framebuffer.colorTextures[0] ? framebuffer.renderPass : pipeline.getRenderPass(camera.clearFlag);

        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea!,
            colors, camera.clearDepth, camera.clearStencil);

        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, pipeline.descriptorSet);

        this._renderQueues[0].recordCommandBuffer(device, renderPass, cmdBuff);

        cmdBuff.endRenderPass();

        pipeline.isHDR = isHDR;
    }
}
