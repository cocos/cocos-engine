import { ccclass, editable, range, serializable, type } from '../../../../core/data/decorators';
import { Pose } from '../../../core/pose';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { PoseNode, PoseTransformSpaceRequirement } from '../pose-node';
import { input } from '../decorator/input';
import { AnimationGraphBindingContext, AnimationGraphSettleContext,
    AnimationGraphUpdateContext, AnimationGraphUpdateContextGenerator, AnimationGraphEvaluationContext,
} from '../../animation-graph-context';
import { poseGraphNodeHide } from '../decorator/node';
import { PoseGraphType } from '../foundation/type-system';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeBlendTwoPoseBase`)
@poseGraphNodeHide(true)
export abstract class PoseNodeBlendTwoPoseBase extends PoseNode {
    @serializable
    @input({ type: PoseGraphType.POSE })
    pose0: PoseNode | null = null;

    @serializable
    @input({ type: PoseGraphType.POSE })
    pose1: PoseNode | null = null;

    @serializable
    @input({ type: PoseGraphType.FLOAT })
    @range([0.0, 1.0, 0.01])
    ratio = 1.0;

    public bind (context: AnimationGraphBindingContext): void {
        this.pose0?.bind(context);
        this.pose1?.bind(context);
    }

    public settle (context: AnimationGraphSettleContext): void {
        this.pose0?.settle(context);
        this.pose1?.settle(context);
    }

    public reenter (): void {
        this.pose0?.reenter();
        this.pose1?.reenter();
    }

    protected doUpdate (context: AnimationGraphUpdateContext): void {
        const {
            pose0,
            pose1,
            _updateContextGenerator: updateContextGenerator,
            ratio,
        } = this;
        {
            const updateContext = updateContextGenerator.generate(
                context.deltaTime,
                context.indicativeWeight * (1.0 - ratio),
            );
            pose0?.update(updateContext);
        }
        {
            const updateContext = updateContextGenerator.generate(
                context.deltaTime,
                context.indicativeWeight * (ratio),
            );
            pose1?.update(updateContext);
        }
    }

    public doEvaluate (context: AnimationGraphEvaluationContext): Pose {
        const spaceRequirement = PoseTransformSpaceRequirement.LOCAL;
        if (!this.pose0 || !this.pose1) {
            return PoseNodeBlendTwoPoseBase.evaluateDefaultPose(context, spaceRequirement);
        }

        const pose0 = this.pose0?.evaluate(context, spaceRequirement)
            ?? PoseNodeBlendTwoPoseBase.evaluateDefaultPose(context, spaceRequirement);
        const pose1 = this.pose1?.evaluate(context, spaceRequirement)
            ?? PoseNodeBlendTwoPoseBase.evaluateDefaultPose(context, spaceRequirement);

        this.doBlend(pose0, pose1, this.ratio);
        context.popPose();

        return pose0;
    }

    protected abstract doBlend(pose0: Pose, pose1: Pose, ratio: number): void;

    private _updateContextGenerator = new AnimationGraphUpdateContextGenerator();
}
