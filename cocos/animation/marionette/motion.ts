import { Node } from '../../scene-graph';
import { AnimationMask } from './animation-mask';
import { createEval } from './create-eval';
import type { BindContext } from './parametric';
import type { BlendStateBuffer } from '../../3d/skeletal-animation/skeletal-animation-blending';
import type { ReadonlyClipOverrideMap, ClipStatus } from './graph-eval';
import type { RuntimeID } from './graph-debug';

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

    readonly duration: number;
    sample(progress: number, baseWeight: number): void;
    getClipStatuses(baseWeight: number): Iterator<ClipStatus>;

    overrideClips(overrides: ReadonlyClipOverrideMap, context: OverrideClipContext): void;
}

export type OverrideClipContext = CreateClipEvalContext;

export interface Motion {
    [createEval] (context: MotionEvalContext): MotionEval | null;

    clone(): Motion;
}
