var isWasm = b2.isWasm;

cc.PhysicsRayCastCallback = module.exports = {
    create: function () {
        var type = 0;
        var fixtures = [];
        var points = [];
        var normals = [];
        var fractions = [];

        var callback = isWasm ? new Box2D.JSRayCastCallback() : {};

        callback.init = function (raycastType) {
            type = raycastType;
            fixtures.length = 0;
            points.length = 0;
            normals.length = 0;
            fractions.length = 0;
        };

        callback.ReportFixture = function (fixture, point, normal, fraction) {
            if (isWasm) {
                fixture = Box2D.wrapPointer( fixture, b2.Fixture );
                point = Box2D.wrapPointer( point, b2.Vec2 );
                normal = Box2D.wrapPointer( normal, b2.Vec2 );

                point = new b2.Vec2(point.x, point.y);
                normal = new b2.Vec2(normal.x, normal.y);
            }

            if (type === 0) { // closest
                fixtures[0] = fixture;
                points[0] = point;
                normals[0] = normal;
                fractions[0] = fraction;
                return fraction;
            }

            fixtures.push(fixture);
            points.push(point);
            normals.push(normal);
            fractions.push(fraction);
            
            if (type === 1) { // any
                return 0;
            }
            else if (type >= 2) { // all
                return 1;
            }

            return fraction;
        };


        callback.getFixtures = function () {
            return fixtures;
        };

        callback.getPoints = function () {
            return points;
        };

        callback.getNormals = function () {
            return normals;
        };

        callback.getFractions = function () {
            return fractions;
        };

        return callback;
    }
};
