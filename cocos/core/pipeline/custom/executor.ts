/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
/* eslint-disable max-len */
import { getPhaseID, InstancedBuffer, PipelineStateManager } from '..';
import { assert } from '../..';
import { AABB } from '../../geometry/aabb';
import intersect from '../../geometry/intersect';
import { Sphere } from '../../geometry/sphere';
import { AccessFlagBit, Attribute, Buffer, BufferInfo, BufferUsageBit, BufferViewInfo, ClearFlagBit, Color, ColorAttachment, CommandBuffer, DepthStencilAttachment, DescriptorSet, DescriptorSetInfo, Device, deviceManager, Format, Framebuffer,
    FramebufferInfo, GeneralBarrierInfo, InputAssemblerInfo, LoadOp, MemoryUsageBit, PipelineState, Rect, RenderPass, RenderPassInfo, Sampler, SamplerInfo, Shader, StoreOp, SurfaceTransform, Swapchain, Texture, TextureInfo,
    TextureType, TextureUsageBit, Viewport } from '../../gfx';
import { legacyCC } from '../../global-exports';
import { Mat4 } from '../../math/mat4';
import { Vec3 } from '../../math/vec3';
import { Vec4 } from '../../math/vec4';
import { BatchingSchemes, Pass } from '../../renderer';
import { DirectionalLight, SpotLight } from '../../renderer/scene';
import { Camera, SKYBOX_FLAG } from '../../renderer/scene/camera';
import { Light, LightType } from '../../renderer/scene/light';
import { Model } from '../../renderer/scene/model';
import { CSMLevel, CSMOptimizationMode, ShadowType } from '../../renderer/scene/shadows';
import { SubModel } from '../../renderer/scene/submodel';
import { Root } from '../../root';
import { BatchedBuffer } from '../batched-buffer';
import { RenderPassStage, SetIndex, UBODeferredLight, UBOForwardLight, UBOLocal } from '../define';
import { PipelineSceneData } from '../pipeline-scene-data';
import { PipelineInputAssemblerData } from '../render-pipeline';
import { ShadowLayerVolume } from '../shadow/csm-layers';
import { LayoutGraph, LayoutGraphData, LayoutGraphDataVisitor, LayoutGraphVisitor, PipelineLayoutData, RenderPhase, RenderPhaseData, RenderStageData } from './layout-graph';
import { Pipeline, SceneVisitor } from './pipeline';
import { Blit, ClearView, ComputePass, CopyPass, Dispatch, ManagedResource, MovePass, PresentPass,
    RasterPass, RaytracePass, RenderData, RenderGraph, RenderGraphValue, RenderGraphVisitor, RenderQueue, RenderSwapchain, ResourceDesc,
    ResourceGraph, ResourceGraphVisitor, ResourceTraits, SceneData } from './render-graph';
import { AttachmentType, ComputeView, QueueHint, ResourceDimension, ResourceFlags, SceneFlags, UpdateFrequency } from './types';
import { PipelineUBO } from '../pipeline-ubo';
import { RenderInfo, RenderObject, WebSceneTask, WebSceneTransversal } from './web-scene';
import { WebSceneVisitor } from './web-scene-visitor';
import { stringify, parse } from './utils';
import { RenderAdditiveLightQueue } from '../render-additive-light-queue';
import { RenderShadowMapBatchedQueue } from '../render-shadow-map-batched-queue';
import { renderProfiler } from '../pipeline-funcs';
import { PlanarShadowQueue } from '../planar-shadow-queue';

class DeviceResource {
    protected _context: ExecutorContext;
    protected _name: string;
    constructor (name: string, context: ExecutorContext) {
        this._context = context;
        this._name = name;
    }
    get context () { return this._context; }
    get name () { return this._name; }
}
class DeviceTexture extends DeviceResource {
    protected _texture: Texture | null = null;
    protected _swapchain: Swapchain | null = null;
    protected _framebuffer: Framebuffer | null = null;
    protected _desc: ResourceDesc | null = null;
    protected _trait: ResourceTraits | null = null;
    get texture () { return this._texture; }
    get framebuffer () { return this._framebuffer; }
    get description () { return this._desc; }
    get trait () { return this._trait; }
    get swapchain () { return this._swapchain; }
    constructor (name: string, tex: Texture | Framebuffer | RenderSwapchain | ManagedResource, context: ExecutorContext) {
        super(name, context);
        const resGraph = context.resourceGraph;
        const verID = resGraph.vertex(name);
        this._desc = resGraph.getDesc(verID);
        this._trait = resGraph.getTraits(verID);
        if (tex instanceof Texture) {
            this._texture = tex;
            return;
        }
        if (tex instanceof Framebuffer) {
            this._framebuffer = tex;
            return;
        }
        if (tex instanceof RenderSwapchain) {
            this._swapchain = tex.swapchain;
            return;
        }

        const info = this._desc;
        let type = TextureType.TEX2D;

        switch (info.dimension) {
        case ResourceDimension.TEXTURE1D:
            type = TextureType.TEX1D;
            break;
        case ResourceDimension.TEXTURE2D:
            type = TextureType.TEX2D;
            break;
        case ResourceDimension.TEXTURE3D:
            type = TextureType.TEX3D;
            break;
        default:
        }
        let usageFlags = TextureUsageBit.NONE;
        if (info.flags & ResourceFlags.COLOR_ATTACHMENT) usageFlags |= TextureUsageBit.COLOR_ATTACHMENT;
        if (info.flags & ResourceFlags.DEPTH_STENCIL_ATTACHMENT) usageFlags |= TextureUsageBit.DEPTH_STENCIL_ATTACHMENT;
        if (info.flags & ResourceFlags.INPUT_ATTACHMENT) usageFlags |= TextureUsageBit.INPUT_ATTACHMENT;
        if (info.flags & ResourceFlags.SAMPLED) usageFlags |= TextureUsageBit.SAMPLED;
        if (info.flags & ResourceFlags.STORAGE) usageFlags |= TextureUsageBit.STORAGE;

        this._texture = context.device.createTexture(new TextureInfo(
            type,
            usageFlags,
            info.format,
            info.width,
            info.height,
        ));
    }

    release () {
        if (this.framebuffer) {
            this.framebuffer.destroy();
            this._framebuffer = null;
        }
        if (this.texture) {
            this.texture.destroy();
            this._texture = null;
        }
    }
}

class DeviceBuffer extends DeviceResource {
    constructor (name: string, context: ExecutorContext) {
        super(name, context);
    }
}

class BlitDesc {
    private _blit: Blit;
    private _screenQuad: PipelineInputAssemblerData | null = null;
    private _queue: DeviceRenderQueue | null = null;
    private _stageDesc: DescriptorSet | null = null;
    // If VOLUMETRIC_LIGHTING is turned on, it needs to be assigned
    private _lightVolumeBuffer: Buffer | null = null;
    private _lightMeterScale = 10000.0;
    private _lightBufferData!: Float32Array;
    get screenQuad () { return this._screenQuad; }
    get blit () { return this._blit; }
    set blit (blit: Blit) { this._blit = blit; }
    get stageDesc () { return this._stageDesc; }
    constructor (blit: Blit, queue: DeviceRenderQueue) {
        this._blit = blit;
        this._queue = queue;
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
        const device = this._queue!.devicePass.context.device;
        const quadVB = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE | MemoryUsageBit.HOST,
            vbSize,
            vbStride,
        ));

        if (!quadVB) {
            return inputAssemblerData;
        }

        // create index buffer
        const ibStride = Uint8Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        const quadIB = device.createBuffer(new BufferInfo(
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

        const quadIA = device.createInputAssembler(new InputAssemblerInfo(
            attributes,
            [quadVB],
            quadIB,
        ));

        inputAssemblerData.quadIB = quadIB;
        inputAssemblerData.quadVB = quadVB;
        inputAssemblerData.quadIA = quadIA;
        return inputAssemblerData;
    }
    createSreenQuad () {
        if (!this._screenQuad) {
            this._screenQuad = this._createQuadInputAssembler();
        }
    }
    private _updateScreenVB () {
        const devicePass = this._queue!.devicePass;
        const width = devicePass.context.width;
        const height = devicePass.context.height;
        const vb = devicePass.genQuadVertexData(SurfaceTransform.IDENTITY, new Rect(0, 0, width, height));
        this._screenQuad!.quadVB!.update(vb);
    }
    private _gatherVolumeLights (camera: Camera) {
        if (!camera.scene) { return; }
        const context = this._queue!.devicePass.context;
        const pipeline = context.pipeline;
        const cmdBuff = context.commandBuffer;

        const sphereLights = camera.scene.sphereLights;
        const spotLights = camera.scene.spotLights;
        const _sphere = Sphere.create(0, 0, 0, 1);
        const _vec4Array = new Float32Array(4);
        const exposure = camera.exposure;

        let idx = 0;
        const maxLights = UBODeferredLight.LIGHTS_PER_PASS;
        const elementLen = Vec4.length; // sizeof(vec4) / sizeof(float32)
        const fieldLen = elementLen * maxLights;

        for (let i = 0; i < sphereLights.length && idx < maxLights; i++, ++idx) {
            const light = sphereLights[i];
            Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphereFrustum(_sphere, camera.frustum)) {
                // cc_lightPos
                Vec3.toArray(_vec4Array, light.position);
                _vec4Array[3] = 0;
                this._lightBufferData.set(_vec4Array, idx * elementLen);

                // cc_lightColor
                Vec3.toArray(_vec4Array, light.color);
                if (light.useColorTemperature) {
                    const tempRGB = light.colorTemperatureRGB;
                    _vec4Array[0] *= tempRGB.x;
                    _vec4Array[1] *= tempRGB.y;
                    _vec4Array[2] *= tempRGB.z;
                }

                if (pipeline.pipelineSceneData.isHDR) {
                    _vec4Array[3] = light.luminance * exposure * this._lightMeterScale;
                } else {
                    _vec4Array[3] = light.luminance;
                }

                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 1);

                // cc_lightSizeRangeAngle
                _vec4Array[0] = light.size;
                _vec4Array[1] = light.range;
                _vec4Array[2] = 0.0;
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 2);
            }
        }

        for (let i = 0; i < spotLights.length && idx < maxLights; i++, ++idx) {
            const light = spotLights[i];
            Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphereFrustum(_sphere, camera.frustum)) {
                // cc_lightPos
                Vec3.toArray(_vec4Array, light.position);
                _vec4Array[3] = 1;
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 0);

                // cc_lightColor
                Vec3.toArray(_vec4Array, light.color);
                if (light.useColorTemperature) {
                    const tempRGB = light.colorTemperatureRGB;
                    _vec4Array[0] *= tempRGB.x;
                    _vec4Array[1] *= tempRGB.y;
                    _vec4Array[2] *= tempRGB.z;
                }
                if (pipeline.pipelineSceneData.isHDR) {
                    _vec4Array[3] = light.luminance * exposure * this._lightMeterScale;
                } else {
                    _vec4Array[3] = light.luminance;
                }
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 1);

                // cc_lightSizeRangeAngle
                _vec4Array[0] = light.size;
                _vec4Array[1] = light.range;
                _vec4Array[2] = light.spotAngle;
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 2);

                // cc_lightDir
                Vec3.toArray(_vec4Array, light.direction);
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 3);
            }
        }

        // the count of lights is set to cc_lightDir[0].w
        const offset = fieldLen * 3 + 3;
        this._lightBufferData.set([idx], offset);

        cmdBuff.updateBuffer(this._lightVolumeBuffer!, this._lightBufferData);
    }
    update () {
        this._updateScreenVB();
        if (this.blit.sceneFlags & SceneFlags.VOLUMETRIC_LIGHTING
            && this.blit.camera) {
            this._gatherVolumeLights(this.blit.camera);
        }
        this._stageDesc!.update();
    }

    createStageDescriptor () {
        if (this._stageDesc) {
            return;
        }
        const pass = this.blit.material!.passes[0];
        const device = this._queue!.devicePass.context.device;
        this._stageDesc = device.createDescriptorSet(new DescriptorSetInfo(pass.localSetLayout));
        if (this.blit.sceneFlags & SceneFlags.VOLUMETRIC_LIGHTING) {
            let totalSize = Float32Array.BYTES_PER_ELEMENT * 4 * 4 * UBODeferredLight.LIGHTS_PER_PASS;
            totalSize = Math.ceil(totalSize / device.capabilities.uboOffsetAlignment) * device.capabilities.uboOffsetAlignment;

            this._lightVolumeBuffer = device.createBuffer(new BufferInfo(
                BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                totalSize,
                device.capabilities.uboOffsetAlignment,
            ));

            const deferredLitsBufView = device.createBuffer(new BufferViewInfo(this._lightVolumeBuffer, 0, totalSize));
            this._lightBufferData = new Float32Array(totalSize / Float32Array.BYTES_PER_ELEMENT);
            this._stageDesc.bindBuffer(UBOForwardLight.BINDING, deferredLitsBufView);
        }
        const _localUBO = device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
            UBOLocal.SIZE,
            UBOLocal.SIZE,
        ));
        this._stageDesc.bindBuffer(UBOLocal.BINDING, _localUBO);
    }
}

class DeviceRenderQueue {
    private _preSceneTasks: DevicePreSceneTask[] = [];
    private _sceneTasks: DeviceSceneTask[] = [];
    private _postSceneTasks: DevicePostSceneTask[] = [];
    private _devicePass: DeviceRenderPass;
    private _hint: QueueHint =  QueueHint.NONE;
    private _phaseID = getPhaseID('default');
    private _renderPhase: RenderPhaseData | null = null;
    protected _transversal: DeviceSceneTransversal | null = null;
    get phaseID (): number { return this._phaseID; }
    get renderPhase (): RenderPhaseData | null { return this._renderPhase; }
    set renderPhase (val) { this._renderPhase = val; }
    private _sceneVisitor: WebSceneVisitor;
    private _blitDesc: BlitDesc | null = null;
    private _queueId = -1;
    set queueId (val) { this._queueId = val; }
    get queueId () { return this._queueId; }
    constructor (devicePass: DeviceRenderPass) {
        this._devicePass = devicePass;
        this._sceneVisitor = new WebSceneVisitor(this._devicePass.context.commandBuffer,
            this._devicePass.context.pipeline.pipelineSceneData);
    }
    createBlitDesc (blit: Blit) {
        if (this._blitDesc) {
            return;
        }
        this._blitDesc = new BlitDesc(blit, this);
        this._blitDesc.createSreenQuad();
        this._blitDesc.createStageDescriptor();
    }
    addSceneTask (scene: GraphScene): void {
        if (!this._transversal) {
            this._transversal = new DeviceSceneTransversal(this, this.devicePass.context.pipelineSceneData,  scene);
        }
        this._preSceneTasks.push(this._transversal.preRenderPass(this._sceneVisitor));
        this._sceneTasks.push(this._transversal.transverse(this._sceneVisitor));
    }
    clearTasks () {
        this._sceneTasks.length = 0;
    }
    get blitDesc () { return this._blitDesc; }
    get sceneTasks () { return this._sceneTasks; }
    set queueHint (value: QueueHint) { this._hint = value; }
    get queueHint () { return this._hint; }
    get devicePass () { return this._devicePass; }
    preRecord () {
        for (const task of this._preSceneTasks) {
            task.start();
            task.join();
            task.submit();
        }
    }

    record () {
        for (const task of this._sceneTasks) {
            task.start();
            task.join();
            task.submit();
        }
    }

    postRecord () {
        for (const task of this._postSceneTasks) {
            task.start();
            task.join();
            task.submit();
        }
    }
}

class SubmitInfo {
    public instances = new Set<InstancedBuffer>();
    public batches = new Set<BatchedBuffer>();
    public opaqueList: RenderInfo[] = [];
    public transparentList: RenderInfo[] = [];
    public planarQueue: PlanarShadowQueue | null = null;
    public shadowMap: RenderShadowMapBatchedQueue | null = null;
    public additiveLight: RenderAdditiveLightQueue | null = null;
}

class RenderPassLayoutInfo {
    protected _layoutID = 0;
    protected _stage: RenderStageData | null = null;
    protected _layout: PipelineLayoutData;
    protected _context: ExecutorContext;
    protected _inputName: string;
    protected _descriptorSet: DescriptorSet | null = null;
    constructor (layoutId, input: [string, ComputeView[]], context: ExecutorContext) {
        this._inputName = input[0];
        this._layoutID = layoutId;
        const lg = context.layoutGraph;
        this._stage = lg.getRenderStage(layoutId);
        this._context = context;
        this._layout = lg.getLayout(layoutId);
        const layoutData = this._layout.descriptorSets.get(UpdateFrequency.PER_PASS);
        if (layoutData) {
            // find resource
            const deviceTex = context.deviceTextures.get(this._inputName);
            const gfxTex = deviceTex?.texture;
            if (!gfxTex) {
                throw Error(`Could not find texture with resource name ${this._inputName}`);
            }
            // bind descriptors
            for (const descriptor of input[1]) {
                const descriptorName = descriptor.name;
                const descriptorID = lg.attributeIndex.get(descriptorName);
                // find descriptor binding
                for (const block of layoutData.descriptorSetLayoutData.descriptorBlocks) {
                    for (let i = 0; i !== block.descriptors.length; ++i) {
                        if (descriptorID === block.descriptors[i].descriptorID) {
                            layoutData.descriptorSet!.bindTexture(block.offset + i, gfxTex);
                            layoutData.descriptorSet!.bindSampler(block.offset + i, context.device.getSampler(new SamplerInfo()));
                            if (!this._descriptorSet) this._descriptorSet = layoutData.descriptorSet;
                        }
                    }
                }
            }
        }
    }
    get descriptorSet () { return this._descriptorSet; }
    get layoutID () { return this._layoutID; }
    get stage () { return this._stage; }
    get layout () { return this._layout; }
}

class RasterPassInfo {
    protected _id: number;
    protected _pass: RasterPass;
    constructor (id, pass) {
        this._id = id;
        this._pass = pass;
    }
    get id () { return this._id; }
    get pass () { return this._pass; }
    applyInfo (id: number, pass: RasterPass) {
        this._id = id;
        this._pass = pass;
    }
}

class DeviceRenderPass {
    protected _renderPass: RenderPass;
    protected _framebuffer: Framebuffer;
    protected _clearColor: Color[] = [];
    protected _deviceQueues: DeviceRenderQueue[] = [];
    protected _clearDepth = 1;
    protected _clearStencil = 0;
    protected _context: ExecutorContext;
    protected _viewport: Viewport | null = null;
    private _rasterInfo: RasterPassInfo;
    private _layout: RenderPassLayoutInfo | null = null;
    public submitMap: Map<Camera, SubmitInfo> = new Map<Camera, SubmitInfo>();
    constructor (context: ExecutorContext, passInfo: RasterPassInfo) {
        this._context = context;
        this._rasterInfo = passInfo;
        const device = context.device;
        const depthStencilAttachment = new DepthStencilAttachment();
        depthStencilAttachment.format = Format.DEPTH_STENCIL;
        depthStencilAttachment.depthLoadOp = LoadOp.DISCARD;
        depthStencilAttachment.stencilLoadOp = LoadOp.DISCARD;
        depthStencilAttachment.stencilStoreOp = StoreOp.DISCARD;
        depthStencilAttachment.depthStoreOp = StoreOp.DISCARD;

        const colors: ColorAttachment[] = [];
        const colorTexs: Texture[] = [];
        let depthTex: Texture | null = null;
        let swapchain: Swapchain | null = null;
        let framebuffer: Framebuffer | null = null;
        for (const cv of passInfo.pass.computeViews) {
            this._applyRenderLayout(cv);
        }
        // update the layout descriptorSet
        if (this.renderLayout && this.renderLayout.descriptorSet) {
            this.renderLayout.descriptorSet.update();
        }
        for (const [resName, rasterV] of passInfo.pass.rasterViews) {
            let resTex = context.deviceTextures.get(resName);
            if (!resTex) {
                const resourceGraph = context.resourceGraph;
                const vertId = resourceGraph.vertex(resName);
                const resourceVisitor = new ResourceVisitor(resName, context);
                resourceGraph.visitVertex(resourceVisitor, vertId);
                resTex = context.deviceTextures.get(resName)!;
            }
            if (!swapchain) swapchain = resTex.swapchain;
            if (!framebuffer) framebuffer = resTex.framebuffer;
            const clearFlag = rasterV.clearFlags & 0xffffffff;
            switch (rasterV.attachmentType) {
            case AttachmentType.RENDER_TARGET:
                {
                    if (!resTex.swapchain && !resTex.framebuffer) colorTexs.push(resTex.texture!);
                    const colorAttachment = new ColorAttachment();
                    colorAttachment.format = resTex.description!.format;
                    colorAttachment.sampleCount = resTex.description!.sampleCount;
                    colorAttachment.loadOp = rasterV.loadOp;
                    colorAttachment.storeOp = rasterV.storeOp;
                    colorAttachment.barrier = device.getGeneralBarrier(new GeneralBarrierInfo(
                        rasterV.loadOp === LoadOp.LOAD ? AccessFlagBit.COLOR_ATTACHMENT_WRITE : AccessFlagBit.NONE,
                        rasterV.storeOp === StoreOp.STORE ? AccessFlagBit.COLOR_ATTACHMENT_WRITE : AccessFlagBit.NONE,
                    ));
                    this._clearColor.push(rasterV.clearColor);
                    colors.push(colorAttachment);
                }
                break;
            case AttachmentType.DEPTH_STENCIL:
                depthStencilAttachment.depthStoreOp = rasterV.storeOp;
                depthStencilAttachment.stencilStoreOp = rasterV.storeOp;
                depthStencilAttachment.depthLoadOp = rasterV.loadOp;
                depthStencilAttachment.stencilLoadOp = rasterV.loadOp;
                depthStencilAttachment.barrier = device.getGeneralBarrier(new GeneralBarrierInfo(
                    rasterV.loadOp === LoadOp.LOAD ? AccessFlagBit.DEPTH_STENCIL_ATTACHMENT_WRITE : AccessFlagBit.NONE,
                    rasterV.storeOp === StoreOp.STORE ? AccessFlagBit.DEPTH_STENCIL_ATTACHMENT_WRITE : AccessFlagBit.NONE,
                ));
                if (!resTex.swapchain && !resTex.framebuffer) depthTex = resTex.texture!;
                this._clearDepth = rasterV.clearColor.x;
                this._clearStencil = rasterV.clearColor.y;
                break;
            default:
            }
        }
        if (colors.length === 0) {
            const colorAttachment = new ColorAttachment();
            colors.push(colorAttachment);
        }
        if (colorTexs.length === 0 && !swapchain && !framebuffer) {
            const currTex = device.createTexture(new TextureInfo());
            colorTexs.push(currTex);
        }
        // if (!depthTex && !swapchain && !framebuffer) {
        //     depthTex = device.createTexture(new TextureInfo(
        //         TextureType.TEX2D,
        //         TextureUsageBit.DEPTH_STENCIL_ATTACHMENT | TextureUsageBit.SAMPLED,
        //         Format.DEPTH_STENCIL,
        //         colorTexs[0].width,
        //         colorTexs[0].height,
        //     ));
        // }
        this._renderPass = device.createRenderPass(new RenderPassInfo(colors, depthStencilAttachment));
        this._framebuffer = framebuffer || device.createFramebuffer(new FramebufferInfo(this._renderPass,
            swapchain ? [swapchain.colorTexture] : colorTexs,
            swapchain ? swapchain.depthStencilTexture : depthTex));
    }
    get renderLayout () { return this._layout; }
    get context () { return this._context; }
    get renderPass () { return this._renderPass; }
    get framebuffer () { return this._framebuffer; }
    get clearColor () { return this._clearColor; }
    get clearDepth () { return this._clearDepth; }
    get clearStencil () { return this._clearStencil; }
    get deviceQueues () { return this._deviceQueues; }
    get rasterPassInfo () { return this._rasterInfo; }
    get viewport () { return this._viewport; }
    addQueue (queue: DeviceRenderQueue) { this._deviceQueues.push(queue); }
    prePass () {
        for (const queue of this._deviceQueues) {
            queue.preRecord();
        }
    }
    protected _applyRenderLayout (input: [string, ComputeView[]]) {
        const stageName = this._context.renderGraph.getLayout(this.rasterPassInfo.id);
        if (stageName) {
            const layoutGraph = this._context.layoutGraph;
            const stageId = layoutGraph.locateChild(layoutGraph.nullVertex(), stageName);
            if (stageId !== 0xFFFFFFFF) {
                this._layout = new RenderPassLayoutInfo(stageId, input, this._context);
            }
        }
    }
    genQuadVertexData (surfaceTransform: SurfaceTransform, renderArea: Rect) : Float32Array {
        const vbData = new Float32Array(4 * 4);

        const minX = renderArea.x / this._context.width;
        const maxX = (renderArea.x + renderArea.width) / this._context.width;
        let minY = renderArea.y / this._context.height;
        let maxY = (renderArea.y + renderArea.height) / this._context.height;
        if (this._context.root.device.capabilities.screenSpaceSignY > 0) {
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

    protected _applyViewport (frameTex: Texture) {
        this._viewport = null;
        const viewport = this._rasterInfo.pass.viewport;
        if (viewport.left !== 0 || viewport.top !== 0
            || viewport.width !== frameTex.width
            || viewport.height !== frameTex.height) {
            this._viewport = viewport;
        }
    }
    // record common buffer
    record () {
        const tex = this.framebuffer.colorTextures[0]!;
        this._applyViewport(tex);
        const cmdBuff = this._context.commandBuffer;
        const renderArea = this._viewport ? new Rect(this._viewport.left, this._viewport.top, this._viewport.width, this._viewport.height)
            :  new Rect(0, 0, tex.width, tex.height);
        cmdBuff.beginRenderPass(this.renderPass, this.framebuffer, renderArea,
            this.clearColor, this.clearDepth, this.clearStencil);
        const stageId = this.context.layoutGraph.locateChild(this.context.layoutGraph.nullVertex(), 'default');
        assert(stageId !== 0xFFFFFFFF);
        const layout = this.context.layoutGraph.getLayout(stageId);
        const layoutData = layout.descriptorSets.get(UpdateFrequency.PER_PASS);
        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL,
            layoutData!.descriptorSet!);
        for (const queue of this._deviceQueues) {
            queue.record();
        }
        cmdBuff.endRenderPass();
    }
    postPass () {
        this.submitMap.clear();
        for (const queue of this._deviceQueues) {
            queue.postRecord();
        }
    }
    resetQueues (id: number, pass: RasterPass) {
        this._rasterInfo.applyInfo(id, pass);
        this._deviceQueues.length = 0;
    }
}

class DeviceSceneTransversal extends WebSceneTransversal {
    protected _currentQueue: DeviceRenderQueue;
    protected _graphScene: GraphScene;
    constructor (quque: DeviceRenderQueue, sceneData: PipelineSceneData, graphSceneData: GraphScene) {
        const camera = graphSceneData.scene ? graphSceneData.scene.camera : null;
        super(camera, sceneData, quque.devicePass.context.ubo);
        this._currentQueue = quque;
        this._graphScene = graphSceneData;
    }
    get graphScene () { return this._graphScene; }
    public preRenderPass (visitor: WebSceneVisitor): DevicePreSceneTask {
        return new DevicePreSceneTask(this._currentQueue, this._graphScene, visitor);
    }
    public transverse (visitor: WebSceneVisitor): DeviceSceneTask {
        return new DeviceSceneTask(this._currentQueue, this._graphScene, visitor);
    }
    public postRenderPass (visitor: WebSceneVisitor): DevicePostSceneTask {
        return new DevicePostSceneTask(this._sceneData, this._currentQueue.devicePass.context.ubo, this._camera, visitor);
    }
}
class GraphScene {
    scene: SceneData | null = null;
    blit: Blit | null = null;
    dispatch: Dispatch | null = null;
    sceneID = -1;
}
class DevicePreSceneTask extends WebSceneTask {
    protected _currentQueue: DeviceRenderQueue;
    protected _renderPass: RenderPass;
    protected _submitInfo: SubmitInfo | null = null;
    protected _graphScene: GraphScene;
    private _cmdBuff: CommandBuffer;
    constructor (queue: DeviceRenderQueue, graphScene: GraphScene, visitor: SceneVisitor) {
        super(queue.devicePass.context.pipelineSceneData, queue.devicePass.context.ubo,
            graphScene.scene && graphScene.scene.camera ? graphScene.scene.camera : null, visitor);
        this._currentQueue = queue;
        this._graphScene = graphScene;
        this._renderPass = this._currentQueue.devicePass.renderPass;
        this._cmdBuff = queue.devicePass.context.commandBuffer;
    }
    get graphScene () { return this._graphScene; }

    public start () {
        if (this.graphScene.blit) {
            this._currentQueue.createBlitDesc(this.graphScene.blit);
            return;
        }
        if (!this.camera) {
            return;
        }
        const submitMap = this._currentQueue.devicePass.submitMap;
        if (submitMap.has(this.camera)) {
            this._submitInfo = submitMap.get(this.camera)!;
        } else {
            // culling
            if (!this._isShadowMap() || (this._isShadowMap() && this.graphScene.scene!.light.level === 0)) super.start();
            this._submitInfo = new SubmitInfo();
            submitMap.set(this.camera, this._submitInfo);
        }
        // shadowmap
        if (this._isShadowMap() && !this._submitInfo.shadowMap) {
            assert(this.graphScene.scene!.light.light);
            this._submitInfo.shadowMap = new RenderShadowMapBatchedQueue(this._currentQueue.devicePass.context.pipeline);
            this._submitInfo.shadowMap.gatherLightPasses(this.camera, this.graphScene.scene!.light.light, this._cmdBuff, this.graphScene.scene!.light.level);
            this.sceneData.shadowFrameBufferMap.set(this.graphScene.scene!.light.light, this._currentQueue.devicePass.framebuffer);
            return;
        }
        const sceneFlag = this._graphScene.scene!.flags;
        for (const ro of this.sceneData.renderObjects) {
            const subModels = ro.model.subModels;
            for (const submodel of subModels) {
                const passes = submodel.passes;
                for (const p of passes) {
                    if (p.phase !== this._currentQueue.phaseID) continue;
                    const batchingScheme = p.batchingScheme;
                    // If the size of instances is not 0, it has been added
                    if (batchingScheme === BatchingSchemes.INSTANCING
                        && !this._submitInfo.instances.size) {
                        const instancedBuffer = p.getInstancedBuffer();
                        instancedBuffer.merge(submodel, ro.model.instancedAttributes, passes.indexOf(p));
                        this._submitInfo.instances.add(instancedBuffer);
                    } else if (batchingScheme === BatchingSchemes.VB_MERGING
                        && !this._submitInfo.batches.size) {
                        const batchedBuffer = p.getBatchedBuffer();
                        batchedBuffer.merge(submodel, passes.indexOf(p), ro.model);
                        this._submitInfo.batches.add(batchedBuffer);
                    } else if ((sceneFlag & SceneFlags.TRANSPARENT_OBJECT)
                    && (sceneFlag & SceneFlags.OPAQUE_OBJECT || sceneFlag & SceneFlags.OPAQUE_OBJECT)) {
                        this._insertRenderList(ro, subModels.indexOf(submodel), passes.indexOf(p));
                        this._insertRenderList(ro, subModels.indexOf(submodel), passes.indexOf(p), true);
                    } else if ((sceneFlag & SceneFlags.CUTOUT_OBJECT) || (sceneFlag & SceneFlags.OPAQUE_OBJECT)) {
                        this._insertRenderList(ro, subModels.indexOf(submodel), passes.indexOf(p));
                    } else if (sceneFlag & SceneFlags.TRANSPARENT_OBJECT) {
                        this._insertRenderList(ro, subModels.indexOf(submodel), passes.indexOf(p), true);
                    }
                }
            }
        }
        const pipeline = this._currentQueue.devicePass.context.pipeline;
        if (sceneFlag & SceneFlags.DEFAULT_LIGHTING) {
            this._submitInfo.additiveLight = new RenderAdditiveLightQueue(pipeline);
            this._submitInfo.additiveLight.gatherLightPasses(this.camera, this._cmdBuff);
        }
        if (sceneFlag & SceneFlags.PLANAR_SHADOW) {
            this._submitInfo.planarQueue = new PlanarShadowQueue(pipeline);
            this._submitInfo.planarQueue.gatherShadowPasses(this.camera, this._cmdBuff);
        }
        this._submitInfo.opaqueList.sort(this._opaqueCompareFn);
        this._submitInfo.transparentList.sort(this._transparentCompareFn);
    }
    protected _insertRenderList (ro: RenderObject, subModelIdx: number, passIdx: number, isTransparent = false) {
        const subModel = ro.model.subModels[subModelIdx];
        const pass = subModel.passes[passIdx];
        const shader = subModel.shaders[passIdx];
        const currTransparent = pass.blendState.targets[0].blend;
        const phases = getPhaseID('default') | getPhaseID('planarShadow');
        if (currTransparent !== isTransparent || !(pass.phase & (isTransparent ? phases : this._currentQueue.phaseID))) {
            return;
        }
        const hash = (0 << 30) | pass.priority << 16 | subModel.priority << 8 | passIdx;
        const rp = new RenderInfo();
        rp.priority = ro.model.priority;
        rp.hash = hash;
        rp.depth = ro.depth || 0;
        rp.shaderId = shader.typedID;
        rp.subModel = subModel;
        rp.passIdx = passIdx;
        if (isTransparent) this._submitInfo!.transparentList.push(rp);
        else this._submitInfo!.opaqueList.push(rp);
    }

    /**
     * @en Comparison sorting function. Opaque objects are sorted by priority -> depth front to back -> shader ID.
     * @zh 比较排序函数。不透明对象按优先级 -> 深度由前向后 -> Shader ID 顺序排序。
     */
    protected _opaqueCompareFn (a: RenderInfo, b: RenderInfo) {
        return (a.hash - b.hash) || (a.depth - b.depth) || (a.shaderId - b.shaderId);
    }
    /**
     * @en Comparison sorting function. Transparent objects are sorted by priority -> depth back to front -> shader ID.
     * @zh 比较排序函数。半透明对象按优先级 -> 深度由后向前 -> Shader ID 顺序排序。
     */
    protected _transparentCompareFn (a: RenderInfo, b: RenderInfo) {
        return (a.priority - b.priority) || (a.hash - b.hash) || (b.depth - a.depth) || (a.shaderId - b.shaderId);
    }

    private _uploadInstanceBuffers () {
        const it = this._submitInfo!.instances.values(); let res = it.next();
        while (!res.done) {
            if (res.value.hasPendingModels) res.value.uploadBuffers(this._cmdBuff);
            res = it.next();
        }
    }

    private _uploadBatchedBuffers () {
        const it = this._submitInfo!.batches.values(); let res = it.next();
        while (!res.done) {
            for (let b = 0; b < res.value.batches.length; ++b) {
                const batch = res.value.batches[b];
                if (!batch.mergeCount) { continue; }
                for (let v = 0; v < batch.vbs.length; ++v) {
                    batch.vbs[v].update(batch.vbDatas[v]);
                }
                this._cmdBuff.updateBuffer(batch.vbIdx, batch.vbIdxData.buffer);
                this._cmdBuff.updateBuffer(batch.ubo, batch.uboData);
            }
            res = it.next();
        }
    }

    private _isShadowMap () {
        return this.sceneData.shadows.enabled
            && this.sceneData.shadows.type === ShadowType.ShadowMap
            && this.graphScene.scene!.flags & SceneFlags.SHADOW_CASTER;
    }

    private _bindDescriptor (context: ExecutorContext, descId: number, value) {
        const layoutData = this._getGlobalDescData(context)!;
        // find descriptor binding
        for (const block of layoutData.descriptorSetLayoutData.descriptorBlocks) {
            for (let i = 0; i !== block.descriptors.length; ++i) {
                if (descId === block.descriptors[i].descriptorID) {
                    if (value instanceof Buffer) layoutData.descriptorSet!.bindBuffer(block.offset + i, value);
                    else if (value instanceof Texture) layoutData.descriptorSet!.bindTexture(block.offset + i, value);
                    else if (value instanceof Sampler) layoutData.descriptorSet!.bindSampler(block.offset + i, value);
                }
            }
        }
    }

    private _getGlobalDescData (context: ExecutorContext) {
        const stageId = context.layoutGraph.locateChild(context.layoutGraph.nullVertex(), 'default');
        assert(stageId !== 0xFFFFFFFF);
        const layout = context.layoutGraph.getLayout(stageId);
        const layoutData = layout.descriptorSets.get(UpdateFrequency.PER_PASS)!;
        return layoutData;
    }

    protected _updateGlobal (context: ExecutorContext, data: RenderData) {
        const constants = data.constants;
        const samplers = data.samplers;
        const textures = data.textures;
        const device = context.root.device;
        for (const [key, value] of constants) {
            const buffer = device.createBuffer(new BufferInfo(BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                value.length * 4,
                value.length * 4));
            buffer.update(new Float32Array(value));
            this._bindDescriptor(context, key, buffer);
        }
        for (const [key, value] of textures) {
            this._bindDescriptor(context, key, value);
        }
        for (const [key, value] of samplers) {
            this._bindDescriptor(context, key, value);
        }
        this._getGlobalDescData(context).descriptorSet!.update();
    }
    protected _updateUbo () {
        const devicePass = this._currentQueue.devicePass;
        const context = devicePass.context;
        const rasterId = devicePass.rasterPassInfo.id;
        const passRenderData = context.renderGraph.getData(rasterId);
        // CCGlobal
        this._updateGlobal(context, passRenderData);
        // CCCamera, CCShadow, CCCSM
        const queueId = this._currentQueue.queueId;
        const queueRenderData = context.renderGraph.getData(queueId)!;
        this._updateGlobal(context, queueRenderData);
    }

    public submit () {
        const context = this._currentQueue.devicePass.context;
        const ubo = context.ubo;
        if (this.graphScene.blit) {
            const blitCam = this.graphScene.blit.camera;
            if (blitCam) this._updateUbo();
            this._currentQueue.blitDesc!.update();
            return;
        }
        if (this._isShadowMap()) {
            ubo.updateShadowUBOLight(context.pipeline.descriptorSet,
                this.graphScene.scene!.light.light!, this.graphScene.scene!.light.level);
            return;
        }
        this._updateUbo();

        this._uploadInstanceBuffers();
        this._uploadBatchedBuffers();
    }
}

class DeviceSceneTask extends WebSceneTask {
    protected _currentQueue: DeviceRenderQueue;
    protected _renderPass: RenderPass;
    protected _graphScene: GraphScene;
    constructor (queue: DeviceRenderQueue, graphScene: GraphScene, visitor: SceneVisitor) {
        super(queue.devicePass.context.pipelineSceneData, queue.devicePass.context.ubo,
            graphScene.scene && graphScene.scene.camera ? graphScene.scene.camera : null, visitor);
        this._currentQueue = queue;
        this._renderPass = this._currentQueue.devicePass.renderPass;
        this._graphScene = graphScene;
    }
    get graphScene () { return this._graphScene; }
    public start () {}
    protected _recordRenderList (isTransparent: boolean) {
        const submitMap = this._currentQueue.devicePass.submitMap;
        const renderList = isTransparent ? submitMap.get(this.camera!)!.transparentList : submitMap.get(this.camera!)!.opaqueList;
        for (let i = 0; i < renderList.length; ++i) {
            const { subModel, passIdx } = renderList[i];
            const { inputAssembler } = subModel;
            const pass = subModel.passes[passIdx];
            const shader = subModel.shaders[passIdx];
            const pso = PipelineStateManager.getOrCreatePipelineState(deviceManager.gfxDevice,
                pass, shader, this._renderPass, inputAssembler);
            this.visitor.bindPipelineState(pso);
            this.visitor.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
            this.visitor.bindDescriptorSet(SetIndex.LOCAL, subModel.descriptorSet);
            this.visitor.bindInputAssembler(inputAssembler);
            this.visitor.draw(inputAssembler);
        }
    }
    protected _recordOpaqueList () {
        this._recordRenderList(false);
    }
    protected _recordInstences () {
        const submitMap = this._currentQueue.devicePass.submitMap;
        const it = submitMap.get(this.camera!)!.instances.values(); let res = it.next();
        while (!res.done) {
            const { instances, pass, hasPendingModels } = res.value;
            if (hasPendingModels) {
                this.visitor.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
                let lastPSO: PipelineState | null = null;
                for (let b = 0; b < instances.length; ++b) {
                    const instance = instances[b];
                    if (!instance.count) { continue; }
                    const shader = instance.shader!;
                    const pso = PipelineStateManager.getOrCreatePipelineState(deviceManager.gfxDevice, pass,
                        shader, this._renderPass, instance.ia);
                    if (lastPSO !== pso) {
                        this.visitor.bindPipelineState(pso);
                        lastPSO = pso;
                    }
                    const ia: any = instance.ia;
                    this.visitor.bindDescriptorSet(SetIndex.LOCAL, instance.descriptorSet, res.value.dynamicOffsets);
                    this.visitor.bindInputAssembler(ia);
                    this.visitor.draw(ia);
                }
            }
            res = it.next();
        }
    }
    protected _recordBatches () {
        const submitMap = this._currentQueue.devicePass.submitMap;
        const it = submitMap.get(this.camera!)!.batches.values(); let res = it.next();
        while (!res.done) {
            let boundPSO = false;
            for (let b = 0; b < res.value.batches.length; ++b) {
                const batch = res.value.batches[b];
                if (!batch.mergeCount) { continue; }
                if (!boundPSO) {
                    const shader = batch.shader!;
                    const pso = PipelineStateManager.getOrCreatePipelineState(deviceManager.gfxDevice, batch.pass,
                        shader, this._renderPass, batch.ia);
                    this.visitor.bindPipelineState(pso);
                    this.visitor.bindDescriptorSet(SetIndex.MATERIAL, batch.pass.descriptorSet);
                    boundPSO = true;
                }
                const ia: any = batch.ia;
                this.visitor.bindDescriptorSet(SetIndex.LOCAL, batch.descriptorSet, res.value.dynamicOffsets);
                this.visitor.bindInputAssembler(ia);
                this.visitor.draw(ia);
            }
            res = it.next();
        }
    }
    protected _recordUI () {
        const batches = this.camera!.scene!.batches;
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            let visible = false;
            if (this.camera!.visibility & batch.visFlags) {
                visible = true;
            }

            if (!visible) continue;
            // shaders.length always equals actual used passes.length
            const count = batch.shaders.length;
            for (let j = 0; j < count; j++) {
                const pass = batch.passes[j];
                if (pass.phase !== this._currentQueue.phaseID) continue;
                const shader = batch.shaders[j];
                const inputAssembler: any = batch.inputAssembler!;
                const pso = PipelineStateManager.getOrCreatePipelineState(deviceManager.gfxDevice, pass, shader, this._renderPass, inputAssembler);
                this.visitor.bindPipelineState(pso);
                this.visitor.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
                const ds = batch.descriptorSet!;
                this.visitor.bindDescriptorSet(SetIndex.LOCAL, ds);
                this.visitor.bindInputAssembler(inputAssembler);
                this.visitor.draw(inputAssembler);
            }
        }
    }
    protected _recordTransparentList () {
        this._recordRenderList(true);
    }
    protected _recordShadowMap () {
        const context = this._currentQueue.devicePass.context;
        const submitMap = this._currentQueue.devicePass.submitMap;
        submitMap.get(this.camera!)?.shadowMap?.recordCommandBuffer(context.device,
            this._renderPass, context.commandBuffer);
    }
    protected _generateRenderArea (): Rect {
        const out = new Rect();
        const vp = this.camera ? this.camera.viewport : new Rect(0, 0, 1, 1);
        const texture = this._currentQueue.devicePass.framebuffer.colorTextures[0]!;
        const w = texture.width;
        const h = texture.height;
        out.x = vp.x * w;
        out.y = vp.y * h;
        out.width = vp.width * w;
        out.height = vp.height * h;
        if (this._isShadowMap() && this.graphScene.scene!.light.light) {
            const light = this.graphScene.scene!.light.light;
            const level = this.graphScene.scene!.light.level;
            switch (light.type) {
            case LightType.DIRECTIONAL: {
                const mainLight = light as DirectionalLight;
                if (mainLight.shadowFixedArea || mainLight.csmLevel === CSMLevel.LEVEL_1) {
                    out.x = 0;
                    out.y = 0;
                    out.width = w;
                    out.height = h;
                } else {
                    out.x = level % 2 * 0.5 * w;
                    out.y = (1 - Math.floor(level / 2)) * 0.5 * h;
                    out.width = 0.5 * w;
                    out.height = 0.5 * h;
                }
                break;
            }
            case LightType.SPOT: {
                out.x = 0;
                out.y = 0;
                out.width = w;
                out.height = h;
                break;
            }
            default:
            }
        }
        return out;
    }
    private _isShadowMap () {
        return this.sceneData.shadows.enabled
            && this.sceneData.shadows.type === ShadowType.ShadowMap
            && this.graphScene.scene
            && this.graphScene.scene.flags & SceneFlags.SHADOW_CASTER;
    }
    private _recordBlit () {
        if (!this.graphScene.blit) { return; }
        const currMat = this.graphScene.blit.material;
        const pass = currMat!.passes[0];
        const shader = pass.getShaderVariant();
        const devicePass = this._currentQueue.devicePass;
        const screenIa: any = this._currentQueue.blitDesc!.screenQuad!.quadIA;
        let pso;
        if (pass !== null && shader !== null && screenIa !== null) {
            pso = PipelineStateManager.getOrCreatePipelineState(devicePass.context.device, pass, shader,
                devicePass.renderPass, screenIa);
        }
        if (pso) {
            this.visitor.bindPipelineState(pso);
            const layoutStage = devicePass.renderLayout;
            // TODO: It will be changed to global later
            this.visitor.bindDescriptorSet(SetIndex.MATERIAL, layoutStage!.descriptorSet!);
            this.visitor.bindDescriptorSet(SetIndex.LOCAL, this._currentQueue.blitDesc!.stageDesc!);
            this.visitor.bindInputAssembler(screenIa);
            this.visitor.draw(screenIa);
        }
    }
    private _recordAdditiveLights () {
        const devicePass = this._currentQueue.devicePass;
        const submitMap = devicePass.submitMap;
        const context = devicePass.context;
        submitMap.get(this.camera!)?.additiveLight?.recordCommandBuffer(context.device,
            this._renderPass,
            devicePass.context.commandBuffer);
    }

    private _recordPlanarShadows () {
        const devicePass = this._currentQueue.devicePass;
        const submitMap = devicePass.submitMap;
        const context = devicePass.context;
        submitMap.get(this.camera!)?.planarQueue?.recordCommandBuffer(context.device,
            this._renderPass,
            devicePass.context.commandBuffer);
    }

    public submit () {
        const area = this._generateRenderArea();
        const devicePass = this._currentQueue.devicePass;
        const context = devicePass.context;
        if (!this._currentQueue.devicePass.viewport) {
            this.visitor.setViewport(new Viewport(area.x, area.y, area.width, area.height));
            this.visitor.setScissor(area);
        }
        // Currently processing blit and camera first
        if (this.graphScene.blit) {
            this._recordBlit();
            return;
        }
        if (this._isShadowMap()) {
            this._recordShadowMap();
            return;
        }
        const graphSceneData = this.graphScene.scene!;
        this._recordOpaqueList();
        this._recordInstences();
        this._recordBatches();
        this._recordAdditiveLights();
        this._recordPlanarShadows();
        this._recordTransparentList();
        if (graphSceneData.flags & SceneFlags.GEOMETRY) {
            this.camera!.geometryRenderer?.render(devicePass.renderPass,
                context.commandBuffer, context.pipeline.pipelineSceneData);
        }
        if (graphSceneData.flags & SceneFlags.UI) {
            this._recordUI();
        }
        if (graphSceneData.flags & SceneFlags.PROFILER) {
            renderProfiler(context.device, devicePass.renderPass,
                context.commandBuffer, context.pipeline.profiler, this.camera!);
        }
    }
}

class DevicePostSceneTask extends WebSceneTask {}

class ExecutorContext {
    constructor (pipeline: Pipeline,
        ubo: PipelineUBO,
        device: Device,
        resourceGraph: ResourceGraph,
        renderGraph: RenderGraph,
        layoutGraph: LayoutGraphData,
        width: number,
        height: number) {
        this.pipeline = pipeline;
        this.device = device;
        this.commandBuffer = device.commandBuffer;
        this.pipelineSceneData = pipeline.pipelineSceneData;
        this.resourceGraph = resourceGraph;
        this.renderGraph = renderGraph;
        this.root = legacyCC.director.root;
        this.ubo = ubo;
        this.layoutGraph = layoutGraph;
        this.width = width;
        this.height = height;
    }
    readonly device: Device;
    readonly pipeline: Pipeline;
    readonly commandBuffer: CommandBuffer;
    readonly pipelineSceneData: PipelineSceneData;
    readonly resourceGraph: ResourceGraph;
    readonly devicePasses: Map<string, DeviceRenderPass> = new Map<string, DeviceRenderPass>();
    readonly deviceTextures: Map<string, DeviceTexture> = new Map<string, DeviceTexture>();
    readonly layoutGraph: LayoutGraphData;
    readonly root: Root;
    readonly ubo: PipelineUBO;
    readonly width: number;
    readonly height: number;
    renderGraph: RenderGraph;
}
class ResourceVisitor implements ResourceGraphVisitor {
    private _context: ExecutorContext;
    name: string;
    constructor (resName: string, context: ExecutorContext) {
        this._context = context;
        this.name = resName;
    }
    createDeviceTex (value: Texture | Framebuffer | ManagedResource | RenderSwapchain) {
        const deviceTex = new DeviceTexture(this.name, value, this._context);
        this._context.deviceTextures.set(this.name, deviceTex);
    }
    managed (value: ManagedResource) {
        this.createDeviceTex(value);
    }
    persistentBuffer (value: Buffer) {
    }
    persistentTexture (value: Texture) {
        this.createDeviceTex(value);
    }
    framebuffer (value: Framebuffer) {
        this.createDeviceTex(value);
    }
    swapchain (value: RenderSwapchain) {
        this.createDeviceTex(value);
    }
}

class PassVisitor implements RenderGraphVisitor {
    public passID = 0xFFFFFFFF;
    private _queueID = 0xFFFFFFFF;
    private _sceneID = 0xFFFFFFFF;
    private readonly _context: ExecutorContext;
    private _currPass: DeviceRenderPass | null | undefined = null;
    private _currQueue: DeviceRenderQueue | null = null;
    constructor (context: ExecutorContext) {
        this._context = context;
    }
    clear (value: ClearView[]): unknown {
        throw new Error('Method not implemented.');
    }
    viewport (value: Viewport): unknown {
        throw new Error('Method not implemented.');
    }
    raster (pass: RasterPass) {
        if (!pass.isValid) {
            return;
        }
        const rg = this._context.renderGraph;
        const devicePasses = this._context.devicePasses;
        const layout = this._context.layoutGraph;
        const passHash = stringify(pass);
        this._currPass = devicePasses.get(passHash);
        if (!this._currPass) {
            this._currPass = new DeviceRenderPass(this._context, new RasterPassInfo(this.passID, pass));
            devicePasses.set(passHash, this._currPass);
        } else {
            this._currPass.resetQueues(this.passID, pass);
        }
        for (const q of rg.children(this.passID)) {
            const queueID = q.target as number;
            this._queueID = queueID;
            rg.visitVertex(this, queueID);
        }
        this._currPass.prePass();
        this._currPass.record();
        this._currPass.postPass();
    }
    compute (pass: ComputePass) {

    }
    copy (pass: CopyPass) {

    }
    move (pass: MovePass) {

    }
    present (pass: PresentPass) {

    }
    raytrace (pass: RaytracePass) {

    }
    queue (value: RenderQueue) {
        const deviceQueue = new DeviceRenderQueue(this._currPass!);
        deviceQueue.queueHint = value.hint;
        deviceQueue.queueId = this._queueID;
        this._currQueue = deviceQueue;
        this._currPass!.addQueue(deviceQueue);
        const rg = this._context.renderGraph;
        const layoutName = this._context.renderGraph.getLayout(this._queueID);
        if (layoutName) {
            const layoutGraph = this._context.layoutGraph;
            if (this._currPass!.renderLayout) {
                const layoutId = layoutGraph.locateChild(this._currPass!.renderLayout.layoutID, layoutName);
                deviceQueue.renderPhase = layoutGraph.tryGetRenderPhase(layoutId);
            }
        }
        for (const s of rg.children(this._queueID)) {
            const sceneID = s.target as number;
            this._sceneID = sceneID;
            rg.visitVertex(this, sceneID);
        }
    }
    scene (value: SceneData) {
        const graphScene = new GraphScene();
        graphScene.scene = value;
        graphScene.sceneID = this._sceneID;
        this._currQueue!.addSceneTask(graphScene);
    }
    blit (value: Blit) {
        const graphScene = new GraphScene();
        graphScene.blit = value;
        this._currQueue!.addSceneTask(graphScene);
    }
    dispatch (value: Dispatch) {
    }
}

export class Executor {
    constructor (pipeline: Pipeline,
        ubo: PipelineUBO,
        device: Device,
        resourceGraph: ResourceGraph,
        layoutGraph: LayoutGraphData,
        width: number, height: number) {
        this._context = new ExecutorContext(
            pipeline,
            ubo,
            device,
            resourceGraph,
            new RenderGraph(),
            layoutGraph,
            width,
            height,
        );
    }

    execute (rg: RenderGraph) {
        this._context.renderGraph = rg;
        const cmdBuff = this._context.commandBuffer;
        cmdBuff.begin();
        const passVisitor = new PassVisitor(this._context);
        for (const vertID of rg.vertices()) {
            if (rg.numParents(vertID) === 0) {
                // vertex has no parents, must be pass
                passVisitor.passID = vertID;
                rg.visitVertex(passVisitor, vertID);
            }
        }
        cmdBuff.end();
        this._context.device.queue.submit([cmdBuff]);
    }

    release () {
        this._context.devicePasses.clear();
        for (const [k, v] of this._context.deviceTextures) {
            v.release();
        }
        this._context.deviceTextures.clear();
    }
    private readonly _context: ExecutorContext;
}
