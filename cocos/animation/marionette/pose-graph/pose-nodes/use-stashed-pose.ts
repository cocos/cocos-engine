import { ccclass, editable, serializable } from '../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { RuntimeStash } from '../stash/runtime-stash';
import { PoseNode } from '../pose-node';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from '../../animation-graph-context';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeUseStashedPose`)
export class PoseNodeUseStashedPose extends PoseNode {
    @serializable
    @editable
    public stashName = '';

    public bind (context: AnimationGraphBindingContext) {
        const {
            stashName,
        } = this;

        // If stashName is empty, silently ignore.
        if (!stashName) {
            return;
        }

        const runtimeStash = context.stashView.bindStash(stashName);
        this._runtimeStash = runtimeStash;
    }

    public settle (context: AnimationGraphSettleContext): void {
    }

    public reenter () {
        this._runtimeStash?.reenter();
    }

    protected doUpdate (context: AnimationGraphUpdateContext): void {
        this._runtimeStash?.requestUpdate(context);
    }

    protected doEvaluate (context: AnimationGraphEvaluationContext) {
        return this._runtimeStash?.evaluate(context) ?? context.pushDefaultedPose();
    }

    private _runtimeStash: RuntimeStash | undefined = undefined;
}
