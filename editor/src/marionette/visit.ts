
import { AnimationClip } from "../../../cocos/animation/animation-clip";
import { AnimationBlend1D } from "../../../cocos/animation/marionette/animation-blend-1d";
import { AnimationBlend2D } from "../../../cocos/animation/marionette/animation-blend-2d";
import { AnimationBlendDirect } from "../../../cocos/animation/marionette/animation-blend-direct";
import { AnimationController } from "../../../cocos/animation/marionette/animation-controller";
import {
    StateMachine,
    SubStateMachine,
    AnimationGraph,
} from "../../../cocos/animation/marionette/animation-graph";
import { ClipMotion } from "../../../cocos/animation/marionette/clip-motion";
import { Motion } from "../../../cocos/animation/marionette/motion";
import { MotionState } from "../../../cocos/animation/marionette/motion-state";
import { EditorExtendableObject } from "../../../cocos/core/data/editor-extras-tag";

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
}

export function* visitAnimationClipsInController(animationController: AnimationController): Generator<AnimationClip> {
    const {
        graph,
    } = animationController;
    if (graph) {
        yield* visitAnimationClips(graph as AnimationGraph);
    }
}
