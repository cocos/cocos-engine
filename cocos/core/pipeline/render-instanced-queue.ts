/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { InstancedBuffer } from './instanced-buffer';

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
    public recordCommandBuffer (cmdBuff: GFXCommandBuffer) {
        const it = this.queue.values(); let res = it.next();
        while (!res.done) {
            const { instances, pso } = res.value;
            if (pso) {
                res.value.uploadBuffers();
                cmdBuff.bindPipelineState(pso);
                cmdBuff.bindBindingLayout(pso.pipelineLayout.layouts[0]);
                for (let b = 0; b < instances.length; ++b) {
                    const instance = instances[b];
                    if (!instance.count) { continue; }
                    cmdBuff.bindInputAssembler(instance.ia);
                    cmdBuff.draw(instance.ia);
                }
            }
            res = it.next();
        }
    }
}
