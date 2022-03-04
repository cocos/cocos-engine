/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module pipeline
 */

import { RecyclePool } from '../memop';
import { CachedArray } from '../memop/cached-array';
import { IRenderObject, IRenderPass, IRenderQueueDesc, SetIndex } from './define';
import { PipelineStateManager } from './pipeline-state-manager';
import { RenderPass, Device, CommandBuffer } from '../gfx';
import { RenderQueueDesc, RenderQueueSortMode } from './pipeline-serialization';
import { getPhaseID } from './pass-phase';

/**
 * @en Comparison sorting function. Opaque objects are sorted by priority -> depth front to back -> shader ID.
 * @zh 比较排序函数。不透明对象按优先级 -> 深度由前向后 -> Shader ID 顺序排序。
 */
export function opaqueCompareFn (a: IRenderPass, b: IRenderPass) {
    return (a.hash - b.hash) || (a.depth - b.depth) || (a.shaderId - b.shaderId);
}

/**
 * @en Comparison sorting function. Transparent objects are sorted by priority -> depth back to front -> shader ID.
 * @zh 比较排序函数。半透明对象按优先级 -> 深度由后向前 -> Shader ID 顺序排序。
 */
export function transparentCompareFn (a: IRenderPass, b: IRenderPass) {
    return (a.hash - b.hash) || (b.depth - a.depth) || (a.shaderId - b.shaderId);
}

/**
 * @en The render queue. It manages a GFX [[RenderPass]] queue which will be executed by the [[RenderStage]].
 * @zh 渲染队列。它管理一个 GFX [[RenderPass]] 队列，队列中的渲染过程会被 [[RenderStage]] 所执行。
 */
export class RenderQueue {
    /**
     * @en A cached array of render passes
     * @zh 基于缓存数组的渲染过程队列。
     */
    public queue: CachedArray<IRenderPass>;

    private _passDesc: IRenderQueueDesc;
    private _passPool: RecyclePool<IRenderPass>;

    /**
     * @en Construct a RenderQueue with render queue descriptor
     * @zh 利用渲染队列描述来构造一个 RenderQueue。
     * @param desc Render queue descriptor
     */
    constructor (desc: IRenderQueueDesc) {
        this._passDesc = desc;
        this._passPool = new RecyclePool<IRenderPass>(() => ({
            hash: 0,
            depth: 0,
            shaderId: 0,
            subModel: null!,
            passIdx: 0,
        }), 64);
        this.queue = new CachedArray(64, this._passDesc.sortFunc);
    }

    /**
     * @en Clear the render queue
     * @zh 清空渲染队列。
     */
    public clear () {
        this.queue.clear();
        this._passPool.reset();
    }

    /**
     * @en Insert a render pass into the queue
     * @zh 插入渲染过程。
     * @param renderObj The render object of the pass
     * @param modelIdx The model id
     * @param passIdx The pass id
     * @returns Whether the new render pass is successfully added
     */
    public insertRenderPass (renderObj: IRenderObject, subModelIdx: number, passIdx: number): boolean {
        const subModel = renderObj.model.subModels[subModelIdx];
        const pass = subModel.passes[passIdx];
        const shader = subModel.shaders[passIdx];
        const isTransparent = pass.blendState.targets[0].blend;
        if (isTransparent !== this._passDesc.isTransparent || !(pass.phase & this._passDesc.phases)) {
            return false;
        }
        const hash = (0 << 30) | pass.priority << 16 | subModel.priority << 8 | passIdx;
        const rp = this._passPool.add();
        rp.hash = hash;
        rp.depth = renderObj.depth || 0;
        rp.shaderId = shader.typedID;
        rp.subModel = subModel;
        rp.passIdx = passIdx;
        this.queue.push(rp);
        return true;
    }

    /**
     * @en Sort the current queue
     * @zh 排序渲染队列。
     */
    public sort () {
        this.queue.sort();
    }

    public recordCommandBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
        for (let i = 0; i < this.queue.length; ++i) {
            const { subModel, passIdx } = this.queue.array[i];
            const { inputAssembler } = subModel;
            const pass = subModel.passes[passIdx];
            const shader = subModel.shaders[passIdx];
            const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, inputAssembler);
            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
            cmdBuff.bindDescriptorSet(SetIndex.LOCAL, subModel.descriptorSet);
            cmdBuff.bindInputAssembler(inputAssembler);
            cmdBuff.draw(inputAssembler);
        }
    }
}

export function convertRenderQueue (desc: RenderQueueDesc) {
    let phase = 0;
    for (let j = 0; j < desc.stages.length; j++) {
        phase |= getPhaseID(desc.stages[j]);
    }
    let sortFunc: (a: IRenderPass, b: IRenderPass) => number = opaqueCompareFn;
    switch (desc.sortMode) {
    case RenderQueueSortMode.BACK_TO_FRONT:
        sortFunc = transparentCompareFn;
        break;
    case RenderQueueSortMode.FRONT_TO_BACK:
        sortFunc = opaqueCompareFn;
        break;
    default:
        break;
    }

    return new RenderQueue({
        isTransparent: desc.isTransparent,
        phases: phase,
        sortFunc,
    });
}

/**
 * @en Clear the given render queue
 * @zh 清空指定的渲染队列
 * @param rq The render queue
 */
export function renderQueueClearFunc (rq: RenderQueue) {
    rq.clear();
}

/**
 * @en Sort the given render queue
 * @zh 对指定的渲染队列执行排序
 * @param rq The render queue
 */
export function renderQueueSortFunc (rq: RenderQueue) {
    rq.sort();
}
