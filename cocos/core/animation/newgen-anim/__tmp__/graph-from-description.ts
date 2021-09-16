import { Vec2 } from '../../../math/vec2';
import { PoseGraph, Condition, AnimatedPose } from '../../animation';
import {
    GraphDescription,
    MotionDescription,
    TransitionDescriptionBase,
    PoseSubGraphDescription,
    ParametricDescription,
    PoseTransitionDescription,
} from './graph-description';
import { PoseBlend1D } from '../pose-blend-1d';
import { PoseBlend2D } from '../pose-blend-2d';
import { GraphNode, PoseSubgraph, PoseTransition, VariableType } from '../pose-graph';
import { Pose } from '../pose';
import { Bindable } from '../parametric';
import { Value } from '../variable';
import { PoseNode } from '../pose-node';
import { BinaryCondition, TriggerCondition, UnaryCondition } from '../condition';

export function createGraphFromDescription (graphDescription: GraphDescription) {
    const graph = new PoseGraph();

    if (graphDescription.vars) {
        for (const varDesc of graphDescription.vars) {
            graph.addVariable(varDesc.name, getVariableTypeFromValue(varDesc.value), varDesc.value);
        }
    }

    for (const layerDesc of graphDescription.layers) {
        const layer = graph.addLayer();
        createSubgraph(layer.graph, layerDesc.graph);
    }
    return graph;
}

function createSubgraph (subgraph: PoseSubgraph, subgraphDesc: PoseSubGraphDescription) {
    const nodes = subgraphDesc.nodes?.map((nodeDesc) => {
        let node: GraphNode;
        if (nodeDesc.type === 'pose') {
            const poseNode = subgraph.addPoseNode();
            if (nodeDesc.motion) {
                poseNode.pose = createMotion(nodeDesc.motion);
            }
            node = poseNode;
        } else {
            const subSubgraph = subgraph.addSubgraph();
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
            createTransition(subgraph, subgraph.entryNode, nodes[transitionDesc.to], transitionDesc);
        }
    }
    if (subgraphDesc.exitTransitions) {
        for (const transitionDesc of subgraphDesc.exitTransitions) {
            createPoseTransition(subgraph, nodes[transitionDesc.from] as PoseNode, subgraph.exitNode, transitionDesc);
        }
    }
    if (subgraphDesc.anyTransitions) {
        for (const transitionDesc of subgraphDesc.anyTransitions) {
            createTransition(subgraph, subgraph.entryNode, nodes[transitionDesc.to], transitionDesc);
        }
    }
    if (subgraphDesc.transitions) {
        for (const transitionDesc of subgraphDesc.transitions) {
            createPoseTransition(subgraph, nodes[transitionDesc.from] as PoseNode, nodes[transitionDesc.to], transitionDesc);
        }
    }
}

function createTransition (graph: PoseSubgraph, from: GraphNode, to: GraphNode, transitionDesc: TransitionDescriptionBase) {
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

function createPoseTransition (graph: PoseSubgraph, from: PoseNode, to: GraphNode, descriptor: PoseTransitionDescription) {
    const transition = createTransition(graph, from, to, descriptor) as PoseTransition;

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

function createMotion (motionDesc: MotionDescription): Pose {
    if (motionDesc.type === 'pose') {
        const motion = new AnimatedPose();
        return motion;
    } else if (motionDesc.blender.type === '1d') {
        const motion = new PoseBlend1D();
        const thresholds = motionDesc.blender.thresholds;
        motion.children = motionDesc.children.map((childMotionDesc, iMotion) => [
            createMotion(childMotionDesc),
            thresholds[iMotion],
        ] as [Pose, number]);
        createParametric(motionDesc.blender.value, motion.param);
        return motion;
    } else {
        const algorithm = PoseBlend2D.Algorithm[motionDesc.blender.algorithm];
        const motion = new PoseBlend2D();
        motion.algorithm = algorithm;
        const thresholds = motionDesc.blender.thresholds;
        motion.children = motionDesc.children.map((childMotionDesc, iMotion) => [
            createMotion(childMotionDesc),
            new Vec2(thresholds[iMotion].x, thresholds[iMotion].y),
        ] as [Pose, Vec2]);
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
