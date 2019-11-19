/**
 * @category pipeline
 */

import { GFXBuffer } from '../gfx/buffer';
import { GFXCommandBuffer } from '../gfx/command-buffer';
import { GFXBindingType, GFXType } from '../gfx/define';
import { GFXSampler } from '../gfx/sampler';
import { GFXUniformBlock, GFXUniformSampler } from '../gfx/shader';
import { GFXTextureView } from '../gfx/texture-view';
import { Model, Pass } from '../renderer';
import { SubModel } from '../renderer/scene/submodel';
import { Layers } from '../scene-graph/layers';

export const PIPELINE_FLOW_FORWARD: string = 'ForwardFlow';
export const PIPELINE_FLOW_SMAA: string = 'SMAAFlow';
export const PIPELINE_FLOW_TONEMAP: string = 'ToneMapFlow';

/**
 * @zh
 * 渲染过程阶段。
 */
export enum RenderPassStage {
    DEFAULT = 100,
}

/**
 * @zh
 * 渲染优先级。
 */
export enum RenderPriority {
    MIN = 0,
    MAX = 0xff,
    DEFAULT = 0x80,
}

/**
 * @zh
 * 渲染对象。
 */
export interface IRenderObject {
    model: Model;
    depth: number;
}

/**
 * @zh
 * 渲染过程。
 */
export interface IRenderPass {
    hash: number;
    depth: number;
    shaderId: number;
    subModel: SubModel;
    cmdBuff: GFXCommandBuffer;
}

/**
 * @zh
 * 渲染过程。
 */
export interface IRenderBatch {
    pass: Pass;
}

/**
 * @zh
 * 渲染队列描述。
 */
export interface IRenderQueueDesc {
    isTransparent: boolean;
    phases: number;
    sortFunc: (a: IRenderPass, b: IRenderPass) => number;
}

const MAX_BINDING_SUPPORTED = 24; // from WebGL 2 spec

/**
 * @zh
 * Uniform 参数绑定。
 */
export enum UniformBinding {
    // UBOs
    UBO_GLOBAL = MAX_BINDING_SUPPORTED - 1,
    UBO_SHADOW = MAX_BINDING_SUPPORTED - 2,

    UBO_LOCAL = MAX_BINDING_SUPPORTED - 3,
    UBO_FORWARD_LIGHTS = MAX_BINDING_SUPPORTED - 4,
    UBO_SKINNING_ANIMATION = MAX_BINDING_SUPPORTED - 5,
    UBO_SKINNING_TEXTURE = MAX_BINDING_SUPPORTED - 6,
    UBO_UI = MAX_BINDING_SUPPORTED - 7,

    // samplers
    SAMPLER_JOINTS = MAX_BINDING_SUPPORTED + 1,
    SAMPLER_ENVIRONMENT = MAX_BINDING_SUPPORTED + 2,

    // rooms left for custom bindings
    // effect importer prepares bindings according to this
    CUSTUM_UBO_BINDING_END_POINT = MAX_BINDING_SUPPORTED - 7,
    CUSTOM_SAMPLER_BINDING_START_POINT = MAX_BINDING_SUPPORTED + 6,
}

export const isBuiltinBinding = (binding: number) =>
    binding >= UniformBinding.CUSTUM_UBO_BINDING_END_POINT && binding < UniformBinding.CUSTOM_SAMPLER_BINDING_START_POINT;

/**
 * @zh
 * 全局 UBO。
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
    public static AMBIENT_SKY_OFFSET: number = UBOGlobal.MAIN_LIT_COLOR_OFFSET + 4;
    public static AMBIENT_GROUND_OFFSET: number = UBOGlobal.AMBIENT_SKY_OFFSET + 4;
    public static COUNT: number = UBOGlobal.AMBIENT_GROUND_OFFSET + 4;
    public static SIZE: number = UBOGlobal.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
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
            { name: 'cc_ambientSky', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_ambientGround', type: GFXType.FLOAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOGlobal.COUNT);
}

/**
 * @zh
 * 阴影 UBO。
 */
export class UBOShadow {
    public static MAT_LIGHT_PLANE_PROJ_OFFSET: number = 0;
    public static SHADOW_COLOR_OFFSET: number = UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET + 16;
    public static COUNT: number = UBOShadow.SHADOW_COLOR_OFFSET + 4;
    public static SIZE: number = UBOShadow.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_SHADOW, name: 'CCShadow', members: [
            { name: 'cc_matLightPlaneProj', type: GFXType.MAT4, count: 1 },
            { name: 'cc_shadowColor', type: GFXType.FLOAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOShadow.COUNT);
}

export const UNIFORM_ENVIRONMENT: GFXUniformSampler = {
    binding: UniformBinding.SAMPLER_ENVIRONMENT, name: 'cc_environment', type: GFXType.SAMPLER_CUBE, count: 1,
};

export const localBindingsDesc: Map<string, IInternalBindingDesc> = new Map<string, IInternalBindingDesc>();

/**
 * @zh
 * 本地 UBO。
 */
export class UBOLocal {
    public static MAT_WORLD_OFFSET: number = 0;
    public static MAT_WORLD_IT_OFFSET: number = UBOLocal.MAT_WORLD_OFFSET + 16;
    public static COUNT: number = UBOLocal.MAT_WORLD_IT_OFFSET + 16;
    public static SIZE: number = UBOLocal.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_LOCAL, name: 'CCLocal', members: [
            { name: 'cc_matWorld', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matWorldIT', type: GFXType.MAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOLocal.COUNT);
}
localBindingsDesc.set(UBOLocal.BLOCK.name, {
    type: GFXBindingType.UNIFORM_BUFFER,
    blockInfo: UBOLocal.BLOCK,
});

export class UBOLocalBatched {
    public static BATCHING_COUNT: number = 10;
    public static MAT_WORLDS_OFFSET: number = 0;
    public static COUNT: number = 16 * UBOLocalBatched.BATCHING_COUNT;
    public static SIZE: number = UBOLocalBatched.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_LOCAL, name: 'CCLocalBatched', members: [
            { name: 'cc_matWorlds', type: GFXType.MAT4, count: UBOLocalBatched.BATCHING_COUNT },
        ],
    };

    public view: Float32Array = new Float32Array(UBOLocalBatched.COUNT);
}
localBindingsDesc.set(UBOLocalBatched.BLOCK.name, {
    type: GFXBindingType.UNIFORM_BUFFER,
    blockInfo: UBOLocalBatched.BLOCK,
});

/**
 * @zh
 * 前向灯光 UBO。
 */
export class UBOForwardLight {
    public static MAX_SPHERE_LIGHTS = 2;
    public static MAX_SPOT_LIGHTS = 2;

    public static SPHERE_LIGHT_POS_OFFSET: number = 0;
    public static SPHERE_LIGHT_SIZE_RANGE_OFFSET: number = UBOForwardLight.SPHERE_LIGHT_POS_OFFSET + UBOForwardLight.MAX_SPHERE_LIGHTS * 4;
    public static SPHERE_LIGHT_COLOR_OFFSET: number = UBOForwardLight.SPHERE_LIGHT_SIZE_RANGE_OFFSET + UBOForwardLight.MAX_SPHERE_LIGHTS * 4;
    public static SPOT_LIGHT_POS_OFFSET: number = UBOForwardLight.SPHERE_LIGHT_COLOR_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
    public static SPOT_LIGHT_SIZE_RANGE_ANGLE_OFFSET: number = UBOForwardLight.SPOT_LIGHT_POS_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
    public static SPOT_LIGHT_DIR_OFFSET: number = UBOForwardLight.SPOT_LIGHT_SIZE_RANGE_ANGLE_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
    public static SPOT_LIGHT_COLOR_OFFSET: number = UBOForwardLight.SPOT_LIGHT_DIR_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
    public static COUNT: number = UBOForwardLight.SPOT_LIGHT_COLOR_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
    public static SIZE: number = UBOForwardLight.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_FORWARD_LIGHTS, name: 'CCForwardLight', members: [
            { name: 'cc_sphereLitPos', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPHERE_LIGHTS },
            { name: 'cc_sphereLitSizeRange', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPHERE_LIGHTS },
            { name: 'cc_sphereLitColor', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPHERE_LIGHTS },
            { name: 'cc_spotLitPos', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
            { name: 'cc_spotLitSizeRangeAngle', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
            { name: 'cc_spotLitDir', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
            { name: 'cc_spotLitColor', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
        ],
    };

    public view: Float32Array = new Float32Array(UBOForwardLight.COUNT);
}
localBindingsDesc.set(UBOForwardLight.BLOCK.name, {
    type: GFXBindingType.UNIFORM_BUFFER,
    blockInfo: UBOForwardLight.BLOCK,
});

// The actual uniform vectors used is JointUniformCapacity * 3.
// We think this is a reasonable default capacity considering MAX_VERTEX_UNIFORM_VECTORS in WebGL spec is just 128.
// Skinning models with number of bones more than this capacity will be automatically switched to texture skinning.
// But still, you can tweak this for your own need by changing the number below
// and the JOINT_UNIFORM_CAPACITY macro in cc-skinning shader header.
export const JointUniformCapacity = 30;

/**
 * @zh
 * 骨骼贴图 UBO。
 */
export class UBOSkinningTexture {
    public static JOINTS_TEXTURE_INFO_OFFSET: number = 0;
    public static COUNT: number = UBOSkinningTexture.JOINTS_TEXTURE_INFO_OFFSET + 4;
    public static SIZE: number = UBOSkinningTexture.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_SKINNING_TEXTURE, name: 'CCSkinningTexture', members: [
            { name: 'cc_jointsTextureInfo', type: GFXType.FLOAT4, count: 1 },
        ],
    };
}
localBindingsDesc.set(UBOSkinningTexture.BLOCK.name, {
    type: GFXBindingType.UNIFORM_BUFFER,
    blockInfo: UBOSkinningTexture.BLOCK,
});
export class UBOSkinningAnimation {
    public static JOINTS_ANIM_INFO_OFFSET: number = 0;
    public static COUNT: number = UBOSkinningAnimation.JOINTS_ANIM_INFO_OFFSET + 4;
    public static SIZE: number = UBOSkinningAnimation.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_SKINNING_ANIMATION, name: 'CCSkinningAnimation', members: [
            { name: 'cc_jointsAnimInfo', type: GFXType.FLOAT4, count: 1 },
        ],
    };
}
localBindingsDesc.set(UBOSkinningAnimation.BLOCK.name, {
    type: GFXBindingType.UNIFORM_BUFFER,
    blockInfo: UBOSkinningAnimation.BLOCK,
});

/**
 * 骨骼纹理采样器。
 */
export const UniformJointsTexture: GFXUniformSampler = {
    binding: UniformBinding.SAMPLER_JOINTS, name: 'cc_jointsTexture', type: GFXType.SAMPLER2D, count: 1,
};
localBindingsDesc.set(UniformJointsTexture.name, {
    type: GFXBindingType.SAMPLER,
    samplerInfo: UniformJointsTexture,
});

export interface IInternalBindingDesc {
    type: GFXBindingType;
    blockInfo?: GFXUniformBlock;
    samplerInfo?: GFXUniformSampler;
}

export interface IInternalBindingInst extends IInternalBindingDesc {
    buffer?: GFXBuffer;
    sampler?: GFXSampler;
    textureView?: GFXTextureView;
}

export const CameraDefaultMask = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.GIZMOS, Layers.BitMask.EDITOR,
    Layers.BitMask.SCENE_GIZMO, Layers.BitMask.PROFILER]);

export const CameraEditorMask = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.PROFILER]);

export const ModelAlwaysMask = Layers.Enum.ALL;
