
if (!CC_TEST && (!CC_EDITOR || !Editor.isMainProcess)) {
    require('./polyfill-3d');
}

require('./CCModel');
require('./CCSkeletonAnimationClip');

if (!CC_EDITOR || !Editor.isMainProcess) {
    require('./CCSkeletonAnimation');
    require('./CCSkinnedMeshRenderer');
}
