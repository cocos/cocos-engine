#define CC_DEVICE_SUPPORT_FLOAT_TEXTURE 1
#define CC_ENABLE_CLUSTERED_LIGHT_CULLING 0
#define CC_DEVICE_MAX_VERTEX_UNIFORM_VECTORS 256
#define CC_DEVICE_MAX_FRAGMENT_UNIFORM_VECTORS 256
#define CC_DEVICE_CAN_BENEFIT_FROM_INPUT_ATTACHMENT 1
#define CC_PLATFORM_ANDROID_AND_WEBGL 0
#define CC_ENABLE_WEBGL_HIGHP_STRUCT_VALUES 0
#define CC_JOINT_UNIFORM_CAPACITY 62
#define CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS 135
#define CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS 114
#define USE_INSTANCING 0
#define CC_USE_SKINNING 0
#define CC_USE_BAKED_ANIMATION 0
#define CC_USE_LIGHTMAP 0
#define CC_RECEIVE_SHADOW 0
#define CC_USE_LIGHT_PROBE 0
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
#define CC_CASCADED_LAYERS_TRANSITION 0
#define USE_VERTEX_COLOR 0
#define HAS_SECOND_UV 0
#define USE_NORMAL_MAP 0
#define CC_FORWARD_ADD 0
#define USE_TWOSIDE 0
#define SAMPLE_FROM_RT 0
#define CC_USE_DEBUG_VIEW 0
#define CC_SHADOWMAP_FORMAT 0
#define CC_SHADOWMAP_USE_LINEAR_DEPTH 0
#define CC_DIR_SHADOW_PCF_TYPE 0
#define CC_USE_IBL 0
#define CC_USE_DIFFUSEMAP 0
#define CC_USE_REFLECTION_PROBE 0
#define USE_REFLECTION_DENOISE 0
#define CC_SHADOW_TYPE 0
#define CC_DIR_LIGHT_SHADOW_TYPE 0
#define CC_USE_HDR 1
#define CC_IBL_CONVOLUTED 0
#define CC_LIGHT_MAP_VERSION 0
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
#define CC_USE_RGBE_OUTPUT 0
#extension GL_EXT_shader_explicit_arithmetic_types_int32 : require
precision highp float;
#define QUATER_PI 0.78539816340
#define HALF_PI 1.57079632679
#define PI 3.14159265359
#define PI2 6.28318530718
#define PI4 12.5663706144
#define INV_QUATER_PI 1.27323954474
#define INV_HALF_PI 0.63661977237
#define INV_PI 0.31830988618
#define INV_PI2 0.15915494309
#define INV_PI4 0.07957747155
#define EPSILON 1e-6
#define EPSILON_LOWP 1e-4
#define LOG2 1.442695
#define EXP_VALUE 2.71828183f
#define FP_MAX 65504.0
#define FP_SCALE 0.0009765625
#define FP_SCALE_INV 1024.0
#define GRAY_VECTOR vec3(0.299, 0.587, 0.114)
#define LIGHT_MAP_TYPE_DISABLED 0
#define LIGHT_MAP_TYPE_ALL_IN_ONE 1
#define LIGHT_MAP_TYPE_INDIRECT_OCCLUSION 2
#define REFLECTION_PROBE_TYPE_NONE 0
#define REFLECTION_PROBE_TYPE_CUBE 1
#define REFLECTION_PROBE_TYPE_PLANAR 2
#define LIGHT_TYPE_DIRECTIONAL 0.0
#define LIGHT_TYPE_SPHERE 1.0
#define LIGHT_TYPE_SPOT 2.0
#define IS_DIRECTIONAL_LIGHT(light_type) (abs(float(light_type) - float(LIGHT_TYPE_DIRECTIONAL)) < EPSILON)
#define IS_SPHERE_LIGHT(light_type) (abs(float(light_type) - float(LIGHT_TYPE_SPHERE)) < EPSILON)
#define IS_SPOT_LIGHT(light_type) (abs(float(light_type) - float(LIGHT_TYPE_SPOT)) < EPSILON)
struct StandardVertInput
{
  highp vec4 position;
  vec3 normal;
  vec4 tangent;
};
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec2 a_texCoord;
layout(location = 3) in vec4 a_tangent;
#if CC_USE_SKINNING
layout(location = 4) in u32vec4 a_joints;
layout(location = 5) in vec4 a_weights;
#endif
#if USE_INSTANCING
#if CC_USE_BAKED_ANIMATION
layout(location = 6) in highp vec4 a_jointAnimInfo;
#endif
layout(location = 7) in vec4 a_matWorld0;
layout(location = 8) in vec4 a_matWorld1;
layout(location = 9) in vec4 a_matWorld2;
#if CC_USE_LIGHTMAP
layout(location = 10) in vec4 a_lightingMapUVParam;
#endif
#if CC_RECEIVE_SHADOW
layout(location = 11) in vec2 a_localShadowBias;
#endif
#if CC_USE_LIGHT_PROBE
layout(location = 12) in vec4 a_sh_linear_const_r;
layout(location = 13) in vec4 a_sh_linear_const_g;
layout(location = 14) in vec4 a_sh_linear_const_b;
#endif
#endif
#if CC_USE_MORPH
int getVertexId()
{
  return gl_VertexIndex;
}
#endif
highp float decode32(highp vec4 rgba)
{
  rgba = rgba * 255.0;
  highp float Sign = 1.0 - (step(128.0, (rgba[3]) + 0.5)) * 2.0;
  highp float Exponent = 2.0 * (mod(float(int((rgba[3]) + 0.5)), 128.0)) + (step(128.0, (rgba[2]) + 0.5)) - 127.0;
  highp float Mantissa = (mod(float(int((rgba[2]) + 0.5)), 128.0)) * 65536.0 + rgba[1] * 256.0 + rgba[0] + 8388608.0;
  return Sign * exp2(Exponent - 23.0) * Mantissa;
}
#if CC_USE_MORPH
layout(set = 2, binding = 4) uniform CCMorph
{
  vec4 cc_displacementWeights[15];
  vec4 cc_displacementTextureInfo;
};
#if CC_MORPH_TARGET_HAS_POSITION
layout(set = 2, binding = 8) uniform sampler2D cc_PositionDisplacements;
#endif
#if CC_MORPH_TARGET_HAS_NORMAL
layout(set = 2, binding = 9) uniform sampler2D cc_NormalDisplacements;
#endif
#if CC_MORPH_TARGET_HAS_TANGENT
layout(set = 2, binding = 10) uniform sampler2D cc_TangentDisplacements;
#endif
vec2 getPixelLocation(vec2 textureResolution, int pixelIndex)
{
  float pixelIndexF = float(pixelIndex);
  float x = mod(pixelIndexF, textureResolution.x);
  float y = floor(pixelIndexF / textureResolution.x);
  return vec2(x, y);
}
vec2 getPixelCoordFromLocation(vec2 location, vec2 textureResolution)
{
  return (vec2(location.x, location.y) + .5) / textureResolution;
}
#if CC_DEVICE_SUPPORT_FLOAT_TEXTURE
vec4 fetchVec3ArrayFromTexture(sampler2D tex, int pixelIndex)
{
  ivec2 texSize = textureSize(tex, 0);
  return texelFetch(tex, ivec2(pixelIndex % texSize.x, pixelIndex / texSize.x), 0);
}
#else
vec4 fetchVec3ArrayFromTexture(sampler2D tex, int elementIndex)
{
  int pixelIndex = elementIndex * 4;
  vec2 location = getPixelLocation(cc_displacementTextureInfo.xy, pixelIndex);
  vec2 x = getPixelCoordFromLocation(location + vec2(0.0, 0.0), cc_displacementTextureInfo.xy);
  vec2 y = getPixelCoordFromLocation(location + vec2(1.0, 0.0), cc_displacementTextureInfo.xy);
  vec2 z = getPixelCoordFromLocation(location + vec2(2.0, 0.0), cc_displacementTextureInfo.xy);
  return vec4(
      decode32(texture(tex, x)),
      decode32(texture(tex, y)),
      decode32(texture(tex, z)),
      1.0);
}
#endif
float getDisplacementWeight(int index)
{
  int quot = index / 4;
  int remainder = index - quot * 4;
  if (remainder == 0)
  {
    return cc_displacementWeights[quot].x;
  }
  else if (remainder == 1)
  {
    return cc_displacementWeights[quot].y;
  }
  else if (remainder == 2)
  {
    return cc_displacementWeights[quot].z;
  }
  else
  {
    return cc_displacementWeights[quot].w;
  }
}
vec3 getVec3DisplacementFromTexture(sampler2D tex, int vertexIndex)
{
#if CC_MORPH_PRECOMPUTED
  return fetchVec3ArrayFromTexture(tex, vertexIndex).rgb;
#else
  vec3 result = vec3(0, 0, 0);
  int nVertices = int(cc_displacementTextureInfo.z);
  for (int iTarget = 0; iTarget < CC_MORPH_TARGET_COUNT; ++iTarget)
  {
    result += (fetchVec3ArrayFromTexture(tex, nVertices * iTarget + vertexIndex).rgb * getDisplacementWeight(iTarget));
  }
  return result;
#endif
}
#if CC_MORPH_TARGET_HAS_POSITION
vec3 getPositionDisplacement(int vertexId)
{
  return getVec3DisplacementFromTexture(cc_PositionDisplacements, vertexId);
}
#endif
#if CC_MORPH_TARGET_HAS_NORMAL
vec3 getNormalDisplacement(int vertexId)
{
  return getVec3DisplacementFromTexture(cc_NormalDisplacements, vertexId);
}
#endif
#if CC_MORPH_TARGET_HAS_TANGENT
vec3 getTangentDisplacement(int vertexId)
{
  return getVec3DisplacementFromTexture(cc_TangentDisplacements, vertexId);
}
#endif
void applyMorph(inout vec4 position, inout vec3 normal, inout vec4 tangent)
{
  int vertexId = getVertexId();
#if CC_MORPH_TARGET_HAS_POSITION
  position.xyz = position.xyz + getPositionDisplacement(vertexId);
#endif
#if CC_MORPH_TARGET_HAS_NORMAL
  normal.xyz = normal.xyz + getNormalDisplacement(vertexId);
#endif
#if CC_MORPH_TARGET_HAS_TANGENT
  tangent.xyz = tangent.xyz + getTangentDisplacement(vertexId);
#endif
}
void applyMorph(inout vec4 position)
{
#if CC_MORPH_TARGET_HAS_POSITION
  position.xyz = position.xyz + getPositionDisplacement(getVertexId());
#endif
}
#endif
#if CC_USE_SKINNING
#if CC_USE_BAKED_ANIMATION
layout(set = 2, binding = 3) uniform CCSkinningTexture
{
  highp vec4 cc_jointTextureInfo;
};
layout(set = 2, binding = 2) uniform CCSkinningAnimation
{
  highp vec4 cc_jointAnimInfo;
};
layout(set = 2, binding = 7) uniform highp sampler2D cc_jointTexture;
void CCGetJointTextureCoords(float pixelsPerJoint, float jointIdx, out highp float x, out highp float y, out highp float invSize)
{
#if USE_INSTANCING
  highp float temp = pixelsPerJoint * (a_jointAnimInfo.x * a_jointAnimInfo.y + jointIdx) + a_jointAnimInfo.z;
#else
  highp float temp = pixelsPerJoint * (cc_jointAnimInfo.x * cc_jointTextureInfo.y + jointIdx) + cc_jointTextureInfo.z;
#endif
  invSize = cc_jointTextureInfo.w;
  highp float tempY = floor(temp * invSize);
  x = floor(temp - tempY * cc_jointTextureInfo.x);
  y = (tempY + 0.5) * invSize;
}
#else
#if CC_USE_REAL_TIME_JOINT_TEXTURE
layout(set = 2, binding = 7) uniform highp sampler2D cc_realtimeJoint;
#else
layout(set = 2, binding = 3) uniform CCSkinning
{
  highp vec4 cc_joints[CC_JOINT_UNIFORM_CAPACITY * 3];
};
#endif
#endif
#if CC_USE_BAKED_ANIMATION
#if CC_DEVICE_SUPPORT_FLOAT_TEXTURE
mat4 getJointMatrix(float i)
{
  highp float x, y, invSize;
  CCGetJointTextureCoords(3.0, i, x, y, invSize);
  vec4 v1 = texture(cc_jointTexture, vec2((x + 0.5) * invSize, y));
  vec4 v2 = texture(cc_jointTexture, vec2((x + 1.5) * invSize, y));
  vec4 v3 = texture(cc_jointTexture, vec2((x + 2.5) * invSize, y));
  return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));
}
#else
mat4 getJointMatrix(float i)
{
  highp float x, y, invSize;
  CCGetJointTextureCoords(12.0, i, x, y, invSize);
  vec4 v1 = vec4(
      decode32(texture(cc_jointTexture, vec2((x + 0.5) * invSize, y))),
      decode32(texture(cc_jointTexture, vec2((x + 1.5) * invSize, y))),
      decode32(texture(cc_jointTexture, vec2((x + 2.5) * invSize, y))),
      decode32(texture(cc_jointTexture, vec2((x + 3.5) * invSize, y))));
  vec4 v2 = vec4(
      decode32(texture(cc_jointTexture, vec2((x + 4.5) * invSize, y))),
      decode32(texture(cc_jointTexture, vec2((x + 5.5) * invSize, y))),
      decode32(texture(cc_jointTexture, vec2((x + 6.5) * invSize, y))),
      decode32(texture(cc_jointTexture, vec2((x + 7.5) * invSize, y))));
  vec4 v3 = vec4(
      decode32(texture(cc_jointTexture, vec2((x + 8.5) * invSize, y))),
      decode32(texture(cc_jointTexture, vec2((x + 9.5) * invSize, y))),
      decode32(texture(cc_jointTexture, vec2((x + 10.5) * invSize, y))),
      decode32(texture(cc_jointTexture, vec2((x + 11.5) * invSize, y))));
  return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));
}
#endif
#else
#if CC_USE_REAL_TIME_JOINT_TEXTURE
#if CC_DEVICE_SUPPORT_FLOAT_TEXTURE
mat4 getJointMatrix(float i)
{
  float x = i;
  vec4 v1 = texture(cc_realtimeJoint, vec2(x / 256.0, 0.5 / 3.0));
  vec4 v2 = texture(cc_realtimeJoint, vec2(x / 256.0, 1.5 / 3.0));
  vec4 v3 = texture(cc_realtimeJoint, vec2(x / 256.0, 2.5 / 3.0));
  return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));
}
#else
mat4 getJointMatrix(float i)
{
  float x = 4.0 * i;
  vec4 v1 = vec4(
      decode32(texture(cc_realtimeJoint, vec2((x + 0.5) / 1024.0, 0.5 / 3.0))),
      decode32(texture(cc_realtimeJoint, vec2((x + 1.5) / 1024.0, 0.5 / 3.0))),
      decode32(texture(cc_realtimeJoint, vec2((x + 2.5) / 1024.0, 0.5 / 3.0))),
      decode32(texture(cc_realtimeJoint, vec2((x + 3.5) / 1024.0, 0.5 / 3.0))));
  vec4 v2 = vec4(
      decode32(texture(cc_realtimeJoint, vec2((x + 0.5) / 1024.0, 1.5 / 3.0))),
      decode32(texture(cc_realtimeJoint, vec2((x + 1.5) / 1024.0, 1.5 / 3.0))),
      decode32(texture(cc_realtimeJoint, vec2((x + 2.5) / 1024.0, 1.5 / 3.0))),
      decode32(texture(cc_realtimeJoint, vec2((x + 3.5) / 1024.0, 1.5 / 3.0))));
  vec4 v3 = vec4(
      decode32(texture(cc_realtimeJoint, vec2((x + 0.5) / 1024.0, 2.5 / 3.0))),
      decode32(texture(cc_realtimeJoint, vec2((x + 1.5) / 1024.0, 2.5 / 3.0))),
      decode32(texture(cc_realtimeJoint, vec2((x + 2.5) / 1024.0, 2.5 / 3.0))),
      decode32(texture(cc_realtimeJoint, vec2((x + 3.5) / 1024.0, 2.5 / 3.0))));
  return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));
}
#endif
#else
mat4 getJointMatrix(float i)
{
  int idx = int(i);
  vec4 v1 = cc_joints[idx * 3];
  vec4 v2 = cc_joints[idx * 3 + 1];
  vec4 v3 = cc_joints[idx * 3 + 2];
  return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));
}
#endif
#endif
mat4 skinMatrix()
{
  vec4 joints = vec4(a_joints);
  return getJointMatrix(joints.x) * a_weights.x + getJointMatrix(joints.y) * a_weights.y + getJointMatrix(joints.z) * a_weights.z + getJointMatrix(joints.w) * a_weights.w;
}
void CCSkin(inout vec4 position)
{
  mat4 m = skinMatrix();
  position = m * position;
}
void CCSkin(inout vec4 position, inout vec3 normal, inout vec4 tangent)
{
  mat4 m = skinMatrix();
  position = m * position;
  normal = (m * vec4(normal, 0.0)).xyz;
  tangent.xyz = (m * vec4(tangent.xyz, 0.0)).xyz;
}
#endif
void CCVertInput(inout StandardVertInput In)
{
  In.position = vec4(a_position, 1.0);
  In.normal = a_normal;
  In.tangent = a_tangent;
#if CC_USE_MORPH
  applyMorph(In.position, In.normal, In.tangent);
#endif
#if CC_USE_SKINNING
  CCSkin(In.position, In.normal, In.tangent);
#endif
}
layout(set = 0, binding = 0) uniform CCGlobal
{
  highp vec4 cc_time;
  mediump vec4 cc_screenSize;
  mediump vec4 cc_nativeSize;
  mediump vec4 cc_debug_view_mode;
  mediump vec4 cc_debug_view_composite_pack_1;
  mediump vec4 cc_debug_view_composite_pack_2;
  mediump vec4 cc_debug_view_composite_pack_3;
};
layout(set = 0, binding = 1) uniform CCCamera
{
  highp mat4 cc_matView;
  highp mat4 cc_matViewInv;
  highp mat4 cc_matProj;
  highp mat4 cc_matProjInv;
  highp mat4 cc_matViewProj;
  highp mat4 cc_matViewProjInv;
  highp vec4 cc_cameraPos;
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
#if !USE_INSTANCING
layout(set = 2, binding = 0) uniform CCLocal
{
  highp mat4 cc_matWorld;
  highp mat4 cc_matWorldIT;
  highp vec4 cc_lightingMapUVParam;
  highp vec4 cc_localShadowBias;
};
#endif
void CCGetWorldMatrixFull(out mat4 matWorld, out mat4 matWorldIT)
{
#if USE_INSTANCING
  matWorld = mat4(
      vec4(a_matWorld0.xyz, 0.0),
      vec4(a_matWorld1.xyz, 0.0),
      vec4(a_matWorld2.xyz, 0.0),
      vec4(a_matWorld0.w, a_matWorld1.w, a_matWorld2.w, 1.0));
  matWorldIT = matWorld;
#else
  matWorld = cc_matWorld;
  matWorldIT = cc_matWorldIT;
#endif
}
layout(set = 1, binding = 0) uniform Constants
{
  vec4 tilingOffset;
  vec4 albedo;
  vec4 albedoScaleAndCutoff;
  vec4 pbrParams;
  vec4 emissive;
  vec4 emissiveScaleParam;
};
#if CC_USE_FOG != 4
float LinearFog(vec4 pos, vec3 cameraPos, float fogStart, float fogEnd)
{
  vec4 wPos = pos;
  float cam_dis = distance(cameraPos, wPos.xyz);
  return clamp((fogEnd - cam_dis) / (fogEnd - fogStart), 0., 1.);
}
float ExpFog(vec4 pos, vec3 cameraPos, float fogStart, float fogDensity, float fogAtten)
{
  vec4 wPos = pos;
  float cam_dis = max(distance(cameraPos, wPos.xyz) - fogStart, 0.0) / fogAtten * 4.;
  float f = exp(-cam_dis * fogDensity);
  return f;
}
float ExpSquaredFog(vec4 pos, vec3 cameraPos, float fogStart, float fogDensity, float fogAtten)
{
  vec4 wPos = pos;
  float cam_dis = max(distance(cameraPos, wPos.xyz) - fogStart, 0.0) / fogAtten * 4.;
  float f = exp(-cam_dis * cam_dis * fogDensity * fogDensity);
  return f;
}
float LayeredFog(vec4 pos, vec3 cameraPos, float fogTop, float fogRange, float fogAtten)
{
  vec4 wPos = pos;
  vec3 camWorldProj = cameraPos.xyz;
  camWorldProj.y = 0.;
  vec3 worldPosProj = wPos.xyz;
  worldPosProj.y = 0.;
  float fDeltaD = distance(worldPosProj, camWorldProj) / fogAtten * 2.0;
  float fDeltaY, fDensityIntegral;
  if (cameraPos.y > fogTop)
  {
    if (wPos.y < fogTop)
    {
      fDeltaY = (fogTop - wPos.y) / fogRange * 2.0;
      fDensityIntegral = fDeltaY * fDeltaY * 0.5;
    }
    else
    {
      fDeltaY = 0.;
      fDensityIntegral = 0.;
    }
  }
  else
  {
    if (wPos.y < fogTop)
    {
      float fDeltaA = (fogTop - cameraPos.y) / fogRange * 2.;
      float fDeltaB = (fogTop - wPos.y) / fogRange * 2.;
      fDeltaY = abs(fDeltaA - fDeltaB);
      fDensityIntegral = abs((fDeltaA * fDeltaA * 0.5) - (fDeltaB * fDeltaB * 0.5));
    }
    else
    {
      fDeltaY = abs(fogTop - cameraPos.y) / fogRange * 2.;
      fDensityIntegral = abs(fDeltaY * fDeltaY * 0.5);
    }
  }
  float fDensity;
  if (fDeltaY != 0.)
  {
    fDensity = (sqrt(1.0 + ((fDeltaD / fDeltaY) * (fDeltaD / fDeltaY)))) * fDensityIntegral;
  }
  else
  {
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
#if !CC_USE_ACCURATE_FOG
layout(location = 0) out mediump float v_fog_factor;
#endif
void CC_TRANSFER_FOG(vec4 pos)
{
#if !CC_USE_ACCURATE_FOG
  CC_TRANSFER_FOG_BASE(pos, v_fog_factor);
#endif
}
layout(location = 1) out highp vec4 v_shadowPos;
layout(set = 0, binding = 2) uniform CCShadow
{
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
layout(set = 0, binding = 3) uniform CCCSM
{
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
#if CC_RECEIVE_SHADOW
layout(set = 0, binding = 4) uniform highp sampler2D cc_shadowMap;
layout(set = 0, binding = 6) uniform highp sampler2D cc_spotShadowMap;
#if CC_SUPPORT_CASCADED_SHADOW_MAP
#if CC_CASCADED_LAYERS_TRANSITION
int CCGetCSMLevel(layout(location = 2) out bool transitionArea, out float ratio, out vec4 csmPos, out vec4 shadowProjDepthInfo, out vec4 shadowProjInfo, out vec3 shadowViewDir0, out vec3 shadowViewDir1, out vec3 shadowViewDir2, vec3 worldPos)
#else
int CCGetCSMLevel(out vec4 csmPos, out vec4 shadowProjDepthInfo, out vec4 shadowProjInfo, out vec3 shadowViewDir0, out vec3 shadowViewDir1, out vec3 shadowViewDir2, vec3 worldPos)
#endif
{
  int layer = -1;
  highp float layerThreshold = cc_csmViewDir0[0].w;
  for (int i = 0; i < 4; i++)
  {
    vec4 shadowPos = cc_matCSMViewProj[i] * vec4(worldPos.xyz, 1.0);
    vec3 clipPos = shadowPos.xyz / shadowPos.w * 0.5 + 0.5;
    if (clipPos.x >= (0.0 + layerThreshold) && clipPos.x <= (1.0 - layerThreshold) &&
        clipPos.y >= (0.0 + layerThreshold) && clipPos.y <= (1.0 - layerThreshold) &&
        clipPos.z >= 0.0 && clipPos.z <= 1.0 && layer < 0)
    {
#if CC_CASCADED_LAYERS_TRANSITION
      highp float maxRange = 1.0 - cc_csmSplitsInfo.x - layerThreshold;
      highp float minRange = cc_csmSplitsInfo.x - layerThreshold;
      if (clipPos.x <= minRange || clipPos.x >= maxRange ||
          clipPos.y <= minRange || clipPos.y >= maxRange)
      {
        if (clipPos.x >= layerThreshold && clipPos.x <= cc_csmSplitsInfo.x)
        {
          ratio = (clipPos.x - layerThreshold) / (cc_csmSplitsInfo.x - layerThreshold);
        }
        if (clipPos.x >= maxRange && clipPos.x <= 1.0 - layerThreshold)
        {
          ratio = (clipPos.x - maxRange) / (cc_csmSplitsInfo.x - layerThreshold);
        }
        if (clipPos.y >= 0.0 && clipPos.y <= cc_csmSplitsInfo.x)
        {
          ratio = min((clipPos.y - layerThreshold) / (cc_csmSplitsInfo.x - layerThreshold), 1.0);
        }
        if (clipPos.y >= maxRange && clipPos.y <= 1.0 - layerThreshold)
        {
          ratio = (clipPos.y - maxRange) / (cc_csmSplitsInfo.x - layerThreshold);
        }
        transitionArea = true;
      }
#endif
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
#else
#endif
#endif
#if CC_RECEIVE_SHADOW
vec2 CCGetShadowBias()
{
#if USE_INSTANCING
  return vec2(a_localShadowBias.x + cc_shadowWHPBInfo.w, a_localShadowBias.y + cc_shadowLPNNInfo.z);
#else
  return vec2(cc_localShadowBias.x + cc_shadowWHPBInfo.w, cc_localShadowBias.y + cc_shadowLPNNInfo.z);
#endif
}
#endif
#if CC_USE_LIGHT_PROBE
#if USE_INSTANCING
layout(location = 3) out mediump vec4 v_sh_linear_const_r;
layout(location = 4) out mediump vec4 v_sh_linear_const_g;
layout(location = 5) out mediump vec4 v_sh_linear_const_b;
#endif
#endif
void CC_TRANSFER_SH()
{
#if CC_USE_LIGHT_PROBE
#if USE_INSTANCING
  v_sh_linear_const_r = a_sh_linear_const_r;
  v_sh_linear_const_g = a_sh_linear_const_g;
  v_sh_linear_const_b = a_sh_linear_const_b;
#endif
#endif
}
#if USE_VERTEX_COLOR
layout(location = 16) in vec4 a_color;
layout(location = 6) out lowp vec4 v_color;
#endif
layout(location = 7) out vec3 v_position;
layout(location = 8) out mediump vec3 v_normal;
layout(location = 9) out vec2 v_uv;
#if HAS_SECOND_UV
layout(location = 10) out mediump vec2 v_uv1;
#endif
#if CC_RECEIVE_SHADOW
layout(location = 11) out mediump vec2 v_shadowBias;
#endif
#if USE_NORMAL_MAP
layout(location = 12) out mediump vec4 v_tangent;
#endif
#if HAS_SECOND_UV || CC_USE_LIGHTMAP
layout(location = 17) in vec2 a_texCoord1;
#endif
#if CC_USE_LIGHTMAP && !CC_FORWARD_ADD
layout(location = 13) out vec3 v_luv;
void CCLightingMapCaclUV()
{
#if !USE_INSTANCING
  v_luv.xy = cc_lightingMapUVParam.xy + a_texCoord1 * cc_lightingMapUVParam.z;
  v_luv.z = cc_lightingMapUVParam.w;
#else
  v_luv.xy = a_lightingMapUVParam.xy + a_texCoord1 * a_lightingMapUVParam.z;
  v_luv.z = a_lightingMapUVParam.w;
#endif
}
#endif
void main()
{
  StandardVertInput In;
  CCVertInput(In);
  mat4 matWorld, matWorldIT;
  CCGetWorldMatrixFull(matWorld, matWorldIT);
  vec4 pos = matWorld * In.position;
  v_position = pos.xyz;
  v_normal = normalize((matWorldIT * vec4(In.normal, 0.0)).xyz);
#if CC_RECEIVE_SHADOW
  v_shadowBias = CCGetShadowBias();
#endif
#if USE_TWOSIDE
  vec3 viewDirect = normalize(cc_cameraPos.xyz - v_position);
  v_normal *= dot(v_normal, viewDirect) < 0.0 ? -1.0 : 1.0;
#endif
#if USE_NORMAL_MAP
  v_tangent.xyz = normalize((matWorld * vec4(In.tangent.xyz, 0.0)).xyz);
  v_tangent.w = In.tangent.w;
#endif
  v_uv = a_texCoord * tilingOffset.xy + tilingOffset.zw;
#if SAMPLE_FROM_RT
  v_uv = cc_cameraPos.w > 1.0 ? vec2(v_uv.x, 1.0 - v_uv.y) : v_uv;
#endif
#if HAS_SECOND_UV
  v_uv1 = a_texCoord1 * tilingOffset.xy + tilingOffset.zw;
#if SAMPLE_FROM_RT
  v_uv1 = cc_cameraPos.w > 1.0 ? vec2(v_uv1.x, 1.0 - v_uv1.y) : v_uv1;
#endif
#endif
#if USE_VERTEX_COLOR
  v_color = a_color;
#endif
  CC_TRANSFER_FOG(pos);
  v_shadowPos = cc_matLightViewProj * pos;
  CC_TRANSFER_SH();
#if CC_USE_LIGHTMAP && !CC_FORWARD_ADD
  CCLightingMapCaclUV();
#endif
  gl_Position = cc_matProj * (cc_matView * matWorld) * In.position;
}