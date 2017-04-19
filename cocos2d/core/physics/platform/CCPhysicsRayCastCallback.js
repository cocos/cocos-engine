
function PhysicsRayCastCallback () {
    this._type = 0;
    this._fixtures = [];
    this._points = [];
    this._normals = [];
    this._fractions = [];
}

PhysicsRayCastCallback.prototype.init = function (type) {
    this._type = type;
    this._fixtures.length = 0;
    this._points.length = 0;
    this._normals.length = 0;
    this._fractions.length = 0;
};

PhysicsRayCastCallback.prototype.ReportFixture = function (fixture, point, normal, fraction) {
    if (this._type === 0) { // closest
        this._fixtures[0] = fixture;
        this._points[0] = point;
        this._normals[0] = normal;
        this._fractions[0] = fraction;
        return fraction;
    }

    this._fixtures.push(fixture);
    this._points.push(point);
    this._normals.push(normal);
    this._fractions.push(fraction);
    
    if (this._type === 1) { // any
        return 0;
    }
    else if (this._type >= 2) { // all
        return 1;
    }

    return fraction;
};


PhysicsRayCastCallback.prototype.getFixtures = function () {
    return this._fixtures;
};

PhysicsRayCastCallback.prototype.getPoints = function () {
    return this._points;
};

PhysicsRayCastCallback.prototype.getNormals = function () {
    return this._normals;
};

PhysicsRayCastCallback.prototype.getFractions = function () {
    return this._fractions;
};

cc.PhysicsRayCastCallback = module.exports = PhysicsRayCastCallback;
