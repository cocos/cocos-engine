import { Material } from '../../3d/assets/material';
import { GFXBindingLayout } from '../../gfx/binding-layout';
import { GFXPipelineState } from '../../gfx/pipeline-state';
import { Pass } from '../core/pass';

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

    public get pipelineState (): GFXPipelineState {
        return this._pipelineState!;
    }

    public get bindingLayout (): GFXBindingLayout {
        return this._bindingLayout!;
    }

    protected _material: Material | null = null;
    protected _pass: Pass | null = null;
    protected _pipelineState: GFXPipelineState | null = null;
    protected _bindingLayout: GFXBindingLayout | null = null;

    constructor () {
    }

    public initialize (info: IUIMaterialInfo): boolean {

        if (!info.material) {
            return false;
        }

        this._material = info.material;

        this._pass = this._material.passes[0];
        this._pipelineState = this._pass.createPipelineState();
        this._bindingLayout = this._pipelineState!.pipelineLayout.layouts[0];

        return true;
    }

    public destroy () {
        this._bindingLayout = null;
        this._pipelineState = null;
        this._material = null;
    }
}
