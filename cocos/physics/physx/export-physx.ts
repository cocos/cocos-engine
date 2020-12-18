/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-undef */
import { BYTEDANCE } from 'internal:constants';
import { IQuatLike, IVec3Like, Node, Quat, Vec3 } from '../../core';

export let USE_BYTEDANCE = false;
if (BYTEDANCE) USE_BYTEDANCE = true;

let _px = globalThis.PhysX as any;
if (USE_BYTEDANCE && globalThis.tt.getPhy) _px = globalThis.tt.getPhy();
export const PX = _px;

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

/// adapters ///

export const _trans = {
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
};

export const _pxtrans = USE_BYTEDANCE && PX ? new PX.Transform({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0, w: 1 }) : _trans;

if (PX) {
    PX.CACHE_MAT = {};
    PX.VECTOR_MAT = USE_BYTEDANCE ? null : new PX.PxMaterialVector();
    PX.IMPL_PTR = {};
    PX.MESH_CONVEX = {};
    PX.MESH_STATIC = {};
    PX.TERRAIN_STATIC = {};
    if (!USE_BYTEDANCE) {
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
        PX.MeshScale = PX.PxMeshScale;
        PX.createRevoluteJoint = (a: any, b: any, c: any, d: any): any => PX.PxRevoluteJointCreate(PX.physics, a, b, c, d);
        PX.createDistanceJoint = (a: any, b: any, c: any, d: any): any => PX.PxDistanceJointCreate(PX.physics, a, b, c, d);
    }
}

export function getImplPtr (impl: any) {
    if (USE_BYTEDANCE) {
        return impl.getQueryFilterData().word2;
    }
    return impl.$$.ptr;
}

export function getWrapShape<T> (pxShape: any): T {
    return PX.IMPL_PTR[getImplPtr(pxShape)];
}

/**
 * f32 x3  position.x,position.y,position.z,
 * f32 separation,
 * f32 x3 normal.x,normal.y,normal.z,
 * ui32 internalFaceIndex0,
 * f32 x3 impulse.x,impulse.y,impulse.z,
 * ui32 internalFaceIndex1
 * totoal = 48
 */
export function getContactPosition (pxContactOrIndex: any, out: IVec3Like, buf: any) {
    // return USE_BYTEDANCE ? pxContact.getPosition() : pxContactOrIndex.position;
    if (USE_BYTEDANCE) {
        Vec3.fromArray(out, new Float32Array(buf, 48 * pxContactOrIndex, 3));
    } else {
        Vec3.copy(out, pxContactOrIndex.position);
    }
}

export function getContactNormal (pxContactOrIndex: any, out: IVec3Like, buf: any) {
    // return USE_BYTEDANCE ? pxContact.getNormal() : pxContact.normal;
    if (USE_BYTEDANCE) {
        Vec3.fromArray(out, new Float32Array(buf, 48 * pxContactOrIndex + 16, 3));
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

export function setJointActors (joint: any, actor0: any, actor1: any): void {
    if (USE_BYTEDANCE) {
        // eslint-disable-next-line no-unused-expressions
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
    if (USE_BYTEDANCE) {
        const pos = transform.getPosition();
        const rot = transform.getQuaternion();
        node.setWorldPosition(pos);
        node.setWorldRotation(rot);
    } else {
        node.setWorldPosition(transform.translation);
        node.setWorldRotation(transform.rotation);
    }
}

export function getContactData (vec: any, index: number) {
    if (USE_BYTEDANCE) {
        // return vec[index];
        return index;
    } else {
        return vec.get(index);
    }
}

export function applyImpulse (isGlobal: boolean, impl: any, vec: IVec3Like, rp: IVec3Like) {
    if (isGlobal) {
        if (USE_BYTEDANCE) {
            PX.RigidBodyExt.applyImpulse(impl, vec, rp);
        } else {
            impl.applyImpulse(vec, rp);
        }
    } else {
        if (USE_BYTEDANCE) {
            PX.RigidBodyExt.applyLocalImpulse(impl, vec, rp);
        } else {
            impl.applyLocalImpulse(vec, rp);
        }
    }
}

export function applyForce (isGlobal: boolean, impl: any, vec: IVec3Like, rp: IVec3Like) {
    if (isGlobal) {
        if (USE_BYTEDANCE) {
            PX.RigidBodyExt.applyForce(impl, vec, rp);
        } else {
            impl.applyForce(vec, rp);
        }
    } else {
        if (USE_BYTEDANCE) {
            PX.RigidBodyExt.applyLocalForce(impl, vec, rp);
        } else {
            impl.applyLocalForce(vec, rp);
        }
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
    } else {
        const flag = (isTrigger ? PX.PxShapeFlag.eTRIGGER_SHAPE.value : PX.PxShapeFlag.eSIMULATION_SHAPE.value)
            | PX.PxShapeFlag.eSCENE_QUERY_SHAPE.value;
        return new PX.PxShapeFlags(flag);
    }
}

export function getShapeMaterials (pxMtl: any) {
    if (USE_BYTEDANCE) {
        return [pxMtl];
    } else {
        if (PX.VECTOR_MAT.size() > 0) {
            PX.VECTOR_MAT.set(0, pxMtl);
        } else {
            PX.VECTOR_MAT.push_back(pxMtl);
        }
        return PX.VECTOR_MAT;
    }
}

