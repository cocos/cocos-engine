require('./CCMesh');
if (!CC_EDITOR || !Editor.isMainProcess) {
    require('./CCMeshRenderer');
    require('./mesh-renderer');
}
