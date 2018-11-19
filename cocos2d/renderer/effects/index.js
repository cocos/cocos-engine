export default [
  {
    name: 'gray-sprite',
    techniques: [{"stages":["transparent"],"passes":[{"program":"gray-sprite","cullMode":0,"depthTest":false,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":770,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":770,"blendDstAlpha":771}],"layer":0}],
    properties: {"texture":{"type":13,"value":null}},
  },
  {
    name: 'mesh',
    techniques: [{"stages":["transparent"],"passes":[{"program":"mesh","cullMode":0,"depthTest":true,"depthWrite":true,"blend":true,"blendEq":32774,"blendSrc":770,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":770,"blendDstAlpha":771}],"layer":0}],
    properties: {"texture":{"type":13,"value":null},"color":{"type":9,"value":[1,1,1,1]},"jointsTexture":{"type":13,"value":null},"jointsTextureSize":{"type":4,"value":0},"jointMatrices":{"type":12}},
  },
  {
    name: 'sprite',
    techniques: [{"stages":["transparent"],"passes":[{"program":"sprite","cullMode":0,"depthTest":false,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":770,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":770,"blendDstAlpha":771}],"layer":0}],
    properties: {"texture":{"type":13,"value":null},"color":{"type":9,"value":[1,1,1,1]}},
  },
];