// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

varying vec3 viewDir;

uniform samplerCube cubeMap;
#include <gamma-correction.frag>
#include <unpack.frag>

void main() {
#if USE_RGBE_CUBEMAP
    vec3 c = unpackRGBE(textureCube(cubeMap, viewDir));
    c = linearToGammaSpaceRGB(c / (1.0 + c));
    gl_FragColor = vec4(c, 1.0);
#else
    gl_FragColor = textureCube(cubeMap, viewDir);
#endif
}