/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

/* eslint-disable max-len */
import { systemInfo } from 'pal/system-info';
import { Color, Buffer, DescriptorSetLayout, Device, Feature, Format, FormatFeatureBit, Sampler, Swapchain, Texture, ClearFlagBit, DescriptorSet, deviceManager, Viewport, API, CommandBuffer, Type, SamplerInfo, Filter, Address } from '../../gfx/index';
import { Mat4, Quat, Vec2, Vec3, Vec4 } from '../../math';
import { ComputeView, LightInfo, LightingMode, QueueHint, RasterView, ResourceDimension, ResourceFlags, ResourceResidency, SceneFlags, UpdateFrequency } from './types';
import { Blit, ClearView, ComputePass, CopyPair, CopyPass, Dispatch, ManagedResource, MovePair, MovePass, RasterPass, RenderData, RenderGraph, RenderGraphComponent, RenderGraphValue, RenderQueue, RenderSwapchain, ResourceDesc, ResourceGraph, ResourceGraphValue, ResourceStates, ResourceTraits, SceneData } from './render-graph';
import { ComputePassBuilder, ComputeQueueBuilder, CopyPassBuilder, LayoutGraphBuilder, MovePassBuilder, Pipeline, PipelineBuilder, RasterPassBuilder, RasterQueueBuilder, SceneTransversal } from './pipeline';
import { PipelineSceneData } from '../pipeline-scene-data';
import { Model, Camera, ShadowType, CSMLevel, DirectionalLight, SpotLight, PCFType, Shadows } from '../../renderer/scene';
import { Light, LightType } from '../../renderer/scene/light';
import { legacyCC } from '../../global-exports';
import { LayoutGraphData } from './layout-graph';
import { Executor } from './executor';
import { RenderWindow } from '../../renderer/core/render-window';
import { assert } from '../../platform/debug';
import { macro } from '../../platform/macro';
import { MacroRecord, RenderScene } from '../../renderer';
import { GlobalDSManager } from '../global-descriptor-set-manager';
import { supportsR32FloatTexture, UNIFORM_SHADOWMAP_BINDING, UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING } from '../define';
import { OS } from '../../../../pal/system-info/enum-type';
import { Compiler } from './compiler';
import { PipelineUBO } from '../pipeline-ubo';
import { builtinResMgr } from '../../builtin/builtin-res-mgr';
import { Texture2D } from '../../assets/texture-2d';
import { WebLayoutGraphBuilder } from './web-layout-graph';
import { GeometryRenderer } from '../geometry-renderer';
import { Material, TextureCube } from '../../assets';
import { DeferredPipelineBuilder, ForwardPipelineBuilder } from './builtin-pipelines';
import { decideProfilerCamera } from '../pipeline-funcs';
import { DebugViewCompositeType } from '../debug-view';
import { getUBOTypeCount } from './utils';

export class WebSetter {
    constructor (data: RenderData, lg: LayoutGraphData) {
        this._data = data;
        this._lg = lg;
    }
    protected _applyCurrConstantBuffer (name: string, target: any, type: Type, idx = 0) {
        const offset = this._getUniformOffset(name, type, idx);
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
            Vec2.toArray(arr, new Vec2(target.x, target.y), offset);
            break;
        default:
        }
    }

    protected _getUniformOffset (name: string, type: Type, idx = 0) {
        const currBlock = this._getCurrUniformBlock();
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
                assert(false);
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
        return layout.uniformBlocks.get(nameID)!;
    }

    setCurrConstant (block: string, stage = 'default') {
        this._currBlock = block;
        this._currStage = stage;
        const nameID: number = this._lg.attributeIndex.get(block)!;
        this._currCount = 0;
        const currBlock = this._getCurrUniformBlock();
        for (const uniform of currBlock.members) {
            this._currCount += getUBOTypeCount(uniform.type) * uniform.count;
        }
        this._currConstant = this._data.constants.get(nameID)!;
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
        for (const uniform of currBlock.members) {
            this._currCount += getUBOTypeCount(uniform.type) * uniform.count;
        }
        if (!this._data.constants.get(num)) {
            const value = new Array(this._currCount);
            this._data.constants.set(num, value);
        }
        this.setCurrConstant(block);
    }
    public setMat4 (name: string, mat: Mat4, idx = 0): void {
        this._applyCurrConstantBuffer(name, mat, Type.MAT4, idx);
    }
    public setQuaternion (name: string, quat: Quat, idx = 0): void {
        this._applyCurrConstantBuffer(name, new Vec4(quat.x, quat.y, quat.z, quat.w), Type.FLOAT4, idx);
    }
    public setColor (name: string, color: Color, idx = 0): void {
        this._applyCurrConstantBuffer(name, new Vec4(color.x, color.y, color.z, color.w), Type.FLOAT4, idx);
    }
    public setVec4 (name: string, vec: Vec4, idx = 0): void {
        this._applyCurrConstantBuffer(name, vec, Type.FLOAT4, idx);
    }
    public setVec2 (name: string, vec: Vec2, idx = 0): void {
        this._applyCurrConstantBuffer(name, vec, Type.FLOAT2, idx);
    }
    public setFloat (name: string, v: number, idx = 0): void {
        this._applyCurrConstantBuffer(name, v, Type.FLOAT, idx);
    }
    public setBuffer (name: string, buffer: Buffer): void {}
    public setTexture (name: string, texture: Texture): void {
        const num = this._lg.attributeIndex.get(name)!;
        this._data.textures.set(num, texture);
    }
    public setReadWriteBuffer (name: string, buffer: Buffer): void {}
    public setReadWriteTexture (name: string, texture: Texture): void {}
    public setSampler (name: string, sampler: Sampler): void {
        const num = this._lg.attributeIndex.get(name)!;
        this._data.samplers.set(num, sampler);
    }

    // protected
    protected readonly _data: RenderData;
    protected readonly _lg: LayoutGraphData;
    protected _currBlock;
    protected _currStage;
    protected _currCount;
    protected _currConstant: number[] = [];
}

function setShadowUBOLightView (setter: WebSetter,
    light: Light,
    level: number) {
    const director = legacyCC.director;
    const pipeline = director.root.pipeline;
    const device = pipeline.device;
    const sceneData = pipeline.pipelineSceneData;
    const shadowInfo = sceneData.shadows;
    const csmLayers = sceneData.csmLayers;
    const packing = supportsR32FloatTexture(device) ? 0.0 : 1.0;
    const cap = pipeline.device.capabilities;
    const _vec4ShadowInfo = new Vec4();
    // ShadowMap
    setter.addConstant('CCShadow');
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
                    _vec4ShadowInfo.set(0.0, packing, mainLight.shadowNormalBias, 0);
                    setter.setVec4('cc_shadowLPNNInfo', _vec4ShadowInfo);
                } else {
                    const layer = csmLayers.layers[level];
                    matShadowView = layer.matShadowView;
                    matShadowProj = layer.matShadowProj;
                    matShadowViewProj = layer.matShadowViewProj;

                    near = layer.splitCameraNear;
                    far = layer.splitCameraFar;
                    levelCount = mainLight.csmLevel;
                }
                setter.setMat4('cc_matLightView', matShadowView);
                setter.setVec4('cc_shadowProjDepthInfo', new Vec4(matShadowProj.m10, matShadowProj.m14,
                    matShadowProj.m11, matShadowProj.m15));
                setter.setVec4('cc_shadowProjInfo', new Vec4(matShadowProj.m00, matShadowProj.m05,
                    1.0 / matShadowProj.m00, 1.0 / matShadowProj.m05));
                setter.setMat4('cc_matLightViewProj', matShadowViewProj);
                _vec4ShadowInfo.set(near, far, 0, 1.0 - mainLight.shadowSaturation);
                setter.setVec4('cc_shadowNFLSInfo', _vec4ShadowInfo);
                _vec4ShadowInfo.set(0.0, packing, mainLight.shadowNormalBias, levelCount);
                setter.setVec4('cc_shadowLPNNInfo', _vec4ShadowInfo);
                _vec4ShadowInfo.set(shadowInfo.size.x, shadowInfo.size.y, mainLight.shadowPcf, mainLight.shadowBias);
                setter.setVec4('cc_shadowWHPBInfo', _vec4ShadowInfo);
            }
        }
        break;
    }
    case LightType.SPOT: {
        const spotLight = light as SpotLight;
        const _matShadowView = new Mat4();
        const _matShadowProj = new Mat4();
        const _matShadowViewProj = new Mat4();
        if (shadowInfo.enabled && spotLight && spotLight.shadowEnabled) {
            Mat4.invert(_matShadowView, (light as any).node.getWorldMatrix());
            setter.setMat4('cc_matLightView', _matShadowView);

            Mat4.perspective(_matShadowProj, (light as any).angle, 1.0, 0.001, (light as any).range,
                true, cap.clipSpaceMinZ, cap.clipSpaceSignY, 0);

            Mat4.multiply(_matShadowViewProj, _matShadowProj, _matShadowView);
            setter.setMat4('cc_matLightViewProj', _matShadowViewProj);

            _vec4ShadowInfo.set(0.01, (light as SpotLight).range, 0.0, 0.0);
            setter.setVec4('cc_shadowNFLSInfo', _vec4ShadowInfo);

            _vec4ShadowInfo.set(shadowInfo.size.x, shadowInfo.size.y, spotLight.shadowPcf, spotLight.shadowBias);
            setter.setVec4('cc_shadowWHPBInfo', _vec4ShadowInfo);

            _vec4ShadowInfo.set(1.0, packing, spotLight.shadowNormalBias, 0.0);
            setter.setVec4('cc_shadowLPNNInfo', _vec4ShadowInfo);
        }
        break;
    }
    default:
    }
    setter.setColor('cc_shadowColor', new Color(shadowInfo.shadowColor.r, shadowInfo.shadowColor.g,
        shadowInfo.shadowColor.b, shadowInfo.shadowColor.a));
}

function getPCFRadius (shadowInfo: Shadows, mainLight: DirectionalLight): number {
    const shadowMapSize = shadowInfo.size.x;
    switch (mainLight.shadowPcf) {
    case PCFType.HARD:
        return 0.0;
    case PCFType.SOFT:
        return 1.0  / (shadowMapSize * 0.5);
    case PCFType.SOFT_2X:
        return 2.0  / (shadowMapSize * 0.5);
    // case PCFType.SOFT_4X:
    //     return 3.0  / (shadowMapSize * 0.5);
    default:
    }
    return 0.0;
}

function setShadowUBOView (setter: WebSetter, camera: Camera) {
    const director = legacyCC.director;
    const pipeline = director.root.pipeline;
    const device = pipeline.device;
    const mainLight = camera.scene!.mainLight;
    const sceneData = pipeline.pipelineSceneData;
    const shadowInfo = sceneData.shadows;
    const csmLayers = sceneData.csmLayers;
    const csmSupported = sceneData.csmSupported;
    const packing = supportsR32FloatTexture(device) ? 0.0 : 1.0;
    const _vec4ShadowInfo = new Vec4();
    setter.addConstant('CCShadow');
    setter.addConstant('CCCSM');
    if (mainLight && shadowInfo.enabled) {
        if (shadowInfo.type === ShadowType.ShadowMap) {
            if (mainLight.shadowEnabled) {
                if (mainLight.shadowFixedArea || mainLight.csmLevel === CSMLevel.LEVEL_1 || !csmSupported) {
                    setter.setCurrConstant('CCShadow');
                    const matShadowView = csmLayers.specialLayer.matShadowView;
                    const matShadowProj = csmLayers.specialLayer.matShadowProj;
                    const matShadowViewProj = csmLayers.specialLayer.matShadowViewProj;
                    const near = mainLight.shadowNear;
                    const far = mainLight.shadowFar;

                    setter.setMat4('cc_matLightView', matShadowView);
                    setter.setVec4('cc_shadowProjDepthInfo', new Vec4(matShadowProj.m10, matShadowProj.m14,
                        matShadowProj.m11, matShadowProj.m15));

                    setter.setVec4('cc_shadowProjInfo', new Vec4(matShadowProj.m00, matShadowProj.m05,
                        1.0 / matShadowProj.m00, 1.0 / matShadowProj.m05));
                    setter.setMat4('cc_matLightViewProj', matShadowViewProj);
                    _vec4ShadowInfo.set(near, far, 0, 1.0 - mainLight.shadowSaturation);
                    setter.setVec4('cc_shadowNFLSInfo', _vec4ShadowInfo);
                    _vec4ShadowInfo.set(0.0, packing, mainLight.shadowNormalBias, 0);
                    setter.setVec4('cc_shadowLPNNInfo', _vec4ShadowInfo);
                } else {
                    const layerThreshold = getPCFRadius(shadowInfo, mainLight);
                    setter.setCurrConstant('CCCSM');
                    for (let i = 0; i < mainLight.csmLevel; i++) {
                        const matShadowView = csmLayers.layers[i].matShadowView;
                        _vec4ShadowInfo.set(matShadowView.m00, matShadowView.m04, matShadowView.m08, layerThreshold);
                        setter.setVec4('cc_csmViewDir0', _vec4ShadowInfo, i);
                        _vec4ShadowInfo.set(matShadowView.m01, matShadowView.m05, matShadowView.m09, 0.0);
                        setter.setVec4('cc_csmViewDir1', _vec4ShadowInfo, i);
                        _vec4ShadowInfo.set(matShadowView.m02, matShadowView.m06, matShadowView.m10, 0.0);
                        setter.setVec4('cc_csmViewDir2', _vec4ShadowInfo, i);

                        const csmAtlas = csmLayers.layers[i].csmAtlas;
                        setter.setVec4('cc_csmAtlas', csmAtlas, i);

                        setter.setFloat('cc_csmSplitsInfo', csmLayers.layers[i].splitCameraFar / mainLight.shadowDistance, i);
                        const matShadowViewProj = csmLayers.layers[i].matShadowViewProj;
                        setter.setMat4('cc_matCSMViewProj', matShadowViewProj, i);

                        const matShadowProj = csmLayers.layers[i].matShadowProj;
                        setter.setVec4('cc_csmProjDepthInfo', new Vec4(matShadowProj.m10,
                            matShadowProj.m14, matShadowProj.m11, matShadowProj.m15), i);

                        setter.setVec4('cc_csmProjInfo', new Vec4(matShadowProj.m00,
                            matShadowProj.m05, 1.0 / matShadowProj.m00, 1.0 / matShadowProj.m05), i);
                    }
                    setter.setCurrConstant('CCShadow');
                    _vec4ShadowInfo.set(0, 0, 0, 1.0 - mainLight.shadowSaturation);
                    setter.setVec4('cc_shadowNFLSInfo', _vec4ShadowInfo);
                    _vec4ShadowInfo.set(0.0, packing, mainLight.shadowNormalBias, mainLight.csmLevel);
                    setter.setVec4('cc_shadowLPNNInfo', _vec4ShadowInfo);
                }
                setter.setCurrConstant('CCShadow');
                _vec4ShadowInfo.set(shadowInfo.size.x, shadowInfo.size.y, mainLight.shadowPcf, mainLight.shadowBias);
                setter.setVec4('cc_shadowWHPBInfo', _vec4ShadowInfo);
            }
        } else {
            setter.setCurrConstant('CCShadow');
            const _tempVec3 = new Vec3();
            Vec3.normalize(_tempVec3, shadowInfo.normal);
            setter.setVec4('cc_planarNDInfo', new Vec4(_tempVec3.x, _tempVec3.y, _tempVec3.z, -shadowInfo.distance));
        }
        setter.setCurrConstant('CCShadow');
        setter.setColor('cc_shadowColor', shadowInfo.shadowColor);
    }
}

function setCameraUBOValues (setter: WebSetter,
    camera: Readonly<Camera>, cfg: Readonly<PipelineSceneData>,
    scene: Readonly<RenderScene>) {
    const director = legacyCC.director;
    const root = director.root;
    const pipeline = root.pipeline as WebPipeline;
    const layoutGraph = pipeline.layoutGraph;
    const shadowInfo = cfg.shadows;
    const skybox = cfg.skybox;
    const shadingScale = cfg.shadingScale;
    // Camera
    setter.addConstant('CCCamera');
    setter.setMat4('cc_matView', camera.matView);
    setter.setMat4('cc_matViewInv', camera.node.worldMatrix);
    setter.setMat4('cc_matProj', camera.matProj);
    setter.setMat4('cc_matProjInv', camera.matProjInv);
    setter.setMat4('cc_matViewProj', camera.matViewProj);
    setter.setMat4('cc_matViewProjInv', camera.matViewProjInv);
    setter.setVec4('cc_cameraPos', new Vec4(camera.position.x, camera.position.y, camera.position.z, 0.0));
    setter.setVec4('cc_surfaceTransform', new Vec4(camera.surfaceTransform, 0.0, 0.0, 0.0));
    setter.setVec4('cc_screenScale', new Vec4(cfg.shadingScale, cfg.shadingScale, 1.0 / cfg.shadingScale, 1.0 / cfg.shadingScale));
    setter.setVec4('cc_exposure', new Vec4(camera.exposure, 1.0 / camera.exposure, cfg.isHDR ? 1.0 : 0.0, 1.0 / Camera.standardExposureValue));

    const mainLight = scene.mainLight;
    if (mainLight) {
        const shadowEnable = (mainLight.shadowEnabled && shadowInfo.type === ShadowType.ShadowMap) ? 1.0 : 0.0;
        setter.setVec4('cc_mainLitDir', new Vec4(mainLight.direction.x, mainLight.direction.y, mainLight.direction.z, shadowEnable));
        let r = mainLight.color.x;
        let g = mainLight.color.y;
        let b = mainLight.color.z;
        if (mainLight.useColorTemperature) {
            r *= mainLight.colorTemperatureRGB.x;
            g *= mainLight.colorTemperatureRGB.y;
            b *= mainLight.colorTemperatureRGB.z;
        }
        let w = mainLight.illuminance;
        if (cfg.isHDR) {
            w *= camera.exposure;
        }
        setter.setVec4('cc_mainLitColor', new Vec4(r, g, b, w));
    } else {
        setter.setVec4('cc_mainLitDir', new Vec4(0, 0, 1, 0));
        setter.setVec4('cc_mainLitColor', new Vec4(0, 0, 0, 0));
    }

    const ambient = cfg.ambient;
    const skyColor = ambient.skyColor;
    if (cfg.isHDR) {
        skyColor.w = ambient.skyIllum * camera.exposure;
    } else {
        skyColor.w = ambient.skyIllum;
    }
    setter.setVec4('cc_ambientSky', new Vec4(skyColor.x, skyColor.y, skyColor.z, skyColor.w));
    setter.setVec4('cc_ambientGround', new Vec4(ambient.groundAlbedo.x, ambient.groundAlbedo.y, ambient.groundAlbedo.z, skybox.envmap ? skybox.envmap?.mipmapLevel : 1.0));

    const fog = cfg.fog;
    const colorTempRGB = fog.colorArray;
    setter.setVec4('cc_fogColor', new Vec4(colorTempRGB.x, colorTempRGB.y, colorTempRGB.z, colorTempRGB.w));
    setter.setVec4('cc_fogBase', new Vec4(fog.fogStart, fog.fogEnd, fog.fogDensity, 0.0));
    setter.setVec4('cc_fogAdd', new Vec4(fog.fogTop, fog.fogRange, fog.fogAtten, 0.0));
    setter.setVec4('cc_nearFar', new Vec4(camera.nearClip, camera.farClip, 0.0, 0.0));
    setter.setVec4('cc_viewPort', new Vec4(camera.viewport.x, camera.viewport.y, shadingScale * camera.window.width * camera.viewport.z, shadingScale * camera.window.height * camera.viewport.w));
}

function setTextureUBOView (setter: WebSetter, camera: Camera, cfg: Readonly<PipelineSceneData>) {
    const skybox = cfg.skybox;
    const director = legacyCC.director;
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
    const _samplerPointInfo = new SamplerInfo(
        Filter.POINT,
        Filter.POINT,
        Filter.NONE,
        Address.CLAMP,
        Address.CLAMP,
        Address.CLAMP,
    );
    const pointSampler = root.device.getSampler(_samplerPointInfo);
    setter.setSampler('cc_shadowMap', pointSampler);
    setter.setTexture('cc_shadowMap', builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
    setter.setSampler('cc_spotShadowMap', pointSampler);
    setter.setTexture('cc_spotShadowMap', builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
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

export class WebRasterQueueBuilder extends WebSetter implements RasterQueueBuilder  {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._queue = queue;
        this._pipeline = pipeline;
    }
    addSceneOfCamera (camera: Camera, light: LightInfo, sceneFlags: SceneFlags, name = 'Camera'): void {
        const sceneData = new SceneData(name, sceneFlags, light);
        sceneData.camera = camera;
        this._renderGraph.addVertex<RenderGraphValue.Scene>(
            RenderGraphValue.Scene, sceneData, name, '', new RenderData(), false, this._vertID,
        );
        setCameraUBOValues(this, camera, this._pipeline,
            camera.scene ? camera.scene : legacyCC.director.getScene().renderScene);
        if (sceneFlags & SceneFlags.SHADOW_CASTER) {
            setShadowUBOLightView(this, light.light!, light.level);
        } else {
            setShadowUBOView(this, camera);
        }
        setTextureUBOView(this, camera, this._pipeline);
    }
    addScene (sceneName: string, sceneFlags: SceneFlags): void {
        const sceneData = new SceneData(sceneName, sceneFlags);
        this._renderGraph.addVertex<RenderGraphValue.Scene>(
            RenderGraphValue.Scene, sceneData, sceneName, '', new RenderData(), false, this._vertID,
        );
    }
    addFullscreenQuad (material: Material, sceneFlags = SceneFlags.NONE, name = 'Quad'): void {
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit, new Blit(material, sceneFlags, null),
            name, '', new RenderData(), false, this._vertID,
        );
    }
    addCameraQuad (camera: Camera, material: Material, sceneFlags: SceneFlags) {
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit, new Blit(material, sceneFlags, camera),
            'CameraQuad', '', new RenderData(), false, this._vertID,
        );
    }
    clearRenderTarget (name: string, color: Color) {
        this._renderGraph.addVertex<RenderGraphValue.Clear>(
            RenderGraphValue.Clear, [new ClearView(name, ClearFlagBit.COLOR, color)],
            'ClearRenderTarget', '', new RenderData(), false, this._vertID,
        );
    }
    setViewport (viewport: Viewport) {
        this._renderGraph.addVertex<RenderGraphValue.Viewport>(
            RenderGraphValue.Viewport, viewport,
            'Viewport', '', new RenderData(), false, this._vertID,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _queue: RenderQueue;
    private readonly _pipeline: PipelineSceneData;
}

export class WebRasterPassBuilder extends WebSetter implements RasterPassBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, pass: RasterPass, pipeline: PipelineSceneData) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._layoutGraph = layoutGraph;
        this._vertID = vertID;
        this._pass = pass;
        this._pipeline = pipeline;

        const layoutName = this._renderGraph.component<RenderGraphComponent.Layout>(
            RenderGraphComponent.Layout, this._vertID,
        );
        this._layoutID = layoutGraph.locateChild(layoutGraph.nullVertex(), layoutName);
    }
    addRasterView (name: string, view: RasterView) {
        this._pass.rasterViews.set(name, view);
    }
    addComputeView (name: string, view: ComputeView) {
        if (this._pass.computeViews.has(name)) {
            this._pass.computeViews.get(name)?.push(view);
        } else {
            this._pass.computeViews.set(name, [view]);
        }
    }

    addQueue (hint: QueueHint = QueueHint.RENDER_OPAQUE, name = 'Queue') {
        const queue = new RenderQueue(hint);
        const data = new RenderData();
        const queueID = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue, queue, name, '', data, false, this._vertID,
        );
        return new WebRasterQueueBuilder(data, this._renderGraph, this._layoutGraph, queueID, queue, this._pipeline);
    }

    addFullscreenQuad (material: Material, sceneFlags = SceneFlags.NONE, name = 'FullscreenQuad') {
        const queue = new RenderQueue(QueueHint.RENDER_TRANSPARENT);
        const queueId = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue, queue,
            'Queue', '', new RenderData(),
            false, this._vertID,
        );
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit, new Blit(material, sceneFlags, null),
            name, '', new RenderData(), false, queueId,
        );
    }

    addCameraQuad (camera: Camera, material: Material, sceneFlags: SceneFlags, name = 'CameraQuad') {
        const queue = new RenderQueue(QueueHint.RENDER_TRANSPARENT);
        const queueId = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue, queue,
            'Queue', '', new RenderData(), false, this._vertID,
        );
        this._renderGraph.addVertex<RenderGraphValue.Blit>(
            RenderGraphValue.Blit, new Blit(material, sceneFlags, camera),
            name, '', new RenderData(), false, queueId,
        );
    }
    setViewport (viewport: Viewport): void {
        this._pass.viewport.copy(viewport);
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _layoutID: number;
    private readonly _pass: RasterPass;
    private readonly _pipeline: PipelineSceneData;
    private readonly _layoutGraph: LayoutGraphData;
}

export class WebComputeQueueBuilder extends WebSetter implements ComputeQueueBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, queue: RenderQueue, pipeline: PipelineSceneData) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._queue = queue;
        this._pipeline = pipeline;
    }
    addDispatch (shader: string,
        threadGroupCountX: number,
        threadGroupCountY: number,
        threadGroupCountZ: number,
        name = 'Dispatch') {
        this._renderGraph.addVertex<RenderGraphValue.Dispatch>(
            RenderGraphValue.Dispatch,
            new Dispatch(shader, threadGroupCountX, threadGroupCountY, threadGroupCountZ),
            name, '', new RenderData(), false, this._vertID,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _queue: RenderQueue;
    private readonly _pipeline: PipelineSceneData;
}

export class WebComputePassBuilder extends WebSetter implements ComputePassBuilder {
    constructor (data: RenderData, renderGraph: RenderGraph, layoutGraph: LayoutGraphData, vertID: number, pass: ComputePass, pipeline: PipelineSceneData) {
        super(data, layoutGraph);
        this._renderGraph = renderGraph;
        this._layoutGraph = layoutGraph;
        this._vertID = vertID;
        this._pass = pass;
        this._pipeline = pipeline;

        const layoutName = this._renderGraph.component<RenderGraphComponent.Layout>(
            RenderGraphComponent.Layout, this._vertID,
        );
        this._layoutID = layoutGraph.locateChild(layoutGraph.nullVertex(), layoutName);
    }
    addComputeView (name: string, view: ComputeView) {
        if (this._pass.computeViews.has(name)) {
            this._pass.computeViews.get(name)?.push(view);
        } else {
            this._pass.computeViews.set(name, [view]);
        }
    }
    addQueue (name = 'Queue') {
        const queue = new RenderQueue();
        const data = new RenderData();
        const queueID = this._renderGraph.addVertex<RenderGraphValue.Queue>(
            RenderGraphValue.Queue, queue, name, '', data, false, this._vertID,
        );
        return new WebComputeQueueBuilder(data, this._renderGraph, this._layoutGraph, queueID, queue, this._pipeline);
    }
    addDispatch (shader: string,
        threadGroupCountX: number,
        threadGroupCountY: number,
        threadGroupCountZ: number,
        name = 'Dispatch') {
        this._renderGraph.addVertex<RenderGraphValue.Dispatch>(
            RenderGraphValue.Dispatch,
            new Dispatch(shader, threadGroupCountX, threadGroupCountY, threadGroupCountZ),
            name, '', new RenderData(), false, this._vertID,
        );
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _layoutGraph: LayoutGraphData;
    private readonly _vertID: number;
    private readonly _layoutID: number;
    private readonly _pass: ComputePass;
    private readonly _pipeline: PipelineSceneData;
}

export class WebMovePassBuilder extends MovePassBuilder {
    constructor (renderGraph: RenderGraph, vertID: number, pass: MovePass) {
        super();
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._pass = pass;
    }
    addPair (pair: MovePair) {
        this._pass.movePairs.push(pair);
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _pass: MovePass;
}

export class WebCopyPassBuilder extends CopyPassBuilder {
    constructor (renderGraph: RenderGraph, vertID: number, pass: CopyPass) {
        super();
        this._renderGraph = renderGraph;
        this._vertID = vertID;
        this._pass = pass;
    }
    addPair (pair: CopyPair) {
        this._pass.copyPairs.push(pair);
    }
    private readonly _renderGraph: RenderGraph;
    private readonly _vertID: number;
    private readonly _pass: CopyPass;
}

function isManaged (residency: ResourceResidency): boolean {
    return residency === ResourceResidency.MANAGED
    || residency === ResourceResidency.MEMORYLESS;
}

export class WebPipeline extends Pipeline {
    public containsResource (name: string): boolean {
        return this._resourceGraph.contains(name);
    }
    public addComputePass(layoutName: string, name: string): ComputePassBuilder;
    public addComputePass(layoutName: string): ComputePassBuilder;
    public addComputePass (layoutName: any, name?: any): ComputePassBuilder {
        throw new Error('Method not implemented.');
    }
    public addMovePass (name: string): MovePassBuilder {
        throw new Error('Method not implemented.');
    }
    public addCopyPass (name: string): CopyPassBuilder {
        throw new Error('Method not implemented.');
    }
    public presentAll (): void {
        throw new Error('Method not implemented.');
    }
    public createSceneTransversal (camera: Camera, scene: RenderScene): SceneTransversal {
        throw new Error('Method not implemented.');
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
        this._constantMacros = str;
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

    public activate (swapchain: Swapchain): boolean {
        this._device = deviceManager.gfxDevice;
        this._globalDSManager = new GlobalDSManager(this._device);
        const globalLayoutData = this.getGlobalDescriptorSetData()!;
        this._globalDescriptorSetLayout = globalLayoutData.descriptorSetLayout;
        this._globalDescriptorSet = globalLayoutData.descriptorSet!;
        this.setMacroBool('CC_USE_HDR', this._pipelineSceneData.isHDR);
        this._generateConstantMacros(false);
        this._pipelineSceneData.activate(this._device);
        this._pipelineUBO.activate(this._device, this);
        const isFloat = supportsR32FloatTexture(this._device) ? 0 : 1;
        this.setMacroInt('CC_SHADOWMAP_FORMAT', isFloat);
        // 0: SHADOWMAP_LINER_DEPTH_OFF, 1: SHADOWMAP_LINER_DEPTH_ON.
        const isLinear = this._device.gfxAPI === API.WEBGL ? 1 : 0;
        this.setMacroInt('CC_SHADOWMAP_USE_LINEAR_DEPTH', isLinear);

        // 0: UNIFORM_VECTORS_LESS_EQUAL_64, 1: UNIFORM_VECTORS_GREATER_EQUAL_125.
        this.pipelineSceneData.csmSupported = this.device.capabilities.maxFragmentUniformVectors
            >= (WebPipeline.CSM_UNIFORM_VECTORS + WebPipeline.GLOBAL_UNIFORM_VECTORS);
        this.setMacroBool('CC_SUPPORT_CASCADED_SHADOW_MAP', this.pipelineSceneData.csmSupported);

        // enable the deferred pipeline
        if (this.usesDeferredPipeline) {
            this.setMacroInt('CC_PIPELINE_TYPE', 1);
        }
        this.layoutGraphBuilder.compile();

        this._forward = new ForwardPipelineBuilder();
        this._deferred = new DeferredPipelineBuilder();
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
    public get layoutGraphBuilder (): LayoutGraphBuilder {
        return new WebLayoutGraphBuilder(this._device, this._layoutGraph);
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
    addRenderTexture (name: string, format: Format, width: number, height: number, renderWindow: RenderWindow) {
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
            );
        } else {
            return this._resourceGraph.addVertex<ResourceGraphValue.Swapchain>(
                ResourceGraphValue.Swapchain,
                new RenderSwapchain(renderWindow.swapchain),
                name, desc,
                new ResourceTraits(ResourceResidency.BACKBUFFER),
                new ResourceStates(),
            );
        }
    }
    addRenderTarget (name: string, format: Format, width: number, height: number, residency: ResourceResidency) {
        const desc = new ResourceDesc();
        desc.dimension = ResourceDimension.TEXTURE2D;
        desc.width = width;
        desc.height = height;
        desc.depthOrArraySize = 1;
        desc.mipLevels = 1;
        desc.format = format;
        desc.flags = ResourceFlags.COLOR_ATTACHMENT | ResourceFlags.SAMPLED;

        assert(isManaged(residency));
        return this._resourceGraph.addVertex<ResourceGraphValue.Managed>(
            ResourceGraphValue.Managed,
            new ManagedResource(),
            name, desc,
            new ResourceTraits(residency),
            new ResourceStates(),
        );
    }
    addDepthStencil (name: string, format: Format, width: number, height: number, residency: ResourceResidency) {
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
        );
    }
    beginFrame () {
        this._renderGraph = new RenderGraph();
    }
    endFrame () {
        this._renderGraph = null;
    }

    compile () {
        if (!this._renderGraph) {
            throw new Error('RenderGraph cannot be built without being created');
        }
        if (!this._compiler) {
            this._compiler = new Compiler(this, this._resourceGraph, this._layoutGraph);
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
        if (this.builder) {
            this.builder.setup(cameras, this);
        } else if (this.usesDeferredPipeline) {
            this._deferred.setup(cameras, this);
        } else {
            this._forward.setup(cameras, this);
        }
        this.compile();
        this.execute();
        this.endFrame();
    }

    addRasterPass (width: number, height: number, layoutName: string, name = 'Raster'): RasterPassBuilder {
        const pass = new RasterPass();
        pass.viewport.width = width;
        pass.viewport.height = height;

        const data = new RenderData();
        const vertID = this._renderGraph!.addVertex<RenderGraphValue.Raster>(
            RenderGraphValue.Raster, pass, name, layoutName, data, false,
        );
        const result = new WebRasterPassBuilder(data, this._renderGraph!, this._layoutGraph, vertID, pass, this._pipelineSceneData);
        this._updateRasterPassConstants(result, width, height);
        return result;
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
    protected _updateRasterPassConstants (setter: WebSetter, width: number, height: number) {
        const director = legacyCC.director;
        const root = director.root;
        const shadingWidth = width;
        const shadingHeight = height;
        const pipeline = root.pipeline as WebPipeline;
        const layoutGraph = pipeline.layoutGraph;
        // Global
        setter.addConstant('CCGlobal');
        setter.setVec4('cc_time', new Vec4(root.cumulativeTime, root.frameTime, director.getTotalFrames()));
        setter.setVec4('cc_screenSize', new Vec4(shadingWidth, shadingHeight, 1.0 / shadingWidth, 1.0 / shadingHeight));
        setter.setVec4('cc_nativeSize', new Vec4(shadingWidth, shadingHeight, 1.0 / shadingWidth, 1.0 / shadingHeight));
        const debugView = root.debugView;
        if (debugView) {
            setter.setVec4('cc_debug_view_mode', new Vec4(debugView.singleMode as number,
                debugView.lightingWithAlbedo ? 1.0 : 0.0, debugView.csmLayerColoration ? 1.0 : 0.0));
            const debugPackVec: number[] = [];
            for (let i = DebugViewCompositeType.DIRECT_DIFFUSE as number; i < DebugViewCompositeType.MAX_BIT_COUNT; i++) {
                const idx = i % 4;
                debugPackVec[idx] = debugView.isCompositeModeEnabled(i) ? 1.0 : 0.0;
                const packIdx = Math.floor(i / 4.0);
                if (idx === 3) {
                    const outVec = new Vec4();
                    Vec4.fromArray(outVec, debugPackVec);
                    setter.setVec4(`cc_debug_view_composite_pack_${packIdx + 1}`, outVec);
                }
            }
        } else {
            setter.setVec4('cc_debug_view_mode', new Vec4(0.0, 1.0, 0.0));
            const debugPackVec: number[] = [];
            for (let i = DebugViewCompositeType.DIRECT_DIFFUSE as number; i < DebugViewCompositeType.MAX_BIT_COUNT; i++) {
                const idx = i % 4;
                debugPackVec[idx] = 1.0;
                const packIdx = Math.floor(i / 4.0);
                if (idx === 3) {
                    const outVec = new Vec4();
                    Vec4.fromArray(outVec, debugPackVec);
                    setter.setVec4(`cc_debug_view_composite_pack_${packIdx + 1}`, outVec);
                }
            }
        }
    }

    public static MAX_BLOOM_FILTER_PASS_NUM = 6;
    private _usesDeferredPipeline = false;
    private _device!: Device;
    private _globalDSManager!: GlobalDSManager;
    private _globalDescriptorSet: DescriptorSet | null = null;
    private _globalDescriptorSetLayout: DescriptorSetLayout | null = null;
    private readonly _macros: MacroRecord = {};
    private readonly _pipelineSceneData: PipelineSceneData = new PipelineSceneData();
    private _constantMacros = '';
    private _lightingMode = LightingMode.DEFAULT;
    private _profiler: Model | null = null;
    private _pipelineUBO: PipelineUBO = new PipelineUBO();
    private _cameras: Camera[] = [];

    private _layoutGraph: LayoutGraphData = new LayoutGraphData();
    private readonly _resourceGraph: ResourceGraph = new ResourceGraph();
    private _renderGraph: RenderGraph | null = null;
    private _compiler: Compiler | null = null;
    private _executor: Executor | null = null;
    private _customPipelineName = '';
    private _forward!: ForwardPipelineBuilder;
    private _deferred!: DeferredPipelineBuilder;
    public builder: PipelineBuilder | null = null;
    // csm uniform used vectors count
    public static CSM_UNIFORM_VECTORS = 61;
    // all global uniform used vectors count
    public static GLOBAL_UNIFORM_VECTORS = 64;
}
