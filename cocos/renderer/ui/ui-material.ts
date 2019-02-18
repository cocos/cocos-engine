import { Material } from '../../3d/assets/material';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { Pass } from '../core/pass';
import Pool from '../../3d/memop/pool';

export interface IUIMaterialInfo {
    material: Material;
}

export class UIMaterial {

    public get material (): Material {
        return this._material!;
    }

    public get pass (): Pass {
        return this._pass!;
    }

    protected _material: Material | null = null;
    protected _pass: Pass | null = null;
    private _psos: Pool<GFXPipelineState> | null;

    constructor () {
        this._psos = null;
    }

    public initialize (info: IUIMaterialInfo): boolean {

        if (!info.material) {
            return false;
        }

        this._material = info.material;

        this._pass = this._material.passes[0];

        this._psos = new Pool(() => this._pass!.createPipelineState()!, 1);

        return true;
    }

    public getPipelineState (): GFXPipelineState {
        return this._psos!.alloc();
    }

    public revertPipelineState (pso: GFXPipelineState) {
        this._psos!.free(pso);
    }

    public destroy () {
        this._material = null;
        if (this._psos) {
            this._psos.clear((obj: GFXPipelineState) => {
                this._pass!.destroyPipelineState(obj);
            });
        }
    }
}
