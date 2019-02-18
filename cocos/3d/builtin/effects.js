// absolute essential effects
export default [
  {
    "name": "builtin-effect-particle-add",
    "techniques": [{"passes":[{"rasterizerState":{"cullMode":0}, "depthStencilState":{"depthTest":true, "depthWrite":false}, "blendState":{"targets":[{"blend":true, "blendSrc":2, "blendDst":1, "blendSrcAlpha":2, "blendDstAlpha":1}]}, "program":"builtin-effect-particle-add|particle-vs-legacy:lpvs_main|particle-add-fs", "properties":{"mainTexture":{"type":29, "value":"grey"}, "mainTiling":{"type":14, "value":[1, 1]}, "mainOffset":{"type":14, "value":[0, 0]}, "frameTile":{"type":14, "value":[1, 1]}, "velocityScale":{"type":13, "value":[0]}, "lengthScale":{"type":13, "value":[0]}, "tintColor":{"type":17, "value":[0.5, 0.5, 0.5, 0.5]}}}]}],
    "shaders": [
      {
        "name": "builtin-effect-particle-add|particle-vs-legacy:lpvs_main|particle-add-fs",
        "glsl3": {
          "vert": "\nuniform Constants {\n  vec2 frameTile;\n  vec2 mainTiling;\n  vec2 mainOffset;\n  float velocityScale;\n  float lengthScale;\n};\n#define MAX_DIR_LIGHTS 4\n#define MAX_POINT_LIGHTS 4\n#define MAX_SPOT_LIGHTS 4\nuniform CCGlobal {\n  \n  vec4 cc_time; \n  vec4 cc_screenSize; \n  vec4 cc_screenScale; \n  \n  mat4 cc_matProj;\n  mat4 cc_matProjInv;\n  mat4 cc_matView;\n  mat4 cc_matViewInv;\n  mat4 cc_matViewProj;\n  mat4 cc_matViewProjInv;\n  vec4 cc_cameraPos; \n  \n  vec4 cc_dirLightDirection[4]; \n  vec4 cc_dirLightColor[4]; \n  \n  vec4 cc_pointLightPositionAndRange[4]; \n  vec4 cc_pointLightColor[4]; \n  \n  vec4 cc_spotLightPositionAndRange[4]; \n  vec4 cc_spotLightDirection[4]; \n  vec4 cc_spotLightColor[4]; \n  \n  mat4 cc_matViewProjLight;\n  vec4 cc_shadowParam1; \n  vec4 cc_shadowParam2; \n};\nuniform CCLocal {\n  mat4 cc_matWorld;\n  mat4 cc_matWorldIT;\n};\nvarying vec2 uv;\nvarying vec4 color;\nvoid computeVertPos(inout vec4 pos, vec2 vertOffset\n#if USE_BILLBOARD || USE_VERTICAL_BILLBOARD\n  , mat4 view\n#endif\n#if USE_STRETCHED_BILLBOARD\n  , vec3 eye\n  , vec4 velocity\n  , float velocityScale\n  , float lengthScale\n  , float size\n  , float xIndex\n#endif\n) {\n#if USE_BILLBOARD\n  vec3 camRight = normalize(vec3(view[0][0], view[1][0], view[2][0]));\n  vec3 camUp = normalize(vec3(view[0][1], view[1][1], view[2][1]));\n  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);\n#elif USE_STRETCHED_BILLBOARD\n  vec3 camRight = normalize(cross(pos.xyz - eye, velocity.xyz));\n  vec3 camUp = velocity.xyz * velocityScale + normalize(velocity.xyz) * lengthScale * size;\n  pos.xyz += (camRight * abs(vertOffset.x) * sign(vertOffset.y)) - camUp * xIndex;\n#elif USE_HORIZONTAL_BILLBOARD\n  vec3 camRight = vec3(1, 0, 0);\n  vec3 camUp = vec3(0, 0, -1);\n  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);\n#elif USE_VERTICAL_BILLBOARD\n  vec3 camRight = normalize(vec3(view[0][0], view[1][0], view[2][0]));\n  vec3 camUp = vec3(0, 1, 0);\n  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);\n#else\n  pos.x += vertOffset.x;\n  pos.y += vertOffset.y;\n#endif\n}\nvec2 computeUV(float frameIndex, vec2 vertIndex, vec2 frameTile) {\n  vec2 aniUV = vec2(0, floor(frameIndex * frameTile.y));\n  aniUV.x = floor(frameIndex * frameTile.x * frameTile.y - aniUV.y * frameTile.x);\n  \n  vertIndex.x = 1. - vertIndex.x;\n  return (aniUV.xy + vertIndex) / vec2(frameTile.x, frameTile.y);\n}\nvoid rotateCorner(inout vec2 corner, float angle) {\n  float xOS = cos(angle) * corner.x - sin(angle) * corner.y;\n  float yOS = sin(angle) * corner.x + cos(angle) * corner.y;\n  corner.x = xOS;\n  corner.y = yOS;\n}\nattribute vec3 a_position; \nattribute vec3 a_texCoord;  \nattribute vec2 a_texCoord1; \nattribute vec4 a_color;\n#if USE_STRETCHED_BILLBOARD\nattribute vec3 a_color1; \n#endif\nvec4 lpvs_main() {\n  vec4 pos = vec4(a_position, 1);\n#if USE_STRETCHED_BILLBOARD\n  vec4 velocity = vec4(a_color1.xyz, 0);\n#endif\n#if !USE_WORLD_SPACE\n  pos = cc_matWorld * pos;\n  #if USE_STRETCHED_BILLBOARD\n  velocity = cc_matWorld * velocity;\n  #endif\n#endif\n  vec2 cornerOffset = vec2((a_texCoord.xy - 0.5) * a_texCoord1.x);\n#if !USE_STRETCHED_BILLBOARD\n  \n  rotateCorner(cornerOffset, a_texCoord1.y);\n#endif\n  computeVertPos(pos, cornerOffset\n  #if USE_BILLBOARD || USE_VERTICAL_BILLBOARD\n    , cc_matView\n  #endif\n  #if USE_STRETCHED_BILLBOARD\n    , cc_cameraPos.xyz\n    , velocity\n    , velocityScale\n    , lengthScale\n    , a_texCoord1.x\n    , a_texCoord.x\n  #endif\n  );\n  pos = cc_matViewProj * pos;\n  uv = computeUV(a_texCoord.z, a_texCoord.xy, frameTile) * mainTiling + mainOffset;\n  color = a_color;\n  return pos;\n}\nvoid main() { gl_Position = lpvs_main(); }\n",
          "frag": "\n  uniform sampler2D mainTexture;\n  uniform FragConstants {\n    vec4 tintColor;\n  };\n  varying vec2 uv;\n  varying vec4 color;\n  void main () {\n    \n    gl_FragColor = 2.0 * color * tintColor * texture2D(mainTexture, uv);\n  }\n"
        },
        "glsl1": {
          "vert": "\n  uniform vec2 frameTile;\n  uniform vec2 mainTiling;\n  uniform vec2 mainOffset;\n  uniform float velocityScale;\n  uniform float lengthScale;\n#define MAX_DIR_LIGHTS 4\n#define MAX_POINT_LIGHTS 4\n#define MAX_SPOT_LIGHTS 4\n  uniform vec4 cc_time;\n  uniform vec4 cc_screenSize;\n  uniform vec4 cc_screenScale;\n  uniform mat4 cc_matProj;\n  uniform mat4 cc_matProjInv;\n  uniform mat4 cc_matView;\n  uniform mat4 cc_matViewInv;\n  uniform mat4 cc_matViewProj;\n  uniform mat4 cc_matViewProjInv;\n  uniform vec4 cc_cameraPos;\n  uniform vec4 cc_dirLightDirection[4];\n  uniform vec4 cc_dirLightColor[4];\n  uniform vec4 cc_pointLightPositionAndRange[4];\n  uniform vec4 cc_pointLightColor[4];\n  uniform vec4 cc_spotLightPositionAndRange[4];\n  uniform vec4 cc_spotLightDirection[4];\n  uniform vec4 cc_spotLightColor[4];\n  uniform mat4 cc_matViewProjLight;\n  uniform vec4 cc_shadowParam1;\n  uniform vec4 cc_shadowParam2;\n  uniform mat4 cc_matWorld;\n  uniform mat4 cc_matWorldIT;\nvarying vec2 uv;\nvarying vec4 color;\nvoid computeVertPos(inout vec4 pos, vec2 vertOffset\n#if USE_BILLBOARD || USE_VERTICAL_BILLBOARD\n  , mat4 view\n#endif\n#if USE_STRETCHED_BILLBOARD\n  , vec3 eye\n  , vec4 velocity\n  , float velocityScale\n  , float lengthScale\n  , float size\n  , float xIndex\n#endif\n) {\n#if USE_BILLBOARD\n  vec3 camRight = normalize(vec3(view[0][0], view[1][0], view[2][0]));\n  vec3 camUp = normalize(vec3(view[0][1], view[1][1], view[2][1]));\n  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);\n#elif USE_STRETCHED_BILLBOARD\n  vec3 camRight = normalize(cross(pos.xyz - eye, velocity.xyz));\n  vec3 camUp = velocity.xyz * velocityScale + normalize(velocity.xyz) * lengthScale * size;\n  pos.xyz += (camRight * abs(vertOffset.x) * sign(vertOffset.y)) - camUp * xIndex;\n#elif USE_HORIZONTAL_BILLBOARD\n  vec3 camRight = vec3(1, 0, 0);\n  vec3 camUp = vec3(0, 0, -1);\n  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);\n#elif USE_VERTICAL_BILLBOARD\n  vec3 camRight = normalize(vec3(view[0][0], view[1][0], view[2][0]));\n  vec3 camUp = vec3(0, 1, 0);\n  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);\n#else\n  pos.x += vertOffset.x;\n  pos.y += vertOffset.y;\n#endif\n}\nvec2 computeUV(float frameIndex, vec2 vertIndex, vec2 frameTile) {\n  vec2 aniUV = vec2(0, floor(frameIndex * frameTile.y));\n  aniUV.x = floor(frameIndex * frameTile.x * frameTile.y - aniUV.y * frameTile.x);\n  \n  vertIndex.x = 1. - vertIndex.x;\n  return (aniUV.xy + vertIndex) / vec2(frameTile.x, frameTile.y);\n}\nvoid rotateCorner(inout vec2 corner, float angle) {\n  float xOS = cos(angle) * corner.x - sin(angle) * corner.y;\n  float yOS = sin(angle) * corner.x + cos(angle) * corner.y;\n  corner.x = xOS;\n  corner.y = yOS;\n}\nattribute vec3 a_position; \nattribute vec3 a_texCoord;  \nattribute vec2 a_texCoord1; \nattribute vec4 a_color;\n#if USE_STRETCHED_BILLBOARD\nattribute vec3 a_color1; \n#endif\nvec4 lpvs_main() {\n  vec4 pos = vec4(a_position, 1);\n#if USE_STRETCHED_BILLBOARD\n  vec4 velocity = vec4(a_color1.xyz, 0);\n#endif\n#if !USE_WORLD_SPACE\n  pos = cc_matWorld * pos;\n  #if USE_STRETCHED_BILLBOARD\n  velocity = cc_matWorld * velocity;\n  #endif\n#endif\n  vec2 cornerOffset = vec2((a_texCoord.xy - 0.5) * a_texCoord1.x);\n#if !USE_STRETCHED_BILLBOARD\n  \n  rotateCorner(cornerOffset, a_texCoord1.y);\n#endif\n  computeVertPos(pos, cornerOffset\n  #if USE_BILLBOARD || USE_VERTICAL_BILLBOARD\n    , cc_matView\n  #endif\n  #if USE_STRETCHED_BILLBOARD\n    , cc_cameraPos.xyz\n    , velocity\n    , velocityScale\n    , lengthScale\n    , a_texCoord1.x\n    , a_texCoord.x\n  #endif\n  );\n  pos = cc_matViewProj * pos;\n  uv = computeUV(a_texCoord.z, a_texCoord.xy, frameTile) * mainTiling + mainOffset;\n  color = a_color;\n  return pos;\n}\nvoid main() { gl_Position = lpvs_main(); }\n",
          "frag": "\n  uniform sampler2D mainTexture;\n    uniform vec4 tintColor;\n  varying vec2 uv;\n  varying vec4 color;\n  void main () {\n    \n    gl_FragColor = 2.0 * color * tintColor * texture2D(mainTexture, uv);\n  }\n"
        },
        "defines": [
          {"name":"USE_BILLBOARD", "type":"boolean", "defines":[]},
          {"name":"USE_STRETCHED_BILLBOARD", "type":"boolean", "defines":[]},
          {"name":"USE_HORIZONTAL_BILLBOARD", "type":"boolean", "defines":[]},
          {"name":"USE_VERTICAL_BILLBOARD", "type":"boolean", "defines":[]},
          {"name":"USE_WORLD_SPACE", "type":"boolean", "defines":[]}
        ],
        "blocks": [
          {"name": "Constants", "size": 32, "defines": [], "binding": 0, "members": [
            {"name":"frameTile", "type":14, "count":1, "size":8},
            {"name":"mainTiling", "type":14, "count":1, "size":8},
            {"name":"mainOffset", "type":14, "count":1, "size":8},
            {"name":"velocityScale", "type":13, "count":1, "size":4},
            {"name":"lengthScale", "type":13, "count":1, "size":4}
          ]},
          {"name": "FragConstants", "size": 16, "defines": [], "binding": 1, "members": [
            {"name":"tintColor", "type":16, "count":1, "size":16}
          ]}
        ],
        "samplers": [
          {"name":"mainTexture", "type":29, "count":1, "defines":[], "binding":2}
        ],
        "dependencies": {}
      }
    ]
  },
  {
    "name": "builtin-effect-skybox",
    "techniques": [{"passes":[{"rasterizerState":{"cullMode":0}, "depthStencilState":{"depthTest":true, "depthWrite":false}, "program":"builtin-effect-skybox|sky-vs|sky-fs", "properties":{"cubeMap":{"type":32, "value":"default-cube"}}, "priority":10}]}],
    "shaders": [
      {
        "name": "builtin-effect-skybox|sky-vs|sky-fs",
        "glsl3": {
          "vert": "\n  attribute vec3 a_position;\n  \n#define MAX_DIR_LIGHTS 4\n#define MAX_POINT_LIGHTS 4\n#define MAX_SPOT_LIGHTS 4\nuniform CCGlobal {\n  \n  vec4 cc_time; \n  vec4 cc_screenSize; \n  vec4 cc_screenScale; \n  \n  mat4 cc_matProj;\n  mat4 cc_matProjInv;\n  mat4 cc_matView;\n  mat4 cc_matViewInv;\n  mat4 cc_matViewProj;\n  mat4 cc_matViewProjInv;\n  vec4 cc_cameraPos; \n  \n  vec4 cc_dirLightDirection[4]; \n  vec4 cc_dirLightColor[4]; \n  \n  vec4 cc_pointLightPositionAndRange[4]; \n  vec4 cc_pointLightColor[4]; \n  \n  vec4 cc_spotLightPositionAndRange[4]; \n  vec4 cc_spotLightDirection[4]; \n  vec4 cc_spotLightColor[4]; \n  \n  mat4 cc_matViewProjLight;\n  vec4 cc_shadowParam1; \n  vec4 cc_shadowParam2; \n};\n  varying vec3 viewDir;\n  void main() {\n    mat4 matViewRotOnly = mat4(mat3(cc_matView));\n    vec4 clipPos = cc_matProj * matViewRotOnly * vec4(a_position, 1.0);\n    gl_Position = clipPos;\n    gl_Position.z = clipPos.w * 0.99999;\n    viewDir = a_position;\n  }\n",
          "frag": "\n  varying vec3 viewDir;\n  uniform samplerCube cubeMap;\n  \nvec3 gammaToLinearSpaceRGB(vec3 sRGB) { \n  return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);\n}\nvec3 linearToGammaSpaceRGB(vec3 RGB) { \n  vec3 S1 = sqrt(RGB);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return 0.585122381 * S1 + 0.783140355 * S2 - 0.368262736 * S3;\n}\nvec4 gammaToLinearSpaceRGBA(vec4 sRGBA) {\n  return vec4(gammaToLinearSpaceRGB(sRGBA.rgb), sRGBA.a);\n}\nvec4 linearToGammaSpaceRGBA(vec4 RGBA) {\n  return vec4(linearToGammaSpaceRGB(RGBA.rgb), RGBA.a);\n}\nfloat gammaToLinearSpaceExact(float val) {\n  if (val <= 0.04045) {\n    return val / 12.92;\n  } else if (val < 1.0) {\n    return pow((val + 0.055) / 1.055, 2.4);\n  } else {\n    return pow(val, 2.2);\n  }\n}\nfloat linearToGammaSpaceExact(float val) {\n  if (val <= 0.0) {\n    return 0.0;\n  } else if (val <= 0.0031308) {\n    return 12.92 * val;\n  } else if (val < 1.0) {\n    return 1.055 * pow(val, 0.4166667) - 0.055;\n  } else {\n    return pow(val, 0.45454545);\n  }\n}\n  \nvec3 unpackNormal(vec4 nmap) {\n  return nmap.xyz * 2.0 - 1.0;\n}\nvec3 unpackRGBE(vec4 rgbe) {\n    return rgbe.rgb * pow(2.0, rgbe.a * 255.0 - 128.0);\n}\n  void main() {\n  #if USE_RGBE_CUBEMAP\n      vec3 c = unpackRGBE(textureCube(cubeMap, viewDir));\n      c = linearToGammaSpaceRGB(c / (1.0 + c));\n      gl_FragColor = vec4(c, 1.0);\n  #else\n      gl_FragColor = textureCube(cubeMap, viewDir);\n  #endif\n  }\n"
        },
        "glsl1": {
          "vert": "\n  attribute vec3 a_position;\n  \n#define MAX_DIR_LIGHTS 4\n#define MAX_POINT_LIGHTS 4\n#define MAX_SPOT_LIGHTS 4\n  uniform vec4 cc_time;\n  uniform vec4 cc_screenSize;\n  uniform vec4 cc_screenScale;\n  uniform mat4 cc_matProj;\n  uniform mat4 cc_matProjInv;\n  uniform mat4 cc_matView;\n  uniform mat4 cc_matViewInv;\n  uniform mat4 cc_matViewProj;\n  uniform mat4 cc_matViewProjInv;\n  uniform vec4 cc_cameraPos;\n  uniform vec4 cc_dirLightDirection[4];\n  uniform vec4 cc_dirLightColor[4];\n  uniform vec4 cc_pointLightPositionAndRange[4];\n  uniform vec4 cc_pointLightColor[4];\n  uniform vec4 cc_spotLightPositionAndRange[4];\n  uniform vec4 cc_spotLightDirection[4];\n  uniform vec4 cc_spotLightColor[4];\n  uniform mat4 cc_matViewProjLight;\n  uniform vec4 cc_shadowParam1;\n  uniform vec4 cc_shadowParam2;\n  varying vec3 viewDir;\n  void main() {\n    mat4 matViewRotOnly = mat4(mat3(cc_matView));\n    vec4 clipPos = cc_matProj * matViewRotOnly * vec4(a_position, 1.0);\n    gl_Position = clipPos;\n    gl_Position.z = clipPos.w * 0.99999;\n    viewDir = a_position;\n  }\n",
          "frag": "\n  varying vec3 viewDir;\n  uniform samplerCube cubeMap;\n  \nvec3 gammaToLinearSpaceRGB(vec3 sRGB) { \n  return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);\n}\nvec3 linearToGammaSpaceRGB(vec3 RGB) { \n  vec3 S1 = sqrt(RGB);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return 0.585122381 * S1 + 0.783140355 * S2 - 0.368262736 * S3;\n}\nvec4 gammaToLinearSpaceRGBA(vec4 sRGBA) {\n  return vec4(gammaToLinearSpaceRGB(sRGBA.rgb), sRGBA.a);\n}\nvec4 linearToGammaSpaceRGBA(vec4 RGBA) {\n  return vec4(linearToGammaSpaceRGB(RGBA.rgb), RGBA.a);\n}\nfloat gammaToLinearSpaceExact(float val) {\n  if (val <= 0.04045) {\n    return val / 12.92;\n  } else if (val < 1.0) {\n    return pow((val + 0.055) / 1.055, 2.4);\n  } else {\n    return pow(val, 2.2);\n  }\n}\nfloat linearToGammaSpaceExact(float val) {\n  if (val <= 0.0) {\n    return 0.0;\n  } else if (val <= 0.0031308) {\n    return 12.92 * val;\n  } else if (val < 1.0) {\n    return 1.055 * pow(val, 0.4166667) - 0.055;\n  } else {\n    return pow(val, 0.45454545);\n  }\n}\n  \nvec3 unpackNormal(vec4 nmap) {\n  return nmap.xyz * 2.0 - 1.0;\n}\nvec3 unpackRGBE(vec4 rgbe) {\n    return rgbe.rgb * pow(2.0, rgbe.a * 255.0 - 128.0);\n}\n  void main() {\n  #if USE_RGBE_CUBEMAP\n      vec3 c = unpackRGBE(textureCube(cubeMap, viewDir));\n      c = linearToGammaSpaceRGB(c / (1.0 + c));\n      gl_FragColor = vec4(c, 1.0);\n  #else\n      gl_FragColor = textureCube(cubeMap, viewDir);\n  #endif\n  }\n"
        },
        "defines": [
          {"name":"USE_RGBE_CUBEMAP", "type":"boolean", "defines":[]}
        ],
        "blocks": [],
        "samplers": [
          {"name":"cubeMap", "type":32, "count":1, "defines":[], "binding":0}
        ],
        "dependencies": {}
      }
    ]
  },
  {
    "name": "builtin-effect-sprite",
    "techniques": [{"passes":[{"depthStencilState":{"depthTest":true, "depthWrite":false}, "blendState":{"targets":[{"blend":true, "blendSrc":2, "blendDst":4, "blendDstAlpha":4}]}, "program":"builtin-effect-sprite|sprite-vs:vert|sprite-fs:frag", "properties":{"mainTexture":{"type":29, "value":"white"}}}]}],
    "shaders": [
      {
        "name": "builtin-effect-sprite|sprite-vs:vert|sprite-fs:frag",
        "glsl3": {
          "vert": "\nattribute vec3 a_position;\nattribute vec2 a_texCoord;\nattribute vec4 a_color;\nvarying vec2 uv0;\nvarying vec4 color;\nuniform ui {\n  mat4 cc_matViewProj;\n};\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1);\n  pos = cc_matViewProj * pos;\n  uv0 = a_texCoord;\n  color = a_color;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n",
          "frag": "\nuniform sampler2D mainTexture;\nvarying vec2 uv0;\nvarying vec4 color;\nvec4 frag () {\n  vec4 o = vec4(1, 1, 1, 1);\n  o *= texture2D(mainTexture, uv0);\n  o *= color;\n  return o;\n}\nvoid main() { gl_FragColor = frag(); }\n"
        },
        "glsl1": {
          "vert": "\nattribute vec3 a_position;\nattribute vec2 a_texCoord;\nattribute vec4 a_color;\nvarying vec2 uv0;\nvarying vec4 color;\n  uniform mat4 cc_matViewProj;\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1);\n  pos = cc_matViewProj * pos;\n  uv0 = a_texCoord;\n  color = a_color;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n",
          "frag": "\nuniform sampler2D mainTexture;\nvarying vec2 uv0;\nvarying vec4 color;\nvec4 frag () {\n  vec4 o = vec4(1, 1, 1, 1);\n  o *= texture2D(mainTexture, uv0);\n  o *= color;\n  return o;\n}\nvoid main() { gl_FragColor = frag(); }\n"
        },
        "defines": [],
        "blocks": [
          {"name": "ui", "size": 64, "defines": [], "binding": 0, "members": [
            {"name":"cc_matViewProj", "type":26, "count":1, "size":64}
          ]}
        ],
        "samplers": [
          {"name":"mainTexture", "type":29, "count":1, "defines":[], "binding":1}
        ],
        "dependencies": {}
      }
    ]
  },
  {
    "name": "builtin-effect-unlit",
    "techniques": [{"passes":[{"program":"builtin-effect-unlit|unlit-vs:vert|unlit-fs:frag", "properties":{"color":{"type":17, "value":[1, 1, 1, 1]}, "mainTiling":{"type":14, "value":[1, 1]}, "mainOffset":{"type":14, "value":[0, 0]}, "mainTexture":{"type":29, "value":"grey"}}}]}],
    "shaders": [
      {
        "name": "builtin-effect-unlit|unlit-vs:vert|unlit-fs:frag",
        "glsl3": {
          "vert": "\nattribute vec3 a_position;\n#define MAX_DIR_LIGHTS 4\n#define MAX_POINT_LIGHTS 4\n#define MAX_SPOT_LIGHTS 4\nuniform CCGlobal {\n  \n  vec4 cc_time; \n  vec4 cc_screenSize; \n  vec4 cc_screenScale; \n  \n  mat4 cc_matProj;\n  mat4 cc_matProjInv;\n  mat4 cc_matView;\n  mat4 cc_matViewInv;\n  mat4 cc_matViewProj;\n  mat4 cc_matViewProjInv;\n  vec4 cc_cameraPos; \n  \n  vec4 cc_dirLightDirection[4]; \n  vec4 cc_dirLightColor[4]; \n  \n  vec4 cc_pointLightPositionAndRange[4]; \n  vec4 cc_pointLightColor[4]; \n  \n  vec4 cc_spotLightPositionAndRange[4]; \n  vec4 cc_spotLightDirection[4]; \n  vec4 cc_spotLightColor[4]; \n  \n  mat4 cc_matViewProjLight;\n  vec4 cc_shadowParam1; \n  vec4 cc_shadowParam2; \n};\nuniform CCLocal {\n  mat4 cc_matWorld;\n  mat4 cc_matWorldIT;\n};\n#if USE_TEXTURE\n  attribute vec2 a_texCoord;\n  uniform TexCoords {\n    vec2 mainTiling;\n    vec2 mainOffset;\n  };\n  varying vec2 uv0;\n#endif\n#if CC_USE_SKINNING\n  \nattribute vec4 a_weights;\nattribute vec4 a_joints;\nuniform CCSkinning {\n  mat4 cc_matJoint[128];\n  vec4 cc_jointsTextureSize;\n};\n#if CC_USE_JOINTS_TEXTURE\nuniform sampler2D cc_jointsTexture;\nmat4 getBoneMatrix(const in float i) {\n  float size = cc_jointsTextureSize.x;\n  float j = i * 4.0;\n  float x = mod(j, size);\n  float y = floor(j / size);\n  float dx = 1.0 / size;\n  float dy = 1.0 / size;\n  y = dy * (y + 0.5);\n  vec4 v1 = texture2D(cc_jointsTexture, vec2(dx * (x + 0.5), y));\n  vec4 v2 = texture2D(cc_jointsTexture, vec2(dx * (x + 1.5), y));\n  vec4 v3 = texture2D(cc_jointsTexture, vec2(dx * (x + 2.5), y));\n  vec4 v4 = texture2D(cc_jointsTexture, vec2(dx * (x + 3.5), y));\n  return mat4(v1, v2, v3, v4);\n}\n#else\nmat4 getBoneMatrix(const in float i) {\n  return cc_matJoint[int(i)];\n}\n#endif\nmat4 skinMatrix() {\n  return\n    getBoneMatrix(a_joints.x) * a_weights.x +\n    getBoneMatrix(a_joints.y) * a_weights.y +\n    getBoneMatrix(a_joints.z) * a_weights.z +\n    getBoneMatrix(a_joints.w) * a_weights.w;\n}\nvoid skinVertex(inout vec4 a1) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2, inout vec4 a3) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n  a3 = m * a3;\n}\n#endif\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1);\n  #if CC_USE_SKINNING\n    skinVertex(pos);\n  #endif\n  pos = cc_matViewProj * cc_matWorld * pos;\n  #if USE_TEXTURE\n    uv0 = a_texCoord * mainTiling + mainOffset;\n  #endif\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n",
          "frag": "\n#if USE_TEXTURE\n  uniform sampler2D mainTexture;\n  varying vec2 uv0;\n#endif\n#if USE_COLOR\n  uniform Constant {\n    vec4 color;\n  };\n#endif\nvec4 frag () {\n  vec4 o = vec4(1, 1, 1, 1);\n  #if USE_TEXTURE\n    o *= texture2D(mainTexture, uv0);\n  #endif\n  #if USE_COLOR\n    o *= color;\n  #endif\n  return o;\n}\nvoid main() { gl_FragColor = frag(); }\n"
        },
        "glsl1": {
          "vert": "\nattribute vec3 a_position;\n#define MAX_DIR_LIGHTS 4\n#define MAX_POINT_LIGHTS 4\n#define MAX_SPOT_LIGHTS 4\n  uniform vec4 cc_time;\n  uniform vec4 cc_screenSize;\n  uniform vec4 cc_screenScale;\n  uniform mat4 cc_matProj;\n  uniform mat4 cc_matProjInv;\n  uniform mat4 cc_matView;\n  uniform mat4 cc_matViewInv;\n  uniform mat4 cc_matViewProj;\n  uniform mat4 cc_matViewProjInv;\n  uniform vec4 cc_cameraPos;\n  uniform vec4 cc_dirLightDirection[4];\n  uniform vec4 cc_dirLightColor[4];\n  uniform vec4 cc_pointLightPositionAndRange[4];\n  uniform vec4 cc_pointLightColor[4];\n  uniform vec4 cc_spotLightPositionAndRange[4];\n  uniform vec4 cc_spotLightDirection[4];\n  uniform vec4 cc_spotLightColor[4];\n  uniform mat4 cc_matViewProjLight;\n  uniform vec4 cc_shadowParam1;\n  uniform vec4 cc_shadowParam2;\n  uniform mat4 cc_matWorld;\n  uniform mat4 cc_matWorldIT;\n#if USE_TEXTURE\n  attribute vec2 a_texCoord;\n    uniform vec2 mainTiling;\n  uniform vec2 mainOffset;\n  varying vec2 uv0;\n#endif\n#if CC_USE_SKINNING\n  \nattribute vec4 a_weights;\nattribute vec4 a_joints;\n  uniform mat4 cc_matJoint[128];\n  uniform vec4 cc_jointsTextureSize;\n#if CC_USE_JOINTS_TEXTURE\nuniform sampler2D cc_jointsTexture;\nmat4 getBoneMatrix(const in float i) {\n  float size = cc_jointsTextureSize.x;\n  float j = i * 4.0;\n  float x = mod(j, size);\n  float y = floor(j / size);\n  float dx = 1.0 / size;\n  float dy = 1.0 / size;\n  y = dy * (y + 0.5);\n  vec4 v1 = texture2D(cc_jointsTexture, vec2(dx * (x + 0.5), y));\n  vec4 v2 = texture2D(cc_jointsTexture, vec2(dx * (x + 1.5), y));\n  vec4 v3 = texture2D(cc_jointsTexture, vec2(dx * (x + 2.5), y));\n  vec4 v4 = texture2D(cc_jointsTexture, vec2(dx * (x + 3.5), y));\n  return mat4(v1, v2, v3, v4);\n}\n#else\nmat4 getBoneMatrix(const in float i) {\n  return cc_matJoint[int(i)];\n}\n#endif\nmat4 skinMatrix() {\n  return\n    getBoneMatrix(a_joints.x) * a_weights.x +\n    getBoneMatrix(a_joints.y) * a_weights.y +\n    getBoneMatrix(a_joints.z) * a_weights.z +\n    getBoneMatrix(a_joints.w) * a_weights.w;\n}\nvoid skinVertex(inout vec4 a1) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2, inout vec4 a3) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n  a3 = m * a3;\n}\n#endif\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1);\n  #if CC_USE_SKINNING\n    skinVertex(pos);\n  #endif\n  pos = cc_matViewProj * cc_matWorld * pos;\n  #if USE_TEXTURE\n    uv0 = a_texCoord * mainTiling + mainOffset;\n  #endif\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n",
          "frag": "\n#if USE_TEXTURE\n  uniform sampler2D mainTexture;\n  varying vec2 uv0;\n#endif\n#if USE_COLOR\n    uniform vec4 color;\n#endif\nvec4 frag () {\n  vec4 o = vec4(1, 1, 1, 1);\n  #if USE_TEXTURE\n    o *= texture2D(mainTexture, uv0);\n  #endif\n  #if USE_COLOR\n    o *= color;\n  #endif\n  return o;\n}\nvoid main() { gl_FragColor = frag(); }\n"
        },
        "defines": [
          {"name":"USE_TEXTURE", "type":"boolean", "defines":[]},
          {"name":"CC_USE_SKINNING", "type":"boolean", "defines":[]},
          {"name":"CC_USE_JOINTS_TEXTURE", "type":"boolean", "defines":["CC_USE_SKINNING"]},
          {"name":"USE_COLOR", "type":"boolean", "defines":[]}
        ],
        "blocks": [
          {"name": "TexCoords", "size": 16, "defines": ["USE_TEXTURE"], "binding": 0, "members": [
            {"name":"mainTiling", "type":14, "count":1, "size":8},
            {"name":"mainOffset", "type":14, "count":1, "size":8}
          ]},
          {"name": "Constant", "size": 16, "defines": ["USE_COLOR"], "binding": 1, "members": [
            {"name":"color", "type":16, "count":1, "size":16}
          ]}
        ],
        "samplers": [
          {"name":"mainTexture", "type":29, "count":1, "defines":["USE_TEXTURE"], "binding":2}
        ],
        "dependencies": {}
      }
    ]
  }
];
