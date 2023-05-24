import { Layer, ProceduralPoseState, StateMachine } from "../../../../cocos/animation/marionette/animation-graph";
import { PoseNodeStateMachine } from '../../../../cocos/animation/marionette/pose-graph/pose-nodes/state-machine';
import { PoseGraph } from "../../../../cocos/animation/marionette/pose-graph/pose-graph";
import { PoseNode } from "../../../../cocos/animation/marionette/pose-graph/pose-node";

export function* visitPoseNodeInLayer(layer: Layer): Generator<PoseNode> {
    yield* visitPoseNodesInStateMachine(layer.stateMachine);
    for (const [stashId, stash] of layer.stashes()) {
        yield* visitPoseNodeInPoseGraph(stash.graph);
    }
}

export function* visitPoseNodeInPoseGraph(poseGraph: PoseGraph): Generator<PoseNode> {
    for (const node of poseGraph.nodes()) {
        if (node instanceof PoseNode) {
            yield node;
        }
        if (node instanceof PoseNodeStateMachine) {
            yield* visitPoseNodesInStateMachine(node.stateMachine);
        }
    }
}

export function* visitPoseNodesInStateMachine(stateMachine: StateMachine) {
    for (const state of stateMachine.states()) {
        if (state instanceof ProceduralPoseState) {
            yield* visitPoseNodeInPoseGraph(state.graph);
        }
    }
}
