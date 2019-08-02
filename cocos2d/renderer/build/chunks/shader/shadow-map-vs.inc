// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

in vec3 a_position;

#include <cc-local>

#pragma builtin(global)
uniform CC_SHADOW_MAP {
  mat4  cc_shadow_map_lightViewProjMatrix;
  vec4  cc_shadow_map_info;        // [minDepth, maxDepth, depthScale, darkness]
  float cc_shadow_map_bias;
};

out float v_depth;

#include <skinning>

void main () {
  vec4 position = vec4(a_position, 1);

  SKIN_VERTEX(position);

  gl_Position = cc_shadow_map_lightViewProjMatrix * cc_matWorld * position;

  // compute v_depth according to active camera's minDepth and maxDepth.
  v_depth = ((gl_Position.z + cc_shadow_map_info.x) / (cc_shadow_map_info.x + cc_shadow_map_info.y)) + cc_shadow_map_bias;
}
