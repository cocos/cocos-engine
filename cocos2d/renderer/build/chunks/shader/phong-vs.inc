// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

#include <cc-local>
#include <cc-global>
#include <input-standard>
#include <shadow>

#define CC_USE_TEXTURE CC_USE_ATTRIBUTE_UV0 && (USE_DIFFUSE_TEXTURE || USE_EMISSIVE_TEXTURE || USE_SPECULAR_TEXTURE || USE_NORMAL_TEXTURE)

uniform MAIN_TILING {
  vec2 mainTiling;
  vec2 mainOffset;
};

#if CC_USE_TEXTURE
  out mediump vec2 v_uv0;
#endif

#if CC_USE_ATTRIBUTE_COLOR
  out lowp vec4 v_color;
#endif

#if USE_NORMAL_TEXTURE
  out vec3 v_tangent;
  out vec3 v_bitangent;
#endif

out vec3 v_worldNormal;
out vec3 v_worldPos;
out vec3 v_viewDirection;

void main () {
  StandardVertInput In;
  CCVertInput(In);

  vec4 position = In.position;

  v_worldNormal = normalize((cc_matWorldIT * vec4(In.normal, 0)).xyz);
  v_worldPos = (cc_matWorld * position).xyz;
  v_viewDirection = normalize(cc_cameraPos.xyz - v_worldPos);
  
  #if CC_USE_TEXTURE
    v_uv0 = In.uv * mainTiling + mainOffset;
  #endif

  #if CC_USE_ATTRIBUTE_COLOR
    v_color = In.color;
  #endif

  #if USE_NORMAL_TEXTURE
    v_tangent = normalize((cc_matWorldIT * vec4(In.tangent.xyz, 0.0)).xyz);
    v_bitangent = cross(v_worldNormal, v_tangent) * In.tangent.w; // note the cross order
  #endif

  CCShadowInput(v_worldPos);
  
  gl_Position = cc_matViewProj * cc_matWorld * position;
}
