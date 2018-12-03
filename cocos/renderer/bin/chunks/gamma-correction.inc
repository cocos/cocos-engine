// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

// sRGB-linear transform approximation
// http://chilliant.blogspot.com.au/2012/08/srgb-approximations-for-hlsl.html
vec3 gammaToLinearSpaceRGB(vec3 sRGB) { // TODO: use half maybe better.
  return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);
}

vec3 linearToGammaSpaceRGB(vec3 RGB) { // TODO: use half maybe better.
  vec3 S1 = sqrt(RGB);
  vec3 S2 = sqrt(S1);
  vec3 S3 = sqrt(S2);
  return 0.585122381 * S1 + 0.783140355 * S2 - 0.368262736 * S3;
}

vec4 gammaToLinearSpaceRGBA(vec4 sRGBA) {
  return vec4(gammaToLinearSpaceRGB(sRGBA.rgb), sRGBA.a);
}

vec4 linearToGammaSpaceRGBA(vec4 RGBA) {
  return vec4(linearToGammaSpaceRGB(RGBA.rgb), RGBA.a);
}

// exact version
float gammaToLinearSpaceExact(float val) {
  if (val <= 0.04045) {
    return val / 12.92;
  } else if (val < 1.0) {
    return pow((val + 0.055) / 1.055, 2.4);
  } else {
    return pow(val, 2.2);
  }
}

float linearToGammaSpaceExact(float val) {
  if (val <= 0.0) {
    return 0.0;
  } else if (val <= 0.0031308) {
    return 12.92 * val;
  } else if (val < 1.0) {
    return 1.055 * pow(val, 0.4166667) - 0.055;
  } else {
    return pow(val, 0.45454545);
  }
}