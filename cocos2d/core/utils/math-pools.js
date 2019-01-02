/****************************************************************************
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

const js = require('../platform/js');
// const Vec2 = require('../value-types/vec2');
// const Vec3 = require('../value-types/vec3');
// const Quat = require('../value-types/quat');

import { mat4, quat } from '../vmath';

var mat4Pool = new js.Pool(128);
mat4Pool.get = function () {
    var matrix = this._get();
    if (matrix) {
        mat4.identity(matrix);
    }
    else {
        matrix = mat4.create();
    }
    return matrix;
};

// var vec2Pool = new js.Pool(128);
// vec2Pool.get = function () {
//     var vec2 = this._get();
//     if (vec2) {
//         vec2.x = vec2.y = 0;
//     }
//     else {
//         vec2 = new Vec2();
//     }
//     return vec2;
// };

// var vec3Pool = new js.Pool(128);
// vec3Pool.get = function () {
//     var vec3 = this._get();
//     if (vec3) {
//         vec3.x = vec3.y = vec3.z = 0;
//     }
//     else {
//         vec3 = new Vec3();
//     }
//     return vec3;
// };

var quatPool = new js.Pool(64);
quatPool.get = function () {
    var q = this._get();
    if (q) {
        q.x = q.y = q.z = 0;
        q.w = 1;
    }
    else {
        q = quat.create();
    }
    return q;
};

module.exports = {
    mat4: mat4Pool,
    // vec2: vec2Pool,
    // vec3: vec3Pool,
    quat: quatPool
};