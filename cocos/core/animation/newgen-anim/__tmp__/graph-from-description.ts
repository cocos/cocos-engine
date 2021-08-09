import { Vec2 } from '../../../math/vec2';
import { PoseGraph, Condition, AnimatedPose } from '../../animation';
import { GraphDescription, MotionDescription, TransitionDescriptionBase, PoseSubGraphDescription, ParametricDescription } from './graph-description';
import { PoseBlend1D } from '../pose-blend-1d';
import { PoseBlend2D } from '../pose-blend-2d';
import { GraphNode, PoseSubgraph, VariableType } from '../pose-graph';
import { Pose } from '../pose';
import { BindingHost } from '../parametric';
import { Value } from '../variable';

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
            const poseNode = subgraph.add();
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
            createTransition(subgraph, nodes[transitionDesc.from], subgraph.exitNode, transitionDesc);
        }
    }
    if (subgraphDesc.anyTransitions) {
        for (const transitionDesc of subgraphDesc.anyTransitions) {
            createTransition(subgraph, subgraph.entryNode, nodes[transitionDesc.to], transitionDesc);
        }
    }
    if (subgraphDesc.transitions) {
        for (const transitionDesc of subgraphDesc.transitions) {
            createTransition(subgraph, nodes[transitionDesc.from], nodes[transitionDesc.to], transitionDesc);
        }
    }
}

function createTransition (graph: PoseSubgraph, from: GraphNode, to: GraphNode, transitionDesc: TransitionDescriptionBase) {
    let condition: Condition | undefined;
    if (transitionDesc.condition) {
        const conditionDesc = transitionDesc.condition;
        condition = new Condition();
        condition.operator = Condition.Operator[transitionDesc.condition.operator as keyof typeof Condition.Operator];
        switch (conditionDesc.operator) {
        case 'BE_TRUE': case 'NOT':
            condition.lhs = createParametric(conditionDesc.lhs, condition, 'lhs');
            break;
        default:
            condition.lhs = createParametric(conditionDesc.lhs, condition, 'lhs');
            condition.rhs = createParametric(conditionDesc.rhs, condition, 'rhs');
            break;
        }
    }
    return graph.connect(from, to, condition);
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
        motion.param = createParametric(motionDesc.blender.value, motion, 'param');
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
        motion.paramX = createParametric(motionDesc.blender.values[0], motion, 'paramX');
        motion.paramY = createParametric(motionDesc.blender.values[1], motion, 'paramY');
        return motion;
    }
}

function createParametric<T extends string | number | boolean> (paramDesc: ParametricDescription<T>, host: BindingHost, bindingPointId: string) {
    if (typeof paramDesc === 'object') {
        host.bindProperty(bindingPointId, paramDesc.name);
        return paramDesc.value;
    } else {
        return paramDesc;
    }
}

function getVariableTypeFromValue (value: Value) {
    switch (true) {
    case typeof value === 'boolean': return VariableType.BOOLEAN;
    case typeof value === 'number': return VariableType.NUMBER;
    default: throw new Error(`Unknown variable type.`);
    }
}
