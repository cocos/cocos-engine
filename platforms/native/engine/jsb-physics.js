
'use strict';

const jsbPhy = globalThis['jsb.physics'];
const books = [];

class PhysicsWorld {
    get impl () { return this._impl }
    constructor() { this._impl = new jsbPhy.World() }

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

    step (f, t, m) { this._impl.step(f) }
    raycast (worldRay, options, pool, results) { return false }
    raycastClosest (worldRay, options, out) { return false }
    emitEvents () { }
    syncSceneToPhysics () { this._impl.syncSceneToPhysics() }
    syncAfterEvents () {
        books.forEach((v) => { v.syncNativeTransform(); });
        // this._impl.syncSceneToPhysics() 
    }
    destroy () { this._impl.destroy() }
}

function bookNode (v) {
    const idx = books.indexOf(v);
    if (idx < 0) { books.push(v); }
}

function unBookNode (v) {
    const idx = books.indexOf(v);
    if (idx >= 0) { books.splice(idx, 1); }
}

class RigidBody {
    get impl () { return this._impl }
    get rigidBody () { return this._com }
    get isAwake () { return true }
    get isSleepy () { return false }
    get isSleeping () { return false }
    constructor() { this._impl = new jsbPhy.RigidBody() }

    initialize (v) {
        v.node.updateWorldTransform();
        this._com = v;
        this._impl.initialize(v.node.handle);
        bookNode(v.node);
    }

    onEnable () {
        this._impl.setType(this._com.type);
        this._impl.onEnable();
    }
    onDisable () { this._impl.onDisable(); }
    onDestroy () {
        unBookNode(this._com.node);
        this._impl.onDestroy();
    }

    setType (v) { this._impl.setType(v); }
    setMass (v) { this._impl.setMass(v); }
    setAllowSleep (v) { this._impl.setAllowSleep(v); }
    setLinearDamping (v) { this._impl.setLinearDamping(v); }
    setAngularDamping (v) { this._impl.setAngularDamping(v); }
    useGravity (v) { this._impl.useGravity(v); }
    setLinearFactor (v) { this.setLinearFactor(v.x, v.y, v.z); }
    setAngularFactor (v) { this.setAngularFactor(v.x, v.y, v.z); }
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
    applyForce (f, p) { this._impl.applyForce(f.x, f.y, f.z, p.x, p.y, p.z); }
    applyLocalForce (f, p) { this._impl.applyLocalForce(f.x, f.y, f.z, p.x, p.y, p.z); }
    applyImpulse (f, p) { this._impl.applyImpulse(f.x, f.y, f.z, p.x, p.y, p.z); }
    applyLocalImpulse (f, p) { this._impl.applyLocalImpulse(f.x, f.y, f.z, p.x, p.y, p.z); }
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
    constructor() { };
    initialize (v) {
        v.node.updateWorldTransform();
        this._com = v;
        this._impl.initialize(v.node.handle);
        bookNode(v.node);
    }
    onLoad () { }
    onEnable () { this._impl.onEnable(); }
    onDisable () { this._impl.onDisable(); }
    onDestroy () { unBookNode(this._com.node); this._impl.onDestroy(); }
    setMaterial (v) { }
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
}

class SphereShape extends Shape {
    constructor() { super(); this._impl = new jsbPhy.SphereShape(); }
    setRadius (v) { this._impl.setRadius(v); }
}

class BoxShape extends Shape {
    constructor() { super(); this._impl = new jsbPhy.BoxShape(); }
    setSize (v) { this._impl.setSize(v.x, v.y, v.z); }
}

class CapsuleShape extends Shape {
    constructor() { super(); this._impl = new jsbPhy.CapsuleShape(); }
    setRadius (v) { this._impl.setRadius(v); }
    setDirection (v) { this._impl.setDirection(v); }
    setCylinderHeight (v) { this._impl.setCylinderHeight(v); }
}

class PlaneShape extends Shape {
    constructor() { super(); this._impl = new jsbPhy.PlaneShape(); }
    setConstant (v) { this._impl.setConstant(v); }
    setNormal (v) { this._impl.setNormal(v.x, v.y, v.z); }
}

cc.physics.selector.select("physx", {
    PhysicsWorld: PhysicsWorld,
    RigidBody: RigidBody,
    SphereShape: SphereShape,
    BoxShape: BoxShape,
    // CapsuleShape: PhysXCapsuleShape,
    // TrimeshShape: PhysXTrimeshShape,
    // CylinderShape: PhysXCylinderShape,
    // ConeShape: PhysXConeShape,
    // TerrainShape: PhysXTerrainShape,
    // PlaneShape: PhysXPlaneShape,
    // PointToPointConstraint: PhysXDistanceJoint,
    // HingeConstraint: PhysXRevoluteJoint
});
