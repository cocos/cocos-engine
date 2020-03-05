
#include <cc-lights>

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

Lighting brdf (PhongSurface s, LightInfo info) {
  Lighting result;
  float ndh = 0.0;
  // Get the half direction in world space
  vec3 halfDir = normalize(s.viewDirection + info.lightDir);
  float NdotH = max(0.0, dot(s.normal, halfDir));
  NdotH = pow(NdotH, max(1.0, s.glossiness * 128.0));

  result.diffuse = info.radiance * max(0.0, dot(s.normal, info.lightDir));
  result.specular = info.radiance * NdotH;

  return result;
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

  o.a = s.opacity;

  return o;
}

vec3 ambient(PhongSurface s, vec4 ambientColor) {
  return s.diffuse * ambientColor.rgb;
}

vec4 CCPhongShading (in PhongSurface s) {
  Lighting result;
  CC_CALC_LIGHTS(s, result, brdf, ambient)

  return composePhongShading(result, s);
}
