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

import './embedded-player/embedded-player';
import './embedded-player/embedded-animation-clip-player';
import './embedded-player/embedded-particle-system-player';
import './tracks/array-track';

export * from './target-path';
export * from './value-proxy';
export { UniformProxyFactory } from './value-proxy-factories/uniform';
export { MorphWeightValueProxy, MorphWeightsValueProxy, MorphWeightsAllValueProxy } from './value-proxy-factories/morph-weights';
export * from './cubic-spline-value';
export { Track, TrackPath } from './tracks/track';
export { RealTrack } from './tracks/real-track';
export { VectorTrack } from './tracks/vector-track';
export { QuatTrack } from './tracks/quat-track';
export { ColorTrack } from './tracks/color-track';
export { SizeTrack } from './tracks/size-track';
export { ObjectTrack } from './tracks/object-track';
export * from './marionette/runtime-exports';
