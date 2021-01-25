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
import { PIPELINE_FLOW_SHADOW, UNIFORM_SHADOWMAP_BINDING } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { ForwardFlowPriority } from '../forward/enum';
import { ShadowStage } from './shadow-stage';
import { RenderPass, LoadOp, StoreOp,
    TextureLayout, Format, Texture, TextureType, TextureUsageBit, ColorAttachment,
    DepthStencilAttachment, RenderPassInfo, TextureInfo, FramebufferInfo } from '../../gfx';
import { RenderFlowTag } from '../pipeline-serialization';
import { ForwardPipeline } from '../forward/forward-pipeline';
import { ShadowType } from '../../renderer/scene/shadows';
import { Light } from '../../renderer/scene/light';
import { lightCollecting, shadowCollecting } from '../forward/scene-culling';
import { Vec2 } from '../../math';
import { Camera } from '../../renderer/scene';
import { legacyCC } from '../../global-exports';

/**
 * @en Shadow map render flow
 * @zh 阴影贴图绘制流程
 */
@ccclass('ShadowFlow')
export class ShadowFlow extends RenderFlow {
    /**
     * @en A common initialization info for shadow map render flow
     * @zh 一个通用的 ShadowFlow 的初始化信息对象
     */
    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_SHADOW,
        priority: ForwardFlowPriority.SHADOW,
        tag: RenderFlowTag.SCENE,
        stages: [],
    };

    private _shadowRenderPass: RenderPass|null = null;

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);
        if (this._stages.length === 0) {
            // add shadowMap-stages
            const shadowMapStage = new ShadowStage();
            shadowMapStage.initialize(ShadowStage.initInfo);
            this._stages.push(shadowMapStage);
        }
        return true;
    }

    public render (camera: Camera) {
        const pipeline = this._pipeline as ForwardPipeline;
        const shadowInfo = pipeline.shadows;
        if (!shadowInfo.enabled || shadowInfo.type !== ShadowType.ShadowMap) { return; }

        const validLights = lightCollecting(camera, shadowInfo.maxReceived);
        shadowCollecting(pipeline, camera);

        if (pipeline.shadowObjects.length === 0) {
            this.clearShadowMap(validLights, camera);
            return;
        }

        for (let l = 0; l < validLights.length; l++) {
            const light = validLights[l];

            if (!pipeline.shadowFrameBufferMap.has(light)) {
                this._initShadowFrameBuffer(pipeline, light);
            }
            const shadowFrameBuffer = pipeline.shadowFrameBufferMap.get(light);
            if (shadowInfo.shadowMapDirty) { this.resizeShadowMap(light, shadowInfo.size); }

            for (let i = 0; i < this._stages.length; i++) {
                const shadowStage = this._stages[i] as ShadowStage;
                shadowStage.setUsage(light, shadowFrameBuffer!);
                shadowStage.render(camera);
            }
        }

        // After the shadowMap rendering of all lights is completed,
        // restore the ShadowUBO data of the main light.
        pipeline.updateShadowUBO(camera);
    }

    public destroy () {
        super.destroy();
        const shadowFrameBuffers = Array.from((this._pipeline as ForwardPipeline).shadowFrameBufferMap.values());
        for (let i = 0; i < shadowFrameBuffers.length; i++) {
            const frameBuffer = shadowFrameBuffers[i];

            if (!frameBuffer) { continue; }
            const renderTargets = frameBuffer.colorTextures;
            for (let j = 0; j < renderTargets.length; j++) {
                const renderTarget = renderTargets[i];
                if (renderTarget) { renderTarget.destroy(); }
            }
            renderTargets.length = 0;

            const depth = frameBuffer.depthStencilTexture;
            if (depth) { depth.destroy(); }

            frameBuffer.destroy();
        }

        (this._pipeline as ForwardPipeline).shadowFrameBufferMap.clear();

        if (this._shadowRenderPass) { this._shadowRenderPass.destroy(); }
    }

    public _initShadowFrameBuffer  (pipeline: ForwardPipeline, light: Light) {
        const device = pipeline.device;
        const shadowMapSize = pipeline.shadows.size;

        if (!this._shadowRenderPass) {
            const colorAttachment = new ColorAttachment();
            colorAttachment.format = Format.RGBA8;
            colorAttachment.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment.storeOp = StoreOp.STORE;
            colorAttachment.sampleCount = 1;
            colorAttachment.beginLayout = TextureLayout.UNDEFINED;
            colorAttachment.endLayout = TextureLayout.PRESENT_SRC;

            const depthStencilAttachment = new DepthStencilAttachment();
            depthStencilAttachment.format = device.depthStencilFormat;
            depthStencilAttachment.depthLoadOp = LoadOp.CLEAR;
            depthStencilAttachment.depthStoreOp = StoreOp.DISCARD;
            depthStencilAttachment.stencilLoadOp = LoadOp.CLEAR;
            depthStencilAttachment.stencilStoreOp = StoreOp.DISCARD;
            depthStencilAttachment.sampleCount = 1;
            depthStencilAttachment.beginLayout = TextureLayout.UNDEFINED;
            depthStencilAttachment.endLayout = TextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;

            const renderPassInfo = new RenderPassInfo([colorAttachment], depthStencilAttachment);
            this._shadowRenderPass = device.createRenderPass(renderPassInfo);
        }

        const shadowRenderTargets: Texture[] = [];
        shadowRenderTargets.push(device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
            Format.RGBA8,
            shadowMapSize.x,
            shadowMapSize.y,
        )));

        const depth = device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
            device.depthStencilFormat,
            shadowMapSize.x,
            shadowMapSize.y,
        ));

        const shadowFrameBuffer = device.createFramebuffer(new FramebufferInfo(
            this._shadowRenderPass,
            shadowRenderTargets,
            depth,
        ));

        // Cache frameBuffer
        pipeline.shadowFrameBufferMap.set(light, shadowFrameBuffer);
    }

    private clearShadowMap (validLights: Light[], camera: Camera) {
        const pipeline = this._pipeline as ForwardPipeline;
        for (let l = 0; l < validLights.length; l++) {
            const light = validLights[l];
            const shadowFrameBuffer = pipeline.shadowFrameBufferMap.get(light);

            if (!pipeline.shadowFrameBufferMap.has(light)) { continue; }

            for (let i = 0; i < this._stages.length; i++) {
                const shadowStage = this._stages[i] as ShadowStage;
                shadowStage.setUsage(light, shadowFrameBuffer!);
                shadowStage.clearFramebuffer(camera);
            }
        }
    }

    private resizeShadowMap (light: Light, size: Vec2) {
        const width = size.x;
        const height = size.y;
        const pipeline = this._pipeline as ForwardPipeline;

        if (pipeline.shadowFrameBufferMap.has(light)) {
            const frameBuffer = pipeline.shadowFrameBufferMap.get(light);

            if (!frameBuffer) { return; }

            const renderTargets = frameBuffer.colorTextures;
            if (renderTargets && renderTargets.length > 0) {
                for (let j = 0; j < renderTargets.length; j++) {
                    const renderTarget = renderTargets[j];
                    if (renderTarget) { renderTarget.resize(width, height); }
                }
            }

            const depth = frameBuffer.depthStencilTexture;
            if (depth) { depth.resize(width, height); }

            const shadowRenderPass = frameBuffer.renderPass;
            frameBuffer.destroy();
            frameBuffer.initialize(new FramebufferInfo(
                shadowRenderPass,
                renderTargets,
                depth,
            ));
        }
    }
}
