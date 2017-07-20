var isWasm = b2.isWasm;

cc.PhysicsAABBQueryCallback = module.exports = {
    create: function () {
        var point = new b2.Vec2();
        var fixtures = [];

        var callback = isWasm ? new Box2D.JSQueryCallback() : {};

        callback.init = function (p) {
            point.x = p.x;
            point.y = p.y;
            fixtures.length = 0;
        };

        callback.ReportFixture = function (fixture) {
            if (isWasm) {
                fixture = Box2D.wrapPointer( fixture, b2.Fixture );
            }
            
            var body = fixture.GetBody();
            if (body.GetType() === cc.RigidBodyType.Dynamic) {
                if (point) {
                    if (fixture.TestPoint(point)) {
                        fixtures.push(fixture);
                        // We are done, terminate the query.
                        return false;
                    }
                }
                else {
                    fixtures.push(fixture);
                }
            }

            // True to continue the query, false to terminate the query.
            return true;
        };

        callback.getFixture = function () {
            return fixtures[0];
        };

        callback.getFixtures = function () {
            return fixtures;
        };

        return callback;
    }
};
