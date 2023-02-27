/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

import { legacyCC, VERSION } from './global-exports';
import * as geometry from './geometry';
import * as math from './math';
import * as memop from './memop';
import './deprecated';
import './deprecated-3.7.0';

legacyCC.math = math;
legacyCC.geometry = geometry;

export { math, memop, geometry, VERSION };

export * from './math';
export * from './memop';
export * from './value-types';
export * from './utils';
export * from './data';
export * from './event';
export * from './platform';
export * from './scheduler';
export * from './curves';
export * from './settings';
export * from './system';
export * from './algorithm';
export { legacyCC as cclegacy } from './global-exports';
export * from './curves/bezier';

// TODO: should not include engine internal exports when module mechanism is implemented.
export * from './internal-index';
