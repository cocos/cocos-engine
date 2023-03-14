/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

import { Pass } from '../render-scene/core/pass';
import { Model } from '../render-scene/scene/model';
import { SubModel } from '../render-scene/scene/submodel';
import { Layers } from '../scene-graph/layers';
import { cclegacy } from '../core';
import { BindingMappingInfo, DescriptorType, Type, ShaderStageFlagBit, UniformStorageBuffer, DescriptorSetLayoutBinding,
    Uniform, UniformBlock, UniformSamplerTexture, UniformStorageImage, Device, FormatFeatureBit, Format, API,
} from '../gfx';

export const PIPELINE_FLOW_MAIN = 'MainFlow';
export const PIPELINE_FLOW_FORWARD = 'ForwardFlow';
export const PIPELINE_FLOW_SHADOW = 'ShadowFlow';
export const PIPELINE_FLOW_SMAA = 'SMAAFlow';
export const PIPELINE_FLOW_TONEMAP = 'ToneMapFlow';

/**
 * @en The predefined render pass stage ids
 * @zh 预设的渲染阶段。
 */
export enum RenderPassStage {
    DEFAULT = 100,
    UI = 200,
}
cclegacy.RenderPassStage = RenderPassStage;

/**
 * @en The predefined render priorities
 * @zh 预设的渲染优先级。
 */
export enum RenderPriority {
    MIN = 0,
    MAX = 0xff,
    DEFAULT = 0x80,
}

/**
 * @en Render object interface
 * @zh 渲染对象接口。
 */
export interface IRenderObject {
    model: Model;
    depth: number;
}

/*
 * @en The render pass interface
 * @zh 渲染过程接口。
 */
export interface IRenderPass {
    priority: number;
    hash: number;
    depth: number;
    shaderId: number;
    subModel: SubModel;
    passIdx: number;
}

/**
 * @en Render batch interface
 * @zh 渲染批次接口。
 */
export interface IRenderBatch {
    pass: Pass;
}

/**
 * @en Render queue descriptor
 * @zh 渲染队列描述。
 */
export interface IRenderQueueDesc {
    isTransparent: boolean;
    phases: number;
    sortFunc: (a: IRenderPass, b: IRenderPass) => number;
}

export interface IDescriptorSetLayoutInfo {
    bindings: DescriptorSetLayoutBinding[];
    layouts: Record<string, UniformBlock | UniformSamplerTexture | UniformStorageImage | UniformStorageBuffer>;
}

export const globalDescriptorSetLayout: IDescriptorSetLayoutInfo = { bindings: [], layouts: {} };
export const localDescriptorSetLayout: IDescriptorSetLayoutInfo = { bindings: [], layouts: {} };

/**
 * @en The uniform bindings
 * @zh Uniform 参数绑定。
 */
export enum PipelineGlobalBindings {
    UBO_GLOBAL,
    UBO_CAMERA,
    UBO_SHADOW,
    UBO_CSM, // should reserve slot for this optional ubo

    SAMPLER_SHADOWMAP,
    SAMPLER_ENVIRONMENT, // don't put this as the first sampler binding due to Mac GL driver issues: cubemap at texture unit 0 causes rendering issues
    SAMPLER_SPOT_SHADOW_MAP,
    SAMPLER_DIFFUSEMAP,

    COUNT,
}
const GLOBAL_UBO_COUNT = PipelineGlobalBindings.SAMPLER_SHADOWMAP;
const GLOBAL_SAMPLER_COUNT = PipelineGlobalBindings.COUNT - GLOBAL_UBO_COUNT;

export enum ModelLocalBindings {
    UBO_LOCAL,
    UBO_FORWARD_LIGHTS,
    UBO_SKINNING_ANIMATION,
    UBO_SKINNING_TEXTURE,
    UBO_MORPH,
    UBO_UI_LOCAL,
    UBO_SH,

    SAMPLER_JOINTS,
    SAMPLER_MORPH_POSITION,
    SAMPLER_MORPH_NORMAL,
    SAMPLER_MORPH_TANGENT,
    SAMPLER_LIGHTMAP,
    SAMPLER_SPRITE,
    SAMPLER_REFLECTION,

    STORAGE_REFLECTION,

    SAMPLER_REFLECTION_PROBE_CUBE,
    SAMPLER_REFLECTION_PROBE_PLANAR,
    SAMPLER_REFLECTION_PROBE_DATA_MAP,

    COUNT,
}
const LOCAL_UBO_COUNT = ModelLocalBindings.SAMPLER_JOINTS;
const LOCAL_SAMPLER_COUNT = ModelLocalBindings.STORAGE_REFLECTION - LOCAL_UBO_COUNT;
const LOCAL_STORAGE_IMAGE_COUNT = ModelLocalBindings.COUNT - LOCAL_UBO_COUNT - LOCAL_SAMPLER_COUNT;

export enum SetIndex {
    GLOBAL,
    MATERIAL,
    LOCAL,
    COUNT
}
// parameters passed to GFX Device
export const bindingMappingInfo = new BindingMappingInfo(
    [GLOBAL_UBO_COUNT, 0, LOCAL_UBO_COUNT, 0],         // Uniform Buffer Counts
    [GLOBAL_SAMPLER_COUNT, 0, LOCAL_SAMPLER_COUNT, 0], // Combined Sampler Texture Counts
    [0, 0, 0, 0],                                      // Sampler Counts
    [0, 0, 0, 0],                                      // Texture Counts
    [0, 0, 0, 0],                                      // Storage Buffer Counts
    [0, 0, LOCAL_STORAGE_IMAGE_COUNT, 0],              // Storage Image Counts
    [0, 0, 0, 0],                                      // Subpass Input Counts
    [0, 2, 1, 3],                                      // Set Order Indices
);

/**
 * @en The global uniform buffer object
 * @zh 全局 UBO。
 */
export class UBOGlobal {
    public static readonly TIME_OFFSET = 0;
    public static readonly SCREEN_SIZE_OFFSET = UBOGlobal.TIME_OFFSET + 4;
    public static readonly NATIVE_SIZE_OFFSET = UBOGlobal.SCREEN_SIZE_OFFSET + 4;
    public static readonly PROBE_INFO_OFFSET = UBOGlobal.NATIVE_SIZE_OFFSET + 4;

    public static readonly DEBUG_VIEW_MODE_OFFSET = UBOGlobal.PROBE_INFO_OFFSET + 4;

    public static readonly COUNT = UBOGlobal.DEBUG_VIEW_MODE_OFFSET + 4;
    public static readonly SIZE = UBOGlobal.COUNT * 4;

    public static readonly NAME = 'CCGlobal';
    public static readonly BINDING = PipelineGlobalBindings.UBO_GLOBAL;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOGlobal.BINDING, DescriptorType.UNIFORM_BUFFER, 1, ShaderStageFlagBit.ALL);
    public static readonly LAYOUT = new UniformBlock(SetIndex.GLOBAL, UBOGlobal.BINDING, UBOGlobal.NAME, [
        new Uniform('cc_time', Type.FLOAT4, 1),
        new Uniform('cc_screenSize', Type.FLOAT4, 1),
        new Uniform('cc_nativeSize', Type.FLOAT4, 1),
        new Uniform('cc_probeInfo', Type.FLOAT4, 1),

        new Uniform('cc_debug_view_mode', Type.FLOAT4, 1),
    ], 1);
}
globalDescriptorSetLayout.layouts[UBOGlobal.NAME] = UBOGlobal.LAYOUT;
globalDescriptorSetLayout.bindings[UBOGlobal.BINDING] = UBOGlobal.DESCRIPTOR;

/**
 * @en The global camera uniform buffer object
 * @zh 全局相机 UBO。
 */
export class UBOCamera {
    public static readonly MAT_VIEW_OFFSET = 0;
    public static readonly MAT_VIEW_INV_OFFSET = UBOCamera.MAT_VIEW_OFFSET + 16;
    public static readonly MAT_PROJ_OFFSET = UBOCamera.MAT_VIEW_INV_OFFSET + 16;
    public static readonly MAT_PROJ_INV_OFFSET = UBOCamera.MAT_PROJ_OFFSET + 16;
    public static readonly MAT_VIEW_PROJ_OFFSET = UBOCamera.MAT_PROJ_INV_OFFSET + 16;
    public static readonly MAT_VIEW_PROJ_INV_OFFSET = UBOCamera.MAT_VIEW_PROJ_OFFSET + 16;
    public static readonly CAMERA_POS_OFFSET = UBOCamera.MAT_VIEW_PROJ_INV_OFFSET + 16;
    public static readonly SURFACE_TRANSFORM_OFFSET = UBOCamera.CAMERA_POS_OFFSET + 4;
    public static readonly SCREEN_SCALE_OFFSET = UBOCamera.SURFACE_TRANSFORM_OFFSET + 4;
    public static readonly EXPOSURE_OFFSET = UBOCamera.SCREEN_SCALE_OFFSET + 4;
    public static readonly MAIN_LIT_DIR_OFFSET = UBOCamera.EXPOSURE_OFFSET + 4;
    public static readonly MAIN_LIT_COLOR_OFFSET = UBOCamera.MAIN_LIT_DIR_OFFSET + 4;
    public static readonly AMBIENT_SKY_OFFSET = UBOCamera.MAIN_LIT_COLOR_OFFSET + 4;
    public static readonly AMBIENT_GROUND_OFFSET = UBOCamera.AMBIENT_SKY_OFFSET + 4;
    public static readonly GLOBAL_FOG_COLOR_OFFSET = UBOCamera.AMBIENT_GROUND_OFFSET + 4;
    public static readonly GLOBAL_FOG_BASE_OFFSET = UBOCamera.GLOBAL_FOG_COLOR_OFFSET + 4;
    public static readonly GLOBAL_FOG_ADD_OFFSET = UBOCamera.GLOBAL_FOG_BASE_OFFSET + 4;
    public static readonly NEAR_FAR_OFFSET = UBOCamera.GLOBAL_FOG_ADD_OFFSET + 4;
    public static readonly VIEW_PORT_OFFSET = UBOCamera.NEAR_FAR_OFFSET + 4;
    public static readonly COUNT = UBOCamera.VIEW_PORT_OFFSET + 4;
    public static readonly SIZE = UBOCamera.COUNT * 4;

    public static readonly NAME = 'CCCamera';
    public static readonly BINDING = PipelineGlobalBindings.UBO_CAMERA;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOCamera.BINDING, DescriptorType.UNIFORM_BUFFER, 1, ShaderStageFlagBit.ALL);
    public static readonly LAYOUT = new UniformBlock(SetIndex.GLOBAL, UBOCamera.BINDING, UBOCamera.NAME, [
        new Uniform('cc_matView', Type.MAT4, 1),
        new Uniform('cc_matViewInv', Type.MAT4, 1),
        new Uniform('cc_matProj', Type.MAT4, 1),
        new Uniform('cc_matProjInv', Type.MAT4, 1),
        new Uniform('cc_matViewProj', Type.MAT4, 1),
        new Uniform('cc_matViewProjInv', Type.MAT4, 1),
        new Uniform('cc_cameraPos', Type.FLOAT4, 1),
        new Uniform('cc_surfaceTransform', Type.FLOAT4, 1),
        new Uniform('cc_screenScale', Type.FLOAT4, 1),
        new Uniform('cc_exposure', Type.FLOAT4, 1),
        new Uniform('cc_mainLitDir', Type.FLOAT4, 1),
        new Uniform('cc_mainLitColor', Type.FLOAT4, 1),
        new Uniform('cc_ambientSky', Type.FLOAT4, 1),
        new Uniform('cc_ambientGround', Type.FLOAT4, 1),
        new Uniform('cc_fogColor', Type.FLOAT4, 1),
        new Uniform('cc_fogBase', Type.FLOAT4, 1),
        new Uniform('cc_fogAdd', Type.FLOAT4, 1),
        new Uniform('cc_nearFar', Type.FLOAT4, 1),
        new Uniform('cc_viewPort', Type.FLOAT4, 1),
    ], 1);
}
globalDescriptorSetLayout.layouts[UBOCamera.NAME] = UBOCamera.LAYOUT;
globalDescriptorSetLayout.bindings[UBOCamera.BINDING] = UBOCamera.DESCRIPTOR;

/**
 * @en The uniform buffer object for 'cast shadow(fixed || csm)' && 'dir fixed area shadow' && 'spot shadow' && 'sphere shadow' && 'planar shadow'
 * @zh 这个 UBO 仅仅只给 'cast shadow(fixed || csm)' && 'dir fixed area shadow' && 'spot shadow' && 'sphere shadow' && 'planar shadow' 使用
 */
export class UBOShadow {
    public static readonly MAT_LIGHT_VIEW_OFFSET = 0;
    public static readonly MAT_LIGHT_VIEW_PROJ_OFFSET = UBOShadow.MAT_LIGHT_VIEW_OFFSET + 16;
    public static readonly SHADOW_INV_PROJ_DEPTH_INFO_OFFSET = UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET + 16;
    public static readonly SHADOW_PROJ_DEPTH_INFO_OFFSET = UBOShadow.SHADOW_INV_PROJ_DEPTH_INFO_OFFSET + 4;
    public static readonly SHADOW_PROJ_INFO_OFFSET = UBOShadow.SHADOW_PROJ_DEPTH_INFO_OFFSET + 4;
    public static readonly SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET = UBOShadow.SHADOW_PROJ_INFO_OFFSET + 4;
    public static readonly SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET = UBOShadow.SHADOW_NEAR_FAR_LINEAR_SATURATION_INFO_OFFSET + 4;
    public static readonly SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET = UBOShadow.SHADOW_WIDTH_HEIGHT_PCF_BIAS_INFO_OFFSET + 4;
    public static readonly SHADOW_COLOR_OFFSET = UBOShadow.SHADOW_LIGHT_PACKING_NBIAS_NULL_INFO_OFFSET + 4;
    public static readonly PLANAR_NORMAL_DISTANCE_INFO_OFFSET = UBOShadow.SHADOW_COLOR_OFFSET + 4;
    public static readonly COUNT: number = UBOShadow.PLANAR_NORMAL_DISTANCE_INFO_OFFSET + 4;
    public static readonly SIZE = UBOShadow.COUNT * 4;
    public static readonly NAME = 'CCShadow';
    public static readonly BINDING = PipelineGlobalBindings.UBO_SHADOW;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOShadow.BINDING, DescriptorType.UNIFORM_BUFFER, 1, ShaderStageFlagBit.ALL);
    public static readonly LAYOUT = new UniformBlock(SetIndex.GLOBAL, UBOShadow.BINDING, UBOShadow.NAME, [
        new Uniform('cc_matLightView', Type.MAT4, 1),
        new Uniform('cc_matLightViewProj', Type.MAT4, 1),
        new Uniform('cc_shadowInvProjDepthInfo', Type.FLOAT4, 1),
        new Uniform('cc_shadowProjDepthInfo', Type.FLOAT4, 1),
        new Uniform('cc_shadowProjInfo', Type.FLOAT4, 1),
        new Uniform('cc_shadowNFLSInfo', Type.FLOAT4, 1),
        new Uniform('cc_shadowWHPBInfo', Type.FLOAT4, 1),
        new Uniform('cc_shadowLPNNInfo', Type.FLOAT4, 1),
        new Uniform('cc_shadowColor', Type.FLOAT4, 1),
        new Uniform('cc_planarNDInfo', Type.FLOAT4, 1),
    ], 1);
}
globalDescriptorSetLayout.layouts[UBOShadow.NAME] = UBOShadow.LAYOUT;
globalDescriptorSetLayout.bindings[UBOShadow.BINDING] = UBOShadow.DESCRIPTOR;

/**
 * @en The uniform buffer object only for dir csm shadow(level: 1 ~ 4)
 * @zh 级联阴影使用的UBO
 */
export class UBOCSM {
    public static readonly CSM_LEVEL_COUNT = 4;
    public static readonly CSM_VIEW_DIR_0_OFFSET = 0;
    public static readonly CSM_VIEW_DIR_1_OFFSET = UBOCSM.CSM_VIEW_DIR_0_OFFSET + 4 * UBOCSM.CSM_LEVEL_COUNT;
    public static readonly CSM_VIEW_DIR_2_OFFSET = UBOCSM.CSM_VIEW_DIR_1_OFFSET + 4 * UBOCSM.CSM_LEVEL_COUNT;
    public static readonly CSM_ATLAS_OFFSET = UBOCSM.CSM_VIEW_DIR_2_OFFSET + 4 * UBOCSM.CSM_LEVEL_COUNT;
    public static readonly MAT_CSM_VIEW_PROJ_OFFSET = UBOCSM.CSM_ATLAS_OFFSET + 4 * UBOCSM.CSM_LEVEL_COUNT;
    public static readonly CSM_PROJ_DEPTH_INFO_OFFSET = UBOCSM.MAT_CSM_VIEW_PROJ_OFFSET + 16 * UBOCSM.CSM_LEVEL_COUNT;
    public static readonly CSM_PROJ_INFO_OFFSET = UBOCSM.CSM_PROJ_DEPTH_INFO_OFFSET + 4 * UBOCSM.CSM_LEVEL_COUNT;
    public static readonly CSM_SPLITS_INFO_OFFSET = UBOCSM.CSM_PROJ_INFO_OFFSET + 4 * UBOCSM.CSM_LEVEL_COUNT;
    public static readonly COUNT: number = UBOCSM.CSM_SPLITS_INFO_OFFSET + 4;
    public static readonly SIZE = UBOCSM.COUNT * 4;

    public static readonly NAME = 'CCCSM';
    public static readonly BINDING = PipelineGlobalBindings.UBO_CSM;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOCSM.BINDING, DescriptorType.UNIFORM_BUFFER, 1, ShaderStageFlagBit.FRAGMENT);
    public static readonly LAYOUT = new UniformBlock(SetIndex.GLOBAL, UBOCSM.BINDING, UBOCSM.NAME, [
        new Uniform('cc_csmViewDir0', Type.FLOAT4, UBOCSM.CSM_LEVEL_COUNT),
        new Uniform('cc_csmViewDir1', Type.FLOAT4, UBOCSM.CSM_LEVEL_COUNT),
        new Uniform('cc_csmViewDir2', Type.FLOAT4, UBOCSM.CSM_LEVEL_COUNT),
        new Uniform('cc_csmAtlas', Type.FLOAT4, UBOCSM.CSM_LEVEL_COUNT),
        new Uniform('cc_matCSMViewProj', Type.MAT4, UBOCSM.CSM_LEVEL_COUNT),
        new Uniform('cc_csmProjDepthInfo', Type.FLOAT4, UBOCSM.CSM_LEVEL_COUNT),
        new Uniform('cc_csmProjInfo', Type.FLOAT4, UBOCSM.CSM_LEVEL_COUNT),
        new Uniform('cc_csmSplitsInfo', Type.FLOAT4, 1),
    ], 1);
}
globalDescriptorSetLayout.layouts[UBOCSM.NAME] = UBOCSM.LAYOUT;
globalDescriptorSetLayout.bindings[UBOCSM.BINDING] = UBOCSM.DESCRIPTOR;

/* eslint-disable max-len */

/**
 * @en The sampler for Main light shadow map
 * @zh 主光源阴影纹理采样器
 */
const UNIFORM_SHADOWMAP_NAME = 'cc_shadowMap';
export const UNIFORM_SHADOWMAP_BINDING = PipelineGlobalBindings.SAMPLER_SHADOWMAP;
const UNIFORM_SHADOWMAP_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_SHADOWMAP_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.FRAGMENT);
const UNIFORM_SHADOWMAP_LAYOUT = new UniformSamplerTexture(SetIndex.GLOBAL, UNIFORM_SHADOWMAP_BINDING, UNIFORM_SHADOWMAP_NAME, Type.SAMPLER2D, 1);
globalDescriptorSetLayout.layouts[UNIFORM_SHADOWMAP_NAME] = UNIFORM_SHADOWMAP_LAYOUT;
globalDescriptorSetLayout.bindings[UNIFORM_SHADOWMAP_BINDING] = UNIFORM_SHADOWMAP_DESCRIPTOR;

const UNIFORM_ENVIRONMENT_NAME = 'cc_environment';
export const UNIFORM_ENVIRONMENT_BINDING = PipelineGlobalBindings.SAMPLER_ENVIRONMENT;
const UNIFORM_ENVIRONMENT_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_ENVIRONMENT_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.FRAGMENT);
const UNIFORM_ENVIRONMENT_LAYOUT = new UniformSamplerTexture(SetIndex.GLOBAL, UNIFORM_ENVIRONMENT_BINDING, UNIFORM_ENVIRONMENT_NAME, Type.SAMPLER_CUBE, 1);
globalDescriptorSetLayout.layouts[UNIFORM_ENVIRONMENT_NAME] = UNIFORM_ENVIRONMENT_LAYOUT;
globalDescriptorSetLayout.bindings[UNIFORM_ENVIRONMENT_BINDING] = UNIFORM_ENVIRONMENT_DESCRIPTOR;

const UNIFORM_DIFFUSEMAP_NAME = 'cc_diffuseMap';
export const UNIFORM_DIFFUSEMAP_BINDING = PipelineGlobalBindings.SAMPLER_DIFFUSEMAP;
const UNIFORM_DIFFUSEMAP_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_DIFFUSEMAP_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.FRAGMENT);
const UNIFORM_DIFFUSEMAP_LAYOUT = new UniformSamplerTexture(SetIndex.GLOBAL, UNIFORM_DIFFUSEMAP_BINDING, UNIFORM_DIFFUSEMAP_NAME, Type.SAMPLER_CUBE, 1);
globalDescriptorSetLayout.layouts[UNIFORM_DIFFUSEMAP_NAME] = UNIFORM_DIFFUSEMAP_LAYOUT;
globalDescriptorSetLayout.bindings[UNIFORM_DIFFUSEMAP_BINDING] = UNIFORM_DIFFUSEMAP_DESCRIPTOR;

/**
 * @en The sampler for spot light shadow map
 * @zh 聚光灯阴影纹理采样器
 */
const UNIFORM_SPOT_SHADOW_MAP_TEXTURE_NAME = 'cc_spotShadowMap';
export const UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING = PipelineGlobalBindings.SAMPLER_SPOT_SHADOW_MAP;
const UNIFORM_SPOT_SHADOW_MAP_TEXTURE_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.FRAGMENT);
const UNIFORM_SPOT_SHADOW_MAP_TEXTURE_LAYOUT = new UniformSamplerTexture(SetIndex.GLOBAL, UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING, UNIFORM_SPOT_SHADOW_MAP_TEXTURE_NAME, Type.SAMPLER2D, 1);
globalDescriptorSetLayout.layouts[UNIFORM_SPOT_SHADOW_MAP_TEXTURE_NAME] = UNIFORM_SPOT_SHADOW_MAP_TEXTURE_LAYOUT;
globalDescriptorSetLayout.bindings[UNIFORM_SPOT_SHADOW_MAP_TEXTURE_BINDING] = UNIFORM_SPOT_SHADOW_MAP_TEXTURE_DESCRIPTOR;

/**
 * @en The local uniform buffer object
 * @zh 本地 UBO。
 */
export class UBOLocal {
    public static readonly MAT_WORLD_OFFSET = 0;
    public static readonly MAT_WORLD_IT_OFFSET = UBOLocal.MAT_WORLD_OFFSET + 16;
    public static readonly LIGHTINGMAP_UVPARAM = UBOLocal.MAT_WORLD_IT_OFFSET + 16;
    public static readonly LOCAL_SHADOW_BIAS = UBOLocal.LIGHTINGMAP_UVPARAM + 4;
    public static readonly REFLECTION_PROBE_DATA1 = UBOLocal.LOCAL_SHADOW_BIAS + 4;
    public static readonly REFLECTION_PROBE_DATA2 = UBOLocal.REFLECTION_PROBE_DATA1 + 4;
    public static readonly COUNT = UBOLocal.REFLECTION_PROBE_DATA2 + 4;
    public static readonly SIZE = UBOLocal.COUNT * 4;

    public static readonly NAME = 'CCLocal';
    public static readonly BINDING = ModelLocalBindings.UBO_LOCAL;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOLocal.BINDING, DescriptorType.UNIFORM_BUFFER, 1, ShaderStageFlagBit.VERTEX | ShaderStageFlagBit.COMPUTE);
    public static readonly LAYOUT = new UniformBlock(SetIndex.LOCAL, UBOLocal.BINDING, UBOLocal.NAME, [
        new Uniform('cc_matWorld', Type.MAT4, 1),
        new Uniform('cc_matWorldIT', Type.MAT4, 1),
        new Uniform('cc_lightingMapUVParam', Type.FLOAT4, 1),
        new Uniform('cc_localShadowBias', Type.FLOAT4, 1),
        new Uniform('cc_reflectionProbeData1', Type.FLOAT4, 1),
        new Uniform('cc_reflectionProbeData2', Type.FLOAT4, 1),
    ], 1);
}
localDescriptorSetLayout.layouts[UBOLocal.NAME] = UBOLocal.LAYOUT;
localDescriptorSetLayout.bindings[UBOLocal.BINDING] = UBOLocal.DESCRIPTOR;

/**
 * @en The world bound uniform buffer object
 * @zh 世界空间包围盒 UBO。
 */
export class UBOWorldBound {
    public static readonly WORLD_BOUND_CENTER = 0;
    public static readonly WORLD_BOUND_HALF_EXTENTS = UBOWorldBound.WORLD_BOUND_CENTER + 4;
    public static readonly COUNT = UBOWorldBound.WORLD_BOUND_HALF_EXTENTS + 4;
    public static readonly SIZE = UBOWorldBound.COUNT * 4;

    public static readonly NAME = 'CCWorldBound';
    public static readonly BINDING = ModelLocalBindings.UBO_LOCAL;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOWorldBound.BINDING, DescriptorType.UNIFORM_BUFFER, 1, ShaderStageFlagBit.VERTEX | ShaderStageFlagBit.COMPUTE);
    public static readonly LAYOUT = new UniformBlock(SetIndex.LOCAL, UBOWorldBound.BINDING, UBOWorldBound.NAME, [
        new Uniform('cc_worldBoundCenter', Type.FLOAT4, 1),
        new Uniform('cc_worldBoundHalfExtents', Type.FLOAT4, 1),
    ], 1);
}
localDescriptorSetLayout.layouts[UBOWorldBound.NAME] = UBOWorldBound.LAYOUT;
localDescriptorSetLayout.bindings[UBOWorldBound.BINDING] = UBOWorldBound.DESCRIPTOR;

export const INST_MAT_WORLD = 'a_matWorld0';
export const INST_SH = 'a_sh_linear_const_r';

export class UBOLocalBatched {
    public static readonly BATCHING_COUNT = 10;
    public static readonly MAT_WORLDS_OFFSET = 0;
    public static readonly COUNT = 16 * UBOLocalBatched.BATCHING_COUNT;
    public static readonly SIZE = UBOLocalBatched.COUNT * 4;

    public static readonly NAME = 'CCLocalBatched';
    public static readonly BINDING = ModelLocalBindings.UBO_LOCAL;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOLocalBatched.BINDING, DescriptorType.UNIFORM_BUFFER, 1, ShaderStageFlagBit.VERTEX | ShaderStageFlagBit.COMPUTE);
    public static readonly LAYOUT = new UniformBlock(SetIndex.LOCAL, UBOLocalBatched.BINDING, UBOLocalBatched.NAME, [
        new Uniform('cc_matWorlds', Type.MAT4, UBOLocalBatched.BATCHING_COUNT),
    ], 1);
}
localDescriptorSetLayout.layouts[UBOLocalBatched.NAME] = UBOLocalBatched.LAYOUT;
localDescriptorSetLayout.bindings[UBOLocalBatched.BINDING] = UBOLocalBatched.DESCRIPTOR;

/**
 * @en The uniform buffer object for forward lighting
 * @zh 前向灯光 UBO。
 */
export class UBOForwardLight {
    public static readonly LIGHTS_PER_PASS = 1;

    public static readonly LIGHT_POS_OFFSET = 0;
    public static readonly LIGHT_COLOR_OFFSET = UBOForwardLight.LIGHT_POS_OFFSET + UBOForwardLight.LIGHTS_PER_PASS * 4;
    public static readonly LIGHT_SIZE_RANGE_ANGLE_OFFSET = UBOForwardLight.LIGHT_COLOR_OFFSET + UBOForwardLight.LIGHTS_PER_PASS * 4;
    public static readonly LIGHT_DIR_OFFSET = UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET + UBOForwardLight.LIGHTS_PER_PASS * 4;
    public static readonly COUNT = UBOForwardLight.LIGHT_DIR_OFFSET + UBOForwardLight.LIGHTS_PER_PASS * 4;
    public static readonly SIZE = UBOForwardLight.COUNT * 4;

    public static readonly NAME = 'CCForwardLight';
    public static readonly BINDING = ModelLocalBindings.UBO_FORWARD_LIGHTS;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOForwardLight.BINDING, DescriptorType.DYNAMIC_UNIFORM_BUFFER, 1, ShaderStageFlagBit.FRAGMENT);
    public static readonly LAYOUT = new UniformBlock(SetIndex.LOCAL, UBOForwardLight.BINDING, UBOForwardLight.NAME, [
        new Uniform('cc_lightPos', Type.FLOAT4, UBOForwardLight.LIGHTS_PER_PASS),
        new Uniform('cc_lightColor', Type.FLOAT4, UBOForwardLight.LIGHTS_PER_PASS),
        new Uniform('cc_lightSizeRangeAngle', Type.FLOAT4, UBOForwardLight.LIGHTS_PER_PASS),
        new Uniform('cc_lightDir', Type.FLOAT4, UBOForwardLight.LIGHTS_PER_PASS),
    ], 1);
}
localDescriptorSetLayout.layouts[UBOForwardLight.NAME] = UBOForwardLight.LAYOUT;
localDescriptorSetLayout.bindings[UBOForwardLight.BINDING] = UBOForwardLight.DESCRIPTOR;

export class UBODeferredLight {
    public static readonly LIGHTS_PER_PASS = 10;
}

export const JOINT_UNIFORM_CAPACITY = 30;

/**
 * @en The uniform buffer object for skinning texture
 * @zh 骨骼贴图 UBO。
 */
export class UBOSkinningTexture {
    public static readonly JOINTS_TEXTURE_INFO_OFFSET = 0;
    public static readonly COUNT = UBOSkinningTexture.JOINTS_TEXTURE_INFO_OFFSET + 4;
    public static readonly SIZE = UBOSkinningTexture.COUNT * 4;

    public static readonly NAME = 'CCSkinningTexture';
    public static readonly BINDING = ModelLocalBindings.UBO_SKINNING_TEXTURE;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOSkinningTexture.BINDING, DescriptorType.UNIFORM_BUFFER, 1, ShaderStageFlagBit.VERTEX);
    public static readonly LAYOUT = new UniformBlock(SetIndex.LOCAL, UBOSkinningTexture.BINDING, UBOSkinningTexture.NAME, [
        new Uniform('cc_jointTextureInfo', Type.FLOAT4, 1),
    ], 1);
}
localDescriptorSetLayout.layouts[UBOSkinningTexture.NAME] = UBOSkinningTexture.LAYOUT;
localDescriptorSetLayout.bindings[UBOSkinningTexture.BINDING] = UBOSkinningTexture.DESCRIPTOR;

export class UBOSkinningAnimation {
    public static readonly JOINTS_ANIM_INFO_OFFSET = 0;
    public static readonly COUNT = UBOSkinningAnimation.JOINTS_ANIM_INFO_OFFSET + 4;
    public static readonly SIZE = UBOSkinningAnimation.COUNT * 4;

    public static readonly NAME = 'CCSkinningAnimation';
    public static readonly BINDING = ModelLocalBindings.UBO_SKINNING_ANIMATION;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOSkinningAnimation.BINDING, DescriptorType.UNIFORM_BUFFER, 1, ShaderStageFlagBit.VERTEX);
    public static readonly LAYOUT = new UniformBlock(SetIndex.LOCAL, UBOSkinningAnimation.BINDING, UBOSkinningAnimation.NAME, [
        new Uniform('cc_jointAnimInfo', Type.FLOAT4, 1),
    ], 1);
}
localDescriptorSetLayout.layouts[UBOSkinningAnimation.NAME] = UBOSkinningAnimation.LAYOUT;
localDescriptorSetLayout.bindings[UBOSkinningAnimation.BINDING] = UBOSkinningAnimation.DESCRIPTOR;

export const INST_JOINT_ANIM_INFO = 'a_jointAnimInfo';
export class UBOSkinning {
    private static _jointUniformCapacity = 0;
    public static get JOINT_UNIFORM_CAPACITY () { return UBOSkinning._jointUniformCapacity; }
    private static _count = 0;
    public static get COUNT () { return UBOSkinning._count; }
    private static _size = 0;
    public static get SIZE () { return UBOSkinning._size; }

    public static readonly NAME = 'CCSkinning';
    public static readonly BINDING = ModelLocalBindings.UBO_SKINNING_TEXTURE;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOSkinning.BINDING, DescriptorType.UNIFORM_BUFFER, 1, ShaderStageFlagBit.VERTEX);
    public static readonly LAYOUT = new UniformBlock(SetIndex.LOCAL, UBOSkinning.BINDING, UBOSkinning.NAME, [
        new Uniform('cc_joints', Type.FLOAT4, 1),
    ], 1);

    /**
     * @internal This method only used init UBOSkinning configure.
    */
    public static initLayout (capacity: number) {
        UBOSkinning._jointUniformCapacity = capacity;
        UBOSkinning._count = capacity * 12;
        UBOSkinning._size = UBOSkinning._count * 4;
        UBOSkinning.LAYOUT.members[0].count = capacity * 3;
    }
}

/**
 * @internal This method only used to init localDescriptorSetLayout.layouts[UBOSkinning.NAME]
*/
export function localDescriptorSetLayout_ResizeMaxJoints (maxCount: number) {
    UBOSkinning.initLayout(maxCount);
    localDescriptorSetLayout.layouts[UBOSkinning.NAME] = UBOSkinning.LAYOUT;
    localDescriptorSetLayout.bindings[UBOSkinning.BINDING] = UBOSkinning.DESCRIPTOR;
}

/**
 * @en The uniform buffer object for morph setting
 * @zh 形变配置的 UBO
 */
export class UBOMorph {
    public static readonly MAX_MORPH_TARGET_COUNT = 60;
    public static readonly OFFSET_OF_WEIGHTS = 0;
    public static readonly OFFSET_OF_DISPLACEMENT_TEXTURE_WIDTH = 4 * UBOMorph.MAX_MORPH_TARGET_COUNT;
    public static readonly OFFSET_OF_DISPLACEMENT_TEXTURE_HEIGHT = UBOMorph.OFFSET_OF_DISPLACEMENT_TEXTURE_WIDTH + 4;
    public static readonly OFFSET_OF_VERTICES_COUNT = UBOMorph.OFFSET_OF_DISPLACEMENT_TEXTURE_HEIGHT + 4;
    public static readonly COUNT_BASE_4_BYTES = 4 * Math.ceil(UBOMorph.MAX_MORPH_TARGET_COUNT / 4) + 4;
    public static readonly SIZE = UBOMorph.COUNT_BASE_4_BYTES * 4;

    public static readonly NAME = 'CCMorph';
    public static readonly BINDING = ModelLocalBindings.UBO_MORPH;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOMorph.BINDING, DescriptorType.UNIFORM_BUFFER, 1, ShaderStageFlagBit.VERTEX);
    public static readonly LAYOUT = new UniformBlock(SetIndex.LOCAL, UBOMorph.BINDING, UBOMorph.NAME, [
        new Uniform('cc_displacementWeights', Type.FLOAT4, UBOMorph.MAX_MORPH_TARGET_COUNT / 4),
        new Uniform('cc_displacementTextureInfo', Type.FLOAT4, 1),
    ], 1);
}
localDescriptorSetLayout.layouts[UBOMorph.NAME] = UBOMorph.LAYOUT;
localDescriptorSetLayout.bindings[UBOMorph.BINDING] = UBOMorph.DESCRIPTOR;

// UI local uniform UBO
export class UBOUILocal { // pre one vec4
    public static readonly NAME = 'CCUILocal';
    public static readonly BINDING = ModelLocalBindings.UBO_UI_LOCAL;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOUILocal.BINDING, DescriptorType.DYNAMIC_UNIFORM_BUFFER, 1, ShaderStageFlagBit.VERTEX);
    public static readonly LAYOUT = new UniformBlock(SetIndex.LOCAL, UBOUILocal.BINDING, UBOUILocal.NAME, [
        new Uniform('cc_local_data', Type.FLOAT4, 1),
    ], 1);
}
localDescriptorSetLayout.layouts[UBOUILocal.NAME] = UBOUILocal.LAYOUT;
localDescriptorSetLayout.bindings[UBOUILocal.BINDING] = UBOUILocal.DESCRIPTOR;

/**
 * @en The SH uniform buffer object
 * @zh 球谐 UBO。
 */
export class UBOSH {
    public static readonly SH_LINEAR_CONST_R_OFFSET = 0;
    public static readonly SH_LINEAR_CONST_G_OFFSET = UBOSH.SH_LINEAR_CONST_R_OFFSET + 4;
    public static readonly SH_LINEAR_CONST_B_OFFSET = UBOSH.SH_LINEAR_CONST_G_OFFSET + 4;
    public static readonly SH_QUADRATIC_R_OFFSET = UBOSH.SH_LINEAR_CONST_B_OFFSET + 4;
    public static readonly SH_QUADRATIC_G_OFFSET = UBOSH.SH_QUADRATIC_R_OFFSET + 4;
    public static readonly SH_QUADRATIC_B_OFFSET = UBOSH.SH_QUADRATIC_G_OFFSET + 4;
    public static readonly SH_QUADRATIC_A_OFFSET = UBOSH.SH_QUADRATIC_B_OFFSET + 4;
    public static readonly COUNT = UBOSH.SH_QUADRATIC_A_OFFSET + 4;
    public static readonly SIZE = UBOSH.COUNT * 4;

    public static readonly NAME = 'CCSH';
    public static readonly BINDING = ModelLocalBindings.UBO_SH;
    public static readonly DESCRIPTOR = new DescriptorSetLayoutBinding(UBOSH.BINDING, DescriptorType.UNIFORM_BUFFER, 1, ShaderStageFlagBit.FRAGMENT);
    public static readonly LAYOUT = new UniformBlock(SetIndex.LOCAL, UBOSH.BINDING, UBOSH.NAME, [
        new Uniform('cc_sh_linear_const_r', Type.FLOAT4, 1),
        new Uniform('cc_sh_linear_const_g', Type.FLOAT4, 1),
        new Uniform('cc_sh_linear_const_b', Type.FLOAT4, 1),
        new Uniform('cc_sh_quadratic_r', Type.FLOAT4, 1),
        new Uniform('cc_sh_quadratic_g', Type.FLOAT4, 1),
        new Uniform('cc_sh_quadratic_b', Type.FLOAT4, 1),
        new Uniform('cc_sh_quadratic_a', Type.FLOAT4, 1),
    ], 1);
}
localDescriptorSetLayout.layouts[UBOSH.NAME] = UBOSH.LAYOUT;
localDescriptorSetLayout.bindings[UBOSH.BINDING] = UBOSH.DESCRIPTOR;

/**
 * @en The sampler for joint texture
 * @zh 骨骼纹理采样器。
 */
const UNIFORM_JOINT_TEXTURE_NAME = 'cc_jointTexture';
export const UNIFORM_JOINT_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_JOINTS;
const UNIFORM_JOINT_TEXTURE_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_JOINT_TEXTURE_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.VERTEX);
const UNIFORM_JOINT_TEXTURE_LAYOUT = new UniformSamplerTexture(SetIndex.LOCAL, UNIFORM_JOINT_TEXTURE_BINDING, UNIFORM_JOINT_TEXTURE_NAME, Type.SAMPLER2D, 1);
localDescriptorSetLayout.layouts[UNIFORM_JOINT_TEXTURE_NAME] = UNIFORM_JOINT_TEXTURE_LAYOUT;
localDescriptorSetLayout.bindings[UNIFORM_JOINT_TEXTURE_BINDING] = UNIFORM_JOINT_TEXTURE_DESCRIPTOR;

/**
 * @en The sampler for real-time joint texture
 * @zh 实时骨骼纹理采样器。
 */
const UNIFORM_REALTIME_JOINT_TEXTURE_NAME = 'cc_realtimeJoint';
export const UNIFORM_REALTIME_JOINT_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_JOINTS;
const UNIFORM_REALTIME_JOINT_TEXTURE_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_REALTIME_JOINT_TEXTURE_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.VERTEX);
const UNIFORM_REALTIME_JOINT_TEXTURE_LAYOUT = new UniformSamplerTexture(SetIndex.LOCAL, UNIFORM_REALTIME_JOINT_TEXTURE_BINDING, UNIFORM_REALTIME_JOINT_TEXTURE_NAME, Type.SAMPLER2D, 1);
localDescriptorSetLayout.layouts[UNIFORM_REALTIME_JOINT_TEXTURE_NAME] = UNIFORM_REALTIME_JOINT_TEXTURE_LAYOUT;
localDescriptorSetLayout.bindings[UNIFORM_REALTIME_JOINT_TEXTURE_BINDING] = UNIFORM_REALTIME_JOINT_TEXTURE_DESCRIPTOR;

/**
 * @en The sampler for morph texture of position
 * @zh 位置形变纹理采样器。
 */
const UNIFORM_POSITION_MORPH_TEXTURE_NAME = 'cc_PositionDisplacements';
export const UNIFORM_POSITION_MORPH_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_MORPH_POSITION;
const UNIFORM_POSITION_MORPH_TEXTURE_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_POSITION_MORPH_TEXTURE_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.VERTEX);
const UNIFORM_POSITION_MORPH_TEXTURE_LAYOUT = new UniformSamplerTexture(SetIndex.LOCAL, UNIFORM_POSITION_MORPH_TEXTURE_BINDING, UNIFORM_POSITION_MORPH_TEXTURE_NAME, Type.SAMPLER2D, 1);
localDescriptorSetLayout.layouts[UNIFORM_POSITION_MORPH_TEXTURE_NAME] = UNIFORM_POSITION_MORPH_TEXTURE_LAYOUT;
localDescriptorSetLayout.bindings[UNIFORM_POSITION_MORPH_TEXTURE_BINDING] = UNIFORM_POSITION_MORPH_TEXTURE_DESCRIPTOR;

/**
 * @en The sampler for morph texture of normal
 * @zh 法线形变纹理采样器。
 */
const UNIFORM_NORMAL_MORPH_TEXTURE_NAME = 'cc_NormalDisplacements';
export const UNIFORM_NORMAL_MORPH_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_MORPH_NORMAL;
const UNIFORM_NORMAL_MORPH_TEXTURE_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_NORMAL_MORPH_TEXTURE_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.VERTEX);
const UNIFORM_NORMAL_MORPH_TEXTURE_LAYOUT = new UniformSamplerTexture(SetIndex.LOCAL, UNIFORM_NORMAL_MORPH_TEXTURE_BINDING,
    UNIFORM_NORMAL_MORPH_TEXTURE_NAME, Type.SAMPLER2D, 1);
localDescriptorSetLayout.layouts[UNIFORM_NORMAL_MORPH_TEXTURE_NAME] = UNIFORM_NORMAL_MORPH_TEXTURE_LAYOUT;
localDescriptorSetLayout.bindings[UNIFORM_NORMAL_MORPH_TEXTURE_BINDING] = UNIFORM_NORMAL_MORPH_TEXTURE_DESCRIPTOR;

/**
 * @en The sampler for morph texture of tangent
 * @zh 切线形变纹理采样器。
 */
const UNIFORM_TANGENT_MORPH_TEXTURE_NAME = 'cc_TangentDisplacements';
export const UNIFORM_TANGENT_MORPH_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_MORPH_TANGENT;
const UNIFORM_TANGENT_MORPH_TEXTURE_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_TANGENT_MORPH_TEXTURE_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.VERTEX);
const UNIFORM_TANGENT_MORPH_TEXTURE_LAYOUT = new UniformSamplerTexture(SetIndex.LOCAL, UNIFORM_TANGENT_MORPH_TEXTURE_BINDING,
    UNIFORM_TANGENT_MORPH_TEXTURE_NAME, Type.SAMPLER2D, 1);
localDescriptorSetLayout.layouts[UNIFORM_TANGENT_MORPH_TEXTURE_NAME] = UNIFORM_TANGENT_MORPH_TEXTURE_LAYOUT;
localDescriptorSetLayout.bindings[UNIFORM_TANGENT_MORPH_TEXTURE_BINDING] = UNIFORM_TANGENT_MORPH_TEXTURE_DESCRIPTOR;

/**
 * @en The sampler for light map texture
 * @zh 光照图纹理采样器。
 */
const UNIFORM_LIGHTMAP_TEXTURE_NAME = 'cc_lightingMap';
export const UNIFORM_LIGHTMAP_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_LIGHTMAP;
const UNIFORM_LIGHTMAP_TEXTURE_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_LIGHTMAP_TEXTURE_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.FRAGMENT);
const UNIFORM_LIGHTMAP_TEXTURE_LAYOUT = new UniformSamplerTexture(SetIndex.LOCAL, UNIFORM_LIGHTMAP_TEXTURE_BINDING,
    UNIFORM_LIGHTMAP_TEXTURE_NAME, Type.SAMPLER2D, 1);
localDescriptorSetLayout.layouts[UNIFORM_LIGHTMAP_TEXTURE_NAME] = UNIFORM_LIGHTMAP_TEXTURE_LAYOUT;
localDescriptorSetLayout.bindings[UNIFORM_LIGHTMAP_TEXTURE_BINDING] = UNIFORM_LIGHTMAP_TEXTURE_DESCRIPTOR;

/**
 * @en The sampler for UI sprites.
 * @zh UI 精灵纹理采样器。
 */
const UNIFORM_SPRITE_TEXTURE_NAME = 'cc_spriteTexture';
export const UNIFORM_SPRITE_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_SPRITE;
const UNIFORM_SPRITE_TEXTURE_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_SPRITE_TEXTURE_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.FRAGMENT);
const UNIFORM_SPRITE_TEXTURE_LAYOUT = new UniformSamplerTexture(SetIndex.LOCAL, UNIFORM_SPRITE_TEXTURE_BINDING, UNIFORM_SPRITE_TEXTURE_NAME, Type.SAMPLER2D, 1);
localDescriptorSetLayout.layouts[UNIFORM_SPRITE_TEXTURE_NAME] = UNIFORM_SPRITE_TEXTURE_LAYOUT;
localDescriptorSetLayout.bindings[UNIFORM_SPRITE_TEXTURE_BINDING] = UNIFORM_SPRITE_TEXTURE_DESCRIPTOR;

/**
 * @en The sampler for reflection
 * @zh 反射纹理采样器。
 */
const UNIFORM_REFLECTION_TEXTURE_NAME = 'cc_reflectionTexture';
export const UNIFORM_REFLECTION_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_REFLECTION;
const UNIFORM_REFLECTION_TEXTURE_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_REFLECTION_TEXTURE_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.FRAGMENT);
const UNIFORM_REFLECTION_TEXTURE_LAYOUT = new UniformSamplerTexture(SetIndex.LOCAL, UNIFORM_REFLECTION_TEXTURE_BINDING, UNIFORM_REFLECTION_TEXTURE_NAME, Type.SAMPLER2D, 1);
localDescriptorSetLayout.layouts[UNIFORM_REFLECTION_TEXTURE_NAME] = UNIFORM_REFLECTION_TEXTURE_LAYOUT;
localDescriptorSetLayout.bindings[UNIFORM_REFLECTION_TEXTURE_BINDING] = UNIFORM_REFLECTION_TEXTURE_DESCRIPTOR;

/**
  * @en The storage image for reflection
  * @zh 反射纹理存储。
  */
const UNIFORM_REFLECTION_STORAGE_NAME = 'cc_reflectionStorage';
export const UNIFORM_REFLECTION_STORAGE_BINDING = ModelLocalBindings.STORAGE_REFLECTION;
const UNIFORM_REFLECTION_STORAGE_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_REFLECTION_STORAGE_BINDING, DescriptorType.STORAGE_IMAGE, 1, ShaderStageFlagBit.COMPUTE);
const UNIFORM_REFLECTION_STORAGE_LAYOUT = new UniformStorageImage(SetIndex.LOCAL, UNIFORM_REFLECTION_STORAGE_BINDING, UNIFORM_REFLECTION_STORAGE_NAME, Type.IMAGE2D, 1);
localDescriptorSetLayout.layouts[UNIFORM_REFLECTION_STORAGE_NAME] = UNIFORM_REFLECTION_STORAGE_LAYOUT;
localDescriptorSetLayout.bindings[UNIFORM_REFLECTION_STORAGE_BINDING] = UNIFORM_REFLECTION_STORAGE_DESCRIPTOR;

/**
 * @en The sampler for reflection probe cubemap
 * @zh 反射探针立方体贴图纹理采样器。
 */
const UNIFORM_REFLECTION_PROBE_CUBEMAP_NAME = 'cc_reflectionProbeCubemap';
export const UNIFORM_REFLECTION_PROBE_CUBEMAP_BINDING = ModelLocalBindings.SAMPLER_REFLECTION_PROBE_CUBE;
const UNIFORM_REFLECTION_PROBE_CUBEMAP_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_REFLECTION_PROBE_CUBEMAP_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.FRAGMENT);
const UNIFORM_REFLECTION_PROBE_CUBEMAP_LAYOUT = new UniformSamplerTexture(SetIndex.LOCAL, UNIFORM_REFLECTION_PROBE_CUBEMAP_BINDING,
    UNIFORM_REFLECTION_PROBE_CUBEMAP_NAME, Type.SAMPLER_CUBE, 1);
localDescriptorSetLayout.layouts[UNIFORM_REFLECTION_PROBE_CUBEMAP_NAME] = UNIFORM_REFLECTION_PROBE_CUBEMAP_LAYOUT;
localDescriptorSetLayout.bindings[UNIFORM_REFLECTION_PROBE_CUBEMAP_BINDING] = UNIFORM_REFLECTION_PROBE_CUBEMAP_DESCRIPTOR;

/**
 * @en The sampler for reflection probe planar reflection
 * @zh 反射探针平面反射贴图纹理采样器。
 */
const UNIFORM_REFLECTION_PROBE_TEXTURE_NAME = 'cc_reflectionProbePlanarMap';
export const UNIFORM_REFLECTION_PROBE_TEXTURE_BINDING = ModelLocalBindings.SAMPLER_REFLECTION_PROBE_PLANAR;
const UNIFORM_REFLECTION_PROBE_TEXTURE_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_REFLECTION_PROBE_TEXTURE_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.FRAGMENT);
const UNIFORM_REFLECTION_PROBE_TEXTURE_LAYOUT = new UniformSamplerTexture(SetIndex.LOCAL, UNIFORM_REFLECTION_PROBE_TEXTURE_BINDING,
    UNIFORM_REFLECTION_PROBE_TEXTURE_NAME, Type.SAMPLER2D, 1);
localDescriptorSetLayout.layouts[UNIFORM_REFLECTION_PROBE_TEXTURE_NAME] = UNIFORM_REFLECTION_PROBE_TEXTURE_LAYOUT;
localDescriptorSetLayout.bindings[UNIFORM_REFLECTION_PROBE_TEXTURE_BINDING] = UNIFORM_REFLECTION_PROBE_TEXTURE_DESCRIPTOR;

/**
 * @en The sampler for reflection probe data map
 * @zh 反射探针数据贴图采样器。
 */
const UNIFORM_REFLECTION_PROBE_DATA_MAP_NAME = 'cc_reflectionProbeDataMap';
export const UNIFORM_REFLECTION_PROBE_DATA_MAP_BINDING = ModelLocalBindings.SAMPLER_REFLECTION_PROBE_DATA_MAP;
const UNIFORM_REFLECTION_PROBE_DATA_MAP_DESCRIPTOR = new DescriptorSetLayoutBinding(UNIFORM_REFLECTION_PROBE_DATA_MAP_BINDING, DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.FRAGMENT);
const UNIFORM_REFLECTION_PROBE_DATA_MAP_LAYOUT = new UniformSamplerTexture(SetIndex.LOCAL, UNIFORM_REFLECTION_PROBE_DATA_MAP_BINDING,
    UNIFORM_REFLECTION_PROBE_DATA_MAP_NAME, Type.SAMPLER2D, 1);
localDescriptorSetLayout.layouts[UNIFORM_REFLECTION_PROBE_DATA_MAP_NAME] = UNIFORM_REFLECTION_PROBE_DATA_MAP_LAYOUT;
localDescriptorSetLayout.bindings[UNIFORM_REFLECTION_PROBE_DATA_MAP_BINDING] = UNIFORM_REFLECTION_PROBE_DATA_MAP_DESCRIPTOR;

export const CAMERA_DEFAULT_MASK = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.GIZMOS, Layers.BitMask.EDITOR,
    Layers.BitMask.SCENE_GIZMO, Layers.BitMask.PROFILER]);

export const CAMERA_EDITOR_MASK = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.PROFILER]);

export const MODEL_ALWAYS_MASK = Layers.Enum.ALL;

/**
 * @en Does the device support single-channeled half float texture? (for both color attachment and sampling)
 * @zh 当前设备是否支持单通道半浮点贴图？（颜色输出和采样）
 */
export function supportsR16HalfFloatTexture (device: Device) {
    return (device.getFormatFeatures(Format.R16F) & (FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE))
        === (FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE);
}

/**
 * @en Does the device support single-channeled float texture? (for both color attachment and sampling)
 * @zh 当前设备是否支持单通道浮点贴图？（颜色输出和采样）
 */
export function supportsR32FloatTexture (device: Device) {
    return (device.getFormatFeatures(Format.R32F) & (FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE))
        === (FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE)
        && !(device.gfxAPI === API.WEBGL); // wegl 1  Single-channel float type is not supported under webgl1, so it is excluded
}

export function isEnableEffect (): boolean {
    return !!(cclegacy.rendering && cclegacy.rendering.enableEffectImport);
}

/* eslint-enable max-len */
