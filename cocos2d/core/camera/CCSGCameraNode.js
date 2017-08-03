
let CameraNode = _ccsg.Node.extend({
    ctor: function () {
        this._super();

        this._mat = new cc.math.Matrix4();
        this._mat.identity();

        this._beforeVisitCmd = new cc.CustomRenderCmd(this, this._onBeforeVisit);
        this._afterVisitCmd = new cc.CustomRenderCmd(this, this._onAfterVisit);
    },

    setTransform: function (a, b, c, d, tx, ty) {
        let mat = this._mat.mat;

        mat[0] = a;
        mat[1] = b;
        mat[4] = c;
        mat[5] = d;
        mat[12] = tx;
        mat[13] = ty;
    },

    addTarget: function (target) {
        if (target._cameraInfo) return;

        target._cameraInfo = {
            sgCameraNode: this,
            originVisit: target.visit
        };

        target.visit = this._visit;
    },

    removeTarget: function (target) {
        let info = target._cameraInfo;
        if (!info) return;
        
        target.visit = info.originVisit;
        target._cameraInfo = undefined;
    },

    _visit: function (parent) {
        let info = this._cameraInfo;
        let sgCameraNode = info.sgCameraNode;

        cc.renderer.pushRenderCommand(sgCameraNode._beforeVisitCmd);
        info.originVisit.call(this, parent);
        cc.renderer.pushRenderCommand(sgCameraNode._afterVisitCmd);
    },

    _onBeforeVisit: function () {
        cc.renderer._breakBatch();

        cc.math.glMatrixMode(cc.math.KM_GL_PROJECTION)
        cc.current_stack.push();
        cc.current_stack.top.multiply(this._mat);
    },

    _onAfterVisit: function () {
        cc.renderer._breakBatch();
        
        cc.math.glMatrixMode(cc.math.KM_GL_PROJECTION)
        cc.current_stack.pop();
    },

});

module.exports = _ccsg.CameraNode = CameraNode;
