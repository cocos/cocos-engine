
import { registerCreatePoseNodeOnAssetDragHandler } from '../registry';
import { PoseNodePlayMotion } from '../../../../../../cocos/animation/marionette/pose-graph/pose-nodes/play-motion';
import { ClipMotion } from '../../../../../../cocos/animation/marionette/motion';
import { AnimationClip } from '../../../../../../cocos/animation/animation-clip';

registerCreatePoseNodeOnAssetDragHandler(AnimationClip, {
    displayName: 'i18n:ENGINE.classes.cc.animation.PoseNodePlayMotion.createPoseNodeOnAssetDragHandler.displayName',
    handle: (asset) => {
        const node = new PoseNodePlayMotion();
        const clipMotion = node.motion = new ClipMotion();
        clipMotion.clip = asset;
        return node;
    },
});
