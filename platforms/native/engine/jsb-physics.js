const jsbPhy = globalThis['jsb.physics'];

jsbPhy.CACHE = {
    trimesh: {},
    convex: {},
    height: {},
    material: {},
};

jsbPhy.OBJECT = {
    books: [],
    ptrToObj: {},
    raycastOptions: {
        origin: null,
        unitDir: null,
        distance: 0,
        mask: 0,
        queryTrigger: true,
    },
};

jsbPhy.CONFIG = {
    heightScale: 1 / 512,
};

const books = jsbPhy.OBJECT.books;
const ptrToObj = jsbPhy.OBJECT.ptrToObj;
const raycastOptions = jsbPhy.OBJECT.raycastOptions;

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

const CCTShapeEventObject = {
    type: 'onControllerColliderHit',
    controller: null,
    collider: null,
    worldPosition: null,
    worldNormal: null,
    motionDirection: null,
    motionLength: 0,
};

const CharacterTriggerEventObject = {
    type: 'onControllerTriggerEnter',
    characterController: null,
    collider: null,
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

function emitCCTTriggerEvent (t, cct, collider, impl) {
    CharacterTriggerEventObject.type = t;
    CharacterTriggerEventObject.impl = impl;
    CharacterTriggerEventObject.characterController = cct;
    CharacterTriggerEventObject.collider = collider;
    if (collider.needTriggerEvent) {
        collider.emit(t, CharacterTriggerEventObject);
    }
    if (cct.needTriggerEvent) {
        cct.emit(t, CharacterTriggerEventObject);
    }
}

const quat = new cc.Quat();
const contactsPool = [];
const contactBufferElementLength = 12;
class ContactPoint {
    constructor (e) {
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
        const c = contactsPool.length > 0 ? contactsPool.pop() : new ContactPoint(CollisionEventObject);
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

function emitCCTCollisionEvent (t, cct, collider, b) {
    CCTShapeEventObject.type = t;

    const contactCount = b.length / 10;
    CCTShapeEventObject.worldPosition = new cc.Vec3(b[0], b[1], b[2]);
    CCTShapeEventObject.worldNormal = new cc.Vec3(b[3], b[4], b[5]);
    CCTShapeEventObject.motionDirection = new cc.Vec3(b[6], b[7], b[8]);
    CCTShapeEventObject.motionLength = b[9];
    CCTShapeEventObject.controller = cct;
    CCTShapeEventObject.collider = collider;
    cct.emit(t, CCTShapeEventObject);
}

class PhysicsWorld {
    get impl () { return this._impl; }
    constructor () {
        this._impl = new jsbPhy.World();
    }

    setGravity (v) {
        this._impl.setGravity(v.x, v.y, v.z);
    }

    setAllowSleep (v) {
        this._impl.setAllowSleep(v);
    }

    setDefaultMaterial (v) { }

    step (f, t, m) {
        // books.forEach((v) => { v.syncToNativeTransform(); });
        this._impl.step(f);
    }

    set debugDrawFlags (v) {
        this._impl.setDebugDrawFlags(v);
    }

    get debugDrawFlags () {
        return this._impl.getDebugDrawFlags();
    }

    set debugDrawConstraintSize (v) {
        this._impl.setDebugDrawConstraintSize(v);
    }

    get debugDrawConstraintSize () {
        return this._impl.getDebugDrawConstraintSize();
    }

    raycast (r, o, p, rs) {
        raycastOptions.origin = r.o;
        raycastOptions.unitDir = r.d;
        raycastOptions.mask = o.mask >>> 0;
        raycastOptions.distance = o.maxDistance;
        raycastOptions.queryTrigger = !!o.queryTrigger;
        const isHit = this._impl.raycast(raycastOptions);
        if (isHit) {
            const hits = this._impl.raycastResult();
            for (let i = 0; i < hits.length; i++) {
                const hit = hits[i];
                const out = p.add();
                out._assign(hit.hitPoint, hit.distance, ptrToObj[hit.shape].collider, hit.hitNormal);
                rs.push(out);
            }
        }
        return isHit;
    }

    raycastClosest (r, o, out) {
        raycastOptions.origin = r.o;
        raycastOptions.unitDir = r.d;
        raycastOptions.mask = o.mask >>> 0;
        raycastOptions.distance = o.maxDistance;
        raycastOptions.queryTrigger = !!o.queryTrigger;
        const isHit = this._impl.raycastClosest(raycastOptions);
        if (isHit) {
            const hit = this._impl.raycastClosestResult();
            out._assign(hit.hitPoint, hit.distance, ptrToObj[hit.shape].collider, hit.hitNormal);
        }
        return isHit;
    }

    sweepBox (worldRay, halfExtent, orientation, options, pool, results) {
        raycastOptions.origin = worldRay.o;
        raycastOptions.unitDir = worldRay.d;
        raycastOptions.mask = options.mask >>> 0;
        raycastOptions.distance = options.maxDistance;
        raycastOptions.queryTrigger = !!options.queryTrigger;
        const isHit = this._impl.sweepBox(
                                raycastOptions,
                                halfExtent.x,
                                halfExtent.y,
                                halfExtent.z,
                                orientation.w,
                                orientation.x,
                                orientation.y,
                                orientation.z,
                                );
        if (isHit) {
            const hits = this._impl.sweepResult();
            for (let i = 0; i < hits.length; i++) {
                const hit = hits[i];
                const out = pool.add();
                out._assign(hit.hitPoint, hit.distance, ptrToObj[hit.shape].collider, hit.hitNormal);
                results.push(out);
            }
        }
        return isHit;
    }

    sweepBoxClosest (worldRay, halfExtent, orientation, options, result) {
        raycastOptions.origin = worldRay.o;
        raycastOptions.unitDir = worldRay.d;
        raycastOptions.mask = options.mask >>> 0;
        raycastOptions.distance = options.maxDistance;
        raycastOptions.queryTrigger = !!options.queryTrigger;
        const isHit = this._impl.sweepBoxClosest(
                                    raycastOptions,
                                    halfExtent.x,
                                    halfExtent.y,
                                    halfExtent.z,
                                    orientation.w,
                                    orientation.x,
                                    orientation.y,
                                    orientation.z,
                                    );
        if (isHit) {
            const hit = this._impl.sweepClosestResult();
            result._assign(hit.hitPoint, hit.distance, ptrToObj[hit.shape].collider, hit.hitNormal);
        }
        return isHit;
    }

    sweepSphere (worldRay, radius, options, pool, results) {
        raycastOptions.origin = worldRay.o;
        raycastOptions.unitDir = worldRay.d;
        raycastOptions.mask = options.mask >>> 0;
        raycastOptions.distance = options.maxDistance;
        raycastOptions.queryTrigger = !!options.queryTrigger;
        const isHit = this._impl.sweepSphere(raycastOptions, radius);
        if (isHit) {
            const hits = this._impl.sweepResult();
            for (let i = 0; i < hits.length; i++) {
                const hit = hits[i];
                const out = pool.add();
                out._assign(hit.hitPoint, hit.distance, ptrToObj[hit.shape].collider, hit.hitNormal);
                results.push(out);
            }
        }
        return isHit;
    }

    sweepSphereClosest (worldRay, radius, options, result) {
        raycastOptions.origin = worldRay.o;
        raycastOptions.unitDir = worldRay.d;
        raycastOptions.mask = options.mask >>> 0;
        raycastOptions.distance = options.maxDistance;
        raycastOptions.queryTrigger = !!options.queryTrigger;
        const isHit = this._impl.sweepSphereClosest(raycastOptions, radius);
        if (isHit) {
            const hit = this._impl.sweepClosestResult();
            result._assign(hit.hitPoint, hit.distance, ptrToObj[hit.shape].collider, hit.hitNormal);
        }
        return isHit;
    }

    sweepCapsule (worldRay, radius, height, orientation, options, pool, results) {
        raycastOptions.origin = worldRay.o;
        raycastOptions.unitDir = worldRay.d;
        raycastOptions.mask = options.mask >>> 0;
        raycastOptions.distance = options.maxDistance;
        raycastOptions.queryTrigger = !!options.queryTrigger;
        const isHit = this._impl.sweepCapsule(raycastOptions, radius, height, orientation.w, orientation.x, orientation.y, orientation.z);
        if (isHit) {
            const hits = this._impl.sweepResult();
            for (let i = 0; i < hits.length; i++) {
                const hit = hits[i];
                const out = pool.add();
                out._assign(hit.hitPoint, hit.distance, ptrToObj[hit.shape].collider, hit.hitNormal);
                results.push(out);
            }
        }
        return isHit;
    }

    sweepCapsuleClosest (worldRay, radius, height, orientation, options, result) {
        raycastOptions.origin = worldRay.o;
        raycastOptions.unitDir = worldRay.d;
        raycastOptions.mask = options.mask >>> 0;
        raycastOptions.distance = options.maxDistance;
        raycastOptions.queryTrigger = !!options.queryTrigger;
        const isHit = this._impl.sweepCapsuleClosest(
                                    raycastOptions,
                                    radius,
                                    height,
                                    orientation.w,
                                    orientation.x,
                                    orientation.y,
                                    orientation.z,
                                    );
        if (isHit) {
            const hit = this._impl.sweepClosestResult();
            result._assign(hit.hitPoint, hit.distance, ptrToObj[hit.shape].collider, hit.hitNormal);
        }
        return isHit;
    }

    emitEvents () {
        this.emitTriggerEvent();
        this.emitCollisionEvent();
        this.emitCCTCollisionEvent();
        this.emitCCTTriggerEvent();
        this._impl.emitEvents();
    }

    syncSceneToPhysics () {
        this._impl.syncSceneToPhysics();
    }

    syncAfterEvents () {
        // this._impl.syncSceneToPhysics()
    }

    destroy () { this._impl.destroy(); }

    emitTriggerEvent () {
        const teps = this._impl.getTriggerEventPairs();
        const len = teps.length / 3;
        for (let i = 0; i < len; i++) {
            const t = i * 3;
            const sa = ptrToObj[teps[t + 0]]; const sb = ptrToObj[teps[t + 1]];
            if (!sa || !sb) continue;
            const c0 = sa.collider; const c1 = sb.collider;
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
            const sa = ptrToObj[ceps[t + 0]]; const sb = ptrToObj[ceps[t + 1]];
            if (!sa || !sb) continue;
            const c0 = sa.collider; const c1 = sb.collider;
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

    emitCCTCollisionEvent () {
        const events = this._impl.getCCTShapeEventPairs();
        const len2 = events.length / 3;
        for (let i = 0; i < len2; i++) {
            const t = i * 3;
            const cct = ptrToObj[events[t + 0]]; const shape = ptrToObj[events[t + 1]];
            if (!cct || !shape) continue;
            const c0 = cct.characterController; const c1 = shape.collider;
            if (!(c0 && c0.isValid && c1 && c1.isValid)) continue;
            emitCCTCollisionEvent('onControllerColliderHit', c0, c1, events[t + 2]);
        }
    }

    emitCCTTriggerEvent () {
        const teps = this._impl.getCCTTriggerEventPairs();
        const len = teps.length / 3;
        for (let i = 0; i < len; i++) {
            const t = i * 3;
            const sa = ptrToObj[teps[t + 0]];
            const sb = ptrToObj[teps[t + 1]];
            if (!sa || !sb) continue;
            const cct = sa.characterController;
            const collider = sb.collider;
            if (!(cct && cct.isValid && collider && collider.isValid)) continue;
            if (!collider.needTriggerEvent) continue;
            const state = teps[t + 2];
            if (state === 1) {
                emitCCTTriggerEvent('onControllerTriggerStay', cct, collider, teps);
            } else if (state === 0) {
                emitCCTTriggerEvent('onControllerTriggerEnter', cct, collider, teps);
            } else {
                emitCCTTriggerEvent('onControllerTriggerExit', cct, collider, teps);
            }
        }
    }
}

function bookNode (v) {
    if (v._physicsBookIndex === undefined) {
        v._physicsBookIndex = books.length;
        books.push(v);
    }
}

function unBookNode (v) {
    const index = v._physicsBookIndex;
    if (index !== undefined) {
        books[index] = books[books.length - 1];
        books[index]._physicsBookIndex = index;
        books.length -= 1;
        v._physicsBookIndex = undefined;
    }
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
    get impl () { return this._impl; }
    get rigidBody () { return this._com; }
    get isAwake () { return this._impl.isAwake(); }
    get isSleepy () { return false; }
    get isSleeping () { return this._impl.isSleeping(); }
    constructor () {
        updateCollisionMatrix();
        this._impl = new jsbPhy.RigidBody();
        this._isUsingCCD = false;
    }

    initialize (v) {
        v.node.updateWorldTransform();
        this._com = v;
        this._impl.initialize(v.node, v.type, v._group);
        bookNode(v.node);
        this._impl.setSleepThreshold(cc.PhysicsSystem.instance.sleepThreshold);
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
    setMask (v) { this._impl.setMask(v >>> 0); }
    getMask () { return this._impl.getMask(); }
    addMask (v) { this.setMask(this.getMask() | v); }
    removeMask (v) { this.setMask(this.getMask() & ~v); }

    setType (v) { this._impl.setType(v); }
    setMass (v) { this._impl.setMass(v); }
    setAllowSleep (v) { this._impl.setAllowSleep(v); }
    setLinearDamping (v) {
        const dt = cc.PhysicsSystem.instance.fixedTimeStep;
        this._impl.setLinearDamping((1 - (1 - v) ** dt) / dt);
    }
    setAngularDamping (v) {
        const dt = cc.PhysicsSystem.instance.fixedTimeStep;
        this._impl.setAngularDamping((1 - (1 - v) ** dt) / dt);
    }
    isUsingCCD () { return this._isUsingCCD; }
    useCCD (v) {
        this._isUsingCCD = v;
        return this._impl.useCCD(v);
    }
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
    QUERY_FILTER: 1 << 0,
    QUERY_SINGLE_HIT: 1 << 2,
    DETECT_TRIGGER_EVENT: 1 << 3,
    DETECT_CONTACT_EVENT: 1 << 4,
    DETECT_CONTACT_POINT: 1 << 5,
    DETECT_CONTACT_CCD: 1 << 6,
};

class Shape {
    get impl () { return this._impl; }
    get collider () { return this._com; }
    get attachedRigidBody () { return this._attachedRigidBody; }
    constructor () { updateCollisionMatrix(); }
    initialize (v) {
        v.node.updateWorldTransform();
        this._com = v;
        this._impl.initialize(v.node);
        ptrToObj[this._impl.getObjectID()] = this;
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
        delete ptrToObj[this._impl.getObjectID()];
        ptrToObj[this._impl.getObjectID()] = null;
        this._impl.onDestroy();
    }
    setMaterial (v) {
        const ins = cc.PhysicsSystem.instance;
        if (!v) v = ins.defaultMaterial;
        if (!jsbPhy.CACHE.material[v.id]) {
            jsbPhy.CACHE.material[v.id] = ins.physicsWorld.impl.createMaterial(v.id, v.friction, v.friction, v.restitution, 2, 2);
        }
        this._impl.setMaterial(v.id, v.friction, v.friction, v.restitution, 2, 2);
    }
    setAsTrigger (v) { this._impl.setAsTrigger(v); }
    setCenter (v) { this._impl.setCenter(v.x, v.y, v.z); }
    getAABB (v) { v.copy(this._impl.getAABB()); }
    getBoundingSphere (v) { v.copy(this._impl.getBoundingSphere()); }
    updateEventListener () {
        let flag = 0;
        flag |= ESHAPE_FLAG.DETECT_CONTACT_CCD;
        if (this._com.isTrigger) flag |= ESHAPE_FLAG.IS_TRIGGER;
        if (this._com.needTriggerEvent || this._com.needCollisionEvent) flag |= ESHAPE_FLAG.NEED_EVENT;
        this._impl.updateEventListener(flag);
    }
    setGroup (v) { this._impl.setGroup(v); }
    getGroup () { return this._impl.getGroup(); }
    addGroup (v) { this.setGroup(this.getGroup() | v); }
    removeGroup (v) { this.setGroup(this.getGroup() & ~v); }
    setMask (v) { this._impl.setMask(v >>> 0); }
    getMask () { return this._impl.getMask(); }
    addMask (v) { this.setMask(this.getMask() | v); }
    removeMask (v) { this.setMask(this.getMask() & ~v); }
}

class SphereShape extends Shape {
    constructor () { super(); this._impl = new jsbPhy.SphereShape(); }
    updateRadius () { this._impl.setRadius(this.collider.radius); }
    onLoad () {
        super.onLoad();
        this.updateRadius();
    }
}

class BoxShape extends Shape {
    constructor () { super(); this._impl = new jsbPhy.BoxShape(); }
    updateSize () {
        const v = this.collider.size;
        this._impl.setSize(v.x, v.y, v.z);
    }
    onLoad () {
        super.onLoad();
        this.updateSize();
    }
}

class CapsuleShape extends Shape {
    constructor () { super(); this._impl = new jsbPhy.CapsuleShape(); }
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
    constructor () { super(); this._impl = new jsbPhy.PlaneShape(); }
    setConstant (v) { this._impl.setConstant(v); }
    setNormal (v) { this._impl.setNormal(v.x, v.y, v.z); }
    onLoad () {
        super.onLoad();
        this.setNormal(this._com.normal);
        this.setConstant(this._com.constant);
    }
}

function getConvexMesh (v) {
    if (!jsbPhy.CACHE.convex[v._uuid]) {
        const posArr = cc.physics.utils.shrinkPositions(v.renderingSubMeshes[0].geometricInfo.positions);
        const world = cc.PhysicsSystem.instance.physicsWorld.impl;
        const convex = { positions: new Float32Array(posArr), positionLength: posArr.length / 3 };
        jsbPhy.CACHE.convex[v._uuid] = world.createConvex(convex);
    }
    return jsbPhy.CACHE.convex[v._uuid];
}

function getTriangleMesh (v) {
    if (!jsbPhy.CACHE.trimesh[v._uuid]) {
        const posArr = v.renderingSubMeshes[0].geometricInfo.positions;
        const indArr = v.renderingSubMeshes[0].geometricInfo.indices;
        const world = cc.PhysicsSystem.instance.physicsWorld.impl;
        const trimesh = {
            positions: new Float32Array(posArr),
            positionLength: posArr.length / 3,
            triangles: new Uint16Array(indArr),
            triangleLength: indArr.length / 3,
            isU16: true,
        };
        jsbPhy.CACHE.trimesh[v._uuid] = world.createTrimesh(trimesh);
    }
    return jsbPhy.CACHE.trimesh[v._uuid];
}

function getHeightField (v) {
    if (!jsbPhy.CACHE.height[v._uuid]) {
        const rows = v.getVertexCountI();
        const columns = v.getVertexCountJ();
        const samples = new Int16Array(rows * columns);
        const heightScale = jsbPhy.CONFIG.heightScale;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                samples[j + i * columns] = v.getHeight(i, j) / heightScale;
            }
        }
        const height = { rows, columns, samples };
        const world = cc.PhysicsSystem.instance.physicsWorld.impl;
        jsbPhy.CACHE.height[v._uuid] = world.createHeightField(height);
    }
    return jsbPhy.CACHE.height[v._uuid];
}

class CylinderShape extends Shape {
    constructor () { super(); this._impl = new jsbPhy.CylinderShape(); }
    setRadius (v) { this.updateGeometry(); }
    setDirection (v) { this.updateGeometry(); }
    setHeight (v) { this.updateGeometry(); }
    updateGeometry () { this._impl.setCylinder(this._com.radius, this._com.height, this._com.direction); }
    initialize (v) {
        if (!jsbPhy.CACHE.convex.CYLINDER) {
            const primitive = cc.physics.utils.cylinder(0.5, 0.5, 2, { radialSegments: 32, heightSegments: 1 });
            const posArr = cc.physics.utils.shrinkPositions(primitive.positions);
            const convex = { positions: new Float32Array(posArr), positionLength: posArr.length / 3 };
            const pxObjectID = cc.PhysicsSystem.instance.physicsWorld.impl.createConvex(convex);
            jsbPhy.CACHE.convex.CYLINDER = pxObjectID;
        }
        this._com = v;
        this._impl.setCylinder(v.radius, v.height, v.direction);
        this._impl.setConvex(jsbPhy.CACHE.convex.CYLINDER);
        super.initialize(v);
    }
}

class ConeShape extends Shape {
    constructor () { super(); this._impl = new jsbPhy.ConeShape(); }
    setRadius (v) { this.updateGeometry(); }
    setDirection (v) { this.updateGeometry(); }
    setHeight (v) { this.updateGeometry(); }
    updateGeometry () { this._impl.setCone(this._com.radius, this._com.height, this._com.direction); }
    initialize (v) {
        if (!jsbPhy.CACHE.convex.CONE) {
            const primitive = cc.physics.utils.cylinder(0, 0.5, 1, { radialSegments: 32, heightSegments: 1 });
            const posArr = cc.physics.utils.shrinkPositions(primitive.positions);
            const convex = { positions: new Float32Array(posArr), positionLength: posArr.length / 3 };
            const pxObjectID = cc.PhysicsSystem.instance.physicsWorld.impl.createConvex(convex);
            jsbPhy.CACHE.convex.CONE = pxObjectID;
        }
        this._com = v;
        this._impl.setCone(v.radius, v.height, v.direction);
        this._impl.setConvex(jsbPhy.CACHE.convex.CONE);
        super.initialize(v);
    }
}

class TrimeshShape extends Shape {
    constructor () { super(); this._impl = new jsbPhy.TrimeshShape(); }
    setConvex (v) { this._impl.useConvex(v); }
    setMesh (v) {
        if (!v) return;
        const isConvex = this._com.convex;
        this._impl.useConvex(isConvex);
        const pxObjectID = isConvex ? getConvexMesh(v) : getTriangleMesh(v);
        this._impl.setMesh(pxObjectID);
    }
    initialize (v) {
        this._com = v;
        this.setConvex(v.convex);
        this.setMesh(v.mesh);
        super.initialize(v);
    }
}

class TerrainShape extends Shape {
    constructor () { super(); this._impl = new jsbPhy.TerrainShape(); }
    setTerrain (v) {
        if (!v) return;
        const pxObjectID = getHeightField(v);
        this._impl.setTerrain(pxObjectID, v.tileSize, v.tileSize, jsbPhy.CONFIG.heightScale);
    }
    initialize (v) {
        this._com = v;
        this.setTerrain(v.terrain);
        super.initialize(v);
    }
}

class Joint {
    get impl () { return this._impl; }
    get joint () { return this._com; }
    setEnableCollision (v) { this._impl.setEnableCollision(v); }
    setConnectedBody (v) { this._impl.setConnectedBody(v ? v.body.impl.getObjectID() : 0); }
    initialize (v) {
        this._com = v;
        this._impl.initialize(v.node);
        ptrToObj[this._impl.getObjectID()] = this;
        this.onLoad();
    }
    onLoad () {
        this.setConnectedBody(this._com.connectedBody);
        this.setEnableCollision(this._com.enableCollision);
    }
    onEnable () { this._impl.onEnable(); }
    onDisable () { this._impl.onDisable(); }
    onDestroy () {
        delete ptrToObj[this._impl.getObjectID()];
        ptrToObj[this._impl.getObjectID()] = null;
        this._impl.onDestroy();
    }
}

class SphericalJoint extends Joint {
    constructor () { super(); this._impl = new jsbPhy.SphericalJoint(); }
    setPivotA (v) { this._impl.setPivotA(v.x, v.y, v.z); }
    setPivotB (v) { this._impl.setPivotB(v.x, v.y, v.z); }
    onLoad () {
        super.onLoad();
        this.setPivotA(this._com.pivotA);
        this.setPivotB(this._com.pivotB);
    }
}

class RevoluteJoint extends Joint {
    constructor () { super(); this._impl = new jsbPhy.RevoluteJoint(); }
    setAxis (v) { this._impl.setAxis(v.x, v.y, v.z); }
    setPivotA (v) { this._impl.setPivotA(v.x, v.y, v.z); }
    setPivotB (v) { this._impl.setPivotB(v.x, v.y, v.z); }
    setLimitEnabled (v) { this._impl.setLimitEnabled(v); }
    setLowerLimit (v) { this._impl.setLowerLimit(v); }
    setUpperLimit (v) { this._impl.setUpperLimit(v); }
    setMotorEnabled (v) { this._impl.setMotorEnabled(v); }
    setMotorVelocity (v) { this._impl.setMotorVelocity(v); }
    setMotorForceLimit (v) { this._impl.setMotorForceLimit(v); }
    onLoad () {
        super.onLoad();
        this.setAxis(this._com.axis);
        this.setPivotA(this._com.pivotA);
        this.setPivotB(this._com.pivotB);
        this.setLimitEnabled(this._com.limitEnabled);
        this.setLowerLimit(this._com.lowerLimit);
        this.setUpperLimit(this._com.upperLimit);
        this.setMotorEnabled(this._com.motorEnabled);
        this.setMotorVelocity(this._com.motorVelocity);
        this.setMotorForceLimit(this._com.motorForceLimit);
    }
}

class FixedJoint extends Joint {
    constructor () { super(); this._impl = new jsbPhy.FixedJoint(); }
    setBreakForce (v) { this._impl.setBreakForce(v); }
    setBreakTorque (v) { this._impl.setBreakTorque(v); }
    onLoad () {
        super.onLoad();
        this.setBreakForce(this._com.breakForce);
        this.setBreakTorque(this._com.breakTorque);
    }
}

class ConfigurableJoint extends Joint {
    constructor () { super(); this._impl = new jsbPhy.GenericJoint(); }

    setConstraintMode (idx, v) { this._impl.setConstraintMode(idx, v); }
    setLinearLimit (idx, upper, lower) { this._impl.setLinearLimit(idx, upper, lower); }
    setAngularExtent (twist, swing1, swing2) { this._impl.setAngularExtent(twist, swing1, swing2); }
    setLinearSoftConstraint (v) { this._impl.setLinearSoftConstraint(v); }
    setLinearStiffness (v) { this._impl.setLinearStiffness(v); }
    setLinearDamping (v) { this._impl.setLinearDamping(v); }
    setLinearRestitution (v) { this._impl.setLinearRestitution(v); }

    setSwingSoftConstraint (v) { this._impl.setSwingSoftConstraint(v); }
    setTwistSoftConstraint (v) { this._impl.setTwistSoftConstraint(v); }
    setSwingStiffness (v) { this._impl.setSwingStiffness(v); }
    setSwingDamping (v) { this._impl.setSwingDamping(v); }
    setSwingRestitution (v) { this._impl.setSwingRestitution(v); }
    setTwistStiffness (v) { this._impl.setTwistStiffness(v); }
    setTwistDamping (v) { this._impl.setTwistDamping(v); }
    setTwistRestitution (v) { this._impl.setTwistRestitution(v); }

    // motor
    setDriverMode (idx, v) { this._impl.setDriverMode(idx, v); }
    setLinearMotorTarget (v) { this._impl.setLinearMotorTarget(v.x, v.y, v.z); }
    setLinearMotorVelocity (v) { this._impl.setLinearMotorVelocity(v.x, v.y, v.z); }
    setLinearMotorForceLimit (v) { this._impl.setLinearMotorForceLimit(v); }

    setAngularMotorTarget (v) { this._impl.setAngularMotorTarget(v.x, v.y, v.z); }
    setAngularMotorVelocity (v) { this._impl.setAngularMotorVelocity(v.x, v.y, v.z); }
    setAngularMotorForceLimit (v) { this._impl.setAngularMotorForceLimit(v); }

    setPivotA (v) { this._impl.setPivotA(v.x, v.y, v.z); }
    setPivotB (v) { this._impl.setPivotB(v.x, v.y, v.z); }
    setAutoPivotB (v) { this._impl.setAutoPivotB(v); }
    setAxis (v) { this._impl.setAxis(v.x, v.y, v.z); }
    setSecondaryAxis (v) { this._impl.setSecondaryAxis(v.x, v.y, v.z); }

    setBreakForce (v) { this._impl.setBreakForce(v); }
    setBreakTorque (v) { this._impl.setBreakTorque(v); }

    onLoad () {
        super.onLoad();
        this.setBreakForce(this._com.breakForce);
        this.setBreakTorque(this._com.breakTorque);

        const com = this._com;
        const linearLimit = com.linearLimitSettings;
        const angularLimit = com.angularLimitSettings;
        this.setConstraintMode(0, linearLimit.xMotion);
        this.setConstraintMode(1, linearLimit.yMotion);
        this.setConstraintMode(2, linearLimit.zMotion);
        this.setConstraintMode(3, angularLimit.twistMotion);
        this.setConstraintMode(4, angularLimit.swingMotion1);
        this.setConstraintMode(5, angularLimit.swingMotion2);

        this.setLinearLimit(0, linearLimit.lower.x, linearLimit.upper.x);
        this.setLinearLimit(1, linearLimit.lower.y, linearLimit.upper.y);
        this.setLinearLimit(2, linearLimit.lower.z, linearLimit.upper.z);
        this.setAngularExtent(angularLimit.twistExtent, angularLimit.swingExtent1, angularLimit.swingExtent2);

        this.setLinearSoftConstraint(linearLimit.enableSoftConstraint);
        this.setLinearStiffness(linearLimit.stiffness);
        this.setLinearDamping(linearLimit.damping);
        this.setLinearRestitution(linearLimit.restitution);

        this.setSwingSoftConstraint(angularLimit.enableSoftConstraintSwing);
        this.setTwistSoftConstraint(angularLimit.enableSoftConstraintTwist);
        this.setSwingStiffness(angularLimit.swingStiffness);
        this.setSwingDamping(angularLimit.swingDamping);
        this.setSwingRestitution(angularLimit.swingRestitution);
        this.setTwistStiffness(angularLimit.twistStiffness);
        this.setTwistDamping(angularLimit.twistDamping);
        this.setTwistRestitution(angularLimit.twistRestitution);

        const linearMotor = com.linearDriverSettings;
        const angularMotor = com.angularDriverSettings;
        this.setDriverMode(0, linearMotor.xDrive);
        this.setDriverMode(1, linearMotor.yDrive);
        this.setDriverMode(2, linearMotor.zDrive);
        this.setDriverMode(3, angularMotor.twistDrive);
        this.setDriverMode(4, angularMotor.swingDrive1);
        this.setDriverMode(5, angularMotor.swingDrive2);

        this.setLinearMotorTarget(linearMotor.targetPosition);
        this.setLinearMotorVelocity(linearMotor.targetVelocity);
        this.setLinearMotorForceLimit(linearMotor.strength);

        this.setAngularMotorTarget(angularMotor.targetOrientation);
        this.setAngularMotorVelocity(angularMotor.targetVelocity);
        this.setAngularMotorForceLimit(angularMotor.strength);

        this.setPivotA(com.pivotA);
        this.setPivotB(com.pivotB);
        this.setAutoPivotB(com.autoPivotB);
        this.setAxis(com.axis);
        this.setSecondaryAxis(com.secondaryAxis);
        this.setBreakForce(com.breakForce);
        this.setBreakTorque(com.breakTorque);
    }
}
class CharacterController {
    get impl () { return this._impl; }
    get characterController () { return this._com; }
    constructor () { updateCollisionMatrix(); }
    initialize (com) {
        this._com = com;
        const inited = this._impl.initialize(com.node);
        ptrToObj[this._impl.getObjectID()] = this;
        return inited;
    }
    onLoad () {
        this.setGroup(this._com.group);
        const cm = cc.PhysicsSystem.instance.collisionMatrix;
        const mask = cm[this._com.group];
        this.setMask(mask);

        this.setCenter(this._com.center);
        this.setStepOffset(this._com.stepOffset);
        this.setSlopeLimit(this._com.slopeLimit);
        this.setContactOffset(this._com.skinWidth);
        this.setDetectCollisions(true);//this._com.detectCollisions);
        this.setOverlapRecovery(true);//this._com.enableOverlapRecovery);
    }
    onEnable () { this._impl.onEnable(); }
    onDisable () { this._impl.onDisable(); }
    onDestroy () {
        delete ptrToObj[this._impl.getObjectID()];
        ptrToObj[this._impl.getObjectID()] = null;
        this._impl.onDestroy();
    }

    onGround () { return this._impl.onGround(); }
    move (v, minDist, dt) { return this._impl.move(v.x, v.y, v.z, minDist, dt); }
    syncPhysicsToScene () { this._impl.syncPhysicsToScene(); }

    setPosition (v) { this._impl.setPosition(v.x, v.y, v.z); }
    getPosition () { return this._impl.getPosition(); }
    setStepOffset (v) { this._impl.setStepOffset(v); }
    getStepOffset () { return this._impl.getStepOffset(); }
    setSlopeLimit (v) { this._impl.setSlopeLimit(v); }
    getSlopeLimit () { return this._impl.getSlopeLimit(); }
    setContactOffset (v) { this._impl.setContactOffset(v); }
    getContactOffset () { return this._impl.getContactOffset(); }
    setDetectCollisions (v) { this._impl.setDetectCollisions(v); }
    setOverlapRecovery (v) { this._impl.setOverlapRecovery(v); }
    setCenter (v) { this._impl.setCenter(v.x, v.y, v.z); }

    updateEventListener () {
        let flag = 0;
        if (this._com.needTriggerEvent) flag |= ESHAPE_FLAG.DETECT_TRIGGER_EVENT;
        this._impl.updateEventListener(flag);
    }
    setGroup (v) { this._impl.setGroup(v); }
    getGroup () { return this._impl.getGroup(); }
    addGroup (v) { this.setGroup(this.getGroup() | v); }
    removeGroup (v) { this.setGroup(this.getGroup() & ~v); }
    setMask (v) { this._impl.setMask(v >>> 0); }
    getMask () { return this._impl.getMask(); }
    addMask (v) { this.setMask(this.getMask() | v); }
    removeMask (v) { this.setMask(this.getMask() & ~v); }
}

class CapsuleCharacterController extends CharacterController {
    constructor () { super(); this._impl = new jsbPhy.CapsuleCharacterController(); }
    setRadius (v) { this._impl.setRadius(v); }
    setHeight (v) { this._impl.setHeight(v); }
    onLoad () {
        super.onLoad();
        this.setRadius(this._com.radius);
        this.setHeight(this._com.height);
    }
}

class BoxCharacterController extends CharacterController {
    constructor () { super(); this._impl = new jsbPhy.BoxCharacterController(); }
    setHalfHeight (v) { this._impl.setHalfHeight(v); }
    setHalfSideExtent (v) { this._impl.setHalfSideExtent(v); }
    setHalfForwardExtent (v) { this._impl.setHalfForwardExtent(v); }
    onLoad () {
        super.onLoad();
        this.setHalfHeight(this._com.halfHeight);
        this.setHalfSideExtent(this._com.halfSideExtent);
        this.setHalfForwardExtent(this._com.halfForwardExtent);
    }
}

cc.physics.selector.register('physx', {
    PhysicsWorld,
    RigidBody,
    SphereShape,
    BoxShape,
    PlaneShape,
    CapsuleShape,
    ConeShape,
    CylinderShape,
    TrimeshShape,
    TerrainShape,
    PointToPointConstraint: SphericalJoint,
    HingeConstraint: RevoluteJoint,
    FixedConstraint: FixedJoint,
    ConfigurableConstraint: ConfigurableJoint,
    CapsuleCharacterController,
    BoxCharacterController,
});
