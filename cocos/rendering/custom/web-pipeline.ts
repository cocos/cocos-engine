/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/* eslint-disable max-len */
import { systemInfo } from 'pal/system-info';
import { DEBUG, EDITOR } from 'internal:constants';
import { Buffer, DescriptorSetLayout, Device, Feature, Format, FormatFeatureBit, Sampler, Swapchain, Texture, ClearFlagBit, DescriptorSet, deviceManager, Viewport, API, CommandBuffer, Type, SamplerInfo, Filter, Address, DescriptorSetInfo, LoadOp, StoreOp, ShaderStageFlagBit, BufferInfo, TextureInfo, TextureType, UniformBlock, ResolveMode, SampleCount, Color, ComparisonFunc } from '../../gfx';
import { Mat4, Quat, toRadian, Vec2, Vec3, Vec4, assert, macro, cclegacy, IVec4Like, IMat4Like, IVec2Like, Color as CoreColor, RecyclePool } from '../../core';
import { AccessType, AttachmentType, CopyPair, LightInfo, LightingMode, MovePair, QueueHint, RenderCommonObjectPool, RenderCommonObjectPoolSettings, ResolvePair, ResourceDimension, ResourceFlags, ResourceResidency, SceneFlags, UpdateFrequency, UploadPair } from './types';
import { ComputePass, CopyPass, MovePass, RasterPass, RasterSubpass, RenderData, RenderGraph, RenderGraphComponent, RenderGraphValue, RenderQueue, RenderSwapchain, ResourceDesc, ResourceGraph, ResourceGraphValue, ResourceStates, ResourceTraits, SceneData, Subpass, PersistentBuffer, RenderGraphObjectPool, RenderGraphObjectPoolSettings, CullingFlags, ManagedResource, ManagedBuffer } from './render-graph';
import { ComputePassBuilder, ComputeQueueBuilder, BasicPipeline, PipelineBuilder, RenderQueueBuilder, RenderSubpassBuilder, PipelineType, BasicRenderPassBuilder, PipelineCapabilities, BasicMultisampleRenderPassBuilder, Setter, SceneBuilder } from './pipeline';
import { PipelineSceneData } from '../pipeline-scene-data';
import { Model, Camera, ShadowType, CSMLevel, DirectionalLight, SpotLight, PCFType, Shadows, SphereLight, PointLight, RangedDirectionalLight, ProbeType } from '../../render-scene/scene';
import { Light, LightType } from '../../render-scene/scene/light';
import { DescriptorSetData, DescriptorSetLayoutData, LayoutGraphData } from './layout-graph';
import { Executor } from './executor';
import { RenderWindow } from '../../render-scene/core/render-window';
import { MacroRecord, RenderScene } from '../../render-scene';
import { GlobalDSManager } from '../global-descriptor-set-manager';
import { supportsR32FloatTexture, supportsRGBA16HalfFloatTexture, UBOSkinning } from '../define';
import { OS } from '../../../pal/system-info/enum-type';
import { Compiler } from './compiler';
import { PipelineUBO } from '../pipeline-ubo';
import { builtinResMgr } from '../../asset/asset-manager';
import { Texture2D } from '../../asset/assets/texture-2d';
import { GeometryRenderer } from '../geometry-renderer';
import { Material, TextureCube } from '../../asset/assets';
import { DeferredPipelineBuilder, ForwardPipelineBuilder } from './builtin-pipelines';
import { CustomPipelineBuilder } from './custom-pipeline';
import { decideProfilerCamera } from '../pipeline-funcs';
import { DebugViewCompositeType } from '../debug-view';
import { getUBOTypeCount } from './utils';
import { buildReflectionProbePass, initGlobalDescBinding } from './define';
import { createGfxDescriptorSetsAndPipelines } from './layout-graph-utils';
import { Root } from '../../root';
import { CSMLayers, CSMShadowLayer } from '../shadow/csm-layers';
import { Scene } from '../../scene-graph';
import { Director } from '../../game';
import { ReflectionProbeManager } from '../../3d';
import { legacyCC } from '../../core/global-exports';
import { WebProgramLibrary } from './web-program-library';

const _uboVec = new Vec4();
const _uboVec3 = new Vec3();
const _uboCol = new Color();
const _matView = new Mat4();
const _mulMatView = new Mat4();
const uniformOffset = -1;
const _samplerPointInfo = new SamplerInfo(
    Filter.POINT,
    Filter.POINT,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
);

const renderCommonObjectSetting = new RenderCommonObjectPoolSettings(16);
const renderGraphPoolSetting: RenderGraphObjectPoolSettings = new RenderGraphObjectPoolSettings(16);
class PipelinePool {
    renderData = new RenderData();
    layoutGraph = new LayoutGraphData();
    rg = new RenderGraph();
    vertId = -1;
    sceneData = new SceneData();
    resourceGraph = new ResourceGraph();
    computePass = new ComputePass();
    rasterPass = new RasterPass();
    rasterSubpass = new RasterSubpass();
    renderQueue = new RenderQueue();
    sceneBuilder = new RecyclePool<WebSceneBuilder>(() => new WebSceneBuilder(this.renderData, this.layoutGraph, this.rg, this.vertId, this.sceneData), 16);
    renderPassBuilder = new RecyclePool<WebRenderPassBuilder>(() => new WebRenderPassBuilder(this.renderData, this.rg, this.layoutGraph, this.resourceGraph, this.vertId, this.rasterPass, this.getPipelineSceneData()), 16);
    computeQueueBuilder = new RecyclePool<WebComputeQueueBuilder>(() => new WebComputeQueueBuilder(this.renderData, this.rg, this.layoutGraph, this.vertId, this.renderQueue, this.getPipelineSceneData()), 16);
    renderQueueBuilder = new RecyclePool<WebRenderQueueBuilder>(() => new WebRenderQueueBuilder(this.renderData, this.rg, this.layoutGraph, this.vertId, this.renderQueue, this.getPipelineSceneData()), 16);
    renderSubpassBuilder = new RecyclePool<WebRenderSubpassBuilder>(() => new WebRenderSubpassBuilder(this.renderData, this.rg, this.layoutGraph, this.vertId, this.rasterSubpass, this.getPipelineSceneData()), 16);
    computePassBuilder = new RecyclePool<WebComputePassBuilder>(() => new WebComputePassBuilder(this.renderData, this.rg, this.layoutGraph, this.resourceGraph, this.vertId, this.computePass, this.getPipelineSceneData()), 16);
    samplerInfo = new RecyclePool<SamplerInfo>(() => new SamplerInfo(), 16);
    color = new RecyclePool<Color>(() => new Color(), 16);
    renderCommonObjectPool = new RenderCommonObjectPool(renderCommonObjectSetting);
    renderGraphPool = new RenderGraphObjectPool(renderGraphPoolSetting, this.renderCommonObjectPool);
    viewport = new RecyclePool(() => new Viewport(), 16);

    getPipelineSceneData (): PipelineSceneData {
        return (legacyCC.director.root as Root).pipeline.pipelineSceneData;
    }

    createColor (
        x: number = 0,
        y: number = 0,
        z: number = 0,
        w: number = 0,
    ): Color {
        const color = this.color.add();
        color.set(x, y, z, w);
        return color;
    }
    createSamplerInfo (
        minFilter: Filter = Filter.LINEAR,
        magFilter: Filter = Filter.LINEAR,
        mipFilter: Filter = Filter.NONE,
        addressU: Address = Address.WRAP,
        addressV: Address = Address.WRAP,
        addressW: Address = Address.WRAP,
        maxAnisotropy: number = 0,
        cmpFunc: ComparisonFunc = ComparisonFunc.ALWAYS,
    ): SamplerInfo {
        const samplerInfo = this.samplerInfo.add();
        samplerInfo.minFilter = minFilter;
        samplerInfo.magFilter = magFilter;
        samplerInfo.mipFilter = mipFilter;
        samplerInfo.addressU = addressU;
        samplerInfo.addressV = addressV;
        samplerInfo.addressW = addressW;
        samplerInfo.maxAnisotropy = maxAnisotropy;
        samplerInfo.cmpFunc = cmpFunc;
        return samplerInfo;
    }
    reset (): void {
        this.sceneBuilder.reset();
        this.renderPassBuilder.reset();
        this.computePassBuilder.reset();
        this.computeQueueBuilder.reset();
        this.renderCommonObjectPool.reset();
        this.renderGraphPool.reset();
        this.viewport.reset();
        this.samplerInfo.reset();
        this.color.reset();
        this.renderQueueBuilder.reset();
        this.renderSubpassBuilder.reset();
    }
}
let pipelinePool: PipelinePool;
let renderGraphPool: RenderGraphObjectPool;
export class WebSetter implements Setter {
    constructor (data: RenderData, lg: LayoutGraphData) {
        this._data = data;
        this._lg = lg;
    }
    get name (): string {
        return '';
    }
    set name (name: string) {
        // noop
    }
    protected _copyToBuffer (target: IVec4Like | Quat | IVec2Like | IMat4Like | number, offset: number, type: Type): void {
        assert(offset !== -1);
        const arr = this.getCurrConstant();
        switch (type) {
        case Type.FLOAT4:
            Vec4.toArray(arr, target as IVec4Like, offset);
            break;
        case Type.MAT4:
            Mat4.toArray(arr, target as IMat4Like, offset);
            break;
        case Type.FLOAT:
            arr[offset] = target as number;
            break;
        case Type.SAMPLER2D:
            break;
        case Type.TEXTURE2D:
            break;
        case Type.FLOAT2: {
            const vec2Val = target as IVec2Like;
            arr[offset + 0] = vec2Val.x;
            arr[offset + 1] = vec2Val.y;
        }
            break;
        default:
        }
    }

    protected _applyCurrConstantBuffer (name: string, target: IVec4Like | Quat | IVec2Like | IMat4Like | number, type: Type, idx = 0): void {
        const offset = this.getUniformOffset(name, type, idx);
        this._copyToBuffer(target, offset, type);
    }

    public hasUniform (offset: number): boolean {
        return offset !== -1;
    }

    public getUniformOffset (name: string, type: Type, idx = 0): number {
        const currBlock = this._getCurrUniformBlock();
        if (!currBlock) return -1;
        let offset = 0;
        const typeCount = getUBOTypeCount(type);
        for (const uniform of currBlock.members) {
            const currCount = getUBOTypeCount(uniform.type);
            if (uniform.name === name) {
                if (typeCount === currCount) {
                    return offset + idx * currCount;
                } else if (typeCount === currCount * uniform.count) {
                    return offset;
                } else if (typeCount < currCount * uniform.count) {
                    return offset + idx;
                }
                if (DEBUG) assert(false);
            }
            offset += currCount * uniform.count;
        }
        return -1;
    }

    protected _getCurrUniformBlock (): UniformBlock | undefined {
        const block: string = this._currBlock;
        const nodeId = this._lg.locateChild(0xFFFFFFFF, this._currStage);
        const ppl = this._lg.getLayout(nodeId);
        const layout = ppl.descriptorSets.get(this._currFrequency)!.descriptorSetLayoutData;
        const nameID: number = this._lg.attributeIndex.get(block)!;
        return layout.uniformBlocks.get(nameID);
    }

    protected _getCurrDescSetLayoutData (): DescriptorSetLayoutData {
        const nodeId = this._lg.locateChild(0xFFFFFFFF, this._currStage);
        const ppl = this._lg.getLayout(nodeId);
        const layout = ppl.descriptorSets.get(this._currFrequency)!.descriptorSetLayoutData;
        return layout;
    }

    protected _getCurrDescriptorBlock (block: string): number {
        const layout = this._getCurrDescSetLayoutData();
        const nameID: number = this._lg.attributeIndex.get(block)!;
        for (const block of layout.descriptorBlocks) {
            for (let i = 0; i !== block.descriptors.length; ++i) {
                if (nameID === block.descriptors[i].descriptorID) {
                    return block.offset + i;
                }
            }
        }
        return -1;
    }

    setCurrConstant (block: string, stage = 'default', frequency: UpdateFrequency = UpdateFrequency.PER_PASS): boolean {
        this._currBlock = block;
        this._currStage = stage;
        this._currFrequency = frequency;
        const nameID: number = this._lg.attributeIndex.get(block)!;
        this._currCount = 0;
        const currBlock = this._getCurrUniformBlock();
        if (!currBlock) return false;
        for (const uniform of currBlock.members) {
            this._currCount += getUBOTypeCount(uniform.type) * uniform.count;
        }
        this._currConstant = this._data.constants.get(nameID)!;
        return true;
    }

    getCurrConstant (): number[] {
        return this._currConstant;
    }

    public addConstant (block: string, stage = 'default', frequency: UpdateFrequency = UpdateFrequency.PER_PASS): boolean {
        this._currBlock = block;
        this._currStage = stage;
        this._currFrequency = frequency;
        const num = this._lg.attributeIndex.get(block)!;
        this._currCount = 0;
        const currBlock = this._getCurrUniformBlock();
        if (!currBlock) return false;
        for (const uniform of currBlock.members) {
            this._currCount += getUBOTypeCount(uniform.type) * uniform.count;
        }
        if (!this._data.constants.get(num)) {
            const value: number[] = new Array(this._currCount);
            value.fill(0);
            this._data.constants.set(num, value);
        }
        this.setCurrConstant(block, stage);
        return true;
    }
    public setMat4 (name: string, mat: Mat4, idx = 0): void {
        this._applyCurrConstantBuffer(name, mat, Type.MAT4, idx);
    }
    public offsetMat4 (mat: Mat4, offset: number): void {
        this._copyToBuffer(mat, offset, Type.MAT4);
    }
    public setQuaternion (name: string, quat: Quat, idx = 0): void {
        this._applyCurrConstantBuffer(name, quat, Type.FLOAT4, idx);
    }
    public offsetQuaternion (quat: Quat, offset: number): void {
        this._copyToBuffer(quat, offset, Type.FLOAT4);
    }
    public setColor (name: string, color: Color, idx = 0): void {
        this._applyCurrConstantBuffer(name, color, Type.FLOAT4, idx);
    }
    public offsetColor (color: Color | CoreColor, offset: number): void {
        this._copyToBuffer(color, offset, Type.FLOAT4);
    }
    public setVec4 (name: string, vec: Vec4, idx = 0): void {
        this._applyCurrConstantBuffer(name, vec, Type.FLOAT4, idx);
    }
    public offsetVec4 (vec: Vec4, offset: number): void {
        this._copyToBuffer(vec, offset, Type.FLOAT4);
    }
    public setVec2 (name: string, vec: Vec2, idx = 0): void {
        this._applyCurrConstantBuffer(name, vec, Type.FLOAT2, idx);
    }
    public offsetVec2 (vec: Vec2, offset: number): void {
        this._copyToBuffer(vec, offset, Type.FLOAT2);
    }
    public setFloat (name: string, v: number, idx = 0): void {
        this._applyCurrConstantBuffer(name, v, Type.FLOAT, idx);
    }
    public setArrayBuffer (name: string, arrayBuffer: ArrayBuffer): void {
        throw new Error('Method not implemented.');
    }
    public offsetFloat (v: number, offset: number): void {
        this._copyToBuffer(v, offset, Type.FLOAT);
    }
    public setBuffer (name: string, buffer: Buffer): void {
        if (this._getCurrDescriptorBlock(name) === -1) {
            return;
        }
        const num = this._lg.attributeIndex.get(name)!;
        this._data.buffers.set(num, buffer);
    }
    public setTexture (name: string, texture: Texture): void {
        if (this._getCurrDescriptorBlock(name) === -1) {
            return;
        }
        const num = this._lg.attributeIndex.get(name)!;
        this._data.textures.set(num, texture);
    }
    public setReadWriteBuffer (name: string, buffer: Buffer): void {
        // TODO
    }
    public setReadWriteTexture (name: string, texture: Texture): void {
        // TODO
    }
    public setSampler (name: string, sampler: Sampler): void {
        if (this._getCurrDescriptorBlock(name) === -1) {
            return;
        }
        const num = this._lg.attributeIndex.get(name)!;
        this._data.samplers.set(num, sampler);
    }

    public getParentLayout (): string {
        const director = cclegacy.director;
        const root = director.root;
        const pipeline = root.pipeline as WebPipeline;
        const parId = pipeline.renderGraph!.getParent(this._vertID);
        const layoutName = pipeline.renderGraph!.getLayout(parId);
        return layoutName;
    }

    public getCurrentLayout (): string {
        const director = cclegacy.director;
        const root = director.root;
        const pipeline = root.pipeline as WebPipeline;
        const layoutName = pipeline.renderGraph!.getLayout(this._vertID);
        return layoutName;
    }

    public setBuiltinCameraConstants (camera: Camera): void {
        const director = cclegacy.director;
        const root = director.root;
        const pipeline = root.pipeline as WebPipeline;
        const layoutName = this.getParentLayout();
        setCameraUBOValues(this, camera, pipeline.pipelineSceneData, camera.scene, layoutName);
    }
    public setBuiltinShadowMapConstants (light: Light, numLevels?: number): void {
        setShadowUBOView(this, null, this.getParentLayout());
    }
    public setBuiltinDirectionalLightFrustumConstants (camera: Camera, light: DirectionalLight, csmLevel = 0): void {
        setShadowUBOLightView(this, camera, light, csmLevel);
    }
    public setBuiltinSpotLightFrustumConstants (light: SpotLight): void {
        setShadowUBOLightView(this, null, light, 0);
    }
    public setBuiltinDirectionalLightConstants (light: DirectionalLight, camera: Camera): void {
        this.setBuiltinShadowMapConstants(light);
    }
    public setBuiltinSphereLightConstants (light: SphereLight, camera: Camera): void {
        const director = cclegacy.director;
        const pipeline = (director.root as Root).pipeline;
        const sceneData = pipeline.pipelineSceneData;
        if (!this.addConstant('CCForwardLight', this.getParentLayout(), UpdateFrequency.PER_BATCH)) return;
        _uboVec.set(light.position.x, light.position.y, light.position.z, LightType.SPHERE);
        setUniformOffset(this, 'cc_lightPos', Type.FLOAT4, _uboVec);

        _uboVec.set(light.size, light.range, 0.0, 0.0);
        setUniformOffset(this, 'cc_lightSizeRangeAngle', Type.FLOAT4, _uboVec);

        const isHDR = sceneData.isHDR;
        const lightMeterScale = 10000.0;
        _uboVec.set(light.color.x, light.color.y, light.color.z, 0);
        if (light.useColorTemperature) {
            const finalColor = light.finalColor;
            _uboVec.x = finalColor.x;
            _uboVec.y = finalColor.y;
            _uboVec.z = finalColor.z;
        }
        if (isHDR) {
            _uboVec.w = (light).luminance * camera.exposure * lightMeterScale;
        } else {
            _uboVec.w = (light).luminance;
        }
        setUniformOffset(this, 'cc_lightColor', Type.FLOAT4, _uboVec);
    }
    public setBuiltinSpotLightConstants (light: SpotLight, camera: Camera): void {
        const director = cclegacy.director;
        const pipeline = (director.root as Root).pipeline;
        const sceneData = pipeline.pipelineSceneData;

        const shadowInfo = sceneData.shadows;
        if (!this.addConstant('CCForwardLight', this.getParentLayout(), UpdateFrequency.PER_BATCH)) return;
        _uboVec.set(light.position.x, light.position.y, light.position.z, LightType.SPOT);
        setUniformOffset(this, 'cc_lightPos', Type.FLOAT4, _uboVec);

        _uboVec.set(light.size, light.range, light.spotAngle, (shadowInfo.enabled && light.shadowEnabled && shadowInfo.type === ShadowType.ShadowMap) ? 1 : 0);
        setUniformOffset(this, 'cc_lightSizeRangeAngle', Type.FLOAT4, _uboVec);

        _uboVec.set(light.direction.x, light.direction.y, light.direction.z, 0);
        setUniformOffset(this, 'cc_lightDir', Type.FLOAT4, _uboVec);

        const isHDR = sceneData.isHDR;
        const lightMeterScale = 10000.0;
        _uboVec.set(light.color.x, light.color.y, light.color.z, 0);
        if (light.useColorTemperature) {
            const finalColor = light.finalColor;
            _uboVec.x = finalColor.x;
            _uboVec.y = finalColor.y;
            _uboVec.z = finalColor.z;
        }
        if (isHDR) {
            _uboVec.w = (light).luminance * camera.exposure * lightMeterScale;
        } else {
            _uboVec.w = (light).luminance;
        }
        setUniformOffset(this, 'cc_lightColor', Type.FLOAT4, _uboVec);

        _uboVec.set(0, 0, 0, light.angleAttenuationStrength);
        setUniformOffset(this, 'cc_lightBoundingSizeVS', Type.FLOAT4, _uboVec);
    }
    public setBuiltinPointLightConstants (light: PointLight, camera: Camera): void {
        const director = cclegacy.director;
        const pipeline = (director.root as Root).pipeline;
        const sceneData = pipeline.pipelineSceneData;
        if (!this.addConstant('CCForwardLight', this.getParentLayout(), UpdateFrequency.PER_BATCH)) return;
        _uboVec.set(light.position.x, light.position.y, light.position.z, LightType.POINT);
        setUniformOffset(this, 'cc_lightPos', Type.FLOAT4, _uboVec);

        _uboVec.set(0.0, light.range, 0.0, 0.0);
        setUniformOffset(this, 'cc_lightSizeRangeAngle', Type.FLOAT4, _uboVec);
        const isHDR = sceneData.isHDR;
        const lightMeterScale = 10000.0;
        if (light.useColorTemperature) {
            const finalColor = light.finalColor;
            _uboVec.x = finalColor.x;
            _uboVec.y = finalColor.y;
            _uboVec.z = finalColor.z;
        }
        if (isHDR) {
            _uboVec.w = (light).luminance * camera.exposure * lightMeterScale;
        } else {
            _uboVec.w = (light).luminance;
        }
        _uboVec.set(light.color.x, light.color.y, light.color.z, 0);
        setUniformOffset(this, 'cc_lightColor', Type.FLOAT4, _uboVec);
    }
    public setBuiltinRangedDirectionalLightConstants (light: RangedDirectionalLight, camera: Camera): void {
        const director = cclegacy.director;
        const pipeline = (director.root as Root).pipeline;
        const sceneData = pipeline.pipelineSceneData;
        if (!this.addConstant('CCForwardLight', this.getParentLayout(), UpdateFrequency.PER_BATCH)) return;
        _uboVec.set(light.position.x, light.position.y, light.position.z, LightType.RANGED_DIRECTIONAL);
        setUniformOffset(this, 'cc_lightPos', Type.FLOAT4, _uboVec);

        _uboVec.set(light.right.x, light.right.y, light.right.z, 0.0);
        setUniformOffset(this, 'cc_lightSizeRangeAngle', Type.FLOAT4, _uboVec);

        _uboVec.set(light.direction.x, light.direction.y, light.direction.z, 0);
        setUniformOffset(this, 'cc_lightDir', Type.FLOAT4, _uboVec);

        const scale = light.scale;
        _uboVec.set(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5, 0);
        setUniformOffset(this, 'cc_lightBoundingSizeVS', Type.FLOAT4, _uboVec);

        const isHDR = sceneData.isHDR;
        _uboVec.set(light.color.x, light.color.y, light.color.z, 0);
        if (light.useColorTemperature) {
            const finalColor = light.finalColor;
            _uboVec.x = finalColor.x;
            _uboVec.y = finalColor.y;
            _uboVec.z = finalColor.z;
        }
        if (isHDR) {
            _uboVec.w = light.illuminance * camera.exposure;
        } else {
            _uboVec.w = light.illuminance;
        }
        setUniformOffset(this, 'cc_lightColor', Type.FLOAT4, _uboVec);
    }
    public hasSampler (name: string): boolean {
        const id = this._lg.attributeIndex.get(name);
        if (id === undefined) {
            return false;
        }
        return this._data.samplers.has(id);
    }
    public hasTexture (name: string): boolean {
        const id = this._lg.attributeIndex.get(name);
        if (id === undefined) {
            return false;
        }
        return this._data.textures.has(id);
    }
    public setCustomBehavior (name: string): void {
        throw new Error('Method not implemented.');
    }

    // protected
    protected _data: RenderData;
    protected _lg: LayoutGraphData;
    protected _vertID: number = -1;
    protected _currBlock;
    protected _currStage: string = '';
    protected _currFrequency: UpdateFrequency = UpdateFrequency.PER_PASS;
    protected _currCount;
    protected _currConstant: number[] = [];
}

function setUniformOffset (setter: WebSetter, uniformName: string, uniformType: Type, value, idx = 0): void {
    const uniformOffset = setter.getUniformOffset(uniformName, uniformType, idx);
    if (setter.hasUniform(uniformOffset)) {
        switch (uniformType) {
        case Type.MAT4:
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            setter.offsetMat4(value, uniformOffset);
            break;
        case Type.FLOAT4:
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            setter.offsetVec4(value, uniformOffset);
            break;
        default:
        }
    }
}

function setShadowUBOLightView (
    setter: WebSetter,
    camera: Camera | null,
    light: Light,
    csmLevel: number,
    layout = 'default',
): void {
    const director = cclegacy.director;
    const pipeline = (director.root as Root).pipeline;
    const device = pipeline.device;
    const sceneData = pipeline.pipelineSceneData;

    const shadowInfo = sceneData.shadows;
    if (shadowInfo.type === ShadowType.Planar) {
        return;
    }
    const csmLayers = sceneData.csmLayers;
    const packing = supportsR32FloatTexture(device) ? 0.0 : 1.0;
    const cap = pipeline.device.capabilities;
    setter.addConstant('CCCSM', layout);
    // ShadowMap
    if (!setter.addConstant('CCShadow', layout)) return;
    if (shadowInfo.enabled) {
        if (shadowInfo.type === ShadowType.ShadowMap) {
            // update CSM layers
            if (light && light.node && light.type === LightType.DIRECTIONAL) {
                csmLayers.update(sceneData, camera!);
            }
        }
    }
    switch (light.type) {
    case LightType.DIRECTIONAL: {
        const mainLight = light as DirectionalLight;
        if (shadowInfo.enabled && mainLight && mainLight.shadowEnabled) {
            if (shadowInfo.type === ShadowType.ShadowMap) {
                let near = 0.1;
                let far = 0;
                let matShadowView: Mat4;
                let matShadowProj: Mat4;
                let matShadowViewProj: Mat4;
                let levelCount = 0;
                if (mainLight.shadowFixedArea || mainLight.csmLevel === CSMLevel.LEVEL_1) {
                    matShadowView = csmLayers.specialLayer.matShadowView;
                    matShadowProj = csmLayers.specialLayer.matShadowProj;
                    matShadowViewProj = csmLayers.specialLayer.matShadowViewProj;
                    if (mainLight.shadowFixedArea) {
                        near = mainLight.shadowNear;
                        far = mainLight.shadowFar;
                        levelCount = 0;
                    } else {
                        near = 0.1;
                        far = csmLayers.specialLayer.shadowCameraFar;
                        levelCount = 1;
                    }
                    _uboVec.set(LightType.DIRECTIONAL, packing, mainLight.shadowNormalBias, 0);
                    setUniformOffset(setter, 'cc_shadowLPNNInfo', Type.FLOAT4, _uboVec);
                } else {
                    const layer = csmLayers.layers[csmLevel];
                    matShadowView = layer.matShadowView;
                    matShadowProj = layer.matShadowProj;
                    matShadowViewProj = layer.matShadowViewProj;

                    near = layer.splitCameraNear;
                    far = layer.splitCameraFar;
                    levelCount = mainLight.csmLevel;
                }
                setUniformOffset(setter, 'cc_matLightView', Type.MAT4, matShadowView);
                _uboVec.set(matShadowProj.m10, matShadowProj.m14, matShadowProj.m11, matShadowProj.m15);
                setUniformOffset(setter, 'cc_shadowProjDepthInfo', Type.FLOAT4, _uboVec);

                _uboVec.set(matShadowProj.m00, matShadowProj.m05, 1.0 / matShadowProj.m00, 1.0 / matShadowProj.m05);
                setUniformOffset(setter, 'cc_shadowProjInfo', Type.FLOAT4, _uboVec);

                setUniformOffset(setter, 'cc_matLightViewProj', Type.MAT4, matShadowViewProj);

                _uboVec.set(near, far, 0, 1.0 - mainLight.shadowSaturation);
                setUniformOffset(setter, 'cc_shadowNFLSInfo', Type.FLOAT4, _uboVec);

                _uboVec.set(LightType.DIRECTIONAL, packing, mainLight.shadowNormalBias, levelCount);
                setUniformOffset(setter, 'cc_shadowLPNNInfo', Type.FLOAT4, _uboVec);

                _uboVec.set(shadowInfo.size.x, shadowInfo.size.y, mainLight.shadowPcf, mainLight.shadowBias);
                setUniformOffset(setter, 'cc_shadowWHPBInfo', Type.FLOAT4, _uboVec);
            }
        }
        break;
    }
    case LightType.SPOT: {
        const spotLight = light as SpotLight;
        if (shadowInfo.enabled && spotLight && spotLight.shadowEnabled) {
            Mat4.invert(_matView, spotLight.node!.getWorldMatrix());
            setUniformOffset(setter, 'cc_matLightView', Type.MAT4, _matView);
            Mat4.perspective(
                _mulMatView,
                spotLight.angle,
                1.0,
                0.001,
                spotLight.range,
                true,
                cap.clipSpaceMinZ,
                cap.clipSpaceSignY,
                0,
            );
            const matShadowInvProj: Mat4 = _mulMatView.clone().invert();
            const matShadowProj: Mat4 = _mulMatView.clone();

            Mat4.multiply(_matView, _mulMatView, _matView);
            setUniformOffset(setter, 'cc_matLightViewProj', Type.MAT4, _matView);

            _uboVec.set(0.01, (light as SpotLight).range, 0.0, 0.0);
            setUniformOffset(setter, 'cc_shadowNFLSInfo', Type.FLOAT4, _uboVec);

            _uboVec.set(shadowInfo.size.x, shadowInfo.size.y, spotLight.shadowPcf, spotLight.shadowBias);
            setUniformOffset(setter, 'cc_shadowWHPBInfo', Type.FLOAT4, _uboVec);

            _uboVec.set(LightType.SPOT, packing, spotLight.shadowNormalBias, 0.0);
            setUniformOffset(setter, 'cc_shadowLPNNInfo', Type.FLOAT4, _uboVec);

            _uboVec.set(matShadowProj.m10, matShadowProj.m14, matShadowProj.m11, matShadowProj.m15);
            setUniformOffset(setter, 'cc_shadowProjDepthInfo', Type.FLOAT4, _uboVec);

            _uboVec.set(matShadowInvProj.m10, matShadowInvProj.m14, matShadowInvProj.m11, matShadowInvProj.m15);
            setUniformOffset(setter, 'cc_shadowInvProjDepthInfo', Type.FLOAT4, _uboVec);

            _uboVec.set(matShadowProj.m00, matShadowProj.m05, 1.0 / matShadowProj.m00, 1.0 / matShadowProj.m05);
            setUniformOffset(setter, 'cc_shadowProjInfo', Type.FLOAT4, _uboVec);
        }
        break;
    }
    case LightType.SPHERE: {
        _uboVec.set(shadowInfo.size.x, shadowInfo.size.y, 1.0, 0.0);
        setUniformOffset(setter, 'cc_shadowWHPBInfo', Type.FLOAT4, _uboVec);
        _uboVec.set(LightType.SPHERE, packing, 0.0, 0.0);
        setUniformOffset(setter, 'cc_shadowLPNNInfo', Type.FLOAT4, _uboVec);
        break;
    }
    case LightType.POINT: {
        _uboVec.set(shadowInfo.size.x, shadowInfo.size.y, 1.0, 0.0);
        setUniformOffset(setter, 'cc_shadowWHPBInfo', Type.FLOAT4, _uboVec);
        _uboVec.set(LightType.POINT, packing, 0.0, 0.0);
        setUniformOffset(setter, 'cc_shadowLPNNInfo', Type.FLOAT4, _uboVec);
        break;
    }
    default:
    }
    _uboCol.set(shadowInfo.shadowColor.x, shadowInfo.shadowColor.y, shadowInfo.shadowColor.z, shadowInfo.shadowColor.w);
    setUniformOffset(setter, 'cc_shadowColor', Type.FLOAT4, _uboCol);
}

function getPCFRadius (shadowInfo: Shadows, mainLight: DirectionalLight): number {
    const shadowMapSize = shadowInfo.size.x;
    switch (mainLight.shadowPcf) {
    case PCFType.HARD:
        return 0.0;
    case PCFType.SOFT:
        return 1.0 / (shadowMapSize * 0.5);
    case PCFType.SOFT_2X:
        return 2.0 / (shadowMapSize * 0.5);
    case PCFType.SOFT_4X:
        return 3.0 / (shadowMapSize * 0.5);
    default:
    }
    return 0.0;
}

function setShadowUBOView (setter: WebSetter, camera: Camera | null, layout = 'default'): void {
    const director = cclegacy.director;
    const pipeline = director.root.pipeline;
    const device: Device = pipeline.device;
    const scene = director.getScene();
    const mainLight: DirectionalLight = camera && camera.scene ? camera.scene.mainLight : scene ? scene.renderScene.mainLight : null;
    const sceneData = pipeline.pipelineSceneData;
    const shadowInfo: Shadows = sceneData.shadows;
    const csmLayers: CSMLayers = sceneData.csmLayers;
    const csmSupported = sceneData.csmSupported;
    const packing = supportsR32FloatTexture(device) ? 0.0 : 1.0;
    const hasCCShadow = setter.addConstant('CCShadow', layout);
    const hasCCCSM = setter.addConstant('CCCSM', layout);
    if (mainLight && shadowInfo.enabled) {
        if (shadowInfo.type === ShadowType.ShadowMap) {
            if (mainLight.shadowEnabled) {
                if (mainLight.shadowFixedArea || mainLight.csmLevel === CSMLevel.LEVEL_1 || !csmSupported) {
                    if (hasCCShadow) {
                        setter.setCurrConstant('CCShadow', layout);
                        const matShadowView: Mat4 = csmLayers.specialLayer.matShadowView;
                        const matShadowProj: Mat4 = csmLayers.specialLayer.matShadowProj;
                        const matShadowViewProj: Mat4 = csmLayers.specialLayer.matShadowViewProj;
                        const near: number = mainLight.shadowNear;
                        const far: number = mainLight.shadowFar;
                        setUniformOffset(setter, 'cc_matLightView', Type.MAT4, matShadowView);

                        _uboVec.set(matShadowProj.m10, matShadowProj.m14, matShadowProj.m11, matShadowProj.m15);
                        setUniformOffset(setter, 'cc_shadowProjDepthInfo', Type.FLOAT4, _uboVec);

                        _uboVec.set(matShadowProj.m00, matShadowProj.m05, 1.0 / matShadowProj.m00, 1.0 / matShadowProj.m05);
                        setUniformOffset(setter, 'cc_shadowProjInfo', Type.FLOAT4, _uboVec);

                        setUniformOffset(setter, 'cc_matLightViewProj', Type.MAT4, matShadowViewProj);

                        _uboVec.set(near, far, 0, 1.0 - mainLight.shadowSaturation);
                        setUniformOffset(setter, 'cc_shadowNFLSInfo', Type.FLOAT4, _uboVec);

                        _uboVec.set(LightType.DIRECTIONAL, packing, mainLight.shadowNormalBias, 0);
                        setUniformOffset(setter, 'cc_shadowLPNNInfo', Type.FLOAT4, _uboVec);
                    }
                } else {
                    if (hasCCCSM) {
                        const layerThreshold = getPCFRadius(shadowInfo, mainLight);
                        setter.setCurrConstant('CCCSM', layout);
                        for (let i = 0; i < mainLight.csmLevel; i++) {
                            const layer: CSMShadowLayer = csmLayers.layers[i];
                            const matShadowView: Mat4 = layer.matShadowView;
                            _uboVec.set(matShadowView.m00, matShadowView.m04, matShadowView.m08, layerThreshold);
                            setUniformOffset(setter, 'cc_csmViewDir0', Type.FLOAT4, _uboVec, i);

                            _uboVec.set(matShadowView.m01, matShadowView.m05, matShadowView.m09, layer.splitCameraNear);
                            setUniformOffset(setter, 'cc_csmViewDir1', Type.FLOAT4, _uboVec, i);

                            _uboVec.set(matShadowView.m02, matShadowView.m06, matShadowView.m10, layer.splitCameraFar);
                            setUniformOffset(setter, 'cc_csmViewDir2', Type.FLOAT4, _uboVec, i);

                            const csmAtlas = layer.csmAtlas;
                            setUniformOffset(setter, 'cc_csmAtlas', Type.FLOAT4, csmAtlas, i);

                            const matShadowViewProj = layer.matShadowViewProj;
                            setUniformOffset(setter, 'cc_matCSMViewProj', Type.MAT4, matShadowViewProj, i);

                            const matShadowProj = layer.matShadowProj;
                            _uboVec.set(matShadowProj.m10, matShadowProj.m14, matShadowProj.m11, matShadowProj.m15);
                            setUniformOffset(setter, 'cc_csmProjDepthInfo', Type.FLOAT4, _uboVec, i);

                            _uboVec.set(matShadowProj.m00, matShadowProj.m05, 1.0 / matShadowProj.m00, 1.0 / matShadowProj.m05);
                            setUniformOffset(setter, 'cc_csmProjInfo', Type.FLOAT4, _uboVec, i);
                        }
                        _uboVec.set(mainLight.csmTransitionRange, 0, 0, 0);
                        setUniformOffset(setter, 'cc_csmSplitsInfo', Type.FLOAT4, _uboVec);
                    }
                    if (hasCCShadow) {
                        setter.setCurrConstant('CCShadow', layout);
                        _uboVec.set(0, 0, 0, 1.0 - mainLight.shadowSaturation);
                        setUniformOffset(setter, 'cc_shadowNFLSInfo', Type.FLOAT4, _uboVec);

                        _uboVec.set(LightType.DIRECTIONAL, packing, mainLight.shadowNormalBias, mainLight.csmLevel);
                        setUniformOffset(setter, 'cc_shadowLPNNInfo', Type.FLOAT4, _uboVec);
                    }
                }
                if (hasCCShadow) {
                    setter.setCurrConstant('CCShadow', layout);
                    _uboVec.set(shadowInfo.size.x, shadowInfo.size.y, mainLight.shadowPcf, mainLight.shadowBias);
                    setUniformOffset(setter, 'cc_shadowWHPBInfo', Type.FLOAT4, _uboVec);
                }
            }
        } else if (hasCCShadow) {
            setter.setCurrConstant('CCShadow', layout);
            Vec3.normalize(_uboVec3, shadowInfo.normal);
            _uboVec.set(_uboVec3.x, _uboVec3.y, _uboVec3.z, -shadowInfo.distance);
            setUniformOffset(setter, 'cc_planarNDInfo', Type.FLOAT4, _uboVec);

            _uboVec.set(0, 0, 0, shadowInfo.planeBias);
            setUniformOffset(setter, 'cc_shadowWHPBInfo', Type.FLOAT4, _uboVec);
        }
        if (hasCCShadow) {
            setter.setCurrConstant('CCShadow', layout);
            setUniformOffset(setter, 'cc_shadowColor', Type.FLOAT4, shadowInfo.shadowColor);
        }
    }
}

function setComputeConstants (setter: WebSetter, layoutName: string): void {
    const director = cclegacy.director;
    const root = director.root;
    const pipeline = root.pipeline as WebPipeline;
    setter.addConstant('CCConst', layoutName);
}

function setCameraUBOValues (
    setter: WebSetter,
    camera: Readonly<Camera> | null,
    cfg: Readonly<PipelineSceneData>,
    scene: RenderScene | null,
    layoutName = 'default',
): void {
    const director = cclegacy.director;
    const root = director.root;
    const pipeline = root.pipeline as WebPipeline;
    const shadowInfo = cfg.shadows;
    const skybox = cfg.skybox;
    const shadingScale = cfg.shadingScale;
    // Camera
    if (!setter.addConstant('CCCamera', layoutName)) return;
    if (camera) {
        setUniformOffset(setter, 'cc_matView', Type.MAT4, camera.matView);

        setUniformOffset(setter, 'cc_matViewInv', Type.MAT4, camera.node.worldMatrix);

        setUniformOffset(setter, 'cc_matProj', Type.MAT4, camera.matProj);

        setUniformOffset(setter, 'cc_matProjInv', Type.MAT4, camera.matProjInv);

        setUniformOffset(setter, 'cc_matViewProj', Type.MAT4, camera.matViewProj);

        setUniformOffset(setter, 'cc_matViewProjInv', Type.MAT4, camera.matViewProjInv);

        _uboVec.set(camera.surfaceTransform, camera.cameraUsage, Math.cos(toRadian(skybox.getRotationAngle())), Math.sin(toRadian(skybox.getRotationAngle())));
        setUniformOffset(setter, 'cc_surfaceTransform', Type.FLOAT4, _uboVec);

        _uboVec.set(camera.exposure, 1.0 / camera.exposure, cfg.isHDR ? 1.0 : 0.0, 1.0 / Camera.standardExposureValue);
        setUniformOffset(setter, 'cc_exposure', Type.FLOAT4, _uboVec);
    }
    if (camera) { _uboVec.set(camera.position.x, camera.position.y, camera.position.z, pipeline.getCombineSignY()); } else { _uboVec.set(0, 0, 0, pipeline.getCombineSignY()); }
    setUniformOffset(setter, 'cc_cameraPos', Type.FLOAT4, _uboVec);

    _uboVec.set(cfg.shadingScale, cfg.shadingScale, 1.0 / cfg.shadingScale, 1.0 / cfg.shadingScale);
    setUniformOffset(setter, 'cc_screenScale', Type.FLOAT4, _uboVec);

    const mainLight = scene && scene.mainLight;
    if (mainLight) {
        const shadowEnable = (mainLight.shadowEnabled && shadowInfo.type === ShadowType.ShadowMap) ? 1.0 : 0.0;
        _uboVec.set(mainLight.direction.x, mainLight.direction.y, mainLight.direction.z, shadowEnable);
        setUniformOffset(setter, 'cc_mainLitDir', Type.FLOAT4, _uboVec);

        let r = mainLight.color.x;
        let g = mainLight.color.y;
        let b = mainLight.color.z;
        if (mainLight.useColorTemperature) {
            r *= mainLight.colorTemperatureRGB.x;
            g *= mainLight.colorTemperatureRGB.y;
            b *= mainLight.colorTemperatureRGB.z;
        }
        let w = mainLight.illuminance;
        if (cfg.isHDR && camera) {
            w *= camera.exposure;
        }
        _uboVec.set(r, g, b, w);
        setUniformOffset(setter, 'cc_mainLitColor', Type.FLOAT4, _uboVec);
    } else {
        _uboVec.set(0, 0, 1, 0);
        setUniformOffset(setter, 'cc_mainLitDir', Type.FLOAT4, _uboVec);

        _uboVec.set(0, 0, 0, 0);
        setUniformOffset(setter, 'cc_mainLitColor', Type.FLOAT4, _uboVec);
    }

    const ambient = cfg.ambient;
    const skyColor = ambient.skyColor;
    if (cfg.isHDR) {
        skyColor.w = ambient.skyIllum * (camera ? camera.exposure : 1);
    } else {
        skyColor.w = ambient.skyIllum;
    }
    _uboVec.set(skyColor.x, skyColor.y, skyColor.z, skyColor.w);
    setUniformOffset(setter, 'cc_ambientSky', Type.FLOAT4, _uboVec);

    _uboVec.set(ambient.groundAlbedo.x, ambient.groundAlbedo.y, ambient.groundAlbedo.z, skybox.envmap ? skybox.envmap?.mipmapLevel : 1.0);
    setUniformOffset(setter, 'cc_ambientGround', Type.FLOAT4, _uboVec);

    const fog = cfg.fog;
    const colorTempRGB = fog.colorArray;
    _uboVec.set(colorTempRGB.x, colorTempRGB.y, colorTempRGB.z, colorTempRGB.z);
    setUniformOffset(setter, 'cc_fogColor', Type.FLOAT4, _uboVec);

    _uboVec.set(fog.fogStart, fog.fogEnd, fog.fogDensity, 0.0);
    setUniformOffset(setter, 'cc_fogBase', Type.FLOAT4, _uboVec);

    _uboVec.set(fog.fogTop, fog.fogRange, fog.fogAtten, 0.0);
    setUniformOffset(setter, 'cc_fogAdd', Type.FLOAT4, _uboVec);
    if (camera) {
        _uboVec.set(camera.nearClip, camera.farClip, camera.getClipSpaceMinz(), 0.0);
        setUniformOffset(setter, 'cc_nearFar', Type.FLOAT4, _uboVec);

        _uboVec.set(camera.viewport.x, camera.viewport.y, shadingScale * camera.window.width * camera.viewport.z, shadingScale * camera.window.height * camera.viewport.w);
        setUniformOffset(setter, 'cc_viewPort', Type.FLOAT4, _uboVec);
    }
}

function setTextureUBOView (setter: WebSetter, camera: Camera | null, cfg: Readonly<PipelineSceneData>, layout = 'default'): void {
    const skybox = cfg.skybox;
    const director = cclegacy.director;
    const root = director.root;
    const pipeline = root.pipeline as WebPipeline;
    if (skybox.reflectionMap) {
        const texture = skybox.reflectionMap.getGFXTexture()!;
        const sampler: Sampler = root.device.getSampler(skybox.reflectionMap.getSamplerInfo());
        setter.setTexture('cc_environment', texture);
        setter.setSampler('cc_environment', sampler);
    } else {
        const envmap = skybox.envmap ? skybox.envmap : builtinResMgr.get<TextureCube>('default-cube-texture');
        if (envmap) {
            const texture = envmap.getGFXTexture()!;
            const sampler: Sampler = root.device.getSampler(envmap.getSamplerInfo());
            setter.setTexture('cc_environment', texture);
            setter.setSampler('cc_environment', sampler);
        }
    }
    const diffuseMap = skybox.diffuseMap ? skybox.diffuseMap : builtinResMgr.get<TextureCube>('default-cube-texture');
    if (diffuseMap) {
        const texture = diffuseMap.getGFXTexture()!;
        const sampler: Sampler = root.device.getSampler(diffuseMap.getSamplerInfo());
        setter.setTexture('cc_diffuseMap', texture);
        setter.setSampler('cc_diffuseMap', sampler);
    }
    if (!setter.hasSampler('cc_shadowMap')) {
        setter.setSampler('cc_shadowMap', pipeline.defaultSampler);
    }
    if (!setter.hasTexture('cc_shadowMap')) {
        setter.setTexture('cc_shadowMap', pipeline.defaultTexture);
    }
    if (!setter.hasSampler('cc_spotShadowMap')) {
        setter.setSampler('cc_spotShadowMap', pipeline.defaultSampler);
    }
    if (!setter.hasTexture('cc_spotShadowMap')) {
        setter.setTexture('cc_spotShadowMap', pipeline.defaultTexture);
    }
}

function getFirstChildLayoutName (lg: LayoutGraphData, parentID: number): string {
    if (lg.numVertices() && parentID !== 0xFFFFFFFF && lg.numChildren(parentID)) {
        const childNodes = lg.children(parentID);
        if (childNodes.next().value && childNodes.next().value.target !== lg.nullVertex()) {
            const ququeLayoutID: number = childNodes.next().value.target;
            return lg.getName(ququeLayoutID);
        }
    }
    return '';
}

function getTextureType (dimension: ResourceDimension, arraySize: number): TextureType {
    switch (dimension) {
    case ResourceDimension.TEXTURE1D:
        return arraySize > 1 ? TextureType.TEX1D_ARRAY : TextureType.TEX1D;
    case ResourceDimension.TEXTURE2D:
        return arraySize > 1 ? TextureType.TEX2D_ARRAY : TextureType.TEX2D;
    case ResourceDimension.TEXTURE3D:
        return TextureType.TEX3D;
    case ResourceDimension.BUFFER:
        return TextureType.TEX2D;
    default:
        break;
    }
    return TextureType.TEX2D;
}

function getResourceDimension (type: TextureType): ResourceDimension {
    switch (type) {
    case TextureType.TEX1D:
    case TextureType.TEX1D_ARRAY:
        return ResourceDimension.TEXTURE1D;
    case TextureType.TEX2D:
    case TextureType.TEX2D_ARRAY:
    case TextureType.CUBE:
        return ResourceDimension.TEXTURE2D;
    case TextureType.TEX3D:
        return ResourceDimension.TEXTURE3D;
    default:
        break;
    }
    return ResourceDimension.TEXTURE2D;
}

export class WebSceneBuilder extends WebSetter implements SceneBuilder {
    constructor (
        data: RenderData,
        layoutGraph: LayoutGraphData,
        rg: RenderGraph,
        sceneId: number,
        scene: SceneData,
    ) {
        super(data, layoutGraph);
        this._renderGraph = rg;
        this._scene = scene;
        this._vertID = sceneId;
    }
    update (
        data: RenderData,
        layoutGraph: LayoutGraphData,
        rg: RenderGraph,
        sceneId: number,
        scene: SceneData,
    ): void {
        this._data = data;
        this._lg = layoutGraph;
        this._renderGraph = rg;
        this._scene = scene;
        this._vertID = sceneId;
    }

    useLightFrustum (light: Light, csmLevel = 0, optCamera: Camera | undefined = undefined): void {
        this._scene.light.light = light;
        this._scene.light.level = csmLevel;
        this._scene.light.culledByLight = true;
        if (optCamera) {
            this._scene.camera = optCamera;
        }
        if (this._scene.flags & SceneFlags.NON_BUILTIN) {
            return;
        }
        const queueId = this._renderGraph.getParent(this._vertID);
        const passId = this._renderGraph.getParent(queueId);
        const layoutName = this._renderGraph.getLayout(passId);
        setShadowUBOLightView(this, this._scene.camera, light, csmLevel, layoutName);
    }
    private _renderGraph: RenderGraph;
    private _scene: SceneData;
}

export class WebRenderQueueBuilder extends WebSetter implements RenderQueueBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._queue = queue;
        this._pipeline = pipeline;
    }
    update (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData): void {
        this._data = data;
        this._lg = layoutGraph;
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._queue = queue;
        this._pipeline = pipeline;
    }

    setArrayBuffer (name: string, arrayBuffer: ArrayBuffer): void {
        throw new Error('Method not implemented.');
    }
    get name (): string {
        return this._renderGraph.getName(this._vertID);
    }
    set name (name: string) {
        this._renderGraph.setName(this._vertID, name);
    }

    addSceneOfCamera (camera: Camera, light: LightInfo, sceneFlags = SceneFlags.NONE, name = 'Camera'): void {
        const lightTarget = light.light;
        const sceneData = renderGraphPool.createSceneData(
            camera.scene,
            camera,
            sceneFlags,
            lightTarget && !(sceneFlags & SceneFlags.SHADOW_CASTER) ? CullingFlags.CAMERA_FRUSTUM | CullingFlags.LIGHT_BOUNDS : CullingFlags.CAMERA_FRUSTUM,
            lightTarget,
        );
        this._renderGraph.addVertex<RenderGraphValue.Scene>(RenderGraphValue.Scene, sceneData, name, '', renderGraphPool.createRenderData(), false, this._vertID);
        const layoutName = this.getParentLayout();
        const scene: Scene = cclegacy.director.getScene();
        setCameraUBOValues(
            this,
            camera,
            this._pipeline,
            camera.scene || (scene ? scene.renderScene : null),
            layoutName,
        );
        if (sceneFlags & SceneFlags.SHADOW_CASTER || (lightTarget && lightTarget.type !== LightType.DIRECTIONAL)) {
            setShadowUBOLightView(this, camera, lightTarget!, light.level, layoutName);
        } else {
            setShadowUBOView(this, camera, layoutName);
        }
        setTextureUBOView(this, camera, this._pipeline);
        initGlobalDescBinding(this._data, layoutName);
    }
    addScene (camera: Camera, sceneFlags = SceneFlags.NONE, light: Light | undefined = undefined): SceneBuilder {
        const sceneData = renderGraphPool.createSceneData(
            camera.scene,
            camera,
            sceneFlags,
            light && !(sceneFlags & SceneFlags.SHADOW_CASTER) ? CullingFlags.CAMERA_FRUSTUM | CullingFlags.LIGHT_BOUNDS : CullingFlags.CAMERA_FRUSTUM,
            light,
        );
        const renderData = renderGraphPool.createRenderData();
        const sceneId = this._renderGraph.addVertex<RenderGraphValue.Scene>(RenderGraphValue.Scene, sceneData, 'Scene', '', renderData, false, this._vertID);
        if (!(sceneFlags & SceneFlags.NON_BUILTIN)) {
            const layoutName = this.getParentLayout();
            setCameraUBOValues(
                this,
                camera,
                this._pipeline,
                camera.scene,
                layoutName,
            );
            if (light && light.type !== LightType.DIRECTIONAL) setShadowUBOLightView(this, camera, light, 0, layoutName);
            else if (!(sceneFlags & SceneFlags.SHADOW_CASTER)) setShadowUBOView(this, camera, layoutName);
            setTextureUBOView(this, camera, this._pipeline);
            initGlobalDescBinding(this._data, layoutName);
        }
        const sceneBuilder = pipelinePool.sceneBuilder.add();
        sceneBuilder.update(renderData, this._lg, this._renderGraph, sceneId, sceneData);
        return sceneBuilder;
    }
    addFullscreenQuad (material: Material, passID: number, sceneFlags = SceneFlags.NONE, name = 'Quad'): void {
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit,
            renderGraphPool.createBlit(material, passID, sceneFlags, null),
            name,
            '',
            renderGraphPool.createRenderData(),
            false,
            this._vertID,
        );
        const layoutName = this.getParentLayout();
        const scene: Scene | null = cclegacy.director.getScene();
        setCameraUBOValues(
            this,
            null,
            this._pipeline,
            scene ? scene.renderScene : null,
            layoutName,
        );
        if (sceneFlags & SceneFlags.SHADOW_CASTER) {
            // setShadowUBOLightView(this, light.light!, light.level);
        } else {
            setShadowUBOView(this, null, layoutName);
        }
        setTextureUBOView(this, null, this._pipeline);
        initGlobalDescBinding(this._data, layoutName);
    }
    addCameraQuad (camera: Camera, material: Material, passID: number, sceneFlags = SceneFlags.NONE): void {
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit,
            renderGraphPool.createBlit(material, passID, sceneFlags, camera),
            'CameraQuad',
            '',
            renderGraphPool.createRenderData(),
            false,
            this._vertID,
        );
        const layoutName = this.getParentLayout();
        const scene: Scene = cclegacy.director.getScene();
        setCameraUBOValues(
            this,
            camera,
            this._pipeline,
            camera.scene || (scene ? scene.renderScene : null),
            layoutName,
        );
        if (sceneFlags & SceneFlags.SHADOW_CASTER) {
            // setShadowUBOLightView(this, light.light!, light.level);
        } else {
            setShadowUBOView(this, camera, layoutName);
        }
        setTextureUBOView(this, camera, this._pipeline);
        initGlobalDescBinding(this._data, layoutName);
    }
    clearRenderTarget (name: string, color: Color = new Color()): void {
        const clearView = renderGraphPool.createClearView(name, ClearFlagBit.COLOR);
        clearView.clearColor.copy(color);
        this._renderGraph.addVertex<RenderGraphValue.Clear>(
            RenderGraphValue.Clear,
            [clearView],
            'ClearRenderTarget',
            '',
            renderGraphPool.createRenderData(),
            false,
            this._vertID,
        );
    }
    setViewport (viewport: Viewport): void {
        const currViewport = pipelinePool.viewport.add();
        this._queue.viewport =  currViewport.copy(viewport);
    }
    addCustomCommand (customBehavior: string): void {
        throw new Error('Method not implemented.');
    }
    private _renderGraph: RenderGraph;
    private _queue: RenderQueue;
    private _pipeline: PipelineSceneData;
}

export class WebRenderSubpassBuilder extends WebSetter implements RenderSubpassBuilder {
    constructor (
        data: RenderData,
        renderGraph: RenderGraph,
        layoutGraph: LayoutGraphData,
        vertID: number,
        subpass: RasterSubpass,
        pipeline: PipelineSceneData,
    ) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._subpass = subpass;
        this._pipeline = pipeline;

        const layoutName = this._renderGraph.component<RenderGraphComponent.Layout>(RenderGraphComponent.Layout, this._vertID);
        this._layoutID = layoutGraph.locateChild(layoutGraph.nullVertex(), layoutName);
    }
    update (
        data: RenderData,
        renderGraph: RenderGraph,
        layoutGraph: LayoutGraphData,
        vertID: number,
        subpass: RasterSubpass,
        pipeline: PipelineSceneData,
    ): void {
        this._data = data;
        this._lg = layoutGraph;
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._subpass = subpass;
        this._pipeline = pipeline;

        const layoutName = this._renderGraph.component<RenderGraphComponent.Layout>(RenderGraphComponent.Layout, this._vertID);
        this._layoutID = layoutGraph.locateChild(layoutGraph.nullVertex(), layoutName);
    }
    addRenderTarget (name: string, accessType: AccessType, slotName?: string | undefined, loadOp?: LoadOp | undefined, storeOp?: StoreOp | undefined, color?: Color | undefined): void {
        throw new Error('Method not implemented.');
    }
    setCustomShaderStages (name: string, stageFlags: ShaderStageFlagBit): void {
        throw new Error('Method not implemented.');
    }
    setArrayBuffer (name: string, arrayBuffer: ArrayBuffer): void {
        throw new Error('Method not implemented.');
    }
    get name (): string {
        return this._renderGraph.getName(this._vertID);
    }
    set name (name: string) {
        this._renderGraph.setName(this._vertID, name);
    }

    addDepthStencil (name: string, accessType: AccessType, depthSlotName = '', stencilSlotName = '', loadOp = LoadOp.CLEAR, storeOp = StoreOp.STORE, depth = 1, stencil = 0, clearFlag = ClearFlagBit.DEPTH_STENCIL): void {
        throw new Error('Method not implemented.');
    }
    addTexture (name: string, slotName: string, sampler: Sampler | null = null): void {
        throw new Error('Method not implemented.');
    }
    addStorageBuffer (name: string, accessType: AccessType, slotName: string): void {
        throw new Error('Method not implemented.');
    }
    addStorageImage (name: string, accessType: AccessType, slotName: string): void {
        throw new Error('Method not implemented.');
    }
    setViewport (viewport: Viewport): void {
        throw new Error('Method not implemented.');
    }
    addQueue (hint: QueueHint = QueueHint.RENDER_OPAQUE, layoutName = 'default'): RenderQueueBuilder {
        const layoutId = this._lg.locateChild(this._layoutID, layoutName);
        if (DEBUG) {
            assert(layoutId !== 0xFFFFFFFF);
        }
        const queue = renderGraphPool.createRenderQueue(hint, layoutId);
        const data = renderGraphPool.createRenderData();
        const queueID = this._renderGraph.addVertex<RenderGraphValue.Queue>(RenderGraphValue.Queue, queue, '', layoutName, data, false, this._vertID);
        const queueBuilder = pipelinePool.renderQueueBuilder.add();
        queueBuilder.update(data, this._renderGraph, this._lg, queueID, queue, this._pipeline);
        return queueBuilder;
    }
    get showStatistics (): boolean {
        return this._subpass.showStatistics;
    }
    set showStatistics (enable: boolean) {
        this._subpass.showStatistics = enable;
    }
    private _renderGraph: RenderGraph;
    private _layoutID: number;
    private _subpass: RasterSubpass;
    private _pipeline: PipelineSceneData;
}

export class WebRenderPassBuilder extends WebSetter implements BasicMultisampleRenderPassBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, resourceGraph: ResourceGraph, vertID: number, pass: RasterPass, pipeline: PipelineSceneData) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._resourceGraph = resourceGraph;
        this._vertID = vertID;
        this._pass = pass;
        this._pipeline = pipeline;
        const layoutName = this._renderGraph.component<RenderGraphComponent.Layout>(RenderGraphComponent.Layout, this._vertID);
        this._layoutID = layoutGraph.locateChild(layoutGraph.nullVertex(), layoutName);
    }
    update (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, resourceGraph: ResourceGraph, vertID: number, pass: RasterPass, pipeline: PipelineSceneData): void {
        this._renderGraph = renderGraph;
        this._lg = layoutGraph;
        this._resourceGraph = resourceGraph;
        this._vertID = vertID;
        this._pass = pass;
        this._pipeline = pipeline;
        this._data = data;
        const layoutName = this._renderGraph.component<RenderGraphComponent.Layout>(RenderGraphComponent.Layout, this._vertID);
        this._layoutID = layoutGraph.locateChild(layoutGraph.nullVertex(), layoutName);
    }

    setCustomShaderStages (name: string, stageFlags: ShaderStageFlagBit): void {
        throw new Error('Method not implemented.');
    }
    setArrayBuffer (name: string, arrayBuffer: ArrayBuffer): void {
        throw new Error('Method not implemented.');
    }
    setVersion (name: string, version: number): void {
        this._pass.versionName = name;
        this._pass.version = version;
    }
    get name (): string {
        return this._renderGraph.getName(this._vertID);
    }
    set name (name: string) {
        this._renderGraph.setName(this._vertID, name);
    }
    addRenderTarget (name: string, loadOp = LoadOp.CLEAR, storeOp = StoreOp.STORE, clearColor = new Color()): void {
        if (DEBUG) {
            assert(Boolean(name && this._resourceGraph.contains(name)));
        }
        let clearFlag = ClearFlagBit.COLOR;
        if (loadOp === LoadOp.LOAD) {
            clearFlag = ClearFlagBit.NONE;
        }
        const view = renderGraphPool.createRasterView(
            '',
            AccessType.WRITE,

            AttachmentType.RENDER_TARGET,
            loadOp,
            storeOp,
            clearFlag,
        );
        view.clearColor.copy(clearColor);
        this._pass.rasterViews.set(name, view);
    }
    addDepthStencil (name: string, loadOp = LoadOp.CLEAR, storeOp = StoreOp.STORE, depth = 1, stencil = 0, clearFlag = ClearFlagBit.DEPTH_STENCIL): void {
        if (DEBUG) {
            assert(Boolean(name && this._resourceGraph.contains(name)));
        }
        const view = renderGraphPool.createRasterView(
            '',
            AccessType.WRITE,

            AttachmentType.DEPTH_STENCIL,
            loadOp,
            storeOp,
            clearFlag,
        );
        view.clearColor.set(depth, stencil, 0, 0);
        this._pass.rasterViews.set(name, view);
    }
    resolveRenderTarget (source: string, target: string): void {
        // TODO
    }
    resolveDepthStencil (
        source: string,
        target: string,
        depthMode?: ResolveMode,
        stencilMode?: ResolveMode,
    ): void {
        // TODO
    }
    private _addComputeResource (name: string, accessType: AccessType, slotName: string): void {
        const view = renderGraphPool.createComputeView(slotName);
        view.accessType = accessType;
        if (DEBUG) {
            assert(Boolean(view.name));
            assert(Boolean(name && this._resourceGraph.contains(name)));
            const descriptorName = view.name;
            const descriptorID = this._lg.attributeIndex.get(descriptorName);
            assert(descriptorID !== undefined);
        }
        if (this._pass.computeViews.has(name)) {
            this._pass.computeViews.get(name)?.push(view);
        } else {
            this._pass.computeViews.set(name, [view]);
        }
    }
    addTexture (name: string, slotName: string, sampler: Sampler | null = null): void {
        this._addComputeResource(name, AccessType.READ, slotName);
        if (sampler) {
            const descriptorID = this._lg.attributeIndex.get(slotName)!;
            this._data.samplers.set(descriptorID, sampler);
        }
    }
    addStorageBuffer (name: string, accessType: AccessType, slotName: string): void {
        this._addComputeResource(name, accessType, slotName);
    }
    addStorageImage (name: string, accessType: AccessType, slotName: string): void {
        this._addComputeResource(name, accessType, slotName);
    }
    addRenderSubpass (layoutName = ''): RenderSubpassBuilder {
        const name = 'Raster';
        const subpassID = this._pass.subpassGraph.numVertices();
        this._pass.subpassGraph.addVertex(name, renderGraphPool.createSubpass());
        const subpass = renderGraphPool.createRasterSubpass(subpassID, 1, 0);
        const data = renderGraphPool.createRenderData();
        const vertID = this._renderGraph.addVertex<RenderGraphValue.RasterSubpass>(RenderGraphValue.RasterSubpass, subpass, name, layoutName, data, false);
        const result = pipelinePool.renderSubpassBuilder.add();
        result.update(data, this._renderGraph, this._lg, vertID, subpass, this._pipeline);
        return result;
    }
    addQueue (hint: QueueHint = QueueHint.RENDER_OPAQUE, layoutName = 'default'): WebRenderQueueBuilder {
        const layoutId = this._lg.locateChild(this._layoutID, layoutName);
        if (DEBUG) {
            assert(layoutId !== 0xFFFFFFFF);
        }
        const queue = renderGraphPool.createRenderQueue(hint, layoutId);
        const data = renderGraphPool.createRenderData();
        const queueID = this._renderGraph.addVertex<RenderGraphValue.Queue>(RenderGraphValue.Queue, queue, '', layoutName, data, false, this._vertID);
        const result = pipelinePool.renderQueueBuilder.add();
        result.update(data, this._renderGraph, this._lg, queueID, queue, this._pipeline);
        return result;
    }

    addFullscreenQuad (material: Material, passID: number, sceneFlags = SceneFlags.NONE, name = 'FullscreenQuad'): void {
        const queue = renderGraphPool.createRenderQueue(QueueHint.RENDER_TRANSPARENT);
        const queueId = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue,
            queue,
            'Queue',
            '',
            renderGraphPool.createRenderData(),
            false,
            this._vertID,
        );
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit,
            renderGraphPool.createBlit(material, passID, sceneFlags, null),
            name,
            '',
            renderGraphPool.createRenderData(),
            false,
            queueId,
        );
    }

    addCameraQuad (camera: Camera, material: Material, passID: number, sceneFlags: SceneFlags, name = 'CameraQuad'): void {
        const queue = renderGraphPool.createRenderQueue(QueueHint.RENDER_TRANSPARENT);
        const queueId = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue,
            queue,
            'Queue',
            '',
            renderGraphPool.createRenderData(),
            false,
            this._vertID,
        );
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit,
            renderGraphPool.createBlit(material, passID, sceneFlags, camera),
            name,
            '',
            renderGraphPool.createRenderData(),
            false,
            queueId,
        );
    }
    setViewport (viewport: Viewport): void {
        this._pass.viewport.copy(viewport);
    }
    get showStatistics (): boolean {
        return this._pass.showStatistics;
    }
    set showStatistics (enable: boolean) {
        this._pass.showStatistics = enable;
    }
    private _renderGraph: RenderGraph;
    private _layoutID: number;
    private _pass: RasterPass;
    private _pipeline: PipelineSceneData;
    private _resourceGraph: ResourceGraph;
}

export class WebComputeQueueBuilder extends WebSetter implements ComputeQueueBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._queue = queue;
        this._pipeline = pipeline;
    }
    update (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData): void {
        this._data = data;
        this._lg = layoutGraph;
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._queue = queue;
        this._pipeline = pipeline;
    }
    setArrayBuffer (name: string, arrayBuffer: ArrayBuffer): void {
        throw new Error('Method not implemented.');
    }
    get name (): string {
        return this._renderGraph.getName(this._vertID);
    }
    set name (name: string) {
        this._renderGraph.setName(this._vertID, name);
    }
    addDispatch (
        threadGroupCountX: number,
        threadGroupCountY: number,
        threadGroupCountZ: number,
        material: Material | null = null,
        passID = 0,
        name = 'Dispatch',
    ): void {
        this._renderGraph.addVertex<RenderGraphValue.Dispatch>(
            RenderGraphValue.Dispatch,
            renderGraphPool.createDispatch(material, passID, threadGroupCountX, threadGroupCountY, threadGroupCountZ),
            name,

            '',

            renderGraphPool.createRenderData(),

            false,

            this._vertID,
        );
    }
    private _renderGraph: RenderGraph;
    private _queue: RenderQueue;
    private _pipeline: PipelineSceneData;
}

export class WebComputePassBuilder extends WebSetter implements ComputePassBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, resourceGraph: ResourceGraph, vertID: number, pass: ComputePass, pipeline: PipelineSceneData) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._resourceGraph = resourceGraph;
        this._vertID = vertID;
        this._pass = pass;
        this._pipeline = pipeline;

        const layoutName = this._renderGraph.component<RenderGraphComponent.Layout>(RenderGraphComponent.Layout, this._vertID);
        this._layoutID = layoutGraph.locateChild(layoutGraph.nullVertex(), layoutName);
    }
    update (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, resourceGraph: ResourceGraph, vertID: number, pass: ComputePass, pipeline: PipelineSceneData): void {
        this._data = data;
        this._renderGraph = renderGraph;
        this._lg = layoutGraph;
        this._resourceGraph = resourceGraph;
        this._vertID = vertID;
        this._pass = pass;
        this._pipeline = pipeline;

        const layoutName = this._renderGraph.component<RenderGraphComponent.Layout>(RenderGraphComponent.Layout, this._vertID);
        this._layoutID = layoutGraph.locateChild(layoutGraph.nullVertex(), layoutName);
    }
    setCustomShaderStages (name: string, stageFlags: ShaderStageFlagBit): void {
        throw new Error('Method not implemented.');
    }
    setArrayBuffer (name: string, arrayBuffer: ArrayBuffer): void {
        throw new Error('Method not implemented.');
    }
    get name (): string {
        return this._renderGraph.getName(this._vertID);
    }
    set name (name: string) {
        this._renderGraph.setName(this._vertID, name);
    }
    addTexture (name: string, slotName: string, sampler: Sampler | null = null): void {
        throw new Error('Method not implemented.');
    }
    addStorageBuffer (name: string, accessType: AccessType, slotName: string): void {
        this._addComputeResource(name, accessType, slotName);
    }
    addStorageImage (name: string, accessType: AccessType, slotName: string): void {
        this._addComputeResource(name, accessType, slotName);
    }
    addMaterialTexture (resourceName: string, flags?: ShaderStageFlagBit | undefined): void {
        throw new Error('Method not implemented.');
    }
    addQueue (layoutName = 'default'): WebComputeQueueBuilder {
        const layoutId = this._lg.locateChild(this._layoutID, layoutName);
        if (DEBUG) {
            assert(layoutId !== 0xFFFFFFFF);
        }
        const queue = renderGraphPool.createRenderQueue(QueueHint.RENDER_OPAQUE, layoutId);
        const data = renderGraphPool.createRenderData();
        const queueID = this._renderGraph.addVertex<RenderGraphValue.Queue>(RenderGraphValue.Queue, queue, '', layoutName, data, false, this._vertID);
        const computeQueueBuilder = pipelinePool.computeQueueBuilder.add();
        computeQueueBuilder.update(data, this._renderGraph, this._lg, queueID, queue, this._pipeline);
        return computeQueueBuilder;
    }

    private _addComputeResource (name: string, accessType: AccessType, slotName: string): void {
        const view = renderGraphPool.createComputeView(slotName);
        view.accessType = accessType;
        if (DEBUG) {
            assert(Boolean(view.name));
            assert(Boolean(name && this._resourceGraph.contains(name)));
            const descriptorName = view.name;
            const descriptorID = this._lg.attributeIndex.get(descriptorName);
            assert(descriptorID !== undefined);
        }
        if (this._pass.computeViews.has(name)) {
            this._pass.computeViews.get(name)?.push(view);
        } else {
            this._pass.computeViews.set(name, [view]);
        }
    }

    private _renderGraph: RenderGraph;
    private _resourceGraph: ResourceGraph;
    private _layoutID: number;
    private _pass: ComputePass;
    private _pipeline: PipelineSceneData;
}

export class WebMovePassBuilder {
    constructor (renderGraph: RenderGraph, vertID: number, pass: MovePass) {
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._pass = pass;
    }
    setCustomBehavior (name: string): void {
        throw new Error('Method not implemented.');
    }
    get name (): string {
        return this._renderGraph.getName(this._vertID);
    }
    set name (name: string) {
        this._renderGraph.setName(this._vertID, name);
    }
    addPair (pair: MovePair): void {
        this._pass.movePairs.push(pair);
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _pass: MovePass;
}

export class WebCopyPassBuilder {
    constructor (renderGraph: RenderGraph, vertID: number, pass: CopyPass) {
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._pass = pass;
    }
    addPair (pair: CopyPair): void {
        throw new Error('Method not implemented.');
    }
    setCustomBehavior (name: string): void {
        throw new Error('Method not implemented.');
    }
    get name (): string {
        return this._renderGraph.getName(this._vertID);
    }
    set name (name: string) {
        this._renderGraph.setName(this._vertID, name);
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _pass: CopyPass;
}

function isManaged (residency: ResourceResidency): boolean {
    return residency === ResourceResidency.MANAGED
        || residency === ResourceResidency.MEMORYLESS;
}

export class WebPipeline implements BasicPipeline {
    constructor (layoutGraph: LayoutGraphData) {
        this._layoutGraph = layoutGraph;
    }
    get type (): PipelineType {
        return PipelineType.BASIC;
    }
    get capabilities (): PipelineCapabilities {
        return new PipelineCapabilities();
    }
    get enableCpuLightCulling (): boolean {
        if (!this._executor) {
            return true;
        }
        return this._executor._context.culling.enableLightCulling;
    }
    set enableCpuLightCulling (enable: boolean) {
        if (!this._executor) {
            return;
        }
        this._executor._context.culling.enableLightCulling = enable;
    }
    addCustomBuffer (name: string, info: BufferInfo, type: string): number {
        throw new Error('Method not implemented.');
    }
    addCustomTexture (name: string, info: TextureInfo, type: string): number {
        throw new Error('Method not implemented.');
    }
    addRenderWindow (name: string, format: Format, width: number, height: number, renderWindow: RenderWindow): number {
        const resID = this._resourceGraph.find(name);
        if (resID !== 0xFFFFFFFF) {
            this.updateRenderWindow(name, renderWindow);
            return resID;
        }
        // Objects need to be held for a long time, so there is no need to use pool management
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.flags = ResourceFlags.COLOR_ATTACHMENT;

        if (renderWindow.swapchain === null) {
            assert(renderWindow.framebuffer.colorTextures.length === 1
                && renderWindow.framebuffer.colorTextures[0] !== null);
            desc.sampleCount = renderWindow.framebuffer.colorTextures[0].info.samples;
            return this._resourceGraph.addVertex<ResourceGraphValue.Framebuffer>(
                ResourceGraphValue.Framebuffer,
                renderWindow.framebuffer,
                name,

                desc,
                new ResourceTraits(ResourceResidency.EXTERNAL),
                new ResourceStates(),
                new SamplerInfo(),
            );
        } else {
            return this._resourceGraph.addVertex<ResourceGraphValue.Swapchain>(
                ResourceGraphValue.Swapchain,
                new RenderSwapchain(renderWindow.swapchain),
                name,

                desc,
                new ResourceTraits(ResourceResidency.BACKBUFFER),
                new ResourceStates(),
                new SamplerInfo(),
            );
        }
    }
    updateRenderWindow (name: string, renderWindow: RenderWindow): void {
        const resId = this.resourceGraph.vertex(name);
        const desc = this.resourceGraph.getDesc(resId);
        desc.width = renderWindow.width;
        desc.height = renderWindow.height;
        const currFbo = this.resourceGraph._vertices[resId]._object;
        if (currFbo !== renderWindow.framebuffer) {
            this.resourceGraph._vertices[resId]._object = renderWindow.framebuffer;
        }
    }
    updateStorageBuffer (name: string, size: number, format = Format.UNKNOWN): void {
        const resId = this.resourceGraph.vertex(name);
        const desc = this.resourceGraph.getDesc(resId);
        desc.width = size;
        if (format !== Format.UNKNOWN) {
            desc.format = format;
        }
    }
    updateRenderTarget (name: string, width: number, height: number, format: Format = Format.UNKNOWN): void {
        const resId = this.resourceGraph.vertex(name);
        const desc = this.resourceGraph.getDesc(resId);
        desc.width = width;
        desc.height = height;
        if (format !== Format.UNKNOWN) desc.format = format;
    }
    updateDepthStencil (name: string, width: number, height: number, format: Format = Format.UNKNOWN): void {
        const resId = this.resourceGraph.vertex(name);
        const desc = this.resourceGraph.getDesc(resId);
        desc.width = width;
        desc.height = height;
        if (format !== Format.UNKNOWN) desc.format = format;
    }
    updateStorageTexture (name: string, width: number, height: number, format = Format.UNKNOWN): void {
        const resId = this.resourceGraph.vertex(name);
        const desc = this.resourceGraph.getDesc(resId);
        desc.width = width;
        desc.height = height;
        if (format !== Format.UNKNOWN) {
            desc.format = format;
        }
    }
    updateShadingRateTexture (name: string, width: number, height: number): void {
        const resId = this.resourceGraph.vertex(name);
        const desc = this.resourceGraph.getDesc(resId);
        desc.width = width;
        desc.height = height;
    }

    public addBuffer (name: string, size: number, flags: ResourceFlags, residency: ResourceResidency): number {
        const resID = this._resourceGraph.find(name);
        if (resID !== 0xFFFFFFFF) {
            this.updateBuffer(name, size);
            return resID;
        }
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.BUFFER;
        desc.width = size;
        desc.flags = flags;
        return this._resourceGraph.addVertex<ResourceGraphValue.Managed>(
            ResourceGraphValue.Managed,
            new ManagedResource(),
            name,

            desc,
            new ResourceTraits(residency),
            new ResourceStates(),
            new SamplerInfo(Filter.LINEAR, Filter.LINEAR, Filter.NONE, Address.CLAMP, Address.CLAMP, Address.CLAMP),
        );
    }

    public updateBuffer (name: string, size: number): void {
        this.updateResource(name, Format.UNKNOWN, size, 0, 0, 0, 0, SampleCount.X1);
    }

    public addExternalTexture (name: string, texture: Texture, flags: ResourceFlags): number {
        throw new Error('Method not implemented.');
    }

    public updateExternalTexture (name: string, texture: Texture): void {
        throw new Error('Method not implemented.');
    }

    public addTexture (name: string, textureType: TextureType, format: Format, width: number, height: number, depth: number, arraySize: number, mipLevels: number, sampleCount: SampleCount, flags: ResourceFlags, residency: ResourceResidency): number {
        const resID = this._resourceGraph.find(name);
        if (resID !== 0xFFFFFFFF) {
            this.updateTexture(name, format, width, height, depth, arraySize, mipLevels, sampleCount);
            return resID;
        }
        const desc = new ResourceDesc();
        desc.dimension = getResourceDimension(textureType);
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = desc.dimension === ResourceDimension.TEXTURE3D ? depth : arraySize;
        desc.mipLevels = mipLevels;
        desc.format = format;
        desc.sampleCount = sampleCount;
        desc.flags = flags;
        desc.viewType = textureType;
        return this._resourceGraph.addVertex<ResourceGraphValue.Managed>(
            ResourceGraphValue.Managed,
            new ManagedResource(),
            name,

            desc,
            new ResourceTraits(residency),
            new ResourceStates(),
            new SamplerInfo(Filter.LINEAR, Filter.LINEAR, Filter.NONE, Address.CLAMP, Address.CLAMP, Address.CLAMP),
        );
    }

    public updateTexture (name: string, format: Format, width: number, height: number, depth: number, arraySize: number, mipLevels: number, sampleCount: SampleCount): void {
        this.updateResource(name, format, width, height, depth, arraySize, mipLevels, sampleCount);
    }

    public addResource (name: string, dimension: ResourceDimension, format: Format, width: number, height: number, depth: number, arraySize: number, mipLevels: number, sampleCount: SampleCount, flags: ResourceFlags, residency: ResourceResidency): number {
        const resID = this._resourceGraph.find(name);
        if (resID !== 0xFFFFFFFF) {
            this.updateResource(name, format, width, height, depth, arraySize, mipLevels, sampleCount);
            return resID;
        }
        if (dimension === ResourceDimension.BUFFER) {
            return this.addBuffer(name, width, flags, residency);
        } else {
            return this.addTexture(name, getTextureType(dimension, arraySize), format, width, height, depth, arraySize, mipLevels, sampleCount, flags, residency);
        }
    }
    public updateResource (name: string, format: Format, width: number, height: number, depth: number, arraySize: number, mipLevels: number, sampleCount: SampleCount): void {
        const resId = this.resourceGraph.vertex(name);
        const desc = this.resourceGraph.getDesc(resId);
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = desc.dimension === ResourceDimension.TEXTURE3D ? depth : arraySize;
        desc.mipLevels = mipLevels;
        if (format !== Format.UNKNOWN) {
            desc.format = format;
        }
        desc.sampleCount = sampleCount;
    }
    public containsResource (name: string): boolean {
        return this._resourceGraph.contains(name);
    }
    public addResolvePass (resolvePairs: ResolvePair[]): void {
        // TODO: implement resolve pass
        throw new Error('Method not implemented.');
    }

    public addComputePass (passName: string): ComputePassBuilder {
        const name = 'Compute';
        const pass = renderGraphPool.createComputePass();

        const data = renderGraphPool.createRenderData();
        const vertID = this._renderGraph!.addVertex<RenderGraphValue.Compute>(RenderGraphValue.Compute, pass, name, passName, data, false);
        const result = pipelinePool.computePassBuilder.add();
        result.update(data, this._renderGraph!, this._layoutGraph, this._resourceGraph, vertID, pass, this._pipelineSceneData);
        setComputeConstants(result, passName);
        initGlobalDescBinding(data, passName);
        return result;
    }

    public addUploadPass (uploadPairs: UploadPair[]): void {
        const name = 'UploadPass';
        const pass = renderGraphPool.createCopyPass();
        for (const up of uploadPairs) {
            pass.uploadPairs.push(up);
        }

        const vertID = this._renderGraph!.addVertex<RenderGraphValue.Copy>(RenderGraphValue.Copy, pass, name, '', renderGraphPool.createRenderData(), false);
        // const result = new WebCopyPassBuilder(this._renderGraph!, vertID, pass);
    }

    public addCopyPass (copyPairs: CopyPair[]): void {
        // const renderData = new RenderData();
        // const vertID = this._renderGraph!.addVertex<RenderGraphValue.Copy>(
        //     RenderGraphValue.Copy, copyPass, 'copyPass', 'copy-pass', renderData, false,
        // );
        // const copyPass = new CopyPass();
        // copyPass.copyPairs.splice(0, copyPass.copyPairs.length, ...copyPairs);
        // const result = new WebCopyPassBuilder(this._renderGraph!, vertID, copyPass);
        // return result;
        for (const pair of copyPairs) {
            const targetName = pair.target;
            const tarVerId = this.resourceGraph.find(targetName);
            if (DEBUG) {
                const srcVerId = this.resourceGraph.find(pair.source);
                assert(srcVerId !== 0xFFFFFFFF, `The resource named ${pair.source} was not found in Resource Graph.`);
                assert(tarVerId !== 0xFFFFFFFF, `The resource named ${targetName} was not found in Resource Graph.`);
            }
            const resDesc = this.resourceGraph.getDesc(tarVerId);
            const currRaster = this.addRenderPass(resDesc.width, resDesc.height, 'copy-pass');
            currRaster.addRenderTarget(targetName, LoadOp.CLEAR, StoreOp.STORE, pipelinePool.createColor());
            currRaster.addTexture(pair.source, 'outputResultMap');
            currRaster.addQueue(QueueHint.NONE).addFullscreenQuad(this._copyPassMat, 0, SceneFlags.NONE);
        }
    }
    protected _generateConstantMacros (clusterEnabled: boolean): void {
        let str = '';
        str += `#define CC_DEVICE_SUPPORT_FLOAT_TEXTURE ${this._device.getFormatFeatures(Format.RGBA32F)
            & (FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE) ? 1 : 0}\n`;
        // str += `#define CC_ENABLE_CLUSTERED_LIGHT_CULLING ${clusterEnabled ? 1 : 0}\n`; // defined in material
        str += `#define CC_DEVICE_MAX_VERTEX_UNIFORM_VECTORS ${this._device.capabilities.maxVertexUniformVectors}\n`;
        str += `#define CC_DEVICE_MAX_FRAGMENT_UNIFORM_VECTORS ${this._device.capabilities.maxFragmentUniformVectors}\n`;
        str += `#define CC_DEVICE_CAN_BENEFIT_FROM_INPUT_ATTACHMENT ${this._device.hasFeature(Feature.INPUT_ATTACHMENT_BENEFIT) ? 1 : 0}\n`;
        str += `#define CC_PLATFORM_ANDROID_AND_WEBGL ${systemInfo.os === OS.ANDROID && systemInfo.isBrowser ? 1 : 0}\n`;
        str += `#define CC_ENABLE_WEBGL_HIGHP_STRUCT_VALUES ${macro.ENABLE_WEBGL_HIGHP_STRUCT_VALUES ? 1 : 0}\n`;
        const jointUniformCapacity = UBOSkinning.JOINT_UNIFORM_CAPACITY;
        str += `#define CC_JOINT_UNIFORM_CAPACITY ${jointUniformCapacity}\n`;
        this._constantMacros = str;
        this._layoutGraph.constantMacros = this._constantMacros;
    }
    public setCustomPipelineName (name: string): void {
        this._customPipelineName = name;
        if (this._customPipelineName === 'Deferred') {
            this._usesDeferredPipeline = true;
        }
    }

    public getGlobalDescriptorSetData (): DescriptorSetData | undefined {
        const stageId = this.layoutGraph.locateChild(this.layoutGraph.nullVertex(), 'default');
        assert(stageId !== 0xFFFFFFFF);
        const layout = this.layoutGraph.getLayout(stageId);
        const layoutData = layout.descriptorSets.get(UpdateFrequency.PER_PASS);
        return layoutData;
    }

    private _initCombineSignY (): void {
        const device = this._device;
        this._combineSignY = (device.capabilities.screenSpaceSignY * 0.5 + 0.5) << 1 | (device.capabilities.clipSpaceSignY * 0.5 + 0.5);
    }

    public getCombineSignY (): number {
        return this._combineSignY;
    }

    get globalDescriptorSetData (): DescriptorSetData {
        return this._globalDescSetData;
    }

    get defaultSampler (): Sampler {
        return this._defaultSampler;
    }

    get defaultTexture (): Texture {
        return builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!;
    }

    private _compileMaterial (): void {
        this._copyPassMat.initialize({
            effectName: 'pipeline/copy-pass',
        });
        for (let i = 0; i < this._copyPassMat.passes.length; ++i) {
            this._copyPassMat.passes[i].tryCompile();
        }
    }

    public activate (swapchain: Swapchain): boolean {
        this._device = deviceManager.gfxDevice;
        pipelinePool = new PipelinePool();
        renderGraphPool = pipelinePool.renderGraphPool;
        createGfxDescriptorSetsAndPipelines(this._device, this._layoutGraph);
        this._globalDSManager = new GlobalDSManager(this._device);
        this._globalDescSetData = this.getGlobalDescriptorSetData()!;
        this._globalDescriptorSetLayout = this._globalDescSetData.descriptorSetLayout;
        this._globalDescriptorSetInfo = new DescriptorSetInfo(this._globalDescriptorSetLayout!);
        this._globalDescriptorSet = this._device.createDescriptorSet(this._globalDescriptorSetInfo);
        this._globalDSManager.globalDescriptorSet = this.globalDescriptorSet;
        this._compileMaterial();
        this.setMacroBool('CC_USE_HDR', this._pipelineSceneData.isHDR);
        this.setMacroBool('CC_USE_FLOAT_OUTPUT', macro.ENABLE_FLOAT_OUTPUT && supportsRGBA16HalfFloatTexture(this._device));
        this._generateConstantMacros(false);
        this._pipelineSceneData.activate(this._device);
        this._pipelineUBO.activate(this._device, this);
        this._initCombineSignY();
        const isFloat = supportsR32FloatTexture(this._device) ? 0 : 1;
        this.setMacroInt('CC_SHADOWMAP_FORMAT', isFloat);
        // 0: SHADOWMAP_LINER_DEPTH_OFF, 1: SHADOWMAP_LINER_DEPTH_ON.
        const isLinear = this._device.gfxAPI === API.WEBGL ? 1 : 0;
        this.setMacroInt('CC_SHADOWMAP_USE_LINEAR_DEPTH', isLinear);
        const director: Director = cclegacy.director;
        const root: Root = director.root!;
        this._defaultSampler = root.device.getSampler(_samplerPointInfo);
        // 0: UNIFORM_VECTORS_LESS_EQUAL_64, 1: UNIFORM_VECTORS_GREATER_EQUAL_125.
        this.pipelineSceneData.csmSupported = this.device.capabilities.maxFragmentUniformVectors
            >= (WebPipeline.CSM_UNIFORM_VECTORS + WebPipeline.GLOBAL_UNIFORM_VECTORS);
        this.setMacroBool('CC_SUPPORT_CASCADED_SHADOW_MAP', this.pipelineSceneData.csmSupported);

        // 0: CC_SHADOW_NONE, 1: CC_SHADOW_PLANAR, 2: CC_SHADOW_MAP
        this.setMacroInt('CC_SHADOW_TYPE', 0);

        // 0: PCFType.HARD, 1: PCFType.SOFT, 2: PCFType.SOFT_2X, 3: PCFType.SOFT_4X
        this.setMacroInt('CC_DIR_SHADOW_PCF_TYPE', PCFType.HARD);

        // 0: CC_DIR_LIGHT_SHADOW_NONE, 1: CC_DIR_LIGHT_SHADOW_UNIFORM, 2: CC_DIR_LIGHT_SHADOW_CASCADED, 3: CC_DIR_LIGHT_SHADOW_VARIANCE
        this.setMacroInt('CC_DIR_LIGHT_SHADOW_TYPE', 0);

        // 0: CC_CASCADED_LAYERS_TRANSITION_OFF, 1: CC_CASCADED_LAYERS_TRANSITION_ON
        this.setMacroBool('CC_CASCADED_LAYERS_TRANSITION', false);

        // enable the deferred pipeline
        if (this.usesDeferredPipeline) {
            this.setMacroInt('CC_PIPELINE_TYPE', 1);
        }
        this._forward = new ForwardPipelineBuilder();
        this._deferred = new DeferredPipelineBuilder();
        this.builder = new CustomPipelineBuilder();
        return true;
    }
    public destroy (): boolean {
        this._globalDSManager?.globalDescriptorSet.destroy();
        this._globalDSManager?.destroy();
        this._pipelineSceneData?.destroy();
        return true;
    }
    public get device (): Device {
        return this._device;
    }
    public get lightingMode (): LightingMode {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._lightingMode;
    }
    public set lightingMode (mode: LightingMode) {
        this._lightingMode = mode;
    }
    public get usesDeferredPipeline (): boolean {
        return this._usesDeferredPipeline;
    }
    public get macros (): MacroRecord {
        return this._macros;
    }
    public get globalDSManager (): GlobalDSManager {
        return this._globalDSManager;
    }
    public get descriptorSetLayout (): DescriptorSetLayout {
        return this._globalDSManager.descriptorSetLayout;
    }
    public get descriptorSet (): DescriptorSet {
        return this._globalDSManager.globalDescriptorSet;
    }
    public get globalDescriptorSet (): DescriptorSet {
        return this._globalDescriptorSet!;
    }
    public get globalDescriptorSetInfo (): DescriptorSetInfo {
        return this._globalDescriptorSetInfo!;
    }
    public get commandBuffers (): CommandBuffer[] {
        return [this._device.commandBuffer];
    }
    public get pipelineSceneData (): PipelineSceneData {
        return this._pipelineSceneData;
    }
    public get constantMacros (): string {
        return this._constantMacros;
    }
    public get profiler (): Model | null {
        return this._profiler;
    }
    public set profiler (profiler: Model | null) {
        this._profiler = profiler;
    }
    public get geometryRenderer (): GeometryRenderer | null {
        throw new Error('Method not implemented.');
    }
    public get shadingScale (): number {
        return this._pipelineSceneData.shadingScale;
    }
    public set shadingScale (scale: number) {
        this._pipelineSceneData.shadingScale = scale;
    }
    public getMacroString (name: string): string {
        const str = this._macros[name];
        if (str === undefined) {
            return '';
        }
        return str as string;
    }
    public getMacroInt (name: string): number {
        const value = this._macros[name];
        if (value === undefined) {
            return 0;
        }
        return value as number;
    }
    public getMacroBool (name: string): boolean {
        const value = this._macros[name];
        if (value === undefined) {
            return false;
        }
        return value as boolean;
    }
    public getSamplerInfo (name: string): SamplerInfo | null {
        if (this.containsResource(name)) {
            const verId = this._resourceGraph.vertex(name);
            return this._resourceGraph.getSampler(verId);
        }
        return null;
    }
    public setMacroString (name: string, value: string): void {
        this._macros[name] = value;
    }
    public setMacroInt (name: string, value: number): void {
        this._macros[name] = value;
    }
    public setMacroBool (name: string, value: boolean): void {
        this._macros[name] = value;
    }
    public onGlobalPipelineStateChanged (): void {
        const builder = cclegacy.rendering.getCustomPipeline(macro.CUSTOM_PIPELINE_NAME);
        if (builder) {
            if (typeof builder.onGlobalPipelineStateChanged === 'function') {
                builder.onGlobalPipelineStateChanged();
            }
        }
    }
    beginSetup (): void {
        if (!this._renderGraph) this._renderGraph = new RenderGraph();
        pipelinePool.reset();
    }
    endSetup (): void {
        this.compile();
    }
    addStorageBuffer (name: string, format: Format, size: number, residency = ResourceResidency.MANAGED): number {
        const resID = this._resourceGraph.find(name);
        if (resID !== 0xFFFFFFFF) {
            this.updateStorageBuffer(name, size, format);
            return resID;
        }
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.BUFFER;
        desc.width = size;
        desc.height = 1;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.flags = ResourceFlags.STORAGE;

        if (residency === ResourceResidency.PERSISTENT) {
            return this._resourceGraph.addVertex<ResourceGraphValue.PersistentBuffer>(
                ResourceGraphValue.PersistentBuffer,
                new PersistentBuffer(),
                name,
                desc,
                new ResourceTraits(ResourceResidency.PERSISTENT),
                new ResourceStates(),
                new SamplerInfo(),
            );
        }

        return this._resourceGraph.addVertex<ResourceGraphValue.ManagedBuffer>(
            ResourceGraphValue.ManagedBuffer,
            new ManagedBuffer(),
            name,
            desc,
            new ResourceTraits(residency),
            new ResourceStates(),
            new SamplerInfo(),
        );
    }
    addRenderTarget (name: string, format: Format, width: number, height: number, residency = ResourceResidency.MANAGED): number {
        const resID = this._resourceGraph.find(name);
        if (resID !== 0xFFFFFFFF) {
            this.updateRenderTarget(name, width, height, format);
            return resID;
        }
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.sampleCount = SampleCount.X1;
        desc.flags = ResourceFlags.COLOR_ATTACHMENT | ResourceFlags.SAMPLED;

        return this._resourceGraph.addVertex<ResourceGraphValue.Managed>(
            ResourceGraphValue.Managed,
            new ManagedResource(),
            name,

            desc,
            new ResourceTraits(residency),
            new ResourceStates(),
            new SamplerInfo(Filter.LINEAR, Filter.LINEAR, Filter.NONE, Address.CLAMP, Address.CLAMP, Address.CLAMP),
        );
    }
    addDepthStencil (name: string, format: Format, width: number, height: number, residency = ResourceResidency.MANAGED): number {
        const resID = this._resourceGraph.find(name);
        if (resID !== 0xFFFFFFFF) {
            this.updateDepthStencil(name, width, height, format);
            return resID;
        }
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.sampleCount = SampleCount.X1;
        desc.flags = ResourceFlags.DEPTH_STENCIL_ATTACHMENT | ResourceFlags.SAMPLED;
        return this._resourceGraph.addVertex<ResourceGraphValue.Managed>(
            ResourceGraphValue.Managed,
            new ManagedResource(),
            name,

            desc,
            new ResourceTraits(residency),
            new ResourceStates(),
            new SamplerInfo(Filter.POINT, Filter.POINT, Filter.NONE),
        );
    }
    addStorageTexture (name: string, format: Format, width: number, height: number, residency = ResourceResidency.MANAGED): number {
        const resID = this._resourceGraph.find(name);
        if (resID !== 0xFFFFFFFF) {
            this.updateStorageTexture(name, width, height, format);
            return resID;
        }
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.flags = ResourceFlags.STORAGE | ResourceFlags.SAMPLED;
        return this._resourceGraph.addVertex<ResourceGraphValue.Managed>(
            ResourceGraphValue.Managed,
            new ManagedResource(),
            name,

            desc,
            new ResourceTraits(residency),
            new ResourceStates(),
            new SamplerInfo(Filter.POINT, Filter.POINT, Filter.NONE),
        );
    }
    addShadingRateTexture (name: string, width: number, height: number, residency = ResourceResidency.MANAGED): number {
        const resID = this._resourceGraph.find(name);
        if (resID !== 0xFFFFFFFF) {
            this.addShadingRateTexture(name, width, height);
            return resID;
        }
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = Format.R8UI;
        desc.flags = ResourceFlags.SHADING_RATE | ResourceFlags.STORAGE | ResourceFlags.SAMPLED;

        return this._resourceGraph.addVertex<ResourceGraphValue.Managed>(
            ResourceGraphValue.Managed,
            new ManagedResource(),
            name,

            desc,
            new ResourceTraits(residency),
            new ResourceStates(),
            new SamplerInfo(Filter.LINEAR, Filter.LINEAR, Filter.NONE, Address.CLAMP, Address.CLAMP, Address.CLAMP),
        );
    }
    beginFrame (): void {
        // noop
    }
    update (camera: Camera): void {
        // noop
    }
    endFrame (): void {
        this.renderGraph?.clear();
    }

    compile (): void {
        if (!this._renderGraph) {
            throw new Error('RenderGraph cannot be built without being created');
        }
        if (!this._compiler) {
            this._compiler = new Compiler(this, this._renderGraph, this._resourceGraph, this._layoutGraph);
        }
        this._compiler.compile(this._renderGraph);
    }

    execute (): void {
        if (!this._renderGraph) {
            throw new Error('Cannot run without creating rendergraph');
        }
        if (!this._executor) {
            this._executor = new Executor(
                this,
                this._pipelineUBO,
                this._device,
                this._resourceGraph,
                this.layoutGraph,
                this.width,
                this.height,
            );
        }
        this._executor.resize(this.width, this.height);
        this._executor.execute(this._renderGraph);
    }
    protected _applySize (cameras: Camera[]): void {
        let newWidth = this._width;
        let newHeight = this._height;
        cameras.forEach((camera): void => {
            const window = camera.window;
            newWidth = Math.max(window.width, newWidth);
            newHeight = Math.max(window.height, newHeight);
            if (!this._cameras.includes(camera)) {
                this._cameras.push(camera);
            }
        });
        if (newWidth !== this._width || newHeight !== this._height) {
            this._width = newWidth;
            this._height = newHeight;
        }
    }

    private _width = 0;
    private _height = 0;
    get width (): number { return this._width; }
    get height (): number { return this._height; }
    render (cameras: Camera[]): void {
        if (cameras.length === 0) {
            return;
        }
        this._applySize(cameras);
        decideProfilerCamera(cameras);
        // build graph
        this.beginFrame();
        this.execute();
        this.endFrame();
    }
    addBuiltinReflectionProbePass (camera: Camera): void {
        const reflectionProbeManager = cclegacy.internal.reflectionProbeManager as ReflectionProbeManager;
        if (!reflectionProbeManager) return;
        const probes = reflectionProbeManager.getProbes();
        if (probes.length === 0) return;
        for (let i = 0; i < probes.length; i++) {
            const probe = probes[i];
            if (probe.needRender) {
                if (probes[i].probeType === ProbeType.PLANAR) {
                    buildReflectionProbePass(camera, this, probe, probe.realtimePlanarTexture!.window!, 0);
                } else if (EDITOR) {
                    for (let faceIdx = 0; faceIdx < probe.bakedCubeTextures.length; faceIdx++) {
                        probe.updateCameraDir(faceIdx);
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        buildReflectionProbePass(camera, this, probe, probe.bakedCubeTextures[faceIdx].window!, faceIdx);
                    }
                    probe.needRender = false;
                }
            }
        }
    }
    addRenderPassImpl (width: number, height: number, layoutName: string, count = 1, quality = 0): BasicMultisampleRenderPassBuilder {
        if (DEBUG) {
            const stageId = this.layoutGraph.locateChild(this.layoutGraph.nullVertex(), layoutName);
            assert(stageId !== 0xFFFFFFFF);
            const layout = this.layoutGraph.getLayout(stageId);
            assert(Boolean(layout));
            assert(Boolean(layout.descriptorSets.get(UpdateFrequency.PER_PASS)));
        }
        const name = 'Raster';
        const pass = renderGraphPool.createRasterPass();
        pass.viewport.width = width;
        pass.viewport.height = height;
        pass.count = count;
        pass.quality = quality;

        const data = renderGraphPool.createRenderData();
        const vertID = this._renderGraph!.addVertex<RenderGraphValue.RasterPass>(RenderGraphValue.RasterPass, pass, name, layoutName, data, false);
        const result = pipelinePool.renderPassBuilder.add();
        result.update(data, this._renderGraph!, this._layoutGraph, this._resourceGraph, vertID, pass, this._pipelineSceneData);
        this._updateRasterPassConstants(result, width, height, layoutName);
        initGlobalDescBinding(data, layoutName);
        return result;
    }
    addRenderPass (width: number, height: number, layoutName = 'default'): BasicRenderPassBuilder {
        return this.addRenderPassImpl(width, height, layoutName);
    }
    addMultisampleRenderPass (width: number, height: number, count: number, quality: number, layoutName = 'default'): BasicMultisampleRenderPassBuilder {
        assert(count > 1);
        return this.addRenderPassImpl(width, height, layoutName, count, quality);
    }
    public getDescriptorSetLayout (shaderName: string, freq: UpdateFrequency): DescriptorSetLayout {
        const lg = this._layoutGraph;
        const phaseID = lg.shaderLayoutIndex.get(shaderName)!;
        const pplLayout = lg.getLayout(phaseID);
        const setLayout = pplLayout.descriptorSets.get(freq)!;
        return setLayout.descriptorSetLayout!;
    }
    get renderGraph (): RenderGraph | null {
        return this._renderGraph;
    }
    get resourceGraph (): ResourceGraph {
        return this._resourceGraph;
    }
    get layoutGraph (): LayoutGraphData {
        return this._layoutGraph;
    }

    get resourceUses (): string[] {
        return this._resourceUses;
    }

    protected _updateRasterPassConstants (setter: WebSetter, width: number, height: number, layoutName = 'default'): void {
        const director: Director = cclegacy.director;
        const root: Root = director.root!;
        const shadingWidth = width;
        const shadingHeight = height;
        const pipeline = root.pipeline as WebPipeline;
        const layoutGraph = pipeline.layoutGraph;
        // Global
        if (!setter.addConstant('CCGlobal', layoutName)) return;
        _uboVec.set(root.cumulativeTime, root.frameTime, director.getTotalFrames());
        setUniformOffset(setter, 'cc_time', Type.FLOAT4, _uboVec);

        _uboVec.set(shadingWidth, shadingHeight, 1.0 / shadingWidth, 1.0 / shadingHeight);
        setUniformOffset(setter, 'cc_screenSize', Type.FLOAT4, _uboVec);

        _uboVec.set(shadingWidth, shadingHeight, 1.0 / shadingWidth, 1.0 / shadingHeight);
        setUniformOffset(setter, 'cc_nativeSize', Type.FLOAT4, _uboVec);

        const debugView = root.debugView;
        _uboVec.set(0.0, 0.0, 0.0, 0.0);
        if (debugView) {
            const debugPackVec: number[] = [debugView.singleMode as number, 0.0, 0.0, 0.0];
            for (let i = DebugViewCompositeType.DIRECT_DIFFUSE as number; i < (DebugViewCompositeType.MAX_BIT_COUNT as number); i++) {
                const idx = i >> 3;
                const bit = i % 8;
                debugPackVec[idx + 1] += (debugView.isCompositeModeEnabled(i) ? 1.0 : 0.0) * (10.0 ** bit);
            }
            debugPackVec[3] += (debugView.lightingWithAlbedo ? 1.0 : 0.0) * (10.0 ** 6.0);
            debugPackVec[3] += (debugView.csmLayerColoration ? 1.0 : 0.0) * (10.0 ** 7.0);
            _uboVec.set(debugPackVec[0], debugPackVec[1], debugPackVec[2], debugPackVec[3]);
        }
        setUniformOffset(setter, 'cc_debug_view_mode', Type.FLOAT4, _uboVec);
    }

    public static MAX_BLOOM_FILTER_PASS_NUM = 6;
    private _usesDeferredPipeline = false;
    private _copyPassMat: Material = new Material();
    private _device!: Device;
    private _globalDSManager!: GlobalDSManager;
    private _defaultSampler!: Sampler;
    private _globalDescriptorSet: DescriptorSet | null = null;
    private _globalDescriptorSetInfo: DescriptorSetInfo | null = null;
    private _globalDescriptorSetLayout: DescriptorSetLayout | null = null;
    private readonly _macros: MacroRecord = {};
    private readonly _pipelineSceneData: PipelineSceneData = new PipelineSceneData();
    private _constantMacros = '';
    private _lightingMode = LightingMode.DEFAULT;
    private _profiler: Model | null = null;
    private _pipelineUBO: PipelineUBO = new PipelineUBO();
    private _cameras: Camera[] = [];
    private _resourceUses: string[] = [];

    private _layoutGraph: LayoutGraphData;
    private readonly _resourceGraph: ResourceGraph = new ResourceGraph();
    private _renderGraph: RenderGraph | null = null;
    private _compiler: Compiler | null = null;
    private _executor: Executor | null = null;
    private _customPipelineName = '';
    private _forward!: ForwardPipelineBuilder;
    private _deferred!: DeferredPipelineBuilder;
    private _globalDescSetData!: DescriptorSetData;
    public builder: PipelineBuilder | null = null;
    private _combineSignY = 0;
    // csm uniform used vectors count
    public static CSM_UNIFORM_VECTORS = 61;
    // all global uniform used vectors count
    public static GLOBAL_UNIFORM_VECTORS = 64;
}
