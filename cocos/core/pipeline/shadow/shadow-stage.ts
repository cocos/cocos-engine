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
import { Color, Rect, Framebuffer, DescriptorSet } from '../../gfx';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { ForwardStagePriority } from '../enum';
import { RenderShadowMapBatchedQueue } from '../render-shadow-map-batched-queue';
import { ForwardPipeline } from '../forward/forward-pipeline';
import { SetIndex } from '../define';
import { Light, LightType } from '../../renderer/scene/light';
import { ShadowFlow } from './shadow-flow';
import { Camera, CSMLevel, DirectionalLight } from '../../renderer/scene';
import { CSMLayerInfo, ShadowTransformInfo } from './csm-layers';

const colors: Color[] = [new Color(1, 1, 1, 1)];

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
        tag: 0,
    };

    /**
     * @en Sets the render shadow map info
     * @zh 设置阴影渲染信息
     * @param light
     * @param shadowFrameBuffer
     */
    public setUsage (globalDS: DescriptorSet, light: Light, shadowFrameBuffer: Framebuffer) {
        this._globalDS = globalDS;
        this._light = light;
        this._shadowFrameBuffer = shadowFrameBuffer;
    }

    /**
     * @en Sets the CSM layer
     * @zh 设置 CSM 层级
     * @param light
     * @param shadowFrameBuffer
     */
    public setLayer (layer: ShadowTransformInfo) {
        this._layer = layer;
    }

    private _additiveShadowQueue!: RenderShadowMapBatchedQueue;
    private _shadowFrameBuffer: Framebuffer | null = null;
    private _renderArea = new Rect();
    private _light: Light | null = null;
    private _globalDS: DescriptorSet | null = null;
    private _layer: ShadowTransformInfo | null = null;

    public destroy () {
        this._shadowFrameBuffer = null;
        this._globalDS = null;
        this._light = null;

        this._additiveShadowQueue?.clear();
    }

    public clearFramebuffer (camera: Camera) {
        if (!this._light || !this._shadowFrameBuffer) { return; }
        colors[0].w = camera.clearColor.w;
        const pipeline = this._pipeline as ForwardPipeline;
        const cmdBuff = pipeline.commandBuffers[0];
        const renderPass = this._shadowFrameBuffer.renderPass;

        cmdBuff.beginRenderPass(renderPass, this._shadowFrameBuffer, this._renderArea,
            colors, camera.clearDepth, camera.clearStencil);
        cmdBuff.endRenderPass();
    }

    public render (camera: Camera) {
        const pipeline = this._pipeline;
        const pipelineSceneData = pipeline.pipelineSceneData;
        const shadowInfo = pipelineSceneData.shadows;
        const descriptorSet = this._globalDS!;
        const cmdBuff = pipeline.commandBuffers[0];

        if (!this._light || !this._shadowFrameBuffer) { return; }
        this._pipeline.pipelineUBO.updateShadowUBOLight(descriptorSet, this._light);
        if (this._light.type === LightType.DIRECTIONAL) {
            this._additiveShadowQueue.gatherDirLightPasses(camera, this._light, this._layer!, cmdBuff);
        } else {
            this._additiveShadowQueue.gatherLightPasses(camera, this._light, cmdBuff);
        }

        const shadowMapSize = shadowInfo.size;
        switch (this._light.type) {
        case LightType.DIRECTIONAL: {
            const mainLight = this._light as DirectionalLight;
            if (mainLight.shadowFixedArea || mainLight.shadowCSMLevel === CSMLevel.level_1) {
                this._renderArea.x = 0;
                this._renderArea.y = 0;
                this._renderArea.width = shadowMapSize.x;
                this._renderArea.height = shadowMapSize.y;
            } else {
                const level = 0;//(this._layer as CSMLayerInfo).level;
                this._renderArea.x = level % 2 * 0.5 * shadowMapSize.x;
                this._renderArea.y = (1 - Math.floor(level / 2)) * 0.5 * shadowMapSize.y;
                this._renderArea.width = 0.5 * shadowMapSize.x;
                this._renderArea.height = 0.5 * shadowMapSize.y;
            }
            break;
        }
        case LightType.SPOT: {
            this._renderArea.x = 0;
            this._renderArea.y = 0;
            this._renderArea.width = shadowMapSize.x;
            this._renderArea.height = shadowMapSize.y;
            break;
        }
        default:
        }

        const device = pipeline.device;
        const renderPass = this._shadowFrameBuffer.renderPass;

        cmdBuff.beginRenderPass(renderPass, this._shadowFrameBuffer, this._renderArea,
            colors, camera.clearDepth, camera.clearStencil);
        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, descriptorSet);

        this._additiveShadowQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        cmdBuff.endRenderPass();
    }

    public activate (pipeline: ForwardPipeline, flow: ShadowFlow) {
        super.activate(pipeline, flow);
        this._additiveShadowQueue = new RenderShadowMapBatchedQueue(pipeline);
    }
}
