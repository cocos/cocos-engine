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

import * as distance from './distance';

import './deprecated';

import './geometry-native-ext';

export { default as enums } from './enums';
export { distance };
export { default as intersect } from './intersect';
export { Line } from './line';
export { Plane } from './plane';
export { Ray } from './ray';
export { Triangle } from './triangle';
export { Sphere } from './sphere';
export { AABB } from './aabb';
export { OBB } from './obb';
export { Capsule } from './capsule';
export { Frustum } from './frustum';
export { Keyframe, AnimationCurve, WrapModeMask } from './curve';
export { SplineMode, Spline } from './spline';
export * from './spec';
export * from './deprecated-3.0.0';

// engine internal exports
export { constructLegacyCurveAndConvert, OptimizedKey, evalOptCurve } from './curve';
