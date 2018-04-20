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
renderer.InputAssembler = require('./input-assembler');
renderer.config = require('./config');
renderer.Effect = require('./Effect');
renderer.Technique = require('./Technique');
renderer.Pass = require('./Pass');
renderer.Model = require('./Model');

var models = [];
var sizeOfModel = 23;
// length + 500 modles(8 for each model)
var modlesData = new Float64Array(1 + 500*sizeOfModel);
var fillModelData = function() {
  if (models.length > 500)
    modlesData = new FloatArray64(1 + models.length*sizeOfModel);

  modlesData[0] = models.length;
  var index = 1;
  var model;
  var worldMatrix;
  var ia;
  for (var i = 0, len = models.length; i < len; ++i) {
    model = models[i];
    modlesData[index++] = model._dynamicIA;
    modlesData[index++] = model._viewID;
    worldMatrix = model._node.getWorldRTInAB();
    modlesData.set(worldMatrix, index);
    index += 16;

    // ia
    ia = model._inputAssemblers[0];
    modlesData[index++] = ia._vertexBuffer._nativePtr;
    modlesData[index++] = ia._indexBuffer._nativePtr;
    modlesData[index++] = ia._start;
    modlesData[index++] = ia._count;

    // effect
    modlesData[index++] = model._effects[0]._nativePtr;
  }
}

// ForwardRenderer adapter
var _p;

_p = renderer.ForwardRenderer.prototype;
_p._ctor = function(device, builtin) {
  this.init(device, builtin.programTemplates, builtin.defaultTexture, window.innerWidth, window.innerHeight);
};
_p.render = function(scene) {
  fillModelData();
  this.renderNative(scene, modlesData);

  models.length = 0;
}

// Scene 
_p = renderer.Scene.prototype;
_p.addModel = function(model) {
  models.push(model); 
}
_p.removeModel = function() {}


