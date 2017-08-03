var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;

var PhysicsDebugDraw = cc.Class({
    name: 'cc.PhysicsDebugDraw',
    mixins: [b2.Draw],

    ctor: function () {
        this._drawer = new _ccsg.GraphicsNode();
        this._drawer.retain();
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
