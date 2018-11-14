// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

### VERT ###

attribute vec3 a_position;

uniform mat4 view;
uniform mat4 proj;

varying vec3 viewDir;

void main() {
  mat4 rotView = mat4(mat3(view));
  vec4 clipPos = proj * rotView * vec4(a_position, 1.0);

  gl_Position = clipPos.xyww;
  viewDir = a_position;
}

### FRAG ###

varying vec3 viewDir;

uniform samplerCube cubeMap;
#include <gamma-correction>
#include <unpack>

void main() {
#if USE_RGBE_CUBEMAP
    vec3 c = unpackRGBE(textureCube(cubeMap, viewDir));
    c = linearToGammaSpaceRGB(c / (1.0 + c));
    gl_FragColor = vec4(c, 1.0);
#else
    gl_FragColor = textureCube(cubeMap, viewDir);
#endif
}
