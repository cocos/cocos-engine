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

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { builtinResMgr } from '../../builtin/builtin-res-mgr';
import { Texture2D } from '../../assets/texture-2d';
import { RenderPipeline, IRenderPipelineInfo, PipelineRenderData, PipelineInputAssemblerData } from '../render-pipeline';
import { MainFlow } from './main-flow';
import { RenderTextureConfig } from '../pipeline-serialization';
import { ShadowFlow } from '../shadow/shadow-flow';
import { Format, StoreOp, Filter, Address,
    ColorAttachment, DepthStencilAttachment, RenderPass, LoadOp,
    RenderPassInfo, Texture, AccessType, Framebuffer,
    TextureInfo, TextureType, TextureUsageBit, FramebufferInfo, Swapchain, SamplerInfo } from '../../gfx';
import { UBOGlobal, UBOCamera, UBOShadow, UNIFORM_SHADOWMAP_BINDING, UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING } from '../define';
import { Camera } from '../../renderer/scene';
import { errorID } from '../../platform/debug';
import { sceneCulling } from '../scene-culling';
import { DeferredPipelineSceneData } from './deferred-pipeline-scene-data';

const PIPELINE_TYPE = 1;

const _samplerInfo = new SamplerInfo(
    Filter.POINT,
    Filter.POINT,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
);

export class DeferredRenderData extends PipelineRenderData {
    gbufferFrameBuffer: Framebuffer = null!;
    gbufferRenderTargets: Texture[] = [];
}

/**
 * @en The deferred render pipeline
 * @zh 延迟渲染管线。
 */
@ccclass('DeferredPipeline')
export class DeferredPipeline extends RenderPipeline {
    private _gbufferRenderPass: RenderPass | null = null;
    private _lightingRenderPass: RenderPass | null = null;

    @type([RenderTextureConfig])
    @serializable
    @displayOrder(2)
    protected renderTextures: RenderTextureConfig[] = [];

    public initialize (info: IRenderPipelineInfo): boolean {
        super.initialize(info);

        if (this._flows.length === 0) {
            const shadowFlow = new ShadowFlow();
            shadowFlow.initialize(ShadowFlow.initInfo);
            this._flows.push(shadowFlow);

            const mainFlow = new MainFlow();
            mainFlow.initialize(MainFlow.initInfo);
            this._flows.push(mainFlow);
        }

        return true;
    }

    public activate (swapchain: Swapchain): boolean {
        if (EDITOR) {
            console.info('Deferred render pipeline initialized. '
                + 'Note that non-transparent materials with no lighting will not be rendered, such as builtin-unlit.');
        }

        this._macros = { CC_PIPELINE_TYPE: PIPELINE_TYPE };
        this._pipelineSceneData = new DeferredPipelineSceneData();

        if (!super.activate(swapchain)) {
            return false;
        }

        if (!this._activeRenderer(swapchain)) {
            errorID(2402);
            return false;
        }

        return true;
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
                // TODO: merge these two UBO
                this._pipelineUBO.updateGlobalUBO(camera.window!);
                this._pipelineUBO.updateCameraUBO(camera);

                for (let j = 0; j < this._flows.length; j++) {
                    this._flows[j].render(camera);
                }
            }
        }
        this._commandBuffers[0].end();
        this._device.queue.submit(this._commandBuffers);
    }

    public destroy () {
        this._destroyUBOs();
        this._destroyQuadInputAssembler();
        this._destroyDeferredData();

        const rpIter = this._renderPasses.values();
        let rpRes = rpIter.next();
        while (!rpRes.done) {
            rpRes.value.destroy();
            rpRes = rpIter.next();
        }

        this._commandBuffers.length = 0;

        return super.destroy();
    }

    public getPipelineRenderData (): DeferredRenderData {
        if (!this._pipelineRenderData) {
            this._generateDeferredRenderData();
        }

        return this._pipelineRenderData as DeferredRenderData;
    }

    private _activeRenderer (swapchain: Swapchain) {
        const device = this.device;

        this._commandBuffers.push(device.commandBuffer);

        const sampler = device.getSampler(_samplerInfo);
        this._descriptorSet.bindSampler(UNIFORM_SHADOWMAP_BINDING, sampler);
        this._descriptorSet.bindTexture(UNIFORM_SHADOWMAP_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this._descriptorSet.bindSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, sampler);
        this._descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this._descriptorSet.update();

        let inputAssemblerDataOffscreen = new PipelineInputAssemblerData();
        inputAssemblerDataOffscreen = this._createQuadInputAssembler();
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

        if (!this._gbufferRenderPass) {
            const colorAttachment0 = new ColorAttachment();
            colorAttachment0.format = Format.RGBA16F;
            colorAttachment0.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment0.storeOp = StoreOp.STORE;

            const colorAttachment1 = new ColorAttachment();
            colorAttachment1.format = Format.RGBA16F;
            colorAttachment1.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment1.storeOp = StoreOp.STORE;

            const colorAttachment2 = new ColorAttachment();
            colorAttachment2.format = Format.RGBA16F;
            colorAttachment2.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment2.storeOp = StoreOp.STORE;

            const colorAttachment3 = new ColorAttachment();
            colorAttachment3.format = Format.RGBA16F;
            colorAttachment3.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment3.storeOp = StoreOp.STORE;

            const depthStencilAttachment = new DepthStencilAttachment();
            depthStencilAttachment.format = Format.DEPTH_STENCIL;
            depthStencilAttachment.depthLoadOp = LoadOp.CLEAR;
            depthStencilAttachment.depthStoreOp = StoreOp.STORE;
            depthStencilAttachment.stencilLoadOp = LoadOp.CLEAR;
            depthStencilAttachment.stencilStoreOp = StoreOp.STORE;
            const renderPassInfo = new RenderPassInfo(
                [colorAttachment0, colorAttachment1, colorAttachment2, colorAttachment3],
                depthStencilAttachment,
            );
            this._gbufferRenderPass = device.createRenderPass(renderPassInfo);
        }

        if (!this._lightingRenderPass) {
            const colorAttachment = new ColorAttachment();
            colorAttachment.format = Format.RGBA8;
            colorAttachment.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment.storeOp = StoreOp.STORE;
            colorAttachment.endAccesses = [AccessType.COLOR_ATTACHMENT_WRITE];

            const depthStencilAttachment = new DepthStencilAttachment();
            depthStencilAttachment.format = Format.DEPTH_STENCIL;
            depthStencilAttachment.depthLoadOp = LoadOp.LOAD;
            depthStencilAttachment.depthStoreOp = StoreOp.DISCARD;
            depthStencilAttachment.stencilLoadOp = LoadOp.LOAD;
            depthStencilAttachment.stencilStoreOp = StoreOp.DISCARD;
            depthStencilAttachment.beginAccesses = [AccessType.DEPTH_STENCIL_ATTACHMENT_WRITE];
            depthStencilAttachment.endAccesses = [AccessType.DEPTH_STENCIL_ATTACHMENT_WRITE];

            const renderPassInfo = new RenderPassInfo([colorAttachment], depthStencilAttachment);
            this._lightingRenderPass = device.createRenderPass(renderPassInfo);
        }

        this._width = swapchain.width;
        this._height = swapchain.height;
        this._generateDeferredRenderData();

        return true;
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

    private _destroyDeferredData () {
        const deferredData = this._pipelineRenderData as DeferredRenderData;
        if (deferredData) {
            if (deferredData.gbufferFrameBuffer) deferredData.gbufferFrameBuffer.destroy();
            if (deferredData.outputFrameBuffer) deferredData.outputFrameBuffer.destroy();
            if (deferredData.outputDepth) deferredData.outputDepth.destroy();

            for (let i = 0; i < deferredData.gbufferRenderTargets.length; i++) {
                deferredData.gbufferRenderTargets[i].destroy();
            }
            deferredData.gbufferRenderTargets.length = 0;

            for (let i = 0; i < deferredData.outputRenderTargets.length; i++) {
                deferredData.outputRenderTargets[i].destroy();
            }
            deferredData.outputRenderTargets.length = 0;
        }

        this._pipelineRenderData = null;
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
            this._destroyDeferredData();
            this._generateDeferredRenderData();
        }
    }

    private _generateDeferredRenderData () {
        const device = this.device;

        const data: DeferredRenderData = this._pipelineRenderData = new DeferredRenderData();

        for (let i = 0; i < 4; ++i) {
            data.gbufferRenderTargets.push(device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                i % 3 ? Format.RGBA16F : Format.RGBA8, // positions & normals need more precision
                this._width,
                this._height,
            )));
        }
        data.outputDepth = device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
            Format.DEPTH_STENCIL,
            this._width,
            this._height,
        ));

        data.gbufferFrameBuffer = device.createFramebuffer(new FramebufferInfo(
            this._gbufferRenderPass!,
            data.gbufferRenderTargets,
            data.outputDepth,
        ));

        data.outputRenderTargets.push(device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
            Format.RGBA8,
            this._width,
            this._height,
        )));

        data.outputFrameBuffer = device.createFramebuffer(new FramebufferInfo(
            this._lightingRenderPass!,
            data.outputRenderTargets,
            data.outputDepth,
        ));

        data.sampler = device.getSampler(_samplerInfo);
    }
}
