/**
 * @category pipeline
 */

import { GFXBuffer } from '../gfx/buffer';
import { GFXDescriptorType, GFXType, GFXShaderType } from '../gfx/define';
import { GFXSampler } from '../gfx/sampler';
import { GFXUniformBlock, GFXUniformSampler } from '../gfx/shader';
import { GFXTexture } from '../gfx/texture';
import { Pass } from '../renderer/core/pass';
import { Model } from '../renderer/scene/model';
import { SubModel } from '../renderer/scene/submodel';
import { Layers } from '../scene-graph/layers';
import { legacyCC } from '../global-exports';

export const PIPELINE_FLOW_FORWARD: string = 'ForwardFlow';
export const PIPELINE_FLOW_SHADOW: string = 'ShadowFlow';
export const PIPELINE_FLOW_SMAA: string = 'SMAAFlow';
export const PIPELINE_FLOW_TONEMAP: string = 'ToneMapFlow';

/**
 * @en The predefined render pass stage ids
 * @zh 预设的渲染阶段。
 */
export enum RenderPassStage {
    DEFAULT = 100,
    UI = 200,
}
legacyCC.RenderPassStage = RenderPassStage;

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

const MAX_BINDING_SUPPORTED = 24; // from WebGL 2 spec

/**
 * @en The uniform bindings
 * @zh Uniform 参数绑定。
 */
export enum PipelineGlobalBindings {
    // UBOs
    UBO_GLOBAL,
    UBO_SHADOW,
    UBO_PCF_SHADOW,

    // samplers
    SAMPLER_ENVIRONMENT,
    SAMPLER_SHADOWMAP,
}

export enum ModelLocalBindings {
    UBO_LOCAL,
    UBO_FORWARD_LIGHTS,
    UBO_SKINNING_ANIMATION,
    UBO_SKINNING_TEXTURE,
    UBO_UI,
    UBO_MORPH,

    SAMPLER_JOINTS,
    SAMPLER_MORPH_POSITION,
    SAMPLER_MORPH_NORMAL,
    SAMPLER_MORPH_TANGENT,
    SAMPLER_LIGHTING_MAP,
}

/**
 * @en Check whether the given uniform binding is a builtin binding
 * @zh 检查指定的 UniformBinding 是否是引擎内置的
 * @param binding
 */
export const isBuiltinBinding = (set: number) => set !== DescriptorSetIndices.MATERIAL_SPECIFIC;

export enum DescriptorSetIndices {
    PIPELINE_GLOBAL,
    MATERIAL_SPECIFIC,
    MODEL_LOCAL,
}
// parameters passed to GFXDevice
export const maxPerSetBufferCount = [3, -1, 6];
export const maxPerSetSamplerCount = [2, -1, 5];

/**
 * @en The global uniform buffer object
 * @zh 全局 UBO。
 */
export class UBOGlobal {

    public static TIME_OFFSET: number = 0;
    public static SCREEN_SIZE_OFFSET: number = UBOGlobal.TIME_OFFSET + 4;
    public static SCREEN_SCALE_OFFSET: number = UBOGlobal.SCREEN_SIZE_OFFSET + 4;
    public static NATIVE_SIZE_OFFSET: number = UBOGlobal.SCREEN_SCALE_OFFSET + 4;
    public static MAT_VIEW_OFFSET: number = UBOGlobal.NATIVE_SIZE_OFFSET + 4;
    public static MAT_VIEW_INV_OFFSET: number = UBOGlobal.MAT_VIEW_OFFSET + 16;
    public static MAT_PROJ_OFFSET: number = UBOGlobal.MAT_VIEW_INV_OFFSET + 16;
    public static MAT_PROJ_INV_OFFSET: number = UBOGlobal.MAT_PROJ_OFFSET + 16;
    public static MAT_VIEW_PROJ_OFFSET: number = UBOGlobal.MAT_PROJ_INV_OFFSET + 16;
    public static MAT_VIEW_PROJ_INV_OFFSET: number = UBOGlobal.MAT_VIEW_PROJ_OFFSET + 16;
    public static CAMERA_POS_OFFSET: number = UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET + 16;
    public static EXPOSURE_OFFSET: number = UBOGlobal.CAMERA_POS_OFFSET + 4;
    public static MAIN_LIT_DIR_OFFSET: number = UBOGlobal.EXPOSURE_OFFSET + 4;
    public static MAIN_LIT_COLOR_OFFSET: number = UBOGlobal.MAIN_LIT_DIR_OFFSET + 4;
    public static MAIN_SHADOW_MATRIX_OFFSET: number = UBOGlobal.MAIN_LIT_COLOR_OFFSET + 4;
    public static AMBIENT_SKY_OFFSET: number = UBOGlobal.MAIN_SHADOW_MATRIX_OFFSET + 16;
    public static AMBIENT_GROUND_OFFSET: number = UBOGlobal.AMBIENT_SKY_OFFSET + 4;
    public static GLOBAL_FOG_COLOR_OFFSET: number = UBOGlobal.AMBIENT_GROUND_OFFSET + 4;
    public static GLOBAL_FOG_BASE_OFFSET: number = UBOGlobal.GLOBAL_FOG_COLOR_OFFSET + 4;
    public static GLOBAL_FOG_ADD_OFFSET: number = UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 4;
    public static COUNT: number = UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 4;
    public static SIZE: number = UBOGlobal.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        shaderStages: GFXShaderType.ALL, set: DescriptorSetIndices.PIPELINE_GLOBAL,
        binding: UniformBinding.UBO_GLOBAL, name: 'CCGlobal', members: [
            { name: 'cc_time', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_screenSize', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_screenScale', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_nativeSize', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_matView', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matViewInv', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matProj', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matProjInv', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matViewProj', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matViewProjInv', type: GFXType.MAT4, count: 1 },
            { name: 'cc_cameraPos', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_exposure', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_mainLitDir', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_mainLitColor', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_shadowLightMatrix', type: GFXType.MAT4, count: 1 },
            { name: 'cc_ambientSky', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_ambientGround', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_fogColor', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_fogBase', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_fogAdd', type: GFXType.FLOAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOGlobal.COUNT);
}

/**
 * The uniform buffer object for PCFshadow
 */
export class UBOPCFShadow {
    public static MAT_SHADOW_VIEW_PROJ_OFFSET: number = 0;
    public static COUNT: number = UBOPCFShadow.MAT_SHADOW_VIEW_PROJ_OFFSET + 16;
    public static SIZE: number = UBOPCFShadow.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        shaderStages: GFXShaderType.ALL, set: DescriptorSetIndices.PIPELINE_GLOBAL,
        binding: UniformBinding.UBO_PCF_SHADOW, name: 'CCPCFShadow', members: [
            { name: 'cc_shadowMatViewProj', type: GFXType.MAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOPCFShadow.COUNT);
}

export const UNIFORM_SHADOWMAP: GFXUniformSampler = {
    shaderStages: GFXShaderType.FRAGMENT, set: DescriptorSetIndices.PIPELINE_GLOBAL,
    binding: UniformBinding.SAMPLER_SHADOWMAP, name: 'cc_shadowMap', type: GFXType.SAMPLER2D, count: 1,
};

/**
 * @en The uniform buffer object for shadow
 * @zh 阴影 UBO。
 */
export class UBOShadow {
    public static MAT_LIGHT_PLANE_PROJ_OFFSET: number = 0;
    public static SHADOW_COLOR_OFFSET: number = UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET + 16;
    public static COUNT: number = UBOShadow.SHADOW_COLOR_OFFSET + 4;
    public static SIZE: number = UBOShadow.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        shaderStages: GFXShaderType.ALL, set: DescriptorSetIndices.PIPELINE_GLOBAL,
        binding: UniformBinding.UBO_SHADOW, name: 'CCShadow', members: [
            { name: 'cc_matLightPlaneProj', type: GFXType.MAT4, count: 1 },
            { name: 'cc_shadowColor', type: GFXType.FLOAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOShadow.COUNT);
}

export const UNIFORM_ENVIRONMENT: GFXUniformSampler = {
    shaderStages: GFXShaderType.FRAGMENT, set: DescriptorSetIndices.PIPELINE_GLOBAL,
    binding: UniformBinding.SAMPLER_ENVIRONMENT, name: 'cc_environment', type: GFXType.SAMPLER_CUBE, count: 1,
};

export const localBindingsDesc: Map<string, IInternalBindingDesc> = new Map<string, IInternalBindingDesc>();

/**
 * @en The local uniform buffer object
 * @zh 本地 UBO。
 */
export class UBOLocal {
    public static MAT_WORLD_OFFSET: number = 0;
    public static MAT_WORLD_IT_OFFSET: number = UBOLocal.MAT_WORLD_OFFSET + 16;
    public static LIGHTINGMAP_UVPARAM: number = UBOLocal.MAT_WORLD_IT_OFFSET + 16;
    public static COUNT: number = UBOLocal.LIGHTINGMAP_UVPARAM + 4;
    public static SIZE: number = UBOLocal.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        shaderStages: GFXShaderType.VERTEX, set: DescriptorSetIndices.MODEL_LOCAL,
        binding: UniformBinding.UBO_LOCAL, name: 'CCLocal', members: [
            { name: 'cc_matWorld', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matWorldIT', type: GFXType.MAT4, count: 1 },
            { name: 'cc_lightingMapUVParam', type: GFXType.FLOAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOLocal.COUNT);
}
localBindingsDesc.set(UBOLocal.BLOCK.name, {
    type: GFXDescriptorType.UNIFORM_BUFFER,
    blockInfo: UBOLocal.BLOCK,
});
export const INST_MAT_WORLD = 'a_matWorld0';

export class UBOLocalBatched {
    public static BATCHING_COUNT: number = 10;
    public static MAT_WORLDS_OFFSET: number = 0;
    public static COUNT: number = 16 * UBOLocalBatched.BATCHING_COUNT;
    public static SIZE: number = UBOLocalBatched.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        shaderStages: GFXShaderType.VERTEX, set: DescriptorSetIndices.MODEL_LOCAL,
        binding: UniformBinding.UBO_LOCAL, name: 'CCLocalBatched', members: [
            { name: 'cc_matWorlds', type: GFXType.MAT4, count: UBOLocalBatched.BATCHING_COUNT },
        ],
    };

    public view: Float32Array = new Float32Array(UBOLocalBatched.COUNT);
}
localBindingsDesc.set(UBOLocalBatched.BLOCK.name, {
    type: GFXDescriptorType.UNIFORM_BUFFER,
    blockInfo: UBOLocalBatched.BLOCK,
});

/**
 * @en The uniform buffer object for forward lighting
 * @zh 前向灯光 UBO。
 */
export class UBOForwardLight {
    public static LIGHTS_PER_PASS = 1;

    public static LIGHT_POS_OFFSET: number = 0;
    public static LIGHT_COLOR_OFFSET: number = UBOForwardLight.LIGHT_POS_OFFSET + UBOForwardLight.LIGHTS_PER_PASS * 4;
    public static LIGHT_SIZE_RANGE_ANGLE_OFFSET: number = UBOForwardLight.LIGHT_COLOR_OFFSET + UBOForwardLight.LIGHTS_PER_PASS * 4;
    public static LIGHT_DIR_OFFSET: number = UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET + UBOForwardLight.LIGHTS_PER_PASS * 4;
    public static COUNT: number = UBOForwardLight.LIGHT_DIR_OFFSET + UBOForwardLight.LIGHTS_PER_PASS * 4;
    public static SIZE: number = UBOForwardLight.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        shaderStages: GFXShaderType.FRAGMENT, set: DescriptorSetIndices.MODEL_LOCAL,
        binding: UniformBinding.UBO_FORWARD_LIGHTS, name: 'CCForwardLight', members: [
            { name: 'cc_lightPos', type: GFXType.FLOAT4, count: UBOForwardLight.LIGHTS_PER_PASS },
            { name: 'cc_lightColor', type: GFXType.FLOAT4, count: UBOForwardLight.LIGHTS_PER_PASS },
            { name: 'cc_lightSizeRangeAngle', type: GFXType.FLOAT4, count: UBOForwardLight.LIGHTS_PER_PASS },
            { name: 'cc_lightDir', type: GFXType.FLOAT4, count: UBOForwardLight.LIGHTS_PER_PASS },
        ],
    };

    public view: Float32Array = new Float32Array(UBOForwardLight.COUNT);
}
localBindingsDesc.set(UBOForwardLight.BLOCK.name, {
    type: GFXDescriptorType.UNIFORM_BUFFER,
    blockInfo: UBOForwardLight.BLOCK,
});

// The actual uniform vectors used is JointUniformCapacity * 3.
// We think this is a reasonable default capacity considering MAX_VERTEX_UNIFORM_VECTORS in WebGL spec is just 128.
// Skinning models with number of bones more than this capacity will be automatically switched to texture skinning.
// But still, you can tweak this for your own need by changing the number below
// and the JOINT_UNIFORM_CAPACITY macro in cc-skinning shader header.
export const JOINT_UNIFORM_CAPACITY = 30;

/**
 * @en The uniform buffer object for skinning texture
 * @zh 骨骼贴图 UBO。
 */
export class UBOSkinningTexture {
    public static JOINTS_TEXTURE_INFO_OFFSET: number = 0;
    public static COUNT: number = UBOSkinningTexture.JOINTS_TEXTURE_INFO_OFFSET + 4;
    public static SIZE: number = UBOSkinningTexture.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        shaderStages: GFXShaderType.VERTEX, set: DescriptorSetIndices.MODEL_LOCAL,
        binding: UniformBinding.UBO_SKINNING_TEXTURE, name: 'CCSkinningTexture', members: [
            { name: 'cc_jointTextureInfo', type: GFXType.FLOAT4, count: 1 },
        ],
    };
}
localBindingsDesc.set(UBOSkinningTexture.BLOCK.name, {
    type: GFXDescriptorType.UNIFORM_BUFFER,
    blockInfo: UBOSkinningTexture.BLOCK,
});
export class UBOSkinningAnimation {
    public static JOINTS_ANIM_INFO_OFFSET: number = 0;
    public static COUNT: number = UBOSkinningAnimation.JOINTS_ANIM_INFO_OFFSET + 4;
    public static SIZE: number = UBOSkinningAnimation.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        shaderStages: GFXShaderType.VERTEX, set: DescriptorSetIndices.MODEL_LOCAL,
        binding: UniformBinding.UBO_SKINNING_ANIMATION, name: 'CCSkinningAnimation', members: [
            { name: 'cc_jointAnimInfo', type: GFXType.FLOAT4, count: 1 },
        ],
    };
}
localBindingsDesc.set(UBOSkinningAnimation.BLOCK.name, {
    type: GFXDescriptorType.UNIFORM_BUFFER,
    blockInfo: UBOSkinningAnimation.BLOCK,
});
export const INST_JOINT_ANIM_INFO = 'a_jointAnimInfo';
export class UBOSkinning {
    public static JOINTS_OFFSET: number = 0;
    public static COUNT: number = UBOSkinning.JOINTS_OFFSET + JOINT_UNIFORM_CAPACITY * 12;
    public static SIZE: number = UBOSkinning.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        shaderStages: GFXShaderType.VERTEX, set: DescriptorSetIndices.MODEL_LOCAL,
        binding: UniformBinding.UBO_SKINNING_TEXTURE, name: 'CCSkinning', members: [
            { name: 'cc_joints', type: GFXType.FLOAT4, count: JOINT_UNIFORM_CAPACITY * 3 },
        ],
    };
}
localBindingsDesc.set(UBOSkinning.BLOCK.name, {
    type: GFXDescriptorType.UNIFORM_BUFFER,
    blockInfo: UBOSkinning.BLOCK,
});

/**
 * @en The sampler for joint texture
 * @zh 骨骼纹理采样器。
 */
export const UniformJointTexture: GFXUniformSampler = {
    shaderStages: GFXShaderType.VERTEX, set: DescriptorSetIndices.MODEL_LOCAL,
    binding: UniformBinding.SAMPLER_JOINTS, name: 'cc_jointTexture', type: GFXType.SAMPLER2D, count: 1,
};
localBindingsDesc.set(UniformJointTexture.name, {
    type: GFXDescriptorType.SAMPLER,
    samplerInfo: UniformJointTexture,
});

/**
 * @en The uniform buffer object for morph setting
 * @zh 形变配置的 UBO
 */
export class UBOMorph {
    public static readonly MAX_MORPH_TARGET_COUNT = 60;

    public static readonly OFFSET_OF_WEIGHTS = 0;

    public static readonly OFFSET_OF_DISPLACEMENT_TEXTURE_WIDTH = 4 * UBOMorph.MAX_MORPH_TARGET_COUNT;

    public static readonly OFFSET_OF_DISPLACEMENT_TEXTURE_HEIGHT = UBOMorph.OFFSET_OF_DISPLACEMENT_TEXTURE_WIDTH + 4;

    public static readonly COUNT_BASE_4_BYTES = 4 * Math.ceil(UBOMorph.MAX_MORPH_TARGET_COUNT / 4) + 4;

    public static readonly SIZE = UBOMorph.COUNT_BASE_4_BYTES * 4;

    public static readonly BLOCK: GFXUniformBlock = {
        shaderStages: GFXShaderType.VERTEX, set: DescriptorSetIndices.MODEL_LOCAL,
        binding: UniformBinding.UBO_MORPH, name: 'CCMorph', members: [
            { name: 'cc_displacementWeights', type: GFXType.FLOAT4, count: UBOMorph.MAX_MORPH_TARGET_COUNT / 4, },
            { name: 'cc_displacementTextureInfo', type: GFXType.FLOAT4, count: 1, },
        ],
    };
}
localBindingsDesc.set(UBOMorph.BLOCK.name, {
    type: GFXDescriptorType.UNIFORM_BUFFER,
    blockInfo: UBOMorph.BLOCK,
});

/**
 * @en The sampler for morph texture of position
 * @zh 位置形变纹理采样器。
 */
export const UniformPositionMorphTexture: Readonly<GFXUniformSampler> = {
    shaderStages: GFXShaderType.VERTEX, set: DescriptorSetIndices.MODEL_LOCAL,
    binding: UniformBinding.SAMPLER_MORPH_POSITION, name: 'cc_PositionDisplacements', type: GFXType.SAMPLER2D, count: 1,
};
localBindingsDesc.set(UniformPositionMorphTexture.name, {
    type: GFXDescriptorType.SAMPLER,
    samplerInfo: UniformPositionMorphTexture,
});

/**
 * @en The sampler for morph texture of normal
 * @zh 法线形变纹理采样器。
 */
export const UniformNormalMorphTexture: Readonly<GFXUniformSampler> = {
    shaderStages: GFXShaderType.VERTEX, set: DescriptorSetIndices.MODEL_LOCAL,
    binding: UniformBinding.SAMPLER_MORPH_NORMAL, name: 'cc_NormalDisplacements', type: GFXType.SAMPLER2D, count: 1,
};
localBindingsDesc.set(UniformNormalMorphTexture.name, {
    type: GFXDescriptorType.SAMPLER,
    samplerInfo: UniformNormalMorphTexture,
});

/**
 * @en The sampler for light map texture
 * @zh 光照图纹理采样器。
 */
export const UniformLightingMapSampler: Readonly<GFXUniformSampler> = {
    shaderStages: GFXShaderType.FRAGMENT, set: DescriptorSetIndices.MODEL_LOCAL,
    binding: UniformBinding.SAMPLER_LIGHTING_MAP, name: 'cc_lightingMap', type: GFXType.SAMPLER2D, count: 1,
};
localBindingsDesc.set(UniformLightingMapSampler.name, {
    type: GFXDescriptorType.SAMPLER,
    samplerInfo: UniformLightingMapSampler,
});

/**
 * @en The sampler for morph texture of tangent
 * @zh 切线形变纹理采样器。
 */
export const UniformTangentMorphTexture: Readonly<GFXUniformSampler> = {
    shaderStages: GFXShaderType.VERTEX, set: DescriptorSetIndices.MODEL_LOCAL,
    binding: UniformBinding.SAMPLER_MORPH_TANGENT, name: 'cc_TangentDisplacements', type: GFXType.SAMPLER2D, count: 1,
};
localBindingsDesc.set(UniformTangentMorphTexture.name, {
    type: GFXDescriptorType.SAMPLER,
    samplerInfo: UniformTangentMorphTexture,
});

export interface IInternalBindingDesc {
    type: GFXDescriptorType;
    blockInfo?: GFXUniformBlock;
    samplerInfo?: GFXUniformSampler;
    defaultValue?: ArrayBuffer | string;
}

export interface IInternalBindingInst extends IInternalBindingDesc {
    buffer?: GFXBuffer;
    sampler?: GFXSampler;
    texture?: GFXTexture;
}

export const CAMERA_DEFAULT_MASK = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.GIZMOS, Layers.BitMask.EDITOR,
    Layers.BitMask.SCENE_GIZMO, Layers.BitMask.PROFILER]);

export const CAMERA_EDITOR_MASK = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.PROFILER]);

export const MODEL_ALWAYS_MASK = Layers.Enum.ALL;
