// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#if USE_NORMAL_TEXTURE
#extension GL_OES_standard_derivatives : enable
#endif

#include <common.frag>
#include <gamma-correction.frag>
#include <phong-lighting.frag>

#if USE_SHADOW_MAP
  #include <packing.frag>
  #include <shadow-mapping.frag>
#endif

uniform vec3 eye;
uniform vec3 sceneAmbient;

varying vec3 normal_w;
varying vec3 pos_w;

#if USE_NORMAL_TEXTURE || USE_DIFFUSE_TEXTURE || USE_EMISSIVE_TEXTURE
  varying vec2 uv0;
#endif

struct phongMaterial
{
  vec3 diffuse;
  vec3 emissive;
  vec3 specular;
  float glossiness;
  float opacity;
};

uniform vec4 diffuseColor;
#if USE_DIFFUSE_TEXTURE
  uniform sampler2D diffuse_texture;
#endif

#if USE_EMISSIVE
  uniform vec3 emissiveColor;
  #if USE_EMISSIVE_TEXTURE
    uniform sampler2D emissive_texture;
  #endif
#endif

#if USE_SPECULAR
  uniform vec3 specularColor;
  uniform float glossiness;
  #if USE_SPECULAR_TEXTURE
    uniform sampler2D specular_texture;
  #endif
#endif

#if USE_NORMAL_TEXTURE
  uniform sampler2D normal_texture;
  uniform float normalScale;  //this is not used yet
  vec3 getNormal(vec3 pos, vec3 normal) {
    vec3 q0 = vec3( dFdx( pos.x ), dFdx( pos.y ), dFdx( pos.z ) );
    vec3 q1 = vec3( dFdy( pos.x ), dFdy( pos.y ), dFdy( pos.z ) );
    vec2 st0 = dFdx( uv0.st );
    vec2 st1 = dFdy( uv0.st );
    vec3 S = normalize( q0 * st1.t - q1 * st0.t );
    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
    vec3 N = normal;
    vec3 mapN = texture2D(normal_texture, uv0).rgb * 2.0 - 1.0;
    mapN.xy = 1.0 * mapN.xy;
    mat3 tsn = mat3( S, T, N );
    return normalize( tsn * mapN );
  }
#endif

#if USE_ALPHA_TEST
  uniform float alphaTestThreshold;
#endif

phongMaterial getPhongMaterial() {
  phongMaterial result;

  #if USE_DIFFUSE_TEXTURE
    vec4 baseColor = diffuseColor * gammaToLinearSpaceRGBA(texture2D(diffuse_texture, uv0));
    result.diffuse = baseColor.rgb;
    result.opacity = baseColor.a;
  #else
    result.diffuse = diffuseColor.rgb;
    result.opacity = diffuseColor.a;
  #endif

  #if USE_EMISSIVE
    result.emissive = gammaToLinearSpaceRGB(emissiveColor);
    #if USE_EMISSIVE_TEXTURE
      result.emissive *= gammaToLinearSpaceRGB(texture2D(emissive_texture, uv0).rgb);
    #endif
  #endif

  #if USE_SPECULAR
    result.specular = gammaToLinearSpaceRGB(specularColor);
    #if USE_SPECULAR_TEXTURE
      result.specular = gammaToLinearSpaceRGB(texture2D(specular_texture, uv0).rgb);
    #endif

    result.glossiness = glossiness;
  #endif

  return result;
}

vec4 composePhongShading(LightInfo lighting, phongMaterial mtl, float shadow)
{
  vec4 o = vec4(0.0, 0.0, 0.0, 1.0);

  //diffuse is always calculated
  o.xyz = lighting.diffuse * mtl.diffuse;
  #if USE_EMISSIVE
    o.xyz += mtl.emissive;
  #endif
  #if USE_SPECULAR
    o.xyz += lighting.specular * mtl.specular;
  #endif
  o.xyz *= shadow;
  o.w = mtl.opacity;

  return o;
}

void main () {
  LightInfo phongLighting;
  vec3 viewDirection = normalize(eye - pos_w);

  phongMaterial mtl = getPhongMaterial();
  #if USE_ALPHA_TEST
    if(mtl.opacity < alphaTestThreshold) discard;
  #endif
  vec3 normal = normalize(normal_w);
  #if USE_NORMAL_TEXTURE
    normal = getNormal(pos_w, normal);
  #endif
  phongLighting = getPhongLighting(normal, pos_w, viewDirection, mtl.glossiness);
  phongLighting.diffuse += sceneAmbient;

  #if USE_SHADOW_MAP
    float shadow = 1.0;
    #if NUM_SHADOW_LIGHTS > 0
      #pragma for id in range(0, NUM_SHADOW_LIGHTS)
        shadow *= computeShadowESM(shadowMap_{id}, pos_lightspace_{id}, vDepth_{id}, depthScale_{id}, darkness_{id}, frustumEdgeFalloff_{id});
      #pragma endFor
    #endif
    vec4 finalColor = composePhongShading(phongLighting, mtl, shadow);
  #else
    vec4 finalColor = composePhongShading(phongLighting, mtl, 1.0);
  #endif

  gl_FragColor = linearToGammaSpaceRGBA(finalColor);
}