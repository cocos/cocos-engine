// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 model;
uniform mat4 viewProj;
uniform mat3 normalMatrix;

varying vec3 normal_w;
varying vec3 pos_w;

#if USE_NORMAL_TEXTURE || USE_DIFFUSE_TEXTURE || USE_EMISSIVE_TEXTURE
  attribute vec2 a_uv0;
  uniform vec2 mainTiling;
  uniform vec2 mainOffset;
  varying vec2 uv0;
#endif

#if USE_SKINNING
  #include <skinning>
#endif

#if USE_SHADOW_MAP
  #if NUM_SHADOW_LIGHTS > 0
    #pragma for id in range(0, NUM_SHADOW_LIGHTS)
      uniform mat4 lightViewProjMatrix_{id};
      uniform float minDepth_{id};
      uniform float maxDepth_{id};
      varying vec4 pos_lightspace_{id};
      varying float vDepth_{id};
    #pragma endFor
  #endif
#endif

vec4 vert () {
  vec4 pos = vec4(a_position, 1);

  #if USE_SKINNING
    mat4 skinMat = skinMatrix();
    pos = skinMat * pos;
  #endif

  pos_w = (model * pos).xyz;
  pos = viewProj * model * pos;

  #if USE_NORMAL_TEXTURE || USE_DIFFUSE_TEXTURE || USE_EMISSIVE_TEXTURE
    uv0 = a_uv0 * mainTiling + mainOffset;
  #endif

  vec4 normal = vec4(a_normal, 0);
  #if USE_SKINNING
    normal = skinMat * normal;
  #endif
  normal_w = normalMatrix * normal.xyz;

  #if USE_SHADOW_MAP
    #if NUM_SHADOW_LIGHTS > 0
      #pragma for id in range(0, NUM_SHADOW_LIGHTS)
        pos_lightspace_{id} = lightViewProjMatrix_{id} * vec4(pos_w, 1.0);
        vDepth_{id} = (pos_lightspace_{id}.z + minDepth_{id}) / (minDepth_{id} + maxDepth_{id});
      #pragma endFor
    #endif
  #endif

  return pos;
}
