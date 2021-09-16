import { Node } from '../../scene-graph';
import { SkeletonMask } from '../skeleton-mask';
import { createEval } from './create-eval';
import type { BindContext } from './parametric';
import type { BlendStateBuffer } from '../../../3d/skeletal-animation/skeletal-animation-blending';
import type { PoseStatus } from './graph-eval';

export interface PoseEvalContext extends BindContext {
    node: Node;

    blendBuffer: BlendStateBuffer;

    mask?: SkeletonMask;

    speed: number;

    startRatio: number;
}

export interface PoseEval {
    readonly duration: number;
    sample(time: number, baseWeight: number): void;
    poses(baseWeight: number): Iterator<PoseStatus>;
}

export interface Pose {
    [createEval] (context: PoseEvalContext): PoseEval | null;
}
