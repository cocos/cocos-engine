/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { BatchedBuffer } from './batched-buffer';
import { PipelineStateManager } from './pipeline-state-manager';
import { GFXDevice } from '../gfx/device';
import { GFXRenderPass } from '../gfx';

/**
 * @zh
 * 渲染合批队列。
 */
export class RenderBatchedQueue {

    /**
     * @zh
     * 基于缓存数组的队列。
     */
    public queue = new Set<BatchedBuffer>();

    /**
     * 构造函数。
     * @param desc 渲染队列描述。
     */
    constructor () {
    }

    /**
     * @zh
     * 清空渲染队列。
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
     * @zh
     * 记录命令缓冲。
     */
    public recordCommandBuffer (device: GFXDevice, renderPass: GFXRenderPass, cmdBuff: GFXCommandBuffer) {
        const it = this.queue.values(); let res = it.next();
        while (!res.done) {
            let boundPSO = false;
            for (let b = 0; b < res.value.batches.length; ++b) {
                const batch = res.value.batches[b];
                if (!batch.mergeCount) { continue; }
                for (let v = 0; v < batch.vbs.length; ++v) {
                    batch.vbs[v].update(batch.vbDatas[v]);
                }
                batch.vbIdx.update(batch.vbIdxData.buffer);
                batch.ubo.update(batch.uboData.view);
                const pso = PipelineStateManager.getOrCreatePipelineState(device, batch.psoCreateInfo, renderPass, batch.ia);
                if (!boundPSO) {
                    cmdBuff.bindPipelineState(pso);
                    boundPSO = true;
                }
                cmdBuff.bindBindingLayout(batch.psoCreateInfo.bindingLayout);
                cmdBuff.bindInputAssembler(batch.ia);
                cmdBuff.draw(batch.ia);
            }
            res = it.next();
        }
    }
}
