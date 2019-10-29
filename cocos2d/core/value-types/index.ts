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

import Vec2 from './vec2';
import Vec3 from './vec3';
import Vec4 from './vec4';
import Mat4 from './mat4';
import Mat3 from './mat3';
import Mat23 from './mat23';
import Mat2 from './mat2';
import Rect from './rect';
import Size from './size';
import Color from './color';
import Quat from './quat';
import * as utils from './utils';

export * from './utils';

cc.vmath = {
    vec2: Vec2,
    vec3: Vec3,
    vec4: Vec4,
    mat4: Mat4,
    mat3: Mat3,
    mat23: Mat23,
    mat2: Mat2,
    rect: Rect,
    size: Size,
    color: Color,
    quat: Quat
};

for (let name in utils) {
    cc.vmath[name] = utils[name];
}
