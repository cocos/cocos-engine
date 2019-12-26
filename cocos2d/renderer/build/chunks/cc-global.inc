// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

// have to specify precisions explicitly
// if shared among stages with different precisions
#pragma builtin(global)
uniform CCGlobal {
  highp   vec4 cc_time; // x: global time since started in seconds, y: delta time for current frame, z: total frames since started
  mediump vec4 cc_screenSize; // xy: screen size, zw: inverse screen size
  mediump vec4 cc_screenScale; // xy: screen scale, zw: inverse screen scale
  mediump vec4 cc_nativeSize; // xy: shading size, zw: inverse shading size
  highp   mat4 cc_matView; // view matrix
  mediump mat4 cc_matViewInv; // inverse view matrix
  mediump mat4 cc_matProj; // projection matrix
  mediump mat4 cc_matProjInv; // inverse projection matrix
  mediump mat4 cc_matViewProj; // view-projection matrix
  mediump mat4 cc_matViewProjInv; // inverse view-projection matrix
  mediump vec4 cc_cameraPos; // xyz: camera position
  // mediump vec4 cc_exposure; // x: exposure, y: inverse exposure, z: HDR flag, w: exposure scale
  // mediump vec4 cc_mainLitDir; // xyz: main direcitonal light direction
  // mediump vec4 cc_mainLitColor; // xyz: main direcitonal light color, w: intensity
  // mediump vec4 cc_ambientSky; //xyz: sky illumination color, w: intensity
  // mediump vec4 cc_ambientGround; // xyz: ground albedo color, w: envmap LOD
};
