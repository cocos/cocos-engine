// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

// sRGB-linear transform approximation
// http://chilliant.blogspot.com.au/2012/08/srgb-approximations-for-hlsl.html
vec3 gammaToLinearSpaceRGB(in vec3 sRGB) { // TODO: use half maybe better.
  return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);
}

vec3 linearToGammaSpaceRGB(in vec3 RGB) { // TODO: use half maybe better.
  vec3 S1 = sqrt(RGB);
  vec3 S2 = sqrt(S1);
  vec3 S3 = sqrt(S2);
  return 0.585122381 * S1 + 0.783140355 * S2 - 0.368262736 * S3;
}

vec4 gammaToLinearSpaceRGBA(in vec4 sRGBA) {
  return vec4(gammaToLinearSpaceRGB(sRGBA.rgb), sRGBA.a);
}

vec4 linearToGammaSpaceRGBA(in vec4 RGBA) {
  return vec4(linearToGammaSpaceRGB(RGBA.rgb), RGBA.a);
}


vec4 TEXEL_TO_LINEAR (in vec4 color) {
  #if INPUT_IS_GAMMA
    return gammaToLinearSpaceRGBA(color);
  #else
    return color;
  #endif
}

vec4 LINEAR_TO_OUTPUT_TEXEL (in vec4 color) {
  #if OUTPUT_TO_GAMMA
    return linearToGammaSpaceRGBA(color);
  #else
    return color;
  #endif
}

