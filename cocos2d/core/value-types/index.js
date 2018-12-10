/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

require('./value-type');
require('./vec2');
require('./vec3');
require('./quat');
require('./mat4');
require('./size');
require('./rect');
require('./color');

let math = cc.vmath = require('../renderer/render-engine').math;

math.mat4.fromTRSArray = function (out, trs) {
    var x = trs[4], y = trs[5], z = trs[6], w = trs[7];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
  
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = trs[8];
    var sy = trs[9];
    var sz = trs[10];
  
    out.m00 = (1 - (yy + zz)) * sx;
    out.m01 = (xy + wz) * sx;
    out.m02 = (xz - wy) * sx;
    out.m03 = 0;
    out.m04 = (xy - wz) * sy;
    out.m05 = (1 - (xx + zz)) * sy;
    out.m06 = (yz + wx) * sy;
    out.m07 = 0;
    out.m08 = (xz + wy) * sz;
    out.m09 = (yz - wx) * sz;
    out.m10 = (1 - (xx + yy)) * sz;
    out.m11 = 0;
    out.m12 = trs[1];
    out.m13 = trs[2];
    out.m14 = trs[3];
    out.m15 = 1;
  
    return out;
}