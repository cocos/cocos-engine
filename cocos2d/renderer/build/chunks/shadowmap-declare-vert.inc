// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
#if _USE_SHADOW_MAP
  #if _NUM_SHADOW_LIGHTS > 0
    #pragma for id in range(0, _NUM_SHADOW_LIGHTS)
      uniform mat4 cc_lightViewProjMatrix_{id};
      uniform float cc_minDepth_{id};
      uniform float cc_maxDepth_{id};
      varying vec4 v_posLightSpace{id};
      varying float v_depth{id};
    #pragma endFor
  #endif
#endif

void CLAC_SHADOW () {
  #if _USE_SHADOW_MAP
    #if _NUM_SHADOW_LIGHTS > 0
      #pragma for id in range(0, _NUM_SHADOW_LIGHTS)
        v_posLightSpace{id} = cc_lightViewProjMatrix_{id} * vec4(v_worldPos, 1.0);
        v_depth{id} = (v_posLightSpace{id}.z + cc_minDepth_{id}) / (cc_minDepth_{id} + cc_maxDepth_{id});
      #pragma endFor
    #endif
  #endif
}