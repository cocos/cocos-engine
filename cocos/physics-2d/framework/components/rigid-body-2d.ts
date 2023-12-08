/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { EDITOR_NOT_IN_PREVIEW } from 'internal:constants';
import { IRigidBody2D } from '../../spec/i-rigid-body';
import { _decorator, Vec2, IVec2Like, CCBoolean, CCFloat } from '../../../core';
import { ERigidBody2DType } from '../physics-types';
import { createRigidBody } from '../physics-selector';
import { PhysicsGroup } from '../../../physics/framework/physics-enum';
import { Component } from '../../../scene-graph';
import { help, serializable, tooltip } from '../../../core/data/decorators';

const { property, type, menu, ccclass } = _decorator;

@ccclass('cc.RigidBody2D')
@help('i18n:cc.RigidBody2D')
@menu('Physics2D/RigidBody2D')
export class RigidBody2D extends Component {
    /**
     * @en
     * Gets or sets the group of the rigid body.
     * @zh
     * 获取或设置分组。
     */
    @type(PhysicsGroup)
    @tooltip('i18n:physics2d.rigidbody.group')
    public get group (): number {
        return this._group;
    }
    public set group (v: number) {
        this._group = v;
    }

    @serializable
    @tooltip('i18n:physics2d.rigidbody.enabledContactListener')
    enabledContactListener = false;

    /**
     * @en
     * Is this a fast moving body that should be prevented from tunneling through
     * other moving bodies?
     * Note :
     * - All bodies are prevented from tunneling through kinematic and static bodies. This setting is only considered on dynamic bodies.
     * - You should use this flag sparingly since it increases processing time.
     * @zh
     * 这个刚体是否是一个快速移动的刚体，并且需要禁止穿过其他快速移动的刚体？
     * 需要注意的是 :
     *  - 所有刚体都被禁止从 运动刚体 和 静态刚体 中穿过。此选项只关注于 动态刚体。
     *  - 应该尽量少的使用此选项，因为它会增加程序处理时间。
     */
    @serializable
    @tooltip('i18n:physics2d.rigidbody.bullet')
    bullet = false;

    /**
     * @en
     * Rigidbody type : Static, Kinematic, Dynamic or Animated.
     * @zh
     * 刚体类型： Static, Kinematic, Dynamic or Animated.
     */
    @type(ERigidBody2DType)
    @tooltip('i18n:physics2d.rigidbody.type')
    get type (): ERigidBody2DType {
        return this._type;
    }
    set type (v: ERigidBody2DType) {
        this._type = v;
        if (this._body) {
            if (v === ERigidBody2DType.Animated) {
                this._body.setType(ERigidBody2DType.Kinematic);
            } else {
                this._body.setType(v);
            }
        }
    }

    /**
     * @en
     * Set this flag to false if this body should never fall asleep.
     * Note that this increases CPU usage.
     * @zh
     * 如果此刚体永远都不应该进入睡眠，那么设置这个属性为 false。
     * 需要注意这将使 CPU 占用率提高。
     */
    @type(CCBoolean)
    @tooltip('i18n:physics2d.rigidbody.allowSleep')
    get allowSleep (): boolean {
        return this._allowSleep;
    }
    set allowSleep (v: boolean) {
        this._allowSleep = v;
        if (this._body) {
            this._body.setAllowSleep(v);
        }
    }

    /**
     * @en
     * Scale the gravity applied to this body.
     * @zh
     * 缩放应用在此刚体上的重力值。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.rigidbody.gravityScale')
    get gravityScale (): number {
        return this._gravityScale;
    }
    set gravityScale (v: number) {
        this._gravityScale = v;
        if (this._body) {
            this._body.setGravityScale(v);
        }
    }

    /**
     * @en
     * Linear damping is use to reduce the linear velocity.
     * The damping parameter can be larger than 1, but the damping effect becomes sensitive to the
     * time step when the damping parameter is large.
     * @zh
     * Linear damping 用于衰减刚体的线性速度。衰减系数可以大于 1，但是当衰减系数比较大的时候，衰减的效果会变得比较敏感。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.rigidbody.linearDamping')
    get linearDamping (): number {
        return this._linearDamping;
    }
    set linearDamping (v: number) {
        this._linearDamping = v;
        if (this._body) {
            this._body.setLinearDamping(v);
        }
    }

    /**
     * @en
     * Angular damping is use to reduce the angular velocity. The damping parameter
     * can be larger than 1 but the damping effect becomes sensitive to the
     * time step when the damping parameter is large.
     * @zh
     * Angular damping 用于衰减刚体的角速度。衰减系数可以大于 1，但是当衰减系数比较大的时候，衰减的效果会变得比较敏感。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.rigidbody.angularDamping')
    get angularDamping (): number {
        return this._angularDamping;
    }
    set angularDamping (v: number) {
        this._angularDamping = v;
        if (this._body) {
            this._body.setAngularDamping(v);
        }
    }

    /**
     * @en
     * The linear velocity of the body's origin in world co-ordinates.
     * @zh
     * 刚体在世界坐标下的线性速度。
     */
    @type(Vec2)
    @tooltip('i18n:physics2d.rigidbody.linearVelocity')
    get linearVelocity (): Vec2 {
        if (this._body) {
            this._body.getLinearVelocity(this._linearVelocity);
        }
        return this._linearVelocity;
    }
    set linearVelocity (v: Vec2) {
        this._linearVelocity = v;
        if (this._body) {
            this._body.setLinearVelocity(v);
        }
    }

    /**
     * @en
     * The angular velocity of the body in radians/second.
     * @zh
     * 刚体的角速度，单位是 弧度/秒。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.rigidbody.angularVelocity')
    get angularVelocity (): number {
        if (this._body) {
            this._angularVelocity = this._body.getAngularVelocity();
        }
        return this._angularVelocity;
    }
    set angularVelocity (v: number) {
        this._angularVelocity = v;
        if (this._body) {
            this._body.setAngularVelocity(v);
        }
    }

    /**
     * @en
     * Should this body be prevented from rotating?
     * @zh
     * 是否禁止此刚体进行旋转。
     */
    @type(CCBoolean)
    @tooltip('i18n:physics2d.rigidbody.fixedRotation')
    get fixedRotation (): boolean {
        return this._fixedRotation;
    }
    set fixedRotation (v: boolean) {
        this._fixedRotation = v;
        if (this._body) {
            this._body.setFixedRotation(v);
        }
    }

    /**
     * @en
     * Whether to wake up this rigid body during initialization.
     * @zh
     * 是否在初始化时唤醒此刚体。
     */
    @serializable
    @tooltip('i18n:physics2d.rigidbody.awakeOnLoad')
    awakeOnLoad = true;

    // /**
    //  * @en
    //  * Set the active state of the body. An inactive body is not
    //  * simulated and cannot be collided with or woken up.
    //  * If body is active, all fixtures will be added to the
    //  * broad-phase.
    //  * If body is inactive, all fixtures will be removed from
    //  * the broad-phase and all contacts will be destroyed.
    //  * Fixtures on an inactive body are implicitly inactive and will
    //  * not participate in collisions, ray-casts, or queries.
    //  * Joints connected to an inactive body are implicitly inactive.
    //  * @zh
    //  * 设置刚体的激活状态。一个非激活状态下的刚体是不会被模拟和碰撞的，不管它是否处于睡眠状态下。
    //  * 如果刚体处于激活状态下，所有夹具会被添加到 粗测阶段（broad-phase）。
    //  * 如果刚体处于非激活状态下，所有夹具会被从 粗测阶段（broad-phase）中移除。
    //  * 在非激活状态下的夹具不会参与到碰撞，射线，或者查找中
    //  * 链接到非激活状态下刚体的关节也是非激活的。
    //  * @property {Boolean} active
    //  * @default true
    //  */
    // get active () {
    //     if (this._body) {
    //         return this._body.isActive();
    //     }
    //     return false;
    // }
    // set active (v) {
    //     if (this._body) {
    //         this._body.setActive(v);
    //     }
    // }

    /// RigidBody methods ///

    /**
     * @en
     * Whether the rigid body is awake.
     * @zh
     * 获取刚体是否正在休眠。
     */
    isAwake (): boolean {
        if (this._body) {
            return this._body.isAwake;
        }

        return false;
    }

    /**
     * @en
     * Wake up the rigid body.
     * @zh
     * 唤醒刚体。
     */
    wakeUp (): void {
        if (this._body) {
            this._body.wakeUp();
        }
    }

    /**
     * @en
     * Dormancy of rigid body.
     * @zh
     * 休眠刚体。
     */
    sleep (): void {
        if (this._body) {
            this._body.sleep();
        }
    }

    /**
     * @en
     * Get total mass of the body.
     * @zh
     * 获取刚体的质量。
     */
    getMass (): number {
        if (this._body) {
            return this._body.getMass();
        }
        return 0;
    }

    /**
     * @en
     * Apply a force at a world point. If the force is not
     * applied at the center of mass, it will generate a torque and
     * affect the angular velocity.
     * @zh
     * 施加一个力到刚体上的一个点。如果力没有施加到刚体的质心上，还会产生一个扭矩并且影响到角速度。
     * @param force @en the world force vector. @zh 世界坐标系下的力。
     * @param point @en the world position. @zh 世界坐标系下的力的作用点。
     * @param wake @en also wake up the body. @zh 唤醒刚体。
     */
    applyForce (force: Vec2, point: Vec2, wake: boolean): void {
        if (this._body) {
            this._body.applyForce(force, point, wake);
        }
    }

    /**
     * @en
     * Apply a force to the center of mass.
     * @zh
     * 施加一个力到刚体上的质心上。
     * @param force @en the world force vector. @zh 世界坐标系下的力。
     * @param wake @en also wake up the body. @zh 唤醒刚体。
     */
    applyForceToCenter (force: Vec2, wake: boolean): void {
        if (this._body) {
            this._body.applyForceToCenter(force, wake);
        }
    }

    /**
     * @en
     * Apply a torque. This affects the angular velocity.
     * @zh
     * 施加一个扭矩力，将影响刚体的角速度。
     * @param torque @en about the z-axis (out of the screen), usually in N-m. @zh 扭矩 N-m。
     * @param wake @en also wake up the body @zh 唤醒刚体。
     */
    applyTorque (torque: number, wake: boolean): void {
        if (this._body) {
            this._body.applyTorque(torque, wake);
        }
    }

    /**
     * @en
     * Apply a impulse at a world point, this immediately modifies the velocity.
     * If the impulse is not applied at the center of mass, it will generate a torque and
     * affect the angular velocity.
     * @zh
     * 施加冲量到刚体上的一个点，将立即改变刚体的线性速度。
     * 如果冲量施加到的点不是刚体的质心，那么将产生一个扭矩并影响刚体的角速度。
     * @param impulse @en the world impulse vector, usually in N-seconds or kg-m/s. @zh 冲量 N-seconds 或者 kg-m/s。
     * @param point @en the world position. @zh 世界坐标系下的作用点。
     * @param wake @en also wake up the body. @zh 唤醒刚体。
     */
    applyLinearImpulse (impulse: Vec2, point: Vec2, wake: boolean): void {
        if (this._body) {
            this._body.applyLinearImpulse(impulse, point, wake);
        }
    }

    /**
     * @en
     * Apply a impulse at the center of mass, this immediately modifies the velocity.
     * @zh
     * 施加冲量到刚体上的质心点，将立即改变刚体的线性速度。
     * @param impulse @en the world impulse vector, usually in N-seconds or kg-m/s. @zh 冲量 N-seconds 或者 kg-m/s。
     * @param wake @en also wake up the body @zh 唤醒刚体。
     */
    applyLinearImpulseToCenter (impulse: Vec2, wake: boolean): void {
        if (this._body) {
            this._body.applyLinearImpulseToCenter(impulse, wake);
        }
    }

    /**
     * @en
     * Apply an angular impulse.
     * @zh
     * 施加一个角冲量。
     * @param impulse @en the angular impulse in units of kg*m*m/s. @zh 角冲量 kg*m*m/s。
     * @param wake @en also wake up the body. @zh 唤醒刚体。
     */
    applyAngularImpulse (impulse: number, wake: boolean): void {
        if (this._body) {
            this._body.applyAngularImpulse(impulse, wake);
        }
    }

    /**
     * @en
     * Get the world linear velocity of a world point attached to this body.
     * @zh
     * 获取刚体上指定点的线性速度。
     * @param worldPoint @en a point in world coordinates. @zh 世界坐标系下的点。
     * @param out @en optional, the returned world velocity. @zh 可选，返回的世界坐标系下的速度。
     * @return @en the world linear velocity. @zh 指定点的世界坐标系下的速度。
     */
    getLinearVelocityFromWorldPoint<Out extends IVec2Like> (worldPoint: IVec2Like, out: Out): Out {
        if (this._body) {
            return this._body.getLinearVelocityFromWorldPoint(worldPoint, out);
        }
        return out;
    }

    /**
     * @en
     * Converts a world coordinate point to the given rigid body coordinate.
     * @zh
     * 将一个给定的世界坐标系下的向量转换为刚体本地坐标系下的向量。
     * @param worldVector @en a vector in world coordinates. @zh 世界坐标系下的向量。
     * @param out @en optional, the returned vector in local coordinate. @zh 可选，返回的本地坐标系下的向量。
     * @return @en a vector in local coordinate. @zh 本地坐标系下的向量。
     */
    getLocalVector<Out extends IVec2Like> (worldVector: IVec2Like, out: Out): Out {
        if (this._body) {
            return this._body.getLocalVector(worldVector, out);
        }
        return out;
    }

    /**
     * @en
     * Converts a given vector in this rigid body's local coordinate system to the world coordinate system
     * @zh
     * 将一个给定的刚体本地坐标系下的向量转换为世界坐标系下的向量。
     * @param localVector @en a vector in local coordinates. @zh 本地坐标系下的向量。
     * @param out @en optional, the returned vector in world coordinate. @zh 可选，返回的世界坐标系下的向量。
     * @return @en a vector in world coordinate. @zh 世界坐标系下的向量。
     */
    getWorldVector<Out extends IVec2Like> (localVector: IVec2Like, out: Out): Out {
        if (this._body) {
            return this._body.getWorldVector(localVector, out);
        }
        return out;
    }

    /**
     * @en
     * Converts a given point in the world coordinate system to this rigid body's local coordinate system.
     * @zh
     * 将一个给定的世界坐标系下的点转换为刚体本地坐标系下的点。
     * @param worldPoint @en a point in world coordinates. @zh 世界坐标系下的点。
     * @param out @en optional, the returned point in local coordinate. @zh 可选，返回的本地坐标系下的点。
     * @return @en a point in local coordinate. @zh 本地坐标系下的点。
     */
    getLocalPoint<Out extends IVec2Like> (worldPoint: IVec2Like, out: Out): Out {
        if (this._body) {
            return this._body.getLocalPoint(worldPoint, out);
        }
        return out;
    }

    /**
     * @en
     * Converts a given point in this rigid body's local coordinate system to the world coordinate system.
     * @zh
     * 将一个给定的刚体本地坐标系下的点转换为世界坐标系下的点。
     * @param localPoint @en a point in local coordinate. @zh 本地坐标系下的点。
     * @param out @en optional, the returned point in world coordinate. @zh 可选，返回的世界坐标系下的点。
     * @return @en a point in world coordinate. @zh 世界坐标系下的点。
     */
    getWorldPoint<Out extends IVec2Like> (localPoint: IVec2Like, out: Out): Out {
        if (this._body) {
            return this._body.getWorldPoint(localPoint, out);
        }
        return out;
    }

    /**
     * @en
     * Get the local position of the center of mass.
     * @zh
     * 获取刚体本地坐标系下的质心。
     */
    getLocalCenter<Out extends IVec2Like> (out: Out): Out {
        if (this._body) {
            return this._body.getLocalCenter(out);
        }
        return out;
    }

    /**
     * @en
     * Get the world position of the center of mass.
     * @zh
     * 获取刚体世界坐标系下的质心。
     */
    getWorldCenter<Out extends IVec2Like> (out: Out): Out {
        if (this._body) {
            return this._body.getWorldCenter(out);
        }
        return out;
    }

    /**
     * @en
     * Get the rotational inertia of the body about the local origin.
     * @zh
     * 获取刚体本地坐标系下原点的旋转惯性。
     */
    getInertia (): number {
        if (this._body) {
            return this._body.getInertia();
        }
        return 0;
    }

    /// COMPONENT LIFECYCLE ///
    protected onLoad (): void {
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._body = createRigidBody();
            this._body.initialize(this);
        }
    }

    protected onEnable (): void {
        if (this._body) {
            this._body.onEnable!();
        }
    }

    protected onDisable (): void {
        if (this._body) {
            this._body.onDisable!();
        }
    }

    protected onDestroy (): void {
        if (this._body) {
            this._body.onDestroy!();
        }
    }

    private _body: IRigidBody2D | null = null;
    get impl (): IRigidBody2D | null {
        return this._body;
    }

    @serializable
    private _group = PhysicsGroup.DEFAULT;

    @serializable
    private _type = ERigidBody2DType.Dynamic;

    @serializable
    private _allowSleep = true;

    @serializable
    private _gravityScale = 1;

    @serializable
    private _linearDamping = 0;

    @serializable
    private _angularDamping = 0;

    @serializable
    private _linearVelocity = new Vec2();

    @serializable
    private _angularVelocity = 0;

    @serializable
    private _fixedRotation = false;
}
