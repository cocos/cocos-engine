// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

precision highp float;

uniform float cc_depthScale;
varying float vDepth;

#include <packing>

void main () {
  // doing exp() here will cause float precision issue.
  //float depth = clamp(exp(-min(87.0, cc_depthScale * vDepth)), 0.0, 1.0);
  gl_FragColor = packDepthToRGBA(vDepth);
  // TODO: if support float32 * 4 color buffer?
  //gl_FragColor = vec4(depth, 1.0, 1.0, 1.0);
}
