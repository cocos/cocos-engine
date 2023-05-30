
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
    }

    function* visitStateMachine(stateMachine: StateMachine): Generator<AnimationClip> {
        for (const state of stateMachine.states()) {
            if (state instanceof MotionState) {
                const { motion } = state;
                if (motion) {
                    yield* visitMotion(motion);
                }
            } else if (state instanceof ProceduralPoseState) {
                for (const shell of state.graph.nodes()) {
                    yield* visitPoseNode(shell);
                }
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

    function* visitPoseNode(node: PoseGraphNode): Generator<AnimationClip> {
        // FIXME: HACK HERE
        for (const [_, v] of Object.entries(node)) {
            if (v instanceof Motion) {
                yield* visitMotion(v);
            }
        }
    }
}

export function* visitAnimationClipsInController(animationController: AnimationController): Generator<AnimationClip> {
    const {
        graph,
    } = animationController;
    if (graph) {
        yield* visitAnimationClips(graph as AnimationGraph);
    }
}
