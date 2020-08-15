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
import { ccclass, property } from '../../data/class-decorator';
import { CCBoolean } from '../../data/utils/attribute';
import { legacyCC } from '../../global-exports';
import { GFXDescriptorSet } from '../../gfx';
import { EDITOR } from 'internal:constants';

let skybox_mesh: Mesh | null = null;
let skybox_material: Material | null = null;

@ccclass('cc.Skybox')
export class Skybox {
    get model () {
        return this._model;
    }

    /**
     * @en Whether activate skybox in the scene
     * @zh 是否启用天空盒？
     */
    get enabled () {
        return this._enabled;
    }

    set enabled (val) {
        this._enabled = val;
    }

    /**
     * @en Whether use environment lighting
     * @zh 是否启用环境光照？
     */
    get useIBL () {
        return this._useIBL;
    }

    set useIBL (val) {
        this._useIBL = val;
        if (!EDITOR) {
            this._updatePipeline();
        }
    }

    /**
     * @en Whether enable RGBE data support in skybox shader
     * @zh 是否需要开启 shader 内的 RGBE 数据支持？
     */
    get isRGBE () {
        return this._isRGBE;
    }

    set isRGBE (val) {
        this._isRGBE = val;

        if (!EDITOR) {
            if (skybox_material) {
                skybox_material.recompileShaders({ USE_RGBE_CUBEMAP: this._isRGBE });
            }

            if (this._model) {
                this._model.setSubModelMaterial(0, skybox_material!);
            }

            this._updatePipeline();
        }
    }

    /**
     * @en The texture cube used for the skybox
     * @zh 使用的立方体贴图
    */
    get envmap () {
        return this._envmap;
    }

    set envmap (val: TextureCube | null) {
        const newEnvmap = val || builtinResMgr.get<TextureCube>('default-cube-texture');
        this._envmap = newEnvmap;
        if (!EDITOR) {
            legacyCC.root.pipeline.ambient.groundAlbedo[3] = this._envmap.mipmapLevel;
            this._updateGlobalBinding();
        }
    }

    @property({
        type: CCBoolean,
        visible: true,
    })
    protected _enabled = false;
    @property({
        type: CCBoolean,
        visible: true,
    })
    protected _isRGBE = false;
    @property({
        type: CCBoolean,
        visible: true,
    })
    protected _useIBL = false;
    @property({
        type: TextureCube,
        visible: true,
    })
    protected _envmap: TextureCube | null = null;
    protected _globalDescriptorSet: GFXDescriptorSet | null = null;
    protected _model: Model | null = null;

    public activate () {
        if (!this._envmap) {
            this._envmap = builtinResMgr.get<TextureCube>('default-cube-texture');
        }

        if (!this._model) {
            this._model = new Model();
        }

        this._globalDescriptorSet = legacyCC.director.root.pipeline.descriptorSet;
        if (!skybox_material) {
            const mat = new Material();
            mat.initialize({ effectName: 'pipeline/skybox', defines: { USE_RGBE_CUBEMAP: this._isRGBE } });
            skybox_material = new MaterialInstance({ parent: mat });
        }
        if (!skybox_mesh) { skybox_mesh = createMesh(box({ width: 2, height: 2, length: 2 })); }
        this._model.initSubModel(0, skybox_mesh.renderingSubMeshes[0], skybox_material);
    }

    public onGlobalPipelineStateChanged () {
        this._model!.onGlobalPipelineStateChanged();
        this._updateGlobalBinding();
    }

    protected _updatePipeline () {
        const value = this._useIBL ? this._isRGBE ? 2 : 1 : 0;
        const pipeline = legacyCC.director.root.pipeline;
        const current = pipeline.macros.CC_USE_IBL || 0;
        if (current === value) { return; }
        pipeline.macros.CC_USE_IBL = value;
    }

    protected _updateGlobalBinding () {
        const texture = this._envmap!.getGFXTexture()!;
        const sampler = samplerLib.getSampler(legacyCC.director._device, this._envmap!.getSamplerHash());
        this._globalDescriptorSet!.bindSampler(UNIFORM_ENVIRONMENT.binding, sampler);
        this._globalDescriptorSet!.bindTexture(UNIFORM_ENVIRONMENT.binding, texture);
    }
}
