import { EDITOR } from 'internal:constants';
import { assertIsTrue } from '../../../../core';
import { ccclass, serializable } from '../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { PoseNode, PoseTransformSpaceRequirement } from '../pose-node';
import { blendPoseInto, Pose } from '../../../core/pose';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext, AnimationGraphUpdateContext, AnimationGraphUpdateContextGenerator } from '../../animation-graph-context';
import { StateMachine } from '../../animation-graph';
import { TopLevelStateMachineEvaluation } from '../../state-machine/state-machine-eval';
import { poseGraphNodeAppearance, poseGraphNodeCategory } from '../decorator/node';
import { POSE_GRAPH_NODE_MENU_PREFIX_POSE } from './menu-common';
import { input } from '../decorator/input';
import { PoseGraphType } from '../foundation/type-system';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeStateMachine`)
@poseGraphNodeCategory(POSE_GRAPH_NODE_MENU_PREFIX_POSE)
@poseGraphNodeAppearance({
    themeColor: '#CCCCCC',
    inline: true,
})
export class PoseNodeStateMachine extends PoseNode {
    @serializable
    public name = '';

    @serializable
    public stateMachine = new StateMachine();

    @serializable
    @input({ type: PoseGraphType.POSE })
    public emptyStatePose: PoseNode | null = null;

    /**
     * // TODO: HACK
     * @internal
     */
    public __callOnAfterDeserializeRecursive () {
        this.stateMachine.__callOnAfterDeserializeRecursive();
    }

    public bind (context: AnimationGraphBindingContext): void {
        assertIsTrue(!this._stateMachineEval);
        this._stateMachineEval = new TopLevelStateMachineEvaluation(
            this.stateMachine,
            '',
            context,
            null,
        );
        this.emptyStatePose?.bind(context);
    }

    public settle (context: AnimationGraphSettleContext) {
        this._stateMachineEval?.settle(context);
        this.emptyStatePose?.settle(context);
    }

    public reenter () {
        this._stateMachineEval?.reenter();
        this.emptyStatePose?.reenter();
    }

    protected doUpdate (context: AnimationGraphUpdateContext): void {
        const { _stateMachineEval: stateMachineEval } = this;
        assertIsTrue(stateMachineEval);
        stateMachineEval.update(context);
        if (this.emptyStatePose && stateMachineEval.passthroughWeight < (1.0 - 1e-5)) {
            const updateContext = this._updateContextGenerator.generate(
                context.deltaTime,
                context.indicativeWeight * (1.0 - stateMachineEval.passthroughWeight),
            );
            this.emptyStatePose.update(updateContext);
        }
    }

    public doEvaluate (context: AnimationGraphEvaluationContext): Pose {
        const { _stateMachineEval: stateMachineEval } = this;
        assertIsTrue(stateMachineEval);
        const stateMachinePose = stateMachineEval.evaluate(context);
        if (stateMachineEval.passthroughWeight < (1.0 - 1e-5)) {
            const emptyStatePose = this.emptyStatePose?.evaluate(context, PoseTransformSpaceRequirement.LOCAL)
                ?? PoseNodeStateMachine.evaluateDefaultPose(context, PoseTransformSpaceRequirement.LOCAL);
            blendPoseInto(stateMachinePose, emptyStatePose, 1.0 - stateMachineEval.passthroughWeight);
            context.popPose();
        }
        return stateMachinePose;
    }

    private _stateMachineEval: TopLevelStateMachineEvaluation | undefined;
    private _updateContextGenerator = new AnimationGraphUpdateContextGenerator();
}

if (EDITOR) {
    PoseNodeStateMachine.prototype.getTitle = function getTitle (this: PoseNodeStateMachine) {
        if (this.name) {
            return this.name;
        }
        return undefined;
    };

    PoseNodeStateMachine.prototype.getEnterInfo = function getEnterInfo (this: PoseNodeStateMachine) {
        return {
            type: 'state-machine',
            target: this.stateMachine,
        };
    };
}
