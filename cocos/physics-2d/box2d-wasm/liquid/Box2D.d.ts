declare namespace Box2D {
    export class b2Contact extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Contact;
        };
        protected readonly __class__: typeof b2Contact;
        GetManifold(): b2Manifold;
        GetWorldManifold(manifold: b2WorldManifold | number): void;
        IsTouching(): boolean;
        SetEnabled(flag: boolean): void;
        IsEnabled(): boolean;
        GetNext(): b2Contact;
        GetFixtureA(): b2Fixture;
        GetChildIndexA(): number;
        GetFixtureB(): b2Fixture;
        GetChildIndexB(): number;
        SetFriction(friction: number): void;
        GetFriction(): number;
        ResetFriction(): void;
        SetRestitution(restitution: number): void;
        GetRestitution(): number;
        ResetRestitution(): void;
        SetRestitutionThreshold(threshold: number): void;
        GetRestitutionThreshold(): number;
        ResetRestitutionThreshold(): void;
        SetTangentSpeed(speed: number): void;
        GetTangentSpeed(): number;
    }
    export class b2ContactListener extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ContactListener;
        };
        protected readonly __class__: typeof b2ContactListener;
        __destroy__(): void;
    }
    export class b2ContactListenerWrapper extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ContactListenerWrapper;
        };
        protected readonly __class__: typeof b2ContactListenerWrapper;
        __destroy__(): void;
    }
    export class JSContactListener extends b2ContactListenerWrapper {
        protected static readonly __cache__: {
            [ptr: number]: JSContactListener;
        };
        protected readonly __class__: typeof JSContactListener;
        __destroy__(): void;
        protected ptr: number;
        BeginContact(contact: b2Contact | number): void;
        EndContact(contact: b2Contact | number): void;
        BeginContactParticleSystemParticleBodyContact(particleSystem: b2ParticleSystem | number, particleBodyContact: b2ParticleBodyContact | number): void;
        EndContactFixtureParticleSystemIndex(fixture: b2Fixture | number, particleSystem: b2ParticleSystem | number, index: number): void;
        BeginContactParticleSystemParticleContact(particleSystem: b2ParticleSystem | number, particleContact: b2ParticleContact | number): void;
        EndContactParticleSystemIndexIndex(particleSystem: b2ParticleSystem | number, indexA: number, indexB: number): void;
        PreSolve(contact: b2Contact | number, oldManifold: b2Manifold | number): void;
        PostSolve(contact: b2Contact | number, impulse: b2ContactImpulse | number): void;
    }
    export class JSContactListenerWithoutSolveCallbacks extends b2ContactListenerWrapper {
        protected static readonly __cache__: {
            [ptr: number]: JSContactListenerWithoutSolveCallbacks;
        };
        protected readonly __class__: typeof JSContactListenerWithoutSolveCallbacks;
        __destroy__(): void;
        JSContactListener(): void;
        BeginContact(contact: b2Contact | number): void;
        EndContact(contact: b2Contact | number): void;
        BeginContactParticleSystemParticleBodyContact(particleSystem: b2ParticleSystem | number, particleBodyContact: b2ParticleBodyContact | number): void;
        EndContactFixtureParticleSystemIndex(fixture: b2Fixture | number, particleSystem: b2ParticleSystem | number, index: number): void;
        BeginContactParticleSystemParticleContact(particleSystem: b2ParticleSystem | number, particleContact: b2ParticleContact | number): void;
        EndContactParticleSystemIndexIndex(particleSystem: b2ParticleSystem | number, indexA: number, indexB: number): void;
    }
    export class b2World extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2World;
        };
        protected readonly __class__: typeof b2World;
        __destroy__(): void;
        protected ptr: number;
        /**
         * @deprecated no-arg construction is forbidden (throws errors).
         * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
         * @throws {string}
         */
        constructor();
        constructor(gravity: b2Vec2 | number);
        SetDestructionListener(listener: b2DestructionListener | number): void;
        SetContactFilter(filter: JSContactFilter | number): void;
        SetContactListener(listener: JSContactListener | number): void;
        SetDebugDraw(debugDraw: b2Draw | number): void;
        CreateBody(def: b2BodyDef | number): b2Body;
        DestroyBody(body: b2Body | number): void;
        CreateJoint(def: b2JointDef | number): b2Joint;
        DestroyJoint(joint: b2Joint | number): void;
        CreateParticleSystem(def: b2ParticleSystemDef | number): b2ParticleSystem;
        DestroyParticleSystem(p: b2ParticleSystem | number): void;
        CalculateReasonableParticleIterations(timeStep: number): number;
        Step(timeStep: number, velocityIterations: number, positionIterations: number, particleIterations: number): void;
        Step(timeStep: number, velocityIterations: number, positionIterations: number): void;
        ClearForces(): void;
        DebugDraw(): void;
        QueryAABB(callback: b2QueryCallback | number, aabb: b2AABB | number): void;
        RayCast(callback: b2RayCastCallback | number, point1: b2Vec2 | number, point2: b2Vec2 | number): void;
        GetBodyList(): b2Body;
        GetJointList(): b2Joint;
        GetContactList(): b2Contact;
        SetAllowSleeping(flag: boolean): void;
        GetAllowSleeping(): boolean;
        SetWarmStarting(flag: boolean): void;
        GetWarmStarting(): boolean;
        SetContinuousPhysics(flag: boolean): void;
        GetContinuousPhysics(): boolean;
        SetSubStepping(flag: boolean): void;
        GetSubStepping(): boolean;
        GetProxyCount(): number;
        GetBodyCount(): number;
        GetJointCount(): number;
        GetContactCount(): number;
        GetTreeHeight(): number;
        GetTreeBalance(): number;
        GetTreeQuality(): number;
        SetGravity(gravity: b2Vec2 | number): void;
        GetGravity(): b2Vec2;
        IsLocked(): boolean;
        SetAutoClearForces(flag: boolean): void;
        GetAutoClearForces(): boolean;
        GetProfile(): b2Profile;
        Dump(): void;
    }
    export namespace b2Shape {
        const e_circle: number;
        const e_edge: number;
        const e_polygon: number;
        const e_chain: number;
        const e_typeCount: number;
    }
    export class b2Shape extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Shape;
        };
        protected readonly __class__: typeof b2Shape;
        __destroy__(): void;
        GetType(): number;
        GetChildCount(): number;
        TestPoint(xf: b2Transform | number, p: b2Vec2 | number): boolean;
        RayCast(output: b2RayCastOutput | number, input: b2RayCastInput | number, transform: b2Transform | number, childIndex: number): boolean;
        ComputeAABB(aabb: b2AABB | number, xf: b2Transform | number, childIndex: number): void;
        ComputeMass(massData: b2MassData | number, density: number): void;
        m_type: number;
        get_m_type(): number;
        set_m_type(m_type: number): void;
        m_radius: number;
        get_m_radius(): number;
        set_m_radius(m_radius: number): void;
    }
    export class b2FixtureUserData extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2FixtureUserData;
        };
        protected readonly __class__: typeof b2FixtureUserData;
        __destroy__(): void;
        pointer: number;
        get_pointer(): number;
        set_pointer(pointer: number): void;
    }
    export class b2FixtureDef extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2FixtureDef;
        };
        protected readonly __class__: typeof b2FixtureDef;
        __destroy__(): void;
        protected ptr: number;
        shape: b2Shape;
        get_shape(): b2Shape;
        set_shape(shape: b2Shape): void;
        userData: b2FixtureUserData;
        get_userData(): b2FixtureUserData;
        set_userData(userData: b2FixtureUserData): void;
        friction: number;
        get_friction(): number;
        set_friction(friction: number): void;
        restitution: number;
        get_restitution(): number;
        set_restitution(restitution: number): void;
        restitutionThreshold: number;
        get_restitutionThreshold(): number;
        set_restitutionThreshold(restitutionThreshold: number): void;
        density: number;
        get_density(): number;
        set_density(density: number): void;
        isSensor: boolean;
        get_isSensor(): boolean;
        set_isSensor(isSensor: boolean): void;
        filter: b2Filter;
        get_filter(): b2Filter;
        set_filter(filter: b2Filter): void;
    }
    export class b2Fixture extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Fixture;
        };
        protected readonly __class__: typeof b2Fixture;
        __destroy__(): void;
        GetType(): number;
        GetShape(): b2Shape;
        SetSensor(sensor: boolean): void;
        IsSensor(): boolean;
        SetFilterData(filter: b2Filter | number): void;
        GetFilterData(): b2Filter;
        Refilter(): void;
        GetBody(): b2Body;
        GetNext(): b2Fixture;
        GetUserData(): b2FixtureUserData;
        TestPoint(p: b2Vec2 | number): boolean;
        RayCast(output: b2RayCastOutput | number, input: b2RayCastInput | number, childIndex: number): boolean;
        GetMassData(massData: b2MassData | number): void;
        SetDensity(density: number): void;
        GetDensity(): number;
        GetFriction(): number;
        SetFriction(friction: number): void;
        GetRestitution(): number;
        SetRestitution(restitution: number): void;
        GetRestitutionThreshold(): number;
        SetRestitutionThreshold(threshold: number): void;
        GetAABB(childIndex: number): b2AABB;
        Dump(bodyIndex: number): void;
    }
    export class b2Transform extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Transform;
        };
        protected readonly __class__: typeof b2Transform;
        __destroy__(): void;
        protected ptr: number;
        /**
         * @deprecated no-arg construction is forbidden (throws errors).
         * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
         * @throws {string}
         */
        constructor();
        constructor(position: b2Vec2 | number, rotation: b2Rot | number);
        SetIdentity(): void;
        Set(position: b2Vec2 | number, angle: number): void;
        p: b2Vec2;
        get_p(): b2Vec2;
        set_p(p: b2Vec2): void;
        q: b2Rot;
        get_q(): b2Rot;
        set_q(q: b2Rot): void;
    }
    export class b2RayCastCallback extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2RayCastCallback;
        };
        protected readonly __class__: typeof b2RayCastCallback;
        __destroy__(): void;
    }
    export class JSRayCastCallback extends b2RayCastCallback {
        protected static readonly __cache__: {
            [ptr: number]: JSRayCastCallback;
        };
        protected readonly __class__: typeof JSRayCastCallback;
        __destroy__(): void;
        protected ptr: number;
        ReportFixture(fixture: b2Fixture | number, point: b2Vec2 | number, normal: b2Vec2 | number, fraction: number): number;
        ReportParticle(particleSystem: b2ParticleSystem | number, index: number, point: b2Vec2 | number, normal: b2Vec2 | number, fraction: number): number;
        ShouldQueryParticleSystem(particleSystem: b2ParticleSystem | number): boolean;
    }
    export class b2QueryCallback extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2QueryCallback;
        };
        protected readonly __class__: typeof b2QueryCallback;
        __destroy__(): void;
    }
    export class JSQueryCallback extends b2QueryCallback {
        protected static readonly __cache__: {
            [ptr: number]: JSQueryCallback;
        };
        protected readonly __class__: typeof JSQueryCallback;
        __destroy__(): void;
        protected ptr: number;
        ReportFixture(fixture: b2Fixture | number): boolean;
        ReportParticle(particleSystem: b2ParticleSystem | number, index: number): boolean;
        ShouldQueryParticleSystem(particleSystem: b2ParticleSystem | number): boolean;
    }
    export class b2MassData extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2MassData;
        };
        protected readonly __class__: typeof b2MassData;
        __destroy__(): void;
        protected ptr: number;
        mass: number;
        get_mass(): number;
        set_mass(mass: number): void;
        center: b2Vec2;
        get_center(): b2Vec2;
        set_center(center: b2Vec2): void;
        I: number;
        get_I(): number;
        set_I(I: number): void;
    }
    export class b2Vec2 extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Vec2;
        };
        protected readonly __class__: typeof b2Vec2;
        __destroy__(): void;
        protected ptr: number;
        /**
         * @deprecated no-arg construction is forbidden (throws errors).
         * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
         * @throws {string}
         */
        constructor();
        constructor(x: number, y: number);
        SetZero(): void;
        Set(x: number, y: number): void;
        op_add(v: b2Vec2 | number): void;
        op_sub(v: b2Vec2 | number): void;
        op_mul(s: number): void;
        Length(): number;
        LengthSquared(): number;
        Normalize(): number;
        IsValid(): boolean;
        Skew(): b2Vec2;
        x: number;
        get_x(): number;
        set_x(x: number): void;
        y: number;
        get_y(): number;
        set_y(y: number): void;
    }
    export class b2Vec3 extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Vec3;
        };
        protected readonly __class__: typeof b2Vec3;
        __destroy__(): void;
        protected ptr: number;
        /**
         * @deprecated no-arg construction is forbidden (throws errors).
         * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
         * @throws {string}
         */
        constructor();
        constructor(x: number, y: number, z: number);
        SetZero(): void;
        Set(x: number, y: number, z: number): void;
        Length(): number;
        Normalize(): number;
        op_add(v: b2Vec3 | number): void;
        op_sub(v: b2Vec3 | number): void;
        op_mul(s: number): void;
        x: number;
        get_x(): number;
        set_x(x: number): void;
        y: number;
        get_y(): number;
        set_y(y: number): void;
        z: number;
        get_z(): number;
        set_z(z: number): void;
    }
    export class b2Vec4 extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Vec4;
        };
        protected readonly __class__: typeof b2Vec4;
        __destroy__(): void;
        protected ptr: number;
        /**
         * @deprecated no-arg construction is forbidden (throws errors).
         * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
         * @throws {string}
         */
        constructor();
        constructor(x: number, y: number, z: number, w: number);
        x: number;
        get_x(): number;
        set_x(x: number): void;
        y: number;
        get_y(): number;
        set_y(y: number): void;
        z: number;
        get_z(): number;
        set_z(z: number): void;
        w: number;
        get_w(): number;
        set_w(w: number): void;
    }
    export class b2BodyUserData extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2BodyUserData;
        };
        protected readonly __class__: typeof b2BodyUserData;
        __destroy__(): void;
        pointer: number;
        get_pointer(): number;
        set_pointer(pointer: number): void;
    }
    export class b2Body extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Body;
        };
        protected readonly __class__: typeof b2Body;
        CreateFixture(def: b2FixtureDef | number): b2Fixture;
        CreateFixture(shape: b2Shape | number, density: number): b2Fixture;
        DestroyFixture(fixture: b2Fixture | number): void;
        SetTransform(position: b2Vec2 | number, angle: number): void;
        GetTransform(): b2Transform;
        GetPosition(): b2Vec2;
        GetAngle(): number;
        GetWorldCenter(): b2Vec2;
        GetLocalCenter(): b2Vec2;
        SetLinearVelocity(v: b2Vec2 | number): void;
        GetLinearVelocity(): b2Vec2;
        SetAngularVelocity(omega: number): void;
        GetAngularVelocity(): number;
        ApplyForce(force: b2Vec2 | number, point: b2Vec2 | number, awake: boolean): void;
        ApplyForceToCenter(force: b2Vec2 | number, awake: boolean): void;
        ApplyTorque(torque: number, awake: boolean): void;
        ApplyLinearImpulse(impulse: b2Vec2 | number, point: b2Vec2 | number, awake: boolean): void;
        ApplyAngularImpulse(impulse: number, awake: boolean): void;
        GetMass(): number;
        GetInertia(): number;
        GetMassData(data: b2MassData | number): void;
        SetMassData(data: b2MassData | number): void;
        ResetMassData(): void;
        GetWorldPoint(localPoint: b2Vec2 | number): b2Vec2;
        GetWorldVector(localVector: b2Vec2 | number): b2Vec2;
        GetLocalPoint(worldPoint: b2Vec2 | number): b2Vec2;
        GetLocalVector(worldVector: b2Vec2 | number): b2Vec2;
        GetLinearVelocityFromWorldPoint(worldPoint: b2Vec2 | number): b2Vec2;
        GetLinearVelocityFromLocalPoint(localPoint: b2Vec2 | number): b2Vec2;
        GetLinearDamping(): number;
        SetLinearDamping(linearDamping: number): void;
        GetAngularDamping(): number;
        SetAngularDamping(angularDamping: number): void;
        GetGravityScale(): number;
        SetGravityScale(scale: number): void;
        SetType(type: number | number): void;
        GetType(): number;
        SetBullet(flag: boolean): void;
        IsBullet(): boolean;
        SetSleepingAllowed(flag: boolean): void;
        IsSleepingAllowed(): boolean;
        SetAwake(flag: boolean): void;
        IsAwake(): boolean;
        SetEnabled(flag: boolean): void;
        IsEnabled(): boolean;
        SetFixedRotation(flag: boolean): void;
        IsFixedRotation(): boolean;
        GetFixtureList(): b2Fixture;
        GetJointList(): b2JointEdge;
        GetContactList(): b2ContactEdge;
        GetNext(): b2Body;
        GetUserData(): b2BodyUserData;
        GetWorld(): b2World;
        Dump(): void;
    }
    const b2_staticBody: number;
    const b2_kinematicBody: number;
    const b2_dynamicBody: number;
    export class b2BodyDef extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2BodyDef;
        };
        protected readonly __class__: typeof b2BodyDef;
        __destroy__(): void;
        protected ptr: number;
        type: number;
        get_type(): number;
        set_type(type: number): void;
        position: b2Vec2;
        get_position(): b2Vec2;
        set_position(position: b2Vec2): void;
        angle: number;
        get_angle(): number;
        set_angle(angle: number): void;
        linearVelocity: b2Vec2;
        get_linearVelocity(): b2Vec2;
        set_linearVelocity(linearVelocity: b2Vec2): void;
        angularVelocity: number;
        get_angularVelocity(): number;
        set_angularVelocity(angularVelocity: number): void;
        linearDamping: number;
        get_linearDamping(): number;
        set_linearDamping(linearDamping: number): void;
        angularDamping: number;
        get_angularDamping(): number;
        set_angularDamping(angularDamping: number): void;
        allowSleep: boolean;
        get_allowSleep(): boolean;
        set_allowSleep(allowSleep: boolean): void;
        awake: boolean;
        get_awake(): boolean;
        set_awake(awake: boolean): void;
        fixedRotation: boolean;
        get_fixedRotation(): boolean;
        set_fixedRotation(fixedRotation: boolean): void;
        bullet: boolean;
        get_bullet(): boolean;
        set_bullet(bullet: boolean): void;
        userData: b2BodyUserData;
        get_userData(): b2BodyUserData;
        set_userData(userData: b2BodyUserData): void;
        gravityScale: number;
        get_gravityScale(): number;
        set_gravityScale(gravityScale: number): void;
    }
    export class b2Filter extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Filter;
        };
        protected readonly __class__: typeof b2Filter;
        __destroy__(): void;
        protected ptr: number;
        categoryBits: number;
        get_categoryBits(): number;
        set_categoryBits(categoryBits: number): void;
        maskBits: number;
        get_maskBits(): number;
        set_maskBits(maskBits: number): void;
        groupIndex: number;
        get_groupIndex(): number;
        set_groupIndex(groupIndex: number): void;
    }
    export class b2AABB extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2AABB;
        };
        protected readonly __class__: typeof b2AABB;
        __destroy__(): void;
        protected ptr: number;
        IsValid(): boolean;
        GetCenter(): b2Vec2;
        GetExtents(): b2Vec2;
        GetPerimeter(): number;
        Combine(aabb: b2AABB | number): void;
        Combine(aabb1: b2AABB | number, aabb2: b2AABB | number): void;
        Contains(aabb: b2AABB | number): boolean;
        RayCast(output: b2RayCastOutput | number, input: b2RayCastInput | number): boolean;
        lowerBound: b2Vec2;
        get_lowerBound(): b2Vec2;
        set_lowerBound(lowerBound: b2Vec2): void;
        upperBound: b2Vec2;
        get_upperBound(): b2Vec2;
        set_upperBound(upperBound: b2Vec2): void;
    }
    export class b2CircleShape extends b2Shape {
        protected static readonly __cache__: {
            [ptr: number]: b2CircleShape;
        };
        protected readonly __class__: typeof b2CircleShape;
        __destroy__(): void;
        protected ptr: number;
        m_p: b2Vec2;
        get_m_p(): b2Vec2;
        set_m_p(m_p: b2Vec2): void;
    }
    export class b2EdgeShape extends b2Shape {
        protected static readonly __cache__: {
            [ptr: number]: b2EdgeShape;
        };
        protected readonly __class__: typeof b2EdgeShape;
        __destroy__(): void;
        protected ptr: number;
        SetOneSided(v0: b2Vec2 | number, v1: b2Vec2 | number, v2: b2Vec2 | number, v3: b2Vec2 | number): void;
        SetTwoSided(v1: b2Vec2 | number, v2: b2Vec2 | number): void;
        m_vertex1: b2Vec2;
        get_m_vertex1(): b2Vec2;
        set_m_vertex1(m_vertex1: b2Vec2): void;
        m_vertex2: b2Vec2;
        get_m_vertex2(): b2Vec2;
        set_m_vertex2(m_vertex2: b2Vec2): void;
        m_vertex0: b2Vec2;
        get_m_vertex0(): b2Vec2;
        set_m_vertex0(m_vertex0: b2Vec2): void;
        m_vertex3: b2Vec2;
        get_m_vertex3(): b2Vec2;
        set_m_vertex3(m_vertex3: b2Vec2): void;
        m_oneSided: boolean;
        get_m_oneSided(): boolean;
        set_m_oneSided(m_oneSided: boolean): void;
    }
    const e_unknownJoint: number;
    const e_revoluteJoint: number;
    const e_prismaticJoint: number;
    const e_distanceJoint: number;
    const e_pulleyJoint: number;
    const e_mouseJoint: number;
    const e_gearJoint: number;
    const e_wheelJoint: number;
    const e_weldJoint: number;
    const e_frictionJoint: number;
    const e_ropeJoint: number;
    const e_motorJoint: number;
    export class b2JointUserData extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2JointUserData;
        };
        protected readonly __class__: typeof b2JointUserData;
        __destroy__(): void;
        pointer: number;
        get_pointer(): number;
        set_pointer(pointer: number): void;
    }
    export class b2JointDef extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2JointDef;
        };
        protected readonly __class__: typeof b2JointDef;
        __destroy__(): void;
        type: number;
        get_type(): number;
        set_type(type: number): void;
        userData: b2JointUserData;
        get_userData(): b2JointUserData;
        set_userData(userData: b2JointUserData): void;
        bodyA: b2Body;
        get_bodyA(): b2Body;
        set_bodyA(bodyA: b2Body): void;
        bodyB: b2Body;
        get_bodyB(): b2Body;
        set_bodyB(bodyB: b2Body): void;
        collideConnected: boolean;
        get_collideConnected(): boolean;
        set_collideConnected(collideConnected: boolean): void;
    }
    export class b2Joint extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Joint;
        };
        protected readonly __class__: typeof b2Joint;
        GetType(): number;
        GetBodyA(): b2Body;
        GetBodyB(): b2Body;
        GetAnchorA(): b2Vec2;
        GetAnchorB(): b2Vec2;
        GetReactionForce(inv_dt: number): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetNext(): b2Joint;
        GetUserData(): b2JointUserData;
        GetCollideConnected(): boolean;
        Dump(): void;
    }
    export class b2WeldJoint extends b2Joint {
        protected static readonly __cache__: {
            [ptr: number]: b2WeldJoint;
        };
        protected readonly __class__: typeof b2WeldJoint;
        __destroy__(): void;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetReferenceAngle(): number;
        SetStiffness(stiffness: number): void;
        GetStiffness(): number;
        SetDamping(damping: number): void;
        GetDamping(): number;
        Dump(): void;
    }
    export class b2WeldJointDef extends b2JointDef {
        protected static readonly __cache__: {
            [ptr: number]: b2WeldJointDef;
        };
        protected readonly __class__: typeof b2WeldJointDef;
        __destroy__(): void;
        protected ptr: number;
        Initialize(bodyA: b2Body | number, bodyB: b2Body | number, anchor: b2Vec2 | number): void;
        localAnchorA: b2Vec2;
        get_localAnchorA(): b2Vec2;
        set_localAnchorA(localAnchorA: b2Vec2): void;
        localAnchorB: b2Vec2;
        get_localAnchorB(): b2Vec2;
        set_localAnchorB(localAnchorB: b2Vec2): void;
        referenceAngle: number;
        get_referenceAngle(): number;
        set_referenceAngle(referenceAngle: number): void;
        stiffness: number;
        get_stiffness(): number;
        set_stiffness(stiffness: number): void;
        damping: number;
        get_damping(): number;
        set_damping(damping: number): void;
    }
    export class b2ChainShape extends b2Shape {
        protected static readonly __cache__: {
            [ptr: number]: b2ChainShape;
        };
        protected readonly __class__: typeof b2ChainShape;
        __destroy__(): void;
        protected ptr: number;
        Clear(): void;
        CreateLoop(vertices: b2Vec2 | number, count: number): void;
        CreateChain(vertices: b2Vec2 | number, count: number, prevVertex: b2Vec2 | number, nextVertex: b2Vec2 | number): void;
        GetChildEdge(edge: b2EdgeShape | number, index: number): void;
        m_vertices: b2Vec2;
        get_m_vertices(): b2Vec2;
        set_m_vertices(m_vertices: b2Vec2): void;
        m_count: number;
        get_m_count(): number;
        set_m_count(m_count: number): void;
        m_prevVertex: b2Vec2;
        get_m_prevVertex(): b2Vec2;
        set_m_prevVertex(m_prevVertex: b2Vec2): void;
        m_nextVertex: b2Vec2;
        get_m_nextVertex(): b2Vec2;
        set_m_nextVertex(m_nextVertex: b2Vec2): void;
    }
    export class b2Color extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Color;
        };
        protected readonly __class__: typeof b2Color;
        __destroy__(): void;
        protected ptr: number;
        /**
         * @deprecated no-arg construction is forbidden (throws errors).
         * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
         * @throws {string}
         */
        constructor();
        constructor(r: number, g: number, b: number);
        Set(ri: number, gi: number, bi: number): void;
        r: number;
        get_r(): number;
        set_r(r: number): void;
        g: number;
        get_g(): number;
        set_g(g: number): void;
        b: number;
        get_b(): number;
        set_b(b: number): void;
    }
    export class b2ContactEdge extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ContactEdge;
        };
        protected readonly __class__: typeof b2ContactEdge;
        __destroy__(): void;
        protected ptr: number;
        other: b2Body;
        get_other(): b2Body;
        set_other(other: b2Body): void;
        contact: b2Contact;
        get_contact(): b2Contact;
        set_contact(contact: b2Contact): void;
        prev: b2ContactEdge;
        get_prev(): b2ContactEdge;
        set_prev(prev: b2ContactEdge): void;
        next: b2ContactEdge;
        get_next(): b2ContactEdge;
        set_next(next: b2ContactEdge): void;
    }
    export namespace b2ContactFeature {
        const e_vertex: number;
        const e_face: number;
    }
    export class b2ContactFeature extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ContactFeature;
        };
        protected readonly __class__: typeof b2ContactFeature;
        __destroy__(): void;
        indexA: number;
        get_indexA(): number;
        set_indexA(indexA: number): void;
        indexB: number;
        get_indexB(): number;
        set_indexB(indexB: number): void;
        typeA: number;
        get_typeA(): number;
        set_typeA(typeA: number): void;
        typeB: number;
        get_typeB(): number;
        set_typeB(typeB: number): void;
    }
    export class b2ContactFilter extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ContactFilter;
        };
        protected readonly __class__: typeof b2ContactFilter;
        __destroy__(): void;
    }
    export class b2ContactFilterWrapper extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ContactFilterWrapper;
        };
        protected readonly __class__: typeof b2ContactFilterWrapper;
        __destroy__(): void;
    }
    export class JSContactFilter extends b2ContactFilterWrapper {
        protected static readonly __cache__: {
            [ptr: number]: JSContactFilter;
        };
        protected readonly __class__: typeof JSContactFilter;
        __destroy__(): void;
        protected ptr: number;
        ShouldCollide(fixtureA: b2Fixture | number, fixtureB: b2Fixture | number): boolean;
        ShouldCollideFixtureParticleSystemIndex(fixture: b2Fixture | number, particleSystem: b2ParticleSystem | number, particleIndex: number): boolean;
        ShouldCollideParticleSystemIndexIndex(particleSystem: b2ParticleSystem | number, particleIndexA: number, particleIndexB: number): boolean;
    }
    export class b2ContactID extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ContactID;
        };
        protected readonly __class__: typeof b2ContactID;
        __destroy__(): void;
        cf: b2ContactFeature;
        get_cf(): b2ContactFeature;
        set_cf(cf: b2ContactFeature): void;
        key: number;
        get_key(): number;
        set_key(key: number): void;
    }
    export class b2ContactImpulse extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ContactImpulse;
        };
        protected readonly __class__: typeof b2ContactImpulse;
        __destroy__(): void;
        normalImpulses: number;
        get_normalImpulses(index?: number): number;
        set_normalImpulses(index: number, normalImpulses_elem: number): void;
        tangentImpulses: number;
        get_tangentImpulses(index?: number): number;
        set_tangentImpulses(index: number, tangentImpulses_elem: number): void;
        count: number;
        get_count(): number;
        set_count(count: number): void;
    }
    export class b2DestructionListener extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2DestructionListener;
        };
        protected readonly __class__: typeof b2DestructionListener;
        __destroy__(): void;
    }
    export class b2DestructionListenerWrapper extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2DestructionListenerWrapper;
        };
        protected readonly __class__: typeof b2DestructionListenerWrapper;
        __destroy__(): void;
    }
    export class JSDestructionListener extends b2DestructionListenerWrapper {
        protected static readonly __cache__: {
            [ptr: number]: JSDestructionListener;
        };
        protected readonly __class__: typeof JSDestructionListener;
        __destroy__(): void;
        protected ptr: number;
        SayGoodbyeJoint(joint: b2Joint | number): void;
        SayGoodbyeFixture(joint: b2Fixture | number): void;
        SayGoodbyeParticleGroup(group: b2ParticleGroup | number): void;
        SayGoodbyeParticleSystemIndex(particleSystem: b2ParticleSystem | number, index: number): void;
    }
    export class b2DistanceJoint extends b2Joint {
        protected static readonly __cache__: {
            [ptr: number]: b2DistanceJoint;
        };
        protected readonly __class__: typeof b2DistanceJoint;
        __destroy__(): void;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetLength(): number;
        SetLength(length: number): void;
        GetMinLength(): number;
        SetMinLength(minLength: number): void;
        GetMaxLength(): number;
        SetMaxLength(maxLength: number): void;
        GetCurrentLength(): number;
        SetStiffness(stiffness: number): void;
        GetStiffness(): number;
        SetDamping(damping: number): void;
        GetDamping(): number;
    }
    export class b2DistanceJointDef extends b2JointDef {
        protected static readonly __cache__: {
            [ptr: number]: b2DistanceJointDef;
        };
        protected readonly __class__: typeof b2DistanceJointDef;
        __destroy__(): void;
        protected ptr: number;
        Initialize(bodyA: b2Body | number, bodyB: b2Body | number, anchorA: b2Vec2 | number, anchorB: b2Vec2 | number): void;
        localAnchorA: b2Vec2;
        get_localAnchorA(): b2Vec2;
        set_localAnchorA(localAnchorA: b2Vec2): void;
        localAnchorB: b2Vec2;
        get_localAnchorB(): b2Vec2;
        set_localAnchorB(localAnchorB: b2Vec2): void;
        length: number;
        get_length(): number;
        set_length(length: number): void;
        minLength: number;
        get_minLength(): number;
        set_minLength(minLength: number): void;
        maxLength: number;
        get_maxLength(): number;
        set_maxLength(maxLength: number): void;
        stiffness: number;
        get_stiffness(): number;
        set_stiffness(stiffness: number): void;
        damping: number;
        get_damping(): number;
        set_damping(damping: number): void;
    }
    export namespace b2Draw {
        const e_shapeBit: number;
        const e_jointBit: number;
        const e_aabbBit: number;
        const e_pairBit: number;
        const e_centerOfMassBit: number;
        const e_particleBit: number;
    }
    export class b2Draw extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Draw;
        };
        protected readonly __class__: typeof b2Draw;
        __destroy__(): void;
        SetFlags(flags: number): void;
        GetFlags(): number;
        AppendFlags(flags: number): void;
        ClearFlags(flags: number): void;
    }
    export class JSDraw extends b2Draw {
        protected static readonly __cache__: {
            [ptr: number]: JSDraw;
        };
        protected readonly __class__: typeof JSDraw;
        __destroy__(): void;
        protected ptr: number;
        DrawPolygon(vertices: b2Vec2 | number, vertexCount: number, color: b2Color | number): void;
        DrawSolidPolygon(vertices: b2Vec2 | number, vertexCount: number, color: b2Color | number): void;
        DrawCircle(center: b2Vec2 | number, radius: number, color: b2Color | number): void;
        DrawSolidCircle(center: b2Vec2 | number, radius: number, axis: b2Vec2 | number, color: b2Color | number): void;
        DrawParticles(centers: b2Vec2 | number, radius: number, colors: b2ParticleColor | number, count: number): void;
        DrawSegment(p1: b2Vec2 | number, p2: b2Vec2 | number, color: b2Color | number): void;
        DrawTransform(xf: b2Transform | number): void;
        DrawPoint(p: b2Vec2 | number, size: number, color: b2Color | number): void;
    }
    export class b2FrictionJoint extends b2Joint {
        protected static readonly __cache__: {
            [ptr: number]: b2FrictionJoint;
        };
        protected readonly __class__: typeof b2FrictionJoint;
        __destroy__(): void;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        SetMaxForce(force: number): void;
        GetMaxForce(): number;
        SetMaxTorque(torque: number): void;
        GetMaxTorque(): number;
    }
    export class b2FrictionJointDef extends b2JointDef {
        protected static readonly __cache__: {
            [ptr: number]: b2FrictionJointDef;
        };
        protected readonly __class__: typeof b2FrictionJointDef;
        __destroy__(): void;
        protected ptr: number;
        Initialize(bodyA: b2Body | number, bodyB: b2Body | number, anchor: b2Vec2 | number): void;
        localAnchorA: b2Vec2;
        get_localAnchorA(): b2Vec2;
        set_localAnchorA(localAnchorA: b2Vec2): void;
        localAnchorB: b2Vec2;
        get_localAnchorB(): b2Vec2;
        set_localAnchorB(localAnchorB: b2Vec2): void;
        maxForce: number;
        get_maxForce(): number;
        set_maxForce(maxForce: number): void;
        maxTorque: number;
        get_maxTorque(): number;
        set_maxTorque(maxTorque: number): void;
    }
    export class b2GearJoint extends b2Joint {
        protected static readonly __cache__: {
            [ptr: number]: b2GearJoint;
        };
        protected readonly __class__: typeof b2GearJoint;
        __destroy__(): void;
        GetJoint1(): b2Joint;
        GetJoint2(): b2Joint;
        SetRatio(ratio: number): void;
        GetRatio(): number;
    }
    export class b2GearJointDef extends b2JointDef {
        protected static readonly __cache__: {
            [ptr: number]: b2GearJointDef;
        };
        protected readonly __class__: typeof b2GearJointDef;
        __destroy__(): void;
        protected ptr: number;
        joint1: b2Joint;
        get_joint1(): b2Joint;
        set_joint1(joint1: b2Joint): void;
        joint2: b2Joint;
        get_joint2(): b2Joint;
        set_joint2(joint2: b2Joint): void;
        ratio: number;
        get_ratio(): number;
        set_ratio(ratio: number): void;
    }
    export class b2JointEdge extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2JointEdge;
        };
        protected readonly __class__: typeof b2JointEdge;
        __destroy__(): void;
        protected ptr: number;
        other: b2Body;
        get_other(): b2Body;
        set_other(other: b2Body): void;
        joint: b2Joint;
        get_joint(): b2Joint;
        set_joint(joint: b2Joint): void;
        prev: b2JointEdge;
        get_prev(): b2JointEdge;
        set_prev(prev: b2JointEdge): void;
        next: b2JointEdge;
        get_next(): b2JointEdge;
        set_next(next: b2JointEdge): void;
    }
    export namespace b2Manifold {
        const e_circles: number;
        const e_faceA: number;
        const e_faceB: number;
    }
    export class b2Manifold extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Manifold;
        };
        protected readonly __class__: typeof b2Manifold;
        __destroy__(): void;
        protected ptr: number;
        points: b2ManifoldPoint;
        get_points(index?: number): b2ManifoldPoint;
        set_points(index: number, points_elem: b2ManifoldPoint): void;
        localNormal: b2Vec2;
        get_localNormal(): b2Vec2;
        set_localNormal(localNormal: b2Vec2): void;
        localPoint: b2Vec2;
        get_localPoint(): b2Vec2;
        set_localPoint(localPoint: b2Vec2): void;
        type: number;
        get_type(): number;
        set_type(type: number): void;
        pointCount: number;
        get_pointCount(): number;
        set_pointCount(pointCount: number): void;
    }
    export class b2WorldManifold extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2WorldManifold;
        };
        protected readonly __class__: typeof b2WorldManifold;
        __destroy__(): void;
        protected ptr: number;
        Initialize(manifold: b2Manifold | number, xfA: b2Transform | number, radiusA: number, xfB: b2Transform | number, radiusB: number): void;
        normal: b2Vec2;
        get_normal(): b2Vec2;
        set_normal(normal: b2Vec2): void;
        points: b2Vec2;
        get_points(index?: number): b2Vec2;
        set_points(index: number, points_elem: b2Vec2): void;
        separations: number;
        get_separations(index?: number): number;
        set_separations(index: number, separations_elem: number): void;
    }
    export class b2ManifoldPoint extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ManifoldPoint;
        };
        protected readonly __class__: typeof b2ManifoldPoint;
        __destroy__(): void;
        protected ptr: number;
        localPoint: b2Vec2;
        get_localPoint(): b2Vec2;
        set_localPoint(localPoint: b2Vec2): void;
        normalImpulse: number;
        get_normalImpulse(): number;
        set_normalImpulse(normalImpulse: number): void;
        tangentImpulse: number;
        get_tangentImpulse(): number;
        set_tangentImpulse(tangentImpulse: number): void;
        id: b2ContactID;
        get_id(): b2ContactID;
        set_id(id: b2ContactID): void;
    }
    export class b2Mat22 extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Mat22;
        };
        protected readonly __class__: typeof b2Mat22;
        __destroy__(): void;
        protected ptr: number;
        /**
         * @deprecated no-arg construction is forbidden (throws errors).
         * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
         * @throws {string}
         */
        constructor();
        constructor(c1: b2Vec2 | number, c2: b2Vec2 | number);
        /**
         * @deprecated no-arg construction is forbidden (throws errors).
         * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
         * @throws {string}
         */
        constructor();
        constructor(a11: number, a12: number, a21: number, a22: number);
        Set(c1: b2Vec2 | number, c2: b2Vec2 | number): void;
        SetIdentity(): void;
        SetZero(): void;
        GetInverse(): b2Mat22;
        Solve(b: b2Vec2 | number): b2Vec2;
        ex: b2Vec2;
        get_ex(): b2Vec2;
        set_ex(ex: b2Vec2): void;
        ey: b2Vec2;
        get_ey(): b2Vec2;
        set_ey(ey: b2Vec2): void;
    }
    export class b2Mat33 extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Mat33;
        };
        protected readonly __class__: typeof b2Mat33;
        __destroy__(): void;
        protected ptr: number;
        /**
         * @deprecated no-arg construction is forbidden (throws errors).
         * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
         * @throws {string}
         */
        constructor();
        constructor(c1: b2Vec3 | number, c2: b2Vec3 | number, c3: b2Vec3 | number);
        SetZero(): void;
        Solve33(b: b2Vec3 | number): b2Vec3;
        Solve22(b: b2Vec2 | number): b2Vec2;
        GetInverse22(M: b2Mat33 | number): void;
        GetSymInverse33(M: b2Mat33 | number): void;
        ex: b2Vec3;
        get_ex(): b2Vec3;
        set_ex(ex: b2Vec3): void;
        ey: b2Vec3;
        get_ey(): b2Vec3;
        set_ey(ey: b2Vec3): void;
        ez: b2Vec3;
        get_ez(): b2Vec3;
        set_ez(ez: b2Vec3): void;
    }
    export class b2MouseJoint extends b2Joint {
        protected static readonly __cache__: {
            [ptr: number]: b2MouseJoint;
        };
        protected readonly __class__: typeof b2MouseJoint;
        __destroy__(): void;
        SetTarget(target: b2Vec2 | number): void;
        GetTarget(): b2Vec2;
        SetMaxForce(force: number): void;
        GetMaxForce(): number;
        SetStiffness(stiffness: number): void;
        GetStiffness(): number;
        SetDamping(damping: number): void;
        GetDamping(): number;
    }
    export class b2MouseJointDef extends b2JointDef {
        protected static readonly __cache__: {
            [ptr: number]: b2MouseJointDef;
        };
        protected readonly __class__: typeof b2MouseJointDef;
        __destroy__(): void;
        protected ptr: number;
        target: b2Vec2;
        get_target(): b2Vec2;
        set_target(target: b2Vec2): void;
        maxForce: number;
        get_maxForce(): number;
        set_maxForce(maxForce: number): void;
        stiffness: number;
        get_stiffness(): number;
        set_stiffness(stiffness: number): void;
        damping: number;
        get_damping(): number;
        set_damping(damping: number): void;
    }
    export class b2PolygonShape extends b2Shape {
        protected static readonly __cache__: {
            [ptr: number]: b2PolygonShape;
        };
        protected readonly __class__: typeof b2PolygonShape;
        __destroy__(): void;
        protected ptr: number;
        Set(vertices: b2Vec2 | number, vertexCount: number): void;
        SetAsBox(hx: number, hy: number): void;
        SetAsBox(hx: number, hy: number, center: b2Vec2 | number, angle: number): void;
        m_centroid: b2Vec2;
        get_m_centroid(): b2Vec2;
        set_m_centroid(m_centroid: b2Vec2): void;
        m_vertices: b2Vec2;
        get_m_vertices(index?: number): b2Vec2;
        set_m_vertices(index: number, m_vertices_elem: b2Vec2): void;
        m_normals: b2Vec2;
        get_m_normals(index?: number): b2Vec2;
        set_m_normals(index: number, m_normals_elem: b2Vec2): void;
        m_count: number;
        get_m_count(): number;
        set_m_count(m_count: number): void;
    }
    export class b2PrismaticJoint extends b2Joint {
        protected static readonly __cache__: {
            [ptr: number]: b2PrismaticJoint;
        };
        protected readonly __class__: typeof b2PrismaticJoint;
        __destroy__(): void;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetLocalAxisA(): b2Vec2;
        GetReferenceAngle(): number;
        GetJointTranslation(): number;
        GetJointSpeed(): number;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: boolean): void;
        GetLowerLimit(): number;
        GetUpperLimit(): number;
        SetLimits(lower: number, upper: number): void;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: number): void;
        GetMotorSpeed(): number;
        SetMaxMotorForce(force: number): void;
        GetMaxMotorForce(): number;
        GetMotorForce(inv_dt: number): number;
    }
    export class b2PrismaticJointDef extends b2JointDef {
        protected static readonly __cache__: {
            [ptr: number]: b2PrismaticJointDef;
        };
        protected readonly __class__: typeof b2PrismaticJointDef;
        __destroy__(): void;
        protected ptr: number;
        Initialize(bodyA: b2Body | number, bodyB: b2Body | number, anchor: b2Vec2 | number, axis: b2Vec2 | number): void;
        localAnchorA: b2Vec2;
        get_localAnchorA(): b2Vec2;
        set_localAnchorA(localAnchorA: b2Vec2): void;
        localAnchorB: b2Vec2;
        get_localAnchorB(): b2Vec2;
        set_localAnchorB(localAnchorB: b2Vec2): void;
        localAxisA: b2Vec2;
        get_localAxisA(): b2Vec2;
        set_localAxisA(localAxisA: b2Vec2): void;
        referenceAngle: number;
        get_referenceAngle(): number;
        set_referenceAngle(referenceAngle: number): void;
        enableLimit: boolean;
        get_enableLimit(): boolean;
        set_enableLimit(enableLimit: boolean): void;
        lowerTranslation: number;
        get_lowerTranslation(): number;
        set_lowerTranslation(lowerTranslation: number): void;
        upperTranslation: number;
        get_upperTranslation(): number;
        set_upperTranslation(upperTranslation: number): void;
        enableMotor: boolean;
        get_enableMotor(): boolean;
        set_enableMotor(enableMotor: boolean): void;
        maxMotorForce: number;
        get_maxMotorForce(): number;
        set_maxMotorForce(maxMotorForce: number): void;
        motorSpeed: number;
        get_motorSpeed(): number;
        set_motorSpeed(motorSpeed: number): void;
    }
    export class b2Profile extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Profile;
        };
        protected readonly __class__: typeof b2Profile;
        __destroy__(): void;
        step: number;
        get_step(): number;
        set_step(step: number): void;
        collide: number;
        get_collide(): number;
        set_collide(collide: number): void;
        solve: number;
        get_solve(): number;
        set_solve(solve: number): void;
        solveInit: number;
        get_solveInit(): number;
        set_solveInit(solveInit: number): void;
        solveVelocity: number;
        get_solveVelocity(): number;
        set_solveVelocity(solveVelocity: number): void;
        solvePosition: number;
        get_solvePosition(): number;
        set_solvePosition(solvePosition: number): void;
        broadphase: number;
        get_broadphase(): number;
        set_broadphase(broadphase: number): void;
        solveTOI: number;
        get_solveTOI(): number;
        set_solveTOI(solveTOI: number): void;
    }
    export class b2PulleyJoint extends b2Joint {
        protected static readonly __cache__: {
            [ptr: number]: b2PulleyJoint;
        };
        protected readonly __class__: typeof b2PulleyJoint;
        __destroy__(): void;
        GetGroundAnchorA(): b2Vec2;
        GetGroundAnchorB(): b2Vec2;
        GetLengthA(): number;
        GetLengthB(): number;
        GetRatio(): number;
        GetCurrentLengthA(): number;
        GetCurrentLengthB(): number;
    }
    export class b2PulleyJointDef extends b2JointDef {
        protected static readonly __cache__: {
            [ptr: number]: b2PulleyJointDef;
        };
        protected readonly __class__: typeof b2PulleyJointDef;
        __destroy__(): void;
        protected ptr: number;
        Initialize(bodyA: b2Body | number, bodyB: b2Body | number, groundAnchorA: b2Vec2 | number, groundAnchorB: b2Vec2 | number, anchorA: b2Vec2 | number, anchorB: b2Vec2 | number, ratio: number): void;
        groundAnchorA: b2Vec2;
        get_groundAnchorA(): b2Vec2;
        set_groundAnchorA(groundAnchorA: b2Vec2): void;
        groundAnchorB: b2Vec2;
        get_groundAnchorB(): b2Vec2;
        set_groundAnchorB(groundAnchorB: b2Vec2): void;
        localAnchorA: b2Vec2;
        get_localAnchorA(): b2Vec2;
        set_localAnchorA(localAnchorA: b2Vec2): void;
        localAnchorB: b2Vec2;
        get_localAnchorB(): b2Vec2;
        set_localAnchorB(localAnchorB: b2Vec2): void;
        lengthA: number;
        get_lengthA(): number;
        set_lengthA(lengthA: number): void;
        lengthB: number;
        get_lengthB(): number;
        set_lengthB(lengthB: number): void;
        ratio: number;
        get_ratio(): number;
        set_ratio(ratio: number): void;
    }
    export class b2RayCastInput extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2RayCastInput;
        };
        protected readonly __class__: typeof b2RayCastInput;
        __destroy__(): void;
        p1: b2Vec2;
        get_p1(): b2Vec2;
        set_p1(p1: b2Vec2): void;
        p2: b2Vec2;
        get_p2(): b2Vec2;
        set_p2(p2: b2Vec2): void;
        maxFraction: number;
        get_maxFraction(): number;
        set_maxFraction(maxFraction: number): void;
    }
    export class b2RayCastOutput extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2RayCastOutput;
        };
        protected readonly __class__: typeof b2RayCastOutput;
        __destroy__(): void;
        normal: b2Vec2;
        get_normal(): b2Vec2;
        set_normal(normal: b2Vec2): void;
        fraction: number;
        get_fraction(): number;
        set_fraction(fraction: number): void;
    }
    export class b2RevoluteJoint extends b2Joint {
        protected static readonly __cache__: {
            [ptr: number]: b2RevoluteJoint;
        };
        protected readonly __class__: typeof b2RevoluteJoint;
        __destroy__(): void;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetReferenceAngle(): number;
        GetJointAngle(): number;
        GetJointSpeed(): number;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: boolean): void;
        GetLowerLimit(): number;
        GetUpperLimit(): number;
        SetLimits(lower: number, upper: number): void;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: number): void;
        GetMotorSpeed(): number;
        SetMaxMotorTorque(torque: number): void;
        GetMaxMotorTorque(): number;
        GetMotorTorque(inv_dt: number): number;
    }
    export class b2RevoluteJointDef extends b2JointDef {
        protected static readonly __cache__: {
            [ptr: number]: b2RevoluteJointDef;
        };
        protected readonly __class__: typeof b2RevoluteJointDef;
        __destroy__(): void;
        protected ptr: number;
        Initialize(bodyA: b2Body | number, bodyB: b2Body | number, anchor: b2Vec2 | number): void;
        localAnchorA: b2Vec2;
        get_localAnchorA(): b2Vec2;
        set_localAnchorA(localAnchorA: b2Vec2): void;
        localAnchorB: b2Vec2;
        get_localAnchorB(): b2Vec2;
        set_localAnchorB(localAnchorB: b2Vec2): void;
        referenceAngle: number;
        get_referenceAngle(): number;
        set_referenceAngle(referenceAngle: number): void;
        enableLimit: boolean;
        get_enableLimit(): boolean;
        set_enableLimit(enableLimit: boolean): void;
        lowerAngle: number;
        get_lowerAngle(): number;
        set_lowerAngle(lowerAngle: number): void;
        upperAngle: number;
        get_upperAngle(): number;
        set_upperAngle(upperAngle: number): void;
        enableMotor: boolean;
        get_enableMotor(): boolean;
        set_enableMotor(enableMotor: boolean): void;
        motorSpeed: number;
        get_motorSpeed(): number;
        set_motorSpeed(motorSpeed: number): void;
        maxMotorTorque: number;
        get_maxMotorTorque(): number;
        set_maxMotorTorque(maxMotorTorque: number): void;
    }
    export class b2Rot extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Rot;
        };
        protected readonly __class__: typeof b2Rot;
        __destroy__(): void;
        protected ptr: number;
        /**
         * @deprecated no-arg construction is forbidden (throws errors).
         * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
         * @throws {string}
         */
        constructor();
        constructor(angle: number);
        Set(angle: number): void;
        SetIdentity(): void;
        GetAngle(): number;
        GetXAxis(): b2Vec2;
        GetYAxis(): b2Vec2;
        s: number;
        get_s(): number;
        set_s(s: number): void;
        c: number;
        get_c(): number;
        set_c(c: number): void;
    }
    export class b2WheelJoint extends b2Joint {
        protected static readonly __cache__: {
            [ptr: number]: b2WheelJoint;
        };
        protected readonly __class__: typeof b2WheelJoint;
        __destroy__(): void;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetLocalAxisA(): b2Vec2;
        GetJointTranslation(): number;
        GetJointLinearSpeed(): number;
        GetJointAngle(): number;
        GetJointAngularSpeed(): number;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: boolean): void;
        GetLowerLimit(): number;
        GetUpperLimit(): number;
        SetLimits(lower: number, upper: number): void;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: number): void;
        GetMotorSpeed(): number;
        SetMaxMotorTorque(torque: number): void;
        GetMaxMotorTorque(): number;
        GetMotorTorque(inv_dt: number): number;
        SetStiffness(stiffness: number): void;
        GetStiffness(): number;
        SetDamping(damping: number): void;
        GetDamping(): number;
    }
    export class b2WheelJointDef extends b2JointDef {
        protected static readonly __cache__: {
            [ptr: number]: b2WheelJointDef;
        };
        protected readonly __class__: typeof b2WheelJointDef;
        __destroy__(): void;
        protected ptr: number;
        Initialize(bodyA: b2Body | number, bodyB: b2Body | number, anchor: b2Vec2 | number, axis: b2Vec2 | number): void;
        localAnchorA: b2Vec2;
        get_localAnchorA(): b2Vec2;
        set_localAnchorA(localAnchorA: b2Vec2): void;
        localAnchorB: b2Vec2;
        get_localAnchorB(): b2Vec2;
        set_localAnchorB(localAnchorB: b2Vec2): void;
        localAxisA: b2Vec2;
        get_localAxisA(): b2Vec2;
        set_localAxisA(localAxisA: b2Vec2): void;
        enableLimit: boolean;
        get_enableLimit(): boolean;
        set_enableLimit(enableLimit: boolean): void;
        lowerTranslation: number;
        get_lowerTranslation(): number;
        set_lowerTranslation(lowerTranslation: number): void;
        upperTranslation: number;
        get_upperTranslation(): number;
        set_upperTranslation(upperTranslation: number): void;
        enableMotor: boolean;
        get_enableMotor(): boolean;
        set_enableMotor(enableMotor: boolean): void;
        maxMotorTorque: number;
        get_maxMotorTorque(): number;
        set_maxMotorTorque(maxMotorTorque: number): void;
        motorSpeed: number;
        get_motorSpeed(): number;
        set_motorSpeed(motorSpeed: number): void;
        stiffness: number;
        get_stiffness(): number;
        set_stiffness(stiffness: number): void;
        damping: number;
        get_damping(): number;
        set_damping(damping: number): void;
    }
    export class b2MotorJoint extends b2Joint {
        protected static readonly __cache__: {
            [ptr: number]: b2MotorJoint;
        };
        protected readonly __class__: typeof b2MotorJoint;
        __destroy__(): void;
        SetLinearOffset(linearOffset: b2Vec2 | number): void;
        GetLinearOffset(): b2Vec2;
        SetAngularOffset(angularOffset: number): void;
        GetAngularOffset(): number;
        SetMaxForce(force: number): void;
        GetMaxForce(): number;
        SetMaxTorque(torque: number): void;
        GetMaxTorque(): number;
        SetCorrectionFactor(factor: number): void;
        GetCorrectionFactor(): number;
    }
    export class b2MotorJointDef extends b2JointDef {
        protected static readonly __cache__: {
            [ptr: number]: b2MotorJointDef;
        };
        protected readonly __class__: typeof b2MotorJointDef;
        __destroy__(): void;
        protected ptr: number;
        Initialize(bodyA: b2Body | number, bodyB: b2Body | number): void;
        linearOffset: b2Vec2;
        get_linearOffset(): b2Vec2;
        set_linearOffset(linearOffset: b2Vec2): void;
        angularOffset: number;
        get_angularOffset(): number;
        set_angularOffset(angularOffset: number): void;
        maxForce: number;
        get_maxForce(): number;
        set_maxForce(maxForce: number): void;
        maxTorque: number;
        get_maxTorque(): number;
        set_maxTorque(maxTorque: number): void;
        correctionFactor: number;
        get_correctionFactor(): number;
        set_correctionFactor(correctionFactor: number): void;
    }
    const b2_nullState: number;
    const b2_addState: number;
    const b2_persistState: number;
    const b2_removeState: number;
    const b2_pbdStretchingModel: number;
    const b2_xpbdStretchingModel: number;
    const b2_springAngleBendingModel: number;
    const b2_pbdAngleBendingModel: number;
    const b2_xpbdAngleBendingModel: number;
    const b2_pbdDistanceBendingModel: number;
    const b2_pbdHeightBendingModel: number;
    export class b2RopeTuning extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2RopeTuning;
        };
        protected readonly __class__: typeof b2RopeTuning;
        __destroy__(): void;
        protected ptr: number;
        stretchingModel: number;
        get_stretchingModel(): number;
        set_stretchingModel(stretchingModel: number): void;
        bendingModel: number;
        get_bendingModel(): number;
        set_bendingModel(bendingModel: number): void;
        damping: number;
        get_damping(): number;
        set_damping(damping: number): void;
        stretchStiffness: number;
        get_stretchStiffness(): number;
        set_stretchStiffness(stretchStiffness: number): void;
        stretchHertz: number;
        get_stretchHertz(): number;
        set_stretchHertz(stretchHertz: number): void;
        stretchDamping: number;
        get_stretchDamping(): number;
        set_stretchDamping(stretchDamping: number): void;
        bendStiffness: number;
        get_bendStiffness(): number;
        set_bendStiffness(bendStiffness: number): void;
        bendHertz: number;
        get_bendHertz(): number;
        set_bendHertz(bendHertz: number): void;
        bendDamping: number;
        get_bendDamping(): number;
        set_bendDamping(bendDamping: number): void;
        isometric: boolean;
        get_isometric(): boolean;
        set_isometric(isometric: boolean): void;
        fixedEffectiveMass: boolean;
        get_fixedEffectiveMass(): boolean;
        set_fixedEffectiveMass(fixedEffectiveMass: boolean): void;
        warmStart: boolean;
        get_warmStart(): boolean;
        set_warmStart(warmStart: boolean): void;
    }
    export class b2RopeDef extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2RopeDef;
        };
        protected readonly __class__: typeof b2RopeDef;
        __destroy__(): void;
        protected ptr: number;
        position: b2Vec2;
        get_position(): b2Vec2;
        set_position(position: b2Vec2): void;
        vertices: b2Vec2;
        get_vertices(): b2Vec2;
        set_vertices(vertices: b2Vec2): void;
        count: number;
        get_count(): number;
        set_count(count: number): void;
        gravity: b2Vec2;
        get_gravity(): b2Vec2;
        set_gravity(gravity: b2Vec2): void;
        tuning: b2RopeTuning;
        get_tuning(): b2RopeTuning;
        set_tuning(tuning: b2RopeTuning): void;
    }
    export class b2Rope extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2Rope;
        };
        protected readonly __class__: typeof b2Rope;
        __destroy__(): void;
        protected ptr: number;
        Create(def: b2RopeDef | number): void;
        SetTuning(tuning: b2RopeTuning | number): void;
        Step(timeStep: number, iterations: number, position: b2Vec2 | number): void;
        Reset(position: b2Vec2 | number): void;
        Draw(draw: b2Draw | number): void;
    }
    export class b2ClipVertex extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ClipVertex;
        };
        protected readonly __class__: typeof b2ClipVertex;
        __destroy__(): void;
        protected ptr: number;
        v: b2Vec2;
        get_v(): b2Vec2;
        set_v(v: b2Vec2): void;
        id: b2ContactID;
        get_id(): b2ContactID;
        set_id(id: b2ContactID): void;
    }
    const b2_waterParticle: number;
    const b2_zombieParticle: number;
    const b2_wallParticle: number;
    const b2_springParticle: number;
    const b2_elasticParticle: number;
    const b2_viscousParticle: number;
    const b2_powderParticle: number;
    const b2_tensileParticle: number;
    const b2_colorMixingParticle: number;
    const b2_destructionListenerParticle: number;
    const b2_barrierParticle: number;
    const b2_staticPressureParticle: number;
    const b2_reactiveParticle: number;
    const b2_repulsiveParticle: number;
    const b2_fixtureContactListenerParticle: number;
    const b2_particleContactListenerParticle: number;
    const b2_fixtureContactFilterParticle: number;
    const b2_particleContactFilterParticle: number;
    export class b2ParticleColor extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ParticleColor;
        };
        protected readonly __class__: typeof b2ParticleColor;
        __destroy__(): void;
        protected ptr: number;
        /**
         * @deprecated no-arg construction is forbidden (throws errors).
         * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
         * @throws {string}
         */
        constructor();
        constructor(r: number, g: number, b: number, a: number);
        /**
         * @deprecated no-arg construction is forbidden (throws errors).
         * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
         * @throws {string}
         */
        constructor();
        constructor(color: b2Color | number);
        IsZero(): boolean;
        GetColor(): b2Color;
        Set(r: number, g: number, b: number, a: number): void;
        Set(color: b2Color | number): void;
        op_ass(color: b2ParticleColor | number): b2ParticleColor;
        op_mul_ass(s: number): b2ParticleColor;
        op_add_ass(color: b2ParticleColor | number): b2ParticleColor;
        op_sub_ass(color: b2ParticleColor | number): b2ParticleColor;
        op_eq(color: b2ParticleColor | number): boolean;
        Mix(mixColor: b2ParticleColor | number, strength: number): void;
        MixColors(colorA: b2ParticleColor | number, colorB: b2ParticleColor | number, strength: number): void;
        r: number;
        get_r(): number;
        set_r(r: number): void;
        g: number;
        get_g(): number;
        set_g(g: number): void;
        b: number;
        get_b(): number;
        set_b(b: number): void;
        a: number;
        get_a(): number;
        set_a(a: number): void;
    }
    export class b2ParticleDef extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ParticleDef;
        };
        protected readonly __class__: typeof b2ParticleDef;
        __destroy__(): void;
        protected ptr: number;
        flags: number;
        get_flags(): number;
        set_flags(flags: number): void;
        position: b2Vec2;
        get_position(): b2Vec2;
        set_position(position: b2Vec2): void;
        velocity: b2Vec2;
        get_velocity(): b2Vec2;
        set_velocity(velocity: b2Vec2): void;
        color: b2ParticleColor;
        get_color(): b2ParticleColor;
        set_color(color: b2ParticleColor): void;
        lifetime: number;
        get_lifetime(): number;
        set_lifetime(lifetime: number): void;
        userData: VoidPtr;
        get_userData(): VoidPtr;
        set_userData(userData: VoidPtr): void;
        group: b2ParticleGroup;
        get_group(): b2ParticleGroup;
        set_group(group: b2ParticleGroup): void;
    }
    const b2_solidParticleGroup: number;
    const b2_rigidParticleGroup: number;
    const b2_particleGroupCanBeEmpty: number;
    const b2_particleGroupWillBeDestroyed: number;
    const b2_particleGroupNeedsUpdateDepth: number;
    const b2_particleGroupInternalMask: number;
    export class b2ParticleGroupDef extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ParticleGroupDef;
        };
        protected readonly __class__: typeof b2ParticleGroupDef;
        __destroy__(): void;
        protected ptr: number;
        flags: number;
        get_flags(): number;
        set_flags(flags: number): void;
        groupFlags: number;
        get_groupFlags(): number;
        set_groupFlags(groupFlags: number): void;
        position: b2Vec2;
        get_position(): b2Vec2;
        set_position(position: b2Vec2): void;
        angle: number;
        get_angle(): number;
        set_angle(angle: number): void;
        linearVelocity: b2Vec2;
        get_linearVelocity(): b2Vec2;
        set_linearVelocity(linearVelocity: b2Vec2): void;
        angularVelocity: number;
        get_angularVelocity(): number;
        set_angularVelocity(angularVelocity: number): void;
        color: b2ParticleColor;
        get_color(): b2ParticleColor;
        set_color(color: b2ParticleColor): void;
        strength: number;
        get_strength(): number;
        set_strength(strength: number): void;
        shape: b2Shape;
        get_shape(): b2Shape;
        set_shape(shape: b2Shape): void;
        shapeCount: number;
        get_shapeCount(): number;
        set_shapeCount(shapeCount: number): void;
        stride: number;
        get_stride(): number;
        set_stride(stride: number): void;
        particleCount: number;
        get_particleCount(): number;
        set_particleCount(particleCount: number): void;
        positionData: b2Vec2;
        get_positionData(): b2Vec2;
        set_positionData(positionData: b2Vec2): void;
        lifetime: number;
        get_lifetime(): number;
        set_lifetime(lifetime: number): void;
        userData: VoidPtr;
        get_userData(): VoidPtr;
        set_userData(userData: VoidPtr): void;
        group: b2ParticleGroup;
        get_group(): b2ParticleGroup;
        set_group(group: b2ParticleGroup): void;
    }
    export class b2ParticleGroup extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ParticleGroup;
        };
        protected readonly __class__: typeof b2ParticleGroup;
        GetNext(): b2ParticleGroup;
        GetParticleSystem(): b2ParticleSystem;
        GetParticleCount(): number;
        GetBufferIndex(): number;
        ContainsParticle(index: number): boolean;
        GetAllParticleFlags(): number;
        GetGroupFlags(): number;
        SetGroupFlags(flags: number): void;
        GetMass(): number;
        GetInertia(): number;
        GetCenter(): b2Vec2;
        GetLinearVelocity(): b2Vec2;
        GetAngularVelocity(): number;
        GetTransform(): b2Transform;
        GetPosition(): b2Vec2;
        GetAngle(): number;
        GetLinearVelocityFromWorldPoint(worldPoint: b2Vec2 | number): b2Vec2;
        GetUserData(): VoidPtr;
        SetUserData(data: VoidPtr | number): void;
        ApplyForce(force: b2Vec2 | number): void;
        ApplyLinearImpulse(impulse: b2Vec2 | number): void;
        DestroyParticles(callDestructionListener: boolean): void;
        DestroyParticles(): void;
    }
    export class b2ParticleContact extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ParticleContact;
        };
        protected readonly __class__: typeof b2ParticleContact;
        __destroy__(): void;
        protected ptr: number;
        SetIndices(a: number, b: number): void;
        SetWeight(w: number): void;
        SetNormal(n: b2Vec2 | number): void;
        SetFlags(f: number): void;
        GetIndexA(): number;
        GetIndexB(): number;
        GetWeight(): number;
        GetNormal(): b2Vec2;
        GetFlags(): number;
        op_eq(rhs: b2ParticleContact | number): boolean;
        op_neq(rhs: b2ParticleContact | number): boolean;
        ApproximatelyEqual(rhs: b2ParticleContact | number): boolean;
    }
    export class b2ParticleBodyContact extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ParticleBodyContact;
        };
        protected readonly __class__: typeof b2ParticleBodyContact;
        __destroy__(): void;
        protected ptr: number;
        index: number;
        get_index(): number;
        set_index(index: number): void;
        body: b2Body;
        get_body(): b2Body;
        set_body(body: b2Body): void;
        fixture: b2Fixture;
        get_fixture(): b2Fixture;
        set_fixture(fixture: b2Fixture): void;
        weight: number;
        get_weight(): number;
        set_weight(weight: number): void;
        normal: b2Vec2;
        get_normal(): b2Vec2;
        set_normal(normal: b2Vec2): void;
        mass: number;
        get_mass(): number;
        set_mass(mass: number): void;
    }
    export class b2ParticlePair extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ParticlePair;
        };
        protected readonly __class__: typeof b2ParticlePair;
        __destroy__(): void;
        protected ptr: number;
        indexA: number;
        get_indexA(): number;
        set_indexA(indexA: number): void;
        indexB: number;
        get_indexB(): number;
        set_indexB(indexB: number): void;
        flags: number;
        get_flags(): number;
        set_flags(flags: number): void;
        strength: number;
        get_strength(): number;
        set_strength(strength: number): void;
        distance: number;
        get_distance(): number;
        set_distance(distance: number): void;
    }
    export class b2ParticleTriad extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ParticleTriad;
        };
        protected readonly __class__: typeof b2ParticleTriad;
        __destroy__(): void;
        protected ptr: number;
        indexA: number;
        get_indexA(): number;
        set_indexA(indexA: number): void;
        indexB: number;
        get_indexB(): number;
        set_indexB(indexB: number): void;
        indexC: number;
        get_indexC(): number;
        set_indexC(indexC: number): void;
        flags: number;
        get_flags(): number;
        set_flags(flags: number): void;
        strength: number;
        get_strength(): number;
        set_strength(strength: number): void;
        pa: b2Vec2;
        get_pa(): b2Vec2;
        set_pa(pa: b2Vec2): void;
        pb: b2Vec2;
        get_pb(): b2Vec2;
        set_pb(pb: b2Vec2): void;
        pc: b2Vec2;
        get_pc(): b2Vec2;
        set_pc(pc: b2Vec2): void;
        ka: number;
        get_ka(): number;
        set_ka(ka: number): void;
        kb: number;
        get_kb(): number;
        set_kb(kb: number): void;
        kc: number;
        get_kc(): number;
        set_kc(kc: number): void;
        s: number;
        get_s(): number;
        set_s(s: number): void;
    }
    export class b2ParticleSystemDef extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ParticleSystemDef;
        };
        protected readonly __class__: typeof b2ParticleSystemDef;
        __destroy__(): void;
        protected ptr: number;
        strictContactCheck: boolean;
        get_strictContactCheck(): boolean;
        set_strictContactCheck(strictContactCheck: boolean): void;
        density: number;
        get_density(): number;
        set_density(density: number): void;
        gravityScale: number;
        get_gravityScale(): number;
        set_gravityScale(gravityScale: number): void;
        radius: number;
        get_radius(): number;
        set_radius(radius: number): void;
        maxCount: number;
        get_maxCount(): number;
        set_maxCount(maxCount: number): void;
        pressureStrength: number;
        get_pressureStrength(): number;
        set_pressureStrength(pressureStrength: number): void;
        dampingStrength: number;
        get_dampingStrength(): number;
        set_dampingStrength(dampingStrength: number): void;
        elasticStrength: number;
        get_elasticStrength(): number;
        set_elasticStrength(elasticStrength: number): void;
        springStrength: number;
        get_springStrength(): number;
        set_springStrength(springStrength: number): void;
        viscousStrength: number;
        get_viscousStrength(): number;
        set_viscousStrength(viscousStrength: number): void;
        surfaceTensionPressureStrength: number;
        get_surfaceTensionPressureStrength(): number;
        set_surfaceTensionPressureStrength(surfaceTensionPressureStrength: number): void;
        surfaceTensionNormalStrength: number;
        get_surfaceTensionNormalStrength(): number;
        set_surfaceTensionNormalStrength(surfaceTensionNormalStrength: number): void;
        repulsiveStrength: number;
        get_repulsiveStrength(): number;
        set_repulsiveStrength(repulsiveStrength: number): void;
        powderStrength: number;
        get_powderStrength(): number;
        set_powderStrength(powderStrength: number): void;
        ejectionStrength: number;
        get_ejectionStrength(): number;
        set_ejectionStrength(ejectionStrength: number): void;
        staticPressureStrength: number;
        get_staticPressureStrength(): number;
        set_staticPressureStrength(staticPressureStrength: number): void;
        staticPressureRelaxation: number;
        get_staticPressureRelaxation(): number;
        set_staticPressureRelaxation(staticPressureRelaxation: number): void;
        staticPressureIterations: number;
        get_staticPressureIterations(): number;
        set_staticPressureIterations(staticPressureIterations: number): void;
        colorMixingStrength: number;
        get_colorMixingStrength(): number;
        set_colorMixingStrength(colorMixingStrength: number): void;
        destroyByAge: boolean;
        get_destroyByAge(): boolean;
        set_destroyByAge(destroyByAge: boolean): void;
        lifetimeGranularity: number;
        get_lifetimeGranularity(): number;
        set_lifetimeGranularity(lifetimeGranularity: number): void;
    }
    export class b2ParticleSystem extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ParticleSystem;
        };
        protected readonly __class__: typeof b2ParticleSystem;
        CreateParticle(def: b2ParticleDef | number): number;
        GetParticleHandleFromIndex(index: number): b2ParticleHandle;
        DestroyParticle(index: number): void;
        DestroyParticle(index: number, callDestructionListener: boolean): void;
        DestroyOldestParticle(index: number, callDestructionListener: boolean): void;
        DestroyParticlesInShape(shape: b2Shape | number, xf: b2Transform | number): number;
        DestroyParticlesInShape(shape: b2Shape | number, xf: b2Transform | number, callDestructionListener: boolean): number;
        CreateParticleGroup(def: b2ParticleGroupDef | number): b2ParticleGroup;
        JoinParticleGroups(groupA: b2ParticleGroup | number, groupB: b2ParticleGroup | number): void;
        SplitParticleGroup(group: b2ParticleGroup | number): void;
        GetParticleGroupList(): b2ParticleGroup;
        GetParticleGroupCount(): number;
        GetParticleCount(): number;
        GetMaxParticleCount(): number;
        SetMaxParticleCount(count: number): void;
        GetAllParticleFlags(): number;
        GetAllGroupFlags(): number;
        SetPaused(paused: boolean): void;
        GetPaused(): boolean;
        SetDensity(density: number): void;
        GetDensity(): number;
        SetGravityScale(gravityScale: number): void;
        GetGravityScale(): number;
        SetDamping(damping: number): void;
        GetDamping(): number;
        SetStaticPressureIterations(iterations: number): void;
        GetStaticPressureIterations(): number;
        SetRadius(radius: number): void;
        GetRadius(): number;
        GetPositionBuffer(): b2Vec2;
        GetVelocityBuffer(): b2Vec2;
        GetColorBuffer(): b2ParticleColor;
        SetParticleFlags(index: number, flags: number): void;
        GetParticleFlags(index: number): number;
        SetPositionBuffer(buffer: b2Vec2 | number, capacity: number): void;
        SetVelocityBuffer(buffer: b2Vec2 | number, capacity: number): void;
        SetColorBuffer(buffer: b2ParticleColor | number, capacity: number): void;
        GetContacts(): b2ParticleContact;
        GetContactCount(): number;
        GetBodyContacts(): b2ParticleBodyContact;
        GetBodyContactCount(): number;
        GetPairs(): b2ParticlePair;
        GetPairCount(): number;
        GetTriads(): b2ParticleTriad;
        GetTriadCount(): number;
        SetStuckThreshold(iterations: number): void;
        GetStuckCandidateCount(): number;
        ComputeCollisionEnergy(): number;
        SetStrictContactCheck(enabled: boolean): void;
        GetStrictContactCheck(): boolean;
        SetParticleLifetime(index: number, lifetime: number): void;
        GetParticleLifetime(index: number): number;
        SetDestructionByAge(enable: boolean): void;
        GetDestructionByAge(): boolean;
        ExpirationTimeToLifetime(expirationTime: number): number;
        ParticleApplyLinearImpulse(index: number, impulse: b2Vec2 | number): void;
        ApplyLinearImpulse(firstIndex: number, lastIndex: number, impulse: b2Vec2 | number): void;
        ParticleApplyForce(index: number, force: b2Vec2 | number): void;
        ApplyForce(firstIndex: number, lastIndex: number, force: b2Vec2 | number): void;
        GetNext(): b2ParticleSystem;
        QueryAABB(callback: b2QueryCallback | number, aabb: b2AABB | number): void;
        QueryShapeAABB(callback: b2QueryCallback | number, shape: b2Shape | number, xf: b2Transform | number): void;
        RayCast(callback: b2RayCastCallback | number, point1: b2Vec2 | number, point2: b2Vec2 | number): void;
        ComputeAABB(aabb: b2AABB | number): void;
    }
    export class b2ParticleHandle extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2ParticleHandle;
        };
        protected readonly __class__: typeof b2ParticleHandle;
        __destroy__(): void;
        protected ptr: number;
        GetIndex(): number;
        InsertAfter(obj: b2ParticleHandle | number): void;
        InsertBefore(obj: b2ParticleHandle | number): void;
        GetNext(): b2ParticleHandle;
        GetPrevious(): b2ParticleHandle;
        GetTerminator(): b2ParticleHandle;
        Remove(): b2ParticleHandle;
        InList(): boolean;
        IsEmpty(): boolean;
        GetLength(): number;
    }
    export class b2StackAllocator extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2StackAllocator;
        };
        protected readonly __class__: typeof b2StackAllocator;
        __destroy__(): void;
        protected ptr: number;
        Allocate(size: number): VoidPtr;
        Reallocate(p: VoidPtr | number, size: number): VoidPtr;
        Free(p: VoidPtr | number): void;
    }
    export class b2VoronoiDiagram extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: b2VoronoiDiagram;
        };
        protected readonly __class__: typeof b2VoronoiDiagram;
        __destroy__(): void;
        protected ptr: number;
        /**
         * @deprecated no-arg construction is forbidden (throws errors).
         * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
         * @throws {string}
         */
        constructor();
        constructor(allocator: b2StackAllocator | number, generatorCapacity: number);
        AddGenerator(center: b2Vec2 | number, tag: number, necessary: boolean): void;
        Generate(radius: number, margin: number): void;
        GetNodes(callback: NodeCallback | number): void;
    }
    export class NodeCallback extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: NodeCallback;
        };
        protected readonly __class__: typeof NodeCallback;
        __destroy__(): void;
    }
    export class WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: WrapperObject;
        };
        protected readonly __class__: typeof WrapperObject;
        protected ptr?: number;
    }
    export class VoidPtr extends WrapperObject {
        protected static readonly __cache__: {
            [ptr: number]: VoidPtr;
        };
        protected readonly __class__: typeof VoidPtr;
        protected ptr?: number;
    }
    export const wrapPointer: <TargetClass extends typeof WrapperObject & {
        new (...args: any[]): InstanceType<TargetClass>;
    } = typeof WrapperObject>(pointer: number, targetType?: TargetClass) => InstanceType<TargetClass>;
    export const getPointer: (instance: WrapperObject) => number;
    export const castObject: <TargetClass extends typeof WrapperObject & {
        new (...args: any[]): InstanceType<TargetClass>;
    } = typeof WrapperObject>(instance: WrapperObject, targetType?: TargetClass) => InstanceType<TargetClass>;
    export const compare: (instance: WrapperObject, instance2: WrapperObject) => boolean;
    export const getCache: <Class extends typeof WrapperObject = typeof WrapperObject>(type?: Class) => {
        [ptr: number]: InstanceType<Class>;
    };
    export const destroy: (instance: {
        __destroy__(): void;
    }) => void;
    export const getClass: <Class extends typeof WrapperObject>(instance: InstanceType<Class>) => Class;
    export const NULL: WrapperObject;
}
