/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { InstancedBuffer } from './instanced-buffer';
import { GFXDevice, GFXRenderPass, GFXPipelineState, GFXBuffer } from '../gfx';
import { PipelineStateManager } from './pipeline-state-manager';
import { IRenderObject, UBOForwardLight } from './define';
import { LightType, Light } from '../renderer/scene/light';
import { IMacroPatch, Pass } from '../renderer/core/pass';
import { DescriptorSetPool, ShaderPool, PassPool, PassView } from '../renderer/core/memory-pools';
import { DescriptorSetIndices } from './define';

const spherePatches: IMacroPatch[] = [
    { name: 'CC_FORWARD_ADD', value: true },
];
const spotPatches: IMacroPatch[] = [
    { name: 'CC_FORWARD_ADD', value: true },
    { name: 'CC_SPOTLIGHT', value: true },
];

/**
 * @en Render queue for instanced batching
 * @zh 渲染合批队列。
 */
export class RenderInstancedQueue {

    /**
     * @en A set of instanced buffer
     * @zh Instance 合批缓存集合。
     */
    public queue = new Set<InstancedBuffer>();

    /**
     * @en Clear the render queue
     * @zh 清空渲染队列。
     */
    public clear () {
        const it = this.queue.values(); let res = it.next();
        while (!res.done) {
            res.value.clear();
            res = it.next();
        }
        this.queue.clear();
    }

    /**
     * @en Record command buffer for the current queue
     * @zh 记录命令缓冲。
     * @param cmdBuff The command buffer to store the result
     */
    public recordCommandBuffer (device: GFXDevice, renderPass: GFXRenderPass, cmdBuff: GFXCommandBuffer) {
        const it = this.queue.values(); let res = it.next();
        while (!res.done) {
            const { instances, hPass } = res.value;
            res.value.uploadBuffers();
            cmdBuff.bindDescriptorSet(DescriptorSetIndices.MATERIAL_SPECIFIC, DescriptorSetPool.get(PassPool.get(hPass, PassView.DESCRIPTOR_SET)));
            let lastPSO: GFXPipelineState | null = null;
            for (let b = 0; b < instances.length; ++b) {
                const instance = instances[b];
                if (!instance.count) { continue; }
                const shader = ShaderPool.get(instance.hShader);
                const pso = PipelineStateManager.getOrCreatePipelineState(device, hPass, shader, renderPass, instance.ia);
                if (lastPSO !== pso) {
                    cmdBuff.bindPipelineState(pso);
                    lastPSO = pso;
                }
                cmdBuff.bindDescriptorSet(DescriptorSetIndices.MODEL_LOCAL, DescriptorSetPool.get(instance.hDescriptorSet));
                cmdBuff.bindInputAssembler(instance.ia);
                cmdBuff.draw(instance.ia);
            }
            res = it.next();
        }
    }
}
