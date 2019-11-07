// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#pragma builtin(global)
uniform CCGlobal {
  vec4 cc_time; // x: global time since game started, in seconds
  vec4 cc_screenSize; // xy: screen size, zw: inverse screen size
  vec4 cc_screenScale; // xy: screen scale, zw: inverse screen scale
  vec4 cc_nativeSize; // xy: shading size, zw: inverse shading size
  mat4 cc_matView; // view matrix
  mat4 cc_matViewInv; // inverse view matrix
  mat4 cc_matProj; // projection matrix
  mat4 cc_matProjInv; // inverse projection matrix
  mat4 cc_matViewProj; // view-projection matrix
  mat4 cc_matViewProjInv; // inverse view-projection matrix
  vec4 cc_cameraPos; // xyz: camera position
  vec4 cc_exposure; // x: exposure, y: inverse exposure, z: HDR flag, w: exposure scale
  vec4 cc_mainLitDir; // xyz: main direcitonal light direction
  vec4 cc_mainLitColor; // xyz: main direcitonal light color, w: intensity
  vec4 cc_ambientSky; //xyz: sky illumination color, w: intensity
  vec4 cc_ambientGround; // xyz: ground albedo color, w: envmap LOD
};
