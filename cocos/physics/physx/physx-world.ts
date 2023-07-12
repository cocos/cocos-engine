/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { PhysicsMaterial, PhysicsRayResult, CollisionEventType, TriggerEventType, CharacterControllerContact } from '../framework';
import { error, RecyclePool, js, IVec3Like, geometry, IQuatLike, Vec3, Quat } from '../../core';
import { IBaseConstraint } from '../spec/i-physics-constraint';
import { PhysXRigidBody } from './physx-rigid-body';
import {
    addActorToScene, raycastAll, simulateScene, initializeWorld, raycastClosest, sweepClosest,
    gatherEvents, getWrapShape, PX, getContactDataOrByteOffset, sweepAll,
} from './physx-adapter';
import { PhysXSharedBody } from './physx-shared-body';
import { TupleDictionary } from '../utils/tuple-dictionary';
import { PhysXContactEquation } from './physx-contact-equation';
import { CollisionEventObject, TriggerEventObject, VEC3_0 } from '../utils/util';
import { PhysXShape } from './shapes/physx-shape';
import { EFilterDataWord3 } from './physx-enum';
import { PhysXInstance } from './physx-instance';
import { Node } from '../../scene-graph';
import { PhysXCharacterController } from './character-controllers/physx-character-controller';

const CC_QUAT_0 = new Quat();

export class PhysXWorld extends PhysXInstance implements IPhysicsWorld {
    setAllowSleep (_v: boolean): void { }
    setDefaultMaterial (_v: PhysicsMaterial): void { }
    setGravity (gravity: IVec3Like): void {
        this.scene.setGravity(gravity);
    }

    get impl (): any { return this.scene; }
    readonly scene: any;
    readonly callback = PhysXCallback;
    readonly wrappedBodies: PhysXSharedBody[] = [];
    readonly ccts: PhysXCharacterController[] = [];

    controllerManager: any;

    private _isNeedFetch = false;

    private static _sweepBoxGeometry: any;
    private static _sweepSphereGeometry: any;
    private static _sweepCapsuleGeometry: any;

    constructor () {
        super();
        initializeWorld(this);
    }

    destroy (): void {
        if (this.wrappedBodies.length) error('You should destroy all physics component first.');
        this.scene.release();
    }

    step (deltaTime: number, _timeSinceLastCalled?: number, _maxSubStep = 0): void {
        if (this.wrappedBodies.length === 0 && this.ccts.length === 0) return;
        this._simulate(deltaTime);
        if (!PX.MULTI_THREAD) {
            this._fetchResults();
            for (let i = 0; i < this.wrappedBodies.length; i++) {
                const body = this.wrappedBodies[i];
                body.syncPhysicsToScene();
            }
            const ccts = this.ccts;
            const length = ccts.length;
            for (let i = 0; i < length; i++) {
                const cct = ccts[i];
                cct.syncPhysicsToScene();
            }
        }
    }

    private _simulate (dt: number) {
        if (!this._isNeedFetch) {
            simulateScene(this.scene, dt);
            this._isNeedFetch = true;
        }
    }

    private _fetchResults () {
        if (this._isNeedFetch) {
            this.scene.fetchResults(true);
            this._isNeedFetch = false;
        }
    }

    syncSceneToPhysics (): void {
        for (let i = 0; i < this.wrappedBodies.length; i++) {
            const body = this.wrappedBodies[i];
            body.syncSceneToPhysics();
        }
        const ccts = this.ccts;
        const length = ccts.length;
        for (let i = 0; i < length; i++) {
            const cct = ccts[i];
            cct.syncSceneToPhysics();
        }
    }

    // only used in muti-thread for now
    syncPhysicsToScene (): void {
        this._fetchResults();
        for (let i = 0; i < this.wrappedBodies.length; i++) {
            const body = this.wrappedBodies[i];
            body.syncPhysicsToScene();
        }
    }

    syncAfterEvents (): void {
        for (let i = 0; i < this.wrappedBodies.length; i++) {
            const body = this.wrappedBodies[i];
            body.syncSceneWithCheck();
        }
    }

    getSharedBody (node: Node, wrappedBody?: PhysXRigidBody): PhysXSharedBody {
        return PhysXSharedBody.getSharedBody(node, this, wrappedBody);
    }

    addActor (body: PhysXSharedBody): void {
        const index = this.wrappedBodies.indexOf(body);
        if (index < 0) {
            addActorToScene(this.scene, body.impl);
            this.wrappedBodies.push(body);
        }
    }

    removeActor (body: PhysXSharedBody): void {
        const index = this.wrappedBodies.indexOf(body);
        if (index >= 0) {
            this.scene.removeActor(body.impl, true);
            js.array.fastRemoveAt(this.wrappedBodies, index);
        }
    }

    addCCT (cct: PhysXCharacterController): void {
        const index = this.ccts.indexOf(cct);
        if (index < 0) {
            this.ccts.push(cct);
        }
    }

    removeCCT (cct: PhysXCharacterController): void {
        const index = this.ccts.indexOf(cct);
        if (index >= 0) {
            js.array.fastRemoveAt(this.ccts, index);
        }
    }

    addConstraint (_constraint: IBaseConstraint): void { }

    removeConstraint (_constraint: IBaseConstraint): void { }

    raycast (worldRay: geometry.Ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        return raycastAll(this, worldRay, options, pool, results);
    }

    raycastClosest (worldRay: geometry.Ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        return raycastClosest(this, worldRay, options, result);
    }

    sweepBox (worldRay: geometry.Ray, halfExtent: IVec3Like, orientation: IQuatLike,
        options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        if (!PhysXWorld._sweepBoxGeometry) {
            PhysXWorld._sweepBoxGeometry = new PX.BoxGeometry(halfExtent);
        }
        PhysXWorld._sweepBoxGeometry.setHalfExtents(halfExtent);
        return sweepAll(this, worldRay, PhysXWorld._sweepBoxGeometry, orientation, options, pool, results);
    }

    sweepBoxClosest (worldRay: geometry.Ray, halfExtent: IVec3Like, orientation: IQuatLike,
        options: IRaycastOptions, result: PhysicsRayResult): boolean {
        if (!PhysXWorld._sweepBoxGeometry) {
            PhysXWorld._sweepBoxGeometry = new PX.BoxGeometry(halfExtent);
        }
        PhysXWorld._sweepBoxGeometry.setHalfExtents(halfExtent);
        return sweepClosest(this, worldRay, PhysXWorld._sweepBoxGeometry, orientation, options, result);
    }

    sweepSphere (worldRay: geometry.Ray, radius: number,
        options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        if (!PhysXWorld._sweepSphereGeometry) {
            PhysXWorld._sweepSphereGeometry = new PX.SphereGeometry(radius);
        }
        PhysXWorld._sweepSphereGeometry.setRadius(radius);
        return sweepAll(this, worldRay, PhysXWorld._sweepSphereGeometry, Quat.IDENTITY, options, pool, results);
    }

    sweepSphereClosest (worldRay: geometry.Ray, radius: number,
        options: IRaycastOptions, result: PhysicsRayResult): boolean {
        if (!PhysXWorld._sweepSphereGeometry) {
            PhysXWorld._sweepSphereGeometry = new PX.SphereGeometry(radius);
        }
        PhysXWorld._sweepSphereGeometry.setRadius(radius);
        return sweepClosest(this, worldRay, PhysXWorld._sweepSphereGeometry, Quat.IDENTITY, options, result);
    }

    sweepCapsule (worldRay: geometry.Ray, radius: number, height: number, orientation: IQuatLike,
        options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        if (!PhysXWorld._sweepCapsuleGeometry) {
            PhysXWorld._sweepCapsuleGeometry = new PX.CapsuleGeometry(radius, height / 2);
        }
        PhysXWorld._sweepCapsuleGeometry.setRadius(radius);
        PhysXWorld._sweepCapsuleGeometry.setHalfHeight(height / 2);
        //add an extra 90 degree rotation to PxCapsuleGeometry whose axis is originally along the X axis
        const finalOrientation = CC_QUAT_0;
        Quat.fromEuler(finalOrientation, 0, 0, 90);
        Quat.multiply(finalOrientation, orientation, finalOrientation);
        return sweepAll(this, worldRay, PhysXWorld._sweepCapsuleGeometry, finalOrientation, options, pool, results);
    }

    sweepCapsuleClosest (worldRay: geometry.Ray, radius: number, height: number, orientation: IQuatLike,
        options: IRaycastOptions, result: PhysicsRayResult): boolean {
        if (!PhysXWorld._sweepCapsuleGeometry) {
            PhysXWorld._sweepCapsuleGeometry = new PX.CapsuleGeometry(radius, height / 2);
        }
        PhysXWorld._sweepCapsuleGeometry.setRadius(radius);
        PhysXWorld._sweepCapsuleGeometry.setHalfHeight(height / 2);
        //add an extra 90 degree rotation to PxCapsuleGeometry whose axis is originally along the X axis
        const finalOrientation = CC_QUAT_0;
        Quat.fromEuler(finalOrientation, 0, 0, 90);
        Quat.multiply(finalOrientation, orientation, finalOrientation);
        return sweepClosest(this, worldRay, PhysXWorld._sweepCapsuleGeometry, finalOrientation, options, result);
    }

    emitEvents (): void {
        gatherEvents(this);
        PhysXCallback.emitTriggerEvent();
        PhysXCallback.emitCollisionEvent();
        PhysXCallback.emitCCTShapeEvent();
    }
}

///
/// Event Callback
///

interface ITriggerEventItem {
    a: PhysXShape,
    b: PhysXShape,
    times: number,
}

interface ICollisionEventItem {
    type: CollisionEventType,
    a: PhysXShape,
    b: PhysXShape,
    contactCount: number,
    buffer: any,
    offset: number,
}

const triggerEventBeginDic = new TupleDictionary();
const triggerEventEndDic = new TupleDictionary();
const triggerEventsPool: ITriggerEventItem[] = [];
const contactEventDic = new TupleDictionary();
const contactEventsPool: ICollisionEventItem[] = [];
const contactsPool: [] = [];
const cctShapeEventDic = new TupleDictionary();
const emitHit = new CharacterControllerContact();

const PhysXCallback = {
    eventCallback: {
        onContactBegin: (a: any, b: any, c: any, d: any, o: number): void => {
            const wpa = getWrapShape<PhysXShape>(a);
            const wpb = getWrapShape<PhysXShape>(b);
            PhysXCallback.onCollision('onCollisionEnter', wpa, wpb, c, d, o);
        },
        onContactEnd: (a: any, b: any, c: any, d: any, o: number): void => {
            const wpa = getWrapShape<PhysXShape>(a);
            const wpb = getWrapShape<PhysXShape>(b);
            PhysXCallback.onCollision('onCollisionExit', wpa, wpb, c, d, o);
        },
        onContactPersist: (a: any, b: any, c: any, d: any, o: number): void => {
            const wpa = getWrapShape<PhysXShape>(a);
            const wpb = getWrapShape<PhysXShape>(b);
            PhysXCallback.onCollision('onCollisionStay', wpa, wpb, c, d, o);
        },
        onTriggerBegin: (a: any, b: any): void => {
            const wpa = getWrapShape<PhysXShape>(a);
            const wpb = getWrapShape<PhysXShape>(b);
            PhysXCallback.onTrigger('onTriggerEnter', wpa, wpb, true);
        },
        onTriggerEnd: (a: any, b: any): void => {
            const wpa = getWrapShape<PhysXShape>(a);
            const wpb = getWrapShape<PhysXShape>(b);
            PhysXCallback.onTrigger('onTriggerExit', wpa, wpb, false);
        },
    },

    // eNONE = 0,   //!< the query should ignore this shape
    // eTOUCH = 1,  //!< a hit on the shape touches the intersection geometry of the query but does not block it
    // eBLOCK = 2   //!< a hit on the shape blocks the query (does not block overlap queries)
    queryCallback: {
        preFilter (filterData: any, shape: any, _actor: any, _out: any): number {
            const word3 = filterData.word3;
            const shapeFlags = shape.getFlags();
            if ((word3 & EFilterDataWord3.QUERY_CHECK_TRIGGER)
                && (shapeFlags.isSet(PX.ShapeFlag.eTRIGGER_SHAPE))) {
                return PX.QueryHitType.eNONE;
            }
            return word3 & EFilterDataWord3.QUERY_SINGLE_HIT ? PX.QueryHitType.eBLOCK : PX.QueryHitType.eTOUCH;
        },
        preFilterForByteDance (filterData: FilterData, shapeFlags: number, hitFlags: number): number {
            const word3 = filterData.word3;
            if ((word3 & EFilterDataWord3.QUERY_CHECK_TRIGGER)
                && (shapeFlags & PX.ShapeFlag.eTRIGGER_SHAPE)) {
                return PX.QueryHitType.eNONE;
            }
            return word3 & EFilterDataWord3.QUERY_SINGLE_HIT ? PX.QueryHitType.eBLOCK : PX.QueryHitType.eTOUCH;
        },
    },

    onTrigger (type: TriggerEventType, wpa: PhysXShape, wpb: PhysXShape, isEnter: boolean): void {
        if (wpa && wpb) {
            if (wpa.collider.needTriggerEvent || wpb.collider.needTriggerEvent) {
                let tE: ITriggerEventItem;
                if (triggerEventsPool.length > 0) {
                    tE = triggerEventsPool.pop() as ITriggerEventItem;
                    tE.a = wpa; tE.b = wpb; tE.times = 0;
                } else {
                    tE = { a: wpa, b: wpb, times: 0 };
                }
                if (isEnter) {
                    triggerEventBeginDic.set(wpa.id, wpb.id, tE);
                } else {
                    triggerEventEndDic.set(wpa.id, wpb.id, tE);
                }
            }
        }
    },

    emitTriggerEvent () {
        let len = triggerEventEndDic.getLength();
        while (len--) {
            const key = triggerEventEndDic.getKeyByIndex(len);
            const data = triggerEventEndDic.getDataByKey<ITriggerEventItem>(key);
            triggerEventsPool.push(data);
            const dataBeg = triggerEventBeginDic.getDataByKey<ITriggerEventItem>(key);
            if (dataBeg) {
                triggerEventsPool.push(dataBeg);
                triggerEventBeginDic.set(data.a.id, data.b.id, null);
            }
            const colliderA = data.a.collider;
            const colliderB = data.b.collider;
            if (colliderA && colliderB) {
                const type: TriggerEventType = 'onTriggerExit';
                TriggerEventObject.type = type;
                if (colliderA.needTriggerEvent) {
                    TriggerEventObject.selfCollider = colliderA;
                    TriggerEventObject.otherCollider = colliderB;
                    colliderA.emit(type, TriggerEventObject);
                }
                if (colliderB.needTriggerEvent) {
                    TriggerEventObject.selfCollider = colliderB;
                    TriggerEventObject.otherCollider = colliderA;
                    colliderB.emit(type, TriggerEventObject);
                }
            }
        }
        triggerEventEndDic.reset();

        len = triggerEventBeginDic.getLength();
        while (len--) {
            const key = triggerEventBeginDic.getKeyByIndex(len);
            const data = triggerEventBeginDic.getDataByKey<ITriggerEventItem>(key);
            const colliderA = data.a.collider;
            const colliderB = data.b.collider;
            if (!colliderA || !colliderA.isValid || !colliderB || !colliderB.isValid) {
                triggerEventsPool.push(data);
                triggerEventBeginDic.set(data.a.id, data.b.id, null);
            } else {
                const type: TriggerEventType = data.times++ ? 'onTriggerStay' : 'onTriggerEnter';
                TriggerEventObject.type = type;
                if (colliderA.needTriggerEvent) {
                    TriggerEventObject.selfCollider = colliderA;
                    TriggerEventObject.otherCollider = colliderB;
                    colliderA.emit(type, TriggerEventObject);
                }
                if (colliderB.needTriggerEvent) {
                    TriggerEventObject.selfCollider = colliderB;
                    TriggerEventObject.otherCollider = colliderA;
                    colliderB.emit(type, TriggerEventObject);
                }
            }
        }
    },

    /**
     * @param c the contact count, how many the contacts in this pair
     * @param d the contact buffer, the buffer stores all contacts
     * @param o the data offset, the first contact offset in the contact buffer
     */
    onCollision (type: CollisionEventType, wpa: PhysXShape, wpb: PhysXShape, c: number, d: any, o: number): void {
        if (wpa && wpb) {
            if (wpa.collider.needCollisionEvent || wpb.collider.needCollisionEvent) {
                if (contactEventsPool.length > 0) {
                    const cE = contactEventsPool.pop() as ICollisionEventItem;
                    cE.type = type; cE.a = wpa; cE.b = wpb; cE.contactCount = c; cE.buffer = d; cE.offset = o;
                    contactEventDic.set(wpa.id, wpb.id, cE);
                } else {
                    const cE: ICollisionEventItem = { type, a: wpa, b: wpb, contactCount: c, buffer: d, offset: o };
                    contactEventDic.set(wpa.id, wpb.id, cE);
                }
            }
        }
    },

    emitCollisionEvent (): void {
        let len = contactEventDic.getLength();
        while (len--) {
            const key = contactEventDic.getKeyByIndex(len);
            const data = contactEventDic.getDataByKey<ICollisionEventItem>(key);
            contactEventsPool.push(data);
            const colliderA = data.a.collider;
            const colliderB = data.b.collider;
            if (colliderA && colliderA.isValid && colliderB && colliderB.isValid) {
                CollisionEventObject.type = data.type;
                CollisionEventObject.impl = data.buffer;
                const c = data.contactCount; const d = data.buffer; const o = data.offset;
                const contacts = CollisionEventObject.contacts;
                contactsPool.push.apply(contactsPool, contacts as any);
                contacts.length = 0;
                for (let i = 0; i < c; i++) {
                    if (contactsPool.length > 0) {
                        const c = contactsPool.pop() as unknown as PhysXContactEquation;
                        c.colliderA = colliderA; c.colliderB = colliderB;
                        c.impl = getContactDataOrByteOffset(i, o); contacts.push(c);
                    } else {
                        const c = new PhysXContactEquation(CollisionEventObject);
                        c.colliderA = colliderA; c.colliderB = colliderB;
                        c.impl = getContactDataOrByteOffset(i, o); contacts.push(c);
                    }
                }
                if (colliderA.needCollisionEvent) {
                    CollisionEventObject.selfCollider = colliderA;
                    CollisionEventObject.otherCollider = colliderB;
                    colliderA.emit(CollisionEventObject.type, CollisionEventObject);
                }
                if (colliderB.needCollisionEvent) {
                    CollisionEventObject.selfCollider = colliderB;
                    CollisionEventObject.otherCollider = colliderA;
                    colliderB.emit(CollisionEventObject.type, CollisionEventObject);
                }
            }
        }
        contactEventDic.reset();
    },
    controllerHitReportCB: {
        onShapeHit (hit: any): void { //PX.ControllerShapeHit
            const cct = getWrapShape<PhysXCharacterController>(hit.getCurrentController());
            const s = getWrapShape<PhysXShape>(hit.getTouchedShape());
            let item = cctShapeEventDic.get<any>(hit.getCurrentController(), hit.getTouchedShape());
            if (!item) {
                const worldPos = new Vec3();
                worldPos.set(hit.worldPos.x, hit.worldPos.y, hit.worldPos.z);
                const worldNormal = new Vec3();
                worldNormal.set(hit.worldNormal.x, hit.worldNormal.y, hit.worldNormal.z);
                const motionDir = new Vec3();
                motionDir.set(hit.dir.x, hit.dir.y, hit.dir.z);
                const motionLength = hit.length;
                item = cctShapeEventDic.set(hit.getCurrentController(), hit.getTouchedShape(),
                    { PhysXCharacterController: cct, PhysXShape: s, worldPos, worldNormal, motionDir, motionLength });
            }
        },
        onControllerHit (hit: any): void { //PX.ControllersHit
        },
    },
    emitCCTShapeEvent (): void {
        let dicL = cctShapeEventDic.getLength();
        while (dicL--) {
            const key = cctShapeEventDic.getKeyByIndex(dicL);
            const data = cctShapeEventDic.getDataByKey<any>(key);
            const cct = data.PhysXCharacterController.characterController;
            const collider = data.PhysXShape.collider;
            if (cct && cct.isValid && collider && collider.isValid) {
                emitHit.controller = cct;
                emitHit.collider = collider;
                emitHit.worldPosition.set(data.worldPos);
                emitHit.worldNormal.set(data.worldNormal);
                emitHit.motionDirection.set(data.motionDir);
                emitHit.motionLength = data.motionLength;
                cct.emit('onControllerColliderHit', emitHit);
            }
        }
        cctShapeEventDic.reset();
    },
};
