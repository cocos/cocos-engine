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
import { Framebuffer, RenderPass, LoadOp, StoreOp,
    TextureLayout, Format, Texture, TextureType, TextureUsageBit, Filter, Address,
    ColorAttachment, DepthStencilAttachment, RenderPassInfo, TextureInfo, FramebufferInfo } from '../../gfx';
import { RenderFlowTag } from '../pipeline-serialization';
import { ForwardPipeline } from '../forward/forward-pipeline';
import { RenderView } from '../render-view';
import { ShadowType } from '../../renderer/scene/shadows';
import { genSamplerHash, samplerLib } from '../../renderer/core/sampler-lib';

const _samplerInfo = [
    Filter.LINEAR,
    Filter.LINEAR,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
];

/**
 * @en Shadow map render flow
 * @zh 阴影贴图绘制流程
 */
@ccclass('ShadowFlow')
export class ShadowFlow extends RenderFlow {

    /**
     * @en Gets the frame buffer for shadow map
     * @zh 获取渲染阴影的 Frame Buffer
     */
    public get shadowFrameBuffer () {
        return this._shadowFrameBuffer;
    }

    /**
     * @en A common initialization info for shadow map render flow
     * @zh 一个通用的 ShadowFlow 的初始化信息对象
     */
    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_SHADOW,
        priority: ForwardFlowPriority.SHADOW,
        tag: RenderFlowTag.SCENE,
        stages: []
    };

    private _shadowRenderPass: RenderPass|null = null;
    private _shadowRenderTargets: Texture[] = [];
    private _shadowFrameBuffer: Framebuffer|null = null;
    private _depth: Texture|null = null;
    private _width: number = 0;
    private _height: number = 0;

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

    public activate (pipeline: ForwardPipeline) {
        super.activate(pipeline);

        const device = pipeline.device;
        const shadowMapSize = pipeline.shadows.size;
        this._width = shadowMapSize.x;
        this._height = shadowMapSize.y;

        if(!this._shadowRenderPass) {

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
            depthStencilAttachment.depthStoreOp = StoreOp.STORE;
            depthStencilAttachment.stencilLoadOp = LoadOp.CLEAR;
            depthStencilAttachment.stencilStoreOp = StoreOp.STORE;
            depthStencilAttachment.sampleCount = 1;
            depthStencilAttachment.beginLayout = TextureLayout.UNDEFINED;
            depthStencilAttachment.endLayout = TextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;

            const renderPassInfo = new RenderPassInfo([colorAttachment], depthStencilAttachment);
            this._shadowRenderPass = device.createRenderPass(renderPassInfo);
        }

        if(this._shadowRenderTargets.length < 1) {
            this._shadowRenderTargets.push(device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                Format.RGBA8,
                this._width,
                this._height,
            )));
        }

        if(!this._depth) {
            this._depth = device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
                device.depthStencilFormat,
                this._width,
                this._height,
            ));
        }

        if(!this._shadowFrameBuffer) {
            this._shadowFrameBuffer = device.createFramebuffer(new FramebufferInfo(
                this._shadowRenderPass,
                this._shadowRenderTargets,
                this._depth,
            ));
        }

        for (let i = 0; i < this._stages.length; ++i) {
            (this._stages[i] as ShadowStage).setShadowFrameBuffer(this._shadowFrameBuffer);
        }

        const shadowMapSamplerHash = genSamplerHash(_samplerInfo);
        const shadowMapSampler = samplerLib.getSampler(device, shadowMapSamplerHash);
        pipeline.descriptorSet.bindSampler(UNIFORM_SHADOWMAP_BINDING, shadowMapSampler);
        pipeline.descriptorSet.bindTexture(UNIFORM_SHADOWMAP_BINDING, this._shadowRenderTargets[0]);
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        const shadowInfo = pipeline.shadows;
        if (shadowInfo.type !== ShadowType.ShadowMap) { return; }

        const shadowMapSize = shadowInfo.size;
        if (this._width !== shadowMapSize.x || this._height !== shadowMapSize.y) {
            this.resizeShadowMap(shadowMapSize.x,shadowMapSize.y);
            this._width = shadowMapSize.x;
            this._height = shadowMapSize.y;
        }

        pipeline.updateUBOs(view);
        super.render(view);
    }

    private resizeShadowMap (width: number, height: number) {
        if (this._depth) {
            this._depth.resize(width, height);
        }

        if (this._shadowRenderTargets.length > 0) {
            for (let i = 0; i< this._shadowRenderTargets.length; i++) {
                const renderTarget = this._shadowRenderTargets[i];
                if (renderTarget) { renderTarget.resize(width, height); }
            }
        }

        if(this._shadowFrameBuffer) {
            this._shadowFrameBuffer.destroy();
            this._shadowFrameBuffer.initialize(new FramebufferInfo(
                this._shadowRenderPass!,
                this._shadowRenderTargets,
                this._depth,
            ));
        }
    }
}
