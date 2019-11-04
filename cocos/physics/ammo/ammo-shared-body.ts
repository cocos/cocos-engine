import Ammo from 'ammo.js';
import { Quat, Vec3 } from '../../core/math';
import { ERigidBodyType } from '../framework/physics-enum';
import { ColliderComponent } from '../../../exports/physics-framework';
import { TransformDirtyBit } from '../../core/scene-graph/node-enum';
import { Node } from '../../core';
import { CollisionEventType, ICollisionEvent } from '../framework/physics-interface';
import { AmmoWorld } from './ammo-world';
import { AmmoRigidBody } from './ammo-rigid-body';
import { AmmoShape } from './shapes/ammo-shape';

const v3_0 = new Vec3();
const quat_0 = new Quat();
const contactsPool = [] as any;
const CollisionEventObject = {
    type: 'onCollisionEnter' as CollisionEventType,
    selfCollider: null as ColliderComponent | null,
    otherCollider: null as ColliderComponent | null,
    contacts: [] as any,
};

/**
 * sharedbody, node : sharedbody = 1 : 1
 * static
 */
export class AmmoSharedBody {

    private static readonly sharedBodesMap = new Map<string, AmmoSharedBody>();

    static getSharedBody (node: Node, wrappedWorld: AmmoWorld, wrappedBody?: AmmoRigidBody) {
        const key = node.uuid;
        let newSB!: AmmoSharedBody;
        if (AmmoSharedBody.sharedBodesMap.has(key)) {
            newSB = AmmoSharedBody.sharedBodesMap.get(key)!;
        } else {
            const newSB = new AmmoSharedBody(node, wrappedWorld);
            AmmoSharedBody.sharedBodesMap.set(node.uuid, newSB);
        }
        if (wrappedBody) { newSB.wrappedBody = wrappedBody; }
        return newSB;
    }

    readonly node: Node;
    readonly wrappedWorld: AmmoWorld;
    readonly body!: Ammo.btRigidBody;//= new Ammo.btRigidBody();
    readonly shapes: AmmoShape[] = [];
    wrappedBody: AmmoRigidBody | null = null;

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
                // this.wrappedWorld.addSharedBody(this);
                this.syncInitial();
            }
        } else {
            if (this.index >= 0) {
                // TODO: 待查，组件的 enabledInHierarchy 为什么还是 true
                const isRemove = (this.shapes.length == 0 && this.wrappedBody == null) ||
                    (this.shapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.rigidBody.enabledInHierarchy) ||
                    (this.shapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.isEnabled)

                if (isRemove) {
                    // this.body.sleep(); // clear velocity etc.
                    this.index = -1;
                    // this.wrappedWorld.removeSharedBody(this);
                }
            }
        }
    }

    set reference (v: boolean) {
        v ? this.ref++ : this.ref--;
        if (this.ref == 0) { this.destroy(); }
    }

    private constructor (node: Node, wrappedWorld: AmmoWorld) {
        this.wrappedWorld = wrappedWorld;
        this.node = node;
        // this.body.material = this.wrappedWorld.world.defaultMaterial;
    }

    addShape (v: AmmoShape) {
        const index = this.shapes.indexOf(v);
        if (index < 0) {

            this.shapes.push(v);

            // v.setIndex(index);
        }
    }

    removeShape (v: AmmoShape) {
        const index = this.shapes.indexOf(v);
        if (index >= 0) {
            this.shapes.splice(index, 1);
            // this.body.removeShape(v.shape);

            // v.setIndex(-1);
        }
    }

    syncSceneToPhysics () {
        if (this.node.hasChangedFlags) {


            if (this.node.hasChangedFlags & TransformDirtyBit.SCALE) {
                for (let i = 0; i < this.shapes.length; i++) {
                    // this.shapes[i].setScale(this.node.worldScale);
                }
            }

        }
    }

    syncPhysicsToScene () {
    }

    syncInitial () {

        for (let i = 0; i < this.shapes.length; i++) {
            // this.shapes[i].setScale(this.node.worldScale);
        }

        // if (this.body.isSleeping()) {
        //     this.body.wakeUp();
        // }
    }

    private destroy () {
        AmmoSharedBody.sharedBodesMap.delete(this.node.uuid);
        (this.node as any) = null;
        (this.wrappedWorld as any) = null;
        (this.body as any) = null;
        (this.shapes as any) = null;
        (this.onCollidedListener as any) = null;
    }

    private onCollided (event: ICollisionEvent) {
        for (let i = 0; i < this.shapes.length; i++) {
            const shape = this.shapes[i];
            shape.collider.emit(event.type, event);

            // if (self.collider.node.hasChangedFlags) {
            //     self.sharedBody.syncSceneToPhysics();
            // }

            // if (other.collider.node.hasChangedFlags) {
            //     other.sharedBody.syncSceneToPhysics();
            // }
        }
    }
}
