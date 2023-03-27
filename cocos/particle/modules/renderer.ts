import { Material } from '../../core';
import { ccclass, displayName, serializable, type } from '../../core/data/decorators';
import { MaterialInstance } from '../../core/renderer';
import { ParticleModule } from '../particle-module';

@ccclass('cc.RendererModule')
export abstract class RendererModule extends ParticleModule {
    @type(Material)
    @displayName('Material')
    public get sharedMaterial () {
        return this._sharedMaterial;
    }

    public set sharedMaterial (val) {
        if (this._sharedMaterial !== val) {
            this._sharedMaterial = val;
            this._material = null;
        }
    }

    public get material () {
        if (!this._material && this._sharedMaterial) {
            this._material = new MaterialInstance({ parent: this._sharedMaterial });
        }
        return this._material;
    }

    public set material (val) {
        if (this._material !== val) {
            this._material = val;
            this._sharedMaterial = null;
        }
    }

    @serializable
    private _sharedMaterial: Material | null = null;
    private _material: MaterialInstance | null = null;
}
