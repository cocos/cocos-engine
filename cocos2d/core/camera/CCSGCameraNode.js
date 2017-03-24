let tempMatrix = new cc.math.Matrix4();

let CameraNode = _ccsg.Node.extend({
    ctor: function () {
        this._super();

        this._mat = new cc.math.Matrix4();
        this._mat.identity();
    },

    setTransform: function (vec, zoom) {
        let mat = this._mat;

        // reset matrix
        tempMatrix.identity();
        mat.identity();

        // set zoom
        tempMatrix.mat[0] = zoom;
        tempMatrix.mat[5] = zoom;
        tempMatrix.mat[10] = zoom;

        // set x,y
        tempMatrix.mat[12] = vec.x;
        tempMatrix.mat[13] = vec.y;

        mat.multiply(tempMatrix);
    },

    addTarget: function (target) {
        if (target.__cameraInfo) return;

        target.__cameraInfo = {
            sgCameraNode: this,
            originVisit: target.visit
        };

        target.visit = this._visit;
    },

    removeTarget: function (target) {
        let info = target.__cameraInfo;
        if (!info) return;
        
        target.visit = info.originVisit;
        target.__cameraInfo = undefined;
    },

    _visit: function (parent) {
        let info = this.__cameraInfo;
        let sgCameraNode = info.sgCameraNode;

        let beforeVisitCmd = new cc.CustomRenderCmd(sgCameraNode, sgCameraNode._onBeforeVisit);
        let afterVisitCmd = new cc.CustomRenderCmd(sgCameraNode, sgCameraNode._onAfterVisit);

        cc.renderer.pushRenderCommand(beforeVisitCmd);
        info.originVisit.call(this, parent);
        cc.renderer.pushRenderCommand(afterVisitCmd);
    },

    _onBeforeVisit: function () {
        cc.renderer._breakBatch();

        cc.math.glMatrixMode(cc.math.KM_GL_PROJECTION)
        cc.current_stack.push();
        cc.current_stack.top.multiply(this._mat);
    },

    _onAfterVisit: function () {
        cc.math.glMatrixMode(cc.math.KM_GL_PROJECTION)
        cc.current_stack.pop();
    },

});

module.exports = CameraNode;
