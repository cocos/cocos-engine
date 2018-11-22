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


var PTM_RATIO = require('./CCPhysicsTypes').PTM_RATIO;
var ContactType = require('./CCPhysicsTypes').ContactType;

var pools = [];


// temp world manifold
var pointCache = [cc.v2(), cc.v2()];

var b2worldmanifold = new b2.WorldManifold();

/**
 * @class WorldManifold
 */
var worldmanifold = {

    /**
     * !#en
     * world contact point (point of intersection)
     * !#zh
     * 碰撞点集合
     * @property {[Vec2]} points
     */
    points: [],

    /**
     * !#en
     * a negative value indicates overlap
     * !#zh
     * 一个负数，用于指明重叠的部分
     */
    separations: [],

    /**
     * !#en
     * world vector pointing from A to B
     * !#zh
     * 世界坐标系下由 A 指向 B 的向量
     * @property {Vec2} normal
     */
    normal: cc.v2()
};

/**
 * !#en
 * A manifold point is a contact point belonging to a contact manifold. 
 * It holds details related to the geometry and dynamics of the contact points.
 * Note: the impulses are used for internal caching and may not
 * provide reliable contact forces, especially for high speed collisions.
 * !#zh
 * ManifoldPoint 是接触信息中的接触点信息。它拥有关于几何和接触点的详细信息。
 * 注意：信息中的冲量用于系统内部缓存，提供的接触力可能不是很准确，特别是高速移动中的碰撞信息。
 * @class ManifoldPoint
 */
/**
 * !#en
 * The local point usage depends on the manifold type:
 * -e_circles: the local center of circleB
 * -e_faceA: the local center of circleB or the clip point of polygonB
 * -e_faceB: the clip point of polygonA
 * !#zh
 * 本地坐标点的用途取决于 manifold 的类型
 * - e_circles: circleB 的本地中心点
 * - e_faceA: circleB 的本地中心点 或者是 polygonB 的截取点
 * - e_faceB: polygonB 的截取点
 * @property {Vec2} localPoint
 */
/**
 * !#en
 * Normal impulse.
 * !#zh
 * 法线冲量。
 * @property {Number} normalImpulse
 */
/**
 * !#en
 * Tangent impulse.
 * !#zh
 * 切线冲量。
 * @property {Number} tangentImpulse
 */
function ManifoldPoint () {
    this.localPoint = cc.v2();
    this.normalImpulse = 0;
    this.tangentImpulse = 0;
}

var manifoldPointCache = [new ManifoldPoint(), new ManifoldPoint()];

var b2manifold = new b2.Manifold();

/**
 * @class Manifold
 */
var manifold = {
    /**
     * !#en
     * Manifold type :  0: e_circles, 1: e_faceA, 2: e_faceB
     * !#zh
     * Manifold 类型 :  0: e_circles, 1: e_faceA, 2: e_faceB
     * @property {Number} type
     */
    type: 0,

    /**
     * !#en
     * The local point usage depends on the manifold type:
     * -e_circles: the local center of circleA
     * -e_faceA: the center of faceA
     * -e_faceB: the center of faceB
     * !#zh
     * 用途取决于 manifold 类型
     * -e_circles: circleA 的本地中心点
     * -e_faceA: faceA 的本地中心点
     * -e_faceB: faceB 的本地中心点
     * @property {Vec2} localPoint
     */
    localPoint: cc.v2(),
    /**
     * !#en
     * -e_circles: not used
     * -e_faceA: the normal on polygonA
     * -e_faceB: the normal on polygonB
     * !#zh
     * -e_circles: 没被使用到
     * -e_faceA: polygonA 的法向量
     * -e_faceB: polygonB 的法向量
     * @property {Vec2} localNormal
     */
    localNormal: cc.v2(),

    /**
     * !#en
     * the points of contact.
     * !#zh
     * 接触点信息。
     * @property {[ManifoldPoint]} points
     */
    points: []
};

/**
 * !#en
 * Contact impulses for reporting.
 * !#zh
 * 用于返回给回调的接触冲量。
 * @class PhysicsImpulse
 */
var impulse = {
    /**
     * !#en
     * Normal impulses.
     * !#zh
     * 法线方向的冲量
     * @property normalImpulses
     */
    normalImpulses: [],
    /**
     * !#en
     * Tangent impulses
     * !#zh
     * 切线方向的冲量
     * @property tangentImpulses
     */
    tangentImpulses: []
};

/**
 * !#en
 * PhysicsContact will be generated during begin and end collision as a parameter of the collision callback.
 * Note that contacts will be reused for speed up cpu time, so do not cache anything in the contact.
 * !#zh
 * 物理接触会在开始和结束碰撞之间生成，并作为参数传入到碰撞回调函数中。
 * 注意：传入的物理接触会被系统进行重用，所以不要在使用中缓存里面的任何信息。
 * @class PhysicsContact
 */
function PhysicsContact () {
}

PhysicsContact.prototype.init = function (b2contact) {
    this.colliderA = b2contact.GetFixtureA().collider;
    this.colliderB = b2contact.GetFixtureB().collider;
    this.disabled = false;
    this.disabledOnce = false;
    this._impulse = null;

    this._inverted = false;

    this._b2contact = b2contact;
    b2contact._contact = this;
};

PhysicsContact.prototype.reset = function () {
    this.setTangentSpeed(0);
    this.resetFriction();
    this.resetRestitution();

    this.colliderA = null;
    this.colliderB = null;
    this.disabled = false;
    this._impulse = null;

    this._b2contact._contact = null;
    this._b2contact = null;
};

/**
 * !#en
 * Get the world manifold.
 * !#zh
 * 获取世界坐标系下的碰撞信息。
 * @method getWorldManifold
 * @return {WorldManifold}
 */
PhysicsContact.prototype.getWorldManifold = function () {
    var points = worldmanifold.points;
    var separations = worldmanifold.separations;
    var normal = worldmanifold.normal;

    this._b2contact.GetWorldManifold(b2worldmanifold);
    var b2points = b2worldmanifold.points;
    var b2separations = b2worldmanifold.separations;

    var count = this._b2contact.GetManifold().pointCount;
    points.length = separations.length = count;
    
    for (var i = 0; i < count; i++) {
        var p = pointCache[i];
        p.x = b2points[i].x * PTM_RATIO;
        p.y = b2points[i].y * PTM_RATIO;
        
        points[i] = p;
        separations[i] = b2separations[i] * PTM_RATIO;
    }

    normal.x = b2worldmanifold.normal.x;
    normal.y = b2worldmanifold.normal.y;

    if (this._inverted) {
        normal.x *= -1;
        normal.y *= -1;
    }

    return worldmanifold;
};

/**
 * !#en
 * Get the manifold.
 * !#zh
 * 获取本地（局部）坐标系下的碰撞信息。
 * @method getManifold
 * @return {Manifold}
 */
PhysicsContact.prototype.getManifold = function () {
    var points = manifold.points;
    var localNormal = manifold.localNormal;
    var localPoint = manifold.localPoint;
    
    var b2manifold = this._b2contact.GetManifold();
    var b2points = b2manifold.points;
    var count = points.length = b2manifold.pointCount;

    for (var i = 0; i < count; i++) {
        var p = manifoldPointCache[i];
        var b2p = b2points[i];
        p.localPoint.x = b2p.localPoint.x * PTM_RATIO;
        p.localPoint.Y = b2p.localPoint.Y * PTM_RATIO;
        p.normalImpulse = b2p.normalImpulse * PTM_RATIO;
        p.tangentImpulse = b2p.tangentImpulse;

        points[i] = p;
    }

    localPoint.x = b2manifold.localPoint.x * PTM_RATIO;
    localPoint.y = b2manifold.localPoint.y * PTM_RATIO;
    localNormal.x = b2manifold.localNormal.x;
    localNormal.y = b2manifold.localNormal.y;
    manifold.type = b2manifold.type;

    if (this._inverted) {
        localNormal.x *= -1;
        localNormal.y *= -1;
    }

    return manifold;
};

/**
 * !#en
 * Get the impulses.
 * Note: PhysicsImpulse can only used in onPostSolve callback.
 * !#zh
 * 获取冲量信息
 * 注意：这个信息只有在 onPostSolve 回调中才能获取到
 * @method getImpulse
 * @return {PhysicsImpulse}
 */
PhysicsContact.prototype.getImpulse = function () {
    var b2impulse = this._impulse;
    if (!b2impulse) return null;

    var normalImpulses = impulse.normalImpulses;
    var tangentImpulses = impulse.tangentImpulses;
    var count = b2impulse.count;
    for (var i = 0; i < count; i++) {
        normalImpulses[i] = b2impulse.normalImpulses[i] * PTM_RATIO;
        tangentImpulses[i] = b2impulse.tangentImpulses[i];
    }

    tangentImpulses.length = normalImpulses.length = count;

    return impulse;
};

PhysicsContact.prototype.emit = function (contactType) {
    var func;
    switch (contactType) {
        case ContactType.BEGIN_CONTACT:
            func = 'onBeginContact';
            break;
        case ContactType.END_CONTACT:
            func = 'onEndContact';
            break;
        case ContactType.PRE_SOLVE:
            func = 'onPreSolve';
            break;
        case ContactType.POST_SOLVE:
            func = 'onPostSolve';
            break;
    }

    var colliderA = this.colliderA;
    var colliderB = this.colliderB;

    var bodyA = colliderA.body;
    var bodyB = colliderB.body;

    var comps;
    var i, l, comp;

    if (bodyA.enabledContactListener) {
        comps = bodyA.node._components;
        this._inverted = false;
        for (i = 0, l = comps.length; i < l; i++) {
            comp = comps[i];
            if (comp[func]) {
                comp[func](this, colliderA, colliderB);
            }
        }
    }

    if (bodyB.enabledContactListener) {
        comps = bodyB.node._components;
        this._inverted = true;
        for (i = 0, l = comps.length; i < l; i++) {
            comp = comps[i];
            if (comp[func]) {
                comp[func](this, colliderB, colliderA);
            }
        }
    }

    if (this.disabled || this.disabledOnce) {
        this.setEnabled(false);
        this.disabledOnce = false;
    }
};

PhysicsContact.get = function (b2contact) {
    var c;
    if (pools.length === 0) {
        c = new cc.PhysicsContact();
    }
    else {
        c = pools.pop(); 
    }

    c.init(b2contact);
    return c;
};

PhysicsContact.put = function (b2contact) {
    var c = b2contact._contact;
    if (!c) return;
    
    pools.push(c);
    c.reset();
};


var _p = PhysicsContact.prototype;

/**
 * @property {Collider} colliderA
 */
/**
 * @property {Collider} colliderB
 */
/**
 * !#en
 * If set disabled to true, the contact will be ignored until contact end.
 * If you just want to disabled contact for current time step or sub-step, please use disabledOnce.
 * !#zh
 * 如果 disabled 被设置为 true，那么直到接触结束此接触都将被忽略。
 * 如果只是希望在当前时间步或子步中忽略此接触，请使用 disabledOnce 。
 * @property {Boolean} disabled
 */
/**
 * !#en
 * Disabled contact for current time step or sub-step.
 * !#zh
 * 在当前时间步或子步中忽略此接触。
 * @property {Boolean} disabledOnce
 */
_p.setEnabled = function (value) {
    this._b2contact.SetEnabled(value);
};

/**
 * !#en
 * Is this contact touching?
 * !#zh
 * 返回碰撞体是否已经接触到。
 * @method isTouching
 * @return {Boolean}
 */
_p.isTouching = function () {
    return this._b2contact.IsTouching();
};

/**
 * !#en
 * Set the desired tangent speed for a conveyor belt behavior.
 * !#zh
 * 为传送带设置期望的切线速度
 * @method setTangentSpeed
 * @param {Number} tangentSpeed
 */
_p.setTangentSpeed = function (value) {
    this._b2contact.SetTangentSpeed(value / PTM_RATIO);
};
/**
 * !#en
 * Get the desired tangent speed.
 * !#zh
 * 获取切线速度
 * @method getTangentSpeed
 * @return {Number}
 */

_p.getTangentSpeed = function () {
    return this._b2contact.GetTangentSpeed() * PTM_RATIO;
};

/**
 * !#en
 * Override the default friction mixture. You can call this in onPreSolve callback.
 * !#zh
 * 覆盖默认的摩擦力系数。你可以在 onPreSolve 回调中调用此函数。
 * @method setFriction
 * @param {Number} friction
 */
_p.setFriction = function (value) {
    this._b2contact.SetFriction(value);
};
/**
 * !#en
 * Get the friction.
 * !#zh
 * 获取当前摩擦力系数
 * @method getFriction
 * @return {Number}
 */
_p.getFriction = function () {
    return this._b2contact.GetFriction();
};
/**
 * !#en
 * Reset the friction mixture to the default value.
 * !#zh
 * 重置摩擦力系数到默认值
 * @method resetFriction
 */
_p.resetFriction = function () {
    return this._b2contact.ResetFriction();
};
/**
 * !#en
 * Override the default restitution mixture. You can call this in onPreSolve callback.
 * !#zh
 * 覆盖默认的恢复系数。你可以在 onPreSolve 回调中调用此函数。
 * @method setRestitution
 * @param {Number} restitution
 */
_p.setRestitution = function (value) {
    this._b2contact.SetRestitution(value);
};
/**
 * !#en
 * Get the restitution.
 * !#zh
 * 获取当前恢复系数
 * @method getRestitution
 * @return {Number}
 */
_p.getRestitution = function () {
    return this._b2contact.GetRestitution();
};
/**
 * !#en
 * Reset the restitution mixture to the default value.
 * !#zh
 * 重置恢复系数到默认值
 * @method resetRestitution
 */
_p.resetRestitution = function () {
    return this._b2contact.ResetRestitution();
};

PhysicsContact.ContactType = ContactType;
cc.PhysicsContact = module.exports = PhysicsContact;
