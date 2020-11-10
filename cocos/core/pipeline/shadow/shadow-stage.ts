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
 * @module pipeline.forward
 */

import { ccclass } from 'cc.decorator';
import { Color, Rect, Framebuffer } from '../../gfx';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardStagePriority } from '../forward/enum';
import { RenderShadowMapBatchedQueue } from '../render-shadow-map-batched-queue';
import { ForwardPipeline } from '../forward/forward-pipeline';
import { SetIndex, UBOShadow } from '../define';

const colors: Color[] = [ new Color(1, 1, 1, 1) ];

/**
 * @en Shadow map render stage
 * @zh 阴影渲染阶段。
 */
@ccclass('ShadowStage')
export class ShadowStage extends RenderStage {
    /**
     * @en A common initialization info for shadow map render stage
     * @zh 一个通用的 ShadowStage 的初始化信息对象
     */
    public static initInfo: IRenderStageInfo = {
        name: 'ShadowStage',
        priority: ForwardStagePriority.FORWARD,
        tag: 0
    };

    /**
     * @en Sets the frame buffer for shadow map
     * @zh 设置阴影渲染的 FrameBuffer
     * @param shadowFrameBuffer
     */
    public setShadowFrameBuffer (shadowFrameBuffer: Framebuffer) {
        this._shadowFrameBuffer = shadowFrameBuffer;
    }

    private _additiveShadowQueue: RenderShadowMapBatchedQueue;
    private _shadowFrameBuffer: Framebuffer | null = null;
    private _renderArea = new Rect();

    constructor () {
        super();
        this._additiveShadowQueue = new RenderShadowMapBatchedQueue();
    }

    public destroy () {
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        const shadowInfo = pipeline.shadows;
        this._additiveShadowQueue.clear(pipeline.descriptorSet.getBuffer(UBOShadow.BINDING));

        if (view.camera.scene?.mainLight) {
            const shadowObjects = pipeline.shadowObjects;
            let m = 0; let p = 0;
            for (let i = 0; i < shadowObjects.length; ++i) {
                const ro = shadowObjects[i];
                const subModels = ro.model.subModels;
                for (m = 0; m < subModels.length; m++) {
                    const passes = subModels[m].passes;
                    for (p = 0; p < passes.length; p++) {
                        this._additiveShadowQueue.add(ro, m, p);
                    }
                }
            }
        }

        const camera = view.camera;

        const cmdBuff = pipeline.commandBuffers[0];

        const vp = camera.viewport;
        const shadowMapSize = shadowInfo.size;
        this._renderArea!.x = vp.x * shadowMapSize.x;
        this._renderArea!.y = vp.y * shadowMapSize.y;
        this._renderArea!.width =  vp.width * shadowMapSize.x * pipeline.shadingScale;
        this._renderArea!.height = vp.height * shadowMapSize.y * pipeline.shadingScale;

        const device = pipeline.device;
        const renderPass = this._shadowFrameBuffer!.renderPass;

        cmdBuff.beginRenderPass(renderPass, this._shadowFrameBuffer!, this._renderArea!,
            colors, camera.clearDepth, camera.clearStencil);

        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, pipeline.descriptorSet);

        this._additiveShadowQueue.recordCommandBuffer(device, renderPass!, cmdBuff);

        cmdBuff.endRenderPass();
    }
}
