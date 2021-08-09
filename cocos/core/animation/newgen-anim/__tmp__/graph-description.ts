export interface GraphDescription {
    vars?: Array<{
        name: string;
        value: string | boolean | number;
    }>;

    layers: Array<LayerDescription>;
}

export interface LayerDescription {
    graph: PoseSubGraphDescription;
}

export interface SubgraphNodeBaseDesc {
    name?: string;
}

export interface PoseNodeDesc extends SubgraphNodeBaseDesc {
    type: 'pose';
    motion?: MotionDescription;
}

export interface PoseSubGraphDescription extends SubgraphNodeBaseDesc {
    type: 'subgraph';

    nodes?: Array<PoseNodeDesc | PoseSubGraphDescription>;

    entryTransitions?: Array<{
        to: number;
    } & TransitionDescriptionBase>;

    exitTransitions?: Array<{
        from: number;
    } & TransitionDescriptionBase>;

    anyTransitions?: Array<{
        to: number;
    } & TransitionDescriptionBase>;

    transitions?: Array<{
        from: number;
        to: number;
    } & TransitionDescriptionBase>;
}

export interface TransitionDescriptionBase {
    condition?: {
        operator: 'BE_TRUE' | 'NOT';
        lhs: ParametricDescription<ValueDescription>;
    } | {
        operator: 'EQUAL' | 'NOT_EQUAL' | 'LESS_THAN' | 'LESS_THAN_OR_EQUAL_TO' | 'GREATER_THAN' | 'GREATER_THAN_OR_EQUAL_TO';
        lhs: ParametricDescription<ValueDescription>;
        rhs: ParametricDescription<ValueDescription>;
    };
}

export type ValueDescription = string | number | boolean;

export type MotionDescription = PoseDescription | PoseBlendDescription;

export interface PoseDescription {
    type: 'pose';
}

export interface PoseBlendDescription {
    type: 'pose-blend';
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
