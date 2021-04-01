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

import { Fog } from '../renderer/scene/fog';
import { Ambient } from '../renderer/scene/ambient';
import { Skybox } from '../renderer/scene/skybox';
import { Shadows } from '../renderer/scene/shadows';
import { IRenderObject, PipelineType } from './define';
import { Device, Framebuffer } from '../gfx';
import { RenderPipeline } from './render-pipeline';
import { Light } from '../renderer/scene/light';
import { PipelineSceneDataPool, PipelineSceneDataHandle, PipelineSceneDataView, PassHandle, ShaderHandle } from '../renderer/core/memory-pools';
import { builtinResMgr } from '../builtin/builtin-res-mgr';
import { Material } from '../assets';
import { legacyCC } from '../global-exports';

export class PipelineSceneData {
    public get handle () {
        return this._handle;
    }
    /**
     * @en Is open HDR.
     * @zh 是否开启 HDR。
     * @readonly
     */
    public get isHDR () {
        return PipelineSceneDataPool.get(this._handle, PipelineSceneDataView.IS_HDR) as unknown as boolean;
    }

    public set isHDR (val: boolean) {
        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.IS_HDR, val ? 1 : 0);
    }
    public get shadingScale () {
        return PipelineSceneDataPool.get(this._handle, PipelineSceneDataView.SHADING_SCALE);
    }

    public set shadingScale (val: number) {
        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.SHADING_SCALE, val);
    }
    public get fpScale () {
        return PipelineSceneDataPool.get(this._handle, PipelineSceneDataView.FP_SCALE);
    }
    public set fpScale (val: number) {
        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.FP_SCALE, val);
    }

    public get deferredLightingMat () {
        return this._deferredLightingMat;
    }

    public set deferredLightingMat (mat: Material) {
        if (this._deferredLightingMat === mat) return;
        this._deferredLightingMat = (mat && mat.effectAsset) ? mat : builtinResMgr.get<Material>('builtin-deferred-material');
        this.updateDeferredPassInfo();
    }

    public get deferredPostMat () {
        return this._deferredPostMat;
    }

    public set deferredPostMat (mat: Material) {
        if (this._deferredPostMat === mat) return;
        this._deferredPostMat = (mat && mat.effectAsset) ? mat : builtinResMgr.get<Material>('builtin-post-process-material');
        this.updateDeferredPassInfo();
    }

    public fog: Fog = new Fog();
    public ambient: Ambient = new Ambient();
    public skybox: Skybox = new Skybox();
    public shadows: Shadows = new Shadows();
    /**
     * @en The list for render objects, only available after the scene culling of the current frame.
     * @zh 渲染对象数组，仅在当前帧的场景剔除完成后有效。
     */
    public renderObjects: IRenderObject[] = [];
    public shadowObjects: IRenderObject[] = [];
    public shadowFrameBufferMap: Map<Light, Framebuffer> = new Map();
    protected declare _device: Device;
    protected declare _pipeline: RenderPipeline;
    protected declare _handle: PipelineSceneDataHandle;
    protected declare _deferredLightingMat: Material;
    protected declare _deferredPostMat: Material;

    constructor () {
        this._handle = PipelineSceneDataPool.alloc();
        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.AMBIENT, this.ambient.handle);
        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.SKYBOX, this.skybox.handle);
        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.FOG, this.fog.handle);
        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.SHADOW, this.shadows.handle);
        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.IS_HDR, 0);
        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.SHADING_SCALE, 1.0);
        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.FP_SCALE, 1.0 / 1024.0);
    }

    public onGlobalPipelineStateChanged () {
        if (legacyCC.game.pipelineType === PipelineType.DEFERRED) {
            this.updateDeferredPassInfo();
        }
    }

    public initPipelinePassInfo () {
        if (legacyCC.game.pipelineType === PipelineType.DEFERRED) {
            this._deferredLightingMat = builtinResMgr.get<Material>('builtin-deferred-material');
            this._deferredPostMat = builtinResMgr.get<Material>('builtin-post-process-material');
            this.updateDeferredPassInfo();
        }
    }

    public activate (device: Device, pipeline: RenderPipeline) {
        this._device = device;
        this._pipeline = pipeline;
        this.initPipelinePassInfo();
        return true;
    }

    public destroy () {
        this.ambient.destroy();
        this.skybox.destroy();
        this.fog.destroy();
        this.shadows.destroy();
        if (this._handle) {
            PipelineSceneDataPool.free(this._handle);
        }
    }

    private updateDeferredPassInfo () {
        this.updateDeferredLightPass();
        this.updateDeferredPostPass();
    }

    private updateDeferredLightPass () {
        if (!this._deferredLightingMat) return;

        const passLit = this._deferredLightingMat.passes[0];
        passLit.beginChangeStatesSilently();
        passLit.tryCompile();
        passLit.endChangeStatesSilently();

        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.DEFERRED_LIGHT_PASS, passLit.handle);
        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.DEFERRED_LIGHT_PASS_SHADER, passLit.getShaderVariant());
    }

    private updateDeferredPostPass () {
        if (!this.deferredPostMat) return;

        const passPost = this.deferredPostMat.passes[0];
        passPost.beginChangeStatesSilently();
        passPost.tryCompile();
        passPost.endChangeStatesSilently();

        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.DEFERRED_POST_PASS, passPost.handle);
        PipelineSceneDataPool.set(this._handle, PipelineSceneDataView.DEFERRED_POST_PASS_SHADER, passPost.getShaderVariant());
    }
}
