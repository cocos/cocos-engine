import { CachedArray } from '../core/memop/cached-array';
import { Vec3 } from '../core/value-types';
import { vec3 } from '../core/vmath';
import { GFXCommandBuffer } from '../gfx/command-buffer';
import { Camera } from '../renderer/scene/camera';
import { Model } from '../renderer/scene/model';
import { SubModel } from '../renderer/scene/submodel';

export interface IRenderItem {
    hash: number;
    depth: number;
    shaderId: number;
    subModel: SubModel;
    cmdBuff: GFXCommandBuffer;
}

const _v3tmp = new Vec3();

export class RenderQueue {
    public opaques: CachedArray<IRenderItem>;
    public transparents: CachedArray<IRenderItem>;
    public cmdBuffs: CachedArray<GFXCommandBuffer>;
    public cmdBuffCount: number = 0;

    constructor () {

        // Opaque objects are sorted by pass priority -> depth front to back -> shader id.
        const opaqueCompareFn = (a: IRenderItem, b: IRenderItem) => {
            if (a.hash === b.hash) {
                if (a.depth === b.depth) {
                    return a.shaderId - b.shaderId;
                } else {
                    return a.depth - b.depth;
                }
            } else {
                return a.hash - b.hash;
            }
        };

        // Transparent objects are sorted by pass priority -> depth back to front -> shader id.
        const transparentCompareFn = (a: IRenderItem, b: IRenderItem) => {
            if (a.hash === b.hash) {
                if (a.depth === b.depth) {
                    return a.shaderId - b.shaderId;
                } else {
                    return b.depth - a.depth;
                }
            } else {
                return a.hash - b.hash;
            }
        };

        this.opaques = new CachedArray(64, opaqueCompareFn);
        this.transparents = new CachedArray(64, transparentCompareFn);
        this.cmdBuffs = new CachedArray(64);
    }

    public clear () {
        this.opaques.clear();
        this.transparents.clear();
        this.cmdBuffCount = 0;
    }

    public add (model: Model, camera: Camera) {
        let depth = 0;
        if (model.node) {
            model.node.getWorldPosition(_v3tmp);
            vec3.sub(_v3tmp, _v3tmp, camera.position);
            depth = vec3.dot(_v3tmp, camera.forward);
        }

        for (let i = 0; i < model.subModelNum; ++i) {
            const subModel = model.getSubModel(i);
            const len = subModel.passes.length;
            for (let p = 0; p < len; ++p) {

                const pass = subModel.passes[p];
                const pso = subModel.psos[p];
                const isTransparent = pso.blendState.targets[0].blend;

                if (!isTransparent) {
                    const hash = (0 << 30) | (pass.priority << 16) | (subModel.priority << 8) | p;

                    this.opaques.push({
                        hash, depth, shaderId: pso.shader.id,
                        subModel, cmdBuff: subModel.commandBuffers[p]});
                } else {
                    const hash = (1 << 30) | (pass.priority << 16) | (subModel.priority << 8) | p;

                    this.transparents.push({
                        hash, depth, shaderId: pso.shader.id,
                        subModel, cmdBuff: subModel.commandBuffers[p]});
                }
            }
        }
    }

    public sort () {

        this.opaques.sort();
        this.transparents.sort();

        const opaqueCount = this.opaques.length;
        const cmdBuffCount = opaqueCount + this.transparents.length;
        this.cmdBuffCount = cmdBuffCount;

        for (let i = 0; i < this.opaques.length; ++i) {
            this.cmdBuffs.array[i] = this.opaques.array[i].cmdBuff;
        }

        for (let i = 0; i < this.transparents.length; ++i) {
            this.cmdBuffs.array[opaqueCount + i] = this.transparents.array[i].cmdBuff;
        }
    }
}
