/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { BatchedBuffer } from './batched-buffer';
import { PipelineStateManager } from './pipeline-state-manager';
import { GFXDevice } from '../gfx/device';
import { GFXRenderPass } from '../gfx';
import { DSPool, ShaderPool, PassPool, PassView } from '../renderer/core/memory-pools';
import { SetIndex } from './define';

/**
 * @en The render queue for dynamic batching
 * @zh 渲染合批队列。
 */
export class RenderBatchedQueue {

    /**
     * @en A set of dynamic batched buffer
     * @zh 动态合批缓存集合。
     */
    public queue = new Set<BatchedBuffer>();

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
        // upload buffers
        let it = this.queue.values(); let res = it.next();
        while (!res.done) {
            for (let b = 0; b < res.value.batches.length; ++b) {
                const batch = res.value.batches[b];
                if (!batch.mergeCount) { continue; }
                for (let v = 0; v < batch.vbs.length; ++v) {
                    batch.vbs[v].update(batch.vbDatas[v]);
                }
                batch.vbIdx.update(batch.vbIdxData.buffer);
                batch.ubo.update(batch.uboData);
            }
            res = it.next();
        }
        // draw
        it = this.queue.values(); res = it.next();
        while (!res.done) {
            let boundPSO = false;
            for (let b = 0; b < res.value.batches.length; ++b) {
                const batch = res.value.batches[b];
                if (!batch.mergeCount) { continue; }
                if (!boundPSO) {
                    const shader = ShaderPool.get(batch.hShader);
                    const pso = PipelineStateManager.getOrCreatePipelineState(device, batch.hPass, shader, renderPass, batch.ia);
                    cmdBuff.bindPipelineState(pso);
                    cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, DSPool.get(PassPool.get(batch.hPass, PassView.DESCRIPTOR_SET)));
                    boundPSO = true;
                }
                cmdBuff.bindDescriptorSet(SetIndex.LOCAL, batch.descriptorSet, res.value.dynamicOffsets);
                cmdBuff.bindInputAssembler(batch.ia);
                cmdBuff.draw(batch.ia);
            }
            res = it.next();
        }
    }
}
