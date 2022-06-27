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
import { AccessFlagBit, Buffer, ClearFlagBit, Color, ColorAttachment, CommandBuffer, DepthStencilAttachment, Device, deviceManager, Format, Framebuffer,
    FramebufferInfo, GeneralBarrierInfo, LoadOp, PipelineState, Rect, RenderPass, RenderPassInfo, StoreOp, Swapchain, Texture, TextureInfo,
    TextureType, TextureUsageBit, Viewport } from '../../gfx';
import { legacyCC } from '../../global-exports';
import { BatchingSchemes } from '../../renderer';
import { Camera, SKYBOX_FLAG } from '../../renderer/scene/camera';
import { Root } from '../../root';
import { BatchedBuffer } from '../batched-buffer';
import { SetIndex } from '../define';
import { PipelineSceneData } from '../pipeline-scene-data';
import { Pipeline, SceneVisitor } from './pipeline';
import { AccessType, AttachmentType, Blit, ComputePass, CopyPass, Dispatch, ManagedResource, MovePass, PresentPass,
    RasterPass, RaytracePass, RenderGraph, RenderGraphVisitor, RenderQueue, RenderSwapchain, ResourceDesc,
    ResourceGraph, ResourceGraphVisitor, ResourceTraits, SceneData } from './render-graph';
import { QueueHint, ResourceDimension, ResourceFlags } from './types';
import { PipelineUBO } from './ubos';
import { RenderInfo, RenderObject, WebSceneTask, WebSceneTransversal } from './web-scene';
import { WebSceneVisitor } from './web-scene-visitor';

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
}

class DeviceBuffer extends DeviceResource {
    constructor (name: string, context: ExecutorContext) {
        super(name, context);
    }
}
class DeviceRenderQueue {
    private _preSceneTasks: DevicePreSceneTask[] = [];
    private _sceneTasks: DeviceSceneTask[] = [];
    private _postSceneTasks: DevicePostSceneTask[] = [];
    private _devicePass: DeviceRenderPass;
    private _hint: QueueHint =  QueueHint.NONE;
    private _phaseID = getPhaseID('default');
    protected _transversal: DeviceSceneTransversal | null = null;
    get phaseID (): number { return this._phaseID; }

    private _sceneVisitor: WebSceneVisitor;
    constructor (devicePass: DeviceRenderPass) {
        this._devicePass = devicePass;
        this._sceneVisitor = new WebSceneVisitor(this._devicePass.context.commandBuffer,
            this._devicePass.context.pipeline.pipelineSceneData);
    }
    addSceneTask (scene: SceneData) {
        if (!this._transversal) {
            this._transversal = new DeviceSceneTransversal(this, this.devicePass.context.pipelineSceneData,  scene.camera!);
        }
        this._preSceneTasks.push(this._transversal.preRenderPass(this._sceneVisitor));
        this._sceneTasks.push(this._transversal.transverse(this._sceneVisitor));
    }
    clearTasks () {
        this._sceneTasks.length = 0;
    }
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
}

class DeviceRenderPass {
    protected _renderPass: RenderPass;
    protected _framebuffer: Framebuffer;
    protected _clearColor: Color[] = [];
    protected _deviceQueues: DeviceRenderQueue[] = [];
    protected _clearDepth = 1;
    protected _clearStencil = 0;
    protected _context: ExecutorContext;
    private _rasterPass: RasterPass;
    public submitMap: Map<Camera, SubmitInfo> = new Map<Camera, SubmitInfo>();
    constructor (context: ExecutorContext, rasterPass: RasterPass) {
        this._context = context;
        this._rasterPass = rasterPass;
        const device = context.device;
        const depthStencilAttachment = new DepthStencilAttachment();
        depthStencilAttachment.format = Format.DEPTH_STENCIL;
        depthStencilAttachment.stencilStoreOp = StoreOp.DISCARD;
        depthStencilAttachment.depthStoreOp = StoreOp.DISCARD;
        depthStencilAttachment.barrier = device.getGeneralBarrier(new GeneralBarrierInfo(
            AccessFlagBit.DEPTH_STENCIL_ATTACHMENT_WRITE,
            AccessFlagBit.DEPTH_STENCIL_ATTACHMENT_WRITE,
        ));
        const colors: ColorAttachment[] = [];
        const colorTexs: Texture[] = [];
        let depthTex: Texture | null = null;
        let swapchain: Swapchain | null = null;
        let framebuffer: Framebuffer | null = null;
        for (const [resName, rasterV] of rasterPass.rasterViews) {
            let resTex = context.deviceTextures.get(resName);
            if (rasterV.accessType === AccessType.READ || resTex) {
                continue;
            }
            const resourceGraph = context.resourceGraph;
            const vertId = resourceGraph.vertex(resName);
            const resourceVisitor = new ResourceVisitor(resName, context);
            resourceGraph.visitVertex(resourceVisitor, vertId);
            resTex = context.deviceTextures.get(resName)!;
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
                    if (!(clearFlag & ClearFlagBit.COLOR)) {
                        rasterV.clearColor.x = 0;
                        rasterV.clearColor.y = 0;
                        rasterV.clearColor.z = 0;
                        rasterV.clearColor.w = 1;
                        if (clearFlag & SKYBOX_FLAG) {
                            colorAttachment.loadOp = LoadOp.DISCARD;
                        } else {
                            colorAttachment.loadOp = LoadOp.LOAD;
                            colorAttachment.barrier = device.getGeneralBarrier(new GeneralBarrierInfo(
                                AccessFlagBit.COLOR_ATTACHMENT_WRITE,
                                AccessFlagBit.COLOR_ATTACHMENT_WRITE,
                            ));
                        }
                    }
                    this._clearColor.push(rasterV.clearColor);
                    colors.push(colorAttachment);
                }
                break;
            case AttachmentType.DEPTH_STENCIL:
                if (!resTex.swapchain && !resTex.framebuffer) depthTex = resTex.texture!;
                if ((clearFlag & ClearFlagBit.DEPTH_STENCIL) !== ClearFlagBit.DEPTH_STENCIL) {
                    if (!(clearFlag & ClearFlagBit.DEPTH)) depthStencilAttachment.depthLoadOp = LoadOp.LOAD;
                    if (!(clearFlag & ClearFlagBit.STENCIL)) depthStencilAttachment.stencilLoadOp = LoadOp.LOAD;
                }
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
        if (!depthTex && !swapchain && !framebuffer) {
            depthTex = device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.DEPTH_STENCIL_ATTACHMENT | TextureUsageBit.SAMPLED,
                Format.DEPTH_STENCIL,
                colorTexs[0].width,
                colorTexs[0].height,
            ));
        }
        this._renderPass = device.createRenderPass(new RenderPassInfo(colors, depthStencilAttachment));
        this._framebuffer = framebuffer || device.createFramebuffer(new FramebufferInfo(this._renderPass,
            swapchain ? [swapchain.colorTexture] : colorTexs,
            swapchain ? swapchain.depthStencilTexture : depthTex));
    }
    get context () { return this._context; }
    get renderPass () { return this._renderPass; }
    get framebuffer () { return this._framebuffer; }
    get clearColor () { return this._clearColor; }
    get clearDepth () { return this._clearDepth; }
    get clearStencil () { return this._clearStencil; }
    get deviceQueues () { return this._deviceQueues; }
    get rasterPass () { return this._rasterPass; }
    addQueue (queue: DeviceRenderQueue) { this._deviceQueues.push(queue); }
    prePass () {
        for (const queue of this._deviceQueues) {
            queue.preRecord();
        }
    }
    // record common buffer
    record () {
        const cmdBuff = this._context.commandBuffer;
        const tex = this.framebuffer.colorTextures[0]!;
        cmdBuff.beginRenderPass(this.renderPass, this.framebuffer, new Rect(0, 0, tex.width, tex.height),
            this.clearColor, this.clearDepth, this.clearStencil);
        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL,
            this._context.pipeline.globalDSManager.globalDescriptorSet);
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
}

class DeviceSceneTransversal extends WebSceneTransversal {
    protected _currentQueue: DeviceRenderQueue;
    constructor (quque: DeviceRenderQueue, sceneData: PipelineSceneData, camera: Camera) {
        super(camera, sceneData);
        this._currentQueue = quque;
    }
    public preRenderPass (visitor: WebSceneVisitor): DevicePreSceneTask {
        return new DevicePreSceneTask(this._currentQueue, this._camera, visitor);
    }
    public transverse (visitor: WebSceneVisitor): DeviceSceneTask {
        return new DeviceSceneTask(this._currentQueue, this._camera, visitor);
    }
    public postRenderPass (visitor: WebSceneVisitor): DevicePostSceneTask {
        return new DevicePostSceneTask(this._sceneData, this._camera, visitor);
    }
}

class DevicePreSceneTask extends WebSceneTask {
    protected _currentQueue: DeviceRenderQueue;
    protected _renderPass: RenderPass;
    protected _submitInfo: SubmitInfo | null = null;
    private _cmdBuff: CommandBuffer;
    constructor (queue: DeviceRenderQueue, camera: Camera, visitor: SceneVisitor) {
        super(queue.devicePass.context.pipelineSceneData, camera, visitor);
        this._currentQueue = queue;
        this._renderPass = this._currentQueue.devicePass.renderPass;
        this._cmdBuff = this._currentQueue.devicePass.context.commandBuffer;
    }

    public start () {
        const submitMap = this._currentQueue.devicePass.submitMap;
        if (submitMap.has(this.camera)) {
            this._submitInfo = submitMap.get(this.camera)!;
        } else {
            // culling
            super.start();
            this._submitInfo = new SubmitInfo();
        }
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
                    } else {
                        switch (this._currentQueue.queueHint) {
                        case QueueHint.NONE:
                            this._insertRenderList(ro, subModels.indexOf(submodel), passes.indexOf(p));
                            this._insertRenderList(ro, subModels.indexOf(submodel), passes.indexOf(p), true);
                            break;
                        case QueueHint.RENDER_CUTOUT:
                        case QueueHint.RENDER_OPAQUE:
                            this._insertRenderList(ro, subModels.indexOf(submodel), passes.indexOf(p));
                            break;
                        case QueueHint.RENDER_TRANSPARENT:
                            this._insertRenderList(ro, subModels.indexOf(submodel), passes.indexOf(p), true);
                            break;
                        default:
                        }
                    }
                }
            }
        }

        this._submitInfo.opaqueList.sort(this._opaqueCompareFn);
        this._submitInfo.transparentList.sort(this._transparentCompareFn);
        if (!submitMap.has(this.camera)) submitMap.set(this.camera, this._submitInfo);
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

    public submit () {
        const ubo = this._currentQueue.devicePass.context.ubo;
        ubo.updateGlobalUBO(this.camera.window);
        ubo.updateCameraUBO(this.camera);
        ubo.updateShadowUBO(this.camera);

        this._uploadInstanceBuffers();
        this._uploadBatchedBuffers();
    }
}

class DeviceSceneTask extends WebSceneTask {
    protected _currentQueue: DeviceRenderQueue;
    protected _renderPass: RenderPass;
    constructor (queue: DeviceRenderQueue, camera: Camera, visitor: SceneVisitor) {
        super(queue.devicePass.context.pipelineSceneData, camera, visitor);
        this._currentQueue = queue;
        this._renderPass = this._currentQueue.devicePass.renderPass;
    }
    public start () {}
    protected _recordRenderList (isTransparent: boolean) {
        const submitMap = this._currentQueue.devicePass.submitMap;
        const renderList = isTransparent ? submitMap.get(this.camera)!.transparentList : submitMap.get(this.camera)!.opaqueList;
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
        const it = submitMap.get(this.camera)!.instances.values(); let res = it.next();
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
        const it = submitMap.get(this.camera)!.batches.values(); let res = it.next();
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
        const batches = this.camera.scene!.batches;
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            let visible = false;
            if (this.camera.visibility & batch.visFlags) {
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
    protected _generateRenderArea (): Rect {
        const out = new Rect();
        const vp = this.camera.viewport;
        const w = this.camera.window.width;
        const h = this.camera.window.height;
        out.x = vp.x * w;
        out.y = vp.y * h;
        out.width = vp.width * w;
        out.height = vp.height * h;
        return out;
    }
    public submit () {
        const area = this._generateRenderArea();
        this.visitor.setViewport(new Viewport(area.x, area.y, area.width, area.height));
        this.visitor.setScissor(area);
        this._recordOpaqueList();
        this._recordInstences();
        this._recordBatches();
        this._recordTransparentList();
        this._recordUI();
    }
}

class DevicePostSceneTask extends WebSceneTask {}

class ExecutorContext {
    constructor (pipeline: Pipeline,
        ubo: PipelineUBO,
        device: Device,
        resourceGraph: ResourceGraph,
        renderGraph: RenderGraph) {
        this.pipeline = pipeline;
        this.device = device;
        this.commandBuffer = device.commandBuffer;
        this.pipelineSceneData = pipeline.pipelineSceneData;
        this.resourceGraph = resourceGraph;
        this.renderGraph = renderGraph;
        this.root = legacyCC.director.root;
        this.ubo = ubo;
    }
    readonly device: Device;
    readonly pipeline: Pipeline;
    readonly commandBuffer: CommandBuffer;
    readonly pipelineSceneData: PipelineSceneData;
    readonly resourceGraph: ResourceGraph;
    readonly devicePasses: Map<number, DeviceRenderPass> = new Map<number, DeviceRenderPass>();
    readonly deviceTextures: Map<string, DeviceTexture> = new Map<string, DeviceTexture>();
    readonly renderGraph: RenderGraph;
    readonly root: Root;
    readonly ubo: PipelineUBO;
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
    raster (pass: RasterPass) {
        if (!pass.isValid) {
            return;
        }
        const rg = this._context.renderGraph;
        const devicePasses = this._context.devicePasses;
        this._currPass = devicePasses.get(this.passID);
        if (!this._currPass) {
            this._currPass = new DeviceRenderPass(this._context, pass);
            devicePasses.set(this.passID, this._currPass);
            for (const q of rg.children(this.passID)) {
                const queueID = q.target as number;
                this._queueID = queueID;
                rg.visitVertex(this, queueID);
            }
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
        this._currQueue = deviceQueue;
        this._currPass!.addQueue(deviceQueue);
        const rg = this._context.renderGraph;
        for (const s of rg.children(this._queueID)) {
            const sceneID = s.target as number;
            this._sceneID = sceneID;
            rg.visitVertex(this, sceneID);
        }
    }
    scene (value: SceneData) {
        this._currQueue!.addSceneTask(value);
    }
    blit (value: Blit) {
    }
    dispatch (value: Dispatch) {
    }
}

export class Executor {
    constructor (pipeline: Pipeline,
        ubo: PipelineUBO,
        device: Device,
        resourceGraph: ResourceGraph) {
        this._pipeline = pipeline;
        this._device = device;
        this._ubo = ubo;
        this._commandBuffer = device.commandBuffer;
        this._resourceGraph = resourceGraph;
    }

    execute (rg: RenderGraph) {
        const context = new ExecutorContext(
            this._pipeline,
            this._ubo,
            this._device,
            this._resourceGraph,
            rg,
        );
        const cmdBuff = context.commandBuffer;
        cmdBuff.begin();
        const passVisitor = new PassVisitor(context);
        for (const vertID of rg.vertices()) {
            if (rg.numParents(vertID) === 0) {
                // vertex has no parents, must be pass
                passVisitor.passID = vertID;
                rg.visitVertex(passVisitor, vertID);
            }
        }
        cmdBuff.end();
        context.device.queue.submit([cmdBuff]);
    }
    private readonly _pipeline: Pipeline;
    private readonly _device: Device;
    private readonly _commandBuffer: CommandBuffer;
    private readonly _resourceGraph: ResourceGraph;
    private readonly _ubo: PipelineUBO;
}
