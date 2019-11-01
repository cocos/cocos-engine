import CANNON from '@cocos/cannon';
import { Quat, Vec3 } from '../../core/math';
import { ERigidBodyType } from '../physic-enum';
import { getWrap } from '../util';
import { CannonWorld } from './cannon-world';
import { CannonShape } from './shapes/cannon-shape';
import { ColliderComponent } from '../../../exports/physics-framework';
import { TransformDirtyBit } from '../../core/scene-graph/node-enum';
import { IBaseShape } from '../spec/i-physics-spahe';
import { Node } from '../../core';
import { CollisionEventType } from '../export-api';
import { CannonRigidBody } from './cannon-rigid-body';

const v3_0 = new Vec3();
const quat_0 = new Quat();
const contactsPool = [] as any;
const CollisionEventObject = {
    type: 'onCollisionEnter' as CollisionEventType,
    selfCollider: null as unknown as ColliderComponent,
    otherCollider: null as unknown as ColliderComponent,
    contacts: [] as any,
};

/**
 * sharedbody, node : sharedbody = 1 : 1
 * static
 */
export class CannonSharedBody {
    readonly node: Node;
    readonly wrappedWorld: CannonWorld;
    readonly body: CANNON.Body = new CANNON.Body();
    readonly shapes: CannonShape[] = [];
    wrappedBody: CannonRigidBody | null = null;
    private index: number = -1;
    private onCollidedListener = this._onCollided.bind(this);

    /**
     * add or remove from world \
     * add, if enable \
     * remove, if disable & shapes.length == 0 & wrappedBody disable
     */
    set enabled (v: boolean) {
        if (v) {
            if (this.index < 0) {
                this.index = this.wrappedWorld.world.bodies.length;
                this.wrappedWorld.world.addBody(this.body);
            }
        } else {
            if (this.index >= 0) {
                const isRemove = (this.shapes.length == 0 && this.wrappedBody == null) ||
                    (this.shapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.rigidBody.enabledInHierarchy)

                if (isRemove) {
                    this.body.sleep(); // clear velocity etc.
                    this.index = -1;
                    this.wrappedWorld.world.remove(this.body);
                }
            }
        }
    }

    constructor (node: Node, world: CannonWorld) {
        this.wrappedWorld = world;
        this.node = node;
        this.body.material = this.wrappedWorld.world.defaultMaterial;
        this.body.addEventListener('collide', this.onCollidedListener);
    }

    addShape (v: CannonShape) {
        const index = this.shapes.indexOf(v);
        if (index < 0) {
            this.body.addShape(v.shape, v.offset, v.quaterion);
            this.shapes.push(v);
        }
    }

    removeShape (v: CannonShape) {
        const index = this.shapes.indexOf(v);
        if (index >= 0) {
            this.shapes.splice(index, 1);
            this.body.removeShape(v.shape);
        }
    }

    syncSceneToPhysics () {
        if (this.node.hasChangedFlags) {

            Vec3.copy(this.body.position, this.node.worldPosition);
            Quat.copy(this.body.quaternion, this.node.worldRotation);

            if (this.node.hasChangedFlags & TransformDirtyBit.SCALE) {
                for (let i = 0; i < this.shapes.length; i++) {
                    this.shapes[i].setScale(this.node.worldScale);
                }
            }

            if (this.body.isSleeping()) {
                this.body.wakeUp();
            }
        }
    }

    syncPhysicsToScene () {
        if (this.body.type != ERigidBodyType.STATIC) {
            Vec3.copy(v3_0, this.body.position);
            Quat.copy(quat_0, this.body.quaternion);
            this.node.worldPosition = v3_0;
            this.node.worldRotation = quat_0;
        }
    }

    private _onCollided (event: CANNON.ICollisionEvent) {
        CollisionEventObject.type = event.event;
        const self = getWrap<CannonShape>(event.selfShape);
        const other = getWrap<CannonShape>(event.otherShape);
        CollisionEventObject.selfCollider = self.collider;
        CollisionEventObject.otherCollider = other.collider;

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

            // if (self.collider.node.hasChangedFlags) {
            //     self.sharedBody.syncSceneToPhysics();
            // }

            // if (other.collider.node.hasChangedFlags) {
            //     other.sharedBody.syncSceneToPhysics();
            // }
        }
    }

}