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
import { RenderPriority, UNIFORM_REFLECTION_TEXTURE_BINDING, UNIFORM_REFLECTION_STORAGE_BINDING } from '../../pipeline/define';
import { BatchingSchemes, IMacroPatch, Pass } from '../core/pass';
import { DescriptorSet, DescriptorSetInfo, Device, InputAssembler, InputAssemblerInfo, Texture, TextureType, TextureUsageBit, TextureInfo,
    Format, Sampler, Filter, Address, Shader, SamplerInfo } from '../../gfx';
import { legacyCC } from '../../global-exports';
import { ForwardPipeline } from '../../pipeline';
import { errorID } from '../../platform/debug';
import { Shadows } from './shadows';
import { NativePass, NativeSubModel } from '../native-scene';
import { getPhaseID } from '../../pipeline/pass-phase';
import { Root } from '../../root';

const _dsInfo = new DescriptorSetInfo(null!);
const MAX_PASS_COUNT = 8;

/**
 * @en A sub part of the model, it describes how to render a specific sub mesh.
 * It contains geometry information in [[RenderingSubMesh]] and all sort of rendering configuration like shaders, macro patches, passes etc.
 * @zh 组成模型对象的子模型，它用来描述如何渲染模型的一个子网格。
 * 它包含 [[RenderingSubMesh]] 代表的几何网格信息和所有渲染需要的数据，比如着色器程序，着色器宏定义，渲染 pass，等。
 */
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
    protected declare _nativeObj: NativeSubModel | null;

    private _destroyDescriptorSet () {
        this._descriptorSet!.destroy();
        if (JSB) {
            this._nativeObj!.setDescriptorSet(null);
        }
        this._descriptorSet = null;
    }

    private _destroyWorldBoundDescriptorSet () {
        this._worldBoundDescriptorSet!.destroy();
        if (JSB) {
            this._nativeObj!.setWorldBoundDescriptorSet(null);
        }
        this._worldBoundDescriptorSet = null;
    }

    private _destroyInputAssembler () {
        this._inputAssembler!.destroy();
        if (JSB) {
            this._nativeObj!.setInputAssembler(null);
        }
        this._inputAssembler = null;
    }

    private _createDescriptorSet (descInfo: DescriptorSetInfo) {
        this._descriptorSet = this._device!.createDescriptorSet(descInfo);
        if (JSB) {
            this._nativeObj!.setDescriptorSet(this._descriptorSet);
        }
    }

    private _createWorldBoundDescriptorSet (descInfo: DescriptorSetInfo) {
        this._worldBoundDescriptorSet = this._device!.createDescriptorSet(descInfo);
        if (JSB) {
            this._nativeObj!.setWorldBoundDescriptorSet(this._worldBoundDescriptorSet);
        }
    }

    /**
     * @en Render passes for the sub-model
     * @zh 子模型的渲染 pass
     */
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
            this._setSubMesh(this.subMesh);
        }

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

    /**
     * @en Shaders for the sub-model, each shader corresponds to one of the [[passes]]
     * @zh 子模型的着色器程序列表，每个着色器程序对应其中一个渲染 [[passes]]
     */
    get shaders (): Shader[] {
        return this._shaders!;
    }

    /**
     * @en The rendering sub mesh for the sub-model, each sub-model can only have one sub mesh.
     * @zh 用于渲染的子网格对象，每个子模型只能包含一个子网格。
     */
    set subMesh (subMesh) {
        this._inputAssembler!.destroy();
        this._inputAssembler!.initialize(subMesh.iaInfo);
        if (this._passes![0].batchingScheme === BatchingSchemes.VB_MERGING) { this.subMesh.genFlatBuffers(); }
        this._setSubMesh(subMesh);
    }

    get subMesh (): RenderingSubMesh {
        return this._subMesh!;
    }

    /**
     * @en The rendering priority of the sub-model
     * @zh 子模型的渲染优先级
     */
    set priority (val) {
        this._priority = val;
        if (JSB) {
            this._nativeObj!.setPriority(val);
        }
    }

    get priority (): RenderPriority {
        return this._priority;
    }

    /**
     * @en The low level input assembler which contains geometry data
     * @zh 底层渲染用的输入汇集器，包含几何信息
     */
    get inputAssembler (): InputAssembler {
        return this._inputAssembler!;
    }

    /**
     * @en The descriptor set used for sub-model rendering
     * @zh 底层渲染子模型用的描述符集组
     */
    get descriptorSet (): DescriptorSet {
        return this._descriptorSet!;
    }

    /**
     * @en The descriptor set for world bound
     * @zh 用于存储世界包围盒的描述符集组
     */
    get worldBoundDescriptorSet (): DescriptorSet {
        return this._worldBoundDescriptorSet!;
    }

    /**
     * @en The macro patches for the shaders
     * @zh 着色器程序所用的宏定义组合
     */
    get patches (): IMacroPatch[] | null {
        return this._patches;
    }

    /**
     * @en The shader for rendering the planar shadow, instancing draw version.
     * @zh 用于渲染平面阴影的着色器，适用于实例化渲染（instancing draw）
     */
    get planarInstanceShader (): Shader | null {
        return this._planarInstanceShader;
    }

    /**
     * @en The shader for rendering the planar shadow.
     * @zh 用于渲染平面阴影的着色器。
     */
    get planarShader (): Shader | null {
        return this._planarShader;
    }

    private _setInputAssembler (iaInfo: InputAssemblerInfo) {
        this._inputAssembler = this._device!.createInputAssembler(iaInfo);
        if (JSB) {
            this._nativeObj!.setInputAssembler(this._inputAssembler);
        }
    }

    private _setSubMesh (subMesh: RenderingSubMesh) {
        this._subMesh = subMesh;
        if (JSB) {
            this._nativeObj!.setSubMeshBuffers(subMesh.flatBuffers);
        }
    }

    /**
     * @internal
     */
    get native (): NativeSubModel {
        return this._nativeObj!;
    }

    private _init () {
        if (JSB) {
            this._nativeObj = new NativeSubModel();
        }
    }

    public initialize (subMesh: RenderingSubMesh, passes: Pass[], patches: IMacroPatch[] | null = null): void {
        const root = legacyCC.director.root as Root;
        this._device = root.device;
        _dsInfo.layout = passes[0].localSetLayout;
        this._init();
        this._setInputAssembler(subMesh.iaInfo);
        this._createDescriptorSet(_dsInfo);

        const pipeline = legacyCC.director.root.pipeline;
        const occlusionPass = pipeline.pipelineSceneData.getOcclusionQueryPass();
        const occlusionDSInfo = new DescriptorSetInfo(null!);
        occlusionDSInfo.layout = occlusionPass.localSetLayout;
        this._createWorldBoundDescriptorSet(occlusionDSInfo);
        this._setSubMesh(subMesh);
        this._patches = patches;
        this._passes = passes;

        this._flushPassInfo();
        if (passes[0].batchingScheme === BatchingSchemes.VB_MERGING) {
            this.subMesh.genFlatBuffers();
            this._setSubMesh(this.subMesh);
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

    private _initNativePlanarShadowShader (shadowInfo: Shadows) {
        this._planarShader = shadowInfo.getPlanarShader(this._patches);
        if (JSB) {
            this._nativeObj!.setPlanarShader(this._planarShader);
        }
    }

    /**
     * @internal
     */
    // This is a temporary solution
    // It should not be written in a fixed way, or modified by the user
    public initPlanarShadowShader () {
        const pipeline = legacyCC.director.root.pipeline as  ForwardPipeline;
        const shadowInfo = pipeline.pipelineSceneData.shadows;
        this._initNativePlanarShadowShader(shadowInfo);
    }

    private _initNativePlanarShadowInstanceShader (shadowInfo: Shadows) {
        this._planarInstanceShader = shadowInfo.getPlanarInstanceShader(this._patches);
        if (JSB) {
            this._nativeObj!.setPlanarInstanceShader(this._planarInstanceShader);
        }
    }

    /**
     * @internal
     */
    // This is a temporary solution
    // It should not be written in a fixed way, or modified by the user
    public initPlanarShadowInstanceShader () {
        const pipeline = legacyCC.director.root.pipeline as  ForwardPipeline;
        const shadowInfo = pipeline.pipelineSceneData.shadows;
        this._initNativePlanarShadowInstanceShader(shadowInfo);
    }

    private _destroy () {
        if (JSB) {
            this._nativeObj = null;
        }
    }

    public destroy (): void {
        this._destroyDescriptorSet();
        this._destroyWorldBoundDescriptorSet();
        this._destroyInputAssembler();
        this.priority = RenderPriority.DEFAULT;

        this._patches = null;
        this._subMesh = null;

        this._passes = null;
        this._shaders = null;

        if (this._reflectionTex) this._reflectionTex.destroy();
        this._reflectionTex = null;
        this._reflectionSampler = null;

        this._destroy();
    }

    public update (): void {
        for (let i = 0; i < this._passes!.length; ++i) {
            const pass = this._passes![i];
            pass.update();
        }
        this._descriptorSet!.update();
        this._worldBoundDescriptorSet!.update();
    }

    /**
     * @en Pipeline changed callback
     * @zh 管线更新回调
     */
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

    /**
     * @en Shader macro changed callback
     * @zh Shader 宏更新回调
     */
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

        if (JSB) {
            const passesNative = passes.map((_pass: Pass): NativePass => _pass.native);
            this._nativeObj!.setPasses(passesNative);
            this._nativeObj!.setShaders(this._shaders);
        }
    }
}
