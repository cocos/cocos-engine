import { Layer, PoseGraphStash, ProceduralPoseState, StateMachine } from "../../../../cocos/animation/marionette/animation-graph";
import { PoseNodeStateMachine } from '../../../../cocos/animation/marionette/pose-graph/pose-nodes/state-machine';
import { PoseGraph } from "../../../../cocos/animation/marionette/pose-graph/pose-graph";
import { PoseNode } from "../../../../cocos/animation/marionette/pose-graph/pose-node";

export type PoseNodeLocationRoot = [string | ''];

export type PoseNodeLocation = [node: PoseNode, graph: PoseGraph, ...root: PoseNodeLocationRoot];

export function* visitPoseNodeInLayer(layer: Layer): Generator<PoseNodeLocation> {
    yield* visitPoseNodesInStateMachine(layer.stateMachine, ['']);
    for (const [stashId, stash] of layer.stashes()) {
        yield* visitPoseNodeInPoseGraph(stash.graph, [stashId]);
    }
}

export function* visitPoseNodeInPoseGraph(poseGraph: PoseGraph, root: PoseNodeLocationRoot): Generator<PoseNodeLocation> {
    for (const node of poseGraph.nodes()) {
        if (node instanceof PoseNode) {
            yield [node, poseGraph, ...root];
        }
        if (node instanceof PoseNodeStateMachine) {
            yield* visitPoseNodesInStateMachine(node.stateMachine, [...root]);
        }
    }
}

export function* visitPoseNodesInStateMachine(stateMachine: StateMachine, root: PoseNodeLocationRoot) {
    for (const state of stateMachine.states()) {
        if (state instanceof ProceduralPoseState) {
            yield* visitPoseNodeInPoseGraph(state.graph, [...root]);
        }
    }
}
