/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 
var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;
var PolygonSeparator = require('../CCPolygonSeparator');

/**
 * @class PhysicsPolygonCollider
 * @extends PhysicsCollider
 * @uses Collider.Polygon
 */
var PhysicsPolygonCollider = cc.Class({
    name: 'cc.PhysicsPolygonCollider',
    extends: cc.PhysicsCollider,
    mixins: [cc.Collider.Polygon],

    editor: {
        menu: CC_EDITOR && 'i18n:MAIN_MENU.component.physics/Collider/Polygon',
        inspector: CC_EDITOR && 'packages://inspector/inspectors/comps/physics/points-base-collider.js',
        requireComponent: cc.RigidBody
    },

    _createShape: function (scale) {
        var shapes = [];

        var points = this.points;
        
        // check if last point equal to first point
        if (points.length > 0 && points[0].equals(points[points.length - 1])) {
            points.length -= 1;
        }

        var polys = PolygonSeparator.ConvexPartition(points);
        var offset = this.offset;

        for (var i = 0; i < polys.length; i++) {
            var poly = polys[i];

            var shape = null, vertices = [];
            var firstVertice = null;
            
            for (var j = 0, l = poly.length; j < l; j++) {
                if (!shape) {
                    shape = new b2.PolygonShape();
                }
                var p = poly[j];
                var x = (p.x + offset.x)/PTM_RATIO*scale.x;
                var y = (p.y + offset.y)/PTM_RATIO*scale.y;
                var v = new b2.Vec2(x, y);
                vertices.push( v );

                if (!firstVertice) {
                    firstVertice = v;
                }

                if (vertices.length === b2.maxPolygonVertices) {
                    shape.Set(vertices, vertices.length);
                    shapes.push(shape);

                    shape = null;

                    if (j < l - 1) {
                        vertices = [firstVertice, vertices[vertices.length - 1]];
                    }
                }
            }

            if (shape) {
                shape.Set(vertices, vertices.length);
                shapes.push(shape);
            }
        }

        return shapes;
    }
});

cc.PhysicsPolygonCollider = module.exports = PhysicsPolygonCollider;
