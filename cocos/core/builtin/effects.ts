/* eslint-disable */
// absolute essential effects
export default [
  {
    "name": "billboard",
    "techniques": [
      { "name": "add", "passes": [{ "rasterizerState": { "cullMode": 0 }, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 1, "blendSrcAlpha": 2, "blendDstAlpha": 1 }] }, "program": "billboard|vert:vs_main|tinted-fs:add", "depthStencilState": { "depthTest": true, "depthWrite": false }, "properties": { "mainTexture": { "value": "grey", "type": 28 }, "mainTiling_Offset": { "value": [1, 1, 0, 0], "type": 16 }, "tintColor": { "value": [0.5, 0.5, 0.5, 0.5], "type": 16 } } }] }
    ],
    "shaders": [
      {
        "name": "billboard|vert:vs_main|tinted-fs:add",
        "hash": 2143664850,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplers": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }], "samplers": [] }
        },
        "defines": [
          { "name": "CC_USE_HDR", "type": "boolean" }
        ],
        "blocks": [
          {"name": "Constants", "defines": [], "binding": 0, "stageFlags": 1, "members": [
            { "name": "mainTiling_Offset", "type": 16, "count": 1 },
            { "name": "frameTile_velLenScale", "type": 16, "count": 1 },
            { "name": "scale", "type": 16, "count": 1 }
          ]},
          {"name": "builtin", "defines": [], "binding": 1, "stageFlags": 1, "members": [
            { "name": "cc_size_rotation", "type": 16, "count": 1 }
          ]},
          {"name": "FragConstants", "defines": [], "binding": 2, "stageFlags": 16, "members": [
            { "name": "tintColor", "type": 16, "count": 1 }
          ]}
        ],
        "samplers": [
          { "name": "mainTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 3 }
        ],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_texCoord", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 1 },
          { "name": "a_color", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 2 }
        ]
      }
    ]
  },
  {
    "name": "clear-stencil",
    "techniques": [
      { "passes": [{ "blendState": { "targets": [{ "blend": true }] }, "rasterizerState": { "cullMode": 0 }, "program": "clear-stencil|sprite-vs:vert|sprite-fs:frag", "depthStencilState": { "depthTest": false, "depthWrite": false } }] }
    ],
    "shaders": [
      {
        "name": "clear-stencil|sprite-vs:vert|sprite-fs:frag",
        "hash": 1062464958,
        "builtins": {
          "globals": { "blocks": [], "samplers": [] },
          "locals": { "blocks": [], "samplers": [] }
        },
        "defines": [],
        "blocks": [],
        "samplers": [],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 }
        ]
      }
    ]
  },
  {
    "name": "graphics",
    "techniques": [
      { "passes": [{ "blendState": { "targets": [{ "blend": true, "blendSrc": 1, "blendDst": 4, "blendSrcAlpha": 1, "blendDstAlpha": 4 }] }, "rasterizerState": { "cullMode": 0 }, "program": "graphics|vs:vert|fs:frag", "depthStencilState": { "depthTest": false, "depthWrite": false } }] }
    ],
    "shaders": [
      {
        "name": "graphics|vs:vert|fs:frag",
        "hash": 3946667351,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplers": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }], "samplers": [] }
        },
        "defines": [],
        "blocks": [],
        "samplers": [],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_color", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 1 },
          { "name": "a_dist", "type": 13, "count": 1, "defines": [], "stageFlags": 1, "format": 11, "location": 2 }
        ]
      }
    ]
  },
  {
    "name": "particle-gpu",
    "techniques": [
      { "name": "add", "passes": [{ "rasterizerState": { "cullMode": 0 }, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 1, "blendSrcAlpha": 2, "blendDstAlpha": 1 }] }, "program": "particle-gpu|particle-vs-gpu:gpvs_main|tinted-fs:add", "depthStencilState": { "depthTest": true, "depthWrite": false }, "properties": { "mainTexture": { "value": "grey", "type": 28 }, "mainTiling_Offset": { "value": [1, 1, 0, 0], "type": 16 }, "tintColor": { "value": [0.5, 0.5, 0.5, 0.5], "type": 16 } } }] }
    ],
    "shaders": [
      {
        "name": "particle-gpu|particle-vs-gpu:gpvs_main|tinted-fs:add",
        "hash": 3696836305,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplers": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }], "samplers": [] }
        },
        "defines": [
          { "name": "CC_RENDER_MODE", "type": "number", "range": [0, 4] },
          { "name": "COLOR_OVER_TIME_MODULE_ENABLE", "type": "boolean" },
          { "name": "ROTATION_OVER_TIME_MODULE_ENABLE", "type": "boolean" },
          { "name": "SIZE_OVER_TIME_MODULE_ENABLE", "type": "boolean" },
          { "name": "FORCE_OVER_TIME_MODULE_ENABLE", "type": "boolean" },
          { "name": "VELOCITY_OVER_TIME_MODULE_ENABLE", "type": "boolean" },
          { "name": "TEXTURE_ANIMATION_MODULE_ENABLE", "type": "boolean" },
          { "name": "CC_USE_WORLD_SPACE", "type": "boolean" },
          { "name": "CC_USE_HDR", "type": "boolean" }
        ],
        "blocks": [
          {"name": "Constants", "defines": [], "binding": 0, "stageFlags": 1, "members": [
            { "name": "mainTiling_Offset", "type": 16, "count": 1 },
            { "name": "frameTile_velLenScale", "type": 16, "count": 1 },
            { "name": "scale", "type": 16, "count": 1 }
          ]},
          {"name": "SampleConstants", "defines": [], "binding": 1, "stageFlags": 1, "members": [
            { "name": "u_sampleInfo", "type": 16, "count": 1 }
          ]},
          {"name": "TickConstants", "defines": [], "binding": 2, "stageFlags": 1, "members": [
            { "name": "u_worldRot", "type": 16, "count": 1 },
            { "name": "u_timeDelta", "type": 16, "count": 1 }
          ]},
          {"name": "ColorConstant", "defines": ["COLOR_OVER_TIME_MODULE_ENABLE"], "binding": 3, "stageFlags": 1, "members": [
            { "name": "u_color_mode", "type": 5, "count": 1 }
          ]},
          {"name": "RotationConstant", "defines": ["ROTATION_OVER_TIME_MODULE_ENABLE"], "binding": 4, "stageFlags": 1, "members": [
            { "name": "u_rotation_mode", "type": 5, "count": 1 }
          ]},
          {"name": "SizeConstant", "defines": ["SIZE_OVER_TIME_MODULE_ENABLE"], "binding": 5, "stageFlags": 1, "members": [
            { "name": "u_size_mode", "type": 5, "count": 1 }
          ]},
          {"name": "ForceConstant", "defines": ["FORCE_OVER_TIME_MODULE_ENABLE"], "binding": 6, "stageFlags": 1, "members": [
            { "name": "u_force_mode", "type": 5, "count": 1 },
            { "name": "u_force_space", "type": 5, "count": 1 }
          ]},
          {"name": "VelocityConstant", "defines": ["VELOCITY_OVER_TIME_MODULE_ENABLE"], "binding": 7, "stageFlags": 1, "members": [
            { "name": "u_velocity_mode", "type": 5, "count": 1 },
            { "name": "u_velocity_space", "type": 5, "count": 1 }
          ]},
          {"name": "AnimationConstant", "defines": ["TEXTURE_ANIMATION_MODULE_ENABLE"], "binding": 8, "stageFlags": 1, "members": [
            { "name": "u_anim_info", "type": 16, "count": 1 }
          ]},
          {"name": "FragConstants", "defines": [], "binding": 9, "stageFlags": 16, "members": [
            { "name": "tintColor", "type": 16, "count": 1 }
          ]}
        ],
        "samplers": [
          { "name": "color_over_time_tex0", "type": 28, "count": 1, "defines": ["COLOR_OVER_TIME_MODULE_ENABLE"], "stageFlags": 1, "binding": 10 },
          { "name": "rotation_over_time_tex0", "type": 28, "count": 1, "defines": ["ROTATION_OVER_TIME_MODULE_ENABLE"], "stageFlags": 1, "binding": 11 },
          { "name": "size_over_time_tex0", "type": 28, "count": 1, "defines": ["SIZE_OVER_TIME_MODULE_ENABLE"], "stageFlags": 1, "binding": 12 },
          { "name": "force_over_time_tex0", "type": 28, "count": 1, "defines": ["FORCE_OVER_TIME_MODULE_ENABLE"], "stageFlags": 1, "binding": 13 },
          { "name": "velocity_over_time_tex0", "type": 28, "count": 1, "defines": ["VELOCITY_OVER_TIME_MODULE_ENABLE"], "stageFlags": 1, "binding": 14 },
          { "name": "texture_animation_tex0", "type": 28, "count": 1, "defines": ["TEXTURE_ANIMATION_MODULE_ENABLE"], "stageFlags": 1, "binding": 15 },
          { "name": "mainTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 16 }
        ],
        "attributes": [
          { "name": "a_position_starttime", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 0 },
          { "name": "a_size_uv", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 1 },
          { "name": "a_rotation_uv", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 2 },
          { "name": "a_color", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 3 },
          { "name": "a_dir_life", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 4 },
          { "name": "a_rndSeed", "type": 13, "count": 1, "defines": [], "stageFlags": 1, "format": 11, "location": 5 },
          { "name": "a_texCoord", "type": 15, "count": 1, "defines": ["CC_RENDER_MODE"], "stageFlags": 1, "format": 32, "location": 6 },
          { "name": "a_texCoord3", "type": 15, "count": 1, "defines": ["CC_RENDER_MODE"], "stageFlags": 1, "format": 32, "location": 7 },
          { "name": "a_normal", "type": 15, "count": 1, "defines": ["CC_RENDER_MODE"], "stageFlags": 1, "format": 32, "location": 8 },
          { "name": "a_color1", "type": 16, "count": 1, "defines": ["CC_RENDER_MODE"], "stageFlags": 1, "format": 44, "location": 9 }
        ]
      }
    ]
  },
  {
    "name": "particle-trail",
    "techniques": [
      { "name": "add", "passes": [{ "rasterizerState": { "cullMode": 0 }, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 1, "blendSrcAlpha": 2, "blendDstAlpha": 1 }] }, "program": "particle-trail|particle-trail:vs_main|tinted-fs:add", "depthStencilState": { "depthTest": true, "depthWrite": false }, "properties": { "mainTexture": { "value": "grey", "type": 28 }, "mainTiling_Offset": { "value": [1, 1, 0, 0], "type": 16 }, "frameTile_velLenScale": { "value": [1, 1, 0, 0], "type": 16 }, "tintColor": { "value": [0.5, 0.5, 0.5, 0.5], "type": 16 } } }] }
    ],
    "shaders": [
      {
        "name": "particle-trail|particle-trail:vs_main|tinted-fs:add",
        "hash": 4115155772,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplers": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }], "samplers": [] }
        },
        "defines": [
          { "name": "CC_RENDER_MODE", "type": "number", "range": [0, 4] },
          { "name": "CC_DRAW_WIRE_FRAME", "type": "boolean" },
          { "name": "CC_USE_WORLD_SPACE", "type": "boolean" },
          { "name": "CC_USE_HDR", "type": "boolean" }
        ],
        "blocks": [
          {"name": "Constants", "defines": [], "binding": 0, "stageFlags": 1, "members": [
            { "name": "mainTiling_Offset", "type": 16, "count": 1 },
            { "name": "frameTile_velLenScale", "type": 16, "count": 1 },
            { "name": "scale", "type": 16, "count": 1 }
          ]},
          {"name": "FragConstants", "defines": [], "binding": 1, "stageFlags": 16, "members": [
            { "name": "tintColor", "type": 16, "count": 1 }
          ]}
        ],
        "samplers": [
          { "name": "mainTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 2 }
        ],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_texCoord", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 1 },
          { "name": "a_texCoord1", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 2 },
          { "name": "a_texCoord2", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 3 },
          { "name": "a_color", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 4 }
        ]
      }
    ]
  },
  {
    "name": "particle",
    "techniques": [
      { "name": "add", "passes": [{ "rasterizerState": { "cullMode": 0 }, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 1, "blendSrcAlpha": 2, "blendDstAlpha": 1 }] }, "program": "particle|particle-vs-legacy:lpvs_main|tinted-fs:add", "depthStencilState": { "depthTest": true, "depthWrite": false }, "properties": { "mainTexture": { "value": "grey", "type": 28 }, "mainTiling_Offset": { "value": [1, 1, 0, 0], "type": 16 }, "tintColor": { "value": [0.5, 0.5, 0.5, 0.5], "type": 16 } } }] }
    ],
    "shaders": [
      {
        "name": "particle|particle-vs-legacy:lpvs_main|tinted-fs:add",
        "hash": 66662317,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplers": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }], "samplers": [] }
        },
        "defines": [
          { "name": "CC_RENDER_MODE", "type": "number", "range": [0, 4] },
          { "name": "CC_USE_WORLD_SPACE", "type": "boolean" },
          { "name": "CC_USE_HDR", "type": "boolean" }
        ],
        "blocks": [
          {"name": "Constants", "defines": [], "binding": 0, "stageFlags": 1, "members": [
            { "name": "mainTiling_Offset", "type": 16, "count": 1 },
            { "name": "frameTile_velLenScale", "type": 16, "count": 1 },
            { "name": "scale", "type": 16, "count": 1 }
          ]},
          {"name": "FragConstants", "defines": [], "binding": 1, "stageFlags": 16, "members": [
            { "name": "tintColor", "type": 16, "count": 1 }
          ]}
        ],
        "samplers": [
          { "name": "mainTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 2 }
        ],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_texCoord", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 1 },
          { "name": "a_texCoord1", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 2 },
          { "name": "a_texCoord2", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 3 },
          { "name": "a_color", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 4 },
          { "name": "a_color1", "type": 15, "count": 1, "defines": ["CC_RENDER_MODE"], "stageFlags": 1, "format": 32, "location": 8 },
          { "name": "a_texCoord3", "type": 15, "count": 1, "defines": ["CC_RENDER_MODE"], "stageFlags": 1, "format": 32, "location": 6 },
          { "name": "a_normal", "type": 15, "count": 1, "defines": ["CC_RENDER_MODE"], "stageFlags": 1, "format": 32, "location": 7 }
        ]
      }
    ]
  },
  {
    "name": "spine",
    "techniques": [
      { "passes": [{ "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "rasterizerState": { "cullMode": 0 }, "program": "spine|sprite-vs:vert|sprite-fs:frag", "depthStencilState": { "depthTest": false, "depthWrite": false }, "properties": { "alphaThreshold": { "value": [0.5], "type": 13 } } }] }
    ],
    "shaders": [
      {
        "name": "spine|sprite-vs:vert|sprite-fs:frag",
        "hash": 4078504952,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplers": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": ["USE_LOCAL"] }], "samplers": [{ "name": "cc_spriteTexture", "defines": [] }] }
        },
        "defines": [
          { "name": "USE_LOCAL", "type": "boolean" },
          { "name": "TWO_COLORED", "type": "boolean" },
          { "name": "USE_ALPHA_TEST", "type": "boolean" }
        ],
        "blocks": [
          {"name": "ALPHA_TEST_DATA", "defines": ["USE_ALPHA_TEST"], "binding": 0, "stageFlags": 16, "members": [
            { "name": "alphaThreshold", "type": 13, "count": 1 }
          ]}
        ],
        "samplers": [],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_texCoord", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 1 },
          { "name": "a_color", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 2 },
          { "name": "a_color2", "type": 16, "count": 1, "defines": ["TWO_COLORED"], "stageFlags": 1, "format": 44, "location": 3 }
        ]
      }
    ]
  },
  {
    "name": "sprite",
    "techniques": [
      { "passes": [{ "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "rasterizerState": { "cullMode": 0 }, "program": "sprite|sprite-vs:vert|sprite-fs:frag", "depthStencilState": { "depthTest": false, "depthWrite": false }, "properties": { "alphaThreshold": { "value": [0.5], "type": 13 } } }] }
    ],
    "shaders": [
      {
        "name": "sprite|sprite-vs:vert|sprite-fs:frag",
        "hash": 3990469549,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplers": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": ["USE_LOCAL"] }], "samplers": [{ "name": "cc_spriteTexture", "defines": ["USE_TEXTURE"] }] }
        },
        "defines": [
          { "name": "USE_LOCAL", "type": "boolean" },
          { "name": "USE_PIXEL_ALIGNMENT", "type": "boolean" },
          { "name": "CC_USE_EMBEDDED_ALPHA", "type": "boolean" },
          { "name": "USE_ALPHA_TEST", "type": "boolean" },
          { "name": "USE_TEXTURE", "type": "boolean" },
          { "name": "IS_GRAY", "type": "boolean" }
        ],
        "blocks": [
          {"name": "ALPHA_TEST_DATA", "defines": ["USE_ALPHA_TEST"], "binding": 0, "stageFlags": 16, "members": [
            { "name": "alphaThreshold", "type": 13, "count": 1 }
          ]}
        ],
        "samplers": [],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_texCoord", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 1 },
          { "name": "a_color", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 2 }
        ]
      }
    ]
  },
  {
    "name": "standard",
    "techniques": [
      { "name": "opaque", "passes": [{ "program": "standard|standard-vs:vert|standard-fs:frag", "properties": { "tilingOffset": { "value": [1, 1, 0, 0], "type": 16 }, "mainColor": { "value": [1, 1, 1, 1], "type": 16, "handleInfo": ["albedo", 0, 16] }, "albedoScale": { "value": [1, 1, 1], "type": 15, "handleInfo": ["albedoScaleAndCutoff", 0, 15] }, "alphaThreshold": { "value": [0.5], "type": 13, "handleInfo": ["albedoScaleAndCutoff", 3, 13] }, "occlusion": { "value": [1], "type": 13, "handleInfo": ["pbrParams", 0, 13] }, "roughness": { "value": [0.8], "type": 13, "handleInfo": ["pbrParams", 1, 13] }, "metallic": { "value": [0.6], "type": 13, "handleInfo": ["pbrParams", 2, 13] }, "normalStrenth": { "value": [1], "type": 13, "handleInfo": ["pbrParams", 3, 13] }, "emissive": { "value": [0, 0, 0, 1], "type": 16 }, "emissiveScale": { "value": [1, 1, 1], "type": 15, "handleInfo": ["emissiveScaleParam", 0, 15] }, "mainTexture": { "value": "grey", "type": 28, "handleInfo": ["albedoMap", 0, 28] }, "normalMap": { "value": "normal", "type": 28 }, "pbrMap": { "value": "grey", "type": 28 }, "metallicRoughnessMap": { "value": "grey", "type": 28 }, "occlusionMap": { "value": "white", "type": 28 }, "emissiveMap": { "value": "grey", "type": 28 }, "albedo": { "type": 16, "value": [1, 1, 1, 1] }, "albedoScaleAndCutoff": { "type": 16, "value": [1, 1, 1, 0.5] }, "pbrParams": { "type": 16, "value": [1, 0.8, 0.6, 1] }, "emissiveScaleParam": { "type": 16, "value": [1, 1, 1, 0] }, "albedoMap": { "type": 28, "value": "grey" } } }, { "phase": "forward-add", "propertyIndex": 0, "embeddedMacros": { "CC_FORWARD_ADD": true }, "blendState": { "targets": [{ "blend": true, "blendSrc": 1, "blendDst": 1, "blendSrcAlpha": 0, "blendDstAlpha": 1 }] }, "program": "standard|standard-vs:vert|standard-fs:frag", "depthStencilState": { "depthFunc": 2, "depthTest": true, "depthWrite": false }, "properties": { "tilingOffset": { "value": [1, 1, 0, 0], "type": 16 }, "mainColor": { "value": [1, 1, 1, 1], "type": 16, "handleInfo": ["albedo", 0, 16] }, "albedoScale": { "value": [1, 1, 1], "type": 15, "handleInfo": ["albedoScaleAndCutoff", 0, 15] }, "alphaThreshold": { "value": [0.5], "type": 13, "handleInfo": ["albedoScaleAndCutoff", 3, 13] }, "occlusion": { "value": [1], "type": 13, "handleInfo": ["pbrParams", 0, 13] }, "roughness": { "value": [0.8], "type": 13, "handleInfo": ["pbrParams", 1, 13] }, "metallic": { "value": [0.6], "type": 13, "handleInfo": ["pbrParams", 2, 13] }, "normalStrenth": { "value": [1], "type": 13, "handleInfo": ["pbrParams", 3, 13] }, "emissive": { "value": [0, 0, 0, 1], "type": 16 }, "emissiveScale": { "value": [1, 1, 1], "type": 15, "handleInfo": ["emissiveScaleParam", 0, 15] }, "mainTexture": { "value": "grey", "type": 28, "handleInfo": ["albedoMap", 0, 28] }, "normalMap": { "value": "normal", "type": 28 }, "pbrMap": { "value": "grey", "type": 28 }, "metallicRoughnessMap": { "value": "grey", "type": 28 }, "occlusionMap": { "value": "white", "type": 28 }, "emissiveMap": { "value": "grey", "type": 28 }, "albedo": { "type": 16, "value": [1, 1, 1, 1] }, "albedoScaleAndCutoff": { "type": 16, "value": [1, 1, 1, 0.5] }, "pbrParams": { "type": 16, "value": [1, 0.8, 0.6, 1] }, "emissiveScaleParam": { "type": 16, "value": [1, 1, 1, 0] }, "albedoMap": { "type": 28, "value": "grey" } } }, { "phase": "shadow-caster", "propertyIndex": 0, "rasterizerState": { "cullMode": 1 }, "program": "standard|shadow-caster-vs:vert|shadow-caster-fs:frag", "properties": { "tilingOffset": { "value": [1, 1, 0, 0], "type": 16 }, "mainColor": { "value": [1, 1, 1, 1], "type": 16, "handleInfo": ["albedo", 0, 16] }, "albedoScale": { "value": [1, 1, 1], "type": 15, "handleInfo": ["albedoScaleAndCutoff", 0, 15] }, "alphaThreshold": { "value": [0.5], "type": 13, "handleInfo": ["albedoScaleAndCutoff", 3, 13] }, "occlusion": { "value": [1], "type": 13, "handleInfo": ["pbrParams", 0, 13] }, "roughness": { "value": [0.8], "type": 13, "handleInfo": ["pbrParams", 1, 13] }, "metallic": { "value": [0.6], "type": 13, "handleInfo": ["pbrParams", 2, 13] }, "normalStrenth": { "value": [1], "type": 13, "handleInfo": ["pbrParams", 3, 13] }, "emissive": { "value": [0, 0, 0, 1], "type": 16 }, "emissiveScale": { "value": [1, 1, 1], "type": 15, "handleInfo": ["emissiveScaleParam", 0, 15] }, "mainTexture": { "value": "grey", "type": 28, "handleInfo": ["albedoMap", 0, 28] }, "albedo": { "type": 16, "value": [1, 1, 1, 1] }, "albedoScaleAndCutoff": { "type": 16, "value": [1, 1, 1, 0.5] }, "pbrParams": { "type": 16, "value": [1, 0.8, 0.6, 1] }, "emissiveScaleParam": { "type": 16, "value": [1, 1, 1, 0] }, "albedoMap": { "type": 28, "value": "grey" } } }] }
    ],
    "shaders": [
      {
        "name": "standard|standard-vs:vert|standard-fs:frag",
        "hash": 624422912,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }, { "name": "CCShadow", "defines": [] }], "samplers": [{ "name": "cc_environment", "defines": ["CC_USE_IBL"] }, { "name": "cc_shadowMap", "defines": ["CC_RECEIVE_SHADOW"] }, { "name": "cc_spotLightingMap", "defines": ["CC_RECEIVE_SHADOW"] }] },
          "locals": { "blocks": [{ "name": "CCMorph", "defines": ["CC_USE_MORPH"] }, { "name": "CCSkinningTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinningAnimation", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinning", "defines": ["CC_USE_SKINNING", "!CC_USE_BAKED_ANIMATION"] }, { "name": "CCLocalBatched", "defines": ["!USE_INSTANCING", "USE_BATCHING"] }, { "name": "CCLocal", "defines": ["!USE_INSTANCING", "!USE_BATCHING"] }, { "name": "CCForwardLight", "defines": ["CC_FORWARD_ADD"] }], "samplers": [{ "name": "cc_PositionDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_POSITION"] }, { "name": "cc_NormalDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_NORMAL"] }, { "name": "cc_TangentDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_TANGENT"] }, { "name": "cc_jointTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "cc_lightingMap", "defines": ["USE_LIGHTMAP", "!USE_BATCHING", "!CC_FORWARD_ADD"] }] }
        },
        "defines": [
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_COUNT", "type": "number", "range": [2, 8] },
          { "name": "CC_SUPPORT_FLOAT_TEXTURE", "type": "boolean" },
          { "name": "CC_MORPH_PRECOMPUTED", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_POSITION", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_NORMAL", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_TANGENT", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_USE_BAKED_ANIMATION", "type": "boolean" },
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_USE_FOG", "type": "number", "range": [0, 4] },
          { "name": "CC_FORWARD_ADD", "type": "boolean" },
          { "name": "USE_VERTEX_COLOR", "type": "boolean" },
          { "name": "USE_NORMAL_MAP", "type": "boolean" },
          { "name": "HAS_SECOND_UV", "type": "boolean" },
          { "name": "CC_USE_IBL", "type": "number", "range": [0, 2] },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "CC_USE_HDR", "type": "boolean" },
          { "name": "USE_ALBEDO_MAP", "type": "boolean" },
          { "name": "ALBEDO_UV", "type": "string", "options": ["v_uv", "v_uv1"] },
          { "name": "NORMAL_UV", "type": "string", "options": ["v_uv", "v_uv1"] },
          { "name": "PBR_UV", "type": "string", "options": ["v_uv", "v_uv1"] },
          { "name": "USE_PBR_MAP", "type": "boolean" },
          { "name": "USE_METALLIC_ROUGHNESS_MAP", "type": "boolean" },
          { "name": "USE_OCCLUSION_MAP", "type": "boolean" },
          { "name": "USE_EMISSIVE_MAP", "type": "boolean" },
          { "name": "EMISSIVE_UV", "type": "string", "options": ["v_uv", "v_uv1"] },
          { "name": "USE_ALPHA_TEST", "type": "boolean" },
          { "name": "ALPHA_TEST_CHANNEL", "type": "string", "options": ["a", "r"] }
        ],
        "blocks": [
          {"name": "Constants", "defines": [], "binding": 0, "stageFlags": 17, "members": [
            { "name": "tilingOffset", "type": 16, "count": 1 },
            { "name": "albedo", "type": 16, "count": 1 },
            { "name": "albedoScaleAndCutoff", "type": 16, "count": 1 },
            { "name": "pbrParams", "type": 16, "count": 1 },
            { "name": "emissive", "type": 16, "count": 1 },
            { "name": "emissiveScaleParam", "type": 16, "count": 1 }
          ]}
        ],
        "samplers": [
          { "name": "albedoMap", "type": 28, "count": 1, "defines": ["USE_ALBEDO_MAP"], "stageFlags": 16, "binding": 1 },
          { "name": "normalMap", "type": 28, "count": 1, "defines": ["USE_NORMAL_MAP"], "stageFlags": 16, "binding": 2 },
          { "name": "pbrMap", "type": 28, "count": 1, "defines": ["USE_PBR_MAP"], "stageFlags": 16, "binding": 3 },
          { "name": "metallicRoughnessMap", "type": 28, "count": 1, "defines": ["USE_METALLIC_ROUGHNESS_MAP"], "stageFlags": 16, "binding": 4 },
          { "name": "occlusionMap", "type": 28, "count": 1, "defines": ["USE_OCCLUSION_MAP"], "stageFlags": 16, "binding": 5 },
          { "name": "emissiveMap", "type": 28, "count": 1, "defines": ["USE_EMISSIVE_MAP"], "stageFlags": 16, "binding": 6 }
        ],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_normal", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 1 },
          { "name": "a_texCoord", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 2 },
          { "name": "a_tangent", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 3 },
          { "name": "a_vertexId", "type": 13, "count": 1, "defines": ["CC_USE_MORPH"], "stageFlags": 1, "format": 11, "location": 6 },
          { "name": "a_joints", "type": 12, "count": 1, "defines": ["CC_USE_SKINNING"], "stageFlags": 1, "format": 42, "location": 4 },
          { "name": "a_weights", "type": 16, "count": 1, "defines": ["CC_USE_SKINNING"], "stageFlags": 1, "format": 44, "location": 5 },
          { "name": "a_jointAnimInfo", "type": 16, "count": 1, "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION", "USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld0", "type": 16, "count": 1, "defines": ["USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_matWorld1", "type": 16, "count": 1, "defines": ["USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_matWorld2", "type": 16, "count": 1, "defines": ["USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 10 },
          { "name": "a_lightingMapUVParam", "type": 16, "count": 1, "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 11 },
          { "name": "a_dyn_batch_id", "type": 13, "count": 1, "defines": ["!USE_INSTANCING", "USE_BATCHING"], "stageFlags": 1, "format": 11, "location": 12 },
          { "name": "a_color", "type": 16, "count": 1, "defines": ["USE_VERTEX_COLOR"], "stageFlags": 1, "format": 44, "location": 13 },
          { "name": "a_texCoord1", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 14 }
        ]
      },
      {
        "name": "standard|shadow-caster-vs:vert|shadow-caster-fs:frag",
        "hash": 3020491,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCShadow", "defines": [] }], "samplers": [] },
          "locals": { "blocks": [{ "name": "CCMorph", "defines": ["CC_USE_MORPH"] }, { "name": "CCSkinningTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinningAnimation", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinning", "defines": ["CC_USE_SKINNING", "!CC_USE_BAKED_ANIMATION"] }, { "name": "CCLocalBatched", "defines": ["!USE_INSTANCING", "USE_BATCHING"] }, { "name": "CCLocal", "defines": ["!USE_INSTANCING", "!USE_BATCHING"] }], "samplers": [{ "name": "cc_PositionDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_POSITION"] }, { "name": "cc_NormalDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_NORMAL"] }, { "name": "cc_TangentDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_TANGENT"] }, { "name": "cc_jointTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }] }
        },
        "defines": [
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_COUNT", "type": "number", "range": [2, 8] },
          { "name": "CC_SUPPORT_FLOAT_TEXTURE", "type": "boolean" },
          { "name": "CC_MORPH_PRECOMPUTED", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_POSITION", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_NORMAL", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_TANGENT", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_USE_BAKED_ANIMATION", "type": "boolean" },
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "HAS_SECOND_UV", "type": "boolean" },
          { "name": "USE_ALBEDO_MAP", "type": "boolean" },
          { "name": "ALBEDO_UV", "type": "string", "options": ["v_uv", "v_uv1"] },
          { "name": "USE_ALPHA_TEST", "type": "boolean" },
          { "name": "ALPHA_TEST_CHANNEL", "type": "string", "options": ["a", "r"] }
        ],
        "blocks": [
          {"name": "Constants", "defines": [], "binding": 0, "stageFlags": 17, "members": [
            { "name": "tilingOffset", "type": 16, "count": 1 },
            { "name": "albedo", "type": 16, "count": 1 },
            { "name": "albedoScaleAndCutoff", "type": 16, "count": 1 },
            { "name": "pbrParams", "type": 16, "count": 1 },
            { "name": "emissive", "type": 16, "count": 1 },
            { "name": "emissiveScaleParam", "type": 16, "count": 1 }
          ]}
        ],
        "samplers": [
          { "name": "albedoMap", "type": 28, "count": 1, "defines": ["USE_ALBEDO_MAP"], "stageFlags": 16, "binding": 1 }
        ],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_normal", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 1 },
          { "name": "a_texCoord", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 2 },
          { "name": "a_tangent", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 3 },
          { "name": "a_vertexId", "type": 13, "count": 1, "defines": ["CC_USE_MORPH"], "stageFlags": 1, "format": 11, "location": 6 },
          { "name": "a_joints", "type": 12, "count": 1, "defines": ["CC_USE_SKINNING"], "stageFlags": 1, "format": 42, "location": 4 },
          { "name": "a_weights", "type": 16, "count": 1, "defines": ["CC_USE_SKINNING"], "stageFlags": 1, "format": 44, "location": 5 },
          { "name": "a_jointAnimInfo", "type": 16, "count": 1, "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION", "USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld0", "type": 16, "count": 1, "defines": ["USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_matWorld1", "type": 16, "count": 1, "defines": ["USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_matWorld2", "type": 16, "count": 1, "defines": ["USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 10 },
          { "name": "a_lightingMapUVParam", "type": 16, "count": 1, "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 11 },
          { "name": "a_dyn_batch_id", "type": 13, "count": 1, "defines": ["!USE_INSTANCING", "USE_BATCHING"], "stageFlags": 1, "format": 11, "location": 12 },
          { "name": "a_texCoord1", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 13 }
        ]
      }
    ]
  },
  {
    "name": "terrain",
    "techniques": [
      { "name": "opaque", "passes": [{ "program": "terrain|terrain-vs:vert|terrain-fs:frag", "properties": { "UVScale": { "value": [1, 1, 1, 1], "type": 16 }, "lightMapUVParam": { "value": [0, 0, 0, 0], "type": 16 }, "metallic": { "value": [0, 0, 0, 0], "type": 16 }, "roughness": { "value": [1, 1, 1, 1], "type": 16 }, "weightMap": { "value": "black", "type": 28 }, "detailMap0": { "value": "grey", "type": 28 }, "detailMap1": { "value": "grey", "type": 28 }, "detailMap2": { "value": "grey", "type": 28 }, "detailMap3": { "value": "grey", "type": 28 }, "normalMap0": { "value": "normal-texture", "type": 28 }, "normalMap1": { "value": "normal-texture", "type": 28 }, "normalMap2": { "value": "normal-texture", "type": 28 }, "normalMap3": { "value": "normal-texture", "type": 28 }, "lightMap": { "value": "grey", "type": 28 } } }, { "phase": "forward-add", "propertyIndex": 0, "embeddedMacros": { "CC_FORWARD_ADD": true }, "blendState": { "targets": [{ "blend": true, "blendSrc": 1, "blendDst": 1, "blendSrcAlpha": 0, "blendDstAlpha": 1 }] }, "program": "terrain|terrain-vs:vert|terrain-fs:frag", "depthStencilState": { "depthFunc": 2, "depthTest": true, "depthWrite": false }, "properties": { "UVScale": { "value": [1, 1, 1, 1], "type": 16 }, "lightMapUVParam": { "value": [0, 0, 0, 0], "type": 16 }, "metallic": { "value": [0, 0, 0, 0], "type": 16 }, "roughness": { "value": [1, 1, 1, 1], "type": 16 }, "weightMap": { "value": "black", "type": 28 }, "detailMap0": { "value": "grey", "type": 28 }, "detailMap1": { "value": "grey", "type": 28 }, "detailMap2": { "value": "grey", "type": 28 }, "detailMap3": { "value": "grey", "type": 28 }, "normalMap0": { "value": "normal-texture", "type": 28 }, "normalMap1": { "value": "normal-texture", "type": 28 }, "normalMap2": { "value": "normal-texture", "type": 28 }, "normalMap3": { "value": "normal-texture", "type": 28 }, "lightMap": { "value": "grey", "type": 28 } } }, { "phase": "shadow-add", "propertyIndex": 0, "rasterizerState": { "cullMode": 2 }, "program": "terrain|shadow-caster-vs:vert|shadow-caster-fs:frag" }] }
    ],
    "shaders": [
      {
        "name": "terrain|terrain-vs:vert|terrain-fs:frag",
        "hash": 2164259680,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }, { "name": "CCShadow", "defines": [] }], "samplers": [{ "name": "cc_environment", "defines": ["CC_USE_IBL"] }, { "name": "cc_shadowMap", "defines": ["CC_RECEIVE_SHADOW"] }, { "name": "cc_spotLightingMap", "defines": ["CC_RECEIVE_SHADOW"] }] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }, { "name": "CCForwardLight", "defines": ["CC_FORWARD_ADD"] }], "samplers": [] }
        },
        "defines": [
          { "name": "CC_USE_FOG", "type": "number", "range": [0, 4] },
          { "name": "CC_FORWARD_ADD", "type": "boolean" },
          { "name": "USE_NORMALMAP", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_USE_IBL", "type": "number", "range": [0, 2] },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "CC_USE_HDR", "type": "boolean" },
          { "name": "LAYERS", "type": "number", "range": [0, 4] },
          { "name": "USE_PBR", "type": "boolean" }
        ],
        "blocks": [
          {"name": "TexCoords", "defines": [], "binding": 0, "stageFlags": 1, "members": [
            { "name": "UVScale", "type": 16, "count": 1 },
            { "name": "lightMapUVParam", "type": 16, "count": 1 }
          ]},
          {"name": "PbrParams", "defines": [], "binding": 1, "stageFlags": 16, "members": [
            { "name": "metallic", "type": 16, "count": 1 },
            { "name": "roughness", "type": 16, "count": 1 }
          ]}
        ],
        "samplers": [
          { "name": "weightMap", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 2 },
          { "name": "detailMap0", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 3 },
          { "name": "detailMap1", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 4 },
          { "name": "detailMap2", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 5 },
          { "name": "detailMap3", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 6 },
          { "name": "normalMap0", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 7 },
          { "name": "normalMap1", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 8 },
          { "name": "normalMap2", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 9 },
          { "name": "normalMap3", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 10 },
          { "name": "lightMap", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 11 }
        ],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_normal", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 1 },
          { "name": "a_texCoord", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 2 }
        ]
      },
      {
        "name": "terrain|shadow-caster-vs:vert|shadow-caster-fs:frag",
        "hash": 3874167763,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }, { "name": "CCShadow", "defines": [] }], "samplers": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }], "samplers": [] }
        },
        "defines": [],
        "blocks": [],
        "samplers": [],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_normal", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 1 },
          { "name": "a_texCoord", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 2 }
        ]
      }
    ]
  },
  {
    "name": "unlit",
    "techniques": [
      { "name": "opaque", "passes": [{ "program": "unlit|unlit-vs:vert|unlit-fs:frag", "properties": { "mainTexture": { "value": "grey", "type": 28 }, "tilingOffset": { "value": [1, 1, 0, 0], "type": 16 }, "mainColor": { "value": [1, 1, 1, 1], "type": 16 }, "colorScale": { "value": [1, 1, 1], "type": 15, "handleInfo": ["colorScaleAndCutoff", 0, 15] }, "alphaThreshold": { "value": [0.5], "type": 13, "handleInfo": ["colorScaleAndCutoff", 3, 13] }, "color": { "type": 16, "handleInfo": ["mainColor", 0, 16] }, "colorScaleAndCutoff": { "type": 16, "value": [1, 1, 1, 0.5] } } }] }
    ],
    "shaders": [
      {
        "name": "unlit|unlit-vs:vert|unlit-fs:frag",
        "hash": 3822871803,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplers": [] },
          "locals": { "blocks": [{ "name": "CCMorph", "defines": ["CC_USE_MORPH"] }, { "name": "CCSkinningTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinningAnimation", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinning", "defines": ["CC_USE_SKINNING", "!CC_USE_BAKED_ANIMATION"] }, { "name": "CCLocalBatched", "defines": ["!USE_INSTANCING", "USE_BATCHING"] }, { "name": "CCLocal", "defines": ["!USE_INSTANCING", "!USE_BATCHING"] }], "samplers": [{ "name": "cc_PositionDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_POSITION"] }, { "name": "cc_NormalDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_NORMAL"] }, { "name": "cc_TangentDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_TANGENT"] }, { "name": "cc_jointTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }] }
        },
        "defines": [
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_COUNT", "type": "number", "range": [2, 8] },
          { "name": "CC_SUPPORT_FLOAT_TEXTURE", "type": "boolean" },
          { "name": "CC_MORPH_PRECOMPUTED", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_POSITION", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_NORMAL", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_TANGENT", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_USE_BAKED_ANIMATION", "type": "boolean" },
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_USE_FOG", "type": "number", "range": [0, 4] },
          { "name": "CC_FORWARD_ADD", "type": "boolean" },
          { "name": "USE_VERTEX_COLOR", "type": "boolean" },
          { "name": "USE_TEXTURE", "type": "boolean" },
          { "name": "CC_USE_HDR", "type": "boolean" },
          { "name": "USE_ALPHA_TEST", "type": "boolean" },
          { "name": "ALPHA_TEST_CHANNEL", "type": "string", "options": ["a", "r", "g", "b"] }
        ],
        "blocks": [
          {"name": "TexCoords", "defines": ["USE_TEXTURE"], "binding": 0, "stageFlags": 1, "members": [
            { "name": "tilingOffset", "type": 16, "count": 1 }
          ]},
          {"name": "Constant", "defines": [], "binding": 1, "stageFlags": 16, "members": [
            { "name": "mainColor", "type": 16, "count": 1 },
            { "name": "colorScaleAndCutoff", "type": 16, "count": 1 }
          ]}
        ],
        "samplers": [
          { "name": "mainTexture", "type": 28, "count": 1, "defines": ["USE_TEXTURE"], "stageFlags": 16, "binding": 2 }
        ],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_normal", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 1 },
          { "name": "a_texCoord", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 2 },
          { "name": "a_tangent", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 3 },
          { "name": "a_vertexId", "type": 13, "count": 1, "defines": ["CC_USE_MORPH"], "stageFlags": 1, "format": 11, "location": 6 },
          { "name": "a_joints", "type": 12, "count": 1, "defines": ["CC_USE_SKINNING"], "stageFlags": 1, "format": 42, "location": 4 },
          { "name": "a_weights", "type": 16, "count": 1, "defines": ["CC_USE_SKINNING"], "stageFlags": 1, "format": 44, "location": 5 },
          { "name": "a_jointAnimInfo", "type": 16, "count": 1, "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION", "USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld0", "type": 16, "count": 1, "defines": ["USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_matWorld1", "type": 16, "count": 1, "defines": ["USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_matWorld2", "type": 16, "count": 1, "defines": ["USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 10 },
          { "name": "a_lightingMapUVParam", "type": 16, "count": 1, "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 11 },
          { "name": "a_dyn_batch_id", "type": 13, "count": 1, "defines": ["!USE_INSTANCING", "USE_BATCHING"], "stageFlags": 1, "format": 11, "location": 12 },
          { "name": "a_color", "type": 16, "count": 1, "defines": ["USE_VERTEX_COLOR"], "stageFlags": 1, "format": 44, "location": 13 }
        ]
      }
    ]
  },
  {
    "name": "planar-shadow",
    "techniques": [
      { "passes": [{ "phase": "planarShadow", "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "program": "planar-shadow|planar-shadow-vs:vert|planar-shadow-fs:frag", "depthStencilState": { "depthTest": true, "depthWrite": false, "stencilTestFront": true, "stencilFuncFront": 5, "stencilPassOpFront": 2, "stencilRefBack": 128, "stencilRefFront": 128, "stencilReadMaskBack": 128, "stencilReadMaskFront": 128, "stencilWriteMaskBack": 128, "stencilWriteMaskFront": 128 } }] }
    ],
    "shaders": [
      {
        "name": "planar-shadow|planar-shadow-vs:vert|planar-shadow-fs:frag",
        "hash": 2901856202,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }, { "name": "CCShadow", "defines": [] }], "samplers": [] },
          "locals": { "blocks": [{ "name": "CCMorph", "defines": ["CC_USE_MORPH"] }, { "name": "CCSkinningTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinningAnimation", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinning", "defines": ["CC_USE_SKINNING", "!CC_USE_BAKED_ANIMATION"] }, { "name": "CCLocalBatched", "defines": ["!USE_INSTANCING", "USE_BATCHING"] }, { "name": "CCLocal", "defines": ["!USE_INSTANCING", "!USE_BATCHING"] }], "samplers": [{ "name": "cc_PositionDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_POSITION"] }, { "name": "cc_NormalDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_NORMAL"] }, { "name": "cc_TangentDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_TANGENT"] }, { "name": "cc_jointTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }] }
        },
        "defines": [
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_COUNT", "type": "number", "range": [2, 8] },
          { "name": "CC_SUPPORT_FLOAT_TEXTURE", "type": "boolean" },
          { "name": "CC_MORPH_PRECOMPUTED", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_POSITION", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_NORMAL", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_TANGENT", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_USE_BAKED_ANIMATION", "type": "boolean" },
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_USE_HDR", "type": "boolean" }
        ],
        "blocks": [],
        "samplers": [],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_normal", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 1 },
          { "name": "a_texCoord", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 2 },
          { "name": "a_tangent", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 3 },
          { "name": "a_vertexId", "type": 13, "count": 1, "defines": ["CC_USE_MORPH"], "stageFlags": 1, "format": 11, "location": 6 },
          { "name": "a_joints", "type": 12, "count": 1, "defines": ["CC_USE_SKINNING"], "stageFlags": 1, "format": 42, "location": 4 },
          { "name": "a_weights", "type": 16, "count": 1, "defines": ["CC_USE_SKINNING"], "stageFlags": 1, "format": 44, "location": 5 },
          { "name": "a_jointAnimInfo", "type": 16, "count": 1, "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION", "USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld0", "type": 16, "count": 1, "defines": ["USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_matWorld1", "type": 16, "count": 1, "defines": ["USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_matWorld2", "type": 16, "count": 1, "defines": ["USE_INSTANCING"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 10 },
          { "name": "a_lightingMapUVParam", "type": 16, "count": 1, "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "stageFlags": 1, "format": 44, "isInstanced": true, "location": 11 },
          { "name": "a_dyn_batch_id", "type": 13, "count": 1, "defines": ["!USE_INSTANCING", "USE_BATCHING"], "stageFlags": 1, "format": 11, "location": 12 }
        ]
      }
    ]
  },
  {
    "name": "skybox",
    "techniques": [
      { "passes": [{ "rasterizerState": { "cullMode": 0 }, "program": "skybox|sky-vs:vert|sky-fs:frag", "priority": 245, "depthStencilState": { "depthTest": true, "depthWrite": false } }] }
    ],
    "shaders": [
      {
        "name": "skybox|sky-vs:vert|sky-fs:frag",
        "hash": 2319917655,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplers": [{ "name": "cc_environment", "defines": [] }] },
          "locals": { "blocks": [], "samplers": [] }
        },
        "defines": [
          { "name": "CC_USE_IBL", "type": "number", "range": [0, 2] },
          { "name": "CC_USE_HDR", "type": "boolean" },
          { "name": "USE_RGBE_CUBEMAP", "type": "boolean" }
        ],
        "blocks": [],
        "samplers": [],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_normal", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 1 },
          { "name": "a_texCoord", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 2 },
          { "name": "a_tangent", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 3 }
        ]
      }
    ]
  },
  {
    "name": "profiler",
    "techniques": [
      { "passes": [{ "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "rasterizerState": { "cullMode": 0 }, "program": "profiler|profiler-vs:vert|profiler-fs:frag", "depthStencilState": { "depthTest": false, "depthWrite": false } }] }
    ],
    "shaders": [
      {
        "name": "profiler|profiler-vs:vert|profiler-fs:frag",
        "hash": 2029303284,
        "builtins": {
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplers": [] },
          "locals": { "blocks": [], "samplers": [] }
        },
        "defines": [
          { "name": "CC_USE_HDR", "type": "boolean" }
        ],
        "blocks": [
          {"name": "Constants", "defines": [], "binding": 0, "stageFlags": 1, "members": [
            { "name": "offset", "type": 16, "count": 1 }
          ]},
          {"name": "PerFrameInfo", "defines": [], "binding": 1, "stageFlags": 1, "members": [
            { "name": "digits", "type": 16, "count": 20 }
          ]}
        ],
        "samplers": [
          { "name": "mainTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 2 }
        ],
        "attributes": [
          { "name": "a_position", "type": 15, "count": 1, "defines": [], "stageFlags": 1, "format": 32, "location": 0 },
          { "name": "a_color", "type": 16, "count": 1, "defines": [], "stageFlags": 1, "format": 44, "location": 1 }
        ]
      }
    ]
  },
  {
    "name": "splash-screen",
    "techniques": [
      { "passes": [{ "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "rasterizerState": { "cullMode": 0 }, "program": "splash-screen|splash-screen-vs:vert|splash-screen-fs:frag", "depthStencilState": { "depthTest": false, "depthWrite": false } }] }
    ],
    "shaders": [
      {
        "name": "splash-screen|splash-screen-vs:vert|splash-screen-fs:frag",
        "hash": 2106901053,
        "builtins": {
          "globals": { "blocks": [], "samplers": [] },
          "locals": { "blocks": [], "samplers": [] }
        },
        "defines": [],
        "blocks": [
          {"name": "splashFrag", "defines": [], "binding": 0, "stageFlags": 16, "members": [
            { "name": "u_precent", "type": 13, "count": 1 }
          ]}
        ],
        "samplers": [
          { "name": "mainTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 1 }
        ],
        "attributes": [
          { "name": "a_position", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 0 },
          { "name": "a_texCoord", "type": 14, "count": 1, "defines": [], "stageFlags": 1, "format": 21, "location": 1 }
        ]
      }
    ]
  }
];
