/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import {
    ccclass, disallowMultiple,
    tooltip, displayOrder, type, serializable } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { Vec3, warn, CCFloat, Eventify } from '../../../../core';
import { Component } from '../../../../scene-graph';
import { IBaseCharacterController } from '../../../spec/i-character-controller';
import { ECharacterControllerType } from '../../physics-enum';
import { CharacterCollisionEventType, CharacterTriggerEventType, TriggerEventType } from '../../physics-interface';
import { selector, createCharacterController } from '../../physics-selector';
import { PhysicsSystem } from '../../physics-system';

const v3_0 = new Vec3(0, 0, 0);
const scaledCenter = new Vec3(0, 0, 0);

type Callback = (...args: any[]) => any;

/**
 * @en
 * Base class for Character Controller component.
 * @zh
 * 角色控制器组件基类。
 */
@ccclass('cc.CharacterController')
@disallowMultiple
export class CharacterController extends Eventify(Component) {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the group of the character controller.
     * @zh
     * 获取或设置分组。
     */
    @type(PhysicsSystem.PhysicsGroup)
    @displayOrder(-2)
    @tooltip('i18n:physics3d.character_controller.group')
    public get group (): number {
        return this._group;
    }

    public set group (v: number) {
        if (DEBUG && !Number.isInteger(Math.log2(v >>> 0))) {
            warn('[Physics]: The group should only have one bit.');
        }
        this._group = v;
        if (this._cct) {
            // The judgment is added here because the data exists in two places
            if (this._cct.getGroup() !== v) this._cct.setGroup(v);
        }
    }

    /**
     * @en
     * Gets or sets the minimum movement distance of the character controller.
     * @zh
     * 获取或设置角色控制器的最小移动距离。
     */
    @tooltip('i18n:physics3d.character_controller.minMoveDistance')
    @type(CCFloat)
    public get minMoveDistance (): number {
        return this._minMoveDistance;
    }

    public set minMoveDistance (value) {
        if (this._minMoveDistance === value) return;
        this._minMoveDistance = Math.abs(value);
    }

    /**
     * @en 、
     * Gets or sets the maximum height the character controller can automatically climb.
     * @zh
     * 获取或设置角色控制器的最大自动爬台阶高度。
     */
    @tooltip('i18n:physics3d.character_controller.stepOffset')
    @type(CCFloat)
    public get stepOffset (): number {
        return this._stepOffset;
    }

    public set stepOffset (value) {
        if (this._stepOffset === value) return;
        this._stepOffset = Math.abs(value);
        if (this._cct) {
            this._cct.setStepOffset(value);
        }
    }

    /**
     * @en
     * Gets or sets the slope limit of the character controller in degree.
     * @zh
     * 获取或设置角色控制器的最大爬坡角度。
    */
    @tooltip('i18n:physics3d.character_controller.slopeLimit')
    @type(CCFloat)
    public get slopeLimit (): number {
        return this._slopeLimit;
    }

    public set slopeLimit (value) {
        if (this._slopeLimit === value) return;
        this._slopeLimit = Math.abs(value);
        if (this._cct) {
            this._cct.setSlopeLimit(value);
        }
    }

    /**
     * @en
     * Gets or sets the skin width of the character controller.
     * @zh
     * 获取或设置角色控制器的皮肤宽度。
     */
    @tooltip('i18n:physics3d.character_controller.skinWidth')
    @type(CCFloat)
    public get skinWidth (): number {
        return this._skinWidth;
    }

    public set skinWidth (value) {
        if (this._skinWidth === value) return;
        this._skinWidth = Math.abs(value);
        if (this._cct) {
            this._cct.setContactOffset(Math.max(0.0001, value));
        }
    }

    // /**
    //  * @en
    //  * Gets or sets if the character controller can collide with other objects.
    //  * @zh
    //  * 获取或设置角色控制器是否和发生碰撞。
    //  */
    // @tooltip('i18n:physics3d.character_controller.detectCollisions')
    // @type(CCBoolean)
    // public get detectCollisions () {
    //     return this._detectCollisions;
    // }

    // public set detectCollisions (value) {
    //     if (this._detectCollisions === value) return;
    //     this._detectCollisions = value;
    //     if (this._cct) {
    //         this._cct.setDetectCollisions(value);
    //     }
    // }

    // /**
    //  * @en
    //  * Gets or sets if the character controller enables overlap recovery when penetrating with other colliders.
    //  * @zh
    //  * 获取或设置角色控制器和其他碰撞体穿透时是否恢复。
    //  */
    // @tooltip('i18n:physics3d.character_controller.enableOverlapRecovery')
    // @type(CCBoolean)
    // public get enableOverlapRecovery () {
    //     return this._enableOverlapRecovery;
    // }

    // public set enableOverlapRecovery (value) {
    //     if (this._enableOverlapRecovery === value) return;
    //     this._enableOverlapRecovery = value;
    //     if (this._cct) {
    //         this._cct.setOverlapRecovery(value);
    //     }
    // }

    /**
     * @en
     * Gets or sets the center of the character controller in local space.
     * @zh
     * 获取或设置角色控制器的中心点在局部坐标系中的位置。
     */
    @tooltip('i18n:physics3d.character_controller.center')
    @type(Vec3)
    public get center (): Readonly<Vec3> {
        return this._center;
    }

    public set center (value: Readonly<Vec3>) {
        if (Vec3.equals(this._center, value)) return;
        Vec3.copy(this._center, value);
        // if (this._cct) { //update cct position
        //     Vec3.copy(VEC3_0, this.node.worldPosition);
        //     VEC3_0.add(this.scaledCenter);//cct world position
        //     this._cct.setPosition(VEC3_0);
        // }
    }

    /**
     * @en
     * Gets the type of this character controller.
     * @zh
     * 获取此角色控制器的类型。
     */
    readonly type: ECharacterControllerType;

    constructor (type: ECharacterControllerType) {
        super();
        this.type = type;
    }

    protected _cct: IBaseCharacterController | null = null; //lowLevel instance

    /// PRIVATE PROPERTY ///
    @serializable
    private _group: number = PhysicsSystem.PhysicsGroup.DEFAULT;
    @serializable
    private _minMoveDistance = 0.001; //[ 0, infinity ]
    @serializable
    private _stepOffset = 0.5;
    @serializable
    private _slopeLimit = 45.0; //degree[ 0, 180]
    @serializable
    private _skinWidth = 0.01; //[ 0.0001, infinity ]
    // @serializable
    // private _detectCollisions = true;
    // @serializable
    // private _enableOverlapRecovery = true;
    @serializable
    private _center: Vec3 = new Vec3();

    private _initialized = false;
    private _prevPos: Vec3 = new Vec3();
    private _currentPos: Vec3 = new Vec3();
    private _velocity: Vec3 = new Vec3();
    private _centerWorldPosition: Vec3 = new Vec3();

    protected _needCollisionEvent = false;
    protected _needTriggerEvent = false;

    protected get _isInitialized (): boolean {
        if (this._cct === null || !this._initialized) {
            //error('[Physics]: This component has not been call onLoad yet, please make sure the node has been added to the scene.');
            return false;
        } else {
            return true;
        }
    }

    /// COMPONENT LIFECYCLE ///

    protected onLoad (): void {
        if (!selector.runInEditor) return;
        this._cct = createCharacterController(this.type);
        this._initialized = this._cct.initialize(this);
        this._cct.onLoad!();
    }

    protected onEnable (): void {
        if (this._cct) {
            this._cct.onEnable!();
        }
    }

    protected onDisable (): void {
        if (this._cct) {
            this._cct.onDisable!();
        }
    }

    protected onDestroy (): void {
        if (this._cct) {
            this._needCollisionEvent = false;
            this._needTriggerEvent = false;
            this._cct.updateEventListener();
            this._cct.onDestroy!();
            this._cct = null;
        }
    }

    /// PUBLIC METHOD ///

    /**
     * @en
     * Gets world position of center.
     * @zh
     * 获取中心的世界坐标。
     */
    public get centerWorldPosition (): Readonly<Vec3> {
        if (this._isInitialized) this._cct!.getPosition(this._centerWorldPosition);
        return this._centerWorldPosition;
    }

    /**
     * @en
     * Sets world position of center.
     * Note: Calling this function will immediately synchronize the position of
     * the character controller in the physics world to the node.
     * @zh
     * 设置中心的世界坐标。
     * 注意：调用该函数会立刻将角色控制器在物理世界中的位置同步到节点上。
     */
    public set centerWorldPosition (value: Readonly<Vec3>) {
        if (this._isInitialized) this._cct!.setPosition(value);
    }

    /**
     * @en
     * Gets the velocity.
     * Note: velocity is only updated after move() is called.
     * @zh
     * 获取速度。
     * 注意：velocity 只会在 move() 调用后更新。
     */
    public get velocity (): Readonly<Vec3> {
        return this._velocity;
    }

    /**
     * @en
     * Gets whether the character is on the ground.
     * Note: isGrounded is only updated after move() is called.
     * @zh
     * 获取是否在地面上。
     * 注意：isGrounded 只会在 move() 调用后更新。
     */
    public get isGrounded (): boolean {
        return this._cct!.onGround();
    }

    /**
     * @en
     * Move the character.
     * @zh
     * 移动角色控制器。
     * @param movement @zh 移动向量 @en The movement vector
     */
    public move (movement: Vec3): void {
        if (!this._isInitialized) { return; }

        this._prevPos.set(this.centerWorldPosition);

        const elapsedTime = PhysicsSystem.instance.fixedTimeStep;
        this._cct!.move(movement, this._minMoveDistance, elapsedTime);

        this._currentPos.set(this.centerWorldPosition);
        this._velocity = this._currentPos.subtract(this._prevPos).multiplyScalar(1.0 / elapsedTime);

        this._cct!.syncPhysicsToScene();
    }

    /// EVENT INTERFACE ///
    /**
     * @en
     * Registers callbacks associated with triggered or collision events.
     * @zh
     * 注册触发或碰撞事件相关的回调。
     * @param type - The event type, onControllerColliderHit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    public on<TFunction extends Callback> (
        type: CharacterTriggerEventType | CharacterCollisionEventType,
        callback: TFunction,
        target?,
        once?: boolean,
    ): any {
        const ret = super.on(type, callback, target, once);
        this._updateNeedEvent(type);
        return ret;
    }

    /**
     * @en
     * Unregisters callbacks associated with trigger or collision events that have been registered.
     * @zh
     * 取消已经注册的触发或碰撞事件相关的回调。
     * @param type - The event type, onControllerColliderHit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    public off (type: CharacterTriggerEventType | CharacterCollisionEventType, callback?: Callback, target?): void {
        super.off(type, callback, target);
        this._updateNeedEvent();
    }

    /**
     * @en
     * Registers a callback associated with a trigger or collision event, which is automatically unregistered once executed.
     * @zh
     * 注册触发或碰撞事件相关的回调，执行一次后会自动取消注册。
     * @param type - The event type, onControllerColliderHit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    public once<TFunction extends Callback> (
        type: CharacterTriggerEventType | CharacterCollisionEventType,
        callback: TFunction,
        target?,
    ): any {
        // TODO: callback invoker now is a entity, after `once` will not calling the upper `off`.
        const ret = super.once(type, callback, target);
        this._updateNeedEvent(type);
        return ret;
    }

    /// GROUP MASK ///

    /**
     * @en
     * Gets the group value.
     * @zh
     * 获取分组值。
     * @returns @zh 分组值，为 32 位整数，范围为 [2^0, 2^31] @en Group value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    public getGroup (): number {
        if (this._isInitialized) return this._cct!.getGroup();
        return 0;
    }

    /**
     * @en
     * Sets the group value.
     * @zh
     * 设置分组值。
     * @param v @zh 分组值，为 32 位整数，范围为 [2^0, 2^31] @en Group value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    public setGroup (v: number): void {
        if (this._isInitialized) this._cct!.setGroup(v);
    }

    /**
     * @en
     * Add a grouping value to fill in the group you want to join.
     * @zh
     * 添加分组值，可填要加入的 group。
     * @param v @zh 分组值，为 32 位整数，范围为 [2^0, 2^31] @en Group value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    public addGroup (v: number): void {
        if (this._isInitialized) this._cct!.addGroup(v);
    }

    /**
     * @en
     * Subtract the grouping value to fill in the group to be removed.
     * @zh
     * 减去分组值，可填要移除的 group。
     * @param v @zh 分组值，为 32 位整数，范围为 [2^0, 2^31] @en Group value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    public removeGroup (v: number): void {
        if (this._isInitialized) this._cct!.removeGroup(v);
    }

    /**
     * @en
     * Gets the mask value.
     * @zh
     * 获取掩码值。
     * @returns {number} @zh 掩码值，为 32 位整数，范围为 [2^0, 2^31] @en Mask value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    public getMask (): number {
        if (this._isInitialized) return this._cct!.getMask();
        return 0;
    }

    /**
     * @en
     * Sets the mask value.
     * @zh
     * 设置掩码值。
     * @param v @zh 掩码值，为 32 位整数，范围为 [2^0, 2^31] @en Mask value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    public setMask (v: number): void {
        if (this._isInitialized) this._cct!.setMask(v);
    }

    /**
     * @en
     * Add mask values to fill in groups that need to be checked.
     * @zh
     * 添加掩码值，可填入需要检查的 group。
     * @param v @zh 掩码值，为 32 位整数，范围为 [2^0, 2^31] @en Mask value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    public addMask (v: number): void {
        if (this._isInitialized) this._cct!.addMask(v);
    }

    /**
     * @en
     * Subtract the mask value to fill in the group that does not need to be checked.
     * @zh
     * 减去掩码值，可填入不需要检查的 group。
     * @param v @zh 掩码值，为 32 位整数，范围为 [2^0, 2^31] @en Mask value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    public removeMask (v: number): void {
        if (this._isInitialized) this._cct!.removeMask(v);
    }

    public get needCollisionEvent (): boolean {
        return this._needCollisionEvent;
    }

    public get needTriggerEvent (): boolean {
        return this._needTriggerEvent;
    }

    private _updateNeedEvent (type?: string): void {
        if (this.isValid) {
            if (type !== undefined) {
                if (type === 'onControllerColliderHit') {
                    this._needCollisionEvent = true;
                }
                if (type === 'onControllerTriggerEnter' || type === 'onControllerTriggerStay' || type === 'onControllerTriggerExit') {
                    this._needTriggerEvent = true;
                }
            } else {
                if (!this.hasEventListener('onControllerColliderHit')) {
                    this._needCollisionEvent = false;
                }
                if (!(this.hasEventListener('onControllerTriggerEnter')
                    || this.hasEventListener('onControllerTriggerStay')
                    || this.hasEventListener('onControllerTriggerExit'))) {
                    this._needTriggerEvent = false;
                }
            }
            if (this._cct) this._cct.updateEventListener();
        }
    }
}
