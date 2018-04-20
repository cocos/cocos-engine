/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
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
'use strict';

const Node = require('../cocos2d/core/CCNode');
const math = require('../cocos2d/core/renderer/render-engine').math;

let _typedArray_temp = new Float32Array(16);
var _mat4_temp = math.mat4.create();

function _mat4ToArray(typedArray, mat4) {
    typedArray[0] = mat4.m00;
    typedArray[1] = mat4.m01;
    typedArray[2] = mat4.m02;
    typedArray[3] = mat4.m03;
    typedArray[4] = mat4.m04;
    typedArray[5] = mat4.m05;
    typedArray[6] = mat4.m06;
    typedArray[7] = mat4.m07;
    typedArray[8] = mat4.m08;
    typedArray[9] = mat4.m09;
    typedArray[10] = mat4.m10;
    typedArray[11] = mat4.m11;
    typedArray[12] = mat4.m12;
    typedArray[13] = mat4.m13;
    typedArray[14] = mat4.m14;
    typedArray[15] = mat4.m15;
}

Node.prototype.getWorldRTInAB = function (node) {
    node.getWorldRT(_mat4_temp);
    _mat4ToArray(_typedArray_temp, _mat4_temp);
    return _typedArray_temp;
};

Node.prototype.getWorldMatrixInAB = function (node) {
    node._updateWorldMatrix();
    _mat4ToArray(_typedArray_temp, node._worldMatrix);
    return _typedArray_temp;
};