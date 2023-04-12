import { AnimationClip } from "../../../../cocos/animation/animation-clip";
import { AnimationGraph, AnimationTransition, EmptyStateTransition, isAnimationTransition, PoseState, PoseTransition, State, StateMachine, SubStateMachine, Transition } from "../../../../cocos/animation/marionette/animation-graph";
import { PoseGraph, PoseNode } from "../../../../cocos/animation/marionette/asset-creation";
import { ClipMotion } from "../../../../cocos/animation/marionette/clip-motion";
import { BinaryCondition, TriggerCondition, UnaryCondition } from "../../../../cocos/animation/marionette/condition";
import { Motion } from "../../../../cocos/animation/marionette/motion";
import { MotionState } from "../../../../cocos/animation/marionette/motion-state";
import { Bindable } from "../../../../cocos/animation/marionette/parametric";
import { TriggerResetMode } from "../../../../cocos/animation/marionette/variable";

export function createAnimationGraph(params: AnimationGraphParams): AnimationGraph {
    const animationGraph = new AnimationGraph();
    if (params.variableDeclarations) {
        for (const [id, variableDeclarationParams] of Object.entries(params.variableDeclarations)) {
            switch (variableDeclarationParams.type) {
                case 'float': animationGraph.addFloat(id, variableDeclarationParams.value); break;
                case 'int': animationGraph.addInteger(id, variableDeclarationParams.value); break;
                case 'boolean': animationGraph.addBoolean(id, variableDeclarationParams.value); break;
                case 'trigger': animationGraph.addTrigger(
                    id,
                    false,
                    variableDeclarationParams.resetMode == 'after-consumed'
                        ? TriggerResetMode.AFTER_CONSUMED
                        : variableDeclarationParams.resetMode === 'next-frame-or-after-consumed'
                            ? TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED
                            : undefined,
                    );
                    break;
            }
        }
    }
    for (const layerParams of params.layers) {
        const layer = animationGraph.addLayer();
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
                if (stateParams.motion) {
                    (state as MotionState).motion = stateParams.motion instanceof Motion ? stateParams.motion : createMotion(stateParams.motion);
                }
                break;
            case 'pose':
                state = stateMachine.addPoseState();
                fillPoseGraph((state as PoseState).graph, stateParams.graph);
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

function fillTransition(transition: Transition, params: TransitionAttributes) {
    const fillBindable = <T>(bindable: Bindable<T>, params: BindableParams<T>) => {
        if (params.type === 'variable') {
            bindable.variable = params.name;
        } else {
            bindable.value = params.value;
        }
    };
    
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
                fillBindable(condition.lhs, conditionParams.lhs);
                fillBindable(condition.rhs, conditionParams.rhs);
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

    function assertsIsDurableTransition(transition: Transition): asserts transition is (AnimationTransition | EmptyStateTransition | PoseTransition) {
        if (!isAnimationTransition(transition) && !(transition instanceof EmptyStateTransition) && !(transition instanceof PoseTransition)) {
            throw new Error(`The transition should be animation/empty transition.`);
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

    if (typeof params.interruptible !== 'undefined') {
        assertsIsMotionTransition(transition);
        transition.interruptible = params.interruptible;
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
}

export interface StateMachineParams {
    states?: Record<string, StateParams>;
    entryTransitions?: EntryTransitionParams[];
    exitTransitions?: ExitTransitionParams[];
    anyTransitions?: AnyTransitionParams[];
    transitions?: TransitionParams[];
}

export type StateParams = ({
    type: 'motion';
    motion?: Motion | MotionParams;
} | {
    type: 'sub-state-machine';
    stateMachine: StateMachineParams;
} | {
    type: 'empty',
} | {
    type: 'pose';
    graph: PoseGraphParams;
}) & {
    name?: string;
};

type TransitionParams = {
    from: string;
    to: string;
} & TransitionAttributes;

interface EntryTransitionParams extends TransitionAttributes {
    to: string;
}

interface AnyTransitionParams extends TransitionAttributes {
    to: string;
}

interface ExitTransitionParams extends TransitionAttributes {
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
    interruptible?: boolean;
}

type TransitionConditionParams = {
    type: 'unary';
    operator?: 'to-be-true' | 'to-be-false',
    operand: BindableParams<boolean>;
} | {
    type: 'binary';
    lhs: BindableParams<number>;
    rhs: BindableParams<number>;
} | {
    type: 'trigger';
    variableName: string;
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
};

export interface PoseGraphParams {
    rootNode?: PoseNodeParams;
}

export type PoseNodeParams = PoseNode;

function fillPoseGraph(poseGraph: PoseGraph, params: PoseGraphParams) {
    if (params.rootNode) {
        const root = createPoseNode(poseGraph, params.rootNode);
        poseGraph.main = root;
    }
}

export function createPoseNode(poseGraph: PoseGraph, params: PoseNodeParams): NonNullable<PoseGraph['main']> {
    poseGraph.addNode(params);
    return params;
}

