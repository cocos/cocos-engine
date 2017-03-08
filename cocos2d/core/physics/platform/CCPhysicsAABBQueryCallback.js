
function PhysicsAABBQueryCallback (point) {
    this._point = point;
    this._fixtures = [];
}

PhysicsAABBQueryCallback.prototype.ReportFixture = function (fixture) {
    var body = fixture.GetBody();
    if (body.GetType() === b2.Body.b2_dynamicBody) {
        if (this._point) {
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

    // Continue the query.
    return true;
};

PhysicsAABBQueryCallback.prototype.getFixture = function () {
    return this._fixtures[0];
};

PhysicsAABBQueryCallback.prototype.getFixtures = function () {
    return this._fixtures;
};

cc.PhysicsAABBQueryCallback = module.exports = PhysicsAABBQueryCallback;
