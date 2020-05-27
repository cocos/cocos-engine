/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { InstancedBuffer } from './instanced-buffer';

/**
 * @zh
 * 渲染合批队列。
 */
export class RenderInstancedQueue {

    /**
     * @zh
     * 基于缓存数组的队列。
     */
    public queue = new Set<InstancedBuffer>();

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
