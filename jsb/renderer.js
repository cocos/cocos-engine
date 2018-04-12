/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
 
// projection
renderer.PROJ_PERSPECTIVE = 0;
renderer.PROJ_ORTHO = 1;

// lights
renderer.LIGHT_DIRECTIONAL = 0;
renderer.LIGHT_POINT = 1;
renderer.LIGHT_SPOT = 2;

// shadows
renderer.SHADOW_NONE = 0;
renderer.SHADOW_HARD = 1;
renderer.SHADOW_SOFT = 2;

// parameter type
renderer.PARAM_INT = 0;
renderer.PARAM_INT2 = 1;
renderer.PARAM_INT3 = 2;
renderer.PARAM_INT4 = 3;
renderer.PARAM_FLOAT = 4;
renderer.PARAM_FLOAT2 = 5;
renderer.PARAM_FLOAT3 = 6;
renderer.PARAM_FLOAT4 = 7;
renderer.PARAM_COLOR3 = 8;
renderer.PARAM_COLOR4 = 9;
renderer.PARAM_MAT2 = 10;
renderer.PARAM_MAT3 = 11;
renderer.PARAM_MAT4 = 12;
renderer.PARAM_TEXTURE_2D = 13;
renderer.PARAM_TEXTURE_CUBE = 14;

// clear flags
renderer.CLEAR_COLOR = 1;
renderer.CLEAR_DEPTH = 2;
renderer.CLEAR_STENCIL = 4;

//renderer.addStage = renderer.Config.addStage;

renderer.config = {
	addStage: renderer.addStage,
	// stageIDs: renderer.stageIDs,
	stageIDs: renderer.stageIDs,
	stageID: renderer.stageID
};
renderer.Effect = require('./Effect');
renderer.Technique = require('./Technique');
renderer.Pass = require('./Pass');
renderer.Model = require('./Model');

// ForwardRenderer adapter
var _p;

_p = renderer.ForwardRenderer.prototype;
_p._ctor = function(device, builtin) {
    this.init(device, builtin.programTemplates, builtin.defaultTexture, canvas.width, canvas.height);
};

// InputAssembler adapter
_p = renderer.InputAssembler.prototype;
_p._ctor = function(vb, ib, pt = gfx.PT_TRIANGLES) {
    this.init(vb, ib, pt);
};
cc.defineGetterSetter(_p, "_vertexBuffer", _p.getVertexBuffer, _p.setVertexBuffer);
cc.defineGetterSetter(_p, "_indexBuffer", _p.getIndexBuffer, _p.setIndexBuffer);
cc.defineGetterSetter(_p, "_primitiveType", _p.getPrimitiveType, _p.setPrimitiveType);
cc.defineGetterSetter(_p, "_start", _p.getStart, _p.setStart);
cc.defineGetterSetter(_p, "_count", _p.getCount, _p.setCount);

// Scene
_p = renderer.Scene.prototype;
// _p.addModel = function(model) {
// 	var effects = model._effects;
//   var elementsOfPass = 25;
// 	for (var i = 0, len = effects.length; i < len; ++i) {
// 		var effect = effects[i];
// 		var techniques = effect._techniques;
// 		for (var j = 0, len1 = techniques.length; j < len1; ++j) {
// 			var technique = techniques[j];
//       var passesBinary = new Uint32Array(elementsOfPass * passes.length);
// 			var passes = technique.passes;
//       Uin32Array passBinary[25];
// 			for (var k =0, len2 = passes.length; k < len2; ++k) {
// 				var pass = passes[k];
//         var offset = elementsOfPass * k;
// 			// 	var passNative = new renderer.PassNative(pass._programName);
// 			// 	passNative.setCullMode(pass._cullMode);
// 			// 	passNative.setBlend(pass._blendEq,
// 			// 		                pass._blendSrc,
// 			// 		                pass._blendDst,
// 			// 		                pass._blendAlphaEq,
// 			// 		                pass._blendSrcAlpha,
// 			// 		                pass._blendDstAlpha,
// 			// 		                pass._blendColor);
// 			// 	passNative.setDepth(pass._depthTest, pass._depthWrite, pass._depthFunc);
// 			// 	passNative.setStencilFront(pass._stencilFuncFront,
// 			// 		                       pass._stencilRefFront,
// 			// 		                       pass._stencilMaskFront,
// 			// 		                       pass._stencilFailOpFront,
// 			// 		                       pass._stencilZFailOpFront,
// 			// 		                       pass._stencilZPassOpFront,
// 			// 		                       pass._stencilWriteMaskFront);
// 			// 	passNative.setStencilBack(pass._stencilFuncBack,
// 			// 		                      pass._stencilRefBack,
// 			// 		                      pass._stencilMaskBack,
// 			// 		                      pass._stencilFailOpBack,
// 			// 		                      pass._stencilZFailOpBack,
// 			// 		                      pass._stencilZPassOpBack,
// 			// 		                      pass._stencilWriteMaskBack);
// 			// 	passesNatives.push(passNative);
// 			}
// 		}

// 	}

	
// 	this.addModelNative(model);
// };
_p.removeModel = function() {}


