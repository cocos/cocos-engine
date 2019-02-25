
if (!CC_TEST && (!CC_EDITOR || !Editor.isMainProcess)) {
    require('./polyfill-3d');
    require('./geom-utils');
    require('./primitive');
}

require('./CCModel');
require('./CCSkeleton');
require('./CCSkeletonAnimationClip');
require('./actions');

if (!CC_EDITOR || !Editor.isMainProcess) {
    require('./CCSkeletonAnimation');
    require('./CCSkinnedMeshRenderer');
    require('./CCLightComponent');
}
