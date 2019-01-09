import { GFXCommandBuffer } from '../gfx/command-buffer';
import { Pass } from '../renderer/core/pass';
import Model from '../renderer/scene/model';

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

    public get opaques (): RenderItem[] {
        return this._opaques;
    }

    public get transparents (): RenderItem[] {
        return this._transparents;
    }

    private _opaques: RenderItem[] = [];
    private _transparents: RenderItem[] = [];

    constructor () {
    }

    public add (model: Model) {

        for (let i = 0; i < model.passes.length; ++i) {
            const pass = model.passes[i];
            const cmdBuff = model.commandBuffers[i];

            const pso = pass.pipelineState;

            const isTransparent = pso.blendState.targets[0].blend;

            let hash: number = 0;

            if (!isTransparent) {
                // Opaque objects are sorted by depth front to back, then by shader id.
                hash = (0 << 63) | (pso.shader.id << 13);

                this._opaques.push({hash, model, pass, cmdBuff});
            } else {
                // Transparent objects are sorted by depth back to front, then by by shader id.
                hash = (1 << 63) | (pso.shader.id << 13);

                this._transparents.push({hash, model, pass, cmdBuff});
            }
        }
    }
}
