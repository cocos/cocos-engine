
#include <cc-lights>
#include <shadow>

struct PhongSurface {
  vec3 diffuse;
  vec3 emissive;
  vec3 specular;
  float opacity;

  float glossiness;

  vec3 position;
  vec3 normal;
  vec3 viewDirection;
};

struct Lighting {
  vec3 diffuse;
  vec3 specular;
};

void brdf (inout Lighting result, LightInfo info, vec3 normal, vec3 viewDirection, float glossiness) {
  float ndh = 0.0;
  // Get the half direction in world space
  vec3 halfDir = normalize(viewDirection + info.lightDir);
  float NdotH = max(0.0, dot(normal, halfDir));
  NdotH = pow(NdotH, max(1.0, glossiness * 128.0));

  vec3 diffuse = info.radiance * max(0.0, dot(normal, info.lightDir));
  vec3 specular = info.radiance * NdotH;

  result.diffuse += diffuse;
  result.specular += specular;
}

vec4 composePhongShading (Lighting lighting, PhongSurface s) {
  vec4 o = vec4(0.0, 0.0, 0.0, 1.0);

  //diffuse is always calculated
  o.rgb = lighting.diffuse * s.diffuse;
  
  #if USE_EMISSIVE
    o.rgb += s.emissive;
  #endif

  #if USE_SPECULAR
    o.rgb += lighting.specular * s.specular;
  #endif
  
  #if CC_USE_SHADOW_MAP
    o.rgb *= CCCalcShadow();
  #endif

  o.a = s.opacity;

  return o;
}

vec4 CCPhongShading (in PhongSurface s) {
  Lighting phongLighting;
  phongLighting.diffuse = vec3(0, 0, 0);
  phongLighting.specular = vec3(0, 0, 0);

  #if CC_NUM_DIR_LIGHTS > 0
    for (int i = 0; i < CC_NUM_DIR_LIGHTS; i++) {
      LightInfo info = computeDirectionalLighting(cc_dirLightDirection[i], cc_dirLightColor[i]);
      brdf(phongLighting, info, s.normal, s.viewDirection, s.glossiness);
    }
  #endif

  #if CC_NUM_POINT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_POINT_LIGHTS; i++) {
      LightInfo info = computePointLighting(s.position, cc_pointLightPositionAndRange[i], cc_pointLightColor[i]);
      brdf(phongLighting, info, s.normal, s.viewDirection, s.glossiness);
    }
  #endif

  #if CC_NUM_SPOT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_SPOT_LIGHTS; i++) {
      LightInfo info = computeSpotLighting(s.position, cc_spotLightPositionAndRange[i], cc_spotLightDirection[i], cc_spotLightColor[i]);
      brdf(phongLighting, info, s.normal, s.viewDirection, s.glossiness);
    }
  #endif

  #if CC_NUM_AMBIENT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_AMBIENT_LIGHTS; i++) {
      phongLighting.diffuse += cc_ambientColor[i].rgb;
    }
  #endif

  return composePhongShading(phongLighting, s);
}
