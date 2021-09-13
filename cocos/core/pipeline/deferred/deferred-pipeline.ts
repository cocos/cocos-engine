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
import { RenderPipeline, IRenderPipelineInfo } from '../render-pipeline';
import { MainFlow } from './main-flow';
import { RenderTextureConfig } from '../pipeline-serialization';
import { ShadowFlow } from '../shadow/shadow-flow';
import { BufferUsageBit, Format, MemoryUsageBit, ClearFlagBit, ClearFlags, StoreOp, Filter, Address,
    SurfaceTransform, ColorAttachment, DepthStencilAttachment, RenderPass, LoadOp,
    RenderPassInfo, BufferInfo, Texture, InputAssembler, InputAssemblerInfo, Attribute, Buffer, AccessType, Framebuffer,
    TextureInfo, TextureType, TextureUsageBit, FramebufferInfo, Rect, Swapchain, SamplerInfo, Sampler } from '../../gfx';
import { UBOGlobal, UBOCamera, UBOShadow, UNIFORM_SHADOWMAP_BINDING, UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING } from '../define';
import { SKYBOX_FLAG } from '../../renderer/scene/camera';
import { Camera } from '../../renderer/scene';
import { errorID } from '../../platform/debug';
import { sceneCulling } from '../scene-culling';
import { DeferredPipelineSceneData } from './deferred-pipeline-scene-data';
import { RenderWindow } from '../../renderer/core/render-window';

const PIPELINE_TYPE = 1;

const _samplerInfo = new SamplerInfo(
    Filter.POINT,
    Filter.POINT,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
);

class InputAssemblerData {
    quadIB: Buffer|null = null;
    quadVB: Buffer|null = null;
    quadIA: InputAssembler|null = null;
}

export class DeferredRenderData {
    gbufferFrameBuffer: Framebuffer = null!;
    gbufferRenderTargets: Texture[] = [];
    lightingFrameBuffer: Framebuffer = null!;
    lightingRenderTargets: Texture[] = [];
    depthTex: Texture = null!;
    sampler: Sampler = null!;
}

/**
 * @en The deferred render pipeline
 * @zh 延迟渲染管线。
 */
@ccclass('DeferredPipeline')
export class DeferredPipeline extends RenderPipeline {
    protected _quadIB: Buffer | null = null;
    protected _quadVBOnscreen: Buffer | null = null;
    protected _quadVBOffscreen: Buffer | null = null;
    protected _quadIAOnscreen: InputAssembler | null = null;
    protected _quadIAOffscreen: InputAssembler | null = null;
    protected _deferredRenderData: DeferredRenderData | null = null;
    private _gbufferRenderPass: RenderPass | null = null;
    private _lightingRenderPass: RenderPass | null = null;
    private _width = 0;
    private _height = 0;
    private _lastUsedRenderArea: Rect = new Rect();

    @type([RenderTextureConfig])
    @serializable
    @displayOrder(2)
    protected renderTextures: RenderTextureConfig[] = [];
    protected _renderPasses = new Map<ClearFlags, RenderPass>();

    /**
     * @zh
     * 四边形输入汇集器。
     */
    public get quadIAOnscreen (): InputAssembler {
        return this._quadIAOnscreen!;
    }

    public get quadIAOffscreen (): InputAssembler {
        return this._quadIAOffscreen!;
    }

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
        this._pipelineUBO.updateGlobalUBO(cameras[0].window!); // TODO: window size is also camera-specific
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene) {
                const fbo = camera.window?.framebuffer.colorTextures[0];
                if (fbo) this.resize(fbo.width, fbo.height);
                sceneCulling(this, camera);
                this._pipelineUBO.updateCameraUBO(camera);

                for (let j = 0; j < this._flows.length; j++) {
                    this._flows[j].render(camera);
                }
            }
        }
        this._commandBuffers[0].end();
        this._device.queue.submit(this._commandBuffers);
    }

    public getRenderPass (clearFlags: ClearFlags, swapchain: Swapchain): RenderPass {
        let renderPass = this._renderPasses.get(clearFlags);
        if (renderPass) { return renderPass; }

        const device = this._device;
        const colorAttachment = new ColorAttachment();
        const depthStencilAttachment = new DepthStencilAttachment();
        colorAttachment.format = swapchain.colorTexture.format;
        depthStencilAttachment.format = swapchain.depthStencilTexture.format;
        depthStencilAttachment.stencilStoreOp = StoreOp.DISCARD;
        depthStencilAttachment.depthStoreOp = StoreOp.DISCARD;

        if (!(clearFlags & ClearFlagBit.COLOR)) {
            if (clearFlags & SKYBOX_FLAG) {
                colorAttachment.loadOp = LoadOp.DISCARD;
            } else {
                colorAttachment.loadOp = LoadOp.LOAD;
                colorAttachment.beginAccesses = [AccessType.COLOR_ATTACHMENT_WRITE];
            }
        }

        if ((clearFlags & ClearFlagBit.DEPTH_STENCIL) !== ClearFlagBit.DEPTH_STENCIL) {
            if (!(clearFlags & ClearFlagBit.DEPTH)) depthStencilAttachment.depthLoadOp = LoadOp.LOAD;
            if (!(clearFlags & ClearFlagBit.STENCIL)) depthStencilAttachment.stencilLoadOp = LoadOp.LOAD;
        }
        depthStencilAttachment.beginAccesses = [AccessType.DEPTH_STENCIL_ATTACHMENT_WRITE];

        const renderPassInfo = new RenderPassInfo([colorAttachment], depthStencilAttachment);
        renderPass = device.createRenderPass(renderPassInfo);
        this._renderPasses.set(clearFlags, renderPass);

        return renderPass;
    }

    public getDeferredRenderData (): DeferredRenderData {
        if (!this._deferredRenderData) {
            this._generateDeferredRenderData();
        }

        return this._deferredRenderData!;
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

        let inputAssemblerDataOffscreen = new InputAssemblerData();
        inputAssemblerDataOffscreen = this.createQuadInputAssembler();
        if (!inputAssemblerDataOffscreen.quadIB || !inputAssemblerDataOffscreen.quadVB || !inputAssemblerDataOffscreen.quadIA) {
            return false;
        }
        this._quadIB = inputAssemblerDataOffscreen.quadIB;
        this._quadVBOffscreen = inputAssemblerDataOffscreen.quadVB;
        this._quadIAOffscreen = inputAssemblerDataOffscreen.quadIA;

        const inputAssemblerDataOnscreen = this.createQuadInputAssembler();
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

    private destroyUBOs () {
        if (this._descriptorSet) {
            this._descriptorSet.getBuffer(UBOGlobal.BINDING).destroy();
            this._descriptorSet.getBuffer(UBOShadow.BINDING).destroy();
            this._descriptorSet.getBuffer(UBOCamera.BINDING).destroy();
            this._descriptorSet.getTexture(UNIFORM_SHADOWMAP_BINDING).destroy();
            this._descriptorSet.getTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING).destroy();
        }
    }

    private destroyDeferredData () {
        const deferredData = this._deferredRenderData;
        if (deferredData) {
            if (deferredData.gbufferFrameBuffer) deferredData.gbufferFrameBuffer.destroy();
            if (deferredData.lightingFrameBuffer) deferredData.lightingFrameBuffer.destroy();
            if (deferredData.depthTex) deferredData.depthTex.destroy();

            for (let i = 0; i < deferredData.gbufferRenderTargets.length; i++) {
                deferredData.gbufferRenderTargets[i].destroy();
            }
            deferredData.gbufferRenderTargets.length = 0;

            for (let i = 0; i < deferredData.lightingRenderTargets.length; i++) {
                deferredData.lightingRenderTargets[i].destroy();
            }
            deferredData.lightingRenderTargets.length = 0;
        }

        this._deferredRenderData = null;
    }

    public destroy () {
        this.destroyUBOs();
        this.destroyQuadInputAssembler();
        this.destroyDeferredData();

        const rpIter = this._renderPasses.values();
        let rpRes = rpIter.next();
        while (!rpRes.done) {
            rpRes.value.destroy();
            rpRes = rpIter.next();
        }

        this._commandBuffers.length = 0;

        return super.destroy();
    }

    public resize (width: number, height: number) {
        if (this._width === width && this._height === height) {
            return;
        }
        this._width = width;
        this._height = height;
        this.destroyDeferredData();
        this._generateDeferredRenderData();
    }

    /**
     * @zh
     * 创建四边形输入汇集器。
     */
    protected createQuadInputAssembler (): InputAssemblerData {
        // create vertex buffer
        const inputAssemblerData = new InputAssemblerData();

        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;

        const quadVB = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            vbSize,
            vbStride,
        ));

        if (!quadVB) {
            return inputAssemblerData;
        }

        // create index buffer
        const ibStride = Uint8Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        const quadIB = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            ibSize,
            ibStride,
        ));

        if (!quadIB) {
            return inputAssemblerData;
        }

        const indices = new Uint8Array(6);
        indices[0] = 0; indices[1] = 1; indices[2] = 2;
        indices[3] = 1; indices[4] = 3; indices[5] = 2;

        quadIB.update(indices);

        // create input assembler

        const attributes = new Array<Attribute>(2);
        attributes[0] = new Attribute('a_position', Format.RG32F);
        attributes[1] = new Attribute('a_texCoord', Format.RG32F);

        const quadIA = this._device.createInputAssembler(new InputAssemblerInfo(
            attributes,
            [quadVB],
            quadIB,
        ));

        inputAssemblerData.quadIB = quadIB;
        inputAssemblerData.quadVB = quadVB;
        inputAssemblerData.quadIA = quadIA;
        return inputAssemblerData;
    }

    public updateQuadVertexData (renderArea: Rect, window: RenderWindow) {
        if (this._lastUsedRenderArea === renderArea) {
            return;
        }

        this._lastUsedRenderArea = renderArea;
        const offData = this.genQuadVertexData(SurfaceTransform.IDENTITY, renderArea, window);
        this._quadVBOffscreen!.update(offData);

        const onData = this.genQuadVertexData(window.swapchain && window.swapchain.surfaceTransform || SurfaceTransform.IDENTITY, renderArea, window);
        this._quadVBOnscreen!.update(onData);
    }

    protected genQuadVertexData (surfaceTransform: SurfaceTransform, renderArea: Rect, window: RenderWindow) : Float32Array {
        const vbData = new Float32Array(4 * 4);

        const minX = renderArea.x / window.width;
        const maxX = (renderArea.x + renderArea.width) / window.width;
        let minY = renderArea.y / window.height;
        let maxY = (renderArea.y + renderArea.height) / window.height;
        if (this.device.capabilities.screenSpaceSignY > 0) {
            const temp = maxY;
            maxY       = minY;
            minY       = temp;
        }
        let n = 0;
        switch (surfaceTransform) {
        case (SurfaceTransform.IDENTITY):
            n = 0;
            vbData[n++] = -1.0; vbData[n++] = -1.0; vbData[n++] = minX; vbData[n++] = maxY;
            vbData[n++] = 1.0; vbData[n++] = -1.0; vbData[n++] = maxX; vbData[n++] = maxY;
            vbData[n++] = -1.0; vbData[n++] = 1.0; vbData[n++] = minX; vbData[n++] = minY;
            vbData[n++] = 1.0; vbData[n++] = 1.0; vbData[n++] = maxX; vbData[n++] = minY;
            break;
        case (SurfaceTransform.ROTATE_90):
            n = 0;
            vbData[n++] = -1.0; vbData[n++] = -1.0; vbData[n++] = maxX; vbData[n++] = maxY;
            vbData[n++] = 1.0; vbData[n++] = -1.0; vbData[n++] = maxX; vbData[n++] = minY;
            vbData[n++] = -1.0; vbData[n++] = 1.0; vbData[n++] = minX; vbData[n++] = maxY;
            vbData[n++] = 1.0; vbData[n++] = 1.0; vbData[n++] = minX; vbData[n++] = minY;
            break;
        case (SurfaceTransform.ROTATE_180):
            n = 0;
            vbData[n++] = -1.0; vbData[n++] = -1.0; vbData[n++] = minX; vbData[n++] = minY;
            vbData[n++] = 1.0; vbData[n++] = -1.0; vbData[n++] = maxX; vbData[n++] = minY;
            vbData[n++] = -1.0; vbData[n++] = 1.0; vbData[n++] = minX; vbData[n++] = maxY;
            vbData[n++] = 1.0; vbData[n++] = 1.0; vbData[n++] = maxX; vbData[n++] = maxY;
            break;
        case (SurfaceTransform.ROTATE_270):
            n = 0;
            vbData[n++] = -1.0; vbData[n++] = -1.0; vbData[n++] = minX; vbData[n++] = minY;
            vbData[n++] = 1.0; vbData[n++] = -1.0; vbData[n++] = minX; vbData[n++] = maxY;
            vbData[n++] = -1.0; vbData[n++] = 1.0; vbData[n++] = maxX; vbData[n++] = minY;
            vbData[n++] = 1.0; vbData[n++] = 1.0; vbData[n++] = maxX; vbData[n++] = maxY;
            break;
        default:
            break;
        }

        return vbData;
    }

    /**
     * @zh
     * 销毁四边形输入汇集器。
     */
    protected destroyQuadInputAssembler () {
        if (this._quadIB) {
            this._quadIB.destroy();
            this._quadIB = null;
        }

        if (this._quadVBOnscreen) {
            this._quadVBOnscreen.destroy();
            this._quadVBOnscreen = null;
        }

        if (this._quadVBOffscreen) {
            this._quadVBOffscreen.destroy();
            this._quadVBOffscreen = null;
        }

        if (this._quadIAOnscreen) {
            this._quadIAOnscreen.destroy();
            this._quadIAOnscreen = null;
        }

        if (this._quadIAOffscreen) {
            this._quadIAOffscreen.destroy();
            this._quadIAOffscreen = null;
        }
    }

    private _generateDeferredRenderData () {
        const device = this.device;

        const data: DeferredRenderData = this._deferredRenderData = new DeferredRenderData();

        for (let i = 0; i < 4; ++i) {
            data.gbufferRenderTargets.push(device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                i % 3 ? Format.RGBA16F : Format.RGBA8, // positions & normals need more precision
                this._width,
                this._height,
            )));
        }
        data.depthTex = device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
            Format.DEPTH_STENCIL,
            this._width,
            this._height,
        ));

        data.gbufferFrameBuffer = device.createFramebuffer(new FramebufferInfo(
            this._gbufferRenderPass!,
            data.gbufferRenderTargets,
            data.depthTex,
        ));

        data.lightingRenderTargets.push(device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
            Format.RGBA8,
            this._width,
            this._height,
        )));

        data.lightingFrameBuffer = device.createFramebuffer(new FramebufferInfo(
            this._lightingRenderPass!,
            data.lightingRenderTargets,
            data.depthTex,
        ));

        data.sampler = device.getSampler(_samplerInfo);
    }
}
