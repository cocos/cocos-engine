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

let ONE_DEGREE = Math.PI / 180;

let cameraExists = false;
let tempTransform = cc.affineTransformMake();

let Camera = cc.Class({
    name: 'cc.Camera',
    extends: cc._RendererUnderSG,
    
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.others/Camera',
    },

    properties: {
        _targets: {
            default: [],
            type: cc.Node,
            visible: true
        },

        zoomRatio: 1,
    },

    _createSgNode: function () {
        return new _ccsg.CameraNode();
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
        if (cameraExists) {
            cc.warnID('8300');
            return;
        }

        cameraExists = true;

        let targets = this._targets;
        for (let i = 0, l = targets.length; i < l; i++) {
            this._addSgTargetInSg(targets[i]);
        }
    },

    onDisable: function () {
        cameraExists = false;

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

    calculateCaemraTransformIn: function (transform) {
        let node = this.node;
        
        // calculate world position
        let pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO);

        // calculate world rotation
        let rotation = node.rotation;
        let parent = node.parent;
        while (parent){
            rotation += parent.rotation;
            parent = parent.parent;
        }

        let a = 1, b = 0, c = 0, d = 1;

        // rotation
        if (rotation) {
            rotation = rotation * ONE_DEGREE;
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
        transform.tx = center.x - (a * pos.x + c * pos.y);
        transform.ty = center.y - (b * pos.x + d * pos.y);

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
