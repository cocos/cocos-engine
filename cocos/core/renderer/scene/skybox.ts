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
import { legacyCC } from '../../global-exports';
import { GFXDescriptorSet } from '../../gfx';
import { SkyboxPool, NULL_HANDLE, SkyboxView, SkyboxHandle } from '../core/memory-pools';

let skybox_mesh: Mesh | null = null;
let skybox_material: Material | null = null;

export class Skybox {
    get model (): Model | null {
        return this._model;
    }

    /**
     * @en Whether activate skybox in the scene
     * @zh 是否启用天空盒？
     */
    get enabled (): boolean {
        return SkyboxPool.get(this._handle, SkyboxView.ENABLE) as unknown as boolean;
    }

    set enabled (val: boolean) {
        val ? this.activate() : this._updatePipeline();
        SkyboxPool.set(this._handle, SkyboxView.ENABLE, val ? 1 : 0);
    }

    /**
     * @en Whether use environment lighting
     * @zh 是否启用环境光照？
     */
    get useIBL (): boolean {
        return SkyboxPool.get(this._handle, SkyboxView.USE_IBL) as unknown as boolean;
    }

    set useIBL (val: boolean) {
        SkyboxPool.set(this._handle, SkyboxView.USE_IBL, val ? 1 : 0);
        this._updatePipeline();
    }

    /**
     * @en Whether enable RGBE data support in skybox shader
     * @zh 是否需要开启 shader 内的 RGBE 数据支持？
     */
    get isRGBE (): boolean {
        return SkyboxPool.get(this._handle, SkyboxView.IS_RGBE) as unknown as boolean;
    }

    set isRGBE (val: boolean) {
        if (val) {
            if (skybox_material) {
                skybox_material.recompileShaders({ USE_RGBE_CUBEMAP: val });
            }

            if (this._model) {
                this._model.setSubModelMaterial(0, skybox_material!);
            }
        }
        SkyboxPool.set(this._handle, SkyboxView.IS_RGBE, val ? 1 : 0);
        this._updatePipeline();
    }

    /**
     * @en The texture cube used for the skybox
     * @zh 使用的立方体贴图
     */
    get envmap (): TextureCube | null {
        return this._envmap;
    }

    set envmap (val: TextureCube | null) {
        this._envmap = val || this._default;
        if (this._envmap) {
            legacyCC.director.root.pipeline.ambient.albedoArray[3] = this._envmap.mipmapLevel;
            this._updateGlobalBinding();
        }
    }

    protected _envmap: TextureCube | null = null;
    protected _globalDescriptorSet: GFXDescriptorSet | null = null;
    protected _model: Model | null = null;
    protected _default: TextureCube | null = null;
    protected _handle: SkyboxHandle = NULL_HANDLE;

    constructor () {
        this._handle = SkyboxPool.alloc();
    }

    public activate () {
        const pipeline = legacyCC.director.root.pipeline;
        this._globalDescriptorSet = pipeline.descriptorSet;
        this._default = builtinResMgr.get<TextureCube>('default-cube-texture');

        if (!this._model) {
            this._model = new Model();
        }

        SkyboxPool.set(this._handle, SkyboxView.MODEL, this._model.handle);

        pipeline.ambient.groundAlbedo[3] = this._envmap ? this._envmap.mipmapLevel : this._default.mipmapLevel;

        if (!skybox_material) {
            const mat = new Material();
            mat.initialize({ effectName: 'pipeline/skybox', defines: { USE_RGBE_CUBEMAP: this.isRGBE } });
            skybox_material = new MaterialInstance({ parent: mat });
        } else {
            skybox_material.recompileShaders({ USE_RGBE_CUBEMAP: this.isRGBE });
        }

        if (!skybox_mesh) { skybox_mesh = createMesh(box({ width: 2, height: 2, length: 2 })); }
        this._model.initSubModel(0, skybox_mesh.renderingSubMeshes[0], skybox_material);

        this.envmap = this._envmap;
        this._updateGlobalBinding();
        this._updatePipeline();
    }

    protected _updatePipeline () {
        const value = this.enabled ? (this.useIBL ? this.isRGBE ? 2 : 1 : 0) : 0;
        const root = legacyCC.director.root;
        const pipeline = root.pipeline;
        const current = pipeline.macros.CC_USE_IBL;
        if (current === value) { return; }
        pipeline.macros.CC_USE_IBL = value;
        root.onGlobalPipelineStateChanged();
    }

    protected _updateGlobalBinding () {
        const texture = this.envmap!.getGFXTexture()!;
        const sampler = samplerLib.getSampler(legacyCC.director._device, this.envmap!.getSamplerHash());
        this._globalDescriptorSet!.bindSampler(UNIFORM_ENVIRONMENT.binding, sampler);
        this._globalDescriptorSet!.bindTexture(UNIFORM_ENVIRONMENT.binding, texture);
    }

    public destroy () {
        if (this._handle) {
            SkyboxPool.free(this._handle);
            this._handle = NULL_HANDLE;
        }
    }
}

legacyCC.Skybox = Skybox;
