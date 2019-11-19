/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { CachedArray } from '../memop/cached-array';
import { IRenderObject, IRenderPass, IRenderQueueDesc } from './define';
import { getPhaseID } from './pass-phase';

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

    /**
     * @zh
     * 渲染队列描述。
     */
    private _passDesc: IRenderQueueDesc;

    /**
     * 构造函数。
     * @param desc 渲染队列描述。
     */
    constructor (desc: IRenderQueueDesc) {
        this._passDesc = desc;
        this.cmdBuffs = new CachedArray(64);
        this.queue = new CachedArray(64, this._passDesc.sortFunc);
    }

    /**
     * @zh
     * 清空渲染队列。
     */
    public clear () {
        this.queue.clear();
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
        this.queue.push({
            hash,
            depth: renderObj.depth,
            shaderId: pso.shader.id,
            subModel,
            cmdBuff: subModel.commandBuffers[passIdx],
        });
        return true;
    }

    // public add (model: Model, camera: Camera) {
    //     let depth = 0;
    //     if (model.node) {
    //         model.node.getWorldPosition(_v3tmp);
    //         vec3.subtract(_v3tmp, _v3tmp, camera.position);
    //         depth = vec3.dot(_v3tmp, camera.forward);
    //     }

    //     for (let i = 0; i < model.subModelNum; ++i) {
    //         const subModel = model.getSubModel(i);
    //         const len = subModel.passes.length;
    //         for (let p = 0; p < len; ++p) {

    //             const pass = subModel.passes[p];
    //             const pso = subModel.psos[p];
    //             const isTransparent = pso.blendState.targets[0].blend;

    //             if (!isTransparent) {
    //                 const hash = (0 << 30) | (pass.priority << 16) | (subModel.priority << 8) | p;

    //                 this.opaques.push({
    //                     hash, depth, shaderId: pso.shader.id,
    //                     subModel, cmdBuff: subModel.commandBuffers[p]});
    //             } else {
    //                 const hash = (1 << 30) | (pass.priority << 16) | (subModel.priority << 8) | p;

    //                 this.transparents.push({
    //                     hash, depth, shaderId: pso.shader.id,
    //                     subModel, cmdBuff: subModel.commandBuffers[p]});
    //             }
    //         }
    //     }
    // }

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
