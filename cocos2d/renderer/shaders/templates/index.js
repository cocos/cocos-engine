export default [
  {
    name: 'gray_sprite',
    vert: '\n \nuniform mat4 viewProj;\nattribute vec3 a_position;\nattribute mediump vec2 a_uv0;\nvarying mediump vec2 uv0;\nvoid main () {\n  vec4 pos = viewProj * vec4(a_position, 1);\n  gl_Position = pos;\n  uv0 = a_uv0;\n}',
    frag: '\n \nuniform sampler2D texture;\nvarying mediump vec2 uv0;\nuniform lowp vec4 color;\nvoid main () {\n  vec4 c = color * texture2D(texture, uv0);\n  float gray = 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;\n  gl_FragColor = vec4(gray, gray, gray, c.a);\n}',
    defines: [],
    uniforms: [
      {"name": "texture", "type": 13, "defines": []},
      {"name": "color", "type": 7, "defines": []}
    ],
    attributes: [
      {"name": "a_position", "type": 6, "defines": []},
      {"name": "a_uv0", "type": 5, "defines": []}
    ],
    extensions: [],
  },
  {
    name: 'mesh',
    vert: '\n \nuniform mat4 viewProj;\nattribute vec3 a_position;\n#ifdef useAttributeColor\n  attribute vec4 a_color;\n  varying vec4 v_color;\n#endif\n#ifdef useTexture\n  attribute vec2 a_uv0;\n  varying vec2 uv0;\n#endif\n#ifdef useModel\n  uniform mat4 model;\n#endif\n#ifdef useSkinning\n  \nattribute vec4 a_weights;\nattribute vec4 a_joints;\n#ifdef useJointsTexture\nuniform sampler2D u_jointsTexture;\nuniform float u_jointsTextureSize;\nmat4 getBoneMatrix(const in float i) {\n  float size = u_jointsTextureSize;\n  float j = i * 4.0;\n  float x = mod(j, size);\n  float y = floor(j / size);\n  float dx = 1.0 / size;\n  float dy = 1.0 / size;\n  y = dy * (y + 0.5);\n  vec4 v1 = texture2D(u_jointsTexture, vec2(dx * (x + 0.5), y));\n  vec4 v2 = texture2D(u_jointsTexture, vec2(dx * (x + 1.5), y));\n  vec4 v3 = texture2D(u_jointsTexture, vec2(dx * (x + 2.5), y));\n  vec4 v4 = texture2D(u_jointsTexture, vec2(dx * (x + 3.5), y));\n  return mat4(v1, v2, v3, v4);\n}\n#else\nuniform mat4 u_jointMatrices[64];\nmat4 getBoneMatrix(const in float i) {\n  return u_jointMatrices[int(i)];\n}\n#endif\nmat4 skinMatrix() {\n  return\n    getBoneMatrix(a_joints.x) * a_weights.x +\n    getBoneMatrix(a_joints.y) * a_weights.y +\n    getBoneMatrix(a_joints.z) * a_weights.z +\n    getBoneMatrix(a_joints.w) * a_weights.w\n    ;\n}\n#endif\nvoid main () {\n  mat4 mvp;\n  #ifdef useModel\n    mvp = viewProj * model;\n  #else\n    mvp = viewProj;\n  #endif\n  #ifdef useSkinning\n    mvp = mvp * skinMatrix();\n  #endif\n  vec4 pos = mvp * vec4(a_position, 1);\n  #ifdef useTexture\n    uv0 = a_uv0;\n  #endif\n  #ifdef useAttributeColor\n    v_color = a_color;\n  #endif\n  gl_Position = pos;\n}',
    frag: '\n \n#ifdef useTexture\n  uniform sampler2D texture;\n  varying vec2 uv0;\n#endif\n#ifdef useAttributeColor\n  varying vec4 v_color;\n#endif\nuniform vec4 color;\nvoid main () {\n  vec4 o = color;\n  \n  #ifdef useAttributeColor\n    o *= v_color;\n  #endif\n  #ifdef useTexture\n    o *= texture2D(texture, uv0);\n  #endif\n  gl_FragColor = o;\n}',
    defines: [
      {"name": "useAttributeColor", "type": "boolean"},
      {"name": "useTexture", "type": "boolean"},
      {"name": "useModel", "type": "boolean"},
      {"name": "useSkinning", "type": "boolean"},
      {"name": "useJointsTexture", "type": "boolean"}
    ],
    uniforms: [
      {"name": "u_jointsTexture", "type": 13, "defines": ["useSkinning", "useJointsTexture"]},
      {"name": "u_jointsTextureSize", "type": 4, "defines": ["useSkinning", "useJointsTexture"]},
      {"name": "u_jointMatrices", "type": 12, "defines": ["useSkinning"]},
      {"name": "texture", "type": 13, "defines": ["useTexture"]},
      {"name": "color", "type": 7, "defines": []}
    ],
    attributes: [
      {"name": "a_position", "type": 6, "defines": []},
      {"name": "a_color", "type": 7, "defines": ["useAttributeColor"]},
      {"name": "a_uv0", "type": 5, "defines": ["useTexture"]},
      {"name": "a_weights", "type": 7, "defines": ["useSkinning"]},
      {"name": "a_joints", "type": 7, "defines": ["useSkinning"]}
    ],
    extensions: [],
  },
  {
    name: 'sprite',
    vert: '\n \nuniform mat4 viewProj;\n#ifdef use2DPos\nattribute vec2 a_position;\n#else\nattribute vec3 a_position;\n#endif\nattribute lowp vec4 a_color;\n#ifdef useModel\n  uniform mat4 model;\n#endif\n#ifdef useTexture\n  attribute mediump vec2 a_uv0;\n  varying mediump vec2 uv0;\n#endif\n#ifndef useColor\nvarying lowp vec4 v_fragmentColor;\n#endif\nvoid main () {\n  mat4 mvp;\n  #ifdef useModel\n    mvp = viewProj * model;\n  #else\n    mvp = viewProj;\n  #endif\n  #ifdef use2DPos\n  vec4 pos = mvp * vec4(a_position, 0, 1);\n  #else\n  vec4 pos = mvp * vec4(a_position, 1);\n  #endif\n  #ifndef useColor\n  v_fragmentColor = a_color;\n  #endif\n  #ifdef useTexture\n    uv0 = a_uv0;\n  #endif\n  gl_Position = pos;\n}',
    frag: '\n \n#ifdef useTexture\n  uniform sampler2D texture;\n  varying mediump vec2 uv0;\n#endif\n#ifdef alphaTest\n  uniform lowp float alphaThreshold;\n#endif\n#ifdef useColor\n  uniform lowp vec4 color;\n#else\n  varying lowp vec4 v_fragmentColor;\n#endif\nvoid main () {\n  #ifdef useColor\n    vec4 o = color;\n  #else\n    vec4 o = v_fragmentColor;\n  #endif\n  #ifdef useTexture\n    o *= texture2D(texture, uv0);\n  #endif\n  #ifdef alphaTest\n    if (o.a <= alphaThreshold)\n      discard;\n  #endif\n  gl_FragColor = o;\n}',
    defines: [
      {"name": "use2DPos", "type": "boolean"},
      {"name": "useModel", "type": "boolean"},
      {"name": "useTexture", "type": "boolean"},
      {"name": "useColor", "type": "boolean"},
      {"name": "alphaTest", "type": "boolean"}
    ],
    uniforms: [
      {"name": "texture", "type": 13, "defines": ["useTexture"]},
      {"name": "alphaThreshold", "type": 4, "defines": ["alphaTest"]},
      {"name": "color", "type": 7, "defines": ["useColor"]}
    ],
    attributes: [
      {"name": "a_position", "type": 5, "defines": ["use2DPos"]},
      {"name": "a_position", "type": 6, "defines": []},
      {"name": "a_color", "type": 7, "defines": []},
      {"name": "a_uv0", "type": 5, "defines": ["useTexture"]}
    ],
    extensions: [],
  },
];