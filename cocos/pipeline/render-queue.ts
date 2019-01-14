import { CachedArray } from '../core/memop/cached-array';
import { vec3 } from '../core/vmath';
import { GFXCommandBuffer } from '../gfx/command-buffer';
import { Pass } from '../renderer/core/pass';
import { Camera } from '../renderer/scene/camera';
import { Model } from '../renderer/scene/model';

export class RenderItem {
    public hash: number;
    public model: Model;
    public pass: Pass;
    public cmdBuff: GFXCommandBuffer;

    constructor (hash: number, model: Model, pass: Pass, cmdBuff: GFXCommandBuffer) {
        this.hash = hash;
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
    private _buffer: ArrayBuffer;
    private _f32View: Float32Array;
    private _ui32View: Uint32Array;

    constructor () {
        const compareFn = (a: RenderItem, b: RenderItem) => {
            return a.hash - b.hash;
        };

        this.opaques = new CachedArray(64, compareFn);
        this.transparents = new CachedArray(64, compareFn);
        this.cmdBuffs = new CachedArray(64);

        this._buffer = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT);
        this._f32View = new Float32Array(this._buffer);
        this._ui32View = new Uint32Array(this._buffer);
    }

    public clear () {
        this.opaques.clear();
        this.transparents.clear();
        this.cmdBuffCount = 0;
    }

    public add (model: Model, camera: Camera) {

        this._f32View[0] = vec3.distance(camera.node.getPosition(), model.node.getPosition());
        let ui32Depth: number = this._ui32View[0];
        const mask = -(ui32Depth >> 31) | 0x8000000000000000;
        ui32Depth = (ui32Depth ^ mask);
        const ui32DepthInv = (ui32Depth ^ 0x00000000ffffffff);

        for (let i = 0; i < model.passes.length; ++i) {
            const pass = model.passes[i];

            // update pass
            pass.update();

            const pso = pass.pipelineState;

            const isTransparent = pso.blendState.targets[0].blend;

            // TODO: model priority

            if (!isTransparent) {
                // Opaque objects are sorted by depth front to back -> pass priority -> shader id.
                const hash = (0 << 61) | (i << 45) | (ui32Depth << 13) | pso.shader.id;

                this.opaques.push({hash, model, pass, cmdBuff: model.commandBuffers[i]});
            } else {
                // Transparent objects are sorted by depth back to front -> pass priority -> shader id.
                const hash = (1 << 61) | (i << 45) | (ui32DepthInv << 13) | pso.shader.id;

                this.transparents.push({hash, model, pass, cmdBuff: model.commandBuffers[i]});
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
