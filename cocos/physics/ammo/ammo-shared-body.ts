/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
 */

/* eslint-disable new-cap */
// import Ammo from './instantiated';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { Node } from '../../core';
import { AmmoWorld } from './ammo-world';
import { AmmoRigidBody } from './ammo-rigid-body';
import { AmmoShape } from './shapes/ammo-shape';
import { bullet2CocosVec3, cocos2BulletQuat, cocos2BulletVec3, bullet2CocosQuat } from './ammo-util';
import { AmmoCollisionFlags, AmmoCollisionObjectStates, EAmmoSharedBodyDirty } from './ammo-enum';
import { AmmoInstance } from './ammo-instance';
import { IAmmoBodyStruct, IAmmoGhostStruct } from './ammo-interface';
import { CC_V3_0, CC_QUAT_0, AmmoConstant } from './ammo-const';
import { PhysicsSystem } from '../framework';
// import { AmmoConstraint } from './constraints/ammo-constraint';
import { ERigidBodyType, PhysicsGroup } from '../framework/physics-enum';
import { fastRemoveAt } from '../../core/utils/array';
import { bt } from './export-bullet';

type AmmoConstraint = any;
/**
 * @packageDocumentation
 * @hidden
 */

const v3_0 = CC_V3_0;
const quat_0 = CC_QUAT_0;
let sharedIDCounter = 0;

/**
 * shared object, node : shared = 1 : 1
 * body for static \ dynamic \ kinematic (collider)
 * ghost for trigger
 */
export class AmmoSharedBody {
    private static idCounter = 0;
    private static readonly sharedBodesMap = new Map<string, AmmoSharedBody>();

    static getSharedBody (node: Node, wrappedWorld: AmmoWorld, wrappedBody?: AmmoRigidBody) {
        const key = node.uuid;
        let newSB!: AmmoSharedBody;
        if (AmmoSharedBody.sharedBodesMap.has(key)) {
            newSB = AmmoSharedBody.sharedBodesMap.get(key)!;
        } else {
            newSB = new AmmoSharedBody(node, wrappedWorld);
            const g = PhysicsGroup.DEFAULT;
            const m = PhysicsSystem.instance.collisionMatrix[g];
            newSB._collisionFilterGroup = g;
            newSB._collisionFilterMask = m;
            AmmoSharedBody.sharedBodesMap.set(node.uuid, newSB);
        }
        if (wrappedBody) {
            newSB._wrappedBody = wrappedBody;
            const g = wrappedBody.rigidBody.group;
            const m = PhysicsSystem.instance.collisionMatrix[g];
            newSB._collisionFilterGroup = g;
            newSB._collisionFilterMask = m;
        }
        return newSB;
    }

    get wrappedBody () {
        return this._wrappedBody;
    }

    get bodyCompoundShape () {
        return this.bodyStruct.shape;
    }

    get ghostCompoundShape () {
        return this.ghostStruct.shape;
    }

    get body () {
        return this.bodyStruct.body;
    }

    get ghost () {
        return this.ghostStruct.ghost;
    }

    get collisionFilterGroup () { return this._collisionFilterGroup; }
    set collisionFilterGroup (v: number) {
        if (v !== this._collisionFilterGroup) {
            this._collisionFilterGroup = v;
            this.dirty |= EAmmoSharedBodyDirty.BODY_RE_ADD;
            this.dirty |= EAmmoSharedBodyDirty.GHOST_RE_ADD;
        }
    }

    get collisionFilterMask () { return this._collisionFilterMask; }
    set collisionFilterMask (v: number) {
        if (v !== this._collisionFilterMask) {
            this._collisionFilterMask = v;
            this.dirty |= EAmmoSharedBodyDirty.BODY_RE_ADD;
            this.dirty |= EAmmoSharedBodyDirty.GHOST_RE_ADD;
        }
    }

    get bodyStruct () {
        this._instantiateBodyStruct();
        return this._bodyStruct;
    }

    get ghostStruct () {
        this._instantiateGhostStruct();
        return this._ghostStruct;
    }

    readonly id: number;
    readonly node: Node;
    readonly wrappedWorld: AmmoWorld;
    readonly wrappedJoints0: AmmoConstraint[] = [];
    readonly wrappedJoints1: AmmoConstraint[] = [];
    dirty: EAmmoSharedBodyDirty = 0;

    private _collisionFilterGroup: number = PhysicsSystem.PhysicsGroup.DEFAULT;
    private _collisionFilterMask = -1;

    private ref = 0;
    private bodyIndex = -1;
    private ghostIndex = -1;
    private _bodyStruct!: IAmmoBodyStruct;
    private _ghostStruct!: IAmmoGhostStruct;
    private _wrappedBody: AmmoRigidBody | null = null;

    /**
     * add or remove from world \
     * add, if enable \
     * remove, if disable & shapes.length == 0 & wrappedBody disable
     */
    set bodyEnabled (v: boolean) {
        if (v) {
            if (this.bodyIndex < 0) {
                // add to world only if it is a dynamic body or having shapes.
                if (this.bodyStruct.wrappedShapes.length === 0) {
                    if (!this.wrappedBody) return;
                    if (!this.wrappedBody.rigidBody.isDynamic) return;
                }
                this.bodyIndex = this.wrappedWorld.bodies.length;
                this.wrappedWorld.addSharedBody(this);
                this.syncInitialBody();
            }
        } else if (this.bodyIndex >= 0) {
            const isRemoveBody = (this.bodyStruct.wrappedShapes.length === 0 && this.wrappedBody == null)
                || (this.bodyStruct.wrappedShapes.length === 0 && this.wrappedBody != null && !this.wrappedBody.isEnabled)
                || (this.bodyStruct.wrappedShapes.length === 0 && this.wrappedBody != null && !this.wrappedBody.rigidBody.enabledInHierarchy);

            if (isRemoveBody) {
                bt.RigidBody_clearState(this.body); // clear velocity etc.
                this.bodyIndex = -1;
                this.wrappedWorld.removeSharedBody(this);
            }
        }
    }

    set ghostEnabled (v: boolean) {
        if (v) {
            if (this.ghostIndex < 0 && this.ghostStruct.wrappedShapes.length > 0) {
                this.ghostIndex = 1;
                this.wrappedWorld.addGhostObject(this);
                this.syncInitialGhost();
            }
        } else if (this.ghostIndex >= 0) {
            /** remove trigger */
            const isRemoveGhost = (this.ghostStruct.wrappedShapes.length === 0 && this.ghost);

            if (isRemoveGhost) {
                this.ghostIndex = -1;
                this.wrappedWorld.removeGhostObject(this);
            }
        }
    }

    set reference (v: boolean) {
        // eslint-disable-next-line no-unused-expressions
        v ? this.ref++ : this.ref--;
        if (this.ref === 0) { this.destroy(); }
    }

    private constructor (node: Node, wrappedWorld: AmmoWorld) {
        this.id = AmmoSharedBody.idCounter++;
        this.wrappedWorld = wrappedWorld;
        this.node = node;
    }

    private _instantiateBodyStruct () {
        if (this._bodyStruct) return;
        /** body struct */
        const st = AmmoConstant.instance.TRANSFORM;
        cocos2BulletVec3(bt.Transform_getOrigin(st), this.node.worldPosition);
        const bodyQuat = AmmoConstant.instance.QUAT_0;
        cocos2BulletQuat(bodyQuat, this.node.worldRotation);
        bt.Transform_setRotation(st, bodyQuat);
        const motionState = bt.DefaultMotionState_create(st);
        const localInertia = AmmoConstant.instance.VECTOR3_0;
        bt.Vector3_setValue(localInertia, 1.6666666269302368, 1.6666666269302368, 1.6666666269302368);
        const bodyShape = bt.CompoundShape_create(true);
        let mass = 0;
        if (this._wrappedBody && this._wrappedBody.rigidBody.enabled && this._wrappedBody.rigidBody.isDynamic) {
            mass = this._wrappedBody.rigidBody.mass;
        }
        if (mass === 0) bt.Vector3_setValue(localInertia, 0, 0, 0);
        const rbInfo = bt.RigidBodyConstructionInfo_create(mass, motionState, AmmoConstant.instance.EMPTY_SHAPE, localInertia);
        const body = bt.RigidBody_create(rbInfo);
        const sleepTd = PhysicsSystem.instance.sleepThreshold;
        bt.RigidBody_setSleepingThresholds(body, sleepTd, sleepTd);
        this._bodyStruct = {
            id: sharedIDCounter++,
            body,
            localInertia,
            motionState,
            shape: bodyShape,
            rbInfo,
            wrappedShapes: [],
            useCompound: false,
        };
        AmmoInstance.bodyStructs[this._bodyStruct.id] = this._bodyStruct;
        bt.CollisionObject_setUserIndex(this.body, this._bodyStruct.id);
        // if ((Ammo as any).CC_CONFIG.ignoreSelfBody && this._ghostStruct) this.ghost.setIgnoreCollisionCheck(this.body, true);
        if (this.wrappedBody) this.setBodyType(this.wrappedBody.rigidBody.type);
    }

    private _instantiateGhostStruct () {
        if (this._ghostStruct) return;
        /** ghost struct */
        const ghost = bt.CollisionObject_create();
        const ghostShape = bt.CompoundShape_create(true);
        bt.CollisionObject_setCollisionShape(ghost, ghostShape);
        bt.CollisionObject_setCollisionFlags(ghost, AmmoCollisionFlags.CF_STATIC_OBJECT | AmmoCollisionFlags.CF_NO_CONTACT_RESPONSE);
        this._ghostStruct = {
            id: sharedIDCounter++,
            ghost,
            shape: ghostShape,
            wrappedShapes: [],
        };
        AmmoInstance.ghostStructs[this._ghostStruct.id] = this._ghostStruct;
        bt.CollisionObject_setUserIndex(this.ghost, this._ghostStruct.id);
        // if ((Ammo as any).CC_CONFIG.ignoreSelfBody && this._bodyStruct) this.ghost.setIgnoreCollisionCheck(this.body, true);
        if (this.wrappedBody) this.setGhostType(this.wrappedBody.rigidBody.type);
    }

    setType (v: ERigidBodyType) {
        this.setBodyType(v);
        this.setGhostType(v);
    }

    setBodyType (v: ERigidBodyType) {
        if (this._bodyStruct && this._wrappedBody) {
            const body = this._bodyStruct.body;
            const wrap = this._wrappedBody;
            const com = wrap.rigidBody;
            let m_bcf = bt.CollisionObject_getCollisionFlags(body);
            const localInertia = AmmoConstant.instance.VECTOR3_0;
            switch (v) {
            case ERigidBodyType.DYNAMIC:
                m_bcf &= (~AmmoCollisionFlags.CF_KINEMATIC_OBJECT);
                m_bcf &= (~AmmoCollisionFlags.CF_STATIC_OBJECT);
                bt.CollisionObject_setCollisionFlags(body, m_bcf);
                wrap.setMass(com.mass);
                wrap.useGravity(com.useGravity);
                wrap.setAllowSleep(com.allowSleep);
                break;
            case ERigidBodyType.KINEMATIC:
                bt.Vector3_setValue(localInertia, 0, 0, 0);
                bt.RigidBody_setMassProps(body, 0, localInertia);
                m_bcf |= AmmoCollisionFlags.CF_KINEMATIC_OBJECT;
                m_bcf &= (~AmmoCollisionFlags.CF_STATIC_OBJECT);
                bt.CollisionObject_setCollisionFlags(body, m_bcf);
                bt.CollisionObject_forceActivationState(body, AmmoCollisionObjectStates.DISABLE_DEACTIVATION);
                break;
            case ERigidBodyType.STATIC:
            default:
                bt.Vector3_setValue(localInertia, 0, 0, 0);
                bt.RigidBody_setMassProps(body, 0, localInertia);
                m_bcf |= AmmoCollisionFlags.CF_STATIC_OBJECT;
                m_bcf &= (~AmmoCollisionFlags.CF_KINEMATIC_OBJECT);
                bt.CollisionObject_setCollisionFlags(body, m_bcf);
                bt.CollisionObject_forceActivationState(body, AmmoCollisionObjectStates.ISLAND_SLEEPING);
                break;
            }
            this.dirty |= EAmmoSharedBodyDirty.BODY_RE_ADD;
        }
    }

    setGhostType (v: ERigidBodyType) {
        if (this._ghostStruct) {
            const ghost = this._ghostStruct.ghost;
            let m_gcf = bt.CollisionObject_getCollisionFlags(ghost);
            switch (v) {
            case ERigidBodyType.DYNAMIC:
            case ERigidBodyType.KINEMATIC:
                m_gcf &= (~AmmoCollisionFlags.CF_STATIC_OBJECT);
                m_gcf |= AmmoCollisionFlags.CF_KINEMATIC_OBJECT;
                bt.CollisionObject_setCollisionFlags(ghost, m_gcf);
                bt.CollisionObject_forceActivationState(ghost, AmmoCollisionObjectStates.DISABLE_DEACTIVATION);
                break;
            case ERigidBodyType.STATIC:
            default:
                m_gcf &= (~AmmoCollisionFlags.CF_KINEMATIC_OBJECT);
                m_gcf |= AmmoCollisionFlags.CF_STATIC_OBJECT;
                bt.CollisionObject_setCollisionFlags(ghost, m_gcf);
                bt.CollisionObject_forceActivationState(ghost, AmmoCollisionObjectStates.ISLAND_SLEEPING);
                break;
            }
            this.dirty |= EAmmoSharedBodyDirty.GHOST_RE_ADD;
        }
    }

    addShape (v: AmmoShape, isTrigger: boolean) {
        function switchShape (that: AmmoSharedBody, shape: Bullet.ptr) {
            bt.CollisionObject_setCollisionShape(that.body, shape);
            that.dirty |= EAmmoSharedBodyDirty.BODY_RE_ADD;
            if (that._wrappedBody && that._wrappedBody.isEnabled) {
                that._wrappedBody.setMass(that._wrappedBody.rigidBody.mass);
            }
        }

        if (isTrigger) {
            const index = this.ghostStruct.wrappedShapes.indexOf(v);
            if (index < 0) {
                this.ghostStruct.wrappedShapes.push(v);
                v.setCompound(this.ghostCompoundShape);
                this.ghostEnabled = true;
            }
        } else {
            const index = this.bodyStruct.wrappedShapes.indexOf(v);
            if (index < 0) {
                this.bodyStruct.wrappedShapes.push(v);
                if (this.bodyStruct.useCompound) {
                    v.setCompound(this.bodyCompoundShape);
                } else {
                    const l = this.bodyStruct.wrappedShapes.length;
                    if (l === 1 && !v.needCompound()) {
                        switchShape(this, v.impl);
                    } else {
                        this.bodyStruct.useCompound = true;
                        for (let i = 0; i < l; i++) {
                            const childShape = this.bodyStruct.wrappedShapes[i];
                            childShape.setCompound(this.bodyCompoundShape);
                        }
                        switchShape(this, this.bodyStruct.shape);
                    }
                }
                this.bodyEnabled = true;
            }
        }
    }

    removeShape (v: AmmoShape, isTrigger: boolean) {
        if (isTrigger) {
            const index = this.ghostStruct.wrappedShapes.indexOf(v);
            if (index >= 0) {
                fastRemoveAt(this.ghostStruct.wrappedShapes, index);
                v.setCompound(null);
                this.ghostEnabled = false;
            }
        } else {
            const index = this.bodyStruct.wrappedShapes.indexOf(v);
            if (index >= 0) {
                if (this.bodyStruct.useCompound) {
                    v.setCompound(null);
                } else {
                    bt.CollisionObject_setCollisionShape(this.body, AmmoConstant.instance.EMPTY_SHAPE);
                }
                bt.CollisionObject_activate(this.body, true);
                this.dirty |= EAmmoSharedBodyDirty.BODY_RE_ADD;
                fastRemoveAt(this.bodyStruct.wrappedShapes, index);
                this.bodyEnabled = false;
            }
        }
    }

    addJoint (v: AmmoConstraint, type: 0 | 1) {
        if (type) {
            const i = this.wrappedJoints1.indexOf(v);
            if (i < 0) this.wrappedJoints1.push(v);
        } else {
            const i = this.wrappedJoints0.indexOf(v);
            if (i < 0) this.wrappedJoints0.push(v);
        }
    }

    removeJoint (v: AmmoConstraint, type: 0 | 1) {
        if (type) {
            const i = this.wrappedJoints1.indexOf(v);
            if (i >= 0) fastRemoveAt(this.wrappedJoints1, i);
        } else {
            const i = this.wrappedJoints0.indexOf(v);
            if (i >= 0) fastRemoveAt(this.wrappedJoints0, i);
        }
    }

    updateDirty () {
        if (this.dirty) {
            if (this.bodyIndex >= 0 && this.dirty & EAmmoSharedBodyDirty.BODY_RE_ADD) this.updateBodyByReAdd();
            if (this.ghostIndex >= 0 && this.dirty & EAmmoSharedBodyDirty.GHOST_RE_ADD) this.updateGhostByReAdd();
            this.dirty = 0;
        }
    }

    syncSceneToPhysics () {
        if (this.node.hasChangedFlags) {
            const wt = bt.CollisionObject_getWorldTransform(this.body);
            cocos2BulletVec3(bt.Transform_getOrigin(wt), this.node.worldPosition);
            const wq = AmmoConstant.instance.QUAT_0;
            cocos2BulletQuat(wq, this.node.worldRotation);
            bt.Transform_setRotation(wt, wq);

            if (this.node.hasChangedFlags & TransformBit.SCALE) {
                this.syncBodyScale();
            }

            if (bt.CollisionObject_isKinematicObject(this.body)) {
                // Kinematic objects must be updated using motion state
                const ms = bt.RigidBody_getMotionState(this.body);
                if (ms) bt.MotionState_setWorldTransform(ms, wt);
            } else if (this.isBodySleeping()) bt.CollisionObject_activate(this.body);
        }
    }

    /**
     * TODO: use motion state
     */
    syncPhysicsToScene () {
        if (bt.CollisionObject_isStaticOrKinematicObject(this.body) || this.isBodySleeping()) {
            return;
        }

        const wq = AmmoConstant.instance.QUAT_0;
        const wt0 = AmmoConstant.instance.TRANSFORM;
        const ms = bt.RigidBody_getMotionState(this.body);
        bt.MotionState_getWorldTransform(ms, wt0);
        this.node.worldPosition = bullet2CocosVec3(v3_0, bt.Transform_getOrigin(wt0));
        bt.Transform_getRotationRef(wt0, wq);
        this.node.worldRotation = bullet2CocosQuat(quat_0, wq);

        // sync node to ghost
        if (this._ghostStruct) {
            const wt1 = bt.CollisionObject_getWorldTransform(this.ghost);
            cocos2BulletVec3(bt.Transform_getOrigin(wt1), this.node.worldPosition);
            cocos2BulletQuat(wq, this.node.worldRotation);
            bt.Transform_setRotation(wt1, wq);
        }
    }

    syncSceneToGhost () {
        if (this.node.hasChangedFlags) {
            const wq = AmmoConstant.instance.QUAT_0;
            const wt1 = bt.CollisionObject_getWorldTransform(this.ghost);
            cocos2BulletVec3(bt.Transform_getOrigin(wt1), this.node.worldPosition);
            cocos2BulletQuat(wq, this.node.worldRotation);
            bt.Transform_setRotation(wt1, wq);
            if (this.node.hasChangedFlags & TransformBit.SCALE) this.syncGhostScale();
            bt.CollisionObject_activate(this.ghost);
        }
    }

    syncInitialBody () {
        const wq = AmmoConstant.instance.QUAT_0;
        const wt = bt.CollisionObject_getWorldTransform(this.body);
        cocos2BulletVec3(bt.Transform_getOrigin(wt), this.node.worldPosition);
        cocos2BulletQuat(wq, this.node.worldRotation);
        bt.Transform_setRotation(wt, wq);
        this.syncBodyScale();
        bt.CollisionObject_activate(this.body);
    }

    syncInitialGhost () {
        const wq = AmmoConstant.instance.QUAT_0;
        const wt1 = bt.CollisionObject_getWorldTransform(this.ghost);
        cocos2BulletVec3(bt.Transform_getOrigin(wt1), this.node.worldPosition);
        cocos2BulletQuat(wq, this.node.worldRotation);
        bt.Transform_setRotation(wt1, wq);
        this.syncGhostScale();
        bt.CollisionObject_activate(this.body);
    }

    syncBodyScale () {
        for (let i = 0; i < this.bodyStruct.wrappedShapes.length; i++) {
            this.bodyStruct.wrappedShapes[i].updateScale();
        }
        for (let i = 0; i < this.wrappedJoints0.length; i++) {
            this.wrappedJoints0[i].updateScale0();
        }
        for (let i = 0; i < this.wrappedJoints1.length; i++) {
            this.wrappedJoints1[i].updateScale1();
        }
    }

    syncGhostScale () {
        for (let i = 0; i < this.ghostStruct.wrappedShapes.length; i++) {
            this.ghostStruct.wrappedShapes[i].updateScale();
        }
    }

    /**
     * see: https://pybullet.org/Bullet/phpBB3/viewtopic.php?f=9&t=5312&p=19094&hilit=how+to+change+group+mask#p19097
     */
    updateBodyByReAdd () {
        if (this.bodyIndex >= 0) {
            this.wrappedWorld.removeSharedBody(this);
            this.bodyIndex = this.wrappedWorld.bodies.length;
            this.wrappedWorld.addSharedBody(this);
        }
    }

    updateGhostByReAdd () {
        if (this.ghostIndex >= 0) {
            this.wrappedWorld.removeGhostObject(this);
            this.ghostIndex = this.wrappedWorld.ghosts.length;
            this.wrappedWorld.addGhostObject(this);
        }
    }

    private destroy () {
        AmmoSharedBody.sharedBodesMap.delete(this.node.uuid);
        (this.node as any) = null;
        (this.wrappedWorld as any) = null;
        if (this._bodyStruct) {
            const bodyStruct = this._bodyStruct;
            // Ammo.destroy(bodyStruct.localInertia);
            // Ammo.destroy(bodyStruct.worldQuat);
            // Ammo.destroy(bodyStruct.startTransform);
            // Ammo.destroy(bodyStruct.motionState);
            // Ammo.destroy(bodyStruct.rbInfo);
            // Ammo.destroy(bodyStruct.shape);
            // ammoDeletePtr(bodyStruct.shape, Ammo.btCollisionShape);
            // const body = Ammo.castObject(bodyStruct.body, Ammo.btRigidBody);
            // (body as any).wrapped = null;
            // Ammo.destroy(bodyStruct.body);
            // ammoDeletePtr(bodyStruct.body, Ammo.btRigidBody);
            // ammoDeletePtr(bodyStruct.body, Ammo.btCollisionObject);
            delete AmmoInstance.bodyStructs[bodyStruct.id];
            (this._bodyStruct as any) = null;
        }

        if (this._ghostStruct) {
            const ghostStruct = this._ghostStruct;
            // Ammo.destroy(ghostStruct.worldQuat);
            // Ammo.destroy(ghostStruct.shape);
            // ammoDeletePtr(ghostStruct.shape, Ammo.btCollisionShape);
            // Ammo.destroy(ghostStruct.ghost);
            delete AmmoInstance.bodyStructs[ghostStruct.id];
            (this._ghostStruct as any) = null;
        }
    }

    private isBodySleeping () {
        const state = bt.CollisionObject_getActivationState(this.body);
        return state === AmmoCollisionObjectStates.ISLAND_SLEEPING;
    }
}
