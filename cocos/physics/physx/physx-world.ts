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

/**
 * @packageDocumentation
 * @hidden
 */

/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Ray } from '../../core/geometry';
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { PhysicsMaterial, PhysicsRayResult, CollisionEventType, TriggerEventType } from '../framework';
import { error, Node, RecyclePool } from '../../core';
import { IVec3Like } from '../../core/math/type-define';
import { IBaseConstraint } from '../spec/i-physics-constraint';
import { PhysXRigidBody } from './physx-rigid-body';
import {
    addActorToScene, raycastAll, simulateScene, initializeWorld, raycastClosest,
    gatherEvents, getWrapShape, PX, getContactDataOrByteOffset,
} from './physx-adapter';
import { PhysXSharedBody } from './physx-shared-body';
import { fastRemoveAt } from '../../core/utils/array';
import { TupleDictionary } from '../utils/tuple-dictionary';
import { PhysXContactEquation } from './physx-contact-equation';
import { CollisionEventObject, TriggerEventObject } from '../utils/util';
import { PhysXShape } from './shapes/physx-shape';
import { EFilterDataWord3 } from './physx-enum';

export class PhysXWorld implements IPhysicsWorld {
    setAllowSleep (_v: boolean): void { }
    setDefaultMaterial (_v: PhysicsMaterial): void { }
    setGravity (gravity: IVec3Like): void {
        this.scene.setGravity(gravity);
    }

    static foundation: any;
    static physics: any;
    static cooking: any;
    static pvd: any;
    static queryfilterData: any;
    static singleResult: any;
    static mutipleResults: any;
    static simulationCB: any;
    static queryFilterCB: any;
    static mutipleResultSize = 12;

    get impl (): any { return this.scene; }
    readonly scene: any;
    readonly callback = PhysXCallback;
    readonly wrappedBodies: PhysXSharedBody[] = [];

    private _isNeedFetch = false;

    constructor () {
        initializeWorld(this);
    }

    destroy (): void {
        if (this.wrappedBodies.length) error('You should destroy all physics component first.');
        this.scene.release();
    }

    step (deltaTime: number, _timeSinceLastCalled?: number, _maxSubStep = 0): void {
        this._simulate(deltaTime);
        if (!PX.MULTI_THREAD) {
            this._fetchResults();
            for (let i = 0; i < this.wrappedBodies.length; i++) {
                const body = this.wrappedBodies[i];
                body.syncPhysicsToScene();
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
            fastRemoveAt(this.wrappedBodies, index);
        }
    }

    addConstraint (_constraint: IBaseConstraint): void { }

    removeConstraint (_constraint: IBaseConstraint): void { }

    raycast (worldRay: Ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        return raycastAll(this, worldRay, options, pool, results);
    }

    raycastClosest (worldRay: Ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        return raycastClosest(this, worldRay, options, result);
    }

    emitEvents (): void {
        gatherEvents(this);
        PhysXCallback.emitTriggerEvent();
        PhysXCallback.emitCollisionEvent();
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
};
