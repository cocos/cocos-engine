import { EDITOR } from 'internal:constants';
import { ccclass, serializable } from '../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../define';
import { PoseNode } from './pose-node';
import { PoseGraphType } from './foundation/type-system';
import { PoseGraphNode } from './foundation/pose-graph-node';
import { poseGraphNodeAppearance } from './decorator/node';
import { inputUnchecked } from './decorator/input';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseGraphOutputNode`)
@poseGraphNodeAppearance({
    themeColor: '#CD3A58',
    inline: true,
})
export class PoseGraphOutputNode extends PoseGraphNode {
    // Don't use @input since it requires the owner class being subclass of `PoseNode`.
    @serializable
    @inputUnchecked({ type: PoseGraphType.POSE })
    pose: PoseNode | null = null;
}
