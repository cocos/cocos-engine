import { EDITOR } from 'internal:constants';
import { ccclass, editable, serializable, type } from '../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { PoseTransformSpaceRequirement } from '../pose-node';
import { ccenum } from '../../../../core';
import { TransformHandle } from '../../../core/animation-handle';
import { poseGraphNodeAppearance, poseGraphNodeCategory } from '../decorator/node';
import { POSE_GRAPH_NODE_MENU_PREFIX_POSE } from './menu-common';
import { Pose } from '../../../core/pose';
import { PoseNodeModifyPoseBase } from './modify-pose-base';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext } from '../../animation-graph-context';
import { Transform } from '../../../core/transform';

const cacheTransform = new Transform();

export enum CopySpace {
    /**
     * Transforms are stored relative to their parent nodes.
     */
    LOCAL,

    /**
     * Transforms are stored relative to the belonging animation controller's node's space.
     */
    COMPONENT,
}
ccenum(CopySpace);

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeCopyTransform`)
@poseGraphNodeCategory(POSE_GRAPH_NODE_MENU_PREFIX_POSE)
@poseGraphNodeAppearance({ themeColor: '#72A869' })
export class PoseNodeCopyTransform extends PoseNodeModifyPoseBase {
    @serializable
    @editable
    public sourceNodeName = '';

    @serializable
    @editable
    public targetNodeName = '';

    @serializable
    @editable
    @type(CopySpace)
    public space: CopySpace = CopySpace.COMPONENT;

    public bind (context: AnimationGraphBindingContext): void {
        super.bind(context);
        const sourceTransformHandle = context.bindTransformByName(this.sourceNodeName);
        const targetTransformHandle = context.bindTransformByName(this.targetNodeName);
        if (!sourceTransformHandle || !targetTransformHandle) {
            sourceTransformHandle?.destroy();
            targetTransformHandle?.destroy();
            return;
        }
        this._workspace = new Workspace(
            sourceTransformHandle,
            targetTransformHandle,
        );
    }

    protected modifyPose (context: AnimationGraphEvaluationContext, inputPose: Pose): void {
        const {
            _workspace: workspace,
        } = this;
        if (!workspace) {
            return;
        }
        const {
            hSource: { index: sourceTransformIndex },
            hTarget: { index: targetTransformIndex },
        } = workspace;
        const transform = inputPose.transforms.getTransform(sourceTransformIndex, cacheTransform);
        inputPose.transforms.setTransform(targetTransformIndex, transform);
    }

    protected getPoseTransformSpaceRequirement (): PoseTransformSpaceRequirement {
        return this.space === CopySpace.COMPONENT ? PoseTransformSpaceRequirement.COMPONENT : PoseTransformSpaceRequirement.LOCAL;
    }

    private _workspace: Workspace | undefined = undefined;
}

class Workspace {
    constructor (
        public hSource: TransformHandle,
        public hTarget: TransformHandle,
    ) {
    }
}

if (EDITOR) {
    PoseNodeCopyTransform.prototype.getTitle = function getTitle (this: PoseNodeCopyTransform): string | [string, Record<string, string>] | undefined {
        if (this.sourceNodeName && this.targetNodeName) {
            return [`ENGINE.classes.${CLASS_NAME_PREFIX_ANIM}PoseNodeCopyTransform.title`, {
                sourceNodeName: this.sourceNodeName,
                targetNodeName: this.targetNodeName,
            }];
        }
        return undefined;
    };
}
