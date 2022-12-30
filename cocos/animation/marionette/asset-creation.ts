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

export { InvalidTransitionError, VariableNotDefinedError } from './errors';
export { AnimationGraph, isAnimationTransition, StateMachine, SubStateMachine, EmptyStateTransition, EmptyState } from './animation-graph';
export type { Transition, AnimationTransition, Layer, State, VariableDescription } from './animation-graph';
export { BinaryCondition, UnaryCondition, TriggerCondition } from './condition';
export type { Condition } from './condition';
export type { Value } from './variable';
export { TriggerResetMode } from './variable';
export { MotionState } from './motion-state';
export { ClipMotion } from './clip-motion';
export type { AnimationBlend } from './animation-blend';
export { AnimationBlendDirect } from './animation-blend-direct';
export { AnimationBlend1D } from './animation-blend-1d';
export { AnimationBlend2D } from './animation-blend-2d';
export { VariableType } from './parametric';
export { BindableNumber, BindableBoolean } from './parametric';
export { AnimationMask } from './animation-mask';
export { AnimationGraphVariant } from './animation-graph-variant';