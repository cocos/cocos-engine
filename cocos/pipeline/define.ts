import { GFXBuffer } from '../gfx/buffer';
import { GFXObjectType } from '../gfx/define';
import { GFXType } from '../gfx/define';
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

export enum UniformBinding {
    UBO_GLOBAL = 20,
    UBO_LOCAL = 21,
    UBO_LIGHT = 22,
    UBO_SKINNING = 23,
    JOINTS_TEXTURE = 25,
}

export class UBOGlobal {
    public static TIME_OFFSET: number = 0;
    public static SCREEN_SIZE_OFFSET: number = 4;
    public static SCREEN_SCALE_OFFSET: number = 8;
    public static MAT_VIEW_OFFSET: number = 12;
    public static MAT_VIEW_INV_OFFSET: number = 28;
    public static MAT_PROJ_OFFSET: number = 44;
    public static MAT_PROJ_INV_OFFSET: number = 60;
    public static MAT_VIEW_PROJ_OFFSET: number = 76;
    public static MAT_VIEW_PROJ_INV_OFFSET: number = 92;
    public static CAMERA_POS_OFFSET: number = 108;
    public static COUNT: number = 112;
    public static SIZE: number = UBOGlobal.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_GLOBAL, name: 'CCGlobal', members: [
            // constants
            { name: 'cc_time', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_screenSize', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_screenScale', type: GFXType.FLOAT4, count: 1 },
            // transform
            { name: 'cc_matView', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matViewInv', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matProj', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matProjInv', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matViewProj', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matViewProjInv', type: GFXType.MAT4, count: 1 },
            { name: 'cc_cameraPos', type: GFXType.FLOAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOGlobal.COUNT);
}

export class UBOLocal {
    public static MAT_WORLD_OFFSET: number = 0;
    public static MAT_WORLD_IT_OFFSET: number = 16;
    public static COUNT: number = 32;
    public static SIZE: number = UBOLocal.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: 21, name: 'CCLocal', members: [
            { name: 'cc_matWorld', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matWorldIT', type: GFXType.MAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOLocal.COUNT);
}

export class UBOForwardLights {
    public static MAX_DIR_LIGHTS = 4;
    public static MAX_POINT_LIGHTS = 4;
    public static MAX_SPOT_LIGHTS = 4;

    public static DIR_LIGHT_DIR_OFFSET: number = 0;
    public static DIR_LIGHT_COLOR_OFFSET: number = UBOForwardLights.DIR_LIGHT_DIR_OFFSET + UBOForwardLights.MAX_DIR_LIGHTS * 4;
    public static POINT_LIGHT_POS_RANGE_OFFSET: number = UBOForwardLights.DIR_LIGHT_COLOR_OFFSET + UBOForwardLights.MAX_DIR_LIGHTS * 4;
    public static POINT_LIGHT_COLOR_OFFSET: number = UBOForwardLights.POINT_LIGHT_POS_RANGE_OFFSET + UBOForwardLights.MAX_POINT_LIGHTS * 4;
    public static SPOT_LIGHT_POS_RANGE_OFFSET: number = UBOForwardLights.POINT_LIGHT_COLOR_OFFSET + UBOForwardLights.MAX_POINT_LIGHTS * 4;
    public static SPOT_LIGHT_DIR_OFFSET: number = UBOForwardLights.SPOT_LIGHT_POS_RANGE_OFFSET + UBOForwardLights.MAX_SPOT_LIGHTS * 4;
    public static SPOT_LIGHT_COLOR_OFFSET: number = UBOForwardLights.SPOT_LIGHT_DIR_OFFSET + UBOForwardLights.MAX_SPOT_LIGHTS * 4;
    public static COUNT: number = UBOForwardLights.SPOT_LIGHT_COLOR_OFFSET + UBOForwardLights.MAX_SPOT_LIGHTS * 4;
    public static SIZE: number = UBOForwardLights.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: 22, name: 'CCForwardLights', members: [
            { name: 'cc_dirLightDirection', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_DIR_LIGHTS },
            { name: 'cc_dirLightColor', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_DIR_LIGHTS },
            { name: 'cc_pointLightPositionAndRange', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_POINT_LIGHTS },
            { name: 'cc_pointLightColor', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_POINT_LIGHTS },
            { name: 'cc_spotLightPositionAndRange', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPOT_LIGHTS },
            { name: 'cc_spotLightDirection', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPOT_LIGHTS },
            { name: 'cc_spotLightColor', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPOT_LIGHTS },
        ],
    };

    public view: Float32Array = new Float32Array(UBOForwardLights.COUNT);
}

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
    binding: UniformBinding.JOINTS_TEXTURE, name: 'cc_jointsTexture', type: GFXType.SAMPLER2D, count: 1,
};
export interface IGlobalBindingDesc {
    type: GFXObjectType;
    blockInfo?: GFXUniformBlock;
    uniformBuffer?: GFXBuffer;
    samplerInfo?: GFXUniformSampler;
    sampler?: GFXSampler;
    textureView?: GFXTextureView;
}
