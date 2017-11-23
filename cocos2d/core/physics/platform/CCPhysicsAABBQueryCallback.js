
function PhysicsAABBQueryCallback () {
    this._point = new b2.Vec2();
    this._isPoint = false;
    this._fixtures = [];
}

PhysicsAABBQueryCallback.prototype.init = function (point) {
    if (point) {
        this._isPoint = true;
        this._point.x = point.x;
        this._point.y = point.y;
    }
    else {
        this._isPoint = false;
    }
    
    this._fixtures.length = 0;
};

PhysicsAABBQueryCallback.prototype.ReportFixture = function (fixture) {
    var body = fixture.GetBody();
    if (body.GetType() === b2.Body.b2_dynamicBody) {
        if (this._isPoint) {
            if (fixture.TestPoint(this._point)) {
                this._fixtures.push(fixture);
                // We are done, terminate the query.
                return false;
            }
        }
        else {
            this._fixtures.push(fixture);
        }
    }

    // True to continue the query, false to terminate the query.
    return true;
};

PhysicsAABBQueryCallback.prototype.getFixture = function () {
    return this._fixtures[0];
};

PhysicsAABBQueryCallback.prototype.getFixtures = function () {
    return this._fixtures;
};

cc.PhysicsAABBQueryCallback = module.exports = PhysicsAABBQueryCallback;
