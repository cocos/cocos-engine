
#include <lights>
#include <shadow>

uniform PHONG {
  float glossiness;
}

struct PhongMaterial {
  vec3 diffuse;
  vec3 emissive;
  vec3 specular;
  float opacity;
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

Lighting getPhongLighting (vec3 normal, vec3 worldPos, vec3 viewDirection, float glossiness) {
  Lighting result;
  result.diffuse = vec3(0, 0, 0);
  result.specular = vec3(0, 0, 0);

  #if CC_NUM_DIR_LIGHTS > 0
    for (int i = 0; i < CC_NUM_DIR_LIGHTS; i++) {
      LightInfo info = computeDirectionalLighting(cc_dirLightDirection[i], cc_dirLightColor[i]);
      brdf(result, info, normal, viewDirection, glossiness);
    }
  #endif

  #if CC_NUM_POINT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_POINT_LIGHTS; i++) {
      LightInfo info = computePointLighting(worldPos, cc_pointLightPositionAndRange[i], cc_pointLightColor[i]);
      brdf(result, info, normal, viewDirection, glossiness);
    }
  #endif

  #if CC_NUM_SPOT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_SPOT_LIGHTS; i++) {
      LightInfo info = computeSpotLighting(worldPos, cc_spotLightPositionAndRange[i], cc_spotLightDirection[i], cc_spotLightColor[i]);
      brdf(result, info, normal, viewDirection, glossiness);
    }
  #endif

  #if CC_NUM_AMBIENT_LIGHTS > 0
    for (int i = 0; i < CC_NUM_AMBIENT_LIGHTS; i++) {
      result.diffuse += cc_ambientColor[i].rgb;
    }
  #endif

  return result;
}

vec4 composePhongShading (Lighting lighting, PhongMaterial mtl) {
  vec4 o = vec4(0.0, 0.0, 0.0, 1.0);

  //diffuse is always calculated
  o.rgb = lighting.diffuse * mtl.diffuse;
  
  #if USE_EMISSIVE
    o.rgb += mtl.emissive;
  #endif

  #if USE_SPECULAR
    o.rgb += lighting.specular * mtl.specular;
  #endif
  
  #if CC_USE_SHADOW_MAP
    o.rgb *= computeShadow();
  #endif

  o.a = mtl.opacity;

  return o;
}

void CALC_PHONG_LIGHTING (inout vec4 outColor, in PhongMaterial material, in vec3 normal, in vec3 worldPosition, in vec3 viewDirection) {
  Lighting phongLighting = getPhongLighting(normal, worldPosition, viewDirection, glossiness);
  outColor = composePhongShading(phongLighting, material);
}
