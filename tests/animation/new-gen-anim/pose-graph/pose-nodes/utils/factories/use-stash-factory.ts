
import { PoseNodeUseStashedPose } from '../../../../../../../cocos/animation/marionette/pose-graph/pose-nodes/use-stashed-pose';
import '../../../../utils/factory';
import { addPoseNodeFactory } from '../../../../utils/factory';

declare global {
    interface PoseNodeFactoryRegistry {
        'use-stash': {
            stashId: string;
        };
    }
}

addPoseNodeFactory('use-stash', (poseGraph, params) => {
    const node = new PoseNodeUseStashedPose();
    node.stashName = params.stashId;
    return poseGraph.addNode(node);
});