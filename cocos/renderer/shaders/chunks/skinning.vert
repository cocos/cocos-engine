// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec4 a_weights;
attribute vec4 a_joints;

#if USE_JOINTS_TEXTURE
uniform sampler2D u_jointsTexture;
uniform float u_jointsTextureSize;

mat4 getBoneMatrix(const in float i) {
  float size = u_jointsTextureSize;
  float j = i * 4.0;
  float x = mod(j, size);
  float y = floor(j / size);

  float dx = 1.0 / size;
  float dy = 1.0 / size;

  y = dy * (y + 0.5);

  vec4 v1 = texture2D(u_jointsTexture, vec2(dx * (x + 0.5), y));
  vec4 v2 = texture2D(u_jointsTexture, vec2(dx * (x + 1.5), y));
  vec4 v3 = texture2D(u_jointsTexture, vec2(dx * (x + 2.5), y));
  vec4 v4 = texture2D(u_jointsTexture, vec2(dx * (x + 3.5), y));

  return mat4(v1, v2, v3, v4);
}
#else
uniform mat4 u_jointMatrices[128];

mat4 getBoneMatrix(const in float i) {
  return u_jointMatrices[int(i)];
}
#endif

mat4 skinMatrix() {
  return
    getBoneMatrix(a_joints.x) * a_weights.x +
    getBoneMatrix(a_joints.y) * a_weights.y +
    getBoneMatrix(a_joints.z) * a_weights.z +
    getBoneMatrix(a_joints.w) * a_weights.w
    ;
}