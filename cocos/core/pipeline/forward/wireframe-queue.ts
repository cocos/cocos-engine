import { CommandBuffer } from '../../gfx/command-buffer';
import { Device } from '../../gfx/device';
import { RenderPass } from '../../gfx/render-pass';
import { DSPool, PassHandle, PassPool, PassView, ShaderPool, SubModelPool, SubModelView } from '../../renderer';
import { IRenderObject, IRenderPass, IRenderQueueDesc, SetIndex } from '../define';
import { PipelineStateManager } from '../pipeline-state-manager';
import { Buffer, BufferInfo, BufferUsageBit, InputAssemblerInfo, MemoryUsageBit, PipelineState, PrimitiveMode } from '../../gfx';
import { ForwardPipeline } from './forward-pipeline';
import legacyCC from '../../../../predefine';
import { InstancedBuffer } from '../instanced-buffer';
import { BatchedBuffer } from '../batched-buffer';
import { CachedArray } from '../../memop/cached-array';
import { RecyclePool } from '../../memop/recycle-pool';

enum WireframeType {
    Render,
    Instanced,
    Batched
}

let pass; let shader;
export class WireframeQueue {
    /**
     * @en A cached array of render passes
     * @zh 基于缓存数组的渲染过程队列。
     */
    public queue: CachedArray<IRenderPass> | null = null;
    private _passDesc: IRenderQueueDesc | null = null;
    private _passPool: RecyclePool<IRenderPass> | null = null;
    private _pipeline: ForwardPipeline | null = null;
    /**
     * @en A set of instanced buffer
     * @zh Instance 合批缓存集合。
     */
    public queueInstanced = new Set<[InstancedBuffer, any]>();
    /**
     * @en A set of dynamic batched buffer
     * @zh 动态合批缓存集合。
     */
    public queueBatched = new Set<[BatchedBuffer, any]>();

    constructor (pipeline: ForwardPipeline | null = null, desc: IRenderQueueDesc | null = null) {
        if (desc) this.initRenderQueue(desc);
        if (pipeline) this.setPipeline(pipeline);
    }

    setPipeline (pipeline: ForwardPipeline) {
        this._pipeline = pipeline;
    }

    addInstanced (instanceBuffer:InstancedBuffer, subModel: any) {
        this.queueInstanced.add([instanceBuffer, subModel]);
    }

    addBatched (batchedBuffer: BatchedBuffer, subModel: any) {
        this.queueBatched.add([batchedBuffer, subModel]);
    }

    initRenderQueue (desc: IRenderQueueDesc) {
        this._passDesc = desc;
        this._passPool = new RecyclePool(() => ({
            hash: 0,
            depth: 0,
            shaderId: 0,
            subModel: null!,
            passIdx: 0,
        }), 64);
        this.queue = new CachedArray(64, this._passDesc.sortFunc);
    }

    private _clearInstancedQueue () {
        const itInstanced = this.queueInstanced.values();
        let instanceRes = itInstanced.next();
        while (!instanceRes.done) {
            instanceRes.value[0].clear();
            instanceRes = itInstanced.next();
        }
        this.queueInstanced.clear();
    }

    private _clearBatchedQueue () {
        const itBatched = this.queueBatched.values();
        let res = itBatched.next();
        while (!res.done) {
            res.value[0].clear();
            res = itBatched.next();
        }
        this.queueBatched.clear();
    }

    private _clearRenderQueue () {
        if (this.queue) this.queue.clear();
        if (this._passPool) this._passPool.reset();
    }
    /**
     * @en Clear the render queue
     * @zh 清空渲染队列。
     */
    public clear () {
        this._clearRenderQueue();
        this._clearBatchedQueue();
        this._clearInstancedQueue();
    }

    /**
     * @en Insert a render pass into the queue
     * @zh 插入渲染过程。
     * @param renderObj The render object of the pass
     * @param modelIdx The model id
     * @param passIdx The pass id
     * @returns Whether the new render pass is successfully added
     */
    public insertRenderPass (renderObj: IRenderObject, subModelIdx: number, passIdx: number): boolean {
        const subModel = renderObj.model.subModels[subModelIdx];
        const hPass = SubModelPool.get(subModel.handle, SubModelView.PASS_0 + passIdx) as PassHandle;
        const isTransparent = subModel.passes[passIdx].blendState.targets[0].blend;
        if (isTransparent !== this._passDesc!.isTransparent || !(PassPool.get(hPass, PassView.PHASE) & this._passDesc!.phases)) {
            return false;
        }
        const hash = (0 << 30) | PassPool.get(hPass, PassView.PRIORITY) << 16 | subModel.priority << 8 | passIdx;
        const rp = this._passPool!.add();
        rp.hash = hash;
        rp.depth = renderObj.depth || 0;
        rp.shaderId = SubModelPool.get(subModel.handle, SubModelView.SHADER_0 + passIdx) as number;
        rp.subModel = subModel;
        rp.passIdx = passIdx;
        this.queue!.push(rp);
        return true;
    }

    /**
     * @en Sort the current queue
     * @zh 排序渲染队列。
     */
    public sort () {
        if (this.queue) this.queue.sort();
    }

    private _rebuildIBFromSource (buffer: Uint16Array, stride: number): Buffer {
        const res: number[] = [];
        const v_uint16Array = buffer;
        const len = v_uint16Array.length / 3;
        let resBuffer = buffer;
        if (len >= 1) {
            for (let i = 0; i < len; i++) {
                const a = buffer[i * 3 + 0];
                const b = buffer[i * 3 + 1];
                const c = buffer[i * 3 + 2];
                res.push(a, b, b, c, c, a);
            }
            resBuffer = new Uint16Array(res);
        }
        const currIB: Buffer = legacyCC.director.root.device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
            (resBuffer as ArrayBuffer).byteLength,
            stride,
        ));
        currIB.update(resBuffer);
        return currIB;
    }

    private _generateIndexBufferSource (vertextCount: number): Uint16Array {
        const idxBufferSrc = new Uint16Array(vertextCount);
        for (let i = 0; i < vertextCount; i++) {
            idxBufferSrc[i] = i;
        }
        return idxBufferSrc;
    }

    private _recordCommandBatchedBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
        const it = this.queueBatched.values();
        let res = it.next();
        while (!res.done) {
            let boundPSO = false;
            for (let b = 0; b < res.value[0].batches.length; ++b) {
                const batch = res.value[0].batches[b];
                const currSubModel = res.value[1];
                if (!batch.mergeCount) { continue; }
                if (!boundPSO) {
                    if (!batch.wireframeIa) {
                        const iBufferSource = this._generateIndexBufferSource(batch.vbCount);
                        const currIb = this._rebuildIBFromSource(iBufferSource, 2);
                        const iaInfo = new InputAssemblerInfo(batch.ia.attributes, batch.ia.vertexBuffers,
                            currIb, batch.ia.indirectBuffer);
                        batch.wireframeIa = legacyCC.director.root.device.createInputAssembler(iaInfo);
                    }
                    shader = pass.getShaderVariant(currSubModel.patches);
                    const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, ShaderPool.get(shader), renderPass, batch.wireframeIa);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    pso.gpuPipelineState.glPrimitive = PrimitiveMode.LINE_LIST;
                    cmdBuff.bindPipelineState(pso);
                    cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, batch.pass.descriptorSet);
                    boundPSO = true;
                }
                cmdBuff.bindDescriptorSet(SetIndex.LOCAL, batch.descriptorSet, res.value[0].dynamicOffsets);
                cmdBuff.bindInputAssembler(batch.wireframeIa);
                cmdBuff.draw(batch.wireframeIa);
            }
            res = it.next();
        }
    }

    private _recordCommandInstancedBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
        const it = this.queueInstanced.values();
        let res = it.next();
        while (!res.done) {
            const { instances, hasPendingModels } = res.value[0];
            const currSubModel = res.value[1];
            if (hasPendingModels) {
                const lastPSO: PipelineState | null = null;
                for (let b = 0; b < instances.length; ++b) {
                    const instance = instances[b];
                    if (!instance.count) { continue; }
                    if (!instance.wireframeIa) {
                        instance.wireframeIa = currSubModel.wireframeIa;
                    }
                    instance.wireframeIa.instanceCount = instance.ia.instanceCount;
                    instance.wireframeIa.firstInstance = instance.ia.firstInstance;
                    shader = pass.getShaderVariant(currSubModel.patches);
                    const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, ShaderPool.get(shader), renderPass, instance.wireframeIa);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    pso.gpuPipelineState.glPrimitive = PrimitiveMode.LINE_LIST;
                    cmdBuff.bindPipelineState(pso);
                    cmdBuff.bindInputAssembler(instance.wireframeIa);
                    cmdBuff.draw(instance.wireframeIa);
                }
            }
            res = it.next();
        }
    }

    private _recordCommandRenderBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
        for (let i = 0; i < this.queue!.length; ++i) {
            const { subModel } = this.queue!.array[i];
            shader = pass.getShaderVariant(subModel.patches);
            const pso = PipelineStateManager.getOrCreatePipelineState(device, pass,  ShaderPool.get(shader), renderPass, subModel.wireframeIa!);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pso.gpuPipelineState!.glPrimitive = PrimitiveMode.LINE_LIST;
            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindDescriptorSet(SetIndex.LOCAL, subModel.descriptorSet);
            cmdBuff.bindInputAssembler(subModel.wireframeIa!);
            cmdBuff.draw(subModel.wireframeIa!);
        }
    }

    private _applyPass (wireframe: any, cmdBuff: CommandBuffer, type: WireframeType = WireframeType.Render) {
        let currMaterial = wireframe.renderMaterial;
        switch (type) {
        case WireframeType.Instanced:
            currMaterial = wireframe.instancedMaterial!;
            break;
        case WireframeType.Batched:
            currMaterial = wireframe.batchedMaterial!;
            break;
        default:
            currMaterial = wireframe.renderMaterial;
        }
        pass = currMaterial.passes[0];
        const descriptorSet = DSPool.get(PassPool.get(pass.handle, PassView.DESCRIPTOR_SET));
        cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, descriptorSet);
    }

    public recordCommandBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
        const wireframe = this._pipeline!.wireframe;
        if (!wireframe.enabled) { return; }
        if (this.queue && this.queue.length > 0) {
            this._applyPass(wireframe, cmdBuff);
            this._recordCommandRenderBuffer(device, renderPass, cmdBuff);
        } else if (this.queueInstanced.size > 0) {
            this._applyPass(wireframe, cmdBuff, WireframeType.Instanced);
            this._recordCommandInstancedBuffer(device, renderPass, cmdBuff);
        } else if (this.queueBatched.size > 0) {
            this._applyPass(wireframe, cmdBuff, WireframeType.Batched);
            this._recordCommandBatchedBuffer(device, renderPass, cmdBuff);
        }
    }
}
