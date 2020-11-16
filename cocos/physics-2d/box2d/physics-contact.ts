/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 */

import b2 from '@cocos/box2d';
import { Vec2 } from '../../core';
import { PHYSICS_2D_PTM_RATIO } from '../framework/physics-types';
import { Collider2D, Contact2DType, PhysicsSystem2D } from '../framework';
import { b2Shape2D } from './shapes/shape-2d';

export type b2ContactExtends = b2.Contact & {
    m_userData: any
}


const pools: PhysicsContact[] = [];

// temp world manifold
const pointCache = [new Vec2, new Vec2];

const b2worldmanifold = new b2.WorldManifold();

/**
 * @class WorldManifold
 */
const worldmanifold = {

    /**
     * @en
     * world contact point (point of intersection)
     * @zh
     * 碰撞点集合
     * @property {[Vec2]} points
     */
    points: [] as Vec2[],

    /**
     * @en
     * a negative value indicates overlap
     * @zh
     * 一个负数，用于指明重叠的部分
     */
    separations: [] as number[],

    /**
     * @en
     * world vector pointing from A to B
     * @zh
     * 世界坐标系下由 A 指向 B 的向量
     * @property {Vec2} normal
     */
    normal: new Vec2(),
};

/**
 * @en
 * A manifold point is a contact point belonging to a contact manifold.
 * It holds details related to the geometry and dynamics of the contact points.
 * Note: the impulses are used for internal caching and may not
 * provide reliable contact forces, especially for high speed collisions.
 * @zh
 * ManifoldPoint 是接触信息中的接触点信息。它拥有关于几何和接触点的详细信息。
 * 注意：信息中的冲量用于系统内部缓存，提供的接触力可能不是很准确，特别是高速移动中的碰撞信息。
 * @class ManifoldPoint
 */
/**
 * @en
 * The local point usage depends on the manifold type:
 * -e_circles: the local center of circleB
 * -e_faceA: the local center of circleB or the clip point of polygonB
 * -e_faceB: the clip point of polygonA
 * @zh
 * 本地坐标点的用途取决于 manifold 的类型
 * - e_circles: circleB 的本地中心点
 * - e_faceA: circleB 的本地中心点 或者是 polygonB 的截取点
 * - e_faceB: polygonB 的截取点
 * @property {Vec2} localPoint
 */
/**
 * @en
 * Normal impulse.
 * @zh
 * 法线冲量。
 * @property {Number} normalImpulse
 */
/**
 * @en
 * Tangent impulse.
 * @zh
 * 切线冲量。
 * @property {Number} tangentImpulse
 */
class ManifoldPoint {
    localPoint = new Vec2();
    normalImpulse = 0;
    tangentImpulse = 0;
}

const manifoldPointCache = [new ManifoldPoint(), new ManifoldPoint()];

/**
 * @class Manifold
 */
const manifold = {
    /**
     * @en
     * Manifold type :  0: e_circles, 1: e_faceA, 2: e_faceB
     * @zh
     * Manifold 类型 :  0: e_circles, 1: e_faceA, 2: e_faceB
     * @property {Number} type
     */
    type: 0,

    /**
     * @en
     * The local point usage depends on the manifold type:
     * -e_circles: the local center of circleA
     * -e_faceA: the center of faceA
     * -e_faceB: the center of faceB
     * @zh
     * 用途取决于 manifold 类型
     * -e_circles: circleA 的本地中心点
     * -e_faceA: faceA 的本地中心点
     * -e_faceB: faceB 的本地中心点
     * @property {Vec2} localPoint
     */
    localPoint: new Vec2(),
    /**
     * @en
     * -e_circles: not used
     * -e_faceA: the normal on polygonA
     * -e_faceB: the normal on polygonB
     * @zh
     * -e_circles: 没被使用到
     * -e_faceA: polygonA 的法向量
     * -e_faceB: polygonB 的法向量
     * @property {Vec2} localNormal
     */
    localNormal: new Vec2(),

    /**
     * @en
     * the points of contact.
     * @zh
     * 接触点信息。
     * @property {[ManifoldPoint]} points
     */
    points: [] as ManifoldPoint[],
};

/**
 * @en
 * Contact impulses for reporting.
 * @zh
 * 用于返回给回调的接触冲量。
 * @class PhysicsImpulse
 */
const impulse = {
    /**
     * @en
     * Normal impulses.
     * @zh
     * 法线方向的冲量
     * @property normalImpulses
     */
    normalImpulses: [] as number[],
    /**
     * @en
     * Tangent impulses
     * @zh
     * 切线方向的冲量
     * @property tangentImpulses
     */
    tangentImpulses: [] as number[],
};

/**
 * @en
 * PhysicsContact will be generated during begin and end collision as a parameter of the collision callback.
 * Note that contacts will be reused for speed up cpu time, so do not cache anything in the contact.
 * @zh
 * 物理接触会在开始和结束碰撞之间生成，并作为参数传入到碰撞回调函数中。
 * 注意：传入的物理接触会被系统进行重用，所以不要在使用中缓存里面的任何信息。
 * @class PhysicsContact
 */
export class PhysicsContact {
    static get (b2contact: b2ContactExtends) {
        let c = pools.pop();

        if (!c) {
            c = new PhysicsContact();
        }

        c.init(b2contact);
        return c;
    }

    static put (b2contact: b2ContactExtends) {
        const c: PhysicsContact = b2contact.m_userData as PhysicsContact;
        if (!c) return;

        pools.push(c);
        c.reset();
    }

    colliderA: Collider2D | null = null;
    colliderB: Collider2D | null = null;

    disabled = false;
    disabledOnce = false;

    private _impulse: b2.ContactImpulse | null = null;
    private _inverted = false;
    private _b2contact: b2ContactExtends | null = null;

    _setImpulse (impulse: b2.ContactImpulse | null) {
        this._impulse = impulse;
    }

    init (b2contact: b2ContactExtends) {
        this.colliderA = (b2contact.m_fixtureA.m_userData as b2Shape2D).collider;
        this.colliderB = (b2contact.m_fixtureB.m_userData as b2Shape2D).collider;
        this.disabled = false;
        this.disabledOnce = false;
        this._impulse = null;

        this._inverted = false;

        this._b2contact = b2contact;
        b2contact.m_userData = this;
    }

    reset () {
        this.setTangentSpeed(0);
        this.resetFriction();
        this.resetRestitution();

        this.colliderA = null;
        this.colliderB = null;
        this.disabled = false;
        this._impulse = null;

        this._b2contact!.m_userData = null;
        this._b2contact = null;
    }

    /**
     * @en
     * Get the world manifold.
     * @zh
     * 获取世界坐标系下的碰撞信息。
     * @method getWorldManifold
     * @return {WorldManifold}
     */
    getWorldManifold () {
        const points = worldmanifold.points;
        const separations = worldmanifold.separations;
        const normal = worldmanifold.normal;

        this._b2contact!.GetWorldManifold(b2worldmanifold);
        const b2points = b2worldmanifold.points;
        const b2separations = b2worldmanifold.separations;

        const count = this._b2contact!.GetManifold().pointCount;
        points.length = separations.length = count;

        for (let i = 0; i < count; i++) {
            const p = pointCache[i];
            p.x = b2points[i].x * PHYSICS_2D_PTM_RATIO;
            p.y = b2points[i].y * PHYSICS_2D_PTM_RATIO;

            points[i] = p;
            separations[i] = b2separations[i] * PHYSICS_2D_PTM_RATIO;
        }

        normal.x = b2worldmanifold.normal.x;
        normal.y = b2worldmanifold.normal.y;

        if (this._inverted) {
            normal.x *= -1;
            normal.y *= -1;
        }

        return worldmanifold;
    }

    /**
     * @en
     * Get the manifold.
     * @zh
     * 获取本地（局部）坐标系下的碰撞信息。
     * @method getManifold
     * @return {Manifold}
     */
    getManifold () {
        const points = manifold.points;
        const localNormal = manifold.localNormal;
        const localPoint = manifold.localPoint;

        const b2manifold = this._b2contact!.GetManifold();
        const b2points = b2manifold.points;
        const count = points.length = b2manifold.pointCount;

        for (let i = 0; i < count; i++) {
            const p = manifoldPointCache[i];
            const b2p = b2points[i];
            p.localPoint.x = b2p.localPoint.x * PHYSICS_2D_PTM_RATIO;
            p.localPoint.y = b2p.localPoint.y * PHYSICS_2D_PTM_RATIO;
            p.normalImpulse = b2p.normalImpulse * PHYSICS_2D_PTM_RATIO;
            p.tangentImpulse = b2p.tangentImpulse;

            points[i] = p;
        }

        localPoint.x = b2manifold.localPoint.x * PHYSICS_2D_PTM_RATIO;
        localPoint.y = b2manifold.localPoint.y * PHYSICS_2D_PTM_RATIO;
        localNormal.x = b2manifold.localNormal.x;
        localNormal.y = b2manifold.localNormal.y;
        manifold.type = b2manifold.type;

        if (this._inverted) {
            localNormal.x *= -1;
            localNormal.y *= -1;
        }

        return manifold;
    }

    /**
     * @en
     * Get the impulses.
     * Note: PhysicsImpulse can only used in onPostSolve callback.
     * @zh
     * 获取冲量信息
     * 注意：这个信息只有在 onPostSolve 回调中才能获取到
     * @method getImpulse
     * @return {PhysicsImpulse}
     */
    getImpulse () {
        const b2impulse = this._impulse;
        if (!b2impulse) return null;

        const normalImpulses = impulse.normalImpulses;
        const tangentImpulses = impulse.tangentImpulses;
        const count = b2impulse.count;
        for (let i = 0; i < count; i++) {
            normalImpulses[i] = b2impulse.normalImpulses[i] * PHYSICS_2D_PTM_RATIO;
            tangentImpulses[i] = b2impulse.tangentImpulses[i];
        }

        tangentImpulses.length = normalImpulses.length = count;

        return impulse;
    }

    emit (contactType) {
        let func;
        switch (contactType) {
            case Contact2DType.BEGIN_CONTACT:
                func = 'onBeginContact';
                break;
            case Contact2DType.END_CONTACT:
                func = 'onEndContact';
                break;
            case Contact2DType.PRE_SOLVE:
                func = 'onPreSolve';
                break;
            case Contact2DType.POST_SOLVE:
                func = 'onPostSolve';
                break;
        }

        const colliderA = this.colliderA;
        const colliderB = this.colliderB;

        const bodyA = colliderA!.body;
        const bodyB = colliderB!.body;

        if (bodyA!.enabledContactListener) {
            colliderA?.emit(contactType, this, colliderA, colliderB);
        }

        if (bodyB!.enabledContactListener) {
            colliderB?.emit(contactType, this, colliderB, colliderA);
        }

        if (bodyA!.enabledContactListener || bodyB!.enabledContactListener) {
            PhysicsSystem2D.instance.emit(contactType, colliderA, colliderB);
        }

        if (this.disabled || this.disabledOnce) {
            this.setEnabled(false);
            this.disabledOnce = false;
        }
    }


    /**
     * @en
     * One of the collider that collided
     * @zh
     * 发生碰撞的碰撞体之一
     * @property {Collider} colliderA
     */
    /**
     * @en
     * One of the collider that collided
     * @zh
     * 发生碰撞的碰撞体之一
     * @property {Collider} colliderB
     */
    /**
     * @en
     * If set disabled to true, the contact will be ignored until contact end.
     * If you just want to disabled contact for current time step or sub-step, please use disabledOnce.
     * @zh
     * 如果 disabled 被设置为 true，那么直到接触结束此接触都将被忽略。
     * 如果只是希望在当前时间步或子步中忽略此接触，请使用 disabledOnce 。
     * @property {Boolean} disabled
     */
    /**
     * @en
     * Disabled contact for current time step or sub-step.
     * @zh
     * 在当前时间步或子步中忽略此接触。
     * @property {Boolean} disabledOnce
     */
    setEnabled (value) {
        this._b2contact!.SetEnabled(value);
    }

    /**
     * @en
     * Is this contact touching?
     * @zh
     * 返回碰撞体是否已经接触到。
     * @method isTouching
     * @return {Boolean}
     */
    isTouching () {
        return this._b2contact!.IsTouching();
    }

    /**
     * @en
     * Set the desired tangent speed for a conveyor belt behavior.
     * @zh
     * 为传送带设置期望的切线速度
     * @method setTangentSpeed
     * @param {Number} tangentSpeed
     */
    setTangentSpeed (value) {
        this._b2contact!.SetTangentSpeed(value);
    }
    /**
     * @en
     * Get the desired tangent speed.
     * @zh
     * 获取切线速度
     * @method getTangentSpeed
     * @return {Number}
     */

    getTangentSpeed () {
        return this._b2contact!.GetTangentSpeed();
    }

    /**
     * @en
     * Override the default friction mixture. You can call this in onPreSolve callback.
     * @zh
     * 覆盖默认的摩擦力系数。你可以在 onPreSolve 回调中调用此函数。
     * @method setFriction
     * @param {Number} friction
     */
    setFriction (value) {
        this._b2contact!.SetFriction(value);
    }
    /**
     * @en
     * Get the friction.
     * @zh
     * 获取当前摩擦力系数
     * @method getFriction
     * @return {Number}
     */
    getFriction () {
        return this._b2contact!.GetFriction();
    }
    /**
     * @en
     * Reset the friction mixture to the default value.
     * @zh
     * 重置摩擦力系数到默认值
     * @method resetFriction
     */
    resetFriction () {
        return this._b2contact!.ResetFriction();
    }
    /**
     * @en
     * Override the default restitution mixture. You can call this in onPreSolve callback.
     * @zh
     * 覆盖默认的恢复系数。你可以在 onPreSolve 回调中调用此函数。
     * @method setRestitution
     * @param {Number} restitution
     */
    setRestitution (value) {
        this._b2contact!.SetRestitution(value);
    }
    /**
     * @en
     * Get the restitution.
     * @zh
     * 获取当前恢复系数
     * @method getRestitution
     * @return {Number}
     */
    getRestitution () {
        return this._b2contact!.GetRestitution();
    }
    /**
     * @en
     * Reset the restitution mixture to the default value.
     * @zh
     * 重置恢复系数到默认值
     * @method resetRestitution
     */
    resetRestitution () {
        return this._b2contact!.ResetRestitution();
    }
}

