export default [
  {
    "name": "builtin-effect-unlit",
    "techniques": [{"queue": 0, "lod": 100, "passes": [{"program": "7781d6cc411d5facce7fc3d4aeb5349e804ddd9a58c002017c53682b"}], "priority": 0}],
    "properties": {"color": {"type": 17, "value": [1, 1, 1, 1]}, "mainTiling": {"type": 14, "value": [1, 1]}, "mainOffset": {"type": 14, "value": [0, 0]}, "mainTexture": {"type": 29, "value": null}},
    "shaders": [
      {
        "name": "7781d6cc411d5facce7fc3d4aeb5349e804ddd9a58c002017c53682b",
        "vert": "\nattribute vec3 a_position;\n  uniform mat4 cc_matProj;\n  uniform mat4 cc_matProjInv;\n  uniform mat4 cc_matView;\n  uniform mat4 cc_matViewInv;\n  uniform mat4 cc_matViewProj;\n  uniform mat4 cc_matViewProjInv;\n  uniform vec4 cc_time;\n  uniform vec4 cc_screenSize;\n  uniform vec4 cc_screenScale;\n  uniform vec4 cc_cameraSize;\n  uniform vec4 cc_cameraPos;\n  uniform vec4 cc_dirLightDirection[4];\n  uniform vec4 cc_dirLightColor[4];\n  uniform vec4 cc_pointLightPositionAndRange[4];\n  uniform vec4 cc_pointLightColor[4];\n  uniform vec4 cc_spotLightPositionAndRange[4];\n  uniform vec4 cc_spotLightDirection[4];\n  uniform vec4 cc_spotLightColor[4];\n  uniform mat4 cc_matViewProjLight;\n  uniform vec4 cc_shadowParam1;\n  uniform vec4 cc_shadowParam2;\n  uniform mat4 cc_matWorld;\n  uniform mat4 cc_matWorldIT;\n#if USE_TEXTURE\n  attribute vec2 a_texCoord1;\n    uniform vec2 mainTiling;\n  uniform vec2 mainOffset;\n  varying vec2 uv0;\n#endif\n#if CC_USE_SKINNING\n  \nattribute vec4 a_weights;\nattribute vec4 a_joints;\n  uniform mat4 cc_matJoint[128];\n  uniform vec4 cc_jointsTextureSize;\n#if CC_USE_JOINTS_TEXTURE\nuniform sampler2D cc_jointsTexture;\nmat4 getBoneMatrix(const in float i) {\n  float size = cc_jointsTextureSize.x;\n  float j = i * 4.0;\n  float x = mod(j, size);\n  float y = floor(j / size);\n  float dx = 1.0 / size;\n  float dy = 1.0 / size;\n  y = dy * (y + 0.5);\n  vec4 v1 = texture2D(cc_jointsTexture, vec2(dx * (x + 0.5), y));\n  vec4 v2 = texture2D(cc_jointsTexture, vec2(dx * (x + 1.5), y));\n  vec4 v3 = texture2D(cc_jointsTexture, vec2(dx * (x + 2.5), y));\n  vec4 v4 = texture2D(cc_jointsTexture, vec2(dx * (x + 3.5), y));\n  return mat4(v1, v2, v3, v4);\n}\n#else\nmat4 getBoneMatrix(const in float i) {\n  return cc_matJoint[int(i)];\n}\n#endif\nmat4 skinMatrix() {\n  return\n    getBoneMatrix(a_joints.x) * a_weights.x +\n    getBoneMatrix(a_joints.y) * a_weights.y +\n    getBoneMatrix(a_joints.z) * a_weights.z +\n    getBoneMatrix(a_joints.w) * a_weights.w;\n}\nvoid skinVertex(inout vec4 a1) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2, inout vec4 a3) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n  a3 = m * a3;\n}\n#endif\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1);\n  #if CC_USE_SKINNING\n    skinVertex(pos);\n  #endif\n  pos = cc_matViewProj * cc_matWorld * pos;\n  #if USE_TEXTURE\n    uv0 = a_texCoord1 * mainTiling + mainOffset;\n  #endif\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n",
        "frag": "\n#if USE_TEXTURE\n  uniform sampler2D mainTexture;\n  varying vec2 uv0;\n#endif\n#if USE_COLOR\n    uniform vec4 color;\n#endif\nvec4 frag () {\n  vec4 o = vec4(1, 1, 1, 1);\n  #if USE_TEXTURE\n    o *= texture2D(mainTexture, uv0);\n  #endif\n  #if USE_COLOR\n    o *= color;\n  #endif\n  return o;\n}\nvoid main() { gl_FragColor = frag(); }\n",
        "defines": [
          {"name": "USE_TEXTURE", "type": "boolean", "defines": []},
          {"name": "CC_USE_SKINNING", "type": "boolean", "defines": []},
          {"name": "CC_USE_JOINTS_TEXTURE", "type": "boolean", "defines": ["CC_USE_SKINNING"]},
          {"name": "USE_COLOR", "type": "boolean", "defines": []}
        ],
        "uniforms": [
          {"name": "TexCoords", "type": 0, "bindingType": 1, "defines": ["USE_TEXTURE"], "binding": 0, "members": [
            {"name": "mainTiling", "type": 14},
            {"name": "mainOffset", "type": 14}
          ]},
          {"name": "mainTexture", "type": 29, "bindingType": 2, "defines": ["USE_TEXTURE"], "binding": 1},
          {"name": "Constant", "type": 0, "bindingType": 1, "defines": ["USE_COLOR"], "binding": 2, "members": [
            {"name": "color", "type": 16}
          ]}
        ],
        "extensions": []
      }
    ]
  },
  {
    "name": "builtin-effect-skybox",
    "techniques": [{"queue": 0, "lod": 200, "passes": [{"rasterizerState": {"cullMode": 0}, "depthStencilState": {"depthTest": false, "depthWrite": false}, "program": "e4ea21ace566a0976909c9b0d082bf97c4a115f78bafe08d6c5edec7"}], "priority": -1000}],
    "properties": {"cubeMap": {"type": 32, "value": null}},
    "shaders": [
      {
        "name": "e4ea21ace566a0976909c9b0d082bf97c4a115f78bafe08d6c5edec7",
        "vert": "\n  attribute vec3 a_position;\n  \n  uniform mat4 cc_matProj;\n  uniform mat4 cc_matProjInv;\n  uniform mat4 cc_matView;\n  uniform mat4 cc_matViewInv;\n  uniform mat4 cc_matViewProj;\n  uniform mat4 cc_matViewProjInv;\n  uniform vec4 cc_time;\n  uniform vec4 cc_screenSize;\n  uniform vec4 cc_screenScale;\n  uniform vec4 cc_cameraSize;\n  uniform vec4 cc_cameraPos;\n  uniform vec4 cc_dirLightDirection[4];\n  uniform vec4 cc_dirLightColor[4];\n  uniform vec4 cc_pointLightPositionAndRange[4];\n  uniform vec4 cc_pointLightColor[4];\n  uniform vec4 cc_spotLightPositionAndRange[4];\n  uniform vec4 cc_spotLightDirection[4];\n  uniform vec4 cc_spotLightColor[4];\n  uniform mat4 cc_matViewProjLight;\n  uniform vec4 cc_shadowParam1;\n  uniform vec4 cc_shadowParam2;\n  varying vec3 viewDir;\n  void main() {\n    mat4 rotView = mat4(mat3(cc_matView));\n    vec4 clipPos = cc_matProj * rotView * vec4(a_position, 1.0);\n    gl_Position = clipPos.xyww;\n    viewDir = a_position;\n  }\n",
        "frag": "\n  varying vec3 viewDir;\n  uniform samplerCube cubeMap;\n  \nvec3 gammaToLinearSpaceRGB(vec3 sRGB) { \n  return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);\n}\nvec3 linearToGammaSpaceRGB(vec3 RGB) { \n  vec3 S1 = sqrt(RGB);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return 0.585122381 * S1 + 0.783140355 * S2 - 0.368262736 * S3;\n}\nvec4 gammaToLinearSpaceRGBA(vec4 sRGBA) {\n  return vec4(gammaToLinearSpaceRGB(sRGBA.rgb), sRGBA.a);\n}\nvec4 linearToGammaSpaceRGBA(vec4 RGBA) {\n  return vec4(linearToGammaSpaceRGB(RGBA.rgb), RGBA.a);\n}\nfloat gammaToLinearSpaceExact(float val) {\n  if (val <= 0.04045) {\n    return val / 12.92;\n  } else if (val < 1.0) {\n    return pow((val + 0.055) / 1.055, 2.4);\n  } else {\n    return pow(val, 2.2);\n  }\n}\nfloat linearToGammaSpaceExact(float val) {\n  if (val <= 0.0) {\n    return 0.0;\n  } else if (val <= 0.0031308) {\n    return 12.92 * val;\n  } else if (val < 1.0) {\n    return 1.055 * pow(val, 0.4166667) - 0.055;\n  } else {\n    return pow(val, 0.45454545);\n  }\n}\n  \nvec3 unpackNormal(vec4 nmap) {\n  return nmap.xyz * 2.0 - 1.0;\n}\nvec3 unpackRGBE(vec4 rgbe) {\n    return rgbe.rgb * pow(2.0, rgbe.a * 255.0 - 128.0);\n}\n  void main() {\n  #if USE_RGBE_CUBEMAP\n      vec3 c = unpackRGBE(textureCube(cubeMap, viewDir));\n      c = linearToGammaSpaceRGB(c / (1.0 + c));\n      gl_FragColor = vec4(c, 1.0);\n  #else\n      gl_FragColor = textureCube(cubeMap, viewDir);\n  #endif\n  }\n",
        "defines": [
          {"name": "USE_RGBE_CUBEMAP", "type": "boolean", "defines": []}
        ],
        "uniforms": [
          {"name": "cubeMap", "type": 32, "bindingType": 2, "defines": [], "binding": 0}
        ],
        "extensions": []
      }
    ]
  },
  {
    "name": "builtin-effect-sprite",
    "techniques": [{"queue": 2, "passes": [{"depthStencilState": {"depthTest": true, "depthWrite": false}, "blendState": {"targets": [{"blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4}]}, "program": "b28a508b291d9314faba527c0f13b99420d5feebd86bd4d38554b256"}], "priority": 0}],
    "properties": {"mainTexture": {"type": 29, "value": null}},
    "shaders": [
      {
        "name": "b28a508b291d9314faba527c0f13b99420d5feebd86bd4d38554b256",
        "vert": "\nattribute vec3 a_position;\nattribute vec2 a_texCoord;\nattribute vec4 a_color;\n  uniform mat4 cc_matProj;\n  uniform mat4 cc_matProjInv;\n  uniform mat4 cc_matView;\n  uniform mat4 cc_matViewInv;\n  uniform mat4 cc_matViewProj;\n  uniform mat4 cc_matViewProjInv;\n  uniform vec4 cc_time;\n  uniform vec4 cc_screenSize;\n  uniform vec4 cc_screenScale;\n  uniform vec4 cc_cameraSize;\n  uniform vec4 cc_cameraPos;\n  uniform vec4 cc_dirLightDirection[4];\n  uniform vec4 cc_dirLightColor[4];\n  uniform vec4 cc_pointLightPositionAndRange[4];\n  uniform vec4 cc_pointLightColor[4];\n  uniform vec4 cc_spotLightPositionAndRange[4];\n  uniform vec4 cc_spotLightDirection[4];\n  uniform vec4 cc_spotLightColor[4];\n  uniform mat4 cc_matViewProjLight;\n  uniform vec4 cc_shadowParam1;\n  uniform vec4 cc_shadowParam2;\n  uniform mat4 cc_matWorld;\n  uniform mat4 cc_matWorldIT;\nvarying vec2 uv0;\nvarying vec4 color;\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1);\n  pos = cc_matViewProj * cc_matWorld * pos;\n  uv0 = a_texCoord;\n  color = a_color;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n",
        "frag": "\nuniform sampler2D mainTexture;\nvarying vec2 uv0;\nvarying vec4 color;\nvec4 frag () {\n  vec4 o = vec4(1, 1, 1, 1);\n  o *= texture2D(mainTexture, uv0);\n  o *= color;\n  return o;\n}\nvoid main() { gl_FragColor = frag(); }\n",
        "defines": [],
        "uniforms": [
          {"name": "mainTexture", "type": 29, "bindingType": 2, "defines": [], "binding": 0}
        ],
        "extensions": []
      }
    ]
  },
];
