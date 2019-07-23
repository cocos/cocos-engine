// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.


#if USE_NORMAL_TEXTURE /* && GL_OES_standard_derivatives */
  // #extension GL_OES_standard_derivatives : enable

  uniform sampler2D normalTexture;

  // vec3 getNormal(vec3 pos, vec3 normal, in vec2 uv) {
  //   vec3 q0 = vec3( dFdx( pos.x ), dFdx( pos.y ), dFdx( pos.z ) );
  //   vec3 q1 = vec3( dFdy( pos.x ), dFdy( pos.y ), dFdy( pos.z ) );
  //   vec2 st0 = dFdx( uv.st );
  //   vec2 st1 = dFdy( uv.st );
  //   vec3 S = normalize( q0 * st1.t - q1 * st0.t );
  //   vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
  //   vec3 N = normal;
  //   vec3 mapN = texture2D(normalTexture, uv).rgb * 2.0 - 1.0;
  //   mapN.xy = 1.0 * mapN.xy;
  //   mat3 tsn = mat3( S, T, N );
  //   return normalize( tsn * mapN );
  // }
#endif

void CALC_NORMAL (inout vec3 normal, in vec3 worldPos, in vec2 uv) {
  #if USE_NORMAL_TEXTURE /*&& GL_OES_standard_derivatives*/
    // normal = getNormal(worldPos, normal, uv);
  #endif
}

