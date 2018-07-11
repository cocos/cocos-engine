const PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;

let _tmp_vec2 = cc.v2();

function PhysicsDebugDraw (drawer) {
    b2.Draw.call(this);
    this._drawer = drawer;
    this._xf = this._dxf = new b2.Transform();
}

cc.js.extend(PhysicsDebugDraw, b2.Draw);

cc.js.mixin(PhysicsDebugDraw.prototype, {
    _DrawPolygon (vertices, vertexCount) {
        var drawer = this._drawer;
        
        for (var i=0; i<vertexCount; i++) {
            b2.Transform.MulXV(this._xf, vertices[i], _tmp_vec2);
            let x = _tmp_vec2.x * PTM_RATIO,
                y = _tmp_vec2.y * PTM_RATIO;
            if (i === 0)
                drawer.moveTo(x, y);
            else {
                drawer.lineTo(x, y);
            }
        }

        drawer.close();
    },

    DrawPolygon (vertices, vertexCount, color) {
        this._applyStrokeColor(color);
        this._DrawPolygon(vertices, vertexCount);
        this._drawer.stroke();
    },

    DrawSolidPolygon (vertices, vertexCount, color) {
        this._applyFillColor(color);
        this._DrawPolygon(vertices, vertexCount);
        this._drawer.fill();
        this._drawer.stroke();
    },

    _DrawCircle (center, radius) {
        let p = this._xf.p;
        this._drawer.circle((center.x + p.x) * PTM_RATIO, (center.y + p.y) * PTM_RATIO, radius * PTM_RATIO);
    },

    DrawCircle (center, radius, color) {
        this._applyStrokeColor(color);
        this._DrawCircle(center, radius);
        this._drawer.stroke();
    },

    DrawSolidCircle (center, radius, axis, color) {
        this._applyFillColor(color);
        this._DrawCircle(center, radius);
        this._drawer.fill();
    },

    DrawSegment (p1, p2, color) {
        var drawer = this._drawer;

        if (p1.x === p2.x && p1.y === p2.y) {
            this._applyFillColor(color);
            this._DrawCircle(p1, 2/PTM_RATIO);
            drawer.fill();
            return;
        }
        this._applyStrokeColor(color);

        b2.Transform.MulXV(this._xf, p1, _tmp_vec2);
        drawer.moveTo(_tmp_vec2.x * PTM_RATIO, _tmp_vec2.y * PTM_RATIO);
        b2.Transform.MulXV(this._xf, p2, _tmp_vec2);
        drawer.lineTo(_tmp_vec2.x * PTM_RATIO, _tmp_vec2.y * PTM_RATIO);
        drawer.stroke();   
    },

    DrawPoint (center, radius, color) {
    },

    _applyStrokeColor (color) {
        let strokeColor = this._drawer.strokeColor;
        strokeColor.r = color.r*255;
        strokeColor.g = color.g*255;
        strokeColor.b = color.b*255;
        strokeColor.a = 150;
        this._drawer.strokeColor = strokeColor;
    },

    _applyFillColor (color) {
        let fillColor = this._drawer.fillColor;
        fillColor.r = color.r*255;
        fillColor.g = color.g*255;
        fillColor.b = color.b*255;
        fillColor.a = 150;

        this._drawer.fillColor = fillColor;
    },

    PushTransform (xf) {
        this._xf = xf;
    },

    PopTransform () {
        this._xf = this._dxf;
    }
});

module.exports = PhysicsDebugDraw;
