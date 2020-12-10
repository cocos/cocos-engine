import { Node, Quat, Vec3 } from '../../core';
import { PhysXRigidBody } from './physx-rigid-body';
import { PhysXWorld } from './physx-world';
import { PhysXShape } from './shapes/physx-shape';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { copyPhysXTransform, getTempTransform, PX, setMassAndUpdateInertia } from './export-physx';
import { VEC3_0 } from '../utils/util';

export class PhysXSharedBody {
    private static idCounter = 0;
    private static readonly sharedBodesMap = new Map<string, PhysXSharedBody>();

    static getSharedBody (node: Node, wrappedWorld: PhysXWorld, wrappedBody?: PhysXRigidBody): PhysXSharedBody {
        const key = node.uuid;
        let newSB!: PhysXSharedBody;
        if (PhysXSharedBody.sharedBodesMap.has(key)) {
            newSB = PhysXSharedBody.sharedBodesMap.get(key)!;
        } else {
            newSB = new PhysXSharedBody(node, wrappedWorld);
            PhysXSharedBody.sharedBodesMap.set(node.uuid, newSB);
        }
        if (wrappedBody) { newSB._wrappedBody = wrappedBody; }
        return newSB;
    }

    readonly id: number;
    readonly node: Node;
    readonly wrappedWorld: PhysXWorld;
    readonly wrappedShapes: PhysXShape[] = [];

    get isStatic (): boolean { return this._isStatic; }
    get isKinematic (): boolean { return this._isKinematic; }
    get isDynamic (): boolean { return !this._isStatic && !this._isKinematic; }
    get wrappedBody (): PhysXRigidBody | null { return this._wrappedBody; }
    get impl (): any {
        this._initActor();
        return this._impl;
    }

    private _index = -1;
    private _ref = 0;
    private _isStatic = false;
    private _isKinematic = false;
    private _impl!: PhysX.RigidActor | any;
    private _wrappedBody: PhysXRigidBody | null = null;
    private _filterData: any;

    set reference (v: boolean) {
        this._ref = v ? this._ref + 1 : this._ref - 1;
        if (this._ref === 0) { this.destroy(); }
    }

    set enabled (v: boolean) {
        if (v) {
            if (this._index < 0) {
                this._index = this.wrappedWorld.wrappedBodies.length;
                this.wrappedWorld.addActor(this);
            }
        } else if (this._index >= 0) {
            const ws = this.wrappedShapes;
            const wb = this.wrappedBody;
            const isRemove = (ws.length === 0 && wb == null)
                || (ws.length === 0 && wb != null && !wb.isEnabled);

            if (isRemove) {
                this._index = -1;
                this.clearForces();
                this.clearVelocity();
                this.wrappedWorld.removeActor(this);
            }
        }
    }

    constructor (node: Node, wrappedWorld: PhysXWorld) {
        this.id = PhysXSharedBody.idCounter++;
        this.node = node;
        this.wrappedWorld = wrappedWorld;
        this._filterData = {
            word0: 1,
            word1: ((0xffffffff & (~2)) >>> 0),
            word2: 0,
            word3: 0,
        };
    }

    private _initActor (): void {
        if (this._impl) return;
        const t = getTempTransform(this.node.worldPosition, this.node.worldRotation);
        const wb = this.wrappedBody;
        if (wb) {
            const rb = wb.rigidBody;
            if (rb.mass === 0) {
                this._isStatic = true;
                this._impl = this.wrappedWorld.physics.createRigidStatic(t);
            } else {
                this._isStatic = false;
                this._impl = this.wrappedWorld.physics.createRigidDynamic(t);
                this._impl.setMass(rb.mass);
                this._impl.setActorFlag(PX.ActorFlag.eDISABLE_GRAVITY, !rb.useGravity);
                this.setRigidBodyFlag(PX.RigidBodyFlag.eKINEMATIC, rb.isKinematic);
                this._impl.setLinearDamping(rb.linearDamping);
                this._impl.setAngularDamping(rb.angularDamping);
                const lf = rb.linearFactor;
                this._impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_LINEAR_X, !lf.x);
                this._impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_LINEAR_Y, !lf.y);
                this._impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_LINEAR_Z, !lf.z);
                const af = rb.angularFactor;
                this._impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_X, !af.x);
                this._impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_Y, !af.y);
                this._impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_Z, !af.z);
            }
        } else {
            this._isStatic = true;
            this._impl = this.wrappedWorld.physics.createRigidStatic(t);
        }
        if (this._impl && this._impl.$$) {
            PX.IMPL_PTR[this._impl.$$.ptr] = this;
        }
    }

    addShape (ws: PhysXShape): void {
        const index = this.wrappedShapes.indexOf(ws);
        if (index < 0) {
            this._filterData.word2 = ws.id;
            ws.setIndex(this.wrappedShapes.length);
            ws.impl.setQueryFilterData(this._filterData);
            ws.impl.setSimulationFilterData(this._filterData);
            this.impl.attachShape(ws.impl);
            this.wrappedShapes.push(ws);
            if (!ws.collider.isTrigger) {
                if (!Vec3.strictEquals(ws.collider.center, Vec3.ZERO)) this.updateCenterOfMass();
                if (this.isDynamic) setMassAndUpdateInertia(this._impl, this._wrappedBody!.rigidBody.mass);
            }
        }
    }

    removeShape (ws: PhysXShape): void {
        const index = this.wrappedShapes.indexOf(ws);
        if (index >= 0) {
            ws.setIndex(-1);
            this.impl.detachShape(ws.impl, true);
            this.wrappedShapes.splice(index, 1);
            if (!ws.collider.isTrigger) {
                if (!Vec3.strictEquals(ws.collider.center, Vec3.ZERO)) this.updateCenterOfMass();
                if (this.isDynamic) setMassAndUpdateInertia(this._impl, this._wrappedBody!.rigidBody.mass);
            }
        }
    }

    setMass (v: number): void {
        if (v <= 0) return;
        if (!this.isDynamic) return;
        setMassAndUpdateInertia(this._impl, v);
    }

    setRigidBodyFlag (v: any, b: boolean): void {
        if (v === PX.RigidBodyFlag.eKINEMATIC) {
            this._isKinematic = b;
        }
        this.impl.setRigidBodyFlag(v, b);
    }

    syncSceneToPhysics (): void {
        const node = this.node;
        if (node.hasChangedFlags) {
            if (node.hasChangedFlags & TransformBit.SCALE) {
                const l = this.wrappedShapes.length;
                for (let i = 0; i < l; i++) {
                    this.wrappedShapes[i].updateScale();
                }
            }
            const trans = getTempTransform(node.worldPosition, node.worldRotation);
            if (this._isKinematic) {
                this._impl.setKinematicTarget(trans);
            } else {
                this._impl.setGlobalPose(trans, true);
            }
        }
    }

    syncPhysicsToScene (): void {
        if (this._isStatic || this._impl.isSleeping()) return;
        const transform = this._impl.getGlobalPose();
        copyPhysXTransform(this.node, transform);
    }

    setGroup (v: number): void {
        this._filterData.word0 = v;
        this.updateFiltering();
    }

    getGroup (): number {
        return this._filterData.word0;
    }

    addGroup (v: number): void {
        this._filterData.word0 |= v;
        this.updateFiltering();
    }

    removeGroup (v: number): void {
        this._filterData.word0 &= ~v;
        this.updateFiltering();
    }

    setMask (v: number): void {
        if (v === -1) v = 0xffffffff;
        this._filterData.word1 = v;
        this.updateFiltering();
    }

    getMask (): number {
        return this._filterData.word1;
    }

    addMask (v: number): void {
        this._filterData.word1 |= v;
        this.updateFiltering();
    }

    removeMask (v: number): void {
        this._filterData.word1 &= ~v;
        this.updateFiltering();
    }

    updateFiltering (): void {
        for (let i = 0; i < this.wrappedShapes.length; i++) {
            this._filterData.word2 = this.wrappedShapes[i].id;
            this.wrappedShapes[i].impl.setQueryFilterData(this._filterData);
            this.wrappedShapes[i].impl.setSimulationFilterData(this._filterData);
        }
    }

    updateCenterOfMass (): void {
        if (this._isStatic || !this._impl) return;
        const center = VEC3_0;
        center.set(0, 0, 0);
        for (let i = 0; i < this.wrappedShapes.length; i++) {
            center.subtract(this.wrappedShapes[i].collider.center);
        }
        this._impl.setCMassLocalPose(getTempTransform(center, Quat.IDENTITY));
    }

    clearForces (): void {
        if (this._isStatic || this._isKinematic) return;
        this._impl.clearForce(PX.ForceMode.eFORCE); // this._impl.clearForce(PX.ForceMode.eACCELERATION);
        this._impl.clearForce(PX.ForceMode.eIMPULSE); // this._impl.clearForce(PX.ForceMode.eVELOCITY_CHANGE);
        this._impl.clearTorque(PX.ForceMode.eFORCE);
        this._impl.clearTorque(PX.ForceMode.eIMPULSE);
    }

    clearVelocity (): void {
        if (this._isStatic || this._isKinematic) return;
        this._impl.setLinearVelocity(Vec3.ZERO, false);
        this._impl.setAngularVelocity(Vec3.ZERO, false);
    }

    destroy (): void {
        if (this._impl && this._impl.$$) {
            PX.IMPL_PTR[this._impl.$$.ptr] = null;
            delete PX.IMPL_PTR[this._impl.$$.ptr];
            this._impl.release();
        }
        PhysXSharedBody.sharedBodesMap.delete(this.node.uuid);
    }
}
