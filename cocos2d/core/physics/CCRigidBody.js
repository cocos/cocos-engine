/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

const NodeEvent = require('../CCNode').EventType;
var PTM_RATIO = require('./CCPhysicsTypes').PTM_RATIO;
var ANGLE_TO_PHYSICS_ANGLE = require('./CCPhysicsTypes').ANGLE_TO_PHYSICS_ANGLE;
var PHYSICS_ANGLE_TO_ANGLE = require('./CCPhysicsTypes').PHYSICS_ANGLE_TO_ANGLE;

var getWorldRotation = require('./utils').getWorldRotation;
var BodyType = require('./CCPhysicsTypes').BodyType;

var tempb2Vec21 = new b2.Vec2();
var tempb2Vec22 = new b2.Vec2();

var VEC2_ZERO = cc.Vec2.ZERO;

/**
 * @class RigidBody
 * @extends Component
 */
var RigidBody = cc.Class({
    name: 'cc.RigidBody',
    extends: cc.Component,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.physics/Rigid Body',
        disallowMultiple: true
    },

    properties: {
        _type: BodyType.Dynamic,
        _allowSleep: true,
        _gravityScale: 1,
        _linearDamping: 0,
        _angularDamping: 0,
        _linearVelocity: cc.v2(0, 0),
        _angularVelocity: 0,
        _fixedRotation: false,

        enabled: {
            get: function () {
                return this._enabled;
            },
            set: function () {
                cc.warnID(8200);
            },
            visible: false,
            override: true
        },

        /**
         * !#en
         * Should enabled contact listener?
         * When a collision is trigger, the collision callback will only be called when enabled contact listener.
         * !#zh
         * 是否启用接触接听器。
         * 当 collider 产生碰撞时，只有开启了接触接听器才会调用相应的回调函数
         * @property {Boolean} enabledContactListener
         * @default false
         */
        enabledContactListener: {
            default: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.enabledContactListener'
        },

        /**
         * !#en
         * Collision callback.
         * Called when two collider begin to touch.
         * !#zh
         * 碰撞回调。
         * 如果你的脚本中实现了这个函数，那么它将会在两个碰撞体开始接触时被调用。
         * @method onBeginContact
         * @param {PhysicsContact} contact - contact information
         * @param {PhysicsCollider} selfCollider - the collider belong to this rigidbody
         * @param {PhysicsCollider} otherCollider - the collider belong to another rigidbody
         */
        /**
         * !#en
         * Collision callback.
         * Called when two collider cease to touch.
         * !#zh
         * 碰撞回调。
         * 如果你的脚本中实现了这个函数，那么它将会在两个碰撞体停止接触时被调用。
         * @method onEndContact
         * @param {PhysicsContact} contact - contact information
         * @param {PhysicsCollider} selfCollider - the collider belong to this rigidbody
         * @param {PhysicsCollider} otherCollider - the collider belong to another rigidbody
         */
        /**
         * !#en
         * Collision callback.
         * This is called when a contact is updated. 
         * This allows you to inspect a contact before it goes to the solver(e.g. disable contact).
	     * Note: this is called only for awake bodies.
	     * Note: this is called even when the number of contact points is zero.
	     * Note: this is not called for sensors.
         * !#zh
         * 碰撞回调。
         * 如果你的脚本中实现了这个函数，那么它将会在接触更新时被调用。
         * 你可以在接触被处理前根据他包含的信息作出相应的处理，比如将这个接触禁用掉。
         * 注意：回调只会为醒着的刚体调用。
         * 注意：接触点为零的时候也有可能被调用。
         * 注意：感知体(sensor)的回调不会被调用。
         * @method onPreSolve
         * @param {PhysicsContact} contact - contact information
         * @param {PhysicsCollider} selfCollider - the collider belong to this rigidbody
         * @param {PhysicsCollider} otherCollider - the collider belong to another rigidbody
         */
        /**
         * !#en
         * Collision callback.
         * This is called after a contact is updated. 
         * You can get the impulses from the contact in this callback.
         * !#zh
         * 碰撞回调。
         * 如果你的脚本中实现了这个函数，那么它将会在接触更新完后被调用。
         * 你可以在这个回调中从接触信息中获取到冲量信息。
         * @method onPostSolve
         * @param {PhysicsContact} contact - contact information
         * @param {PhysicsCollider} selfCollider - the collider belong to this rigidbody
         * @param {PhysicsCollider} otherCollider - the collider belong to another rigidbody
         */
        
        /**
         * !#en
         * Is this a fast moving body that should be prevented from tunneling through
         * other moving bodies? 
         * Note : 
         * - All bodies are prevented from tunneling through kinematic and static bodies. This setting is only considered on dynamic bodies.
         * - You should use this flag sparingly since it increases processing time.
         * !#zh
         * 这个刚体是否是一个快速移动的刚体，并且需要禁止穿过其他快速移动的刚体？
         * 需要注意的是 : 
         *  - 所有刚体都被禁止从 运动刚体 和 静态刚体 中穿过。此选项只关注于 动态刚体。
         *  - 应该尽量少的使用此选项，因为它会增加程序处理时间。
         * @property {Boolean} bullet
         * @default false
         */
        bullet: {
            default: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.bullet'
        },

        /**
         * !#en
         * Rigidbody type : Static, Kinematic, Dynamic or Animated.
         * !#zh
         * 刚体类型： Static, Kinematic, Dynamic or Animated.
         * @property {RigidBodyType} type
         * @default RigidBodyType.Dynamic
         */        
        type: {
            type: BodyType,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.type',
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;

                if (this._b2Body) {
                    if (value === BodyType.Animated) {
                        this._b2Body.SetType(BodyType.Kinematic);
                    }
                    else {
                        this._b2Body.SetType(value);
                    }
                }
            }
        },

        /**
         * !#en
         * Set this flag to false if this body should never fall asleep.
         * Note that this increases CPU usage.
         * !#zh
         * 如果此刚体永远都不应该进入睡眠，那么设置这个属性为 false。
         * 需要注意这将使 CPU 占用率提高。
         * @property {Boolean} allowSleep
         * @default true
         */
        allowSleep: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.allowSleep',
            get: function () {
                if (this._b2Body) {
                    return this._b2Body.IsSleepingAllowed();
                }
                return this._allowSleep;
            },
            set: function (value) {
                this._allowSleep = value;

                if (this._b2Body) {
                    this._b2Body.SetSleepingAllowed(value);
                }
            }
        },

        /**
         * !#en 
         * Scale the gravity applied to this body.
         * !#zh
         * 缩放应用在此刚体上的重力值
         * @property {Number} gravityScale
         * @default 1
         */
        gravityScale: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.gravityScale',
            get: function () {
                return this._gravityScale;
            },
            set: function (value) {
                this._gravityScale = value;
                if (this._b2Body) {
                    this._b2Body.SetGravityScale(value);
                }
            }
        },

        /**
         * !#en
         * Linear damping is use to reduce the linear velocity.
         * The damping parameter can be larger than 1, but the damping effect becomes sensitive to the
         * time step when the damping parameter is large.
         * !#zh
         * Linear damping 用于衰减刚体的线性速度。衰减系数可以大于 1，但是当衰减系数比较大的时候，衰减的效果会变得比较敏感。
         * @property {Number} linearDamping
         * @default 0
         */
        linearDamping: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.linearDamping',
            get: function () {
                return this._linearDamping;
            },
            set: function (value) {
                this._linearDamping = value;
                if (this._b2Body) {
                    this._b2Body.SetLinearDamping(this._linearDamping);
                }
            }
        },

        /**
         * !#en
         * Angular damping is use to reduce the angular velocity. The damping parameter
         * can be larger than 1 but the damping effect becomes sensitive to the
         * time step when the damping parameter is large.
         * !#zh
         * Angular damping 用于衰减刚体的角速度。衰减系数可以大于 1，但是当衰减系数比较大的时候，衰减的效果会变得比较敏感。
         * @property {Number} angularDamping
         * @default 0
         */
        angularDamping: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.angularDamping',
            get: function () {
                return this._angularDamping;
            },
            set: function (value) {
                this._angularDamping = value;
                if (this._b2Body) {
                    this._b2Body.SetAngularDamping(value);
                }
            }
        },

        /**
         * !#en
         * The linear velocity of the body's origin in world co-ordinates.
         * !#zh
         * 刚体在世界坐标下的线性速度
         * @property {Vec2} linearVelocity
         * @default cc.v2(0,0)
         */
        linearVelocity: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.linearVelocity',
            type: cc.Vec2,
            get: function () {
                var lv = this._linearVelocity;
                if (this._b2Body) {
                    var velocity = this._b2Body.GetLinearVelocity();
                    lv.x = velocity.x*PTM_RATIO;
                    lv.y = velocity.y*PTM_RATIO;
                }
                return lv;
            },
            set: function (value) {
                this._linearVelocity = value;
                var b2body = this._b2Body;
                if (b2body) {
                    var temp = b2body.m_linearVelocity;
                    temp.Set(value.x/PTM_RATIO, value.y/PTM_RATIO);
                    b2body.SetLinearVelocity(temp);
                }
            }
        },

        /**
         * !#en
         * The angular velocity of the body.
         * !#zh
         * 刚体的角速度
         * @property {Number} angularVelocity
         * @default 0
         */
        angularVelocity: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.angularVelocity',
            get: function () {
                if (this._b2Body) {
                    return this._b2Body.GetAngularVelocity() * PHYSICS_ANGLE_TO_ANGLE;
                }
                return this._angularVelocity;
            },
            set: function (value) {
                this._angularVelocity = value;
                if (this._b2Body) {
                    this._b2Body.SetAngularVelocity( value * ANGLE_TO_PHYSICS_ANGLE );
                }
            }
        },

        /**
         * !#en
         * Should this body be prevented from rotating?
         * !#zh
         * 是否禁止此刚体进行旋转
         * @property {Boolean} fixedRotation
         * @default false
         */
        fixedRotation: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.fixedRotation',
            get: function () {
                return this._fixedRotation;
            },
            set: function (value) {
                this._fixedRotation = value;
                if (this._b2Body) {
                    this._b2Body.SetFixedRotation(value);
                }
            }
        },

        /**
         * !#en
         * Set the sleep state of the body. A sleeping body has very low CPU cost.(When the rigid body is hit, if the rigid body is in sleep state, it will be immediately awakened.)
         * !#zh
         * 设置刚体的睡眠状态。 睡眠的刚体具有非常低的 CPU 成本。（当刚体被碰撞到时，如果刚体处于睡眠状态，它会立即被唤醒）
         * @property {Boolean} awake
         * @default false
         */
        awake: {
            visible: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.awake',
            get: function () {
                return this._b2Body ? this._b2Body.IsAwake() : false;
            },
            set: function (value) {
                if (this._b2Body) {
                    this._b2Body.SetAwake( value );
                }
            }
        },

        /**
         * !#en
         * Whether to wake up this rigid body during initialization
         * !#zh
         * 是否在初始化时唤醒此刚体
         * @property {Boolean} awakeOnLoad
         * @default true
         */
        awakeOnLoad: {
            default: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.rigidbody.awakeOnLoad',
            animatable: false,
        },

        /**
         * !#en
         * Set the active state of the body. An inactive body is not
	     * simulated and cannot be collided with or woken up.
	     * If body is active, all fixtures will be added to the
	     * broad-phase.
	     * If body is inactive, all fixtures will be removed from
	     * the broad-phase and all contacts will be destroyed.
	     * Fixtures on an inactive body are implicitly inactive and will
	     * not participate in collisions, ray-casts, or queries.
	     * Joints connected to an inactive body are implicitly inactive.
         * !#zh
         * 设置刚体的激活状态。一个非激活状态下的刚体是不会被模拟和碰撞的，不管它是否处于睡眠状态下。
         * 如果刚体处于激活状态下，所有夹具会被添加到 粗测阶段（broad-phase）。
         * 如果刚体处于非激活状态下，所有夹具会被从 粗测阶段（broad-phase）中移除。
         * 在非激活状态下的夹具不会参与到碰撞，射线，或者查找中
         * 链接到非激活状态下刚体的关节也是非激活的。
         * @property {Boolean} active
         * @default true
         */
        active: {
            visible: false,
            get: function () {
                return this._b2Body ? this._b2Body.IsActive() : false;
            },
            set: function (value) {
                if (this._b2Body) {
                    this._b2Body.SetActive(value);
                }
            }
        }
    },

    /**
     * !#en
     * Gets a local point relative to the body's origin given a world point.
     * !#zh
     * 将一个给定的世界坐标系下的点转换为刚体本地坐标系下的点
     * @method getLocalPoint
     * @param {Vec2} worldPoint - a point in world coordinates.
     * @param {Vec2} out - optional, the receiving point
     * @return {Vec2} the corresponding local point relative to the body's origin.
     */
    getLocalPoint: function (worldPoint, out) {
        out = out || cc.v2();
        if (this._b2Body) {
            tempb2Vec21.Set(worldPoint.x/PTM_RATIO, worldPoint.y/PTM_RATIO);
            var pos = this._b2Body.GetLocalPoint(tempb2Vec21, out);
            out.x = pos.x*PTM_RATIO;
            out.y = pos.y*PTM_RATIO;
        }
        return out;
    },

    /**
     * !#en
     * Get the world coordinates of a point given the local coordinates.
     * !#zh
     * 将一个给定的刚体本地坐标系下的点转换为世界坐标系下的点
     * @method getWorldPoint
     * @param {Vec2} localPoint - a point in local coordinates.
     * @param {Vec2} out - optional, the receiving point
     * @return {Vec2} the same point expressed in world coordinates.
     */
    getWorldPoint: function (localPoint, out) {
        out = out || cc.v2();
        if (this._b2Body) {
            tempb2Vec21.Set(localPoint.x/PTM_RATIO, localPoint.y/PTM_RATIO);
            var pos = this._b2Body.GetWorldPoint(tempb2Vec21, out);
            out.x = pos.x*PTM_RATIO;
            out.y = pos.y*PTM_RATIO;
        }
        return out;
    },

    /**
     * !#en
     * Get the world coordinates of a vector given the local coordinates.
     * !#zh
     * 将一个给定的世界坐标系下的向量转换为刚体本地坐标系下的向量
     * @method getWorldVector
     * @param {Vec2} localVector - a vector in world coordinates.
     * @param {Vec2} out - optional, the receiving vector
     * @return {Vec2} the same vector expressed in local coordinates.
     */ 
    getWorldVector: function (localVector, out) {
        out = out || cc.v2();
        if (this._b2Body) {
            tempb2Vec21.Set(localVector.x/PTM_RATIO, localVector.y/PTM_RATIO);
            var vector = this._b2Body.GetWorldVector(tempb2Vec21, out);
            out.x = vector.x*PTM_RATIO;
            out.y = vector.y*PTM_RATIO;
        }
        return out;
    },

    /**
     * !#en
     * Gets a local vector relative to the body's origin given a world vector.
     * !#zh
     * 将一个给定的世界坐标系下的点转换为刚体本地坐标系下的点
     * @method getLocalVector
     * @param {Vec2} worldVector - a vector in world coordinates.
     * @param {Vec2} out - optional, the receiving vector
     * @return {Vec2} the corresponding local vector relative to the body's origin.
     */
    getLocalVector: function (worldVector, out) {
        out = out || cc.v2();
        if (this._b2Body) {
            tempb2Vec21.Set(worldVector.x/PTM_RATIO, worldVector.y/PTM_RATIO);
            var vector = this._b2Body.GetLocalVector(tempb2Vec21, out);
            out.x = vector.x*PTM_RATIO;
            out.y = vector.y*PTM_RATIO;
        }
        return out;
    },

    /**
     * !#en
     * Get the world body origin position.
     * !#zh
     * 获取刚体世界坐标系下的原点值
     * @method getWorldPosition
     * @param {Vec2} out - optional, the receiving point
     * @return {Vec2} the world position of the body's origin.
     */
    getWorldPosition: function (out) {
        out = out || cc.v2();
        if (this._b2Body) {
            var pos = this._b2Body.GetPosition();
            out.x = pos.x*PTM_RATIO;
            out.y = pos.y*PTM_RATIO;
        }
        return out;
    },

    /**
     * !#en
     * Get the world body rotation angle.
     * !#zh
     * 获取刚体世界坐标系下的旋转值。
     * @method getWorldRotation
     * @return {Number} the current world rotation angle.
     */
    getWorldRotation: function () {
        if (this._b2Body) {
            return this._b2Body.GetAngle() * PHYSICS_ANGLE_TO_ANGLE;
        }
        return 0;
    },

    /**
     * !#en
     * Get the local position of the center of mass.
     * !#zh
     * 获取刚体本地坐标系下的质心
     * @method getLocalCenter
     * @return {Vec2} the local position of the center of mass.
     */
    getLocalCenter: function (out) {
        out = out || cc.v2();
        if (this._b2Body) {
            var pos = this._b2Body.GetLocalCenter();
            out.x = pos.x*PTM_RATIO;
            out.y = pos.y*PTM_RATIO;
        }
        return out;
    },

    /**
     * !#en
     * Get the world position of the center of mass.
     * !#zh
     * 获取刚体世界坐标系下的质心
     * @method getWorldCenter
     * @return {Vec2} the world position of the center of mass.
     */
    getWorldCenter: function (out) {
        out = out || cc.v2();
        if (this._b2Body) {
            var pos = this._b2Body.GetWorldCenter();
            out.x = pos.x*PTM_RATIO;
            out.y = pos.y*PTM_RATIO;
        }
        return out;
    },

    /**
     * !#en
     * Get the world linear velocity of a world point attached to this body.
     * !#zh
     * 获取刚体上指定点的线性速度
     * @method getLinearVelocityFromWorldPoint
     * @param {Vec2} worldPoint - a point in world coordinates.
     * @param {Vec2} out - optional, the receiving point
     * @return {Vec2} the world velocity of a point. 
     */
    getLinearVelocityFromWorldPoint: function (worldPoint, out) {
        out = out || cc.v2();
        if (this._b2Body) {
            tempb2Vec21.Set(worldPoint.x/PTM_RATIO, worldPoint.y/PTM_RATIO);
            var velocity = this._b2Body.GetLinearVelocityFromWorldPoint(tempb2Vec21, out);
            out.x = velocity.x*PTM_RATIO;
            out.y = velocity.y*PTM_RATIO;
        }
        return out;
    },

    /**
     * !#en
     * Get total mass of the body.
     * !#zh
     * 获取刚体的质量。
     * @method getMass
     * @return {Number} the total mass of the body.
     */
    getMass: function () {
        return this._b2Body ? this._b2Body.GetMass() : 0;
    },

    /**
     * !#en
     * Get the rotational inertia of the body about the local origin.
     * !#zh
     * 获取刚体本地坐标系下原点的旋转惯性
     * @method getInertia
     * @return {Number} the rotational inertia, usually in kg-m^2.
     */
    getInertia: function () {
        return this._b2Body ? this._b2Body.GetInertia() * PTM_RATIO * PTM_RATIO : 0;
    },

    /**
     * !#en
     * Get all the joints connect to the rigidbody.
     * !#zh
     * 获取链接到此刚体的所有关节
     * @method getJointList
     * @return {[Joint]} the joint list.
     */
    getJointList: function () {
        if (!this._b2Body) return [];

        var joints = [];

        var list = this._b2Body.GetJointList();
        if (!list) return [];

        joints.push(list.joint._joint);
        
        // find prev joint
        var prev = list.prev;
        while (prev) {
            joints.push(prev.joint._joint);
            prev = prev.prev;
        }

        // find next joint
        var next = list.next;
        while (next) {
            joints.push(next.joint._joint);
            next = next.next;
        }

        return joints;
    },

    /**
     * !#en
     * Apply a force at a world point. If the force is not
	 * applied at the center of mass, it will generate a torque and
	 * affect the angular velocity.
     * !#zh
     * 施加一个力到刚体上的一个点。如果力没有施加到刚体的质心上，还会产生一个扭矩并且影响到角速度。
     * @method applyForce
     * @param {Vec2} force - the world force vector.
     * @param {Vec2} point - the world position.
     * @param {Boolean} wake - also wake up the body.
     */
    applyForce: function (force, point, wake) {
        if (this._b2Body) {
            tempb2Vec21.Set(force.x/PTM_RATIO, force.y/PTM_RATIO);
            tempb2Vec22.Set(point.x/PTM_RATIO, point.y/PTM_RATIO);
            this._b2Body.ApplyForce(tempb2Vec21, tempb2Vec22, wake);
        }
    },

    /**
     * !#en
     * Apply a force to the center of mass.
     * !#zh
     * 施加一个力到刚体上的质心上。
     * @method applyForceToCenter
     * @param {Vec2} force - the world force vector.
     * @param {Boolean} wake - also wake up the body.
     */
    applyForceToCenter: function (force, wake) {
        if (this._b2Body) {
            tempb2Vec21.Set(force.x/PTM_RATIO, force.y/PTM_RATIO);
            this._b2Body.ApplyForceToCenter(tempb2Vec21, wake);
        }
    },

    /**
     * !#en
     * Apply a torque. This affects the angular velocity.
     * !#zh
     * 施加一个扭矩力，将影响刚体的角速度
     * @method applyTorque
     * @param {Number} torque - about the z-axis (out of the screen), usually in N-m.
     * @param {Boolean} wake - also wake up the body
     */
    applyTorque: function (torque, wake) {
        if (this._b2Body) {
            this._b2Body.ApplyTorque(torque/PTM_RATIO, wake);
        }
    },

    /**
     * !#en
     * Apply a impulse at a world point, This immediately modifies the velocity.
	 * If the impulse is not applied at the center of mass, it will generate a torque and
	 * affect the angular velocity.
     * !#zh
     * 施加冲量到刚体上的一个点，将立即改变刚体的线性速度。
     * 如果冲量施加到的点不是刚体的质心，那么将产生一个扭矩并影响刚体的角速度。
     * @method applyLinearImpulse
     * @param {Vec2} impulse - the world impulse vector, usually in N-seconds or kg-m/s.
     * @param {Vec2} point - the world position
     * @param {Boolean} wake - alse wake up the body
     */
    applyLinearImpulse: function (impulse, point, wake) {
        if (this._b2Body) {
            tempb2Vec21.Set(impulse.x/PTM_RATIO, impulse.y/PTM_RATIO);
            tempb2Vec22.Set(point.x/PTM_RATIO, point.y/PTM_RATIO);
            this._b2Body.ApplyLinearImpulse(tempb2Vec21, tempb2Vec22, wake);
        }
    },

    /**
     * !#en
     * Apply an angular impulse.
     * !#zh
     * 施加一个角速度冲量。
     * @method applyAngularImpulse
     * @param {Number} impulse - the angular impulse in units of kg*m*m/s
     * @param {Boolean} wake - also wake up the body
     */
    applyAngularImpulse: function (impulse, wake) {
        if (this._b2Body) {
            this._b2Body.ApplyAngularImpulse(impulse/PTM_RATIO/PTM_RATIO, wake);
        }
    },

    /**
     * !#en
     * Synchronize node's world position to box2d rigidbody's position.
     * If enableAnimated is true and rigidbody's type is Animated type, 
     * will set linear velocity instead of directly set rigidbody's position.
     * !#zh
     * 同步节点的世界坐标到 box2d 刚体的坐标上。
     * 如果 enableAnimated 是 true，并且刚体的类型是 Animated ，那么将设置刚体的线性速度来代替直接设置刚体的位置。
     * @method syncPosition
     * @param {Boolean} enableAnimated
     */
    syncPosition: function (enableAnimated) {
        var b2body = this._b2Body;
        if (!b2body) return;

        var pos = this.node.convertToWorldSpaceAR(VEC2_ZERO);

        var temp;
        if (this.type === BodyType.Animated) {
            temp = b2body.GetLinearVelocity();
        }
        else {
            temp = b2body.GetPosition();
        }

        temp.x = pos.x / PTM_RATIO;
        temp.y = pos.y / PTM_RATIO;

        if (this.type === BodyType.Animated && enableAnimated) {
            var b2Pos = b2body.GetPosition();

            var timeStep = cc.game.config['frameRate'];
            temp.x = (temp.x - b2Pos.x)*timeStep;
            temp.y = (temp.y - b2Pos.y)*timeStep;

            b2body.SetAwake(true);
            b2body.SetLinearVelocity(temp);
        }
        else {
            b2body.SetTransformVec(temp, b2body.GetAngle());
        }
    },
    /**
     * !#en
     * Synchronize node's world angle to box2d rigidbody's angle.
     * If enableAnimated is true and rigidbody's type is Animated type, 
     * will set angular velocity instead of directly set rigidbody's angle.
     * !#zh
     * 同步节点的世界旋转角度值到 box2d 刚体的旋转值上。
     * 如果 enableAnimated 是 true，并且刚体的类型是 Animated ，那么将设置刚体的角速度来代替直接设置刚体的角度。
     * @method syncRotation
     * @param {Boolean} enableAnimated
     */
    syncRotation: function (enableAnimated) {
        var b2body = this._b2Body;
        if (!b2body) return;

        var rotation = ANGLE_TO_PHYSICS_ANGLE * getWorldRotation(this.node);
        if (this.type === BodyType.Animated && enableAnimated) {
            var b2Rotation = b2body.GetAngle();
            var timeStep = cc.game.config['frameRate'];
            b2body.SetAwake(true);
            b2body.SetAngularVelocity((rotation - b2Rotation)*timeStep);
        }
        else {
            b2body.SetTransformVec(b2body.GetPosition(), rotation);
        }
    },
    
    resetVelocity: function () {
        var b2body = this._b2Body;
        if (!b2body) return;

        var temp = b2body.m_linearVelocity;
        temp.Set(0, 0);

        b2body.SetLinearVelocity(temp);
        b2body.SetAngularVelocity(0);
    },

    onEnable: function () {
        this._init();
    },

    onDisable: function () {
        this._destroy();
    },

    _registerNodeEvents: function () {
        var node = this.node;
        node.on(NodeEvent.POSITION_CHANGED, this._onNodePositionChanged, this);
        node.on(NodeEvent.ROTATION_CHANGED, this._onNodeRotationChanged, this);
        node.on(NodeEvent.SCALE_CHANGED, this._onNodeScaleChanged, this);
    },

    _unregisterNodeEvents: function () {
        var node = this.node;
        node.off(NodeEvent.POSITION_CHANGED, this._onNodePositionChanged, this);
        node.off(NodeEvent.ROTATION_CHANGED, this._onNodeRotationChanged, this);
        node.off(NodeEvent.SCALE_CHANGED, this._onNodeScaleChanged, this);
    },

    _onNodePositionChanged: function () {
        this.syncPosition(true);
    },

    _onNodeRotationChanged: function (event) {
        this.syncRotation(true);
    },

    _onNodeScaleChanged: function (event) {
        if (this._b2Body) {
            var colliders = this.getComponents(cc.PhysicsCollider);
            for (var i = 0; i < colliders.length; i++) {
                colliders[i].apply();
            }
        }
    },

   _init: function () {
        cc.director.getPhysicsManager().pushDelayEvent(this, '__init', []);
    },
    _destroy: function () {
        cc.director.getPhysicsManager().pushDelayEvent(this, '__destroy', []);
    },

    __init: function () {
        if (this._inited) return;

       this._registerNodeEvents();

        var bodyDef = new b2.BodyDef();
        
        if (this.type === BodyType.Animated) {
            bodyDef.type = BodyType.Kinematic;
        }
        else {
            bodyDef.type = this.type;
        }

        bodyDef.allowSleep = this.allowSleep;
        bodyDef.gravityScale = this.gravityScale;
        bodyDef.linearDamping = this.linearDamping;
        bodyDef.angularDamping = this.angularDamping;

        var linearVelocity = this.linearVelocity;
        bodyDef.linearVelocity = new b2.Vec2(linearVelocity.x/PTM_RATIO, linearVelocity.y/PTM_RATIO);

        bodyDef.angularVelocity = this.angularVelocity * ANGLE_TO_PHYSICS_ANGLE;
        
        bodyDef.fixedRotation = this.fixedRotation;
        bodyDef.bullet = this.bullet;

        var node = this.node;
        var pos = node.convertToWorldSpaceAR(VEC2_ZERO);
        bodyDef.position = new b2.Vec2(pos.x / PTM_RATIO, pos.y / PTM_RATIO);
        bodyDef.angle = -(Math.PI / 180) * getWorldRotation(node);

        bodyDef.awake = this.awakeOnLoad;

        cc.director.getPhysicsManager()._addBody(this, bodyDef);

        this._inited = true;
    },
    __destroy: function () {
        if (!this._inited) return;

        cc.director.getPhysicsManager()._removeBody(this);
        this._unregisterNodeEvents();
        
        this._inited = false;
    },

    _getBody: function () {
        return this._b2Body;
    },

});

cc.RigidBody = module.exports = RigidBody;
