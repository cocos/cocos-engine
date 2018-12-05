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

const BodyType = require('../CCPhysicsTypes').BodyType;

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
    if (body.GetType() === BodyType.Dynamic) {
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
