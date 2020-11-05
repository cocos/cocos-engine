import b2 from '@cocos/box2d';
import { EDITOR } from 'internal:constants';

import { IPhysicsWorld } from '../spec/i-physics-world'
import { IVec2Like, Vec3, Quat, toRadian, Vec2, toDegree, Rect, Node, game, CCObject, find, director } from '../../core';
import { PHYSICS_2D_PTM_RATIO, ERaycast2DType } from '../framework/physics-types';
import { ERigidBody2DType } from '../framework/physics-types';
import { array } from '../../core/utils/js';
import { Canvas, Graphics } from '../../../exports/ui';

import { b2RigidBody2D } from './rigid-body';
import { PhysicsContactListener } from './platform/physics-contact-listener';
import { PhysicsAABBQueryCallback } from './platform/physics-aabb-query-callback';
import { PhysicsRayCastCallback } from './platform/physics-ray-cast-callback';
import { PhysicsContact } from './physics-contact';
import { Contact2DType, Collider2D, RaycastResult2D } from '../framework';
import { b2Shape2D } from './shapes/shape-2d';
import { PhysicsDebugDraw } from './platform/physics-debug-draw';
import { b2ContactExtends } from './physics-contact';

let tempVec3 = new Vec3;
let tempVec2_1 = new Vec2();
let tempVec2_2 = new Vec2();

let temoBodyDef = new b2.BodyDef();
let tempB2AABB = new b2.AABB();

let testResults: Collider2D[] = [];

export class b2PhysicsWorld implements IPhysicsWorld {
    protected _world: b2.World;
    protected _bodies: b2RigidBody2D[] = [];

    protected _contactListener: PhysicsContactListener;
    protected _aabbQueryCallback: PhysicsAABBQueryCallback;
    protected _raycastQueryCallback: PhysicsRayCastCallback;

    get impl () {
        return this._world;
    }

    constructor () {
        this._world = new b2.World(new b2.Vec2(0, -10));

        let listener = new PhysicsContactListener();
        listener.setBeginContact(this._onBeginContact);
        listener.setEndContact(this._onEndContact);
        listener.setPreSolve(this._onPreSolve);
        listener.setPostSolve(this._onPostSolve);
        this._world.SetContactListener(listener);

        this._contactListener = listener;

        this._aabbQueryCallback = new PhysicsAABBQueryCallback();
        this._raycastQueryCallback = new PhysicsRayCastCallback();
    }

    _debugGraphics: Graphics | null = null;
    _b2DebugDrawer: b2.Draw | null = null;

    _debugDrawFlags = 0;
    get debugDrawFlags () {
        return this._debugDrawFlags;
    }
    set debugDrawFlags (v) {
        if (EDITOR) return;

        if (!v) {
            if (this._debugGraphics) {
                this._debugGraphics.node.parent = null;
            }
        }

        this._debugDrawFlags = v;
    }

    _checkDebugDrawValid () {
        if (EDITOR) return;
        if (!this._debugGraphics || !this._debugGraphics.isValid) {
            let canvas = find('Canvas');
            if (!canvas) {
                let scene = director.getScene() as any;
                if (!scene) {
                    return;
                }

                canvas = new Node('Canvas');
                canvas.addComponent(Canvas);
                canvas.parent = scene;
            }

            let node = new Node('PHYSICS_2D_DEBUG_DRAW');
            // node.zIndex = cc.macro.MAX_ZINDEX;
            node._objFlags |= CCObject.Flags.DontSave;
            node.parent = canvas;
            node.worldPosition = Vec3.ZERO;

            this._debugGraphics = node.addComponent(Graphics);
            this._debugGraphics.lineWidth = 2;

            let debugDraw = new PhysicsDebugDraw(this._debugGraphics);
            this._b2DebugDrawer = debugDraw;
            this._world.SetDebugDraw(debugDraw);
        }

        let parent = this._debugGraphics.node.parent!;
        this._debugGraphics.node.setSiblingIndex(parent.children.length - 1);

        if (this._b2DebugDrawer) {
            this._b2DebugDrawer!.SetFlags(this.debugDrawFlags);
        }
    }

    setGravity (v: IVec2Like) {
        this._world.SetGravity(v as b2.Vec2);
    }

    setAllowSleep (v: boolean) {
        this._world.SetAllowSleeping(true);
    }

    step (deltaTime: number, velocityIterations = 10, positionIterations = 10) {
        this._world.Step(deltaTime, velocityIterations, positionIterations);
    }

    raycast (p1: Vec2, p2: Vec2, type: ERaycast2DType, mask: number): RaycastResult2D[] {
        if (p1.equals(p2)) {
            return [];
        }

        type = type || ERaycast2DType.Closest;

        tempVec2_1.x = p1.x / PHYSICS_2D_PTM_RATIO;
        tempVec2_1.y = p1.y / PHYSICS_2D_PTM_RATIO;
        tempVec2_2.x = p2.x / PHYSICS_2D_PTM_RATIO;
        tempVec2_2.y = p2.y / PHYSICS_2D_PTM_RATIO;

        let callback = this._raycastQueryCallback;
        callback.init(type, mask);
        this._world.RayCast(callback, tempVec2_1, tempVec2_2);

        let fixtures = callback.getFixtures();
        if (fixtures.length > 0) {
            let points = callback.getPoints();
            let normals = callback.getNormals();
            let fractions = callback.getFractions();

            let results: RaycastResult2D[] = [];
            for (let i = 0, l = fixtures.length; i < l; i++) {
                let fixture = fixtures[i];
                let shape = fixture.m_userData as b2Shape2D;
                let collider = shape.collider;

                if (type === ERaycast2DType.AllClosest) {
                    let result;
                    for (let j = 0; j < results.length; j++) {
                        if (results[j].collider === collider) {
                            result = results[j];
                        }
                    }

                    if (result) {
                        if (fractions[i] < result.fraction) {
                            result.fixtureIndex = shape.getFixtureIndex(fixture);
                            result.point.x = points[i].x * PHYSICS_2D_PTM_RATIO;
                            result.point.y = points[i].y * PHYSICS_2D_PTM_RATIO;
                            result.normal.x = normals[i].x;
                            result.normal.y = normals[i].y;
                            result.fraction = fractions[i];
                        }
                        continue;
                    }
                }

                results.push({
                    collider: collider,
                    fixtureIndex: shape.getFixtureIndex(fixture),
                    point: new Vec2(points[i].x * PHYSICS_2D_PTM_RATIO, points[i].y * PHYSICS_2D_PTM_RATIO),
                    normal: new Vec2(normals[i].x, normals[i].y),
                    fraction: fractions[i]
                });
            }

            return results;
        }

        return [];
    }

    syncPhysicsToScene () {
        let bodies = this._bodies;
        for (let i = 0, l = bodies.length; i < l; i++) {
            let body = bodies[i];
            let bodyComp = body.rigidBody;
            if (bodyComp.type === ERigidBody2DType.Animated) {
                body.resetVelocity();
                continue;
            }

            let node = bodyComp.node;
            let b2body = body.impl;

            // position
            let pos = b2body!.GetPosition();
            tempVec3.x = pos.x * PHYSICS_2D_PTM_RATIO;
            tempVec3.y = pos.y * PHYSICS_2D_PTM_RATIO;
            tempVec3.z = 0;
            node.worldPosition = tempVec3;

            // rotation
            let angle = toDegree(b2body!.GetAngle());
            node.setWorldRotationFromEuler(0, 0, angle);
        }
    }
    syncSceneToPhysics () {
        let bodies = this._bodies;
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].syncRotationToPhysics();
            bodies[i].syncPositionToPhysics();
        }
    }

    addBody (body: b2RigidBody2D) {
        let bodies = this._bodies;
        if (bodies.includes(body)) {
            return;
        }

        let bodyDef = temoBodyDef;

        let comp = body.rigidBody;
        if (comp.type === ERigidBody2DType.Animated) {
            bodyDef.type = ERigidBody2DType.Kinematic as number;
        }
        else {
            bodyDef.type = comp.type as number;
        }

        bodyDef.allowSleep = comp.allowSleep;
        bodyDef.gravityScale = comp.gravityScale;
        bodyDef.linearDamping = comp.linearDamping;
        bodyDef.angularDamping = comp.angularDamping;

        bodyDef.fixedRotation = comp.fixedRotation;
        bodyDef.bullet = comp.bullet;

        let node = comp.node;
        let pos = node.worldPosition;
        bodyDef.position.Set(pos.x / PHYSICS_2D_PTM_RATIO, pos.y / PHYSICS_2D_PTM_RATIO);

        Quat.toEuler(tempVec3, node.worldRotation);
        bodyDef.angle = toRadian(tempVec3.z);

        bodyDef.awake = comp.awakeOnLoad;

        // read private property
        let compPrivate = comp as any;
        let linearVelocity = compPrivate._linearVelocity;
        bodyDef.linearVelocity.Set(linearVelocity.x, linearVelocity.y);

        bodyDef.angularVelocity = toRadian(compPrivate._angularVelocity);

        let b2Body = this._world.CreateBody(bodyDef);
        b2Body.m_userData = body;
        body._imp = b2Body;

        this._bodies.push(body);
    }

    removeBody (body: b2RigidBody2D) {
        if (!this._bodies.includes(body)) {
            return;
        }
        if (body.impl) {
            body.impl.m_userData = null;
            this._world.DestroyBody(body.impl);
            body._imp = null;
        }
        array.remove(this._bodies, body);
    }

    registerContactFixture (fixture: b2.Fixture) {
        this._contactListener.registerContactFixture(fixture);
    }
    unregisterContactFixture (fixture: b2.Fixture) {
        this._contactListener.unregisterContactFixture(fixture);
    }

    testPoint (point: Vec2): readonly Collider2D[] {
        let x = tempVec2_1.x = point.x / PHYSICS_2D_PTM_RATIO;
        let y = tempVec2_1.y = point.y / PHYSICS_2D_PTM_RATIO;

        let d = 0.2 / PHYSICS_2D_PTM_RATIO;
        tempB2AABB.lowerBound.x = x - d;
        tempB2AABB.lowerBound.y = y - d;
        tempB2AABB.upperBound.x = x + d;
        tempB2AABB.upperBound.y = y + d;

        let callback = this._aabbQueryCallback;
        callback.init(tempVec2_1);
        this._world.QueryAABB(callback, tempB2AABB);

        let fixtures = callback.getFixtures();
        testResults.length = 0;
        for (let i = 0; i < fixtures.length; i++) {
            let collider = (fixtures[i].m_userData as b2Shape2D).collider;
            if (!testResults.includes(collider)) {
                testResults.push(collider);
            }
        }
        return testResults;
    }

    testAABB (rect: Rect): readonly Collider2D[] {
        tempB2AABB.lowerBound.x = rect.xMin / PHYSICS_2D_PTM_RATIO;
        tempB2AABB.lowerBound.y = rect.yMin / PHYSICS_2D_PTM_RATIO;
        tempB2AABB.upperBound.x = rect.xMax / PHYSICS_2D_PTM_RATIO;
        tempB2AABB.upperBound.y = rect.yMax / PHYSICS_2D_PTM_RATIO;

        let callback = this._aabbQueryCallback;
        callback.init();
        this._world.QueryAABB(callback, tempB2AABB);

        let fixtures = callback.getFixtures();
        testResults.length = 0;
        for (let i = 0; i < fixtures.length; i++) {
            let collider = (fixtures[i].m_userData as b2Shape2D).collider;
            if (!testResults.includes(collider)) {
                testResults.push(collider);
            }
        }
        return testResults;
    }

    drawDebug () {
        this._checkDebugDrawValid();
        
        if (!this._debugGraphics) {
            return;
        }
        this._debugGraphics.clear();
        this._world.DrawDebugData();
    }

    _onBeginContact (b2contact: b2ContactExtends) {
        let c = PhysicsContact.get(b2contact);
        c.emit(Contact2DType.BEGIN_CONTACT);
    }

    _onEndContact (b2contact: b2ContactExtends) {
        let c = b2contact.m_userData as PhysicsContact;
        if (!c) {
            return;
        }
        c.emit(Contact2DType.END_CONTACT);

        PhysicsContact.put(b2contact);
    }

    _onPreSolve (b2contact: b2ContactExtends) {
        let c = b2contact.m_userData as PhysicsContact;
        if (!c) {
            return;
        }

        c.emit(Contact2DType.PRE_SOLVE);
    }

    _onPostSolve (b2contact: b2ContactExtends, impulse: b2.ContactImpulse) {
        let c: PhysicsContact = b2contact.m_userData as PhysicsContact;
        if (!c) {
            return;
        }

        // impulse only survive during post sole callback
        c._setImpulse(impulse);
        c.emit(Contact2DType.POST_SOLVE);
        c._setImpulse(null);
    }
}
