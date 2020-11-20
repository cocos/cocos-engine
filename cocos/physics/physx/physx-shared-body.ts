import { Node, Quat, Vec3 } from '../../core';
import { PhysXRigidBody } from './physx-rigid-body';
import { PhysXWorld } from './physx-world';
import { PhysXShape } from './shapes/physx-shape';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { PX, USE_BYTEDANCE, _pxtrans, _trans } from './export-physx';
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
                this.wrappedWorld.removeActor(this);
            }
        }
    }

    constructor (node: Node, wrappedWorld: PhysXWorld) {
        this.id = PhysXSharedBody.idCounter++;
        this.node = node;
        this.wrappedWorld = wrappedWorld;
        if (USE_BYTEDANCE) {
            this._filterData = {
                word0: 1,
                word1: ((0xffffffff & (~2)) >>> 0),
                word2: 0,
                word3: 0,
            };
        } else {
            this._filterData = new PX.PxFilterData(1, ((0xffffffff & (~2)) >>> 0), 0, 0);
        }
    }

    private _initActor (): void {
        if (this._impl) return;
        const pos = _trans.translation;
        const rot = _trans.rotation;
        Vec3.copy(pos, this.node.worldPosition);
        Quat.copy(rot, this.node.worldRotation);
        let t = _trans;
        if (USE_BYTEDANCE) {
            _pxtrans.setPosition(pos);
            _pxtrans.setQuaternion(rot);
            t = _pxtrans;
        }
        const wb = this.wrappedBody;
        if (wb) {
            const rb = wb.rigidBody;
            if (rb.mass === 0) {
                this._isStatic = true;
                this._impl = this.wrappedWorld.physics.createRigidStatic(t as any);
            } else {
                this._isStatic = false;
                this._impl = this.wrappedWorld.physics.createRigidDynamic(t as any);
                this._impl.setMass(rb.mass);
                if (USE_BYTEDANCE) {
                    this._impl.setActorFlag(PX.ActorFlag.eDISABLE_GRAVITY, !rb.useGravity);
                } else {
                    this._impl.setActorFlag(PX.PxActorFlag.eDISABLE_GRAVITY, !rb.useGravity);
                    this._impl.setRigidBodyFlag(PX.PxRigidBodyFlag.eKINEMATIC, rb.isKinematic);
                }
                this._impl.setLinearDamping(rb.linearDamping);
                this._impl.setAngularDamping(rb.angularDamping);
                const lf = rb.linearFactor;
                if (USE_BYTEDANCE) {
                    this._impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_LINEAR_X, !lf.x);
                    this._impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_LINEAR_Y, !lf.y);
                    this._impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_LINEAR_Z, !lf.z);
                } else {
                    this._impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_LINEAR_X, !lf.x);
                    this._impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_LINEAR_Y, !lf.y);
                    this._impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_LINEAR_Z, !lf.z);
                }
                const af = rb.angularFactor;
                if (USE_BYTEDANCE) {
                    this._impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_X, !af.x);
                    this._impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_Y, !af.y);
                    this._impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_Z, !af.z);
                } else {
                    this._impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_ANGULAR_X, !af.x);
                    this._impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_ANGULAR_Y, !af.y);
                    this._impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_ANGULAR_Z, !af.z);
                }
            }
        } else {
            this._isStatic = true;
            this._impl = this.wrappedWorld.physics.createRigidStatic(t as any);
        }
        if (this._impl) {
            if (USE_BYTEDANCE) {
                // PX.IMPL_PTR[this._impl.$$.ptr] = this;
            } else {
                PX.IMPL_PTR[this._impl.$$.ptr] = this;
            }
        }
    }

    addShape (ws: PhysXShape): void {
        const index = this.wrappedShapes.indexOf(ws);
        if (index < 0) {
            this._filterData.word2 = ws.id;
            ws.impl.setQueryFilterData(this._filterData);
            ws.impl.setSimulationFilterData(this._filterData);
            this.impl.attachShape(ws.impl);
            this.wrappedShapes.push(ws);

            if (!Vec3.strictEquals(ws.collider.center, Vec3.ZERO)) {
                this.updateCenterOfMass();
            }

            if (!this._isStatic) {
                if (USE_BYTEDANCE) {
                    PX.RigidBodyExt.setMassAndUpdateInertia(this._impl, this._wrappedBody!.rigidBody.mass);
                } else {
                    this.impl.setMassAndUpdateInertia(this._wrappedBody!.rigidBody.mass);
                }
            }
        }
    }

    removeShape (ws: PhysXShape): void {
        const index = this.wrappedShapes.indexOf(ws);
        if (index >= 0) {
            this.impl.detachShape(ws.impl, true);
            this.wrappedShapes.splice(index, 1);

            if (!Vec3.strictEquals(ws.collider.center, Vec3.ZERO)) this.updateCenterOfMass();

            if (!this._isStatic) {
                if (USE_BYTEDANCE) {
                    PX.RigidBodyExt.setMassAndUpdateInertia(this._impl, this._wrappedBody!.rigidBody.mass);
                } else {
                    this.impl.setMassAndUpdateInertia(this._wrappedBody!.rigidBody.mass);
                }
            }
        }
    }

    setMass (m: number): void {

    }

    setRigidBodyFlag (v: any, b: boolean): void {
        if (USE_BYTEDANCE) {
            if (v === PX.RigidBodyFlag.eKINEMATIC) {
                this._isKinematic = b;
            }
        } else if (v === PX.PxRigidBodyFlag.eKINEMATIC) {
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
            const pos = _trans.translation;
            const rot = _trans.rotation;
            Vec3.copy(pos, node.worldPosition);
            Quat.copy(rot, node.worldRotation);
            if (USE_BYTEDANCE) {
                _pxtrans.setPosition(pos);
                _pxtrans.setQuaternion(rot);
                if (this._isKinematic) {
                    this._impl.setKinematicTarget(_pxtrans);
                } else {
                    this._impl.setGlobalPose(_pxtrans, true);
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (this._isKinematic) {
                    this._impl.setKinematicTarget(_trans);
                } else {
                    this._impl.setGlobalPose(_trans, true);
                }
            }
        }
    }

    syncPhysicsToScene (): void {
        if (this._isStatic || this._impl.isSleeping()) return;
        const transform = this._impl.getGlobalPose();
        const node = this.node;
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
        if (USE_BYTEDANCE) {
            _pxtrans.setPosition(center);
            _pxtrans.setQuaternion(Quat.IDENTITY);
            this._impl.setCMassLocalPose(_pxtrans);
        } else {
            Vec3.copy(_trans.translation, center);
            Quat.copy(_trans.rotation, Quat.IDENTITY);
            this._impl.setCMassLocalPose(_trans);
        }
    }

    destroy (): void {
        if (this._impl) {
            if (USE_BYTEDANCE) {
                // this._impl.release();
            } else {
                PX.IMPL_PTR[this._impl.$$.ptr] = null;
                delete PX.IMPL_PTR[this._impl.$$.ptr];
                this._impl.release();
            }
        }
        PhysXSharedBody.sharedBodesMap.delete(this.node.uuid);
    }
}
