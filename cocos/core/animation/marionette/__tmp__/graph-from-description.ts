import { Vec2 } from '../../../math/vec2';
import { AnimationGraph, Condition, ClipMotion } from '../../animation';
import {
    GraphDescription,
    MotionDescription,
    TransitionDescriptionBase,
    StateMachineDescription,
    ParametricDescription,
    AnimationTransitionDescription,
} from './graph-description';
import { AnimationBlend1D } from '../animation-blend-1d';
import { AnimationBlend2D } from '../animation-blend-2d';
import { State, StateMachine, AnimationTransition } from '../animation-graph';
import { Motion } from '../motion';
import { Bindable, VariableType } from '../parametric';
import { Value } from '../variable';
import { MotionState } from '../motion-state';
import { BinaryCondition, TriggerCondition, UnaryCondition } from '../condition';

export function createGraphFromDescription (graphDescription: GraphDescription) {
    const graph = new AnimationGraph();

    if (graphDescription.vars) {
        for (const varDesc of graphDescription.vars) {
            graph.addVariable(varDesc.name, getVariableTypeFromValue(varDesc.value), varDesc.value);
        }
    }

    for (const layerDesc of graphDescription.layers) {
        const layer = graph.addLayer();
        createSubgraph(layer.stateMachine, layerDesc.graph);
    }
    return graph;
}

function createSubgraph (subgraph: StateMachine, subgraphDesc: StateMachineDescription) {
    const nodes = subgraphDesc.nodes?.map((nodeDesc) => {
        let node: State;
        if (nodeDesc.type === 'animation') {
            const animationState = subgraph.addMotion();
            if (nodeDesc.motion) {
                animationState.motion = createMotion(nodeDesc.motion);
            }
            node = animationState;
        } else {
            const subSubgraph = subgraph.addSubStateMachine();
            createSubgraph(subgraph, nodeDesc);
            node = subSubgraph;
        }
        if (nodeDesc.name) {
            node.name = nodeDesc.name;
        }
        return node;
    }) ?? [];

    if (subgraphDesc.entryTransitions) {
        for (const transitionDesc of subgraphDesc.entryTransitions) {
            createTransition(subgraph, subgraph.entryState, nodes[transitionDesc.to], transitionDesc);
        }
    }
    if (subgraphDesc.exitTransitions) {
        for (const transitionDesc of subgraphDesc.exitTransitions) {
            createAnimationTransition(subgraph, nodes[transitionDesc.from] as MotionState, subgraph.exitState, transitionDesc);
        }
    }
    if (subgraphDesc.anyTransitions) {
        for (const transitionDesc of subgraphDesc.anyTransitions) {
            createTransition(subgraph, subgraph.entryState, nodes[transitionDesc.to], transitionDesc);
        }
    }
    if (subgraphDesc.transitions) {
        for (const transitionDesc of subgraphDesc.transitions) {
            createAnimationTransition(subgraph, nodes[transitionDesc.from] as MotionState, nodes[transitionDesc.to], transitionDesc);
        }
    }
}

function createTransition (graph: StateMachine, from: State, to: State, transitionDesc: TransitionDescriptionBase) {
    let condition: Condition | undefined;
    const conditions = transitionDesc.conditions?.map((conditionDesc) => {
        switch (conditionDesc.type) {
        default:
            throw new Error(`Unknown condition type.`);
        case 'unary': {
            const condition = new UnaryCondition();
            condition.operator = UnaryCondition.Operator[conditionDesc.type];
            createParametric(conditionDesc.operand, condition.operand);
            return condition;
        }
        case 'binary': {
            const condition = new BinaryCondition();
            condition.operator = BinaryCondition.Operator[conditionDesc.type];
            createParametric(conditionDesc.lhs, condition.lhs);
            createParametric(conditionDesc.rhs, condition.rhs);
            return condition;
        }
        case 'trigger': {
            const condition = new TriggerCondition();
            return condition;
        }
        }
    });
    const transition = graph.connect(from, to, conditions);
    return transition;
}

function createAnimationTransition (graph: StateMachine, from: MotionState, to: State, descriptor: AnimationTransitionDescription) {
    const transition = createTransition(graph, from, to, descriptor) as unknown as AnimationTransition;

    const {
        duration,
        exitCondition,
    } = descriptor;

    transition.duration = duration ?? 0.0;

    transition.exitConditionEnabled = false;
    if (typeof exitCondition !== 'undefined') {
        transition.exitConditionEnabled = true;
        transition.exitCondition = exitCondition;
    }
    return transition;
}

function createMotion (motionDesc: MotionDescription): Motion {
    if (motionDesc.type === 'clip') {
        const motion = new ClipMotion();
        return motion;
    } else if (motionDesc.blender.type === '1d') {
        const motion = new AnimationBlend1D();
        const thresholds = motionDesc.blender.thresholds;
        motion.items = motionDesc.children.map((childMotionDesc, iMotion) => {
            const item = new AnimationBlend1D.Item();
            item.motion = createMotion(childMotionDesc);
            item.threshold = thresholds[iMotion];
            return item;
        });
        createParametric(motionDesc.blender.value, motion.param);
        return motion;
    } else {
        const algorithm = AnimationBlend2D.Algorithm[motionDesc.blender.algorithm];
        const motion = new AnimationBlend2D();
        motion.algorithm = algorithm;
        const thresholds = motionDesc.blender.thresholds;
        motion.items = motionDesc.children.map((childMotionDesc, iMotion) => {
            const item = new AnimationBlend2D.Item();
            item.motion = createMotion(childMotionDesc);
            item.threshold = new Vec2(thresholds[iMotion].x, thresholds[iMotion].y);
            return item;
        });
        createParametric(motionDesc.blender.values[0], motion.paramX);
        createParametric(motionDesc.blender.values[1], motion.paramY);
        return motion;
    }
}

function createParametric<T extends string | number | boolean> (paramDesc: ParametricDescription<T>, bindable: Bindable<T>) {
    if (typeof paramDesc === 'object') {
        bindable.variable = paramDesc.name;
        bindable.value = paramDesc.value;
    } else {
        bindable.value = paramDesc;
    }
}

function getVariableTypeFromValue (value: Value) {
    switch (true) {
    case typeof value === 'boolean': return VariableType.BOOLEAN;
    case typeof value === 'number': return VariableType.NUMBER;
    default: throw new Error(`Unknown variable type.`);
    }
}
