import { Node } from '../../scene-graph';
import { SkeletonMask } from '../skeleton-mask';
import { createEval } from './create-eval';
import type { BindingHost } from './parametric';
import type { BlendStateBuffer } from '../../../3d/skeletal-animation/skeletal-animation-blending';

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
    /**
     * The progress of this animation, or 0.0 if this is not a animation pose.
     */
    readonly progress: number;
    active(): void;
    inactive(): void;
    setBaseWeight (weight: number): void;
    update(deltaTime: number): void;
    sample(): void;
}

export interface Pose {
    [createEval] (context: PoseEvalContext): PoseEval | null;
}
