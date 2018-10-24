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


var Intersection = require('./CCIntersection');

var CollisionType = cc.Enum({
    None: 0,
    CollisionEnter: 1,
    CollisionStay: 2,
    CollisionExit: 3
});

function Contact (collider1, collider2) {
    this.collider1 = collider1;
    this.collider2 = collider2;

    this.touching = false;

    var isCollider1Polygon = (collider1 instanceof cc.BoxCollider) || (collider1 instanceof cc.PolygonCollider);
    var isCollider2Polygon = (collider2 instanceof cc.BoxCollider) || (collider2 instanceof cc.PolygonCollider);
    var isCollider1Circle = collider1 instanceof cc.CircleCollider;
    var isCollider2Circle = collider2 instanceof cc.CircleCollider;

    if (isCollider1Polygon && isCollider2Polygon) {
        this.testFunc = Intersection.polygonPolygon;
    }
    else if (isCollider1Circle && isCollider2Circle) {
        this.testFunc = Intersection.circleCircle;
    }
    else if (isCollider1Polygon && isCollider2Circle) {
        this.testFunc = Intersection.polygonCircle;
    }
    else if (isCollider1Circle && isCollider2Polygon) {
        this.testFunc = Intersection.polygonCircle;
        this.collider1 = collider2;
        this.collider2 = collider1;
    }
    else {
        cc.errorID(6601, cc.js.getClassName(collider1), cc.js.getClassName(collider2));
    }
}

Contact.prototype.test = function () {
    var world1 = this.collider1.world;
    var world2 = this.collider2.world;

    if (!world1.aabb.intersects(world2.aabb)) {
        return false;
    }

    if (this.testFunc === Intersection.polygonPolygon) {
        return this.testFunc(world1.points, world2.points);
    }
    else if (this.testFunc === Intersection.circleCircle) {
        return this.testFunc(world1, world2);
    }
    else if (this.testFunc === Intersection.polygonCircle) {
        return this.testFunc(world1.points, world2);
    }

    return false;
};

Contact.prototype.updateState = function () {
    var result = this.test();

    var type = CollisionType.None;
    if (result && !this.touching) {
        this.touching = true;
        type = CollisionType.CollisionEnter;
    }
    else if (result && this.touching) {
        type = CollisionType.CollisionStay;
    }
    else if (!result && this.touching) {
        this.touching = false;
        type = CollisionType.CollisionExit;
    }

    return type;
};


Contact.CollisionType = CollisionType;

module.exports = Contact;
