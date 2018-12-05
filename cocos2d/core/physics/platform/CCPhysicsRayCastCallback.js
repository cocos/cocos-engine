/****************************************************************************
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
    this._points.push(cc.v2(point));
    this._normals.push(cc.v2(normal));
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
