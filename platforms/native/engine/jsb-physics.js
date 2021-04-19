
'use strict';

const jsbPhy = globalThis['jsb.physics'];
const books = [];
const ptrToObj = {};
const TriggerEventObject = {
    type: 'onTriggerEnter',
    selfCollider: null,
    otherCollider: null,
    impl: null,
};
const CollisionEventObject = {
    type: 'onCollisionEnter',
    selfCollider: null,
    otherCollider: null,
    contacts: [],
    impl: null,
};

function emitTriggerEvent (t, c0, c1, impl) {
    TriggerEventObject.type = t;
    TriggerEventObject.impl = impl;
    if (c0.needTriggerEvent) {
        TriggerEventObject.selfCollider = c0;
        TriggerEventObject.otherCollider = c1;
        c0.emit(t, TriggerEventObject);
    }
    if (c1.needTriggerEvent) {
        TriggerEventObject.selfCollider = c1;
        TriggerEventObject.otherCollider = c0;
        c1.emit(t, TriggerEventObject);
    }
}

const quat = new cc.Quat();
const contactsPool = [];
const contactBufferElementLength = 12;
class ContactPoint {
    constructor(e) {
        this.event = e;
        this.impl = null;
        this.colliderA = null;
        this.colliderB = null;
        this.index = 0;
    }
    get isBodyA () { return this.colliderA.uuid === this.event.selfCollider.uuid; }
    getLocalPointOnA (o) {
        this.getWorldPointOnB(o);
        cc.Vec3.subtract(o, o, this.colliderA.node.worldPosition);
    }
    getLocalPointOnB (o) {
        this.getWorldPointOnB(o);
        cc.Vec3.subtract(o, o, this.colliderB.node.worldPosition);
    }
    getWorldPointOnA (o) {
        this.getWorldPointOnB(o);
    }
    getWorldPointOnB (o) {
        const i = this.index * contactBufferElementLength;
        o.x = this.impl[i]; o.y = this.impl[i + 1]; o.z = this.impl[i + 2];
    }
    getLocalNormalOnA (o) {
        this.getWorldNormalOnA(o);
        cc.Quat.conjugate(quat, this.colliderA.node.worldRotation);
        cc.Vec3.transformQuat(o, o, quat);
    }
    getLocalNormalOnB (o) {
        this.getWorldNormalOnB(o);
        cc.Quat.conjugate(quat, this.colliderB.node.worldRotation);
        cc.Vec3.transformQuat(out, out, quat);
    }
    getWorldNormalOnA (o) {
        this.getWorldNormalOnB(o);
        if (!this.isBodyA) cc.Vec3.negate(o, o);
    }
    getWorldNormalOnB (o) {
        const i = this.index * contactBufferElementLength + 3;
        o.x = this.impl[i]; o.y = this.impl[i + 1]; o.z = this.impl[i + 2];
    }
}

function emitCollisionEvent (t, c0, c1, impl, b) {
    CollisionEventObject.type = t;
    CollisionEventObject.impl = impl;
    const contacts = CollisionEventObject.contacts;
    contactsPool.push.apply(contactsPool, contacts);
    contacts.length = 0;
    const contactCount = b.length / contactBufferElementLength;
    for (let i = 0; i < contactCount; i++) {
        let c = contactsPool.length > 0 ? contactsPool.pop() : new ContactPoint(CollisionEventObject);
        c.colliderA = c0; c.colliderB = c1;
        c.impl = b; c.index = i; contacts.push(c);
    }
    if (c0.needCollisionEvent) {
        CollisionEventObject.selfCollider = c0;
        CollisionEventObject.otherCollider = c1;
        c0.emit(t, CollisionEventObject);
    }
    if (c1.needCollisionEvent) {
        CollisionEventObject.selfCollider = c1;
        CollisionEventObject.otherCollider = c0;
        c1.emit(t, CollisionEventObject);
    }
}

class PhysicsWorld {
    get impl () { return this._impl }
    constructor() { this._impl = new jsbPhy.World(); }

    setGravity (v) {
        this._impl.setGravity(v)
    }

    setAllowSleep (v) {
        this._impl.setAllowSleep(v);
    }

    setDefaultMaterial (v) {
        this._impl.setDefaultMaterial(
            v.friction,
            v.rollingFriction,
            v.restitution,
        );
    }

    step (f, t, m) {
        books.forEach((v) => { v.syncToNativeTransform(); });
        this._impl.step(f);
    }
    raycast (worldRay, options, pool, results) { return false }
    raycastClosest (worldRay, options, out) { return false }
    emitEvents () {
        this.emitTriggerEvent();
        this.emitCollisionEvent();
        this._impl.emitEvents();
    }
    syncSceneToPhysics () { this._impl.syncSceneToPhysics() }
    syncAfterEvents () {
        books.forEach((v) => { v.syncFromNativeTransform(); });
        // this._impl.syncSceneToPhysics() 
    }
    destroy () { this._impl.destroy() }
    emitTriggerEvent () {
        const teps = this._impl.getTriggerEventPairs();
        const len = teps.length / 3;
        for (let i = 0; i < len; i++) {
            const t = i * 3;
            const sa = ptrToObj[teps[t + 0]], sb = ptrToObj[teps[t + 1]];
            if (!sa || !sb) continue;
            const c0 = sa.collider, c1 = sb.collider;
            if (!(c0 && c0.isValid && c1 && c1.isValid)) continue;
            if (!c0.needTriggerEvent && !c1.needTriggerEvent) continue;
            const state = teps[t + 2];
            if (state === 1) {
                emitTriggerEvent('onTriggerStay', c0, c1, teps);
            } else if (state === 0) {
                emitTriggerEvent('onTriggerEnter', c0, c1, teps);
            } else {
                emitTriggerEvent('onTriggerExit', c0, c1, teps);
            }
        }

    }
    emitCollisionEvent () {
        const ceps = this._impl.getContactEventPairs();
        const len2 = ceps.length / 4;
        for (let i = 0; i < len2; i++) {
            const t = i * 4;
            const sa = ptrToObj[ceps[t + 0]], sb = ptrToObj[ceps[t + 1]];
            if (!sa || !sb) continue;
            const c0 = sa.collider, c1 = sb.collider;
            if (!(c0 && c0.isValid && c1 && c1.isValid)) continue;
            if (!c0.needCollisionEvent && !c1.needCollisionEvent) continue;
            const state = ceps[t + 2];
            if (state === 1) {
                emitCollisionEvent('onCollisionStay', c0, c1, ceps, ceps[t + 3]);
            } else if (state === 0) {
                emitCollisionEvent('onCollisionEnter', c0, c1, ceps, ceps[t + 3]);
            } else {
                emitCollisionEvent('onCollisionExit', c0, c1, ceps, ceps[t + 3]);
            }
        }

    }
}

function bookNode (v) {
    const idx = books.indexOf(v);
    if (idx < 0) { books.push(v); }
}

function unBookNode (v) {
    const idx = books.indexOf(v);
    if (idx >= 0) { books.splice(idx, 1); }
}

function updateCollisionMatrix () {
    const phy = cc.PhysicsSystem.instance;
    const world = phy.physicsWorld.impl;
    const cm = phy.collisionMatrix;
    if (cm.updateArray && cm.updateArray.length > 0) {
        cm.updateArray.forEach((e) => {
            const key = `${1 << e}`;
            const mask = cm[key];
            world.setCollisionMatrix(e, mask);
        });
        cm.updateArray.length = 0;
    }
}

class RigidBody {
    get impl () { return this._impl }
    get rigidBody () { return this._com }
    get isAwake () { return this._impl.isAwake(); }
    get isSleepy () { return false }
    get isSleeping () { return this._impl.isSleeping(); }
    constructor() {
        updateCollisionMatrix();
        this._impl = new jsbPhy.RigidBody()
    }

    initialize (v) {
        v.node.updateWorldTransform();
        this._com = v;
        this._impl.initialize(v.node.handle, v.type, v._group);
        bookNode(v.node);
    }

    onEnable () {
        this.setType(this._com.type);
        this.setMass(this._com.mass);
        this.setAllowSleep(this._com.allowSleep);
        this.setLinearDamping(this._com.linearDamping);
        this.setAngularDamping(this._com.angularDamping);
        this.setLinearFactor(this._com.linearFactor);
        this.setAngularFactor(this._com.angularFactor);
        this.useGravity(this._com.useGravity);
        this._impl.onEnable();
    }
    onDisable () { this._impl.onDisable(); }
    onDestroy () {
        unBookNode(this._com.node);
        this._impl.onDestroy();
    }

    setGroup (v) { this._impl.setGroup(v); }
    getGroup () { return this._impl.getGroup(); }
    addGroup (v) { this.setGroup(this.getGroup() | v); }
    removeGroup (v) { this.setGroup(this.getGroup() & ~v); }
    setMask (v) { this._impl.setMask(v); }
    getMask () { return this._impl.getMask(); }
    addMask (v) { this.setMask(this.getMask() | v); }
    removeMask (v) { this.setMask(this.getMask() & ~v); }

    setType (v) { this._impl.setType(v); }
    setMass (v) { this._impl.setMass(v); }
    setAllowSleep (v) { this._impl.setAllowSleep(v); }
    setLinearDamping (v) { this._impl.setLinearDamping(v); }
    setAngularDamping (v) { this._impl.setAngularDamping(v); }
    useGravity (v) { this._impl.useGravity(v); }
    setLinearFactor (v) { this._impl.setLinearFactor(v.x, v.y, v.z); }
    setAngularFactor (v) { this._impl.setAngularFactor(v.x, v.y, v.z); }
    wakeUp () { this._impl.wakeUp(); }
    sleep () { this._impl.sleep(); }
    clearState () { this._impl.clearState(); }
    clearForces () { this._impl.clearForces(); }
    clearVelocity () { this._impl.clearVelocity(); }
    setSleepThreshold (v) { this._impl.setSleepThreshold(v); }
    getSleepThreshold () { return this._impl.getSleepThreshold(); }
    getLinearVelocity (o) { o.set(this._impl.getLinearVelocity()); }
    setLinearVelocity (v) { this._impl.setLinearVelocity(v.x, v.y, v.z); }
    getAngularVelocity (o) { o.set(this._impl.getAngularVelocity()); }
    setAngularVelocity (v) { this._impl.setAngularVelocity(v.x, v.y, v.z); }
    applyForce (f, p) { if (p == null) { p = cc.Vec3.ZERO; } this._impl.applyForce(f.x, f.y, f.z, p.x, p.y, p.z); }
    applyLocalForce (f, p) { if (p == null) { p = cc.Vec3.ZERO; } this._impl.applyLocalForce(f.x, f.y, f.z, p.x, p.y, p.z); }
    applyImpulse (f, p) { if (p == null) { p = cc.Vec3.ZERO; } this._impl.applyImpulse(f.x, f.y, f.z, p.x, p.y, p.z); }
    applyLocalImpulse (f, p) { if (p == null) { p = cc.Vec3.ZERO; } this._impl.applyLocalImpulse(f.x, f.y, f.z, p.x, p.y, p.z); }
    applyTorque (t) { this._impl.applyTorque(t.x, t.y, t.z); }
    applyLocalTorque (t) { this._impl.applyLocalTorque(t.x, t.y, t.z); }
}

const ESHAPE_FLAG = {
    NONE: 0,
    IS_TRIGGER: 1 << 0,
    NEED_EVENT: 1 << 1,
    NEED_CONTACT_DATA: 1 << 2,
    DETECT_CONTACT_CCD: 1 << 3,
}

class Shape {
    get impl () { return this._impl; }
    get collider () { return this._com; }
    get attachedRigidBody () { return this._attachedRigidBody; }
    constructor() { updateCollisionMatrix(); };
    initialize (v) {
        v.node.updateWorldTransform();
        this._com = v;
        this._impl.initialize(v.node.handle);
        ptrToObj[this._impl.getImpl()] = this;
        bookNode(v.node);
    }
    onLoad () {
        this.setMaterial(this._com.sharedMaterial);
        this.setCenter(this._com.center);
        this.setAsTrigger(this._com.isTrigger);
    }
    onEnable () { this._impl.onEnable(); }
    onDisable () { this._impl.onDisable(); }
    onDestroy () {
        unBookNode(this._com.node);
        ptrToObj[this._impl.getImpl()] = null
        delete ptrToObj[this._impl.getImpl()];
        this._impl.onDestroy();
    }
    setMaterial (v) {
        if (!v) v = cc.PhysicsSystem.instance.defaultMaterial;
        this._impl.setMaterial(v.ID, v.friction, v.friction, v.restitution, 2, 2);
    }
    setAsTrigger (v) { this._impl.setAsTrigger(v); }
    setCenter (v) { this._impl.setCenter(v.x, v.y, v.z); }
    getAABB (v) { }
    getBoundingSphere (v) { }
    updateEventListener () {
        var flag = 0;
        flag |= ESHAPE_FLAG.DETECT_CONTACT_CCD;
        if (this._com.isTrigger) flag |= ESHAPE_FLAG.IS_TRIGGER;
        if (this._com.needTriggerEvent || this._com.needCollisionEvent) flag |= ESHAPE_FLAG.NEED_EVENT;
        this._impl.updateEventListener(flag);
    }
    setGroup (v) { this._impl.setGroup(v); }
    getGroup () { return this._impl.getGroup(); }
    addGroup (v) { this.setGroup(this.getGroup() | v); }
    removeGroup (v) { this.setGroup(this.getGroup() & ~v); }
    setMask (v) { this._impl.setMask(v); }
    getMask () { return this._impl.getMask(); }
    addMask (v) { this.setMask(this.getMask() | v); }
    removeMask (v) { this.setMask(this.getMask() & ~v); }
}

class SphereShape extends Shape {
    constructor() { super(); this._impl = new jsbPhy.SphereShape(); }
    setRadius (v) { this._impl.setRadius(v); }
    onLoad () {
        super.onLoad();
        this.setRadius(this._com.radius);
    }
}

class BoxShape extends Shape {
    constructor() { super(); this._impl = new jsbPhy.BoxShape(); }
    setSize (v) { this._impl.setSize(v.x, v.y, v.z); }
    onLoad () {
        super.onLoad();
        this.setSize(this._com.size);
    }
}

class CapsuleShape extends Shape {
    constructor() { super(); this._impl = new jsbPhy.CapsuleShape(); }
    setRadius (v) { this._impl.setRadius(v); }
    setDirection (v) { this._impl.setDirection(v); }
    setCylinderHeight (v) { this._impl.setCylinderHeight(v); }
    onLoad () {
        super.onLoad();
        this.setRadius(this._com.radius);
        this.setDirection(this._com.direction);
        this.setCylinderHeight(this._com.cylinderHeight);
    }
}

class PlaneShape extends Shape {
    constructor() { super(); this._impl = new jsbPhy.PlaneShape(); }
    setConstant (v) { this._impl.setConstant(v); }
    setNormal (v) { this._impl.setNormal(v.x, v.y, v.z); }
    onLoad () {
        super.onLoad();
        this.setNormal(this._com.normal);
        this.setConstant(this._com.constant);
    }
}

class CylinderShape extends Shape {
    constructor() { super(); this._impl = new jsbPhy.CylinderShape(); }
    setRadius (v) { this._impl.setRadius(v); }
    setDirection (v) { this._impl.setDirection(v); }
    setHeight (v) { this._impl.setHeight(v); }
    onLoad () {
        super.onLoad();
        this.setRadius(this._com.radius);
        this.setDirection(this._com.direction);
        this.setHeight(this._com.height);
    }
}

class ConeShape extends Shape {
    constructor() { super(); this._impl = new jsbPhy.ConeShape(); }
    setRadius (v) { this._impl.setRadius(v); }
    setDirection (v) { this._impl.setDirection(v); }
    setHeight (v) { this._impl.setHeight(v); }
    onLoad () {
        super.onLoad();
        this.setRadius(this._com.radius);
        this.setDirection(this._com.direction);
        this.setHeight(this._com.height);
    }
}

jsbPhy['CACHE'] = {
    trimesh: {},
    convex: {},
    heightField: {},
};
class TrimeshShape extends Shape {
    constructor() { super(); this._impl = new jsbPhy.TrimeshShape(); }
    setConvex (v) { this._impl.useConvex(v); }
    setMesh (v) {
        if (!v) return;
        const isConvex = this._com.convex;
        this._impl.useConvex(isConvex);
        let handle = 0;
        if (isConvex) {
            if (!jsbPhy.CACHE.convex[v._uuid]) {
                const posArr = cc.physics.utils.shrinkPositions(v.readAttribute(0, 'a_position'));
                const world = cc.PhysicsSystem.instance.physicsWorld.impl;
                const convex = { positions: new Float32Array(posArr), positionLength: posArr.length / 3 }
                jsbPhy.CACHE.convex[v._uuid] = world.createConvex(convex);
            }
            handle = jsbPhy.CACHE.convex[v._uuid];
        } else {
            if (!jsbPhy.CACHE.trimesh[v._uuid]) {
                const indArr = v.readIndices(0);
                const posArr = cc.physics.utils.shrinkPositions(v.readAttribute(0, 'a_position'));
                const world = cc.PhysicsSystem.instance.physicsWorld.impl;
                const trimesh = {
                    positions: new Float32Array(posArr), positionLength: posArr.length / 3,
                    triangles: new Uint16Array(indArr), triangleLength: indArr.length / 3,
                    isU16: true,
                }
                jsbPhy.CACHE.trimesh[v._uuid] = world.createTrimesh(trimesh);
            }
            handle = jsbPhy.CACHE.trimesh[v._uuid];
        }
        this._impl.setMesh(handle);
    }
    initialize (v) {
        this._com = v;
        this.setConvex(v.convex);
        this.setMesh(v.mesh);
        super.initialize(v);
    }
}

cc.physics.selector.select("physx", {
    PhysicsWorld: PhysicsWorld,
    RigidBody: RigidBody,
    SphereShape: SphereShape,
    BoxShape: BoxShape,
    PlaneShape: PlaneShape,
    CapsuleShape: CapsuleShape,
    // ConeShape: PhysXConeShape,
    // CylinderShape: PhysXCylinderShape,
    TrimeshShape: TrimeshShape,
    // TerrainShape: PhysXTerrainShape,
    // PointToPointConstraint: PhysXDistanceJoint,
    // HingeConstraint: PhysXRevoluteJoint
});
