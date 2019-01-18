// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

vec4 packDepthToRGBA(float depth) {
  vec4 ret = vec4(1.0, 255.0, 65025.0, 160581375.0) * depth;
  ret = fract(ret);
  ret -= ret.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);
  return ret;
}

float unpackRGBAToDepth(vec4 color) {
  return dot(color, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 160581375.0));
}
