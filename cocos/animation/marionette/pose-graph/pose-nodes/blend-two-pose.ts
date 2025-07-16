import { ccclass } from '../../../../core/data/decorators';
import { blendPoseInto, Pose } from '../../../core/pose';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';
import { poseGraphNodeAppearance, poseGraphNodeCategory } from '../decorator/node';
import { POSE_GRAPH_NODE_MENU_PREFIX_POSE_BLEND } from './menu-common';
import { PoseNodeBlendTwoPoseBase } from './blend-two-pose-base';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseNodeBlendTwoPose`)
@poseGraphNodeCategory(POSE_GRAPH_NODE_MENU_PREFIX_POSE_BLEND)
@poseGraphNodeAppearance({ themeColor: '#72A869' })
export class PoseNodeBlendTwoPose extends PoseNodeBlendTwoPoseBase {
    protected doBlend (pose0: Pose, pose1: Pose, ratio: number): void {
        return blendPoseInto(pose0, pose1, ratio);
    }
}
