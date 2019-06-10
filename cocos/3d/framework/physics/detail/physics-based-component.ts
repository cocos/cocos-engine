import { Component } from '../../../../components/component';
import { ccclass } from '../../../../core/data/class-decorator';
import { Mat4, Quat, Vec3 } from '../../../../core/value-types';
import { quat, vec3 } from '../../../../core/vmath';
import { Node } from '../../../../scene-graph/node';
// tslint:disable-next-line:max-line-length
import { AfterStepCallback, BeforeStepCallback, ICollisionCallback, ICollisionEvent, ICollisionEventType, PhysicsWorldBase, RigidBodyBase } from '../../../physics/api';
import { createRigidBody } from '../../../physics/instance';
import { ERigidBodyType, ETransformSource } from '../../../physics/physic-enum';
import { stringfyQuat, stringfyVec3 } from '../../../physics/util';

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
     *  @return group ∈ [0, 31] (int)
     */
    public getGroup (): number {
        if (this._assertPreload) {
            return this._body!.getGroup();
        }
        return 0;
    }

    /**
     * @param v ∈ [0, 31] (int)
     */
    public setGroup (v: number) {
        if (this._assertPreload) {
            return this._body!.setGroup(v);
        }
    }

    /**
     * @return (int)
     */
    public getMask (): number {
        if (this._assertPreload) {
            return this._body!.getMask();
        }
        return 0;
    }

    /**
     *  this will reset the mask
     * @param v ∈ [0, 31] (int)
     */
    public setMask (v: number) {
        if (this._assertPreload) {
            return this._body!.setMask(v);
        }
    }

    /**
     * this will add a mask
     * @param v ∈ [0, 31] (int)
     */
    public addMask (v: number) {
        if (this._assertPreload) {
            return this._body!.addMask(v);
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
                    sharedBody = new SharedRigidBody(this.node, cc.director._physicsSystem.world);
                }
                sharedBody.ref();
                this._sharedBody = sharedBody;
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

    private static _tempMat4 = new Mat4();

    private static _tempQuat = new Quat();

    private static _tempVec3 = new Vec3();

    private _body: RigidBodyBase;

    private _refCount = 0;

    private _actived = false;

    private _world!: PhysicsWorldBase;

    private _node!: Node;

    private _worldScale: Vec3 = new Vec3(1, 1, 1);

    private _beforeStepCallback!: BeforeStepCallback;

    private _afterStepCallback!: AfterStepCallback;

    private _transformInitialized: boolean = false;

    /** 是否只有Collider组件 */
    private _isShapeOnly: boolean = true;

    /** 上一次的缩放 */
    private _prevScale: Vec3 = new Vec3();

    constructor (node: Node, world: PhysicsWorldBase) {
        this._body = createRigidBody({
            name: node.name,
        });
        this._node = node;
        this._world = world;
        this._body.setUserData(this._node);
        this._beforeStepCallback = this._beforeStep.bind(this);
        this._afterStepCallback = this._afterStep.bind(this);
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
        this._body.setUserData(null);
        (this._body as any) = null;
        (this._beforeStepCallback as any) = null;
        (this._afterStepCallback as any) = null;
        (this._world as any) = null;
        (this._node as any) = null;
    }

    public syncPhysWithScene (node: Node) {

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
        // 是否为第一次激活
        if (!this._transformInitialized) {
            this._transformInitialized = true;
            this.syncPhysWithScene(this._node);
        }

        if (this._actived) {
            return;
        }

        this._actived = true;
        this._body.setWorld(this._world);
        this._world.addBeforeStep(this._beforeStepCallback);
        this._world.addAfterStep(this._afterStepCallback);
        this._body.wakeUp();
    }

    private _deactiveBody () {
        if (!this._actived) {
            return;
        }
        this._actived = false;
        this._world.removeBeforeStep(this._beforeStepCallback);
        this._world.removeAfterStep(this._afterStepCallback);
        this._body.sleep();
        this._body.setWorld(null);
    }

    private _beforeStep () {

        // 开始物理计算之前，用户脚本或引擎功能有可能改变节点的Transform，所以需要判断并进行更新
        if (this._node.hasChanged) {
            // scale 进行单独判断，因为目前的物理系统处理后不会改变scale的属性
            if (!vec3.equals(this._prevScale, this._node._scale)) {
                this._body.scaleAllShapes(this._node._scale);
                vec3.copy(this._prevScale, this._node._scale);
            }
            this.syncPhysWithScene(this._node);
        }
    }

    private _afterStep () {
        // 物理计算之后，除了只有形状组件的节点，其它有刚体组件的节点，并且刚体类型为DYNAMIC的，需要将计算结果同步到Scene中
        if (!this._isShapeOnly && this._body.getType() === ERigidBodyType.DYNAMIC) {
            this._syncSceneWithPhys();
        } else {
            // 对于只有形状组件的节点，需要将Scene中节点的Transform同步到Phyisc。
            // 这是因为物理计算后可能会改变一些节点，这会导致这些子节点的Transform也发生改变。
            if (this._node.hasChanged) {
                this.syncPhysWithScene(this._node);
            }
        }
    }
}
