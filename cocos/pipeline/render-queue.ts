import { CachedArray } from '../core/memop/cached-array';
import { vec3 } from '../core/vmath';
import { GFXCommandBuffer } from '../gfx/command-buffer';
import { Camera } from '../renderer/scene/camera';
import { Model } from '../renderer/scene/model';
import { SubModel } from '../renderer/scene/submodel';

export enum RenderPriority {
    MIN = 0,
    MAX = 0xff,
    DEFAULT = 0x80,
}

export interface IRenderItem {
    hash: number;
    depth: number;
    shaderId: number;
    subModel: SubModel;
    cmdBuff: GFXCommandBuffer;
}

export class RenderQueue {
    public opaques: CachedArray<IRenderItem>;
    public transparents: CachedArray<IRenderItem>;
    public cmdBuffs: CachedArray<GFXCommandBuffer>;
    public cmdBuffCount: number = 0;

    constructor () {

        // Opaque objects are sorted by depth front to back -> pass priority -> shader id.
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

        // Transparent objects are sorted by depth back to front -> pass priority -> shader id.
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

        const depth = vec3.distance(camera.node.getPosition(), model.node!.getPosition());

        for (let i = 0; i < model.subModelNum; ++i) {
            const subModel = model.getSubModel(i);
            for (let p = 0; p < subModel.passes.length; ++p) {

                const pass = subModel.passes[p];
                const pso = subModel.psos[p];
                const isTransparent = pso.blendState.targets[0].blend;

                // TODO: model priority

                if (!isTransparent) {
                    const hash = (0 << 30) | pass.priority | subModel.priority | p;

                    this.opaques.push({
                        hash, depth, shaderId: pso.shader.id,
                        subModel, cmdBuff: subModel.commandBuffers[p]});
                } else {
                    const hash = (1 << 30) | pass.priority | subModel.priority | p;

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

        this.cmdBuffs.reserve(cmdBuffCount);

        this.cmdBuffCount = cmdBuffCount;

        for (let i = 0; i < this.opaques.length; ++i) {
            this.cmdBuffs.array[i] = this.opaques.array[i].cmdBuff;
        }

        for (let i = 0; i < this.transparents.length; ++i) {
            this.cmdBuffs.array[opaqueCount + i] = this.transparents.array[i].cmdBuff;
        }
    }
}
