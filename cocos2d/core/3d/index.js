
if (!CC_TEST && (!CC_EDITOR || !Editor.isMainProcess)) {
    require('./primitive');
    require('./physics/exports/physics-builtin');
    require('./physics/exports/physics-cannon');
    require('./physics/exports/physics-framework');
}

require('./CCModel');
require('./skeleton/CCSkeleton');
require('./skeleton/CCSkeletonAnimationClip');
require('./actions');
require('./physics/framework/assets/physics-material');

if (!CC_EDITOR || !Editor.isMainProcess) {
    require('./skeleton/CCSkeletonAnimation');
    require('./skeleton/CCSkinnedMeshRenderer');
    require('./skeleton/skinned-mesh-renderer');
    require('./CCLightComponent');
    require('./particle/particle-system-3d');
    require('./particle/renderer/particle-system-3d-renderer');
}
