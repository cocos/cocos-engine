
let _mat4_tmp = cc.vmath.mat4.create();
let _rect_tmp = cc.rect();

function cullingNode (node) {
    node.getWorldMatrix(_mat4_tmp);

    let size = node._contentSize;
    let anchor = node._anchorPoint;

    _rect_tmp.x = -anchor.x * size.width;
    _rect_tmp.y = -anchor.y * size.height;
    _rect_tmp.width = size.width;
    _rect_tmp.height = size.height;
    cc.Rect.transformMat4(_rect_tmp, _rect_tmp, _mat4_tmp);

    let minax = _rect_tmp.x,
        minay = _rect_tmp.y,
        maxax = minax + _rect_tmp.width,
        maxay = minay + _rect_tmp.height;
    
    let minbx, minby, maxbx, maxby;

    let camera = cc.Camera.findCamera(node);
    if (camera) {
        let rect = camera.viewPort;
        minbx = rect.x;
        minby = rect.y;
        maxbx = minbx + rect.width;
        maxby = minby + rect.height;
    }
    else {
        let rect = cc.visibleRect;
        minbx = rect.bottomLeft.x;
        minby = rect.bottomLeft.y;
        maxbx = rect.topRight.x;
        maxby = rect.topRight.y;
    }

    if (!(maxax < minbx || maxbx < minax || maxay < minby || maxby < minay)) {
        return false;
    }

    return true;
}

module.exports = {
    cullingNode: cullingNode
};
