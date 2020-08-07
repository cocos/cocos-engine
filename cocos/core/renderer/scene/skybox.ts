import { builtinResMgr } from '../../3d/builtin';
import { createMesh } from '../../3d/misc/utils';
import { Material } from '../../assets/material';
import { Mesh } from '../../assets/mesh';
import { TextureCube } from '../../assets/texture-cube';
import { UNIFORM_ENVIRONMENT } from '../../pipeline/define';
import { box } from '../../primitive';
import { MaterialInstance } from '../core/material-instance';
import { samplerLib } from '../core/sampler-lib';
import { Model } from './model';
import { RenderScene } from './render-scene';
import { GFXDescriptorSet } from '../../gfx';

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
        this.setSubModelMaterial(0, skybox_material!);
        this._updatePipeline();
    }
    get isRGBE () {
        return this._isRGBE;
    }

    set envmap (val: TextureCube | null) {
        const newEnvmap = val || this._default;
        this._envmap = newEnvmap;
        this.scene!.ambient.groundAlbedo[3] = this._envmap.mipmapLevel;
        this._updateGlobalBinding();
    }
    get envmap () {
        return this._envmap;
    }

    protected _default = builtinResMgr.get<TextureCube>('default-cube-texture');
    protected _envmap = this._default;
    protected _isRGBE = false;
    protected _useIBL = false;

    protected _globalDescriptorSet: GFXDescriptorSet;

    constructor (scene: RenderScene) {
        super();
        this.scene = scene;
        this._globalDescriptorSet = this.scene.root.pipeline.descriptorSet;

        if (!skybox_material) {
            const mat = new Material();
            mat.initialize({ effectName: 'pipeline/skybox', defines: { USE_RGBE_CUBEMAP: this._isRGBE } });
            skybox_material = new MaterialInstance({ parent: mat });
        }
        if (!skybox_mesh) { skybox_mesh = createMesh(box({ width: 2, height: 2, length: 2 })); }
        this.initSubModel(0, skybox_mesh.renderingSubMeshes[0], skybox_material);
    }

    public onGlobalPipelineStateChanged () {
        super.onGlobalPipelineStateChanged();
        this._updateGlobalBinding();
    }

    protected _updatePipeline () {
        const value = this._useIBL ? this._isRGBE ? 2 : 1 : 0;
        const pipeline = this.scene!.root.pipeline;
        const current = pipeline.macros.CC_USE_IBL || 0;
        if (current === value) { return; }
        pipeline.macros.CC_USE_IBL = value;
        this.scene!.onGlobalPipelineStateChanged();
    }

    protected _updateGlobalBinding () {
        const texture = this._envmap.getGFXTexture()!;
        const sampler = samplerLib.getSampler(this._device, this._envmap.getSamplerHash());
        this._globalDescriptorSet.bindSampler(UNIFORM_ENVIRONMENT.binding, sampler);
        this._globalDescriptorSet.bindTexture(UNIFORM_ENVIRONMENT.binding, texture);
    }
}
