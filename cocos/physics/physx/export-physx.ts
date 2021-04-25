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

/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-tabs */

import { BYTEDANCE } from 'internal:constants';
// import PhysX from '@cocos/physx';
import { IQuatLike, IVec3Like, Node, Quat, RecyclePool, Vec3 } from '../../core';
import { shrinkPositions } from '../utils/util';
import { legacyCC } from '../../core/global-exports';
import { AABB, Ray } from '../../core/geometry';
import { IRaycastOptions } from '../spec/i-physics-world';
import { PhysicsRayResult } from '../framework';
import { PhysXWorld } from './physx-world';
import { PhysXShape } from './shapes/physx-shape';

let USE_BYTEDANCE = false;
if (BYTEDANCE) USE_BYTEDANCE = true;
const globalThis = legacyCC._global;
// globalThis.PhysX = PhysX;

if (globalThis.PhysX) {
    globalThis.PhysX = (PhysX as any)({
        onRuntimeInitialized () {
            console.log('PhysX loaded');
            // adapt
            PX.VECTOR_MAT = new PX.PxMaterialVector();
            PX.QueryHitType = PX.PxQueryHitType;
            PX.ShapeFlag = PX.PxShapeFlag;
            PX.ActorFlag = PX.PxActorFlag;
            PX.RigidBodyFlag = PX.PxRigidBodyFlag;
            PX.RigidDynamicLockFlag = PX.PxRigidDynamicLockFlag;
            PX.CombineMode = PX.PxCombineMode;
            PX.ForceMode = PX.PxForceMode;
            PX.SphereGeometry = PX.PxSphereGeometry;
            PX.BoxGeometry = PX.PxBoxGeometry;
            PX.CapsuleGeometry = PX.PxCapsuleGeometry;
            PX.PlaneGeometry = PX.PxPlaneGeometry;
            PX.ConvexMeshGeometry = PX.PxConvexMeshGeometry;
            PX.TriangleMeshGeometry = PX.PxTriangleMeshGeometry;
            PX.MeshScale = PX.PxMeshScale;
            PX.createRevoluteJoint = (a: any, b: any, c: any, d: any): any => PX.PxRevoluteJointCreate(PX.physics, a, b, c, d);
            PX.createDistanceJoint = (a: any, b: any, c: any, d: any): any => PX.PxDistanceJointCreate(PX.physics, a, b, c, d);
        },
    });
}

let _px = globalThis.PhysX as any;
if (USE_BYTEDANCE && globalThis && globalThis.tt.getPhy) _px = globalThis.tt.getPhy();
export const PX = _px;

if (PX) {
    PX.CACHE_MAT = {};
    PX.IMPL_PTR = {};
    PX.MESH_CONVEX = {};
    PX.MESH_STATIC = {};
    PX.TERRAIN_STATIC = {};
}

/// enum ///

export enum EFilterDataWord3 {
    QUERY_FILTER = 1 << 0,
    QUERY_CHECK_TRIGGER = 1 << 1,
    QUERY_SINGLE_HIT = 1 << 2,
    DETECT_TRIGGER_EVENT = 1 << 3,
    DETECT_CONTACT_EVENT = 1 << 4,
    DETECT_CONTACT_POINT = 1 << 5,
    DETECT_CONTACT_CCD = 1 << 6,
}

export enum PxHitFlag {
    ePOSITION					= (1 << 0),	//! < "position" member of #PxQueryHit is valid
    eNORMAL						= (1 << 1),	//! < "normal" member of #PxQueryHit is valid
    eUV							= (1 << 3),	//! < "u" and "v" barycentric coordinates of #PxQueryHit are valid. Not applicable to sweep queries.
    eASSUME_NO_INITIAL_OVERLAP	= (1 << 4),	//! < Performance hint flag for sweeps when it is known upfront there's no initial overlap.
                                            //! < NOTE: using this flag may cause undefined results if shapes are initially overlapping.
    eMESH_MULTIPLE				= (1 << 5),	//! < Report all hits for meshes rather than just the first. Not applicable to sweep queries.
    eMESH_ANY					= (1 << 6),	//! < Report any first hit for meshes. If neither eMESH_MULTIPLE nor eMESH_ANY is specified,
                                            //! < a single closest hit will be reported for meshes.
    eMESH_BOTH_SIDES			= (1 << 7),	//! < Report hits with back faces of mesh triangles. Also report hits for raycast
                                            //! < originating on mesh surface and facing away from the surface normal. Not applicable to sweep queries.
                                            //! < Please refer to the user guide for heightfield-specific differences.
    ePRECISE_SWEEP				= (1 << 8),	//! < Use more accurate but slower narrow phase sweep tests.
                                            //! < May provide better compatibility with PhysX 3.2 sweep behavior.
    eMTD						= (1 << 9),	//! < Report the minimum translation depth, normal and contact point.
    eFACE_INDEX					= (1 << 10),	//! < "face index" member of #PxQueryHit is valid

    eDEFAULT					= PxHitFlag.ePOSITION | PxHitFlag.eNORMAL | PxHitFlag.eFACE_INDEX,

    /** \brief Only this subset of flags can be modified by pre-filter. Other modifications will be discarded. */
    eMODIFIABLE_FLAGS			= PxHitFlag.eMESH_MULTIPLE | PxHitFlag.eMESH_BOTH_SIDES | PxHitFlag.eASSUME_NO_INITIAL_OVERLAP | PxHitFlag.ePRECISE_SWEEP
}

export enum PxQueryFlag
{
    eSTATIC				= (1 << 0),	//! < Traverse static shapes

    eDYNAMIC			= (1 << 1),	//! < Traverse dynamic shapes

    ePREFILTER			= (1 << 2),	//! < Run the pre-intersection-test filter (see #PxQueryFilterCallback::preFilter())

    ePOSTFILTER			= (1 << 3),	//! < Run the post-intersection-test filter (see #PxQueryFilterCallback::postFilter())

    eANY_HIT			= (1 << 4),	//! < Abort traversal as soon as any hit is found and return it via callback.block.
                                    //! < Helps query performance. Both eTOUCH and eBLOCK hitTypes are considered hits with this flag.

    eNO_BLOCK			= (1 << 5),	//! < All hits are reported as touching. Overrides eBLOCK returned from user filters with eTOUCH.
                                    //! < This is also an optimization hint that may improve query performance.

    eRESERVED			= (1 << 15)	//! < Reserved for internal use
}

export enum PxPairFlag
{
    /**
    \brief Process the contacts of this collision pair in the dynamics solver.

    \note Only takes effect if the colliding actors are rigid bodies.
    */
    eSOLVE_CONTACT						= (1 << 0),

    /**
    \brief Call contact modification callback for this collision pair

    \note Only takes effect if the colliding actors are rigid bodies.

    @see PxContactModifyCallback
    */
    eMODIFY_CONTACTS					= (1 << 1),

    /**
    \brief Call contact report callback or trigger callback when this collision pair starts to be in contact.

    If one of the two collision objects is a trigger shape (see #PxShapeFlag::eTRIGGER_SHAPE)
    then the trigger callback will get called as soon as the other object enters the trigger volume.
    If none of the two collision objects is a trigger shape then the contact report callback will get
    called when the actors of this collision pair start to be in contact.

    \note Only takes effect if the colliding actors are rigid bodies.

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact() PxSimulationEventCallback.onTrigger()
    */
    eNOTIFY_TOUCH_FOUND					= (1 << 2),

    /**
    \brief Call contact report callback while this collision pair is in contact

    If none of the two collision objects is a trigger shape then the contact report callback will get
    called while the actors of this collision pair are in contact.

    \note Triggers do not support this event. Persistent trigger contacts need to be tracked separately by observing eNOTIFY_TOUCH_FOUND/eNOTIFY_TOUCH_LOST events.

    \note Only takes effect if the colliding actors are rigid bodies.

    \note No report will get sent if the objects in contact are sleeping.

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    \note If this flag gets enabled while a pair is in touch already, there will be no eNOTIFY_TOUCH_PERSISTS events until the pair loses and regains touch.

    @see PxSimulationEventCallback.onContact() PxSimulationEventCallback.onTrigger()
    */
    eNOTIFY_TOUCH_PERSISTS				= (1 << 3),

    /**
    \brief Call contact report callback or trigger callback when this collision pair stops to be in contact

    If one of the two collision objects is a trigger shape (see #PxShapeFlag::eTRIGGER_SHAPE)
    then the trigger callback will get called as soon as the other object leaves the trigger volume.
    If none of the two collision objects is a trigger shape then the contact report callback will get
    called when the actors of this collision pair stop to be in contact.

    \note Only takes effect if the colliding actors are rigid bodies.

    \note This event will also get triggered if one of the colliding objects gets deleted.

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact() PxSimulationEventCallback.onTrigger()
    */
    eNOTIFY_TOUCH_LOST					= (1 << 4),

    /**
    \brief Call contact report callback when this collision pair is in contact during CCD passes.

    If CCD with multiple passes is enabled, then a fast moving object might bounce on and off the same
    object multiple times. Hence, the same pair might be in contact multiple times during a simulation step.
    This flag will make sure that all the detected collision during CCD will get reported. For performance
    reasons, the system can not always tell whether the contact pair lost touch in one of the previous CCD
    passes and thus can also not always tell whether the contact is new or has persisted. eNOTIFY_TOUCH_CCD
    just reports when the two collision objects were detected as being in contact during a CCD pass.

    \note Only takes effect if the colliding actors are rigid bodies.

    \note Trigger shapes are not supported.

    \note Only takes effect if eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact() PxSimulationEventCallback.onTrigger()
    */
    eNOTIFY_TOUCH_CCD					= (1 << 5),

    /**
    \brief Call contact report callback when the contact force between the actors of this collision pair exceeds one of the actor-defined force thresholds.

    \note Only takes effect if the colliding actors are rigid bodies.

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact()
    */
    eNOTIFY_THRESHOLD_FORCE_FOUND		= (1 << 6),

    /**
    \brief Call contact report callback when the contact force between the actors of this collision pair continues to exceed one of the actor-defined force thresholds.

    \note Only takes effect if the colliding actors are rigid bodies.

    \note If a pair gets re-filtered and this flag has previously been disabled, then the report will not get fired in the same frame even if the force threshold has been reached in the
    previous one (unless #eNOTIFY_THRESHOLD_FORCE_FOUND has been set in the previous frame).

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact()
    */
    eNOTIFY_THRESHOLD_FORCE_PERSISTS	= (1 << 7),

    /**
    \brief Call contact report callback when the contact force between the actors of this collision pair falls below one of the actor-defined force thresholds (includes the case where this collision pair stops being in contact).

    \note Only takes effect if the colliding actors are rigid bodies.

    \note If a pair gets re-filtered and this flag has previously been disabled, then the report will not get fired in the same frame even if the force threshold has been reached in the
    previous one (unless #eNOTIFY_THRESHOLD_FORCE_FOUND or #eNOTIFY_THRESHOLD_FORCE_PERSISTS has been set in the previous frame).

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact()
    */
    eNOTIFY_THRESHOLD_FORCE_LOST		= (1 << 8),

    /**
    \brief Provide contact points in contact reports for this collision pair.

    \note Only takes effect if the colliding actors are rigid bodies and if used in combination with the flags eNOTIFY_TOUCH_... or eNOTIFY_THRESHOLD_FORCE_...

    \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

    @see PxSimulationEventCallback.onContact() PxContactPair PxContactPair.extractContacts()
    */
    eNOTIFY_CONTACT_POINTS				= (1 << 9),

    /**
    \brief This flag is used to indicate whether this pair generates discrete collision detection contacts.

    \note Contacts are only responded to if eSOLVE_CONTACT is enabled.
    */
    eDETECT_DISCRETE_CONTACT			= (1 << 10),

    /**
    \brief This flag is used to indicate whether this pair generates CCD contacts.

    \note The contacts will only be responded to if eSOLVE_CONTACT is enabled on this pair.
    \note The scene must have PxSceneFlag::eENABLE_CCD enabled to use this feature.
    \note Non-static bodies of the pair should have PxRigidBodyFlag::eENABLE_CCD specified for this feature to work correctly.
    \note This flag is not supported with trigger shapes. However, CCD trigger events can be emulated using non-trigger shapes
    and requesting eNOTIFY_TOUCH_FOUND and eNOTIFY_TOUCH_LOST and not raising eSOLVE_CONTACT on the pair.

    @see PxRigidBodyFlag::eENABLE_CCD
    @see PxSceneFlag::eENABLE_CCD
    */
    eDETECT_CCD_CONTACT					= (1 << 11),

    /**
    \brief Provide pre solver velocities in contact reports for this collision pair.

    If the collision pair has contact reports enabled, the velocities of the rigid bodies before contacts have been solved
    will be provided in the contact report callback unless the pair lost touch in which case no data will be provided.

    \note Usually it is not necessary to request these velocities as they will be available by querying the velocity from the provided
    PxRigidActor object directly. However, it might be the case that the velocity of a rigid body gets set while the simulation is running
    in which case the PxRigidActor would return this new velocity in the contact report callback and not the velocity the simulation used.

    @see PxSimulationEventCallback.onContact(), PxContactPairVelocity, PxContactPairHeader.extraDataStream
    */
    ePRE_SOLVER_VELOCITY				= (1 << 12),

    /**
    \brief Provide post solver velocities in contact reports for this collision pair.

    If the collision pair has contact reports enabled, the velocities of the rigid bodies after contacts have been solved
    will be provided in the contact report callback unless the pair lost touch in which case no data will be provided.

    @see PxSimulationEventCallback.onContact(), PxContactPairVelocity, PxContactPairHeader.extraDataStream
    */
    ePOST_SOLVER_VELOCITY				= (1 << 13),

    /**
    \brief Provide rigid body poses in contact reports for this collision pair.

    If the collision pair has contact reports enabled, the rigid body poses at the contact event will be provided
    in the contact report callback unless the pair lost touch in which case no data will be provided.

    \note Usually it is not necessary to request these poses as they will be available by querying the pose from the provided
    PxRigidActor object directly. However, it might be the case that the pose of a rigid body gets set while the simulation is running
    in which case the PxRigidActor would return this new pose in the contact report callback and not the pose the simulation used.
    Another use case is related to CCD with multiple passes enabled, A fast moving object might bounce on and off the same
    object multiple times. This flag can be used to request the rigid body poses at the time of impact for each such collision event.

    @see PxSimulationEventCallback.onContact(), PxContactPairPose, PxContactPairHeader.extraDataStream
    */
    eCONTACT_EVENT_POSE					= (1 << 14),

    eNEXT_FREE							= (1 << 15),        //! < For internal use only.

    /**
    \brief Provided default flag to do simple contact processing for this collision pair.
    */
    eCONTACT_DEFAULT					= eSOLVE_CONTACT | eDETECT_DISCRETE_CONTACT,

    /**
    \brief Provided default flag to get commonly used trigger behavior for this collision pair.
    */
    eTRIGGER_DEFAULT					= eNOTIFY_TOUCH_FOUND | eNOTIFY_TOUCH_LOST | eDETECT_DISCRETE_CONTACT
}

export enum PxContactPairFlag {
    /**
    \brief The shape with index 0 has been removed from the actor/scene.
    */
    eREMOVED_SHAPE_0				= (1 << 0),

    /**
    \brief The shape with index 1 has been removed from the actor/scene.
    */
    eREMOVED_SHAPE_1				= (1 << 1),

    /**
    \brief First actor pair contact.

    The provided shape pair marks the first contact between the two actors, no other shape pair has been touching prior to the current simulation frame.

    \note: This info is only available if #PxPairFlag::eNOTIFY_TOUCH_FOUND has been declared for the pair.
    */
    eACTOR_PAIR_HAS_FIRST_TOUCH		= (1 << 2),

    /**
    \brief All contact between the actor pair was lost.

    All contact between the two actors has been lost, no shape pairs remain touching after the current simulation frame.
    */
    eACTOR_PAIR_LOST_TOUCH			= (1 << 3),

    /**
    \brief Internal flag, used by #PxContactPair.extractContacts()

    The applied contact impulses are provided for every contact point.
    This is the case if #PxPairFlag::eSOLVE_CONTACT has been set for the pair.
    */
    eINTERNAL_HAS_IMPULSES			= (1 << 4),

    /**
    \brief Internal flag, used by #PxContactPair.extractContacts()

    The provided contact point information is flipped with regards to the shapes of the contact pair. This mainly concerns the order of the internal triangle indices.
    */
    eINTERNAL_CONTACTS_ARE_FLIPPED	= (1 << 5)
}

export enum PxTriggerPairFlag
{
    eREMOVED_SHAPE_TRIGGER					= (1 << 0),					//! < The trigger shape has been removed from the actor/scene.
    eREMOVED_SHAPE_OTHER					= (1 << 1),					//! < The shape causing the trigger event has been removed from the actor/scene.
    eNEXT_FREE								= (1 << 2)					//! < For internal use only.
}
/// adapters ///

const _v3 = { x: 0, y: 0, z: 0 };
const _v4 = { x: 0, y: 0, z: 0, w: 1 };
export const _trans = {
    translation: _v3,
    rotation: _v4,
    p: _v3,
    q: _v4,
};

export const _pxtrans = USE_BYTEDANCE && PX ? new PX.Transform(_v3, _v4) : _trans;

export function getImplPtr (impl: any): any {
    if (USE_BYTEDANCE) {
        return impl.getQueryFilterData().word2;
    }
    return impl.$$.ptr;
}

export function getWrapShape<T> (pxShape: any): T {
    return PX.IMPL_PTR[getImplPtr(pxShape)];
}

/**
 * f32 x3 position.x,position.y,position.z,
 * f32 x3 normal.x,normal.y,normal.z,
 * f32 x3 impulse.x,impulse.y,impulse.z,
 * f32 separation,
 * totoal = 40
 * ui32 internalFaceIndex0,
 * ui32 internalFaceIndex1,
 * totoal = 48
 */
export function getContactPosition (pxContactOrIndex: any, out: IVec3Like, buf: any) {
    if (USE_BYTEDANCE) {
        Vec3.fromArray(out, new Float32Array(buf, 40 * pxContactOrIndex, 3));
    } else {
        Vec3.copy(out, pxContactOrIndex.position);
    }
}

export function getContactNormal (pxContactOrIndex: any, out: IVec3Like, buf: any) {
    if (USE_BYTEDANCE) {
        Vec3.fromArray(out, new Float32Array(buf, 40 * pxContactOrIndex + 12, 3));
    } else {
        Vec3.copy(out, pxContactOrIndex.normal);
    }
}

export function getTempTransform (pos: IVec3Like, quat: IQuatLike): any {
    if (USE_BYTEDANCE) {
        _pxtrans.setPosition(pos);
        _pxtrans.setQuaternion(quat);
    } else {
        Vec3.copy(_pxtrans.translation, pos);
        Quat.copy(_pxtrans.rotation, quat);
    }
    return _pxtrans;
}

export function getJsTransform (pos: IVec3Like, quat: IQuatLike): any {
    Vec3.copy(_trans.p, pos);
    Quat.copy(_trans.q, quat);
    return _trans;
}

export function addActorToScene (scene: any, actor: any) {
    if (USE_BYTEDANCE) {
        scene.addActor(actor);
    } else {
        scene.addActor(actor, null);
    }
}

export function setJointActors (joint: any, actor0: any, actor1: any): void {
    if (USE_BYTEDANCE) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        actor1 ? joint.setActors(actor0, actor1) : joint.setActors(actor0);
    } else {
        joint.setActors(actor0, actor1);
    }
}

export function setMassAndUpdateInertia (impl: any, mass: number): void {
    if (USE_BYTEDANCE) {
        PX.RigidBodyExt.setMassAndUpdateInertia(impl, mass);
    } else {
        impl.setMassAndUpdateInertia(mass);
    }
}

export function copyPhysXTransform (node: Node, transform: any): void {
    const wp = node.worldPosition;
    const wr = node.worldRotation;
    const dontUpdate = physXEqualsCocosVec3(transform, wp) && physXEqualsCocosQuat(transform, wr);
    if (dontUpdate) return;
    if (USE_BYTEDANCE) {
        node.setWorldPosition(transform.p);
        node.setWorldRotation(transform.q);
    } else {
        node.setWorldPosition(transform.translation);
        node.setWorldRotation(transform.rotation);
    }
}

export function physXEqualsCocosVec3 (trans: any, v3: IVec3Like): boolean {
    const pos = USE_BYTEDANCE ? trans.p : trans.translation;
    return Vec3.equals(pos, v3);
}

export function physXEqualsCocosQuat (trans: any, q: IQuatLike): boolean {
    const rot = USE_BYTEDANCE ? trans.q : trans.rotation;
    return Quat.equals(rot, q);
}

export function getContactData (vec: any, index: number, o: number) {
    if (USE_BYTEDANCE) {
        return index + o;
    } else {
        const gc = PX.getGContacts();
        const data = gc.get(index + o);
        gc.delete();
        return data;
    }
}

export function applyImpulse (isGlobal: boolean, impl: any, vec: IVec3Like, rp: IVec3Like) {
    if (isGlobal) {
        if (USE_BYTEDANCE) {
            PX.RigidBodyExt.applyImpulse(impl, vec, rp);
        } else {
            impl.applyImpulse(vec, rp);
        }
    } else if (USE_BYTEDANCE) {
        PX.RigidBodyExt.applyLocalImpulse(impl, vec, rp);
    } else {
        impl.applyLocalImpulse(vec, rp);
    }
}

export function applyForce (isGlobal: boolean, impl: any, vec: IVec3Like, rp: IVec3Like) {
    if (isGlobal) {
        if (USE_BYTEDANCE) {
            PX.RigidBodyExt.applyForce(impl, vec, rp);
        } else {
            impl.applyForce(vec, rp);
        }
    } else if (USE_BYTEDANCE) {
        PX.RigidBodyExt.applyLocalForce(impl, vec, rp);
    } else {
        impl.applyLocalForce(vec, rp);
    }
}

export function applyTorqueForce (impl: any, vec: IVec3Like) {
    if (USE_BYTEDANCE) {
        impl.addTorque(vec, PX.ForceMode.eFORCE, true);
    } else {
        impl.addTorque(vec);
    }
}

export function getShapeFlags (isTrigger: boolean): any {
    if (USE_BYTEDANCE) {
        const flag = (isTrigger ? PX.ShapeFlag.eTRIGGER_SHAPE : PX.ShapeFlag.eSIMULATION_SHAPE)
            | PX.ShapeFlag.eSCENE_QUERY_SHAPE;
        return flag;
    }
    const flag = (isTrigger ? PX.PxShapeFlag.eTRIGGER_SHAPE.value : PX.PxShapeFlag.eSIMULATION_SHAPE.value)
        | PX.PxShapeFlag.eSCENE_QUERY_SHAPE.value;
    return new PX.PxShapeFlags(flag);
}

export function getShapeWorldBounds (shape: any, actor: any, i = 1.01, out: AABB) {
    if (USE_BYTEDANCE) {
        const b3 = PX.RigidActorExt.getWorldBoundsArray(shape, actor, i) as Float32Array;
        const center = out.center;
        const halfExtents = out.halfExtents;
        center.x = (b3[3] + b3[0]) / 2;
        center.y = (b3[4] + b3[1]) / 2;
        center.z = (b3[5] + b3[2]) / 2;
        halfExtents.x = (b3[3] - b3[0]) / 2;
        halfExtents.y = (b3[4] - b3[1]) / 2;
        halfExtents.z = (b3[5] - b3[2]) / 2;
        // const b3 = PX.RigidActorExt.getWorldBounds(shape, actor, i);
        // Vec3.copy(out.center, b3.getCenter());
        // Vec3.copy(out.halfExtents, b3.getExtents());
    } else {
        const b3 = shape.getWorldBounds(actor, i);
        AABB.fromPoints(out, b3.minimum, b3.maximum);
    }
}

export function getShapeMaterials (pxMtl: any) {
    if (USE_BYTEDANCE) {
        return [pxMtl];
    }
    if (PX.VECTOR_MAT.size() > 0) {
        PX.VECTOR_MAT.set(0, pxMtl);
    } else {
        PX.VECTOR_MAT.push_back(pxMtl);
    }
    return PX.VECTOR_MAT;
}

export function setupCommonCookingParam (params: any, skipMeshClean = false, skipEdgedata = false): void {
    if (!USE_BYTEDANCE) return;
    params.setSuppressTriangleMeshRemapTable(true);
    if (!skipMeshClean) {
        params.setMeshPreprocessParams(params.getMeshPreprocessParams() & ~PX.MeshPreprocessingFlag.eDISABLE_CLEAN_MESH);
    } else {
        params.setMeshPreprocessParams(params.getMeshPreprocessParams() | PX.MeshPreprocessingFlag.eDISABLE_CLEAN_MESH);
    }

    if (skipEdgedata) {
        params.setMeshPreprocessParams(params.getMeshPreprocessParams() & ~PX.MeshPreprocessingFlag.eDISABLE_ACTIVE_EDGES_PRECOMPUTE);
    } else {
        params.setMeshPreprocessParams(params.getMeshPreprocessParams() | PX.MeshPreprocessingFlag.eDISABLE_ACTIVE_EDGES_PRECOMPUTE);
    }
}

export function createConvexMesh (_buffer: Float32Array | number[], cooking: any, physics: any): any {
    const vertices = shrinkPositions(_buffer);
    if (USE_BYTEDANCE) {
        const cdesc = new PX.ConvexMeshDesc();
        const verticesF32 = new Float32Array(vertices);
        cdesc.setPointsData(verticesF32);
        cdesc.setPointsCount(verticesF32.length / 3);
        cdesc.setPointsStride(3 * Float32Array.BYTES_PER_ELEMENT);
        cdesc.setConvexFlags(PX.ConvexFlag.eCOMPUTE_CONVEX);
        return cooking.createConvexMesh(cdesc);
    } else {
        const l = vertices.length;
        const vArr = new PX.PxVec3Vector();
        for (let i = 0; i < l; i += 3) {
            vArr.push_back({ x: vertices[i], y: vertices[i + 1], z: vertices[i + 2] });
        }
        const r = cooking.createConvexMesh(vArr, physics);
        vArr.delete();
        return r;
    }
}

// eTIGHT_BOUNDS = (1<<0) convex
// eDOUBLE_SIDED = (1<<1) trimesh
export function createMeshGeometryFlags (flags: number, isConvex: boolean) {
    if (USE_BYTEDANCE) {
        return flags;
    }
    return isConvex ? new PX.PxConvexMeshGeometryFlags(flags) : new PX.PxMeshGeometryFlags(flags);
}

export function createTriangleMesh (vertices: Float32Array | number[], indices: Uint32Array, cooking: any, physics: any): any {
    if (USE_BYTEDANCE) {
        const meshDesc = new PX.TriangleMeshDesc();
        meshDesc.setPointsData(vertices);
        meshDesc.setPointsCount(vertices.length / 3);
        meshDesc.setPointsStride(Float32Array.BYTES_PER_ELEMENT * 3);
        const indicesUI32 = new Uint32Array(indices);
        meshDesc.setTrianglesData(indicesUI32);
        meshDesc.setTrianglesCount(indicesUI32.length / 3);
        meshDesc.setTrianglesStride(Uint32Array.BYTES_PER_ELEMENT * 3);
        return cooking.createTriangleMesh(meshDesc);
    } else {
        const l = vertices.length;
        const l2 = indices.length;
        const vArr = new PX.PxVec3Vector();
        for (let i = 0; i < l; i += 3) {
            vArr.push_back({ x: vertices[i], y: vertices[i + 1], z: vertices[i + 2] });
        }
        const iArr = new PX.PxU16Vector();
        for (let i = 0; i < l2; i += 3) {
            iArr.push_back(indices[i]); iArr.push_back(indices[i + 1]); iArr.push_back(indices[i + 2]);
        }
        const r = cooking.createTriMeshExt(vArr, iArr, physics);
        vArr.delete(); iArr.delete();
        return r;
    }
}

export function createBV33TriangleMesh (vertices: number[], indices: Uint32Array, cooking: any, physics: any,
    skipMeshCleanUp = false,
    skipEdgeData = false,
    cookingPerformance = false,
    meshSizePerfTradeoff = true, inserted = true): any {
    if (!USE_BYTEDANCE) return;
    const meshDesc = new PX.TriangleMeshDesc();
    meshDesc.setPointsData(vertices);
    meshDesc.setPointsCount(vertices.length / 3);
    meshDesc.setPointsStride(Float32Array.BYTES_PER_ELEMENT * 3);
    meshDesc.setTrianglesData(indices);
    meshDesc.setTrianglesCount(indices.length / 3);
    meshDesc.setTrianglesStride(Uint32Array.BYTES_PER_ELEMENT * 3);

    const params = cooking.getParams();
    setupCommonCookingParam(params, skipMeshCleanUp, skipEdgeData);
    const midDesc = new PX.BVH33MidphaseDesc();

    if (cookingPerformance) midDesc.setMeshCookingHint(PX.MeshCookingHint.eCOOKING_PERFORMANCE);
    else midDesc.setMeshCookingHint(PX.MeshCookingHint.eSIM_PERFORMANCE);

    if (meshSizePerfTradeoff) midDesc.setMeshSizePerformanceTradeOff(0.0);
    else midDesc.setMeshSizePerformanceTradeOff(0.55);

    params.setMidphaseDesc(midDesc);
    cooking.setParams(params);
    console.log(`[Physics] cook bvh33 status:${cooking.validateTriangleMesh(meshDesc)}`);
    return cooking.createTriangleMesh(meshDesc);
}

export function createBV34TriangleMesh (vertices: number[], indices: Uint32Array, cooking: any, physics: any,
    skipMeshCleanUp = false,
    skipEdgeData = false,
    numTrisPerLeaf = true,
    inserted = true): void {
    if (!USE_BYTEDANCE) return;
    const meshDesc = new PX.TriangleMeshDesc();
    meshDesc.setPointsData(vertices);
    meshDesc.setPointsCount(vertices.length / 3);
    meshDesc.setPointsStride(Float32Array.BYTES_PER_ELEMENT * 3);
    meshDesc.setTrianglesData(indices);
    meshDesc.setTrianglesCount(indices.length / 3);
    meshDesc.setTrianglesStride(Uint32Array.BYTES_PER_ELEMENT * 3);
    const params = cooking.getParams();
    setupCommonCookingParam(params, skipMeshCleanUp, skipEdgeData);

    const midDesc = new PX.BVH34MidphaseDesc();
    midDesc.setNumPrimsLeaf(numTrisPerLeaf);
    params.setMidphaseDesc(midDesc);
    cooking.setParams(params);
    console.log(`[Physics] cook bvh34 status:${cooking.validateTriangleMesh(meshDesc)}`);
    return cooking.createTriangleMesh(meshDesc);
}

export function createHeightField (terrain: any, heightScale: number, cooking: any, physics: any) {
    const sizeI = terrain.getVertexCountI();
    const sizeJ = terrain.getVertexCountJ();
    if (USE_BYTEDANCE) {
        const samples = new PX.HeightFieldSamples(sizeI * sizeJ);
        for (let i = 0; i < sizeI; i++) {
            for (let j = 0; j < sizeJ; j++) {
                const s = terrain.getHeight(i, j) / heightScale;
                const index = j + i * sizeJ;
                samples.setHeightAtIndex(index, s);
                // samples.setMaterialIndex0AtIndex(index, 0);
                // samples.setMaterialIndex1AtIndex(index, 0);
            }
        }
        const hfdesc = new PX.HeightFieldDesc();
        hfdesc.setNbRows(sizeJ);
        hfdesc.setNbColumns(sizeI);
        hfdesc.setSamples(samples);
        return cooking.createHeightField(hfdesc);
    }
    const samples = new PX.PxHeightFieldSampleVector();
    for (let i = 0; i < sizeI; i++) {
        for (let j = 0; j < sizeJ; j++) {
            const s = new PX.PxHeightFieldSample();
            s.height = terrain.getHeight(i, j) / heightScale;
            samples.push_back(s);
        }
    }
    return cooking.createHeightFieldExt(sizeI, sizeJ, samples, physics);
}

export function createHeightFieldGeometry (hf: any, flags: number, hs: number, xs: number, zs: number) {
    if (USE_BYTEDANCE) {
        return new PX.HeightFieldGeometry(hf, hs, xs, zs);
    }
    return new PX.PxHeightFieldGeometry(hf, new PX.PxMeshGeometryFlags(flags),
        hs, xs, zs);
}

export function simulateScene (scene: any, deltaTime: number) {
    if (USE_BYTEDANCE) {
        scene.simulate(deltaTime);
    } else {
        scene.simulate(deltaTime, true);
    }
}

export function raycastAll (world: PhysXWorld, worldRay: Ray, options: IRaycastOptions,
    pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
    const maxDistance = options.maxDistance;
    const flags = PxHitFlag.ePOSITION | PxHitFlag.eNORMAL;
    const word3 = EFilterDataWord3.QUERY_FILTER | (options.queryTrigger ? 0 : EFilterDataWord3.QUERY_CHECK_TRIGGER);
    const queryFlags = PxQueryFlag.eSTATIC | PxQueryFlag.eDYNAMIC | PxQueryFlag.ePREFILTER | PxQueryFlag.eNO_BLOCK;
    if (USE_BYTEDANCE) {
        world.queryfilterData.data.word3 = word3;
        world.queryfilterData.data.word0 = options.mask >>> 0;
        world.queryfilterData.flags = queryFlags;
        const r = PX.SceneQueryExt.raycastMultiple(world.scene, worldRay.o, worldRay.d, maxDistance, flags,
            world.mutipleResultSize, world.queryfilterData, world.queryFilterCB);

        if (r) {
            for (let i = 0; i < r.length; i++) {
                const block = r[i];
                const collider = getWrapShape<PhysXShape>(block.shape).collider;
                const result = pool.add();
                result._assign(block.position, block.distance, collider, block.normal);
                results.push(result);
            }
            return true;
        }
    } else {
        world.queryfilterData.setWords(options.mask >>> 0, 0);
        world.queryfilterData.setWords(word3, 3);
        world.queryfilterData.setFlags(queryFlags);
        const blocks = world.mutipleResults;
        const r = world.scene.raycastMultiple(worldRay.o, worldRay.d, maxDistance, flags,
            blocks, blocks.size(), world.queryfilterData, world.queryFilterCB, null);

        if (r > 0) {
            for (let i = 0; i < r; i++) {
                const block = blocks.get(i);
                const collider = getWrapShape<PhysXShape>(block.getShape()).collider;
                const result = pool.add();
                result._assign(block.position, block.distance, collider, block.normal);
                results.push(result);
            }
            return true;
        } if (r === -1) {
            // eslint-disable-next-line no-console
            console.error('not enough memory.');
        }
    }
    return false;
}

export function raycastClosest (world: PhysXWorld, worldRay: Ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
    const maxDistance = options.maxDistance;
    const flags = PxHitFlag.ePOSITION | PxHitFlag.eNORMAL;
    const word3 = EFilterDataWord3.QUERY_FILTER | (options.queryTrigger ? 0 : EFilterDataWord3.QUERY_CHECK_TRIGGER)
        | EFilterDataWord3.QUERY_SINGLE_HIT;
    const queryFlags = PxQueryFlag.eSTATIC | PxQueryFlag.eDYNAMIC | PxQueryFlag.ePREFILTER;
    if (USE_BYTEDANCE) {
        world.queryfilterData.data.word3 = word3;
        world.queryfilterData.data.word0 = options.mask >>> 0;
        world.queryfilterData.flags = queryFlags;
        const block = PX.SceneQueryExt.raycastSingle(world.scene, worldRay.o, worldRay.d, maxDistance,
            flags, world.queryfilterData, world.queryFilterCB);
        if (block) {
            const collider = getWrapShape<PhysXShape>(block.shape).collider;
            result._assign(block.position, block.distance, collider, block.normal);
            return true;
        }
    } else {
        world.queryfilterData.setWords(options.mask >>> 0, 0);
        world.queryfilterData.setWords(word3, 3);
        world.queryfilterData.setFlags(queryFlags);
        const block = world.singleResult;
        const r = world.scene.raycastSingle(worldRay.o, worldRay.d, options.maxDistance, flags,
            block, world.queryfilterData, world.queryFilterCB, null);
        if (r) {
            const collider = getWrapShape<PhysXShape>(block.getShape()).collider;
            result._assign(block.position, block.distance, collider, block.normal);
            return true;
        }
    }
    return false;
}

export function initializeWorld (world: any, eventCallback: any, queryCallback: any, onCollision: any, onTrigger: any) {
    if (USE_BYTEDANCE) {
        // const physics = PX.createPhysics();
        const physics = PX.physics;
        const cp = new PX.CookingParams();
        const cooking = PX.createCooking(cp);
        const sceneDesc = physics.createSceneDesc();
        const simulation = new PX.SimulationEventCallback();
        simulation.setOnContact((_header: any, pairs: any) => {
            // buffer layout of shapes
            // 2 x N (the pair count)        [PxShape0, PxShape1]
            const shapes = _header.shapes as any[];
            // buffer layout of pairBuf
            // uint16                        ContactPairFlags
            // uint16                        PairFlags
            // uint16                        ContactCount
            // per pair have one pairBuf, total = 3 x N (the pair count)
            const pairBuf = _header.pairBuffer as ArrayBuffer;
            const pairL = shapes.length / 2;
            const ui16View = new Uint16Array(pairBuf, 0, pairL * 3);
            for (let i = 0; i < pairL; i++) {
                const flags = ui16View[0];          // ContactPairFlags
                if (flags & PxContactPairFlag.eREMOVED_SHAPE_0 || flags & PxContactPairFlag.eREMOVED_SHAPE_1) continue;
                const shape0 = shapes[2 * i];       // shape[0]
                const shape1 = shapes[2 * i + 1];   // shape[1]
                if (!shape0 || !shape1) continue;
                const shapeA = getWrapShape<PhysXShape>(shape0);
                const shapeB = getWrapShape<PhysXShape>(shape1);
                const events = ui16View[1];         // PairFlags
                const contactCount = ui16View[2];   // ContactCount
                const contactBuffer = _header.contactBuffer as ArrayBuffer;
                if (events & PxPairFlag.eNOTIFY_TOUCH_FOUND) {
                    onCollision('onCollisionEnter', shapeA, shapeB, contactCount, contactBuffer, 0);
                } else if (events & PxPairFlag.eNOTIFY_TOUCH_PERSISTS) {
                    onCollision('onCollisionStay', shapeA, shapeB, contactCount, contactBuffer, 0);
                } else if (events & PxPairFlag.eNOTIFY_TOUCH_LOST) {
                    onCollision('onCollisionExit', shapeA, shapeB, contactCount, contactBuffer, 0);
                }
            }
        });
        simulation.setOnTrigger((pairs: any, pairsBuf: ArrayBuffer) => {
            const length = pairs.length / 4;
            const ui16View = new Uint16Array(pairsBuf);
            /**
             * buffer optimized by bytedance
             * uint16                               PxTriggerPairFlag
             * uint16                               PxPairFlag
             * 4 x uint16 x N (the pair count)      [triggerActor, triggerShape, otherActor, otherShape]
             */
            for (let i = 0; i < length; i++) {
                const flags = ui16View[i];      // PxTriggerPairFlag
                if (flags & PxTriggerPairFlag.eREMOVED_SHAPE_TRIGGER || flags & PxTriggerPairFlag.eREMOVED_SHAPE_OTHER) continue;
                const events = ui16View[i + 1]; // PxPairFlag
                const ca = pairs[i * 4 + 1];    // triggerShape
                const cb = pairs[i * 4 + 3];    // otherShape
                const shapeA = getWrapShape<PhysXShape>(ca);
                const shapeB = getWrapShape<PhysXShape>(cb);
                if (events & PxPairFlag.eNOTIFY_TOUCH_FOUND) {
                    onTrigger('onTriggerEnter', shapeA, shapeB);
                } else if (events & PxPairFlag.eNOTIFY_TOUCH_LOST) {
                    onTrigger('onTriggerExit', shapeA, shapeB);
                }
            }
        });
        world.simulationCB = simulation;
        world.queryFilterCB = new PX.QueryFilterCallback();
        world.queryFilterCB.setPreFilter(queryCallback.preFilter);
        world.queryfilterData = { data: { word0: 0, word1: 0, word2: 0, word3: 1 }, flags: 0 };
        sceneDesc.setSimulationEventCallback(simulation);
        const scene = physics.createScene(sceneDesc);
        world.physics = physics;
        world.cooking = cooking;
        world.scene = scene;
    } else {
        world.singleResult = new PX.PxRaycastHit();
        world.mutipleResults = new PX.PxRaycastHitVector();
        world.mutipleResults.resize(world.mutipleResultSize, world.singleResult);
        world.queryfilterData = new PX.PxQueryFilterData();
        world.simulationCB = PX.PxSimulationEventCallback.implement(eventCallback);
        world.queryFilterCB = PX.PxQueryFilterCallback.implement(queryCallback);
        const version = PX.PX_PHYSICS_VERSION;
        const defaultErrorCallback = new PX.PxDefaultErrorCallback();
        const allocator = new PX.PxDefaultAllocator();
        const foundation = PX.PxCreateFoundation(version, allocator, defaultErrorCallback);
        const scale = new PX.PxTolerancesScale();
        world.cooking = PX.PxCreateCooking(version, foundation, new PX.PxCookingParams(scale));
        world.physics = PX.PxCreatePhysics(version, foundation, scale, false, null);
        PX.PxInitExtensions(world.physics, null);
        const sceneDesc = PX.getDefaultSceneDesc(world.physics.getTolerancesScale(), 0, world.simulationCB);
        world.scene = world.physics.createScene(sceneDesc);
        PX.physics = world.physics;
    }
}
