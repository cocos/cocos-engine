// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#if _USE_SHADOW_MAP
  #include <packing>

  #if _NUM_SHADOW_LIGHTS > 0
    #pragma for id in range(0, _NUM_SHADOW_LIGHTS)
      uniform sampler2D cc_shadowMap_{id};
      uniform float cc_darkness_{id};
      uniform float cc_depthScale_{id};
      uniform float cc_frustumEdgeFalloff_{id};
      varying vec4 v_posLightSpace{id};
      varying float v_depth{id};
    #pragma endFor
  #endif

  float computeFallOff(float esm, vec2 coords, float frustumEdgeFalloff) {
    float mask = smoothstep(1.0 - frustumEdgeFalloff, 1.0, clamp(dot(coords, coords), 0.0, 1.0));
    return mix(esm, 1.0, mask);
  }

  float computeShadowESM(sampler2D shadowMap, vec4 pos_lightspace, float vDepth, float depthScale, float darkness, float frustumEdgeFalloff) {
    vec2 projCoords = pos_lightspace.xy / pos_lightspace.w;
    vec2 shadowUV = projCoords * 0.5 + vec2(0.5);
    if (shadowUV.x < 0.0 || shadowUV.x > 1.0 || shadowUV.y < 0.0 || shadowUV.y > 1.0) {
      return 1.0;
    }
    float currentDepth = clamp(vDepth, 0.0, 1.0);
    float closestDepth = unpackRGBAToDepth(texture2D(shadowMap, shadowUV));
    //float esm = clamp(exp(min(87.0, -depthScale * (currentDepth - closestDepth))), 1.0 - darkness, 1.0);
    float esm = clamp(exp(-depthScale * (currentDepth - closestDepth)), 1.0 - darkness, 1.0);
    return computeFallOff(esm, projCoords, frustumEdgeFalloff);
  }

  float computeShadow() {
    float shadow = 1.0;
    #if _NUM_SHADOW_LIGHTS > 0
      #pragma for id in range(0, _NUM_SHADOW_LIGHTS)
        shadow *= computeShadowESM(cc_shadowMap_{id}, v_posLightSpace{id}, v_depth{id}, cc_depthScale_{id}, cc_darkness_{id}, cc_frustumEdgeFalloff_{id});
      #pragma endFor
    #endif
    return shadow;
  }

#endif