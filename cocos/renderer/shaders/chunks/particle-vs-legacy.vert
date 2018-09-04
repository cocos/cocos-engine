#include <particle-common.vert>
attribute vec3 a_position; // center position
attribute vec3 a_uv;  // xy:vertex index,z:frame index
attribute vec2 a_uv0; // size, angle
attribute vec4 a_color;
#if USE_STRETCHED_BILLBOARD
attribute vec3 a_color0; // velocity.x, velocity.y, velocity.z, scale
#endif


void lpvs_main() {
  vec4 pos = vec4(a_position, 1);
#if USE_STRETCHED_BILLBOARD
  vec4 velocity = vec4(a_color0.xyz,0);
#endif

#if !USE_WORLD_SPACE
//   // simulate in world space. apply model matrix on CPU side.
// #else
  pos = model * pos;
  #if USE_STRETCHED_BILLBOARD
  velocity = model * velocity;
  #endif
#endif

  vec2 cornerOffset = vec2((a_uv.x - 0.5) * a_uv0.x, (a_uv.y - 0.5) * a_uv0.x);
#if !USE_STRETCHED_BILLBOARD
//   // rotation will not be applied in stretchedBillboard mode(Unity).
// #else
  // rotation
  float xOS = cos(a_uv0.y) * cornerOffset.x - sin(a_uv0.y) * cornerOffset.y;
  float yOS = sin(a_uv0.y) * cornerOffset.x + cos(a_uv0.y) * cornerOffset.y;
  cornerOffset.x = xOS;
  cornerOffset.y = yOS;
#endif

  computeVertPos(pos,cornerOffset
  #if USE_BILLBOARD || USE_VERTICAL_BILLBOARD
    ,view
  #endif
  #if USE_STRETCHED_BILLBOARD
    ,eye
    ,velocity
    ,velocityScale
    ,lengthScale
    ,a_uv0.x
    ,a_uv.x
  #endif
  );

  pos = viewProj * pos;

  uv = computeUV(a_uv.z,a_uv.xy,frameTile) * mainTiling + mainOffset;

  color = a_color;

  gl_Position = pos;
}
