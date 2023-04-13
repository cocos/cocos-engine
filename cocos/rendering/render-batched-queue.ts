/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

import { BatchedBuffer } from './batched-buffer';
import { PipelineStateManager } from './pipeline-state-manager';
import { RenderPass, Device, CommandBuffer, DescriptorSet } from '../gfx';
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

    public uploadBuffers (cmdBuff: CommandBuffer) {
        const it = this.queue.values(); let res = it.next();
        while (!res.done) {
            for (let b = 0; b < res.value.batches.length; ++b) {
                const batch = res.value.batches[b];
                if (!batch.mergeCount) { continue; }
                for (let v = 0; v < batch.vbs.length; ++v) {
                    batch.vbs[v].update(batch.vbDatas[v]);
                }
                cmdBuff.updateBuffer(batch.vbIdx, batch.vbIdxData.buffer);
                cmdBuff.updateBuffer(batch.ubo, batch.uboData);
            }
            res = it.next();
        }
    }

    /**
     * @en Record command buffer for the current queue
     * @zh 记录命令缓冲。
     * @param cmdBuff The command buffer to store the result
     */
    public recordCommandBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer,
        descriptorSet: DescriptorSet | null = null, dynamicOffsets?: Readonly<number[]>) {
        const it = this.queue.values(); let res = it.next();
        while (!res.done) {
            let boundPSO = false;
            for (let b = 0; b < res.value.batches.length; ++b) {
                const batch = res.value.batches[b];
                if (!batch.mergeCount) { continue; }
                if (!boundPSO) {
                    const shader = batch.shader;
                    const pso = PipelineStateManager.getOrCreatePipelineState(device, batch.pass, shader!, renderPass, batch.ia);
                    cmdBuff.bindPipelineState(pso);
                    cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, batch.pass.descriptorSet);
                    boundPSO = true;
                }
                if (descriptorSet) cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, descriptorSet);
                if (dynamicOffsets) {
                    cmdBuff.bindDescriptorSet(SetIndex.LOCAL, batch.descriptorSet, dynamicOffsets);
                } else {
                    cmdBuff.bindDescriptorSet(SetIndex.LOCAL, batch.descriptorSet, res.value.dynamicOffsets);
                }
                cmdBuff.bindInputAssembler(batch.ia);
                cmdBuff.draw(batch.ia);
            }
            res = it.next();
        }
    }
}
