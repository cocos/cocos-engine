
if (!CC_TEST && (!CC_EDITOR || !Editor.isMainProcess)) {
    require('./polyfill-3d');
    require('./geom-utils');
    require('./primitive');
}

require('./CCModel');
require('./skeleton/CCSkeleton');
require('./skeleton/CCSkeletonAnimationClip');
require('./actions');

if (!CC_EDITOR || !Editor.isMainProcess) {
    require('./skeleton/CCSkeletonAnimation');
    require('./skeleton/CCSkinnedMeshRenderer');
    require('./CCLightComponent');
}
