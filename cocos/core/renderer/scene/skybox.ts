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
import { Model } from './model';
import { legacyCC } from '../../global-exports';
import { SkyboxInfo } from '../../scene-graph/scene-globals';
import { Root } from '../../root';
import { NaitveSkybox } from './native-scene';
import { GlobalDSManager } from '../../pipeline/global-descriptor-set-manager';
import { Device } from '../../gfx';

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
        const tex = this.envmap;
        this.envmap = tex;
    }

    /**
     * @en Whether use HDR
     * @zh 是否启用HDR？
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
     * @zh 是否为IBL启用漫反射卷积图？
     */
    get useDiffusemap (): boolean {
        return this._useDiffusemap;
    }

    set useDiffusemap (val: boolean) {
        this._useDiffusemap = val;
        this._updateGlobalBinding();
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
            return this._envmapHDR;
        } else {
            return this._envmapLDR;
        }
    }
    set envmap (val: TextureCube | null) {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._envmapHDR = val || this._default;
            if (this._envmapHDR) {
                (legacyCC.director.root as Root).pipeline.pipelineSceneData.ambient.albedoArray[3] = this._envmapHDR.mipmapLevel;
                this._updateGlobalBinding();
            }
        } else {
            this._envmapLDR = val || this._default;
            if (this._envmapLDR) {
                (legacyCC.director.root as Root).pipeline.pipelineSceneData.ambient.albedoArray[3] = this._envmapLDR.mipmapLevel;
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

    /**
     * @en The texture cube used diffuse convolution map
     * @zh 使用的漫反射卷积图
     */
    get diffusemap (): TextureCube | null {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._diffusemapHDR;
        } else {
            return this._diffusemapLDR;
        }
    }
    set diffusemap (val: TextureCube | null) {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._diffusemapHDR = val;
        } else {
            this._diffusemapLDR = val;
        }
        if (val) {
            this._updateGlobalBinding();
            this._updatePipeline();
        }
    }

    protected _envmapLDR: TextureCube | null = null;
    protected _envmapHDR: TextureCube | null = null;
    protected _diffusemapLDR: TextureCube | null = null;
    protected _diffusemapHDR: TextureCube | null = null;
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

    constructor () {
        if (JSB) {
            this._nativeObj = new NaitveSkybox();
        }
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
        if (JSB) {
            this._nativeObj!.useHDR = val;
        }
    }

    private _setUseDiffusemap (val) {
        this._useDiffusemap = val;
        if (JSB) {
            this._nativeObj!.useDiffusemap = val;
        }
    }

    public initialize (skyboxInfo: SkyboxInfo) {
        this._setEnabled(skyboxInfo.enabled);
        this._setUseIBL(skyboxInfo.useIBL);
        this._setUseDiffusemap(skyboxInfo.applyDiffuseMap);
        this._setUseHDR(skyboxInfo.useHDR);
    }

    public initializeEnvMaps (envmapHDR: TextureCube | null, envmapLDR: TextureCube | null) {
        this._envmapHDR = envmapHDR;
        this._envmapLDR = envmapLDR;
    }

    public initializeDiffuseMaps (diffusemapHDR: TextureCube | null, diffusemapLDR: TextureCube | null) {
        this._diffusemapHDR = diffusemapHDR;
        this._diffusemapLDR = diffusemapLDR;
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
        // if (current === value) { return; }
        pipeline.macros.CC_USE_IBL = value;
        pipeline.macros.CC_USE_DIFFUSEMAP = (this.useDiffusemap && this.diffusemap) ? (this.isRGBE ? 2 : 1) : 0;
        pipeline.macros.CC_USE_HDR = this.useHDR;
        root.onGlobalPipelineStateChanged();
    }

    protected _updateGlobalBinding () {
        const texture = this.envmap!.getGFXTexture()!;
        const device = legacyCC.director.root.device as Device;
        const sampler = device.getSampler(this.envmap!.getSamplerInfo());
        this._globalDSManager!.bindSampler(UNIFORM_ENVIRONMENT_BINDING, sampler);
        this._globalDSManager!.bindTexture(UNIFORM_ENVIRONMENT_BINDING, texture);

        if (this.diffusemap) {
            const textureDiffusemap = this.diffusemap.getGFXTexture()!;
            const samplerDiffusemap = device.getSampler(this.diffusemap.getSamplerInfo());
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
