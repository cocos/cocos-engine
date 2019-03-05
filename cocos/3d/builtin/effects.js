// absolute essential effects
export default [
  {
    "name": "builtin-particle",
    "techniques": [
      {"name":"add", "passes":[{"rasterizerState":{"cullMode":0}, "depthStencilState":{"depthTest":true, "depthWrite":false}, "blendState":{"targets":[{"blend":true, "blendSrc":2, "blendDst":1, "blendSrcAlpha":2, "blendDstAlpha":1}]}, "program":"builtin-particle|particle-vs-legacy:lpvs_main|tinted-fs:add", "properties":{"mainTexture":{"type":29, "value":"grey"}, "mainTiling_Offset":{"type":16, "value":[1, 1, 0, 0]}, "frameTile_velLenScale":{"type":16, "value":[1, 1, 0, 0]}, "tintColor":{"type":17, "value":[0.5, 0.5, 0.5, 0.5]}}}]}
    ],
    "shaders": [
      {
        "name": "builtin-particle|particle-vs-legacy:lpvs_main|tinted-fs:add",
        "glsl3": {
          "vert": `\nprecision mediump float;\nuniform Constants {\n  vec4 mainTiling_Offset;\n  vec4 frameTile_velLenScale;\n};\nuniform CCGlobal {\n  \n  vec4 cc_time; \n  vec4 cc_screenSize; \n  vec4 cc_screenScale; \n  \n  mat4 cc_matView;\n  mat4 cc_matViewInv;\n  mat4 cc_matProj;\n  mat4 cc_matProjInv;\n  mat4 cc_matViewProj;\n  mat4 cc_matViewProjInv;\n  vec4 cc_cameraPos; \n  vec4 cc_mainLitDir; \n  vec4 cc_mainLitColor; \n  vec4 cc_ambientSky;\n  vec4 cc_ambientGround;\n};\nuniform CCLocal {\n  mat4 cc_matWorld;\n  mat4 cc_matWorldIT;\n};\nout vec2 uv;\nout vec4 color;\nvoid computeVertPos(inout vec4 pos, vec2 vertOffset\n#if USE_BILLBOARD || USE_VERTICAL_BILLBOARD\n  , mat4 view\n#endif\n#if USE_STRETCHED_BILLBOARD\n  , vec3 eye\n  , vec4 velocity\n  , float velocityScale\n  , float lengthScale\n  , float size\n  , float xIndex\n#endif\n) {\n#if USE_BILLBOARD\n  vec3 camRight = normalize(vec3(view[0][0], view[1][0], view[2][0]));\n  vec3 camUp = normalize(vec3(view[0][1], view[1][1], view[2][1]));\n  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);\n#elif USE_STRETCHED_BILLBOARD\n  vec3 camRight = normalize(cross(pos.xyz - eye, velocity.xyz));\n  vec3 camUp = velocity.xyz * velocityScale + normalize(velocity.xyz) * lengthScale * size;\n  pos.xyz += (camRight * abs(vertOffset.x) * sign(vertOffset.y)) - camUp * xIndex;\n#elif USE_HORIZONTAL_BILLBOARD\n  vec3 camRight = vec3(1, 0, 0);\n  vec3 camUp = vec3(0, 0, -1);\n  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);\n#elif USE_VERTICAL_BILLBOARD\n  vec3 camRight = normalize(vec3(view[0][0], view[1][0], view[2][0]));\n  vec3 camUp = vec3(0, 1, 0);\n  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);\n#else\n  pos.x += vertOffset.x;\n  pos.y += vertOffset.y;\n#endif\n}\nvec2 computeUV(float frameIndex, vec2 vertIndex, vec2 frameTile) {\n  vec2 aniUV = vec2(0, floor(frameIndex * frameTile.y));\n  aniUV.x = floor(frameIndex * frameTile.x * frameTile.y - aniUV.y * frameTile.x);\n  \n  vertIndex.x = 1. - vertIndex.x;\n  return (aniUV.xy + vertIndex) / vec2(frameTile.x, frameTile.y);\n}\nvoid rotateCorner(inout vec2 corner, float angle) {\n  float xOS = cos(angle) * corner.x - sin(angle) * corner.y;\n  float yOS = sin(angle) * corner.x + cos(angle) * corner.y;\n  corner.x = xOS;\n  corner.y = yOS;\n}\nin vec3 a_position; \nin vec3 a_texCoord;  \nin vec2 a_texCoord1; \nin vec4 a_color;\n#if USE_STRETCHED_BILLBOARD\nin vec3 a_color1; \n#endif\nvec4 lpvs_main() {\n  vec4 pos = vec4(a_position, 1);\n#if USE_STRETCHED_BILLBOARD\n  vec4 velocity = vec4(a_color1.xyz, 0);\n#endif\n#if !USE_WORLD_SPACE\n  pos = cc_matWorld * pos;\n  #if USE_STRETCHED_BILLBOARD\n  velocity = cc_matWorld * velocity;\n  #endif\n#endif\n  vec2 cornerOffset = vec2((a_texCoord.xy - 0.5) * a_texCoord1.x);\n#if !USE_STRETCHED_BILLBOARD\n  rotateCorner(cornerOffset, a_texCoord1.y);\n#endif\n  computeVertPos(pos, cornerOffset\n  #if USE_BILLBOARD || USE_VERTICAL_BILLBOARD\n    , cc_matView\n  #endif\n  #if USE_STRETCHED_BILLBOARD\n    , cc_cameraPos.xyz\n    , velocity\n    , frameTile_velLenScale.z\n    , frameTile_velLenScale.w\n    , a_texCoord1.x\n    , a_texCoord.x\n  #endif\n  );\n  pos = cc_matViewProj * pos;\n  uv = computeUV(a_texCoord.z, a_texCoord.xy, frameTile_velLenScale.xy) * mainTiling_Offset.xy + mainTiling_Offset.zw;\n  color = a_color;\n  return pos;\n}\nvoid main() { gl_Position = lpvs_main(); }\n`,
          "frag": `\nprecision mediump float;\nin vec2 uv;\nin vec4 color;\nuniform sampler2D mainTexture;\nuniform FragConstants {\n  vec4 tintColor;\n};\nvec4 add () {\n  return 2.0 * color * tintColor * texture(mainTexture, uv);\n}\nvec4 multiply () {\n  vec4 col;\n  vec4 texColor = texture(mainTexture, uv);\n  col.rgb = tintColor.rgb * texColor.rgb * color.rgb * vec3(2.0);\n  col.a = (1.0 - texColor.a) * (tintColor.a * color.a * 2.0);\n  return col;\n}\nout vec4 cc_FragColor;\nvoid main() { cc_FragColor = add(); }\n`
        },
        "glsl1": {
          "vert": `\nprecision mediump float;\nuniform vec4 mainTiling_Offset;\nuniform vec4 frameTile_velLenScale;\nuniform vec4 cc_time;\nuniform vec4 cc_screenSize;\nuniform vec4 cc_screenScale;\nuniform mat4 cc_matView;\nuniform mat4 cc_matViewInv;\nuniform mat4 cc_matProj;\nuniform mat4 cc_matProjInv;\nuniform mat4 cc_matViewProj;\nuniform mat4 cc_matViewProjInv;\nuniform vec4 cc_cameraPos;\nuniform vec4 cc_mainLitDir;\nuniform vec4 cc_mainLitColor;\nuniform vec4 cc_ambientSky;\nuniform vec4 cc_ambientGround;\nuniform mat4 cc_matWorld;\nuniform mat4 cc_matWorldIT;\nvarying vec2 uv;\nvarying vec4 color;\nvoid computeVertPos(inout vec4 pos, vec2 vertOffset\n#if USE_BILLBOARD || USE_VERTICAL_BILLBOARD\n  , mat4 view\n#endif\n#if USE_STRETCHED_BILLBOARD\n  , vec3 eye\n  , vec4 velocity\n  , float velocityScale\n  , float lengthScale\n  , float size\n  , float xIndex\n#endif\n) {\n#if USE_BILLBOARD\n  vec3 camRight = normalize(vec3(view[0][0], view[1][0], view[2][0]));\n  vec3 camUp = normalize(vec3(view[0][1], view[1][1], view[2][1]));\n  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);\n#elif USE_STRETCHED_BILLBOARD\n  vec3 camRight = normalize(cross(pos.xyz - eye, velocity.xyz));\n  vec3 camUp = velocity.xyz * velocityScale + normalize(velocity.xyz) * lengthScale * size;\n  pos.xyz += (camRight * abs(vertOffset.x) * sign(vertOffset.y)) - camUp * xIndex;\n#elif USE_HORIZONTAL_BILLBOARD\n  vec3 camRight = vec3(1, 0, 0);\n  vec3 camUp = vec3(0, 0, -1);\n  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);\n#elif USE_VERTICAL_BILLBOARD\n  vec3 camRight = normalize(vec3(view[0][0], view[1][0], view[2][0]));\n  vec3 camUp = vec3(0, 1, 0);\n  pos.xyz += (camRight * vertOffset.x) + (camUp * vertOffset.y);\n#else\n  pos.x += vertOffset.x;\n  pos.y += vertOffset.y;\n#endif\n}\nvec2 computeUV(float frameIndex, vec2 vertIndex, vec2 frameTile) {\n  vec2 aniUV = vec2(0, floor(frameIndex * frameTile.y));\n  aniUV.x = floor(frameIndex * frameTile.x * frameTile.y - aniUV.y * frameTile.x);\n  \n  vertIndex.x = 1. - vertIndex.x;\n  return (aniUV.xy + vertIndex) / vec2(frameTile.x, frameTile.y);\n}\nvoid rotateCorner(inout vec2 corner, float angle) {\n  float xOS = cos(angle) * corner.x - sin(angle) * corner.y;\n  float yOS = sin(angle) * corner.x + cos(angle) * corner.y;\n  corner.x = xOS;\n  corner.y = yOS;\n}\nattribute vec3 a_position; \nattribute vec3 a_texCoord;  \nattribute vec2 a_texCoord1; \nattribute vec4 a_color;\n#if USE_STRETCHED_BILLBOARD\nattribute vec3 a_color1; \n#endif\nvec4 lpvs_main() {\n  vec4 pos = vec4(a_position, 1);\n#if USE_STRETCHED_BILLBOARD\n  vec4 velocity = vec4(a_color1.xyz, 0);\n#endif\n#if !USE_WORLD_SPACE\n  pos = cc_matWorld * pos;\n  #if USE_STRETCHED_BILLBOARD\n  velocity = cc_matWorld * velocity;\n  #endif\n#endif\n  vec2 cornerOffset = vec2((a_texCoord.xy - 0.5) * a_texCoord1.x);\n#if !USE_STRETCHED_BILLBOARD\n  rotateCorner(cornerOffset, a_texCoord1.y);\n#endif\n  computeVertPos(pos, cornerOffset\n  #if USE_BILLBOARD || USE_VERTICAL_BILLBOARD\n    , cc_matView\n  #endif\n  #if USE_STRETCHED_BILLBOARD\n    , cc_cameraPos.xyz\n    , velocity\n    , frameTile_velLenScale.z\n    , frameTile_velLenScale.w\n    , a_texCoord1.x\n    , a_texCoord.x\n  #endif\n  );\n  pos = cc_matViewProj * pos;\n  uv = computeUV(a_texCoord.z, a_texCoord.xy, frameTile_velLenScale.xy) * mainTiling_Offset.xy + mainTiling_Offset.zw;\n  color = a_color;\n  return pos;\n}\nvoid main() { gl_Position = lpvs_main(); }\n`,
          "frag": `
      precision mediump float;
      varying vec2 uv;
      varying vec4 color;
      
      uniform sampler2D mainTexture;
      uniform vec4 tintColor;
      
      vec4 add () {
        return 2.0 * color * tintColor * texture2D(mainTexture, uv);
      }
      
      vec4 multiply () {
        vec4 col;
        vec4 texColor = texture2D(mainTexture, uv);
        col.rgb = tintColor.rgb * texColor.rgb * color.rgb * vec3(2.0);
        col.a = (1.0 - texColor.a) * (tintColor.a * color.a * 2.0);
        return col;
      }
      
      void main() { gl_FragColor = add(); }
      `
        },
        "builtins": {"blocks":["CCGlobal", "CCLocal"], "textures":[]},
        "defines": [
          {"name":"USE_BILLBOARD", "type":"boolean", "defines":[]},
          {"name":"USE_STRETCHED_BILLBOARD", "type":"boolean", "defines":[]},
          {"name":"USE_HORIZONTAL_BILLBOARD", "type":"boolean", "defines":[]},
          {"name":"USE_VERTICAL_BILLBOARD", "type":"boolean", "defines":[]},
          {"name":"USE_WORLD_SPACE", "type":"boolean", "defines":[]}
        ],
        "blocks": [
          {"name": "Constants", "size": 32, "defines": [], "binding": 0, "members": [
            {"name":"mainTiling_Offset", "type":16, "count":1, "size":16},
            {"name":"frameTile_velLenScale", "type":16, "count":1, "size":16}
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
    "name": "builtin-skybox",
    "techniques": [
      {"passes":[{"rasterizerState":{"cullMode":0}, "depthStencilState":{"depthTest":true, "depthWrite":false}, "program":"builtin-skybox|sky-vs:vert|sky-fs:frag", "properties":{"cubeMap":{"type":32, "value":"default-cube"}}, "priority":10}]}
    ],
    "shaders": [
      {
        "name": "builtin-skybox|sky-vs:vert|sky-fs:frag",
        "glsl3": {
          "vert": `\nprecision mediump float;\nin vec3 a_position;\nuniform CCGlobal {\n  \n  vec4 cc_time; \n  vec4 cc_screenSize; \n  vec4 cc_screenScale; \n  \n  mat4 cc_matView;\n  mat4 cc_matViewInv;\n  mat4 cc_matProj;\n  mat4 cc_matProjInv;\n  mat4 cc_matViewProj;\n  mat4 cc_matViewProjInv;\n  vec4 cc_cameraPos; \n  vec4 cc_mainLitDir; \n  vec4 cc_mainLitColor; \n  vec4 cc_ambientSky;\n  vec4 cc_ambientGround;\n};\nout vec3 viewDir;\nvec4 vert () {\n  mat4 matViewRotOnly = mat4(mat3(cc_matView));\n  vec4 clipPos = cc_matProj * matViewRotOnly * vec4(a_position, 1.0);\n  viewDir = a_position;\n  vec4 pos = clipPos;\n  pos.z = clipPos.w * 0.99999;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
          "frag": `\nprecision mediump float;\nin vec3 viewDir;\nuniform samplerCube cubeMap;\nvec3 gammaToLinearSpaceRGB(vec3 sRGB) { \n  return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);\n}\nvec3 linearToGammaSpaceRGB(vec3 RGB) { \n  vec3 S1 = sqrt(RGB);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return 0.585122381 * S1 + 0.783140355 * S2 - 0.368262736 * S3;\n}\nvec4 gammaToLinearSpaceRGBA(vec4 sRGBA) {\n  return vec4(gammaToLinearSpaceRGB(sRGBA.rgb), sRGBA.a);\n}\nvec4 linearToGammaSpaceRGBA(vec4 RGBA) {\n  return vec4(linearToGammaSpaceRGB(RGBA.rgb), RGBA.a);\n}\nfloat gammaToLinearSpaceExact(float val) {\n  if (val <= 0.04045) {\n    return val / 12.92;\n  } else if (val < 1.0) {\n    return pow((val + 0.055) / 1.055, 2.4);\n  } else {\n    return pow(val, 2.2);\n  }\n}\nfloat linearToGammaSpaceExact(float val) {\n  if (val <= 0.0) {\n    return 0.0;\n  } else if (val <= 0.0031308) {\n    return 12.92 * val;\n  } else if (val < 1.0) {\n    return 1.055 * pow(val, 0.4166667) - 0.055;\n  } else {\n    return pow(val, 0.45454545);\n  }\n}\nvec3 unpackNormal(vec4 nmap) {\n  return nmap.xyz * 2.0 - 1.0;\n}\nvec3 unpackRGBE(vec4 rgbe) {\n    return rgbe.rgb * pow(2.0, rgbe.a * 255.0 - 128.0);\n}\nvec4 frag () {\n#if USE_RGBE_CUBEMAP\n    vec3 c = unpackRGBE(texture(cubeMap, viewDir));\n    c = linearToGammaSpaceRGB(c / (1.0 + c));\n    return vec4(c, 1.0);\n#else\n    return texture(cubeMap, viewDir);\n#endif\n}\nout vec4 cc_FragColor;\nvoid main() { cc_FragColor = frag(); }\n`
        },
        "glsl1": {
          "vert": `\nprecision mediump float;\nattribute vec3 a_position;\nuniform vec4 cc_time;\nuniform vec4 cc_screenSize;\nuniform vec4 cc_screenScale;\nuniform mat4 cc_matView;\nuniform mat4 cc_matViewInv;\nuniform mat4 cc_matProj;\nuniform mat4 cc_matProjInv;\nuniform mat4 cc_matViewProj;\nuniform mat4 cc_matViewProjInv;\nuniform vec4 cc_cameraPos;\nuniform vec4 cc_mainLitDir;\nuniform vec4 cc_mainLitColor;\nuniform vec4 cc_ambientSky;\nuniform vec4 cc_ambientGround;\nvarying vec3 viewDir;\nvec4 vert () {\n  mat4 matViewRotOnly = mat4(mat3(cc_matView));\n  vec4 clipPos = cc_matProj * matViewRotOnly * vec4(a_position, 1.0);\n  viewDir = a_position;\n  vec4 pos = clipPos;\n  pos.z = clipPos.w * 0.99999;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
          "frag": `
      precision mediump float;
      varying vec3 viewDir;
      
      uniform samplerCube cubeMap;
      
      vec3 gammaToLinearSpaceRGB(vec3 sRGB) { 
        return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);
      }
      
      vec3 linearToGammaSpaceRGB(vec3 RGB) { 
        vec3 S1 = sqrt(RGB);
        vec3 S2 = sqrt(S1);
        vec3 S3 = sqrt(S2);
        return 0.585122381 * S1 + 0.783140355 * S2 - 0.368262736 * S3;
      }
      
      vec4 gammaToLinearSpaceRGBA(vec4 sRGBA) {
        return vec4(gammaToLinearSpaceRGB(sRGBA.rgb), sRGBA.a);
      }
      
      vec4 linearToGammaSpaceRGBA(vec4 RGBA) {
        return vec4(linearToGammaSpaceRGB(RGBA.rgb), RGBA.a);
      }
      
      float gammaToLinearSpaceExact(float val) {
        if (val <= 0.04045) {
          return val / 12.92;
        } else if (val < 1.0) {
          return pow((val + 0.055) / 1.055, 2.4);
        } else {
          return pow(val, 2.2);
        }
      }
      
      float linearToGammaSpaceExact(float val) {
        if (val <= 0.0) {
          return 0.0;
        } else if (val <= 0.0031308) {
          return 12.92 * val;
        } else if (val < 1.0) {
          return 1.055 * pow(val, 0.4166667) - 0.055;
        } else {
          return pow(val, 0.45454545);
        }
      }
      
      vec3 unpackNormal(vec4 nmap) {
        return nmap.xyz * 2.0 - 1.0;
      }
      
      vec3 unpackRGBE(vec4 rgbe) {
          return rgbe.rgb * pow(2.0, rgbe.a * 255.0 - 128.0);
      }
      
      vec4 frag () {
      #if USE_RGBE_CUBEMAP
          vec3 c = unpackRGBE(textureCube(cubeMap, viewDir));
          c = linearToGammaSpaceRGB(c / (1.0 + c));
          return vec4(c, 1.0);
      #else
          return textureCube(cubeMap, viewDir);
      #endif
      }
      
      void main() { gl_FragColor = frag(); }
      `
        },
        "builtins": {"blocks":["CCGlobal"], "textures":[]},
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
    "name": "builtin-sprite",
    "techniques": [
      {"passes":[{"depthStencilState":{"depthTest":true, "depthWrite":false}, "blendState":{"targets":[{"blend":true, "blendSrc":2, "blendDst":4, "blendDstAlpha":4}]}, "program":"builtin-sprite|sprite-vs:vert|sprite-fs:frag", "properties":{"mainTexture":{"type":29, "value":"white"}}, "priority":244}]}
    ],
    "shaders": [
      {
        "name": "builtin-sprite|sprite-vs:vert|sprite-fs:frag",
        "glsl3": {
          "vert": `\nprecision mediump float;\nuniform CCGlobal {\n  \n  vec4 cc_time; \n  vec4 cc_screenSize; \n  vec4 cc_screenScale; \n  \n  mat4 cc_matView;\n  mat4 cc_matViewInv;\n  mat4 cc_matProj;\n  mat4 cc_matProjInv;\n  mat4 cc_matViewProj;\n  mat4 cc_matViewProjInv;\n  vec4 cc_cameraPos; \n  vec4 cc_mainLitDir; \n  vec4 cc_mainLitColor; \n  vec4 cc_ambientSky;\n  vec4 cc_ambientGround;\n};\nin vec3 a_position;\nin vec2 a_texCoord;\nin vec4 a_color;\nout vec2 uv0;\nout vec4 color;\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1);\n  pos = cc_matViewProj * pos;\n  uv0 = a_texCoord;\n  color = a_color;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
          "frag": `\nprecision mediump float;\nin vec2 uv0;\nin vec4 color;\nuniform sampler2D mainTexture;\nvec4 frag () {\n  vec4 o = vec4(1, 1, 1, 1);\n  o *= texture(mainTexture, uv0);\n  o *= color;\n  return o;\n}\nout vec4 cc_FragColor;\nvoid main() { cc_FragColor = frag(); }\n`
        },
        "glsl1": {
          "vert": `\nprecision mediump float;\nuniform vec4 cc_time;\nuniform vec4 cc_screenSize;\nuniform vec4 cc_screenScale;\nuniform mat4 cc_matView;\nuniform mat4 cc_matViewInv;\nuniform mat4 cc_matProj;\nuniform mat4 cc_matProjInv;\nuniform mat4 cc_matViewProj;\nuniform mat4 cc_matViewProjInv;\nuniform vec4 cc_cameraPos;\nuniform vec4 cc_mainLitDir;\nuniform vec4 cc_mainLitColor;\nuniform vec4 cc_ambientSky;\nuniform vec4 cc_ambientGround;\nattribute vec3 a_position;\nattribute vec2 a_texCoord;\nattribute vec4 a_color;\nvarying vec2 uv0;\nvarying vec4 color;\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1);\n  pos = cc_matViewProj * pos;\n  uv0 = a_texCoord;\n  color = a_color;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
          "frag": `
      precision mediump float;
      varying vec2 uv0;
      varying vec4 color;
      
      uniform sampler2D mainTexture;
      
      vec4 frag () {
        vec4 o = vec4(1, 1, 1, 1);
      
        o *= texture2D(mainTexture, uv0);
        o *= color;
      
        return o;
      }
      
      void main() { gl_FragColor = frag(); }
      `
        },
        "builtins": {"blocks":["CCGlobal"], "textures":[]},
        "defines": [],
        "blocks": [],
        "samplers": [
          {"name":"mainTexture", "type":29, "count":1, "defines":[], "binding":0}
        ],
        "dependencies": {}
      }
    ]
  },
  {
    "name": "builtin-standard",
    "techniques": [
      {"name":"opaque", "passes":[{"program":"builtin-standard|standard-vs:vert|standard-fs:frag", "properties":{"tilingOffset":{"type":16, "value":[1, 1, 0, 0]}, "albedo":{"type":17, "value":[1, 1, 1, 1]}, "albedoScale":{"type":16, "value":[1, 1, 1, 0]}, "pbrParams":{"type":16, "value":[0.6, 0.2, 1, 1]}, "pbrScale":{"type":16, "value":[1, 1, 1, 1]}, "emissive":{"type":17, "value":[1, 1, 1, 1]}, "emissiveScale":{"type":16, "value":[1, 1, 1, 1]}, "albedoSampler":{"type":29, "value":"grey"}, "normalSampler":{"type":29, "value":"normal"}, "pbrSampler":{"type":29, "value":"grey"}, "emissiveSampler":{"type":29, "value":"grey"}}}]}
    ],
    "shaders": [
      {
        "name": "builtin-standard|standard-vs:vert|standard-fs:frag",
        "glsl3": {
          "vert": `\nprecision mediump float;\nuniform CCGlobal {\n  \n  vec4 cc_time; \n  vec4 cc_screenSize; \n  vec4 cc_screenScale; \n  \n  mat4 cc_matView;\n  mat4 cc_matViewInv;\n  mat4 cc_matProj;\n  mat4 cc_matProjInv;\n  mat4 cc_matViewProj;\n  mat4 cc_matViewProjInv;\n  vec4 cc_cameraPos; \n  vec4 cc_mainLitDir; \n  vec4 cc_mainLitColor; \n  vec4 cc_ambientSky;\n  vec4 cc_ambientGround;\n};\nuniform CCLocal {\n  mat4 cc_matWorld;\n  mat4 cc_matWorldIT;\n};\n#if CC_USE_SKINNING\nin vec4 a_weights;\nin vec4 a_joints;\nuniform CCSkinning {\n  mat4 cc_matJoint[128];\n  vec4 cc_jointsTextureSize;\n};\n#if CC_USE_JOINTS_TEXTURE\nuniform sampler2D cc_jointsTexture;\nmat4 getBoneMatrix(const in float i) {\n  float size = cc_jointsTextureSize.x;\n  float j = i * 4.0;\n  float x = mod(j, size);\n  float y = floor(j / size);\n  float dx = 1.0 / size;\n  float dy = 1.0 / size;\n  y = dy * (y + 0.5);\n  vec4 v1 = texture(cc_jointsTexture, vec2(dx * (x + 0.5), y));\n  vec4 v2 = texture(cc_jointsTexture, vec2(dx * (x + 1.5), y));\n  vec4 v3 = texture(cc_jointsTexture, vec2(dx * (x + 2.5), y));\n  vec4 v4 = texture(cc_jointsTexture, vec2(dx * (x + 3.5), y));\n  return mat4(v1, v2, v3, v4);\n}\n#else\nmat4 getBoneMatrix(const in float i) {\n  return cc_matJoint[int(i)];\n}\n#endif\nmat4 skinMatrix() {\n  return\n    getBoneMatrix(a_joints.x) * a_weights.x +\n    getBoneMatrix(a_joints.y) * a_weights.y +\n    getBoneMatrix(a_joints.z) * a_weights.z +\n    getBoneMatrix(a_joints.w) * a_weights.w;\n}\nvoid skinVertex(inout vec4 a1) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2, inout vec4 a3) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n  a3 = m * a3;\n}\n#endif\nin vec3 a_position;\nin vec3 a_normal;\nout vec3 v_worldPos;\nout vec3 v_worldNormal;\n#if USE_ALBEDO_MAP || USE_NORMAL_MAP || USE_PBR_MAP || USE_EMISSIVE_MAP\n  in vec2 a_texCoord;\n  out vec2 v_uv;\n#endif\nuniform Constants {\n  vec4 tilingOffset;\n  vec4 albedo;\n  vec4 albedoScale;   \n  vec4 pbrParams;     \n  vec4 pbrScale;      \n  vec4 emissive;\n  vec4 emissiveScale;\n};\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1.0);\n  vec4 normal = vec4(a_normal, 0.0);\n  #if CC_USE_SKINNING\n    skinVertex(pos, normal);\n  #endif\n  v_worldPos = (cc_matWorld * pos).xyz;\n  v_worldNormal = (cc_matWorldIT * normal).xyz;\n  #if USE_ALBEDO_MAP || USE_NORMAL_MAP || USE_PBR_MAP || USE_EMISSIVE_MAP\n    v_uv = a_texCoord * tilingOffset.xy + tilingOffset.zw;\n  #endif\n  return cc_matViewProj * cc_matWorld * pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
          "frag": `\nprecision mediump float;\nuniform CCGlobal {\n  \n  vec4 cc_time; \n  vec4 cc_screenSize; \n  vec4 cc_screenScale; \n  \n  mat4 cc_matView;\n  mat4 cc_matViewInv;\n  mat4 cc_matProj;\n  mat4 cc_matProjInv;\n  mat4 cc_matViewProj;\n  mat4 cc_matViewProjInv;\n  vec4 cc_cameraPos; \n  vec4 cc_mainLitDir; \n  vec4 cc_mainLitColor; \n  vec4 cc_ambientSky;\n  vec4 cc_ambientGround;\n};\n#define MAX_LIGHTS 4\nuniform CCForwardLights {\n  vec4 cc_dirLightDirection[4]; \n  vec4 cc_dirLightColor[4]; \n  vec4 cc_pointLightPositionAndRange[4]; \n  vec4 cc_pointLightColor[4]; \n  vec4 cc_spotLightPositionAndRange[4]; \n  vec4 cc_spotLightDirection[4]; \n  vec4 cc_spotLightColor[4]; \n};\n#define PI 3.14159265359\n#define PI2 6.28318530718\n#define EPSILON 1e-6\n#define LOG2 1.442695\n#define saturate(a) clamp( a, 0.0, 1.0 )\nvec3 SRGBToLinear(vec3 gamma)\n{\n	return pow(gamma, vec3(2.2));\n	\n}\nvec3 LinearToSRGB(vec3 linear)\n{\n	return pow(linear, vec3(0.454545));\n	\n}\nfloat SmoothDistAtt(float sqrDist, float invSqrAttRadius)\n{\n	float factor = sqrDist * invSqrAttRadius;	\n	float factor2 = factor * factor;			\n	float factor3 = factor2 * factor2;			\n	float smoothFactor = clamp(1.0 - factor3 * factor3, 0.0, 1.0);\n	return smoothFactor * smoothFactor;\n}\nfloat GetDistAtt(float distSqr, float invSqrAttRadius)\n{\n	float attenuation = 1.0 / max(distSqr, 0.01*0.01);\n	attenuation *= SmoothDistAtt(distSqr , invSqrAttRadius);\n	return attenuation;\n}\nfloat GetAngleAtt(vec3 L, vec3 litDir, float litAngleScale, float litAngleOffset)\n{\n	float cd = dot(litDir, L);\n	float attenuation = clamp(cd * litAngleScale + litAngleOffset, 0.0, 1.0);\n	return (attenuation * attenuation);\n}\nfloat GGXMobile(float roughness, float NoH, vec3 H, vec3 N)\n{\n	vec3 NxH = cross(N, H);\n	float OneMinusNoHSqr = dot(NxH, NxH);\n	float a = roughness * roughness;\n	float n = NoH * a;\n	float p = a / (OneMinusNoHSqr + n * n);\n	return p * p;\n}\nfloat CalcSpecular(float roughness, float NoH, vec3 H, vec3 N)\n{\n	return (roughness*0.25 + 0.25) * GGXMobile(roughness, NoH, H, N);\n}\nvec3 BRDFApprox(vec3 specular, float roughness, float NoV)\n{\n	const vec4 c0 = vec4(-1.0, -0.0275, -0.572, 0.022);\n	const vec4 c1 = vec4(1.0, 0.0425, 1.04, -0.04);\n	vec4 r = roughness * c0 + c1;\n	float a004 = min( r.x * r.x, exp2( -9.28 * NoV ) ) * r.x + r.y;\n	vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;\n	AB.y *= clamp(50.0 * specular.g, 0.0, 1.0);\n	return specular * AB.x + AB.y;\n}\nin vec3 v_worldPos;\nin vec3 v_worldNormal;\n#if USE_ALBEDO_MAP || USE_NORMAL_MAP || USE_PBR_MAP || USE_EMISSIVE_MAP\n  in vec2 v_uv;\n#endif\nuniform Constants {\n  vec4 tilingOffset;\n  vec4 albedo;\n  vec4 albedoScale;   \n  vec4 pbrParams;     \n  vec4 pbrScale;      \n  vec4 emissive;\n  vec4 emissiveScale;\n};\n#if USE_ALBEDO_MAP\n  uniform sampler2D albedoSampler;\n#endif\n#if USE_NORMAL_MAP\n  uniform sampler2D normalSampler;\n#endif\n#if USE_PBR_MAP\n  uniform sampler2D pbrSampler;\n#endif\n#if USE_EMISSIVE_MAP\n  uniform sampler2D emissiveSampler;\n#endif\n#if USE_NORMAL_MAP\n  vec3 getNormal(vec3 pos, vec3 normal) {\n    vec3 q0 = vec3( dFdx( pos.x ), dFdx( pos.y ), dFdx( pos.z ) );\n    vec3 q1 = vec3( dFdy( pos.x ), dFdy( pos.y ), dFdy( pos.z ) );\n    vec2 st0 = dFdx( v_uv.st );\n    vec2 st1 = dFdy( v_uv.st );\n    vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n    vec3 N = normal;\n    vec3 mapN = texture(normalSampler, v_uv).rgb * 2.0 - 1.0;\n    mapN.xy = 1.0 * mapN.xy;\n    mat3 tsn = mat3( S, T, N );\n    return normalize( tsn * mapN );\n  }\n#endif\nvec4 frag () {\n  #if USE_ALBEDO_MAP\n    vec4 baseColor = texture(albedoSampler, v_uv);\n  #else\n    vec4 baseColor = albedo;\n  #endif\n  baseColor.rgb *= albedoScale.rgb;\n  baseColor.rgb = SRGBToLinear(baseColor.rgb);\n  #if USE_ALPHA_TEST\n    if(baseColor.a < albedoScale.a)\n      discard;\n  #endif\n  vec3 N = normalize(v_worldNormal);\n  #if USE_NORMAL_MAP\n    N = getNormal(v_worldPos, N);\n  #endif\n  #if USE_PBR_MAP\n    vec4 pbr = texture(pbrSampler, v_uv);\n  #else\n    vec4 pbr = pbrParams;\n  #endif\n  pbr *= pbrScale;\n  float roughness = clamp(pbr.r, 0.04, 1.0);\n  float metallic = clamp(pbr.g, 0.0, 1.0);\n  vec3 diffuse = baseColor.rgb * 0.96 * (1.0 - metallic);\n  vec3 specular = mix(vec3(0.04), baseColor.rgb, metallic);\n  vec3 V = normalize(cc_cameraPos.xyz - v_worldPos);\n  vec3 L = normalize(-cc_mainLitDir.xyz);\n  vec3 H = normalize(L+V);\n  float NV = max(abs(dot(N, V)), 0.001);\n  float NL = max(dot(N, L), 0.001);\n  float NH = max(dot(N, H), 0.0);\n  specular = BRDFApprox(specular, roughness, NV);\n  vec3 R = normalize(reflect(-V, N));\n  \n  vec3 specularContrib = specular * CalcSpecular(roughness, NH, H, N);\n  vec3 diffuseContrib = diffuse / 3.14159265359;\n  vec3 finalColor = NL * cc_mainLitColor.rgb * cc_mainLitColor.w * (diffuseContrib + specularContrib);\n  for (int i = 0; i < 4; i++) {\n    \n    vec3 dL = normalize(-cc_dirLightDirection[i].xyz);\n    vec3 dH = normalize(dL+V);\n    float dNL = max(dot(N, dL), 0.001);\n    float dNH = max(dot(N, dH), 0.0);\n    vec3 dSpec = specular * CalcSpecular(roughness, dNH, dH, N);\n    finalColor += dNL * cc_dirLightColor[i].rgb * cc_dirLightColor[i].w * (diffuseContrib + dSpec);\n    vec3 PLU = cc_pointLightPositionAndRange[i].xyz - v_worldPos;\n    vec3 PL = normalize(PLU);\n    vec3 PH = normalize(PL+V);\n    float PNL = max(dot(N, PL), 0.001);\n    float PNH = max(dot(N, PH), 0.0);\n    float pInvSqrAttRadius = 1.0 / max(cc_pointLightPositionAndRange[i].w, 0.01);\n    pInvSqrAttRadius *= pInvSqrAttRadius;\n    float pDistSqr = dot(PLU, PLU);\n    float pAtt = GetDistAtt(pDistSqr, pInvSqrAttRadius);\n    vec3 pSpec = specular * CalcSpecular(roughness, PNH, PH, N);\n    finalColor += PNL * cc_pointLightColor[i].rgb * cc_pointLightColor[i].w * pAtt * (diffuseContrib + pSpec);\n    vec3 SLU = cc_spotLightPositionAndRange[i].xyz - v_worldPos;\n    vec3 SL = normalize(SLU);\n    vec3 SH = normalize(SL+V);\n    float SNL = max(dot(N, SL), 0.001);\n    float SNH = max(dot(N, SH), 0.0);\n    float cosConeAngle = max(dot(-cc_spotLightDirection[i].xyz, SL), 0.01);\n    float sInvSqrAttRadius = 1.0 / max(cc_spotLightPositionAndRange[i].w, 0.01);\n    float sDistSqr = dot(SLU, SLU);\n    float sAtt = GetDistAtt(sDistSqr, sInvSqrAttRadius);\n    sAtt *= cosConeAngle;\n    vec3 sSpec = specular * CalcSpecular(roughness, SNH, SH, N);\n    finalColor += SNL * cc_spotLightColor[i].rgb * cc_spotLightColor[i].w * sAtt * (diffuseContrib + sSpec);\n  }\n  float fAmb = dot(N, vec3(0.0, -1.0, 0.0)) * 0.5 + 0.5;\n  vec3 ambDiff = mix(cc_ambientSky.rgb, cc_ambientGround.rgb, fAmb) * cc_ambientSky.w;\n  finalColor += (ambDiff.rgb * diffuse);\n  finalColor = max(finalColor, vec3(0.0));\n  finalColor = LinearToSRGB(finalColor);\n  finalColor = max(finalColor, vec3(pbrParams.g));\n  return vec4(finalColor, baseColor.a);\n}\nout vec4 cc_FragColor;\nvoid main() { cc_FragColor = frag(); }\n`
        },
        "glsl1": {
          "vert": `\nprecision mediump float;\nuniform vec4 cc_time;\nuniform vec4 cc_screenSize;\nuniform vec4 cc_screenScale;\nuniform mat4 cc_matView;\nuniform mat4 cc_matViewInv;\nuniform mat4 cc_matProj;\nuniform mat4 cc_matProjInv;\nuniform mat4 cc_matViewProj;\nuniform mat4 cc_matViewProjInv;\nuniform vec4 cc_cameraPos;\nuniform vec4 cc_mainLitDir;\nuniform vec4 cc_mainLitColor;\nuniform vec4 cc_ambientSky;\nuniform vec4 cc_ambientGround;\nuniform mat4 cc_matWorld;\nuniform mat4 cc_matWorldIT;\n#if CC_USE_SKINNING\nattribute vec4 a_weights;\nattribute vec4 a_joints;\nuniform mat4 cc_matJoint[128];\nuniform vec4 cc_jointsTextureSize;\n#if CC_USE_JOINTS_TEXTURE\nuniform sampler2D cc_jointsTexture;\nmat4 getBoneMatrix(const in float i) {\n  float size = cc_jointsTextureSize.x;\n  float j = i * 4.0;\n  float x = mod(j, size);\n  float y = floor(j / size);\n  float dx = 1.0 / size;\n  float dy = 1.0 / size;\n  y = dy * (y + 0.5);\n  vec4 v1 = texture2D(cc_jointsTexture, vec2(dx * (x + 0.5), y));\n  vec4 v2 = texture2D(cc_jointsTexture, vec2(dx * (x + 1.5), y));\n  vec4 v3 = texture2D(cc_jointsTexture, vec2(dx * (x + 2.5), y));\n  vec4 v4 = texture2D(cc_jointsTexture, vec2(dx * (x + 3.5), y));\n  return mat4(v1, v2, v3, v4);\n}\n#else\nmat4 getBoneMatrix(const in float i) {\n  return cc_matJoint[int(i)];\n}\n#endif\nmat4 skinMatrix() {\n  return\n    getBoneMatrix(a_joints.x) * a_weights.x +\n    getBoneMatrix(a_joints.y) * a_weights.y +\n    getBoneMatrix(a_joints.z) * a_weights.z +\n    getBoneMatrix(a_joints.w) * a_weights.w;\n}\nvoid skinVertex(inout vec4 a1) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2, inout vec4 a3) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n  a3 = m * a3;\n}\n#endif\nattribute vec3 a_position;\nattribute vec3 a_normal;\nvarying vec3 v_worldPos;\nvarying vec3 v_worldNormal;\n#if USE_ALBEDO_MAP || USE_NORMAL_MAP || USE_PBR_MAP || USE_EMISSIVE_MAP\n  attribute vec2 a_texCoord;\n  varying vec2 v_uv;\n#endif\nuniform vec4 tilingOffset;\nuniform vec4 albedo;\nuniform vec4 albedoScale;\nuniform vec4 pbrParams;\nuniform vec4 pbrScale;\nuniform vec4 emissive;\nuniform vec4 emissiveScale;\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1.0);\n  vec4 normal = vec4(a_normal, 0.0);\n  #if CC_USE_SKINNING\n    skinVertex(pos, normal);\n  #endif\n  v_worldPos = (cc_matWorld * pos).xyz;\n  v_worldNormal = (cc_matWorldIT * normal).xyz;\n  #if USE_ALBEDO_MAP || USE_NORMAL_MAP || USE_PBR_MAP || USE_EMISSIVE_MAP\n    v_uv = a_texCoord * tilingOffset.xy + tilingOffset.zw;\n  #endif\n  return cc_matViewProj * cc_matWorld * pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
          "frag": `
      precision mediump float;
      
      uniform vec4 cc_time;
      uniform vec4 cc_screenSize;
      uniform vec4 cc_screenScale;
      uniform mat4 cc_matView;
      uniform mat4 cc_matViewInv;
      uniform mat4 cc_matProj;
      uniform mat4 cc_matProjInv;
      uniform mat4 cc_matViewProj;
      uniform mat4 cc_matViewProjInv;
      uniform vec4 cc_cameraPos;
      uniform vec4 cc_mainLitDir;
      uniform vec4 cc_mainLitColor;
      uniform vec4 cc_ambientSky;
      uniform vec4 cc_ambientGround;
      
      #define MAX_LIGHTS 4
      
      uniform vec4 cc_dirLightDirection[4];
      uniform vec4 cc_dirLightColor[4];
      uniform vec4 cc_pointLightPositionAndRange[4];
      uniform vec4 cc_pointLightColor[4];
      uniform vec4 cc_spotLightPositionAndRange[4];
      uniform vec4 cc_spotLightDirection[4];
      uniform vec4 cc_spotLightColor[4];
      
      #define PI 3.14159265359
      #define PI2 6.28318530718
      #define EPSILON 1e-6
      #define LOG2 1.442695
      
      #define saturate(a) clamp( a, 0.0, 1.0 )
      
      vec3 SRGBToLinear(vec3 gamma)
      {
      	return pow(gamma, vec3(2.2));
      	
      }
      
      vec3 LinearToSRGB(vec3 linear)
      {
      	return pow(linear, vec3(0.454545));
      	
      }
      
      float SmoothDistAtt(float sqrDist, float invSqrAttRadius)
      {
      	float factor = sqrDist * invSqrAttRadius;	
      	float factor2 = factor * factor;			
      	float factor3 = factor2 * factor2;			
      	float smoothFactor = clamp(1.0 - factor3 * factor3, 0.0, 1.0);
      	return smoothFactor * smoothFactor;
      }
      
      float GetDistAtt(float distSqr, float invSqrAttRadius)
      {
      	float attenuation = 1.0 / max(distSqr, 0.01*0.01);
      	attenuation *= SmoothDistAtt(distSqr , invSqrAttRadius);
      	return attenuation;
      }
      
      float GetAngleAtt(vec3 L, vec3 litDir, float litAngleScale, float litAngleOffset)
      {
      	float cd = dot(litDir, L);
      	float attenuation = clamp(cd * litAngleScale + litAngleOffset, 0.0, 1.0);
      	return (attenuation * attenuation);
      }
      
      float GGXMobile(float roughness, float NoH, vec3 H, vec3 N)
      {
      	vec3 NxH = cross(N, H);
      	float OneMinusNoHSqr = dot(NxH, NxH);
      	float a = roughness * roughness;
      	float n = NoH * a;
      	float p = a / (OneMinusNoHSqr + n * n);
      	return p * p;
      }
      
      float CalcSpecular(float roughness, float NoH, vec3 H, vec3 N)
      {
      	return (roughness*0.25 + 0.25) * GGXMobile(roughness, NoH, H, N);
      }
      
      vec3 BRDFApprox(vec3 specular, float roughness, float NoV)
      {
      	const vec4 c0 = vec4(-1.0, -0.0275, -0.572, 0.022);
      	const vec4 c1 = vec4(1.0, 0.0425, 1.04, -0.04);
      	vec4 r = roughness * c0 + c1;
      	float a004 = min( r.x * r.x, exp2( -9.28 * NoV ) ) * r.x + r.y;
      	vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;
      	AB.y *= clamp(50.0 * specular.g, 0.0, 1.0);
      	return specular * AB.x + AB.y;
      }
      
      varying vec3 v_worldPos;
      varying vec3 v_worldNormal;
      
      #if USE_ALBEDO_MAP || USE_NORMAL_MAP || USE_PBR_MAP || USE_EMISSIVE_MAP
        varying vec2 v_uv;
      #endif
      
      uniform vec4 tilingOffset;
      uniform vec4 albedo;
      uniform vec4 albedoScale;
      uniform vec4 pbrParams;
      uniform vec4 pbrScale;
      uniform vec4 emissive;
      uniform vec4 emissiveScale;
      
      #if USE_ALBEDO_MAP
        uniform sampler2D albedoSampler;
      #endif
      #if USE_NORMAL_MAP
        uniform sampler2D normalSampler;
      #endif
      #if USE_PBR_MAP
        uniform sampler2D pbrSampler;
      #endif
      #if USE_EMISSIVE_MAP
        uniform sampler2D emissiveSampler;
      #endif
      
      #if USE_NORMAL_MAP
        vec3 getNormal(vec3 pos, vec3 normal) {
          vec3 q0 = vec3( dFdx( pos.x ), dFdx( pos.y ), dFdx( pos.z ) );
          vec3 q1 = vec3( dFdy( pos.x ), dFdy( pos.y ), dFdy( pos.z ) );
          vec2 st0 = dFdx( v_uv.st );
          vec2 st1 = dFdy( v_uv.st );
          vec3 S = normalize( q0 * st1.t - q1 * st0.t );
          vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
          vec3 N = normal;
          vec3 mapN = texture2D(normalSampler, v_uv).rgb * 2.0 - 1.0;
          mapN.xy = 1.0 * mapN.xy;
          mat3 tsn = mat3( S, T, N );
          return normalize( tsn * mapN );
        }
      #endif
      
      vec4 frag () {
        #if USE_ALBEDO_MAP
          vec4 baseColor = texture2D(albedoSampler, v_uv);
        #else
          vec4 baseColor = albedo;
        #endif
        baseColor.rgb *= albedoScale.rgb;
        baseColor.rgb = SRGBToLinear(baseColor.rgb);
      
        #if USE_ALPHA_TEST
          if(baseColor.a < albedoScale.a)
            discard;
        #endif
      
        vec3 N = normalize(v_worldNormal);
        #if USE_NORMAL_MAP
          N = getNormal(v_worldPos, N);
        #endif
      
        #if USE_PBR_MAP
          vec4 pbr = texture2D(pbrSampler, v_uv);
        #else
          vec4 pbr = pbrParams;
        #endif
        pbr *= pbrScale;
        float roughness = clamp(pbr.r, 0.04, 1.0);
        float metallic = clamp(pbr.g, 0.0, 1.0);
      
        vec3 diffuse = baseColor.rgb * 0.96 * (1.0 - metallic);
        vec3 specular = mix(vec3(0.04), baseColor.rgb, metallic);
      
        vec3 V = normalize(cc_cameraPos.xyz - v_worldPos);
        vec3 L = normalize(-cc_mainLitDir.xyz);
        vec3 H = normalize(L+V);
        float NV = max(abs(dot(N, V)), 0.001);
        float NL = max(dot(N, L), 0.001);
        float NH = max(dot(N, H), 0.0);
      
        specular = BRDFApprox(specular, roughness, NV);
      
        vec3 R = normalize(reflect(-V, N));
        
        vec3 specularContrib = specular * CalcSpecular(roughness, NH, H, N);
      
        vec3 diffuseContrib = diffuse / 3.14159265359;
        vec3 finalColor = NL * cc_mainLitColor.rgb * cc_mainLitColor.w * (diffuseContrib + specularContrib);
      
        for (int i = 0; i < 4; i++) {
          
          vec3 dL = normalize(-cc_dirLightDirection[i].xyz);
          vec3 dH = normalize(dL+V);
          float dNL = max(dot(N, dL), 0.001);
          float dNH = max(dot(N, dH), 0.0);
          vec3 dSpec = specular * CalcSpecular(roughness, dNH, dH, N);
          finalColor += dNL * cc_dirLightColor[i].rgb * cc_dirLightColor[i].w * (diffuseContrib + dSpec);
      
          vec3 PLU = cc_pointLightPositionAndRange[i].xyz - v_worldPos;
          vec3 PL = normalize(PLU);
          vec3 PH = normalize(PL+V);
          float PNL = max(dot(N, PL), 0.001);
          float PNH = max(dot(N, PH), 0.0);
          float pInvSqrAttRadius = 1.0 / max(cc_pointLightPositionAndRange[i].w, 0.01);
          pInvSqrAttRadius *= pInvSqrAttRadius;
          float pDistSqr = dot(PLU, PLU);
          float pAtt = GetDistAtt(pDistSqr, pInvSqrAttRadius);
          vec3 pSpec = specular * CalcSpecular(roughness, PNH, PH, N);
          finalColor += PNL * cc_pointLightColor[i].rgb * cc_pointLightColor[i].w * pAtt * (diffuseContrib + pSpec);
      
          vec3 SLU = cc_spotLightPositionAndRange[i].xyz - v_worldPos;
          vec3 SL = normalize(SLU);
          vec3 SH = normalize(SL+V);
          float SNL = max(dot(N, SL), 0.001);
          float SNH = max(dot(N, SH), 0.0);
          float cosConeAngle = max(dot(-cc_spotLightDirection[i].xyz, SL), 0.01);
          float sInvSqrAttRadius = 1.0 / max(cc_spotLightPositionAndRange[i].w, 0.01);
          float sDistSqr = dot(SLU, SLU);
          float sAtt = GetDistAtt(sDistSqr, sInvSqrAttRadius);
          sAtt *= cosConeAngle;
          vec3 sSpec = specular * CalcSpecular(roughness, SNH, SH, N);
          finalColor += SNL * cc_spotLightColor[i].rgb * cc_spotLightColor[i].w * sAtt * (diffuseContrib + sSpec);
        }
      
        float fAmb = dot(N, vec3(0.0, -1.0, 0.0)) * 0.5 + 0.5;
        vec3 ambDiff = mix(cc_ambientSky.rgb, cc_ambientGround.rgb, fAmb) * cc_ambientSky.w;
        finalColor += (ambDiff.rgb * diffuse);
        finalColor = max(finalColor, vec3(0.0));
        finalColor = LinearToSRGB(finalColor);
        finalColor = max(finalColor, vec3(pbrParams.g));
      
        return vec4(finalColor, baseColor.a);
      }
      
      void main() { gl_FragColor = frag(); }
      `
        },
        "builtins": {"blocks":["CCGlobal", "CCLocal", "CCSkinning", "CCForwardLights"], "textures":["cc_jointsTexture"]},
        "defines": [
          {"name":"CC_USE_SKINNING", "type":"boolean", "defines":[]},
          {"name":"CC_USE_JOINTS_TEXTURE", "type":"boolean", "defines":["CC_USE_SKINNING"]},
          {"name":"USE_ALBEDO_MAP", "type":"boolean", "defines":[]},
          {"name":"USE_NORMAL_MAP", "type":"boolean", "defines":[]},
          {"name":"USE_PBR_MAP", "type":"boolean", "defines":[]},
          {"name":"USE_EMISSIVE_MAP", "type":"boolean", "defines":[]},
          {"name":"USE_ALPHA_TEST", "type":"boolean", "defines":[]}
        ],
        "blocks": [
          {"name": "Constants", "size": 112, "defines": [], "binding": 0, "members": [
            {"name":"tilingOffset", "type":16, "count":1, "size":16},
            {"name":"albedo", "type":16, "count":1, "size":16},
            {"name":"albedoScale", "type":16, "count":1, "size":16},
            {"name":"pbrParams", "type":16, "count":1, "size":16},
            {"name":"pbrScale", "type":16, "count":1, "size":16},
            {"name":"emissive", "type":16, "count":1, "size":16},
            {"name":"emissiveScale", "type":16, "count":1, "size":16}
          ]}
        ],
        "samplers": [
          {"name":"albedoSampler", "type":29, "count":1, "defines":["USE_ALBEDO_MAP"], "binding":1},
          {"name":"normalSampler", "type":29, "count":1, "defines":["USE_NORMAL_MAP"], "binding":2},
          {"name":"pbrSampler", "type":29, "count":1, "defines":["USE_PBR_MAP"], "binding":3},
          {"name":"emissiveSampler", "type":29, "count":1, "defines":["USE_EMISSIVE_MAP"], "binding":4}
        ],
        "dependencies": {}
      }
    ]
  },
  {
    "name": "builtin-tonemap",
    "techniques": [
      {"name":"tonemap", "passes":[{"depthStencilState":{"depthTest":false, "depthWrite":false}, "program":"builtin-tonemap|tonemap-vs:vert|tonemap-fs:frag", "properties":{"u_texSampler":{"type":29, "sampler":{"minFilter":2, "magFilter":2, "mipFilter":0}}}}]}
    ],
    "shaders": [
      {
        "name": "builtin-tonemap|tonemap-vs:vert|tonemap-fs:frag",
        "glsl3": {
          "vert": `\nprecision mediump float;\n#define PI 3.14159265359\n#define PI2 6.28318530718\n#define EPSILON 1e-6\n#define LOG2 1.442695\n#define saturate(a) clamp( a, 0.0, 1.0 )\nuniform CCGlobal {\n  \n  vec4 cc_time; \n  vec4 cc_screenSize; \n  vec4 cc_screenScale; \n  \n  mat4 cc_matView;\n  mat4 cc_matViewInv;\n  mat4 cc_matProj;\n  mat4 cc_matProjInv;\n  mat4 cc_matViewProj;\n  mat4 cc_matViewProjInv;\n  vec4 cc_cameraPos; \n  vec4 cc_mainLitDir; \n  vec4 cc_mainLitColor; \n  vec4 cc_ambientSky;\n  vec4 cc_ambientGround;\n};\nin vec2 a_position;\nin vec2 a_texCoord;\nout vec2 v_uv;\nvec4 vert () {\n  vec4 pos = vec4(a_position, 0, 1);\n  v_uv = a_texCoord * cc_screenScale.xy;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
          "frag": `\nprecision mediump float;\nfloat ComputeEV100(float aperture , float shutterTime , float iso) {\n	return log2((aperture * aperture) / shutterTime * 100.0 / iso);\n}\nfloat ComputeExposure(float ev100) {\n	return 0.833333 * pow(2.0, ev100);\n}\nvec3 ACESToneMap(vec3 color) {\n    const float A = 2.51;\n    const float B = 0.03;\n    const float C = 2.43;\n    const float D = 0.59;\n    const float E = 0.14;\n    return (color * (A * color + B)) / (color * (C * color + D) + E);\n}\nin vec2 v_uv;\nuniform sampler2D u_texSampler;\nvec4 frag () {\n  vec4 o = texture(u_texSampler, v_uv);\n  \n  return o;\n}\nout vec4 cc_FragColor;\nvoid main() { cc_FragColor = frag(); }\n`
        },
        "glsl1": {
          "vert": `\nprecision mediump float;\n#define PI 3.14159265359\n#define PI2 6.28318530718\n#define EPSILON 1e-6\n#define LOG2 1.442695\n#define saturate(a) clamp( a, 0.0, 1.0 )\nuniform vec4 cc_time;\nuniform vec4 cc_screenSize;\nuniform vec4 cc_screenScale;\nuniform mat4 cc_matView;\nuniform mat4 cc_matViewInv;\nuniform mat4 cc_matProj;\nuniform mat4 cc_matProjInv;\nuniform mat4 cc_matViewProj;\nuniform mat4 cc_matViewProjInv;\nuniform vec4 cc_cameraPos;\nuniform vec4 cc_mainLitDir;\nuniform vec4 cc_mainLitColor;\nuniform vec4 cc_ambientSky;\nuniform vec4 cc_ambientGround;\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nvarying vec2 v_uv;\nvec4 vert () {\n  vec4 pos = vec4(a_position, 0, 1);\n  v_uv = a_texCoord * cc_screenScale.xy;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
          "frag": `
      precision mediump float;
      
      float ComputeEV100(float aperture , float shutterTime , float iso) {
      	return log2((aperture * aperture) / shutterTime * 100.0 / iso);
      }
      
      float ComputeExposure(float ev100) {
      	return 0.833333 * pow(2.0, ev100);
      }
      
      vec3 ACESToneMap(vec3 color) {
          const float A = 2.51;
          const float B = 0.03;
          const float C = 2.43;
          const float D = 0.59;
          const float E = 0.14;
          return (color * (A * color + B)) / (color * (C * color + D) + E);
      }
      
      varying vec2 v_uv;
      uniform sampler2D u_texSampler;
      
      vec4 frag () {
        vec4 o = texture2D(u_texSampler, v_uv);
        
        return o;
      }
      
      void main() { gl_FragColor = frag(); }
      `
        },
        "builtins": {"blocks":["CCGlobal"], "textures":[]},
        "defines": [],
        "blocks": [],
        "samplers": [
          {"name":"u_texSampler", "type":29, "count":1, "defines":[], "binding":0}
        ],
        "dependencies": {}
      }
    ]
  },
  {
    "name": "builtin-unlit",
    "techniques": [
      {"name":"opaque", "passes":[{"program":"builtin-unlit|unlit-vs:vert|unlit-fs:frag", "properties":{"color":{"type":17, "value":[1, 1, 1, 1]}, "tilingOffset":{"type":16, "value":[1, 1, 0, 0]}, "mainTexture":{"type":29, "value":"grey"}}}]}
    ],
    "shaders": [
      {
        "name": "builtin-unlit|unlit-vs:vert|unlit-fs:frag",
        "glsl3": {
          "vert": `\nprecision mediump float;\nuniform CCGlobal {\n  \n  vec4 cc_time; \n  vec4 cc_screenSize; \n  vec4 cc_screenScale; \n  \n  mat4 cc_matView;\n  mat4 cc_matViewInv;\n  mat4 cc_matProj;\n  mat4 cc_matProjInv;\n  mat4 cc_matViewProj;\n  mat4 cc_matViewProjInv;\n  vec4 cc_cameraPos; \n  vec4 cc_mainLitDir; \n  vec4 cc_mainLitColor; \n  vec4 cc_ambientSky;\n  vec4 cc_ambientGround;\n};\nuniform CCLocal {\n  mat4 cc_matWorld;\n  mat4 cc_matWorldIT;\n};\n#if CC_USE_SKINNING\nin vec4 a_weights;\nin vec4 a_joints;\nuniform CCSkinning {\n  mat4 cc_matJoint[128];\n  vec4 cc_jointsTextureSize;\n};\n#if CC_USE_JOINTS_TEXTURE\nuniform sampler2D cc_jointsTexture;\nmat4 getBoneMatrix(const in float i) {\n  float size = cc_jointsTextureSize.x;\n  float j = i * 4.0;\n  float x = mod(j, size);\n  float y = floor(j / size);\n  float dx = 1.0 / size;\n  float dy = 1.0 / size;\n  y = dy * (y + 0.5);\n  vec4 v1 = texture(cc_jointsTexture, vec2(dx * (x + 0.5), y));\n  vec4 v2 = texture(cc_jointsTexture, vec2(dx * (x + 1.5), y));\n  vec4 v3 = texture(cc_jointsTexture, vec2(dx * (x + 2.5), y));\n  vec4 v4 = texture(cc_jointsTexture, vec2(dx * (x + 3.5), y));\n  return mat4(v1, v2, v3, v4);\n}\n#else\nmat4 getBoneMatrix(const in float i) {\n  return cc_matJoint[int(i)];\n}\n#endif\nmat4 skinMatrix() {\n  return\n    getBoneMatrix(a_joints.x) * a_weights.x +\n    getBoneMatrix(a_joints.y) * a_weights.y +\n    getBoneMatrix(a_joints.z) * a_weights.z +\n    getBoneMatrix(a_joints.w) * a_weights.w;\n}\nvoid skinVertex(inout vec4 a1) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2, inout vec4 a3) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n  a3 = m * a3;\n}\n#endif\nin vec3 a_position;\n#if USE_TEXTURE\n  in vec2 a_texCoord;\n  out vec2 uv0;\n  uniform TexCoords {\n    vec4 tilingOffset;\n  };\n#endif\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1);\n  #if CC_USE_SKINNING\n    skinVertex(pos);\n  #endif\n  pos = cc_matViewProj * cc_matWorld * pos;\n  #if USE_TEXTURE\n    uv0 = a_texCoord * tilingOffset.xy + tilingOffset.zw;\n  #endif\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
          "frag": `\nprecision mediump float;\n#if USE_TEXTURE\n  in vec2 uv0;\n  uniform sampler2D mainTexture;\n#endif\n#if USE_COLOR\n  uniform Constant {\n    vec4 color;\n  };\n#endif\nvec4 frag () {\n  vec4 o = vec4(1, 1, 1, 1);\n  #if USE_TEXTURE\n    o *= texture(mainTexture, uv0);\n  #endif\n  #if USE_COLOR\n    o *= color;\n  #endif\n  return o;\n}\nout vec4 cc_FragColor;\nvoid main() { cc_FragColor = frag(); }\n`
        },
        "glsl1": {
          "vert": `\nprecision mediump float;\nuniform vec4 cc_time;\nuniform vec4 cc_screenSize;\nuniform vec4 cc_screenScale;\nuniform mat4 cc_matView;\nuniform mat4 cc_matViewInv;\nuniform mat4 cc_matProj;\nuniform mat4 cc_matProjInv;\nuniform mat4 cc_matViewProj;\nuniform mat4 cc_matViewProjInv;\nuniform vec4 cc_cameraPos;\nuniform vec4 cc_mainLitDir;\nuniform vec4 cc_mainLitColor;\nuniform vec4 cc_ambientSky;\nuniform vec4 cc_ambientGround;\nuniform mat4 cc_matWorld;\nuniform mat4 cc_matWorldIT;\n#if CC_USE_SKINNING\nattribute vec4 a_weights;\nattribute vec4 a_joints;\nuniform mat4 cc_matJoint[128];\nuniform vec4 cc_jointsTextureSize;\n#if CC_USE_JOINTS_TEXTURE\nuniform sampler2D cc_jointsTexture;\nmat4 getBoneMatrix(const in float i) {\n  float size = cc_jointsTextureSize.x;\n  float j = i * 4.0;\n  float x = mod(j, size);\n  float y = floor(j / size);\n  float dx = 1.0 / size;\n  float dy = 1.0 / size;\n  y = dy * (y + 0.5);\n  vec4 v1 = texture2D(cc_jointsTexture, vec2(dx * (x + 0.5), y));\n  vec4 v2 = texture2D(cc_jointsTexture, vec2(dx * (x + 1.5), y));\n  vec4 v3 = texture2D(cc_jointsTexture, vec2(dx * (x + 2.5), y));\n  vec4 v4 = texture2D(cc_jointsTexture, vec2(dx * (x + 3.5), y));\n  return mat4(v1, v2, v3, v4);\n}\n#else\nmat4 getBoneMatrix(const in float i) {\n  return cc_matJoint[int(i)];\n}\n#endif\nmat4 skinMatrix() {\n  return\n    getBoneMatrix(a_joints.x) * a_weights.x +\n    getBoneMatrix(a_joints.y) * a_weights.y +\n    getBoneMatrix(a_joints.z) * a_weights.z +\n    getBoneMatrix(a_joints.w) * a_weights.w;\n}\nvoid skinVertex(inout vec4 a1) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2, inout vec4 a3) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n  a3 = m * a3;\n}\n#endif\nattribute vec3 a_position;\n#if USE_TEXTURE\n  attribute vec2 a_texCoord;\n  varying vec2 uv0;\n  uniform vec4 tilingOffset;\n#endif\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1);\n  #if CC_USE_SKINNING\n    skinVertex(pos);\n  #endif\n  pos = cc_matViewProj * cc_matWorld * pos;\n  #if USE_TEXTURE\n    uv0 = a_texCoord * tilingOffset.xy + tilingOffset.zw;\n  #endif\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n`,
          "frag": `
      precision mediump float;
      
      #if USE_TEXTURE
        varying vec2 uv0;
        uniform sampler2D mainTexture;
      #endif
      
      #if USE_COLOR
        uniform vec4 color;
      
      #endif
      
      vec4 frag () {
        vec4 o = vec4(1, 1, 1, 1);
      
        #if USE_TEXTURE
          o *= texture2D(mainTexture, uv0);
        #endif
      
        #if USE_COLOR
          o *= color;
        #endif
      
        return o;
      }
      
      void main() { gl_FragColor = frag(); }
      `
        },
        "builtins": {"blocks":["CCGlobal", "CCLocal", "CCSkinning"], "textures":["cc_jointsTexture"]},
        "defines": [
          {"name":"CC_USE_SKINNING", "type":"boolean", "defines":[]},
          {"name":"CC_USE_JOINTS_TEXTURE", "type":"boolean", "defines":["CC_USE_SKINNING"]},
          {"name":"USE_TEXTURE", "type":"boolean", "defines":[]},
          {"name":"USE_COLOR", "type":"boolean", "defines":[]}
        ],
        "blocks": [
          {"name": "TexCoords", "size": 16, "defines": ["USE_TEXTURE"], "binding": 0, "members": [
            {"name":"tilingOffset", "type":16, "count":1, "size":16}
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
