export default [
  {
    "name": "test",
    "techniques": [{"queue": 0, "lod": 500, "passes": [{"stage": 100, "program": "f4c45e6cc7794309d86202e6ec9036a3871fd1ec167a9e02eb1e1574"}], "priority": 0}],
    "properties": {"u_color": {"type": 16, "value": [1, 1, 1, 1]}, "u_sampler": {"type": 29, "value": null}},
    "shaders": [
      {
        "name": "f4c45e6cc7794309d86202e6ec9036a3871fd1ec167a9e02eb1e1574",
        "vert": `
  attribute vec3 a_position;
  attribute vec2 a_uv0;
  uniform mat4 cc_matWorld;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = cc_matWorld*vec4(a_position, 1.0);
    v_texCoord = a_uv0;
  }
`,
        "frag": `
  varying vec2 v_texCoord;
    uniform vec4 u_color;
  uniform sampler2D u_sampler;
  void main() {

    gl_FragColor = texture2D(u_sampler, v_texCoord);
    gl_FragColor.r = u_color.r;
  }
`,
        "defines": [],
        "blocks": [
          {"name": "Constants", "size": 16, "defines": [], "binding": 0, "members": [
            {"name": "u_color", "type": 16, "count": 1, "size": 16}
          ]}
        ],
        "samplers": [
          {"name": "u_sampler", "type": 29, "count": 1, "defines": [], "binding": 1}
        ],
        "dependencies": {}
      }
    ]
  },
  {
    "name": "builtin-effect-unlit",
    "techniques": [{"queue": "opaque", "lod": 100, "passes": [{"properties": {"color": {"type": 17, "value": [1, 1, 1, 1]}, "mainTiling": {"type": 14, "value": [1, 1]}, "mainOffset": {"type": 14, "value": [0, 0]}, "mainTexture": {"type": 29, "value": "grey"}}, "program": "e238b675dacba30ad29961fac06cb18d8c771e16d4fb0f9662acbe3c"}]}],
    "shaders": [
      {
        "name": "e238b675dacba30ad29961fac06cb18d8c771e16d4fb0f9662acbe3c",
        "vert": "\nattribute vec3 a_position;\n  uniform mat4 cc_matProj;\n  uniform mat4 cc_matProjInv;\n  uniform mat4 cc_matView;\n  uniform mat4 cc_matViewInv;\n  uniform mat4 cc_matViewProj;\n  uniform mat4 cc_matViewProjInv;\n  uniform vec4 cc_time;\n  uniform vec4 cc_screenSize;\n  uniform vec4 cc_screenScale;\n  uniform vec4 cc_cameraSize;\n  uniform vec4 cc_cameraPos;\n  uniform vec4 cc_dirLightDirection;\n  uniform vec4 cc_dirLightColor;\n  uniform vec4 cc_pointLightPositionAndRange;\n  uniform vec4 cc_pointLightColor;\n  uniform vec4 cc_spotLightPositionAndRange;\n  uniform vec4 cc_spotLightDirection;\n  uniform vec4 cc_spotLightColor;\n  uniform mat4 cc_matViewProjLight;\n  uniform vec4 cc_shadowParam1;\n  uniform vec4 cc_shadowParam2;\n  uniform mat4 cc_matWorld;\n  uniform mat4 cc_matWorldIT;\n#if USE_TEXTURE\n  attribute vec2 a_texCoord1;\n    uniform vec2 mainTiling;\n  uniform vec2 mainOffset;\n  varying vec2 uv0;\n#endif\n#if CC_USE_SKINNING\n  \nattribute vec4 a_weights;\nattribute vec4 a_joints;\n  uniform mat4 cc_matJoint;\n  uniform vec4 cc_jointsTextureSize;\n#if CC_USE_JOINTS_TEXTURE\nuniform sampler2D cc_jointsTexture;\nmat4 getBoneMatrix(const in float i) {\n  float size = cc_jointsTextureSize.x;\n  float j = i * 4.0;\n  float x = mod(j, size);\n  float y = floor(j / size);\n  float dx = 1.0 / size;\n  float dy = 1.0 / size;\n  y = dy * (y + 0.5);\n  vec4 v1 = texture2D(cc_jointsTexture, vec2(dx * (x + 0.5), y));\n  vec4 v2 = texture2D(cc_jointsTexture, vec2(dx * (x + 1.5), y));\n  vec4 v3 = texture2D(cc_jointsTexture, vec2(dx * (x + 2.5), y));\n  vec4 v4 = texture2D(cc_jointsTexture, vec2(dx * (x + 3.5), y));\n  return mat4(v1, v2, v3, v4);\n}\n#else\nmat4 getBoneMatrix(const in float i) {\n  return cc_matJoint[int(i)];\n}\n#endif\nmat4 skinMatrix() {\n  return\n    getBoneMatrix(a_joints.x) * a_weights.x +\n    getBoneMatrix(a_joints.y) * a_weights.y +\n    getBoneMatrix(a_joints.z) * a_weights.z +\n    getBoneMatrix(a_joints.w) * a_weights.w;\n}\nvoid skinVertex(inout vec4 a1) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n}\nvoid skinVertex(inout vec4 a1, inout vec4 a2, inout vec4 a3) {\n  mat4 m = skinMatrix();\n  a1 = m * a1;\n  a2 = m * a2;\n  a3 = m * a3;\n}\n#endif\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1);\n  #if CC_USE_SKINNING\n    skinVertex(pos);\n  #endif\n  pos = cc_matViewProj * cc_matWorld * pos;\n  #if USE_TEXTURE\n    uv0 = a_texCoord1 * mainTiling + mainOffset;\n  #endif\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n",
        "frag": "\n#if USE_TEXTURE\n  uniform sampler2D mainTexture;\n  varying vec2 uv0;\n#endif\n#if USE_COLOR\n    uniform vec4 color;\n#endif\nvec4 frag () {\n  vec4 o = vec4(1, 1, 1, 1);\n  #if USE_TEXTURE\n    o *= texture2D(mainTexture, uv0);\n  #endif\n  #if USE_COLOR\n    o *= color;\n  #endif\n  return o;\n}\nvoid main() { gl_FragColor = frag(); }\n",
        "defines": [
          {"name": "USE_TEXTURE", "type": "boolean", "defines": []},
          {"name": "CC_USE_SKINNING", "type": "boolean", "defines": []},
          {"name": "CC_USE_JOINTS_TEXTURE", "type": "boolean", "defines": ["CC_USE_SKINNING"]},
          {"name": "USE_COLOR", "type": "boolean", "defines": []}
        ],
        "blocks": [
          {"name": "TexCoords", "size": 16, "defines": ["USE_TEXTURE"], "binding": 0, "members": [
            {"name": "mainTiling", "type": 14, "count": 1, "size": 8},
            {"name": "mainOffset", "type": 14, "count": 1, "size": 8}
          ]},
          {"name": "Constant", "size": 16, "defines": ["USE_COLOR"], "binding": 1, "members": [
            {"name": "color", "type": 16, "count": 1, "size": 16}
          ]}
        ],
        "samplers": [
          {"name": "mainTexture", "type": 29, "count": 1, "defines": ["USE_TEXTURE"], "binding": 2}
        ],
        "dependencies": {}
      }
    ]
  },
  {
    "name": "test",
    "techniques": [{"queue": "opaque", "lod": 500, "passes": [{"stage": 100, "properties": {"u_color": {"type": 17, "value": [1, 1, 1, 1]}, "u_sampler": {"type": 29, "value": "grey"}}, "program": "f4c45e6cc7794309d86202e6ec9036a3871fd1ec167a9e02eb1e1574"}]}],
    "shaders": [
      {
        "name": "f4c45e6cc7794309d86202e6ec9036a3871fd1ec167a9e02eb1e1574",
        "vert": "\n  attribute vec2 a_position;\n  attribute vec2 a_texCoord;\n  varying vec2 v_texCoord;\n  void main() {\n    gl_Position = vec4(a_position, 0.0, 1.0);\n    v_texCoord = a_texCoord;\n  }\n",
        "frag": "\n  varying vec2 v_texCoord;\n    uniform vec4 u_color;\n  uniform sampler2D u_sampler;\n  void main() {\n    \n    gl_FragColor = texture2D(u_sampler, v_texCoord);\n    gl_FragColor.r = u_color.r;\n  }\n",
        "defines": [],
        "blocks": [
          {"name": "Constants", "size": 16, "defines": [], "binding": 0, "members": [
            {"name": "u_color", "type": 16, "count": 1, "size": 16}
          ]}
        ],
        "samplers": [
          {"name": "u_sampler", "type": 29, "count": 1, "defines": [], "binding": 1}
        ],
        "dependencies": {}
      }
    ]
  },
  {
    "name": "builtin-effect-skybox",
    "techniques": [{"queue": "opaque-1000", "lod": 200, "passes": [{"rasterizerState": {"cullMode": 0}, "depthStencilState": {"depthTest": false, "depthWrite": false}, "properties": {"cubeMap": {"type": 32, "value": "greyCube"}}, "program": "d9cd35729516d899db5cd6b6ecf025e61a484094405a391a3056591d"}]}],
    "shaders": [
      {
        "name": "d9cd35729516d899db5cd6b6ecf025e61a484094405a391a3056591d",
        "vert": "\n  attribute vec3 a_position;\n  \n  uniform mat4 cc_matProj;\n  uniform mat4 cc_matProjInv;\n  uniform mat4 cc_matView;\n  uniform mat4 cc_matViewInv;\n  uniform mat4 cc_matViewProj;\n  uniform mat4 cc_matViewProjInv;\n  uniform vec4 cc_time;\n  uniform vec4 cc_screenSize;\n  uniform vec4 cc_screenScale;\n  uniform vec4 cc_cameraSize;\n  uniform vec4 cc_cameraPos;\n  uniform vec4 cc_dirLightDirection;\n  uniform vec4 cc_dirLightColor;\n  uniform vec4 cc_pointLightPositionAndRange;\n  uniform vec4 cc_pointLightColor;\n  uniform vec4 cc_spotLightPositionAndRange;\n  uniform vec4 cc_spotLightDirection;\n  uniform vec4 cc_spotLightColor;\n  uniform mat4 cc_matViewProjLight;\n  uniform vec4 cc_shadowParam1;\n  uniform vec4 cc_shadowParam2;\n  varying vec3 viewDir;\n  void main() {\n    mat4 rotView = mat4(mat3(cc_matView));\n    vec4 clipPos = cc_matProj * rotView * vec4(a_position, 1.0);\n    gl_Position = clipPos.xyww;\n    viewDir = a_position;\n  }\n",
        "frag": "\n  varying vec3 viewDir;\n  uniform samplerCube cubeMap;\n  \nvec3 gammaToLinearSpaceRGB(vec3 sRGB) { \n  return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);\n}\nvec3 linearToGammaSpaceRGB(vec3 RGB) { \n  vec3 S1 = sqrt(RGB);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return 0.585122381 * S1 + 0.783140355 * S2 - 0.368262736 * S3;\n}\nvec4 gammaToLinearSpaceRGBA(vec4 sRGBA) {\n  return vec4(gammaToLinearSpaceRGB(sRGBA.rgb), sRGBA.a);\n}\nvec4 linearToGammaSpaceRGBA(vec4 RGBA) {\n  return vec4(linearToGammaSpaceRGB(RGBA.rgb), RGBA.a);\n}\nfloat gammaToLinearSpaceExact(float val) {\n  if (val <= 0.04045) {\n    return val / 12.92;\n  } else if (val < 1.0) {\n    return pow((val + 0.055) / 1.055, 2.4);\n  } else {\n    return pow(val, 2.2);\n  }\n}\nfloat linearToGammaSpaceExact(float val) {\n  if (val <= 0.0) {\n    return 0.0;\n  } else if (val <= 0.0031308) {\n    return 12.92 * val;\n  } else if (val < 1.0) {\n    return 1.055 * pow(val, 0.4166667) - 0.055;\n  } else {\n    return pow(val, 0.45454545);\n  }\n}\n  \nvec3 unpackNormal(vec4 nmap) {\n  return nmap.xyz * 2.0 - 1.0;\n}\nvec3 unpackRGBE(vec4 rgbe) {\n    return rgbe.rgb * pow(2.0, rgbe.a * 255.0 - 128.0);\n}\n  void main() {\n  #if USE_RGBE_CUBEMAP\n      vec3 c = unpackRGBE(textureCube(cubeMap, viewDir));\n      c = linearToGammaSpaceRGB(c / (1.0 + c));\n      gl_FragColor = vec4(c, 1.0);\n  #else\n      gl_FragColor = textureCube(cubeMap, viewDir);\n  #endif\n  }\n",
        "defines": [
          {"name": "USE_RGBE_CUBEMAP", "type": "boolean", "defines": []}
        ],
        "blocks": [],
        "samplers": [
          {"name": "cubeMap", "type": 32, "count": 1, "defines": [], "binding": 0}
        ],
        "dependencies": {}
      }
    ]
  },
  {
    "name": "builtin-effect-sprite",
    "techniques": [{"queue": "overlay", "passes": [{"depthStencilState": {"depthTest": true, "depthWrite": false}, "blendState": {"targets": [{"blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4}]}, "properties": {"mainTexture": {"type": 29, "value": "grey"}}, "program": "a86b95b64dc75bf2cc5b528318547813f86f5cd9e03ee48ca69556f6"}]}],
    "shaders": [
      {
        "name": "a86b95b64dc75bf2cc5b528318547813f86f5cd9e03ee48ca69556f6",
        "vert": "\nattribute vec3 a_position;\nattribute vec2 a_texCoord;\nattribute vec4 a_color;\n  uniform mat4 cc_matProj;\n  uniform mat4 cc_matProjInv;\n  uniform mat4 cc_matView;\n  uniform mat4 cc_matViewInv;\n  uniform mat4 cc_matViewProj;\n  uniform mat4 cc_matViewProjInv;\n  uniform vec4 cc_time;\n  uniform vec4 cc_screenSize;\n  uniform vec4 cc_screenScale;\n  uniform vec4 cc_cameraSize;\n  uniform vec4 cc_cameraPos;\n  uniform vec4 cc_dirLightDirection;\n  uniform vec4 cc_dirLightColor;\n  uniform vec4 cc_pointLightPositionAndRange;\n  uniform vec4 cc_pointLightColor;\n  uniform vec4 cc_spotLightPositionAndRange;\n  uniform vec4 cc_spotLightDirection;\n  uniform vec4 cc_spotLightColor;\n  uniform mat4 cc_matViewProjLight;\n  uniform vec4 cc_shadowParam1;\n  uniform vec4 cc_shadowParam2;\n  uniform mat4 cc_matWorld;\n  uniform mat4 cc_matWorldIT;\nvarying vec2 uv0;\nvarying vec4 color;\nvec4 vert () {\n  vec4 pos = vec4(a_position, 1);\n  pos = cc_matViewProj * cc_matWorld * pos;\n  uv0 = a_texCoord;\n  color = a_color;\n  return pos;\n}\nvoid main() { gl_Position = vert(); }\n",
        "frag": "\nuniform sampler2D mainTexture;\nvarying vec2 uv0;\nvarying vec4 color;\nvec4 frag () {\n  vec4 o = vec4(1, 1, 1, 1);\n  o *= texture2D(mainTexture, uv0);\n  o *= color;\n  return o;\n}\nvoid main() { gl_FragColor = frag(); }\n",
        "defines": [],
        "blocks": [],
        "samplers": [
          {"name": "mainTexture", "type": 29, "count": 1, "defines": [], "binding": 0}
        ],
        "dependencies": {}
      }
    ]
  },
];
