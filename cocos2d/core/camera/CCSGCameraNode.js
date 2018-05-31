/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var tempMat = new cc.math.Matrix4();

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
        let info = target._cameraInfo;
        info.sgCameraNode = this;
        info.originVisit = target.visit;

        target.visit = this._visit;
    },

    removeTarget: function (target) {
        target.visit = target._cameraInfo.originVisit;
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

        cc.math.glMatrixMode(cc.math.KM_GL_PROJECTION);
        
        tempMat.assignFrom(cc.current_stack.top);
        tempMat.multiply(this._mat);
        cc.current_stack.push(tempMat);
    },

    _onAfterVisit: function () {
        cc.renderer._breakBatch();
        
        cc.math.glMatrixMode(cc.math.KM_GL_PROJECTION);
        cc.current_stack.pop();
    },

});

module.exports = _ccsg.CameraNode = CameraNode;
