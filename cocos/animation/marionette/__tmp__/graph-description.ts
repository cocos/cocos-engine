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

export interface GraphDescription {
    vars?: Array<{
        name: string;
        value: boolean | number;
    }>;

    layers: Array<LayerDescription>;
}

export interface LayerDescription {
    graph: StateMachineDescription;
}

export interface StateDesc {
    name?: string;
}

export interface MotionStateDesc extends StateDesc {
    type: 'animation';
    motion?: MotionDescription;
}

export interface StateMachineDescription extends StateDesc {
    type: 'state-machine';

    nodes?: Array<MotionStateDesc | StateMachineDescription>;

    entryTransitions?: Array<{
        to: number;
    } & TransitionDescriptionBase>;

    exitTransitions?: Array<{
        from: number;
    } & AnimationTransitionDescription>;

    anyTransitions?: Array<{
        to: number;
    } & TransitionDescriptionBase>;

    transitions?: Array<AnimationTransitionDescription>;
}

export interface AnimationTransitionDescription extends TransitionDescriptionBase {
    from: number;
    to: number;
    duration?: number;
    exitCondition?: number;
}

export interface TransitionDescriptionBase {
    conditions?: ConditionDescription[];
}

export type ConditionDescription  = {
    type: 'unary';
    operator: 'TRUTHY' | 'FALSY';
    operand: ParametricDescription<ValueDescription>;
} | {
    type: 'binary';
    operator: 'EQUAL' | 'NOT_EQUAL' | 'LESS_THAN' | 'LESS_THAN_OR_EQUAL_TO' | 'GREATER_THAN' | 'GREATER_THAN_OR_EQUAL_TO';
    lhs: ParametricDescription<ValueDescription>;
    rhs: ParametricDescription<ValueDescription>;
} | {
    type: 'trigger';
};

export type ValueDescription = string | number | boolean;

export type MotionDescription = ClipMotionDescription | AnimationBlendDescription;

export interface ClipMotionDescription {
    type: 'clip';
}

export interface AnimationBlendDescription {
    type: 'blend';
    children: MotionDescription[];
    blender: {
        type: '1d';
        thresholds: number[];
        value: ParametricDescription<number>;
    } | {
        type: '2d';
        algorithm: 'simpleDirectional' | 'freeformCartesian' | 'freeformDirectional';
        thresholds: Array<{ x: number; y: number; }>;
        values: [ParametricDescription<number>, ParametricDescription<number>];
    };
}

export type ParametricDescription<T extends string | number | boolean> = T | {
    name: string;
    value: T;
}
