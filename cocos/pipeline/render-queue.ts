import { CachedArray } from '../core/memop/cached-array';
import { Vec3 } from '../core/value-types';
import { vec3 } from '../core/vmath';
import { GFXCommandBuffer } from '../gfx/command-buffer';
import { Camera } from '../renderer/scene/camera';
import { Model } from '../renderer/scene/model';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, IRenderPass, IRenderQueueDesc } from './define';

// Opaque objects are sorted by depth priority -> depth front to back -> shader id.
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

// Transparent objects are sorted by pass priority -> depth back to front -> shader id.
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

export class RenderQueue {
    public queue: CachedArray<IRenderPass>;
    public cmdBuffs: CachedArray<GFXCommandBuffer>;
    public cmdBuffCount: number = 0;
    private _passDesc: IRenderQueueDesc;

    constructor (desc: IRenderQueueDesc) {

        this._passDesc = desc;
        this.cmdBuffs = new CachedArray(64);
        this.queue = new CachedArray(64, this._passDesc.sortFunc);
    }

    public clear () {
        this.queue.clear();
        this.cmdBuffCount = 0;
    }

    public insertRenderPass (renderObj: IRenderObject, modelIdx: number, passIdx: number): boolean {
        const subModel = renderObj.model.getSubModel(modelIdx);
        const pass = subModel.passes[passIdx];
        const pso = subModel.psos[passIdx];
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
    //         vec3.sub(_v3tmp, _v3tmp, camera.position);
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

    public sort () {

        this.queue.sort();

        this.cmdBuffCount = this.queue.length;

        for (let i = 0; i < this.queue.length; ++i) {
            this.cmdBuffs.array[i] = this.queue.array[i].cmdBuff;
        }
    }
}
