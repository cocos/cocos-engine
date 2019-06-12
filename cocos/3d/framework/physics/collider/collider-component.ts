import { ccclass, property } from '../../../../core/data/class-decorator';
import { EventTarget } from '../../../../core/event';
import { CallbacksInvoker, ICallbackTable } from '../../../../core/event/callbacks-invoker';
import { applyMixins, IEventTarget } from '../../../../core/event/event-target-factory';
import { createMap } from '../../../../core/utils/js';
import Vec3 from '../../../../core/value-types/vec3';
import { vec3 } from '../../../../core/vmath';
import { ICollisionCallback, ICollisionEvent, RigidBodyBase, ShapeBase } from '../../../physics/api';
import { CollisionCallback, CollisionEventType } from '../../../physics/export-api';
import { ERigidBodyType, ETransformSource } from '../../../physics/physic-enum';
import { PhysicsBasedComponent } from '../detail/physics-based-component';

@ccclass('cc.ColliderComponent')
export class ColliderComponent extends PhysicsBasedComponent implements IEventTarget {

    public _callbackTable: ICallbackTable = createMap(true);

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
     * @en
     * get the center of the collider, in local space.
     * @zh
     * 获取碰撞器的中心点
     *
     */
    @property({
        type: Vec3,
        displayOrder: 1,
        tooltip: 'The center of the collider, in local space',
    })
    public get center () {
        return this._center;
    }

    /**
     * @zh
     * 设置碰撞器的中心点
     */
    public set center (value: Vec3) {
        vec3.copy(this._center, value);

        if (!CC_EDITOR) {
            this._shapeBase.setCenter(this._center);
        }
    }

    protected _shapeBase!: ShapeBase;

    private _collisionCallBack!: ICollisionCallback;

    /// PRIVATE PROPERTY ///

    @property
    private _isTrigger: boolean = false;

    @property
    private _center: Vec3 = new cc.Vec3(0, 0, 0);

    constructor () {
        super();

        if (!CC_EDITOR) {
            this._collisionCallBack = this._onCollision.bind(this);
        }
    }

    /// PRIVATE METHOD ///

    /**
     * @zh
     * 注册碰撞事件相关的回调
     * @param type - 碰撞事件的类型，可为 'onCollisionEnter' 、 'onCollisionStay' 、 'onCollisionExit';
     * @param callback - 注册的回调函数
     * @param target - 可选参数，执行回调函数的目标
     * @param useCapture - 可选参数，当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     */
    public on (type: CollisionEventType, callback: CollisionCallback, target?: Object, useCapture?: any): any {
    }

    /**
     * @zh
     * 取消已经注册的碰撞事件相关的回调
     * @param type - 碰撞事件的类型，可为 'onCollisionEnter' 、 'onCollisionStay' 、 'onCollisionExit';
     * @param callback - 注册的回调函数
     * @param target - 可选参数，执行回调函数的目标
     * @param useCapture - 可选参数，当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     */
    public off (type: CollisionEventType, callback: CollisionCallback, target?: Object, useCapture?: any) {
    }

    /**
     * @zh
     * 注册碰撞事件相关的回调，但只会执行一次
     * @param type - 碰撞事件的类型，可为 'onCollisionEnter' 、 'onCollisionStay' 、 'onCollisionExit';
     * @param callback - 注册的回调函数
     * @param target - 可选参数，执行回调函数的目标
     * @param useCapture - 可选参数，当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     */
    public once (type: CollisionEventType, callback: CollisionCallback, target?: Object, useCapture?: any): any {
    }

    /**
     * IEventTarget implementations, they will be overwrote with the same implementation in EventTarget by applyMixins
     */
    public targetOff (keyOrTarget?: CollisionEventType | Object): void {
    }

    public dispatchEvent (event: Event): void {
    }

    public hasEventListener (key: CollisionEventType, callback?: CollisionCallback, target?: Object): boolean {
        return false;
    }

    public removeAll (keyOrTarget?: CollisionEventType | Object): void {
    }

    public emit (key: CollisionEventType, ...args: any[]): void {
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
            this.sharedBody.body.addShape(this._shapeBase!, this._center);
            this.sharedBody.body.addCollisionCallback(this._collisionCallBack);
        }
    }

    protected onDisable () {
        if (!CC_EDITOR) {
            this.sharedBody.body.removeCollisionCllback(this._collisionCallBack);
            this.sharedBody.body.removeShape(this._shapeBase!);

            // TODO : Change to determine the reference count
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

    private _onCollision (type: CollisionEventType, event: ICollisionEvent) {
        this.emit(type, type, {
            source: (event.source as RigidBodyBase).getUserData() as Node,
            target: (event.target as RigidBodyBase).getUserData() as Node,
        });
    }
}

applyMixins(ColliderComponent, [CallbacksInvoker, EventTarget]);
