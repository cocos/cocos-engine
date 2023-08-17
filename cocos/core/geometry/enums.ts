/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * 几何工具模块
 * @module geometry
 */

/**
 * @en
 * The enum type of basic geometry.
 * @zh
 * 形状的类型值。
 */
export default {
    SHAPE_RAY: (1 << 0),
    SHAPE_LINE: (1 << 1),
    SHAPE_SPHERE: (1 << 2),
    SHAPE_AABB: (1 << 3),
    SHAPE_OBB: (1 << 4),
    SHAPE_PLANE: (1 << 5),
    SHAPE_TRIANGLE: (1 << 6),
    SHAPE_FRUSTUM: (1 << 7),
    SHAPE_FRUSTUM_ACCURATE: (1 << 8),
    SHAPE_CAPSULE: (1 << 9),
    SHAPE_SPLINE: (1 << 10),
};
