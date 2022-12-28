/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import './animation-graph';
import './clip-motion';
import './animation-blend-1d';
import './animation-blend-2d';
import './animation-blend-direct';
import './animation-mask';
import './animation-graph-variant';

import type { MotionStateStatus } from './animation-controller';

export type { AnimationGraphRunTime } from './animation-graph';
export type { AnimationGraphVariantRunTime } from './animation-graph-variant';
export { AnimationController } from './animation-controller';
export type { ClipStatus, TransitionStatus, MotionStateStatus } from './animation-controller';
export { VariableType } from './parametric';
export { StateMachineComponent } from './state-machine-component';
export type { Value } from './variable';
