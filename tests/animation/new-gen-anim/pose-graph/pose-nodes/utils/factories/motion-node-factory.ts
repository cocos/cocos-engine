
import { Motion } from '../../../../../../../cocos/animation/marionette/motion';
import { PoseNodePlayMotion } from '../../../../../../../cocos/animation/marionette/pose-graph/pose-nodes/play-motion';
import '../../../../utils/factory';
import { addPoseNodeFactory, createMotion, MotionParams } from '../../../../utils/factory';

declare global {
    interface PoseNodeFactoryRegistry {
        'motion': {
            motion: Motion | MotionParams;
            syncInfo?: {
                group: string;
            };
        };
    }
}

addPoseNodeFactory('motion', (poseGraph, params) => {
    const node = new PoseNodePlayMotion();
    node.motion = params.motion instanceof Motion ? params.motion : createMotion(params.motion);
    if (params.syncInfo) {
        node.syncInfo.group = params.syncInfo.group;
    }
    return poseGraph.addNode(node);
});