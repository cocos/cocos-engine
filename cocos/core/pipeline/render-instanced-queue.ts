/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { InstancedBuffer } from './instanced-buffer';
import { GFXDevice, GFXRenderPass, GFXPipelineState } from '../gfx';
import { PipelineStateManager } from './pipeline-state-manager';
import { DSPool, ShaderPool, PassPool, PassView } from '../renderer/core/memory-pools';
import { SetIndex } from './define';

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
            const { instances, hPass, hasPendingModels } = res.value;
            if (!hasPendingModels) { continue; }
            res.value.uploadBuffers();
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, DSPool.get(PassPool.get(hPass, PassView.DESCRIPTOR_SET)));
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
                cmdBuff.bindDescriptorSet(SetIndex.LOCAL, DSPool.get(instance.hDescriptorSet));
                cmdBuff.bindInputAssembler(instance.ia);
                cmdBuff.draw(instance.ia);
            }
            res = it.next();
        }
    }
}
