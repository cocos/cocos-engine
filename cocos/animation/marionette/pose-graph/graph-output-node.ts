import { EDITOR } from 'internal:constants';
import { ccclass, serializable } from '../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../define';
import { PoseNode } from './pose-node';
import { PoseGraphType } from './foundation/type-system';
import { PoseGraphNode } from './foundation/pose-graph-node';
import { globalNodeInputManager } from './foundation/authoring/input-authoring';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseGraphOutputNode`)
export class PoseGraphOutputNode extends PoseGraphNode {
    // Don't use @input since it requires the owner class being subclass of `PoseNode`.
    @serializable
    pose: PoseNode | null = null;
}

globalNodeInputManager.setPropertyNodeInputRecord(PoseGraphOutputNode, 'pose', {
    type: PoseGraphType.POSE,
});

if (EDITOR) {
    PoseGraphOutputNode.prototype.getTitle = function getTitle (this: PoseGraphOutputNode) {
        return '输出姿势';
    };
}
