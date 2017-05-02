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

if (!CC_JSB) {
    require('./CCSGCameraNode');
}

let tempTransform = cc.affineTransformMake();

/**
 * !#en
 * Camera is usefull when making reel game or other games which need scroll screen.
 * Using camera will be more efficient than moving node to scroll screen.
 * Camera 
 * !#zh
 * 摄像机在制作卷轴或是其他需要移动屏幕的游戏时比较有用，使用摄像机将会比移动节点来移动屏幕更加高效。
 * @class Camera
 * @extends _RendererUnderSG
 */
let Camera = cc.Class({
    name: 'cc.Camera',
    extends: cc._RendererUnderSG,
    
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

    _initSgNode: function () {},

    _addSgTargetInSg: function (target) {
        if (target instanceof cc.Node) {
            this._sgNode.addTarget(target._sgNode);
        }
        else if (target instanceof _ccsg.Node) {
            this._sgNode.addTarget(target);
        }
    },

    _removeTargetInSg: function (target) {
        if (target instanceof cc.Node) {
            this._sgNode.removeTarget(target._sgNode);
        }
        else if (target instanceof _ccsg.Node) {
            this._sgNode.removeTarget(target);
        }
    },

    onEnable: function () {
        if (Camera.main) {
            cc.errorID(8300);
            return;
        }

        Camera.main = this;

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

        let targets = this._targets;
        for (let i = 0, l = targets.length; i < l; i++) {
            this._removeTargetInSg(targets[i]);
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

    calculateCaemraTransformIn: function (transform) {
        let node = this.node;
        
        let wt = node.getNodeToWorldTransform();
        let rotation = -(Math.atan2(wt.b, wt.a) + Math.atan2(-wt.c, wt.d)) * 0.5;

        let a = 1, b = 0, c = 0, d = 1;

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

        // move camera to center
        let center = cc.visibleRect.center;
        transform.tx = center.x - (a * wt.tx + c * wt.ty);
        transform.ty = center.y - (b * wt.tx + d * wt.ty);

        transform.a = a;
        transform.b = b;
        transform.c = c;
        transform.d = d;
    },

    lateUpdate: !CC_EDITOR && function () {
        let t = tempTransform;
        this.calculateCaemraTransformIn(t);
        this._sgNode.setTransform(t.a, t.b, t.c, t.d, t.tx, t.ty);
    }
});

module.exports = cc.Camera = Camera;
