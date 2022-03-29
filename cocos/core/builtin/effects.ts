/* eslint-disable */
// absolute essential effects
export const effects = [
  {
    "name": "billboard",
    "techniques": [
      { "name": "add", "passes": [{ "rasterizerState": { "cullMode": 0 }, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 1, "blendSrcAlpha": 2, "blendDstAlpha": 1 }] }, "program": "billboard|vert:vs_main|tinted-fs:add", "depthStencilState": { "depthTest": true, "depthWrite": false }, "properties": { "mainTexture": { "value": "grey", "type": 28 }, "mainTiling_Offset": { "value": [1, 1, 0, 0], "type": 16 }, "tintColor": { "value": [0.5, 0.5, 0.5, 0.5], "type": 16 } } }] }
    ],
    "shaders": [
      {
        "name": "billboard|vert:vs_main|tinted-fs:add",
        "hash": 3642336485,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 54, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 40 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 1 },
          { "name": "a_color", "defines": [], "format": 44, "location": 2 }
        ],
        "blocks": [
          {"name": "Constants", "defines": [], "binding": 0, "stageFlags": 1, "members": [
            { "name": "mainTiling_Offset", "type": 16, "count": 1 },
            { "name": "frameTile_velLenScale", "type": 16, "count": 1 },
            { "name": "scale", "type": 16, "count": 1 },
            { "name": "nodeRotation", "type": 16, "count": 1 }
          ]},
          {"name": "builtin", "defines": [], "binding": 1, "stageFlags": 1, "members": [
            { "name": "cc_size_rotation", "type": 16, "count": 1 }
          ]},
          {"name": "FragConstants", "defines": [], "binding": 2, "stageFlags": 16, "members": [
            { "name": "tintColor", "type": 16, "count": 1 }
          ]}
        ],
        "samplerTextures": [
          { "name": "mainTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 3 }
        ],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
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
        "hash": 3507038093,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 0, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 0 },
          "globals": { "blocks": [], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 }
        ],
        "blocks": [],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      }
    ]
  },
  {
    "name": "geometry-renderer",
    "techniques": [
      { "passes": [{ "primitive": 1, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "program": "geometry-renderer|line-vs:vert|line-fs:front", "priority": 245, "depthStencilState": { "depthTest": false, "depthWrite": false } }] },
      { "passes": [{ "primitive": 1, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "program": "geometry-renderer|line-vs:vert|line-fs:front", "priority": 245, "depthStencilState": { "depthTest": true, "depthWrite": false } }, { "primitive": 1, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "program": "geometry-renderer|line-vs:vert|line-fs:back", "priority": 245, "depthStencilState": { "depthTest": true, "depthWrite": false, "depthFunc": 4 } }] },
      { "passes": [{ "primitive": 1, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "program": "geometry-renderer|dashed-line-vs:vert|dashed-line-fs:front", "priority": 245, "depthStencilState": { "depthTest": false, "depthWrite": false } }] },
      { "passes": [{ "primitive": 1, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "program": "geometry-renderer|dashed-line-vs:vert|dashed-line-fs:front", "priority": 245, "depthStencilState": { "depthTest": true, "depthWrite": false } }, { "primitive": 1, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "program": "geometry-renderer|dashed-line-vs:vert|dashed-line-fs:back", "priority": 245, "depthStencilState": { "depthTest": true, "depthWrite": false, "depthFunc": 4 } }] },
      { "passes": [{ "rasterizerState": { "cullMode": 2 }, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "program": "geometry-renderer|triangle-vs:vert|triangle-fs:front", "priority": 245, "depthStencilState": { "depthTest": false, "depthWrite": false } }] },
      { "passes": [{ "rasterizerState": { "cullMode": 2 }, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "program": "geometry-renderer|triangle-vs:vert|triangle-fs:front", "priority": 245, "depthStencilState": { "depthTest": true, "depthWrite": false } }, { "rasterizerState": { "cullMode": 2 }, "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "program": "geometry-renderer|triangle-vs:vert|triangle-fs:back", "priority": 245, "depthStencilState": { "depthTest": true, "depthWrite": false, "depthFunc": 4 } }] }
    ],
    "shaders": [
      {
        "name": "geometry-renderer|line-vs:vert|line-fs:front",
        "hash": 3617431000,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 39, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 39 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_FORWARD_PIPELINE", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_color", "defines": [], "format": 44, "location": 1 }
        ],
        "blocks": [],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      },
      {
        "name": "geometry-renderer|line-vs:vert|line-fs:back",
        "hash": 4168905198,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 39, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 39 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_FORWARD_PIPELINE", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_color", "defines": [], "format": 44, "location": 1 }
        ],
        "blocks": [],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      },
      {
        "name": "geometry-renderer|dashed-line-vs:vert|dashed-line-fs:front",
        "hash": 4034582016,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 39, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 39 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_FORWARD_PIPELINE", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_color", "defines": [], "format": 44, "location": 1 }
        ],
        "blocks": [],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      },
      {
        "name": "geometry-renderer|dashed-line-vs:vert|dashed-line-fs:back",
        "hash": 1762165009,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 39, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 39 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_FORWARD_PIPELINE", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_color", "defines": [], "format": 44, "location": 1 }
        ],
        "blocks": [],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      },
      {
        "name": "geometry-renderer|triangle-vs:vert|triangle-fs:front",
        "hash": 4143142643,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 39, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 39 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_FORWARD_PIPELINE", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 44, "location": 1 },
          { "name": "a_color", "defines": [], "format": 44, "location": 2 }
        ],
        "blocks": [],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      },
      {
        "name": "geometry-renderer|triangle-vs:vert|triangle-fs:back",
        "hash": 826026446,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 39, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 39 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_FORWARD_PIPELINE", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 44, "location": 1 },
          { "name": "a_color", "defines": [], "format": 44, "location": 2 }
        ],
        "blocks": [],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
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
        "hash": 4284763886,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 49, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 0 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_color", "defines": [], "format": 44, "location": 1 },
          { "name": "a_dist", "defines": [], "format": 11, "location": 2 }
        ],
        "blocks": [],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      }
    ]
  },
  {
    "name": "occlusion-query",
    "techniques": [
      { "passes": [{ "rasterizerState": { "cullMode": 2 }, "blendState": { "targets": [{ "blendColorMask": 0 }] }, "program": "occlusion-query|occlusion-query-vs:vert|occlusion-query-fs:frag", "depthStencilState": { "depthTest": true, "depthWrite": false } }] }
    ],
    "shaders": [
      {
        "name": "occlusion-query|occlusion-query-vs:vert|occlusion-query-fs:frag",
        "hash": 1571978323,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 41, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 0 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCWorldBound", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 }
        ],
        "blocks": [],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
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
        "hash": 851293782,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 64, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 40 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "CC_RENDER_MODE", "type": "number", "range": [0, 4] },
          { "name": "USE_VK_SHADER", "type": "boolean" },
          { "name": "COLOR_OVER_TIME_MODULE_ENABLE", "type": "boolean" },
          { "name": "ROTATION_OVER_TIME_MODULE_ENABLE", "type": "boolean" },
          { "name": "SIZE_OVER_TIME_MODULE_ENABLE", "type": "boolean" },
          { "name": "FORCE_OVER_TIME_MODULE_ENABLE", "type": "boolean" },
          { "name": "VELOCITY_OVER_TIME_MODULE_ENABLE", "type": "boolean" },
          { "name": "TEXTURE_ANIMATION_MODULE_ENABLE", "type": "boolean" },
          { "name": "CC_USE_WORLD_SPACE", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position_starttime", "defines": [], "format": 44, "location": 0 },
          { "name": "a_size_uv", "defines": [], "format": 44, "location": 1 },
          { "name": "a_rotation_uv", "defines": [], "format": 44, "location": 2 },
          { "name": "a_color", "defines": [], "format": 44, "location": 3 },
          { "name": "a_dir_life", "defines": [], "format": 44, "location": 4 },
          { "name": "a_rndSeed", "defines": [], "format": 11, "location": 5 },
          { "name": "a_texCoord", "defines": ["CC_RENDER_MODE"], "format": 32, "location": 6 },
          { "name": "a_texCoord3", "defines": ["CC_RENDER_MODE"], "format": 32, "location": 7 },
          { "name": "a_normal", "defines": ["CC_RENDER_MODE"], "format": 32, "location": 8 },
          { "name": "a_color1", "defines": ["CC_RENDER_MODE"], "format": 44, "location": 9 }
        ],
        "blocks": [
          {"name": "Constants", "defines": [], "binding": 0, "stageFlags": 1, "members": [
            { "name": "mainTiling_Offset", "type": 16, "count": 1 },
            { "name": "frameTile_velLenScale", "type": 16, "count": 1 },
            { "name": "scale", "type": 16, "count": 1 },
            { "name": "nodeRotation", "type": 16, "count": 1 }
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
        "samplerTextures": [
          { "name": "color_over_time_tex0", "type": 28, "count": 1, "defines": ["COLOR_OVER_TIME_MODULE_ENABLE"], "stageFlags": 1, "binding": 10 },
          { "name": "rotation_over_time_tex0", "type": 28, "count": 1, "defines": ["ROTATION_OVER_TIME_MODULE_ENABLE"], "stageFlags": 1, "binding": 11 },
          { "name": "size_over_time_tex0", "type": 28, "count": 1, "defines": ["SIZE_OVER_TIME_MODULE_ENABLE"], "stageFlags": 1, "binding": 12 },
          { "name": "force_over_time_tex0", "type": 28, "count": 1, "defines": ["FORCE_OVER_TIME_MODULE_ENABLE"], "stageFlags": 1, "binding": 13 },
          { "name": "velocity_over_time_tex0", "type": 28, "count": 1, "defines": ["VELOCITY_OVER_TIME_MODULE_ENABLE"], "stageFlags": 1, "binding": 14 },
          { "name": "texture_animation_tex0", "type": 28, "count": 1, "defines": ["TEXTURE_ANIMATION_MODULE_ENABLE"], "stageFlags": 1, "binding": 15 },
          { "name": "mainTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 16 }
        ],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
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
        "hash": 2502358098,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 53, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 40 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "CC_RENDER_MODE", "type": "number", "range": [0, 4] },
          { "name": "CC_DRAW_WIRE_FRAME", "type": "boolean" },
          { "name": "CC_USE_WORLD_SPACE", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_texCoord", "defines": [], "format": 44, "location": 1 },
          { "name": "a_texCoord1", "defines": [], "format": 32, "location": 2 },
          { "name": "a_texCoord2", "defines": [], "format": 32, "location": 3 },
          { "name": "a_color", "defines": [], "format": 44, "location": 4 }
        ],
        "blocks": [
          {"name": "Constants", "defines": [], "binding": 0, "stageFlags": 1, "members": [
            { "name": "mainTiling_Offset", "type": 16, "count": 1 },
            { "name": "frameTile_velLenScale", "type": 16, "count": 1 },
            { "name": "scale", "type": 16, "count": 1 },
            { "name": "nodeRotation", "type": 16, "count": 1 }
          ]},
          {"name": "FragConstants", "defines": [], "binding": 1, "stageFlags": 16, "members": [
            { "name": "tintColor", "type": 16, "count": 1 }
          ]}
        ],
        "samplerTextures": [
          { "name": "mainTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 2 }
        ],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
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
        "hash": 585841727,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 53, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 40 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "CC_RENDER_MODE", "type": "number", "range": [0, 4] },
          { "name": "CC_USE_WORLD_SPACE", "type": "boolean" },
          { "name": "ROTATION_OVER_TIME_MODULE_ENABLE", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_texCoord", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord1", "defines": [], "format": 32, "location": 2 },
          { "name": "a_texCoord2", "defines": [], "format": 32, "location": 3 },
          { "name": "a_color", "defines": [], "format": 44, "location": 4 },
          { "name": "a_color1", "defines": ["CC_RENDER_MODE"], "format": 32, "location": 8 },
          { "name": "a_texCoord3", "defines": ["CC_RENDER_MODE"], "format": 32, "location": 6 },
          { "name": "a_normal", "defines": ["CC_RENDER_MODE"], "format": 32, "location": 7 }
        ],
        "blocks": [
          {"name": "Constants", "defines": [], "binding": 0, "stageFlags": 1, "members": [
            { "name": "mainTiling_Offset", "type": 16, "count": 1 },
            { "name": "frameTile_velLenScale", "type": 16, "count": 1 },
            { "name": "scale", "type": 16, "count": 1 },
            { "name": "nodeRotation", "type": 16, "count": 1 }
          ]},
          {"name": "FragConstants", "defines": [], "binding": 1, "stageFlags": 16, "members": [
            { "name": "tintColor", "type": 16, "count": 1 }
          ]}
        ],
        "samplerTextures": [
          { "name": "mainTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 2 }
        ],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
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
        "hash": 2499219289,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 49, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 1 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": ["USE_LOCAL"] }], "samplerTextures": [{ "name": "cc_spriteTexture", "defines": [] }], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_LOCAL", "type": "boolean" },
          { "name": "TWO_COLORED", "type": "boolean" },
          { "name": "USE_ALPHA_TEST", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 1 },
          { "name": "a_color", "defines": [], "format": 44, "location": 2 },
          { "name": "a_color2", "defines": ["TWO_COLORED"], "format": 44, "location": 3 }
        ],
        "blocks": [
          {"name": "ALPHA_TEST_DATA", "defines": ["USE_ALPHA_TEST"], "binding": 0, "stageFlags": 16, "members": [
            { "name": "alphaThreshold", "type": 13, "count": 1 }
          ]}
        ],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
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
        "hash": 813679071,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 49, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 1 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": ["USE_LOCAL"] }], "samplerTextures": [{ "name": "cc_spriteTexture", "defines": ["USE_TEXTURE"] }], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_LOCAL", "type": "boolean" },
          { "name": "SAMPLE_FROM_RT", "type": "boolean" },
          { "name": "USE_PIXEL_ALIGNMENT", "type": "boolean" },
          { "name": "CC_USE_EMBEDDED_ALPHA", "type": "boolean" },
          { "name": "USE_ALPHA_TEST", "type": "boolean" },
          { "name": "USE_TEXTURE", "type": "boolean" },
          { "name": "IS_GRAY", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 1 },
          { "name": "a_color", "defines": [], "format": 44, "location": 2 }
        ],
        "blocks": [
          {"name": "ALPHA_TEST_DATA", "defines": ["USE_ALPHA_TEST"], "binding": 0, "stageFlags": 16, "members": [
            { "name": "alphaThreshold", "type": 13, "count": 1 }
          ]}
        ],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      }
    ]
  },
  {
    "name": "standard",
    "techniques": [
      { "name": "opaque", "passes": [{ "program": "standard|standard-vs|standard-fs", "properties": { "tilingOffset": { "value": [1, 1, 0, 0], "type": 16 }, "mainColor": { "value": [1, 1, 1, 1], "linear": true, "type": 16, "handleInfo": ["albedo", 0, 16] }, "albedoScale": { "value": [1, 1, 1], "type": 15, "handleInfo": ["albedoScaleAndCutoff", 0, 15] }, "alphaThreshold": { "value": [0.5], "type": 13, "handleInfo": ["albedoScaleAndCutoff", 3, 13] }, "occlusion": { "value": [1], "type": 13, "handleInfo": ["pbrParams", 0, 13] }, "roughness": { "value": [0.8], "type": 13, "handleInfo": ["pbrParams", 1, 13] }, "metallic": { "value": [0.6], "type": 13, "handleInfo": ["pbrParams", 2, 13] }, "SpecularIntensity": { "value": [0.5], "type": 13, "handleInfo": ["pbrParams", 3, 13] }, "emissive": { "value": [0, 0, 0, 1], "linear": true, "type": 16 }, "emissiveScale": { "value": [1, 1, 1], "type": 15, "handleInfo": ["emissiveScaleParam", 0, 15] }, "normalStrenth": { "value": [1], "type": 13, "handleInfo": ["emissiveScaleParam", 3, 13] }, "mainTexture": { "value": "grey", "type": 28, "handleInfo": ["albedoMap", 0, 28] }, "normalMap": { "value": "normal", "type": 28 }, "pbrMap": { "value": "grey", "type": 28 }, "metallicRoughnessMap": { "value": "grey", "type": 28 }, "occlusionMap": { "value": "white", "type": 28 }, "emissiveMap": { "value": "grey", "type": 28 }, "albedo": { "type": 16, "value": [1, 1, 1, 1] }, "albedoScaleAndCutoff": { "type": 16, "value": [1, 1, 1, 0.5] }, "pbrParams": { "type": 16, "value": [1, 0.8, 0.6, 0.5] }, "emissiveScaleParam": { "type": 16, "value": [1, 1, 1, 1] }, "albedoMap": { "type": 28, "value": "grey" } } }, { "phase": "forward-add", "propertyIndex": 0, "embeddedMacros": { "CC_FORWARD_ADD": true }, "blendState": { "targets": [{ "blend": true, "blendSrc": 1, "blendDst": 1, "blendSrcAlpha": 0, "blendDstAlpha": 1 }] }, "program": "standard|standard-vs|standard-fs", "depthStencilState": { "depthFunc": 2, "depthTest": true, "depthWrite": false } }, { "phase": "shadow-caster", "propertyIndex": 0, "rasterizerState": { "cullMode": 1 }, "program": "standard|shadow-caster-vs:vert|shadow-caster-fs:frag", "properties": { "tilingOffset": { "value": [1, 1, 0, 0], "type": 16 }, "mainColor": { "value": [1, 1, 1, 1], "type": 16, "handleInfo": ["albedo", 0, 16] }, "albedoScale": { "value": [1, 1, 1], "type": 15, "handleInfo": ["albedoScaleAndCutoff", 0, 15] }, "alphaThreshold": { "value": [0.5], "type": 13, "handleInfo": ["albedoScaleAndCutoff", 3, 13] }, "mainTexture": { "value": "grey", "type": 28, "handleInfo": ["albedoMap", 0, 28] }, "albedo": { "type": 16, "value": [1, 1, 1, 1] }, "albedoScaleAndCutoff": { "type": 16, "value": [1, 1, 1, 0.5] }, "albedoMap": { "type": 28, "value": "grey" } } }] }
    ],
    "shaders": [
      {
        "name": "standard|standard-vs|standard-fs",
        "hash": 2358998302,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 223, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 75 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }, { "name": "CCShadow", "defines": [] }], "samplerTextures": [{ "name": "cc_shadowMap", "defines": ["CC_RECEIVE_SHADOW"] }, { "name": "cc_spotLightingMap", "defines": ["CC_RECEIVE_SHADOW"] }, { "name": "cc_environment", "defines": ["CC_USE_IBL"] }, { "name": "cc_diffuseMap", "defines": ["CC_USE_DIFFUSEMAP"] }], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCMorph", "defines": ["CC_USE_MORPH"] }, { "name": "CCSkinningTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinningAnimation", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinning", "defines": ["CC_USE_SKINNING", "!CC_USE_BAKED_ANIMATION"] }, { "name": "CCLocalBatched", "defines": ["!USE_INSTANCING", "USE_BATCHING"] }, { "name": "CCLocal", "defines": ["!USE_INSTANCING", "!USE_BATCHING"] }, { "name": "CCForwardLight", "defines": ["CC_FORWARD_ADD", "CC_ENABLE_CLUSTERED_LIGHT_CULLING"] }], "samplerTextures": [{ "name": "cc_PositionDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_POSITION"] }, { "name": "cc_NormalDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_NORMAL"] }, { "name": "cc_TangentDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_TANGENT"] }, { "name": "cc_jointTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "cc_lightingMap", "defines": ["USE_LIGHTMAP", "!USE_BATCHING", "!CC_FORWARD_ADD"] }], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_PLATFORM_NX", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_COUNT", "type": "number", "range": [2, 8] },
          { "name": "CC_MORPH_PRECOMPUTED", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_POSITION", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_NORMAL", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_TANGENT", "type": "boolean" },
          { "name": "CC_USE_BAKED_ANIMATION", "type": "boolean" },
          { "name": "CC_USE_FOG", "type": "number", "range": [0, 4] },
          { "name": "CC_USE_ACCURATE_FOG", "type": "boolean" },
          { "name": "USE_VERTEX_COLOR", "type": "boolean" },
          { "name": "USE_NORMAL_MAP", "type": "boolean" },
          { "name": "HAS_SECOND_UV", "type": "boolean" },
          { "name": "CC_FORWARD_ADD", "type": "boolean" },
          { "name": "USE_TWOSIDE", "type": "boolean" },
          { "name": "SAMPLE_FROM_RT", "type": "boolean" },
          { "name": "CC_USE_IBL", "type": "number", "range": [0, 2] },
          { "name": "CC_USE_DIFFUSEMAP", "type": "number", "range": [0, 2] },
          { "name": "USE_REFLECTION_DENOISE", "type": "boolean" },
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
          { "name": "ALPHA_TEST_CHANNEL", "type": "string", "options": ["a", "r"] },
          { "name": "CC_PIPELINE_TYPE", "type": "number", "range": [0, 1] },
          { "name": "CC_FORCE_FORWARD_SHADING", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 2 },
          { "name": "a_tangent", "defines": [], "format": 44, "location": 3 },
          { "name": "a_matWorld0", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 6 },
          { "name": "a_matWorld1", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld2", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_lightingMapUVParam", "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_localShadowBias", "defines": ["USE_INSTANCING", "CC_RECEIVE_SHADOW"], "format": 21, "isInstanced": true, "location": 10 },
          { "name": "a_dyn_batch_id", "defines": ["!USE_INSTANCING", "USE_BATCHING"], "format": 11, "location": 11 },
          { "name": "a_vertexId", "defines": ["CC_USE_MORPH"], "format": 11, "location": 12 },
          { "name": "a_joints", "defines": ["CC_USE_SKINNING", "!CC_PLATFORM_NX"], "location": 4 },
          { "name": "a_weights", "defines": ["CC_USE_SKINNING"], "format": 44, "location": 5 },
          { "name": "a_jointAnimInfo", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION", "USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 13 },
          { "name": "a_color", "defines": ["USE_VERTEX_COLOR"], "format": 44, "location": 14 },
          { "name": "a_texCoord1", "defines": [], "format": 21, "location": 15 }
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
        "samplerTextures": [
          { "name": "albedoMap", "type": 28, "count": 1, "defines": ["USE_ALBEDO_MAP"], "stageFlags": 16, "binding": 1 },
          { "name": "normalMap", "type": 28, "count": 1, "defines": ["USE_NORMAL_MAP"], "stageFlags": 16, "binding": 2 },
          { "name": "pbrMap", "type": 28, "count": 1, "defines": ["USE_PBR_MAP"], "stageFlags": 16, "binding": 3 },
          { "name": "metallicRoughnessMap", "type": 28, "count": 1, "defines": ["USE_METALLIC_ROUGHNESS_MAP"], "stageFlags": 16, "binding": 4 },
          { "name": "occlusionMap", "type": 28, "count": 1, "defines": ["USE_OCCLUSION_MAP"], "stageFlags": 16, "binding": 5 },
          { "name": "emissiveMap", "type": 28, "count": 1, "defines": ["USE_EMISSIVE_MAP"], "stageFlags": 16, "binding": 6 }
        ],
        "buffers": [
          { "name": "b_ccLightsBuffer", "memoryAccess": 1, "defines": ["CC_FORWARD_ADD", "CC_ENABLE_CLUSTERED_LIGHT_CULLING"], "stageFlags": 16, "binding": 7 },
          { "name": "b_clusterLightIndicesBuffer", "memoryAccess": 1, "defines": ["CC_FORWARD_ADD", "CC_ENABLE_CLUSTERED_LIGHT_CULLING"], "stageFlags": 16, "binding": 8 },
          { "name": "b_clusterLightGridBuffer", "memoryAccess": 1, "defines": ["CC_FORWARD_ADD", "CC_ENABLE_CLUSTERED_LIGHT_CULLING"], "stageFlags": 16, "binding": 9 }
        ],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      },
      {
        "name": "standard|shadow-caster-vs:vert|shadow-caster-fs:frag",
        "hash": 3059264880,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 184, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 75 },
          "globals": { "blocks": [{ "name": "CCShadow", "defines": [] }, { "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [{ "name": "cc_shadowMap", "defines": ["CC_RECEIVE_SHADOW"] }, { "name": "cc_spotLightingMap", "defines": ["CC_RECEIVE_SHADOW"] }], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCMorph", "defines": ["CC_USE_MORPH"] }, { "name": "CCSkinningTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinningAnimation", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinning", "defines": ["CC_USE_SKINNING", "!CC_USE_BAKED_ANIMATION"] }, { "name": "CCLocalBatched", "defines": ["!USE_INSTANCING", "USE_BATCHING"] }, { "name": "CCLocal", "defines": ["!USE_INSTANCING", "!USE_BATCHING"] }], "samplerTextures": [{ "name": "cc_PositionDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_POSITION"] }, { "name": "cc_NormalDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_NORMAL"] }, { "name": "cc_TangentDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_TANGENT"] }, { "name": "cc_jointTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_PLATFORM_NX", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_COUNT", "type": "number", "range": [2, 8] },
          { "name": "CC_MORPH_PRECOMPUTED", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_POSITION", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_NORMAL", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_TANGENT", "type": "boolean" },
          { "name": "CC_USE_BAKED_ANIMATION", "type": "boolean" },
          { "name": "HAS_SECOND_UV", "type": "boolean" },
          { "name": "USE_ALBEDO_MAP", "type": "boolean" },
          { "name": "ALBEDO_UV", "type": "string", "options": ["v_uv", "v_uv1"] },
          { "name": "USE_ALPHA_TEST", "type": "boolean" },
          { "name": "ALPHA_TEST_CHANNEL", "type": "string", "options": ["a", "r"] }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 2 },
          { "name": "a_tangent", "defines": [], "format": 44, "location": 3 },
          { "name": "a_matWorld0", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 6 },
          { "name": "a_matWorld1", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld2", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_lightingMapUVParam", "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_localShadowBias", "defines": ["USE_INSTANCING", "CC_RECEIVE_SHADOW"], "format": 21, "isInstanced": true, "location": 10 },
          { "name": "a_dyn_batch_id", "defines": ["!USE_INSTANCING", "USE_BATCHING"], "format": 11, "location": 11 },
          { "name": "a_vertexId", "defines": ["CC_USE_MORPH"], "format": 11, "location": 12 },
          { "name": "a_joints", "defines": ["CC_USE_SKINNING", "!CC_PLATFORM_NX"], "location": 4 },
          { "name": "a_weights", "defines": ["CC_USE_SKINNING"], "format": 44, "location": 5 },
          { "name": "a_jointAnimInfo", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION", "USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 13 },
          { "name": "a_texCoord1", "defines": [], "format": 21, "location": 14 }
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
        "samplerTextures": [
          { "name": "albedoMap", "type": 28, "count": 1, "defines": ["USE_ALBEDO_MAP"], "stageFlags": 16, "binding": 1 }
        ],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      }
    ]
  },
  {
    "name": "terrain",
    "techniques": [
      { "name": "opaque", "passes": [{ "program": "terrain|terrain-vs|terrain-fs", "properties": { "UVScale": { "value": [1, 1, 1, 1], "type": 16 }, "lightMapUVParam": { "value": [0, 0, 0, 0], "type": 16 }, "metallic": { "value": [0, 0, 0, 0], "type": 16 }, "roughness": { "value": [1, 1, 1, 1], "type": 16 }, "weightMap": { "value": "black", "type": 28 }, "detailMap0": { "value": "grey", "type": 28 }, "detailMap1": { "value": "grey", "type": 28 }, "detailMap2": { "value": "grey", "type": 28 }, "detailMap3": { "value": "grey", "type": 28 }, "normalMap0": { "value": "normal", "type": 28 }, "normalMap1": { "value": "normal", "type": 28 }, "normalMap2": { "value": "normal", "type": 28 }, "normalMap3": { "value": "normal", "type": 28 }, "lightMap": { "value": "grey", "type": 28 } } }, { "phase": "forward-add", "propertyIndex": 0, "embeddedMacros": { "CC_FORWARD_ADD": true }, "blendState": { "targets": [{ "blend": true, "blendSrc": 1, "blendDst": 1, "blendSrcAlpha": 0, "blendDstAlpha": 1 }] }, "program": "terrain|terrain-vs|terrain-fs", "depthStencilState": { "depthFunc": 2, "depthTest": true, "depthWrite": false }, "properties": { "UVScale": { "value": [1, 1, 1, 1], "type": 16 }, "lightMapUVParam": { "value": [0, 0, 0, 0], "type": 16 }, "metallic": { "value": [0, 0, 0, 0], "type": 16 }, "roughness": { "value": [1, 1, 1, 1], "type": 16 }, "weightMap": { "value": "black", "type": 28 }, "detailMap0": { "value": "grey", "type": 28 }, "detailMap1": { "value": "grey", "type": 28 }, "detailMap2": { "value": "grey", "type": 28 }, "detailMap3": { "value": "grey", "type": 28 }, "normalMap0": { "value": "normal", "type": 28 }, "normalMap1": { "value": "normal", "type": 28 }, "normalMap2": { "value": "normal", "type": 28 }, "normalMap3": { "value": "normal", "type": 28 }, "lightMap": { "value": "grey", "type": 28 } } }, { "phase": "shadow-add", "propertyIndex": 0, "rasterizerState": { "cullMode": 2 }, "program": "terrain|shadow-caster-vs:vert|shadow-caster-fs:frag" }] }
    ],
    "shaders": [
      {
        "name": "terrain|terrain-vs|terrain-fs",
        "hash": 38922979,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 71, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 71 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }, { "name": "CCShadow", "defines": [] }], "samplerTextures": [{ "name": "cc_shadowMap", "defines": ["CC_RECEIVE_SHADOW"] }, { "name": "cc_spotLightingMap", "defines": ["CC_RECEIVE_SHADOW"] }, { "name": "cc_environment", "defines": ["CC_USE_IBL"] }, { "name": "cc_diffuseMap", "defines": ["CC_USE_DIFFUSEMAP"] }], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }, { "name": "CCForwardLight", "defines": ["CC_FORWARD_ADD", "CC_ENABLE_CLUSTERED_LIGHT_CULLING"] }], "samplerTextures": [{ "name": "cc_lightingMap", "defines": ["USE_LIGHTMAP", "!USE_BATCHING", "!CC_FORWARD_ADD"] }], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "CC_USE_FOG", "type": "number", "range": [0, 4] },
          { "name": "CC_USE_ACCURATE_FOG", "type": "boolean" },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "USE_NORMALMAP", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_USE_IBL", "type": "number", "range": [0, 2] },
          { "name": "CC_USE_DIFFUSEMAP", "type": "number", "range": [0, 2] },
          { "name": "USE_REFLECTION_DENOISE", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "CC_FORWARD_ADD", "type": "boolean" },
          { "name": "CC_USE_HDR", "type": "boolean" },
          { "name": "LAYERS", "type": "number", "range": [0, 4] },
          { "name": "USE_PBR", "type": "boolean" },
          { "name": "CC_PIPELINE_TYPE", "type": "number", "range": [0, 1] },
          { "name": "CC_FORCE_FORWARD_SHADING", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 2 }
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
        "samplerTextures": [
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
        "buffers": [
          { "name": "b_ccLightsBuffer", "memoryAccess": 1, "defines": ["CC_FORWARD_ADD", "CC_ENABLE_CLUSTERED_LIGHT_CULLING"], "stageFlags": 16, "binding": 12 },
          { "name": "b_clusterLightIndicesBuffer", "memoryAccess": 1, "defines": ["CC_FORWARD_ADD", "CC_ENABLE_CLUSTERED_LIGHT_CULLING"], "stageFlags": 16, "binding": 13 },
          { "name": "b_clusterLightGridBuffer", "memoryAccess": 1, "defines": ["CC_FORWARD_ADD", "CC_ENABLE_CLUSTERED_LIGHT_CULLING"], "stageFlags": 16, "binding": 14 }
        ],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      },
      {
        "name": "terrain|shadow-caster-vs:vert|shadow-caster-fs:frag",
        "hash": 2218105608,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 69, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 0 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }, { "name": "CCShadow", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 2 }
        ],
        "blocks": [],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      }
    ]
  },
  {
    "name": "unlit",
    "techniques": [
      { "name": "opaque", "passes": [{ "program": "unlit|unlit-vs:vert|unlit-fs:frag", "properties": { "mainTexture": { "value": "grey", "type": 28 }, "tilingOffset": { "value": [1, 1, 0, 0], "type": 16 }, "mainColor": { "value": [1, 1, 1, 1], "linear": true, "type": 16 }, "colorScale": { "value": [1, 1, 1], "type": 15, "handleInfo": ["colorScaleAndCutoff", 0, 15] }, "alphaThreshold": { "value": [0.5], "type": 13, "handleInfo": ["colorScaleAndCutoff", 3, 13] }, "color": { "linear": true, "type": 16, "handleInfo": ["mainColor", 0, 16] }, "colorScaleAndCutoff": { "type": 16, "value": [1, 1, 1, 0.5] } } }] }
    ],
    "shaders": [
      {
        "name": "unlit|unlit-vs:vert|unlit-fs:frag",
        "hash": 267820933,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 198, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 41 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCMorph", "defines": ["CC_USE_MORPH"] }, { "name": "CCSkinningTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinningAnimation", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinning", "defines": ["CC_USE_SKINNING", "!CC_USE_BAKED_ANIMATION"] }, { "name": "CCLocalBatched", "defines": ["!USE_INSTANCING", "USE_BATCHING"] }, { "name": "CCLocal", "defines": ["!USE_INSTANCING", "!USE_BATCHING"] }], "samplerTextures": [{ "name": "cc_PositionDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_POSITION"] }, { "name": "cc_NormalDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_NORMAL"] }, { "name": "cc_TangentDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_TANGENT"] }, { "name": "cc_jointTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_PLATFORM_NX", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_COUNT", "type": "number", "range": [2, 8] },
          { "name": "CC_MORPH_PRECOMPUTED", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_POSITION", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_NORMAL", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_TANGENT", "type": "boolean" },
          { "name": "CC_USE_BAKED_ANIMATION", "type": "boolean" },
          { "name": "CC_USE_FOG", "type": "number", "range": [0, 4] },
          { "name": "CC_USE_ACCURATE_FOG", "type": "boolean" },
          { "name": "USE_VERTEX_COLOR", "type": "boolean" },
          { "name": "USE_TEXTURE", "type": "boolean" },
          { "name": "SAMPLE_FROM_RT", "type": "boolean" },
          { "name": "CC_USE_HDR", "type": "boolean" },
          { "name": "USE_ALPHA_TEST", "type": "boolean" },
          { "name": "ALPHA_TEST_CHANNEL", "type": "string", "options": ["a", "r", "g", "b"] }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 2 },
          { "name": "a_tangent", "defines": [], "format": 44, "location": 3 },
          { "name": "a_matWorld0", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 6 },
          { "name": "a_matWorld1", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld2", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_lightingMapUVParam", "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_localShadowBias", "defines": ["USE_INSTANCING", "CC_RECEIVE_SHADOW"], "format": 21, "isInstanced": true, "location": 10 },
          { "name": "a_dyn_batch_id", "defines": ["!USE_INSTANCING", "USE_BATCHING"], "format": 11, "location": 11 },
          { "name": "a_vertexId", "defines": ["CC_USE_MORPH"], "format": 11, "location": 12 },
          { "name": "a_joints", "defines": ["CC_USE_SKINNING", "!CC_PLATFORM_NX"], "location": 4 },
          { "name": "a_weights", "defines": ["CC_USE_SKINNING"], "format": 44, "location": 5 },
          { "name": "a_jointAnimInfo", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION", "USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 13 },
          { "name": "a_color", "defines": ["USE_VERTEX_COLOR"], "format": 44, "location": 14 }
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
        "samplerTextures": [
          { "name": "mainTexture", "type": 28, "count": 1, "defines": ["USE_TEXTURE"], "stageFlags": 16, "binding": 2 }
        ],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      }
    ]
  },
  {
    "name": "bloom",
    "techniques": [
      { "passes": [{ "phase": "bloom-prefilter", "program": "bloom|bloom-vs|prefilter-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }, { "phase": "bloom-downsample", "program": "bloom|bloom-vs|downsample-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }, { "phase": "bloom-downsample", "program": "bloom|bloom-vs|downsample-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }, { "phase": "bloom-downsample", "program": "bloom|bloom-vs|downsample-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }, { "phase": "bloom-downsample", "program": "bloom|bloom-vs|downsample-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }, { "phase": "bloom-downsample", "program": "bloom|bloom-vs|downsample-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }, { "phase": "bloom-downsample", "program": "bloom|bloom-vs|downsample-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }, { "phase": "bloom-upsample", "program": "bloom|bloom-vs|upsample-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }, { "phase": "bloom-upsample", "program": "bloom|bloom-vs|upsample-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }, { "phase": "bloom-upsample", "program": "bloom|bloom-vs|upsample-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }, { "phase": "bloom-upsample", "program": "bloom|bloom-vs|upsample-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }, { "phase": "bloom-upsample", "program": "bloom|bloom-vs|upsample-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }, { "phase": "bloom-upsample", "program": "bloom|bloom-vs|upsample-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }, { "phase": "bloom-combine", "program": "bloom|bloom-vs|combine-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }] }
    ],
    "shaders": [
      {
        "name": "bloom|bloom-vs|prefilter-fs",
        "hash": 4024722102,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 147, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 40 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCMorph", "defines": ["CC_USE_MORPH"] }, { "name": "CCSkinningTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinningAnimation", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinning", "defines": ["CC_USE_SKINNING", "!CC_USE_BAKED_ANIMATION"] }], "samplerTextures": [{ "name": "cc_PositionDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_POSITION"] }, { "name": "cc_NormalDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_NORMAL"] }, { "name": "cc_TangentDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_TANGENT"] }, { "name": "cc_jointTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_PLATFORM_NX", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_COUNT", "type": "number", "range": [2, 8] },
          { "name": "CC_MORPH_PRECOMPUTED", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_POSITION", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_NORMAL", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_TANGENT", "type": "boolean" },
          { "name": "CC_USE_BAKED_ANIMATION", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 2 },
          { "name": "a_tangent", "defines": [], "format": 44, "location": 3 },
          { "name": "a_matWorld0", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 6 },
          { "name": "a_matWorld1", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld2", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_lightingMapUVParam", "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_localShadowBias", "defines": ["USE_INSTANCING", "CC_RECEIVE_SHADOW"], "format": 21, "isInstanced": true, "location": 10 },
          { "name": "a_dyn_batch_id", "defines": ["!USE_INSTANCING", "USE_BATCHING"], "format": 11, "location": 11 },
          { "name": "a_vertexId", "defines": ["CC_USE_MORPH"], "format": 11, "location": 12 },
          { "name": "a_joints", "defines": ["CC_USE_SKINNING", "!CC_PLATFORM_NX"], "location": 4 },
          { "name": "a_weights", "defines": ["CC_USE_SKINNING"], "format": 44, "location": 5 },
          { "name": "a_jointAnimInfo", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION", "USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 13 }
        ],
        "blocks": [
          {"name": "BloomUBO", "defines": [], "binding": 0, "stageFlags": 16, "members": [
            { "name": "texSize", "type": 16, "count": 1 }
          ]}
        ],
        "samplerTextures": [
          { "name": "outputResultMap", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 1 }
        ],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      },
      {
        "name": "bloom|bloom-vs|downsample-fs",
        "hash": 2813518838,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 147, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 40 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCMorph", "defines": ["CC_USE_MORPH"] }, { "name": "CCSkinningTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinningAnimation", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinning", "defines": ["CC_USE_SKINNING", "!CC_USE_BAKED_ANIMATION"] }], "samplerTextures": [{ "name": "cc_PositionDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_POSITION"] }, { "name": "cc_NormalDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_NORMAL"] }, { "name": "cc_TangentDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_TANGENT"] }, { "name": "cc_jointTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_PLATFORM_NX", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_COUNT", "type": "number", "range": [2, 8] },
          { "name": "CC_MORPH_PRECOMPUTED", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_POSITION", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_NORMAL", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_TANGENT", "type": "boolean" },
          { "name": "CC_USE_BAKED_ANIMATION", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 2 },
          { "name": "a_tangent", "defines": [], "format": 44, "location": 3 },
          { "name": "a_matWorld0", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 6 },
          { "name": "a_matWorld1", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld2", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_lightingMapUVParam", "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_localShadowBias", "defines": ["USE_INSTANCING", "CC_RECEIVE_SHADOW"], "format": 21, "isInstanced": true, "location": 10 },
          { "name": "a_dyn_batch_id", "defines": ["!USE_INSTANCING", "USE_BATCHING"], "format": 11, "location": 11 },
          { "name": "a_vertexId", "defines": ["CC_USE_MORPH"], "format": 11, "location": 12 },
          { "name": "a_joints", "defines": ["CC_USE_SKINNING", "!CC_PLATFORM_NX"], "location": 4 },
          { "name": "a_weights", "defines": ["CC_USE_SKINNING"], "format": 44, "location": 5 },
          { "name": "a_jointAnimInfo", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION", "USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 13 }
        ],
        "blocks": [
          {"name": "BloomUBO", "defines": [], "binding": 0, "stageFlags": 16, "members": [
            { "name": "texSize", "type": 16, "count": 1 }
          ]}
        ],
        "samplerTextures": [
          { "name": "bloomTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 1 }
        ],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      },
      {
        "name": "bloom|bloom-vs|upsample-fs",
        "hash": 3878242894,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 147, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 40 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCMorph", "defines": ["CC_USE_MORPH"] }, { "name": "CCSkinningTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinningAnimation", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinning", "defines": ["CC_USE_SKINNING", "!CC_USE_BAKED_ANIMATION"] }], "samplerTextures": [{ "name": "cc_PositionDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_POSITION"] }, { "name": "cc_NormalDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_NORMAL"] }, { "name": "cc_TangentDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_TANGENT"] }, { "name": "cc_jointTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_PLATFORM_NX", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_COUNT", "type": "number", "range": [2, 8] },
          { "name": "CC_MORPH_PRECOMPUTED", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_POSITION", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_NORMAL", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_TANGENT", "type": "boolean" },
          { "name": "CC_USE_BAKED_ANIMATION", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 2 },
          { "name": "a_tangent", "defines": [], "format": 44, "location": 3 },
          { "name": "a_matWorld0", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 6 },
          { "name": "a_matWorld1", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld2", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_lightingMapUVParam", "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_localShadowBias", "defines": ["USE_INSTANCING", "CC_RECEIVE_SHADOW"], "format": 21, "isInstanced": true, "location": 10 },
          { "name": "a_dyn_batch_id", "defines": ["!USE_INSTANCING", "USE_BATCHING"], "format": 11, "location": 11 },
          { "name": "a_vertexId", "defines": ["CC_USE_MORPH"], "format": 11, "location": 12 },
          { "name": "a_joints", "defines": ["CC_USE_SKINNING", "!CC_PLATFORM_NX"], "location": 4 },
          { "name": "a_weights", "defines": ["CC_USE_SKINNING"], "format": 44, "location": 5 },
          { "name": "a_jointAnimInfo", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION", "USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 13 }
        ],
        "blocks": [
          {"name": "BloomUBO", "defines": [], "binding": 0, "stageFlags": 16, "members": [
            { "name": "texSize", "type": 16, "count": 1 }
          ]}
        ],
        "samplerTextures": [
          { "name": "bloomTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 1 }
        ],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      },
      {
        "name": "bloom|bloom-vs|combine-fs",
        "hash": 1531599890,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 147, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 40 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCMorph", "defines": ["CC_USE_MORPH"] }, { "name": "CCSkinningTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinningAnimation", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinning", "defines": ["CC_USE_SKINNING", "!CC_USE_BAKED_ANIMATION"] }], "samplerTextures": [{ "name": "cc_PositionDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_POSITION"] }, { "name": "cc_NormalDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_NORMAL"] }, { "name": "cc_TangentDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_TANGENT"] }, { "name": "cc_jointTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_PLATFORM_NX", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_COUNT", "type": "number", "range": [2, 8] },
          { "name": "CC_MORPH_PRECOMPUTED", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_POSITION", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_NORMAL", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_TANGENT", "type": "boolean" },
          { "name": "CC_USE_BAKED_ANIMATION", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 2 },
          { "name": "a_tangent", "defines": [], "format": 44, "location": 3 },
          { "name": "a_matWorld0", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 6 },
          { "name": "a_matWorld1", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld2", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_lightingMapUVParam", "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_localShadowBias", "defines": ["USE_INSTANCING", "CC_RECEIVE_SHADOW"], "format": 21, "isInstanced": true, "location": 10 },
          { "name": "a_dyn_batch_id", "defines": ["!USE_INSTANCING", "USE_BATCHING"], "format": 11, "location": 11 },
          { "name": "a_vertexId", "defines": ["CC_USE_MORPH"], "format": 11, "location": 12 },
          { "name": "a_joints", "defines": ["CC_USE_SKINNING", "!CC_PLATFORM_NX"], "location": 4 },
          { "name": "a_weights", "defines": ["CC_USE_SKINNING"], "format": 44, "location": 5 },
          { "name": "a_jointAnimInfo", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION", "USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 13 }
        ],
        "blocks": [
          {"name": "BloomUBO", "defines": [], "binding": 0, "stageFlags": 16, "members": [
            { "name": "texSize", "type": 16, "count": 1 }
          ]}
        ],
        "samplerTextures": [
          { "name": "outputResultMap", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 1 },
          { "name": "bloomTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 2 }
        ],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      }
    ]
  },
  {
    "name": "deferred-lighting",
    "techniques": [
      { "passes": [{ "phase": "deferred-lighting", "program": "deferred-lighting|lighting-vs|lighting-fs", "depthStencilState": { "depthFunc": 4, "depthTest": true, "depthWrite": false } }] }
    ],
    "shaders": [
      {
        "name": "deferred-lighting|lighting-vs|lighting-fs",
        "hash": 3102536052,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 39, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 69 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }, { "name": "CCShadow", "defines": [] }], "samplerTextures": [{ "name": "cc_shadowMap", "defines": ["CC_RECEIVE_SHADOW"] }, { "name": "cc_spotLightingMap", "defines": ["CC_RECEIVE_SHADOW"] }, { "name": "cc_environment", "defines": ["CC_USE_IBL"] }, { "name": "cc_diffuseMap", "defines": ["CC_USE_DIFFUSEMAP"] }], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCLocal", "defines": [] }, { "name": "CCForwardLight", "defines": ["CC_ENABLE_CLUSTERED_LIGHT_CULLING"] }], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_PLATFORM_NX", "type": "boolean" },
          { "name": "CC_USE_IBL", "type": "number", "range": [0, 2] },
          { "name": "CC_USE_DIFFUSEMAP", "type": "number", "range": [0, 2] },
          { "name": "USE_REFLECTION_DENOISE", "type": "boolean" },
          { "name": "CC_FORWARD_ADD", "type": "boolean" },
          { "name": "CC_PIPELINE_TYPE", "type": "number", "range": [0, 1] },
          { "name": "CC_FORCE_FORWARD_SHADING", "type": "boolean" },
          { "name": "CC_USE_HDR", "type": "boolean" },
          { "name": "CC_USE_FOG", "type": "number", "range": [0, 4] }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 2 },
          { "name": "a_tangent", "defines": [], "format": 44, "location": 3 },
          { "name": "a_matWorld0", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 6 },
          { "name": "a_matWorld1", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld2", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_lightingMapUVParam", "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_localShadowBias", "defines": ["USE_INSTANCING", "CC_RECEIVE_SHADOW"], "format": 21, "isInstanced": true, "location": 10 },
          { "name": "a_dyn_batch_id", "defines": ["!USE_INSTANCING", "USE_BATCHING"], "format": 11, "location": 11 },
          { "name": "a_vertexId", "defines": ["CC_USE_MORPH"], "format": 11, "location": 12 },
          { "name": "a_joints", "defines": ["CC_USE_SKINNING", "!CC_PLATFORM_NX"], "location": 4 },
          { "name": "a_weights", "defines": ["CC_USE_SKINNING"], "format": 44, "location": 5 }
        ],
        "blocks": [],
        "samplerTextures": [
          { "name": "depth_stencil", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 3 }
        ],
        "buffers": [
          { "name": "b_ccLightsBuffer", "memoryAccess": 1, "defines": ["CC_ENABLE_CLUSTERED_LIGHT_CULLING"], "stageFlags": 16, "binding": 4 },
          { "name": "b_clusterLightIndicesBuffer", "memoryAccess": 1, "defines": ["CC_ENABLE_CLUSTERED_LIGHT_CULLING"], "stageFlags": 16, "binding": 5 },
          { "name": "b_clusterLightGridBuffer", "memoryAccess": 1, "defines": ["CC_ENABLE_CLUSTERED_LIGHT_CULLING"], "stageFlags": 16, "binding": 6 }
        ],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": [
          { "name": "gbuffer_albedoMap", "count": 1, "defines": ["CC_DEVICE_CAN_BENEFIT_FROM_INPUT_ATTACHMENT"], "stageFlags": 16, "binding": 0 },
          { "name": "gbuffer_normalMap", "count": 1, "defines": ["CC_DEVICE_CAN_BENEFIT_FROM_INPUT_ATTACHMENT"], "stageFlags": 16, "binding": 1 },
          { "name": "gbuffer_emissiveMap", "count": 1, "defines": ["CC_DEVICE_CAN_BENEFIT_FROM_INPUT_ATTACHMENT"], "stageFlags": 16, "binding": 2 }
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
        "hash": 2743321009,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 217, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 59 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }, { "name": "CCShadow", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCMorph", "defines": ["CC_USE_MORPH"] }, { "name": "CCSkinningTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinningAnimation", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinning", "defines": ["CC_USE_SKINNING", "!CC_USE_BAKED_ANIMATION"] }, { "name": "CCLocalBatched", "defines": ["!USE_INSTANCING", "USE_BATCHING"] }, { "name": "CCLocal", "defines": ["!USE_INSTANCING", "!USE_BATCHING"] }], "samplerTextures": [{ "name": "cc_PositionDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_POSITION"] }, { "name": "cc_NormalDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_NORMAL"] }, { "name": "cc_TangentDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_TANGENT"] }, { "name": "cc_jointTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_PLATFORM_NX", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_COUNT", "type": "number", "range": [2, 8] },
          { "name": "CC_MORPH_PRECOMPUTED", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_POSITION", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_NORMAL", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_TANGENT", "type": "boolean" },
          { "name": "CC_USE_BAKED_ANIMATION", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 2 },
          { "name": "a_tangent", "defines": [], "format": 44, "location": 3 },
          { "name": "a_matWorld0", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 6 },
          { "name": "a_matWorld1", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld2", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_lightingMapUVParam", "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_localShadowBias", "defines": ["USE_INSTANCING", "CC_RECEIVE_SHADOW"], "format": 21, "isInstanced": true, "location": 10 },
          { "name": "a_dyn_batch_id", "defines": ["!USE_INSTANCING", "USE_BATCHING"], "format": 11, "location": 11 },
          { "name": "a_vertexId", "defines": ["CC_USE_MORPH"], "format": 11, "location": 12 },
          { "name": "a_joints", "defines": ["CC_USE_SKINNING", "!CC_PLATFORM_NX"], "location": 4 },
          { "name": "a_weights", "defines": ["CC_USE_SKINNING"], "format": 44, "location": 5 },
          { "name": "a_jointAnimInfo", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION", "USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 13 }
        ],
        "blocks": [],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      }
    ]
  },
  {
    "name": "post-process",
    "techniques": [
      { "passes": [{ "phase": "post-process", "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendSrcAlpha": 2, "blendDstAlpha": 4 }] }, "program": "post-process|post-process-vs|post-process-fs", "depthStencilState": { "depthTest": false, "depthWrite": false } }] }
    ],
    "shaders": [
      {
        "name": "post-process|post-process-vs|post-process-fs",
        "hash": 166324175,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 147, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 39 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [{ "name": "CCMorph", "defines": ["CC_USE_MORPH"] }, { "name": "CCSkinningTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinningAnimation", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }, { "name": "CCSkinning", "defines": ["CC_USE_SKINNING", "!CC_USE_BAKED_ANIMATION"] }], "samplerTextures": [{ "name": "cc_PositionDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_POSITION"] }, { "name": "cc_NormalDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_NORMAL"] }, { "name": "cc_TangentDisplacements", "defines": ["CC_USE_MORPH", "CC_MORPH_TARGET_HAS_TANGENT"] }, { "name": "cc_jointTexture", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION"] }], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_PLATFORM_NX", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_COUNT", "type": "number", "range": [2, 8] },
          { "name": "CC_MORPH_PRECOMPUTED", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_POSITION", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_NORMAL", "type": "boolean" },
          { "name": "CC_MORPH_TARGET_HAS_TANGENT", "type": "boolean" },
          { "name": "CC_USE_BAKED_ANIMATION", "type": "boolean" },
          { "name": "ANTIALIAS_TYPE", "type": "number", "range": [0, 3] }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 2 },
          { "name": "a_tangent", "defines": [], "format": 44, "location": 3 },
          { "name": "a_matWorld0", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 6 },
          { "name": "a_matWorld1", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld2", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_lightingMapUVParam", "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_localShadowBias", "defines": ["USE_INSTANCING", "CC_RECEIVE_SHADOW"], "format": 21, "isInstanced": true, "location": 10 },
          { "name": "a_dyn_batch_id", "defines": ["!USE_INSTANCING", "USE_BATCHING"], "format": 11, "location": 11 },
          { "name": "a_vertexId", "defines": ["CC_USE_MORPH"], "format": 11, "location": 12 },
          { "name": "a_joints", "defines": ["CC_USE_SKINNING", "!CC_PLATFORM_NX"], "location": 4 },
          { "name": "a_weights", "defines": ["CC_USE_SKINNING"], "format": 44, "location": 5 },
          { "name": "a_jointAnimInfo", "defines": ["CC_USE_SKINNING", "CC_USE_BAKED_ANIMATION", "USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 13 }
        ],
        "blocks": [],
        "samplerTextures": [
          { "name": "outputResultMap", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 0 }
        ],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
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
        "hash": 3763602160,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 39, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 39 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [{ "name": "cc_environment", "defines": [] }], "buffers": [], "images": [] },
          "locals": { "blocks": [], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [
          { "name": "USE_INSTANCING", "type": "boolean" },
          { "name": "USE_LIGHTMAP", "type": "boolean" },
          { "name": "CC_RECEIVE_SHADOW", "type": "boolean" },
          { "name": "USE_BATCHING", "type": "boolean" },
          { "name": "CC_USE_MORPH", "type": "boolean" },
          { "name": "CC_USE_SKINNING", "type": "boolean" },
          { "name": "CC_PLATFORM_NX", "type": "boolean" },
          { "name": "CC_USE_IBL", "type": "number", "range": [0, 2] },
          { "name": "CC_USE_HDR", "type": "boolean" },
          { "name": "USE_RGBE_CUBEMAP", "type": "boolean" }
        ],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_normal", "defines": [], "format": 32, "location": 1 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 2 },
          { "name": "a_tangent", "defines": [], "format": 44, "location": 3 },
          { "name": "a_matWorld0", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 6 },
          { "name": "a_matWorld1", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 7 },
          { "name": "a_matWorld2", "defines": ["USE_INSTANCING"], "format": 44, "isInstanced": true, "location": 8 },
          { "name": "a_lightingMapUVParam", "defines": ["USE_INSTANCING", "USE_LIGHTMAP"], "format": 44, "isInstanced": true, "location": 9 },
          { "name": "a_localShadowBias", "defines": ["USE_INSTANCING", "CC_RECEIVE_SHADOW"], "format": 21, "isInstanced": true, "location": 10 },
          { "name": "a_dyn_batch_id", "defines": ["!USE_INSTANCING", "USE_BATCHING"], "format": 11, "location": 11 },
          { "name": "a_vertexId", "defines": ["CC_USE_MORPH"], "format": 11, "location": 12 },
          { "name": "a_joints", "defines": ["CC_USE_SKINNING", "!CC_PLATFORM_NX"], "location": 4 },
          { "name": "a_weights", "defines": ["CC_USE_SKINNING"], "format": 44, "location": 5 }
        ],
        "blocks": [],
        "samplerTextures": [],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      }
    ]
  },
  {
    "name": "profiler",
    "techniques": [
      { "passes": [{ "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "rasterizerState": { "cullMode": 0 }, "program": "profiler|profiler-vs:vert|profiler-fs:frag", "priority": 255, "depthStencilState": { "depthTest": false, "depthWrite": false } }] }
    ],
    "shaders": [
      {
        "name": "profiler|profiler-vs:vert|profiler-fs:frag",
        "hash": 179162168,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 60, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 39 },
          "globals": { "blocks": [{ "name": "CCGlobal", "defines": [] }, { "name": "CCCamera", "defines": [] }], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 32, "location": 0 },
          { "name": "a_color", "defines": [], "format": 44, "location": 1 }
        ],
        "blocks": [
          {"name": "Constants", "defines": [], "binding": 0, "stageFlags": 1, "members": [
            { "name": "offset", "type": 16, "count": 1 }
          ]},
          {"name": "PerFrameInfo", "defines": [], "binding": 1, "stageFlags": 1, "members": [
            { "name": "digits", "type": 16, "count": 20 }
          ]}
        ],
        "samplerTextures": [
          { "name": "mainTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 2 }
        ],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      }
    ]
  },
  {
    "name": "splash-screen",
    "techniques": [
      { "name": "default", "passes": [{ "blendState": { "targets": [{ "blend": true, "blendSrc": 2, "blendDst": 4, "blendDstAlpha": 4 }] }, "rasterizerState": { "cullMode": 0 }, "program": "splash-screen|splash-screen-vs:vert|splash-screen-fs:frag", "depthStencilState": { "depthTest": false, "depthWrite": false }, "properties": { "mainTexture": { "value": "grey", "type": 28 }, "resolution": { "value": [640, 960], "type": 14, "handleInfo": ["u_buffer0", 0, 14] }, "percent": { "value": [0.5], "type": 13, "handleInfo": ["u_percent", 0, 13] }, "scale": { "value": [200, 500], "type": 14, "handleInfo": ["u_buffer1", 0, 14] }, "translate": { "value": [320, 480], "type": 14, "handleInfo": ["u_buffer1", 2, 14] }, "u_buffer0": { "type": 16, "value": [640, 960, 0, 0] }, "u_percent": { "type": 13, "value": [0.5] }, "u_buffer1": { "type": 16, "value": [200, 500, 320, 480] } } }] }
    ],
    "shaders": [
      {
        "name": "splash-screen|splash-screen-vs:vert|splash-screen-fs:frag",
        "hash": 3189094080,
        "builtins": {
          "statistics": { "CC_EFFECT_USED_VERTEX_UNIFORM_VECTORS": 6, "CC_EFFECT_USED_FRAGMENT_UNIFORM_VECTORS": 1 },
          "globals": { "blocks": [], "samplerTextures": [], "buffers": [], "images": [] },
          "locals": { "blocks": [], "samplerTextures": [], "buffers": [], "images": [] }
        },
        "defines": [],
        "attributes": [
          { "name": "a_position", "defines": [], "format": 21, "location": 0 },
          { "name": "a_texCoord", "defines": [], "format": 21, "location": 1 }
        ],
        "blocks": [
          {"name": "Constant", "defines": [], "binding": 0, "stageFlags": 1, "members": [
            { "name": "u_buffer0", "type": 16, "count": 1 },
            { "name": "u_buffer1", "type": 16, "count": 1 },
            { "name": "u_projection", "type": 25, "count": 1 }
          ]},
          {"name": "Factor", "defines": [], "binding": 1, "stageFlags": 16, "members": [
            { "name": "u_percent", "type": 13, "count": 1 }
          ]}
        ],
        "samplerTextures": [
          { "name": "mainTexture", "type": 28, "count": 1, "defines": [], "stageFlags": 16, "binding": 2 }
        ],
        "buffers": [],
        "images": [],
        "textures": [],
        "samplers": [],
        "subpassInputs": []
      }
    ]
  }
];
