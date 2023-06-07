import { AnimationClip } from "../../../../cocos/animation/animation-clip";
import { AnimationGraph, AnimationTransition, EmptyStateTransition, isAnimationTransition, ProceduralPoseState, ProceduralPoseTransition, State, StateMachine, SubStateMachine, Transition } from "../../../../cocos/animation/marionette/animation-graph";
import { PoseGraph, poseGraphOp, TCBinding, TCBindingValueType } from "../../../../cocos/animation/marionette/asset-creation";
import { Motion, ClipMotion, AnimationBlend1D, AnimationBlend2D } from "../../../../cocos/animation/marionette/motion";
import { BinaryCondition, TriggerCondition, UnaryCondition } from "../../../../cocos/animation/marionette/state-machine/condition";
import { MotionState } from "../../../../cocos/animation/marionette/state-machine/motion-state";
import { Bindable } from "../../../../cocos/animation/marionette/parametric";
import { TriggerResetMode, VariableType } from "../../../../cocos/animation/marionette/variable";
import { assertIsTrue, Vec2 } from "../../../../exports/base";
import { TCVariableBinding } from "../../../../cocos/animation/marionette/state-machine/condition/binding/variable-binding";
import { TCAuxiliaryCurveBinding } from "../../../../cocos/animation/marionette/state-machine/condition/binding/auxiliary-curve-binding";
import { TCStateWeightBinding } from "../../../../cocos/animation/marionette/state-machine/condition/binding/state-weight-binding";
import { PoseNode } from "../../../../cocos/animation/marionette/pose-graph/pose-node";
import { TCStateMotionTimeBinding } from "../../../../cocos/animation/marionette/state-machine/condition/binding/state-motion-time-binding";

export function createAnimationGraph(params: AnimationGraphParams): AnimationGraph {
    const animationGraph = new AnimationGraph();
    if (params.variableDeclarations) {
        for (const [id, variableDeclarationParams] of Object.entries(params.variableDeclarations)) {
            switch (variableDeclarationParams.type) {
                case 'float': animationGraph.addVariable(id, VariableType.FLOAT, variableDeclarationParams.value); break;
                case 'int': animationGraph.addVariable(id, VariableType.INTEGER, variableDeclarationParams.value); break;
                case 'boolean': animationGraph.addVariable(id, VariableType.BOOLEAN, variableDeclarationParams.value); break;
                case 'trigger': {
                    const triggerVar = animationGraph.addVariable(id, VariableType.TRIGGER, false);
                    assertIsTrue(triggerVar.type === VariableType.TRIGGER);
                    if (variableDeclarationParams.resetMode === 'after-consumed') {
                        triggerVar.resetMode = TriggerResetMode.AFTER_CONSUMED;
                    } else if (variableDeclarationParams.resetMode === 'next-frame-or-after-consumed') {
                        triggerVar.resetMode = TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED;
                    }
                    break;
                }
            }
        }
    }
    for (const layerParams of params.layers) {
        const layer = animationGraph.addLayer();
        if (layerParams.stashes) {
            for (const [stashId, stashParams] of Object.entries(layerParams.stashes)) {
                const stash = layer.addStash(stashId);
                fillPoseGraph(stash.graph, stashParams.graph);
            }
        }
        fillStateMachine(layer.stateMachine, layerParams.stateMachine);
        if (typeof layerParams.additive !== 'undefined') {
            layer.additive = layerParams.additive;
        }
    }
    return animationGraph;
}

export function fillStateMachine(stateMachine: StateMachine, params: StateMachineParams) {
    const states = Object.entries(params.states ?? {}).reduce((result, [stateId, stateParams]) => {
        let state: State;
        switch (stateParams.type) {
            case 'motion':
                state = stateMachine.addMotion();
                fillStateEventBindingSpecification(state as MotionState, stateParams);
                if (stateParams.motion) {
                    (state as MotionState).motion = stateParams.motion instanceof Motion ? stateParams.motion : createMotion(stateParams.motion);
                }
                break;
            case 'procedural':
                state = stateMachine.addProceduralPoseState();
                fillPoseGraph((state as ProceduralPoseState).graph, stateParams.graph);
                fillStateEventBindingSpecification(state as ProceduralPoseState, stateParams);
                break;
            case 'empty':
                state = stateMachine.addEmpty();
                break;
            case 'sub-state-machine':
                state = stateMachine.addSubStateMachine();
                fillStateMachine((state as SubStateMachine).stateMachine, stateParams.stateMachine);
                break;
        }
        state.name = stateId;
        result[stateId] = state;
        return result;
    }, {} as Record<string, State>);

    const getState = (id: string) => {
        if (!(id in states)) {
            throw new Error(`State ${id} does not exists.`);
        }
        return states[id];
    };

    params.entryTransitions?.forEach((transitionParams) => {
        const transition = stateMachine.connect(stateMachine.entryState, getState(transitionParams.to));
        fillTransition(transition, transitionParams);
    });

    params.exitTransitions?.forEach((transitionParams) => {
        const transition = stateMachine.connect(getState(transitionParams.from), stateMachine.exitState);
        fillTransition(transition, transitionParams);
    });

    params.anyTransitions?.forEach((transitionParams) => {
        const transition = stateMachine.connect(stateMachine.anyState, getState(transitionParams.to));
        fillTransition(transition, transitionParams);
    });

    params.transitions?.forEach((transitionParams) => {
        const transition = stateMachine.connect(getState(transitionParams.from), getState(transitionParams.to));
        fillTransition(transition, transitionParams);
    });
}

function fillBindable<T> (bindable: Bindable<T>, params: BindableParams<T>) {
    if (params.type === 'variable') {
        bindable.variable = params.name;
    } else {
        bindable.value = params.value;
    }
}

function fillTransition(transition: Transition, params: TransitionAttributes) {
    transition.conditions = (params.conditions ?? []).map((conditionParams) => {
        switch (conditionParams.type) {
            case 'unary': {
                const condition = new UnaryCondition();
                if (conditionParams.operator === 'to-be-true') {
                    condition.operator = UnaryCondition.Operator.TRUTHY;
                } else if (conditionParams.operator === 'to-be-false') {
                    condition.operator = UnaryCondition.Operator.FALSY;
                }
                fillBindable(condition.operand, conditionParams.operand);
                return condition;
            }
            case 'binary': {
                const condition = new BinaryCondition();
                switch (conditionParams.operator) {
                    case '==': condition.operator = BinaryCondition.Operator.EQUAL_TO; break;
                    case '!=': condition.operator = BinaryCondition.Operator.NOT_EQUAL_TO; break;
                    case '>': condition.operator = BinaryCondition.Operator.GREATER_THAN; break;
                    case '>=': condition.operator = BinaryCondition.Operator.GREATER_THAN_OR_EQUAL_TO; break;
                    case '<': condition.operator = BinaryCondition.Operator.LESS_THAN; break;
                    case '<=': condition.operator = BinaryCondition.Operator.LESS_THAN_OR_EQUAL_TO; break;
                }
                if (typeof conditionParams.lhs !== 'undefined') {
                    condition.lhs = conditionParams.lhs;
                }
                if (conditionParams.lhsBinding) {
                    condition.lhsBinding = createTCBinding(conditionParams.lhsBinding) as BinaryCondition['lhsBinding'];
                }
                condition.rhs = conditionParams.rhs;
                return condition;
            }
            case 'trigger': {
                const condition = new TriggerCondition();
                condition.trigger = conditionParams.variableName;
                return condition;
            }
        }
    });

    function assertsIsMotionTransition(transition: Transition): asserts transition is AnimationTransition {
        if (!isAnimationTransition(transition)) {
            throw new Error(`The transition should be animation transition.`);
        }
    }

    function assertsIsEmptyOrAnimationTransition(transition: Transition): asserts transition is (AnimationTransition | EmptyStateTransition) {
        if (!isAnimationTransition(transition) && !(transition instanceof EmptyStateTransition)) {
            throw new Error(`The transition should be animation/empty transition.`);
        }
    }

    function assertsIsDurableTransition(transition: Transition): asserts transition is (AnimationTransition | EmptyStateTransition | ProceduralPoseTransition) {
        if (!isAnimationTransition(transition) && !(transition instanceof EmptyStateTransition) && !(transition instanceof ProceduralPoseTransition)) {
            throw new Error(`The transition should be animation/empty/pose transition.`);
        }
    }

    if (typeof params.exitTimeEnabled !== 'undefined') {
        assertsIsMotionTransition(transition);
        transition.exitConditionEnabled = params.exitTimeEnabled;
    }

    if (typeof params.exitTime !== 'undefined') {
        assertsIsMotionTransition(transition);
        transition.exitCondition = params.exitTime;
    }

    if (typeof params.duration !== 'undefined') {
        assertsIsDurableTransition(transition);
        transition.duration = params.duration;
    }

    if (typeof params.relativeDuration !== 'undefined') {
        assertsIsMotionTransition(transition);
        transition.relativeDuration = params.relativeDuration;
    }

    if (typeof params.destinationStart !== 'undefined') {
        assertsIsEmptyOrAnimationTransition(transition);
        transition.destinationStart = params.destinationStart;
    }

    if (typeof params.relativeDestinationStart !== 'undefined') {
        assertsIsEmptyOrAnimationTransition(transition);
        transition.relativeDestinationStart = params.relativeDestinationStart;
    }

    if (typeof params.startEventBinding !== 'undefined') {
        assertsIsDurableTransition(transition);
        transition.startEventBinding.methodName = params.startEventBinding;
    }
    if (typeof params.endEventBinding !== 'undefined') {
        assertsIsDurableTransition(transition);
        transition.endEventBinding.methodName = params.endEventBinding;
    }
}

export function createTCBinding(params: TCBindingParams) {
    switch (params.type) {
        case 'variable': {
            const binding = new TCVariableBinding();
            binding.variableName = params.variableName;
            binding.type = TCBindingValueType.FLOAT;
            return binding;
        }
        case 'auxiliary-curve': {
            const binding = new TCAuxiliaryCurveBinding();
            binding.curveName = params.curveName;
            return binding;
        }
        case 'state-weight': {
            const binding = new TCStateWeightBinding();
            return binding;
        }
        case 'state-motion-time': {
            const binding = new TCStateMotionTimeBinding();
            return binding;
        }
    }
}

export function createMotion(params: MotionParams): Motion {
    switch (params.type) {
        case 'clip-motion': {
            const clipMotion = new ClipMotion();
            if (params.clip) {
                if (params.clip instanceof AnimationClip) {
                    clipMotion.clip = params.clip;
                } else {
                    const animationClip = new AnimationClip();
                    animationClip.duration = params.clip.duration;
                    clipMotion.clip = animationClip;
                }
            }
            return clipMotion;
        }
        case 'animation-blend-1d': {
            const motion = new AnimationBlend1D();
            fillBindable(motion.param, params.param);
            motion.items = params.items.map((itemParams) => {
                const item = new AnimationBlend1D.Item();
                if (itemParams.motion) {
                    item.motion = itemParams.motion instanceof Motion ? itemParams.motion : createMotion(itemParams.motion);
                }
                item.threshold = itemParams.threshold;
                return item;
            });
            return motion;
        }
        case 'animation-blend-2d': {
            const motion = new AnimationBlend2D();
            fillBindable(motion.paramX, params.paramX);
            fillBindable(motion.paramY, params.paramY);
            motion.items = params.items.map((itemParams) => {
                const item = new AnimationBlend2D.Item();
                if (itemParams.motion) {
                    item.motion = itemParams.motion instanceof Motion ? itemParams.motion : createMotion(itemParams.motion);
                }
                Vec2.set(item.threshold, itemParams.threshold.x, itemParams.threshold.y);
                return item;
            });
            return motion;
        }
    }
}

interface AnimationGraphParams {
    variableDeclarations?: Record<string, VariableDeclarationParams>;
    layers: LayerParams[];
}

export type VariableDeclarationParams = {
    type: 'int',
    value?: number;
} | {
    type: 'float',
    value?: number;
} | {
    type: 'boolean',
    value?: boolean;
} | {
    type: 'trigger',
    resetMode?: 'after-consumed' | 'next-frame-or-after-consumed';
};

interface LayerParams {
    stateMachine: StateMachineParams;
    additive?: boolean;
    stashes?: Record<string, LayerStashParams>;
}

export interface StateMachineParams {
    states?: Record<string, StateParams>;
    entryTransitions?: EntryTransitionParams[];
    exitTransitions?: ExitTransitionParams[];
    anyTransitions?: AnyTransitionParams[];
    transitions?: TransitionParams[];
}

type StateEventBindingSpecification = {
    transitionInEventBinding?: string;
    transitionOutEventBinding?: string;
};

function fillStateEventBindingSpecification(state: MotionState | ProceduralPoseState, specification: StateEventBindingSpecification) {
    if (typeof specification.transitionInEventBinding !== 'undefined') {
        state.transitionInEventBinding.methodName = specification.transitionInEventBinding;
    }
    if (typeof specification.transitionOutEventBinding !== 'undefined') {
        state.transitionOutEventBinding.methodName = specification.transitionOutEventBinding;
    }
}

export type StateParams = ({
    type: 'motion';
    motion?: Motion | MotionParams;
} & StateEventBindingSpecification | {
    type: 'sub-state-machine';
    stateMachine: StateMachineParams;
} | {
    type: 'empty',
} | {
    type: 'procedural';
    graph: PoseGraphParams;
} & StateEventBindingSpecification) & {
    name?: string;
};

export type TransitionParams = {
    from: string;
    to: string;
} & TransitionAttributes;

export interface EntryTransitionParams extends TransitionAttributes {
    to: string;
}

export interface AnyTransitionParams extends TransitionAttributes {
    to: string;
}

export interface ExitTransitionParams extends TransitionAttributes {
    from: string;
}

interface TransitionAttributes {
    exitTimeEnabled?: boolean;
    exitTime?: number;
    conditions?: TransitionConditionParams[];
    duration?: number;
    relativeDuration?: boolean;
    destinationStart?: number;
    relativeDestinationStart?: boolean;
    startEventBinding?: string;
    endEventBinding?: string;
}

type TransitionConditionParams = {
    type: 'unary';
    operator?: 'to-be-true' | 'to-be-false',
    operand: BindableParams<boolean>;
} | {
    type: 'binary';
    operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
    lhs?: number;
    lhsBinding?: TCBindingParams;
    rhs: number;
} | {
    type: 'trigger';
    variableName: string;
};

export type TCBindingParams = {
    type: 'variable';
    variableName: string;
} | {
    type: 'auxiliary-curve';
    curveName: string;
} | {
    type: 'state-weight';
} | {
    type: 'state-motion-time';
};

type BindableParams<T> = {
    type: 'constant',
    value: T;
} | {
    type: 'variable',
    name: string;
};

export type MotionParams = {
    type: 'clip-motion',
    clip?: AnimationClip | {
        duration: number;
    };
} | {
    type: 'animation-blend-1d',
    param: BindableParams<number>;
    items: Array<{
        motion?: Motion | MotionParams;
        threshold: number;
    }>;
} | {
    type: 'animation-blend-2d',
    paramX: BindableParams<number>;
    paramY: BindableParams<number>;
    items: Array<{
        motion?: Motion | MotionParams;
        threshold: { x: number; y: number; };
    }>;
};

export interface LayerStashParams {
    graph: PoseGraphParams;
}

type PoseGraphParams = {
    rootNode?: PoseNodeParams;
} | ((poseGraph: PoseGraph) => void);

export type PoseNodeParams = PoseNode | Node_;

function fillPoseGraph(poseGraph: PoseGraph, params: PoseGraphParams) {
    if (typeof params === 'function') {
        params(poseGraph);
    } else if (params.rootNode) {
        const root = createPoseNode(poseGraph, params.rootNode);
        poseGraphOp.connectOutputNode(poseGraph, root);
    }
}

declare global {
    interface PoseNodeFactoryRegistry {
    }
}

type Map_ = {
    [k in keyof PoseNodeFactoryRegistry]: PoseNodeFactoryRegistry[k] & { type: k };
}

const poseNodeFactoryMap: Record<string, (poseGraph: PoseGraph, params: any) => PoseNode> = {};

export function addPoseNodeFactory<T extends keyof PoseNodeFactoryRegistry> (
    type: T, factory: (poseGraph: PoseGraph, params: PoseNodeFactoryRegistry[T]) => PoseNode) {
    poseNodeFactoryMap[type] = factory;
}

export type Node_ = Map_[keyof Map_];

export function createPoseNode(poseGraph: PoseGraph, params: PoseNodeParams): PoseNode {
    if (params instanceof PoseNode) {
        return poseGraph.addNode(params);
    } else if (!(params.type in poseNodeFactoryMap)) {
        throw new Error(`${params.type} factory does not exist.`);
    } else {
        return poseNodeFactoryMap[params.type](poseGraph, params);
    }
}

