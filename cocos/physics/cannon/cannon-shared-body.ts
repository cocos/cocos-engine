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

import CANNON from '@cocos/cannon';
import { Quat, Vec3, js } from '../../core';
import { ERigidBodyType, PhysicsGroup } from '../framework/physics-enum';
import { getWrap, setWrap } from '../utils/util';
import { CannonWorld } from './cannon-world';
import { CannonShape } from './shapes/cannon-shape';
import { Collider, PhysicsSystem } from '../../../exports/physics-framework';
import { TransformBit } from '../../scene-graph/node-enum';
import { Node } from '../../scene-graph';
import { CollisionEventType } from '../framework/physics-interface';
import { CannonRigidBody } from './cannon-rigid-body';
import { commitShapeUpdates } from './cannon-util';
import { CannonContactEquation } from './cannon-contact-equation';
import { CannonConstraint } from './constraints/cannon-constraint';

const v3_0 = new Vec3();
const quat_0 = new Quat();
const contactsPool: CannonContactEquation[] = [] as any;
const CollisionEventObject = {
    type: 'onCollisionEnter' as CollisionEventType,
    selfCollider: null as unknown as Collider,
    otherCollider: null as unknown as Collider,
    contacts: [] as CannonContactEquation[],
    impl: null as unknown as CANNON.ICollisionEvent,
};

/**
  * node : shared-body = 1 : 1
  * static
  */
export class CannonSharedBody {
    private static readonly sharedBodesMap = new Map<string, CannonSharedBody>();

    static getSharedBody (node: Node, wrappedWorld: CannonWorld, wrappedBody?: CannonRigidBody): CannonSharedBody {
        const key = node.uuid;
        let newSB: CannonSharedBody;
        if (CannonSharedBody.sharedBodesMap.has(key)) {
            newSB = CannonSharedBody.sharedBodesMap.get(key)!;
        } else {
            newSB = new CannonSharedBody(node, wrappedWorld);
            const g = PhysicsGroup.DEFAULT;
            const m = PhysicsSystem.instance.collisionMatrix[g];
            newSB.body.collisionFilterGroup = g;
            newSB.body.collisionFilterMask = m;
            newSB.body.position = new CANNON.Vec3(node.worldPosition.x, node.worldPosition.y, node.worldPosition.z);
            newSB.body.quaternion = new CANNON.Quaternion(node.worldRotation.x, node.worldRotation.y, node.worldRotation.z, node.worldRotation.w);
            CannonSharedBody.sharedBodesMap.set(node.uuid, newSB);
        }
        if (wrappedBody) {
            newSB.wrappedBody = wrappedBody;
            const g = wrappedBody.rigidBody.group;
            const m = PhysicsSystem.instance.collisionMatrix[g];
            newSB.body.collisionFilterGroup = g;
            newSB.body.collisionFilterMask = m;
            newSB.body.position = new CANNON.Vec3(node.worldPosition.x, node.worldPosition.y, node.worldPosition.z);
            newSB.body.quaternion = new CANNON.Quaternion(node.worldRotation.x, node.worldRotation.y, node.worldRotation.z, node.worldRotation.w);
        }
        return newSB;
    }

    readonly node: Node;
    readonly wrappedWorld: CannonWorld;
    readonly body: CANNON.Body;
    readonly wrappedShapes: CannonShape[] = [];
    readonly wrappedJoints0: CannonConstraint[] = [];
    readonly wrappedJoints1: CannonConstraint[] = [];
    wrappedBody: CannonRigidBody | null = null;

    private index = -1;
    private ref = 0;
    private onCollidedListener = this.onCollided.bind(this);

    /**
      * add or remove from world \
      * add, if enable \
      * remove, if disable & shapes.length == 0 & wrappedBody disable
      */
    set enabled (v: boolean) {
        if (v) {
            if (this.index < 0) {
                this.index = this.wrappedWorld.bodies.length;
                this.wrappedWorld.addSharedBody(this);
                this.syncInitial();
            }
        } else if (this.index >= 0) {
            const isRemove = (this.wrappedShapes.length === 0 && this.wrappedBody == null)
                 || (this.wrappedShapes.length === 0 && this.wrappedBody != null && !this.wrappedBody.isEnabled);

            if (isRemove) {
                this.body.sleep(); // clear velocity etc.
                this.index = -1;
                this.wrappedWorld.removeSharedBody(this);
            }
        }
    }

    set reference (v: boolean) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        v ? this.ref++ : this.ref--;
        if (this.ref === 0) { this.destroy(); }
    }

    private constructor (node: Node, wrappedWorld: CannonWorld) {
        this.wrappedWorld = wrappedWorld;
        this.node = node;
        this.body = new CANNON.Body();
        setWrap(this.body, this);
        this.body.collisionFilterGroup = PhysicsSystem.PhysicsGroup.DEFAULT;
        this.body.sleepSpeedLimit = PhysicsSystem.instance.sleepThreshold;
        this.body.material = this.wrappedWorld.impl.defaultMaterial;
        this.body.addEventListener('cc-collide', this.onCollidedListener);
    }

    addShape (v: CannonShape): void {
        const index = this.wrappedShapes.indexOf(v);
        if (index < 0) {
            const index = this.body.shapes.length;
            this.body.addShape(v.impl);
            this.wrappedShapes.push(v);

            v.setIndex(index);
            const offset = this.body.shapeOffsets[index];
            const orient = this.body.shapeOrientations[index];
            v.setOffsetAndOrient(offset, orient);
            if (this.body.isSleeping()) this.body.wakeUp();
        }
    }

    removeShape (v: CannonShape): void {
        const index = this.wrappedShapes.indexOf(v);
        if (index >= 0) {
            js.array.fastRemoveAt(this.wrappedShapes, index);
            this.body.removeShape(v.impl);
            v.setIndex(-1);
            if (this.body.isSleeping()) this.body.wakeUp();
        }
    }

    addJoint (v: CannonConstraint, type: 0 | 1): void {
        if (type) {
            const i = this.wrappedJoints1.indexOf(v);
            if (i < 0) this.wrappedJoints1.push(v);
        } else {
            const i = this.wrappedJoints0.indexOf(v);
            if (i < 0) this.wrappedJoints0.push(v);
        }
    }

    removeJoint (v: CannonConstraint, type: 0 | 1): void {
        if (type) {
            const i = this.wrappedJoints1.indexOf(v);
            if (i >= 0) js.array.fastRemoveAt(this.wrappedJoints1, i);
        } else {
            const i = this.wrappedJoints0.indexOf(v);
            if (i >= 0) js.array.fastRemoveAt(this.wrappedJoints0, i);
        }
    }

    syncSceneToPhysics (): void {
        const node = this.node;
        const body = this.body;
        if (node.hasChangedFlags) {
            if (body.isSleeping()) body.wakeUp();
            Vec3.copy(body.position, node.worldPosition);
            Quat.copy(body.quaternion, node.worldRotation);
            body.aabbNeedsUpdate = true;
            if (node.hasChangedFlags & TransformBit.SCALE) this.syncScale();
        }
    }

    syncPhysicsToScene (): void {
        const n = this.node;
        const b = this.body;
        if (b.type === ERigidBodyType.DYNAMIC) {
            if (!b.isSleeping()) {
                Vec3.copy(v3_0, b.position);
                Quat.copy(quat_0, b.quaternion);
                n.worldPosition = v3_0;
                n.worldRotation = quat_0;
            }
        }
    }

    syncInitial (): void {
        const n = this.node;
        const b = this.body;
        Vec3.copy(b.position, n.worldPosition);
        Quat.copy(b.quaternion, n.worldRotation);
        Vec3.copy(b.previousPosition, n.worldPosition);
        Quat.copy(b.previousQuaternion, n.worldRotation);
        b.aabbNeedsUpdate = true;
        this.syncScale();
        if (b.isSleeping()) b.wakeUp();
    }

    syncScale (): void {
        for (let i = 0; i < this.wrappedShapes.length; i++) {
            this.wrappedShapes[i].setScale(this.node.worldScale);
        }
        for (let i = 0; i < this.wrappedJoints0.length; i++) {
            this.wrappedJoints0[i].updateScale0();
        }
        for (let i = 0; i < this.wrappedJoints1.length; i++) {
            this.wrappedJoints1[i].updateScale1();
        }
        commitShapeUpdates(this.body);
    }

    private destroy (): void {
        setWrap(this.body, null);
        this.body.removeEventListener('cc-collide', this.onCollidedListener);
        CannonSharedBody.sharedBodesMap.delete(this.node.uuid);
        delete (CANNON.World as any).idToBodyMap[this.body.id];
        (this.node as any) = null;
        (this.wrappedWorld as any) = null;
        (this.body as any) = null;
        (this.wrappedShapes as any) = null;
        (this.wrappedJoints0 as any) = null;
        (this.wrappedJoints1 as any) = null;
        (this.onCollidedListener as any) = null;
    }

    private onCollided (event: CANNON.ICollisionEvent): void {
        CollisionEventObject.type = event.event;
        const self = getWrap<CannonShape>(event.selfShape);
        const other = getWrap<CannonShape>(event.otherShape);
        if (self && self.collider.needCollisionEvent) {
            contactsPool.push.apply(contactsPool, CollisionEventObject.contacts);
            CollisionEventObject.contacts.length = 0;
            CollisionEventObject.impl = event;
            CollisionEventObject.selfCollider = self.collider;
            CollisionEventObject.otherCollider = other ? other.collider : (null as any);

            let i = 0;
            if (CollisionEventObject.type !== 'onCollisionExit') {
                for (i = 0; i < event.contacts.length; i++) {
                    const cq = event.contacts[i];
                    if (contactsPool.length > 0) {
                        const c = contactsPool.pop();
                        c!.impl = cq;
                        CollisionEventObject.contacts.push(c!);
                    } else {
                        const c = new CannonContactEquation(CollisionEventObject);
                        c.impl = cq;
                        CollisionEventObject.contacts.push(c);
                    }
                }
            }

            for (i = 0; i < this.wrappedShapes.length; i++) {
                const shape = this.wrappedShapes[i];
                shape.collider.emit(CollisionEventObject.type, CollisionEventObject);
            }
        }
    }
}
