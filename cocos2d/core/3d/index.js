
if (!CC_TEST && (!CC_EDITOR || !Editor.isMainProcess)) {
    require('./polyfill-3d');
    require('./geom-utils');
}

require('./CCModel');
require('./CCSkeleton');
require('./CCSkeletonAnimationClip');
require('./CCModelMeshResource');

if (!CC_EDITOR || !Editor.isMainProcess) {
    require('./CCSkeletonAnimation');
    require('./CCSkinnedMeshRenderer');
}
