/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-undef */
import { BYTEDANCE } from 'internal:constants';
import { IQuatLike, IVec3Like, Node, Quat, Vec3 } from '../../core';

export let USE_BYTEDANCE = false;
if (BYTEDANCE) USE_BYTEDANCE = true;

let _px = globalThis.PhysX as any;
if (USE_BYTEDANCE) _px = globalThis.phy;
export const PX = _px;

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

export function getWrapShape<T> (pxShape: any): T {
    if (USE_BYTEDANCE) {
        return PX.IMPL_PTR[pxShape.getQueryFilterData().word2];
    }
    return PX.IMPL_PTR[pxShape.$$.ptr];
}

export function getContactPosition (pxContact: any): IVec3Like {
    return USE_BYTEDANCE ? pxContact.getPosition() : pxContact.position;
}

export function getContactNormal (pxContact: any): IVec3Like {
    return USE_BYTEDANCE ? pxContact.getNormal() : pxContact.normal;
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
