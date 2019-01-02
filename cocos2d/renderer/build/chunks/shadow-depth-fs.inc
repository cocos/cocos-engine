// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

uniform float _depthScale;
varying float vDepth;

#include <packing>

vec4 frag() {
  // doing exp() here will cause float precision issue.
  //float depth = clamp(exp(-min(87.0, _depthScale * vDepth)), 0.0, 1.0);
  return packDepthToRGBA(vDepth);
  // TODO: if support float32 * 4 color buffer?
  //gl_FragColor = vec4(depth, 1.0, 1.0, 1.0);
}
