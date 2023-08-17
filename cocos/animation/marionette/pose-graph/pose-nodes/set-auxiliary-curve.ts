import { EDITOR } from 'internal:constants';
import { ccclass, editable, serializable, type } from '../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { ccenum } from '../../../../core';
import { AuxiliaryCurveHandle } from '../../../core/animation-handle';
import { input } from '../decorator/input';
import { poseGraphNodeCategory } from '../decorator/node';
import { POSE_GRAPH_NODE_MENU_PREFIX_POSE } from './menu-common';
import { Pose } from '../../../core/pose';
import { PoseNodeModifyPoseBase } from './modify-pose-base';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext } from '../../animation-graph-context';
import { PoseGraphType } from '../foundation/type-system';
import { PoseTransformSpaceRequirement } from '../pose-node';

enum SetAuxiliaryCurveFlag {
    LEAVE_UNCHANGED,

    REPLACE,

    ADD,
}

ccenum(SetAuxiliaryCurveFlag);

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeSetAuxiliaryCurve`)
@poseGraphNodeCategory(POSE_GRAPH_NODE_MENU_PREFIX_POSE)
export class PoseNodeSetAuxiliaryCurve extends PoseNodeModifyPoseBase {
    @serializable
    @editable
    public curveName = '';

    @serializable
    @editable
    @input({ type: PoseGraphType.FLOAT })
    public curveValue = 0.0;

    @serializable
    @editable
    @type(SetAuxiliaryCurveFlag)
    public flag = SetAuxiliaryCurveFlag.REPLACE;

    public bind (context: AnimationGraphBindingContext): void {
        super.bind(context);
        if (this.curveName) {
            this._handle = context.bindAuxiliaryCurve(this.curveName);
        }
    }

    protected getPoseTransformSpaceRequirement (): PoseTransformSpaceRequirement {
        return PoseTransformSpaceRequirement.NO;
    }

    protected modifyPose (context: AnimationGraphEvaluationContext, inputPose: Pose): void {
        const {
            _handle: handle,
        } = this;
        if (!handle) {
            return;
        }
        switch (this.flag) {
        case SetAuxiliaryCurveFlag.REPLACE:
            inputPose.auxiliaryCurves[handle.index] = this.curveValue;
            break;
        case SetAuxiliaryCurveFlag.ADD:
            inputPose.auxiliaryCurves[handle.index] += this.curveValue;
            break;
        case SetAuxiliaryCurveFlag.LEAVE_UNCHANGED:
        default:
            break;
        }
    }

    private _handle: AuxiliaryCurveHandle | undefined = undefined;
}

if (EDITOR) {
    PoseNodeSetAuxiliaryCurve.prototype.getTitle = function getTitle (this: PoseNodeSetAuxiliaryCurve): string | [string, Record<string, string>] | undefined {
        if (!this.curveName) {
            return undefined;
        }
        return [`ENGINE.classes.${CLASS_NAME_PREFIX_ANIM}PoseNodeSetAuxiliaryCurve.title`, { curveName: this.curveName }];
    };
}
