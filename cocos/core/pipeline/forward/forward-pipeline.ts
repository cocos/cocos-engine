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
import { EDITOR } from 'internal:constants';
import { RenderPipeline, IRenderPipelineInfo, PipelineRenderData } from '../render-pipeline';
import { ForwardFlow } from './forward-flow';
import { RenderTextureConfig } from '../pipeline-serialization';
import { ShadowFlow } from '../shadow/shadow-flow';
import { UBOGlobal, UBOShadow, UBOCamera, UNIFORM_SHADOWMAP_BINDING, UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING } from '../define';
import { ColorAttachment, DepthStencilAttachment, LoadOp,
    RenderPassInfo, Filter, Address, StoreOp, AccessType, Swapchain, SamplerInfo, Format,
    RenderPass, TextureInfo, TextureType, TextureUsageBit, FramebufferInfo } from '../../gfx';
import { builtinResMgr } from '../../builtin';
import { Texture2D } from '../../assets/texture-2d';
import { Camera } from '../../renderer/scene';
import { errorID } from '../../platform/debug';
import { sceneCulling } from '../scene-culling';
import { CommonPipelineSceneData } from '../common/common-pipeline-scene-data';

const PIPELINE_TYPE = 0;

const _samplerInfo = new SamplerInfo(
    Filter.POINT,
    Filter.POINT,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
);

/**
 * @en The forward render pipeline
 * @zh 前向渲染管线。
 */
@ccclass('ForwardPipeline')
export class ForwardPipeline extends RenderPipeline {
    @type([RenderTextureConfig])
    @serializable
    @displayOrder(2)
    protected renderTextures: RenderTextureConfig[] = [];

    protected _postRenderPass: RenderPass | null = null;

    public get postRenderPass (): RenderPass | null {
        return this._postRenderPass;
    }

    public initialize (info: IRenderPipelineInfo): boolean {
        super.initialize(info);

        if (this._flows.length === 0) {
            const shadowFlow = new ShadowFlow();
            shadowFlow.initialize(ShadowFlow.initInfo);
            this._flows.push(shadowFlow);

            const forwardFlow = new ForwardFlow();
            forwardFlow.initialize(ForwardFlow.initInfo);
            this._flows.push(forwardFlow);
        }

        return true;
    }

    public activate (swapchain: Swapchain): boolean {
        if (EDITOR) { console.info('Forward render pipeline initialized.'); }

        this._macros = { CC_PIPELINE_TYPE: PIPELINE_TYPE };
        this._pipelineSceneData = new CommonPipelineSceneData();

        if (!super.activate(swapchain)) {
            return false;
        }

        if (!this._activeRenderer(swapchain)) {
            errorID(2402);
            return false;
        }

        return true;
    }

    private _ensureEnoughSize (cameras: Camera[]) {
        let newWidth = this._width;
        let newHeight = this._height;
        for (let i = 0; i < cameras.length; ++i) {
            const window = cameras[i].window!;
            newWidth = Math.max(window.width, newWidth);
            newHeight = Math.max(window.height, newHeight);
        }
        if (newWidth !== this._width || newHeight !== this._height) {
            this._width = newWidth;
            this._height = newHeight;
            this._destroyRenderData();
            this._generateForwardRenderData();
        }
    }

    public render (cameras: Camera[]) {
        if (cameras.length === 0) {
            return;
        }
        this._commandBuffers[0].begin();
        this._ensureEnoughSize(cameras);
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene) {
                sceneCulling(this, camera);

                for (let k = 0; k < RenderPipeline._renderCallbacks.length; ++k) {
                    RenderPipeline._renderCallbacks[k].onPreRender(camera);
                }

                this._pipelineUBO.updateGlobalUBO(camera.window!);
                this._pipelineUBO.updateCameraUBO(camera);
                for (let j = 0; j < this._flows.length; j++) {
                    this._flows[j].render(camera);
                }

                for (let k = 0; k < RenderPipeline._renderCallbacks.length; ++k) {
                    RenderPipeline._renderCallbacks[k].onPostRender(camera);
                }
            }
        }
        this._commandBuffers[0].end();
        this._device.queue.submit(this._commandBuffers);
    }

    public destroy () {
        this._destroyUBOs();
        this._destroyQuadInputAssembler();
        this._destroyRenderData();
        const rpIter = this._renderPasses.values();
        let rpRes = rpIter.next();
        while (!rpRes.done) {
            rpRes.value.destroy();
            rpRes = rpIter.next();
        }

        this._commandBuffers.length = 0;

        return super.destroy();
    }

    private _destroyRenderData () {
        const renderData = this._pipelineRenderData;
        if (renderData) {
            if (renderData.outputFrameBuffer) renderData.outputFrameBuffer.destroy();
            if (renderData.outputDepth) renderData.outputDepth.destroy();
            for (let i = 0; i < renderData.outputRenderTargets.length; i++) {
                renderData.outputRenderTargets[i].destroy();
            }
            renderData.outputRenderTargets.length = 0;

            this._destroyBloomData();
        }

        this._pipelineRenderData = null;
    }

    private _activeRenderer (swapchain: Swapchain) {
        const device = this.device;

        this._commandBuffers.push(device.commandBuffer);

        const shadowMapSampler = device.getSampler(_samplerInfo);
        this._descriptorSet.bindSampler(UNIFORM_SHADOWMAP_BINDING, shadowMapSampler);
        this._descriptorSet.bindTexture(UNIFORM_SHADOWMAP_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this._descriptorSet.bindSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, shadowMapSampler);
        this._descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this._descriptorSet.update();

        const inputAssemblerDataOffscreen = this._createQuadInputAssembler();
        if (!inputAssemblerDataOffscreen.quadIB || !inputAssemblerDataOffscreen.quadVB || !inputAssemblerDataOffscreen.quadIA) {
            return false;
        }
        this._quadIB = inputAssemblerDataOffscreen.quadIB;
        this._quadVBOffscreen = inputAssemblerDataOffscreen.quadVB;
        this._quadIAOffscreen = inputAssemblerDataOffscreen.quadIA;

        const inputAssemblerDataOnscreen = this._createQuadInputAssembler();
        if (!inputAssemblerDataOnscreen.quadIB || !inputAssemblerDataOnscreen.quadVB || !inputAssemblerDataOnscreen.quadIA) {
            return false;
        }
        this._quadVBOnscreen = inputAssemblerDataOnscreen.quadVB;
        this._quadIAOnscreen = inputAssemblerDataOnscreen.quadIA;

        if (!this._postRenderPass) {
            const colorAttachment = new ColorAttachment();
            colorAttachment.format = Format.BGRA8;
            colorAttachment.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment.storeOp = StoreOp.STORE;
            colorAttachment.endAccesses = [AccessType.COLOR_ATTACHMENT_READ];
            colorAttachment.endAccesses = [AccessType.COLOR_ATTACHMENT_WRITE];

            const depthStencilAttachment = new DepthStencilAttachment();
            depthStencilAttachment.format = Format.DEPTH_STENCIL;
            depthStencilAttachment.depthLoadOp = LoadOp.CLEAR;
            depthStencilAttachment.depthStoreOp = StoreOp.STORE;
            depthStencilAttachment.stencilLoadOp = LoadOp.CLEAR;
            depthStencilAttachment.stencilStoreOp = StoreOp.STORE;
            depthStencilAttachment.beginAccesses = [AccessType.DEPTH_STENCIL_ATTACHMENT_READ];
            depthStencilAttachment.endAccesses = [AccessType.DEPTH_STENCIL_ATTACHMENT_WRITE];
            const renderPassInfo = new RenderPassInfo(
                [colorAttachment],
                depthStencilAttachment,
            );
            this._postRenderPass = device.createRenderPass(renderPassInfo);
        }

        this._width = swapchain.width;
        this._height = swapchain.height;
        this._generateForwardRenderData();

        return true;
    }

    private _generateForwardRenderData () {
        const device = this.device;
        const data: PipelineRenderData = this._pipelineRenderData = new PipelineRenderData();
        data.outputRenderTargets.push(device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
            Format.BGRA8,
            this._width,
            this._height,
        )));
        data.outputDepth = device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
            Format.DEPTH_STENCIL,
            this._width,
            this._height,
        ));

        data.outputFrameBuffer = device.createFramebuffer(new FramebufferInfo(
            this._postRenderPass!,
            data.outputRenderTargets,
            data.outputDepth,
        ));
        data.sampler = device.getSampler(_samplerInfo);

        this._generateBloomRenderData();
    }

    private _destroyUBOs () {
        if (this._descriptorSet) {
            this._descriptorSet.getBuffer(UBOGlobal.BINDING).destroy();
            this._descriptorSet.getBuffer(UBOShadow.BINDING).destroy();
            this._descriptorSet.getBuffer(UBOCamera.BINDING).destroy();
            this._descriptorSet.getTexture(UNIFORM_SHADOWMAP_BINDING).destroy();
            this._descriptorSet.getTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING).destroy();
        }
    }
}
