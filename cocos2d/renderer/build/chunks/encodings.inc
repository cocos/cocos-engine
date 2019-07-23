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

vec4 linearToLinear (in vec4 value) {
  return value;
}


// #if INPUT_IS_GAMMA
//   #define TEXEL_TO_LINEAR gammaToLinearSpaceRGBA
// #else
  #define TEXEL_TO_LINEAR linearToLinear
// #endif

// #if OUTPUT_TO_GAMMA
//   #define LINEAR_TO_OUTPUT_TEXEL linearToGammaSpaceRGBA
// #else
  #define LINEAR_TO_OUTPUT_TEXEL linearToLinear
// #endif
