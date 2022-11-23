import { Node } from '../../scene-graph';
import { AnimationMask } from './animation-mask';
import { createEval } from './create-eval';
import type { BindContext } from './parametric';
import type { BlendStateBuffer } from '../../3d/skeletal-animation/skeletal-animation-blending';
import type { ReadonlyClipOverrideMap, ClipStatus } from './graph-eval';
import type { RuntimeID } from './graph-debug';
import { AnimationGraphEvaluationContext, AnimationGraphLayerWideBindingContext } from './animation-graph-context';
import { Pose } from '../core/pose';

export interface CreateClipEvalContext {
    node: Node;

    blendBuffer: BlendStateBuffer;

    mask?: AnimationMask;
}

export interface MotionEvalContext extends BindContext, CreateClipEvalContext {
    clipOverrides: ReadonlyClipOverrideMap | null;
}

export interface MotionEval {
    /**
     * The runtime ID. Maybe invalid.
     */
    readonly runtimeId?: RuntimeID;

    /**
     * The duration of this motion. If it's a clip motion.
     * It should be $duration_{clip} / speed_{clip}$.
     */
    readonly duration: number;

    getClipStatuses(baseWeight: number): Iterator<ClipStatus>;

    overrideClips(clipOverrides: ReadonlyClipOverrideMap, context: AnimationGraphLayerWideBindingContext): void;

    createPort(): MotionPort;
}

export interface Motion {
    [createEval] (context: AnimationGraphLayerWideBindingContext, clipOverrides: ReadonlyClipOverrideMap | null): MotionEval | null;

    clone(): Motion;
}

export interface MotionPort {
    evaluate(progress: number, context: AnimationGraphEvaluationContext): Pose;
}
