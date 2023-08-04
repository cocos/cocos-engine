import { ccclass, range, serializable } from '../../../../core/data/decorators';
import { Pose, applyDeltaPose } from '../../../core/pose';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { poseGraphNodeAppearance, poseGraphNodeCategory } from '../decorator/node';
import { POSE_GRAPH_NODE_MENU_PREFIX_POSE_BLEND } from './menu-common';
import { PoseNode, PoseTransformSpaceRequirement } from '../pose-node';
import { input } from '../decorator/input';
import {
    AnimationGraphBindingContext, AnimationGraphSettleContext, AnimationGraphUpdateContext, AnimationGraphEvaluationContext,
} from '../../animation-graph-context';
import { PoseGraphType } from '../foundation/type-system';

/**
 * Add an additional pose onto a base pose.
 *
 * @note When evaluating addition pose, the context is switched to "additive" mode.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeAdditivelyBlend`)
@poseGraphNodeCategory(POSE_GRAPH_NODE_MENU_PREFIX_POSE_BLEND)
@poseGraphNodeAppearance({ themeColor: '#72A869' })
export class PoseNodeAdditivelyBlend extends PoseNode {
    @serializable
    @input({ type: PoseGraphType.POSE })
    public basePose: PoseNode | null = null;

    @serializable
    @input({ type: PoseGraphType.POSE })
    public additivePose: PoseNode | null = null;

    @serializable
    @input({ type: PoseGraphType.FLOAT })
    @range([0.0, 1.0, 0.01])
    public ratio = 1.0;

    public bind (context: AnimationGraphBindingContext): void {
        this.basePose?.bind(context);
        context._pushAdditiveFlag(true);
        this.additivePose?.bind(context);
        context._popAdditiveFlag();
    }

    public settle (context: AnimationGraphSettleContext): void {
        this.basePose?.settle(context);
        this.additivePose?.settle(context);
    }

    public reenter (): void {
        this.basePose?.reenter();
        this.additivePose?.reenter();
    }

    protected doUpdate (context: AnimationGraphUpdateContext): void {
        this.basePose?.update(context);
        this.additivePose?.update(context);
    }

    public doEvaluate (context: AnimationGraphEvaluationContext): Pose {
        const basePose = this.basePose?.evaluate(context, PoseTransformSpaceRequirement.LOCAL) ?? context.pushDefaultedPose();
        if (!this.additivePose) {
            return basePose;
        }
        const additionalPose = this.additivePose.evaluate(context, PoseTransformSpaceRequirement.LOCAL);
        applyDeltaPose(basePose, additionalPose, this.ratio);
        context.popPose();
        return basePose;
    }
}
