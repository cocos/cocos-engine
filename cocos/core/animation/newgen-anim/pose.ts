import { Node } from '../../scene-graph';
import { SkeletonMask } from '../skeleton-mask';
import { createEval } from './create-eval';
import type { BindingHost } from './parametric';
import type { BlendStateBuffer } from '../../../3d/skeletal-animation/skeletal-animation-blending';
import type { PoseStatus } from './graph-eval';

export interface PoseEvalContext {
    node: Node;

    blendBuffer: BlendStateBuffer;

    mask?: SkeletonMask;

    speed: number;

    startRatio: number;

    getParam(host: BindingHost, name: string): unknown;
}

export interface PoseEval {
    readonly duration: number;
    sample(time: number, baseWeight: number): void;
    poses(baseWeight: number): Iterator<PoseStatus>;
}

export interface Pose {
    [createEval] (context: PoseEvalContext): PoseEval | null;
}
