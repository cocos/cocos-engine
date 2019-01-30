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

    protected _material: Material | null = null;
    protected _pass: Pass | null = null;

    constructor () {
    }

    public initialize (info: IUIMaterialInfo): boolean {

        if (!info.material) {
            return false;
        }

        this._material = info.material;

        this._pass = this._material.passes[0];

        return true;
    }

    public destroy () {
        this._material = null;
    }
}
