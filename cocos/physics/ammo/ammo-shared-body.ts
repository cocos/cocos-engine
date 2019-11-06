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
import { Cocos2AmmoVec3, Cocos2AmmoQuat, Ammo2CocosVec3, Ammo2CocosQuat } from './ammo-util';

const v3_0 = new Vec3();
const quat_0 = new Quat();
const contactsPool = [] as any;
const CollisionEventObject = {
    type: 'onCollisionEnter' as CollisionEventType,
    selfCollider: null as ColliderComponent | null,
    otherCollider: null as ColliderComponent | null,
    contacts: [] as any,
};

const quat_ammo = new Ammo.btQuaternion();

/**
 * sharedbody, node : sharedbody = 1 : 1
 * static \ dynamic \ kinematic (collider)
 * trigger
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
        if (wrappedBody) { newSB._wrappedBody = wrappedBody; }
        return newSB;
    }

    get wrappedBody () {
        return this._wrappedBody;
    }

    get shape () {
        return this._bodyShape;
    }

    get compoundShape () {
        return this._bodyShape as Ammo.btCompoundShape;
    }

    readonly node: Node;
    readonly wrappedWorld: AmmoWorld;

    get body () {
        return this._body;
    }
    get ghost () {
        return this._ghost;
    }
    /** for collider */
    _body!: Ammo.btRigidBody;
    _bodyShape!: Ammo.btCollisionShape;
    _wrappedBodyShapes: AmmoShape[] = [];
    _bodyQuat: Ammo.btQuaternion;

    /** for trigger */
    _ghost!: Ammo.btCollisionObject;
    _ghostShape!: Ammo.btCollisionShape;
    _wrappedGhostShapes: AmmoShape[] = [];

    private ref: number = 0;
    private bodyIndex: number = -1;
    private ghostIndex: number = -1;
    private _wrappedBody: AmmoRigidBody | null = null;

    /**
     * add or remove from world \
     * add, if enable \
     * remove, if disable & shapes.length == 0 & wrappedBody disable
     */
    set enabled (v: boolean) {
        if (v) {
            if (this.bodyIndex < 0) {
                this.bodyIndex = this.wrappedWorld.bodies.length;
                this.wrappedWorld.addSharedBody(this);
                this._body.setUserIndex(this.bodyIndex);
                this.syncInitial();
            }
        } else {
            if (this.bodyIndex >= 0) {
                // TODO: 待查，组件的 enabledInHierarchy 为什么还是 true
                const isRemoveBody = (this._wrappedBodyShapes.length == 0 && this.wrappedBody == null) ||
                    (this._wrappedBodyShapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.isEnabled) ||
                    (this._wrappedBodyShapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.rigidBody.enabledInHierarchy)

                if (isRemoveBody) {
                    this.bodyIndex = -1;
                    this.wrappedWorld.removeSharedBody(this);
                }

            }
        }
    }

    set ghostEnabled (v: boolean) {
        if (v) {
            if (this.ghostIndex < 0 && this._wrappedGhostShapes.length > 0) {
                this.ghostIndex = 1;
                this.wrappedWorld.addGhostObject(this);
                this.syncInitial();
            }
        } else {
            if (this.ghostIndex >= 0) {
                /** remove trigger */
                const isRemoveGhost = (this._wrappedGhostShapes.length == 0 && this._ghost);

                if (isRemoveGhost) {
                    this.ghostIndex = -1;
                    this.wrappedWorld.removeGhostObject(this);
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

        var st = new Ammo.btTransform();
        st.setIdentity();
        Cocos2AmmoVec3(st.getOrigin(), this.node.worldPosition)
        this._bodyQuat = new Ammo.btQuaternion();
        Cocos2AmmoQuat(this._bodyQuat, this.node.worldRotation);
        st.setRotation(this._bodyQuat);
        var motionState = new Ammo.btDefaultMotionState(st);
        var localInertia = new Ammo.btVector3(1.6666666269302368, 1.6666666269302368, 1.6666666269302368);
        this._bodyShape = new Ammo.btCompoundShape(true);
        var rbInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, this._bodyShape, localInertia);
        this._body = new Ammo.btRigidBody(rbInfo);
    }

    addShape (v: AmmoShape) {
        if (v.isTrigger) {
            const index = this._wrappedGhostShapes.indexOf(v);
            if (index < 0) {
                this._wrappedGhostShapes.push(v);
                v.setIndex(index);
            }
        } else {
            const index = this._wrappedBodyShapes.indexOf(v);
            if (index < 0) {
                this._wrappedBodyShapes.push(v);
                this.compoundShape.addChildShape(v.transform, v.shape);
                let i = this.compoundShape.getNumChildShapes() - 1;
                v.setIndex(i);
                v.setCompound(this.compoundShape);
            }
        }
    }

    removeShape (v: AmmoShape) {
        if (v.isTrigger) {
            const index = this._wrappedGhostShapes.indexOf(v);
            if (index >= 0) {
                this._wrappedGhostShapes.splice(index, 1);
                v.setIndex(-1);
            }
        } else {
            const index = this._wrappedBodyShapes.indexOf(v);
            if (index >= 0) {
                this._wrappedBodyShapes.splice(index, 1);
                v.setIndex(-1);
                v.setCompound(null);
            }
        }
    }

    syncSceneToPhysics () {
        if (this.node.hasChangedFlags) {
            const wt = this._body.getWorldTransform();
            Cocos2AmmoVec3(wt.getOrigin(), this.node.worldPosition)
            Cocos2AmmoQuat(this._bodyQuat, this.node.worldRotation);
            wt.setRotation(this._bodyQuat);
            this._body.activate();
            if (this.node.hasChangedFlags & TransformDirtyBit.SCALE) {
                for (let i = 0; i < this._wrappedBodyShapes.length; i++) {
                    this._wrappedBodyShapes[i].updateScale();
                }
            }
        }
    }

    /**
     * TODO: use motionstate
     */
    syncPhysicsToScene () {
        if (!this._body.isStaticObject()) {
            // let transform = new Ammo.btTransform();
            // this._body.getMotionState().getWorldTransform(transform);
            let transform = this._body.getWorldTransform();
            this.node.worldPosition = Ammo2CocosVec3(v3_0, transform.getOrigin());
            transform.getBasis().getRotation(quat_ammo);
            this.node.worldRotation = Ammo2CocosQuat(quat_0, quat_ammo);;
        }
    }

    syncInitial () {
        this._body.activate();
        const wt = this._body.getWorldTransform();
        Cocos2AmmoVec3(wt.getOrigin(), this.node.worldPosition)
        Cocos2AmmoQuat(this._bodyQuat, this.node.worldRotation);
        wt.setRotation(this._bodyQuat);
        for (let i = 0; i < this._wrappedBodyShapes.length; i++) {
            this._wrappedBodyShapes[i].updateScale();
        }
    }

    private destroy () {
        AmmoSharedBody.sharedBodesMap.delete(this.node.uuid);
        (this.node as any) = null;
        (this.wrappedWorld as any) = null;
        (this._body as any) = null;
        (this._wrappedBodyShapes as any) = null;
    }

    private onCollided (event: ICollisionEvent) {
        for (let i = 0; i < this._wrappedBodyShapes.length; i++) {
            const shape = this._wrappedBodyShapes[i];
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
