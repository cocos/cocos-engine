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
 * @category pipeline.deferred
 */

import { ccclass } from 'cc.decorator';
import { Camera } from '../../renderer/scene';
import { PIPELINE_FLOW_GBUFFER, UNIFORM_GBUFFER_ALBEDOMAP_BINDING, UNIFORM_GBUFFER_POSITIONMAP_BINDING, UNIFORM_GBUFFER_NORMALMAP_BINDING,
    UNIFORM_GBUFFER_EMISSIVEMAP_BINDING } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { DeferredFlowPriority } from './enum';
import { GbufferStage } from './gbuffer-stage';
import { DeferredPipeline } from './deferred-pipeline';
import { RenderPipeline } from '../render-pipeline';
import { Framebuffer, RenderPass, LoadOp,
    StoreOp, TextureLayout, Format, Texture,
    TextureType, TextureUsageBit, ColorAttachment, DepthStencilAttachment, RenderPassInfo, TextureInfo, FramebufferInfo } from '../../gfx';
import { genSamplerHash, samplerLib } from '../../renderer/core/sampler-lib';
import { Address, Filter, SurfaceTransform } from '../../gfx/define';
import { sceneCulling } from '../scene-culling';

/**
 * @en The gbuffer flow in deferred render pipeline
 * @zh 延迟渲染流程。
 */
@ccclass('GbufferFlow')
export class GbufferFlow extends RenderFlow {
    private _gbufferRenderPass: RenderPass|null = null;
    private _gbufferRenderTargets: Texture[] = [];
    protected _gbufferFrameBuffer: Framebuffer|null = null;
    private _depth: Texture|null = null;
    private _width = 0;
    private _height = 0;

    /**
     * @en The shared initialization information of gbuffer render flow
     * @zh 共享的延迟渲染流程初始化参数
     */
    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_GBUFFER,
        priority: DeferredFlowPriority.GBUFFER,
        stages: [],
    };

    get gbufferFrameBuffer (): Framebuffer {
        return this._gbufferFrameBuffer!;
    }

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);
        if (this._stages.length === 0) {
            const gbufferStage = new GbufferStage();
            gbufferStage.initialize(GbufferStage.initInfo);
            this._stages.push(gbufferStage);
        }
        return true;
    }

    public activate (pipeline: RenderPipeline) {
        super.activate(pipeline);

        const device = pipeline.device;
        this._width = device.width;
        this._height = device.height;

        if (device.surfaceTransform === SurfaceTransform.IDENTITY
            || device.surfaceTransform === SurfaceTransform.ROTATE_180) {
            this._width = device.width;
            this._height = device.height;
        } else {
            this._width = device.height;
            this._height = device.width;
        }

        if (!this._gbufferRenderPass) {
            const colorAttachment0 = new ColorAttachment();
            colorAttachment0.format = Format.RGBA16F;
            colorAttachment0.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment0.storeOp = StoreOp.STORE;
            colorAttachment0.sampleCount = 1;
            colorAttachment0.beginLayout = TextureLayout.UNDEFINED;
            colorAttachment0.endLayout = TextureLayout.COLOR_ATTACHMENT_OPTIMAL;

            const colorAttachment1 = new ColorAttachment();
            colorAttachment1.format = Format.RGBA16F;
            colorAttachment1.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment1.storeOp = StoreOp.STORE;
            colorAttachment1.sampleCount = 1;
            colorAttachment1.beginLayout = TextureLayout.UNDEFINED;
            colorAttachment1.endLayout = TextureLayout.COLOR_ATTACHMENT_OPTIMAL;

            const colorAttachment2 = new ColorAttachment();
            colorAttachment2.format = Format.RGBA16F;
            colorAttachment2.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment2.storeOp = StoreOp.STORE;
            colorAttachment2.sampleCount = 1;
            colorAttachment2.beginLayout = TextureLayout.UNDEFINED;
            colorAttachment2.endLayout = TextureLayout.COLOR_ATTACHMENT_OPTIMAL;

            const colorAttachment3 = new ColorAttachment();
            colorAttachment3.format = Format.RGBA16F;
            colorAttachment3.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment3.storeOp = StoreOp.STORE;
            colorAttachment3.sampleCount = 1;
            colorAttachment3.beginLayout = TextureLayout.UNDEFINED;
            colorAttachment3.endLayout = TextureLayout.COLOR_ATTACHMENT_OPTIMAL;

            const depthStencilAttachment = new DepthStencilAttachment();
            depthStencilAttachment.format = device.depthStencilFormat;
            depthStencilAttachment.depthLoadOp = LoadOp.CLEAR;
            depthStencilAttachment.depthStoreOp = StoreOp.STORE;
            depthStencilAttachment.stencilLoadOp = LoadOp.CLEAR;
            depthStencilAttachment.stencilStoreOp = StoreOp.STORE;
            depthStencilAttachment.sampleCount = 1;
            depthStencilAttachment.beginLayout = TextureLayout.UNDEFINED;
            depthStencilAttachment.endLayout = TextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
            const renderPassInfo = new RenderPassInfo([colorAttachment0, colorAttachment1, colorAttachment2, colorAttachment3],
                depthStencilAttachment);
            this._gbufferRenderPass = device.createRenderPass(renderPassInfo);
        }

        if (this._gbufferRenderTargets.length < 1) {
            this._gbufferRenderTargets.push(device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                Format.RGBA16F,
                this._width,
                this._height,
            )));
            this._gbufferRenderTargets.push(device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                Format.RGBA16F,
                this._width,
                this._height,
            )));
            this._gbufferRenderTargets.push(device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                Format.RGBA16F,
                this._width,
                this._height,
            )));
            this._gbufferRenderTargets.push(device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                Format.RGBA16F,
                this._width,
                this._height,
            )));
        }

        if (!this._depth) {
            this._depth = device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
                device.depthStencilFormat,
                this._width,
                this._height,
            ));
            (this.pipeline as DeferredPipeline).gbufferDepth = this._depth;
        }

        if (!this._gbufferFrameBuffer) {
            this._gbufferFrameBuffer = device.createFramebuffer(new FramebufferInfo(
                this._gbufferRenderPass,
                this._gbufferRenderTargets,
                this._depth,
            ));
        }

        pipeline.descriptorSet.bindTexture(UNIFORM_GBUFFER_ALBEDOMAP_BINDING, this._gbufferFrameBuffer.colorTextures[0]!);
        pipeline.descriptorSet.bindTexture(UNIFORM_GBUFFER_POSITIONMAP_BINDING, this._gbufferFrameBuffer.colorTextures[1]!);
        pipeline.descriptorSet.bindTexture(UNIFORM_GBUFFER_NORMALMAP_BINDING, this._gbufferFrameBuffer.colorTextures[2]!);
        pipeline.descriptorSet.bindTexture(UNIFORM_GBUFFER_EMISSIVEMAP_BINDING, this._gbufferFrameBuffer.colorTextures[3]!);

        const gbufferSamplerHash = genSamplerHash([
            Filter.LINEAR,
            Filter.LINEAR,
            Filter.NONE,
            Address.CLAMP,
            Address.CLAMP,
            Address.CLAMP,
        ]);
        const gbufferSampler = samplerLib.getSampler(device, gbufferSamplerHash);
        pipeline.descriptorSet.bindSampler(UNIFORM_GBUFFER_ALBEDOMAP_BINDING, gbufferSampler);
        pipeline.descriptorSet.bindSampler(UNIFORM_GBUFFER_POSITIONMAP_BINDING, gbufferSampler);
        pipeline.descriptorSet.bindSampler(UNIFORM_GBUFFER_NORMALMAP_BINDING, gbufferSampler);
        pipeline.descriptorSet.bindSampler(UNIFORM_GBUFFER_EMISSIVEMAP_BINDING, gbufferSampler);
    }

    public render (camera: Camera) {
        const pipeline = this._pipeline as DeferredPipeline;
        sceneCulling(pipeline, camera);
        super.render(camera);
    }

    public destroy () {
        super.destroy();
        for (let i = 0; i < this._gbufferRenderTargets.length; i++) {
            const renderTarget = this._gbufferRenderTargets[i];
            if (renderTarget) { renderTarget.destroy(); }
        }
        this._gbufferRenderTargets.length = 0;

        if (this._gbufferRenderPass) { this._gbufferRenderPass.destroy(); }
        if (this._gbufferFrameBuffer) { this._gbufferFrameBuffer.destroy(); }
    }
}
