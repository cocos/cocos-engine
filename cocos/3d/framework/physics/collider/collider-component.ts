/**
 * @category physics
 */

import { ccclass, property } from '../../../../core/data/class-decorator';
import { EventTarget } from '../../../../core/event';
import { CallbacksInvoker, ICallbackTable } from '../../../../core/event/callbacks-invoker';
import { applyMixins, IEventTarget } from '../../../../core/event/event-target-factory';
import { createMap } from '../../../../core/utils/js';
import Vec3 from '../../../../core/value-types/vec3';
import { vec3 } from '../../../../core/vmath';
import { ICollisionCallback, ICollisionEvent, ITriggerCallback, ITriggerEvent, RigidBodyBase, ShapeBase } from '../../../physics/api';
<<<<<<< HEAD
import { CollisionCallback, CollisionEventType, TriggerCallback, TriggerEventType } from '../../../physics/export-api';
=======
import { CollisionCallback, CollisionEventType, IContactEquation, TriggerCallback, TriggerEventType } from '../../../physics/export-api';
>>>>>>> Daily merge (#4693)
import { ERigidBodyType, ETransformSource } from '../../../physics/physic-enum';
import { PhysicsBasedComponent } from '../detail/physics-based-component';
import { RigidBodyComponent } from '../rigid-body-component';

/**
 * @zh
 * 碰撞器的基类
 */
@ccclass('cc.ColliderComponent')
export class ColliderComponent extends PhysicsBasedComponent implements IEventTarget {

    /**
     * @zh
     * 存储注册事件的回调列表，请不要直接修改。
     */
    public _callbackTable: ICallbackTable = createMap(true);

    /// PUBLIC PROPERTY GETTER\SETTER ///

    // Shielding physics material for alpha version
    // @property({
    //     type: PhysicsMaterial,
    // })
    // get material () {
    //     return this._material;
    // }

    // set material (value) {
    //     this._material = value;
    //     // if (!CC_EDITOR && !CC_PHYISCS_BUILT_IN) {
    //     //     this._body.material = (this._material || DefaultPhysicsMaterial)._getImpl();
    //     // }
    // }

    /**
     * @en
     * get or set the collider is trigger, this will be always trigger if using builtin.
     * @zh
     * 获取或设置碰撞器是否为触发器，若使用 builtin ，属性值无论真假 ，此碰撞器都为触发器。
     */
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
     * get or set the center of the collider, in local space.
     * @zh
     * 获取或设置碰撞器的中心点。
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
            const rigidBody = this.sharedBody.rigidBody as RigidBodyComponent | null;
            if (rigidBody != null) {
                vec3.sub(offset, this.node.worldPosition, rigidBody.node.worldPosition);
                vec3.add(offset, offset, this._center);
                this._shapeBase.setCenter(offset);
            } else {
                this._shapeBase.setCenter(this._center);
            }
        }
    }

<<<<<<< HEAD
    /**
     * @en
     * get the collider attached rigidbody, this may be null
     * @zh
     * 获取碰撞器所绑定的刚体组件，可能为 null
     */
=======
>>>>>>> Daily merge (#4693)
    public get attachedRigidbody (): RigidBodyComponent | null {
        return this.sharedBody.rigidBody as RigidBodyComponent | null;
    }

    protected _shapeBase!: ShapeBase;

    private _trrigerCallback!: ITriggerCallback;

    private _collisionCallBack!: ICollisionCallback;

    /// PRIVATE PROPERTY ///

    @property
    private _isTrigger: boolean = false;

    @property
    private _center: Vec3 = new cc.Vec3(0, 0, 0);

    constructor () {
        super();

        if (!CC_EDITOR) {
            this._trrigerCallback = this._onTrigger.bind(this);
            if (!CC_PHYSICS_BUILT_IN) {
                this._collisionCallBack = this._onCollision.bind(this);
            }
        }
    }

    /// PRIVATE METHOD ///

    /**
     * @zh
     * 注册触发事件或碰撞事件相关的回调。
     * @param type - 触发或碰撞事件的类型，可为 'onTriggerEnter'，'onTriggerStay'，'onTriggerExit' 或 'onCollisionEnter'，'onCollisionStay'，'onCollisionExit';
     * @param callback - 注册的回调函数
     * @param target - 可选参数，执行回调函数的目标
     * @param useCapture - 可选参数，当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     */
    public on (type: TriggerEventType | CollisionEventType, callback: TriggerCallback | CollisionCallback, target?: Object, useCapture?: any): any {
    }

    /**
     * @zh
     * 取消已经注册的触发事件或碰撞事件相关的回调。
     * @param type - 触发或碰撞事件的类型，可为 'onTriggerEnter'，'onTriggerStay'，'onTriggerExit' 或 'onCollisionEnter'，'onCollisionStay'，'onCollisionExit';
     * @param callback - 注册的回调函数
     * @param target - 可选参数，执行回调函数的目标
     * @param useCapture - 可选参数，当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     */
    public off (type: TriggerEventType | CollisionEventType, callback: TriggerCallback | CollisionCallback, target?: Object, useCapture?: any) {
    }

    /**
     * @zh
     * 注册触发事件或碰撞事件相关的回调，但只会执行一次。
     * @param type - 触发或碰撞事件的类型，可为 'onTriggerEnter'，'onTriggerStay'，'onTriggerExit' 或 'onCollisionEnter'，'onCollisionStay'，'onCollisionExit';
     * @param callback - 注册的回调函数
     * @param target - 可选参数，执行回调函数的目标
     * @param useCapture - 可选参数，当设置为 true，监听器将在捕获阶段触发，否则将在冒泡阶段触发。默认为 false。
     */
    public once (type: TriggerEventType | CollisionEventType, callback: TriggerCallback | CollisionCallback, target?: Object, useCapture?: any): any {
    }

    /**
     * IEventTarget implementations, they will be overwrote with the same implementation in EventTarget by applyMixins
     */
    public targetOff (keyOrTarget?: TriggerEventType | CollisionEventType | Object): void {
    }

    public dispatchEvent (event: Event): void {
    }

    public hasEventListener (key: TriggerEventType | CollisionEventType, callback?: TriggerCallback | CollisionCallback, target?: Object): boolean {
        return false;
    }

    public removeAll (keyOrTarget?: TriggerEventType | CollisionEventType | Object): void {
    }

    public emit (key: TriggerEventType | CollisionEventType, ...args: any[]): void {
    }

    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        if (!CC_EDITOR && !CC_PHYSICS_BUILT_IN) {
            // init collider
            this.isTrigger = this._isTrigger;
        }

        this.center = this._center;
    }

    protected onEnable () {

        if (!CC_EDITOR) {
<<<<<<< HEAD
            super.onEnable();
=======
>>>>>>> Daily merge (#4693)

            const rigidBody = this.sharedBody.rigidBody as RigidBodyComponent | null;
            if (rigidBody != null) {
                vec3.sub(offset, this.node.worldPosition, rigidBody.node.worldPosition);
                vec3.add(offset, offset, this._center);
                this.sharedBody.body.addShape(this._shapeBase!, offset);
            } else {
                this.sharedBody.body.addShape(this._shapeBase!, this._center);
            }

            this._shapeBase.addTriggerCallback(this._trrigerCallback);
            if (!CC_PHYSICS_BUILT_IN) {
                this.sharedBody.body.addCollisionCallback(this._collisionCallBack);
            }
<<<<<<< HEAD
            // sync after add shape
            this.sharedBody.syncPhysWithScene();
=======
>>>>>>> Daily merge (#4693)
        }
    }

    protected onDisable () {
        if (!CC_EDITOR) {
            this._shapeBase.removeTriggerCallback(this._trrigerCallback);
            if (!CC_PHYSICS_BUILT_IN) {
                this.sharedBody.body.removeCollisionCllback(this._collisionCallBack);
            }
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

    private _onTrigger (event: ITriggerEvent) {
        this.emit(event.type, event);
    }

    private _onCollision (event: ICollisionEvent) {
        this.emit(event.type, event);
    }
}

applyMixins(ColliderComponent, [CallbacksInvoker, EventTarget]);

const offset = new Vec3();
