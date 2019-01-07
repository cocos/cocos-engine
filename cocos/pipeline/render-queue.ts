import { Pass } from "../renderer/core/pass";
import Model from "../renderer/scene/model";

export class RenderItem {
    hash: number;
    model: Model;
    pass: Pass;

    constructor(hash: number, model: Model, pass: Pass) {
        this.hash = hash;
        this.model = model;
        this.pass = pass;
    }
};

export class RenderQueue {

    constructor() {
    }

    public add(model: Model, pass: Pass) {
        let pso = pass.pipelineState;

        let isTransparent = pso.blendState.targets[0].blend;

        let hash: number = 0;

        if(!isTransparent) {
            // Opaque objects are sorted by depth front to back, then by shader id.
            hash = (0 << 63) | (pso.shader.id << 13);

            this._opaques.push({hash, model, pass});
        } else {
            // Transparent objects are sorted by depth back to front, then by by shader id.
            hash = (1 << 63) | (pso.shader.id << 13);
            
            this._transparents.push({hash, model, pass});
        }
    }

    public get opaques(): RenderItem[] {
        return this._opaques;
    }

    public get transparents(): RenderItem[] {
        return this._transparents;
    }

    private _opaques: RenderItem[] = [];
    private _transparents: RenderItem[] = [];
};
