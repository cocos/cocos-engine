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

const PhysicsTypes = require('./CCPhysicsTypes');
const ContactType = PhysicsTypes.ContactType;
const BodyType = PhysicsTypes.BodyType;
const RayCastType = PhysicsTypes.RayCastType;
const DrawBits = PhysicsTypes.DrawBits;

const PTM_RATIO = PhysicsTypes.PTM_RATIO;
const ANGLE_TO_PHYSICS_ANGLE = PhysicsTypes.ANGLE_TO_PHYSICS_ANGLE;
const PHYSICS_ANGLE_TO_ANGLE = PhysicsTypes.PHYSICS_ANGLE_TO_ANGLE;

const convertToNodeRotation = require('./utils').convertToNodeRotation;
const DebugDraw = require('./platform/CCPhysicsDebugDraw');

var b2_aabb_tmp = new b2.AABB();
var b2_vec2_tmp1 = new b2.Vec2();
var b2_vec2_tmp2 = new b2.Vec2();

var vec2_tmp = cc.v2();

/**
 * !#en
 * Physics manager uses box2d as the inner physics system, and hide most box2d implement details(creating rigidbody, synchronize rigidbody info to node).
 * You can visit some common box2d function through physics manager(hit testing, raycast, debug info).
 * Physics manager distributes the collision information to each collision callback when collision is produced.
 * Note: You need first enable the collision listener in the rigidbody.
 * !#zh
 * 物理系统将 box2d 作为内部物理系统，并且隐藏了大部分 box2d 实现细节（比如创建刚体，同步刚体信息到节点中等）。
 * 你可以通过物理系统访问一些 box2d 常用的功能，比如点击测试，射线测试，设置测试信息等。
 * 物理系统还管理碰撞信息的分发，她会在产生碰撞时，将碰撞信息分发到各个碰撞回调中。
 * 注意：你需要先在刚体中开启碰撞接听才会产生相应的碰撞回调。<br>
 * 支持的物理系统指定绘制信息事件，请参阅 {{#crossLink "PhysicsManager.DrawBits"}}{{/crossLink}}
 * @class PhysicsManager
 * @uses EventTarget
 */
var PhysicsManager = cc.Class({
    mixins: [cc.EventTarget],

    statics: {
        DrawBits: DrawBits,

        /**
         * !#en
         * The ratio transform between physics unit and pixel unit, generally is 32.
         * !#zh
         * 物理单位与像素单位互相转换的比率，一般是 32。
         * @property {Number} PTM_RATIO
         * @static
         */
        PTM_RATIO: PTM_RATIO,

        /**
         * !#en
         * The velocity iterations for the velocity constraint solver.
         * !#zh
         * 速度更新迭代数
         * @property {Number} VELOCITY_ITERATIONS
         * @default 10
         * @static
         */
        VELOCITY_ITERATIONS: 10,

        /**
         * !#en
         * The position Iterations for the position constraint solver.
         * !#zh
         * 位置迭代更新数
         * @property {Number} POSITION_ITERATIONS
         * @default 10
         * @static
         */
        POSITION_ITERATIONS: 10,

        /**
         * !#en
         * Specify the fixed time step.
         * Need enabledAccumulator to make it work.
         * !#zh
         * 指定固定的物理更新间隔时间，需要开启 enabledAccumulator 才有效。
         * @property {Number} FIXED_TIME_STEP
         * @default 1/60
         * @static
         */
        FIXED_TIME_STEP: 1/60,

        /**
         * !#en
         * Specify the max accumulator time.
         * Need enabledAccumulator to make it work.
         * !#zh
         * 每次可用于更新物理系统的最大时间，需要开启 enabledAccumulator 才有效。
         * @property {Number} MAX_ACCUMULATOR
         * @default 1/5
         * @static
         */
        MAX_ACCUMULATOR: 1/5
    },

    ctor: function () {
        this._debugDrawFlags = 0;
        this._debugDrawer = null;

        this._world = null;

        this._bodies = [];
        this._joints = [];

        this._contactMap = {};
        this._contactID = 0;

        this._delayEvents = [];

        this._accumulator = 0;

        cc.director._scheduler && cc.director._scheduler.enableForTarget(this);

        /**
         * !#en
         * If enabled accumulator, then will call step function with the fixed time step FIXED_TIME_STEP. 
         * And if the update dt is bigger than the time step, then will call step function several times.
         * If disabled accumulator, then will call step function with a time step calculated with the frame rate.
         * !#zh
         * 如果开启此选项，那么将会以固定的间隔时间 FIXED_TIME_STEP 来更新物理引擎，如果一个 update 的间隔时间大于 FIXED_TIME_STEP，则会对物理引擎进行多次更新。
         * 如果关闭此选项，那么将会根据设定的 frame rate 计算出一个间隔时间来更新物理引擎。
         * @property {Boolean} enabledAccumulator
         * @default false
         */
        this.enabledAccumulator = false;        
    },

    pushDelayEvent: function (target, func, args) {
        if (this._steping) {
            this._delayEvents.push({
                target: target,
                func: func,
                args: args
            });
        }
        else {
            target[func].apply(target, args);
        }
    },

    update: function (dt) {
        var world = this._world;
        if (!world || !this.enabled) return;

        this.emit('before-step');
        
        this._steping = true;

        var velocityIterations = PhysicsManager.VELOCITY_ITERATIONS;
        var positionIterations = PhysicsManager.POSITION_ITERATIONS;

        if (this.enabledAccumulator) {
            this._accumulator += dt;

            var FIXED_TIME_STEP = PhysicsManager.FIXED_TIME_STEP;
            var MAX_ACCUMULATOR = PhysicsManager.MAX_ACCUMULATOR;

            // max accumulator time to avoid spiral of death
            if (this._accumulator > MAX_ACCUMULATOR) {
                this._accumulator = MAX_ACCUMULATOR;
            }

            while (this._accumulator > FIXED_TIME_STEP) {
                world.Step(FIXED_TIME_STEP, velocityIterations, positionIterations);
                this._accumulator -= FIXED_TIME_STEP;
            }
        }
        else {
            var timeStep = 1/cc.game.config['frameRate'];
            world.Step(timeStep, velocityIterations, positionIterations);
        }

        if (this.debugDrawFlags) {
            this._checkDebugDrawValid();
            this._debugDrawer.clear();
            world.DrawDebugData();
        }

        this._steping = false;

        var events = this._delayEvents;
        for (var i = 0, l = events.length; i < l; i++) {
            var event = events[i];
            event.target[event.func].apply(event.target, event.args);
        }
        events.length = 0;

        this._syncNode();
    },

    /**
     * !#en
     * Test which collider contains the given world point
     * !#zh
     * 获取包含给定世界坐标系点的碰撞体
     * @method testPoint
     * @param {Vec2} point - the world point
     * @return {PhysicsCollider}
     */
    testPoint: function (point) {
        var x = b2_vec2_tmp1.x = point.x/PTM_RATIO;
        var y = b2_vec2_tmp1.y = point.y/PTM_RATIO;

        var d = 0.2/PTM_RATIO;
        b2_aabb_tmp.lowerBound.x = x-d;
        b2_aabb_tmp.lowerBound.y = y-d;
        b2_aabb_tmp.upperBound.x = x+d;
        b2_aabb_tmp.upperBound.y = y+d;

        var callback = this._aabbQueryCallback;
        callback.init(b2_vec2_tmp1);
        this._world.QueryAABB(callback, b2_aabb_tmp);

        var fixture = callback.getFixture();
        if (fixture) {
            return fixture.collider;
        }

        return null;
    },

    /**
     * !#en
     * Test which colliders intersect the given world rect
     * !#zh
     * 获取与给定世界坐标系矩形相交的碰撞体
     * @method testAABB
     * @param {Rect} rect - the world rect
     * @return {[PhysicsCollider]}
     */
    testAABB: function (rect) {
        b2_aabb_tmp.lowerBound.x = rect.xMin/PTM_RATIO;
        b2_aabb_tmp.lowerBound.y = rect.yMin/PTM_RATIO;
        b2_aabb_tmp.upperBound.x = rect.xMax/PTM_RATIO;
        b2_aabb_tmp.upperBound.y = rect.yMax/PTM_RATIO;

        var callback = this._aabbQueryCallback;
        callback.init();
        this._world.QueryAABB(callback, b2_aabb_tmp);

        var fixtures = callback.getFixtures();
        var colliders = fixtures.map(function (fixture) {
            return fixture.collider;
        });

        return colliders;
    },

    /**
     * !#en
     * Raycast the world for all colliders in the path of the ray.
     * The raycast ignores colliders that contain the starting point.
     * !#zh
     * 检测哪些碰撞体在给定射线的路径上，射线检测将忽略包含起始点的碰撞体。
     * @method rayCast
     * @param {Vec2} p1 - start point of the raycast
     * @param {Vec2} p2 - end point of the raycast
     * @param {RayCastType} type - optional, default is RayCastType.Closest
     * @return {[PhysicsRayCastResult]}
     */
    rayCast: function (p1, p2, type) {
        if (p1.equals(p2)) {
            return [];
        }

        type = type || RayCastType.Closest;

        b2_vec2_tmp1.x = p1.x/PTM_RATIO;
        b2_vec2_tmp1.y = p1.y/PTM_RATIO;
        b2_vec2_tmp2.x = p2.x/PTM_RATIO;
        b2_vec2_tmp2.y = p2.y/PTM_RATIO;

        var callback = this._raycastQueryCallback;
        callback.init(type);
        this._world.RayCast(callback, b2_vec2_tmp1, b2_vec2_tmp2);

        var fixtures = callback.getFixtures();
        if (fixtures.length > 0) {
            var points = callback.getPoints();
            var normals = callback.getNormals();
            var fractions = callback.getFractions();

            var results = [];
            for (var i = 0, l = fixtures.length; i < l; i++) {
                var fixture = fixtures[i];
                var collider = fixture.collider;

                if (type === RayCastType.AllClosest) {
                    var result = results.find(function(result) {
                        return result.collider === collider;
                    });

                    if (result) {
                        if (fractions[i] < result.fraction) {
                            result.fixtureIndex = collider._getFixtureIndex(fixture);
                            result.point.x = points[i].x*PTM_RATIO;
                            result.point.y = points[i].y*PTM_RATIO;
                            result.normal.x = normals[i].x;
                            result.normal.y = normals[i].y;
                            result.fraction = fractions[i];
                        }
                        continue;
                    }
                }

                results.push({
                    collider: collider,
                    fixtureIndex: collider._getFixtureIndex(fixture),
                    point: cc.v2(points[i].x*PTM_RATIO, points[i].y*PTM_RATIO),
                    normal: cc.v2(normals[i]),
                    fraction: fractions[i]
                });
            }

            return results;
        }

        return [];
    },
 
    syncPosition: function () {
        var bodies = this._bodies;
        for (var i = 0; i < bodies.length; i++) {
            bodies[i].syncPosition();
        }
    },
    syncRotation: function () {
        var bodies = this._bodies;
        for (var i = 0; i < bodies.length; i++) {
            bodies[i].syncRotation();
        }
    },    

    _registerContactFixture: function (fixture) {
        this._contactListener.registerContactFixture(fixture);
    },

    _unregisterContactFixture: function (fixture) {
        this._contactListener.unregisterContactFixture(fixture);
    },

    _addBody: function (body, bodyDef) {
        var world = this._world;
        var node = body.node;

        if (!world || !node) return;

        body._b2Body = world.CreateBody(bodyDef);
        body._b2Body.body = body;

        this._bodies.push(body);
    },

    _removeBody: function (body) {
        var world = this._world;
        if (!world) return;

        body._b2Body.body = null;
        world.DestroyBody(body._b2Body);
        body._b2Body = null;

        cc.js.array.remove(this._bodies, body);
    },

    _addJoint (joint, jointDef) {
        let b2joint = this._world.CreateJoint(jointDef);
        if (!b2joint) return;
        
        b2joint._joint = joint;
        joint._joint = b2joint;

        this._joints.push(joint);
    },

    _removeJoint (joint) {
        if (joint._isValid()) {
            this._world.DestroyJoint(joint._joint);
        }
        
        if (joint._joint) {
            joint._joint._joint = null;
        }

        cc.js.array.remove(this._joints, joint);
    },

    _initCallback: function () {
        if (!this._world) {
            cc.warn('Please init PhysicsManager first');
            return;
        }

        if (this._contactListener) return;

        var listener = new cc.PhysicsContactListener();
        listener.setBeginContact(this._onBeginContact);
        listener.setEndContact(this._onEndContact);
        listener.setPreSolve(this._onPreSolve);
        listener.setPostSolve(this._onPostSolve);
        this._world.SetContactListener(listener);

        this._contactListener = listener;

        this._aabbQueryCallback = new cc.PhysicsAABBQueryCallback();
        this._raycastQueryCallback = new cc.PhysicsRayCastCallback();
    },

    _init: function () {
        this.enabled = true;
        this.debugDrawFlags = DrawBits.e_shapeBit;
    },

    _getWorld: function () {
        return this._world;
    },

    _syncNode: function () {
        var bodies = this._bodies;
        for (var i = 0, l = bodies.length; i < l; i++) {
            var body = bodies[i];
            var node = body.node;

            var b2body = body._b2Body;
            var pos = b2body.GetPosition();

            vec2_tmp.x = pos.x * PTM_RATIO;
            vec2_tmp.y = pos.y * PTM_RATIO;

            var angle = b2body.GetAngle() * PHYSICS_ANGLE_TO_ANGLE;

            // When node's parent is not scene, convert position and rotation.
            if (node.parent.parent !== null) {
                vec2_tmp = node.parent.convertToNodeSpaceAR( vec2_tmp );
                angle = convertToNodeRotation( node.parent, angle );
            }

            let tempMask = node._eventMask;
            node._eventMask = 0;

            // sync position
            node.position = vec2_tmp;

            // sync rotation
            node.angle = -angle;

            node._eventMask = tempMask;
            
            if (body.type === BodyType.Animated) {
                body.resetVelocity();
            }
        }
    },

    _onBeginContact: function (b2contact) {
        var c = cc.PhysicsContact.get(b2contact);
        c.emit(ContactType.BEGIN_CONTACT);
    },

    _onEndContact: function (b2contact) {
        var c = b2contact._contact;
        if (!c) {
            return;
        }
        c.emit(ContactType.END_CONTACT);
        
        cc.PhysicsContact.put(b2contact);
    },

    _onPreSolve: function (b2contact) {
        var c = b2contact._contact;
        if (!c) {
            return;
        }
        
        c.emit(ContactType.PRE_SOLVE);
    },

    _onPostSolve: function (b2contact, impulse) {
        var c = b2contact._contact;
        if (!c) {
            return;
        }

        // impulse only survive during post sole callback
        c._impulse = impulse;
        c.emit(ContactType.POST_SOLVE);
        c._impulse = null;
    },

    _checkDebugDrawValid () {
        if (!this._debugDrawer || !this._debugDrawer.isValid) {
            let node = new cc.Node('PHYSICS_MANAGER_DEBUG_DRAW');
            node.zIndex = cc.macro.MAX_ZINDEX;
            cc.game.addPersistRootNode(node);
            this._debugDrawer = node.addComponent(cc.Graphics);

            let debugDraw = new DebugDraw(this._debugDrawer);
            debugDraw.SetFlags(this.debugDrawFlags);
            this._world.SetDebugDraw(debugDraw);
        }
    }
});

/**
 * !#en
 * Enabled the physics manager?
 * !#zh
 * 指定是否启用物理系统？
 * @property {Boolean} enabled
 * @default false
 */
cc.js.getset(PhysicsManager.prototype, 'enabled', 
    function () {
        return this._enabled;
    },
    function (value) {
        if (CC_EDITOR) return;
        
        if (value && !this._world) {
            var world = new b2.World( new b2.Vec2(0, -10) );
            world.SetAllowSleeping(true);

            this._world = world;

            this._initCallback();
        }

        this._enabled = value;
    }
);

/**
 * !#en
 * Debug draw flags.
 * !#zh
 * 设置调试绘制标志
 * @property {Number} debugDrawFlags
 * @default 0
 * @example
 * // enable all debug draw info
 * var Bits = cc.PhysicsManager.DrawBits;
 * cc.director.getPhysicsManager().debugDrawFlags = Bits.e_aabbBit |
    Bits.e_pairBit |
    Bits.e_centerOfMassBit |
    Bits.e_jointBit |
    Bits.e_shapeBit;
 
 * // disable debug draw info
 * cc.director.getPhysicsManager().debugDrawFlags = 0;
 */
cc.js.getset(PhysicsManager.prototype, 'debugDrawFlags', 
    function () {
        return this._debugDrawFlags;
    },
    function (value) {
        if (CC_EDITOR) return;
        
        if (value && !this._debugDrawFlags) {
            if (this._debugDrawer && this._debugDrawer.node) this._debugDrawer.node.active = true;
        }
        else if (!value && this._debugDrawFlags) {
            if (this._debugDrawer && this._debugDrawer.node) this._debugDrawer.node.active = false;
        }

        if (value) {
            this._checkDebugDrawValid();
            this._world.m_debugDraw.SetFlags(value);
        }

        this._debugDrawFlags = value;

        if (value) {
            this._checkDebugDrawValid();
            this._world.m_debugDraw.SetFlags(value);
        }
    }
);

/**
 * !#en
 * The physics world gravity.
 * !#zh
 * 物理世界重力值
 * @property {Vec2} gravity
 */
cc.js.getset(PhysicsManager.prototype, 'gravity',
    function () {
        if (this._world) {
            var g = this._world.GetGravity();
            return cc.v2(g.x*PTM_RATIO, g.y*PTM_RATIO);
        }
        return cc.v2();
    },

    function (value) {
        if (this._world) {
            this._world.SetGravity(new b2.Vec2(value.x/PTM_RATIO, value.y/PTM_RATIO));
        }
    }
);


cc.PhysicsManager = module.exports = PhysicsManager;

/**
 * !#en
 * The draw bits for drawing physics debug information.<br>
 * example:<br>
 * ```js
 * cc.director.getPhysicsManager().debugDrawFlags = 
 *  // cc.PhysicsManager.DrawBits.e_aabbBit |
 *  // cc.PhysicsManager.DrawBits.e_pairBit |
 *  // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
 *  cc.PhysicsManager.DrawBits.e_jointBit |
 *  cc.PhysicsManager.DrawBits.e_shapeBit;
 * ```
 * !#zh
 * 指定物理系统需要绘制哪些调试信息。<br>
 * example:<br>
 * ```js
 * cc.director.getPhysicsManager().debugDrawFlags = 
 *  // cc.PhysicsManager.DrawBits.e_aabbBit |
 *  // cc.PhysicsManager.DrawBits.e_pairBit |
 *  // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
 *  cc.PhysicsManager.DrawBits.e_jointBit |
 *  cc.PhysicsManager.DrawBits.e_shapeBit;
 * ```
 * @enum PhysicsManager.DrawBits
 * @static

 */

/**
 * !#en
 * Draw bounding boxes
 * !#zh
 * 绘制包围盒
 * @property {Number} e_aabbBit
 * @static
 */
/**
 * !#en
 * Draw joint connections
 * !#zh
 * 绘制关节链接信息
 * @property {Number} e_jointBit
 * @static
 */
/**
 * !#en
 * Draw shapes
 * !#zh
 * 绘制形状
 * @property {Number} e_shapeBit
 * @static
 */

/**
 * @class PhysicsRayCastResult
 */
/**
 * !#en
 * The PhysicsCollider which intersects with the raycast
 * !#zh
 * 与射线相交的碰撞体
 * @property {PhysicsCollider} collider
 */
/**
 * !#en
 * The intersection point
 * !#zh
 * 射线与碰撞体相交的点
 * @property {Vec2} point
 */
/**
 * !#en
 * The normal vector at the point of intersection
 * !#zh
 * 射线与碰撞体相交的点的法向量
 * @property {Vec2} normal
 */
/**
 * !#en
 * The fraction of the raycast path at the point of intersection
 * !#zh
 * 射线与碰撞体相交的点占射线长度的分数
 * @property {Number} fraction
 */
