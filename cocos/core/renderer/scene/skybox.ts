/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { JSB } from 'internal:constants';
import { builtinResMgr } from '../../builtin';
import { Material } from '../../assets/material';
import { Mesh } from '../../../3d/assets/mesh';
import { TextureCube } from '../../assets/texture-cube';
import { UNIFORM_ENVIRONMENT_BINDING, UNIFORM_DIFFUSEMAP_BINDING } from '../../pipeline/define';
import { MaterialInstance } from '../core/material-instance';
import { samplerLib } from '../core/sampler-lib';
import { Model } from './model';
import { legacyCC } from '../../global-exports';
import { DescriptorSet } from '../../gfx';
import { SkyboxInfo } from '../../scene-graph/scene-globals';
import { Root } from '../../root';
import { NaitveSkybox } from './native-scene';
import { GlobalDSManager } from '../../pipeline/global-descriptor-set-manager';

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
        return this._enabled;
    }

    set enabled (val: boolean) {
        this._setEnabled(val);
        if (val) this.activate(); else this._updatePipeline();
    }
    /**
     * @en HDR
     * @zh 是否启用环境光照？
     */
    get useHDR (): boolean {
        return this._useHDR;
    }

    set useHDR (val: boolean) {
        this._setUseHDR(val);
        this._updatePipeline();
    }

    /**
     * @en Whether use HDR
     * @zh TODO
     */
     get useIBL (): boolean {
        return this._useIBL;
    }

    set useIBL (val: boolean) {
        this._setUseIBL(val);
        this._updatePipeline();
    }

    /**
     * @en Whether use diffuse convolution map lighting
     * @zh TODO
     */
     get useDiffusemap (): boolean {
        return this._useDiffusemap;
    }

    set useDiffusemap (val: boolean) {
        this._useDiffusemap = val;
        this._updatePipeline();
    }

    /**
     * @en Whether enable RGBE data support in skybox shader
     * @zh 是否需要开启 shader 内的 RGBE 数据支持？
     */
    get isRGBE (): boolean {
        if (this.envmap) {
            return this.envmap.isRGBE;
        } else {
            return false;
        }
    }

    /**
     * @en The texture cube used for the skybox
     * @zh 使用的立方体贴图
     */
    get envmap (): TextureCube | null {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._envmap_hdr;
        } else {
            return this._envmap_ldr;
        }
    }

    /**
     * @en The texture cube used diffuse reflection convolution map
     * @zh TODO
     */
     get diffusemap (): TextureCube | null {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._diffusemap_hdr;
        } else {
            return this._diffusemap_ldr;
        }
    }
    set diffusemap (val: TextureCube | null) {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._diffusemap_hdr = val;
        } else {
            this._diffusemap_ldr = val;
        }
        if(val)
        {
            this._updateGlobalBinding();
            this._updatePipeline();
        }
    }

    set envmap (val: TextureCube | null) {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._envmap_hdr = val || this._default;
            if (this._envmap_hdr) {
                (legacyCC.director.root as Root).pipeline.pipelineSceneData.ambient.albedoArray[3] = this._envmap_hdr.mipmapLevel;
               this._updateGlobalBinding();
            }
        } else {
            this._envmap_ldr = val || this._default;           
            if (this._envmap_ldr) {
                (legacyCC.director.root as Root).pipeline.pipelineSceneData.ambient.albedoArray[3] = this._envmap_ldr.mipmapLevel;
                this._updateGlobalBinding();
            }   
        }
        
        if (val) {
            if (JSB) {
               this._nativeObj!.isRGBE = val.isRGBE;
            }
        
            if (skybox_material) {
                skybox_material.recompileShaders({ USE_RGBE_CUBEMAP: val.isRGBE });
            }
        
            if (this._model) {
                this._model.setSubModelMaterial(0, skybox_material!);
            }
        }
        
        this._updatePipeline();
    }

    protected _envmap_ldr: TextureCube | null = null;
    protected _envmap_hdr: TextureCube | null = null;
    protected _diffusemap_ldr: TextureCube | null = null;
    protected _diffusemap_hdr: TextureCube | null = null;
    protected _globalDSManager: GlobalDSManager | null = null;
    protected _model: Model | null = null;
    protected _default: TextureCube | null = null;
    protected _enabled = false;
    protected _useIBL = false;
    protected _useHDR = false;
    protected _useDiffusemap = false;
    protected declare _nativeObj: NaitveSkybox | null;

    get native (): NaitveSkybox {
        return this._nativeObj!;
    }

    private _setEnabled (val) {
        this._enabled = val;
        if (JSB) {
            this._nativeObj!.enabled = val;
        }
    }

    private _setUseIBL (val) {
        this._useIBL = val;
        if (JSB) {
            this._nativeObj!.useIBL = val;
        }
    }

    private _setUseHDR (val) {
        this._useHDR = val;
        /*
        if (JSB) {
            this._nativeObj!.useIBL = val;
        }
        */
    }

    private _setUseDiffusemap(val) {
        this._useDiffusemap = val;       
    }

    public initialize (skyboxInfo: SkyboxInfo) {
        this._setEnabled(skyboxInfo.enabled);
        this._setUseIBL(skyboxInfo.useIBL);
        this._setUseDiffusemap(skyboxInfo.applyDiffuseMap);
        this._setUseHDR(skyboxInfo.useHDR);
        this.envmap = skyboxInfo.envmap;
        this.diffusemap = skyboxInfo.diffusemap;
    }

    public activate () {
        const pipeline = legacyCC.director.root.pipeline;
        const ambient = pipeline.pipelineSceneData.ambient;
        this._globalDSManager = pipeline.globalDSManager;
        this._default = builtinResMgr.get<TextureCube>('default-cube-texture');

        if (!this._model) {
            this._model = legacyCC.director.root.createModel(legacyCC.renderer.scene.Model) as Model;
            // @ts-expect-error private member access
            this._model._initLocalDescriptors = () => {};
            if (JSB) {
                this._nativeObj!.model = this._model.native;
            }
        }
        let isRGBE = this._default.isRGBE;
        if (this.envmap) {
            isRGBE = this.envmap.isRGBE;
        }

        if (!skybox_material) {
            const mat = new Material();
            mat.initialize({ effectName: 'skybox', defines: { USE_RGBE_CUBEMAP: isRGBE } });
            skybox_material = new MaterialInstance({ parent: mat });
        }

        if (this.enabled) {
            if (!skybox_mesh) { skybox_mesh = legacyCC.utils.createMesh(legacyCC.primitives.box({ width: 2, height: 2, length: 2 })) as Mesh; }
            this._model.initSubModel(0, skybox_mesh.renderingSubMeshes[0], skybox_material);
        }

        if (!this.envmap) {
            this.envmap = this._default;
        }

        if (!this.diffusemap) {
            this.diffusemap = this._default;
        }

        this._updateGlobalBinding();
        this._updatePipeline();
    }

    protected _updatePipeline () {
        const value = this.useIBL ? (this.isRGBE ? 2 : 1) : 0;
        const root = legacyCC.director.root as Root;
        const pipeline = root.pipeline;
        const current = pipeline.macros.CC_USE_IBL;
        //if (current === value) { return; }
        pipeline.macros.CC_USE_IBL = value;
        pipeline.macros.CC_USE_DIFFUSEMAP = (this.useDiffusemap && this.diffusemap) ? (this.isRGBE ? 2 : 1) : 0;
        pipeline.macros.CC_USE_HDR = this.useHDR;
        root.onGlobalPipelineStateChanged();
    }

    protected _updateGlobalBinding () {
        const textureEnvmap = this.envmap!.getGFXTexture()!;
        const samplerEnvmap = samplerLib.getSampler(legacyCC.director._device, this.envmap!.getSamplerHash());

        this._globalDSManager!.bindSampler(UNIFORM_ENVIRONMENT_BINDING, samplerEnvmap);
        this._globalDSManager!.bindTexture(UNIFORM_ENVIRONMENT_BINDING, textureEnvmap);

        if(this.diffusemap) {
            const textureDiffusemap = this.diffusemap!.getGFXTexture()!;
            const samplerDiffusemap = samplerLib.getSampler(legacyCC.director._device, this.diffusemap!.getSamplerHash());

            this._globalDSManager!.bindSampler(UNIFORM_DIFFUSEMAP_BINDING, samplerDiffusemap);
            this._globalDSManager!.bindTexture(UNIFORM_DIFFUSEMAP_BINDING, textureDiffusemap);
        }

        this._globalDSManager!.update();
    }

    protected _destroy () {
        if (JSB) {
            this._nativeObj = null;
        }
    }

    public destroy () {
        this._destroy();
    }
}

legacyCC.Skybox = Skybox;
