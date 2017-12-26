/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const affineTrans = require('../value-types/CCAffineTransform');

var cullingDirtyFlag;
var _wt = affineTrans.make();

if (!CC_JSB) {
    cullingDirtyFlag = _ccsg.Node._dirtyFlags.cullingDirty;
    require('./CCSGCameraNode');
}

/**
 * !#en
 * Camera is usefull when making reel game or other games which need scroll screen.
 * Using camera will be more efficient than moving node to scroll screen.
 * Camera 
 * !#zh
 * 摄像机在制作卷轴或是其他需要移动屏幕的游戏时比较有用，使用摄像机将会比移动节点来移动屏幕更加高效。
 * @class Camera
 * @extends Component
 */
let Camera = cc.Class({
    name: 'cc.Camera',
    extends: cc.Component,
    
    ctor: function () {
        this.viewMatrix = cc.affineTransformMake();
        this.invertViewMatrix = cc.affineTransformMake();

        this._lastViewMatrix = cc.affineTransformMake();

        this._sgTarges = [];

        this._checkedTimes = 0;

        this.visibleRect = {
            left: cc.v2(),
            right: cc.v2(),
            top: cc.v2(),
            bottom: cc.v2()
        };
        this.viewPort = cc.rect();
    },

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.others/Camera',
        executeInEditMode: false
    },

    properties: {
        _targets: {
            default: [],
            type: cc.Node,
            visible: true
        },

        /**
         * !#en
         * The camera zoom ratio.
         * !#zh
         * 摄像机缩放比率
         * @property {Number} zoomRatio
         */
        zoomRatio: 1,
    },

    statics: {
        /**
         * !#en
         * Current active camera, the scene should only have one active camera at the same time.
         * !#zh
         * 当前激活的摄像机，场景中在同一时间内只能有一个激活的摄像机。
         * @property {Camera} main
         * @static
         */
        main: null
    },

    _createSgNode: function () {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            cc.errorID(8301);
            var sgNode = new _ccsg.Node();
            sgNode.setTransform = sgNode.addTarget = sgNode.removeTarget = function () {};
            return sgNode;
        }
        else {
            return new _ccsg.CameraNode();
        }
    },

    _initSgNode: function () {
        // sgNode is the sizeProvider of the node so we should sync its size with the node,
        // otherwise the node size will become zero.
        this._sgNode.setContentSize(this.node.getContentSize(true));
    },

    _addSgTargetInSg: function (target) {
        var sgNode;
        if (target instanceof cc.Node) {
            sgNode = target._sgNode;
        }
        else if (target instanceof _ccsg.Node) {
            sgNode = target;
        }

        if (!sgNode || sgNode._cameraInfo) return;

        sgNode._cameraInfo = {
            touched: this._checkedTimes
        };
        this._sgNode.addTarget(sgNode);

        this._sgTarges.push(sgNode);

        if (!CC_JSB) {
            var cmd = sgNode._renderCmd;
            cmd.setDirtyFlag(cullingDirtyFlag);
            cmd._cameraFlag = Camera.flags.InCamera;

            cc.rendererWebGL.childrenOrderDirty = true;
        }
    },

    _removeTargetInSg: function (target) {
        var sgNode;
        if (target instanceof cc.Node) {
            sgNode = target._sgNode;
        }
        else if (target instanceof _ccsg.Node) {
            sgNode = target;
        }

        if (!sgNode || !sgNode._cameraInfo) return;

        this._sgNode.removeTarget(sgNode);
        delete sgNode._cameraInfo;
        
        cc.js.array.remove(this._sgTarges, sgNode);
        
        if (!CC_JSB) {
            var cmd = sgNode._renderCmd;
            cmd.setDirtyFlag(cullingDirtyFlag);
            cmd._cameraFlag = 0;

            cc.rendererWebGL.childrenOrderDirty = true;
        }
    },

    onEnable: function () {
        if (Camera.main) {
            cc.errorID(8300);
            return;
        }

        Camera.main = this;
        if (CC_JSB) {
            this._sgNode.setEnable(true);
        }

        let targets = this._targets;
        for (let i = 0, l = targets.length; i < l; i++) {
            this._addSgTargetInSg(targets[i]);
        }
    },

    onDisable: function () {
        if (Camera.main !== this) {
            return;
        }
        
        Camera.main = null;
        if (CC_JSB) {
            this._sgNode.setEnable(false);
        }

        // target sgNode may changed, so directly remove sgTargets here.
        let sgTargets = this._sgTarges;
        for (let i = sgTargets.length - 1; i >= 0; i--) {
            this._removeTargetInSg(sgTargets[i]);
        }
    },

    /**
     * !#en
     * Add the specified target to camera.
     * !#zh
     * 将指定的节点添加到摄像机中。
     * @method addTarget
     * @param {Node} target 
     */
    addTarget: function (target) {
        if (this._targets.indexOf(target) !== -1) {
            return;
        }

        this._addSgTargetInSg(target);
        this._targets.push(target);
    },

    /**
     * !#en
     * Remove the specified target from camera.
     * !#zh
     * 将指定的节点从摄像机中移除。
     * @method removeTarget
     * @param {Node} target 
     */
    removeTarget: function (target) {
        if (this._targets.indexOf(target) === -1) {
            return;
        }

        this._removeTargetInSg(target);
        cc.js.array.remove(this._targets, target);
    },

    /**
     * !#en
     * Get all camera targets.
     * !#zh
     * 获取所有摄像机目标节点。
     * @method getTargets
     * @return {[Node]}
     */
    getTargets: function () {
        return this._targets;
    },

    /**
     * !#en
     * Returns the matrix that transform the node's (local) space coordinates into the camera's space coordinates.
     * !#zh
     * 返回一个将节点坐标系转换到摄像机坐标系下的矩阵
     * @method getNodeToCameraTransform
     * @param {Node} node - the node which should transform
     * @return {AffineTransform}
     */
    getNodeToCameraTransform (node) {
        let t = affineTrans.make();
        node.getNodeToWorldTransform(t);
        if (this.containsNode(node)) {
            t = affineTrans.concatIn(t, cc.Camera.main.viewMatrix);
        }
        return t;
    },

    /**
     * !#en
     * Conver a camera coordinates point to world coordinates.
     * !#zh
     * 将一个摄像机坐标系下的点转换到世界坐标系下。
     * @method getCameraToWorldPoint
     * @param {Node} point - the point which should transform
     * @return {Vec2}
     */
    getCameraToWorldPoint (point) {
        if (cc.Camera.main) {
            point = cc.pointApplyAffineTransform(point, cc.Camera.main.invertViewMatrix);
        }
        return point;
    },

    /**
     * !#en
     * Check whether the node is in the camera.
     * !#zh
     * 检测节点是否被此摄像机影响
     * @method containsNode
     * @param {Node} node - the node which need to check
     * @return {Boolean}
     */
    containsNode: function (node) {
        if (node instanceof cc.Node) {
            node = node._sgNode;
        }
        
        let targets = this._sgTarges;
        while (node) {
            if (targets.indexOf(node) !== -1) {
                return true;
            }
            node = node.parent;
        }

        return false;
    },

    _setSgNodesCullingDirty: function () {
        let sgTarges = this._sgTarges;
        for (let i = 0; i < sgTarges.length; i++) {
            if (CC_JSB) {
                sgTarges[i].markCullingDirty();
            }
            else {
                sgTarges[i]._renderCmd.setDirtyFlag(cullingDirtyFlag);
            }
        }
    },

    _checkSgTargets: function () {
        let targets = this._targets;
        let sgTarges = this._sgTarges;

        let checkedTimes = ++this._checkedTimes;

        for (let i = 0, l = targets.length; i < l; i++) {
            let target = targets[i];
            let sgNode = target;

            if (target instanceof cc.Node) {
                sgNode = target._sgNode;
                if (sgNode && !sgNode._cameraInfo) {
                    this._addSgTargetInSg(sgNode);
                }
            }

            if (sgNode) {
                sgNode._cameraInfo.touched = checkedTimes;
            }
        }

        for (let i = sgTarges.length - 1; i >= 0; i--) {
            let sgTarget = sgTarges[i];
            if (sgTarget._cameraInfo.touched !== checkedTimes) {
                this._removeTargetInSg(sgTarget);
            }
        }
    },

    lateUpdate: !CC_EDITOR && function () {
        this._checkSgTargets();

        let m = this.viewMatrix;
        let im = this.invertViewMatrix;
        let viewPort = this.viewPort;
        let visibleRect = cc.visibleRect;
        let selfVisibleRect = this.visibleRect;
        let node = this.node;
        
        node.getNodeToWorldTransformAR(_wt);

        let rotation = -(Math.atan2(_wt.b, _wt.a) + Math.atan2(-_wt.c, _wt.d)) * 0.5;
        let a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0;

        // rotation
        if (rotation) {
            c = Math.sin(rotation);
            d = Math.cos(rotation);
            a = d;
            b = -c;
        }

        // scale
        let zoomRatio = this.zoomRatio;
        a *= zoomRatio;
        b *= zoomRatio;
        c *= zoomRatio;
        d *= zoomRatio;

        m.a = a;
        m.b = b;
        m.c = c;
        m.d = d;

        // move camera to center
        let center = visibleRect.center;
        m.tx = center.x - (a * _wt.tx + c * _wt.ty);
        m.ty = center.y - (b * _wt.tx + d * _wt.ty);

        // calculate ivert view matrix
        cc.affineTransformInvertOut(m, im);

        // calculate view port
        viewPort.x = visibleRect.bottomLeft.x;
        viewPort.y = visibleRect.bottomLeft.y;
        viewPort.width = visibleRect.width;
        viewPort.height = visibleRect.height;
        cc._rectApplyAffineTransformIn(viewPort, im);

        selfVisibleRect.left.x = viewPort.xMin;
        selfVisibleRect.right.x = viewPort.xMax;
        selfVisibleRect.bottom.y = viewPort.yMin;
        selfVisibleRect.top.y = viewPort.yMax;

        this._sgNode.setTransform(a, b, c, d, m.tx, m.ty);

        // if view transform changed, then need recalculate whether targets need culling
        var lvm = this._lastViewMatrix;
        if (lvm.a !== m.a ||
            lvm.b !== m.b ||
            lvm.c !== m.c ||
            lvm.d !== m.d ||
            lvm.tx !== m.tx ||
            lvm.ty !== m.ty
            ) {
            this._setSgNodesCullingDirty();
            
            lvm.a = m.a;
            lvm.b = m.b;
            lvm.c = m.c;
            lvm.d = m.d;
            lvm.tx = m.tx;
            lvm.ty = m.ty;
        }
    }
});

Camera.flags = cc.Enum({
    InCamera: 1,
    ParentInCamera: 2
});

module.exports = cc.Camera = Camera;
