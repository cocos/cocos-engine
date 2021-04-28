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

import { RenderingSubMesh } from '../../assets/rendering-sub-mesh';
import { RenderPriority } from '../../pipeline/define';
import { BatchingSchemes, IMacroPatch, Pass } from '../core/pass';
import { DSPool, IAPool, SubModelPool, SubModelView, SubModelHandle, NULL_HANDLE, ShaderHandle } from '../core/memory-pools';
import { DescriptorSet, DescriptorSetInfo, Device, InputAssembler } from '../../gfx';
import { legacyCC } from '../../global-exports';
import { ForwardPipeline } from '../../pipeline';
import { errorID } from '../../platform';

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
            DSPool.free(SubModelPool.get(this._handle, SubModelView.DESCRIPTOR_SET));
            _dsInfo.layout = passes[0].localSetLayout;
            const dsHandle = DSPool.alloc(this._device!, _dsInfo);
            SubModelPool.set(this._handle, SubModelView.DESCRIPTOR_SET, dsHandle);
            this._descriptorSet = DSPool.get(dsHandle);
        }
    }

    get passes (): Pass[] {
        return this._passes!;
    }

    set subMesh (subMesh) {
        this._subMesh = subMesh;
        this._inputAssembler!.destroy();
        this._inputAssembler!.initialize(subMesh.iaInfo);
        if (this._passes![0].batchingScheme === BatchingSchemes.VB_MERGING) { this._subMesh.genFlatBuffers(); }
        SubModelPool.set(this._handle, SubModelView.SUB_MESH, subMesh.handle);
    }

    get subMesh (): RenderingSubMesh {
        return this._subMesh!;
    }

    set priority (val) {
        this._priority = val;
        SubModelPool.set(this._handle, SubModelView.PRIORITY, val);
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

    public initialize (subMesh: RenderingSubMesh, passes: Pass[], patches: IMacroPatch[] | null = null): void {
        this._device = legacyCC.director.root.device as Device;

        this._subMesh = subMesh;
        this._patches = patches;
        this._passes = passes;

        this._handle = SubModelPool.alloc();
        this._flushPassInfo();
        if (passes[0].batchingScheme === BatchingSchemes.VB_MERGING) { this._subMesh.genFlatBuffers(); }

        _dsInfo.layout = passes[0].localSetLayout;
        const dsHandle = DSPool.alloc(this._device, _dsInfo);
        const iaHandle = IAPool.alloc(this._device, subMesh.iaInfo);
        SubModelPool.set(this._handle, SubModelView.PRIORITY, RenderPriority.DEFAULT);
        SubModelPool.set(this._handle, SubModelView.INPUT_ASSEMBLER, iaHandle);
        SubModelPool.set(this._handle, SubModelView.DESCRIPTOR_SET, dsHandle);
        SubModelPool.set(this._handle, SubModelView.SUB_MESH, subMesh.handle);

        this._inputAssembler = IAPool.get(iaHandle);
        this._descriptorSet = DSPool.get(dsHandle);
    }

    // This is a temporary solution
    // It should not be written in a fixed way, or modified by the user
    public initPlanarShadowShader () {
        const pipeline = legacyCC.director.root.pipeline as  ForwardPipeline;
        const shadowInfo = pipeline.pipelineSceneData.shadows;
        const shaderHandle = shadowInfo.getPlanarShader(this._patches);
        SubModelPool.set(this._handle, SubModelView.PLANAR_SHADER, shaderHandle);
    }

    // This is a temporary solution
    // It should not be written in a fixed way, or modified by the user
    public initPlanarShadowInstanceShader () {
        const pipeline = legacyCC.director.root.pipeline as  ForwardPipeline;
        const shadowInfo = pipeline.pipelineSceneData.shadows;
        const shaderHandle = shadowInfo.getPlanarInstanceShader(this._patches);
        SubModelPool.set(this._handle, SubModelView.PLANAR_INSTANCE_SHADER, shaderHandle);
    }

    public destroy (): void {
        DSPool.free(SubModelPool.get(this._handle, SubModelView.DESCRIPTOR_SET));
        IAPool.free(SubModelPool.get(this._handle, SubModelView.INPUT_ASSEMBLER));
        SubModelPool.free(this._handle);

        this._descriptorSet = null;
        this._inputAssembler = null;
        this._priority = RenderPriority.DEFAULT;
        this._handle = NULL_HANDLE;

        this._patches = null;
        this._subMesh = null;
        this._passes = null;
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

        SubModelPool.set(this._handle, SubModelView.PASS_COUNT, passes.length);
        let passOffset = SubModelView.PASS_0 as const;
        let shaderOffset = SubModelView.SHADER_0 as const;
        for (let i = 0; i < passes.length; i++, passOffset++, shaderOffset++) {
            SubModelPool.set(this._handle, passOffset, passes[i].handle);
            SubModelPool.set(this._handle, shaderOffset, passes[i].getShaderVariant(this._patches));
        }
    }
}
