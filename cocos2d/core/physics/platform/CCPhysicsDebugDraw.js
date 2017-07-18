var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;

cc.PhysicsDebugDraw = module.exports = {
    create: function () {
        var drawer = new _ccsg.GraphicsNode();
        drawer.retain();

        var isWasm = b2.isWasm;
        var debugDraw = isWasm ? new Box2D.JSDraw() : new b2.Draw();

        debugDraw.ClearDraw = function () {
            drawer.clear();
        };

        debugDraw.AddDrawerToNode = function (node) {
            drawer.removeFromParent();
            node.addChild(drawer);
        };

        debugDraw.getDrawer = function () {
            return drawer;
        };

        function stroke (color) {
            drawer.setStrokeColor( cc.color(0, 0, 0, 150) );
            // drawer.setStrokeColor( cc.color(color.r*255, color.g*255, color.b*255, 150) );
            drawer.stroke();
        }

        function fill (color) {
            drawer.setFillColor( cc.color(153, 153, 153, 150) );
            // drawer.setFillColor( cc.color(color.r*255, color.g*255, color.b*255, 150) );
            drawer.fill();
        }

        function drawPolygon (vertices, vertexCount) {
            for (var i=0; i<vertexCount; i++) {
                var vert;
                if (isWasm) {
                    vert = Box2D.wrapPointer(vertices+(i*8), b2.Vec2);
                }
                else {
                    vert = vertices[i];
                }
                
                if (i === 0)
                    drawer.moveTo(vert.x * PTM_RATIO, vert.y * PTM_RATIO);
                else {
                    drawer.lineTo(vert.x * PTM_RATIO, vert.y * PTM_RATIO);
                }
            }

            drawer.close();
        }

        function drawCircle (center, radius) {
            if (isWasm) {
                center = Box2D.wrapPointer(center, b2.Vec2);
            }
            drawer.circle(center.x * PTM_RATIO, center.y * PTM_RATIO, radius * PTM_RATIO);
        }

        debugDraw.DrawPolygon = function (vertices, vertexCount, color) {
            drawPolygon(vertices, vertexCount);
            stroke(color);
        };

        debugDraw.DrawSolidPolygon = function (vertices, vertexCount, color) {
            drawPolygon(vertices, vertexCount);
            fill(color);
        };

        debugDraw.DrawCircle = function (center, radius, color) {
            drawCircle(center, radius);
            stroke(color);
        };

        debugDraw.DrawSolidCircle =  function (center, radius, axis, color) {
            drawCircle(center, radius);
            fill(color);
        };

        debugDraw.DrawSegment = function (p1, p2, color) {
            var op1 = p1, op2 = p2;
            
            if (isWasm) {
                p1 = Box2D.wrapPointer(p1, b2.Vec2);
                p2 = Box2D.wrapPointer(p2, b2.Vec2);
            }

            if (p1.x === p2.x && p1.y === p2.y) {
                drawCircle(op1, 2/PTM_RATIO);
                fill(color);
                return;
            }
            drawer.moveTo(p1.x * PTM_RATIO, p1.y * PTM_RATIO);
            drawer.lineTo(p2.x * PTM_RATIO, p2.y * PTM_RATIO);
            stroke(color);   
        };

        debugDraw.DrawPoint = function (center, radius, color) {
        };

        return debugDraw;
    }
};
