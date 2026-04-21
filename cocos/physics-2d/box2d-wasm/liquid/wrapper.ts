/// <reference path="./Box2D.d.ts" />
/// <reference path="../../../../native/external/emscripten/box2d/b2.d.ts" />

type B2Vec2 = { x: number; y: number };
type Box2DModule = typeof Box2D;

function toVec2 (v: Box2D.b2Vec2): B2Vec2 {
    return { x: v.x, y: v.y };
}

let box2d: Box2DModule;

function fromVec2 (v: B2Vec2 | number): Box2D.b2Vec2 {
    if (typeof v === 'number') {
        return box2d.wrapPointer(v, box2d.b2Vec2);
    }
    return new box2d.b2Vec2(v.x, v.y);
}

export function wrapper (b2: Box2DModule): typeof B2 {
    box2d = b2;

    function getPtr (obj: any): number {
        return box2d.getPointer(obj);
    }

    // --- Enums ---
    const BodyType = {
        b2_staticBody: b2.b2_staticBody,
        b2_kinematicBody: b2.b2_kinematicBody,
        b2_dynamicBody: b2.b2_dynamicBody,
        cc_animatedBody: 3,
    } as typeof B2.BodyType;

    const JointType = {
        e_unknownJoint: b2.e_unknownJoint,
        e_revoluteJoint: b2.e_revoluteJoint,
        e_prismaticJoint: b2.e_prismaticJoint,
        e_distanceJoint: b2.e_distanceJoint,
        e_pulleyJoint: b2.e_pulleyJoint,
        e_mouseJoint: b2.e_mouseJoint,
        e_gearJoint: b2.e_gearJoint,
        e_wheelJoint: b2.e_wheelJoint,
        e_weldJoint: b2.e_weldJoint,
        e_frictionJoint: b2.e_frictionJoint,
        e_ropeJoint: b2.e_ropeJoint,
        e_motorJoint: b2.e_motorJoint,
    } as typeof B2.JointType;

    // --- Classes ---

    class Vec2Vector {
        private _ptr: number;
        constructor () { this._ptr = Vec2VectorNew(); }
        get ptr (): number { return this._ptr; }
        push_back (v: B2Vec2): void { Vec2VectorPush(this._ptr, v.x, v.y); }
        get (i: number): B2Vec2 { return Vec2VectorGet(this._ptr, i); }
        size (): number { return Vec2VectorSize(this._ptr); }
    }

    class Int32Vector {
        constructor () {}
        push_back (_v: number): void {}
        get (_i: number): number { return 0; }
        size (): number { return 0; }
    }

    class AABB {
        private _obj: Box2D.b2AABB;
        constructor () { this._obj = new box2d.b2AABB(); }

        get lowerBound (): B2Vec2 { return toVec2(this._obj.lowerBound); }
        set lowerBound (v: B2Vec2) { this._obj.lowerBound = fromVec2(v); }
        get upperBound (): B2Vec2 { return toVec2(this._obj.upperBound); }
        set upperBound (v: B2Vec2) { this._obj.upperBound = fromVec2(v); }
        IsValid (): boolean { return this._obj.IsValid(); }
        GetCenter (): B2Vec2 { return toVec2(this._obj.GetCenter()); }
        GetExtents (): B2Vec2 { return toVec2(this._obj.GetExtents()); }
        GetPerimeter (): number { return this._obj.GetPerimeter(); }
        Combine (aabb: AABB): void { this._obj.Combine(aabb._obj); }
        CombineTwo (aabb1: AABB, aabb2: AABB): void { this._obj.Combine(aabb1._obj, aabb2._obj); }
        Contains (aabb: AABB): boolean { return this._obj.Contains(aabb._obj); }
        RayCast (output: B2.RayCastOutput, input: B2.RayCastInput): boolean {
            return this._obj.RayCast(output as any, input as any);
        }
        TestOverlap (_other: AABB): boolean { return false as any; }
    }

    class RayCastCallback {
        protected _obj: Box2D.JSRayCastCallback;
        constructor () { this._obj = new box2d.JSRayCastCallback(); }
        ReportFixture (_fixture: any, _point: any, _normal: any, _fraction: number): number { return 0; }
        static implement (callbacks: any): RayCastCallback {
            const cb = new RayCastCallback();
            cb._obj.ReportFixture = (fixture: Box2D.b2Fixture | number, point: Box2D.b2Vec2 | number, normal: Box2D.b2Vec2 | number, fraction: number) => {
                return callbacks.ReportFixture(fixture, point, normal, fraction);
            };
            return cb as any;
        }
    }

    class QueryCallback {
        protected _obj: Box2D.JSQueryCallback;
        constructor () { this._obj = new box2d.JSQueryCallback(); }
        ReportFixture (_fixture: any): boolean { return false; }
        static implement (callbacks: any): QueryCallback {
            const cb = new QueryCallback();
            cb._obj.ReportFixture = (fixture: Box2D.b2Fixture | number) => {
                return callbacks.ReportFixture(fixture);
            };
            return cb as any;
        }
    }

    class ContactListener {
        protected _obj: Box2D.JSContactListener;
        constructor () { this._obj = new box2d.JSContactListener(); }
        BeginContact (_contact: number): void {}
        EndContact (_contact: number): void {}
        PreSolve (_contact: number, _oldManifold: number): void {}
        PostSolve (_contact: number, _impulse: number): void {}
        registerContactFixture (_fixture: number): void {}
        unregisterContactFixture (_fixture: number): void {}
        isIndexOf (_fixture: number): void {}
        static implement (callbacks: any): ContactListener {
            const cb = new ContactListener();
            cb._obj.BeginContact = (contact: Box2D.b2Contact | number) => {
                callbacks.BeginContact(typeof contact === 'number' ? contact : getPtr(contact));
            };
            cb._obj.EndContact = (contact: Box2D.b2Contact | number) => {
                callbacks.EndContact(typeof contact === 'number' ? contact : getPtr(contact));
            };
            cb._obj.PreSolve = (contact: Box2D.b2Contact | number, oldManifold: Box2D.b2Manifold | number) => {
                callbacks.PreSolve(
                    typeof contact === 'number' ? contact : getPtr(contact),
                    typeof oldManifold === 'number' ? oldManifold : getPtr(oldManifold),
                );
            };
            cb._obj.PostSolve = (contact: Box2D.b2Contact | number, impulse: Box2D.b2ContactImpulse | number) => {
                callbacks.PostSolve(
                    typeof contact === 'number' ? contact : getPtr(contact),
                    typeof impulse === 'number' ? impulse : getPtr(impulse),
                );
            };
            return cb as any;
        }
    }

    class Draw {
        protected _obj: Box2D.JSDraw;
        constructor () { this._obj = new box2d.JSDraw(); }
        SetFlags (flags: number): void { this._obj.SetFlags(flags); }
        GetFlags (): number { return this._obj.GetFlags(); }
        AppendFlags (flags: number): void { this._obj.AppendFlags(flags); }
        ClearFlags (flags: number): void { this._obj.ClearFlags(flags); }
        DrawPolygon (_vertices: B2Vec2[], _vertexCount: number, _color: B2.Color): void {}
        DrawSolidPolygon (_vertices: B2Vec2[], _vertexCount: number, _color: B2.Color): void {}
        DrawCircle (_center: B2Vec2, _radius: number, _color: B2.Color): void {}
        DrawSolidCircle (_center: B2Vec2, _radius: number, _axis: B2Vec2, _color: B2.Color): void {}
        static implement (callbacks: any): Draw {
            const cb = new Draw();

            function toB2Vec2 (v: Box2D.b2Vec2 | number): B2Vec2 {
                const b2v = typeof v === 'number' ? box2d.wrapPointer(v, box2d.b2Vec2) : v;
                return { x: b2v.x, y: b2v.y };
            }

            function toB2Color (c: Box2D.b2Color | number): B2.Color {
                const b2c = typeof c === 'number' ? box2d.wrapPointer(c, box2d.b2Color) : c;
                return { r: b2c.r, g: b2c.g, b: b2c.b, a: 0 } as any;
            }

            cb._obj.DrawPolygon = (vertices: Box2D.b2Vec2 | number, vertexCount: number, color: Box2D.b2Color | number) => {
                callbacks.DrawPolygon(vertices, vertexCount, toB2Color(color));
            };
            cb._obj.DrawSolidPolygon = (vertices: Box2D.b2Vec2 | number, vertexCount: number, color: Box2D.b2Color | number) => {
                callbacks.DrawSolidPolygon(vertices, vertexCount, toB2Color(color));
            };
            cb._obj.DrawCircle = (center: Box2D.b2Vec2 | number, radius: number, color: Box2D.b2Color | number) => {
                callbacks.DrawCircle(toB2Vec2(center), radius, toB2Color(color));
            };
            cb._obj.DrawSolidCircle = (center: Box2D.b2Vec2 | number, radius: number, axis: Box2D.b2Vec2 | number, color: Box2D.b2Color | number) => {
                callbacks.DrawSolidCircle(toB2Vec2(center), radius, toB2Vec2(axis), toB2Color(color));
            };
            if (cb._obj.DrawSegment) {
                cb._obj.DrawSegment = (p1: Box2D.b2Vec2 | number, p2: Box2D.b2Vec2 | number, color: Box2D.b2Color | number) => {
                    callbacks.DrawSegment(toB2Vec2(p1), toB2Vec2(p2), toB2Color(color));
                };
            }
            if (cb._obj.DrawTransform) {
                cb._obj.DrawTransform = (xf: Box2D.b2Transform | number) => {
                    const b2xf = typeof xf === 'number'
                        ? box2d.wrapPointer(xf, box2d.b2Transform)
                        : xf;
                    callbacks.DrawTransform({ p: { x: b2xf.p.x, y: b2xf.p.y }, q: { c: b2xf.q.c, s: b2xf.q.s } });
                };
            }
            if (cb._obj.DrawPoint) {
                cb._obj.DrawPoint = (p: Box2D.b2Vec2 | number, size: number, color: Box2D.b2Color | number) => {
                    callbacks.DrawPoint(toB2Vec2(p), size, toB2Color(color));
                };
            }
            if (cb._obj.DrawParticles) {
                cb._obj.DrawParticles = (centers: Box2D.b2Vec2 | number, radius: number, colors: Box2D.b2ParticleColor | number, count: number) => {
                    callbacks.DrawParticles(centers, radius, colors, count);
                };
            }
            return cb as any;
        }
    }

    class World {
        private _obj: Box2D.b2World;
        constructor (gravity: B2Vec2) {
            this._obj = new box2d.b2World(new box2d.b2Vec2(gravity.x, gravity.y));
        }


        SetContactListener (listener: ContactListener): void {
            this._obj.SetContactListener((listener as any)._obj);
        }
        SetDebugDraw (debugDraw: Draw): void {
            this._obj.SetDebugDraw((debugDraw as any)._obj);
        }
        CreateBody (def: BodyDef): Body {
            const b2Body = this._obj.CreateBody((def as any)._obj);
            return new Body(b2Body);
        }
        DestroyBody (body: Body): void {
            this._obj.DestroyBody((body as any)._obj);
        }
        CreateJoint (def: JointDef): Joint {
            const b2Joint = this._obj.CreateJoint((def as any)._obj);
            return new Joint(b2Joint);
        }
        DestroyJoint (joint: Joint): void {
            this._obj.DestroyJoint((joint as any)._obj);
        }
        Step (timeStep: number, velocityIterations: number, positionIterations: number): void {
            this._obj.Step(timeStep, velocityIterations, positionIterations);
        }
        DebugDraw (): void { this._obj.DebugDraw(); }
        QueryAABB (callback: QueryCallback, aabb: AABB): void {
            this._obj.QueryAABB((callback as any)._obj, (aabb as any)._obj);
        }
        RayCast (callback: RayCastCallback, point1: B2Vec2, point2: B2Vec2): void {
            this._obj.RayCast((callback as any)._obj, fromVec2(point1), fromVec2(point2));
        }
        SetAllowSleeping (flag: boolean): void { this._obj.SetAllowSleeping(flag); }
        GetAllowSleeping (): boolean { return this._obj.GetAllowSleeping(); }
        SetGravity (gravity: B2Vec2): void { this._obj.SetGravity(fromVec2(gravity)); }
        GetGravity (): B2Vec2 { return toVec2(this._obj.GetGravity()); }
        IsLocked (): boolean { return this._obj.IsLocked(); }
        Dump (): void { this._obj.Dump(); }
    }

    class Shape {
        protected _obj: Box2D.b2Shape;
        constructor (obj: Box2D.b2Shape) { this._obj = obj; }


        get m_type (): number { return this._obj.m_type; }
        set m_type (v: number) { this._obj.m_type = v; }
        get m_radius (): number { return this._obj.m_radius; }
        set m_radius (v: number) { this._obj.m_radius = v; }
        GetType (): number { return this._obj.GetType(); }
        GetChildCount (): number { return this._obj.GetChildCount(); }
        TestPoint (xf: B2.Transform, p: B2Vec2): boolean { return this._obj.TestPoint((xf as any)._obj, fromVec2(p)); }
        RayCast (output: B2.RayCastOutput, input: B2.RayCastInput, transform: B2.Transform, childIndex: number): boolean {
            return this._obj.RayCast(output as any, input as any, (transform as any)._obj, childIndex);
        }
        ComputeAABB (aabb: AABB, xf: B2.Transform, childIndex: number): void {
            this._obj.ComputeAABB((aabb as any)._obj, (xf as any)._obj, childIndex);
        }
        ComputeMass (massData: B2.MassData, density: number): void {
            this._obj.ComputeMass(massData as any, density);
        }
        SetRadius (radius: number): void { this._obj.m_radius = radius; }
        GetRadius (): number { return this._obj.m_radius; }
    }

    class CircleShape extends Shape {
        constructor () { super(new box2d.b2CircleShape()); }
        get m_p (): B2Vec2 { return toVec2((this._obj as Box2D.b2CircleShape).m_p); }
        set m_p (v: B2Vec2) { (this._obj as Box2D.b2CircleShape).m_p = fromVec2(v); }
        Clone (): CircleShape { return new CircleShape(); }
        GetChildCount (): number { return 1; }
        TestPoint (transform: B2.Transform, p: B2Vec2): boolean { return this._obj.TestPoint((transform as any)._obj, fromVec2(p)); }
        RayCast (output: B2.RayCastOutput, input: B2.RayCastInput, transform: B2.Transform, childIndex: number): boolean {
            return this._obj.RayCast(output as any, input as any, (transform as any)._obj, childIndex);
        }
        ComputeAABB (aabb: AABB, transform: B2.Transform, childIndex: number): void {
            this._obj.ComputeAABB((aabb as any)._obj, (transform as any)._obj, childIndex);
        }
        ComputeMass (massData: B2.MassData, density: number): void {
            this._obj.ComputeMass(massData as any, density);
        }
    }

    class EdgeShape extends Shape {
        constructor () { super(new box2d.b2EdgeShape()); }
        Set (v1: B2Vec2, v2: B2Vec2): void {
            (this._obj as Box2D.b2EdgeShape).SetTwoSided(fromVec2(v1), fromVec2(v2));
        }
        Clone (): EdgeShape { return new EdgeShape(); }
        GetChildCount (): number { return 1; }
        TestPoint (transform: B2.Transform, p: B2Vec2): boolean { return this._obj.TestPoint((transform as any)._obj, fromVec2(p)); }
        RayCast (output: B2.RayCastOutput, input: B2.RayCastInput, transform: B2.Transform, childIndex: number): boolean {
            return this._obj.RayCast(output as any, input as any, (transform as any)._obj, childIndex);
        }
        ComputeAABB (aabb: AABB, transform: B2.Transform, childIndex: number): void {
            this._obj.ComputeAABB((aabb as any)._obj, (transform as any)._obj, childIndex);
        }
        ComputeMass (massData: B2.MassData, density: number): void {
            this._obj.ComputeMass(massData as any, density);
        }
    }

    class PolygonShape extends Shape {
        constructor () { super(new box2d.b2PolygonShape()); }
        Clone (): PolygonShape { return new PolygonShape(); }
        Set (vertices: any, count: number): void {
            (this._obj as Box2D.b2PolygonShape).Set(vertices, count);
        }
        SetAsBox (hx: number, hy: number): void {
            (this._obj as Box2D.b2PolygonShape).SetAsBox(hx, hy);
        }
        SetAsBoxWithCenterAndAngle (hx: number, hy: number, center: B2Vec2, angle: number): void {
            (this._obj as Box2D.b2PolygonShape).SetAsBox(hx, hy, fromVec2(center), angle);
        }
        GetChildCount (): number { return 1; }
        TestPoint (transform: B2.Transform, p: B2Vec2): boolean { return this._obj.TestPoint((transform as any)._obj, fromVec2(p)); }
        RayCast (output: B2.RayCastOutput, input: B2.RayCastInput, transform: B2.Transform, childIndex: number): boolean {
            return this._obj.RayCast(output as any, input as any, (transform as any)._obj, childIndex);
        }
        ComputeAABB (aabb: AABB, transform: B2.Transform, childIndex: number): void {
            this._obj.ComputeAABB((aabb as any)._obj, (transform as any)._obj, childIndex);
        }
        ComputeMass (massData: B2.MassData, density: number): void {
            this._obj.ComputeMass(massData as any, density);
        }
        Validate (): boolean { return true; }
    }

    class FixtureDef {
        private _obj: Box2D.b2FixtureDef;
        constructor () { this._obj = new box2d.b2FixtureDef(); }


        get shape (): B2.Shape { return this._obj.shape as any; }
        set shape (v: B2.Shape) {
            if (v instanceof Shape) this._obj.shape = (v as any)._obj;
        }
        get userData (): any { return this._obj.userData; }
        set userData (v: any) { this._obj.userData = v; }
        get friction (): number { return this._obj.friction; }
        set friction (v: number) { this._obj.friction = v; }
        get restitution (): number { return this._obj.restitution; }
        set restitution (v: number) { this._obj.restitution = v; }
        get density (): number { return this._obj.density; }
        set density (v: number) { this._obj.density = v; }
        get isSensor (): boolean { return this._obj.isSensor; }
        set isSensor (v: boolean) { this._obj.isSensor = v; }
        get filter (): B2.Filter { return this._obj.filter as any; }
        set filter (v: B2.Filter) { this._obj.filter = v as any; }
        SetShape (shape: B2.Shape): void {
            if (shape instanceof Shape) this._obj.shape = (shape as any)._obj;
        }
        GetShape (): B2.Shape { return this._obj.shape as any; }
    }

    class Fixture {
        private _obj: Box2D.b2Fixture;
        constructor (obj: Box2D.b2Fixture) { this._obj = obj; }


        GetType (): number { return this._obj.GetType(); }
        GetShape (): B2.Shape { return this._obj.GetShape() as any; }
        SetSensor (sensor: boolean): void { this._obj.SetSensor(sensor); }
        IsSensor (): boolean { return this._obj.IsSensor(); }
        SetFilterData (filter: B2.Filter): void { this._obj.SetFilterData(filter as any); }
        GetFilterData (): B2.Filter { return this._obj.GetFilterData() as any; }
        Refilter (): void { this._obj.Refilter(); }
        GetBody (): Body { return new Body(this._obj.GetBody()); }
        GetNext (): Fixture { return new Fixture(this._obj.GetNext()); }
        TestPoint (p: B2Vec2): boolean { return this._obj.TestPoint(fromVec2(p)); }
        RayCast (output: B2.RayCastOutput, input: B2.RayCastInput, childIndex: number): boolean {
            return this._obj.RayCast(output as any, input as any, childIndex);
        }
        GetMassData (massData: B2.MassData): void { this._obj.GetMassData(massData as any); }
        SetDensity (density: number): void { this._obj.SetDensity(density); }
        GetDensity (): number { return this._obj.GetDensity(); }
        GetFriction (): number { return this._obj.GetFriction(); }
        SetFriction (friction: number): void { this._obj.SetFriction(friction); }
        GetRestitution (): number { return this._obj.GetRestitution(); }
        SetRestitution (restitution: number): void { this._obj.SetRestitution(restitution); }
        GetAABB (childIndex: number): AABB {
            const result = this._obj.GetAABB(childIndex);
            const aabb = new AABB();
            aabb.lowerBound = toVec2(result.lowerBound);
            aabb.upperBound = toVec2(result.upperBound);
            return aabb;
        }
        Dump (bodyIndex: number): void { this._obj.Dump(bodyIndex); }
    }

    class BodyDef {
        private _obj: Box2D.b2BodyDef;
        constructor () { this._obj = new box2d.b2BodyDef(); }


        get type (): typeof BodyType.b2_staticBody { return this._obj.type as any; }
        set type (v: typeof BodyType.b2_staticBody) { this._obj.type = v; }
        get position (): B2Vec2 { return toVec2(this._obj.position); }
        set position (v: B2Vec2) { this._obj.position = fromVec2(v); }
        get angle (): number { return this._obj.angle; }
        set angle (v: number) { this._obj.angle = v; }
        get linearVelocity (): B2Vec2 { return toVec2(this._obj.linearVelocity); }
        set linearVelocity (v: B2Vec2) { this._obj.linearVelocity = fromVec2(v); }
        get angularVelocity (): number { return this._obj.angularVelocity; }
        set angularVelocity (v: number) { this._obj.angularVelocity = v; }
        get linearDamping (): number { return this._obj.linearDamping; }
        set linearDamping (v: number) { this._obj.linearDamping = v; }
        get angularDamping (): number { return this._obj.angularDamping; }
        set angularDamping (v: number) { this._obj.angularDamping = v; }
        get allowSleep (): boolean { return this._obj.allowSleep; }
        set allowSleep (v: boolean) { this._obj.allowSleep = v; }
        get awake (): boolean { return this._obj.awake; }
        set awake (v: boolean) { this._obj.awake = v; }
        get fixedRotation (): boolean { return this._obj.fixedRotation; }
        set fixedRotation (v: boolean) { this._obj.fixedRotation = v; }
        get bullet (): boolean { return this._obj.bullet; }
        set bullet (v: boolean) { this._obj.bullet = v; }
        get gravityScale (): number { return this._obj.gravityScale; }
        set gravityScale (v: number) { this._obj.gravityScale = v; }
    }

    class Transform {
        private _obj: Box2D.b2Transform;
        constructor () { this._obj = new box2d.b2Transform(); }

        get p (): B2Vec2 { return toVec2(this._obj.p); }
        set p (v: B2Vec2) { this._obj.p = fromVec2(v); }
        get q (): any { return this._obj.q; }
    }

    class Body {
        private _obj: Box2D.b2Body;
        constructor (obj: Box2D.b2Body) { this._obj = obj; }


        CreateFixture (fixtureDef: FixtureDef): Fixture {
            const b2Fixture = this._obj.CreateFixture((fixtureDef as any)._obj);
            return new Fixture(b2Fixture);
        }
        CreateFixtureWithShape (shape: B2.Shape, density: number): Fixture {
            const b2Fixture = this._obj.CreateFixture(
                shape instanceof Shape ? (shape as any)._obj : (shape as any),
                density,
            );
            return new Fixture(b2Fixture);
        }
        DestroyFixture (fixture: Fixture): void {
            this._obj.DestroyFixture((fixture as any)._obj);
        }
        SetTransform (position: B2Vec2, angle: number): void {
            this._obj.SetTransform(fromVec2(position), angle);
        }
        GetTransform (): Transform {
            const t = new Transform();
            const xf = this._obj.GetTransform();
            t.p = toVec2(xf.p);
            return t;
        }
        GetPosition (): B2Vec2 { return toVec2(this._obj.GetPosition()); }
        SetPosition (pos: B2Vec2): void { this._obj.SetTransform(fromVec2(pos), this._obj.GetAngle()); }
        GetAngle (): number { return this._obj.GetAngle(); }
        SetAngle (angle: number): void { this._obj.SetTransform(this._obj.GetPosition(), angle); }
        GetWorldCenter (): B2Vec2 { return toVec2(this._obj.GetWorldCenter()); }
        GetLocalCenter (): B2Vec2 { return toVec2(this._obj.GetLocalCenter()); }
        SetLinearVelocity (v: B2Vec2): void { this._obj.SetLinearVelocity(fromVec2(v)); }
        GetLinearVelocity (): B2Vec2 { return toVec2(this._obj.GetLinearVelocity()); }
        SetAngularVelocity (omega: number): void { this._obj.SetAngularVelocity(omega); }
        GetAngularVelocity (): number { return this._obj.GetAngularVelocity(); }
        ApplyForce (force: B2Vec2, point: B2Vec2, wake: boolean): void {
            this._obj.ApplyForce(fromVec2(force), fromVec2(point), wake);
        }
        ApplyForceToCenter (force: B2Vec2, wake: boolean): void {
            this._obj.ApplyForceToCenter(fromVec2(force), wake);
        }
        ApplyTorque (torque: number, wake: boolean): void { this._obj.ApplyTorque(torque, wake); }
        ApplyLinearImpulse (impulse: B2Vec2, point: B2Vec2, wake: boolean): void {
            this._obj.ApplyLinearImpulse(fromVec2(impulse), fromVec2(point), wake);
        }
        ApplyLinearImpulseToCenter (impulse: B2Vec2, wake: boolean): void {
            this._obj.ApplyLinearImpulse(fromVec2(impulse), this._obj.GetWorldCenter(), wake);
        }
        ApplyAngularImpulse (impulse: number, wake: boolean): void { this._obj.ApplyAngularImpulse(impulse, wake); }
        GetMass (): number { return this._obj.GetMass(); }
        GetInertia (): number { return this._obj.GetInertia(); }
        GetMassData (data: B2.MassData): void { this._obj.GetMassData(data as any); }
        SetMassData (data: B2.MassData): void { this._obj.SetMassData(data as any); }
        ResetMassData (): void { this._obj.ResetMassData(); }
        GetWorldPoint (localPoint: B2Vec2): B2Vec2 { return toVec2(this._obj.GetWorldPoint(fromVec2(localPoint))); }
        GetWorldVector (localVector: B2Vec2): B2Vec2 { return toVec2(this._obj.GetWorldVector(fromVec2(localVector))); }
        GetLocalPoint (worldPoint: B2Vec2): B2Vec2 { return toVec2(this._obj.GetLocalPoint(fromVec2(worldPoint))); }
        GetLocalVector (worldVector: B2Vec2): B2Vec2 { return toVec2(this._obj.GetLocalVector(fromVec2(worldVector))); }
        GetLinearVelocityFromWorldPoint (worldPoint: B2Vec2): B2Vec2 { return toVec2(this._obj.GetLinearVelocityFromWorldPoint(fromVec2(worldPoint))); }
        GetLinearVelocityFromLocalPoint (localPoint: B2Vec2): B2Vec2 { return toVec2(this._obj.GetLinearVelocityFromLocalPoint(fromVec2(localPoint))); }
        GetLinearDamping (): number { return this._obj.GetLinearDamping(); }
        SetLinearDamping (linearDamping: number): void { this._obj.SetLinearDamping(linearDamping); }
        GetAngularDamping (): number { return this._obj.GetAngularDamping(); }
        SetAngularDamping (angularDamping: number): void { this._obj.SetAngularDamping(angularDamping); }
        GetGravityScale (): number { return this._obj.GetGravityScale(); }
        SetGravityScale (scale: number): void { this._obj.SetGravityScale(scale); }
        SetType (type: number): void { this._obj.SetType(type); }
        GetType (): number { return this._obj.GetType(); }
        SetBullet (flag: boolean): void { this._obj.SetBullet(flag); }
        IsBullet (): boolean { return this._obj.IsBullet(); }
        SetSleepingAllowed (flag: boolean): void { this._obj.SetSleepingAllowed(flag); }
        IsSleepingAllowed (): boolean { return this._obj.IsSleepingAllowed(); }
        SetAwake (flag: boolean): void { this._obj.SetAwake(flag); }
        IsAwake (): boolean { return this._obj.IsAwake(); }
        SetEnabled (flag: boolean): void { this._obj.SetEnabled(flag); }
        IsEnabled (): boolean { return this._obj.IsEnabled(); }
        SetFixedRotation (flag: boolean): void { this._obj.SetFixedRotation(flag); }
        IsFixedRotation (): boolean { return this._obj.IsFixedRotation(); }
        GetFixtureList (): number {
            const fixture = this._obj.GetFixtureList();
            return fixture ? getPtr(fixture) : 0;
        }
        GetJointList (): number {
            const jointEdge = this._obj.GetJointList();
            return jointEdge ? getPtr(jointEdge) : 0;
        }
        GetWorld (): World {
            const w = this._obj.GetWorld();
            return Object.create(World.prototype, { _obj: { value: w } }) as World;
        }
        Dump (): void { this._obj.Dump(); }
    }

    // --- Joint Classes ---

    class JointDef {
        protected _obj: Box2D.b2JointDef;
        constructor (type: number) {
            this._obj = new box2d.b2JointDef();
            this._obj.type = type;
        }


        get type (): number { return this._obj.type; }
        set type (v: number) { this._obj.type = v; }
        get collideConnected (): boolean { return this._obj.collideConnected; }
        set collideConnected (v: boolean) { this._obj.collideConnected = v; }
        SetBodyA (bodyA: Body): void { this._obj.bodyA = (bodyA as any)._obj; }
        SetBodyB (bodyB: Body): void { this._obj.bodyB = (bodyB as any)._obj; }
        GetBodyA (): Body { return new Body(this._obj.bodyA); }
        GetBodyB (): Body { return new Body(this._obj.bodyB); }
        SetCollideConnected (flag: boolean): void { this._obj.collideConnected = flag; }
    }

    class Joint {
        protected _obj: Box2D.b2Joint;
        constructor (obj: Box2D.b2Joint) { this._obj = obj; }


        GetType (): number { return this._obj.GetType(); }
        GetBodyA (): Body { return new Body(this._obj.GetBodyA()); }
        GetBodyB (): Body { return new Body(this._obj.GetBodyB()); }
        GetAnchorA (): B2Vec2 { return toVec2(this._obj.GetAnchorA()); }
        GetAnchorB (): B2Vec2 { return toVec2(this._obj.GetAnchorB()); }
        GetReactionForce (inv_dt: number): B2Vec2 { return toVec2(this._obj.GetReactionForce(inv_dt)); }
        GetReactionTorque (inv_dt: number): number { return this._obj.GetReactionTorque(inv_dt); }
        IsActive (): boolean { return true; }
        GetCollideConnected (): boolean { return this._obj.GetCollideConnected(); }
        Dump (): void { this._obj.Dump(); }
    }

    // Distance Joint
    class DistanceJointDef extends JointDef {
        private _dobj: Box2D.b2DistanceJointDef;
        constructor () {
            super(JointType.e_distanceJoint);
            this._dobj = this._obj as any as Box2D.b2DistanceJointDef;
        }
        get localAnchorA (): B2Vec2 { return toVec2(this._dobj.localAnchorA); }
        set localAnchorA (v: B2Vec2) { this._dobj.localAnchorA = fromVec2(v); }
        get localAnchorB (): B2Vec2 { return toVec2(this._dobj.localAnchorB); }
        set localAnchorB (v: B2Vec2) { this._dobj.localAnchorB = fromVec2(v); }
        get length (): number { return this._dobj.length; }
        set length (v: number) { this._dobj.length = v; }
        get frequencyHz (): number { return 0; }
        set frequencyHz (v: number) { this._dobj.stiffness = v; }
        get dampingRatio (): number { return 0; }
        set dampingRatio (v: number) { this._dobj.damping = v; }
    }

    class DistanceJoint extends Joint {
        private _dobj: Box2D.b2DistanceJoint;
        constructor (obj: Box2D.b2DistanceJoint) { super(obj); this._dobj = obj; }
        GetLocalAnchorA (): B2Vec2 { return toVec2(this._dobj.GetLocalAnchorA()); }
        GetLocalAnchorB (): B2Vec2 { return toVec2(this._dobj.GetLocalAnchorB()); }
        SetLength (length: number): void { this._dobj.SetLength(length); }
        GetLength (): number { return this._dobj.GetLength(); }
        SetFrequency (hz: number): void { this._dobj.SetStiffness(hz); }
        GetFrequency (): number { return this._dobj.GetStiffness(); }
        SetDampingRatio (ratio: number): void { this._dobj.SetDamping(ratio); }
        GetDampingRatio (): number { return this._dobj.GetDamping(); }
        Dump (): void { this._dobj.Dump(); }
    }

    // Motor Joint
    class MotorJointDef extends JointDef {
        private _dobj: Box2D.b2MotorJointDef;
        constructor () {
            super(JointType.e_motorJoint);
            this._dobj = this._obj as any as Box2D.b2MotorJointDef;
        }
        get linearOffset (): B2Vec2 { return toVec2(this._dobj.linearOffset); }
        set linearOffset (v: B2Vec2) { this._dobj.linearOffset = fromVec2(v); }
        get angularOffset (): number { return this._dobj.angularOffset; }
        set angularOffset (v: number) { this._dobj.angularOffset = v; }
        get maxForce (): number { return this._dobj.maxForce; }
        set maxForce (v: number) { this._dobj.maxForce = v; }
        get maxTorque (): number { return this._dobj.maxTorque; }
        set maxTorque (v: number) { this._dobj.maxTorque = v; }
        get correctionFactor (): number { return this._dobj.correctionFactor; }
        set correctionFactor (v: number) { this._dobj.correctionFactor = v; }
    }

    class MotorJoint extends Joint {
        private _dobj: Box2D.b2MotorJoint;
        constructor (obj: Box2D.b2MotorJoint) { super(obj); this._dobj = obj; }
        SetLinearOffset (linearOffset: B2Vec2): void { this._dobj.SetLinearOffset(fromVec2(linearOffset)); }
        GetLinearOffset (): B2Vec2 { return toVec2(this._dobj.GetLinearOffset()); }
        SetAngularOffset (angularOffset: number): void { this._dobj.SetAngularOffset(angularOffset); }
        GetAngularOffset (): number { return this._dobj.GetAngularOffset(); }
        SetMaxForce (force: number): void { this._dobj.SetMaxForce(force); }
        GetMaxForce (): number { return this._dobj.GetMaxForce(); }
        SetMaxTorque (torque: number): void { this._dobj.SetMaxTorque(torque); }
        GetMaxTorque (): number { return this._dobj.GetMaxTorque(); }
        SetCorrectionFactor (factor: number): void { this._dobj.SetCorrectionFactor(factor); }
        GetCorrectionFactor (): number { return this._dobj.GetCorrectionFactor(); }
        Dump (): void { this._dobj.Dump(); }
    }

    // Mouse Joint
    class MouseJointDef extends JointDef {
        private _dobj: Box2D.b2MouseJointDef;
        constructor () {
            super(JointType.e_mouseJoint);
            this._dobj = this._obj as any as Box2D.b2MouseJointDef;
        }
        get target (): B2Vec2 { return toVec2(this._dobj.target); }
        set target (v: B2Vec2) { this._dobj.target = fromVec2(v); }
        get maxForce (): number { return this._dobj.maxForce; }
        set maxForce (v: number) { this._dobj.maxForce = v; }
        get frequencyHz (): number { return 0; }
        set frequencyHz (v: number) { this._dobj.stiffness = v; }
        get dampingRatio (): number { return 0; }
        set dampingRatio (v: number) { this._dobj.damping = v; }
    }

    class MouseJoint extends Joint {
        private _dobj: Box2D.b2MouseJoint;
        constructor (obj: Box2D.b2MouseJoint) { super(obj); this._dobj = obj; }
        SetTarget (target: B2Vec2): void { this._dobj.SetTarget(fromVec2(target)); }
        GetTarget (): B2Vec2 { return toVec2(this._dobj.GetTarget()); }
        SetMaxForce (force: number): void { this._dobj.SetMaxForce(force); }
        GetMaxForce (): number { return this._dobj.GetMaxForce(); }
        SetFrequency (hz: number): void { this._dobj.SetStiffness(hz); }
        GetFrequency (): number { return this._dobj.GetStiffness(); }
        SetDampingRatio (ratio: number): void { this._dobj.SetDamping(ratio); }
        GetDampingRatio (): number { return this._dobj.GetDamping(); }
        Dump (): void { this._dobj.Dump(); }
    }

    // Prismatic Joint
    class PrismaticJointDef extends JointDef {
        private _dobj: Box2D.b2PrismaticJointDef;
        constructor () {
            super(JointType.e_prismaticJoint);
            this._dobj = this._obj as any as Box2D.b2PrismaticJointDef;
        }
        get localAnchorA (): B2Vec2 { return toVec2(this._dobj.localAnchorA); }
        set localAnchorA (v: B2Vec2) { this._dobj.localAnchorA = fromVec2(v); }
        get localAnchorB (): B2Vec2 { return toVec2(this._dobj.localAnchorB); }
        set localAnchorB (v: B2Vec2) { this._dobj.localAnchorB = fromVec2(v); }
        get localAxisA (): B2Vec2 { return toVec2(this._dobj.localAxisA); }
        set localAxisA (v: B2Vec2) { this._dobj.localAxisA = fromVec2(v); }
        get referenceAngle (): number { return this._dobj.referenceAngle; }
        set referenceAngle (v: number) { this._dobj.referenceAngle = v; }
        get enableLimit (): boolean { return this._dobj.enableLimit; }
        set enableLimit (v: boolean) { this._dobj.enableLimit = v; }
        get lowerTranslation (): number { return this._dobj.lowerTranslation; }
        set lowerTranslation (v: number) { this._dobj.lowerTranslation = v; }
        get upperTranslation (): number { return this._dobj.upperTranslation; }
        set upperTranslation (v: number) { this._dobj.upperTranslation = v; }
        get enableMotor (): boolean { return this._dobj.enableMotor; }
        set enableMotor (v: boolean) { this._dobj.enableMotor = v; }
        get maxMotorForce (): number { return this._dobj.maxMotorForce; }
        set maxMotorForce (v: number) { this._dobj.maxMotorForce = v; }
        get motorSpeed (): number { return this._dobj.motorSpeed; }
        set motorSpeed (v: number) { this._dobj.motorSpeed = v; }
    }

    class PrismaticJoint extends Joint {
        private _dobj: Box2D.b2PrismaticJoint;
        constructor (obj: Box2D.b2PrismaticJoint) { super(obj); this._dobj = obj; }
        GetLocalAnchorA (): B2Vec2 { return toVec2(this._dobj.GetLocalAnchorA()); }
        GetLocalAnchorB (): B2Vec2 { return toVec2(this._dobj.GetLocalAnchorB()); }
        GetLocalAxisA (): B2Vec2 { return toVec2(this._dobj.GetLocalAxisA()); }
        GetReferenceAngle (): number { return this._dobj.GetReferenceAngle(); }
        GetJointTranslation (): number { return this._dobj.GetJointTranslation(); }
        GetJointSpeed (): number { return this._dobj.GetJointSpeed(); }
        IsLimitEnabled (): boolean { return this._dobj.IsLimitEnabled(); }
        EnableLimit (flag: boolean): void { this._dobj.EnableLimit(flag); }
        GetLowerLimit (): number { return this._dobj.GetLowerLimit(); }
        GetUpperLimit (): number { return this._dobj.GetUpperLimit(); }
        SetLimits (lower: number, upper: number): void { this._dobj.SetLimits(lower, upper); }
        IsMotorEnabled (): boolean { return this._dobj.IsMotorEnabled(); }
        EnableMotor (flag: boolean): void { this._dobj.EnableMotor(flag); }
        SetMotorSpeed (speed: number): void { this._dobj.SetMotorSpeed(speed); }
        GetMotorSpeed (): number { return this._dobj.GetMotorSpeed(); }
        SetMaxMotorForce (force: number): void { this._dobj.SetMaxMotorForce(force); }
        GetMaxMotorForce (): number { return this._dobj.GetMaxMotorForce(); }
        GetMotorForce (inv_dt: number): number { return this._dobj.GetMotorForce(inv_dt); }
        Dump (): void { this._dobj.Dump(); }
    }

    // Revolute Joint
    class RevoluteJointDef extends JointDef {
        private _dobj: Box2D.b2RevoluteJointDef;
        constructor () {
            super(JointType.e_revoluteJoint);
            this._dobj = this._obj as any as Box2D.b2RevoluteJointDef;
        }
        get localAnchorA (): B2Vec2 { return toVec2(this._dobj.localAnchorA); }
        set localAnchorA (v: B2Vec2) { this._dobj.localAnchorA = fromVec2(v); }
        get localAnchorB (): B2Vec2 { return toVec2(this._dobj.localAnchorB); }
        set localAnchorB (v: B2Vec2) { this._dobj.localAnchorB = fromVec2(v); }
        get referenceAngle (): number { return this._dobj.referenceAngle; }
        set referenceAngle (v: number) { this._dobj.referenceAngle = v; }
        get enableLimit (): boolean { return this._dobj.enableLimit; }
        set enableLimit (v: boolean) { this._dobj.enableLimit = v; }
        get lowerAngle (): number { return this._dobj.lowerAngle; }
        set lowerAngle (v: number) { this._dobj.lowerAngle = v; }
        get upperAngle (): number { return this._dobj.upperAngle; }
        set upperAngle (v: number) { this._dobj.upperAngle = v; }
        get enableMotor (): boolean { return this._dobj.enableMotor; }
        set enableMotor (v: boolean) { this._dobj.enableMotor = v; }
        get motorSpeed (): number { return this._dobj.motorSpeed; }
        set motorSpeed (v: number) { this._dobj.motorSpeed = v; }
        get maxMotorTorque (): number { return this._dobj.maxMotorTorque; }
        set maxMotorTorque (v: number) { this._dobj.maxMotorTorque = v; }
    }

    class RevoluteJoint extends Joint {
        private _dobj: Box2D.b2RevoluteJoint;
        constructor (obj: Box2D.b2RevoluteJoint) { super(obj); this._dobj = obj; }
        GetLocalAnchorA (): B2Vec2 { return toVec2(this._dobj.GetLocalAnchorA()); }
        GetLocalAnchorB (): B2Vec2 { return toVec2(this._dobj.GetLocalAnchorB()); }
        GetReferenceAngle (): number { return this._dobj.GetReferenceAngle(); }
        GetJointAngle (): number { return this._dobj.GetJointAngle(); }
        GetJointSpeed (): number { return this._dobj.GetJointSpeed(); }
        IsLimitEnabled (): boolean { return this._dobj.IsLimitEnabled(); }
        EnableLimit (flag: boolean): void { this._dobj.EnableLimit(flag); }
        GetLowerLimit (): number { return this._dobj.GetLowerLimit(); }
        GetUpperLimit (): number { return this._dobj.GetUpperLimit(); }
        SetLimits (lower: number, upper: number): void { this._dobj.SetLimits(lower, upper); }
        IsMotorEnabled (): boolean { return this._dobj.IsMotorEnabled(); }
        EnableMotor (flag: boolean): void { this._dobj.EnableMotor(flag); }
        SetMotorSpeed (speed: number): void { this._dobj.SetMotorSpeed(speed); }
        GetMotorSpeed (): number { return this._dobj.GetMotorSpeed(); }
        SetMaxMotorTorque (torque: number): void { this._dobj.SetMaxMotorTorque(torque); }
        GetMaxMotorTorque (): number { return this._dobj.GetMaxMotorTorque(); }
        GetMotorTorque (inv_dt: number): number { return this._dobj.GetMotorTorque(inv_dt); }
        Dump (): void { this._dobj.Dump(); }
    }

    // Rope Joint - backed by b2DistanceJointDef since Box2D WASM has no b2RopeJointDef
    class RopeJointDef extends JointDef {
        private _robj: Box2D.b2DistanceJointDef;
        constructor () {
            super(JointType.e_distanceJoint as any);
            this._robj = new box2d.b2DistanceJointDef();
            (this as any)._obj = this._robj;
        }
        get localAnchorA (): B2Vec2 { return toVec2(this._robj.localAnchorA); }
        set localAnchorA (v: B2Vec2) { this._robj.localAnchorA = fromVec2(v); }
        get localAnchorB (): B2Vec2 { return toVec2(this._robj.localAnchorB); }
        set localAnchorB (v: B2Vec2) { this._robj.localAnchorB = fromVec2(v); }
        get maxLength (): number { return this._robj.maxLength; }
        set maxLength (v: number) { this._robj.maxLength = v; this._robj.minLength = 0; }
    }

    class RopeJoint extends Joint {
        private _robj: Box2D.b2DistanceJoint;
        constructor (obj: Box2D.b2DistanceJoint) { super(obj); this._robj = obj; }
        GetLocalAnchorA (): B2Vec2 { return toVec2(this._robj.GetLocalAnchorA()); }
        GetLocalAnchorB (): B2Vec2 { return toVec2(this._robj.GetLocalAnchorB()); }
        SetMaxLength (length: number): void { this._robj.SetMaxLength(length); }
        GetMaxLength (): number { return this._robj.GetMaxLength(); }
        Dump (): void { this._robj.Dump(); }
    }

    // Weld Joint
    class WeldJointDef extends JointDef {
        private _dobj: Box2D.b2WeldJointDef;
        constructor () {
            super(JointType.e_weldJoint);
            this._dobj = this._obj as any as Box2D.b2WeldJointDef;
        }
        get localAnchorA (): B2Vec2 { return toVec2(this._dobj.localAnchorA); }
        set localAnchorA (v: B2Vec2) { this._dobj.localAnchorA = fromVec2(v); }
        get localAnchorB (): B2Vec2 { return toVec2(this._dobj.localAnchorB); }
        set localAnchorB (v: B2Vec2) { this._dobj.localAnchorB = fromVec2(v); }
        get referenceAngle (): number { return this._dobj.referenceAngle; }
        set referenceAngle (v: number) { this._dobj.referenceAngle = v; }
        get frequencyHz (): number { return 0; }
        set frequencyHz (v: number) { this._dobj.stiffness = v; }
        get dampingRatio (): number { return 0; }
        set dampingRatio (v: number) { this._dobj.damping = v; }
    }

    class WeldJoint extends Joint {
        private _dobj: Box2D.b2WeldJoint;
        constructor (obj: Box2D.b2WeldJoint) { super(obj); this._dobj = obj; }
        GetLocalAnchorA (): B2Vec2 { return toVec2(this._dobj.GetLocalAnchorA()); }
        GetLocalAnchorB (): B2Vec2 { return toVec2(this._dobj.GetLocalAnchorB()); }
        GetReferenceAngle (): number { return this._dobj.GetReferenceAngle(); }
        SetFrequency (hz: number): void { this._dobj.SetStiffness(hz); }
        GetFrequency (): number { return this._dobj.GetStiffness(); }
        SetDampingRatio (ratio: number): void { this._dobj.SetDamping(ratio); }
        GetDampingRatio (): number { return this._dobj.GetDamping(); }
        Dump (): void { this._dobj.Dump(); }
    }

    // Wheel Joint
    class WheelJointDef extends JointDef {
        private _dobj: Box2D.b2WheelJointDef;
        constructor () {
            super(JointType.e_wheelJoint);
            this._dobj = this._obj as any as Box2D.b2WheelJointDef;
        }
        get localAnchorA (): B2Vec2 { return toVec2(this._dobj.localAnchorA); }
        set localAnchorA (v: B2Vec2) { this._dobj.localAnchorA = fromVec2(v); }
        get localAnchorB (): B2Vec2 { return toVec2(this._dobj.localAnchorB); }
        set localAnchorB (v: B2Vec2) { this._dobj.localAnchorB = fromVec2(v); }
        get localAxisA (): B2Vec2 { return toVec2(this._dobj.localAxisA); }
        set localAxisA (v: B2Vec2) { this._dobj.localAxisA = fromVec2(v); }
        get enableMotor (): boolean { return this._dobj.enableMotor; }
        set enableMotor (v: boolean) { this._dobj.enableMotor = v; }
        get maxMotorTorque (): number { return this._dobj.maxMotorTorque; }
        set maxMotorTorque (v: number) { this._dobj.maxMotorTorque = v; }
        get motorSpeed (): number { return this._dobj.motorSpeed; }
        set motorSpeed (v: number) { this._dobj.motorSpeed = v; }
        get frequencyHz (): number { return 0; }
        set frequencyHz (v: number) { this._dobj.stiffness = v; }
        get dampingRatio (): number { return 0; }
        set dampingRatio (v: number) { this._dobj.damping = v; }
    }

    class WheelJoint extends Joint {
        private _dobj: Box2D.b2WheelJoint;
        constructor (obj: Box2D.b2WheelJoint) { super(obj); this._dobj = obj; }
        GetLocalAnchorA (): B2Vec2 { return toVec2(this._dobj.GetLocalAnchorA()); }
        GetLocalAnchorB (): B2Vec2 { return toVec2(this._dobj.GetLocalAnchorB()); }
        GetLocalAxisA (): B2Vec2 { return toVec2(this._dobj.GetLocalAxisA()); }
        GetJointTranslation (): number { return this._dobj.GetJointTranslation(); }
        IsMotorEnabled (): boolean { return this._dobj.IsMotorEnabled(); }
        EnableMotor (flag: boolean): void { this._dobj.EnableMotor(flag); }
        SetMotorSpeed (speed: number): void { this._dobj.SetMotorSpeed(speed); }
        GetMotorSpeed (): number { return this._dobj.GetMotorSpeed(); }
        SetMaxMotorTorque (torque: number): void { this._dobj.SetMaxMotorTorque(torque); }
        GetMaxMotorTorque (): number { return this._dobj.GetMaxMotorTorque(); }
        GetMotorTorque (inv_dt: number): number { return this._dobj.GetMotorTorque(inv_dt); }
        SetSpringFrequencyHz (hz: number): void { this._dobj.SetStiffness(hz); }
        GetSpringFrequencyHz (): number { return this._dobj.GetStiffness(); }
        SetSpringDampingRatio (ratio: number): void { this._dobj.SetDamping(ratio); }
        GetSpringDampingRatio (): number { return this._dobj.GetDamping(); }
        Dump (): void { this._dobj.Dump(); }
    }

    // --- Pointer-based Free Functions ---

    function wrapB2Body (ptr: number): Box2D.b2Body {
        return box2d.wrapPointer(ptr, box2d.b2Body);
    }

    function wrapB2Shape (ptr: number): Box2D.b2Shape {
        return box2d.wrapPointer(ptr, box2d.b2Shape);
    }

    function wrapB2Fixture (ptr: number): Box2D.b2Fixture {
        return box2d.wrapPointer(ptr, box2d.b2Fixture);
    }

    function wrapB2Contact (ptr: number): Box2D.b2Contact {
        return box2d.wrapPointer(ptr, box2d.b2Contact);
    }

    function wrapB2Manifold (ptr: number): Box2D.b2Manifold {
        return box2d.wrapPointer(ptr, box2d.b2Manifold);
    }

    function wrapB2ManifoldPoint (ptr: number): Box2D.b2ManifoldPoint {
        return box2d.wrapPointer(ptr, box2d.b2ManifoldPoint);
    }

    function wrapB2WorldManifold (ptr: number): Box2D.b2WorldManifold {
        return box2d.wrapPointer(ptr, box2d.b2WorldManifold);
    }

    function wrapB2ContactImpulse (ptr: number): Box2D.b2ContactImpulse {
        return box2d.wrapPointer(ptr, box2d.b2ContactImpulse);
    }

    function wrapB2JointEdge (ptr: number): Box2D.b2JointEdge {
        return box2d.wrapPointer(ptr, box2d.b2JointEdge);
    }

    function wrapB2Transform (ptr: number): Box2D.b2Transform {
        return box2d.wrapPointer(ptr, box2d.b2Transform);
    }

    // Shape free functions
    function CircleShapeNew (): number {
        const shape = new box2d.b2CircleShape();
        return getPtr(shape);
    }

    function CircleShapeDelete (ptr: number): void {
        const shape = box2d.wrapPointer(ptr, box2d.b2CircleShape);
        box2d.destroy(shape);
    }

    function CircleShapeSetPosition (circleShapePtr: number, offsetX: number, offsetY: number): void {
        const shape = box2d.wrapPointer(circleShapePtr, box2d.b2CircleShape);
        shape.m_p = new box2d.b2Vec2(offsetX, offsetY);
    }

    function CircleShapeGetPosition (circleShapePtr: number): B2Vec2 {
        return box2d.wrapPointer(circleShapePtr, box2d.b2CircleShape).m_p as any;
    }

    function PolygonShapeNew (): number {
        const shape = new box2d.b2PolygonShape();
        return getPtr(shape);
    }

    function PolygonShapeDelete (ptr: number): void {
        const shape = box2d.wrapPointer(ptr, box2d.b2PolygonShape);
        box2d.destroy(shape);
    }

    function PolygonShapeSet (polygonShapePtr: number, verticesPtr: number, count: number): void {
        const shape = box2d.wrapPointer(polygonShapePtr, box2d.b2PolygonShape);
        shape.Set(verticesPtr, count);
    }

    function PolygonShapeSetAsBox (polygonShapePtr: number, hx: number, hy: number): void {
        const shape = box2d.wrapPointer(polygonShapePtr, box2d.b2PolygonShape);
        shape.SetAsBox(hx, hy);
    }

    function PolygonShapeSetAsBoxWithCenterAndAngle (polygonShapePtr: number, hx: number, hy: number, centerX: number, centerY: number, angle: number): void {
        const shape = box2d.wrapPointer(polygonShapePtr, box2d.b2PolygonShape);
        const center = new box2d.b2Vec2(centerX, centerY);
        shape.SetAsBox(hx, hy, center, angle);
    }

    function PolygonShapeGetVertexCount (polygonShapePtr: number): number {
        const shape = box2d.wrapPointer(polygonShapePtr, box2d.b2PolygonShape);
        return shape.m_count;
    }

    function ShapeGetRadius (shapePtr: number): number {
        return wrapB2Shape(shapePtr).m_radius;
    }

    function ShapeSetRadius (shapePtr: number, radius: number): void {
        wrapB2Shape(shapePtr).m_radius = radius;
    }

    function ShapeGetType (shapePtr: number): number {
        return wrapB2Shape(shapePtr).GetType();
    }

    function ShapeGetChildCount (shapePtr: number): number {
        return wrapB2Shape(shapePtr).GetChildCount();
    }

    function ShapeTestPoint (shapePtr: number, transformPtr: number, p: B2Vec2): boolean {
        return wrapB2Shape(shapePtr).TestPoint(wrapB2Transform(transformPtr), fromVec2(p));
    }

    // Body free functions
    function BodyCreateFixture (bodyPtr: number, fixtureDefPtr: number): number {
        const body = wrapB2Body(bodyPtr);
        const def = box2d.wrapPointer(fixtureDefPtr, box2d.b2FixtureDef);
        const fixture = body.CreateFixture(def);
        return getPtr(fixture);
    }

    function BodyCreateFixtureWithShape (bodyPtr: number, shapePtr: number, density: number): number {
        const body = wrapB2Body(bodyPtr);
        const fixture = body.CreateFixture(shapePtr, density);
        return getPtr(fixture);
    }

    function BodyDestroyFixture (bodyPtr: number, fixturePtr: number): void {
        const body = wrapB2Body(bodyPtr);
        const fixture = box2d.wrapPointer(fixturePtr, box2d.b2Fixture);
        body.DestroyFixture(fixture);
    }

    // Fixture free functions
    function FixtureDefNew (): number {
        const def = new box2d.b2FixtureDef();
        return getPtr(def);
    }

    function FixtureDefDelete (ptr: number): void {
        box2d.destroy(box2d.wrapPointer(ptr, box2d.b2FixtureDef));
    }

    function FixtureDefSetAll (fixtureDefPtr: number, shapePtr: number, userData: number,
        friction: number, restitution: number, density: number, isSensor: boolean,
        categoryBits: number, maskBits: number, groupIndex: number): void {
        const def = box2d.wrapPointer(fixtureDefPtr, box2d.b2FixtureDef);
        def.shape = box2d.wrapPointer(shapePtr, box2d.b2Shape);
        if (userData) {
            const ud = new box2d.b2FixtureUserData();
            ud.pointer = userData;
            def.userData = ud;
        }
        def.friction = friction;
        def.restitution = restitution;
        def.density = density;
        def.isSensor = isSensor;
        const filter = def.filter;
        filter.categoryBits = categoryBits;
        filter.maskBits = maskBits;
        filter.groupIndex = groupIndex;
    }

    function FixtureGetType (fixturePtr: number): number {
        return wrapB2Fixture(fixturePtr).GetType();
    }

    function FixtureGetShape (fixturePtr: number): number {
        const shape = wrapB2Fixture(fixturePtr).GetShape();
        return getPtr(shape);
    }

    function FixtureSetSensor (fixturePtr: number, sensor: boolean): void {
        wrapB2Fixture(fixturePtr).SetSensor(sensor);
    }

    function FixtureIsSensor (fixturePtr: number): boolean {
        return wrapB2Fixture(fixturePtr).IsSensor();
    }

    function FixtureSetFilterData (fixturePtr: number, filter: { categoryBits: number; maskBits: number; groupIndex: number }): void {
        const fixture = wrapB2Fixture(fixturePtr);
        const b2Filter = fixture.GetFilterData();
        b2Filter.categoryBits = filter.categoryBits;
        b2Filter.maskBits = filter.maskBits;
        b2Filter.groupIndex = filter.groupIndex;
        fixture.SetFilterData(b2Filter);
    }

    function FixtureGetFilterData (fixturePtr: number): { categoryBits: number; maskBits: number; groupIndex: number } {
        return wrapB2Fixture(fixturePtr).GetFilterData();
    }

    function FixtureRefilter (fixturePtr: number): void {
        wrapB2Fixture(fixturePtr).Refilter();
    }

    function FixtureGetBody (fixturePtr: number): number {
        const body = wrapB2Fixture(fixturePtr).GetBody();
        return getPtr(body);
    }

    function FixtureGetNext (fixturePtr: number): number {
        const next = wrapB2Fixture(fixturePtr).GetNext();
        return next ? getPtr(next) : 0;
    }

    function FixtureTestPoint (fixturePtr: number, p: B2Vec2): boolean {
        return wrapB2Fixture(fixturePtr).TestPoint(fromVec2(p));
    }

    function FixtureSetDensity (fixturePtr: number, density: number): void {
        wrapB2Fixture(fixturePtr).SetDensity(density);
    }

    function FixtureGetDensity (fixturePtr: number): number {
        return wrapB2Fixture(fixturePtr).GetDensity();
    }

    function FixtureGetFriction (fixturePtr: number): number {
        return wrapB2Fixture(fixturePtr).GetFriction();
    }

    function FixtureSetFriction (fixturePtr: number, friction: number): void {
        wrapB2Fixture(fixturePtr).SetFriction(friction);
    }

    function FixtureGetRestitution (fixturePtr: number): number {
        return wrapB2Fixture(fixturePtr).GetRestitution();
    }

    function FixtureSetRestitution (fixturePtr: number, restitution: number): void {
        wrapB2Fixture(fixturePtr).SetRestitution(restitution);
    }

    function FixtureGetAABB (fixturePtr: number, childIndex: number) {
        return wrapB2Fixture(fixturePtr).GetAABB(childIndex);
    }

    function FixtureDump (fixturePtr: number, bodyIndex: number): void {
        wrapB2Fixture(fixturePtr).Dump(bodyIndex);
    }

    // Contact free functions
    function ContactSetEnabled (contactPtr: number, flag: boolean): void {
        wrapB2Contact(contactPtr).SetEnabled(flag);
    }

    function ContactIsTouching (contactPtr: number): boolean {
        return wrapB2Contact(contactPtr).IsTouching();
    }

    function ContactSetTangentSpeed (contactPtr: number, speed: number): void {
        wrapB2Contact(contactPtr).SetTangentSpeed(speed);
    }

    function ContactGetTangentSpeed (contactPtr: number): number {
        return wrapB2Contact(contactPtr).GetTangentSpeed();
    }

    function ContactSetFriction (contactPtr: number, friction: number): void {
        wrapB2Contact(contactPtr).SetFriction(friction);
    }

    function ContactGetFriction (contactPtr: number): number {
        return wrapB2Contact(contactPtr).GetFriction();
    }

    function ContactResetFriction (contactPtr: number): void {
        wrapB2Contact(contactPtr).ResetFriction();
    }

    function ContactSetRestitution (contactPtr: number, restitution: number): void {
        wrapB2Contact(contactPtr).SetRestitution(restitution);
    }

    function ContactGetRestitution (contactPtr: number): number {
        return wrapB2Contact(contactPtr).GetRestitution();
    }

    function ContactResetRestitution (contactPtr: number): void {
        wrapB2Contact(contactPtr).ResetRestitution();
    }

    function ContactGetFixtureA (contactPtr: number): number {
        const fixture = wrapB2Contact(contactPtr).GetFixtureA();
        return getPtr(fixture);
    }

    function ContactGetFixture (contactPtr: number): B2.Vec2 {
        const contact = wrapB2Contact(contactPtr);
        return { x: getPtr(contact.GetFixtureA()), y: getPtr(contact.GetFixtureB()) } as B2.Vec2;
    }

    function ContactGetFixtureB (contactPtr: number): number {
        const fixture = wrapB2Contact(contactPtr).GetFixtureB();
        return getPtr(fixture);
    }

    function ContactGetWorldManifold (contactPtr: number, worldManifoldPtr: number): number {
        const contact = wrapB2Contact(contactPtr);
        const wm = wrapB2WorldManifold(worldManifoldPtr);
        contact.GetWorldManifold(wm);
        return worldManifoldPtr;
    }

    function ContactGetManifold (contactPtr: number): number {
        const manifold = wrapB2Contact(contactPtr).GetManifold();
        return getPtr(manifold);
    }

    // Manifold free functions
    function ManifoldGetType (manifoldPtr: number): number {
        return wrapB2Manifold(manifoldPtr).type;
    }

    function ManifoldGetPointCount (manifoldPtr: number): number {
        return wrapB2Manifold(manifoldPtr).pointCount;
    }

    function ManifoldGetManifoldPointPtr (manifoldPtr: number, index: number): number {
        const point = wrapB2Manifold(manifoldPtr).get_points(index);
        return getPtr(point);
    }

    function ManifoldGetLocalPointValueX (manifoldPtr: number): number {
        return wrapB2Manifold(manifoldPtr).localPoint.x;
    }

    function ManifoldGetLocalPointValueY (manifoldPtr: number): number {
        return wrapB2Manifold(manifoldPtr).localPoint.y;
    }

    function ManifoldGetLocalNormalValueX (manifoldPtr: number): number {
        return wrapB2Manifold(manifoldPtr).localNormal.x;
    }

    function ManifoldGetLocalNormalValueY (manifoldPtr: number): number {
        return wrapB2Manifold(manifoldPtr).localNormal.y;
    }

    // ManifoldPoint free functions
    function ManifoldPointGetLocalPointX (manifoldPointPtr: number): number {
        return wrapB2ManifoldPoint(manifoldPointPtr).localPoint.x;
    }

    function ManifoldPointGetLocalPointY (manifoldPointPtr: number): number {
        return wrapB2ManifoldPoint(manifoldPointPtr).localPoint.y;
    }

    function ManifoldPointGetNormalImpulse (manifoldPointPtr: number): number {
        return wrapB2ManifoldPoint(manifoldPointPtr).normalImpulse;
    }

    function ManifoldPointGetTangentImpulse (manifoldPointPtr: number): number {
        return wrapB2ManifoldPoint(manifoldPointPtr).tangentImpulse;
    }

    // WorldManifold free functions
    function WorldManifoldNew (): number {
        const wm = new box2d.b2WorldManifold();
        return getPtr(wm);
    }

    function WorldManifoldGetPointValueX (worldManifoldPtr: number, index: number): number {
        return wrapB2WorldManifold(worldManifoldPtr).get_points(index).x;
    }

    function WorldManifoldGetPointValueY (worldManifoldPtr: number, index: number): number {
        return wrapB2WorldManifold(worldManifoldPtr).get_points(index).y;
    }

    function WorldManifoldGetSeparationValue (worldManifoldPtr: number, index: number): number {
        return wrapB2WorldManifold(worldManifoldPtr).get_separations(index);
    }

    function WorldManifoldGetNormalValueX (worldManifoldPtr: number): number {
        return wrapB2WorldManifold(worldManifoldPtr).normal.x;
    }

    function WorldManifoldGetNormalValueY (worldManifoldPtr: number): number {
        return wrapB2WorldManifold(worldManifoldPtr).normal.y;
    }

    function WorldManifoldDelete (_worldManifoldPtr: number): void {
        // WASM memory managed by GC
    }

    // ContactImpulse free functions
    function ContactImpulseGetNormalImpulse (contactImpulsePtr: number, index: number): number {
        return wrapB2ContactImpulse(contactImpulsePtr).get_normalImpulses(index);
    }

    function ContactImpulseGetTangentImpulse (contactImpulsePtr: number, index: number): number {
        return wrapB2ContactImpulse(contactImpulsePtr).get_tangentImpulses(index);
    }

    function ContactImpulseGetCount (contactImpulsePtr: number): number {
        return wrapB2ContactImpulse(contactImpulsePtr).count;
    }

    // JointEdge free functions
    function JointEdgeGetOther (jointEdgePtr: number): number {
        const body = wrapB2JointEdge(jointEdgePtr).other;
        return body ? getPtr(body) : 0;
    }

    function JointEdgeGetJoint (jointEdgePtr: number): number {
        const joint = wrapB2JointEdge(jointEdgePtr).joint;
        return joint ? getPtr(joint) : 0;
    }

    function JointEdgeGetPrev (jointEdgePtr: number): number {
        const prev = wrapB2JointEdge(jointEdgePtr).prev;
        return prev ? getPtr(prev) : 0;
    }

    function JointEdgeGetNext (jointEdgePtr: number): number {
        const next = wrapB2JointEdge(jointEdgePtr).next;
        return next ? getPtr(next) : 0;
    }

    // Vec2Vector free functions - manage vertex data for polygon shapes
    const vec2VectorMap = new Map<number, { verts: { x: number; y: number }[]; bufPtr: number }>();
    let vec2IdCounter = 0;

    function Vec2VectorNew (): number {
        const id = ++vec2IdCounter;
        vec2VectorMap.set(id, { verts: [], bufPtr: 0 });
        return id;
    }

    function Vec2VectorDelete (ptr: number): void {
        const entry = vec2VectorMap.get(ptr);
        if (entry?.bufPtr) { (box2d as any)._free(entry.bufPtr); }
        vec2VectorMap.delete(ptr);
    }

    function Vec2VectorPush (vec2VectorPtr: number, x: number, y: number): void {
        vec2VectorMap.get(vec2VectorPtr)?.verts.push({ x, y });
    }

    function Vec2VectorSize (vec2VectorPtr: number): number {
        return vec2VectorMap.get(vec2VectorPtr)?.verts.length ?? 0;
    }

    function Vec2VectorGet (vec2VectorPtr: number, index: number): B2Vec2 {
        return vec2VectorMap.get(vec2VectorPtr)?.verts[index] ?? { x: 0, y: 0 };
    }

    function Vec2VectorGetPtr (vec2VectorPtr: number): number {
        const entry = vec2VectorMap.get(vec2VectorPtr);
        if (!entry || entry.verts.length === 0) return 0;

        const count = entry.verts.length;
        const byteSize = count * 8; // 2 floats * 4 bytes per vertex
        if (entry.bufPtr) { (box2d as any)._free(entry.bufPtr); }
        entry.bufPtr = (box2d as any)._malloc(byteSize);

        const heap = (box2d as any).HEAPF32;
        const base = entry.bufPtr / 4;
        for (let i = 0; i < count; i++) {
            heap[base + i * 2] = entry.verts[i].x;
            heap[base + i * 2 + 1] = entry.verts[i].y;
        }
        return entry.bufPtr;
    }

    function Vec2VectorResize (vec2VectorPtr: number, _a: number, _b: number, _c: number): void {
        // When called with (ptr, 0, 0, 0) it acts as clear
        const entry = vec2VectorMap.get(vec2VectorPtr);
        if (entry) entry.verts.length = 0;
    }

    function Vec2VectorClear (vec2VectorPtr: number): void {
        const entry = vec2VectorMap.get(vec2VectorPtr);
        if (entry) entry.verts.length = 0;
    }

    // Utility functions
    function ConvexPartition (_verticesIn: any, _trianglesIn: any, _verticesOut: any, _trianglesOut: any): void {
        // Stub - not commonly used in WASM path
    }

    function GetFloat32 (memory: number, offset: number): number {
        return new Float32Array(memory)[offset];
    }

    // --- Assemble B2 object ---
    return {
        // Enums & Constants
        maxPolygonVertices: 8,
        BodyType,
        JointType,

        // Classes
        Vec2Vector,
        Int32Vector,
        AABB,
        RayCastCallback,
        QueryCallback,
        ContactListener,
        Draw,
        World,
        Shape,
        CircleShape,
        EdgeShape,
        PolygonShape,
        FixtureDef,
        Fixture,
        BodyDef,
        Transform,
        Body,
        JointDef,
        Joint,
        DistanceJointDef,
        DistanceJoint,
        MotorJointDef,
        MotorJoint,
        MouseJointDef,
        MouseJoint,
        PrismaticJointDef,
        PrismaticJoint,
        RevoluteJointDef,
        RevoluteJoint,
        RopeJointDef,
        RopeJoint,
        WeldJointDef,
        WeldJoint,
        WheelJointDef,
        WheelJoint,

        // Free functions - Shape
        CircleShapeNew,
        CircleShapeDelete,
        CircleShapeSetPosition,
        CircleShapeGetPosition,
        PolygonShapeNew,
        PolygonShapeDelete,
        PolygonShapeSet,
        PolygonShapeSetAsBox,
        PolygonShapeSetAsBoxWithCenterAndAngle,
        PolygonShapeGetVertexCount,
        ShapeGetRadius,
        ShapeSetRadius,
        ShapeGetType,
        ShapeGetChildCount,
        ShapeTestPoint,

        // Free functions - Body
        BodyCreateFixture,
        BodyCreateFixtureWithShape,
        BodyDestroyFixture,

        // Free functions - Fixture
        FixtureDefNew,
        FixtureDefDelete,
        FixtureDefSetAll,
        FixtureGetType,
        FixtureGetShape,
        FixtureSetSensor,
        FixtureIsSensor,
        FixtureSetFilterData,
        FixtureGetFilterData,
        FixtureRefilter,
        FixtureGetBody,
        FixtureGetNext,
        FixtureTestPoint,
        FixtureSetDensity,
        FixtureGetDensity,
        FixtureGetFriction,
        FixtureSetFriction,
        FixtureGetRestitution,
        FixtureSetRestitution,
        FixtureGetAABB,
        FixtureDump,

        // Free functions - Contact
        ContactSetEnabled,
        ContactIsTouching,
        ContactSetTangentSpeed,
        ContactGetTangentSpeed,
        ContactSetFriction,
        ContactGetFriction,
        ContactResetFriction,
        ContactSetRestitution,
        ContactGetRestitution,
        ContactResetRestitution,
        ContactGetFixtureA,
        ContactGetFixture,
        ContactGetFixtureB,
        ContactGetWorldManifold,
        ContactGetManifold,

        // Free functions - Manifold
        ManifoldGetType,
        ManifoldGetPointCount,
        ManifoldGetManifoldPointPtr,
        ManifoldGetLocalPointValueX,
        ManifoldGetLocalPointValueY,
        ManifoldGetLocalNormalValueX,
        ManifoldGetLocalNormalValueY,

        // Free functions - ManifoldPoint
        ManifoldPointGetLocalPointX,
        ManifoldPointGetLocalPointY,
        ManifoldPointGetNormalImpulse,
        ManifoldPointGetTangentImpulse,

        // Free functions - WorldManifold
        WorldManifoldNew,
        WorldManifoldGetPointValueX,
        WorldManifoldGetPointValueY,
        WorldManifoldGetSeparationValue,
        WorldManifoldGetNormalValueX,
        WorldManifoldGetNormalValueY,
        WorldManifoldDelete,

        // Free functions - ContactImpulse
        ContactImpulseGetNormalImpulse,
        ContactImpulseGetTangentImpulse,
        ContactImpulseGetCount,

        // Free functions - JointEdge
        JointEdgeGetOther,
        JointEdgeGetJoint,
        JointEdgeGetPrev,
        JointEdgeGetNext,

        // Free functions - Vec2Vector
        Vec2VectorNew,
        Vec2VectorDelete,
        Vec2VectorPush,
        Vec2VectorSize,
        Vec2VectorGet,
        Vec2VectorGetPtr,
        Vec2VectorResize,
        Vec2VectorClear,

        // Utility
        ConvexPartition,
        GetFloat32,

        // HEAPF32 access — must be a getter because WASM memory can grow (reallocate),
        // which detaches the old ArrayBuffer. Reading from the module each time ensures
        // we always get the current view.
        get HEAP8 (): Int8Array { return (box2d as any).HEAP8; },
        get HEAP16 (): Int16Array { return (box2d as any).HEAP16; },
        get HEAP32 (): Int32Array { return (box2d as any).HEAP32; },
        get HEAPF32 (): Float32Array { return (box2d as any).HEAPF32; },
        get HEAPF64 (): Float64Array { return (box2d as any).HEAPF64; },
        get HEAPU8 (): Uint8Array { return (box2d as any).HEAPU8; },
        get HEAPU16 (): Uint16Array { return (box2d as any).HEAPU16; },
        get HEAPU32 (): Uint32Array { return (box2d as any).HEAPU32; },
    } as any as typeof B2;
}
