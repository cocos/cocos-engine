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

 import { Device } from '../../gfx';
 import { RenderPipeline } from '../render-pipeline';
 import { PipelineSceneDataPool, PipelineSceneDataView } from '../../renderer/core/memory-pools';
 import { builtinResMgr } from '../../builtin/builtin-res-mgr';
 import { Material } from '../../assets';
 import { PipelineSceneData } from '../pipeline-scene-data';
 
 export class DeferredPipelineSceneData extends PipelineSceneData {
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
 
     protected declare _deferredLightingMat: Material;
     protected declare _deferredPostMat: Material;
 
     public onGlobalPipelineStateChanged () {
        this.updateDeferredPassInfo();
     }
 
     public initPipelinePassInfo () {
        this._deferredLightingMat = builtinResMgr.get<Material>('builtin-deferred-material');
        this._deferredPostMat = builtinResMgr.get<Material>('builtin-post-process-material');
        this.updateDeferredPassInfo();
     }
 
     public activate (device: Device, pipeline: RenderPipeline) {
         super.activate(device, pipeline);
         this.initPipelinePassInfo();
         return true;
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
 