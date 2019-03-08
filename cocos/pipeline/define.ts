import { GFXBuffer } from '../gfx/buffer';
import { GFXBindingType, GFXType, IGFXColor } from '../gfx/define';
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
    UBO_SHADOW = MAX_BINDING_SUPPORTED - 2,

    UBO_LOCAL = MAX_BINDING_SUPPORTED - 3,
    UBO_FORWARD_LIGHTS = MAX_BINDING_SUPPORTED - 4,
    UBO_SKINNING = MAX_BINDING_SUPPORTED - 5,
    UBO_UI = MAX_BINDING_SUPPORTED - 6,
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
        binding: UniformBinding.UBO_GLOBAL, name: 'CCG_Common', members: [
            { name: 'ccg_time', type: GFXType.FLOAT4, count: 1 },
            { name: 'ccg_screenSize', type: GFXType.FLOAT4, count: 1 },
            { name: 'ccg_screenScale', type: GFXType.FLOAT4, count: 1 },
            { name: 'ccg_matView', type: GFXType.MAT4, count: 1 },
            { name: 'ccg_matViewInv', type: GFXType.MAT4, count: 1 },
            { name: 'ccg_matProj', type: GFXType.MAT4, count: 1 },
            { name: 'ccg_matProjInv', type: GFXType.MAT4, count: 1 },
            { name: 'ccg_matViewProj', type: GFXType.MAT4, count: 1 },
            { name: 'ccg_matViewProjInv', type: GFXType.MAT4, count: 1 },
            { name: 'ccg_cameraPos', type: GFXType.FLOAT4, count: 1 },
            { name: 'ccg_exposure', type: GFXType.FLOAT4, count: 1 },
            { name: 'ccg_mainLitDir', type: GFXType.FLOAT4, count: 1 },
            { name: 'ccg_mainLitColor', type: GFXType.FLOAT4, count: 1 },
            { name: 'ccg_ambientSky', type: GFXType.FLOAT4, count: 1 },
            { name: 'ccg_ambientGround', type: GFXType.FLOAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOGlobal.COUNT);
}

export class UBOShadow {
    public static MAT_LIGHT_PLANE_PROJ_OFFSET: number = 0;
    public static SHADOW_COLOR_OFFSET: number = UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET + 16;
    public static COUNT: number = UBOShadow.SHADOW_COLOR_OFFSET + 4;
    public static SIZE: number = UBOShadow.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_SHADOW, name: 'CCG_Shadow', members: [
            { name: 'ccg_matLightPlaneProj', type: GFXType.MAT4, count: 1 },
            { name: 'ccg_shadowColor', type: GFXType.FLOAT4, count: 1 },
        ],
    };
}

export const localBindingsDesc: Map<string, IInternalBindingDesc> = new Map<string, IInternalBindingDesc>();

export class UBOLocal {
    public static MAT_WORLD_OFFSET: number = 0;
    public static MAT_WORLD_IT_OFFSET: number = UBOLocal.MAT_WORLD_OFFSET + 16;
    public static COUNT: number = UBOLocal.MAT_WORLD_IT_OFFSET + 16;
    public static SIZE: number = UBOLocal.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_LOCAL, name: 'CCL_Common', members: [
            { name: 'ccl_matWorld', type: GFXType.MAT4, count: 1 },
            { name: 'ccl_matWorldIT', type: GFXType.MAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOLocal.COUNT);
}
localBindingsDesc.set(UBOLocal.BLOCK.name, {
    type: GFXBindingType.UNIFORM_BUFFER,
    blockInfo: UBOLocal.BLOCK,
});

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
        binding: UniformBinding.UBO_FORWARD_LIGHTS, name: 'CCL_ForwardLights', members: [
            { name: 'ccl_sphereLitPos', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPHERE_LIGHTS },
            { name: 'ccl_sphereLitSizeRange', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPHERE_LIGHTS },
            { name: 'ccl_sphereLitColor', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPHERE_LIGHTS },
            { name: 'ccl_spotLitPosSize', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPOT_LIGHTS },
            { name: 'ccl_spotLitDirRange', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPOT_LIGHTS },
            { name: 'ccl_spotLitColor', type: GFXType.FLOAT4, count: UBOForwardLights.MAX_SPOT_LIGHTS },
        ],
    };

    public view: Float32Array = new Float32Array(UBOForwardLights.COUNT);
}
localBindingsDesc.set(UBOForwardLights.BLOCK.name, {
    type: GFXBindingType.UNIFORM_BUFFER,
    blockInfo: UBOForwardLights.BLOCK,
});

export class UBOSkinning {
    public static MAT_JOINT_OFFSET: number = 0;
    public static JOINTS_TEXTURE_SIZE_OFFSET: number = UBOSkinning.MAT_JOINT_OFFSET + 128 * 16;
    public static COUNT: number = UBOSkinning.JOINTS_TEXTURE_SIZE_OFFSET + 4;
    public static SIZE: number = UBOSkinning.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_SKINNING, name: 'CCL_Skinning', members: [
            { name: 'ccl_matJoint', type: GFXType.MAT4, count: 128 },
            { name: 'ccl_jointsTextureSize', type: GFXType.FLOAT4, count: 1 },
        ],
    };
}
localBindingsDesc.set(UBOSkinning.BLOCK.name, {
    type: GFXBindingType.UNIFORM_BUFFER,
    blockInfo: UBOSkinning.BLOCK,
});

export const UNIFORM_JOINTS_TEXTURE: GFXUniformSampler = {
    binding: UniformBinding.SAMPLER_JOINTS, name: 'ccl_jointsTexture', type: GFXType.SAMPLER2D, count: 1,
};
localBindingsDesc.set(UNIFORM_JOINTS_TEXTURE.name, {
    type: GFXBindingType.SAMPLER,
    samplerInfo: UNIFORM_JOINTS_TEXTURE,
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

export function SRGBToLinear (gamma: IGFXColor): IGFXColor {
    const r = Math.pow(gamma.r, 2.2);
    const g = Math.pow(gamma.g, 2.2);
    const b = Math.pow(gamma.b, 2.2);
    return { r, g, b, a: 1.0 };
}

export function LinearToSRGB (linear: IGFXColor): IGFXColor {
    const r = Math.pow(linear.r, 0.454545);
    const g = Math.pow(linear.g, 0.454545);
    const b = Math.pow(linear.b, 0.454545);
    return { r, g, b, a: 1.0 };
}
