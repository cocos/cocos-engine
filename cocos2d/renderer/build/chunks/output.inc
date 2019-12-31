// Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.
#include <gamma>

vec4 CCFragOutput (vec4 color) {
  #if OUTPUT_TO_GAMMA
    color.rgb = LinearToSRGB(color.rgb);
  #endif
	return color;
}
