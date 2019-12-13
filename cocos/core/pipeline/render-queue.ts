/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { RecyclePool } from '../memop';
import { CachedArray } from '../memop/cached-array';
import { IRenderObject, IRenderPass, IRenderQueueDesc } from './define';

/**
 * @en
 * Comparison sorting function. Opaque objects are sorted by depth priority -> depth front to back -> shader id.
 * @zh
 * 比较排序函数。不透明对象按优先级 -> 深度由前向后 -> ShaderId 顺序排序。
 */
export function opaqueCompareFn (a: IRenderPass, b: IRenderPass) {
    if (a.hash === b.hash) {
        if (a.depth === b.depth) {
            return a.shaderId - b.shaderId;
        } else {
            return a.depth - b.depth;
        }
    } else {
        return a.hash - b.hash;
    }
}

/**
 * @en
 * Comparison sorting function. Transparent objects are sorted by pass priority -> depth back to front -> shader id.
 * @zh
 * 比较排序函数。半透明对象按优先级 -> 深度由后向前 -> ShaderId 顺序排序。
 */
export function transparentCompareFn (a: IRenderPass, b: IRenderPass) {
    if (a.hash === b.hash) {
        if (a.depth === b.depth) {
            return a.shaderId - b.shaderId;
        } else {
            return b.depth - a.depth;
        }
    } else {
        return a.hash - b.hash;
    }
}

/**
 * @zh
 * 渲染队列。
 */
export class RenderQueue {

    /**
     * @zh
     * 基于缓存数组的队列。
     */
    public queue: CachedArray<IRenderPass>;

    /**
     * @zh
     * 基于缓存数组的命令缓冲。
     */
    public cmdBuffs: CachedArray<GFXCommandBuffer>;

    /**
     * @zh
     * 命令缓冲数量。
     */
    public cmdBuffCount: number = 0;

    private _passDesc: IRenderQueueDesc;
    private _passPool: RecyclePool<IRenderPass>;

    /**
     * 构造函数。
     * @param desc 渲染队列描述。
     */
    constructor (desc: IRenderQueueDesc) {
        this._passDesc = desc;
        this._passPool = new RecyclePool(() => ({
            hash: 0,
            depth: 0,
            shaderId: 0,
            subModel: null!,
            cmdBuff: null!,
        }), 64);
        this.cmdBuffs = new CachedArray(64);
        this.queue = new CachedArray(64, this._passDesc.sortFunc);
    }

    /**
     * @zh
     * 清空渲染队列。
     */
    public clear () {
        this.queue.clear();
        this._passPool.reset();
        this.cmdBuffCount = 0;
    }

    /**
     * @zh
     * 插入渲染过程。
     */
    public insertRenderPass (renderObj: IRenderObject, modelIdx: number, passIdx: number): boolean {
        const subModel = renderObj.model.getSubModel(modelIdx);
        const pass = subModel.passes[passIdx];
        const pso = subModel.psos![passIdx];
        const isTransparent = pso.blendState.targets[0].blend;
        if (isTransparent !== this._passDesc.isTransparent || !(pass.phase & this._passDesc.phases)) {
            return false;
        }
        const hash = (0 << 30) | pass.priority << 16 | subModel.priority << 8 | passIdx;
        const rp = this._passPool.add();
        rp.hash = hash;
        rp.depth = renderObj.depth;
        rp.shaderId = pso.shader.id;
        rp.subModel = subModel;
        rp.cmdBuff = subModel.commandBuffers[passIdx];
        this.queue.push(rp);
        return true;
    }

    /**
     * @zh
     * 排序渲染队列。
     */
    public sort () {

        this.queue.sort();

        this.cmdBuffCount = this.queue.length;

        for (let i = 0; i < this.queue.length; ++i) {
            this.cmdBuffs.array[i] = this.queue.array[i].cmdBuff;
        }
    }
}
