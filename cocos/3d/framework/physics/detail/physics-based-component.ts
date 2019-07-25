/**
 * @category physics
 * @hidden
 */
/** */

import { Component } from '../../../../components/component';
import { Mat4, Quat, Vec3 } from '../../../../core/value-types';
import { vec3 } from '../../../../core/vmath';
import { Node } from '../../../../scene-graph/node';
// tslint:disable-next-line:max-line-length
import { AfterStepCallback, BeforeStepCallback, PhysicsWorldBase, RigidBodyBase } from '../../../physics/api';
import { createRigidBody } from '../../../physics/instance';
import { ERigidBodyType, ETransformSource } from '../../../physics/physic-enum';

export class PhysicsBasedComponent extends Component {

    protected get _body () {
        return this._sharedBody.body;
    }

    protected get sharedBody () {
        return this._sharedBody;
    }

    protected get _assertPreload (): boolean {
        if (!this._isPreLoaded) {
            console.error('Physic Error :', 'Please make sure that the node has been added to the scene');
        }
        return this._isPreLoaded;
    }

    private _sharedBody!: SharedRigidBody;

    private _isPreLoaded: boolean = false;

    constructor () {
        super();
    }

    /**
     * @zh
     * 设置分组值。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public setGroup (v: number): void {
        if (this._assertPreload) {
            return this._body!.setGroup(v);
        }
    }

    /**
     * @zh
     * 获取分组值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getGroup (): number {
        if (this._assertPreload) {
            return this._body!.getGroup();
        }
        return 0;
    }

    /**
     * @zh
     * 添加分组值，可填要加入的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addGroup (v: number) {
        if (this._assertPreload) {
            return this._body!.addGroup(v);
        }
    }

    /**
     * @zh
     * 减去分组值，可填要移除的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public removeGroup (v: number) {
        if (this._assertPreload) {
            return this._body!.removeGroup(v);
        }
    }

    /**
     * @zh
     * 获取掩码值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getMask (): number {
        if (this._assertPreload) {
            return this._body!.getMask();
        }
        return 0;
    }

    /**
     * @zh
     * 设置掩码值。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public setMask (v: number) {
        if (this._assertPreload) {
            return this._body!.setMask(v);
        }
    }

    /**
     * @zh
     * 添加掩码值，可填入需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addMask (v: number) {
        if (this._assertPreload) {
            return this._body!.addMask(v);
        }
    }

    /**
     * @zh
     * 减去掩码值，可填入不需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public removeMask (v: number) {
        if (this._assertPreload) {
            return this._body!.removeMask(v);
        }
    }

    /// COMPONENT LIFECYCLE ///

    protected __preload () {
        if (!CC_EDITOR) {
            if (this._sharedBody == null) {
                const physicsBasedComponents = this.node.getComponents(PhysicsBasedComponent);
                let sharedBody: SharedRigidBody | null = null;
                for (const physicsBasedComponent of physicsBasedComponents) {
                    if (physicsBasedComponent._sharedBody) {
                        sharedBody = physicsBasedComponent._sharedBody;
                        break;
                    }
                }
                if (!sharedBody) {
                    // // binding collider to self or parents rigidbody
                    // // is exit rigidbody on the node or parents?
                    // const rigidbody = this._findRigidbody(this.node);
                    // if (rigidbody) {
                    //     if (rigidbody.sharedBody != null) {
                    //         sharedBody = rigidbody.sharedBody;
                    //     } else {
                    //         sharedBody = new SharedRigidBody(rigidbody.node, rigidbody, cc.director._physicsSystem._world);
                    //     }
                    // } else {
                    //     sharedBody = new SharedRigidBody(this.node, null, cc.director._physicsSystem._world);
                    // }

                    // binding collider to self rigidybody, if it exist.
                    const rigidbody = this.getComponent(cc.RigidBodyComponent);
                    sharedBody = new SharedRigidBody(this.node as Node, rigidbody, cc.director._physicsSystem._world);
                }
                sharedBody!.ref();
                this._sharedBody = sharedBody!;
            }

            this._isPreLoaded = true;
        }
    }

    protected onEnable () {
        if (!CC_EDITOR) {
            this.sharedBody.enable();
        }
    }

    protected onDisable () {
        if (!CC_EDITOR) {
            this.sharedBody.disable();
        }
    }

    protected onDestroy () {
        if (!CC_EDITOR) {
            this._sharedBody.deref();
            (this._sharedBody as any) = null;
        }
    }

    private _findRigidbody (begin: Node) {
        const rigidbody = begin.getComponent(cc.RigidBodyComponent);
        if (rigidbody) {
            return rigidbody;
        } else {
            if (begin.parent) {
                if (begin.parent === begin.scene) {
                    return null;
                } else {
                    return this._findRigidbody(begin.parent);
                }
            } else {
                return null;
            }
        }
    }
}

class SharedRigidBody {
    public get isShapeOnly (): boolean { return this._isShapeOnly; }

    public get body () {
        return this._body;
    }

    /** the source to manage body transfrom */
    public set transfromSource (v: ETransformSource) {
        if (v === ETransformSource.SCENE) {
            this._isShapeOnly = true;
        } else {
            this._isShapeOnly = false;
        }
    }

    public get rigidBody () {
        return this._rigidBody;
    }

    private static _tempMat4 = new Mat4();

    private static _tempQuat = new Quat();

    private static _tempVec3 = new Vec3();

    private _body: RigidBodyBase;

    private _refCount = 0;

    private _actived = false;

    private _world!: PhysicsWorldBase;

    private _rigidBody: object | null;

    private _node!: Node;

    private _worldScale: Vec3 = new Vec3(1, 1, 1);

    private _beforeStepCallback!: BeforeStepCallback;

    private _afterStepCallback!: AfterStepCallback;

    /** 是否只有Collider组件 */
    private _isShapeOnly: boolean = true;

    /** 上一次的缩放 */
    private _prevScale: Vec3 = new Vec3();

    constructor (node: Node, rigidBody: object | null, world: PhysicsWorldBase) {
        this._body = createRigidBody({
            name: node.name,
        });
        this._node = node;
        this._rigidBody = rigidBody;
        this._world = world;
        this._body.setUserData(this._rigidBody);

        this._beforeStepCallback = this._beforeStep.bind(this);
        if (!CC_PHYSICS_BUILT_IN) {
            this._afterStepCallback = this._afterStep.bind(this);

            if (this._rigidBody) {
                this._isShapeOnly = false;
            } else {
                this._isShapeOnly = true;
                this._body.setUseGravity(false);
            }
        }
    }

    public ref () {
        ++this._refCount;
    }

    public deref () {
        --this._refCount;
        if (!this._refCount) {
            this.destroy();
        }
    }

    public enable () {
        this._activeBody();
    }

    public disable () {
        this._deactiveBody();
    }

    public destroy () {
        // before destroy make sure body is deactive
        this._deactiveBody();

        this._body.setUserData(null);
        (this._body as any) = null;

        (this._beforeStepCallback as any) = null;
        if (!CC_PHYSICS_BUILT_IN) {
            (this._afterStepCallback as any) = null;
        }

        (this._world as any) = null;
        (this._node as any) = null;

        if (this._rigidBody) {
            (this._rigidBody as any) = null;
        }
    }

    public syncPhysWithScene () {
        this._syncPhysWithScene(this._node);
    }

    private _syncPhysWithScene (node: Node) {
        // sync position rotation
        node.getWorldMatrix(SharedRigidBody._tempMat4);
        node.getWorldRotation(SharedRigidBody._tempQuat);
        this._body.translateAndRotate(SharedRigidBody._tempMat4, SharedRigidBody._tempQuat);
    }

    /**
     * Push the rigidbody's transform information back to node.
     */
    private _syncSceneWithPhys () {
        if (!this._node) {
            return;
        }

        this._body.getPosition(SharedRigidBody._tempVec3);
        this._node.setWorldPosition(SharedRigidBody._tempVec3);
        if (!this._body.getFreezeRotation()) {
            this._body.getRotation(SharedRigidBody._tempQuat);
            this._node.setWorldRotation(SharedRigidBody._tempQuat);
        }
    }

    private _activeBody () {
        // Sync scenes, no matter how many activations
        this._syncPhysWithScene(this._node);

        if (this._actived) {
            return;
        }

        this._actived = true;
        this._body.setWorld(this._world);

        this._world.addBeforeStep(this._beforeStepCallback);
        if (!CC_PHYSICS_BUILT_IN) {
            this._world.addAfterStep(this._afterStepCallback);
            this._body.wakeUp();
        }
    }

    private _deactiveBody () {
        if (!this._actived) {
            return;
        }
        this._actived = false;

        this._world.removeBeforeStep(this._beforeStepCallback);
        if (!CC_PHYSICS_BUILT_IN) {
            this._world.removeAfterStep(this._afterStepCallback);
            this._body.sleep();
        }

        this._body.setWorld(null);
    }

    private _beforeStep () {
        // 开始物理计算之前，用户脚本或引擎功能有可能改变节点的Transform，所以需要判断并进行更新
        if (this._node.hasChanged) {
            // scale 进行单独判断，因为目前的物理系统处理后不会改变scale的属性
            if (!vec3.equals(this._prevScale, this._node.worldScale)) {
                this._body.scaleAllShapes(this._node.worldScale);
                vec3.copy(this._prevScale, this._node.worldScale);
            }
            this._syncPhysWithScene(this._node);

            if (!CC_PHYSICS_BUILT_IN) {
                if (this._body.isSleeping()) {
                    this._body.wakeUp();
                }
            }
        }
    }

    private _afterStep () {
        if (!CC_PHYSICS_BUILT_IN) {
            // 物理计算之后，除了只有形状组件的节点，其它有刚体组件的节点，并且刚体类型为DYNAMIC的，需要将计算结果同步到Scene中
            if (!this._isShapeOnly && this._body.getType() === ERigidBodyType.DYNAMIC) {
                this._syncSceneWithPhys();
            } else {
                // 对于只有形状组件的节点，需要将Scene中节点的Transform同步到Phyisc。
                // 这是因为物理计算后可能会改变一些节点，这会导致这些子节点的Transform也发生改变。
                if (this._node.hasChanged) {
                    this._syncPhysWithScene(this._node);

                    if (this._body.isSleeping()) {
                        this._body.wakeUp();
                    }
                }
            }
        }
    }
}
