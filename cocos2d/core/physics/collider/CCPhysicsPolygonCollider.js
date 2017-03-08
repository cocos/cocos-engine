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
 
var CC_PTM_RATIO = cc.PhysicsManager.CC_PTM_RATIO;
var PolygonSeprator = require('../CCPolygonSeprator');

var PhysicsPolygonCollider = cc.Class({
    name: 'cc.PhysicsPolygonCollider',
    extends: cc.PolygonCollider,
    mixins: [cc.PhysicsCollider],

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.physics/Collider/Polygon',
        inspector: 'packages://inspector/inspectors/comps/physics/points-base-collider.js',
    },

    properties: cc.PhysicsCollider.properties,

    _createShape: function (scale, transform) {
        var shapes = [];

        var points = this.points;
        var ret = PolygonSeprator.validate(points);

        if (ret === 2) {
            points = points.revert();
            ret = PolygonSeprator.validate(points);
        }

        if (ret === 0) {
            var polys = PolygonSeprator.calcShapes(points);

            for (var i = 0; i < polys.length; i++) {
                var poly = polys[i];

                var shape = new b2.PolygonShape();
                var vertices = [];
                
                for (var j = 0; j < poly.length; j++) {
                    var p = poly[j];
                    if (transform) {
                        p = cc.pointApplyAffineTransform(p, transform);
                    }
                    vertices.push( new b2.Vec2(p.x/CC_PTM_RATIO*scale.x, p.y/CC_PTM_RATIO*scale.y) );
                }

                shape.Set(vertices, vertices.length);
                shapes.push(shape);
            }
        }
        else {
            console.log("Failed to create convex polygon : " + ret);
        }

        return shapes;
    }
});

cc.PhysicsPolygonCollider = module.exports = PhysicsPolygonCollider;
