import {
    ccclass,
    property,
} from '../../../../core/data/class-decorator';
import Vec3 from '../../../../core/value-types/vec3';
import { vec3 } from '../../../../core/vmath';
import { ICollisionCallback, ICollisionEventType, ShapeBase } from '../../../physics/api';
import { ERigidBodyType, ETransformSource } from '../../../physics/physic-enum';
import { PhysicsBasedComponent } from '../detail/physics-based-component';

@ccclass('cc.ColliderComponentBase')
export class ColliderComponentBase extends PhysicsBasedComponent {

    /// PUBLIC PROPERTY GETTER\SETTER ///

    @property({
        displayOrder: 0,
    })
    public get isTrigger () {
        return this._isTrigger;
    }

    public set isTrigger (value) {
        this._isTrigger = value;

        if (!CC_EDITOR) {
            if (!CC_PHYSICS_BUILT_IN) {
                const type = this._isTrigger ? ERigidBodyType.DYNAMIC : ERigidBodyType.STATIC;
                this.sharedBody.body.setType(type);
                this._shapeBase.setCollisionResponse!(!this._isTrigger);
            }
        }
    }

    /**
     * The center of the collider, in local space.
     */
    @property({
        type: Vec3,
        displayOrder: 1,
        tooltip: 'The center of the collider, in local space',
    })
    public get center () {
        return this._center;
    }

    public set center (value: Vec3) {
        vec3.copy(this._center, value);

        if (!CC_EDITOR) {
            this._shapeBase.setCenter(this._center);
        }
    }

    protected _shapeBase!: ShapeBase;

    /// PRIVATE PROPERTY ///

    @property
    private _isTrigger: boolean = false;

    @property
    private _center: Vec3 = new cc.Vec3(0, 0, 0);

    constructor () {
        super();
    }

    /// PUBLIC METHOD ///

    /**
     * @zh
     * 注册碰撞事件相关的回调
     * @param type - 碰撞事件的类型，可为 'onCollisionEnter' 、 'onCollisionStay' 、 'onCollisionExit';
     * @param callback - 注册的回调函数
     * @param target - 可选参数，执行回调函数的目标
     * @param useCapture - 可选参数，当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     */
    public on (type: ICollisionEventType, callback: ICollisionCallback, target?: Object, useCapture?: any) {
        this.node.on(type, callback, target, useCapture);
    }

    /**
     * @zh
     * 取消已经注册的碰撞事件相关的回调
     * @param type - 碰撞事件的类型，可为 'onCollisionEnter' 、 'onCollisionStay' 、 'onCollisionExit';
     * @param callback - 注册的回调函数
     * @param target - 可选参数，执行回调函数的目标
     * @param useCapture - 可选参数，当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     */
    public off (type: ICollisionEventType, callback: ICollisionCallback, target?: Object, useCapture?: any) {
        this.node.off(type, callback, target, useCapture);
    }

    /**
     * @zh
     * 注册碰撞事件相关的回调，但只会执行一次
     * @param type - 碰撞事件的类型，可为 'onCollisionEnter' 、 'onCollisionStay' 、 'onCollisionExit';
     * @param callback - 注册的回调函数
     * @param target - 可选参数，执行回调函数的目标
     * @param useCapture - 可选参数，当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     */
    public once (type: ICollisionEventType, callback: ICollisionCallback, target?: Object, useCapture?: any) {
        this.node.once(type, callback, target, useCapture);
    }

    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            // init collider
            this.sharedBody.transfromSource = ETransformSource.SCENE;
            this.sharedBody.body.setUseGravity(false);
            this.isTrigger = this._isTrigger;
        }

        this.center = this._center;
    }

    protected onEnable () {
        super.onEnable();

        if (!CC_EDITOR) {
            this.sharedBody.body.addShape(this._shapeBase!);
        }
    }

    protected onDisable () {
        if (!CC_EDITOR) {
            this.sharedBody.body.removeShape(this._shapeBase!);

            if (this.sharedBody.isShapeOnly) {
                super.onDisable();
            }
        }
    }

    protected onDestroy () {
        if (!CC_EDITOR) {
            this.sharedBody.body.removeShape(this._shapeBase!);
        }
        super.onDestroy();
    }
}
