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
import { UNIFORM_ENVIRONMENT_BINDING } from '../../pipeline/define';
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
     * @en Whether use environment lighting
     * @zh 是否启用环境光照？
     */
    get useIBL (): boolean {
        return this._useIBL;
    }

    set useIBL (val: boolean) {
        this._setUseIBL(val);
        this._updatePipeline();
    }

    /**
     * @en Whether enable RGBE data support in skybox shader
     * @zh 是否需要开启 shader 内的 RGBE 数据支持？
     */
    get isRGBE (): boolean {
        return this._isRGBE;
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
        this._setIsRGBE(val);
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
            (legacyCC.director.root as Root).pipeline.pipelineSceneData.ambient.albedoArray[3] = this._envmap.mipmapLevel;
            this._updateGlobalBinding();
        }
    }

    protected _envmap: TextureCube | null = null;
    protected _globalDSManager: GlobalDSManager | null = null;
    protected _model: Model | null = null;
    protected _default: TextureCube | null = null;
    protected _enabled = false;
    protected _useIBL = false;
    protected _isRGBE = false;
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

    private _setIsRGBE (val) {
        this._isRGBE = val;
        if (JSB) {
            this._nativeObj!.isRGBE = val;
        }
    }

    public initialize (skyboxInfo: SkyboxInfo) {
        this._setEnabled(skyboxInfo.enabled);
        this._setUseIBL(skyboxInfo.useIBL);
        this._setIsRGBE(skyboxInfo.isRGBE);
        this._envmap = skyboxInfo.envmap;
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
        if (!this._envmap) {
            this._envmap = this._default;
        }
        ambient.albedoArray[3] = this._envmap.mipmapLevel;

        if (!skybox_material) {
            const mat = new Material();
            mat.initialize({ effectName: 'skybox', defines: { USE_RGBE_CUBEMAP: this.isRGBE } });
            skybox_material = new MaterialInstance({ parent: mat });
        } else {
            skybox_material.recompileShaders({ USE_RGBE_CUBEMAP: this.isRGBE });
        }

        if (this.enabled) {
            if (!skybox_mesh) { skybox_mesh = legacyCC.utils.createMesh(legacyCC.primitives.box({ width: 2, height: 2, length: 2 })) as Mesh; }
            this._model.initSubModel(0, skybox_mesh.renderingSubMeshes[0], skybox_material);
        }
        this._updateGlobalBinding();
        this._updatePipeline();
    }

    protected _updatePipeline () {
        const value = this.useIBL ? (this.isRGBE ? 2 : 1) : 0;
        const root = legacyCC.director.root as Root;
        const pipeline = root.pipeline;
        const current = pipeline.macros.CC_USE_IBL;
        if (current === value) { return; }
        pipeline.macros.CC_USE_IBL = value;
        root.onGlobalPipelineStateChanged();
    }

    protected _updateGlobalBinding () {
        const texture = this.envmap!.getGFXTexture()!;
        const sampler = samplerLib.getSampler(legacyCC.director._device, this.envmap!.getSamplerHash());
        this._globalDSManager!.bindSampler(UNIFORM_ENVIRONMENT_BINDING, sampler);
        this._globalDSManager!.bindTexture(UNIFORM_ENVIRONMENT_BINDING, texture);
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
