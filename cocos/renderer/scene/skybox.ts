import { Material } from '../../3d/assets/material';
import { TextureCube } from '../../3d/assets/texture-cube';
import { builtinResMgr } from '../../3d/builtin';
import { createMesh } from '../../3d/misc/utils';
import { box } from '../../3d/primitive';
import { Model } from './model';
import { RenderScene } from './render-scene';

export class Skybox extends Model {

    set cubemap (val: TextureCube | null) {
        this._cubemap = val || this._default;
        this._material.setProperty('cubeMap', this._cubemap);
        this._updateBindingLayout();
    }
    get cubemap () {
        return this._cubemap;
    }

    set isRGBE (val: boolean) {
        if (val === this._isRGBE) { return; }
        this._isRGBE = val;
        this._material.destroy();
        this._initMaterial();
        this.setSubModelMaterial(0, this._material);
        this._updateBindingLayout();
    }
    get isRGBE () {
        return this._isRGBE;
    }

    protected _default = builtinResMgr.get<TextureCube>('default-cube-texture');
    protected _cubemap = this._default;
    protected _isRGBE = false;

    protected _material = new Material();

    constructor (scene: RenderScene) {
        super(scene, null!);
        this._scene = scene;
        this._initMaterial();

        const mesh = createMesh(box({ width: 2, height: 2, length: 2 }));
        const subMeshData = mesh.renderingMesh!.getSubmesh(0)!;
        this.initSubModel(0, subMeshData, this._material);
        this._updateBindingLayout();
    }

    protected _initMaterial () {
        this._material.initialize({
            effectName: 'builtin-skybox',
            defines: { USE_RGBE_CUBEMAP: this._isRGBE },
        });
        this._material.setProperty('cubeMap', this._cubemap);
    }

    protected _updateBindingLayout () {
        this._matPSORecord.get(this._material)![0].pipelineLayout.layouts[0].update();
    }
}
