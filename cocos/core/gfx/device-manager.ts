/* eslint-disable max-len */
/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 */

import { JSB } from 'internal:constants';
import { legacyCC } from '../global-exports';
import { error, getError } from '../platform/debug';
import { sys } from '../platform/sys';
import { BindingMappingInfo, DeviceInfo, SwapchainInfo } from '.';
import { Device } from './base/device';
import { Swapchain } from './base/swapchain';
import { BrowserType } from '../../../pal/system-info/enum-type';
import { screen } from '../platform/screen';
import { Settings, settings } from '../settings';

/**
 * @en
 * Sets the renderer type, only useful on web
 *
 * @zh
 * 渲染模式。
 * 设置渲染器类型，仅适用于 web 端
 * @internal
 */
export enum LegacyRenderMode {
    /**
     * @en
     * Automatically chosen by engine.
     * @zh
     * 通过引擎自动选择。
     */
    AUTO = 0,
    /**
     * @en
     * Forced to use canvas renderer.
     * @zh
     * 强制使用 canvas 渲染。
     */
    CANVAS = 1,
    /**
     * @en
     * Forced to use WebGL renderer, but this will be ignored on mobile browsers.
     * @zh
     * 强制使用 WebGL 渲染，但是在部分 Android 浏览器中这个选项会被忽略。
     */
    WEBGL = 2,
    /**
     * @en
     * Use Headless Renderer, which is useful in test or server env, only for internal use by cocos team for now
     * @zh
     * 使用空渲染器，可以用于测试和服务器端环境，目前暂时用于 Cocos 内部测试使用。
     */
    HEADLESS = 3
}

/**
 * @internal
 */
export enum RenderType {
    UNKNOWN = -1,
    CANVAS = 0,
    WEBGL = 1,
    OPENGL = 2,
    HEADLESS = 3,
}

/**
 * @internal
 */

const testFrag = `
#version 450
#define CC_DEVICE_SUPPORT_FLOAT_TEXTURE 1
#define CC_ENABLE_CLUSTERED_LIGHT_CULLING 0
#define CC_DEVICE_MAX_VERTEX_UNIFORM_VECTORS 256
#define CC_DEVICE_MAX_FRAGMENT_UNIFORM_VECTORS 256
#define CC_DEVICE_CAN_BENEFIT_FROM_INPUT_ATTACHMENT 0
#define CC_PLATFORM_ANDROID_AND_WEBGL 0
#define CC_ENABLE_WEBGL_HIGHP_STRUCT_VALUES 0
#define CC_JOINT_UNIFORM_CAPACITY 72
#define CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS 175
#define CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS 107
#define USE_INSTANCING 0
#define USE_BATCHING 0
#define CC_USE_SKINNING 0
#define CC_USE_BAKED_ANIMATION 0
#define CC_USE_LIGHTMAP 0
#define CC_RECEIVE_SHADOW 1
#define CC_USE_MORPH 0
#define CC_MORPH_TARGET_COUNT 2
#define CC_MORPH_TARGET_HAS_POSITION 0
#define CC_MORPH_TARGET_HAS_NORMAL 0
#define CC_MORPH_TARGET_HAS_TANGENT 0
#define CC_MORPH_PRECOMPUTED 0
#define CC_USE_REAL_TIME_JOINT_TEXTURE 0
#define CC_USE_FOG 0
#define CC_USE_ACCURATE_FOG 0
#define CC_SUPPORT_CASCADED_SHADOW_MAP 1
#define USE_VERTEX_COLOR 0
#define HAS_SECOND_UV 0
#define USE_NORMAL_MAP 0
#define CC_FORWARD_ADD 0
#define USE_TWOSIDE 0
#define SAMPLE_FROM_RT 0
#define CC_USE_DEBUG_VIEW 0
#define CC_SHADOWMAP_FORMAT 0
#define CC_SHADOWMAP_USE_LINEAR_DEPTH 0
#define CC_USE_IBL 0
#define CC_USE_DIFFUSEMAP 0
#define USE_REFLECTION_DENOISE 0
#define CC_IBL_CONVOLUTED 0
#define CC_USE_HDR 1
#define USE_ALBEDO_MAP 0
#define ALBEDO_UV v_uv
#define NORMAL_UV v_uv
#define PBR_UV v_uv
#define USE_PBR_MAP 0
#define USE_METALLIC_ROUGHNESS_MAP 0
#define USE_OCCLUSION_MAP 0
#define USE_EMISSIVE_MAP 0
#define EMISSIVE_UV v_uv
#define USE_ALPHA_TEST 0
#define ALPHA_TEST_CHANNEL a
#define CC_PIPELINE_TYPE 0
#define CC_FORCE_FORWARD_SHADING 0

precision highp float;
layout(set = 0, binding = 0) uniform CCGlobal {
  highp   vec4 cc_time;
  mediump vec4 cc_screenSize;
  mediump vec4 cc_nativeSize;
  mediump vec4 cc_debug_view_mode;
  mediump vec4 cc_debug_view_composite_pack_1;
  mediump vec4 cc_debug_view_composite_pack_2;
  mediump vec4 cc_debug_view_composite_pack_3;
};
layout(set = 0, binding = 1) uniform CCCamera {
  highp   mat4 cc_matView;
  highp   mat4 cc_matViewInv;
  highp   mat4 cc_matProj;
  highp   mat4 cc_matProjInv;
  highp   mat4 cc_matViewProj;
  highp   mat4 cc_matViewProjInv;
  highp   vec4 cc_cameraPos;
  mediump vec4 cc_surfaceTransform;
  mediump vec4 cc_screenScale;
  mediump vec4 cc_exposure;
  mediump vec4 cc_mainLitDir;
  mediump vec4 cc_mainLitColor;
  mediump vec4 cc_ambientSky;
  mediump vec4 cc_ambientGround;
  mediump vec4 cc_fogColor;
  mediump vec4 cc_fogBase;
  mediump vec4 cc_fogAdd;
  mediump vec4 cc_nearFar;
  mediump vec4 cc_viewPort;
};
layout(set = 1, binding = 0) uniform Constants {
  vec4 tilingOffset;
  vec4 albedo;
  vec4 albedoScaleAndCutoff;
  vec4 pbrParams;
  vec4 emissive;
  vec4 emissiveScaleParam;
};
#if CC_USE_FOG != 4
  float LinearFog(vec4 pos, vec3 cameraPos, float fogStart, float fogEnd) {
      vec4 wPos = pos;
      float cam_dis = distance(cameraPos, wPos.xyz);
      return clamp((fogEnd - cam_dis) / (fogEnd - fogStart), 0., 1.);
  }
  float ExpFog(vec4 pos, vec3 cameraPos, float fogStart, float fogDensity, float fogAtten) {
      vec4 wPos = pos;
      float cam_dis = max(distance(cameraPos, wPos.xyz) - fogStart, 0.0) / fogAtten * 4.;
      float f = exp(-cam_dis * fogDensity);
      return f;
  }
  float ExpSquaredFog(vec4 pos, vec3 cameraPos, float fogStart, float fogDensity, float fogAtten) {
      vec4 wPos = pos;
      float cam_dis = max(distance(cameraPos, wPos.xyz) - fogStart, 0.0) / fogAtten * 4.;
      float f = exp(-cam_dis * cam_dis * fogDensity * fogDensity);
      return f;
  }
  float LayeredFog(vec4 pos, vec3 cameraPos, float fogTop, float fogRange, float fogAtten) {
      vec4 wPos = pos;
      vec3 camWorldProj = cameraPos.xyz;
      camWorldProj.y = 0.;
      vec3 worldPosProj = wPos.xyz;
      worldPosProj.y = 0.;
      float fDeltaD = distance(worldPosProj, camWorldProj) / fogAtten * 2.0;
      float fDeltaY, fDensityIntegral;
      if (cameraPos.y > fogTop) {
          if (wPos.y < fogTop) {
              fDeltaY = (fogTop - wPos.y) / fogRange * 2.0;
              fDensityIntegral = fDeltaY * fDeltaY * 0.5;
          }
          else {
              fDeltaY = 0.;
              fDensityIntegral = 0.;
          }
      }
      else {
          if (wPos.y < fogTop) {
              float fDeltaA = (fogTop - cameraPos.y) / fogRange * 2.;
              float fDeltaB = (fogTop - wPos.y) / fogRange * 2.;
              fDeltaY = abs(fDeltaA - fDeltaB);
              fDensityIntegral = abs((fDeltaA * fDeltaA * 0.5) - (fDeltaB * fDeltaB * 0.5));
          }
          else {
              fDeltaY = abs(fogTop - cameraPos.y) / fogRange * 2.;
              fDensityIntegral = abs(fDeltaY * fDeltaY * 0.5);
          }
      }
      float fDensity;
      if (fDeltaY != 0.) {
          fDensity = (sqrt(1.0 + ((fDeltaD / fDeltaY) * (fDeltaD / fDeltaY)))) * fDensityIntegral;
      }
      else {
          fDensity = 0.;
      }
      float f = exp(-fDensity);
      return f;
  }
#endif
void CC_TRANSFER_FOG_BASE(vec4 pos, out float factor)
{
#if CC_USE_FOG == 0
	factor = LinearFog(pos, cc_cameraPos.xyz, cc_fogBase.x, cc_fogBase.y);
#elif CC_USE_FOG == 1
	factor = ExpFog(pos, cc_cameraPos.xyz, cc_fogBase.x, cc_fogBase.z, cc_fogAdd.z);
#elif CC_USE_FOG == 2
	factor = ExpSquaredFog(pos, cc_cameraPos.xyz, cc_fogBase.x, cc_fogBase.z, cc_fogAdd.z);
#elif CC_USE_FOG == 3
	factor = LayeredFog(pos, cc_cameraPos.xyz, cc_fogAdd.x, cc_fogAdd.y, cc_fogAdd.z);
#else
	factor = 1.0;
#endif
}
void CC_APPLY_FOG_BASE(inout vec4 color, float factor) {
	color = vec4(mix(cc_fogColor.rgb, color.rgb, factor), color.a);
}
#if !CC_USE_ACCURATE_FOG
layout(location = 0) in float v_fog_factor;
#endif
void CC_APPLY_FOG(inout vec4 color) {
#if !CC_USE_ACCURATE_FOG
    CC_APPLY_FOG_BASE(color, v_fog_factor);
#endif
}
void CC_APPLY_FOG(inout vec4 color, vec3 worldPos) {
#if CC_USE_ACCURATE_FOG
    float factor;
    CC_TRANSFER_FOG_BASE(vec4(worldPos, 1.0), factor);
#else
    float factor = v_fog_factor;
#endif
    CC_APPLY_FOG_BASE(color, factor);
}
#define QUATER_PI         0.78539816340
#define HALF_PI           1.57079632679
#define PI                3.14159265359
#define PI2               6.28318530718
#define PI4               12.5663706144
#define INV_QUATER_PI     1.27323954474
#define INV_HALF_PI       0.63661977237
#define INV_PI            0.31830988618
#define INV_PI2           0.15915494309
#define INV_PI4           0.07957747155
#define EPSILON           1e-6
#define EPSILON_LOWP      1e-4
#define LOG2              1.442695
#define EXP_VALUE         2.71828183f
#define FP_MAX            65504.0
#define FP_SCALE          0.0009765625
#define FP_SCALE_INV      1024.0
#define GRAY_VECTOR       vec3(0.299, 0.587, 0.114)
#define CC_SURFACES_DEBUG_VIEW_VERTEX_COLOR 1
#define CC_SURFACES_DEBUG_VIEW_VERTEX_NORMAL CC_SURFACES_DEBUG_VIEW_VERTEX_COLOR + 1
#define CC_SURFACES_DEBUG_VIEW_VERTEX_TANGENT CC_SURFACES_DEBUG_VIEW_VERTEX_NORMAL + 1
#define CC_SURFACES_DEBUG_VIEW_WORLD_POS CC_SURFACES_DEBUG_VIEW_VERTEX_TANGENT + 1
#define CC_SURFACES_DEBUG_VIEW_VERTEX_MIRROR CC_SURFACES_DEBUG_VIEW_WORLD_POS + 1
#define CC_SURFACES_DEBUG_VIEW_FACE_SIDE CC_SURFACES_DEBUG_VIEW_VERTEX_MIRROR + 1
#define CC_SURFACES_DEBUG_VIEW_UV0 CC_SURFACES_DEBUG_VIEW_FACE_SIDE + 1
#define CC_SURFACES_DEBUG_VIEW_UV1 CC_SURFACES_DEBUG_VIEW_UV0 + 1
#define CC_SURFACES_DEBUG_VIEW_UVLIGHTMAP CC_SURFACES_DEBUG_VIEW_UV1 + 1
#define CC_SURFACES_DEBUG_VIEW_PROJ_DEPTH CC_SURFACES_DEBUG_VIEW_UVLIGHTMAP + 1
#define CC_SURFACES_DEBUG_VIEW_LINEAR_DEPTH CC_SURFACES_DEBUG_VIEW_PROJ_DEPTH + 1
#define CC_SURFACES_DEBUG_VIEW_FRAGMENT_NORMAL CC_SURFACES_DEBUG_VIEW_LINEAR_DEPTH + 1
#define CC_SURFACES_DEBUG_VIEW_FRAGMENT_TANGENT CC_SURFACES_DEBUG_VIEW_FRAGMENT_NORMAL + 1
#define CC_SURFACES_DEBUG_VIEW_FRAGMENT_BINORMAL CC_SURFACES_DEBUG_VIEW_FRAGMENT_TANGENT + 1
#define CC_SURFACES_DEBUG_VIEW_BASE_COLOR CC_SURFACES_DEBUG_VIEW_FRAGMENT_BINORMAL + 1
#define CC_SURFACES_DEBUG_VIEW_DIFFUSE_COLOR CC_SURFACES_DEBUG_VIEW_BASE_COLOR + 1
#define CC_SURFACES_DEBUG_VIEW_SPECULAR_COLOR CC_SURFACES_DEBUG_VIEW_DIFFUSE_COLOR + 1
#define CC_SURFACES_DEBUG_VIEW_TRANSPARENCY CC_SURFACES_DEBUG_VIEW_SPECULAR_COLOR + 1
#define CC_SURFACES_DEBUG_VIEW_METALLIC CC_SURFACES_DEBUG_VIEW_TRANSPARENCY + 1
#define CC_SURFACES_DEBUG_VIEW_ROUGHNESS CC_SURFACES_DEBUG_VIEW_METALLIC + 1
#define CC_SURFACES_DEBUG_VIEW_SPECULAR_INTENSITY CC_SURFACES_DEBUG_VIEW_ROUGHNESS + 1
#define CC_SURFACES_DEBUG_VIEW_DIRECT_DIFFUSE CC_SURFACES_DEBUG_VIEW_SPECULAR_INTENSITY + 1
#define CC_SURFACES_DEBUG_VIEW_DIRECT_SPECULAR CC_SURFACES_DEBUG_VIEW_DIRECT_DIFFUSE + 1
#define CC_SURFACES_DEBUG_VIEW_DIRECT_ALL CC_SURFACES_DEBUG_VIEW_DIRECT_SPECULAR + 1
#define CC_SURFACES_DEBUG_VIEW_ENV_DIFFUSE CC_SURFACES_DEBUG_VIEW_DIRECT_ALL + 1
#define CC_SURFACES_DEBUG_VIEW_ENV_SPECULAR CC_SURFACES_DEBUG_VIEW_ENV_DIFFUSE + 1
#define CC_SURFACES_DEBUG_VIEW_ENV_ALL CC_SURFACES_DEBUG_VIEW_ENV_SPECULAR + 1
#define CC_SURFACES_DEBUG_VIEW_EMISSIVE CC_SURFACES_DEBUG_VIEW_ENV_ALL + 1
#define CC_SURFACES_DEBUG_VIEW_LIGHT_MAP CC_SURFACES_DEBUG_VIEW_EMISSIVE + 1
#define CC_SURFACES_DEBUG_VIEW_SHADOW CC_SURFACES_DEBUG_VIEW_LIGHT_MAP + 1
#define CC_SURFACES_DEBUG_VIEW_AO CC_SURFACES_DEBUG_VIEW_SHADOW + 1
#define CC_SURFACES_DEBUG_VIEW_FOG CC_SURFACES_DEBUG_VIEW_AO + 1
#define CC_SURFACES_DEBUG_VIEW_SINGLE 1
#define CC_SURFACES_DEBUG_VIEW_COMPOSITE_AND_MISC 2
#define IS_DEBUG_VIEW_LIGHTING_ENABLE_WITH_ALBEDO (cc_debug_view_mode.y > 0.0)
#define IS_DEBUG_VIEW_MISC_ENABLE_CSM_LAYER_COLORATION (cc_debug_view_mode.z > 0.0)
#define IS_DEBUG_VIEW_COMPOSITE_ENABLE_DIRECT_DIFFUSE (cc_debug_view_composite_pack_1.x > 0.0)
#define IS_DEBUG_VIEW_COMPOSITE_ENABLE_DIRECT_SPECULAR (cc_debug_view_composite_pack_1.y > 0.0)
#define IS_DEBUG_VIEW_COMPOSITE_ENABLE_ENV_DIFFUSE (cc_debug_view_composite_pack_1.z > 0.0)
#define IS_DEBUG_VIEW_COMPOSITE_ENABLE_ENV_SPECULAR (cc_debug_view_composite_pack_1.w > 0.0)
#define IS_DEBUG_VIEW_COMPOSITE_ENABLE_EMISSIVE (cc_debug_view_composite_pack_2.x > 0.0)
#define IS_DEBUG_VIEW_COMPOSITE_ENABLE_LIGHT_MAP (cc_debug_view_composite_pack_2.y > 0.0)
#define IS_DEBUG_VIEW_COMPOSITE_ENABLE_SHADOW (cc_debug_view_composite_pack_2.z > 0.0)
#define IS_DEBUG_VIEW_COMPOSITE_ENABLE_AO (cc_debug_view_composite_pack_2.w > 0.0)
#define IS_DEBUG_VIEW_COMPOSITE_ENABLE_NORMAL_MAP (cc_debug_view_composite_pack_3.x > 0.0)
#define IS_DEBUG_VIEW_COMPOSITE_ENABLE_FOG (cc_debug_view_composite_pack_3.y > 0.0)
#define IS_DEBUG_VIEW_COMPOSITE_ENABLE_TONE_MAPPING (cc_debug_view_composite_pack_3.z > 0.0)
#define IS_DEBUG_VIEW_COMPOSITE_ENABLE_GAMMA_CORRECTION (cc_debug_view_composite_pack_3.w > 0.0)
vec3 SRGBToLinear (vec3 gamma) {
#ifdef CC_USE_SURFACE_SHADER
  #if CC_USE_DEBUG_VIEW == CC_SURFACES_DEBUG_VIEW_COMPOSITE_AND_MISC
    if (!IS_DEBUG_VIEW_COMPOSITE_ENABLE_GAMMA_CORRECTION) {
      return gamma;
    }
  #endif
#endif
  return gamma * gamma;
}
vec3 LinearToSRGB(vec3 linear) {
#ifdef CC_USE_SURFACE_SHADER
  #if CC_USE_DEBUG_VIEW == CC_SURFACES_DEBUG_VIEW_COMPOSITE_AND_MISC
    if (!IS_DEBUG_VIEW_COMPOSITE_ENABLE_GAMMA_CORRECTION) {
      return linear;
    }
  #endif
#endif
  return sqrt(linear);
}
layout(set = 0, binding = 2) uniform CCShadow {
  highp mat4 cc_matLightView;
  highp mat4 cc_matLightViewProj;
  highp vec4 cc_shadowInvProjDepthInfo;
  highp vec4 cc_shadowProjDepthInfo;
  highp vec4 cc_shadowProjInfo;
  mediump vec4 cc_shadowNFLSInfo;
  mediump vec4 cc_shadowWHPBInfo;
  mediump vec4 cc_shadowLPNNInfo;
  lowp vec4 cc_shadowColor;
  mediump vec4 cc_planarNDInfo;
};
#if CC_SUPPORT_CASCADED_SHADOW_MAP
  layout(set = 0, binding = 3) uniform CCCSM {
    highp vec4 cc_csmViewDir0[4];
    highp vec4 cc_csmViewDir1[4];
    highp vec4 cc_csmViewDir2[4];
    highp vec4 cc_csmAtlas[4];
    highp mat4 cc_matCSMViewProj[4];
    highp vec4 cc_csmProjDepthInfo[4];
    highp vec4 cc_csmProjInfo[4];
    highp vec4 cc_csmSplitsInfo;
  };
#endif
float GetLinearDepthFromViewSpace(vec3 viewPos, float near, float far) {
  float dist = length(viewPos);
  return (dist - near) / (far - near);
}
float CCGetLinearDepth(vec3 worldPos, float viewSpaceBias) {
	vec4 viewPos = cc_matLightView * vec4(worldPos.xyz, 1.0);
  viewPos.z += viewSpaceBias;
	return GetLinearDepthFromViewSpace(viewPos.xyz, cc_shadowNFLSInfo.x, cc_shadowNFLSInfo.y);
}
float CCGetLinearDepth(vec3 worldPos) {
	return CCGetLinearDepth(worldPos, 0.0);
}
#if CC_RECEIVE_SHADOW
  layout(set = 0, binding = 4) uniform highp texture2D cc_shadowMap;
  layout(set = 0, binding = 20) uniform highp sampler cc_shadowMapSampler;
  layout(set = 0, binding = 6) uniform highp texture2D cc_spotShadowMap;
  layout(set = 0, binding = 22) uniform highp sampler cc_spotShadowMapSampler;
    highp float unpackHighpData (float mainPart, float modPart) {
      highp float data = mainPart;
      return data + modPart;
    }
    void packHighpData (out float mainPart, out float modPart, highp float data) {
      mainPart = fract(data);
      modPart = data - mainPart;
    }
    highp float unpackHighpData (float mainPart, float modPart, const float modValue) {
      highp float data = mainPart * modValue;
      return data + modPart * modValue;
    }
    void packHighpData (out float mainPart, out float modPart, highp float data, const float modValue) {
      highp float divide = data / modValue;
      mainPart = floor(divide);
      modPart = (data - mainPart * modValue) / modValue;
    }
    highp vec2 unpackHighpData (vec2 mainPart, vec2 modPart) {
      highp vec2 data = mainPart;
      return data + modPart;
    }
    void packHighpData (out vec2 mainPart, out vec2 modPart, highp vec2 data) {
      mainPart = fract(data);
      modPart = data - mainPart;
    }
    highp vec2 unpackHighpData (vec2 mainPart, vec2 modPart, const float modValue) {
      highp vec2 data = mainPart * modValue;
      return data + modPart * modValue;
    }
    void packHighpData (out vec2 mainPart, out vec2 modPart, highp vec2 data, const float modValue) {
      highp vec2 divide = data / modValue;
      mainPart = floor(divide);
      modPart = (data - mainPart * modValue) / modValue;
    }
    highp vec3 unpackHighpData (vec3 mainPart, vec3 modPart) {
      highp vec3 data = mainPart;
      return data + modPart;
    }
    void packHighpData (out vec3 mainPart, out vec3 modPart, highp vec3 data) {
      mainPart = fract(data);
      modPart = data - mainPart;
    }
    highp vec3 unpackHighpData (vec3 mainPart, vec3 modPart, const float modValue) {
      highp vec3 data = mainPart * modValue;
      return data + modPart * modValue;
    }
    void packHighpData (out vec3 mainPart, out vec3 modPart, highp vec3 data, const float modValue) {
      highp vec3 divide = data / modValue;
      mainPart = floor(divide);
      modPart = (data - mainPart * modValue) / modValue;
    }
    highp vec4 unpackHighpData (vec4 mainPart, vec4 modPart) {
      highp vec4 data = mainPart;
      return data + modPart;
    }
    void packHighpData (out vec4 mainPart, out vec4 modPart, highp vec4 data) {
      mainPart = fract(data);
      modPart = data - mainPart;
    }
    highp vec4 unpackHighpData (vec4 mainPart, vec4 modPart, const float modValue) {
      highp vec4 data = mainPart * modValue;
      return data + modPart * modValue;
    }
    void packHighpData (out vec4 mainPart, out vec4 modPart, highp vec4 data, const float modValue) {
      highp vec4 divide = data / modValue;
      mainPart = floor(divide);
      modPart = (data - mainPart * modValue) / modValue;
    }
  float NativePCFShadowFactorHard (vec3 shadowNDCPos, sampler2D shadowMap, vec2 shadowMapResolution)
  {
    #if CC_SHADOWMAP_FORMAT == 1
      return step(shadowNDCPos.z, dot(texture(shadowMap, shadowNDCPos.xy), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
    #else
      return step(shadowNDCPos.z, texture(shadowMap, shadowNDCPos.xy).x);
    #endif
  }
  float NativePCFShadowFactorSoft (vec3 shadowNDCPos, sampler2D shadowMap, vec2 shadowMapResolution)
  {
    vec2 oneTap = 1.0 / shadowMapResolution;
    vec2 shadowNDCPos_offset = shadowNDCPos.xy + oneTap;
    float block0, block1, block2, block3;
    #if CC_SHADOWMAP_FORMAT == 1
      block0 = step(shadowNDCPos.z, dot(texture(shadowMap, vec2(shadowNDCPos.x, shadowNDCPos.y)), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block1 = step(shadowNDCPos.z, dot(texture(shadowMap, vec2(shadowNDCPos_offset.x, shadowNDCPos.y)), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block2 = step(shadowNDCPos.z, dot(texture(shadowMap, vec2(shadowNDCPos.x, shadowNDCPos_offset.y)), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block3 = step(shadowNDCPos.z, dot(texture(shadowMap, vec2(shadowNDCPos_offset.x, shadowNDCPos_offset.y)), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
    #else
      block0 = step(shadowNDCPos.z, texture(shadowMap, vec2(shadowNDCPos.x, shadowNDCPos.y)).x);
      block1 = step(shadowNDCPos.z, texture(shadowMap, vec2(shadowNDCPos_offset.x, shadowNDCPos.y)).x);
      block2 = step(shadowNDCPos.z, texture(shadowMap, vec2(shadowNDCPos.x, shadowNDCPos_offset.y)).x);
      block3 = step(shadowNDCPos.z, texture(shadowMap, vec2(shadowNDCPos_offset.x, shadowNDCPos_offset.y)).x);
    #endif
    float coefX   = mod(shadowNDCPos.x, oneTap.x) * shadowMapResolution.x;
    float resultX = mix(block0, block1, coefX);
    float resultY = mix(block2, block3, coefX);
    float coefY   = mod(shadowNDCPos.y, oneTap.y) * shadowMapResolution.y;
    return mix(resultX, resultY, coefY);
  }
  float NativePCFShadowFactorSoft3X (vec3 shadowNDCPos, sampler2D shadowMap, vec2 shadowMapResolution)
  {
    vec2 oneTap = 1.0 / shadowMapResolution;
    float shadowNDCPos_offset_L = shadowNDCPos.x - oneTap.x;
    float shadowNDCPos_offset_R = shadowNDCPos.x + oneTap.x;
    float shadowNDCPos_offset_U = shadowNDCPos.y - oneTap.y;
    float shadowNDCPos_offset_D = shadowNDCPos.y + oneTap.y;
    float block0, block1, block2, block3, block4, block5, block6, block7, block8;
    #if CC_SHADOWMAP_FORMAT == 1
      block0 = step(shadowNDCPos.z, dot(texture(shadowMap, vec2(shadowNDCPos_offset_L, shadowNDCPos_offset_U)), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block1 = step(shadowNDCPos.z, dot(texture(shadowMap, vec2(shadowNDCPos.x, shadowNDCPos_offset_U)), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block2 = step(shadowNDCPos.z, dot(texture(shadowMap, vec2(shadowNDCPos_offset_R, shadowNDCPos_offset_U)), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block3 = step(shadowNDCPos.z, dot(texture(shadowMap, vec2(shadowNDCPos_offset_L, shadowNDCPos.y)), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block4 = step(shadowNDCPos.z, dot(texture(shadowMap, vec2(shadowNDCPos.x, shadowNDCPos.y)), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block5 = step(shadowNDCPos.z, dot(texture(shadowMap, vec2(shadowNDCPos_offset_R, shadowNDCPos.y)), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block6 = step(shadowNDCPos.z, dot(texture(shadowMap, vec2(shadowNDCPos_offset_L, shadowNDCPos_offset_D)), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block7 = step(shadowNDCPos.z, dot(texture(shadowMap, vec2(shadowNDCPos.x, shadowNDCPos_offset_D)), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block8 = step(shadowNDCPos.z, dot(texture(shadowMap, vec2(shadowNDCPos_offset_R, shadowNDCPos_offset_D)), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
    #else
      block0 = step(shadowNDCPos.z, texture(shadowMap, vec2(shadowNDCPos_offset_L, shadowNDCPos_offset_U)).x);
      block1 = step(shadowNDCPos.z, texture(shadowMap, vec2(shadowNDCPos.x, shadowNDCPos_offset_U)).x);
      block2 = step(shadowNDCPos.z, texture(shadowMap, vec2(shadowNDCPos_offset_R, shadowNDCPos_offset_U)).x);
      block3 = step(shadowNDCPos.z, texture(shadowMap, vec2(shadowNDCPos_offset_L, shadowNDCPos.y)).x);
      block4 = step(shadowNDCPos.z, texture(shadowMap, vec2(shadowNDCPos.x, shadowNDCPos.y)).x);
      block5 = step(shadowNDCPos.z, texture(shadowMap, vec2(shadowNDCPos_offset_R, shadowNDCPos.y)).x);
      block6 = step(shadowNDCPos.z, texture(shadowMap, vec2(shadowNDCPos_offset_L, shadowNDCPos_offset_D)).x);
      block7 = step(shadowNDCPos.z, texture(shadowMap, vec2(shadowNDCPos.x, shadowNDCPos_offset_D)).x);
      block8 = step(shadowNDCPos.z, texture(shadowMap, vec2(shadowNDCPos_offset_R, shadowNDCPos_offset_D)).x);
    #endif
    float coefX = mod(shadowNDCPos.x, oneTap.x) * shadowMapResolution.x;
    float coefY = mod(shadowNDCPos.y, oneTap.y) * shadowMapResolution.y;
    float shadow = 0.0;
    float resultX = mix(block0, block1, coefX);
    float resultY = mix(block3, block4, coefX);
    shadow += mix(resultX , resultY, coefY);
    resultX = mix(block1, block2, coefX);
    resultY = mix(block4, block5, coefX);
    shadow += mix(resultX , resultY, coefY);
    resultX = mix(block3, block4, coefX);
    resultY = mix(block6, block7, coefX);
    shadow += mix(resultX, resultY, coefY);
    resultX = mix(block4, block5, coefX);
    resultY = mix(block7, block8, coefX);
    shadow += mix(resultX, resultY, coefY);
    return shadow * 0.25;
  }
  float NativePCFShadowFactorSoft5X (vec3 shadowNDCPos, sampler2D shadowMap, vec2 shadowMapResolution)
  {
    vec2 oneTap = 1.0 / shadowMapResolution;
    vec2 twoTap = oneTap * 2.0;
    vec2 offset1 = shadowNDCPos.xy + vec2(-twoTap.x, -twoTap.y);
    vec2 offset2 = shadowNDCPos.xy + vec2(-oneTap.x, -twoTap.y);
    vec2 offset3 = shadowNDCPos.xy + vec2(0.0, -twoTap.y);
    vec2 offset4 = shadowNDCPos.xy + vec2(oneTap.x, -twoTap.y);
    vec2 offset5 = shadowNDCPos.xy + vec2(twoTap.x, -twoTap.y);
    vec2 offset6 = shadowNDCPos.xy + vec2(-twoTap.x, -oneTap.y);
    vec2 offset7 = shadowNDCPos.xy + vec2(-oneTap.x, -oneTap.y);
    vec2 offset8 = shadowNDCPos.xy + vec2(0.0, -oneTap.y);
    vec2 offset9 = shadowNDCPos.xy + vec2(oneTap.x, -oneTap.y);
    vec2 offset10 = shadowNDCPos.xy + vec2(twoTap.x, -oneTap.y);
    vec2 offset11 = shadowNDCPos.xy + vec2(-twoTap.x, 0.0);
    vec2 offset12 = shadowNDCPos.xy + vec2(-oneTap.x, 0.0);
    vec2 offset13 = shadowNDCPos.xy + vec2(0.0, 0.0);
    vec2 offset14 = shadowNDCPos.xy + vec2(oneTap.x, 0.0);
    vec2 offset15 = shadowNDCPos.xy + vec2(twoTap.x, 0.0);
    vec2 offset16 = shadowNDCPos.xy + vec2(-twoTap.x, oneTap.y);
    vec2 offset17 = shadowNDCPos.xy + vec2(-oneTap.x, oneTap.y);
    vec2 offset18 = shadowNDCPos.xy + vec2(0.0, oneTap.y);
    vec2 offset19 = shadowNDCPos.xy + vec2(oneTap.x, oneTap.y);
    vec2 offset20 = shadowNDCPos.xy + vec2(twoTap.x, oneTap.y);
    vec2 offset21 = shadowNDCPos.xy + vec2(-twoTap.x, twoTap.y);
    vec2 offset22 = shadowNDCPos.xy + vec2(-oneTap.x, twoTap.y);
    vec2 offset23 = shadowNDCPos.xy + vec2(0.0, twoTap.y);
    vec2 offset24 = shadowNDCPos.xy + vec2(oneTap.x, twoTap.y);
    vec2 offset25 = shadowNDCPos.xy + vec2(twoTap.x, twoTap.y);
    float block1, block2, block3, block4, block5, block6, block7, block8, block9, block10, block11, block12, block13, block14, block15, block16, block17, block18, block19, block20, block21, block22, block23, block24, block25;
    #if CC_SHADOWMAP_FORMAT == 1
      block1 = step(shadowNDCPos.z, dot(texture(shadowMap, offset1), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block2 = step(shadowNDCPos.z, dot(texture(shadowMap, offset2), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block3 = step(shadowNDCPos.z, dot(texture(shadowMap, offset3), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block4 = step(shadowNDCPos.z, dot(texture(shadowMap, offset4), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block5 = step(shadowNDCPos.z, dot(texture(shadowMap, offset5), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block6 = step(shadowNDCPos.z, dot(texture(shadowMap, offset6), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block7 = step(shadowNDCPos.z, dot(texture(shadowMap, offset7), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block8 = step(shadowNDCPos.z, dot(texture(shadowMap, offset8), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block9 = step(shadowNDCPos.z, dot(texture(shadowMap, offset9), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block10 = step(shadowNDCPos.z, dot(texture(shadowMap, offset10), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block11 = step(shadowNDCPos.z, dot(texture(shadowMap, offset11), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block12 = step(shadowNDCPos.z, dot(texture(shadowMap, offset12), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block13 = step(shadowNDCPos.z, dot(texture(shadowMap, offset13), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block14 = step(shadowNDCPos.z, dot(texture(shadowMap, offset14), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block15 = step(shadowNDCPos.z, dot(texture(shadowMap, offset15), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block16 = step(shadowNDCPos.z, dot(texture(shadowMap, offset16), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block17 = step(shadowNDCPos.z, dot(texture(shadowMap, offset17), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block18 = step(shadowNDCPos.z, dot(texture(shadowMap, offset18), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block19 = step(shadowNDCPos.z, dot(texture(shadowMap, offset19), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block20 = step(shadowNDCPos.z, dot(texture(shadowMap, offset20), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block21 = step(shadowNDCPos.z, dot(texture(shadowMap, offset21), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block22 = step(shadowNDCPos.z, dot(texture(shadowMap, offset22), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block23 = step(shadowNDCPos.z, dot(texture(shadowMap, offset23), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block24 = step(shadowNDCPos.z, dot(texture(shadowMap, offset24), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
      block25 = step(shadowNDCPos.z, dot(texture(shadowMap, offset25), vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0)));
    #else
      block1 = step(shadowNDCPos.z, texture(shadowMap, offset1).x);
      block2 = step(shadowNDCPos.z, texture(shadowMap, offset2).x);
      block3 = step(shadowNDCPos.z, texture(shadowMap, offset3).x);
      block4 = step(shadowNDCPos.z, texture(shadowMap, offset4).x);
      block5 = step(shadowNDCPos.z, texture(shadowMap, offset5).x);
      block6 = step(shadowNDCPos.z, texture(shadowMap, offset6).x);
      block7 = step(shadowNDCPos.z, texture(shadowMap, offset7).x);
      block8 = step(shadowNDCPos.z, texture(shadowMap, offset8).x);
      block9 = step(shadowNDCPos.z, texture(shadowMap, offset9).x);
      block10 = step(shadowNDCPos.z, texture(shadowMap, offset10).x);
      block11 = step(shadowNDCPos.z, texture(shadowMap, offset11).x);
      block12 = step(shadowNDCPos.z, texture(shadowMap, offset12).x);
      block13 = step(shadowNDCPos.z, texture(shadowMap, offset13).x);
      block14 = step(shadowNDCPos.z, texture(shadowMap, offset14).x);
      block15 = step(shadowNDCPos.z, texture(shadowMap, offset15).x);
      block16 = step(shadowNDCPos.z, texture(shadowMap, offset16).x);
      block17 = step(shadowNDCPos.z, texture(shadowMap, offset17).x);
      block18 = step(shadowNDCPos.z, texture(shadowMap, offset18).x);
      block19 = step(shadowNDCPos.z, texture(shadowMap, offset19).x);
      block20 = step(shadowNDCPos.z, texture(shadowMap, offset20).x);
      block21 = step(shadowNDCPos.z, texture(shadowMap, offset21).x);
      block22 = step(shadowNDCPos.z, texture(shadowMap, offset22).x);
      block23 = step(shadowNDCPos.z, texture(shadowMap, offset23).x);
      block24 = step(shadowNDCPos.z, texture(shadowMap, offset24).x);
      block25 = step(shadowNDCPos.z, texture(shadowMap, offset25).x);
    #endif
    vec2 coef = fract(shadowNDCPos.xy * shadowMapResolution);
    vec2 v1X1 = mix(vec2(block1, block6), vec2(block2, block7), coef.xx);
    vec2 v1X2 = mix(vec2(block2, block7), vec2(block3, block8), coef.xx);
    vec2 v1X3 = mix(vec2(block3, block8), vec2(block4, block9), coef.xx);
    vec2 v1X4 = mix(vec2(block4, block9), vec2(block5, block10), coef.xx);
    float v1 = mix(v1X1.x, v1X1.y, coef.y) + mix(v1X2.x, v1X2.y, coef.y) + mix(v1X3.x, v1X3.y, coef.y) + mix(v1X4.x, v1X4.y, coef.y);
    vec2 v2X1 = mix(vec2(block6, block11), vec2(block7, block12), coef.xx);
    vec2 v2X2 = mix(vec2(block7, block12), vec2(block8, block13), coef.xx);
    vec2 v2X3 = mix(vec2(block8, block13), vec2(block9, block14), coef.xx);
    vec2 v2X4 = mix(vec2(block9, block14), vec2(block10, block15), coef.xx);
    float v2 = mix(v2X1.x, v2X1.y, coef.y) + mix(v2X2.x, v2X2.y, coef.y) + mix(v2X3.x, v2X3.y, coef.y) + mix(v2X4.x, v2X4.y, coef.y);
    vec2 v3X1 = mix(vec2(block11, block16), vec2(block12, block17), coef.xx);
    vec2 v3X2 = mix(vec2(block12, block17), vec2(block13, block18), coef.xx);
    vec2 v3X3 = mix(vec2(block13, block18), vec2(block14, block19), coef.xx);
    vec2 v3X4 = mix(vec2(block14, block19), vec2(block15, block20), coef.xx);
    float v3 = mix(v3X1.x, v3X1.y, coef.y) + mix(v3X2.x, v3X2.y, coef.y) + mix(v3X3.x, v3X3.y, coef.y) + mix(v3X4.x, v3X4.y, coef.y);
    vec2 v4X1 = mix(vec2(block16, block21), vec2(block17, block22), coef.xx);
    vec2 v4X2 = mix(vec2(block17, block22), vec2(block18, block23), coef.xx);
    vec2 v4X3 = mix(vec2(block18, block23), vec2(block19, block24), coef.xx);
    vec2 v4X4 = mix(vec2(block19, block24), vec2(block20, block25), coef.xx);
    float v4 = mix(v4X1.x, v4X1.y, coef.y) + mix(v4X2.x, v4X2.y, coef.y) + mix(v4X3.x, v4X3.y, coef.y) + mix(v4X4.x, v4X4.y, coef.y);
    float fAvg = (v1 + v2 + v3 + v4) * 0.0625;
    return fAvg;
  }
  bool GetShadowNDCPos(out vec3 shadowNDCPos, vec4 shadowPosWithDepthBias)
  {
  	shadowNDCPos = shadowPosWithDepthBias.xyz / shadowPosWithDepthBias.w * 0.5 + 0.5;
  	if (shadowNDCPos.x < 0.0 || shadowNDCPos.x > 1.0 ||
  		shadowNDCPos.y < 0.0 || shadowNDCPos.y > 1.0 ||
  		shadowNDCPos.z < 0.0 || shadowNDCPos.z > 1.0) {
  		return false;
  	}
  	shadowNDCPos.xy = cc_cameraPos.w == 1.0 ? vec2(shadowNDCPos.xy.x, 1.0 - shadowNDCPos.xy.y) : shadowNDCPos.xy;
  	return true;
  }
  vec4 ApplyShadowDepthBias_FaceNormal(vec4 shadowPos, vec3 worldNormal, float normalBias, vec3 matViewDir0, vec3 matViewDir1, vec3 matViewDir2, vec2 projScaleXY)
  {
    vec4 newShadowPos = shadowPos;
    if (normalBias > EPSILON_LOWP)
    {
      vec3 viewNormal = vec3(dot(matViewDir0, worldNormal), dot(matViewDir1, worldNormal), dot(matViewDir2, worldNormal));
      if (viewNormal.z < 0.1)
        newShadowPos.xy += viewNormal.xy * projScaleXY * normalBias * clamp(viewNormal.z, 0.001, 0.1);
    }
    return newShadowPos;
  }
  vec4 ApplyShadowDepthBias_FaceNormal(vec4 shadowPos, vec3 worldNormal, float normalBias, mat4 matLightView, vec2 projScaleXY)
  {
  	vec4 newShadowPos = shadowPos;
  	if (normalBias > EPSILON_LOWP)
  	{
  		vec4 viewNormal = matLightView * vec4(worldNormal, 0.0);
  		if (viewNormal.z < 0.1)
  			newShadowPos.xy += viewNormal.xy * projScaleXY * normalBias * clamp(viewNormal.z, 0.001, 0.1);
  	}
  	return newShadowPos;
  }
  vec4 ApplyShadowDepthBias_Perspective(vec4 shadowPos, float viewspaceDepthBias)
  {
  	vec3 viewSpacePos;
  	viewSpacePos.xy = shadowPos.xy * cc_shadowProjInfo.zw;
  	viewSpacePos.z = shadowPos.z * cc_shadowInvProjDepthInfo.x + shadowPos.w * cc_shadowInvProjDepthInfo.y;
  	viewSpacePos.xyz += cc_shadowProjDepthInfo.z * normalize(viewSpacePos.xyz) * viewspaceDepthBias;
  	vec4 clipSpacePos;
  	clipSpacePos.xy = viewSpacePos.xy * cc_shadowProjInfo.xy;
  	clipSpacePos.zw = viewSpacePos.z * cc_shadowProjDepthInfo.xz + vec2(cc_shadowProjDepthInfo.y, 0.0);
  	#if CC_SHADOWMAP_USE_LINEAR_DEPTH
  		clipSpacePos.z = GetLinearDepthFromViewSpace(viewSpacePos.xyz, cc_shadowNFLSInfo.x, cc_shadowNFLSInfo.y);
  		clipSpacePos.z = (clipSpacePos.z * 2.0 - 1.0) * clipSpacePos.w;
  	#endif
  	return clipSpacePos;
  }
  vec4 ApplyShadowDepthBias_Orthographic(vec4 shadowPos, float viewspaceDepthBias, float projScaleZ, float projBiasZ)
  {
  	float coeffA = projScaleZ;
  	float coeffB = projBiasZ;
  	float viewSpacePos_z = (shadowPos.z - coeffB) / coeffA;
  	viewSpacePos_z += viewspaceDepthBias;
  	vec4 result = shadowPos;
  	result.z = viewSpacePos_z * coeffA + coeffB;
  	return result;
  }
  vec4 ApplyShadowDepthBias_PerspectiveLinearDepth(vec4 shadowPos, float viewspaceDepthBias, vec3 worldPos)
  {
    shadowPos.z = CCGetLinearDepth(worldPos, viewspaceDepthBias) * 2.0 - 1.0;
    shadowPos.z *= shadowPos.w;
    return shadowPos;
  }
  float CCGetDirLightShadowFactorHard (vec4 shadowPosWithDepthBias) {
	  vec3 shadowNDCPos;
	  if (!GetShadowNDCPos(shadowNDCPos, shadowPosWithDepthBias)) {
		  return 1.0;
	  }
    return NativePCFShadowFactorHard(shadowNDCPos, cc_shadowMap, cc_shadowWHPBInfo.xy);
  }
  float CCGetDirLightShadowFactorSoft (vec4 shadowPosWithDepthBias) {
	  vec3 shadowNDCPos;
	  if (!GetShadowNDCPos(shadowNDCPos, shadowPosWithDepthBias)) {
		  return 1.0;
	  }
    return NativePCFShadowFactorSoft(shadowNDCPos, cc_shadowMap, cc_shadowWHPBInfo.xy);
  }
  float CCGetDirLightShadowFactorSoft3X (vec4 shadowPosWithDepthBias) {
	  vec3 shadowNDCPos;
	  if (!GetShadowNDCPos(shadowNDCPos, shadowPosWithDepthBias)) {
		  return 1.0;
	  }
    return NativePCFShadowFactorSoft3X(shadowNDCPos, cc_shadowMap, cc_shadowWHPBInfo.xy);
  }
  float CCGetDirLightShadowFactorSoft5X (vec4 shadowPosWithDepthBias) {
	  vec3 shadowNDCPos;
	  if (!GetShadowNDCPos(shadowNDCPos, shadowPosWithDepthBias)) {
		  return 1.0;
	  }
    return NativePCFShadowFactorSoft5X(shadowNDCPos, cc_shadowMap, cc_shadowWHPBInfo.xy);
  }
  float CCGetSpotLightShadowFactorHard (vec4 shadowPosWithDepthBias, vec3 worldPos) {
	  vec3 shadowNDCPos;
	  if (!GetShadowNDCPos(shadowNDCPos, shadowPosWithDepthBias)) {
		  return 1.0;
	  }
    return NativePCFShadowFactorHard(shadowNDCPos, cc_spotShadowMap, cc_shadowWHPBInfo.xy);
  }
  float CCGetSpotLightShadowFactorSoft (vec4 shadowPosWithDepthBias, vec3 worldPos) {
	  vec3 shadowNDCPos;
	  if (!GetShadowNDCPos(shadowNDCPos, shadowPosWithDepthBias)) {
		  return 1.0;
	  }
    return NativePCFShadowFactorSoft(shadowNDCPos, cc_spotShadowMap, cc_shadowWHPBInfo.xy);
  }
  float CCGetSpotLightShadowFactorSoft3X (vec4 shadowPosWithDepthBias, vec3 worldPos) {
	  vec3 shadowNDCPos;
	  if (!GetShadowNDCPos(shadowNDCPos, shadowPosWithDepthBias)) {
		  return 1.0;
	  }
    return NativePCFShadowFactorSoft3X(shadowNDCPos, cc_spotShadowMap, cc_shadowWHPBInfo.xy);
  }
  float CCGetSpotLightShadowFactorSoft5X (vec4 shadowPosWithDepthBias, vec3 worldPos) {
	  vec3 shadowNDCPos;
	  if (!GetShadowNDCPos(shadowNDCPos, shadowPosWithDepthBias)) {
		  return 1.0;
	  }
    return NativePCFShadowFactorSoft5X(shadowNDCPos, cc_spotShadowMap, cc_shadowWHPBInfo.xy);
  }
  float CCSpotShadowFactorBase(vec4 shadowPos, vec3 worldPos, vec2 shadowBias)
  {
    float pcf = cc_shadowWHPBInfo.z;
    vec4 pos = vec4(1.0);
    #if CC_SHADOWMAP_USE_LINEAR_DEPTH
      pos = ApplyShadowDepthBias_PerspectiveLinearDepth(shadowPos, shadowBias.x, worldPos);
    #else
      pos = ApplyShadowDepthBias_Perspective(shadowPos, shadowBias.x);
    #endif
    if (pcf > 2.9) {
      return CCGetSpotLightShadowFactorSoft5X(pos, worldPos);
    } else if (pcf > 1.9) {
      return CCGetSpotLightShadowFactorSoft3X(pos, worldPos);
    }else if (pcf > 0.9) {
      return CCGetSpotLightShadowFactorSoft(pos, worldPos);
    }else {
      return CCGetSpotLightShadowFactorHard(pos, worldPos);
    }
  }
  float CCShadowFactorBase(vec4 shadowPos, vec3 N, vec2 shadowBias)
  {
    float realtimeShadow = 1.0;
    vec4 pos = ApplyShadowDepthBias_FaceNormal(shadowPos, N, shadowBias.y, cc_matLightView, cc_shadowProjInfo.xy);
    pos = ApplyShadowDepthBias_Orthographic(pos, shadowBias.x, cc_shadowProjDepthInfo.x, cc_shadowProjDepthInfo.y);
    float pcf = cc_shadowWHPBInfo.z;
    if (pcf > 2.9) {
      realtimeShadow =  CCGetDirLightShadowFactorSoft5X(pos);
    } else if (pcf > 1.9) {
      realtimeShadow =  CCGetDirLightShadowFactorSoft3X(pos);
    }else if (pcf > 0.9) {
      realtimeShadow = CCGetDirLightShadowFactorSoft(pos);
    }else {
      realtimeShadow = CCGetDirLightShadowFactorHard(pos);
    }
    return mix(realtimeShadow, 1.0, cc_shadowNFLSInfo.w);
  }
  #if CC_SUPPORT_CASCADED_SHADOW_MAP
    int CCGetCSMLevel(out vec4 csmPos, out vec4 shadowProjDepthInfo, out vec4 shadowProjInfo, out vec3 shadowViewDir0, out vec3 shadowViewDir1, out vec3 shadowViewDir2, vec3 worldPos) {
      int layer = -1;
      highp float layerThreshold = cc_csmViewDir0[0].w;
      for (int i = 0; i < 4; i++) {
        vec4 shadowPos = cc_matCSMViewProj[i] * vec4(worldPos.xyz, 1.0);
        vec3 clipPos = shadowPos.xyz / shadowPos.w * 0.5 + 0.5;
        if (clipPos.x >= (0.0 + layerThreshold) && clipPos.x <= (1.0 - layerThreshold) &&
            clipPos.y >= (0.0 + layerThreshold) && clipPos.y <= (1.0 - layerThreshold) &&
            clipPos.z >= 0.0 && clipPos.z <= 1.0 && layer < 0) {
          csmPos = cc_matCSMViewProj[i] * vec4(worldPos.xyz, 1.0);
          csmPos.xy = csmPos.xy * cc_csmAtlas[i].xy + cc_csmAtlas[i].zw;
          shadowProjDepthInfo = cc_csmProjDepthInfo[i];
          shadowProjInfo = cc_csmProjInfo[i];
          shadowViewDir0 = cc_csmViewDir0[i].xyz;
          shadowViewDir1 = cc_csmViewDir1[i].xyz;
          shadowViewDir2 = cc_csmViewDir2[i].xyz;
          layer = i;
        }
      }
      return layer;
    }
    float CCCSMFactorBase(vec3 worldPos, vec3 N, vec2 shadowBias)
    {
      vec4 csmPos = vec4(1.0);
      vec4 shadowProjDepthInfo, shadowProjInfo;
      vec3 shadowViewDir0, shadowViewDir1, shadowViewDir2;
      int level = CCGetCSMLevel(csmPos, shadowProjDepthInfo, shadowProjInfo, shadowViewDir0, shadowViewDir1, shadowViewDir2, worldPos);
      if (level < 0) { return 1.0; }
      float realtimeShadow = 1.0;
      vec4 pos = ApplyShadowDepthBias_FaceNormal(csmPos, N, shadowBias.y, shadowViewDir0, shadowViewDir1, shadowViewDir2, shadowProjInfo.xy);
      pos = ApplyShadowDepthBias_Orthographic(pos, shadowBias.x, shadowProjDepthInfo.x, shadowProjDepthInfo.y);
      float pcf = cc_shadowWHPBInfo.z;
      if (pcf > 2.9) {
        realtimeShadow = CCGetDirLightShadowFactorSoft5X(pos);
      } else if (pcf > 1.9) {
        realtimeShadow = CCGetDirLightShadowFactorSoft3X(pos);
      } else if (pcf > 0.9) {
        realtimeShadow = CCGetDirLightShadowFactorSoft(pos);
      }else {
        realtimeShadow = CCGetDirLightShadowFactorHard(pos);
      }
      return mix(realtimeShadow, 1.0, cc_shadowNFLSInfo.w);
    }
  #else
    int CCGetCSMLevel(out vec4 csmPos, out vec4 shadowProjDepthInfo, out vec4 shadowProjInfo, out vec3 shadowViewDir0, out vec3 shadowViewDir1, out vec3 shadowViewDir2, vec3 worldPos) {
      return -1;
    }
    float CCCSMFactorBase(vec3 worldPos, vec3 N, vec2 shadowBias) {
      vec4 shadowPos = cc_matLightViewProj * vec4(worldPos, 1.0);
      return CCShadowFactorBase(shadowPos, N, shadowBias);
    }
  #endif
#endif
#if CC_USE_IBL
  layout(set = 0, binding = 5) uniform textureCube cc_environment;
  layout(set = 0, binding = 21) uniform sampler cc_environmentSampler;
  vec4 fragTextureLod (sampler2D tex, vec2 coord, float lod) {
      return textureLod(tex, coord, lod);
  }
  vec4 fragTextureLod (samplerCube tex, vec3 coord, float lod) {
      return textureLod(tex, coord, lod);
  }
  vec3 unpackRGBE (vec4 rgbe) {
    return rgbe.rgb * pow(1.1, rgbe.a * 255.0 - 128.0);
  }
  #if CC_USE_DIFFUSEMAP
    layout(set = 0, binding = 7) uniform textureCube cc_diffuseMap;
    layout(set = 0, binding = 23) uniform sampler cc_diffuseMapSampler;
  #endif
#endif
float GGXMobile (float roughness, float NoH, vec3 H, vec3 N) {
  vec3 NxH = cross(N, H);
  float OneMinusNoHSqr = dot(NxH, NxH);
  float a = roughness * roughness;
  float n = NoH * a;
  float p = a / (OneMinusNoHSqr + n * n);
  return p * p;
}
float CalcSpecular (float roughness, float NoH, vec3 H, vec3 N) {
  return (roughness * 0.25 + 0.25) * GGXMobile(roughness, NoH, H, N);
}
vec3 BRDFApprox (vec3 specular, float roughness, float NoV) {
  const vec4 c0 = vec4(-1.0, -0.0275, -0.572, 0.022);
  const vec4 c1 = vec4(1.0, 0.0425, 1.04, -0.04);
  vec4 r = roughness * c0 + c1;
  float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;
  vec2 AB = vec2(-1.04, 1.04) * a004 + r.zw;
  AB.y *= clamp(50.0 * specular.g, 0.0, 1.0);
  return specular * AB.x + AB.y;
}
#if USE_REFLECTION_DENOISE
  vec3 GetEnvReflectionWithMipFiltering(vec3 R, float roughness, float mipCount, float denoiseIntensity) {
    #if CC_USE_IBL
    	float mip = roughness * (mipCount - 1.0);
    	float delta = (dot(dFdx(R), dFdy(R))) * 1000.0;
    	float mipBias = mix(0.0, 5.0, clamp(delta, 0.0, 1.0));
    	vec4 biased = fragTextureLod(cc_environment, R, mip + mipBias);
     	vec4 filtered = texture(samplerCube(cc_environment,cc_environmentSampler), R);
      #if CC_USE_IBL == 2
      	biased.rgb = unpackRGBE(biased);
      	filtered.rgb = unpackRGBE(filtered);
      #else
      	biased.rgb = SRGBToLinear(biased.rgb);
      	filtered.rgb = SRGBToLinear(filtered.rgb);
      #endif
      return mix(biased.rgb, filtered.rgb, denoiseIntensity);
    #else
      return vec3(0.0, 0.0, 0.0);
    #endif
  }
#endif
struct StandardSurface {
  vec4 albedo;
    #if CC_PLATFORM_ANDROID_AND_WEBGL && CC_ENABLE_WEBGL_HIGHP_STRUCT_VALUES
    vec3 position, position_fract_part;
    #else
    vec3 position;
    #endif
  vec3 normal;
  vec3 emissive;
  vec3 lightmap;
  float lightmap_test;
  float roughness;
  float metallic;
  float occlusion;
  float specularIntensity;
  #if CC_RECEIVE_SHADOW
    vec2 shadowBias;
  #endif
};
vec4 CCStandardShadingBase (StandardSurface s, vec4 shadowPos) {
  vec3 diffuse = s.albedo.rgb * (1.0 - s.metallic);
  vec3 specular = mix(vec3(0.08 * s.specularIntensity), s.albedo.rgb, s.metallic);
  vec3 position;
    #if CC_PLATFORM_ANDROID_AND_WEBGL && CC_ENABLE_WEBGL_HIGHP_STRUCT_VALUES
    position = unpackHighpData(s.position, s.position_fract_part);
    #else
    position = s.position;
    #endif
  vec3 N = normalize(s.normal);
  vec3 V = normalize(cc_cameraPos.xyz - position);
  #if CC_USE_LIGHTMAP && !USE_BATCHING && !CC_FORWARD_ADD
    vec3 finalColor = diffuse * s.lightmap.rgb;
  #else
    float NV = max(abs(dot(N, V)), 0.0);
    specular = BRDFApprox(specular, s.roughness, NV);
    vec3 L = normalize(-cc_mainLitDir.xyz);
    vec3 H = normalize(L + V);
    float NH = max(dot(N, H), 0.0);
    float NL = max(dot(N, L), 0.0);
    vec3 finalColor = NL * cc_mainLitColor.rgb * cc_mainLitColor.w;
    vec3 diffuseContrib = diffuse / PI;
    vec3 specularContrib = specular * CalcSpecular(s.roughness, NH, H, N);
    vec3 dirlightContrib = (diffuseContrib + specularContrib);
    float shadow = 1.0;
    #if CC_RECEIVE_SHADOW
      if (NL > 0.0 && cc_mainLitDir.w > 0.0) {
        if (cc_shadowLPNNInfo.w > 0.0) {
          shadow = CCCSMFactorBase(position, N, s.shadowBias);
        } else {
          shadow = CCShadowFactorBase(shadowPos, N, s.shadowBias);
        }
      }
    #endif
    dirlightContrib *= shadow;
    finalColor *= dirlightContrib;
  #endif
  float fAmb = 0.5 - N.y * 0.5;
  vec3 ambDiff = mix(cc_ambientSky.rgb, cc_ambientGround.rgb, fAmb);
  #if CC_USE_IBL
    #if CC_USE_DIFFUSEMAP
      vec4 diffuseMap = texture(samplerCube(cc_diffuseMap,cc_diffuseMapSampler), N);
      #if CC_USE_DIFFUSEMAP == 2
        ambDiff = unpackRGBE(diffuseMap);
      #else
        ambDiff = SRGBToLinear(diffuseMap.rgb);
      #endif
    #endif
    vec3 R = normalize(reflect(-V, N));
    #if USE_REFLECTION_DENOISE && !CC_IBL_CONVOLUTED
      vec3 env = GetEnvReflectionWithMipFiltering(R, s.roughness, cc_ambientGround.w, 0.6);
    #else
      vec4 envmap = fragTextureLod(cc_environment, R, s.roughness * (cc_ambientGround.w - 1.0));
      #if CC_USE_IBL == 2
        vec3 env = unpackRGBE(envmap);
      #else
        vec3 env = SRGBToLinear(envmap.rgb);
      #endif
    #endif
    finalColor += env * cc_ambientSky.w * specular * s.occlusion;
  #endif
  finalColor += ambDiff.rgb * cc_ambientSky.w * diffuse * s.occlusion;
  finalColor += s.emissive;
  return vec4(finalColor, s.albedo.a);
}
vec3 ACESToneMap (vec3 color) {
  color = min(color, vec3(8.0));
  const float A = 2.51;
  const float B = 0.03;
  const float C = 2.43;
  const float D = 0.59;
  const float E = 0.14;
  return (color * (A * color + B)) / (color * (C * color + D) + E);
}
vec4 CCFragOutput (vec4 color) {
  #if CC_USE_HDR
    color.rgb = ACESToneMap(color.rgb);
  #endif
  color.rgb = LinearToSRGB(color.rgb);
  return color;
}
layout(location = 1) in highp vec4 v_shadowPos;
#if CC_RECEIVE_SHADOW
#endif
#if CC_USE_LIGHTMAP && !USE_BATCHING && !CC_FORWARD_ADD
  layout(location = 9) in vec3 v_luv;
  layout(set = 2, binding = 10) uniform texture2D cc_lightingMap;
  layout(set = 2, binding = 26) uniform sampler cc_lightingMapSampler;
#endif
layout(location = 3) in vec3 v_position;
layout(location = 5) in vec2 v_uv;
#if HAS_SECOND_UV
  layout(location = 6) in mediump vec2 v_uv1;
#endif
layout(location = 4) in mediump vec3 v_normal;
#if CC_RECEIVE_SHADOW
  layout(location = 7) in mediump vec2 v_shadowBias;
#endif
#if USE_VERTEX_COLOR
  layout(location = 2) in lowp vec4 v_color;
#endif
#if USE_ALBEDO_MAP
  layout(set = 1, binding = 1) uniform texture2D albedoMap;
  layout(set = 1, binding = 17) uniform sampler albedoMapSampler;
#endif
#if USE_NORMAL_MAP
  layout(location = 8) in mediump vec4 v_tangent;
  layout(set = 1, binding = 2) uniform texture2D normalMap;
  layout(set = 1, binding = 18) uniform sampler normalMapSampler;
#endif
#if USE_PBR_MAP
  layout(set = 1, binding = 3) uniform texture2D pbrMap;
  layout(set = 1, binding = 19) uniform sampler pbrMapSampler;
#endif
#if USE_METALLIC_ROUGHNESS_MAP
  layout(set = 1, binding = 4) uniform texture2D metallicRoughnessMap;
  layout(set = 1, binding = 20) uniform sampler metallicRoughnessMapSampler;
#endif
#if USE_OCCLUSION_MAP
  layout(set = 1, binding = 5) uniform texture2D occlusionMap;
  layout(set = 1, binding = 21) uniform sampler occlusionMapSampler;
#endif
#if USE_EMISSIVE_MAP
  layout(set = 1, binding = 6) uniform texture2D emissiveMap;
  layout(set = 1, binding = 22) uniform sampler emissiveMapSampler;
#endif
#if USE_ALPHA_TEST
#endif
void surf (out StandardSurface s) {
  vec4 baseColor = albedo;
  #if USE_VERTEX_COLOR
    baseColor.rgb *= SRGBToLinear(v_color.rgb);
    baseColor.a *= v_color.a;
  #endif
  #if USE_ALBEDO_MAP
    vec4 texColor = texture(sampler2D(albedoMap,albedoMapSampler), ALBEDO_UV);
    texColor.rgb = SRGBToLinear(texColor.rgb);
    baseColor *= texColor;
  #endif
  s.albedo = baseColor;
  s.albedo.rgb *= albedoScaleAndCutoff.xyz;
  #if USE_ALPHA_TEST
    if (s.albedo.ALPHA_TEST_CHANNEL < albedoScaleAndCutoff.w) discard;
  #endif
  #if CC_USE_LIGHTMAP && !USE_BATCHING && !CC_FORWARD_ADD
    vec4 lightColor = texture(sampler2D(cc_lightingMap,cc_lightingMapSampler), v_luv.xy);
    s.lightmap = lightColor.xyz * v_luv.z;
    s.lightmap_test = v_luv.z;
  #endif
  s.normal = v_normal;
  #if CC_RECEIVE_SHADOW
    s.shadowBias = v_shadowBias;
  #endif
  #if USE_NORMAL_MAP
    vec3 nmmp = texture(sampler2D(normalMap,normalMapSampler), NORMAL_UV).xyz - vec3(0.5);
    vec3 bitangent = cross(v_normal, v_tangent.xyz) * v_tangent.w;
    s.normal =
      (nmmp.x * emissiveScaleParam.w) * normalize(v_tangent.xyz) +
      (nmmp.y * emissiveScaleParam.w) * normalize(bitangent) +
      nmmp.z * normalize(s.normal);
  #endif
    #if CC_PLATFORM_ANDROID_AND_WEBGL && CC_ENABLE_WEBGL_HIGHP_STRUCT_VALUES
    packHighpData(s.position, s.position_fract_part, v_position);
    #else
    s.position = v_position;
    #endif
  vec4 pbr = pbrParams;
  #if USE_PBR_MAP
    vec4 res = texture(sampler2D(pbrMap,pbrMapSampler), PBR_UV);
    pbr.x *= res.r;
    pbr.y *= res.g;
    pbr.z *= res.b;
    pbr.w *= res.a;
  #endif
  #if USE_METALLIC_ROUGHNESS_MAP
    vec4 metallicRoughness = texture(sampler2D(metallicRoughnessMap,metallicRoughnessMapSampler), PBR_UV);
    pbr.z *= metallicRoughness.b;
    pbr.y *= metallicRoughness.g;
  #endif
  #if USE_OCCLUSION_MAP
    pbr.x *= texture(sampler2D(occlusionMap,occlusionMapSampler), PBR_UV).r;
  #endif
  s.occlusion = pbr.x;
  s.roughness = pbr.y;
  s.specularIntensity = 0.5;
  s.metallic = pbr.z;
  s.emissive = emissive.rgb * emissiveScaleParam.xyz;
  #if USE_EMISSIVE_MAP
    s.emissive *= SRGBToLinear(texture(sampler2D(emissiveMap,emissiveMapSampler), EMISSIVE_UV).rgb);
  #endif
}
#if CC_FORWARD_ADD
  #if CC_PIPELINE_TYPE == 0
    #define LIGHTS_PER_PASS 1
  #else
    #define LIGHTS_PER_PASS 10
  #endif
  #if CC_ENABLE_CLUSTERED_LIGHT_CULLING == 0
  layout(set = 2, binding = 1) uniform CCForwardLight {
    highp vec4 cc_lightPos[LIGHTS_PER_PASS];
    vec4 cc_lightColor[LIGHTS_PER_PASS];
    vec4 cc_lightSizeRangeAngle[LIGHTS_PER_PASS];
    vec4 cc_lightDir[LIGHTS_PER_PASS];
  };
  #endif
  float SmoothDistAtt (float distSqr, float invSqrAttRadius) {
    float factor = distSqr * invSqrAttRadius;
    float smoothFactor = clamp(1.0 - factor * factor, 0.0, 1.0);
    return smoothFactor * smoothFactor;
  }
  float GetDistAtt (float distSqr, float invSqrAttRadius) {
    float attenuation = 1.0 / max(distSqr, 0.01*0.01);
    attenuation *= SmoothDistAtt(distSqr , invSqrAttRadius);
    return attenuation;
  }
  float GetAngleAtt (vec3 L, vec3 litDir, float litAngleScale, float litAngleOffset) {
    float cd = dot(litDir, L);
    float attenuation = clamp(cd * litAngleScale + litAngleOffset, 0.0, 1.0);
    return (attenuation * attenuation);
  }
  #if CC_ENABLE_CLUSTERED_LIGHT_CULLING == 0
  vec4 CCStandardShadingAdditive (StandardSurface s, vec4 shadowPos) {
    vec3 position;
      #if CC_PLATFORM_ANDROID_AND_WEBGL && CC_ENABLE_WEBGL_HIGHP_STRUCT_VALUES
      position = unpackHighpData(s.position, s.position_fract_part);
      #else
      position = s.position;
      #endif
    vec3 diffuse = s.albedo.rgb * (1.0 - s.metallic);
    vec3 specular = mix(vec3(0.04), s.albedo.rgb, s.metallic);
    vec3 diffuseContrib = diffuse / PI;
    vec3 N = normalize(s.normal);
    vec3 V = normalize(cc_cameraPos.xyz - position);
    float NV = max(abs(dot(N, V)), 0.0);
    specular = BRDFApprox(specular, s.roughness, NV);
    vec3 finalColor = vec3(0.0);
    int numLights = CC_PIPELINE_TYPE == 0 ? LIGHTS_PER_PASS : int(cc_lightDir[0].w);
    for (int i = 0; i < LIGHTS_PER_PASS; i++) {
      if (i >= numLights) break;
      vec3 SLU = cc_lightPos[i].xyz - position;
      vec3 SL = normalize(SLU);
      vec3 SH = normalize(SL + V);
      float SNL = max(dot(N, SL), 0.0);
      float SNH = max(dot(N, SH), 0.0);
      float distSqr = dot(SLU, SLU);
      float litRadius = cc_lightSizeRangeAngle[i].x;
      float litRadiusSqr = litRadius * litRadius;
      float illum = litRadiusSqr / max(litRadiusSqr, distSqr);
      float attRadiusSqrInv = 1.0 / max(cc_lightSizeRangeAngle[i].y, 0.01);
      attRadiusSqrInv *= attRadiusSqrInv;
      float att = GetDistAtt(distSqr, attRadiusSqrInv);
      vec3 lspec = specular * CalcSpecular(s.roughness, SNH, SH, N);
      if (cc_lightPos[i].w > 0.0) {
        float cosInner = max(dot(-cc_lightDir[i].xyz, SL), 0.01);
        float cosOuter = cc_lightSizeRangeAngle[i].z;
        float litAngleScale = 1.0 / max(0.001, cosInner - cosOuter);
        float litAngleOffset = -cosOuter * litAngleScale;
        att *= GetAngleAtt(SL, -cc_lightDir[i].xyz, litAngleScale, litAngleOffset);
      }
      vec3 lightColor = cc_lightColor[i].rgb;
      float shadow = 1.0;
      #if CC_RECEIVE_SHADOW
        if (cc_lightPos[i].w > 0.0 && cc_lightSizeRangeAngle[i].w > 0.0) {
          shadow = CCSpotShadowFactorBase(shadowPos, position, s.shadowBias);
        }
      #endif
      lightColor *= shadow;
      finalColor += SNL * lightColor * cc_lightColor[i].w * illum * att * (diffuseContrib + lspec);
    }
    return vec4(finalColor, 0.0);
  }
  #endif
  #if CC_ENABLE_CLUSTERED_LIGHT_CULLING == 1
  layout(set = 1, binding = 7) readonly buffer b_ccLightsBuffer { vec4 b_ccLights[]; };
  layout(set = 1, binding = 8) readonly buffer b_clusterLightIndicesBuffer { uint b_clusterLightIndices[]; };
  layout(set = 1, binding = 9) readonly buffer b_clusterLightGridBuffer { uvec4 b_clusterLightGrid[]; };
  struct CCLight
  {
    vec4 cc_lightPos;
    vec4 cc_lightColor;
    vec4 cc_lightSizeRangeAngle;
    vec4 cc_lightDir;
  };
  struct Cluster
  {
    vec3 minBounds;
    vec3 maxBounds;
  };
  struct LightGrid
  {
    uint offset;
    uint ccLights;
  };
  CCLight getCCLight(uint i)
  {
    CCLight light;
    light.cc_lightPos = b_ccLights[4u * i + 0u];
    light.cc_lightColor = b_ccLights[4u * i + 1u];
    light.cc_lightSizeRangeAngle = b_ccLights[4u * i + 2u];
    light.cc_lightDir = b_ccLights[4u * i + 3u];
    return light;
  }
  LightGrid getLightGrid(uint cluster)
  {
    uvec4 gridvec = b_clusterLightGrid[cluster];
    LightGrid grid;
    grid.offset = gridvec.x;
    grid.ccLights = gridvec.y;
    return grid;
  }
  uint getGridLightIndex(uint start, uint offset)
  {
    return b_clusterLightIndices[start + offset];
  }
  uint getClusterZIndex(vec4 worldPos)
  {
    float scale = float(24) / log(cc_nearFar.y / cc_nearFar.x);
    float bias = -(float(24) * log(cc_nearFar.x) / log(cc_nearFar.y / cc_nearFar.x));
    float eyeDepth = -(cc_matView * worldPos).z;
    uint zIndex = uint(max(log(eyeDepth) * scale + bias, 0.0));
    return zIndex;
  }
  uint getClusterIndex(vec4 fragCoord, vec4 worldPos)
  {
    uint zIndex = getClusterZIndex(worldPos);
    float clusterSizeX = ceil(cc_viewPort.z / float(16));
    float clusterSizeY = ceil(cc_viewPort.w / float(8));
    uvec3 indices = uvec3(uvec2(fragCoord.xy / vec2(clusterSizeX, clusterSizeY)), zIndex);
    uint cluster = (16u * 8u) * indices.z + 16u * indices.y + indices.x;
    return cluster;
  }
  vec4 CCClusterShadingAdditive (StandardSurface s, vec4 shadowPos) {
    vec3 diffuse = s.albedo.rgb * (1.0 - s.metallic);
    vec3 specular = mix(vec3(0.04), s.albedo.rgb, s.metallic);
    vec3 diffuseContrib = diffuse / PI;
    vec3 position;
      #if CC_PLATFORM_ANDROID_AND_WEBGL && CC_ENABLE_WEBGL_HIGHP_STRUCT_VALUES
      position = unpackHighpData(s.position, s.position_fract_part);
      #else
      position = s.position;
      #endif
    vec3 N = normalize(s.normal);
    vec3 V = normalize(cc_cameraPos.xyz - position);
    float NV = max(abs(dot(N, V)), 0.001);
    specular = BRDFApprox(specular, s.roughness, NV);
    vec3 finalColor = vec3(0.0);
    uint cluster = getClusterIndex(gl_FragCoord, vec4(position, 1.0));
    LightGrid grid = getLightGrid(cluster);
    uint numLights = grid.ccLights;
    for (uint i = 0u; i < 100u; i++) {
      if (i >= numLights) break;
      uint lightIndex = getGridLightIndex(grid.offset, i);
      CCLight light = getCCLight(lightIndex);
      vec3 SLU = light.cc_lightPos.xyz - position;
      vec3 SL = normalize(SLU);
      vec3 SH = normalize(SL + V);
      float SNL = max(dot(N, SL), 0.001);
      float SNH = max(dot(N, SH), 0.0);
      float distSqr = dot(SLU, SLU);
      float litRadius = light.cc_lightSizeRangeAngle.x;
      float litRadiusSqr = litRadius * litRadius;
      float illum = PI * (litRadiusSqr / max(litRadiusSqr , distSqr));
      float attRadiusSqrInv = 1.0 / max(light.cc_lightSizeRangeAngle.y, 0.01);
      attRadiusSqrInv *= attRadiusSqrInv;
      float att = GetDistAtt(distSqr, attRadiusSqrInv);
      vec3 lspec = specular * CalcSpecular(s.roughness, SNH, SH, N);
      if (light.cc_lightPos.w > 0.0) {
        float cosInner = max(dot(-light.cc_lightDir.xyz, SL), 0.01);
        float cosOuter = light.cc_lightSizeRangeAngle.z;
        float litAngleScale = 1.0 / max(0.001, cosInner - cosOuter);
        float litAngleOffset = -cosOuter * litAngleScale;
        att *= GetAngleAtt(SL, -light.cc_lightDir.xyz, litAngleScale, litAngleOffset);
      }
      vec3 lightColor = light.cc_lightColor.rgb;
      float shadow = 1.0;
      #if CC_RECEIVE_SHADOW
        if (light.cc_lightPos.w > 0.0) {
          shadow = CCSpotShadowFactorBase(shadowPos, position, s.shadowBias);
        }
      #endif
      lightColor *= shadow;
      finalColor += SNL * lightColor * light.cc_lightColor.w * illum * att * (diffuseContrib + lspec);
    }
    return vec4(finalColor, 0.0);
  }
  #endif
  layout(location = 0) out vec4 fragColorX;
  void main () {
    StandardSurface s; surf(s);
    #if CC_ENABLE_CLUSTERED_LIGHT_CULLING == 1
    vec4 color = CCClusterShadingAdditive(s, v_shadowPos);
    #else
    vec4 color = CCStandardShadingAdditive(s, v_shadowPos);
    #endif
    fragColorX = CCFragOutput(color);
  }
#elif (CC_PIPELINE_TYPE == 0 || CC_FORCE_FORWARD_SHADING)
  layout(location = 0) out vec4 fragColorX;
  void main () {
    StandardSurface s; surf(s);
    vec4 color = CCStandardShadingBase(s, v_shadowPos);
    CC_APPLY_FOG(color, s.position.xyz);
    fragColorX = CCFragOutput(color);
  }
#elif CC_PIPELINE_TYPE == 1
  vec2 signNotZero(vec2 v) {
    return vec2((v.x >= 0.0) ? +1.0 : -1.0, (v.y >= 0.0) ? +1.0 : -1.0);
  }
  vec2 float32x3_to_oct(in vec3 v) {
    vec2 p = v.xy * (1.0 / (abs(v.x) + abs(v.y) + abs(v.z)));
    return (v.z <= 0.0) ? ((1.0 - abs(p.yx)) * signNotZero(p)) : p;
  }
  layout(location = 0) out vec4 fragColor0;
  layout(location = 1) out vec4 fragColor1;
  layout(location = 2) out vec4 fragColor2;
  void main () {
    StandardSurface s; surf(s);
    fragColor0 = s.albedo;
    fragColor1 = vec4(float32x3_to_oct(s.normal), s.roughness, s.metallic);
    fragColor2 = vec4(s.emissive, s.occlusion);
  }
#endif
`;

function seperateCombinedSamplerTexture (shaderSource: string) {
    // sampler and texture
    const samplerTexturArr = shaderSource.match(/(.*?)\(set = \d+, binding = \d+\) uniform(.*?)sampler\w* \w+;/g);
    const count = samplerTexturArr?.length ? samplerTexturArr?.length : 0;
    let code = shaderSource;

    const referredFuncMap = new Map<string, [fnName: string, samplerType: string, samplerName: string]>();
    const samplerSet = new Set<string>();
    samplerTexturArr?.every((str) => {
        let textureName = str.match(/(?<=uniform(.*?)sampler\w* )(\w+)(?=;)/g)!.toString();
        let samplerStr = str.replace(textureName, `${textureName}Sampler`);
        let samplerFunc = samplerStr.match(/(?<=uniform(.*?))sampler(\w*)/g)!.toString();
        samplerFunc = samplerFunc.replace('sampler', '');
        if (samplerFunc === '') {
            textureName = textureName.replace('Sampler', '');
        } else {
            samplerStr = samplerStr.replace(/(?<=uniform(.*?))(sampler\w*)/g, 'sampler');

            // layout (set = a, binding = b) uniform sampler2D cctex;
            // to:
            // layout (set = a, binding = b) uniform sampler cctexSampler;
            // layout (set = a, binding = b + maxTextureNum) uniform texture2D cctex;
            const samplerReg = /(?<=binding = )(\d+)(?=\))/g;
            const samplerBindingStr = str.match(samplerReg)!.toString();
            const samplerBinding = Number(samplerBindingStr) + 16;
            samplerStr = samplerStr.replace(samplerReg, samplerBinding.toString());

            const textureStr = str.replace(/(?<=uniform(.*?))(sampler)(?=\w*)/g, 'texture');
            code = code.replace(str, `${textureStr}\n${samplerStr}`);
        }

        if (!samplerSet.has(`${textureName}Sampler`)) {
            samplerSet.add(`${textureName}Sampler`);
            // gathering referred func
            let referredFuncStr = `([\\w]+)[\\s]*\\([0-9a-zA-Z_\\s,]*?sampler${samplerFunc}[^\\)]+\\)[\\s]*{`;
            if (samplerFunc === '') {
                referredFuncStr = `([\\w]+)[\\s]*\\([0-9a-zA-Z_\\s,]*?sampler([\\S]+)[^\\)]+\\)[\\s]*{`;
            }
            const referredFuncRe = new RegExp(referredFuncStr, 'g');
            let reArr = referredFuncRe.exec(code);
            while (reArr) {
                // first to see if it's wrapped by #if 0 \n ... \n #ndif
                let smpFunc = samplerFunc;
                if (smpFunc === '') {
                    smpFunc = reArr[2];
                }
                const searchTarget = code.slice(0, reArr.index);
                const defValQueue: { str: string, b: boolean }[] = [];
                let searchIndex = 1;

                while (searchIndex > 0) {
                    let ifIndex = searchTarget.indexOf('#if', searchIndex);
                    let elseIndex = searchTarget.indexOf('#else', searchIndex);
                    let endIndex = searchTarget.indexOf('#endif', searchIndex);

                    if (ifIndex === -1) ifIndex = Number.MAX_SAFE_INTEGER;
                    if (elseIndex === -1) elseIndex = Number.MAX_SAFE_INTEGER;
                    if (endIndex === -1) endIndex = Number.MAX_SAFE_INTEGER;

                    if (endIndex < elseIndex && endIndex < ifIndex) {
                        defValQueue.length -= 1;
                    } else if (elseIndex < ifIndex) {
                        defValQueue[defValQueue.length - 1].b = !defValQueue[defValQueue.length - 1].b;
                        searchIndex = elseIndex + 1;
                        continue;
                    }

                    const firstIdx = searchTarget.indexOf('#if', searchIndex);
                    if (firstIdx !== -1) {
                        //#if[\s]+(!)?([\S]+)([\s+]?==[\s+]?[\S]+)
                        const ifdef = (new RegExp(`#if[\\s]+(!)?([\\S]+)([\\s+]?(==)?(!=)[\\s+]?([\\S]+))?`, 'gm')).exec(searchTarget.slice(firstIdx))!;
                        // #if CC_FOG == 1 ...
                        let evalRes = false;
                        if (ifdef[1]) {
                            evalRes = ifdef[1] !== '0';
                        }
                        if (ifdef[3]) {
                            const defVal = (new RegExp(`#define[\\s]+${ifdef[2]}[\\s]+([\\S]+).*`, 'gm')).exec(searchTarget)![1];
                            const conditionVal = ifdef[6];
                            evalRes = ifdef[4] ? defVal === conditionVal : defVal !== conditionVal;
                        }
                        defValQueue[defValQueue.length] = { str: ifdef[2], b: evalRes };
                    }
                    searchIndex = firstIdx + 1;
                }

                let defCheck = true;
                for (let i = 0; i < defValQueue.length; i++) {
                    if (!defValQueue[i].b) {
                        defCheck = false;
                        break;
                    }
                }

                const key = `${reArr[1]}_${smpFunc}_${textureName}Sampler`;
                if (!referredFuncMap.has(key) && defCheck) {
                    referredFuncMap.set(key, [reArr[1], smpFunc, `${textureName}Sampler`]);
                }
                reArr = referredFuncRe.exec(code);
            }
        }

        // cctex in main() called directly
        // .*?texture\(
        const regStr = `texture\\(\\b(${textureName})\\b`;
        const re = new RegExp(regStr);
        let reArr = re.exec(code);
        while (reArr) {
            code = code.replace(re, `texture(sampler${samplerFunc}(${textureName},${textureName}Sampler)`);
            reArr = re.exec(code);
        }
        return true;
    });

    const functionTemplates = new Map<string, string>();
    const functionDeps = new Map<string, string[]>();
    // function
    referredFuncMap.forEach((pair) => {
        //pre: if existed, replace
        //getVec3DisplacementFromTexture\(cc_TangentDisplacements[^\\n]+
        const textureStr = pair[2].slice(0, -7);
        const codePieceStr = `${pair[0]}\\(${textureStr}[^\\n]+`;
        const codePieceRe = new RegExp(codePieceStr);
        let res = codePieceRe.exec(code);
        while (res) {
            const replaceStr = res[0].replace(`${pair[0]}(${textureStr},`, `${pair[0]}_${pair[2]}_specialized(`);
            code = code.replace(codePieceRe, replaceStr);
            res = codePieceRe.exec(code);
        }

        // 1. fn definition
        const fnDeclReStr = `[\\n|\\W][\\w]+[\\W]+${pair[0]}[\\s]*\\(sampler${pair[1]}[^{]+`;
        const fnDeclRe = new RegExp(fnDeclReStr);
        const fnDecl = fnDeclRe.exec(code);

        let redefFunc = '';
        if (!functionTemplates.has(pair[0])) {
            const funcBodyStart = code.slice(fnDecl!.index + fnDecl!.length);

            const funcRedefine = (funcStr: string) => {
                const samplerType = `sampler${pair[1]}`;
                const textureRe = (new RegExp(`.*?${samplerType}[\\s]+([\\S]+),`)).exec(funcStr)!;
                const textureName = textureRe[1];
                const paramReStr = `${samplerType}[\\s]+${textureName}`;
                let funcDef = funcStr.replace(new RegExp(paramReStr), `texture${pair[1]} ${textureName}`);
                funcDef = funcDef.replace(pair[0], `${pair[0]}SAMPLER_SPEC`);
                // 2. texture(...) inside, builtin funcs
                const textureOpArr = ['texture', 'textureSize', 'texelFetch', 'textureLod'];
                for (let i = 0; i < textureOpArr.length; i++) {
                    const texFuncReStr = `(${textureOpArr[i]})\\(${textureName},`;
                    const texFuncRe = new RegExp(texFuncReStr, 'g');
                    funcDef = funcDef.replace(texFuncRe, `$1(${samplerType}(${textureName}TEXTURE_HOLDER, ${textureName}SAMPLER_HOLDER),`);
                }
                return funcDef;
            };

            const firstIfStatement = funcBodyStart.indexOf('#if');
            const firstElseStatement = funcBodyStart.indexOf('#e'); //#endif, #else, #elif maybe?
            if ((firstElseStatement !== -1 && firstIfStatement > firstElseStatement) || (firstElseStatement === -1 && firstElseStatement !== -1)) { // ooops, now func body starts in a #if statement.
                let startIndex = 0;
                let count = 1; // already in #if
                while (count > 0 && startIndex < funcBodyStart.length) {
                    const nextSymbolIdx = funcBodyStart.indexOf('#', startIndex);
                    const startSliceIdx = startIndex === 0 ? startIndex : startIndex - 1;
                    if (funcBodyStart[nextSymbolIdx + 1] === 'i') { // #if
                        count++;
                        redefFunc += funcBodyStart.slice(startSliceIdx, nextSymbolIdx);
                    } else if (funcBodyStart[nextSymbolIdx + 1] === 'e' && funcBodyStart[nextSymbolIdx + 2] === 'l') { //#elif, #else
                        if (count === 1) {
                            const tempFuncStr = funcBodyStart.slice(startSliceIdx, nextSymbolIdx - 1);
                            const funcDefStr = funcRedefine(tempFuncStr);
                            redefFunc += `\n${funcDefStr}`;
                        } else {
                            redefFunc += `\n${funcBodyStart.slice(startSliceIdx, nextSymbolIdx)}`;
                        }
                    } else if (funcBodyStart[nextSymbolIdx + 1] === 'e' && funcBodyStart[nextSymbolIdx + 2] === 'n') { //#endif
                        count--;
                        if (count === 0) {
                            const tempFuncStr = funcBodyStart.slice(startSliceIdx, nextSymbolIdx - 1);
                            const funcDefStr = funcRedefine(tempFuncStr);
                            redefFunc += `\n${funcDefStr}`;
                        } else {
                            redefFunc += `\n${funcBodyStart.slice(startSliceIdx, nextSymbolIdx)}`;
                        }
                    } else { // #define, dont care
                        redefFunc += funcBodyStart.slice(startSliceIdx, nextSymbolIdx);
                    }
                    startIndex = nextSymbolIdx + 1;
                }

                //`(?:.(?!layout))+${pair[2]};`
                const searchTarget = code.slice(0, fnDecl!.index);
                const res = (new RegExp(`#if.+[\\s]*$`)).exec(searchTarget);
                redefFunc = `${res![0]}${redefFunc}\n#endif`;
            } else {
                let count = 0;
                let matchBegin = false;
                let startIndex = 0;
                let endIndex = 0;
                for (let i = 0; i < funcBodyStart.length; ++i) {
                    if (funcBodyStart[i] === '{') {
                        ++count;
                        if (!matchBegin) {
                            matchBegin = true;
                            startIndex = i;
                        }
                    } else if (funcBodyStart[i] === '}') {
                        --count;
                    }

                    if (matchBegin && count === 0) {
                        endIndex = i;
                        break;
                    }
                }
                const rawFunc = `${fnDecl![0]}${funcBodyStart.slice(startIndex, endIndex + 1)}`;
                redefFunc = funcRedefine(rawFunc);
            }

            functionTemplates.set(pair[0], redefFunc);
        } else {
            redefFunc = functionTemplates.get(pair[0])!;
        }

        const depsFuncs: string[] = [];

        const iterator = referredFuncMap.values();
        let val = iterator.next().value;
        while (val) {
            const funcDepReStr = `\\b(${val[0] as string})\\b`;
            if (redefFunc.search(funcDepReStr) !== -1) {
                depsFuncs[depsFuncs.length] = val[0];
            }
            val = iterator.next().value;
        }
        // for (let i = 0; i < referredFuncMap.values.length; ++i) {
        //     const funcDepReStr = `\\b(${referredFuncMap.values[i].fnName as string})\\b`;
        //     if (redefFunc.search(funcDepReStr) !== -1) {
        //         depsFuncs[depsFuncs.length] = referredFuncMap.values[i].fnName;
        //     }
        // }
        functionDeps.set(pair[0], depsFuncs);

        const specializedFuncs = new Map<string, string>();
        const specialize = (funcs: string[]) => {
            funcs.every((str) => {
                if (!specializedFuncs.has(`${pair[0]}_${pair[2]}_specialized`)) {
                    const samplerReStr = `(\\w+)SAMPLER_HOLDER`;
                    const textureName = pair[2].slice(0, pair[2].length - 7); // xxxxSampler
                    const textureStr = `(\\w+)TEXTURE_HOLDER`;
                    let funcTemplate = functionTemplates.get(str);
                    funcTemplate = funcTemplate!.replace(new RegExp(samplerReStr, 'g'), pair[2]);
                    funcTemplate = funcTemplate.replace(new RegExp(textureStr, 'g'), textureName);
                    funcTemplate = funcTemplate.replace(new RegExp('SAMPLER_SPEC([\\W]?)*\\([^,)]+(,)?', 'g'), `_${pair[2]}_specialized(`);
                    // funcTemplate = funcTemplate.replace('SAMPLER_SPEC', `_${pair[2]}_specialized`);

                    for (let i = 0; i < depsFuncs.length; ++i) {
                        const depFuncStr = `${depsFuncs[i]}([\\W]?)*\\([^,)]+(,)?`;
                        funcTemplate = funcTemplate.replace(new RegExp(depFuncStr, 'g'), `${depsFuncs[i]}_${pair[2]}_specialized(`);
                    }

                    let declStr = fnDecl![0].replace(pair[0], `${str}_${pair[2]}_specialized`);
                    declStr = declStr.replace(new RegExp(`sampler${pair[1]}[^,)]+(,)?`, 'g'), ``);
                    declStr += `;`;
                    specializedFuncs.set(declStr, funcTemplate);
                } else {
                    return specialize(functionDeps.get(str)!);
                }
                return true;
            });
            return true;
        };
        specialize([pair[0]]);
        //(?:.(?!layout))+cc_PositionDisplacementsSampler;
        const samplerDefReStr = `(?:.(?!layout))+${pair[2]};`;
        const samplerDef = (new RegExp(samplerDefReStr)).exec(code);

        let funcDecls = '';
        let funcImpls = '';
        for (const [key, value] of specializedFuncs) {
            funcDecls += `\n${key}\n`;
            funcImpls += `\n${value}\n`;
        }

        const idx = code.indexOf('precision');
        code = `${code.slice(0, idx)}\n${funcDecls}\n${code.slice(idx)}`;
        code = code.replace(samplerDef![0], `${samplerDef![0]}\n${funcImpls}`);
    });

    return code;
}

export class DeviceManager {
    private initialized = false;
    private _gfxDevice!: Device;
    private _canvas: HTMLCanvasElement | null = null;
    private _swapchain!: Swapchain;
    private _renderType: RenderType = RenderType.UNKNOWN;

    public get gfxDevice () {
        return this._gfxDevice;
    }

    public get swapchain () {
        return this._swapchain;
    }

    public init (canvas: HTMLCanvasElement | null, bindingMappingInfo: BindingMappingInfo) {
        seperateCombinedSamplerTexture(testFrag);
        // Avoid setup to be called twice.
        if (this.initialized) { return; }
        const renderMode = settings.querySettings(Settings.Category.RENDERING, 'renderMode');
        this._canvas = canvas;

        this._renderType = this._determineRenderType(renderMode);

        // WebGL context created successfully
        if (this._renderType === RenderType.WEBGL) {
            const deviceInfo = new DeviceInfo(bindingMappingInfo);

            if (JSB && window.gfx) {
                this._gfxDevice = gfx.DeviceManager.create(deviceInfo);
            } else {
                let useWebGL2 = (!!window.WebGL2RenderingContext);
                const userAgent = window.navigator.userAgent.toLowerCase();
                if (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1
                    || sys.browserType === BrowserType.UC // UC browser implementation doesn't conform to WebGL2 standard
                ) {
                    useWebGL2 = false;
                }

                const deviceCtors: Constructor<Device>[] = [];
                deviceCtors.push(legacyCC.WebGPUDevice);
                if (useWebGL2 && legacyCC.WebGL2Device) {
                    deviceCtors.push(legacyCC.WebGL2Device);
                }
                if (legacyCC.WebGLDevice) {
                    deviceCtors.push(legacyCC.WebGLDevice);
                }
                if (legacyCC.EmptyDevice) {
                    deviceCtors.push(legacyCC.EmptyDevice);
                }

                Device.canvas = canvas!;
                for (let i = 0; i < deviceCtors.length; i++) {
                    this._gfxDevice = new deviceCtors[i]();
                    if (this._gfxDevice.initialize(deviceInfo)) { break; }
                }
            }
        } else if (this._renderType === RenderType.HEADLESS && legacyCC.EmptyDevice) {
            this._gfxDevice = new legacyCC.EmptyDevice();
            this._gfxDevice.initialize(new DeviceInfo(bindingMappingInfo));
        }

        if (!this._gfxDevice) {
            // todo fix here for wechat game
            error('can not support canvas rendering in 3D');
            this._renderType = RenderType.UNKNOWN;
            return;
        }

        const swapchainInfo = new SwapchainInfo(this._canvas!);
        const windowSize = screen.windowSize;
        swapchainInfo.width = windowSize.width;
        swapchainInfo.height = windowSize.height;
        this._swapchain = this._gfxDevice.createSwapchain(swapchainInfo);

        if (this._canvas) { this._canvas.oncontextmenu = () => false; }
    }

    private _determineRenderType (renderMode: LegacyRenderMode): RenderType {
        if (typeof renderMode !== 'number' || renderMode > RenderType.HEADLESS || renderMode < LegacyRenderMode.AUTO) {
            renderMode = LegacyRenderMode.AUTO;
        }
        // Determine RenderType
        let renderType = RenderType.CANVAS;
        let supportRender = false;

        if (renderMode === LegacyRenderMode.CANVAS) {
            renderType = RenderType.CANVAS;
            supportRender = true;
        } else if (renderMode === LegacyRenderMode.AUTO || renderMode === LegacyRenderMode.WEBGL) {
            renderType = RenderType.WEBGL;
            supportRender = true;
        } else if (renderMode === LegacyRenderMode.HEADLESS) {
            renderType = RenderType.HEADLESS;
            supportRender = true;
        }

        if (!supportRender) {
            throw new Error(getError(3820, renderMode));
        }
        return renderType;
    }
}

/**
 * @internal
 */
export const deviceManager = new DeviceManager();
