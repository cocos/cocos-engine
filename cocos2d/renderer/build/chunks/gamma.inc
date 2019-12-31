// Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

// #define SRGBToLinear(gamma) pow(gamma, vec3(2.2))
#define SRGBToLinear(gamma) (gamma * gamma)

// #define LinearToSRGB(linear) pow(linear, vec3(0.454545))
#define LinearToSRGB(linear) sqrt(linear)
