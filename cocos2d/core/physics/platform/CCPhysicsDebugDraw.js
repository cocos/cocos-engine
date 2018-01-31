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

var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;

var PhysicsDebugDraw = cc.Class({
    name: 'cc.PhysicsDebugDraw',
    mixins: [b2.Draw],

    ctor: function () {
        this._drawer = new _ccsg.GraphicsNode();
    },

    getDrawer: function () {
        return this._drawer;
    },

    AddDrawerToNode: function (node) {
        this._drawer.removeFromParent();
        node.addChild(this._drawer);
    },

    ClearDraw: function () {
        this._drawer.clear();
    },

    _DrawPolygon: function (vertices, vertexCount) {
        var drawer = this._drawer;
        
        for (var i=0; i<vertexCount; i++) {
            if (i === 0)
                drawer.moveTo(vertices[i].x * PTM_RATIO, vertices[i].y * PTM_RATIO);
            else {
                drawer.lineTo(vertices[i].x * PTM_RATIO, vertices[i].y * PTM_RATIO);
            }
        }

        drawer.close();
    },

    DrawPolygon: function (vertices, vertexCount, color) {
        this._applyStrokeColor(color);
        this._DrawPolygon(vertices, vertexCount);
        this._drawer.stroke();
    },

    DrawSolidPolygon: function (vertices, vertexCount, color) {
        this._applyFillColor(color);
        this._DrawPolygon(vertices, vertexCount);
        this._drawer.fill();
        this._drawer.stroke();
    },

    _DrawCircle: function (center, radius) {
        this._drawer.circle(center.x * PTM_RATIO, center.y * PTM_RATIO, radius * PTM_RATIO);
    },

    DrawCircle: function (center, radius, color) {
        this._applyStrokeColor(color);
        this._DrawCircle(center, radius);
        this._drawer.stroke();
    },

    DrawSolidCircle: function (center, radius, axis, color) {
        this._applyFillColor(color);
        this._DrawCircle(center, radius);
        this._drawer.fill();
    },

    DrawSegment: function (p1, p2, color) {
        var drawer = this._drawer;

        if (p1.x === p2.x && p1.y === p2.y) {
            this._applyFillColor(color);
            this._DrawCircle(p1, 2/PTM_RATIO);
            drawer.fill();
            return;
        }
        this._applyStrokeColor(color);
        drawer.moveTo(p1.x * PTM_RATIO, p1.y * PTM_RATIO);
        drawer.lineTo(p2.x * PTM_RATIO, p2.y * PTM_RATIO);
        drawer.stroke();   
    },

    DrawPoint: function (center, radius, color) {
    },

    _applyStrokeColor: function (color) {
        this._drawer.setStrokeColor( cc.color(color.r*255, color.g*255, color.b*255, 150) );
    },

    _applyFillColor: function (color) {
        this._drawer.setFillColor( cc.color(color.r*255, color.g*255, color.b*255, 150) );
    }
});

cc.PhysicsDebugDraw = module.exports = PhysicsDebugDraw;
