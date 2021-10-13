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

import { ccclass, displayOrder, serializable, type } from 'cc.decorator';
import { sceneCulling } from './scene-culling';
import { Asset } from '../assets/asset';
import { AccessType, Address, Attribute, Buffer, BufferInfo, BufferUsageBit, ClearFlagBit, ClearFlags, ColorAttachment, CommandBuffer,
    DepthStencilAttachment, DescriptorSet, Device, Feature, Filter, Format, Framebuffer, FramebufferInfo, InputAssembler, InputAssemblerInfo,
    LoadOp, MemoryUsageBit, Rect, RenderPass, RenderPassInfo, Sampler, SamplerInfo, StoreOp, SurfaceTransform, Swapchain, Texture, TextureInfo,
    TextureType, TextureUsageBit, Viewport } from '../gfx';
import { legacyCC } from '../global-exports';
import { MacroRecord } from '../renderer/core/pass-utils';
import { RenderWindow } from '../renderer/core/render-window';
import { Camera, SKYBOX_FLAG } from '../renderer/scene/camera';
import { Model } from '../renderer/scene/model';
import { Root } from '../root';
import { GlobalDSManager } from './global-descriptor-set-manager';
import { PipelineSceneData } from './pipeline-scene-data';
import { PipelineUBO } from './pipeline-ubo';
import { RenderFlow } from './render-flow';

/**
 * @en Render pipeline information descriptor
 * @zh 渲染管线描述信息。
 */
export interface IRenderPipelineInfo {
    flows: RenderFlow[];
    tag?: number;
}

/**
 * @en Render pipeline callback
 * @zh 渲染事件回掉。
 */
 export interface IRenderPipelineCallback {
    onPreRender(cam: Camera): void;
    onPostRender(cam: Camera): void;
}

export const MAX_BLOOM_FILTER_PASS_NUM = 6;

export class BloomRenderData {
    renderPass: RenderPass = null!;

    sampler: Sampler = null!;

    prefiterTex: Texture = null!;
    downsampleTexs: Texture[] = [];
    upsampleTexs: Texture[] = [];
    combineTex: Texture = null!;

    prefilterFramebuffer: Framebuffer = null!;
    downsampleFramebuffers: Framebuffer[] = [];
    upsampleFramebuffers: Framebuffer[] = [];
    combineFramebuffer: Framebuffer = null!;
}

export class PipelineRenderData {
    outputFrameBuffer: Framebuffer = null!;
    outputRenderTargets: Texture[] = [];
    outputDepth: Texture = null!;
    sampler: Sampler = null!;

    bloom: BloomRenderData | null = null;
}

export class PipelineInputAssemblerData {
    quadIB: Buffer|null = null;
    quadVB: Buffer|null = null;
    quadIA: InputAssembler|null = null;
}

/**
 * @en Render pipeline describes how we handle the rendering process for all render objects in the related render scene root.
 * It contains some general pipeline configurations, necessary rendering resources and some [[RenderFlow]]s.
 * The rendering process function [[render]] is invoked by [[Root]] for all [[Camera]]s.
 * @zh 渲染管线对象决定了引擎对相关渲染场景下的所有渲染对象实施的完整渲染流程。
 * 这个类主要包含一些通用的管线配置，必要的渲染资源和一些 [[RenderFlow]]。
 * 渲染流程函数 [[render]] 会由 [[Root]] 发起调用并对所有 [[Camera]] 执行预设的渲染流程。
 */
@ccclass('cc.RenderPipeline')
export abstract class RenderPipeline extends Asset {
    /**
     * @en The tag of pipeline.
     * @zh 管线的标签。
     * @readonly
     */
    get tag (): number {
        return this._tag;
    }

    /**
     * @en The flows of pipeline.
     * @zh 管线的渲染流程列表。
     * @readonly
     */
    get flows (): RenderFlow[] {
        return this._flows;
    }

    /**
     * @en Tag
     * @zh 标签
     * @readonly
     */
    @displayOrder(0)
    @serializable
    protected _tag = 0;

    /**
     * @en Flows
     * @zh 渲染流程列表
     * @readonly
     */
    @displayOrder(1)
    @type([RenderFlow])
    @serializable
    protected _flows: RenderFlow[] = [];

    protected _quadIB: Buffer | null = null;
    protected _quadVBOnscreen: Buffer | null = null;
    protected _quadVBOffscreen: Buffer | null = null;
    protected _quadIAOnscreen: InputAssembler | null = null;
    protected _quadIAOffscreen: InputAssembler | null = null;

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

    public getPipelineRenderData (): PipelineRenderData {
        return this._pipelineRenderData!;
    }

    protected static _renderCallbacks: IRenderPipelineCallback[] = [];

    /**
     * @en Add render callback
     * @zh 添加渲染回掉。
     */
    public static addRenderCallback (callback: IRenderPipelineCallback) {
        RenderPipeline._renderCallbacks.push(callback);
    }

    /**
     * @en Remove render callback
     * @zh 移除渲染回掉。
     */
    public static removeRenderCallback (callback: IRenderPipelineCallback) {
        for (let i = 0; i < RenderPipeline._renderCallbacks.length; ++i) {
            if (RenderPipeline._renderCallbacks[i] === callback) {
                RenderPipeline._renderCallbacks.slice(i);
                break;
            }
        }
    }

    /**
     * @en
     * Constant macro string, static throughout the whole runtime.
     * Used to pass device-specific parameters to shader.
     * @zh 常量宏定义字符串，运行时全程不会改变，用于给 shader 传一些只和平台相关的参数。
     * @readonly
     */
    get constantMacros () {
        return this._constantMacros;
    }

    /**
     * @en
     * The current global-scoped shader macros.
     * Used to control effects like IBL, fog, etc.
     * @zh 当前的全局宏定义，用于控制如 IBL、雾效等模块。
     * @readonly
     */
    get macros () {
        return this._macros;
    }

    get device () {
        return this._device;
    }

    get globalDSManager () {
        return this._globalDSManager;
    }

    get descriptorSetLayout () {
        return this._globalDSManager.descriptorSetLayout;
    }

    get descriptorSet () {
        return this._descriptorSet;
    }

    get commandBuffers () {
        return this._commandBuffers;
    }

    get pipelineUBO () {
        return this._pipelineUBO;
    }

    get pipelineSceneData () {
        return this._pipelineSceneData;
    }

    set profiler (value) {
        this._profiler = value;
    }

    get profiler () {
        return this._profiler;
    }

    set clusterEnabled (value) {
        this._clusterEnabled = value;
    }

    get clusterEnabled () {
        return this._clusterEnabled;
    }

    set bloomEnabled (value) {
        this._bloomEnabled = value;
    }

    get bloomEnabled () {
        return this._bloomEnabled;
    }

    protected _device!: Device;
    protected _globalDSManager!: GlobalDSManager;
    protected _descriptorSet!: DescriptorSet;
    protected _commandBuffers: CommandBuffer[] = [];
    protected _pipelineUBO = new PipelineUBO();
    protected _macros: MacroRecord = {};
    protected _constantMacros = '';
    protected _profiler: Model | null = null;
    protected declare _pipelineSceneData: PipelineSceneData;
    protected _pipelineRenderData: PipelineRenderData | null = null;
    protected _renderPasses = new Map<ClearFlags, RenderPass>();
    protected _width = 0;
    protected _height = 0;
    protected _lastUsedRenderArea: Rect = new Rect();
    protected _clusterEnabled = false;
    protected _bloomEnabled = false;

    /**
     * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
     * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
     * @param info The render pipeline information
     */
    public initialize (info: IRenderPipelineInfo): boolean {
        this._flows = info.flows;
        if (info.tag) { this._tag = info.tag; }
        return true;
    }

    public createRenderPass (clearFlags: ClearFlags, colorFmt: Format, depthFmt: Format): RenderPass {
        const device = this._device;
        const colorAttachment = new ColorAttachment();
        const depthStencilAttachment = new DepthStencilAttachment();
        colorAttachment.format = colorFmt;
        depthStencilAttachment.format = depthFmt;
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

        return device.createRenderPass(renderPassInfo);
    }

    public getRenderPass (clearFlags: ClearFlags, swapchain: Swapchain): RenderPass {
        let renderPass = this._renderPasses.get(clearFlags);
        if (renderPass) { return renderPass; }
        renderPass = this.createRenderPass(clearFlags, swapchain.colorTexture.format, swapchain.depthStencilTexture.format);
        this._renderPasses.set(clearFlags, renderPass);
        return renderPass;
    }

    public applyFramebufferRatio (framebuffer: Framebuffer) {
        if (!this.pipelineSceneData.isShadingScale) {
            return;
        }
        const sceneData = this.pipelineSceneData;
        const width = this._width * sceneData.shadingScale;
        const height = this._height * sceneData.shadingScale;
        const colorTexArr: any = framebuffer.colorTextures;
        for (let i = 0; i < colorTexArr.length; i++) {
            colorTexArr[i]!.resize(width, height);
        }
        if (framebuffer.depthStencilTexture) {
            framebuffer.depthStencilTexture.resize(width, height);
        }
        framebuffer.destroy();
        framebuffer.initialize(new FramebufferInfo(
            framebuffer.renderPass,
            colorTexArr,
            framebuffer.depthStencilTexture,
        ));
    }

    /**
     * @en generate renderArea by camera
     * @zh 生成renderArea
     * @param camera the camera
     * @returns
     */
    public generateRenderArea (camera: Camera, out?: Rect): Rect {
        const res = out || new Rect();
        const vp = camera.viewport;
        const sceneData = this.pipelineSceneData;
        // render area is not oriented
        const swapchain = camera.window!.swapchain;
        const w = swapchain && swapchain.surfaceTransform % 2 ? camera.height : camera.width;
        const h = swapchain && swapchain.surfaceTransform % 2 ? camera.width : camera.height;
        res.x = vp.x * w;
        res.y = vp.y * h;
        res.width = vp.width * w * sceneData.shadingScale;
        res.height = vp.height * h * sceneData.shadingScale;
        return res;
    }

    public generateViewport (camera: Camera, out?: Viewport): Viewport {
        const rect = this.generateRenderArea(camera);
        const shadingScale = this.pipelineSceneData.shadingScale;
        const viewport = out || new Viewport(rect.x * shadingScale, rect.y * shadingScale, rect.width * shadingScale, rect.height * shadingScale);
        return viewport;
    }

    /**
     * @en Activate the render pipeline after loaded, it mainly activate the flows
     * @zh 当渲染管线资源加载完成后，启用管线，主要是启用管线内的 flow
     * TODO: remove swapchain dependency at this stage
     * after deferred pipeline can handle multiple swapchains
     */
    public activate (swapchain: Swapchain): boolean {
        const root = legacyCC.director.root as Root;
        this._device = root.device;
        this._generateConstantMacros();
        this._globalDSManager = new GlobalDSManager(this);
        this._descriptorSet = this._globalDSManager.globalDescriptorSet;
        this._pipelineUBO.activate(this._device, this);
        // update global defines in advance here for deferred pipeline may tryCompile shaders.
        this._macros.CC_USE_HDR = this._pipelineSceneData.isHDR;
        this._generateConstantMacros();
        this._pipelineSceneData.activate(this._device, this);

        for (let i = 0; i < this._flows.length; i++) {
            this._flows[i].activate(this);
        }

        return true;
    }

    protected _ensureEnoughSize (cameras: Camera[]) {}

    /**
     * @en Render function, it basically run the render process of all flows in sequence for the given view.
     * @zh 渲染函数，对指定的渲染视图按顺序执行所有渲染流程。
     * @param view Render view。
     */
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
                this._pipelineUBO.updateGlobalUBO(camera.window!);
                this._pipelineUBO.updateCameraUBO(camera);
                for (let j = 0; j < this._flows.length; j++) {
                    this._flows[j].render(camera);
                }
            }
        }
        this._commandBuffers[0].end();
        this._device.queue.submit(this._commandBuffers);
        this.pipelineSceneData.isShadingScale = false;
    }

    /**
     * @zh
     * 销毁四边形输入汇集器。
     */
    protected _destroyQuadInputAssembler () {
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

    protected _destroyBloomData () {
        const bloom = this._pipelineRenderData!.bloom;
        if (bloom === null || this.bloomEnabled === false) return;

        if (bloom.prefiterTex) bloom.prefiterTex.destroy();
        if (bloom.prefilterFramebuffer) bloom.prefilterFramebuffer.destroy();

        for (let i = 0; i < bloom.downsampleTexs.length; ++i) {
            bloom.downsampleTexs[i].destroy();
            bloom.downsampleFramebuffers[i].destroy();
        }
        bloom.downsampleTexs.length = 0;
        bloom.downsampleFramebuffers.length = 0;

        for (let i = 0; i < bloom.upsampleTexs.length; ++i) {
            bloom.upsampleTexs[i].destroy();
            bloom.upsampleFramebuffers[i].destroy();
        }
        bloom.upsampleTexs.length = 0;
        bloom.upsampleFramebuffers.length = 0;

        if (bloom.combineTex) bloom.combineTex.destroy();
        if (bloom.combineFramebuffer) bloom.combineFramebuffer.destroy();

        bloom.renderPass?.destroy();

        this._pipelineRenderData!.bloom = null;
    }

    private _genQuadVertexData (surfaceTransform: SurfaceTransform, renderArea: Rect) : Float32Array {
        const vbData = new Float32Array(4 * 4);

        const minX = renderArea.x / this._width;
        const maxX = (renderArea.x + renderArea.width) / this._width;
        let minY = renderArea.y / this._height;
        let maxY = (renderArea.y + renderArea.height) / this._height;
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
     * 创建四边形输入汇集器。
     */
    protected _createQuadInputAssembler (): PipelineInputAssemblerData {
        // create vertex buffer
        const inputAssemblerData = new PipelineInputAssemblerData();

        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;

        const quadVB = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
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
            MemoryUsageBit.DEVICE,
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
        const offData = this._genQuadVertexData(SurfaceTransform.IDENTITY, renderArea);
        this._quadVBOffscreen!.update(offData);

        const onData = this._genQuadVertexData(window.swapchain && window.swapchain.surfaceTransform || SurfaceTransform.IDENTITY, renderArea);
        this._quadVBOnscreen!.update(onData);
    }

    /**
     * @en Internal destroy function
     * @zh 内部销毁函数。
     */
    public destroy (): boolean {
        for (let i = 0; i < this._flows.length; i++) {
            this._flows[i].destroy();
        }
        this._flows.length = 0;

        if (this._descriptorSet) {
            this._descriptorSet.destroy();
        }

        this._globalDSManager?.destroy();

        for (let i = 0; i < this._commandBuffers.length; i++) {
            this._commandBuffers[i].destroy();
        }
        this._commandBuffers.length = 0;
        this._pipelineUBO.destroy();
        this._pipelineSceneData?.destroy();

        return super.destroy();
    }

    protected _generateConstantMacros () {
        let str = '';
        str += `#define CC_DEVICE_SUPPORT_FLOAT_TEXTURE ${this.device.hasFeature(Feature.TEXTURE_FLOAT) ? 1 : 0}\n`;
        str += `#define CC_ENABLE_CLUSTERED_LIGHT_CULLING ${this._clusterEnabled ? 1 : 0}\n`;
        str += `#define CC_DEVICE_MAX_VERTEX_UNIFORM_VECTORS ${this.device.capabilities.maxVertexUniformVectors}\n`;
        str += `#define CC_DEVICE_MAX_FRAGMENT_UNIFORM_VECTORS ${this.device.capabilities.maxFragmentUniformVectors}\n`;
        str += `#define CC_DEVICE_CAN_BENEFIT_FROM_INPUT_ATTACHMENT ${this.device.hasFeature(Feature.INPUT_ATTACHMENT_BENEFIT) ? 1 : 0}\n`;
        this._constantMacros = str;
    }

    protected _generateBloomRenderData () {
        if (this.bloomEnabled === false) return;

        const bloom = this._pipelineRenderData!.bloom = new BloomRenderData();
        const device = this.device;

        // create renderPass
        const colorAttachment = new ColorAttachment();
        colorAttachment.format = Format.BGRA8;
        colorAttachment.loadOp = LoadOp.CLEAR;
        colorAttachment.storeOp = StoreOp.STORE;
        colorAttachment.endAccesses = [AccessType.COLOR_ATTACHMENT_WRITE];
        bloom.renderPass = device.createRenderPass(new RenderPassInfo([colorAttachment]));

        let curWidth = this._width;
        let curHeight = this._height;

        // prefilter
        bloom.prefiterTex = device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
            Format.BGRA8,
            curWidth >> 1,
            curHeight >> 1,
        ));
        bloom.prefilterFramebuffer = device.createFramebuffer(new FramebufferInfo(
            bloom.renderPass,
            [bloom.prefiterTex],
        ));

        // downsample & upsample
        curWidth >>= 1;
        curHeight >>= 1;
        for (let i = 0; i < MAX_BLOOM_FILTER_PASS_NUM; ++i) {
            bloom.downsampleTexs.push(device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                Format.BGRA8,
                curWidth >> 1,
                curHeight >> 1,
            )));
            bloom.downsampleFramebuffers[i] = device.createFramebuffer(new FramebufferInfo(
                bloom.renderPass,
                [bloom.downsampleTexs[i]],
            ));

            bloom.upsampleTexs.push(device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                Format.BGRA8,
                curWidth,
                curHeight,
            )));
            bloom.upsampleFramebuffers[i] = device.createFramebuffer(new FramebufferInfo(
                bloom.renderPass,
                [bloom.upsampleTexs[i]],
            ));

            curWidth >>= 1;
            curHeight >>= 1;
        }

        // combine
        bloom.combineTex = device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
            Format.BGRA8,
            this._width,
            this._height,
        ));
        bloom.combineFramebuffer = device.createFramebuffer(new FramebufferInfo(
            bloom.renderPass,
            [bloom.combineTex],
        ));

        // sampler
        const samplerInfo = new SamplerInfo(
            Filter.LINEAR,
            Filter.LINEAR,
            Filter.NONE,
            Address.CLAMP,
            Address.CLAMP,
            Address.CLAMP,
        );
        bloom.sampler = device.getSampler(samplerInfo);
    }
}

// Do not delete, for the class detection of editor
legacyCC.RenderPipeline = RenderPipeline;
