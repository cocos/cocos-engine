/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var EventTarget = require('../../cocos2d/core/event/event-target');
require('../../cocos2d/shape-nodes/CCDrawNode');

dragonBones.CCArmatureDisplay = cc.Class({
    name: 'dragonBones.CCArmatureDisplay',
    extends: _ccsg.Node,
    mixins: [EventTarget],

    ctor () {
        this._armature = null;
        this._debugDrawer = null;
    },

    _onClear : function () {
        this._armature = null;
    },

    _dispatchEvent : function (eventObject) {
        this.emit(eventObject.type, eventObject);
    },

    _debugDraw : function () {
        if (!this._armature) {
            return;
        }

        if (!this._debugDrawer) {
            this._debugDrawer = new cc.DrawNode();
            this.addChild(this._debugDrawer);
            this._debugDrawer.setDrawColor(cc.color(255, 0, 0, 255));
            this._debugDrawer.setLineWidth(1);
        }

        this._debugDrawer.clear();
        var bones = this._armature.getBones();
        for (var i = 0, l = bones.length; i < l; ++i) {
            var bone = bones[i];
            var boneLength = Math.max(bone.length, 5);
            var startX = bone.globalTransformMatrix.tx;
            var startY = -bone.globalTransformMatrix.ty;
            var endX = startX + bone.globalTransformMatrix.a * boneLength;
            var endY = startY - bone.globalTransformMatrix.b * boneLength;

            this._debugDrawer.drawSegment(cc.p(startX, startY), cc.p(endX, endY));
        }
    },

    update : function (passedTime) {
        if (this._armature) {
            this._armature.advanceTime(passedTime);
        }
    },

    advanceTimeBySelf : function (on) {
        if (on) {
            this.scheduleUpdate();
        } else {
            this.unscheduleUpdate();
        }
    },

    hasEvent : function(type) {
        return this.hasEventListener(type, false);
    },

    addEvent : function(type, listener, target) {
        this.on(type, listener, target);
    },

    removeEvent : function(type, listener, target) {
        this.off(type, listener, target);
    },

    dispose : function() {
        if (this._armature) {
            this.advanceTimeBySelf(false);
            this._armature.dispose();
            this._armature = null;
        }
    },

    armature : function() {
        return this._armature;
    },

    animation : function () {
        return this._armature.animation;
    },

    setDebugBones : function (debug) {
        dragonBones.DragonBones.debugDraw = debug;
        if (debug) {
            this.armature().advanceTime(0);
        } else {
            if (this._debugDrawer) {
                this._debugDrawer.clear();
            }
        }
    }
});
