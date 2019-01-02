// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
  #if _NUM_SHADOW_LIGHTS > 0
   #pragma for id in range(0, _NUM_SHADOW_LIGHTS)
     uniform mat4 _lightViewProjMatrix_{id};
     uniform float _minDepth_{id};
     uniform float _maxDepth_{id};
     varying vec4 pos_lightspace_{id};
     varying float vDepth_{id};
   #pragma endFor
 #endif
 
  void prepareShadowData(vec3 pos_w) {
   #if _NUM_SHADOW_LIGHTS > 0
     #pragma for id in range(0, _NUM_SHADOW_LIGHTS)
       pos_lightspace_{id} = _lightViewProjMatrix_{id} * vec4(pos_w, 1.0);
       vDepth_{id} = (pos_lightspace_{id}.z + _minDepth_{id}) / (_minDepth_{id} + _maxDepth_{id});
     #pragma endFor
   #endif
 }