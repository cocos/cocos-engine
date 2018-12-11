// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#if USE_NORMAL_TEXTURE
#extension GL_OES_standard_derivatives : enable
#endif

#include <common>
#include <gamma-correction>

struct LightInfo {
  vec3 diffuse;
  vec3 specular;
};

LightInfo computeDirectionalLighting(
  vec3 lightDirection,
  vec3 lightColor,
  vec3 normal,
  vec3 viewDirection,
  float glossiness
) {
  LightInfo lightingResult;
  float ndl = 0.0;
  float ndh = 0.0;
  vec3 lightDir = -normalize(lightDirection);
  ndl = max(0.0, dot(normal, lightDir));
  lightingResult.diffuse = lightColor * ndl;

  vec3 dirH = normalize(viewDirection + lightDir);
  ndh = max(0.0, dot(normal, dirH));
  ndh = (ndl == 0.0) ? 0.0: ndh;
  ndh = pow(ndh, max(1.0, glossiness * 128.0));
  lightingResult.specular = lightColor * ndh;

  return lightingResult;
}

LightInfo computePointLighting(
  vec3 lightPosition,
  vec3 lightColor,
  float lightRange,
  vec3 normal,
  vec3 positionW,
  vec3 viewDirection,
  float glossiness
) {
  LightInfo lightingResult;
  float ndl = 0.0;
  float ndh = 0.0;
  vec3 lightDir = vec3(0, 0, 0);
  float attenuation = 1.0;
  lightDir = lightPosition - positionW;
  attenuation = max(0., 1.0 - length(lightDir) / lightRange);
  lightDir = normalize(lightDir);
  ndl = max(0.0, dot(normal, lightDir));
  lightingResult.diffuse = lightColor * ndl * attenuation;

  vec3 dirH = normalize(viewDirection + lightDir);
  ndh = max(0.0, dot(normal, dirH));
  ndh = (ndl == 0.0) ? 0.0: ndh;
  ndh = pow(ndh, max(1.0, glossiness * 128.0));
  lightingResult.specular = lightColor * ndh * attenuation;

  return lightingResult;
}

LightInfo computeSpotLighting(
  vec3 lightPosition,
  vec3 lightDirection,
  vec3 lightColor,
  float lightRange,
  vec2 lightSpot,
  vec3 normal,
  vec3 positionW,
  vec3 viewDirection,
  float glossiness
) {
  LightInfo lightingResult;
  float ndl = 0.0;
  float ndh = 0.0;
  vec3 lightDir = vec3(0, 0, 0);
  float attenuation = 1.0;
  float cosConeAngle = 1.0;

  lightDir = lightPosition - positionW;
  attenuation = max(0., 1.0 - length(lightDir) / lightRange);
  lightDir = normalize(lightDir);
  cosConeAngle = max(0., dot(lightDirection, -lightDir));
  cosConeAngle = cosConeAngle < lightSpot.x ? 0.0 : cosConeAngle;
  cosConeAngle = pow(cosConeAngle,lightSpot.y);
  ndl = max(0.0, dot(normal, lightDir));
  lightingResult.diffuse = lightColor * ndl * attenuation * cosConeAngle;

  vec3 dirH = normalize(viewDirection + lightDir);
  ndh = max(0.0, dot(normal, dirH));
  ndh = (ndl == 0.0) ? 0.0: ndh;
  ndh = pow(ndh, max(1.0, glossiness * 128.0));
  lightingResult.specular = lightColor * ndh * attenuation * cosConeAngle;

  return lightingResult;
}

#if _NUM_DIR_LIGHTS > 0
  #pragma for id in range(0, _NUM_DIR_LIGHTS)
    uniform vec3 _dir_light{id}_direction;
    uniform vec3 _dir_light{id}_color;
  #pragma endFor
#endif

#if _NUM_POINT_LIGHTS > 0
  #pragma for id in range(0, _NUM_POINT_LIGHTS)
    uniform vec3 _point_light{id}_position;
    uniform vec3 _point_light{id}_color;
    uniform float _point_light{id}_range;
  #pragma endFor
#endif

#if _NUM_SPOT_LIGHTS > 0
  #pragma for id in range(0, _NUM_SPOT_LIGHTS)
    uniform vec3 _spot_light{id}_position;
    uniform vec3 _spot_light{id}_direction;
    uniform vec3 _spot_light{id}_color;
    uniform float _spot_light{id}_range;
    uniform vec2 _spot_light{id}_spot;
  #pragma endFor
#endif

LightInfo getPhongLighting(
  vec3 normal,
  vec3 positionW,
  vec3 viewDirection,
  float glossiness
) {
  LightInfo result;
  result.diffuse = vec3(0, 0, 0);
  result.specular = vec3(0, 0, 0);
  LightInfo dirLighting;
  #if _NUM_DIR_LIGHTS > 0
    #pragma for id in range(0, _NUM_DIR_LIGHTS)
      dirLighting = computeDirectionalLighting(_dir_light{id}_direction,_dir_light{id}_color,normal, viewDirection, glossiness);
      result.diffuse += dirLighting.diffuse;
      result.specular += dirLighting.specular;
    #pragma endFor
  #endif

  LightInfo pointLighting;
  #if _NUM_POINT_LIGHTS > 0
    #pragma for id in range(0, _NUM_POINT_LIGHTS)
      pointLighting = computePointLighting(_point_light{id}_position, _point_light{id}_color, _point_light{id}_range,
                                          normal, positionW, viewDirection, glossiness);
      result.diffuse += pointLighting.diffuse;
      result.specular += pointLighting.specular;
    #pragma endFor
  #endif

  LightInfo spotLighting;
  #if _NUM_SPOT_LIGHTS > 0
    #pragma for id in range(0, _NUM_SPOT_LIGHTS)
      spotLighting = computeSpotLighting(_spot_light{id}_position, _spot_light{id}_direction, _spot_light{id}_color,
                      _spot_light{id}_range, _spot_light{id}_spot,normal, positionW, viewDirection, glossiness);
      result.diffuse += spotLighting.diffuse;
      result.specular += spotLighting.specular;
    #pragma endFor
  #endif
  return result;
}

#if _USE_SHADOW_MAP
  #include <packing>
  #include <shadow-mapping>
#endif

uniform vec3 _eye;
uniform vec3 ambient;

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

vec4 frag () {
  LightInfo phongLighting;
  vec3 viewDirection = normalize(_eye - pos_w);

  phongMaterial mtl = getPhongMaterial();
  #if USE_ALPHA_TEST
    if(mtl.opacity < alphaTestThreshold) discard;
  #endif
  vec3 normal = normalize(normal_w);
  #if USE_NORMAL_TEXTURE
    normal = getNormal(pos_w, normal);
  #endif
  phongLighting = getPhongLighting(normal, pos_w, viewDirection, mtl.glossiness);
  phongLighting.diffuse += ambient;

  #if _USE_SHADOW_MAP
    float shadow = 1.0;
    #if _NUM_SHADOW_LIGHTS > 0
      #pragma for id in range(0, _NUM_SHADOW_LIGHTS)
        shadow *= computeShadowESM(_shadowMap_{id}, pos_lightspace_{id}, vDepth_{id}, _depthScale_{id}, _darkness_{id}, _frustumEdgeFalloff_{id});
      #pragma endFor
    #endif
    vec4 finalColor = composePhongShading(phongLighting, mtl, shadow);
  #else
    vec4 finalColor = composePhongShading(phongLighting, mtl, 1.0);
  #endif

  return linearToGammaSpaceRGBA(finalColor);
}
