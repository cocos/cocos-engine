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
import { Enum } from '../../value-types';

let skybox_mesh: Mesh | null = null;
let skybox_material: Material | null = null;

export const EnvironmentLightingType = Enum({
    /**
     * @zh
     * 半球漫反射
     * @en
     * hemisphere diffuse reflection
     * @readonly
     */
    Hemisphere_Diffuse: 0,
    /**
     * @zh
     * 半球漫反射和环境反射
     * @en
     * hemisphere diffuse reflection and Environment reflection
     * @readonly
     */
    AutoGen_Hemisphere_Diffuse_With_Reflection: 1,
    /**
     * @zh
     * 漫反射卷积图和环境反射
     * @en
     * diffuse convolution map and environment reflection
     * @readonly
     */
    DiffuseMap_With_Reflection: 2,
});

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
     * @zh 是否启用HDR？
     */
    get useHDR (): boolean {
        return this._useHDR;
    }

    set useHDR (val: boolean) {
        this._setUseHDR(val);
        this.setEnvMaps(this._envmapHDR, this._envmapLDR);
    }

    /**
     * @en Whether use IBL
     * @zh 是否启用IBL？
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
    get useDiffuseMap (): boolean {
        return this._useDiffuseMap;
    }

    set useDiffuseMap (val: boolean) {
        this._useDiffuseMap = val;
        this.setDiffuseMaps(null, null);
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
        const root = legacyCC.director.root as Root;
        const isHDR = root.pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this.setEnvMaps(val, this._envmapLDR);
        } else {
            this.setEnvMaps(this._envmapHDR, val);
        }
    }

    /**
     * @en The texture cube used diffuse convolution map
     * @zh 使用的漫反射卷积图
     */
    get diffuseMap (): TextureCube | null {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._diffuseMapHDR;
        } else {
            return this._diffuseMapLDR;
        }
    }
    set diffuseMap (val: TextureCube | null) {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this.setDiffuseMaps(val, this._diffuseMapLDR);
        } else {
            this.setDiffuseMaps(this._diffuseMapHDR, val);
        }
    }

    protected _envmapLDR: TextureCube | null = null;
    protected _envmapHDR: TextureCube | null = null;
    protected _diffuseMapLDR: TextureCube | null = null;
    protected _diffuseMapHDR: TextureCube | null = null;
    protected _globalDSManager: GlobalDSManager | null = null;
    protected _model: Model | null = null;
    protected _default: TextureCube | null = null;
    protected _enabled = false;
    protected _useIBL = false;
    protected _useHDR = true;
    protected _useDiffuseMap = false;
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

    private _setUseDiffuseMap (val) {
        this._useDiffuseMap = val;
        if (JSB) {
            this._nativeObj!.useDiffuseMap = val;
        }
    }

    public initialize (skyboxInfo: SkyboxInfo) {
        this._setEnabled(skyboxInfo.enabled);
        this._setUseIBL(skyboxInfo.useIBL);
        this._setUseDiffuseMap(skyboxInfo.applyDiffuseMap);
        this._setUseHDR(skyboxInfo.useHDR);
    }

    public setEnvMaps (envmapHDR: TextureCube | null, envmapLDR: TextureCube | null) {
        this._envmapHDR = envmapHDR;
        this._envmapLDR = envmapLDR;

        const root = legacyCC.director.root as Root;
        const isHDR = root.pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            if (envmapHDR) {
                root.pipeline.pipelineSceneData.ambient.mipmapCount = envmapHDR.mipmapLevel;
            }
        } else if (envmapLDR) {
            root.pipeline.pipelineSceneData.ambient.mipmapCount = envmapLDR.mipmapLevel;
        }

        this._updateGlobalBinding();
        this._updatePipeline();
    }

    public setDiffuseMaps (diffuseMapHDR: TextureCube | null, diffuseMapLDR: TextureCube | null) {
        this._diffuseMapHDR = diffuseMapHDR;
        this._diffuseMapLDR = diffuseMapLDR;
        this._updateGlobalBinding();
        this._updatePipeline();
    }

    public activate () {
        const pipeline = legacyCC.director.root.pipeline;
        this._globalDSManager = pipeline.globalDSManager;
        this._default = builtinResMgr.get<TextureCube>('default-cube-texture');

        if (!this._model) {
            this._model = legacyCC.director.root.createModel(legacyCC.renderer.scene.Model) as Model;
            // @ts-expect-error private member access
            this._model._initLocalDescriptors = () => {};
            // @ts-expect-error private member access
            this._model._initWorldBoundDescriptors = () => {};
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
            if (!skybox_mesh) {
                skybox_mesh = legacyCC.utils.createMesh(legacyCC.primitives.box({ width: 2, height: 2, length: 2 })) as Mesh;
            }
            this._model.initSubModel(0, skybox_mesh.renderingSubMeshes[0], skybox_material);
        }

        if (!this.envmap) {
            this.envmap = this._default;
        }

        if (!this.diffuseMap) {
            this.diffuseMap = this._default;
        }

        this._updateGlobalBinding();
        this._updatePipeline();
    }

    protected _updatePipeline () {
        if (JSB) {
            this._nativeObj!.isRGBE = this.isRGBE;
        }

        const root = legacyCC.director.root as Root;
        const pipeline = root.pipeline;

        const useIBLValue = this.useIBL ? (this.isRGBE ? 2 : 1) : 0;
        const useDiffuseMapValue = (this.useIBL && this.useDiffuseMap && this.diffuseMap) ? (this.isRGBE ? 2 : 1) : 0;
        const useHDRValue = this.useHDR;

        if (pipeline.macros.CC_USE_IBL !== useIBLValue
            || pipeline.macros.CC_USE_DIFFUSEMAP !== useDiffuseMapValue
            || pipeline.macros.CC_USE_HDR !== useHDRValue) {
            pipeline.macros.CC_USE_IBL = useIBLValue;
            pipeline.macros.CC_USE_DIFFUSEMAP = useDiffuseMapValue;
            pipeline.macros.CC_USE_HDR = useHDRValue;

            root.onGlobalPipelineStateChanged();
        }

        if (this.enabled && skybox_material) {
            skybox_material.recompileShaders({ USE_RGBE_CUBEMAP: this.isRGBE });
        }

        if (this._model) {
            this._model.setSubModelMaterial(0, skybox_material!);
        }
    }

    protected _updateGlobalBinding () {
        if (this._globalDSManager) {
            const device = legacyCC.director.root.device as Device;

            const envmap = this.envmap ? this.envmap : this._default;
            if (envmap) {
                const texture = envmap.getGFXTexture()!;
                const sampler = device.getSampler(envmap.getSamplerInfo());
                this._globalDSManager.bindSampler(UNIFORM_ENVIRONMENT_BINDING, sampler);
                this._globalDSManager.bindTexture(UNIFORM_ENVIRONMENT_BINDING, texture);
            }

            const diffuseMap = this.diffuseMap ? this.diffuseMap : this._default;
            if (diffuseMap) {
                const texture = diffuseMap.getGFXTexture()!;
                const sampler = device.getSampler(diffuseMap.getSamplerInfo());
                this._globalDSManager.bindSampler(UNIFORM_DIFFUSEMAP_BINDING, sampler);
                this._globalDSManager.bindTexture(UNIFORM_DIFFUSEMAP_BINDING, texture);
            }

            this._globalDSManager.update();
        }
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
