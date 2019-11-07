// Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

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