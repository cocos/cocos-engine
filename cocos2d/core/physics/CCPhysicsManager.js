/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var ContactType = require('./CCPhysicsTypes').ContactType;
var BodyType = require('./CCPhysicsTypes').BodyType;
var RayCastType = require('./CCPhysicsTypes').RayCastType;

var PTM_RATIO = require('./CCPhysicsTypes').PTM_RATIO;
var ANGLE_TO_PHYSICS_ANGLE = require('./CCPhysicsTypes').ANGLE_TO_PHYSICS_ANGLE;
var PHYSICS_ANGLE_TO_ANGLE = require('./CCPhysicsTypes').PHYSICS_ANGLE_TO_ANGLE;

var tempB2AABB = new b2.AABB();
var tempB2Vec21 = new b2.Vec2();
var tempB2Vec22 = new b2.Vec2();

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
 * 注意：你需要先在刚体中开启碰撞接听才会产生相应的碰撞回调。
 * @class PhysicsManager
 * @uses EventTarget
 */
var PhysicsManager = cc.Class({
    mixins: [cc.EventTarget],

    statics: {
        /**
         * !#en
         * The draw bits for drawing physics debug information.
         * !#zh
         * 指定物理系统需要绘制哪些调试信息。
         * @property {DrawBits} DrawBits
         * @static
         * @example
         * 
         * cc.director.getPhysicsManager().debugDrawFlags = 
            // cc.PhysicsManager.DrawBits.e_aabbBit |
            // cc.PhysicsManager.DrawBits.e_pairBit |
            // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit;
        */
        DrawBits: b2.Draw,

        /**
         * !#en
         * The ratio transform between physics unit and pixel unit, generally is 32.
         * !#zh
         * 物理单位与像素单位互相转换的比率，一般是 32。
         * @property {Number} PTM_RATIO
         * @static
         */
        PTM_RATIO: PTM_RATIO
    },

    ctor: function () {
        this.__instanceId = cc.ClassManager.getNewInstanceId();

        this._debugDrawFlags = 0;
        this._debugDrawer = null;

        this._world = null;

        this._bodies = [];

        this._contactMap = {};
        this._contactID = 0;

        this._delayEvents = [];

        // this._accumulator = 0;
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
        var timeStep = 1/cc.game.config['frameRate'];

        // http://new.gafferongames.com/post/fix_your_timestep/
        // will be super slow
        
        // this._accumulator += dt;
        // while (this._accumulator > timeStep) {
            world.Step(timeStep, 10, 10);
        //     this._accumulator -= timeStep;
        // }

        world.DrawDebugData();

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
        var x = tempB2Vec21.x = point.x/PTM_RATIO;
        var y = tempB2Vec21.y = point.y/PTM_RATIO;

        var d = 0.2/PTM_RATIO;
        tempB2AABB.lowerBound.x = x-d;
        tempB2AABB.lowerBound.y = y-d;
        tempB2AABB.upperBound.x = x+d;
        tempB2AABB.upperBound.y = y+d;

        var callback = this._aabbQueryCallback;
        callback.init(tempB2Vec21);
        this._world.QueryAABB(callback, tempB2AABB);

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
        tempB2AABB.lowerBound.x = rect.xMin/PTM_RATIO;
        tempB2AABB.lowerBound.y = rect.yMin/PTM_RATIO;
        tempB2AABB.upperBound.x = rect.xMax/PTM_RATIO;
        tempB2AABB.upperBound.y = rect.yMax/PTM_RATIO;

        var callback = this._aabbQueryCallback;
        callback.init();
        this._world.QueryAABB(callback, tempB2AABB);

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

        tempB2Vec21.x = p1.x/PTM_RATIO;
        tempB2Vec21.y = p1.y/PTM_RATIO;
        tempB2Vec22.x = p2.x/PTM_RATIO;
        tempB2Vec22.y = p2.y/PTM_RATIO;

        var callback = this._raycastQueryCallback;
        callback.init(type);
        this._world.RayCast(callback, tempB2Vec21, tempB2Vec22);

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

    /**
     * !#en
     * Attach physics debug draw to camera
     * !#zh
     * 将物理的调试绘制信息附加到指定摄像机上
     * @method attachDebugDrawToCamera
     * @param {Camera} camera
     */
    attachDebugDrawToCamera: function (camera) {
        if (!this._debugDrawer) return;
        camera.addTarget(this._debugDrawer.getDrawer());
    },
    /**
     * !#en
     * Detach physics debug draw to camera
     * !#zh
     * 将物理的调试绘制信息从指定摄像机上移除
     * @method detachDebugDrawFromCamera
     * @param {Camera} camera
     */
    detachDebugDrawFromCamera: function (camera) {
        if (!this._debugDrawer) return;
        camera.removeTarget(this._debugDrawer.getDrawer());
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

        if (CC_JSB) {
            body._b2Body.SetUserData( node._sgNode );
        }

        body._b2Body.body = body;

        this._utils.addB2Body(body._b2Body);
        this._bodies.push(body);
    },

    _removeBody: function (body) {
        var world = this._world;
        if (!world) return;

        if (CC_JSB) {
            body._b2Body.SetUserData(null);
        }
        body._b2Body.body = null;
        this._utils.removeB2Body(body._b2Body);

        world.DestroyBody(body._b2Body);
        body._b2Body = null;

        var index = this._bodies.indexOf(body);
        if (index !== -1) {
            this._bodies.splice(index, 1);
        }
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
        this.debugDrawFlags = b2.Draw.e_shapeBit;
    },

    _getWorld: function () {
        return this._world;
    },

    _syncNode: function () {
        this._utils.syncNode();
        
        var bodies = this._bodies;
        for (var i = 0, l = bodies.length; i < l; i++) {
            var body = bodies[i];
            if (CC_JSB) {
                var node = body.node;
                node._position.x = node._sgNode.getPositionX();
                node._position.y = node._sgNode.getPositionY();
                node._rotationX = node._rotationY = node._sgNode.getRotation();
            }
            
            if (body.type === BodyType.Animated) {
                body.resetVelocity();
            }
        }
    },

    _onSceneLaunched: function () {
        this._debugDrawer.AddDrawerToNode( cc.director.getScene()._sgNode );
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
        if (value && !this._world) {
            var world = new b2.World( new b2.Vec2(0, -10) );
            world.SetAllowSleeping(true);

            this._world = world;
            this._utils = new cc.PhysicsUtils();

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
        if (value && !this._debugDrawFlags) {
            if (!this._debugDrawer) {
                this._debugDrawer = new cc.PhysicsDebugDraw(PTM_RATIO);
                this._world.SetDebugDraw( this._debugDrawer );
            }

            var scene = cc.director.getScene();
            if (scene) {
                this._debugDrawer.AddDrawerToNode( cc.director.getScene()._sgNode );
            }
            cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this._onSceneLaunched, this);
        }
        else if (!value && this._debugDrawFlags) {
            cc.director.off(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this._onSceneLaunched, this);
        }

        this._debugDrawFlags = value;

        if (this._debugDrawer) {
            this._debugDrawer.SetFlags(value);
        }
    }
);

/**
 * !#en
 * The physics world gravity.
 * !#zh
 * 物理世界重力值
 * @property {Number} gravity
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
 * @enum DrawBits
 */
/**
 * !#en
 * Draw bounding boxes
 * !#zh
 * 绘制包围盒
 * @property {Number} e_aabbBit
 */
/**
 * !#en
 * Draw broad-phase pairs
 * !#zh
 * 绘制粗测阶段物体
 * @property {Number} e_pairBit
 */
/**
 * !#en
 * Draw center of mass frame
 * !#zh
 * 绘制物体质心
 * @property {Number} e_centerOfMassBit
 */
/**
 * !#en
 * Draw joint connections
 * !#zh
 * 绘制关节链接信息
 * @property {Number} e_jointBit
 */
/**
 * !#en
 * Draw shapes
 * !#zh
 * 绘制形状
 * @property {Number} e_shapeBit
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
