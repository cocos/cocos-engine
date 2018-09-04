
uniform vec2 frameTile;
uniform vec2 mainTiling;
uniform vec2 mainOffset;
uniform mat4 model;
uniform mat4 viewProj;

#if USE_BILLBOARD || USE_VERTICAL_BILLBOARD
  uniform mat4 view;
#endif

#if USE_STRETCHED_BILLBOARD
  uniform vec3 eye;
  uniform float velocityScale;
  uniform float lengthScale;
#endif

varying vec2 uv;
varying vec4 color;

void computeVertPos(inout vec4 pos,vec2 vertOffset
#if USE_BILLBOARD || USE_VERTICAL_BILLBOARD
  ,mat4 view
#endif
#if USE_STRETCHED_BILLBOARD
  ,vec3 eye
  ,vec4 velocity
  ,float velocityScale
  ,float lengthScale
  ,float size
  ,float xIndex
#endif
) {
#if USE_BILLBOARD
  vec3 camRight = normalize(vec3(view[0][0], view[1][0], view[2][0]));
  vec3 camUp = normalize(vec3(view[0][1], view[1][1], view[2][1]));
  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);
#elif USE_STRETCHED_BILLBOARD
  vec3 camRight = normalize(cross(pos.xyz - eye, velocity.xyz));
  vec3 camUp = velocity.xyz * velocityScale + normalize(velocity.xyz) * lengthScale * size;
  pos.xyz += (camRight * abs(vertOffset.x) * sign(vertOffset.y)) - camUp * xIndex;
#elif USE_HORIZONTAL_BILLBOARD
  vec3 camRight = vec3(1, 0, 0);
  vec3 camUp = vec3(0, 0, -1);
  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);
#elif USE_VERTICAL_BILLBOARD
  vec3 camRight = normalize(vec3(view[0][0], view[1][0], view[2][0]));
  vec3 camUp = vec3(0, 1, 0);
  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);
#else
  pos.x += vertOffset.x;
  pos.y += vertOffset.y;
#endif
}


vec2 computeUV(float frameIndex,vec2 vertIndex,vec2 frameTile) {
  vec2 aniUV = vec2(0, floor(frameIndex * frameTile.y));
  aniUV.x = floor(frameIndex * frameTile.x * frameTile.y - aniUV.y * frameTile.x);
  aniUV.y = frameTile.y - aniUV.y - 1.0;
  return (aniUV.xy + vertIndex) / vec2(frameTile.x, frameTile.y);
}
