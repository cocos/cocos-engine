// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

vec3 SRGBToLinear(vec3 gamma)
{
	return pow(gamma, vec3(2.2));
	//return sqrt(gamma);
}

vec3 LinearToSRGB(vec3 linear)
{
	return pow(linear, vec3(0.454545));
	//return linear * linear;
}


vec4 TEXEL_TO_LINEAR (in vec4 color) {
  #if INPUT_IS_GAMMA
    return vec4(SRGBToLinear(color.rgb), color.a);
  #else
    return color;
  #endif
}

vec4 LINEAR_TO_OUTPUT_TEXEL (in vec4 color) {
  #if OUTPUT_TO_GAMMA
    return vec4(LinearToSRGB(color.rgb), color.a);
  #else
    return color;
  #endif
}
