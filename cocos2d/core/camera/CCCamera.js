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

let CameraNode;
if (!CC_JSB) {
    CameraNode = require('./CCSGCameraNode');
}
else {
    CameraNode = cc.CameraNode;
}

_ccsg.CameraNode = CameraNode;

let Camera = cc.Class({
    name: 'cc.Camera',
    extends: cc._RendererUnderSG,
    
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.others/Camera',
    },

    properties: {
        _targets: {
            default: function () {
                return [];
            },
            type: cc.Node,
            visible: true
        },

        zoomRatio: 1
    },

    _createSgNode: function () {
        return new CameraNode();
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
        let targets = this._targets;
        for (let i = 0, l = targets.length; i < l; i++) {
            this._addSgTargetInSg(targets[i]);
        }
    },

    onDisable: function () {
        let targets = this._targets;
        for (let i = 0, l = targets.length; i < l; i++) {
            this._removeTargetInSg(targets[i]);
        }
    },

    addTarget: function (target) {
        if (this._targets.indexOf(target) !== -1) {
            return;
        }

        this._addSgTargetInSg(target);
        this._targets.push(target);
    },

    removeTarget: function (target) {
        if (this._targets.indexOf(target) === -1) {
            return;
        }

        this._removeTargetInSg(target);
        cc.js.array.remove(this._targets, target);
    },

    getTargets: function () {
        return this._targets;
    },

    lateUpdate: !CC_EDITOR && function () {
        let center = cc.visibleRect.center;
        let pos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let zoomRatio = this.zoomRatio;
        pos.x = center.x - pos.x * zoomRatio;
        pos.y = center.y - pos.y * zoomRatio;
        this._sgNode.setTransform(pos, zoomRatio);
    }
});

module.exports = cc.Camera = Camera;
