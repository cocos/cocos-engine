import CANNON from '@cocos/cannon';
import { Quat, Vec3 } from '../../core/math';
import { ERigidBodyType } from '../framework/physics-enum';
import { getWrap } from '../framework/util';
import { CannonWorld } from './cannon-world';
import { CannonShape } from './shapes/cannon-shape';
import { ColliderComponent } from '../../../exports/physics-framework';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { Node } from '../../core';
import { CollisionEventType, IContactEquation } from '../framework/physics-interface';
import { CannonRigidBody } from './cannon-rigid-body';
import { commitShapeUpdates } from './cannon-util';

const v3_0 = new Vec3();
const quat_0 = new Quat();
const contactsPool = [] as any;
const CollisionEventObject = {
    type: 'onCollisionEnter' as CollisionEventType,
    selfCollider: null as ColliderComponent | null,
    otherCollider: null as ColliderComponent | null,
    contacts: [] as IContactEquation[],
};

/**
 * node : shared-body = 1 : 1
 * static
 */
export class CannonSharedBody {

    private static readonly sharedBodesMap = new Map<string, CannonSharedBody>();

    static getSharedBody (node: Node, wrappedWorld: CannonWorld) {
        const key = node.uuid;
        if (CannonSharedBody.sharedBodesMap.has(key)) {
            return CannonSharedBody.sharedBodesMap.get(key)!;
        } else {
            const newSB = new CannonSharedBody(node, wrappedWorld);
            CannonSharedBody.sharedBodesMap.set(node.uuid, newSB);
            return newSB;
        }
    }

    readonly node: Node;
    readonly wrappedWorld: CannonWorld;
    readonly body: CANNON.Body;
    readonly shapes: CannonShape[] = [];
    wrappedBody: CannonRigidBody | null = null;

    private index: number = -1;
    private ref: number = 0;
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
        } else {
            if (this.index >= 0) {
                const isRemove = (this.shapes.length == 0 && this.wrappedBody == null) ||
                    (this.shapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.isEnabled)

                if (isRemove) {
                    this.body.sleep(); // clear velocity etc.
                    this.index = -1;
                    this.wrappedWorld.removeSharedBody(this);
                }
            }
        }
    }

    set reference (v: boolean) {
        v ? this.ref++ : this.ref--;
        if (this.ref == 0) { this.destroy(); }
    }

    private constructor (node: Node, wrappedWorld: CannonWorld) {
        this.wrappedWorld = wrappedWorld;
        this.node = node;
        this.body = new CANNON.Body();
        this.body.material = this.wrappedWorld.impl.defaultMaterial;
        this.body.addEventListener('cc-collide', this.onCollidedListener);
    }

    addShape (v: CannonShape) {
        const index = this.shapes.indexOf(v);
        if (index < 0) {
            const index = this.body.shapes.length;
            this.body.addShape(v.impl);
            this.shapes.push(v);

            v.setIndex(index);
            const offset = this.body.shapeOffsets[index];
            const orient = this.body.shapeOrientations[index];
            v.setOffsetAndOrient(offset, orient);
        }
    }

    removeShape (v: CannonShape) {
        const index = this.shapes.indexOf(v);
        if (index >= 0) {
            this.shapes.splice(index, 1);
            this.body.removeShape(v.impl);

            v.setIndex(-1);
        }
    }

    syncSceneToPhysics () {
        if (this.node.hasChangedFlags) {
            if (this.body.isSleeping()) this.body.wakeUp();
            Vec3.copy(this.body.position, this.node.worldPosition);
            Quat.copy(this.body.quaternion, this.node.worldRotation);
            this.body.aabbNeedsUpdate = true;
            if (this.node.hasChangedFlags & TransformBit.SCALE) {
                for (let i = 0; i < this.shapes.length; i++) {
                    this.shapes[i].setScale(this.node.worldScale);
                }
                commitShapeUpdates(this.body);
            }
        }
    }

    syncPhysicsToScene () {
        if (this.body.type != ERigidBodyType.STATIC) {
            if (!this.body.isSleeping()) {
                Vec3.copy(v3_0, this.body.position);
                Quat.copy(quat_0, this.body.quaternion);
                this.node.worldPosition = v3_0;
                this.node.worldRotation = quat_0;
            }
        }
    }

    syncInitial () {
        Vec3.copy(this.body.position, this.node.worldPosition);
        Quat.copy(this.body.quaternion, this.node.worldRotation);
        this.body.aabbNeedsUpdate = true;
        for (let i = 0; i < this.shapes.length; i++) {
            this.shapes[i].setScale(this.node.worldScale);
        }
        commitShapeUpdates(this.body);

        if (this.body.isSleeping()) this.body.wakeUp();
    }

    private destroy () {
        this.body.removeEventListener('cc-collide', this.onCollidedListener);
        CannonSharedBody.sharedBodesMap.delete(this.node.uuid);
        delete CANNON.World['idToBodyMap'][this.body.id];
        (this.node as any) = null;
        (this.wrappedWorld as any) = null;
        (this.body as any) = null;
        (this.shapes as any) = null;
        (this.onCollidedListener as any) = null;
    }

    private onCollided (event: CANNON.ICollisionEvent) {
        CollisionEventObject.type = event.event;
        const self = getWrap<CannonShape>(event.selfShape);
        const other = getWrap<CannonShape>(event.otherShape);
        if (self) {
            CollisionEventObject.selfCollider = self.collider;
            CollisionEventObject.otherCollider = other ? other.collider : null;
            let i = 0;
            for (i = CollisionEventObject.contacts.length; i--;) {
                contactsPool.push(CollisionEventObject.contacts.pop());
            }

            for (i = 0; i < event.contacts.length; i++) {
                const cq = event.contacts[i];
                if (contactsPool.length > 0) {
                    const c = contactsPool.pop();
                    Vec3.copy(c.contactA, cq.ri);
                    Vec3.copy(c.contactB, cq.rj);
                    Vec3.copy(c.normal, cq.ni);
                    CollisionEventObject.contacts.push(c);
                } else {
                    const c = {
                        contactA: Vec3.copy(new Vec3(), cq.ri),
                        contactB: Vec3.copy(new Vec3(), cq.rj),
                        normal: Vec3.copy(new Vec3(), cq.ni),
                    };
                    CollisionEventObject.contacts.push(c);
                }
            }

            for (i = 0; i < this.shapes.length; i++) {
                const shape = this.shapes[i];
                shape.collider.emit(CollisionEventObject.type, CollisionEventObject);
            }
        }
    }

}