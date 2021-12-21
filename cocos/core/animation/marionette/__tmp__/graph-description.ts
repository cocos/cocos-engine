export interface GraphDescription {
    vars?: Array<{
        name: string;
        value: string | boolean | number;
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
