import { CachedArray } from '../core/memop/cached-array';
import { vec3 } from '../core/vmath';
import { GFXCommandBuffer } from '../gfx/command-buffer';
import { Pass } from '../renderer/core/pass';
import { Camera } from '../renderer/scene/camera';
import { Model } from '../renderer/scene/model';

export class RenderItem {
    public hash: number = 0;
    public depth: number = 0;
    public shaderId: number = 0;
    public model: Model;
    public pass: Pass;
    public cmdBuff: GFXCommandBuffer;

    constructor (model: Model, pass: Pass, cmdBuff: GFXCommandBuffer) {
        this.model = model;
        this.pass = pass;
        this.cmdBuff = cmdBuff;
    }
}

export class RenderQueue {
    public opaques: CachedArray<RenderItem>;
    public transparents: CachedArray<RenderItem>;
    public cmdBuffs: CachedArray<GFXCommandBuffer>;
    public cmdBuffCount: number = 0;

    constructor () {

        // Opaque objects are sorted by depth front to back -> pass priority -> shader id.
        const opaqueCompareFn = (a: RenderItem, b: RenderItem) => {
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
        const transparentCompareFn = (a: RenderItem, b: RenderItem) => {
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

        const depth = vec3.distance(camera.node.getPosition(), model.node.getPosition());

        for (let i = 0; i < model.passes.length; ++i) {
            const pass = model.passes[i];

            // update pass
            pass.update();

            const pso = pass.pipelineState;

            const isTransparent = pso.blendState.targets[0].blend;

            // TODO: model priority

            if (!isTransparent) {
                const hash = (0 << 30) | i;

                this.opaques.push({hash, depth, shaderId: pso.shader.id,
                    model, pass, cmdBuff: model.commandBuffers[i]});
            } else {
                const hash = (1 << 30) | i;

                this.transparents.push({hash, depth, shaderId: pso.shader.id,
                    model, pass, cmdBuff: model.commandBuffers[i]});
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
