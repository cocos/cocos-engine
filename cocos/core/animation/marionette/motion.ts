import { Node } from '../../scene-graph';
import { AnimationMask } from './animation-mask';
import { createEval } from './create-eval';
import type { BindContext } from './parametric';
import type { BlendStateBuffer } from '../../../3d/skeletal-animation/skeletal-animation-blending';
import type { ClipStatus } from './graph-eval';

export interface MotionEvalContext extends BindContext {
    node: Node;

    blendBuffer: BlendStateBuffer;

    mask?: AnimationMask;
}

export interface MotionEval {
    readonly duration: number;
    sample(progress: number, baseWeight: number): void;
    getClipStatuses(baseWeight: number): Iterator<ClipStatus>;
}

export interface Motion {
    [createEval] (context: MotionEvalContext): MotionEval | null;

    clone(): Motion;
}
