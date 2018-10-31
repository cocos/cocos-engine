// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#include <gamma-correction.frag>

uniform vec4 color;

varying vec3 normal_w;

void main () {
  vec3 N = normalize(normal_w);
  vec3 L = normalize(vec3(1, 2, 3));

  vec3 diffuse = color.rgb * (0.2 + max(0.0, dot(N, L)) * 0.8);

  gl_FragColor = linearToGammaSpaceRGBA(vec4(diffuse, color.a));
}
