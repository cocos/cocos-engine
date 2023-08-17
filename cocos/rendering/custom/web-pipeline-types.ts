import { CommandBuffer, DescriptorSet, Device, PipelineState, RenderPass, deviceManager } from '../../gfx';
import { RenderScene } from '../../render-scene';
import { Camera, Light, LightType, Model, SubModel } from '../../render-scene/scene';
import { SetIndex } from '../define';
import { InstancedBuffer } from '../instanced-buffer';
import { PipelineStateManager } from '../pipeline-state-manager';
import { SceneFlags } from './types';

export class DrawInstance {
    subModel: SubModel | null;
    priority: number;
    hash: number;
    depth: number;
    shaderID: number;
    passIndex: number;

    constructor (
        subModel: SubModel | null = null,
        priority = 0,
        hash = 0,
        depth = 0,
        shaderID = 0,
        passIndex = 0,
    ) {
        this.subModel = subModel;
        this.priority = priority;
        this.hash = hash;
        this.depth = depth;
        this.shaderID = shaderID;
        this.passIndex = passIndex;
    }
}

export class RenderDrawQueue {
    instances: Array<DrawInstance> = new Array<DrawInstance>();

    add (model: Model, depth: number, subModelIdx: number, passIdx: number): void {
        const subModel = model.subModels[subModelIdx];
        const pass = subModel.passes[passIdx];
        const passPriority = pass.priority;
        const modelPriority = subModel.priority;
        const shaderId = subModel.shaders[passIdx].typedID;
        const hash = (0 << 30) | (passPriority as number << 16) | (modelPriority as number << 8) | passIdx;
        const priority = model.priority;

        this.instances.push(new DrawInstance(subModel, priority, hash, depth, shaderId, passIdx));
    }
    /**
     * @en Comparison sorting function. Opaque objects are sorted by priority -> depth front to back -> shader ID.
     * @zh 比较排序函数。不透明对象按优先级 -> 深度由前向后 -> Shader ID 顺序排序。
     */
    sortOpaqueOrCutout (): void {
        this.instances.sort((lhs: DrawInstance, rhs: DrawInstance) => {
            if (lhs.hash !== rhs.hash) {
                return lhs.hash - rhs.hash;
            }
            if (lhs.depth !== rhs.depth) {
                return lhs.depth - rhs.depth;
            }
            return lhs.shaderID - rhs.shaderID;
        });
    }
    /**
     * @en Comparison sorting function. Transparent objects are sorted by priority -> depth back to front -> shader ID.
     * @zh 比较排序函数。半透明对象按优先级 -> 深度由后向前 -> Shader ID 顺序排序。
     */
    sortTransparent (): void {
        this.instances.sort((lhs: DrawInstance, rhs: DrawInstance) => {
            if (lhs.priority !== rhs.priority) {
                return lhs.priority - rhs.priority;
            }
            if (lhs.hash !== rhs.hash) {
                return lhs.hash - rhs.hash;
            }
            if (lhs.depth !== rhs.depth) {
                return rhs.depth - lhs.depth; // 注意此处的差值顺序，为了按照降序排列
            }
            return lhs.shaderID - rhs.shaderID;
        });
    }

    recordCommandBuffer (
        device: Device,
        renderPass: RenderPass,
        cmdBuffer: CommandBuffer,
    ): void {
        for (const instance of this.instances) {
            const subModel = instance.subModel!;

            const passIdx = instance.passIndex;
            const inputAssembler = subModel.inputAssembler;
            const pass = subModel.passes[passIdx];
            const shader = subModel.shaders[passIdx];
            const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, inputAssembler);

            cmdBuffer.bindPipelineState(pso);
            cmdBuffer.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
            cmdBuffer.bindDescriptorSet(SetIndex.LOCAL, subModel.descriptorSet);
            cmdBuffer.bindInputAssembler(inputAssembler);
            cmdBuffer.draw(inputAssembler);
        }
    }
}

export class RenderInstancingQueue {
    batches: Set<InstancedBuffer> = new Set<InstancedBuffer>();
    sortedBatches: Array<InstancedBuffer> = new Array<InstancedBuffer>();

    add (instancedBuffer: InstancedBuffer): void {
        this.batches.add(instancedBuffer);
    }

    sort (): void {
        this.sortedBatches = Array.from(this.batches);
    }

    uploadBuffers (cmdBuffer: CommandBuffer): void {
        for (const instanceBuffer of this.batches) {
            if (instanceBuffer.hasPendingModels) {
                instanceBuffer.uploadBuffers(cmdBuffer);
            }
        }
    }

    recordCommandBuffer (
        renderPass: RenderPass,
        cmdBuffer: CommandBuffer,
        ds: DescriptorSet | null = null,
        offset = 0,
        dynamicOffsets: number[] | null = null,
    ): void {
        const renderQueue = this.sortedBatches;
        for (const instanceBuffer of renderQueue) {
            if (!instanceBuffer.hasPendingModels) {
                continue;
            }
            const instances = instanceBuffer.instances;
            const drawPass = instanceBuffer.pass;
            cmdBuffer.bindDescriptorSet(SetIndex.MATERIAL, drawPass.descriptorSet);
            let lastPSO: PipelineState | null = null;
            for (const instance of instances) {
                if (!instance.count) {
                    continue;
                }
                const pso = PipelineStateManager.getOrCreatePipelineState(
                    deviceManager.gfxDevice,
                    drawPass,
                    instance.shader!,
                    renderPass,
                    instance.ia,
                );
                if (lastPSO !== pso) {
                    cmdBuffer.bindPipelineState(pso);
                    lastPSO = pso;
                }
                if (ds) {
                    cmdBuffer.bindDescriptorSet(SetIndex.GLOBAL, ds, [offset]);
                }
                if (dynamicOffsets) {
                    cmdBuffer.bindDescriptorSet(SetIndex.LOCAL, instance.descriptorSet, dynamicOffsets);
                } else {
                    cmdBuffer.bindDescriptorSet(
                        SetIndex.LOCAL,
                        instance.descriptorSet,
                        instanceBuffer.dynamicOffsets,
                    );
                }
                cmdBuffer.bindInputAssembler(instance.ia);
                cmdBuffer.draw(instance.ia);
            }
        }
    }
}

export class RenderQueueDesc {
    culledSource: number;
    renderQueueTarget: number;
    lightType: LightType;

    constructor (
        culledSourceIn = 0xFFFFFFFF,
        renderQueueTargetIn = 0xFFFFFFFF,
        lightTypeIn: LightType = LightType.UNKNOWN,
    ) {
        this.culledSource = culledSourceIn;
        this.renderQueueTarget = renderQueueTargetIn;
        this.lightType = lightTypeIn;
    }
}

export class RenderQueue {
    opaqueQueue: RenderDrawQueue = new RenderDrawQueue();
    transparentQueue: RenderDrawQueue = new RenderDrawQueue();
    opaqueInstancingQueue: RenderInstancingQueue = new RenderInstancingQueue();
    transparentInstancingQueue: RenderInstancingQueue = new RenderInstancingQueue();
    sceneFlags: SceneFlags = SceneFlags.NONE;
    subpassOrPassLayoutID = 0xffffffff;

    sort (): void {
        this.opaqueQueue.sortOpaqueOrCutout();
        this.transparentQueue.sortTransparent();
        this.opaqueInstancingQueue.sort();
        this.transparentInstancingQueue.sort();
    }

    private _clearInstances (instances: Set<InstancedBuffer>): void {
        const it = instances.values(); let res = it.next();
        while (!res.done) {
            res.value.clear();
            res = it.next();
        }
        instances.clear();
    }

    clear (): void {
        this.opaqueQueue.instances.length = 0;
        this.transparentQueue.instances.length = 0;
        this._clearInstances(this.opaqueInstancingQueue.batches);
        this.opaqueInstancingQueue.sortedBatches.length = 0;
        this._clearInstances(this.transparentInstancingQueue.batches);
        this.transparentInstancingQueue.sortedBatches.length = 0;
        this.sceneFlags = SceneFlags.NONE;
        this.subpassOrPassLayoutID = 0xFFFFFFFF;
    }

    empty (): boolean {
        return this.opaqueQueue.instances.length === 0
        && this.transparentQueue.instances.length === 0
        && this.opaqueInstancingQueue.batches.size === 0
        && this.opaqueInstancingQueue.sortedBatches.length === 0
        && this.transparentInstancingQueue.batches.size === 0
        && this.transparentInstancingQueue.sortedBatches.length === 0;
    }
}
