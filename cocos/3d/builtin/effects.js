export default [
  {
    "name": "builtin-effect-unlit",
    "techniques": [{"queue":0,"lod":100,"passes":[{"stage":1,"cullMode":1029,"depthTest":true,"depthWrite":true,"program":"aa204b4f36b7a4b0c9e10806d01c41a2dcdfba410236f788b8f97fc9"}],"priority":0}],
    "properties": {"color":{"type":9,"value":[1,1,1,1]},"mainTiling":{"type":5,"value":[1,1]},"mainOffset":{"type":5,"value":[0,0]},"mainTexture":{"type":13,"value":null}},
    "shaders": [
      {
        "name": "aa204b4f36b7a4b0c9e10806d01c41a2dcdfba410236f788b8f97fc9",
        "vert": "\nattribute vec3 a_position;\nuniform mat4 _model;\nuniform mat4 _viewProj;\n#if USE_TEXTURE\n  attribute vec2 a_uv0;\n  uniform vec2 mainTiling;\n  uniform vec2 mainOffset;\n  varying vec2 uv0;\n#endif\n#if USE_SKINNING\n  \nattribute vec4 a_weights;\nattribute vec4 a_joints;\n#if USE_JOINTS_TEXTURE\nuniform sampler2D _u_jointsTexture;\nuniform float _u_jointsTextureSize;\nmat4 getBoneMatrix(const in float i) {\n  float size = _u_jointsTextureSize;\n  float j = i * 4.0;\n  float x = mod(j, size);\n  float y = floor(j / size);\n  float dx = 1.0 / size;\n  float dy = 1.0 / size;\n  y = dy * (y + 0.5);\n  vec4 v1 = texture2D(_u_jointsTexture, vec2(dx * (x + 0.5), y));\n  vec4 v2 = texture2D(_u_jointsTexture, vec2(dx * (x + 1.5), y));\n  vec4 v3 = texture2D(_u_jointsTexture, vec2(dx * (x + 2.5), y));\n  vec4 v4 = texture2D(_u_jointsTexture, vec2(dx * (x + 3.5), y));\n  return mat4(v1, v2, v3, v4);\n}\n#else\nuniform mat4 _u_jointMatrices[128];\nmat4 getBoneMatrix(const in float i) {\n  return _u_jointMatrices[int(i)];\n}\n#endif\nmat4 skinMatrix() {\n  return\n    getBoneMatrix(a_joints.x) * a_weights.x +\n    getBoneMatrix(a_joints.y) * a_weights.y +\n    getBoneMatrix(a_joints.z) * a_weights.z +\n    getBoneMatrix(a_joints.w) * a_weights.w\n    ;\n}\n#endif\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1);\n  #if USE_SKINNING\n    pos = skinMatrix() * pos;\n  #endif\n  pos = _viewProj * _model * pos;\n  #if USE_TEXTURE\n    uv0 = a_uv0 * mainTiling + mainOffset;\n  #endif\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n",
        "frag": "\n#if USE_TEXTURE\n  uniform sampler2D mainTexture;\n  varying vec2 uv0;\n#endif\n#if USE_COLOR\n  uniform vec4 color;\n#endif\nvec4 frag () {\n  vec4 o = vec4(1, 1, 1, 1);\n  #if USE_TEXTURE\n    o *= texture2D(mainTexture, uv0);\n  #endif\n  #if USE_COLOR\n    o *= color;\n  #endif\n  return o;\n}\nvoid main() { gl_FragColor = frag(); }\n",
        "defines": [
          {"name": "USE_TEXTURE", "type": "boolean"},
          {"name": "USE_SKINNING", "type": "boolean"},
          {"name": "USE_JOINTS_TEXTURE", "type": "boolean"},
          {"name": "USE_COLOR", "type": "boolean"}
        ],
        "uniforms": [
          {"name": "mainTiling", "type": 5, "defines": ["USE_TEXTURE"]},
          {"name": "mainOffset", "type": 5, "defines": ["USE_TEXTURE"]},
          {"name": "mainTexture", "type": 13, "defines": ["USE_TEXTURE"]},
          {"name": "color", "type": 7, "defines": ["USE_COLOR"]}
        ],
        "attributes": [
          {"name": "a_position", "type": 6, "defines": []},
          {"name": "a_uv0", "type": 5, "defines": ["USE_TEXTURE"]},
          {"name": "a_weights", "type": 7, "defines": ["USE_SKINNING"]},
          {"name": "a_joints", "type": 7, "defines": ["USE_SKINNING"]}
        ],
        "extensions": []
      }
    ]
  },
  {
    "name": "builtin-effect-skybox",
    "techniques": [{"queue":0,"lod":200,"passes":[{"stage":1,"cullMode":0,"program":"c4056e849fac08f88d82336386873a650bc636f4349623fecbf96c52"}],"priority":-1000}],
    "properties": {"cubeMap":{"type":14,"value":null}},
    "shaders": [
      {
        "name": "c4056e849fac08f88d82336386873a650bc636f4349623fecbf96c52",
        "vert": "\n  attribute vec3 a_position;\n  uniform mat4 _view;\n  uniform mat4 _proj;\n  varying vec3 viewDir;\n  void main() {\n    mat4 rotView = mat4(mat3(_view));\n    vec4 clipPos = _proj * rotView * vec4(a_position, 1.0);\n    gl_Position = clipPos.xyww;\n    viewDir = a_position;\n  }\n",
        "frag": "\n  varying vec3 viewDir;\n  uniform samplerCube cubeMap;\n  \nvec3 gammaToLinearSpaceRGB(vec3 sRGB) { \n  return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);\n}\nvec3 linearToGammaSpaceRGB(vec3 RGB) { \n  vec3 S1 = sqrt(RGB);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return 0.585122381 * S1 + 0.783140355 * S2 - 0.368262736 * S3;\n}\nvec4 gammaToLinearSpaceRGBA(vec4 sRGBA) {\n  return vec4(gammaToLinearSpaceRGB(sRGBA.rgb), sRGBA.a);\n}\nvec4 linearToGammaSpaceRGBA(vec4 RGBA) {\n  return vec4(linearToGammaSpaceRGB(RGBA.rgb), RGBA.a);\n}\nfloat gammaToLinearSpaceExact(float val) {\n  if (val <= 0.04045) {\n    return val / 12.92;\n  } else if (val < 1.0) {\n    return pow((val + 0.055) / 1.055, 2.4);\n  } else {\n    return pow(val, 2.2);\n  }\n}\nfloat linearToGammaSpaceExact(float val) {\n  if (val <= 0.0) {\n    return 0.0;\n  } else if (val <= 0.0031308) {\n    return 12.92 * val;\n  } else if (val < 1.0) {\n    return 1.055 * pow(val, 0.4166667) - 0.055;\n  } else {\n    return pow(val, 0.45454545);\n  }\n}\n  \nvec3 unpackNormal(vec4 nmap) {\n  return nmap.xyz * 2.0 - 1.0;\n}\nvec3 unpackRGBE(vec4 rgbe) {\n    return rgbe.rgb * pow(2.0, rgbe.a * 255.0 - 128.0);\n}\n  void main() {\n  #if USE_RGBE_CUBEMAP\n      vec3 c = unpackRGBE(textureCube(cubeMap, viewDir));\n      c = linearToGammaSpaceRGB(c / (1.0 + c));\n      gl_FragColor = vec4(c, 1.0);\n  #else\n      gl_FragColor = textureCube(cubeMap, viewDir);\n  #endif\n  }\n",
        "defines": [
          {"name": "USE_RGBE_CUBEMAP", "type": "boolean"}
        ],
        "uniforms": [
          {"name": "cubeMap", "type": 14, "defines": []}
        ],
        "attributes": [
          {"name": "a_position", "type": 6, "defines": []}
        ],
        "extensions": []
      }
    ]
  }
];
