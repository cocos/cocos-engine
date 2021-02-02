/*
 Copyright (c) Huawei Technologies Co., Ltd. 2020-2021.

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
 * @category pipeline
 */

import { ccclass } from 'cc.decorator';
import { Camera } from '../../renderer/scene';
import { PIPELINE_FLOW_LIGHTING, UNIFORM_LIGHTING_RESULTMAP_BINDING } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { DeferredFlowPriority } from './enum';
import { LightingStage } from './lighting-stage';
import { DeferredPipeline } from './deferred-pipeline';
import { RenderPipeline } from '../render-pipeline';
import { Framebuffer, RenderPass, LoadOp,
    StoreOp, TextureLayout, Format, Texture,
    TextureType, TextureUsageBit, ColorAttachment, DepthStencilAttachment, RenderPassInfo, TextureInfo, FramebufferInfo } from '../../gfx';
import { genSamplerHash, samplerLib } from '../../renderer/core/sampler-lib';
import { Address, Filter, SurfaceTransform } from '../../gfx/define';

/**
 * @en The lighting flow in lighting render pipeline
 * @zh 前向渲染流程。
 */
@ccclass('LightingFlow')
export class LightingFlow extends RenderFlow {
    private _lightingRenderPass: RenderPass|null = null;
    private _lightingRenderTargets: Texture[] = [];
    protected _lightingFrameBuffer: Framebuffer|null = null;
    private _depth: Texture|null = null;
    private _width = 0;
    private _height = 0;

    /**
     * @en The shared initialization information of lighting render flow
     * @zh 共享的前向渲染流程初始化参数
     */
    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_LIGHTING,
        priority: DeferredFlowPriority.LIGHTING,
        stages: [],
    };

    get lightingFrameBuffer (): Framebuffer {
        return this._lightingFrameBuffer!;
    }

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);
        if (this._stages.length === 0) {
            const lightingStage = new LightingStage();
            lightingStage.initialize(LightingStage.initInfo);
            this._stages.push(lightingStage);
        }
        return true;
    }

    public activate (pipeline: RenderPipeline) {
        super.activate(pipeline);

        const device = pipeline.device;
        if (device.surfaceTransform === SurfaceTransform.IDENTITY
            || device.surfaceTransform === SurfaceTransform.ROTATE_180) {
            this._width = device.width;
            this._height = device.height;
        } else {
            this._width = device.height;
            this._height = device.width;
        }

        if (!this._lightingRenderPass) {
            const colorAttachment = new ColorAttachment();
            colorAttachment.format = Format.RGBA16F;
            colorAttachment.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment.storeOp = StoreOp.STORE;
            colorAttachment.sampleCount = 1;
            colorAttachment.beginLayout = TextureLayout.UNDEFINED;
            colorAttachment.endLayout = TextureLayout.COLOR_ATTACHMENT_OPTIMAL;

            const depthStencilAttachment = new DepthStencilAttachment();
            depthStencilAttachment.format = device.depthStencilFormat;
            depthStencilAttachment.depthLoadOp = LoadOp.LOAD;
            depthStencilAttachment.depthStoreOp = StoreOp.DISCARD;
            depthStencilAttachment.stencilLoadOp = LoadOp.DISCARD;
            depthStencilAttachment.stencilStoreOp = StoreOp.DISCARD;
            depthStencilAttachment.sampleCount = 1;
            depthStencilAttachment.beginLayout = TextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
            depthStencilAttachment.endLayout = TextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;

            const renderPassInfo = new RenderPassInfo([colorAttachment], depthStencilAttachment);
            this._lightingRenderPass = device.createRenderPass(renderPassInfo);
        }

        if (this._lightingRenderTargets.length < 1) {
            this._lightingRenderTargets.push(device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                Format.RGBA16F,
                this._width,
                this._height,
            )));
        }

        if (!this._depth) {
            this._depth = (this.pipeline as DeferredPipeline).gbufferDepth;
        }

        if (!this._lightingFrameBuffer) {
            this._lightingFrameBuffer = device.createFramebuffer(new FramebufferInfo(
                this._lightingRenderPass,
                this._lightingRenderTargets,
                this._depth,
            ));
        }

        pipeline.descriptorSet.bindTexture(UNIFORM_LIGHTING_RESULTMAP_BINDING, this._lightingFrameBuffer.colorTextures[0]!);

        const samplerHash = genSamplerHash([
            Filter.LINEAR,
            Filter.LINEAR,
            Filter.NONE,
            Address.CLAMP,
            Address.CLAMP,
            Address.CLAMP,
        ]);
        const sampler = samplerLib.getSampler(device, samplerHash);
        pipeline.descriptorSet.bindSampler(UNIFORM_LIGHTING_RESULTMAP_BINDING, sampler);
    }

    public render (camera: Camera) {
        const pipeline = this._pipeline as DeferredPipeline;
        super.render(camera);
    }

    public destroy () {
        super.destroy();
        for (let i = 0; i < this._lightingRenderTargets.length; i++) {
            const renderTarget = this._lightingRenderTargets[i];
            if (renderTarget) { renderTarget.destroy(); }
        }
        this._lightingRenderTargets.length = 0;

        if (this._lightingRenderPass) { this._lightingRenderPass.destroy(); }
        if (this._lightingFrameBuffer) { this._lightingFrameBuffer.destroy(); }
    }
}
