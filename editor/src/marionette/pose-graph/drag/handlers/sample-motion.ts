
import { registerCreatePoseNodeOnAssetDragHandler } from '../registry';
import { PoseNodeSampleMotion } from '../../../../../../cocos/animation/marionette/pose-graph/pose-nodes/sample-motion';
import { ClipMotion } from '../../../../../../cocos/animation/marionette/motion';
import { AnimationClip } from '../../../../../../cocos/animation/animation-clip';

registerCreatePoseNodeOnAssetDragHandler(AnimationClip, {
    displayName: 'i18n:ENGINE.classes.cc.animation.PoseNodeSampleMotion.createPoseNodeOnAssetDragHandler.displayName',
    handle: (asset) => {
        const node = new PoseNodeSampleMotion();
        const clipMotion = node.motion = new ClipMotion();
        clipMotion.clip = asset;
        return node;
    },
});
