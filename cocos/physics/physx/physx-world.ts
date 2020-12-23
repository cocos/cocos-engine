
import { Vec3 } from "../../core/math";
import { ray } from '../../core/geometry';
import { IRaycastOptions, IPhysicsWorld } from '../spec/i-physics-world';
import { PhysicsRayResult, PhysicMaterial, TriggerEventType, CollisionEventType } from '../framework';
import { Node, RecyclePool } from '../../core';
import { IVec3Like } from '../../core/math/type-define';
import { IBaseConstraint } from "../spec/i-physics-constraint";
import { PhysXSharedBody } from "./physx-shared-body";
import { PhysXRigidBody } from "./physx-rigid-body";
import { PhysXShape } from "./shapes/physx-shape";
import { CollisionEventObject, TriggerEventObject } from "../utils/util";
import { PX } from "./export-physx";

function onTrigger (type: TriggerEventType, a: string, b: string) {
    const wpa = PX.IMPL_PTR[a] as PhysXShape;
    const wpb = PX.IMPL_PTR[b] as PhysXShape;
    TriggerEventObject.type = type;
    if (wpa.collider.needTriggerEvent) {
        TriggerEventObject.selfCollider = wpa.collider;
        TriggerEventObject.otherCollider = wpb.collider;
        wpa.collider.emit(TriggerEventObject.type, TriggerEventObject);
    }
    if (wpb.collider.needTriggerEvent) {
        TriggerEventObject.selfCollider = wpb.collider;
        TriggerEventObject.otherCollider = wpa.collider;
        wpb.collider.emit(TriggerEventObject.type, TriggerEventObject);
    }
}

function onCollision (type: CollisionEventType, a: any, b: any) {
    const wpa = PX.IMPL_PTR[a['$$'].ptr] as PhysXShape;
    const wpb = PX.IMPL_PTR[b['$$'].ptr] as PhysXShape;
    CollisionEventObject.type = type;
    if (wpa.collider.needCollisionEvent) {
        CollisionEventObject.selfCollider = wpa.collider;
        CollisionEventObject.otherCollider = wpb.collider;
        wpa.collider.emit(CollisionEventObject.type, CollisionEventObject);
    }
    if (wpb.collider.needCollisionEvent) {
        CollisionEventObject.selfCollider = wpb.collider;
        CollisionEventObject.otherCollider = wpa.collider;
        wpb.collider.emit(CollisionEventObject.type, CollisionEventObject);
    }
}

const persistShapes: string[] = [];

export class PhysXWorld implements IPhysicsWorld {

    setAllowSleep (v: boolean) { };
    setDefaultMaterial (v: PhysicMaterial) { };
    setGravity (gravity: IVec3Like) { this.scene['setGravity'](gravity) };
    get impl () { return null; }

    readonly physics: PhysX.Physics;
    readonly scene: PhysX.Scene;

    readonly wrappedBodies: PhysXSharedBody[] = [];

    constructor (options?: any) {
        const version = PX.PX_PHYSICS_VERSION
        const defaultErrorCallback = new PX.PxDefaultErrorCallback()
        const allocator = new PX.PxDefaultAllocator()
        const foundation = PX.PxCreateFoundation(
            version,
            allocator,
            defaultErrorCallback
        )
        const triggerCallback = {
            onContactBegin: (a: any, b: any) => { onCollision('onCollisionEnter', a, b); },
            onContactEnd: (a: any, b: any) => { onCollision('onCollisionExit', a, b); },
            onContactPersist: (a: any, b: any) => { onCollision('onCollisionStay', a, b); },
            onTriggerBegin: (a: any, b: any) => {
                const pa = a['$$'].ptr;
                const pb = b['$$'].ptr;
                const key = pa + '-' + pb;
                const i = persistShapes.indexOf(key);
                if (i < 0) persistShapes.push(key);
                onTrigger("onTriggerEnter", pa, pb);
            },
            onTriggerEnd: (a: any, b: any) => {
                const pa = a['$$'].ptr;
                const pb = b['$$'].ptr;
                const key = pa + '-' + pb;
                const i = persistShapes.indexOf(key);
                if (i >= 0) persistShapes.splice(i, 1);
                onTrigger("onTriggerExit", pa, pb);
            },
            // onTriggerPersist: (...a: any) => { console.log('onTriggerPersist', a); },
        }
        const physxSimulationCallbackInstance = PX.PxSimulationEventCallback.implement(
            triggerCallback
        )

        this.physics = PX.PxCreatePhysics(
            version,
            foundation,
            new PX.PxTolerancesScale(),
            false,
            null
        )
        PX.PxInitExtensions(this.physics, null)
        const sceneDesc = PX.getDefaultSceneDesc(
            this.physics['getTolerancesScale'](),
            0,
            physxSimulationCallbackInstance
        )
        this.scene = this.physics.createScene(sceneDesc)

        window.PP = this;
    }

    step (deltaTime: number, timeSinceLastCalled?: number, maxSubStep: number = 0) {
        const scene = this.scene;
        (scene as any).simulate(deltaTime, true);
        scene.fetchResults(true)
        for (let i = 0; i < this.wrappedBodies.length; i++) {
            const body = this.wrappedBodies[i]
            body.syncPhysicsToScene();
        }
    }

    syncSceneToPhysics (): void {
        for (let i = 0; i < this.wrappedBodies.length; i++) {
            const body = this.wrappedBodies[i]
            body.syncSceneToPhysics();
        }
    }

    raycast (worldRay: ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        return false;
    }

    raycastClosest (worldRay: ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        return false;
    }

    getSharedBody (node: Node, wrappedBody?: PhysXRigidBody) {
        return PhysXSharedBody.getSharedBody(node, this, wrappedBody);
    }

    addActor (body: PhysXSharedBody) {
        const index = this.wrappedBodies.indexOf(body);
        if (index < 0) {
            this.scene['addActor'](body.impl, null);
            this.wrappedBodies.push(body);
        }
    }

    removeActor (body: PhysXSharedBody) {
        const index = this.wrappedBodies.indexOf(body);
        if (index >= 0) {
            this.scene['removeActor'](body.impl, true);
            this.wrappedBodies.splice(index, 1);
        }
    }

    addConstraint (constraint: IBaseConstraint) {
    }

    removeConstraint (constraint: IBaseConstraint) {
    }

    updateCollisionMatrix (group: number, mask: number) {
    }

    emitEvents () {
        const l = persistShapes.length;
        for (let i = 0; i < l; i++) {
            const key = persistShapes[i];
            const ptr = key.split('-');
            onTrigger("onTriggerStay", ptr[0], ptr[1]);
        }
    }
}
