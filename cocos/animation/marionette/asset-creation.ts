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
export { AnimationGraph, isAnimationTransition, StateMachine, SubStateMachine, EmptyStateTransition, EmptyState, ProceduralPoseState, ProceduralPoseTransition } from './animation-graph';
export type { Transition, AnimationTransition, Layer, State } from './animation-graph';
export { BinaryCondition, UnaryCondition, TriggerCondition } from './state-machine/condition';
export type { Condition } from './state-machine/condition';

export { TCBinding, TCBindingValueType } from './state-machine/condition/binding/binding';
export { getTCBindingTypeInfo, TCBindingTransitionSourceFilter } from './state-machine/condition/binding/editor';
export type { TCBindingTypeInfo } from './state-machine/condition/binding/editor';

export type { Value, VariableDescription } from './variable';
export { TriggerResetMode } from './variable';
export { MotionState } from './state-machine/motion-state';
export * from './motion';
export { VariableType } from './parametric';
export { BindableNumber, BindableBoolean } from './parametric';
export { AnimationMask } from './animation-mask';
export { AnimationGraphVariant } from './animation-graph-variant';

export type { PoseGraph } from './pose-graph/pose-graph';

export * from './pose-graph/op/index'
export type { EnterNodeInfo } from './pose-graph/foundation/authoring/enter-node-info';

