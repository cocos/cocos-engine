
import { AnimationClip } from "../../../cocos/animation/animation-clip";
import { Motion, ClipMotion, AnimationBlend1D, AnimationBlend2D, AnimationBlendDirect } from "../../../cocos/animation/marionette/motion";
import { AnimationController } from "../../../cocos/animation/marionette/animation-controller";
import {
    StateMachine,
    SubStateMachine,
    AnimationGraph,
    ProceduralPoseState,
} from "../../../cocos/animation/marionette/animation-graph";
import { MotionState } from "../../../cocos/animation/marionette/state-machine/motion-state";
import { EditorExtendableObject } from "../../../cocos/core/data/editor-extras-tag";
import { PoseGraphNode } from "../../../cocos/animation/marionette/pose-graph/foundation/pose-graph-node";
import { PoseNodeStateMachine } from '../../../cocos/animation/marionette/pose-graph/pose-nodes/state-machine';
import { PoseNodePlayMotion } from "../../../cocos/animation/marionette/pose-graph/pose-nodes/play-motion";
import { PoseNodeSampleMotion } from "../../../cocos/animation/marionette/pose-graph/pose-nodes/sample-motion";
import { PoseGraph } from "../../../cocos/animation/marionette/pose-graph/pose-graph";
import { AnimationGraphVariant } from "../../../cocos/animation/marionette/animation-graph-variant";

export function* visitAnimationGraphEditorExtras(animationGraph: AnimationGraph): Generator<EditorExtendableObject> {
    for (const layer of animationGraph.layers) {
        yield* visitStateMachine(layer.stateMachine);
    }

    function* visitStateMachine(stateMachine: StateMachine): Generator<EditorExtendableObject> {
        yield stateMachine;
        for (const state of stateMachine.states()) {
            yield state;
            if (state instanceof MotionState) {
                const motion = state.motion;
                if (!motion) {
                    continue;
                }
                yield* visitMotion(motion);
            } else if (state instanceof SubStateMachine) {
                yield* visitStateMachine(state.stateMachine);
            }
        }
        for (const transition of stateMachine.transitions()) {
            yield transition;
        }
    }

    function* visitMotion(motion: Motion) {
        yield motion;
        if (motion instanceof AnimationBlend1D ||
            motion instanceof AnimationBlend2D ||
            motion instanceof AnimationBlendDirect) {
            for (const { motion: childMotion } of motion.items) {
                if (childMotion) {
                    yield* visitMotion(childMotion);
                }
            }
        }
    }
}

export function* visitAnimationClips(animationGraph: AnimationGraph): Generator<AnimationClip> {
    for (const layer of animationGraph.layers) {
        yield* visitStateMachine(layer.stateMachine);
        for (const [_stashId, stash] of layer.stashes()) {
            yield* visitPoseGraph(stash.graph);
        }
    }

    function* visitStateMachine(stateMachine: StateMachine): Generator<AnimationClip> {
        for (const state of stateMachine.states()) {
            if (state instanceof MotionState) {
                const { motion } = state;
                if (motion) {
                    yield* visitMotion(motion);
                }
            } else if (state instanceof ProceduralPoseState) {
                yield* visitPoseGraph(state.graph);
            } else if (state instanceof SubStateMachine) {
                yield* visitStateMachine(state.stateMachine);
            }
        }
    }

    function* visitMotion(motion: Motion): Generator<AnimationClip> {
        if (motion instanceof ClipMotion) {
            if (motion.clip) {
                yield motion.clip;
            }
        } else if (motion instanceof AnimationBlend1D || motion instanceof AnimationBlend2D || motion instanceof AnimationBlendDirect) {
            for (const { motion: childMotion } of motion.items) {
                if (childMotion) {
                    yield* visitMotion(childMotion);
                }
            }
        }
    }

    function* visitPoseGraph(poseGraph: PoseGraph) {
        for (const shell of poseGraph.nodes()) {
            yield* visitPoseNode(shell);
        }
    }

    function* visitPoseNode(node: PoseGraphNode): Generator<AnimationClip> {
        if (node instanceof PoseNodePlayMotion || node instanceof PoseNodeSampleMotion) {
            if (node.motion) {
                yield* visitMotion(node.motion);
            }
        } else if (node instanceof PoseNodeStateMachine) {
            yield* visitStateMachine(node.stateMachine);
        }
    }
}

export function* visitAnimationClipsInController(animationController: AnimationController): Generator<AnimationClip> {
    const {
        graph,
    } = animationController;
    if (graph instanceof AnimationGraph) {
        yield* visitAnimationClips(graph);
    } else if (graph instanceof AnimationGraphVariant) {
        const {
            original,
            clipOverrides,
        } = graph;
        if (original) {
            for (const clip of visitAnimationClips(original)) {
                yield clipOverrides.get(clip) ?? clip;
            }
        }
    }
}
