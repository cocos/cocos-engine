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
import { RenderPriority, UNIFORM_REFLECTION_TEXTURE_BINDING, UNIFORM_REFLECTION_STORAGE_BINDING } from '../../pipeline/define';
import { BatchingSchemes, IMacroPatch, Pass } from '../core/pass';
import { DescriptorSet, DescriptorSetInfo, Device, InputAssembler, Texture, TextureType, TextureUsageBit, TextureInfo,
    Format, Sampler, Filter, Address, Shader, SamplerInfo } from '../../gfx';
import { legacyCC } from '../../global-exports';
import { ForwardPipeline } from '../../pipeline';
import { errorID } from '../../platform/debug';
import { getPhaseID } from '../../pipeline/pass-phase';
import { Root } from '../../root';

const _dsInfo = new DescriptorSetInfo(null!);
const MAX_PASS_COUNT = 8;
export class SubModel {
    protected _device: Device | null = null;
    protected _passes: Pass[] | null = null;
    protected _shaders: Shader[] | null = null;
    protected _subMesh: RenderingSubMesh | null = null;
    protected _patches: IMacroPatch[] | null = null;
    protected _priority: RenderPriority = RenderPriority.DEFAULT;
    protected _inputAssembler: InputAssembler | null = null;
    protected _descriptorSet: DescriptorSet | null = null;
    protected _worldBoundDescriptorSet: DescriptorSet | null = null;
    protected _planarInstanceShader: Shader | null = null;
    protected _planarShader: Shader | null = null;
    protected _reflectionTex: Texture | null = null;
    protected _reflectionSampler: Sampler | null = null;

    set passes (passes) {
        const passLengh = passes.length;
        if (passLengh > MAX_PASS_COUNT) {
            errorID(12004, MAX_PASS_COUNT);
            return;
        }
        this._passes = passes;
        this._flushPassInfo();
        if (this._passes[0].batchingScheme === BatchingSchemes.VB_MERGING) {
            this.subMesh.genFlatBuffers();
        }

        // DS layout might change too
        if (this._descriptorSet) {
            this._descriptorSet.destroy();
            _dsInfo.layout = passes[0].localSetLayout;
            this._descriptorSet = this._device!.createDescriptorSet(_dsInfo);
        }
    }

    get passes (): Pass[] {
        return this._passes!;
    }

    get shaders (): Shader[] {
        return this._shaders!;
    }

    set subMesh (subMesh) {
        this._inputAssembler!.destroy();
        this._inputAssembler!.initialize(subMesh.iaInfo);
        if (this._passes![0].batchingScheme === BatchingSchemes.VB_MERGING) { this.subMesh.genFlatBuffers(); }
        this._subMesh = subMesh;
    }

    get subMesh (): RenderingSubMesh {
        return this._subMesh!;
    }

    set priority (val) {
        this._priority = val;
    }

    get priority (): RenderPriority {
        return this._priority;
    }

    get inputAssembler (): InputAssembler {
        return this._inputAssembler!;
    }

    get descriptorSet (): DescriptorSet {
        return this._descriptorSet!;
    }

    get worldBoundDescriptorSet (): DescriptorSet {
        return this._worldBoundDescriptorSet!;
    }

    get patches (): IMacroPatch[] | null {
        return this._patches;
    }

    get planarInstanceShader (): Shader | null {
        return this._planarInstanceShader;
    }

    get planarShader (): Shader | null {
        return this._planarShader;
    }

    public initialize (subMesh: RenderingSubMesh, passes: Pass[], patches: IMacroPatch[] | null = null): void {
        const root = legacyCC.director.root as Root;
        this._device = root.device;
        _dsInfo.layout = passes[0].localSetLayout;

        this._inputAssembler = this._device.createInputAssembler(subMesh.iaInfo);
        this._descriptorSet = this._device.createDescriptorSet(_dsInfo);

        const pipeline = legacyCC.director.root.pipeline;
        const occlusionPass = pipeline.pipelineSceneData.getOcclusionQueryPass();
        const occlusionDSInfo = new DescriptorSetInfo(null!);
        occlusionDSInfo.layout = occlusionPass.localSetLayout;
        this._worldBoundDescriptorSet = this._device.createDescriptorSet(occlusionDSInfo);
        this._subMesh = subMesh;
        this._patches = patches;
        this._passes = passes;

        this._flushPassInfo();
        if (passes[0].batchingScheme === BatchingSchemes.VB_MERGING) {
            this.subMesh.genFlatBuffers();
        }

        this.priority = RenderPriority.DEFAULT;

        // initialize resources for reflection material
        if (passes[0].phase === getPhaseID('reflection')) {
            let texWidth = root.mainWindow!.width;
            let texHeight = root.mainWindow!.height;
            const minSize = 512;

            if (texHeight < texWidth) {
                texWidth = minSize * texWidth / texHeight;
                texHeight = minSize;
            } else {
                texWidth = minSize;
                texHeight = minSize * texHeight / texWidth;
            }

            this._reflectionTex = this._device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.STORAGE | TextureUsageBit.TRANSFER_SRC | TextureUsageBit.SAMPLED,
                Format.RGBA8,
                texWidth,
                texHeight,
            ));

            this.descriptorSet.bindTexture(UNIFORM_REFLECTION_TEXTURE_BINDING, this._reflectionTex);

            this._reflectionSampler = this._device.getSampler(new SamplerInfo(
                Filter.LINEAR,
                Filter.LINEAR,
                Filter.NONE,
                Address.CLAMP,
                Address.CLAMP,
                Address.CLAMP,
            ));
            this.descriptorSet.bindSampler(UNIFORM_REFLECTION_TEXTURE_BINDING, this._reflectionSampler);
            this.descriptorSet.bindTexture(UNIFORM_REFLECTION_STORAGE_BINDING, this._reflectionTex);
        }
    }

    // This is a temporary solution
    // It should not be written in a fixed way, or modified by the user
    public initPlanarShadowShader () {
        const pipeline = legacyCC.director.root.pipeline as  ForwardPipeline;
        const shadowInfo = pipeline.pipelineSceneData.shadows;
        this._planarShader = shadowInfo.getPlanarShader(this._patches);
    }

    // This is a temporary solution
    // It should not be written in a fixed way, or modified by the user
    public initPlanarShadowInstanceShader () {
        const pipeline = legacyCC.director.root.pipeline as  ForwardPipeline;
        const shadowInfo = pipeline.pipelineSceneData.shadows;
        this._planarInstanceShader = shadowInfo.getPlanarInstanceShader(this._patches);
    }

    public destroy (): void {
        this._descriptorSet!.destroy();
        this._descriptorSet = null;

        this._inputAssembler!.destroy();
        this._inputAssembler = null;

        this._worldBoundDescriptorSet!.destroy();
        this._worldBoundDescriptorSet = null;

        this.priority = RenderPriority.DEFAULT;

        this._patches = null;
        this._subMesh = null;

        this._passes = null;
        this._shaders = null;

        if (this._reflectionTex) this._reflectionTex.destroy();
        this._reflectionTex = null;
        this._reflectionSampler = null;
    }

    public update (): void {
        for (let i = 0; i < this._passes!.length; ++i) {
            const pass = this._passes![i];
            pass.update();
        }
        this._descriptorSet!.update();
        this._worldBoundDescriptorSet!.update();
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
        if (!this._shaders) { this._shaders = []; }

        this._shaders.length = passes.length;
        for (let i = 0, len = passes.length; i < len; i++) {
            this._shaders[i] = passes[i].getShaderVariant(this.patches)!;
        }
    }
}
