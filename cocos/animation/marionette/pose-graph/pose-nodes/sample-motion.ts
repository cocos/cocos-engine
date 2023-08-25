import { EDITOR } from 'internal:constants';
import { clamp01 } from '../../../../core';
import { ccclass, editable, serializable } from '../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { ClipMotion } from '../../motion/clip-motion';
import { createEval } from '../../create-eval';
import { Motion, MotionEval, MotionPort } from '../../motion/motion';
import { PoseNode } from '../pose-node';
import { Pose } from '../../../core/pose';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from '../../animation-graph-context';
import { input } from '../decorator/input';
import { poseGraphCreateNodeFactory, poseGraphNodeAppearance, poseGraphNodeCategory } from '../decorator/node';
import { POSE_GRAPH_NODE_MENU_PREFIX_POSE } from './menu-common';
import { getEnterInfo, getTileBase, makeCreateNodeFactory } from './play-or-sample-motion-pose-node-shared';
import { PoseGraphType } from '../foundation/type-system';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeSampleMotion`)
@poseGraphNodeCategory(POSE_GRAPH_NODE_MENU_PREFIX_POSE)
@poseGraphCreateNodeFactory(makeCreateNodeFactory(
    (motion) => {
        const node = new PoseNodeSampleMotion();
        node.motion = motion;
        return node;
    },
))
@poseGraphNodeAppearance({ themeColor: '#D97721' })
export class PoseNodeSampleMotion extends PoseNode {
    @serializable
    @editable
    public motion: Motion | null = new ClipMotion();

    @serializable
    @editable
    @input({ type: PoseGraphType.FLOAT })
    public time = 0.0;

    @serializable
    @editable
    public useNormalizedTime = false;

    public bind (context: AnimationGraphBindingContext): void {
        const { motion } = this;
        if (!motion) {
            return;
        }
        const motionEval = motion[createEval](context, true);
        if (!motionEval) {
            return;
        }
        const workspace = new SampleMotionWorkspace(motionEval, motionEval.createPort());
        this._workspace = workspace;
    }

    public settle (context: AnimationGraphSettleContext): void {
        // Do nothing.
    }

    public reenter (): void {
        // Do nothing.
    }

    protected doUpdate (context: AnimationGraphUpdateContext): void {
        // Do nothing.
    }

    protected doEvaluate (context: AnimationGraphEvaluationContext): Pose {
        const { _workspace: workspace } = this;

        if (!workspace) {
            return context.pushDefaultedPose();
        }

        const time = this.time;
        const normalizedTime = this.useNormalizedTime
            ? time
            : time / workspace.motionEval.duration;
        return workspace.motionEvalPort.evaluate(clamp01(normalizedTime), context);
    }

    private _workspace: SampleMotionWorkspace | null = null;
}

class SampleMotionWorkspace {
    constructor (
        public motionEval: MotionEval,
        public motionEvalPort: MotionPort,
    ) {
    }
}

if (EDITOR) {
    PoseNodeSampleMotion.prototype.getTitle = function getTitle (this: PoseNodeSampleMotion): string | [string, Record<string, string>] | undefined {
        return getTileBase(`ENGINE.classes.${CLASS_NAME_PREFIX_ANIM}PoseNodeSampleMotion.title`, this.motion);
    };

    PoseNodeSampleMotion.prototype.getEnterInfo = getEnterInfo;
}
