import { Material } from '../../3d/assets/material';
import { TextureCube } from '../../3d/assets/texture-cube';
import { builtinResMgr } from '../../3d/builtin';
import { createMesh } from '../../3d/misc/utils';
import { box } from '../../3d/primitive';
import { IInternalBindingInst, UNIFORM_ENVIRONMENT } from '../../pipeline/define';
import { samplerLib } from '../core/sampler-lib';
import { Model } from './model';
import { RenderScene } from './render-scene';

export class Skybox extends Model {

    set useIBL (val) {
        this._useIBL = val;
        const pipeline = this._scene.root.pipeline;
        if (!!pipeline.macros.CC_USE_IBL === val) { return; }
        pipeline.macros.CC_USE_IBL = val;
        this._scene.onPipelineChange();
        this._updateGlobalBinding();
    }
    get useIBL () {
        return this._useIBL;
    }

    set envmap (val: TextureCube | null) {
        const newEnvmap = val || this._default;
        this._envmap = newEnvmap;
        this._updateGlobalBinding();
    }
    get envmap () {
        return this._envmap;
    }

    set isRGBE (val: boolean) {
        if (val === this._isRGBE) { return; }
        this._isRGBE = val;
        this._material.recompileShaders({ USE_RGBE_CUBEMAP: this._isRGBE });
        this.setSubModelMaterial(0, this._material);
        this._updateGlobalBinding();
    }
    get isRGBE () {
        return this._isRGBE;
    }

    protected _default = builtinResMgr.get<TextureCube>('default-cube-texture');
    protected _envmap = this._default;
    protected _isRGBE = false;
    protected _useIBL = false;

    protected _material = new Material();
    protected _globalBinding: IInternalBindingInst;

    constructor (scene: RenderScene) {
        super(scene, null!);
        this._scene = scene;
        this._material.initialize({
            effectName: 'pipeline/skybox',
            defines: { USE_RGBE_CUBEMAP: this._isRGBE },
        });
        this._globalBinding = this._scene.root.pipeline.globalBindings.get(UNIFORM_ENVIRONMENT.name)!;

        const mesh = createMesh(box({ width: 2, height: 2, length: 2 }));
        const subMeshData = mesh.renderingMesh.getSubmesh(0)!;
        this.initSubModel(0, subMeshData, this._material);
        this._updateGlobalBinding();
    }

    protected _updateGlobalBinding () {
        const textureView = this._envmap.getGFXTextureView()!;
        const sampler = samplerLib.getSampler(this._device, this._envmap.getSamplerHash());
        this._globalBinding.sampler = sampler;
        this._globalBinding.textureView = textureView;
        // update skybox material, need to do this every time pso is created
        // because skybox.updateUBOs is not called in pipeline per frame
        const mat = this._material;
        mat.passes[0].bindSampler(UNIFORM_ENVIRONMENT.binding, sampler);
        mat.passes[0].bindTextureView(UNIFORM_ENVIRONMENT.binding, textureView);
        for (const pso of this._matPSORecord.get(mat)!) {
            pso.pipelineLayout.layouts[0].update();
        }
    }
}
