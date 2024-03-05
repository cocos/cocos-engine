/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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
import { getPhaseID, PipelineStateManager } from '..';
import { assert, cclegacy, RecyclePool } from '../../core';
import intersect from '../../core/geometry/intersect';
import { Sphere } from '../../core/geometry/sphere';
import {
    AccessFlagBit,
    Attribute,
    Buffer,
    BufferInfo,
    BufferUsageBit,
    BufferViewInfo,
    Color,
    ColorAttachment,
    CommandBuffer,
    DepthStencilAttachment,
    DescriptorSet,
    DescriptorSetInfo,
    Device,
    deviceManager,
    DispatchInfo,
    Format,
    Framebuffer,
    FramebufferInfo,
    GeneralBarrierInfo,
    InputAssembler,
    InputAssemblerInfo,
    LoadOp,
    MemoryUsageBit,
    PipelineBindPoint,
    PipelineState,
    PipelineStateInfo,
    Rect,
    RenderPass,
    RenderPassInfo,
    StoreOp,
    SurfaceTransform,
    Swapchain,
    Texture,
    TextureInfo,
    TextureType,
    TextureUsageBit,
    Viewport,
} from '../../gfx';
import { legacyCC } from '../../core/global-exports';
import { Vec3 } from '../../core/math/vec3';
import { Vec4 } from '../../core/math/vec4';
import { Camera } from '../../render-scene/scene/camera';
import { ShadowType } from '../../render-scene/scene/shadows';
import { Root } from '../../root';
import { IRenderPass, SetIndex, UBODeferredLight, UBOForwardLight, UBOLocal } from '../define';
import { PipelineSceneData } from '../pipeline-scene-data';
import { PipelineInputAssemblerData } from '../render-pipeline';
import { DescriptorSetData, LayoutGraphData, PipelineLayoutData, RenderPhaseData, RenderStageData } from './layout-graph';
import { BasicPipeline } from './pipeline';
import { SceneVisitor } from './scene';
import {
    Blit,
    ClearView,
    ComputePass,
    ComputeSubpass,
    ComputeView,
    CopyPass,
    Dispatch,
    FormatView,
    ManagedBuffer,
    ManagedResource,
    ManagedTexture,
    MovePass,
    PersistentBuffer,
    PersistentTexture,
    RasterPass,
    RasterSubpass,
    RasterView,
    RaytracePass,
    RenderData,
    RenderGraph,
    RenderGraphVisitor,
    RenderQueue,
    RenderSwapchain,
    ResolvePass,
    ResourceDesc,
    ResourceGraph,
    ResourceGraphVisitor,
    ResourceTraits,
    SceneData,
    SubresourceView,
} from './render-graph';
import {
    AccessType,
    AttachmentType,
    QueueHint,
    ResourceDimension,
    ResourceFlags,
    ResourceResidency,
    SceneFlags,
    UpdateFrequency,
} from './types';
import { PipelineUBO } from '../pipeline-ubo';
import { RenderAdditiveLightQueue } from '../render-additive-light-queue';
import { DefaultVisitor, depthFirstSearch, ReferenceGraphView } from './graph';
import { VectorGraphColorMap } from './effect';
import {
    bool,
    getDescriptorSetDataFromLayout,
    getDescriptorSetDataFromLayoutId,
    getRenderArea,
    mergeSrcToTargetDesc,
    updateGlobalDescBinding,
} from './define';
import { RenderReflectionProbeQueue } from '../render-reflection-probe-queue';
import { LightResource, SceneCulling } from './scene-culling';
import { Pass, RenderScene } from '../../render-scene';
import { WebProgramLibrary } from './web-program-library';

class ResourceVisitor implements ResourceGraphVisitor {
    name: string;
    constructor (resName = '') {
        this.name = resName;
        if (context) {
            const ppl = context.pipeline as any;
            ppl.resourceUses.push(resName);
        }
    }
    set resName (value: string) {
        this.name = value;
    }
    checkTexture (name: string): boolean {
        const dTex = context.deviceTextures.get(name)!;
        const resID = context.resourceGraph.vertex(this.name);
        const desc = context.resourceGraph.getDesc(resID);
        let res = false;
        if (dTex.texture) {
            res = dTex.texture.width === desc.width && dTex.texture.height === desc.height;
        } else if (dTex.swapchain) {
            res = dTex.swapchain.width === desc.width && dTex.swapchain.height === desc.height;
        }
        return res;
    }
    createDeviceTex (value: PersistentTexture | Framebuffer | ManagedResource | RenderSwapchain): void {
        if (!context.deviceTextures.get(this.name)) {
            const deviceTex = new DeviceTexture(this.name, value);
            context.deviceTextures.set(this.name, deviceTex);
        } else if (!this.checkTexture(this.name)) {
            const dTex = context.deviceTextures.get(this.name)!;
            dTex.texture?.destroy();
            const deviceTex = new DeviceTexture(this.name, value);
            context.deviceTextures.set(this.name, deviceTex);
        }
    }
    checkBuffer (name: string): boolean {
        const dBuf = context.deviceBuffers.get(name)!;
        const resID = context.resourceGraph.vertex(this.name);
        const desc = context.resourceGraph.getDesc(resID);
        return dBuf.buffer!.size >= desc.width;
    }
    createDeviceBuf (value: ManagedBuffer | PersistentBuffer): void {
        const mount: boolean = !!context.deviceBuffers.get(this.name);
        if (!mount) {
            const deviceBuf = new DeviceBuffer(this.name, value);
            context.deviceBuffers.set(this.name, deviceBuf);
        } else if (!this.checkBuffer(this.name)) {
            const dBuf = context.deviceBuffers.get(this.name)!;
            dBuf.buffer?.destroy();
            const deviceBuf = new DeviceBuffer(this.name, value);
            context.deviceBuffers.set(this.name, deviceBuf);
        }
    }
    managed (value: ManagedResource): void {
        this.createDeviceTex(value);
    }
    managedBuffer (value: ManagedBuffer): void {
        this.createDeviceBuf(value);
    }
    managedTexture (value: ManagedTexture): void {
        // noop
    }
    persistentBuffer (value: PersistentBuffer): void {
        this.createDeviceBuf(value);
    }
    persistentTexture (value: PersistentTexture): void {
        this.createDeviceTex(value);
    }
    framebuffer (value: Framebuffer): void {
        this.createDeviceTex(value);
    }
    swapchain (value: RenderSwapchain): void {
        this.createDeviceTex(value);
    }
    formatView (value: FormatView): void {
        // do nothing
    }
    subresourceView (value: SubresourceView): void {
        // do nothing
    }
}

// Defining the recording interface
interface RecordingInterface {
    preRecord(): void;
    record(): void;
    postRecord(): void;
  }

let context: ExecutorContext;
class DeviceResource {
    protected _name: string;
    constructor (name: string) {
        this._name = name;
    }
    get name (): string { return this._name; }
}
class DeviceTexture extends DeviceResource {
    protected _texture: Texture | null = null;
    protected _swapchain: Swapchain | null = null;
    protected _framebuffer: Framebuffer | null = null;
    protected _desc: ResourceDesc | null = null;
    protected _trait: ResourceTraits | null = null;
    get texture (): Texture | null { return this._texture; }
    set framebuffer (val: Framebuffer | null) { this._framebuffer = val; }
    get framebuffer (): Framebuffer | null { return this._framebuffer; }
    get description (): ResourceDesc | null { return this._desc; }
    get trait (): ResourceTraits | null { return this._trait; }
    get swapchain (): Swapchain | null { return this._swapchain; }
    constructor (name: string, tex: PersistentTexture | Framebuffer | RenderSwapchain | ManagedResource) {
        super(name);
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
        if (info.flags & ResourceFlags.TRANSFER_SRC) usageFlags |= TextureUsageBit.TRANSFER_SRC;
        if (info.flags & ResourceFlags.TRANSFER_DST) usageFlags |= TextureUsageBit.TRANSFER_DST;

        this._texture = context.device.createTexture(new TextureInfo(
            type,
            usageFlags,
            info.format,
            info.width,
            info.height,
        ));
    }

    release (): void {
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

function isShadowMap (graphScene: GraphScene): boolean | null {
    const pSceneData: PipelineSceneData = cclegacy.director.root.pipeline.pipelineSceneData;
    return pSceneData.shadows.enabled
        && pSceneData.shadows.type === ShadowType.ShadowMap
        && graphScene.scene
        && (graphScene.scene.flags & SceneFlags.SHADOW_CASTER) !== 0;
}

class DeviceBuffer extends DeviceResource {
    private _buffer: Buffer | null;

    get buffer (): Buffer | null {
        return this._buffer;
    }

    constructor (name: string, buffer: ManagedBuffer | PersistentBuffer) {
        super(name);
        const resGraph = context.resourceGraph;
        const verID = resGraph.vertex(name);
        const desc = resGraph.getDesc(verID);
        const bufferInfo = new BufferInfo();
        bufferInfo.size = desc.width;
        bufferInfo.memUsage = MemoryUsageBit.DEVICE;

        if (desc.flags & ResourceFlags.INDIRECT) bufferInfo.usage |= BufferUsageBit.INDIRECT;
        if (desc.flags & ResourceFlags.UNIFORM) bufferInfo.usage |= BufferUsageBit.UNIFORM;
        if (desc.flags & ResourceFlags.STORAGE) bufferInfo.usage |= BufferUsageBit.STORAGE;
        if (desc.flags & ResourceFlags.TRANSFER_SRC) bufferInfo.usage |= BufferUsageBit.TRANSFER_SRC;
        if (desc.flags & ResourceFlags.TRANSFER_DST) bufferInfo.usage |= BufferUsageBit.TRANSFER_DST;

        this._buffer = context.device.createBuffer(bufferInfo);
    }

    release (): void {
        if (this._buffer) {
            this._buffer.destroy();
            this._buffer = null;
        }
    }
}

const _vec4Array = new Float32Array(4);
class BlitDesc {
    private _isUpdate = false;
    private _isGatherLight = false;
    private _blit: Blit;
    private _screenQuad: PipelineInputAssemblerData | null = null;
    private _queue: DeviceRenderQueue | null = null;
    private _stageDesc: DescriptorSet | undefined;
    // If VOLUMETRIC_LIGHTING is turned on, it needs to be assigned
    private _lightVolumeBuffer: Buffer | null = null;
    private _lightMeterScale = 10000.0;
    private _lightBufferData!: Float32Array;
    get screenQuad (): PipelineInputAssemblerData | null { return this._screenQuad; }
    get blit (): Blit { return this._blit; }
    set blit (blit: Blit) { this._blit = blit; }
    get stageDesc (): DescriptorSet | undefined { return this._stageDesc; }
    constructor (blit: Blit, queue: DeviceRenderQueue) {
        this._blit = blit;
        this._queue = queue;
    }
    /**
     * @zh
     * 创建四边形输入汇集器。
     */
    protected _createQuadInputAssembler (): PipelineInputAssemblerData {
        return context.blit.pipelineIAData;
    }
    createScreenQuad (): void {
        if (!this._screenQuad) {
            this._screenQuad = this._createQuadInputAssembler();
        }
    }
    private _gatherVolumeLights (camera: Camera): void {
        if (!camera.scene) { return; }
        const pipeline = context.pipeline;
        const cmdBuff = context.commandBuffer;

        const sphereLights = camera.scene.sphereLights;
        const spotLights = camera.scene.spotLights;
        const _sphere = Sphere.create(0, 0, 0, 1);
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
    update (): void {
        if (this.blit.sceneFlags & SceneFlags.VOLUMETRIC_LIGHTING
            && this.blit.camera && !this._isGatherLight) {
            this._gatherVolumeLights(this.blit.camera);
            this._isGatherLight = true;
            this._isUpdate = false;
        }
        if (!this._isUpdate) {
            this._stageDesc!.update();
            this._isUpdate = true;
        }
    }

    reset (): void {
        this._isUpdate = false;
        this._isGatherLight = false;
    }

    createStageDescriptor (): void {
        const blit = this.blit;
        const pass = blit.material!.passes[blit.passID];
        const device = context.device;
        this._stageDesc = context.blit.stageDescs.get(pass);
        if (!this._stageDesc) {
            this._stageDesc = device.createDescriptorSet(new DescriptorSetInfo(pass.localSetLayout));
            context.blit.stageDescs.set(pass, this._stageDesc);
        }
        if (this.blit.sceneFlags & SceneFlags.VOLUMETRIC_LIGHTING) {
            this._lightVolumeBuffer = context.blit.lightVolumeBuffer;
            const deferredLitsBufView = context.blit.deferredLitsBufView;
            this._lightBufferData = context.blit.lightBufferData;
            this._lightBufferData.fill(0);
            this._stageDesc.bindBuffer(UBOForwardLight.BINDING, deferredLitsBufView);
        }
        this._stageDesc.bindBuffer(UBOLocal.BINDING, context.blit.emptyLocalUBO);
    }
}

class DeviceComputeQueue implements RecordingInterface {
    preRecord (): void {
        // nothing to do
    }
    postRecord (): void {
        // nothing to do
    }
    private _devicePass: DeviceComputePass | undefined;
    private _hint: QueueHint = QueueHint.NONE;
    private _phaseID: number = getPhaseID('default');
    private _renderPhase: RenderPhaseData | null = null;
    private _descSetData: DescriptorSetData | null = null;
    private _layoutID = -1;
    private _isUpdateUBO = false;
    private _isUploadInstance = false;
    private _isUploadBatched = false;
    private _queueId = -1;
    init (devicePass: DeviceComputePass, renderQueue: RenderQueue, id: number): void {
        this.reset();
        this.queueHint = renderQueue.hint;
        this.queueId = id;
        this._devicePass = devicePass;
        this._phaseID = cclegacy.rendering.getPhaseID(devicePass.passID, context.renderGraph.getLayout(id));
    }
    get phaseID (): number { return this._phaseID; }
    set layoutID (value: number) {
        this._layoutID = value;
        const layoutGraph = context.layoutGraph;
        this._renderPhase = layoutGraph.tryGetRenderPhase(value);
        const layout = layoutGraph.getLayout(value);
        this._descSetData = layout.descriptorSets.get(UpdateFrequency.PER_PHASE)!;
    }
    get layoutID (): number { return this._layoutID; }
    get descSetData (): DescriptorSetData | null { return this._descSetData; }
    get renderPhase (): RenderPhaseData | null { return this._renderPhase; }
    set queueId (val) { this._queueId = val; }
    get queueId (): number { return this._queueId; }
    set isUpdateUBO (update: boolean) { this._isUpdateUBO = update; }
    get isUpdateUBO (): boolean { return this._isUpdateUBO; }
    set isUploadInstance (value: boolean) { this._isUploadInstance = value; }
    get isUploadInstance (): boolean { return this._isUploadInstance; }
    set isUploadBatched (value: boolean) { this._isUploadBatched = value; }
    get isUploadBatched (): boolean { return this._isUploadBatched; }

    reset (): void {
        this._isUpdateUBO = false;
        this._isUploadInstance = false;
        this._isUploadBatched = false;
    }
    set queueHint (value: QueueHint) { this._hint = value; }
    get queueHint (): QueueHint { return this._hint; }
    get devicePass (): DeviceComputePass { return this._devicePass!; }

    record (): void {
        if (this._descSetData && this._descSetData.descriptorSet) {
            context.commandBuffer
                .bindDescriptorSet(SetIndex.COUNT, this._descSetData.descriptorSet);
        }
    }
}

class DeviceRenderQueue implements RecordingInterface {
    private _renderScenes: DeviceRenderScene[] = [];
    private _devicePass: DeviceRenderPass | undefined;
    private _hint: QueueHint = QueueHint.NONE;
    private _graphQueue!: RenderQueue;
    private _phaseID: number = getPhaseID('default');
    private _renderPhase: RenderPhaseData | null = null;
    private _descSetData: DescriptorSetData | null = null;
    private _viewport: Viewport | null = null;
    private _scissor: Rect | null = null;
    private _layoutID = -1;
    private _isUpdateUBO = false;
    private _isUploadInstance = false;
    private _isUploadBatched = false;
    get phaseID (): number { return this._phaseID; }
    set layoutID (value: number) {
        this._layoutID = value;
        const layoutGraph = context.layoutGraph;
        this._renderPhase = layoutGraph.tryGetRenderPhase(value);
        const layout = layoutGraph.getLayout(value);
        this._descSetData = layout.descriptorSets.get(UpdateFrequency.PER_PHASE)!;
    }
    get layoutID (): number { return this._layoutID; }
    get descSetData (): DescriptorSetData | null { return this._descSetData; }
    get renderPhase (): RenderPhaseData | null { return this._renderPhase; }
    get viewport (): Viewport | null { return this._viewport; }
    get scissor (): Rect | null { return this._scissor; }
    private _blitDesc: BlitDesc | null = null;
    private _queueId = -1;
    set queueId (val) { this._queueId = val; }
    get queueId (): number { return this._queueId; }
    set isUpdateUBO (update: boolean) { this._isUpdateUBO = update; }
    get isUpdateUBO (): boolean { return this._isUpdateUBO; }
    set isUploadInstance (value: boolean) { this._isUploadInstance = value; }
    get isUploadInstance (): boolean { return this._isUploadInstance; }
    set isUploadBatched (value: boolean) { this._isUploadBatched = value; }
    get isUploadBatched (): boolean { return this._isUploadBatched; }
    init (devicePass: DeviceRenderPass, renderQueue: RenderQueue, id: number): void {
        this.reset();
        this._graphQueue = renderQueue;
        this.queueHint = renderQueue.hint;
        const viewport = this._viewport = renderQueue.viewport;
        if (viewport) {
            this._scissor = new Rect(viewport.left, viewport.top, viewport.width, viewport.height);
        }
        this.queueId = id;
        this._devicePass = devicePass;
        this._phaseID = cclegacy.rendering.getPhaseID(devicePass.passID, context.renderGraph.getLayout(id));
    }
    createBlitDesc (blit: Blit): void {
        if (!this._blitDesc) {
            this._blitDesc = new BlitDesc(blit, this);
        }
        this._blitDesc.createScreenQuad();
        this._blitDesc.createStageDescriptor();
    }
    addScene (scene: GraphScene): DeviceRenderScene {
        const deviceScene = context.pools.addDeviceScene();
        deviceScene.init(this, scene);
        this._renderScenes.push(deviceScene);
        return deviceScene;
    }
    reset (): void {
        this._renderScenes.length = 0;
        this._isUpdateUBO = false;
        this._isUploadInstance = false;
        this._isUploadBatched = false;
        this._blitDesc?.reset();
    }
    get graphQueue (): RenderQueue { return this._graphQueue; }
    get blitDesc (): BlitDesc | null { return this._blitDesc; }
    get renderScenes (): DeviceRenderScene[] { return this._renderScenes; }
    set queueHint (value: QueueHint) { this._hint = value; }
    get queueHint (): QueueHint { return this._hint; }
    get devicePass (): DeviceRenderPass { return this._devicePass!; }
    preRecord (): void {
        // nothing to do
    }

    record (): void {
        if (this._descSetData && this._descSetData.descriptorSet) {
            context.commandBuffer
                .bindDescriptorSet(SetIndex.COUNT, this._descSetData.descriptorSet);
        }
        this._renderScenes.forEach((scene) => {
            scene.record();
        });
    }

    postRecord (): void {
        // nothing to do
    }
}

class SubmitInfo {
    // <scene id, shadow queue>
    public additiveLight: RenderAdditiveLightQueue | null = null;
    public reflectionProbe: RenderReflectionProbeQueue | null = null;

    reset (): void {
        this.additiveLight = null;
        this.reflectionProbe = null;
    }
}

class RenderPassLayoutInfo {
    protected _layoutID = 0;
    protected _vertID = -1;
    protected _stage: RenderStageData | null = null;
    protected _layout: PipelineLayoutData;
    protected _inputName: string;
    protected _descriptorSet: DescriptorSet | null = null;
    constructor (layoutId: number, vertId: number, input: [string, ComputeView[]]) {
        this._inputName = input[0];
        this._layoutID = layoutId;
        this._vertID = vertId;
        const lg = context.layoutGraph;
        this._stage = lg.getRenderStage(layoutId);
        this._layout = lg.getLayout(layoutId);
        const layoutData = this._layout.descriptorSets.get(UpdateFrequency.PER_PASS);
        if (!layoutData) {
            return;
        }
        const layoutDesc = layoutData.descriptorSet!;
        // find resource
        const deviceTex = context.deviceTextures.get(this._inputName);
        const gfxTex = deviceTex?.texture;

        const deviceBuf = context.deviceBuffers.get(this._inputName);
        const gfxBuf = deviceBuf?.buffer;
        if (!gfxTex && !gfxBuf) {
            throw Error(`Could not find texture with resource name ${this._inputName}`);
        }
        const resId = context.resourceGraph.vertex(this._inputName);
        const samplerInfo = context.resourceGraph.getSampler(resId);
        // bind descriptors
        for (const descriptor of input[1]) {
            const descriptorName = descriptor.name;
            const descriptorID = lg.attributeIndex.get(descriptorName);
            // find descriptor binding
            for (const block of layoutData.descriptorSetLayoutData.descriptorBlocks) {
                for (let i = 0; i !== block.descriptors.length; ++i) {
                    if (descriptorID === block.descriptors[i].descriptorID) {
                        if (gfxTex) {
                            layoutDesc.bindTexture(block.offset + i, gfxTex);
                            const renderData = context.renderGraph.getData(this._vertID);
                            layoutDesc.bindSampler(block.offset + i, renderData.samplers.get(descriptorID) || context.device.getSampler(samplerInfo));
                        } else {
                            const desc = context.resourceGraph.getDesc(resId);
                            if (desc.flags & ResourceFlags.STORAGE) {
                                const access = input[1][0].accessType !== AccessType.READ ? AccessFlagBit.COMPUTE_SHADER_WRITE
                                    : AccessFlagBit.COMPUTE_SHADER_READ_OTHER;
                                (layoutDesc as any).bindBuffer(block.offset + i, gfxBuf!, 0, access);
                            } else {
                                layoutDesc.bindBuffer(block.offset + i, gfxBuf!);
                            }
                        }
                        if (!this._descriptorSet) this._descriptorSet = layoutDesc;
                        continue;
                    }
                }
            }
        }
    }
    get descriptorSet (): DescriptorSet | null { return this._descriptorSet; }
    get layoutID (): number { return this._layoutID; }
    get vertID (): number { return this._vertID; }
    get stage (): RenderStageData | null { return this._stage; }
    get layout (): PipelineLayoutData { return this._layout; }
}

class RasterPassInfo {
    protected _id!: number;
    protected _pass!: RasterPass;
    get id (): number { return this._id; }
    get pass (): RasterPass { return this._pass; }
    private _copyPass (pass: RasterPass): void {
        const rasterPass = this._pass || new RasterPass();
        rasterPass.width = pass.width;
        rasterPass.height = pass.height;
        rasterPass.versionName = pass.versionName;
        rasterPass.version = pass.version;
        rasterPass.showStatistics = pass.showStatistics;
        rasterPass.viewport.copy(pass.viewport);
        for (const val of pass.rasterViews) {
            const currRasterKey = val[0];
            const currRasterView = val[1];
            const rasterView = rasterPass.rasterViews.get(currRasterKey) || new RasterView();
            rasterView.slotName = currRasterView.slotName;
            rasterView.accessType = currRasterView.accessType;
            rasterView.attachmentType = currRasterView.attachmentType;
            rasterView.loadOp = currRasterView.loadOp ? LoadOp.CLEAR : LoadOp.LOAD;
            rasterView.storeOp = currRasterView.storeOp;
            rasterView.clearFlags = currRasterView.clearFlags;
            rasterView.slotID = currRasterView.slotID;
            rasterView.clearColor.copy(currRasterView.clearColor);
            rasterPass.rasterViews.set(currRasterKey, rasterView);
        }
        for (const val of pass.computeViews) {
            const currComputeViews = val[1];
            const currComputeKey = val[0];
            const computeViews: ComputeView[] = rasterPass.computeViews.get(currComputeKey) || [];
            if (computeViews.length) computeViews.length = currComputeViews.length;
            let idx = 0;
            for (const currComputeView of currComputeViews) {
                const computeView = computeViews[idx] || new ComputeView();
                computeView.name = currComputeView.name;
                computeView.accessType = currComputeView.accessType;
                computeView.clearFlags = currComputeView.clearFlags;
                computeView.clearValue.x = currComputeView.clearValue.x;
                computeView.clearValue.y = currComputeView.clearValue.y;
                computeView.clearValue.z = currComputeView.clearValue.z;
                computeView.clearValue.w = currComputeView.clearValue.w;
                computeView.clearValueType = currComputeView.clearValueType;
                computeViews[idx] = computeView;
                idx++;
            }
            rasterPass.computeViews.set(currComputeKey, computeViews);
        }
        this._pass = rasterPass;
    }
    applyInfo (id: number, pass: RasterPass): void {
        this._id = id;
        this._copyPass(pass);
    }
}

const profilerViewport = new Viewport();
const renderPassArea = new Rect();
const resourceVisitor = new ResourceVisitor();
class DeviceRenderPass implements RecordingInterface {
    protected _renderPass: RenderPass;
    protected _framebuffer: Framebuffer;
    protected _clearColor: Color[] = [];
    protected _deviceQueues: Map<number, DeviceRenderQueue> = new Map();
    protected _clearDepth = 1;
    protected _clearStencil = 0;
    protected _passID: number;
    protected _layoutName: string;
    protected _viewport: Viewport | null = null;
    private _rasterInfo: RasterPassInfo;
    private _layout: RenderPassLayoutInfo | null = null;
    constructor (passInfo: RasterPassInfo) {
        this._rasterInfo = passInfo;
        const device = context.device;
        this._layoutName = context.renderGraph.getLayout(passInfo.id);
        this._passID = cclegacy.rendering.getPassID(this._layoutName);
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
                this.visitResource(resName);
                resTex = context.deviceTextures.get(resName)!;
            } else {
                const resGraph = context.resourceGraph;
                const resId = resGraph.vertex(resName);
                const resFbo = resGraph._vertices[resId]._object;
                if (resTex.framebuffer && resFbo instanceof Framebuffer && resTex.framebuffer !== resFbo) {
                    resTex.framebuffer = resFbo;
                } else if (resTex.texture) {
                    const desc = resGraph.getDesc(resId);
                    if (resTex.texture.width !== desc.width || resTex.texture.height !== desc.height) {
                        resTex.texture.resize(desc.width, desc.height);
                    }
                }
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
            case AttachmentType.SHADING_RATE:
                // noop
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
        const depth = swapchain ? swapchain.depthStencilTexture : depthTex;
        if (!depth) {
            depthStencilAttachment.format = Format.UNKNOWN;
        }
        this._renderPass = device.createRenderPass(new RenderPassInfo(colors, depthStencilAttachment));
        this._framebuffer = framebuffer || device.createFramebuffer(new FramebufferInfo(
            this._renderPass,
            swapchain ? [swapchain.colorTexture] : colorTexs,
            swapchain ? swapchain.depthStencilTexture : depthTex,
        ));
    }
    get layoutName (): string { return this._layoutName; }
    get passID (): number { return this._passID; }
    get renderLayout (): RenderPassLayoutInfo | null { return this._layout; }
    get renderPass (): RenderPass { return this._renderPass; }
    get framebuffer (): Framebuffer { return this._framebuffer; }
    get clearColor (): Color[] { return this._clearColor; }
    get clearDepth (): number { return this._clearDepth; }
    get clearStencil (): number { return this._clearStencil; }
    get deviceQueues (): Map<number, DeviceRenderQueue> { return this._deviceQueues; }
    get rasterPassInfo (): RasterPassInfo { return this._rasterInfo; }
    get viewport (): Viewport | null { return this._viewport; }
    visitResource (resName: string): void {
        const resourceGraph = context.resourceGraph;
        const vertId = resourceGraph.vertex(resName);
        resourceVisitor.resName = resName;
        resourceGraph.visitVertex(resourceVisitor, vertId);
    }
    addQueue (queue: DeviceRenderQueue): void {
        this._deviceQueues.set(queue.queueId, queue);
    }
    preRecord (): void {
        context.descriptorSet = getDescriptorSetDataFromLayout(this.layoutName)!.descriptorSet;
    }
    protected _applyRenderLayout (input: [string, ComputeView[]]): void {
        const stageName = context.renderGraph.getLayout(this.rasterPassInfo.id);
        if (stageName) {
            const layoutGraph = context.layoutGraph;
            const stageId = layoutGraph.locateChild(layoutGraph.nullVertex(), stageName);
            if (stageId !== 0xFFFFFFFF) {
                this._layout = new RenderPassLayoutInfo(stageId, this.rasterPassInfo.id, input);
            }
        }
    }
    getGlobalDescData (): DescriptorSetData {
        const stageId = context.layoutGraph.locateChild(context.layoutGraph.nullVertex(), 'default');
        assert(stageId !== 0xFFFFFFFF);
        const layout = context.layoutGraph.getLayout(stageId);
        const layoutData = layout.descriptorSets.get(UpdateFrequency.PER_PASS)!;
        return layoutData;
    }

    protected _applyViewport (frameTex: Texture): void {
        this._viewport = null;
        const viewport = this._rasterInfo.pass.viewport;
        if (viewport.left !== 0
            || viewport.top !== 0
            || viewport.width !== 0
            || viewport.height !== 0) {
            this._viewport = viewport;
        }
    }

    protected _showProfiler (rect: Rect): void {
        const profiler = context.pipeline.profiler!;
        if (!profiler || !profiler.enabled) {
            return;
        }
        const renderPass = this._renderPass;
        const cmdBuff = context.commandBuffer;
        const submodel = profiler.subModels[0];
        const pass = submodel.passes[0];
        const ia = submodel.inputAssembler;
        const device = context.device;
        const pso = PipelineStateManager.getOrCreatePipelineState(
            device,
            pass,
            submodel.shaders[0],
            renderPass,
            ia,
        );

        profilerViewport.width = rect.width;
        profilerViewport.height = rect.height;
        cmdBuff.setViewport(profilerViewport);
        cmdBuff.setScissor(rect);
        cmdBuff.bindPipelineState(pso);
        cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
        cmdBuff.bindDescriptorSet(SetIndex.LOCAL, submodel.descriptorSet);
        cmdBuff.bindInputAssembler(ia);
        cmdBuff.draw(ia);
    }

    // record common buffer
    record (): void {
        const tex = this.framebuffer.colorTextures[0]!;
        this._applyViewport(tex);
        const cmdBuff = context.commandBuffer;
        if (this._viewport) {
            renderPassArea.x = this._viewport.left;
            renderPassArea.y = this._viewport.top;
            renderPassArea.width = this._viewport.width;
            renderPassArea.height = this._viewport.height;
        } else {
            renderPassArea.y = renderPassArea.x = 0;
            renderPassArea.width = tex.width;
            renderPassArea.height = tex.height;
        }
        cmdBuff.beginRenderPass(
            this.renderPass,
            this.framebuffer,
            renderPassArea,
            this.clearColor,
            this.clearDepth,
            this.clearStencil,
        );
        if (context.descriptorSet) {
            cmdBuff.bindDescriptorSet(
                SetIndex.GLOBAL,
                context.descriptorSet,
            );
        }

        for (const queue of this._deviceQueues.values()) {
            queue.record();
        }
        if (this._rasterInfo.pass.showStatistics) {
            this._showProfiler(renderPassArea);
        }
        cmdBuff.endRenderPass();
    }

    postRecord (): void {
        // nothing to do
    }
    resetResource (id: number, pass: RasterPass): void {
        this._rasterInfo.applyInfo(id, pass);
        this._layoutName = context.renderGraph.getLayout(id);
        this._passID = cclegacy.rendering.getPassID(this._layoutName);
        this._deviceQueues.clear();
        let framebuffer: Framebuffer | null = null;
        const colTextures: Texture[] = [];
        let depTexture = this._framebuffer ? this._framebuffer.depthStencilTexture : null;
        for (const cv of this._rasterInfo.pass.computeViews) {
            this._applyRenderLayout(cv);
        }
        // update the layout descriptorSet
        if (this.renderLayout && this.renderLayout.descriptorSet) {
            this.renderLayout.descriptorSet.update();
        }

        const resGraph = context.resourceGraph;
        const currentWidth = this._framebuffer ? this._framebuffer.width : 0;
        const currentHeight = this._framebuffer ? this._framebuffer.height : 0;

        let width = 0;
        let height = 0;
        for (const [resName, rasterV] of this._rasterInfo.pass.rasterViews) {
            if (rasterV.attachmentType === AttachmentType.SHADING_RATE) {
                continue;
            }
            const resId = resGraph.vertex(resName);
            const resDesc = resGraph.getDesc(resId);
            width = resDesc.width;
            height = resDesc.height;
            break;
        }
        const needRebuild = (width !== currentWidth) || (height !== currentHeight);

        for (const [resName, rasterV] of this._rasterInfo.pass.rasterViews) {
            let deviceTex = context.deviceTextures.get(resName)!;
            const currTex = deviceTex;
            if (!deviceTex) {
                this.visitResource(resName);
                deviceTex = context.deviceTextures.get(resName)!;
            }
            const resGraph = context.resourceGraph;
            const resId = resGraph.vertex(resName);
            const resFbo = resGraph._vertices[resId]._object;
            const resDesc = resGraph.getDesc(resId);
            if (deviceTex.framebuffer && resFbo instanceof Framebuffer && deviceTex.framebuffer !== resFbo) {
                framebuffer = this._framebuffer = deviceTex.framebuffer = resFbo;
            } else if (!currTex || (deviceTex.texture && needRebuild)) {
                const gfxTex = deviceTex.texture!;
                if (currTex) gfxTex.resize(resDesc.width, resDesc.height);
                switch (rasterV.attachmentType) {
                case AttachmentType.RENDER_TARGET:
                    colTextures.push(gfxTex);
                    break;
                case AttachmentType.DEPTH_STENCIL:
                    depTexture = gfxTex;
                    break;
                case AttachmentType.SHADING_RATE:
                    // noop
                    break;
                default:
                }
            }
        }
        if (!framebuffer && colTextures.length) {
            this._framebuffer.destroy();
            this._framebuffer = context.device.createFramebuffer(new FramebufferInfo(
                this._renderPass,
                colTextures,
                depTexture,
            ));
        }
    }
}

class ComputePassInfo {
    protected _id!: number;
    protected _pass!: ComputePass;
    get id (): number { return this._id; }
    get pass (): ComputePass { return this._pass; }
    private _copyPass (pass: ComputePass): void {
        const computePass = this._pass || new ComputePass();
        for (const val of pass.computeViews) {
            const currComputeViews = val[1];
            const currComputeKey = val[0];
            const computeViews: ComputeView[] = computePass.computeViews.get(currComputeKey) || [];
            if (computeViews.length) computeViews.length = currComputeViews.length;
            let idx = 0;
            for (const currComputeView of currComputeViews) {
                const computeView = computeViews[idx] || new ComputeView();
                computeView.name = currComputeView.name;
                computeView.accessType = currComputeView.accessType;
                computeView.clearFlags = currComputeView.clearFlags;
                computeView.clearValue.x = currComputeView.clearValue.x;
                computeView.clearValue.y = currComputeView.clearValue.y;
                computeView.clearValue.z = currComputeView.clearValue.z;
                computeView.clearValue.w = currComputeView.clearValue.w;
                computeView.clearValueType = currComputeView.clearValueType;
                computeViews[idx] = computeView;
                idx++;
            }
            computePass.computeViews.set(currComputeKey, computeViews);
        }
        this._pass = computePass;
    }
    applyInfo (id: number, pass: ComputePass): void {
        this._id = id;
        this._copyPass(pass);
    }
}

class DeviceComputePass implements RecordingInterface {
    protected _deviceQueues: DeviceComputeQueue[] = [];
    protected _passID: number;
    protected _layoutName: string;
    protected _viewport: Viewport | null = null;
    private _computeInfo: ComputePassInfo;
    private _layout: RenderPassLayoutInfo | null = null;
    constructor (passInfo: ComputePassInfo) {
        this._computeInfo = passInfo;
        this._layoutName = context.renderGraph.getLayout(passInfo.id);
        this._passID = cclegacy.rendering.getPassID(this._layoutName);

        for (const cv of passInfo.pass.computeViews) {
            let resTex = context.deviceTextures.get(cv[0]);
            if (!resTex) {
                this.visitResource(cv[0]);
                resTex = context.deviceTextures.get(cv[0])!;
            }
            this._applyRenderLayout(cv);
        }
        // update the layout descriptorSet
        if (this.renderLayout && this.renderLayout.descriptorSet) {
            this.renderLayout.descriptorSet.update();
        }
    }
    preRecord (): void {
        // nothing to do
    }
    postRecord (): void {
        // nothing to do
    }
    get layoutName (): string { return this._layoutName; }
    get passID (): number { return this._passID; }
    get renderLayout (): RenderPassLayoutInfo | null { return this._layout; }

    get deviceQueues (): DeviceComputeQueue[] { return this._deviceQueues; }
    get computePassInfo (): ComputePassInfo { return this._computeInfo; }
    visitResource (resName: string): void {
        const resourceGraph = context.resourceGraph;
        const vertId = resourceGraph.vertex(resName);
        resourceVisitor.resName = resName;
        resourceGraph.visitVertex(resourceVisitor, vertId);
    }
    addQueue (queue: DeviceComputeQueue): void { this._deviceQueues.push(queue); }
    protected _applyRenderLayout (input: [string, ComputeView[]]): void {
        const stageName = context.renderGraph.getLayout(this._computeInfo.id);
        if (stageName) {
            const layoutGraph = context.layoutGraph;
            const stageId = layoutGraph.locateChild(layoutGraph.nullVertex(), stageName);
            if (stageId !== 0xFFFFFFFF) {
                this._layout = new RenderPassLayoutInfo(stageId, this._computeInfo.id, input);
            }
        }
    }
    getGlobalDescData (): DescriptorSetData {
        const stageId = context.layoutGraph.locateChild(context.layoutGraph.nullVertex(), 'default');
        assert(stageId !== 0xFFFFFFFF);
        const layout = context.layoutGraph.getLayout(stageId);
        const layoutData = layout.descriptorSets.get(UpdateFrequency.PER_PASS)!;
        return layoutData;
    }

    // record common buffer
    record (): void {
        const cmdBuff = context.commandBuffer;

        if (context.descriptorSet) {
            cmdBuff.bindDescriptorSet(
                SetIndex.GLOBAL,
                context.descriptorSet,
            );
        }

        for (const queue of this._deviceQueues) {
            queue.record();
        }
        const renderData = context.renderGraph.getData(this._computeInfo.id);
        updateGlobalDescBinding(renderData, context.renderGraph.getLayout(this._computeInfo.id));
    }

    resetResource (id: number, pass: ComputePass): void {
        this._computeInfo.applyInfo(id, pass);
        this._layoutName = context.renderGraph.getLayout(id);
        this._passID = cclegacy.rendering.getPassID(this._layoutName);
        this._deviceQueues.length = 0;
        for (const cv of this._computeInfo.pass.computeViews) {
            this._applyRenderLayout(cv);
        }
        // update the layout descriptorSet
        if (this.renderLayout && this.renderLayout.descriptorSet) {
            this.renderLayout.descriptorSet.update();
        }
    }
}
class GraphScene {
    scene: SceneData | null = null;
    blit: Blit | null = null;
    dispatch: Dispatch | null = null;
    sceneID = -1;
    private _copyScene (scene: SceneData | null): void {
        if (scene) {
            if (!this.scene) {
                this.scene = new SceneData();
            }
            this.scene.scene = scene.scene;
            this.scene.light.level = scene.light.level;
            this.scene.light.light = scene.light.light;
            this.scene.flags = scene.flags;
            this.scene.camera = scene.camera;
            this.scene.shadingLight = scene.shadingLight;
            return;
        }
        this.scene = null;
    }
    private _copyBlit (blit: Blit | null): void {
        if (blit) {
            if (!this.blit) {
                this.blit = new Blit(blit.material, blit.passID, blit.sceneFlags, blit.camera);
            }
            this.blit.material = blit.material;
            this.blit.passID = blit.passID;
            this.blit.sceneFlags = blit.sceneFlags;
            this.blit.camera = blit.camera;
            return;
        }
        this.blit = null;
    }
    init (scene: SceneData | null, blit: Blit | null, sceneID): void {
        this._copyScene(scene);
        this._copyBlit(blit);
        this.sceneID = sceneID;
    }
}
const sceneViewport = new Viewport();
class DeviceRenderScene implements RecordingInterface {
    protected _currentQueue!: DeviceRenderQueue;
    protected _renderPass!: RenderPass;
    protected _graphScene!: GraphScene;
    protected _scene: RenderScene | null = null;
    protected _camera: Camera | null = null;
    get camera (): Camera | null { return this._camera; }
    preRecord (): void {
        if (this.graphScene.blit) {
            this._currentQueue.createBlitDesc(this.graphScene.blit);
            this._currentQueue.blitDesc!.update();
        }
        context.lightResource.buildLightBuffer(context.commandBuffer);
        context.lightResource.tryUpdateRenderSceneLocalDescriptorSet(context.culling);
    }
    postRecord (): void {
        // nothing to do
    }
    init (queue: DeviceRenderQueue, graphScene: GraphScene): void {
        this._currentQueue = queue;
        this._graphScene = graphScene;
        this._renderPass = queue.devicePass.renderPass;
        const camera = graphScene.scene && graphScene.scene.camera ? graphScene.scene.camera : null;
        if (camera) {
            this._scene = camera.scene;
            this._camera = camera;
        }
    }
    get graphScene (): GraphScene { return this._graphScene; }

    protected _recordUI (): void {
        const devicePass = this._currentQueue.devicePass;
        const rasterId = devicePass.rasterPassInfo.id;
        const passRenderData = context.renderGraph.getData(rasterId);
        // CCGlobal
        this._updateGlobal(passRenderData);
        // CCCamera, CCShadow, CCCSM
        const queueId = this._currentQueue.queueId;
        const queueRenderData = context.renderGraph.getData(queueId)!;
        this._updateGlobal(queueRenderData);

        const layoutName = context.renderGraph.getLayout(rasterId);
        const descSetData = getDescriptorSetDataFromLayout(layoutName);
        if (context.descriptorSet) {
            mergeSrcToTargetDesc(descSetData!.descriptorSet, context.descriptorSet, true);
        }
        this._currentQueue.isUpdateUBO = true;

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
                if (pass.phaseID !== this._currentQueue.phaseID) continue;
                const shader = batch.shaders[j];
                const inputAssembler: InputAssembler = batch.inputAssembler!;
                const pso = PipelineStateManager.getOrCreatePipelineState(deviceManager.gfxDevice, pass, shader, this._renderPass, inputAssembler);
                context.commandBuffer.bindPipelineState(pso);
                context.commandBuffer.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
                const ds = batch.descriptorSet!;
                context.commandBuffer.bindDescriptorSet(SetIndex.LOCAL, ds);
                context.commandBuffer.bindInputAssembler(inputAssembler);
                context.commandBuffer.draw(inputAssembler);
            }
        }
    }

    private _recordBlit (): void {
        if (!this.graphScene.blit) { return; }

        const blit = this.graphScene.blit;
        const currMat = blit.material;
        const pass = currMat!.passes[blit.passID];
        pass.update();
        const shader = pass.getShaderVariant();
        const devicePass = this._currentQueue.devicePass;
        const screenIa: InputAssembler = this._currentQueue.blitDesc!.screenQuad!.quadIA!;
        const globalDesc = context.descriptorSet;
        let pso: PipelineState | null = null;
        if (pass !== null && shader !== null && screenIa !== null) {
            pso = PipelineStateManager.getOrCreatePipelineState(
                context.device,
                pass,
                shader,
                devicePass.renderPass,
                screenIa,
            );
        }
        if (pso) {
            context.commandBuffer.bindPipelineState(pso);
            context.commandBuffer.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
            context.commandBuffer.bindDescriptorSet(SetIndex.LOCAL, this._currentQueue.blitDesc!.stageDesc!);
            context.commandBuffer.bindInputAssembler(screenIa);
            context.commandBuffer.draw(screenIa);
        }
    }

    protected _updateGlobal (data: RenderData): void {
        const devicePass = this._currentQueue.devicePass;
        updateGlobalDescBinding(data, context.renderGraph.getLayout(devicePass.rasterPassInfo.id));
    }

    protected _updateRenderData (): void {
        if (this._currentQueue.isUpdateUBO) return;
        const devicePass = this._currentQueue.devicePass;
        const rasterId = devicePass.rasterPassInfo.id;
        const passRenderData = context.renderGraph.getData(rasterId);
        // CCGlobal
        this._updateGlobal(passRenderData);
        // CCCamera, CCShadow, CCCSM
        const queueId = this._currentQueue.queueId;
        const queueRenderData = context.renderGraph.getData(queueId)!;
        this._updateGlobal(queueRenderData);
        const sceneId = this.graphScene.sceneID;
        const sceneRenderData = context.renderGraph.getData(sceneId)!;
        if (sceneRenderData) this._updateGlobal(sceneRenderData);
        const layoutName = context.renderGraph.getLayout(rasterId);
        const descSetData = getDescriptorSetDataFromLayout(layoutName);
        mergeSrcToTargetDesc(descSetData!.descriptorSet, context.descriptorSet, true);
        this._currentQueue.isUpdateUBO = true;
    }

    private _applyViewport (): void {
        const queueViewport = this._currentQueue.viewport;
        if (queueViewport) {
            context.commandBuffer.setViewport(queueViewport);
            context.commandBuffer.setScissor(this._currentQueue.scissor!);
        } else if (!this._currentQueue.devicePass.viewport) {
            const texture = this._currentQueue.devicePass.framebuffer.colorTextures[0]!;
            const graphScene = this.graphScene;
            const lightInfo = graphScene.scene ? graphScene.scene.light : null;
            const area = isShadowMap(this.graphScene) && graphScene.scene && lightInfo!.light
                ? getRenderArea(this.camera!, texture.width, texture.height, lightInfo!.light, lightInfo!.level)
                : getRenderArea(this.camera!, texture.width, texture.height);
            sceneViewport.left = area.x;
            sceneViewport.top = area.y;
            sceneViewport.width = area.width;
            sceneViewport.height = area.height;
            context.commandBuffer.setViewport(sceneViewport);
            context.commandBuffer.setScissor(area);
        }
    }

    public record (): void {
        const devicePass = this._currentQueue.devicePass;
        const sceneCulling = context.culling;
        this._updateRenderData();
        this._applyViewport();
        // Currently processing blit and camera first
        if (this.graphScene.blit) {
            this._recordBlit();
            return;
        }
        const renderQueueDesc = sceneCulling.renderQueueIndex.get(this.graphScene.sceneID)!;
        const renderQueue = sceneCulling.renderQueues[renderQueueDesc.renderQueueTarget];
        const graphSceneData = this.graphScene.scene!;
        renderQueue.recordCommands(context.commandBuffer, this._renderPass);
        if (bool(graphSceneData.flags & SceneFlags.REFLECTION_PROBE)) renderQueue.probeQueue.removeMacro();
        if (graphSceneData.flags & SceneFlags.GEOMETRY) {
            this.camera!.geometryRenderer?.render(
                devicePass.renderPass,
                context.commandBuffer,
                context.pipeline.pipelineSceneData,
            );
        }
        if (graphSceneData.flags & SceneFlags.UI) {
            this._recordUI();
        }
    }
}

class ExecutorPools {
    constructor (context: ExecutorContext) {
        this.deviceQueuePool = new RecyclePool<DeviceRenderQueue>((): DeviceRenderQueue => new DeviceRenderQueue(), 16);
        this.deviceScenePool = new RecyclePool<DeviceRenderScene>((): DeviceRenderScene => new DeviceRenderScene(), 16);
        this.computeQueuePool = new RecyclePool<DeviceComputeQueue>((): DeviceComputeQueue => new DeviceComputeQueue(), 16);
        this.graphScenePool = new RecyclePool<GraphScene>((): GraphScene => new GraphScene(), 16);
        this.rasterPassInfoPool = new RecyclePool<RasterPassInfo>((): RasterPassInfo => new RasterPassInfo(), 16);
        this.computePassInfoPool = new RecyclePool<ComputePassInfo>((): ComputePassInfo => new ComputePassInfo(), 16);
        this.reflectionProbe = new RecyclePool<RenderReflectionProbeQueue>((): RenderReflectionProbeQueue => new RenderReflectionProbeQueue(context.pipeline), 8);
        this.passPool = new RecyclePool<IRenderPass>((): { priority: number; hash: number; depth: number; shaderId: number; subModel: any; passIdx: number; } => ({
            priority: 0,
            hash: 0,
            depth: 0,
            shaderId: 0,
            subModel: null!,
            passIdx: 0,
        }), 64);
    }
    addDeviceQueue (): DeviceRenderQueue {
        return this.deviceQueuePool.add();
    }
    addComputeQueue (): DeviceComputeQueue {
        return this.computeQueuePool.add();
    }
    addGraphScene (): GraphScene {
        return this.graphScenePool.add();
    }
    addDeviceScene (): DeviceRenderScene {
        return this.deviceScenePool.add();
    }
    addReflectionProbe (): RenderReflectionProbeQueue {
        return this.reflectionProbe.add();
    }
    addRasterPassInfo (): RasterPassInfo {
        return this.rasterPassInfoPool.add();
    }
    addComputePassInfo (): ComputePassInfo {
        return this.computePassInfoPool.add();
    }
    reset (): void {
        this.deviceQueuePool.reset();
        this.computeQueuePool.reset();
        this.graphScenePool.reset();
        this.reflectionProbe.reset();
        this.computePassInfoPool.reset();
        this.deviceScenePool.reset();
    }
    readonly deviceQueuePool: RecyclePool<DeviceRenderQueue>;
    readonly computeQueuePool: RecyclePool<DeviceComputeQueue>;
    readonly graphScenePool: RecyclePool<GraphScene>;
    readonly reflectionProbe: RecyclePool<RenderReflectionProbeQueue>;
    readonly passPool: RecyclePool<IRenderPass>;
    readonly rasterPassInfoPool: RecyclePool<RasterPassInfo>;
    readonly computePassInfoPool: RecyclePool<ComputePassInfo>;
    readonly deviceScenePool: RecyclePool<DeviceRenderScene>;
}

const vbData = new Float32Array(4 * 4);
const quadRect = new Rect();
// The attribute length of the volume light
const volLightAttrCount = 5;

class BlitInfo {
    private _pipelineIAData: PipelineInputAssemblerData;
    private _context: ExecutorContext;
    private _width: number;
    private _height: number;
    private _lightVolumeBuffer!: Buffer;
    private _lightBufferData!: Float32Array;
    private _deferredLitsBufView!: Buffer;
    private _localUBO!: Buffer;
    private _stageDescs: Map<Pass, DescriptorSet> = new Map();
    get pipelineIAData (): PipelineInputAssemblerData {
        return this._pipelineIAData;
    }
    get deferredLitsBufView (): Buffer {
        return this._deferredLitsBufView;
    }
    get lightVolumeBuffer (): Buffer {
        return this._lightVolumeBuffer;
    }
    get lightBufferData (): Float32Array {
        return this._lightBufferData;
    }
    get stageDescs (): Map<Pass, DescriptorSet> {
        return this._stageDescs;
    }
    get emptyLocalUBO (): Buffer {
        return this._localUBO;
    }
    constructor (context: ExecutorContext) {
        this._context = context;
        this._width = context.width;
        this._height = context.height;
        this._pipelineIAData = this._createQuadInputAssembler();
        const vb = this._genQuadVertexData(SurfaceTransform.IDENTITY, new Rect(0, 0, context.width, context.height));
        this._pipelineIAData.quadVB!.update(vb);
        this._createLightVolumes();
        this._localUBO = context.device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
            UBOLocal.SIZE,
            UBOLocal.SIZE,
        ));
    }

    resize (width, height): void {
        if (width !== this._width || height !== this._height) {
            quadRect.y = quadRect.x = 0;
            quadRect.width = width;
            quadRect.height = height;
            const vb = this._genQuadVertexData(SurfaceTransform.IDENTITY, quadRect);
            this._pipelineIAData.quadVB!.update(vb);
        }
    }

    private _createLightVolumes (): void {
        const device = this._context.root.device;
        let totalSize = Float32Array.BYTES_PER_ELEMENT * volLightAttrCount * 4 * UBODeferredLight.LIGHTS_PER_PASS;
        totalSize = Math.ceil(totalSize / device.capabilities.uboOffsetAlignment) * device.capabilities.uboOffsetAlignment;

        this._lightVolumeBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            totalSize,
            device.capabilities.uboOffsetAlignment,
        ));

        this._deferredLitsBufView = device.createBuffer(new BufferViewInfo(this._lightVolumeBuffer, 0, totalSize));
        this._lightBufferData = new Float32Array(totalSize / Float32Array.BYTES_PER_ELEMENT);
    }

    private _genQuadVertexData (surfaceTransform: SurfaceTransform, renderArea: Rect): Float32Array {
        const minX = renderArea.x / this._context.width;
        const maxX = (renderArea.x + renderArea.width) / this._context.width;
        let minY = renderArea.y / this._context.height;
        let maxY = (renderArea.y + renderArea.height) / this._context.height;
        if (this._context.root.device.capabilities.screenSpaceSignY > 0) {
            const temp = maxY;
            maxY = minY;
            minY = temp;
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
    private _createQuadInputAssembler (): PipelineInputAssemblerData {
        // create vertex buffer
        const inputAssemblerData = new PipelineInputAssemblerData();

        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;
        const device = cclegacy.director.root.device;
        const quadVB: Buffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE | MemoryUsageBit.HOST,
            vbSize,
            vbStride,
        ));

        if (!quadVB) {
            return inputAssemblerData;
        }

        // create index buffer
        const ibStride = Uint16Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        const quadIB: Buffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
            ibSize,
            ibStride,
        ));

        if (!quadIB) {
            return inputAssemblerData;
        }

        const indices = new Uint16Array(6);
        indices[0] = 0; indices[1] = 1; indices[2] = 2;
        indices[3] = 1; indices[4] = 3; indices[5] = 2;

        quadIB.update(indices.buffer);

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
}

class ExecutorContext {
    constructor (
        pipeline: BasicPipeline,
        ubo: PipelineUBO,
        device: Device,
        resourceGraph: ResourceGraph,
        renderGraph: RenderGraph,
        layoutGraph: LayoutGraphData,
        width: number,
        height: number,
        descriptorSet = null,
    ) {
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
        this.additiveLight = new RenderAdditiveLightQueue(pipeline);
        this.pools = new ExecutorPools(this);
        this.blit = new BlitInfo(this);
        this.culling = new SceneCulling();
        this.descriptorSet = descriptorSet;
    }
    reset (): void {
        this.culling.clear();
        this.pools.reset();
        this.cullCamera = null;
        for (const infoMap of this.submitMap) {
            for (const info of infoMap[1]) info[1].reset();
        }
        this.lightResource.clear();
    }
    resize (width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.blit.resize(width, height);
    }
    readonly device: Device;
    readonly pipeline: BasicPipeline;
    readonly commandBuffer: CommandBuffer;
    readonly pipelineSceneData: PipelineSceneData;
    readonly resourceGraph: ResourceGraph;
    readonly devicePasses: Map<number, DeviceRenderPass> = new Map<number, DeviceRenderPass>();
    readonly deviceTextures: Map<string, DeviceTexture> = new Map<string, DeviceTexture>();
    readonly deviceBuffers: Map<string, DeviceBuffer> = new Map<string, DeviceBuffer>();
    readonly layoutGraph: LayoutGraphData;
    readonly root: Root;
    readonly ubo: PipelineUBO;
    readonly additiveLight: RenderAdditiveLightQueue;
    readonly submitMap: Map<Camera, Map<number, SubmitInfo>> = new Map<Camera, Map<number, SubmitInfo>>();
    readonly pools: ExecutorPools;
    readonly blit: BlitInfo;
    readonly culling: SceneCulling;
    lightResource: LightResource = new LightResource();
    renderGraph: RenderGraph;
    width: number;
    height: number;
    cullCamera;
    descriptorSet: DescriptorSet | null;
}

export class Executor {
    constructor (
        pipeline: BasicPipeline,
        ubo: PipelineUBO,
        device: Device,
        resourceGraph: ResourceGraph,
        layoutGraph: LayoutGraphData,
        width: number,
        height: number,
    ) {
        context = this._context = new ExecutorContext(
            pipeline,
            ubo,
            device,
            resourceGraph,
            new RenderGraph(),
            layoutGraph,
            width,
            height,
        );
        const programLib: WebProgramLibrary = cclegacy.rendering.programLib;
        context.lightResource.init(programLib, device, 16);
    }

    resize (width: number, height: number): void {
        context.resize(width, height);
    }

    private _removeDeviceResource (): void {
        const pipeline: any = context.pipeline;
        const resourceUses = pipeline.resourceUses;
        const deletes: string[] = [];
        const deviceTexs = context.deviceTextures;
        for (const [name, dTex] of deviceTexs) {
            const resId = context.resourceGraph.vertex(name);
            const trait = context.resourceGraph.getTraits(resId);
            if (!resourceUses.includes(name)) {
                switch (trait.residency) {
                case ResourceResidency.MANAGED:
                    deletes.push(name);
                    break;
                default:
                }
            }
        }
        for (const name of deletes) {
            deviceTexs.get(name)!.release();
            deviceTexs.delete(name);
        }

        const deletesBuff: string[] = [];
        const deviceBuffs = context.deviceBuffers;
        for (const [name, dBuff] of deviceBuffs) {
            const resId = context.resourceGraph.vertex(name);
            const trait = context.resourceGraph.getTraits(resId);
            if (!resourceUses.includes(name)) {
                switch (trait.residency) {
                case ResourceResidency.MANAGED:
                    deletesBuff.push(name);
                    break;
                default:
                }
            }
        }
        for (const name of deletesBuff) {
            deviceBuffs.get(name)!.release();
            deviceBuffs.delete(name);
        }
        resourceUses.length = 0;
    }

    execute (rg: RenderGraph): void {
        context.renderGraph = rg;
        context.reset();
        const cmdBuff = context.commandBuffer;
        const culling = context.culling;
        culling.buildRenderQueues(rg, context.layoutGraph, context.pipelineSceneData);
        context.lightResource.buildLights(culling, context.pipelineSceneData.isHDR, context.pipelineSceneData.shadows);
        culling.uploadInstancing(cmdBuff);
        this._removeDeviceResource();
        cmdBuff.begin();
        if (!this._visitor) this._visitor = new RenderVisitor();
        depthFirstSearch(this._visitor.graphView, this._visitor, this._visitor.colorMap);
        cmdBuff.end();
        context.device.queue.submit([cmdBuff]);
    }

    release (): void {
        context.devicePasses.clear();
        for (const [k, v] of context.deviceTextures) {
            v.release();
        }
        context.deviceTextures.clear();

        for (const [k, v] of context.deviceBuffers) {
            v.release();
        }
        context.deviceBuffers.clear();
    }
    readonly _context: ExecutorContext;
    private _visitor: RenderVisitor | undefined;
}

class BaseRenderVisitor {
    public queueID = 0xFFFFFFFF;
    public sceneID = 0xFFFFFFFF;
    public passID = 0xFFFFFFFF;
    public dispatchID = 0xFFFFFFFF;
    public currPass: DeviceRenderPass | DeviceComputePass | undefined;
    public currQueue: DeviceRenderQueue |DeviceComputeQueue | undefined;
    public rg: RenderGraph;
    constructor () {
        this.rg = context.renderGraph;
    }
    protected _isRasterPass (u: number): boolean {
        return !!context.renderGraph.tryGetRasterPass(u);
    }
    protected isComputePass (u: number): boolean {
        return !!context.renderGraph.tryGetCompute(u);
    }
    protected isDispatch (u: number): boolean {
        return !!context.renderGraph.tryGetDispatch(u);
    }
    protected _isQueue (u: number): boolean {
        return !!context.renderGraph.tryGetQueue(u);
    }
    protected _isScene (u: number): boolean {
        return !!context.renderGraph.tryGetScene(u);
    }
    protected _isBlit (u: number): boolean {
        return !!context.renderGraph.tryGetBlit(u);
    }
    applyID (id: number): void {
        if (this._isRasterPass(id)) {
            this.passID = id;
        } else if (this._isQueue(id)) {
            this.queueID = id;
        } else if (this._isScene(id) || this._isBlit(id)) {
            this.sceneID = id;
        } else if (this.isComputePass(id)) {
            this.passID = id;
        } else if (this.isDispatch(id)) {
            this.dispatchID = id;
        }
    }
}

class PreRenderVisitor extends BaseRenderVisitor implements RenderGraphVisitor {
    constructor () {
        super();
    }
    clear (value: ClearView[]): void {
        // do nothing
    }
    viewport (value: Viewport): void {
        // do nothing
    }
    rasterPass (pass: RasterPass): void {
        if (!this.rg.getValid(this.passID)) return;
        const devicePasses = context.devicePasses;
        const passHash = pass.hashValue;
        this.currPass = devicePasses.get(passHash);
        if (!this.currPass) {
            const rasterInfo = context.pools.addRasterPassInfo();
            rasterInfo.applyInfo(this.passID, pass);
            this.currPass = new DeviceRenderPass(rasterInfo);
            devicePasses.set(passHash, this.currPass);
        } else {
            this.currPass.resetResource(this.passID, pass);
        }
        this.currPass.preRecord();
    }
    rasterSubpass (value: RasterSubpass): void {
        // do nothing
    }
    computeSubpass (value: ComputeSubpass): void {
        // do nothing
    }
    resolve (value: ResolvePass): void {
        // do nothing
    }
    move (value: MovePass): void {
        // do nothing
    }
    raytrace (value: RaytracePass): void {
        // do nothing
    }
    compute (pass: ComputePass): void {
        if (!this.rg.getValid(this.passID)) return;
        const devicePasses = context.devicePasses;
        const computeInfo = new ComputePassInfo();
        computeInfo.applyInfo(this.passID, pass);
        this.currPass = new DeviceComputePass(computeInfo);
        this.currPass.preRecord();
        this.currPass.record();
    }
    copy (value: CopyPass): void {
        if (value.uploadPairs.length) {
            for (const upload of value.uploadPairs) {
                const resBuffers = context.deviceBuffers;
                const resourceGraph = context.resourceGraph;
                const vertId = resourceGraph.vertex(upload.target);
                resourceVisitor.resName = upload.target;
                resourceGraph.visitVertex(resourceVisitor, vertId);

                const gfxBuffer = resBuffers.get(upload.target);
                context.device.commandBuffer.updateBuffer(gfxBuffer!.buffer!, upload.source, upload.source.byteLength);
            }
        }
    }
    queue (value: RenderQueue): void {
        if (!this.rg.getValid(this.queueID)) return;
        let deviceQueue: DeviceComputeQueue | DeviceRenderQueue;
        if ('rasterPassInfo' in this.currPass!) {
            deviceQueue = context.pools.addDeviceQueue();
            deviceQueue.init(this.currPass, value, this.queueID);
            this.currQueue = deviceQueue;
            this.currPass.addQueue(deviceQueue);
        } else {
            deviceQueue = context.pools.addComputeQueue();
            deviceQueue.init(this.currPass!, value, this.queueID);
            this.currQueue = deviceQueue;
            this.currPass!.addQueue(deviceQueue);
        }
        const layoutName = this.rg.getLayout(this.queueID);
        if (layoutName) {
            const layoutGraph = context.layoutGraph;
            if (this.currPass!.renderLayout) {
                const layoutId = layoutGraph.locateChild(this.currPass!.renderLayout.layoutID, layoutName);
                this.currQueue.layoutID = layoutId;
            }
        }
        this.currQueue.preRecord();
    }
    scene (value: SceneData): void {
        if (!this.rg.getValid(this.sceneID)) return;
        const renderQueue = this.currQueue as DeviceRenderQueue;
        const graphScene = context.pools.addGraphScene();
        graphScene.init(value, null, this.sceneID);
        const renderScene = renderQueue.addScene(graphScene);
        renderScene.preRecord();
    }
    blit (value: Blit): void {
        if (!this.rg.getValid(this.sceneID)) return;
        const renderQueue = this.currQueue as DeviceRenderQueue;
        const graphScene = context.pools.addGraphScene();
        graphScene.init(null, value, -1);
        const renderScene = renderQueue.addScene(graphScene);
        renderScene.preRecord();
    }
    dispatch (value: Dispatch): void {
        let pso: PipelineState | null = null;
        const devicePass = this.currPass as DeviceComputePass;
        const pass = value.material?.passes[value.passID];
        pass?.update();
        const shader = pass?.getShaderVariant();

        if (pass !== null && shader !== null) {
            const psoInfo = new PipelineStateInfo(
                shader,
                pass?.pipelineLayout,
            );
            psoInfo.bindPoint = PipelineBindPoint.COMPUTE;
            pso = deviceManager.gfxDevice.createPipelineState(psoInfo);
        }
        const cmdBuff = context.commandBuffer;
        if (pso) {
            cmdBuff.bindPipelineState(pso);
            const layoutStage = devicePass.renderLayout;
            const layoutDesc = layoutStage!.descriptorSet!;
            cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, layoutDesc);
        }

        const gx = value.threadGroupCountX;
        const gy = value.threadGroupCountY;
        const gz = value.threadGroupCountZ;
        (cmdBuff as any).dispatch(new DispatchInfo(gx, gy, gz));
    }
}

class PostRenderVisitor extends BaseRenderVisitor implements RenderGraphVisitor {
    constructor () {
        super();
    }
    clear (value: ClearView[]): void {
        // do nothing
    }
    viewport (value: Viewport): void {
        // do nothing
    }
    rasterPass (pass: RasterPass): void {
        const devicePasses = context.devicePasses;
        const passHash = pass.hashValue;
        const currPass = devicePasses.get(passHash);
        if (!currPass) return;
        this.currPass = currPass;
        this.currPass.record();
    }
    rasterSubpass (value: RasterSubpass): void {
        // do nothing
    }
    computeSubpass (value: ComputeSubpass): void {
        // do nothing
    }
    resolve (value: ResolvePass): void {
        // do nothing
    }
    compute (value: ComputePass): void {
        // do nothing
    }
    copy (value: CopyPass): void {
        // do nothing
    }
    move (value: MovePass): void {
        // do nothing
    }
    raytrace (value: RaytracePass): void {
        // do nothing
    }
    queue (value: RenderQueue): void {
        // collect scene results
    }
    scene (value: SceneData): void {
        // scene command list finished
    }
    blit (value: Blit): void {
        // do nothing
    }
    dispatch (value: Dispatch): void {
        // do nothing
    }
}

export class RenderVisitor extends DefaultVisitor {
    private _preVisitor: PreRenderVisitor;
    private _postVisitor: PostRenderVisitor;
    private _graphView: ReferenceGraphView<RenderGraph>;
    private _colorMap: VectorGraphColorMap;
    constructor () {
        super();
        this._preVisitor = new PreRenderVisitor();
        this._postVisitor = new PostRenderVisitor();
        this._graphView = new ReferenceGraphView<RenderGraph>(context.renderGraph);
        this._colorMap = new VectorGraphColorMap(context.renderGraph.numVertices());
    }

    get graphView (): ReferenceGraphView<RenderGraph> { return this._graphView; }
    get colorMap (): VectorGraphColorMap { return this._colorMap; }
    discoverVertex (u: number, gv: ReferenceGraphView<RenderGraph>): void {
        const g = gv.g;
        this._preVisitor.applyID(u);
        g.visitVertex(this._preVisitor, u);
    }
    finishVertex (v: number, gv: ReferenceGraphView<RenderGraph>): void {
        const g = gv.g;
        g.visitVertex(this._postVisitor, v);
    }
}
