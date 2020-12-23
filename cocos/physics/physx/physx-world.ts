
import { Vec3 } from "../../core/math";
import { ray } from '../../core/geometry';
import { IRaycastOptions, IPhysicsWorld } from '../spec/i-physics-world';
import { PhysicsRayResult, PhysicMaterial } from '../framework';
import { Node, RecyclePool } from '../../core';
import { IVec3Like } from '../../core/math/type-define';
import { IBaseConstraint } from "../spec/i-physics-constraint";

import { PX as px } from "./export-physx";
import { PhysXSharedBody } from "./physx-shared-body";
import { PhysXRigidBody } from "./physx-rigid-body";

export class PhysXWorld implements IPhysicsWorld {

    setAllowSleep (v: boolean) { };
    setDefaultMaterial (v: PhysicMaterial) { };
    setGravity (gravity: IVec3Like) { this.scene['setGravity'](gravity) };
    get impl () { return null; }

    readonly physics: PhysX.Physics;
    readonly scene: PhysX.Scene;

    readonly wrappedBodies: PhysXSharedBody[] = [];

    constructor (options?: any) {
        const version = px.PX_PHYSICS_VERSION
        const defaultErrorCallback = new px.PxDefaultErrorCallback()
        const allocator = new px.PxDefaultAllocator()
        const foundation = px.PxCreateFoundation(
            version,
            allocator,
            defaultErrorCallback
        )
        const triggerCallback = {
            onContactBegin: (...a: any) => { console.log('onContactBegin', a); },
            onContactEnd: (...a: any) => { console.log('onContactEnd', a); },
            onContactPersist: (...a: any) => { console.log('onContactPersist', a); },
            onTriggerBegin: (...a: any) => { console.log('onTriggerBegin', a); },
            onTriggerEnd: (...a: any) => { console.log('onTriggerEnd', a); },
            // onTriggerPersist: (...a: any) => { console.log('onTriggerPersist', a); },
        }
        const physxSimulationCallbackInstance = px.PxSimulationEventCallback.implement(
            triggerCallback
        )

        this.physics = px.PxCreatePhysics(
            version,
            foundation,
            new px.PxTolerancesScale(),
            false,
            null
        )
        px.PxInitExtensions(this.physics, null)
        const sceneDesc = px.getDefaultSceneDesc(
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
    }
}
