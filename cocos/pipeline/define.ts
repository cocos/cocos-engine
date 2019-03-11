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

export const localBindingsDesc: Map<string, IInternalBindingDesc> = new Map<string, IInternalBindingDesc>();

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

export class UBOForwardLight {
    public static MAX_SPHERE_LIGHTS = 4;
    public static MAX_SPOT_LIGHTS = 4;

    public static SPHERE_LIGHT_POS_OFFSET: number = 0;
    public static SPHERE_LIGHT_SIZE_RANGE_OFFSET: number = UBOForwardLight.SPHERE_LIGHT_POS_OFFSET + UBOForwardLight.MAX_SPHERE_LIGHTS * 4;
    public static SPHERE_LIGHT_COLOR_OFFSET: number = UBOForwardLight.SPHERE_LIGHT_SIZE_RANGE_OFFSET + UBOForwardLight.MAX_SPHERE_LIGHTS * 4;
    public static SPOT_LIGHT_POS_SIZE_OFFSET: number = UBOForwardLight.SPHERE_LIGHT_COLOR_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
    public static SPOT_LIGHT_DIR_RANGE_OFFSET: number = UBOForwardLight.SPOT_LIGHT_POS_SIZE_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
    public static SPOT_LIGHT_COLOR_OFFSET: number = UBOForwardLight.SPOT_LIGHT_DIR_RANGE_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
    public static COUNT: number = UBOForwardLight.SPOT_LIGHT_COLOR_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
    public static SIZE: number = UBOForwardLight.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: UniformBinding.UBO_FORWARD_LIGHTS, name: 'CCForwardLight', members: [
            { name: 'cc_sphereLitPos', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPHERE_LIGHTS },
            { name: 'cc_sphereLitSizeRange', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPHERE_LIGHTS },
            { name: 'cc_sphereLitColor', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPHERE_LIGHTS },
            { name: 'cc_spotLitPosSize', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
            { name: 'cc_spotLitDirRange', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
            { name: 'cc_spotLitColor', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
        ],
    };

    public view: Float32Array = new Float32Array(UBOForwardLight.COUNT);
}
localBindingsDesc.set(UBOForwardLight.BLOCK.name, {
    type: GFXBindingType.UNIFORM_BUFFER,
    blockInfo: UBOForwardLight.BLOCK,
});

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
localBindingsDesc.set(UBOSkinning.BLOCK.name, {
    type: GFXBindingType.UNIFORM_BUFFER,
    blockInfo: UBOSkinning.BLOCK,
});

export const UNIFORM_JOINTS_TEXTURE: GFXUniformSampler = {
    binding: UniformBinding.SAMPLER_JOINTS, name: 'cc_jointsTexture', type: GFXType.SAMPLER2D, count: 1,
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

// Color temperature (in Kelvin) to RGB script.
// Valid from 1000 to 40000 K (and additionally 0 for pure full white)
export function ColorTemperatureToRGB (kelvin: number): IGFXColor {
    const temp = kelvin / 100.0;
    let r: number;
    let g: number;
    let b: number;
    if (temp <= 66.0) {
        r = 1.0;
        g = 0.390081579 * Math.log(temp) - 0.631841444;
        if (temp <= 19.0) {
            b = 0.0;
        } else {
            b = 0.543206789 * Math.log(temp - 10.0) - 1.19625409;
        }
    } else {
        r = 1.29293619 * Math.pow(temp - 60.0, -0.1332047592);
        g = 11.3259693 * Math.pow(temp - 60.0, -0.0755148492);
        b = 1.0;
    }

    return  { r, g, b, a: 1.0 };
}
