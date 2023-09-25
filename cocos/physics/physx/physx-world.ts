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
import { PhysicsMaterial, PhysicsRayResult, CollisionEventType, TriggerEventType, CharacterTriggerEventType,
    CharacterControllerContact,
    EPhysicsDrawFlags } from '../framework';
import { error, RecyclePool, js, IVec3Like, geometry, IQuatLike, Vec3, Quat, Color } from '../../core';
import { IBaseConstraint } from '../spec/i-physics-constraint';
import { PhysXRigidBody } from './physx-rigid-body';
import {
    addActorToScene, raycastAll, simulateScene, initializeWorld, raycastClosest, sweepClosest,
    gatherEvents, getWrapShape, PX, getContactDataOrByteOffset, sweepAll, getColorPXColor,
} from './physx-adapter';
import { PhysXSharedBody } from './physx-shared-body';
import { TupleDictionary } from '../utils/tuple-dictionary';
import { PhysXContactEquation } from './physx-contact-equation';
import { CollisionEventObject, TriggerEventObject, CharacterTriggerEventObject, VEC3_0 } from '../utils/util';
import { PhysXShape } from './shapes/physx-shape';
import { EFilterDataWord3 } from './physx-enum';
import { PhysXInstance } from './physx-instance';
import { Node } from '../../scene-graph';
import { PhysXCharacterController } from './character-controllers/physx-character-controller';
import { GeometryRenderer } from '../../rendering/geometry-renderer';
import { director } from '../../game';

const CC_QUAT_0 = new Quat();
const CC_V3_0 = new Vec3();
const CC_V3_1 = new Vec3();
const CC_V3_2 = new Vec3();
const CC_COLOR_0 = new Color(0, 0, 0, 0);
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

    private _debugLineCount = 0;
    private _MAX_DEBUG_LINE_COUNT = 16384;
    private _debugDrawFlags = EPhysicsDrawFlags.NONE;
    private _debugConstraintSize = 0.3;

    constructor () {
        super();
        initializeWorld(this);
    }

    destroy (): void {
        if (this.wrappedBodies.length) error('You should destroy all physics component first.');
        this.scene.release();
    }

    step (deltaTime: number, _timeSinceLastCalled?: number, _maxSubStep = 0): void {
        if (this.wrappedBodies.length === 0) return;
        this._simulate(deltaTime);
        if (!PX.MULTI_THREAD) {
            this._fetchResults();
            for (let i = 0; i < this.wrappedBodies.length; i++) {
                const body = this.wrappedBodies[i];
                body.syncPhysicsToScene();
            }
        }

        this._debugDraw();
    }

    private _simulate (dt: number): void {
        if (!this._isNeedFetch) {
            simulateScene(this.scene, dt);
            this._isNeedFetch = true;
        }
    }

    private _fetchResults (): void {
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

    get debugDrawFlags (): EPhysicsDrawFlags {
        return this._debugDrawFlags;
    }

    set debugDrawFlags (v: EPhysicsDrawFlags) {
        this._debugDrawFlags = v;
        this._setDebugDrawMode();
    }

    get debugDrawConstraintSize (): number {
        return this._debugConstraintSize;
    }

    set debugDrawConstraintSize (v) {
        this._debugConstraintSize = v;
        this._setDebugDrawMode();
    }

    private _setDebugDrawMode (): void {
        if (this._debugDrawFlags & EPhysicsDrawFlags.WIRE_FRAME) {
            this.scene.setVisualizationParameter(PX.PxVisualizationParameter.eCOLLISION_SHAPES, 1);
        } else {
            this.scene.setVisualizationParameter(PX.PxVisualizationParameter.eCOLLISION_SHAPES, 0);
        }

        const drawConstraint = Boolean(this._debugDrawFlags & EPhysicsDrawFlags.CONSTRAINT);
        const internalConstraintSize = drawConstraint ? this._debugConstraintSize : 0;
        this.scene.setVisualizationParameter(PX.PxVisualizationParameter.eJOINT_LOCAL_FRAMES, internalConstraintSize);
        this.scene.setVisualizationParameter(PX.PxVisualizationParameter.eJOINT_LIMITS, internalConstraintSize);

        if (this._debugDrawFlags & EPhysicsDrawFlags.AABB) {
            this.scene.setVisualizationParameter(PX.PxVisualizationParameter.eCOLLISION_AABBS, 1);
        } else {
            this.scene.setVisualizationParameter(PX.PxVisualizationParameter.eCOLLISION_AABBS, 0);
        }
    }

    private _getDebugRenderer (): GeometryRenderer|null {
        const cameras = director.root!.mainWindow?.cameras;
        if (!cameras) return null;
        if (cameras.length === 0) return null;
        if (!cameras[0]) return null;
        cameras[0].initGeometryRenderer();

        return cameras[0].geometryRenderer;
    }

    private _debugDraw (): void {
        const debugRenderer = this._getDebugRenderer();
        if (!debugRenderer) return;

        this._debugLineCount = 0;
        const rbPtr = this.scene.getRenderBufferPtr();//PxRenderBuffer
        const nbLine = PX.PxRenderBuffer_GetNbLines(rbPtr);
        for (let i = 0; i < nbLine; i++) {
            const linePtr = PX.PxRenderBuffer_GetLineAt(rbPtr, i) as number;//PxDebugLine
            this._onDebugDrawLine(linePtr);
        }
        const nbTriangle = PX.PxRenderBuffer_GetNbTriangles(rbPtr);
        for (let i = 0; i < nbTriangle; i++) {
            const trianglePtr = PX.PxRenderBuffer_GetTriangleAt(rbPtr, i) as number;//PxDebugTriangle
            this._onDebugDrawTriangle(trianglePtr);
        }
    }

    private _onDebugDrawLine (linePtr: number): void {
        const debugRenderer = this._getDebugRenderer();
        if (debugRenderer && this._debugLineCount < this._MAX_DEBUG_LINE_COUNT) {
            this._debugLineCount++;
            const f32RawPtr = PX.HEAPF32.subarray(linePtr / 4, linePtr / 4 + 3 * 8);
            const u32RawPtr = PX.HEAPU32.subarray(linePtr / 4, linePtr / 4 + 3 * 8);
            CC_V3_0.x = f32RawPtr[0];
            CC_V3_0.y = f32RawPtr[1];
            CC_V3_0.z = f32RawPtr[2];
            const color0 = u32RawPtr[3] as number;
            CC_V3_1.x = f32RawPtr[4];
            CC_V3_1.y = f32RawPtr[5];
            CC_V3_1.z = f32RawPtr[6];
            getColorPXColor(CC_COLOR_0, color0);
            debugRenderer.addLine(CC_V3_0, CC_V3_1, CC_COLOR_0);
        }
    }

    private _onDebugDrawTriangle (trianglePtr: number): void {
        const debugRenderer = this._getDebugRenderer();
        if (debugRenderer && (this._MAX_DEBUG_LINE_COUNT - this._debugLineCount) >= 3) {
            this._debugLineCount += 3;
            const f32RawPtr = PX.HEAPF32.subarray(trianglePtr / 4, trianglePtr / 4 + 3 * 12);
            const u32RawPtr = PX.HEAPU32.subarray(trianglePtr / 4, trianglePtr / 4 + 3 * 12);
            CC_V3_0.x = f32RawPtr[0];
            CC_V3_0.y = f32RawPtr[1];
            CC_V3_0.z = f32RawPtr[2];
            const color0 = u32RawPtr[3] as number;
            CC_V3_1.x = f32RawPtr[4];
            CC_V3_1.y = f32RawPtr[5];
            CC_V3_1.z = f32RawPtr[6];
            // const color1 = u32RawPtr[7] as number;
            CC_V3_2.x = f32RawPtr[8];
            CC_V3_2.y = f32RawPtr[9];
            CC_V3_2.z = f32RawPtr[10];
            // const color2 = u32RawPtr[11] as number;
            getColorPXColor(CC_COLOR_0, color0);
            debugRenderer.addLine(CC_V3_0, CC_V3_1, CC_COLOR_0);
            // getColorPXColor(CC_COLOR_0, color1);
            debugRenderer.addLine(CC_V3_1, CC_V3_2, CC_COLOR_0);
            // getColorPXColor(CC_COLOR_0, color2);
            debugRenderer.addLine(CC_V3_2, CC_V3_0, CC_COLOR_0);
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

    sweepBox (
        worldRay: geometry.Ray,
        halfExtent: IVec3Like,
        orientation: IQuatLike,
        options: IRaycastOptions,
        pool: RecyclePool<PhysicsRayResult>,
        results: PhysicsRayResult[],
    ): boolean {
        if (!PhysXWorld._sweepBoxGeometry) {
            PhysXWorld._sweepBoxGeometry = new PX.BoxGeometry(halfExtent);
        }
        PhysXWorld._sweepBoxGeometry.setHalfExtents(halfExtent);
        return sweepAll(this, worldRay, PhysXWorld._sweepBoxGeometry, orientation, options, pool, results);
    }

    sweepBoxClosest (
        worldRay: geometry.Ray,
        halfExtent: IVec3Like,
        orientation: IQuatLike,
        options: IRaycastOptions,
        result: PhysicsRayResult,
    ): boolean {
        if (!PhysXWorld._sweepBoxGeometry) {
            PhysXWorld._sweepBoxGeometry = new PX.BoxGeometry(halfExtent);
        }
        PhysXWorld._sweepBoxGeometry.setHalfExtents(halfExtent);
        return sweepClosest(this, worldRay, PhysXWorld._sweepBoxGeometry, orientation, options, result);
    }

    sweepSphere (
        worldRay: geometry.Ray,
        radius: number,
        options: IRaycastOptions,
        pool: RecyclePool<PhysicsRayResult>,
        results: PhysicsRayResult[],
    ): boolean {
        if (!PhysXWorld._sweepSphereGeometry) {
            PhysXWorld._sweepSphereGeometry = new PX.SphereGeometry(radius);
        }
        PhysXWorld._sweepSphereGeometry.setRadius(radius);
        return sweepAll(this, worldRay, PhysXWorld._sweepSphereGeometry, Quat.IDENTITY, options, pool, results);
    }

    sweepSphereClosest (
        worldRay: geometry.Ray,
        radius: number,
        options: IRaycastOptions,
        result: PhysicsRayResult,
    ): boolean {
        if (!PhysXWorld._sweepSphereGeometry) {
            PhysXWorld._sweepSphereGeometry = new PX.SphereGeometry(radius);
        }
        PhysXWorld._sweepSphereGeometry.setRadius(radius);
        return sweepClosest(this, worldRay, PhysXWorld._sweepSphereGeometry, Quat.IDENTITY, options, result);
    }

    sweepCapsule (
        worldRay: geometry.Ray,
        radius: number,
        height: number,
        orientation: IQuatLike,
        options: IRaycastOptions,
        pool: RecyclePool<PhysicsRayResult>,
        results: PhysicsRayResult[],
    ): boolean {
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

    sweepCapsuleClosest (
        worldRay: geometry.Ray,
        radius: number,
        height: number,
        orientation: IQuatLike,
        options: IRaycastOptions,
        result: PhysicsRayResult,
    ): boolean {
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
        PhysXCallback.emitCCTCollisionEvent();
        PhysXCallback.emitCCTTriggerEvent();
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

interface ITriggerEventItemCCT {
    a: PhysXShape,
    b: PhysXCharacterController,
    times: number,
}

const triggerEventBeginDic = new TupleDictionary();
const triggerEventEndDic = new TupleDictionary();
const triggerEventsPool: ITriggerEventItem[] = [];
const contactEventDic = new TupleDictionary();
const contactEventsPool: ICollisionEventItem[] = [];
const contactsPool: [] = [];
const cctShapeEventDic = new TupleDictionary();
const emitHit = new CharacterControllerContact();
const cctTriggerEventBeginDic = new TupleDictionary();
const cctTriggerEventEndDic = new TupleDictionary();
const cctTriggerEventsPool: ITriggerEventItemCCT[] = [];

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
            const wpa = getWrapShape<any>(a);
            const wpb = getWrapShape<any>(b);
            if (wpa instanceof PhysXShape && wpb instanceof PhysXShape) {
                PhysXCallback.onTrigger('onTriggerEnter', wpa, wpb, true);
            } else if (wpa instanceof PhysXShape && wpb instanceof PhysXCharacterController) {
                PhysXCallback.onTriggerCCT('onControllerTriggerEnter', wpa, wpb, true);
            } else if (wpa instanceof PhysXCharacterController && wpb instanceof PhysXShape) {
                PhysXCallback.onTriggerCCT('onControllerTriggerEnter', wpb, wpa, true);
            }
        },
        onTriggerEnd: (a: any, b: any): void => {
            const wpa = getWrapShape<any>(a);
            const wpb = getWrapShape<any>(b);
            if (wpa instanceof PhysXShape && wpb instanceof PhysXShape) {
                PhysXCallback.onTrigger('onTriggerExit', wpa, wpb, false);
            } else if (wpa instanceof PhysXShape && wpb instanceof PhysXCharacterController) {
                PhysXCallback.onTriggerCCT('onControllerTriggerExit', wpa, wpb, false);
            } else if (wpa instanceof PhysXCharacterController && wpb instanceof PhysXShape) {
                PhysXCallback.onTriggerCCT('onControllerTriggerExit', wpb, wpa, false);
            }
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

    onTriggerCCT (type: CharacterTriggerEventType, wpa: PhysXShape, cct: PhysXCharacterController, isEnter: boolean): void {
        if (wpa && cct) {
            if (wpa.collider.needTriggerEvent) {
                let tE: ITriggerEventItemCCT;
                if (cctTriggerEventsPool.length > 0) {
                    tE = cctTriggerEventsPool.pop() as ITriggerEventItemCCT;
                    tE.a = wpa; tE.b = cct; tE.times = 0;
                } else {
                    tE = { a: wpa, b: cct, times: 0 };
                }
                if (isEnter) {
                    cctTriggerEventBeginDic.set(wpa.id, cct.id, tE);
                } else {
                    cctTriggerEventEndDic.set(wpa.id, cct.id, tE);
                }
            }
        }
    },

    emitTriggerEvent (): void {
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
                item = cctShapeEventDic.set(
                    hit.getCurrentController(),
                    hit.getTouchedShape(),
                    { PhysXCharacterController: cct, PhysXShape: s, worldPos, worldNormal, motionDir, motionLength },
                );
            }
        },
        onControllerHit (hit: any): void { //PX.ControllersHit
        },
    },
    emitCCTCollisionEvent (): void {
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
    emitCCTTriggerEvent (): void {
        let len = cctTriggerEventEndDic.getLength();
        while (len--) {
            const key = cctTriggerEventEndDic.getKeyByIndex(len);
            const data = cctTriggerEventEndDic.getDataByKey<ITriggerEventItemCCT>(key);
            cctTriggerEventsPool.push(data);
            const dataBeg = cctTriggerEventBeginDic.getDataByKey<ITriggerEventItemCCT>(key);
            if (dataBeg) {
                cctTriggerEventsPool.push(dataBeg);
                cctTriggerEventBeginDic.set(data.a.id, data.b.id, null);
            }
            const collider = data.a.collider;
            const characterController = data.b.characterController;
            if (collider && characterController) {
                const type: CharacterTriggerEventType = 'onControllerTriggerExit';
                CharacterTriggerEventObject.type = type;
                if (collider.needTriggerEvent) {
                    CharacterTriggerEventObject.collider = collider;
                    CharacterTriggerEventObject.characterController = characterController;
                    collider.emit(type, CharacterTriggerEventObject);
                }
                if (characterController.needTriggerEvent) {
                    CharacterTriggerEventObject.collider = collider;
                    CharacterTriggerEventObject.characterController = characterController;
                    characterController.emit(type, CharacterTriggerEventObject);
                }
            }
        }
        cctTriggerEventEndDic.reset();

        len = cctTriggerEventBeginDic.getLength();
        while (len--) {
            const key = cctTriggerEventBeginDic.getKeyByIndex(len);
            const data = cctTriggerEventBeginDic.getDataByKey<ITriggerEventItemCCT>(key);
            const collider = data.a.collider;
            const characterController = data.b.characterController;
            if (!collider || !collider.isValid || !characterController || !characterController.isValid) {
                cctTriggerEventsPool.push(data);
                cctTriggerEventBeginDic.set(data.a.id, data.b.id, null);
            } else {
                const type: CharacterTriggerEventType = data.times++ ? 'onControllerTriggerStay' : 'onControllerTriggerEnter';
                CharacterTriggerEventObject.type = type;
                if (collider.needTriggerEvent) {
                    CharacterTriggerEventObject.collider = collider;
                    CharacterTriggerEventObject.characterController = characterController;
                    collider.emit(type, CharacterTriggerEventObject);
                }
                if (characterController.needTriggerEvent) {
                    CharacterTriggerEventObject.collider = collider;
                    CharacterTriggerEventObject.characterController = characterController;
                    characterController.emit(type, CharacterTriggerEventObject);
                }
            }
        }
    },
};
