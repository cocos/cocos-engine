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
import { RenderingSubMesh } from '../../assets/rendering-sub-mesh';
import { RenderPriority } from '../../pipeline/define';
import { BatchingSchemes, IMacroPatch, Pass } from '../core/pass';
import { DSPool, IAPool, SubModelPool, SubModelView, SubModelHandle, NULL_HANDLE, ShaderHandle, ShaderPool } from '../core/memory-pools';
import { DescriptorSet, DescriptorSetInfo, Device, InputAssembler, InputAssemblerInfo, Shader } from '../../gfx';
import { legacyCC } from '../../global-exports';
import { ForwardPipeline } from '../../pipeline';
import { errorID } from '../../platform';
import { Shadows } from './shadows';
import { NativePass, NativeSubModel } from './native-scene';

const _dsInfo = new DescriptorSetInfo(null!);
const MAX_PASS_COUNT = 8;
export class SubModel {
     protected _device: Device | null = null;
     protected _passes: Pass[] | null = null;
     protected _subMesh: RenderingSubMesh | null = null;
     protected _patches: IMacroPatch[] | null = null;
     protected _handle: SubModelHandle = NULL_HANDLE;
     protected _priority: RenderPriority = RenderPriority.DEFAULT;
     protected _inputAssembler: InputAssembler | null = null;
     protected _descriptorSet: DescriptorSet | null = null;
     protected _passCount = 0;
     protected declare _nativeObj: NativeSubModel | null;

     private _destroyDescriptorSet () {
        this._descriptorSet!.destroy();
        if (JSB) {
            DSPool.free(SubModelPool.get(this._handle, SubModelView.DESCRIPTOR_SET));
            this.native.setDescriptorSet(null);
        }
        this._descriptorSet = null;
     }

     private _destroyInputAssembler () {
        this._inputAssembler!.destroy();
        if (JSB) {
            IAPool.free(SubModelPool.get(this._handle, SubModelView.INPUT_ASSEMBLER));
            this.native.setInputAssembler(null);
        }
        this._inputAssembler = null;
     }

     private _createDescriptorSet (descInfo: DescriptorSetInfo) {
         const dsHandle = DSPool.alloc(this._device!, descInfo);
         SubModelPool.set(this._handle, SubModelView.DESCRIPTOR_SET, dsHandle);
         this._descriptorSet = DSPool.get(dsHandle);
         if (JSB) {
             this.native.setDescriptorSet(this._descriptorSet);
         }
     }

     private _setPassCount (val: number) {
         this._passCount = val;
         if (JSB) {
             SubModelPool.set(this._handle, SubModelView.PASS_COUNT, val);
         }
     }

     set passes (passes) {
         const passLengh = passes.length;
         if (passLengh > MAX_PASS_COUNT) {
             errorID(12004, MAX_PASS_COUNT);
             return;
         }
         this._passes = passes;
         this._flushPassInfo();

         // DS layout might change too
         if (this._descriptorSet) {
             this._destroyDescriptorSet();
             _dsInfo.layout = passes[0].localSetLayout;
             this._createDescriptorSet(_dsInfo);
         }
     }

     get passes (): Pass[] {
         return this._passes!;
     }

     set subMesh (subMesh) {
         this._setSubMesh(subMesh);
         this._inputAssembler!.destroy();
         this._inputAssembler!.initialize(subMesh.iaInfo);
         if (this._passes![0].batchingScheme === BatchingSchemes.VB_MERGING) { this.subMesh.genFlatBuffers(); }
     }

     get subMesh (): RenderingSubMesh {
         return this._subMesh!;
     }

     set priority (val) {
         this._priority = val;
         if (JSB) {
             SubModelPool.set(this._handle, SubModelView.PRIORITY, val);
         }
     }

     get priority (): RenderPriority {
         return this._priority;
     }

     get handle (): SubModelHandle {
         return this._handle;
     }

     get inputAssembler (): InputAssembler {
         return this._inputAssembler!;
     }

     get descriptorSet (): DescriptorSet {
         return this._descriptorSet!;
     }

     get patches (): IMacroPatch[] | null {
         return this._patches;
     }

     // This is a temporary solution
     // It should not be written in a fixed way, or modified by the user
     get planarShaderHandle (): ShaderHandle {
         return SubModelPool.get(this._handle, SubModelView.PLANAR_SHADER);
     }

     // This is a temporary solution
     // It should not be written in a fixed way, or modified by the user
     get planarInstanceShaderHandle (): ShaderHandle {
         return SubModelPool.get(this._handle, SubModelView.PLANAR_INSTANCE_SHADER);
     }

     private _setInputAssembler (iaInfo: InputAssemblerInfo) {
         const iaHandle = IAPool.alloc(this._device!, iaInfo);
         SubModelPool.set(this._handle, SubModelView.INPUT_ASSEMBLER, iaHandle);
         this._inputAssembler = IAPool.get(iaHandle);
         if (JSB) {
             this.native.setInputAssembler(this._inputAssembler);
         }
     }

     private _setSubMesh (subMesh: RenderingSubMesh) {
         this._subMesh = subMesh;
         if (JSB) {
             SubModelPool.set(this._handle, SubModelView.SUB_MESH, subMesh.handle);
             this.native.setRenderingSubMesh(subMesh.flatBuffers);
         }
     }

     get native (): NativeSubModel {
         return this._nativeObj!;
     }

     private _init () {
         this._handle = SubModelPool.alloc();
         if (JSB) {
             this._nativeObj = new NativeSubModel();
         }
     }

     public initialize (subMesh: RenderingSubMesh, passes: Pass[], patches: IMacroPatch[] | null = null): void {
         this._device = legacyCC.director.root.device as Device;
         _dsInfo.layout = passes[0].localSetLayout;
         this._init();
         this._setInputAssembler(subMesh.iaInfo);
         this._createDescriptorSet(_dsInfo);
         this._setSubMesh(subMesh);
         this._patches = patches;
         this._passes = passes;

         this._flushPassInfo();
         if (passes[0].batchingScheme === BatchingSchemes.VB_MERGING) { this.subMesh.genFlatBuffers(); }

         this.priority = RenderPriority.DEFAULT;
     }

     private _initNativePlanarShadowShader (shadowInfo: Shadows) {
         const shaderHandle = shadowInfo.getPlanarShader(this._patches);
         SubModelPool.set(this._handle, SubModelView.PLANAR_SHADER, shaderHandle);
         if (JSB) {
             const planarShader = ShaderPool.get(shaderHandle);
             this.native.setPlanarShader(planarShader);
         }
     }

     // This is a temporary solution
     // It should not be written in a fixed way, or modified by the user
     public initPlanarShadowShader () {
         const pipeline = legacyCC.director.root.pipeline as  ForwardPipeline;
         const shadowInfo = pipeline.pipelineSceneData.shadows;
         this._initNativePlanarShadowShader(shadowInfo);
     }

     private _initNativePlanarShadowInstanceShader (shadowInfo: Shadows) {
         const shaderHandle = shadowInfo.getPlanarInstanceShader(this._patches);
         SubModelPool.set(this._handle, SubModelView.PLANAR_INSTANCE_SHADER, shaderHandle);
         if (JSB) {
             const planarInstanceShader = ShaderPool.get(shaderHandle);
             this.native.setPlanarInstanceShader(planarInstanceShader);
         }
     }

     // This is a temporary solution
     // It should not be written in a fixed way, or modified by the user
     public initPlanarShadowInstanceShader () {
         const pipeline = legacyCC.director.root.pipeline as  ForwardPipeline;
         const shadowInfo = pipeline.pipelineSceneData.shadows;
         this._initNativePlanarShadowInstanceShader(shadowInfo);
     }

     private _destroy () {
         if (JSB) {
             SubModelPool.free(this._handle);
             this._nativeObj = null;
         }
         this._handle = NULL_HANDLE;
     }

     public destroy (): void {
         this._destroyDescriptorSet();
         this._destroyInputAssembler();
         this.priority = RenderPriority.DEFAULT;

         this._patches = null;
         this._subMesh = null;
         this._passes = null;

         this._destroy();
     }

     public update (): void {
         for (let i = 0; i < this._passes!.length; ++i) {
             const pass = this._passes![i];
             pass.update();
         }
         this._descriptorSet!.update();
     }

     public onPipelineStateChanged (): void {
         const passes = this._passes;
         if (!passes) { return; }

         for (let i = 0; i < passes.length; i++) {
             const pass = passes[i];
             pass.beginChangeStatesSilently();
             pass.tryCompile(); // force update shaders
             pass.endChangeStatesSilently();
         }

         this._flushPassInfo();
     }

     public onMacroPatchesStateChanged (patches: IMacroPatch[] | null): void {
         this._patches = patches;

         const passes = this._passes;
         if (!passes) { return; }

         for (let i = 0; i < passes.length; i++) {
             const pass = passes[i];
             pass.beginChangeStatesSilently();
             pass.tryCompile(); // force update shaders
             pass.endChangeStatesSilently();
         }

         this._flushPassInfo();
     }

     protected _flushPassInfo (): void {
         const passes = this._passes;
         if (!passes) { return; }

         this._setPassCount(passes.length);
         let passOffset = SubModelView.PASS_0 as const;
         let shaderOffset = SubModelView.SHADER_0 as const;
         const nativeShaders: Shader[] = [];
         for (let i = 0; i < this._passCount; i++, passOffset++, shaderOffset++) {
             SubModelPool.set(this._handle, passOffset, passes[i].handle);
             const shaderHandle = passes[i].getShaderVariant(this._patches);
             SubModelPool.set(this._handle, shaderOffset, shaderHandle);
             if (JSB) {
                 const shader = ShaderPool.get(shaderHandle);
                 nativeShaders.push(shader);
             }
         }

         if (JSB) {
             const passesNative = passes.map((_pass: Pass): NativePass => _pass.native);
             this.native.setPasses(passesNative);
             this.native.setShaders(nativeShaders);
         }
     }
}
