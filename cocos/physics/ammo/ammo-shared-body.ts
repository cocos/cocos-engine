import Ammo from './ammo-instantiated';
import { Quat, Vec3 } from '../../core/math';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { Node } from '../../core';
import { AmmoWorld } from './ammo-world';
import { AmmoRigidBody } from './ammo-rigid-body';
import { AmmoShape } from './shapes/ammo-shape';
import { cocos2AmmoVec3, cocos2AmmoQuat, ammo2CocosVec3, ammo2CocosQuat, ammoDeletePtr } from './ammo-util';
import { AmmoCollisionFlags, AmmoCollisionObjectStates } from './ammo-enum';
import { AmmoInstance } from './ammo-instance';
import { IAmmoBodyStruct, IAmmoGhostStruct } from './ammo-interface';

const v3_0 = new Vec3();
const quat_0 = new Quat();
let sharedIDCounter = 0;

/**
 * shared object, node : shared = 1 : 1
 * body for static \ dynamic \ kinematic (collider)
 * ghost for trigger
 */
export class AmmoSharedBody {

    private static idCounter = 0;
    private static readonly sharedBodesMap = new Map<string, AmmoSharedBody>();

    static getSharedBody (node: Node, wrappedWorld: AmmoWorld, wrappedBody?: AmmoRigidBody) {
        const key = node.uuid;
        let newSB!: AmmoSharedBody;
        if (AmmoSharedBody.sharedBodesMap.has(key)) {
            newSB = AmmoSharedBody.sharedBodesMap.get(key)!;
        } else {
            newSB = new AmmoSharedBody(node, wrappedWorld);
            AmmoSharedBody.sharedBodesMap.set(node.uuid, newSB);
        }
        if (wrappedBody) { newSB._wrappedBody = wrappedBody; }
        return newSB;
    }

    get wrappedBody () {
        return this._wrappedBody;
    }

    get bodyCompoundShape () {
        return this.bodyStruct.shape as Ammo.btCompoundShape;
    }

    get ghostCompoundShape () {
        return this.ghostStruct.shape as Ammo.btCompoundShape;
    }

    get body () {
        return this.bodyStruct.body;
    }

    get ghost () {
        return this.ghostStruct.ghost;
    }

    get collisionFilterGroup () { return this._collisionFilterGroup; }
    set collisionFilterGroup (v: number) {
        if (v != this._collisionFilterGroup) {
            this._collisionFilterGroup = v;
            this.updateByReAdd();
        }
    }

    get collisionFilterMask () { return this._collisionFilterMask; }
    set collisionFilterMask (v: number) {
        if (v != this._collisionFilterMask) {
            this._collisionFilterMask = v;
            this.updateByReAdd();
        }
    }

    readonly id: number;
    readonly node: Node;
    readonly wrappedWorld: AmmoWorld;
    readonly bodyStruct: IAmmoBodyStruct;
    readonly ghostStruct: IAmmoGhostStruct;

    private _collisionFilterGroup: number = 1;
    private _collisionFilterMask: number = -1;

    private ref: number = 0;
    private bodyIndex: number = -1;
    private ghostIndex: number = -1;
    private _wrappedBody: AmmoRigidBody | null = null;

    /**
     * add or remove from world \
     * add, if enable \
     * remove, if disable & shapes.length == 0 & wrappedBody disable
     */
    set bodyEnabled (v: boolean) {
        if (v) {
            if (this.bodyIndex < 0) {
                this.bodyIndex = this.wrappedWorld.bodies.length;
                this.wrappedWorld.addSharedBody(this);
                this.syncInitialBody();
            }
        } else {
            if (this.bodyIndex >= 0) {
                const isRemoveBody = (this.bodyStruct.wrappedShapes.length == 0 && this.wrappedBody == null) ||
                    (this.bodyStruct.wrappedShapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.isEnabled) ||
                    (this.bodyStruct.wrappedShapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.rigidBody.enabledInHierarchy)

                if (isRemoveBody) {
                    this.body.clearState(); // clear velocity etc.
                    this.bodyIndex = -1;
                    this.wrappedWorld.removeSharedBody(this);
                }

            }
        }
    }

    set ghostEnabled (v: boolean) {
        if (v) {
            if (this.ghostIndex < 0 && this.ghostStruct.wrappedShapes.length > 0) {
                this.ghostIndex = 1;
                this.wrappedWorld.addGhostObject(this);
                this.syncInitialGhost();
            }
        } else {
            if (this.ghostIndex >= 0) {
                /** remove trigger */
                const isRemoveGhost = (this.ghostStruct.wrappedShapes.length == 0 && this.ghost);

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
        this.id = AmmoSharedBody.idCounter++;

        /** body struct */
        const st = new Ammo.btTransform();
        st.setIdentity();
        cocos2AmmoVec3(st.getOrigin(), this.node.worldPosition)
        const bodyQuat = new Ammo.btQuaternion();
        cocos2AmmoQuat(bodyQuat, this.node.worldRotation);
        st.setRotation(bodyQuat);
        const motionState = new Ammo.btDefaultMotionState(st);
        const localInertia = new Ammo.btVector3(1.6666666269302368, 1.6666666269302368, 1.6666666269302368);
        const bodyShape = new Ammo.btCompoundShape();
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, bodyShape, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);
        this.bodyStruct = {
            'id': sharedIDCounter++,
            'body': body,
            'localInertia': localInertia,
            'motionState': motionState,
            'startTransform': st,
            'shape': bodyShape,
            'rbInfo': rbInfo,
            'worldQuat': bodyQuat,
            'wrappedShapes': []
        }
        AmmoInstance.bodyStructs['KEY' + this.bodyStruct.id] = this.bodyStruct;
        this.body.setUserIndex(this.bodyStruct.id);

        /** ghost struct */
        const ghost = new Ammo.btCollisionObject();
        const ghostShape = new Ammo.btCompoundShape();
        ghost.setCollisionShape(ghostShape);
        ghost.setCollisionFlags(AmmoCollisionFlags.CF_NO_CONTACT_RESPONSE);
        this.ghostStruct = {
            'id': sharedIDCounter++,
            'ghost': ghost,
            'shape': ghostShape,
            'worldQuat': new Ammo.btQuaternion(),
            'wrappedShapes': []
        }
        AmmoInstance.ghostStructs['KEY' + this.ghostStruct.id] = this.ghostStruct;
        this.ghost.setUserIndex(this.ghostStruct.id);

        /** DEBUG */
        this.body.setActivationState(AmmoCollisionObjectStates.DISABLE_DEACTIVATION);
        this.ghost.setActivationState(AmmoCollisionObjectStates.DISABLE_DEACTIVATION);
    }

    addShape (v: AmmoShape, isTrigger: boolean) {
        if (isTrigger) {
            const index = this.ghostStruct.wrappedShapes.indexOf(v);
            if (index < 0) {
                this.ghostStruct.wrappedShapes.push(v);
                v.setCompound(this.ghostCompoundShape);
                this.ghostEnabled = true;
            }
        } else {
            const index = this.bodyStruct.wrappedShapes.indexOf(v);
            if (index < 0) {
                this.bodyStruct.wrappedShapes.push(v);
                v.setCompound(this.bodyCompoundShape);
                this.bodyEnabled = true;
            }
        }
    }

    removeShape (v: AmmoShape, isTrigger: boolean) {
        if (isTrigger) {
            const index = this.ghostStruct.wrappedShapes.indexOf(v);
            if (index >= 0) {
                this.ghostStruct.wrappedShapes.splice(index, 1);
                v.setCompound(null);
                this.ghostEnabled = false;
            }
        } else {
            const index = this.bodyStruct.wrappedShapes.indexOf(v);
            if (index >= 0) {
                this.bodyStruct.wrappedShapes.splice(index, 1);
                v.setCompound(null);
                this.bodyEnabled = false;
            }
        }
    }

    syncSceneToPhysics () {
        if (this.node.hasChangedFlags) {
            const wt = this.body.getWorldTransform();
            cocos2AmmoVec3(wt.getOrigin(), this.node.worldPosition)
            cocos2AmmoQuat(this.bodyStruct.worldQuat, this.node.worldRotation);
            wt.setRotation(this.bodyStruct.worldQuat);
            if (this.isBodySleeping()) this.body.activate();

            if (this.node.hasChangedFlags & TransformBit.SCALE) {
                for (let i = 0; i < this.bodyStruct.wrappedShapes.length; i++) {
                    this.bodyStruct.wrappedShapes[i].setScale();
                }
            }
        }
    }

    /**
     * TODO: use motion state
     */
    syncPhysicsToScene () {
        if (this.body.isStaticObject() || this.isBodySleeping()) {
            return;
        }

        // let transform = new Ammo.btTransform();
        // this.body.getMotionState().getWorldTransform(transform);
        const wt0 = this.body.getWorldTransform();
        this.node.worldPosition = ammo2CocosVec3(v3_0, wt0.getOrigin());
        wt0.getBasis().getRotation(this.bodyStruct.worldQuat);
        this.node.worldRotation = ammo2CocosQuat(quat_0, this.bodyStruct.worldQuat);

        const wt1 = this.ghost.getWorldTransform();
        cocos2AmmoVec3(wt1.getOrigin(), this.node.worldPosition)
        cocos2AmmoQuat(this.ghostStruct.worldQuat, this.node.worldRotation);
        wt1.setRotation(this.ghostStruct.worldQuat);
    }

    syncSceneToGhost () {
        if (this.node.hasChangedFlags) {
            const wt1 = this.ghost.getWorldTransform();
            cocos2AmmoVec3(wt1.getOrigin(), this.node.worldPosition)
            cocos2AmmoQuat(this.ghostStruct.worldQuat, this.node.worldRotation);
            wt1.setRotation(this.ghostStruct.worldQuat);
            this.ghost.activate();

            if (this.node.hasChangedFlags & TransformBit.SCALE) {
                for (let i = 0; i < this.ghostStruct.wrappedShapes.length; i++) {
                    this.ghostStruct.wrappedShapes[i].setScale();
                }
            }
        }
    }

    syncInitialBody () {
        const wt = this.body.getWorldTransform();
        cocos2AmmoVec3(wt.getOrigin(), this.node.worldPosition)
        cocos2AmmoQuat(this.bodyStruct.worldQuat, this.node.worldRotation);
        wt.setRotation(this.bodyStruct.worldQuat);
        for (let i = 0; i < this.bodyStruct.wrappedShapes.length; i++) {
            this.bodyStruct.wrappedShapes[i].setScale();
        }
        this.body.activate();
    }

    syncInitialGhost () {
        const wt1 = this.ghost.getWorldTransform();
        cocos2AmmoVec3(wt1.getOrigin(), this.node.worldPosition)
        cocos2AmmoQuat(this.ghostStruct.worldQuat, this.node.worldRotation);
        wt1.setRotation(this.ghostStruct.worldQuat);
        for (let i = 0; i < this.ghostStruct.wrappedShapes.length; i++) {
            this.ghostStruct.wrappedShapes[i].setScale();
        }
        this.ghost.activate();
    }

    updateByReAdd () {
        /**
         * see: https://pybullet.org/Bullet/phpBB3/viewtopic.php?f=9&t=5312&p=19094&hilit=how+to+change+group+mask#p19097
         */
        if (this.bodyIndex >= 0) {
            this.wrappedWorld.removeSharedBody(this);
            this.wrappedWorld.addSharedBody(this);
            this.bodyIndex = this.wrappedWorld.bodies.length;
        }
        if (this.ghostIndex >= 0) {
            this.wrappedWorld.removeGhostObject(this);
            this.wrappedWorld.addGhostObject(this);
            this.ghostIndex = this.wrappedWorld.ghosts.length;
        }
    }

    private destroy () {
        AmmoSharedBody.sharedBodesMap.delete(this.node.uuid);
        (this.node as any) = null;
        (this.wrappedWorld as any) = null;

        const bodyStruct = this.bodyStruct;
        // Ammo.destroy(bodyStruct.body);
        Ammo.destroy(bodyStruct.localInertia);
        // Ammo.destroy(bodyStruct.motionState);
        // Ammo.destroy(bodyStruct.rbInfo);
        // Ammo.destroy(bodyStruct.shape);
        // Ammo.destroy(bodyStruct.startTransform);
        Ammo.destroy(bodyStruct.worldQuat);
        ammoDeletePtr(bodyStruct.motionState, Ammo.btDefaultMotionState);
        ammoDeletePtr(bodyStruct.rbInfo, Ammo.btRigidBodyConstructionInfo);
        ammoDeletePtr(bodyStruct.body, Ammo.btRigidBody);
        ammoDeletePtr(bodyStruct.body, Ammo.btCollisionObject);
        ammoDeletePtr(bodyStruct.shape, Ammo.btCompoundShape);
        ammoDeletePtr(bodyStruct.startTransform, Ammo.btTransform);
        ammoDeletePtr(bodyStruct.localInertia, Ammo.btVector3);
        ammoDeletePtr(bodyStruct.worldQuat, Ammo.btQuaternion);
        const key0 = 'KEY' + bodyStruct.id;
        delete AmmoInstance.bodyStructs[key0];

        const ghostStruct = this.ghostStruct;
        // Ammo.destroy(ghostStruct.ghost);
        // Ammo.destroy(ghostStruct.shape);
        Ammo.destroy(ghostStruct.worldQuat);
        ammoDeletePtr(ghostStruct.ghost, Ammo.btCollisionObject);
        ammoDeletePtr(ghostStruct.shape, Ammo.btCompoundShape);
        ammoDeletePtr(ghostStruct.worldQuat, Ammo.btQuaternion);
        const key1 = 'KEY' + ghostStruct.id;
        delete AmmoInstance.bodyStructs[key1];

        (this.bodyStruct as any) = null;
        (this.ghostStruct as any) = null;
    }

    private isBodySleeping () {
        const state = this.body.getActivationState();
        return state == AmmoCollisionObjectStates.ISLAND_SLEEPING;
    }
}
