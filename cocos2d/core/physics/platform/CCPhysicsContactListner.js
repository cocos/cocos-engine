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


function PhysicsContactListener () {
    this._contactFixtures = [];
}

PhysicsContactListener.prototype.setBeginContact = function (cb) {
    this._BeginContact = cb;
};

PhysicsContactListener.prototype.setEndContact = function (cb) {
    this._EndContact = cb;
};

PhysicsContactListener.prototype.setPreSolve = function (cb) {
    this._PreSolve = cb;
};

PhysicsContactListener.prototype.setPostSolve = function (cb) {
    this._PostSolve = cb;
};

PhysicsContactListener.prototype.BeginContact = function (contact) {
    if (!this._BeginContact) return;

    var fixtureA = contact.GetFixtureA();
    var fixtureB = contact.GetFixtureB();
    var fixtures = this._contactFixtures;
    
    contact._shouldReport = false;
    
    if (fixtures.indexOf(fixtureA) !== -1 || fixtures.indexOf(fixtureB) !== -1) {
        contact._shouldReport = true; // for quick check whether this contact should report
        this._BeginContact(contact);
    }
};

PhysicsContactListener.prototype.EndContact = function (contact) {
    if (this._EndContact && contact._shouldReport) {
        contact._shouldReport = false;
        this._EndContact(contact);
    }
};

PhysicsContactListener.prototype.PreSolve = function (contact, oldManifold) {
    if (this._PreSolve && contact._shouldReport) {
        this._PreSolve(contact, oldManifold);
    }
};

PhysicsContactListener.prototype.PostSolve = function (contact, impulse) {
    if (this._PostSolve && contact._shouldReport) {
        this._PostSolve(contact, impulse);
    }
};

PhysicsContactListener.prototype.registerContactFixture = function (fixture) {
    this._contactFixtures.push(fixture);
};

PhysicsContactListener.prototype.unregisterContactFixture = function (fixture) {
    cc.js.array.remove(this._contactFixtures, fixture);
};

cc.PhysicsContactListener = module.exports = PhysicsContactListener;
