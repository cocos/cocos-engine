import { EDITOR } from 'internal:constants';
import { warn } from '../../../../core';
import { ccclass, editable, serializable } from '../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { PoseGraphCreateNodeFactory, poseGraphCreateNodeFactory, poseGraphNodeAppearance, poseGraphNodeCategory } from '../decorator/node';
import { POSE_GRAPH_NODE_MENU_PREFIX_POSE } from './menu-common';
import { RuntimeStash } from '../stash/runtime-stash';
import { PoseNode } from '../pose-node';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from '../../animation-graph-context';

const createNodeFactory: PoseGraphCreateNodeFactory<string> = {
    // eslint-disable-next-line arrow-body-style
    listEntries: (context) => {
        // eslint-disable-next-line arrow-body-style
        return [...context.animationGraph.layers[context.layerIndex].stashes()].map(([stashId]) => {
            return {
                arg: stashId,
                menu: stashId,
            };
        });
    },

    create: (arg) => {
        const node = new PoseNodeUseStashedPose();
        node.stashName = arg;
        return node;
    },
};

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeUseStashedPose`)
@poseGraphNodeCategory(POSE_GRAPH_NODE_MENU_PREFIX_POSE)
@poseGraphCreateNodeFactory(createNodeFactory)
@poseGraphNodeAppearance({ inline: true })
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

if (EDITOR) {
    PoseNodeUseStashedPose.prototype.getTitle = function getTitle (this: PoseNodeUseStashedPose) {
        if (this.stashName) {
            return [`ENGINE.classes.${CLASS_NAME_PREFIX_ANIM}PoseNodeUseStashedPose.title`, { stashName: this.stashName }];
        }
        return undefined;
    };

    PoseNodeUseStashedPose.prototype.getEnterInfo = function getTitle (this: PoseNodeUseStashedPose) {
        return {
            type: 'stash',
            stashName: this.stashName,
        };
    };
}
