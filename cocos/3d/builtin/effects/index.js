export default [
  {
    name: 'font',
    techniques: [{"stages":["ui"],"params":[{"name":"mainTexture","type":13,"value":null}],"passes":[{"program":"sprite","depthTest":true,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":1,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":1,"blendDstAlpha":771}],"layer":0}],
    properties: {},
    defines: [],
    dependencies: undefined
  },
  {
    name: 'grid',
    techniques: [{"stages":["opaque"],"params":[{"name":"tiling","type":5,"value":[1,1]},{"name":"baseColorWhite","type":8,"value":[1,1,1]},{"name":"baseColorBlack","type":8,"value":[0,0,0]},{"name":"basePattern","type":13,"value":null},{"name":"basePatternTiling","type":5,"value":[1,1]},{"name":"basePatternOffset","type":5,"value":[0,0]},{"name":"subPatternColor","type":9,"value":[1,1,1,1]},{"name":"subPattern","type":13,"value":null},{"name":"subPatternTiling","type":5,"value":[1,1]},{"name":"subPatternOffset","type":5,"value":[0,0]},{"name":"subPatternColor2","type":9,"value":[1,1,1,1]},{"name":"subPattern2","type":13,"value":null},{"name":"subPattern2Tiling","type":5,"value":[1,1]},{"name":"subPattern2Offset","type":5,"value":[0,0]}],"passes":[{"program":"grid"}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_WORLD_POS","value":false}],
    dependencies: undefined
  },
  {
    name: 'line',
    techniques: [{"stages":["opaque"],"params":[],"passes":[{"program":"line","depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [],
    dependencies: undefined
  },
  {
    name: 'matcap',
    techniques: [{"stages":["opaque"],"params":[{"name":"mainTex","type":13,"value":null},{"name":"matcapTex","type":13,"value":null},{"name":"colorFactor","type":4,"value":0.5},{"name":"color","type":9,"value":[1,1,1,1]}],"passes":[{"program":"matcap","depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_MAIN_TEX","value":false},{"name":"USE_SKINNING","value":false}],
    dependencies: undefined
  },
  {
    name: 'particle-add-multiply',
    techniques: [{"stages":["transparent"],"params":[{"name":"mainTexture","type":13,"value":null},{"name":"mainTiling","type":5,"value":[1,1]},{"name":"mainOffset","type":5,"value":[0,0]},{"name":"tintColor","type":9,"value":[0.5,0.5,0.5,0.5]},{"name":"frameTile","type":5,"value":[1,1]},{"name":"velocityScale","type":4,"value":0},{"name":"lengthScale","type":4,"value":0}],"passes":[{"program":"particle-add-multiply","cullMode":0,"depthTest":true,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":1,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":1,"blendDstAlpha":771}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_SOFT_PARTICLE","value":false},{"name":"USE_BILLBOARD","value":false},{"name":"USE_STRETCHED_BILLBOARD","value":false},{"name":"USE_HORIZONTAL_BILLBOARD","value":false},{"name":"USE_VERTICAL_BILLBOARD","value":false},{"name":"USE_WORLD_SPACE","value":false}],
    dependencies: undefined
  },
  {
    name: 'particle-add-smooth',
    techniques: [{"stages":["transparent"],"params":[{"name":"mainTexture","type":13,"value":null},{"name":"mainTiling","type":5,"value":[1,1]},{"name":"mainOffset","type":5,"value":[0,0]},{"name":"frameTile","type":5,"value":[1,1]},{"name":"velocityScale","type":4,"value":0},{"name":"lengthScale","type":4,"value":0}],"passes":[{"program":"particle-add-smooth","cullMode":0,"depthTest":true,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":1,"blendDst":769,"blendAlphaEq":32774,"blendSrcAlpha":1,"blendDstAlpha":769}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_SOFT_PARTICLE","value":false},{"name":"USE_BILLBOARD","value":false},{"name":"USE_STRETCHED_BILLBOARD","value":false},{"name":"USE_HORIZONTAL_BILLBOARD","value":false},{"name":"USE_VERTICAL_BILLBOARD","value":false},{"name":"USE_WORLD_SPACE","value":false}],
    dependencies: undefined
  },
  {
    name: 'particle-add',
    techniques: [{"stages":["transparent"],"params":[{"name":"mainTexture","type":13,"value":null},{"name":"mainTiling","type":5,"value":[1,1]},{"name":"mainOffset","type":5,"value":[0,0]},{"name":"tintColor","type":9,"value":[0.5,0.5,0.5,0.5]},{"name":"frameTile","type":5,"value":[1,1]},{"name":"velocityScale","type":4,"value":0},{"name":"lengthScale","type":4,"value":0}],"passes":[{"program":"particle-add","cullMode":0,"depthTest":true,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":770,"blendDst":1,"blendAlphaEq":32774,"blendSrcAlpha":770,"blendDstAlpha":1}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_SOFT_PARTICLE","value":false},{"name":"USE_BILLBOARD","value":false},{"name":"USE_STRETCHED_BILLBOARD","value":false},{"name":"USE_HORIZONTAL_BILLBOARD","value":false},{"name":"USE_VERTICAL_BILLBOARD","value":false},{"name":"USE_WORLD_SPACE","value":false}],
    dependencies: undefined
  },
  {
    name: 'particle-alpha-blend',
    techniques: [{"stages":["transparent"],"params":[{"name":"mainTexture","type":13,"value":null},{"name":"mainTiling","type":5,"value":[1,1]},{"name":"mainOffset","type":5,"value":[0,0]},{"name":"tintColor","type":9,"value":[0.5,0.5,0.5,0.5]},{"name":"frameTile","type":5,"value":[1,1]},{"name":"velocityScale","type":4,"value":0},{"name":"lengthScale","type":4,"value":0}],"passes":[{"program":"particle-alpha-blend","cullMode":0,"depthTest":true,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":770,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":770,"blendDstAlpha":771}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_SOFT_PARTICLE","value":false},{"name":"USE_BILLBOARD","value":false},{"name":"USE_STRETCHED_BILLBOARD","value":false},{"name":"USE_HORIZONTAL_BILLBOARD","value":false},{"name":"USE_VERTICAL_BILLBOARD","value":false},{"name":"USE_WORLD_SPACE","value":false}],
    dependencies: undefined
  },
  {
    name: 'particle-premultiply-blend',
    techniques: [{"stages":["transparent"],"params":[{"name":"mainTexture","type":13,"value":null},{"name":"mainTiling","type":5,"value":[1,1]},{"name":"mainOffset","type":5,"value":[0,0]},{"name":"frameTile","type":5,"value":[1,1]},{"name":"velocityScale","type":4,"value":0},{"name":"lengthScale","type":4,"value":0}],"passes":[{"program":"particle-premultiply-blend","cullMode":0,"depthTest":true,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":1,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":1,"blendDstAlpha":771}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_SOFT_PARTICLE","value":false},{"name":"USE_BILLBOARD","value":false},{"name":"USE_STRETCHED_BILLBOARD","value":false},{"name":"USE_HORIZONTAL_BILLBOARD","value":false},{"name":"USE_VERTICAL_BILLBOARD","value":false},{"name":"USE_WORLD_SPACE","value":false}],
    dependencies: undefined
  },
  {
    name: 'pbr-transparent',
    techniques: [{"stages":["transparent"],"params":[{"name":"albedo","type":9,"value":[1,1,1,1]},{"name":"mainTiling","type":5,"value":[1,1]},{"name":"mainOffset","type":5,"value":[0,0]},{"name":"albedo_texture","type":13,"value":null},{"name":"metallic","type":4,"value":1},{"name":"metallic_texture","type":13,"value":null},{"name":"roughness","type":4,"value":0.5},{"name":"roughness_texture","type":13,"value":null},{"name":"ao","type":4,"value":0.2},{"name":"ao_texture","type":13,"value":null},{"name":"emissive","type":8,"value":[0,0,0]},{"name":"emissive_texture","type":13,"value":null},{"name":"normal_texture","type":13,"value":null},{"name":"diffuseEnvTexture","type":14,"value":null},{"name":"specularEnvTexture","type":14,"value":null},{"name":"brdfLUT","type":13,"value":null},{"name":"maxReflectionLod","type":4,"value":9},{"name":"alphaTestThreshold","type":4,"value":0}],"passes":[{"program":"pbr","cullMode":1029,"depthTest":true,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":770,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":1,"blendDstAlpha":771}],"layer":0},{"stages":["shadowcast"],"params":[],"passes":[{"program":"shadow-depth","cullMode":1029,"blendMode":0,"depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_NORMAL_TEXTURE","value":false},{"name":"USE_ALBEDO_TEXTURE","value":false},{"name":"USE_MRA_TEXTURE","value":false},{"name":"USE_METALLIC_TEXTURE","value":false},{"name":"USE_ROUGHNESS_TEXTURE","value":false},{"name":"USE_AO_TEXTURE","value":false},{"name":"USE_EMISSIVE","value":false},{"name":"USE_EMISSIVE_TEXTURE","value":false},{"name":"USE_IBL","value":false},{"name":"USE_TEX_LOD","value":false},{"name":"USE_ALPHA_TEST","value":false},{"name":"USE_SHADOW_MAP","value":false},{"name":"USE_SKINNING","value":false},{"name":"NUM_DIR_LIGHTS","value":0},{"name":"NUM_POINT_LIGHTS","value":0},{"name":"NUM_SPOT_LIGHTS","value":0},{"name":"NUM_SHADOW_LIGHTS","value":0}],
    dependencies: [{"define":"USE_NORMAL_TEXTURE","extension":"OES_standard_derivatives"},{"define":"USE_TEX_LOD","extension":"EXT_shader_texture_lod"}]
  },
  {
    name: 'pbr',
    techniques: [{"stages":["opaque"],"params":[{"name":"albedo","type":9,"value":[1,1,1,1]},{"name":"mainTiling","type":5,"value":[1,1]},{"name":"mainOffset","type":5,"value":[0,0]},{"name":"albedo_texture","type":13,"value":null},{"name":"metallic","type":4,"value":1},{"name":"metallic_texture","type":13,"value":null},{"name":"roughness","type":4,"value":0.5},{"name":"roughness_texture","type":13,"value":null},{"name":"ao","type":4,"value":0.2},{"name":"ao_texture","type":13,"value":null},{"name":"emissive","type":8,"value":[0,0,0]},{"name":"emissive_texture","type":13,"value":null},{"name":"normal_texture","type":13,"value":null},{"name":"diffuseEnvTexture","type":14,"value":null},{"name":"specularEnvTexture","type":14,"value":null},{"name":"brdfLUT","type":13,"value":null},{"name":"maxReflectionLod","type":4,"value":9},{"name":"alphaTestThreshold","type":4,"value":0}],"passes":[{"program":"pbr","cullMode":1029,"depthTest":true,"depthWrite":true}],"layer":0},{"stages":["shadowcast"],"params":[],"passes":[{"program":"shadow-depth","cullMode":1029,"blendMode":0,"depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_NORMAL_TEXTURE","value":false},{"name":"USE_ALBEDO_TEXTURE","value":false},{"name":"USE_MRA_TEXTURE","value":false},{"name":"USE_METALLIC_TEXTURE","value":false},{"name":"USE_ROUGHNESS_TEXTURE","value":false},{"name":"USE_AO_TEXTURE","value":false},{"name":"USE_EMISSIVE","value":false},{"name":"USE_EMISSIVE_TEXTURE","value":false},{"name":"USE_IBL","value":false},{"name":"USE_TEX_LOD","value":false},{"name":"USE_ALPHA_TEST","value":false},{"name":"USE_SHADOW_MAP","value":false},{"name":"USE_SKINNING","value":false},{"name":"NUM_DIR_LIGHTS","value":0},{"name":"NUM_POINT_LIGHTS","value":0},{"name":"NUM_SPOT_LIGHTS","value":0},{"name":"NUM_SHADOW_LIGHTS","value":0},{"name":"USE_RGBE_IBL_SPECULAR","value":false},{"name":"USE_RGBE_IBL_DIFFUSE","value":false}],
    dependencies: [{"define":"USE_NORMAL_TEXTURE","extension":"OES_standard_derivatives"},{"define":"USE_TEX_LOD","extension":"EXT_shader_texture_lod"}]
  },
  {
    name: 'phong-transparent',
    techniques: [{"stages":["transparent"],"params":[{"name":"diffuseColor","type":9,"value":[0.8,0.8,0.8,1]},{"name":"mainTiling","type":5,"value":[1,1]},{"name":"mainOffset","type":5,"value":[0,0]},{"name":"diffuse_texture","type":13,"value":null},{"name":"specularColor","type":8,"value":[0,0,0]},{"name":"specular_texture","type":13,"value":null},{"name":"emissiveColor","type":8,"value":[0,0,0]},{"name":"emissive_texture","type":13,"value":null},{"name":"glossiness","type":4,"value":10},{"name":"normal_texture","type":13,"value":null},{"name":"alphaTestThreshold","type":4,"value":0}],"passes":[{"program":"phong","cullMode":1029,"depthTest":true,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":770,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":1,"blendDstAlpha":771}],"layer":0},{"stages":["shadowcast"],"params":[],"passes":[{"program":"shadow-depth","cullMode":1029,"depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_NORMAL_TEXTURE","value":false},{"name":"USE_DIFFUSE_TEXTURE","value":false},{"name":"USE_SPECULAR","value":false},{"name":"USE_SPECULAR_TEXTURE","value":false},{"name":"USE_EMISSIVE","value":false},{"name":"USE_EMISSIVE_TEXTURE","value":false},{"name":"USE_ALPHA_TEST","value":false},{"name":"USE_SKINNING","value":false},{"name":"USE_SHADOW_MAP","value":false},{"name":"NUM_DIR_LIGHTS","value":0},{"name":"NUM_POINT_LIGHTS","value":0},{"name":"NUM_SPOT_LIGHTS","value":0},{"name":"NUM_SHADOW_LIGHTS","value":0}],
    dependencies: [{"define":"USE_NORMAL_TEXTURE","extension":"OES_standard_derivatives"}]
  },
  {
    name: 'phong',
    techniques: [{"stages":["opaque"],"params":[{"name":"diffuseColor","type":9,"value":[0.8,0.8,0.8,1]},{"name":"mainTiling","type":5,"value":[1,1]},{"name":"mainOffset","type":5,"value":[0,0]},{"name":"diffuse_texture","type":13,"value":null},{"name":"specularColor","type":8,"value":[0,0,0]},{"name":"specular_texture","type":13,"value":null},{"name":"emissiveColor","type":8,"value":[0,0,0]},{"name":"emissive_texture","type":13,"value":null},{"name":"glossiness","type":4,"value":10},{"name":"normal_texture","type":13,"value":null},{"name":"alphaTestThreshold","type":4,"value":0}],"passes":[{"program":"phong","cullMode":1029,"depthTest":true,"depthWrite":true}],"layer":0},{"stages":["shadowcast"],"params":[],"passes":[{"program":"shadow-depth","cullMode":1029,"depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_NORMAL_TEXTURE","value":false},{"name":"USE_DIFFUSE_TEXTURE","value":false},{"name":"USE_SPECULAR","value":false},{"name":"USE_SPECULAR_TEXTURE","value":false},{"name":"USE_EMISSIVE","value":false},{"name":"USE_EMISSIVE_TEXTURE","value":false},{"name":"USE_ALPHA_TEST","value":false},{"name":"USE_SKINNING","value":false},{"name":"USE_SHADOW_MAP","value":false},{"name":"NUM_DIR_LIGHTS","value":0},{"name":"NUM_POINT_LIGHTS","value":0},{"name":"NUM_SPOT_LIGHTS","value":0},{"name":"NUM_SHADOW_LIGHTS","value":0}],
    dependencies: [{"define":"USE_NORMAL_TEXTURE","extension":"OES_standard_derivatives"}]
  },
  {
    name: 'simple',
    techniques: [{"stages":["opaque"],"params":[{"name":"color","type":9,"value":[0.4,0.4,0.4,1]}],"passes":[{"program":"simple","depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_TEXTURE","value":false},{"name":"USE_COLOR","value":false}],
    dependencies: undefined
  },
  {
    name: 'skybox',
    techniques: [{"stages":["opaque"],"params":[{"name":"cubeMap","type":14,"value":null}],"passes":[{"program":"skybox","cullMode":0}],"layer":-1}],
    properties: {},
    defines: [{"name":"USE_RGBE_CUBEMAP","value":false}],
    dependencies: undefined
  },
  {
    name: 'sprite',
    techniques: [{"stages":["ui"],"params":[{"name":"mainTexture","type":13,"value":null}],"passes":[{"program":"sprite","depthTest":true,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":770,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":1,"blendDstAlpha":771}],"layer":0}],
    properties: {},
    defines: [],
    dependencies: undefined
  },
  {
    name: 'unlit-transparent',
    techniques: [{"stages":["transparent"],"params":[{"name":"color","type":9,"value":[1,1,1,1]},{"name":"mainTiling","type":5,"value":[1,1]},{"name":"mainOffset","type":5,"value":[0,0]},{"name":"mainTexture","type":13,"value":null}],"passes":[{"program":"unlit","cullMode":1029,"depthTest":true,"depthWrite":true,"blend":true,"blendEq":32774,"blendSrc":770,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":1,"blendDstAlpha":771}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_TEXTURE","value":false},{"name":"USE_COLOR","value":false},{"name":"USE_SKINNING","value":false}],
    dependencies: undefined
  },
  {
    name: 'unlit',
    techniques: [{"stages":["opaque"],"params":[{"name":"color","type":9,"value":[1,1,1,1]},{"name":"mainTiling","type":5,"value":[1,1]},{"name":"mainOffset","type":5,"value":[0,0]},{"name":"mainTexture","type":13,"value":null}],"passes":[{"program":"unlit","cullMode":1029,"depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_TEXTURE","value":false},{"name":"USE_COLOR","value":false},{"name":"USE_SKINNING","value":false}],
    dependencies: undefined
  },
  {
    name: 'wireframe',
    techniques: [{"stages":["opaque"],"params":[{"name":"color","type":8,"value":[1,1,1]}],"passes":[{"program":"wireframe","depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [],
    dependencies: undefined
  },
];