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

var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;

var PhysicsChainCollider = cc.Class({
    name: 'cc.PhysicsChainCollider',
    extends: cc.Collider,
    mixins: [cc.PhysicsCollider],

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.physics/Collider/Chain',
        inspector: 'packages://inspector/inspectors/comps/physics/points-base-collider.js',
    },

    properties: cc.js.mixin({
        loop: false,
        points: {
            default: function () {
                 return [cc.v2(-50, 0), cc.v2(50, 0)];
            },
            type: [cc.Vec2]
        },

        threshold: {
            default: 1,
            serializable: false,
            visible: false
        },
    }, cc.PhysicsCollider.properties),

    _createShape: function (scale, transform) {
        var shape = new b2.ChainShape();

        var points = this.points;
        var vertices = [];
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            if (transform) {
                p = cc.pointApplyAffineTransform(p, transform);
            }
            vertices.push( new b2.Vec2(p.x/PTM_RATIO*scale.x, p.y/PTM_RATIO*scale.y) );
        }

        if (this.loop) {
            shape.CreateLoop(vertices, vertices.length);
        }
        else {
            shape.CreateChain(vertices, vertices.length);
        }
        return shape;
    },

    resetInEditor: CC_EDITOR && function () {
        this.resetPointsByContour();
    },

    resetPointsByContour: CC_EDITOR && function () {
        _Scene.PhysicsUtils.resetPoints(this, {threshold: this.threshold, loop: this.loop});
    }
});

cc.PhysicsChainCollider = module.exports = PhysicsChainCollider;
