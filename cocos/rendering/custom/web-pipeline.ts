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
import { DEBUG } from 'internal:constants';
import { Color, Buffer, DescriptorSetLayout, Device, Feature, Format, FormatFeatureBit, Sampler, Swapchain, Texture, ClearFlagBit, DescriptorSet, deviceManager, Viewport, API, CommandBuffer, Type, SamplerInfo, Filter, Address, DescriptorSetInfo, LoadOp, StoreOp, ShaderStageFlagBit, BufferInfo, TextureInfo } from '../../gfx';
import { Mat4, Quat, toRadian, Vec2, Vec3, Vec4, assert, macro, cclegacy } from '../../core';
import { AccessType, AttachmentType, CopyPair, LightInfo, LightingMode, MovePair, QueueHint, ResolvePair, ResourceDimension, ResourceFlags, ResourceResidency, SceneFlags, UpdateFrequency } from './types';
import { ComputeView, RasterView, Blit, ClearView, ComputePass, CopyPass, Dispatch, ManagedBuffer, ManagedResource, MovePass, RasterPass, RasterSubpass, RenderData, RenderGraph, RenderGraphComponent, RenderGraphValue, RenderQueue, RenderSwapchain, ResourceDesc, ResourceGraph, ResourceGraphValue, ResourceStates, ResourceTraits, SceneData, Subpass } from './render-graph';
import { ComputePassBuilder, ComputeQueueBuilder, ComputeSubpassBuilder, BasicPipeline, PipelineBuilder, RenderPassBuilder, RenderQueueBuilder, RenderSubpassBuilder, PipelineType, BasicRenderPassBuilder, PipelineCapabilities } from './pipeline';
import { PipelineSceneData } from '../pipeline-scene-data';
import { Model, Camera, ShadowType, CSMLevel, DirectionalLight, SpotLight, PCFType, Shadows } from '../../render-scene/scene';
import { Light, LightType } from '../../render-scene/scene/light';
import { DescriptorSetData, LayoutGraphData } from './layout-graph';
import { Executor } from './executor';
import { RenderWindow } from '../../render-scene/core/render-window';
import { MacroRecord, RenderScene } from '../../render-scene';
import { GlobalDSManager } from '../global-descriptor-set-manager';
import { isEnableEffect, supportsR32FloatTexture, supportsRGBA16HalfFloatTexture, UBOSkinning } from '../define';
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
import { initGlobalDescBinding } from './define';
import { createGfxDescriptorSetsAndPipelines } from './layout-graph-utils';
import { Root } from '../../root';

const _uboVec = new Vec4();
const _uboVec3 = new Vec3();
const _uboCol = new Color();
const _matView = new Mat4();
const _mulMatView = new Mat4();
let uniformOffset = -1;
const _samplerPointInfo = new SamplerInfo(
    Filter.POINT,
    Filter.POINT,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
);
export class WebSetter {
    constructor (data: RenderData, lg: LayoutGraphData) {
        this._data = data;
        this._lg = lg;
    }

    protected _copyToBuffer (target: any, offset: number, type: Type) {
        assert(offset !== -1);
        const arr = this.getCurrConstant();
        switch (type) {
        case Type.FLOAT4:
            Vec4.toArray(arr, target, offset);
            break;
        case Type.MAT4:
            Mat4.toArray(arr, target, offset);
            break;
        case Type.FLOAT:
            arr[offset] = target;
            break;
        case Type.SAMPLER2D:
            break;
        case Type.TEXTURE2D:
            break;
        case Type.FLOAT2:
            arr[offset + 0] = target.x;
            arr[offset + 1] = target.y;
            break;
        default:
        }
    }

    protected _applyCurrConstantBuffer (name: string, target: any, type: Type, idx = 0) {
        const offset = this.getUniformOffset(name, type, idx);
        this._copyToBuffer(target, offset, type);
    }

    public hasUniform (offset: number) {
        return offset !== -1;
    }

    public getUniformOffset (name: string, type: Type, idx = 0) {
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

    protected _getCurrUniformBlock () {
        const block: string  = this._currBlock;
        const nodeId = this._lg.locateChild(0xFFFFFFFF, this._currStage);
        const ppl = this._lg.getLayout(nodeId);
        const layout = ppl.descriptorSets.get(UpdateFrequency.PER_PASS)!.descriptorSetLayoutData;
        const nameID: number = this._lg.attributeIndex.get(block)!;
        return layout.uniformBlocks.get(nameID);
    }

    protected _getCurrDescSetLayoutData () {
        const nodeId = this._lg.locateChild(0xFFFFFFFF, this._currStage);
        const ppl = this._lg.getLayout(nodeId);
        const layout = ppl.descriptorSets.get(UpdateFrequency.PER_PASS)!.descriptorSetLayoutData;
        return layout;
    }

    protected _getCurrDescriptorBlock (block: string) {
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

    setCurrConstant (block: string, stage = 'default') {
        this._currBlock = block;
        this._currStage = stage;
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

    getCurrConstant () {
        return this._currConstant;
    }

    public addConstant (block: string, stage = 'default') {
        this._currBlock = block;
        this._currStage = stage;
        const num = this._lg.attributeIndex.get(block)!;
        this._currCount = 0;
        const currBlock = this._getCurrUniformBlock();
        if (!currBlock) return false;
        for (const uniform of currBlock.members) {
            this._currCount += getUBOTypeCount(uniform.type) * uniform.count;
        }
        if (!this._data.constants.get(num)) {
            const value = new Array(this._currCount);
            value.fill(0);
            this._data.constants.set(num, value);
        }
        this.setCurrConstant(block);
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
    public offsetColor (color: Color, offset: number): void {
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
    public offsetFloat (v: number, offset: number): void {
        this._copyToBuffer(v, offset, Type.FLOAT);
    }
    public setBuffer (name: string, buffer: Buffer): void {}
    public setTexture (name: string, texture: Texture): void {
        if (this._getCurrDescriptorBlock(name) === -1) {
            return;
        }
        const num = this._lg.attributeIndex.get(name)!;
        this._data.textures.set(num, texture);
    }
    public setReadWriteBuffer (name: string, buffer: Buffer): void {}
    public setReadWriteTexture (name: string, texture: Texture): void {}
    public setSampler (name: string, sampler: Sampler): void {
        if (this._getCurrDescriptorBlock(name) === -1) {
            return;
        }
        const num = this._lg.attributeIndex.get(name)!;
        this._data.samplers.set(num, sampler);
    }
    // public setCameraConstants (camera: Camera): void {

    // }
    // public setDirectionalLightProjectionConstants (light: DirectionalLight): void {

    // }
    // public setSpotLightProjectionConstants (light: SpotLight): void {

    // }
    // public setShadowMapConstants (light: Light, numLevels?: number): void {

    // }
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
    protected  _data: RenderData;
    protected _lg: LayoutGraphData;
    protected _currBlock;
    protected _currStage;
    protected _currCount;
    protected _currConstant: number[] = [];
}

function setShadowUBOLightView (setter: WebSetter,
    camera: Camera,
    light: Light,
    level: number,
    layout = 'default') {
    const director = cclegacy.director;
    const pipeline = (director.root as Root).pipeline;
    const device = pipeline.device;
    const sceneData = pipeline.pipelineSceneData;
    const shadowInfo = sceneData.shadows;
    const csmLayers = sceneData.csmLayers;
    const packing = supportsR32FloatTexture(device) ? 0.0 : 1.0;
    const cap = pipeline.device.capabilities;
    setter.addConstant('CCCSM', layout);
    // ShadowMap
    if (!setter.addConstant('CCShadow', layout)) return;
    if (shadowInfo.enabled) {
        if (shadowInfo.type === ShadowType.ShadowMap) {
            // update CSM layers
            if (light && light.node) {
                csmLayers.update(sceneData, camera);
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
                let matShadowView;
                let matShadowProj;
                let matShadowViewProj;
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
                    uniformOffset = setter.getUniformOffset('cc_shadowLPNNInfo', Type.FLOAT4);
                    if (setter.hasUniform(uniformOffset)) {
                        _uboVec.set(LightType.DIRECTIONAL, packing, mainLight.shadowNormalBias, 0);
                        setter.offsetVec4(_uboVec, uniformOffset);
                    }
                } else {
                    const layer = csmLayers.layers[level];
                    matShadowView = layer.matShadowView;
                    matShadowProj = layer.matShadowProj;
                    matShadowViewProj = layer.matShadowViewProj;

                    near = layer.splitCameraNear;
                    far = layer.splitCameraFar;
                    levelCount = mainLight.csmLevel;
                }
                uniformOffset = setter.getUniformOffset('cc_matLightView', Type.MAT4);
                if (setter.hasUniform(uniformOffset)) {
                    setter.offsetMat4(matShadowView, uniformOffset);
                }
                uniformOffset = setter.getUniformOffset('cc_shadowProjDepthInfo', Type.FLOAT4);
                if (setter.hasUniform(uniformOffset)) {
                    _uboVec.set(matShadowProj.m10, matShadowProj.m14, matShadowProj.m11, matShadowProj.m15);
                    setter.offsetVec4(_uboVec, uniformOffset);
                }
                uniformOffset = setter.getUniformOffset('cc_shadowProjInfo', Type.FLOAT4);
                if (setter.hasUniform(uniformOffset)) {
                    _uboVec.set(matShadowProj.m00, matShadowProj.m05, 1.0 / matShadowProj.m00, 1.0 / matShadowProj.m05);
                    setter.offsetVec4(_uboVec, uniformOffset);
                }
                uniformOffset = setter.getUniformOffset('cc_matLightViewProj', Type.MAT4);
                if (setter.hasUniform(uniformOffset)) {
                    setter.offsetMat4(matShadowViewProj, uniformOffset);
                }
                uniformOffset = setter.getUniformOffset('cc_shadowNFLSInfo', Type.FLOAT4);
                if (setter.hasUniform(uniformOffset)) {
                    _uboVec.set(near, far, 0, 1.0 - mainLight.shadowSaturation);
                    setter.offsetVec4(_uboVec, uniformOffset);
                }
                uniformOffset = setter.getUniformOffset('cc_shadowLPNNInfo', Type.FLOAT4);
                if (setter.hasUniform(uniformOffset)) {
                    _uboVec.set(LightType.DIRECTIONAL, packing, mainLight.shadowNormalBias, levelCount);
                    setter.offsetVec4(_uboVec, uniformOffset);
                }
                uniformOffset = setter.getUniformOffset('cc_shadowWHPBInfo', Type.FLOAT4);
                if (setter.hasUniform(uniformOffset)) {
                    _uboVec.set(shadowInfo.size.x, shadowInfo.size.y, mainLight.shadowPcf, mainLight.shadowBias);
                    setter.offsetVec4(_uboVec, uniformOffset);
                }
            }
        }
        break;
    }
    case LightType.SPOT: {
        const spotLight = light as SpotLight;
        if (shadowInfo.enabled && spotLight && spotLight.shadowEnabled) {
            const matViewOffset = setter.getUniformOffset('cc_matLightView', Type.MAT4);
            const matViewProOffset = setter.getUniformOffset('cc_matLightViewProj', Type.MAT4);
            if (setter.hasUniform(matViewOffset) || setter.hasUniform(matViewProOffset)) {
                Mat4.invert(_matView, (light as any).node.getWorldMatrix());
            }
            if (setter.hasUniform(matViewOffset)) setter.offsetMat4(_matView, matViewOffset);
            if (setter.hasUniform(matViewProOffset)) {
                Mat4.perspective(_mulMatView, (light as any).angle, 1.0, 0.001, (light as any).range,
                    true, cap.clipSpaceMinZ, cap.clipSpaceSignY, 0);
                Mat4.multiply(_matView, _mulMatView, _matView);
                setter.offsetMat4(_matView, matViewProOffset);
            }
            uniformOffset = setter.getUniformOffset('cc_shadowNFLSInfo', Type.FLOAT4);
            if (setter.hasUniform(uniformOffset)) {
                _uboVec.set(0.01, (light as SpotLight).range, 0.0, 0.0);
                setter.offsetVec4(_uboVec, uniformOffset);
            }
            uniformOffset = setter.getUniformOffset('cc_shadowWHPBInfo', Type.FLOAT4);
            if (setter.hasUniform(uniformOffset)) {
                _uboVec.set(shadowInfo.size.x, shadowInfo.size.y, spotLight.shadowPcf, spotLight.shadowBias);
                setter.offsetVec4(_uboVec, uniformOffset);
            }
            uniformOffset = setter.getUniformOffset('cc_shadowLPNNInfo', Type.FLOAT4);
            if (setter.hasUniform(uniformOffset)) {
                _uboVec.set(LightType.SPOT, packing, spotLight.shadowNormalBias, 0.0);
                setter.offsetVec4(_uboVec, uniformOffset);
            }
        }
        break;
    }
    default:
    }
    uniformOffset = setter.getUniformOffset('cc_shadowColor', Type.FLOAT4);
    if (setter.hasUniform(uniformOffset)) {
        _uboCol.set(shadowInfo.shadowColor.x, shadowInfo.shadowColor.y, shadowInfo.shadowColor.z, shadowInfo.shadowColor.w);
        setter.offsetColor(_uboCol, uniformOffset);
    }
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

function setShadowUBOView (setter: WebSetter, camera: Camera | null, layout = 'default') {
    const director = cclegacy.director;
    const pipeline = director.root.pipeline;
    const device = pipeline.device;
    const scene = director.getScene();
    const mainLight = camera && camera.scene ? camera.scene.mainLight : scene ? scene.renderScene.mainLight : null;
    const sceneData = pipeline.pipelineSceneData;
    const shadowInfo = sceneData.shadows;
    const csmLayers = sceneData.csmLayers;
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
                        const matShadowView = csmLayers.specialLayer.matShadowView;
                        const matShadowProj = csmLayers.specialLayer.matShadowProj;
                        const matShadowViewProj = csmLayers.specialLayer.matShadowViewProj;
                        const near = mainLight.shadowNear;
                        const far = mainLight.shadowFar;
                        uniformOffset = setter.getUniformOffset('cc_matLightView', Type.MAT4);
                        if (setter.hasUniform(uniformOffset)) {
                            setter.offsetMat4(matShadowView, uniformOffset);
                        }
                        uniformOffset = setter.getUniformOffset('cc_shadowProjDepthInfo', Type.FLOAT4);
                        if (setter.hasUniform(uniformOffset)) {
                            _uboVec.set(matShadowProj.m10, matShadowProj.m14, matShadowProj.m11, matShadowProj.m15);
                            setter.offsetVec4(_uboVec, uniformOffset);
                        }
                        uniformOffset = setter.getUniformOffset('cc_shadowProjInfo', Type.FLOAT4);
                        if (setter.hasUniform(uniformOffset)) {
                            _uboVec.set(matShadowProj.m00, matShadowProj.m05, 1.0 / matShadowProj.m00, 1.0 / matShadowProj.m05);
                            setter.offsetVec4(_uboVec, uniformOffset);
                        }
                        uniformOffset = setter.getUniformOffset('cc_matLightViewProj', Type.MAT4);
                        if (setter.hasUniform(uniformOffset)) {
                            setter.offsetMat4(matShadowViewProj, uniformOffset);
                        }
                        uniformOffset = setter.getUniformOffset('cc_shadowNFLSInfo', Type.FLOAT4);
                        if (setter.hasUniform(uniformOffset)) {
                            _uboVec.set(near, far, 0, 1.0 - mainLight.shadowSaturation);
                            setter.offsetVec4(_uboVec, uniformOffset);
                        }
                        uniformOffset = setter.getUniformOffset('cc_shadowLPNNInfo', Type.FLOAT4);
                        if (setter.hasUniform(uniformOffset)) {
                            _uboVec.set(LightType.DIRECTIONAL, packing, mainLight.shadowNormalBias, 0);
                            setter.offsetVec4(_uboVec, uniformOffset);
                        }
                    }
                } else {
                    if (hasCCCSM) {
                        const layerThreshold = getPCFRadius(shadowInfo, mainLight);
                        setter.setCurrConstant('CCCSM', layout);
                        for (let i = 0; i < mainLight.csmLevel; i++) {
                            const layer = csmLayers.layers[i];
                            const matShadowView = layer.matShadowView;
                            uniformOffset = setter.getUniformOffset('cc_csmViewDir0', Type.FLOAT4, i);
                            if (setter.hasUniform(uniformOffset)) {
                                _uboVec.set(matShadowView.m00, matShadowView.m04, matShadowView.m08, layerThreshold);
                                setter.offsetVec4(_uboVec, uniformOffset);
                            }
                            uniformOffset = setter.getUniformOffset('cc_csmViewDir1', Type.FLOAT4, i);
                            if (setter.hasUniform(uniformOffset)) {
                                _uboVec.set(matShadowView.m01, matShadowView.m05, matShadowView.m09, layer.splitCameraNear);
                                setter.offsetVec4(_uboVec, uniformOffset);
                            }
                            uniformOffset = setter.getUniformOffset('cc_csmViewDir2', Type.FLOAT4, i);
                            if (setter.hasUniform(uniformOffset)) {
                                _uboVec.set(matShadowView.m02, matShadowView.m06, matShadowView.m10, layer.splitCameraFar);
                                setter.offsetVec4(_uboVec, uniformOffset);
                            }
                            uniformOffset = setter.getUniformOffset('cc_csmAtlas', Type.FLOAT4, i);
                            if (setter.hasUniform(uniformOffset)) {
                                const csmAtlas = layer.csmAtlas;
                                setter.offsetVec4(csmAtlas, uniformOffset);
                            }
                            uniformOffset = setter.getUniformOffset('cc_matCSMViewProj', Type.MAT4, i);
                            if (setter.hasUniform(uniformOffset)) {
                                const matShadowViewProj = layer.matShadowViewProj;
                                setter.offsetMat4(matShadowViewProj, uniformOffset);
                            }
                            const matShadowProj = layer.matShadowProj;
                            uniformOffset = setter.getUniformOffset('cc_csmProjDepthInfo', Type.FLOAT4, i);
                            if (setter.hasUniform(uniformOffset)) {
                                _uboVec.set(matShadowProj.m10, matShadowProj.m14, matShadowProj.m11, matShadowProj.m15);
                                setter.offsetVec4(_uboVec, uniformOffset);
                            }
                            uniformOffset = setter.getUniformOffset('cc_csmProjInfo', Type.FLOAT4, i);
                            if (setter.hasUniform(uniformOffset)) {
                                _uboVec.set(matShadowProj.m00, matShadowProj.m05, 1.0 / matShadowProj.m00, 1.0 / matShadowProj.m05);
                                setter.offsetVec4(_uboVec, uniformOffset);
                            }
                        }
                        uniformOffset = setter.getUniformOffset('cc_csmSplitsInfo', Type.FLOAT4);
                        if (setter.hasUniform(uniformOffset)) {
                            _uboVec.set(mainLight.csmTransitionRange, 0, 0, 0);
                            setter.offsetVec4(_uboVec, uniformOffset);
                        }
                    }
                    if (hasCCShadow) {
                        setter.setCurrConstant('CCShadow', layout);
                        uniformOffset = setter.getUniformOffset('cc_shadowNFLSInfo', Type.FLOAT4);
                        if (setter.hasUniform(uniformOffset)) {
                            _uboVec.set(0, 0, 0, 1.0 - mainLight.shadowSaturation);
                            setter.offsetVec4(_uboVec, uniformOffset);
                        }
                        uniformOffset = setter.getUniformOffset('cc_shadowLPNNInfo', Type.FLOAT4);
                        if (setter.hasUniform(uniformOffset)) {
                            _uboVec.set(LightType.DIRECTIONAL, packing, mainLight.shadowNormalBias, mainLight.csmLevel);
                            setter.offsetVec4(_uboVec, uniformOffset);
                        }
                    }
                }
                if (hasCCShadow) {
                    setter.setCurrConstant('CCShadow', layout);
                    uniformOffset = setter.getUniformOffset('cc_shadowWHPBInfo', Type.FLOAT4);
                    if (setter.hasUniform(uniformOffset)) {
                        _uboVec.set(shadowInfo.size.x, shadowInfo.size.y, mainLight.shadowPcf, mainLight.shadowBias);
                        setter.offsetVec4(_uboVec, uniformOffset);
                    }
                }
            }
        } else if (hasCCShadow) {
            setter.setCurrConstant('CCShadow', layout);
            uniformOffset = setter.getUniformOffset('cc_planarNDInfo', Type.FLOAT4);
            if (setter.hasUniform(uniformOffset)) {
                Vec3.normalize(_uboVec3, shadowInfo.normal);
                _uboVec.set(_uboVec3.x, _uboVec3.y, _uboVec3.z, -shadowInfo.distance);
                setter.offsetVec4(_uboVec, uniformOffset);
            }
        }
        if (hasCCShadow) {
            setter.setCurrConstant('CCShadow', layout);
            uniformOffset = setter.getUniformOffset('cc_shadowColor', Type.FLOAT4);
            if (setter.hasUniform(uniformOffset)) {
                setter.offsetColor(shadowInfo.shadowColor, uniformOffset);
            }
        }
    }
}

function setCameraUBOValues (setter: WebSetter,
    camera: Readonly<Camera> | null, cfg: Readonly<PipelineSceneData>,
    scene: Readonly<RenderScene>,
    layoutName = 'default') {
    const director = cclegacy.director;
    const root = director.root;
    const pipeline = root.pipeline as WebPipeline;
    const shadowInfo = cfg.shadows;
    const skybox = cfg.skybox;
    const shadingScale = cfg.shadingScale;
    // Camera
    if (!setter.addConstant('CCCamera', layoutName)) return;
    if (camera) {
        uniformOffset = setter.getUniformOffset('cc_matView', Type.MAT4);
        if (setter.hasUniform(uniformOffset)) {
            setter.offsetMat4(camera.matView, uniformOffset);
        }
        uniformOffset = setter.getUniformOffset('cc_matViewInv', Type.MAT4);
        if (setter.hasUniform(uniformOffset)) {
            setter.offsetMat4(camera.node.worldMatrix, uniformOffset);
        }
        uniformOffset = setter.getUniformOffset('cc_matProj', Type.MAT4);
        if (setter.hasUniform(uniformOffset)) {
            setter.offsetMat4(camera.matProj, uniformOffset);
        }
        uniformOffset = setter.getUniformOffset('cc_matProjInv', Type.MAT4);
        if (setter.hasUniform(uniformOffset)) {
            setter.offsetMat4(camera.matProjInv, uniformOffset);
        }
        uniformOffset = setter.getUniformOffset('cc_matViewProj', Type.MAT4);
        if (setter.hasUniform(uniformOffset)) {
            setter.offsetMat4(camera.matViewProj, uniformOffset);
        }
        uniformOffset = setter.getUniformOffset('cc_matViewProjInv', Type.MAT4);
        if (setter.hasUniform(uniformOffset)) {
            setter.offsetMat4(camera.matViewProjInv, uniformOffset);
        }
        uniformOffset = setter.getUniformOffset('cc_surfaceTransform', Type.FLOAT4);
        if (setter.hasUniform(uniformOffset)) {
            _uboVec.set(camera.surfaceTransform, camera.cameraUsage, Math.cos(toRadian(skybox.getRotationAngle())), Math.sin(toRadian(skybox.getRotationAngle())));
            setter.offsetVec4(_uboVec, uniformOffset);
        }
        uniformOffset = setter.getUniformOffset('cc_exposure', Type.FLOAT4);
        if (setter.hasUniform(uniformOffset)) {
            _uboVec.set(camera.exposure, 1.0 / camera.exposure, cfg.isHDR ? 1.0 : 0.0, 1.0 / Camera.standardExposureValue);
            setter.offsetVec4(_uboVec, uniformOffset);
        }
    }
    uniformOffset = setter.getUniformOffset('cc_cameraPos', Type.FLOAT4);
    if (setter.hasUniform(uniformOffset)) {
        if (camera) { _uboVec.set(camera.position.x, camera.position.y, camera.position.z, pipeline.getCombineSignY()); } else { _uboVec.set(0, 0, 0, pipeline.getCombineSignY()); }
        setter.offsetVec4(_uboVec, uniformOffset);
    }
    uniformOffset = setter.getUniformOffset('cc_screenScale', Type.FLOAT4);
    if (setter.hasUniform(uniformOffset)) {
        _uboVec.set(cfg.shadingScale, cfg.shadingScale, 1.0 / cfg.shadingScale, 1.0 / cfg.shadingScale);
        setter.offsetVec4(_uboVec, uniformOffset);
    }
    const mainLight = scene && scene.mainLight;
    if (mainLight) {
        uniformOffset = setter.getUniformOffset('cc_mainLitDir', Type.FLOAT4);
        if (setter.hasUniform(uniformOffset)) {
            const shadowEnable = (mainLight.shadowEnabled && shadowInfo.type === ShadowType.ShadowMap) ? 1.0 : 0.0;
            _uboVec.set(mainLight.direction.x, mainLight.direction.y, mainLight.direction.z, shadowEnable);
            setter.offsetVec4(_uboVec, uniformOffset);
        }
        uniformOffset = setter.getUniformOffset('cc_mainLitColor', Type.FLOAT4);
        if (setter.hasUniform(uniformOffset)) {
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
            setter.offsetVec4(_uboVec, uniformOffset);
        }
    } else {
        uniformOffset = setter.getUniformOffset('cc_mainLitDir', Type.FLOAT4);
        if (setter.hasUniform(uniformOffset)) {
            _uboVec.set(0, 0, 1, 0);
            setter.offsetVec4(_uboVec, uniformOffset);
        }
        uniformOffset = setter.getUniformOffset('cc_mainLitColor', Type.FLOAT4);
        if (setter.hasUniform(uniformOffset)) {
            _uboVec.set(0, 0, 0, 0);
            setter.offsetVec4(_uboVec, uniformOffset);
        }
    }

    const ambient = cfg.ambient;
    uniformOffset = setter.getUniformOffset('cc_ambientSky', Type.FLOAT4);
    if (setter.hasUniform(uniformOffset)) {
        const skyColor = ambient.skyColor;
        if (cfg.isHDR) {
            skyColor.w = ambient.skyIllum * (camera ? camera.exposure : 1);
        } else {
            skyColor.w = ambient.skyIllum;
        }
        _uboVec.set(skyColor.x, skyColor.y, skyColor.z, skyColor.w);
        setter.offsetVec4(_uboVec, uniformOffset);
    }
    uniformOffset = setter.getUniformOffset('cc_ambientGround', Type.FLOAT4);
    if (setter.hasUniform(uniformOffset)) {
        _uboVec.set(ambient.groundAlbedo.x, ambient.groundAlbedo.y, ambient.groundAlbedo.z, skybox.envmap ? skybox.envmap?.mipmapLevel : 1.0);
        setter.offsetVec4(_uboVec, uniformOffset);
    }
    const fog = cfg.fog;
    uniformOffset = setter.getUniformOffset('cc_fogColor', Type.FLOAT4);
    if (setter.hasUniform(uniformOffset)) {
        const colorTempRGB = fog.colorArray;
        _uboVec.set(colorTempRGB.x, colorTempRGB.y, colorTempRGB.z, colorTempRGB.z);
        setter.offsetVec4(_uboVec, uniformOffset);
    }
    uniformOffset = setter.getUniformOffset('cc_fogBase', Type.FLOAT4);
    if (setter.hasUniform(uniformOffset)) {
        _uboVec.set(fog.fogStart, fog.fogEnd, fog.fogDensity, 0.0);
        setter.offsetVec4(_uboVec, uniformOffset);
    }
    uniformOffset = setter.getUniformOffset('cc_fogAdd', Type.FLOAT4);
    if (setter.hasUniform(uniformOffset)) {
        _uboVec.set(fog.fogTop, fog.fogRange, fog.fogAtten, 0.0);
        setter.offsetVec4(_uboVec, uniformOffset);
    }
    if (camera) {
        uniformOffset = setter.getUniformOffset('cc_nearFar', Type.FLOAT4);
        if (setter.hasUniform(uniformOffset)) {
            _uboVec.set(camera.nearClip, camera.farClip, camera.getClipSpaceMinz(), 0.0);
            setter.offsetVec4(_uboVec, uniformOffset);
        }
        uniformOffset = setter.getUniformOffset('cc_viewPort', Type.FLOAT4);
        if (setter.hasUniform(uniformOffset)) {
            _uboVec.set(camera.viewport.x, camera.viewport.y, shadingScale * camera.window.width * camera.viewport.z, shadingScale * camera.window.height * camera.viewport.w);
            setter.offsetVec4(_uboVec, uniformOffset);
        }
    }
}

function setTextureUBOView (setter: WebSetter, camera: Camera | null, cfg: Readonly<PipelineSceneData>, layout = 'default') {
    const skybox = cfg.skybox;
    const director = cclegacy.director;
    const root = director.root;
    if (skybox.reflectionMap) {
        const texture = skybox.reflectionMap.getGFXTexture()!;
        const sampler = root.device.getSampler(skybox.reflectionMap.getSamplerInfo());
        setter.setTexture('cc_environment', texture);
        setter.setSampler('cc_environment', sampler);
    } else {
        const envmap = skybox.envmap ? skybox.envmap : builtinResMgr.get<TextureCube>('default-cube-texture');
        if (envmap) {
            const texture = envmap.getGFXTexture()!;
            const sampler = root.device.getSampler(envmap.getSamplerInfo());
            setter.setTexture('cc_environment', texture);
            setter.setSampler('cc_environment', sampler);
        }
    }
    const diffuseMap = skybox.diffuseMap ? skybox.diffuseMap : builtinResMgr.get<TextureCube>('default-cube-texture');
    if (diffuseMap) {
        const texture = diffuseMap.getGFXTexture()!;
        const sampler = root.device.getSampler(diffuseMap.getSamplerInfo());
        setter.setTexture('cc_diffuseMap', texture);
        setter.setSampler('cc_diffuseMap', sampler);
    }
    const pointSampler = root.device.getSampler(_samplerPointInfo);
    if (!setter.hasSampler('cc_shadowMap')) {
        setter.setSampler('cc_shadowMap', pointSampler);
    }
    if (!setter.hasTexture('cc_shadowMap')) {
        setter.setTexture('cc_shadowMap', builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
    }
    if (!setter.hasSampler('cc_spotShadowMap')) {
        setter.setSampler('cc_spotShadowMap', pointSampler);
    }
    if (!setter.hasTexture('cc_spotShadowMap')) {
        setter.setTexture('cc_spotShadowMap', builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
    }
}

function getFirstChildLayoutName (lg: LayoutGraphData, parentID: number): string {
    if (lg.numVertices() && parentID !== 0xFFFFFFFF && lg.numChildren(parentID)) {
        const childNodes = lg.children(parentID);
        if (childNodes.next().value && childNodes.next().value.target !== lg.nullVertex()) {
            const ququeLayoutID = childNodes.next().value.target;
            return lg.getName(ququeLayoutID);
        }
    }
    return '';
}

export class WebRenderQueueBuilder extends WebSetter implements RenderQueueBuilder  {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._queue = queue;
        this._pipeline = pipeline;
    }
    setArrayBuffer (name: string, arrayBuffer: ArrayBuffer): void {
        throw new Error('Method not implemented.');
    }
    get name () {
        return this._renderGraph.getName(this._vertID);
    }
    set name (name: string) {
        this._renderGraph.setName(this._vertID, name);
    }

    getLayoutName () {
        const parId = this._renderGraph.getParent(this._vertID);
        const layoutName = isEnableEffect() ? this._renderGraph.getLayout(parId) : 'default';
        return layoutName;
    }

    addSceneOfCamera (camera: Camera, light: LightInfo, sceneFlags = SceneFlags.NONE, name = 'Camera'): void {
        const sceneData = new SceneData(camera.scene, camera, sceneFlags, light);
        this._renderGraph.addVertex<RenderGraphValue.Scene>(
            RenderGraphValue.Scene, sceneData, name, '', new RenderData(), false, this._vertID,
        );
        const layoutName = this.getLayoutName();
        const scene = cclegacy.director.getScene();
        setCameraUBOValues(this, camera, this._pipeline,
            camera.scene ? camera.scene : scene ? scene.renderScene : null,
            layoutName);
        if (sceneFlags & SceneFlags.SHADOW_CASTER) {
            setShadowUBOLightView(this, camera, light.light!, light.level, layoutName);
        } else {
            setShadowUBOView(this, camera, layoutName);
        }
        setTextureUBOView(this, camera, this._pipeline);
        initGlobalDescBinding(this._data, layoutName);
    }
    // addScene (camera: Camera, sceneFlags = SceneFlags.NONE): void {
    //     const sceneData = new SceneData(camera.scene, camera, sceneFlags);
    //     this._renderGraph.addVertex<RenderGraphValue.Scene>(
    //         RenderGraphValue.Scene, sceneData, 'Scene', '', new RenderData(), false, this._vertID,
    //     );
    // }
    // addSceneCulledByDirectionalLight (camera: Camera, sceneFlags: SceneFlags, light: DirectionalLight, level: number): void {
    //     const sceneData = new SceneData(camera.scene, camera, sceneFlags, new LightInfo(light, level));
    //     this._renderGraph.addVertex<RenderGraphValue.Scene>(
    //         RenderGraphValue.Scene, sceneData, 'Scene', '', new RenderData(), false, this._vertID,
    //     );
    // }
    // addSceneCulledBySpotLight (camera: Camera, sceneFlags: SceneFlags, light: SpotLight): void {
    //     const sceneData = new SceneData(camera.scene, camera, sceneFlags, new LightInfo(light, 0));
    //     this._renderGraph.addVertex<RenderGraphValue.Scene>(
    //         RenderGraphValue.Scene, sceneData, 'Scene', '', new RenderData(), false, this._vertID,
    //     );
    // }
    addFullscreenQuad (material: Material, passID: number, sceneFlags = SceneFlags.NONE, name = 'Quad'): void {
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit, new Blit(material, passID, sceneFlags, null),
            name, '', new RenderData(), false, this._vertID,
        );
        const layoutName = this.getLayoutName();
        const scene = cclegacy.director.getScene();
        setCameraUBOValues(this, null, this._pipeline,
            scene ? scene.renderScene : null, layoutName);
        if (sceneFlags & SceneFlags.SHADOW_CASTER) {
            // setShadowUBOLightView(this, light.light!, light.level);
        } else {
            setShadowUBOView(this, null, layoutName);
        }
        setTextureUBOView(this, null, this._pipeline);
        initGlobalDescBinding(this._data, layoutName);
    }
    addCameraQuad (camera: Camera, material: Material, passID: number, sceneFlags = SceneFlags.NONE) {
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit, new Blit(material, passID, sceneFlags, camera),
            'CameraQuad', '', new RenderData(), false, this._vertID,
        );
        const layoutName = this.getLayoutName();
        const scene = cclegacy.director.getScene();
        setCameraUBOValues(this, camera, this._pipeline,
            camera.scene ? camera.scene : scene ? scene.renderScene : null, layoutName);
        if (sceneFlags & SceneFlags.SHADOW_CASTER) {
            // setShadowUBOLightView(this, light.light!, light.level);
        } else {
            setShadowUBOView(this, camera, layoutName);
        }
        setTextureUBOView(this, camera, this._pipeline);
        initGlobalDescBinding(this._data, layoutName);
    }
    clearRenderTarget (name: string, color: Color = new Color()) {
        this._renderGraph.addVertex<RenderGraphValue.Clear>(
            RenderGraphValue.Clear, [new ClearView(name, ClearFlagBit.COLOR, color)],
            'ClearRenderTarget', '', new RenderData(), false, this._vertID,
        );
    }
    setViewport (viewport: Viewport) {
        this._queue.viewport = new Viewport().copy(viewport);
    }
    addCustomCommand (customBehavior: string): void {
        throw new Error('Method not implemented.');
    }
    private _renderGraph: RenderGraph;
    private _vertID: number;
    private _queue: RenderQueue;
    private _pipeline: PipelineSceneData;
}

export class WebRenderSubpassBuilder extends WebSetter implements RenderSubpassBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData,
        vertID: number, subpass: RasterSubpass, pipeline: PipelineSceneData) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._layoutGraph = layoutGraph;
        this._vertID = vertID;
        this._subpass = subpass;
        this._pipeline = pipeline;

        const layoutName = this._renderGraph.component<RenderGraphComponent.Layout>(
            RenderGraphComponent.Layout, this._vertID,
        );
        this._layoutID = layoutGraph.locateChild(layoutGraph.nullVertex(), layoutName);
    }
    setCustomShaderStages (name: string, stageFlags: ShaderStageFlagBit): void {
        throw new Error('Method not implemented.');
    }
    setArrayBuffer (name: string, arrayBuffer: ArrayBuffer): void {
        throw new Error('Method not implemented.');
    }
    get name () {
        return this._renderGraph.getName(this._vertID);
    }
    set name (name: string) {
        this._renderGraph.setName(this._vertID, name);
    }
    addRenderTarget (name: string, accessType: AccessType, slotName: string, loadOp = LoadOp.CLEAR, storeOp = StoreOp.STORE, clearColor = new Color()) {
        throw new Error('Method not implemented.');
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
        if (DEBUG) {
            const layoutId = this._layoutGraph.locateChild(this._layoutID, layoutName);
            assert(layoutId !== 0xFFFFFFFF);
        }
        const queue = new RenderQueue(hint);
        const data = new RenderData();
        const queueID = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue, queue, '', layoutName, data, false, this._vertID,
        );
        return new WebRenderQueueBuilder(data, this._renderGraph, this._layoutGraph, queueID, queue, this._pipeline);
    }
    get showStatistics (): boolean {
        return this._subpass.showStatistics;
    }
    set showStatistics (enable: boolean) {
        this._subpass.showStatistics = enable;
    }

    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _layoutID: number;
    private readonly _subpass: RasterSubpass;
    private readonly _pipeline: PipelineSceneData;
    private readonly _layoutGraph: LayoutGraphData;
}

export class WebRenderPassBuilder extends WebSetter implements BasicRenderPassBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, resourceGraph: ResourceGraph, vertID: number, pass: RasterPass, pipeline: PipelineSceneData) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._layoutGraph = layoutGraph;
        this._resourceGraph = resourceGraph;
        this._vertID = vertID;
        this._pass = pass;
        this._pipeline = pipeline;

        const layoutName = this._renderGraph.component<RenderGraphComponent.Layout>(
            RenderGraphComponent.Layout, this._vertID,
        );
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
    get name () {
        return this._renderGraph.getName(this._vertID);
    }
    set name (name: string) {
        this._renderGraph.setName(this._vertID, name);
    }
    addRenderTarget (name: string, loadOp = LoadOp.CLEAR, storeOp = StoreOp.STORE, clearColor = new Color()) {
        if (DEBUG) {
            assert(name && this._resourceGraph.contains(name));
        }
        let clearFlag = ClearFlagBit.COLOR;
        if (loadOp === LoadOp.LOAD) {
            clearFlag = ClearFlagBit.NONE;
        }
        const view = new RasterView('',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            loadOp,
            storeOp,
            clearFlag,
            clearColor);
        this._pass.rasterViews.set(name, view);
    }
    addDepthStencil (name: string, loadOp = LoadOp.CLEAR, storeOp = StoreOp.STORE, depth = 1, stencil = 0, clearFlag = ClearFlagBit.DEPTH_STENCIL): void {
        if (DEBUG) {
            assert(name && this._resourceGraph.contains(name));
        }
        const view = new RasterView('',
            AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
            loadOp,
            storeOp,
            clearFlag,
            new Color(depth, stencil, 0, 0));
        this._pass.rasterViews.set(name, view);
    }
    private _addComputeResource (name: string, accessType: AccessType, slotName: string) {
        const view = new ComputeView(slotName);
        view.accessType = accessType;
        if (DEBUG) {
            assert(view.name);
            assert(name && this._resourceGraph.contains(name));
            const descriptorName = view.name;
            const descriptorID = this._layoutGraph.attributeIndex.get(descriptorName);
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
            const descriptorID = this._layoutGraph.attributeIndex.get(slotName)!;
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
        this._pass.subpassGraph.addVertex(name, new Subpass());
        const subpass = new RasterSubpass(subpassID, 1, 0);
        const data = new RenderData();
        const vertID = this._renderGraph.addVertex<RenderGraphValue.RasterSubpass>(
            RenderGraphValue.RasterSubpass, subpass, name, layoutName, data, false,
        );
        const result = new WebRenderSubpassBuilder(data, this._renderGraph, this._layoutGraph, vertID, subpass, this._pipeline);
        return result;
    }
    addQueue (hint: QueueHint = QueueHint.RENDER_OPAQUE, layoutName = 'default') {
        if (DEBUG) {
            const layoutId = this._layoutGraph.locateChild(this._layoutID, layoutName);
            assert(layoutId !== 0xFFFFFFFF);
        }
        const queue = new RenderQueue(hint);
        const data = new RenderData();
        const queueID = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue, queue, '', layoutName, data, false, this._vertID,
        );
        return new WebRenderQueueBuilder(data, this._renderGraph, this._layoutGraph, queueID, queue, this._pipeline);
    }

    addFullscreenQuad (material: Material, passID: number, sceneFlags = SceneFlags.NONE, name = 'FullscreenQuad') {
        const queue = new RenderQueue(QueueHint.RENDER_TRANSPARENT);
        const queueId = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue, queue,
            'Queue', '', new RenderData(),
            false, this._vertID,
        );
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit, new Blit(material, passID, sceneFlags, null),
            name, '', new RenderData(), false, queueId,
        );
    }

    addCameraQuad (camera: Camera, material: Material, passID: number, sceneFlags: SceneFlags, name = 'CameraQuad') {
        const queue = new RenderQueue(QueueHint.RENDER_TRANSPARENT);
        const queueId = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue, queue,
            'Queue', '', new RenderData(), false, this._vertID,
        );
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit, new Blit(material, passID, sceneFlags, camera),
            name, '', new RenderData(), false, queueId,
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
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _layoutID: number;
    private readonly _pass: RasterPass;
    private readonly _pipeline: PipelineSceneData;
    private readonly _layoutGraph: LayoutGraphData;
    private readonly _resourceGraph: ResourceGraph;
}

export class WebComputeQueueBuilder extends WebSetter implements ComputeQueueBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._queue = queue;
        this._pipeline = pipeline;
    }
    setArrayBuffer (name: string, arrayBuffer: ArrayBuffer): void {
        throw new Error('Method not implemented.');
    }
    get name () {
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
    ) {
        this._renderGraph.addVertex<RenderGraphValue.Dispatch>(
            RenderGraphValue.Dispatch,
            new Dispatch(material, passID, threadGroupCountX, threadGroupCountY, threadGroupCountZ),
            name, '', new RenderData(), false, this._vertID,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _queue: RenderQueue;
    private readonly _pipeline: PipelineSceneData;
}

export class WebComputePassBuilder extends WebSetter implements ComputePassBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, resourceGraph: ResourceGraph, vertID: number, pass: ComputePass, pipeline: PipelineSceneData) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._layoutGraph = layoutGraph;
        this._resourceGraph = resourceGraph;
        this._vertID = vertID;
        this._pass = pass;
        this._pipeline = pipeline;

        const layoutName = this._renderGraph.component<RenderGraphComponent.Layout>(
            RenderGraphComponent.Layout, this._vertID,
        );
        this._layoutID = layoutGraph.locateChild(layoutGraph.nullVertex(), layoutName);
    }
    setCustomShaderStages (name: string, stageFlags: ShaderStageFlagBit): void {
        throw new Error('Method not implemented.');
    }
    setArrayBuffer (name: string, arrayBuffer: ArrayBuffer): void {
        throw new Error('Method not implemented.');
    }
    get name () {
        return this._renderGraph.getName(this._vertID);
    }
    set name (name: string) {
        this._renderGraph.setName(this._vertID, name);
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
    addMaterialTexture (resourceName: string, flags?: ShaderStageFlagBit | undefined): void {
        throw new Error('Method not implemented.');
    }
    addQueue (layoutName = 'default') {
        if (DEBUG) {
            const layoutId = this._layoutGraph.locateChild(this._layoutID, layoutName);
            assert(layoutId !== 0xFFFFFFFF);
        }
        const queue = new RenderQueue();
        const data = new RenderData();
        const queueID = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue, queue, '', layoutName, data, false, this._vertID,
        );
        return new WebComputeQueueBuilder(data, this._renderGraph, this._layoutGraph, queueID, queue, this._pipeline);
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _layoutGraph: LayoutGraphData;
    private readonly _resourceGraph: ResourceGraph;
    private readonly _vertID: number;
    private readonly _layoutID: number;
    private readonly _pass: ComputePass;
    private readonly _pipeline: PipelineSceneData;
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
    get name () {
        return this._renderGraph.getName(this._vertID);
    }
    set name (name: string) {
        this._renderGraph.setName(this._vertID, name);
    }
    addPair (pair: MovePair) {
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
    get name () {
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
    get type () {
        return PipelineType.BASIC;
    }
    get capabilities () {
        return new PipelineCapabilities();
    }
    addCustomBuffer (name: string, info: BufferInfo, type: string): number {
        throw new Error('Method not implemented.');
    }
    addCustomTexture (name: string, info: TextureInfo, type: string): number {
        throw new Error('Method not implemented.');
    }
    addRenderWindow (name: string, format: Format, width: number, height: number, renderWindow: RenderWindow): number {
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
            return this._resourceGraph.addVertex<ResourceGraphValue.Framebuffer>(
                ResourceGraphValue.Framebuffer,
                renderWindow.framebuffer,
                name, desc,
                new ResourceTraits(ResourceResidency.EXTERNAL),
                new ResourceStates(),
                new SamplerInfo(),
            );
        } else {
            return this._resourceGraph.addVertex<ResourceGraphValue.Swapchain>(
                ResourceGraphValue.Swapchain,
                new RenderSwapchain(renderWindow.swapchain),
                name, desc,
                new ResourceTraits(ResourceResidency.BACKBUFFER),
                new ResourceStates(),
                new SamplerInfo(),
            );
        }
    }
    updateRenderWindow (name: string, renderWindow: RenderWindow): void {
        const resId = this.resourceGraph.vertex(name);
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
    public containsResource (name: string): boolean {
        return this._resourceGraph.contains(name);
    }
    public addResolvePass (resolvePairs: ResolvePair[]): void {
        // TODO: implement resolve pass
        throw new Error('Method not implemented.');
    }
    public addCopyPass (copyPairs: CopyPair[]) {
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
            currRaster.addRenderTarget(targetName, LoadOp.CLEAR, StoreOp.STORE, new Color(0, 0, 0, 0));
            currRaster.addTexture(pair.source, 'outputResultMap');
            currRaster.addQueue(QueueHint.NONE).addFullscreenQuad(this._copyPassMat, 0, SceneFlags.NONE);
        }
    }
    protected _generateConstantMacros (clusterEnabled: boolean) {
        let str = '';
        str += `#define CC_DEVICE_SUPPORT_FLOAT_TEXTURE ${this._device.getFormatFeatures(Format.RGBA32F)
            & (FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE) ? 1 : 0}\n`;
        str += `#define CC_ENABLE_CLUSTERED_LIGHT_CULLING ${clusterEnabled ? 1 : 0}\n`;
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
    public setCustomPipelineName (name: string) {
        this._customPipelineName = name;
        if (this._customPipelineName === 'Deferred') {
            this._usesDeferredPipeline = true;
        }
    }

    public getGlobalDescriptorSetData () {
        const stageId = this.layoutGraph.locateChild(this.layoutGraph.nullVertex(), 'default');
        assert(stageId !== 0xFFFFFFFF);
        const layout = this.layoutGraph.getLayout(stageId);
        const layoutData = layout.descriptorSets.get(UpdateFrequency.PER_PASS);
        return layoutData;
    }

    private _initCombineSignY () {
        const device = this._device;
        this._combineSignY = (device.capabilities.screenSpaceSignY * 0.5 + 0.5) << 1 | (device.capabilities.clipSpaceSignY * 0.5 + 0.5);
    }

    public getCombineSignY () {
        return this._combineSignY;
    }

    get globalDescriptorSetData () {
        return this._globalDescSetData;
    }

    private _compileMaterial () {
        this._copyPassMat.initialize({
            effectName: 'pipeline/copy-pass',
        });
        for (let i = 0; i < this._copyPassMat.passes.length; ++i) {
            this._copyPassMat.passes[i].tryCompile();
        }
    }

    public activate (swapchain: Swapchain): boolean {
        this._device = deviceManager.gfxDevice;
        createGfxDescriptorSetsAndPipelines(this._device, this._layoutGraph);
        this._globalDSManager = new GlobalDSManager(this._device);
        this._globalDescSetData = this.getGlobalDescriptorSetData()!;
        this._globalDescriptorSetLayout = this._globalDescSetData.descriptorSetLayout;
        this._globalDescriptorSetInfo = new DescriptorSetInfo(this._globalDescriptorSetLayout!);
        this._globalDescriptorSet = isEnableEffect() ? this._device.createDescriptorSet(this._globalDescriptorSetInfo)
            : this._globalDescSetData.descriptorSet;
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
        this.setMacroBool('CC_CASCADED_LAYERS_TRANSITION',  false);

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
        // do nothing
    }
    beginSetup (): void {
        if (!this._renderGraph) this._renderGraph = new RenderGraph();
    }
    endSetup (): void {
        this.compile();
    }
    addStorageBuffer (name: string, format: Format, size: number, residency = ResourceResidency.MANAGED): number {
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.BUFFER;
        desc.width = size;
        desc.height = 1;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.flags = ResourceFlags.STORAGE;

        return this._resourceGraph.addVertex<ResourceGraphValue.ManagedBuffer>(
            ResourceGraphValue.ManagedBuffer,
            new ManagedBuffer(),
            name, desc,
            new ResourceTraits(residency),
            new ResourceStates(),
            new SamplerInfo(),
        );
    }
    addRenderTarget (name: string, format: Format, width: number, height: number, residency = ResourceResidency.MANAGED) {
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.flags = ResourceFlags.COLOR_ATTACHMENT | ResourceFlags.SAMPLED;

        return this._resourceGraph.addVertex<ResourceGraphValue.Managed>(
            ResourceGraphValue.Managed,
            new ManagedResource(),
            name, desc,
            new ResourceTraits(residency),
            new ResourceStates(),
            new SamplerInfo(Filter.LINEAR, Filter.LINEAR, Filter.NONE, Address.CLAMP, Address.CLAMP, Address.CLAMP),
        );
    }
    addDepthStencil (name: string, format: Format, width: number, height: number, residency = ResourceResidency.MANAGED) {
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.flags = ResourceFlags.DEPTH_STENCIL_ATTACHMENT | ResourceFlags.SAMPLED;
        return this._resourceGraph.addVertex<ResourceGraphValue.Managed>(
            ResourceGraphValue.Managed,
            new ManagedResource(),
            name, desc,
            new ResourceTraits(residency),
            new ResourceStates(),
            new SamplerInfo(Filter.POINT, Filter.POINT, Filter.NONE),
        );
    }
    addStorageTexture (name: string, format: Format, width: number, height: number, residency = ResourceResidency.MANAGED) {
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
            name, desc,
            new ResourceTraits(residency),
            new ResourceStates(),
            new SamplerInfo(Filter.POINT, Filter.POINT, Filter.NONE),
        );
    }
    addShadingRateTexture (name: string, width: number, height: number, residency = ResourceResidency.MANAGED) {
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
            name, desc,
            new ResourceTraits(residency),
            new ResourceStates(),
            new SamplerInfo(Filter.LINEAR, Filter.LINEAR, Filter.NONE, Address.CLAMP, Address.CLAMP, Address.CLAMP),
        );
    }
    beginFrame () {
        // noop
    }
    update (camera: Camera) {
        // noop
    }
    endFrame () {
        // this._renderGraph = null;
        this.renderGraph?.clear();
    }

    compile () {
        if (!this._renderGraph) {
            throw new Error('RenderGraph cannot be built without being created');
        }
        if (!this._compiler) {
            this._compiler = new Compiler(this, this._renderGraph, this._resourceGraph, this._layoutGraph);
        }
        this._compiler.compile(this._renderGraph);
    }

    execute () {
        if (!this._renderGraph) {
            throw new Error('Cannot run without creating rendergraph');
        }
        if (!this._executor) {
            this._executor = new Executor(this, this._pipelineUBO, this._device,
                this._resourceGraph, this.layoutGraph, this.width, this.height);
        }
        this._executor.resize(this.width, this.height);
        this._executor.execute(this._renderGraph);
    }
    protected _applySize (cameras: Camera[]) {
        let newWidth = this._width;
        let newHeight = this._height;
        cameras.forEach((camera) => {
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
    get width () { return this._width; }
    get height () { return this._height; }
    render (cameras: Camera[]) {
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
    addRenderPassImpl (width: number, height: number, layoutName: string, count = 1, quality = 0): BasicRenderPassBuilder  {
        if (DEBUG) {
            const stageId = this.layoutGraph.locateChild(this.layoutGraph.nullVertex(), layoutName);
            assert(stageId !== 0xFFFFFFFF);
            const layout = this.layoutGraph.getLayout(stageId);
            assert(layout);
            assert(layout.descriptorSets.get(UpdateFrequency.PER_PASS));
        }
        const name = 'Raster';
        const pass = new RasterPass();
        pass.viewport.width = width;
        pass.viewport.height = height;
        pass.count = count;
        pass.quality = quality;

        const data = new RenderData();
        const vertID = this._renderGraph!.addVertex<RenderGraphValue.RasterPass>(
            RenderGraphValue.RasterPass, pass, name, layoutName, data, false,
        );
        const result = new WebRenderPassBuilder(data, this._renderGraph!, this._layoutGraph, this._resourceGraph, vertID, pass, this._pipelineSceneData);
        this._updateRasterPassConstants(result, width, height, isEnableEffect() ? layoutName : 'default');
        initGlobalDescBinding(data, layoutName);
        return result;
    }
    addRenderPass (width: number, height: number, layoutName = 'default'): BasicRenderPassBuilder {
        return this.addRenderPassImpl(width, height, layoutName);
    }
    addMultisampleRenderPass (width: number, height: number, count: number, quality: number, layoutName = 'default'): BasicRenderPassBuilder {
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
    get renderGraph () {
        return this._renderGraph;
    }
    get resourceGraph () {
        return this._resourceGraph;
    }
    get layoutGraph () {
        return this._layoutGraph;
    }

    get resourceUses () {
        return this._resourceUses;
    }

    protected _updateRasterPassConstants (setter: WebSetter, width: number, height: number, layoutName = 'default') {
        const director = cclegacy.director;
        const root = director.root;
        const shadingWidth = width;
        const shadingHeight = height;
        const pipeline = root.pipeline as WebPipeline;
        const layoutGraph = pipeline.layoutGraph;
        // Global
        if (!setter.addConstant('CCGlobal', layoutName)) return;
        uniformOffset = setter.getUniformOffset('cc_time', Type.FLOAT4);
        if (setter.hasUniform(uniformOffset)) {
            _uboVec.set(root.cumulativeTime, root.frameTime, director.getTotalFrames());
            setter.offsetVec4(_uboVec, uniformOffset);
        }
        uniformOffset = setter.getUniformOffset('cc_screenSize', Type.FLOAT4);
        if (setter.hasUniform(uniformOffset)) {
            _uboVec.set(shadingWidth, shadingHeight, 1.0 / shadingWidth, 1.0 / shadingHeight);
            setter.offsetVec4(_uboVec, uniformOffset);
        }
        uniformOffset = setter.getUniformOffset('cc_nativeSize', Type.FLOAT4);
        if (setter.hasUniform(uniformOffset)) {
            _uboVec.set(shadingWidth, shadingHeight, 1.0 / shadingWidth, 1.0 / shadingHeight);
            setter.offsetVec4(_uboVec, uniformOffset);
        }
        const debugView = root.debugView;
        uniformOffset = setter.getUniformOffset('cc_debug_view_mode', Type.FLOAT4);
        if (debugView) {
            if (setter.hasUniform(uniformOffset)) {
                const debugPackVec: number[] = [debugView.singleMode as number, 0.0, 0.0, 0.0];
                for (let i = DebugViewCompositeType.DIRECT_DIFFUSE as number; i < DebugViewCompositeType.MAX_BIT_COUNT; i++) {
                    const idx = i >> 3;
                    const bit = i % 8;
                    debugPackVec[idx + 1] += (debugView.isCompositeModeEnabled(i) ? 1.0 : 0.0) * (10.0 ** bit);
                }
                debugPackVec[3] += (debugView.lightingWithAlbedo ? 1.0 : 0.0) * (10.0 ** 6.0);
                debugPackVec[3] += (debugView.csmLayerColoration ? 1.0 : 0.0) * (10.0 ** 7.0);
                _uboVec.set(debugPackVec[0], debugPackVec[1], debugPackVec[2], debugPackVec[3]);
                setter.offsetVec4(_uboVec, uniformOffset);
            }
        } else if (setter.hasUniform(uniformOffset)) {
            _uboVec.set(0.0, 0.0, 0.0, 0.0);
            setter.offsetVec4(_uboVec, uniformOffset);
        }
    }

    public static MAX_BLOOM_FILTER_PASS_NUM = 6;
    private _usesDeferredPipeline = false;
    private _copyPassMat: Material = new Material();
    private _device!: Device;
    private _globalDSManager!: GlobalDSManager;
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
