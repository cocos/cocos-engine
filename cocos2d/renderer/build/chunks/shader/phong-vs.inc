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
}

out mediump vec2 v_uv0;
out lowp vec4 v_color;
out vec3 v_worldNormal;
out vec3 v_worldPos;

void main () {
  StandardVertInput In;
  CCVertInput(In);

  vec4 position = In.position;
  vec4 normal = vec4(In.normal, 0);

  v_worldPos = (cc_matWorld * position).xyz;
  v_worldNormal = (cc_matWorldIT * normal).xyz;
  v_color = In.color;
  v_uv0 = In.uv * mainTiling + mainOffset;

  CLAC_SHADOW(v_worldPos);
  
  gl_Position = cc_matViewProj * cc_matWorld * position;
}
