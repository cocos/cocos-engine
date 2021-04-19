
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

function emitTriggerEvent (t, c0, c1) {
    TriggerEventObject.type = t;
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
        const teps = this._impl.getTriggerEventPairs();
        const len = teps.length / 3;
        for (let i = 0; i < len; i++) {
            const t = i * 3;
            const sa = ptrToObj[teps[t + 0]], sb = ptrToObj[teps[t + 1]];
            if (!sa || !sb) continue;
            const c0 = sa.collider, c1 = sb.collider;
            if (!c0.needTriggerEvent && !c1.needTriggerEvent) continue;
            const state = teps[t + 2];
            if (state === 1) {
                emitTriggerEvent('onTriggerStay', c0, c1);
            } else if (state === 0) {
                emitTriggerEvent('onTriggerEnter', c0, c1);
            } else {
                emitTriggerEvent('onTriggerExit', c0, c1);
            }
        }

        this._impl.emitEvents();
    }
    syncSceneToPhysics () { this._impl.syncSceneToPhysics() }
    syncAfterEvents () {
        books.forEach((v) => { v.syncFromNativeTransform(); });
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

    setGroup (v) { this._impl.setGroup(v); }
    getGroup () { return this._impl.getGroup(); }
    addGroup (v) { this._impl.addGroup(v); }
    removeGroup (v) { this._impl.removeGroup(v); }
    setMask (v) { this._impl.setMask(v); }
    getMask () { return this._impl.getMask(); }
    addMask (v) { this._impl.addMask(v); }
    removeMask (v) { this._impl.removeMask(v); }

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
    constructor() { };
    initialize (v) {
        v.node.updateWorldTransform();
        this._com = v;
        this._impl.initialize(v.node.handle);
        ptrToObj[this._impl.getImpl()] = this;
        bookNode(v.node);
    }
    onLoad () {
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
    setGroup (v) { this._impl.setGroup(v); }
    getGroup () { return this._impl.getGroup(); }
    addGroup (v) { this._impl.addGroup(v); }
    removeGroup (v) { this._impl.removeGroup(v); }
    setMask (v) { this._impl.setMask(v); }
    getMask () { return this._impl.getMask(); }
    addMask (v) { this._impl.addMask(v); }
    removeMask (v) { this._impl.removeMask(v); }
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

cc.physics.selector.select("physx", {
    PhysicsWorld: PhysicsWorld,
    RigidBody: RigidBody,
    SphereShape: SphereShape,
    BoxShape: BoxShape,
    PlaneShape: PlaneShape,
    CapsuleShape: CapsuleShape,
    // ConeShape: PhysXConeShape,
    // CylinderShape: PhysXCylinderShape,
    // TrimeshShape: PhysXTrimeshShape,
    // TerrainShape: PhysXTerrainShape,
    // PointToPointConstraint: PhysXDistanceJoint,
    // HingeConstraint: PhysXRevoluteJoint
});
