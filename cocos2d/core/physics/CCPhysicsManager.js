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

var CC_PTM_RATIO = 32;
var CC_TO_PHYSICS_ANGLE = -Math.PI / 180;
var PHYSICS_TO_CC_ANGLE = -180 / Math.PI;

var ContactType = require('./CCPhysicsTypes').ContactType;
var BodyType = require('./CCPhysicsTypes').BodyType;
var RayCastType = require('./CCPhysicsTypes').RayCastType;

var STEP_DT = 1/60;

var PhysicsManager = cc.Class({
    mixins: [cc.EventTarget],

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

        // http://new.gafferongames.com/post/fix_your_timestep/
        // will be super slow
        
        // this._accumulator += dt;
        // while (this._accumulator > STEP_DT) {
            world.Step(STEP_DT, 10, 10);
        //     this._accumulator -= STEP_DT;
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
        this._resetBodies();
    },

    testPoint: function (point) {
        point = new b2.Vec2(point.x/CC_PTM_RATIO, point.y/CC_PTM_RATIO);

        var aabb = new b2.AABB();
        var d = new b2.Vec2(0.2/CC_PTM_RATIO, 0.2/CC_PTM_RATIO);
        aabb.lowerBound = new b2.Vec2(point.x-d.x, point.y-d.y);
        aabb.upperBound = new b2.Vec2(point.x+d.x, point.y+d.y);

        var callback = new cc.PhysicsAABBQueryCallback(point);
        this._world.QueryAABB(callback, aabb);

        var fixture = callback.getFixture();
        if (fixture) {
            return fixture.collider;
        }

        return null;
    },

    testAABB: function (rect) {
        var aabb = new b2.AABB();
        aabb.lowerBound = new b2.Vec2(rect.xMin/CC_PTM_RATIO, rect.yMin/CC_PTM_RATIO);
        aabb.upperBound = new b2.Vec2(rect.xMax/CC_PTM_RATIO, rect.yMax/CC_PTM_RATIO);

        var callback = new cc.PhysicsAABBQueryCallback();
        this._world.QueryAABB(callback, aabb);

        var fixtures = callback.getFixtures();
        var colliders = fixtures.map(function (fixture) {
            return fixture.collider;
        });

        return colliders;
    },

    rayCast: function (p1, p2, type) {
        if (p1.equals(p2)) {
            return [];
        }

        type = type || RayCastType.Closest;

        p1 = new b2.Vec2(p1.x/CC_PTM_RATIO, p1.y/CC_PTM_RATIO);
        p2 = new b2.Vec2(p2.x/CC_PTM_RATIO, p2.y/CC_PTM_RATIO);

        var callback = new cc.PhysicsRayCastCallback(type);
        this._world.RayCast(callback, p1, p2);

        var fixtures = callback.getFixtures();
        if (fixtures.length > 0) {
            var points = callback.getPoints();
            var normals = callback.getNormals();
            var fractions = callback.getFractions();

            var results = [];
            for (var i = 0, l = fixtures.length; i < l; i++) {
                var fixture = fixtures[i];
                var collider = fixture.collider;
                results.push({
                    collider: collider,
                    fixtureIndex: collider._getFixtureIndex(fixture),
                    point: cc.v2(points[i].x*CC_PTM_RATIO, points[i].y*CC_PTM_RATIO),
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

    attachDebugDrawToCamera: function (camera) {
        if (!this._debugDrawer) return;
        camera.addTarget(this._debugDrawer.getDrawer());
    },
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

    _registerListener: function () {
        if (!this._world) {
            cc.warn('Please init PhysicsManager first');
            return;
        }

        if (this._contactListener) return;

        var listener = new cc.PhysicsContactListener();
        listener.setBeginContact(this._onBeginContact.bind(this));
        listener.setEndContact(this._onEndContact.bind(this));
        listener.setPreSolve(this._onPreSolve.bind(this));
        listener.setPostSolve(this._onPostSolve.bind(this));
        this._world.SetContactListener(listener);

        this._contactListener = listener;
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
        
        if (CC_JSB) {
            var bodies = this._bodies;
            for (var i = 0, l = bodies.length; i < l; i++) {
                var body = bodies[i];
                var node = body.node;
                node._position.x = node._sgNode.getPositionX();
                node._position.y = node._sgNode.getPositionY();
                node._rotationX = node._rotationY = node._sgNode.getRotation();
            }
        }
    },

    _resetBodies: function () {
        var bodies = this._bodies;
        for (var i = 0, l = bodies.length; i < l; i++) {
            var body = bodies[i];
            if (body.type === BodyType.Animated) {
                body.resetVelocity();
            }
        }
    },

    _onSceneLaunched: function () {
        this._debugDrawer.AddDrawerToNode( cc.director.getScene()._sgNode );
    },

    _onBeginContact: function (contact) {
        var c = new cc.PhysicsContact(contact);
        contact._contact = c;
        c.emit(ContactType.BEGIN_CONTACT);

        if (c.disabled) {
            contact.SetEnabled(false);
        }
    },

    _onEndContact: function (contact) {
        var c = contact._contact;
        if (!c) {
            return;
        }
        c.emit(ContactType.END_CONTACT);
        contact._contact = null;
    },

    _onPreSolve: function (contact) {
        var c = contact._contact;
        if (!c) {
            return;
        }
        
        c.emit(ContactType.PRE_SOLVE);

        if (c.disabled) {
            contact.SetEnabled(false);
        }
    },

    _onPostSolve: function (contact, impulse) {
        var c = contact._contact;
        if (!c) {
            return;
        }
        c.emit(ContactType.POST_SOLVE, impulse);
    }
});

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

            this._registerListener();
        }

        this._enabled = value;
    }
);

cc.js.getset(PhysicsManager.prototype, 'debugDrawFlags', 
    function () {
        return this._debugDrawFlags;
    },
    function (value) {
        if (value && !this._debugDrawFlags) {
            if (!this._debugDrawer) {
                this._debugDrawer = new cc.PhysicsDebugDraw(CC_PTM_RATIO);
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

cc.js.getset(PhysicsManager.prototype, 'gravity',
    function () {
        if (this._world) {
            var g = this._world.GetGravity();
            return cc.v2(g.x*CC_PTM_RATIO, g.y*CC_PTM_RATIO);
        }
        return cc.v2();
    },

    function (value) {
        if (this._world) {
            this._world.SetGravity(new b2.Vec2(value.x/CC_PTM_RATIO, value.y/CC_PTM_RATIO));
        }
    }
);


PhysicsManager.DrawBits = b2.Draw;
PhysicsManager.CC_PTM_RATIO = CC_PTM_RATIO;
PhysicsManager.CC_TO_PHYSICS_ANGLE = CC_TO_PHYSICS_ANGLE;
PhysicsManager.PHYSICS_TO_CC_ANGLE = PHYSICS_TO_CC_ANGLE;

cc.PhysicsManager = module.exports = PhysicsManager;
