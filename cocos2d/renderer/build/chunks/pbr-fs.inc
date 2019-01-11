// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

#if USE_NORMAL_TEXTURE
#extension GL_OES_standard_derivatives : enable
#endif

#if USE_TEX_LOD
#extension GL_EXT_shader_texture_lod: enable
#endif

#include <common>
#include <gamma-correction>

struct LightInfo {
  vec3 lightDir;
  vec3 radiance;
};

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
    uniform vec2 _spot_light{id}_spot;
    uniform float _spot_light{id}_range;
  #pragma endFor
#endif

// directional light
LightInfo computeDirectionalLighting(
  vec3 lightDirection,
  vec3 lightColor
) {
  LightInfo ret;
  ret.lightDir = -normalize(lightDirection);
  ret.radiance = lightColor;

  return ret;
}

// point light
LightInfo computePointLighting(
  vec3 lightPosition,
  vec3 positionW,
  vec3 lightColor,
  float lightRange
) {
  LightInfo ret;
  vec3 lightDir = lightPosition - positionW;
  float attenuation = max(0.0, 1.0 - length(lightDir) / lightRange);
  ret.lightDir = normalize(lightDir);
  ret.radiance = lightColor * attenuation;

  return ret;
}

// spot light
LightInfo computeSpotLighting(
  vec3 lightPosition,
  vec3 positionW,
  vec3 lightDirection,
  vec3 lightColor,
  vec2 lightSpot,
  float lightRange
) {
  LightInfo ret;
  vec3 lightDir = lightPosition - positionW;
  float attenuation = max(0., 1.0 - length(lightDir) / lightRange);
  float cosConeAngle = max(0., dot(lightDirection, -lightDir));
  cosConeAngle = cosConeAngle < lightSpot.x ? 0.0 : cosConeAngle;
  cosConeAngle = pow(cosConeAngle,lightSpot.y);
  ret.lightDir = normalize(lightDir);
  ret.radiance = lightColor * attenuation * cosConeAngle;

  return ret;
}

#include <unpack>

#if _USE_SHADOW_MAP
  #include <packing>
  #include <shadow-mapping>
#endif

uniform vec3 _eye;

varying vec3 pos_w;
varying vec3 normal_w;

#if USE_ALBEDO_TEXTURE || USE_NORMAL_TEXTURE || USE_MRA_TEXTURE || USE_METALLIC_TEXTURE || USE_ROUGHNESS_TEXTURE || USE_AO_TEXTURE || USE_EMISSIVE_TEXTURE
  varying vec2 uv0;
#endif

#if USE_IBL
  uniform samplerCube diffuseEnvTexture;
  uniform samplerCube specularEnvTexture;
  uniform sampler2D brdfLUT;
  #if USE_TEX_LOD
    uniform float maxReflectionLod;
  #endif
#endif

// material parameters
uniform vec4 albedo;
#if USE_ALBEDO_TEXTURE
  uniform sampler2D albedo_texture;
#endif

#if USE_MRA_TEXTURE
  uniform sampler2D mra_texture;
#endif

uniform float metallic;
#if USE_METALLIC_TEXTURE
  uniform sampler2D metallic_texture;
#endif

uniform float roughness;
#if USE_ROUGHNESS_TEXTURE
  uniform sampler2D roughness_texture;
#endif

uniform float ao;
#if USE_AO_TEXTURE
  uniform sampler2D ao_texture;
#endif

#if USE_EMISSIVE
  uniform vec3 emissive;
  #if USE_EMISSIVE_TEXTURE
    uniform sampler2D emissive_texture;
  #endif
#endif

#if USE_ALPHA_TEST
  uniform float alphaTestThreshold;
#endif

#if USE_NORMAL_TEXTURE
  uniform sampler2D normal_texture;
  // get world-space normal from normal texture
  vec3 getNormalFromTexture() {
    vec3 tangentNormal = texture2D(normal_texture, uv0).rgb * 2.0 - 1.0;
    vec3 q1  = dFdx(pos_w);
    vec3 q2  = dFdy(pos_w);
    vec2 st1 = dFdx(uv0);
    vec2 st2 = dFdy(uv0);
    vec3 N   = normalize(normal_w);
    vec3 T   = normalize(q1*st2.t - q2*st1.t);
    vec3 B   = -normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);

    return normalize(TBN * tangentNormal);
  }
#endif

// Cook-Torrance BRDF _model
// D() Normal distribution function (Trowbridge-Reitz GGX)
// https://disney-animation.s3.amazonaws.com/library/s2012_pbs_disney_brdf_notes_v2.pdf
float distributionGGX(vec3 N, vec3 H, float roughness) {
  float a = roughness * roughness;
  float a2 = a * a;
  float NdotH = max(dot(N, H), 0.0);
  float NdotH2 = NdotH * NdotH;
  float nom   = a2;
  float denom = (NdotH2 * (a2 - 1.0) + 1.0);
  denom = PI * denom * denom;

  return nom / denom;
}
// G() Geometry function (Smith's Schlick GGX)
// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf
float geometrySchlickGGX(float NdotV, float roughness) {
  float r = (roughness + 1.0);
  float k = (r * r) / 8.0;
  float nom   = NdotV;
  float denom = NdotV * (1.0 - k) + k;

  return nom / denom;
}
float geometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
  float NdotV = max(dot(N, V), 0.0);
  float NdotL = max(dot(N, L), 0.0);
  float ggx2 = geometrySchlickGGX(NdotV, roughness);
  float ggx1 = geometrySchlickGGX(NdotL, roughness);

  return ggx1 * ggx2;
}
// F() Fresnel equation (Fresnel-Schlick approximation)
// Optimized variant (presented by Epic at SIGGRAPH '13)
// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
  float fresnel = exp2((-5.55473 * cosTheta - 6.98316) * cosTheta);
  return F0 + (1.0 - F0) * fresnel;
}
vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness) {
  float fresnel = exp2((-5.55473 * cosTheta - 6.98316) * cosTheta);
  return F0 + (max(vec3(1.0 - roughness), F0) - F0) * fresnel;
}

// BRDF equation
vec3 brdf(LightInfo lightInfo, vec3 N, vec3 V, vec3 F0, vec3 albedo, float metallic, float roughness) {
  vec3 H = normalize(V + lightInfo.lightDir);
  float NDF = distributionGGX(N, H, roughness);
  float G   = geometrySmith(N, V, lightInfo.lightDir, roughness);
  vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);
  vec3 nominator    = NDF * G * F;
  float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, lightInfo.lightDir), 0.0) + 0.001; // 0.001 to prevent divide by zero.
  vec3 specular = nominator / denominator;
  // kS is equal to Fresnel
  vec3 kS = F;
  // for energy conservation, the diffuse and specular light can't
  // be above 1.0 (unless the surface emits light); to preserve this
  // relationship the diffuse component (kD) should equal 1.0 - kS.
  vec3 kD = vec3(1.0) - kS;
  // multiply kD by the inverse metalness such that only non-metals
  // have diffuse lighting, or a linear blend if partly metal (pure metals
  // have no diffuse light).
  kD *= 1.0 - metallic;
  float NdotL = max(dot(N, lightInfo.lightDir), 0.0);

  return (kD * albedo / PI + specular) * lightInfo.radiance * NdotL;
}

vec4 frag() {
  float opacity = 1.0;

  #if USE_ALBEDO_TEXTURE
    vec4 baseColor = albedo * gammaToLinearSpaceRGBA(texture2D(albedo_texture, uv0));
    vec3 albedo = baseColor.rgb;
    opacity = baseColor.a;
  #else
    opacity = albedo.a;
    vec3 albedo = albedo.rgb;
  #endif

  #if USE_ALPHA_TEST
    if(opacity < alphaTestThreshold) discard;
  #endif

  #if USE_MRA_TEXTURE
    vec3 metalRoughness = texture2D(mra_texture, uv0).rgb;
    float metallic = metalRoughness.r;
    float roughness = metalRoughness.g;
    float ao = metalRoughness.b;
  #else
    #if USE_METALLIC_TEXTURE
      float metallic  = texture2D(metallic_texture, uv0).r;
    #endif
    #if USE_ROUGHNESS_TEXTURE
      float roughness  = texture2D(roughness_texture, uv0).r;
    #endif
    #if USE_AO_TEXTURE
      float ao  = texture2D(ao_texture, uv0).r;
    #endif
  #endif

  vec3 N = normalize(normal_w);
  #if USE_NORMAL_TEXTURE
    N = getNormalFromTexture();
  #endif
  vec3 V = normalize(_eye - pos_w);

  // calculate reflectance at normal incidence; if dia-electric (like plastic) use F0
  // of 0.04 and if it's a metal, use the albedo color as F0 (metallic workflow)
  vec3 F0 = vec3(0.04);
  F0 = mix(F0, albedo, metallic);

  // reflection
  vec3 Lo = vec3(0.0);

  // point light (a 'for' loop to accumulate all light sources)
  #if _NUM_POINT_LIGHTS > 0
    #pragma for id in range(0, _NUM_POINT_LIGHTS)
      LightInfo pointLight{id};
      pointLight{id} = computePointLighting(_point_light{id}_position, pos_w, _point_light{id}_color, _point_light{id}_range);
      Lo += brdf(pointLight{id}, N, V, F0, albedo, metallic, roughness);
    #pragma endFor
  #endif

  #if _NUM_DIR_LIGHTS > 0
    #pragma for id in range(0, _NUM_DIR_LIGHTS)
      LightInfo directionalLight{id};
      directionalLight{id} = computeDirectionalLighting(_dir_light{id}_direction, _dir_light{id}_color);
      Lo += brdf(directionalLight{id}, N, V, F0, albedo, metallic, roughness);
    #pragma endFor
  #endif

  #if _NUM_SPOT_LIGHTS > 0
    #pragma for id in range(0, _NUM_SPOT_LIGHTS)
      LightInfo spotLight{id};
      spotLight{id} = computeSpotLighting(_spot_light{id}_position, pos_w, _spot_light{id}_direction, _spot_light{id}_color, _spot_light{id}_spot, _spot_light{id}_range);
      Lo += brdf(spotLight{id}, N, V, F0, albedo, metallic, roughness);
    #pragma endFor
  #endif

  #if USE_EMISSIVE
    vec3 emissiveColor = emissive;
    #if USE_EMISSIVE_TEXTURE
      emissiveColor *= gammaToLinearSpaceRGB(texture2D(emissive_texture, uv0).rgb);
    #endif
    Lo += emissiveColor;
  #endif

  // ambient lighting, will be replaced by IBL if IBL used.
  vec3 ambient = vec3(0.03) * albedo * ao;

  #if USE_IBL
    // generate ambient when using IBL.
    vec3 F = fresnelSchlickRoughness(max(dot(N, V), 0.0), F0, roughness);
    vec3 kS = F;
    vec3 kD = vec3(1.0) - kS;
    kD *= 1.0 - metallic;
    #if USE_RGBE_IBL_DIFFUSE
      vec3 diffuseEnv = unpackRGBE(textureCube(diffuseEnvTexture, N));
    #else
      vec3 diffuseEnv = textureCube(diffuseEnvTexture, N).rgb;
    #endif
    vec3 diffuse = diffuseEnv * albedo;
    // sample both the specularEnvTexture and the BRDF lut and combine them together as per the Split-Sum approximation to get the IBL specular part.
    vec3 R = reflect(-V, N);
    #if USE_TEX_LOD
      #if USE_RGBE_IBL_SPECULAR
        vec3 specularEnv = unpackRGBE(textureCubeLodEXT(specularEnvTexture, R, roughness * maxReflectionLod));
      #else
        vec3 specularEnv = textureCubeLodEXT(specularEnvTexture, R, roughness * maxReflectionLod).rgb;
      #endif
    #else
      #if USE_RGBE_IBL_SPECULAR
        vec3 specularEnv = unpackRGBE(textureCube(specularEnvTexture, R));
      #else
        vec3 specularEnv = textureCube(specularEnvTexture, R).rgb;
      #endif
    #endif
    vec2 brdf  = texture2D(brdfLUT, vec2(max(dot(N, V), 0.0), 1.0 - roughness)).rg;
    vec3 specular = specularEnv * (F * brdf.x + brdf.y);
    ambient = (kD * diffuse + specular) * ao;
  #endif

  vec3 color = ambient + Lo;
  #if _USE_SHADOW_MAP
    color *= computeShadow();
  #endif

  // HDR tone mapping.
  color = color / (color + vec3(1.0));
  // gamma correction.
  vec4 finalColor = vec4(color, opacity);

  return linearToGammaSpaceRGBA(finalColor);
}
