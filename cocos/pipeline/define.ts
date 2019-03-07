import { GFXBuffer } from '../gfx/buffer';
import { GFXBindingType, GFXType } from '../gfx/define';
import { GFXSampler } from '../gfx/sampler';
import { GFXUniformBlock, GFXUniformSampler } from '../gfx/shader';
import { GFXTextureView } from '../gfx/texture-view';

export enum RenderPassStage {
    DEFAULT = 100,
}

export enum RenderPriority {
    MIN = 0,
    MAX = 0xff,
    DEFAULT = 0x80,
}

const MAX_BINDING_SUPPORTED = 24; // from WebGL 2 spec
export enum UniformBinding {
    // UBOs
    UBO_GLOBAL = MAX_BINDING_SUPPORTED - 1,
    UBO_LOCAL = MAX_BINDING_SUPPORTED - 2,
    UBO_FORWARD_LIGHTS = MAX_BINDING_SUPPORTED - 3,
    UBO_SKINNING = MAX_BINDING_SUPPORTED - 4,
    UBO_UI = MAX_BINDING_SUPPORTED - 5,
    UBO_SHADOW = MAX_BINDING_SUPPORTED - 6,
    // samplers
    SAMPLER_JOINTS = MAX_BINDING_SUPPORTED + 1,
}

export class UBOGlobal {
    public static TIME_OFFSET: number = 0;
    public static SCREEN_SIZE_OFFSET: number = UBOGlobal.TIME_OFFSET + 4;
    public static SCREEN_SCALE_OFFSET: number = UBOGlobal.SCREEN_SIZE_OFFSET + 4;
    public static MAT_VIEW_OFFSET: number = UBOGlobal.SCREEN_SCALE_OFFSET + 4;
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

export class UBOForwardLights {
    public static MAX_SPHERE_LIGHTS = 4;
    public static MAX_SPOT_LIGHTS = 4;

    public static SPHERE_LIGHT_POS_OFFSET: number = 0;
    public static SPHERE_LIGHT_SIZE_RANGE_OFFSET: number = UBOForwardLights.SPHERE_LIGHT_POS_OFFSET + UBOForwardLights.MAX_SPHERE_LIGHTS * 4;
    public static SPHERE_LIGHT_COLOR_OFFSET: number = UBOForwardLights.SPHERE_LIGHT_SIZE_RANGE_OFFSET + UBOForwardLights.MAX_SPHERE_LIGHTS * 4;
    public static SPOT_LIGHT_POS_SIZE_OFFSET: number = UBOForwardLights.SPHERE_LIGHT_COLOR_OFFSET + UBOForwardLights.MAX_SPOT_LIGHTS * 4;
    public static SPOT_LIGHT_DIR_RANGE_OFFSET: number = UBOForwardLights.SPOT_LIGHT_POS_SIZE_OFFSET + UBOForwardLights.MAX_SPOT_LIGHTS * 4;
    public static SPOT_LIGHT_COLOR_OFFSET: number = UBOForwardLights.SPOT_LIGHT_DIR_RANGE_OFFSET + UBOForwardLights.MAX_SPOT_LIGHTS * 4;
    public static COUNT: number = UBOForwardLights.SPOT_LIGHT_COLOR_OFFSET + UBOForwardLights.MAX_SPOT_LIGHTS * 4;
    public static SIZE: number = UBOForwardLights.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_FORWARD_LIGHTS, name: 'CCForwardLights', members: [
            { name: 'cc_sphereLightPos', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPHERE_LIGHTS },
            { name: 'cc_sphereLightSizeRange', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPHERE_LIGHTS },
            { name: 'cc_sphereLightColor', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPHERE_LIGHTS },
            { name: 'cc_spotLightPosSize', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPOT_LIGHTS },
            { name: 'cc_spotLightDirRange', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPOT_LIGHTS },
            { name: 'cc_spotLightColor', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPOT_LIGHTS },
        ],
    };

    public view: Float32Array = new Float32Array(UBOForwardLights.COUNT);
}

/*
export class UBOForwardLights {
    public static MAX_DIR_LIGHTS = 4;
    public static MAX_POINT_LIGHTS = 4;
    public static MAX_SPOT_LIGHTS = 4;

    public static DIR_LIGHT_DIR_OFFSET: number = 0;
    public static DIR_LIGHT_COLOR_OFFSET: number = UBOForwardLight.DIR_LIGHT_DIR_OFFSET + UBOForwardLight.MAX_DIR_LIGHTS * 4;
    public static POINT_LIGHT_POS_RANGE_OFFSET: number = UBOForwardLight.DIR_LIGHT_COLOR_OFFSET + UBOForwardLight.MAX_DIR_LIGHTS * 4;
    public static POINT_LIGHT_COLOR_OFFSET: number = UBOForwardLight.POINT_LIGHT_POS_RANGE_OFFSET + UBOForwardLight.MAX_POINT_LIGHTS * 4;
    public static SPOT_LIGHT_POS_RANGE_OFFSET: number = UBOForwardLight.POINT_LIGHT_COLOR_OFFSET + UBOForwardLight.MAX_POINT_LIGHTS * 4;
    public static SPOT_LIGHT_DIR_OFFSET: number = UBOForwardLight.SPOT_LIGHT_POS_RANGE_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
    public static SPOT_LIGHT_COLOR_OFFSET: number = UBOForwardLight.SPOT_LIGHT_DIR_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
    public static COUNT: number = UBOForwardLight.SPOT_LIGHT_COLOR_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
    public static SIZE: number = UBOForwardLight.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_FORWARD_LIGHTS, name: 'CCForwardLights', members: [
            { name: 'cc_dirLightDirection', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_DIR_LIGHTS },
            { name: 'cc_dirLightColor', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_DIR_LIGHTS },
            { name: 'cc_pointLightPositionAndRange', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_POINT_LIGHTS },
            { name: 'cc_pointLightColor', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_POINT_LIGHTS },
            { name: 'cc_spotLightPositionAndRange', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
            { name: 'cc_spotLightDirection', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
            { name: 'cc_spotLightColor', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
        ],
    };

    public view: Float32Array = new Float32Array(UBOForwardLight.COUNT);
}
*/

export class UBOSkinning {
    public static MAT_JOINT_OFFSET: number = 0;
    public static JOINTS_TEXTURE_SIZE_OFFSET: number = UBOSkinning.MAT_JOINT_OFFSET + 128 * 16;
    public static COUNT: number = UBOSkinning.JOINTS_TEXTURE_SIZE_OFFSET + 4;
    public static SIZE: number = UBOSkinning.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_SKINNING, name: 'CCSkinning', members: [
            { name: 'cc_matJoint', type: GFXType.MAT4, count: 128 },
            { name: 'cc_jointsTextureSize', type: GFXType.FLOAT4, count: 1 },
        ],
    };
}

export const UNIFORM_JOINTS_TEXTURE: GFXUniformSampler = {
    binding: UniformBinding.SAMPLER_JOINTS, name: 'cc_jointsTexture', type: GFXType.SAMPLER2D, count: 1,
};

export class UBOUI {
    public static MAT_VIEW_PROJ_OFFSET: number = 0;
    public static COUNT: number = 16;
    public static SIZE: number = UBOUI.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_UI, name: 'UI', members: [
            { name: 'u_matViewProj', type: GFXType.MAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOUI.COUNT);
}

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
}

export interface IGlobalBindingDesc {
    type: GFXBindingType;
    blockInfo?: GFXUniformBlock;
    buffer?: GFXBuffer;

    samplerInfo?: GFXUniformSampler;
    sampler?: GFXSampler;
    textureView?: GFXTextureView;
}
