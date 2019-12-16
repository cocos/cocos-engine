import { builtinResMgr } from '../../3d/builtin';
import { createMesh } from '../../3d/misc/utils';
import { Material } from '../../assets/material';
import { Mesh } from '../../assets/mesh';
import { TextureCube } from '../../assets/texture-cube';
import { IInternalBindingInst, UNIFORM_ENVIRONMENT } from '../../pipeline/define';
import { box } from '../../primitive';
import { samplerLib } from '../core/sampler-lib';
import { Model } from './model';
import { RenderScene } from './render-scene';

let skybox_mesh: Mesh | null = null;
let skybox_material: Material | null = null;

export class Skybox extends Model {

    set useIBL (val) {
        this._useIBL = val;
        this._updatePipeline();
    }
    get useIBL () {
        return this._useIBL;
    }

    set isRGBE (val) {
        this._isRGBE = val;
        skybox_material!.recompileShaders({ USE_RGBE_CUBEMAP: this._isRGBE });
        this.setSubModelMaterial(0, skybox_material);
        this._updateGlobalBinding();
        this._updatePipeline();
    }
    get isRGBE () {
        return this._isRGBE;
    }

    set envmap (val: TextureCube | null) {
        const newEnvmap = val || this._default;
        this._envmap = newEnvmap;
        this._scene!.ambient.groundAlbedo[3] = this._envmap.mipmapLevel;
        this._updateGlobalBinding();
    }
    get envmap () {
        return this._envmap;
    }

    protected _default = builtinResMgr.get<TextureCube>('default-cube-texture');
    protected _envmap = this._default;
    protected _isRGBE = false;
    protected _useIBL = false;

    protected _globalBinding: IInternalBindingInst;

    constructor (scene: RenderScene) {
        super();
        this._scene = scene;
        this._globalBinding = this._scene.root.pipeline.globalBindings.get(UNIFORM_ENVIRONMENT.name)!;
        if (!skybox_material) {
            skybox_material = new Material();
            skybox_material.initialize({ effectName: 'pipeline/skybox', defines: { USE_RGBE_CUBEMAP: this._isRGBE } });
        }
        if (!skybox_mesh) { skybox_mesh = createMesh(box({ width: 2, height: 2, length: 2 })); }
        this.initSubModel(0, skybox_mesh.renderingMesh.getSubmesh(0), skybox_material);
    }

    protected _updatePipeline () {
        const value = this._useIBL ? this._isRGBE ? 2 : 1 : 0;
        const pipeline = this._scene!.root.pipeline;
        if (pipeline.macros.CC_USE_IBL === value) { return; }
        pipeline.macros.CC_USE_IBL = value;
        this._scene!.onGlobalPipelineStateChanged();
    }

    protected _updateGlobalBinding () {
        const textureView = this._envmap.getGFXTextureView()!;
        const sampler = samplerLib.getSampler(this._device, this._envmap.getSamplerHash());
        this._globalBinding.sampler = sampler;
        this._globalBinding.textureView = textureView;
        // update skybox material, need to do this every time pso is created
        // because skybox.updateUBOs is not called in pipeline per frame
        const mat = skybox_material!;
        mat.passes[0].bindSampler(UNIFORM_ENVIRONMENT.binding, sampler);
        mat.passes[0].bindTextureView(UNIFORM_ENVIRONMENT.binding, textureView);
        for (const pso of this._matPSORecord.get(mat)!) {
            pso.pipelineLayout.layouts[0].update();
        }
    }
}
