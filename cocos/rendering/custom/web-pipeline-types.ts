import { RecyclePool, assert, cclegacy } from '../../core';
import { CommandBuffer, DescriptorSet, Device, PipelineState, RenderPass, deviceManager } from '../../gfx';
import { IMacroPatch, Pass } from '../../render-scene';

import { LightType, Model, SubModel } from '../../render-scene/scene';
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
    update (
        subModel: SubModel | null = null,
        priority = 0,
        hash = 0,
        depth = 0,
        shaderID = 0,
        passIndex = 0,
    ): void {
        this.subModel = subModel;
        this.priority = priority;
        this.hash = hash;
        this.depth = depth;
        this.shaderID = shaderID;
        this.passIndex = passIndex;
    }
}

export const instancePool = new RecyclePool(() => new DrawInstance(), 8);

const CC_USE_RGBE_OUTPUT = 'CC_USE_RGBE_OUTPUT';
function getLayoutId (passLayout: string, phaseLayout: string): number {
    const r = cclegacy.rendering;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return r.getPhaseID(r.getPassID(passLayout), phaseLayout);
}
function getPassIndexFromLayout (subModel: SubModel, phaseLayoutId: number): number {
    const passes = subModel.passes;
    for (let k = 0; k < passes.length; k++) {
        if ((passes[k].phaseID === phaseLayoutId)) {
            return k;
        }
    }
    return -1;
}

export class ProbeHelperQueue {
    probeMap: Array<SubModel> = new Array<SubModel>();
    defaultId: number = getLayoutId('default', 'default');

    clear (): void {
        this.probeMap.length = 0;
    }

    removeMacro (): void {
        for (const subModel of this.probeMap) {
            let patches: IMacroPatch[] = [];
            patches = patches.concat(subModel.patches!);
            if (!patches.length) continue;
            for (let j = 0; j < patches.length; j++) {
                const patch = patches[j];
                if (patch.name === CC_USE_RGBE_OUTPUT) {
                    patches.splice(j, 1);
                    break;
                }
            }
            subModel.onMacroPatchesStateChanged(patches);
        }
    }
    applyMacro (model: Model, probeLayoutId: number): void {
        const subModels = model.subModels;
        for (let j = 0; j < subModels.length; j++) {
            const subModel: SubModel = subModels[j];

            //Filter transparent objects
            const isTransparent = subModel.passes[0].blendState.targets[0].blend;
            if (isTransparent) {
                continue;
            }

            let passIdx = getPassIndexFromLayout(subModel, probeLayoutId);
            let bUseReflectPass = true;
            if (passIdx < 0) {
                probeLayoutId = this.defaultId;
                passIdx = getPassIndexFromLayout(subModel, probeLayoutId);
                bUseReflectPass = false;
            }
            if (passIdx < 0) { continue; }
            if (!bUseReflectPass) {
                let patches: IMacroPatch[] = [];
                patches = patches.concat(subModel.patches!);
                const useRGBEPatchs: IMacroPatch[] = [
                    { name: CC_USE_RGBE_OUTPUT, value: true },
                ];
                patches = patches.concat(useRGBEPatchs);
                subModel.onMacroPatchesStateChanged(patches);
                this.probeMap.push(subModel);
            }
        }
    }
}

export class RenderDrawQueue {
    instances: Array<DrawInstance> = new Array<DrawInstance>();

    empty (): boolean {
        return this.instances.length === 0;
    }

    clear (): void {
        this.instances.length = 0;
    }

    add (model: Model, depth: number, subModelIdx: number, passIdx: number): void {
        const subModel = model.subModels[subModelIdx];
        const pass = subModel.passes[passIdx];
        const passPriority = pass.priority;
        const modelPriority = subModel.priority;
        const shaderId = subModel.shaders[passIdx].typedID;
        const hash = (0 << 30) | (passPriority as number << 16) | (modelPriority as number << 8) | passIdx;
        const priority = model.priority;
        const instance = instancePool.add();
        instance.update(subModel, priority, hash, depth, shaderId, passIdx);
        this.instances.push(instance);
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
        ds: DescriptorSet | null = null,
        offset = 0,
        dynamicOffsets: number[] | null = null,
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
            if (ds) {
                cmdBuffer.bindDescriptorSet(SetIndex.GLOBAL, ds, [offset]);
            }
            if (dynamicOffsets) {
                cmdBuffer.bindDescriptorSet(SetIndex.LOCAL, subModel.descriptorSet, dynamicOffsets);
            } else {
                cmdBuffer.bindDescriptorSet(
                    SetIndex.LOCAL,
                    subModel.descriptorSet,
                );
            }
            cmdBuffer.bindInputAssembler(inputAssembler);
            cmdBuffer.draw(inputAssembler);
        }
    }
}

export class RenderInstancingQueue {
    passInstances: Map<Pass, number> = new Map<Pass, number>();
    instanceBuffers: Array<InstancedBuffer> = new Array<InstancedBuffer>();
    sortedBatches: Array<InstancedBuffer> = new Array<InstancedBuffer>();

    empty (): boolean {
        return this.passInstances.size === 0;
    }

    add (pass: Pass, subModel: SubModel, passID: number): void {
        const iter = this.passInstances.get(pass);
        if (iter === undefined) {
            const instanceBufferID = this.passInstances.size;
            if (instanceBufferID >= this.instanceBuffers.length) {
                assert(instanceBufferID === this.instanceBuffers.length);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                this.instanceBuffers.push(new InstancedBuffer(new Pass(cclegacy.director.root)));
            }
            this.passInstances.set(pass, instanceBufferID);

            assert(instanceBufferID < this.instanceBuffers.length);
            const instanceBuffer = this.instanceBuffers[instanceBufferID];
            instanceBuffer.pass = pass;
            const instances = instanceBuffer.instances;
            for (const item of instances) {
                assert(item.count === 0);
            }
        }

        const instancedBuffer = this.instanceBuffers[this.passInstances.get(pass)!];
        instancedBuffer.merge(subModel, passID);
    }

    clear (): void {
        this.sortedBatches.length = 0;
        this.passInstances.clear();
        const instanceBuffers = this.instanceBuffers;
        instanceBuffers.forEach((instance) => {
            instance.clear();
        });
    }

    sort (): void {
        this.sortedBatches.length = this.passInstances.size;
        let index = 0;
        for (const [pass, bufferID] of this.passInstances.entries()) {
            this.sortedBatches[index++] = this.instanceBuffers[bufferID];
        }
    }

    uploadBuffers (cmdBuffer: CommandBuffer): void {
        for (const [pass, bufferID] of this.passInstances.entries()) {
            const instanceBuffer = this.instanceBuffers[bufferID];
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
    frustumCulledResultID: number;
    lightBoundsCulledResultID: number;
    renderQueueTarget: number;
    lightType: LightType;

    constructor (
        frustumCulledResultID = 0xFFFFFFFF,
        lightBoundsCulledResultID = 0xFFFFFFFF,
        renderQueueTargetIn = 0xFFFFFFFF,
        lightTypeIn: LightType = LightType.UNKNOWN,
    ) {
        this.frustumCulledResultID = frustumCulledResultID;
        this.lightBoundsCulledResultID = lightBoundsCulledResultID;
        this.renderQueueTarget = renderQueueTargetIn;
        this.lightType = lightTypeIn;
    }
    update (
        culledSourceIn = 0xFFFFFFFF,
        lightBoundsCulledResultID = 0xFFFFFFFF,
        renderQueueTargetIn = 0xFFFFFFFF,
        lightTypeIn: LightType = LightType.UNKNOWN,
    ): void {
        this.frustumCulledResultID = culledSourceIn;
        this.lightBoundsCulledResultID = lightBoundsCulledResultID;
        this.renderQueueTarget = renderQueueTargetIn;
        this.lightType = lightTypeIn;
    }
}

export class RenderQueue {
    probeQueue: ProbeHelperQueue = new ProbeHelperQueue();
    opaqueQueue: RenderDrawQueue = new RenderDrawQueue();
    transparentQueue: RenderDrawQueue = new RenderDrawQueue();
    opaqueInstancingQueue: RenderInstancingQueue = new RenderInstancingQueue();
    transparentInstancingQueue: RenderInstancingQueue = new RenderInstancingQueue();
    sceneFlags: SceneFlags = SceneFlags.NONE;
    subpassOrPassLayoutID = 0xFFFFFFFF;
    lightByteOffset = 0xFFFFFFFF;
    sort (): void {
        this.opaqueQueue.sortOpaqueOrCutout();
        this.transparentQueue.sortTransparent();
        this.opaqueInstancingQueue.sort();
        this.transparentInstancingQueue.sort();
    }

    update (): void {
        this.probeQueue.clear();
        this.opaqueQueue.clear();
        this.transparentQueue.clear();
        this.opaqueInstancingQueue.clear();
        this.transparentInstancingQueue.clear();
        this.sceneFlags = SceneFlags.NONE;
        this.subpassOrPassLayoutID = 0xFFFFFFFF;
    }

    empty (): boolean {
        return this.opaqueQueue.empty()
        && this.transparentQueue.empty()
        && this.opaqueInstancingQueue.empty()
        && this.transparentInstancingQueue.empty();
    }

    recordCommands (cmdBuffer: CommandBuffer, renderPass: RenderPass): void {
        const offsets = this.lightByteOffset === 0xFFFFFFFF ? null : [this.lightByteOffset];
        this.opaqueQueue.recordCommandBuffer(deviceManager.gfxDevice, renderPass, cmdBuffer, null, 0, offsets);
        this.opaqueInstancingQueue.recordCommandBuffer(renderPass, cmdBuffer, null, 0, offsets);

        this.transparentInstancingQueue.recordCommandBuffer(renderPass, cmdBuffer, null, 0, offsets);
        this.transparentQueue.recordCommandBuffer(deviceManager.gfxDevice, renderPass, cmdBuffer, null, 0, offsets);
    }
}
