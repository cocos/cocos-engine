// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

in vec3 a_position;

void CCDecode (out vec4 position) {
  position = vec4(a_position, 1.0);
}
