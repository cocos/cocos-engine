import { EDITOR } from 'internal:constants';
import { assertIsTrue } from '../../../../core';
import { ccclass, serializable } from '../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { PoseNode } from '../pose-node';
import { Pose } from '../../../core/pose';
import {
    AnimationGraphBindingContext, AnimationGraphEvaluationContext,
    AnimationGraphSettleContext, AnimationGraphUpdateContext,
} from '../../animation-graph-context';
import { StateMachine } from '../../animation-graph';
import { TopLevelStateMachineEvaluation } from '../../state-machine/state-machine-eval';
import { poseGraphNodeAppearance, poseGraphNodeCategory } from '../decorator/node';
import { POSE_GRAPH_NODE_MENU_PREFIX_POSE } from './menu-common';
import type { EnterNodeInfo } from '../foundation/authoring/enter-node-info';

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
    public stateMachine = new StateMachine(false);

    /**
     * // TODO: HACK
     * @internal
     */
    public __callOnAfterDeserializeRecursive (): void {
        this.stateMachine._allowEmptyStates = false;
        this.stateMachine.__callOnAfterDeserializeRecursive();
    }

    public bind (context: AnimationGraphBindingContext): void {
        assertIsTrue(!this._stateMachineEval);
        this._stateMachineEval = new TopLevelStateMachineEvaluation(
            this.stateMachine,
            '',
            context,
        );
    }

    public settle (context: AnimationGraphSettleContext): void {
        this._stateMachineEval?.settle(context);
    }

    public reenter (): void {
        this._stateMachineEval?.reenter();
    }

    protected doUpdate (context: AnimationGraphUpdateContext): void {
        const { _stateMachineEval: stateMachineEval } = this;
        assertIsTrue(stateMachineEval);
        stateMachineEval.update(context);
        assertIsTrue(stateMachineEval.passthroughWeight > (1.0 - 1e-5));
    }

    public doEvaluate (context: AnimationGraphEvaluationContext): Pose {
        const { _stateMachineEval: stateMachineEval } = this;
        assertIsTrue(stateMachineEval);
        const stateMachinePose = stateMachineEval.evaluate(context);
        assertIsTrue(stateMachineEval.passthroughWeight > (1.0 - 1e-5));
        return stateMachinePose;
    }

    private _stateMachineEval: TopLevelStateMachineEvaluation | undefined;
}

if (EDITOR) {
    PoseNodeStateMachine.prototype.getTitle = function getTitle (this: PoseNodeStateMachine): string | [string, Record<string, string>] | undefined {
        if (this.name) {
            return this.name;
        }
        return undefined;
    };

    PoseNodeStateMachine.prototype.getEnterInfo = function getEnterInfo (this: PoseNodeStateMachine): EnterNodeInfo | undefined {
        return {
            type: 'state-machine',
            target: this.stateMachine,
        };
    };
}
