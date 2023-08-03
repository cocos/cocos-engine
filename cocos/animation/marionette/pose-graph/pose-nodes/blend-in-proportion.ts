import { EDITOR } from 'internal:constants';
import { ccclass, range, serializable } from '../../../../core/data/decorators';
import { blendPoseInto, Pose } from '../../../core/pose';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { PoseNode, PoseTransformSpaceRequirement } from '../pose-node';
import { input } from '../decorator/input';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext,
    AnimationGraphSettleContext, AnimationGraphUpdateContext, AnimationGraphUpdateContextGenerator,
} from '../../animation-graph-context';
import { poseGraphNodeAppearance, poseGraphNodeCategory } from '../decorator/node';
import { POSE_GRAPH_NODE_MENU_PREFIX_POSE_BLEND } from './menu-common';
import { PoseGraphType } from '../foundation/type-system';
import { isIgnorableWeight } from '../utils';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeBlendInProportion`)
@poseGraphNodeCategory(POSE_GRAPH_NODE_MENU_PREFIX_POSE_BLEND)
@poseGraphNodeAppearance({ themeColor: '#72A869' })
export class PoseNodeBlendInProportion extends PoseNode {
    @serializable
    @input({
        type: PoseGraphType.POSE,
        arraySyncGroup: 'blend-item',
    })
    public readonly poses: Array<PoseNode | null> = [];

    @serializable
    @input({
        type: PoseGraphType.FLOAT,
        arraySyncGroup: 'blend-item',
        arraySyncGroupFollower: true,
    })
    @range([0.0, Number.POSITIVE_INFINITY])
    public readonly proportions: number[] = [];

    public bind (context: AnimationGraphBindingContext): void {
        for (const pose of this.poses) {
            pose?.bind(context);
        }
    }

    public settle (context: AnimationGraphSettleContext): void {
        for (const pose of this.poses) {
            pose?.settle(context);
        }
    }

    public reenter (): void {
        for (const pose of this.poses) {
            pose?.reenter();
        }
    }

    protected doUpdate (context: AnimationGraphUpdateContext): void {
        const {
            _updateContextGenerator: updateContextGenerator,
        } = this;
        const nInputPoses = this.poses.length;
        for (let iInputPose = 0; iInputPose < nInputPoses; ++iInputPose) {
            const inputPoseWeight = this.proportions[iInputPose];
            if (isIgnorableWeight(inputPoseWeight)) {
                continue;
            }
            const inputPoseUpdateContext = updateContextGenerator.generate(
                context.deltaTime,
                context.indicativeWeight * inputPoseWeight,
            );
            this.poses[iInputPose]?.update(inputPoseUpdateContext);
        }
    }

    public doEvaluate (context: AnimationGraphEvaluationContext): Pose {
        const nInputPoses = this.poses.length;
        let sumWeight = 0.0;
        let finalPose: Pose | null = null;
        for (let iInputPose = 0; iInputPose < nInputPoses; ++iInputPose) {
            const inputPoseWeight = this.proportions[iInputPose];
            if (isIgnorableWeight(inputPoseWeight)) {
                continue;
            }
            const inputPose = this.poses[iInputPose]?.evaluate(context, PoseTransformSpaceRequirement.LOCAL);
            if (!inputPose) {
                continue;
            }
            sumWeight += inputPoseWeight;
            if (!finalPose) {
                finalPose = inputPose;
            } else {
                if (sumWeight) {
                    const t = inputPoseWeight / sumWeight;
                    blendPoseInto(finalPose, inputPose, t);
                }
                context.popPose();
            }
        }
        if (finalPose) {
            return finalPose;
        }

        // TODO: cause wired behavior in additive layer.
        return context.pushDefaultedPose();
    }

    private _updateContextGenerator = new AnimationGraphUpdateContextGenerator();
}
