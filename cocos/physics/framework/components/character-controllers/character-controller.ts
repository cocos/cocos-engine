/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable func-names */
/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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
    ccclass, help, disallowMultiple, executeInEditMode, menu, executionOrder,
    tooltip, displayOrder, visible, type, serializable } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { Vec3, error, warn, CCFloat, Eventify } from '../../../../core';
import { Component } from '../../../../scene-graph';
import { IBaseCharacterController } from '../../../spec/i-character-controller';
import { ECharacterControllerType } from '../../physics-enum';
import { CharacterCollisionEventType } from '../../physics-interface';
import { selector, createCharacterController } from '../../physics-selector';
import { PhysicsSystem } from '../../physics-system';

const v3_0 = new Vec3(0, 0, 0);

/**
 * @en
 * Base class for Character Controller component.
 * @zh
 * 角色控制器组件基类。
 */
@ccclass('cc.CharacterController')
export class CharacterController extends Eventify(Component) {
    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * Gets or sets the group of the rigid body.
     * @zh
     * 获取或设置分组。
     */
    @type(PhysicsSystem.PhysicsGroup)
    @displayOrder(-2)
    @tooltip('i18n:physics3d.charactercontroller.group')
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

    @type(CCFloat)
    public get minMoveDistance () {
        return this._minMoveDistance;
    }

    public set minMoveDistance (value) {
        if (this._minMoveDistance === value) return;
        this._minMoveDistance = Math.abs(value);
    }

    @type(CCFloat)
    public get stepOffset () {
        return this._stepOffset;
    }

    public set stepOffset (value) {
        if (this._stepOffset === value) return;
        this._stepOffset = Math.abs(value);
        if (this._cct) {
            this._cct.setStepOffset(value);
        }
    }

    @type(CCFloat)
    public get slopeLimit () {
        return this._slopeLimit;
    }

    public set slopeLimit (value) {
        if (this._slopeLimit === value) return;
        this._slopeLimit = Math.abs(value);
        if (this._cct) {
            this._cct.setSlopeLimit(value);
        }
    }

    @type(CCFloat)
    public get contactOffset () {
        return this._contactOffset;
    }

    public set contactOffset (value) {
        if (this._contactOffset === value) return;
        this._contactOffset = Math.abs(value);
        if (this._cct) {
            this._cct.setContactOffset(value);
        }
    }

    /**
     * @en
     * Gets the wrapper object, through which the lowLevel instance can be accessed.
     * @zh
     * 获取封装对象，通过此对象可以访问到底层实例。
     */
    public get characterController () {
        return this._cct;
    }

    /**
     * @en
     * Gets the type of this character controller.
     * @zh
     * 获取此的类型。
     */
    readonly TYPE: ECharacterControllerType;

    constructor (type: ECharacterControllerType) {
        super();
        this.TYPE = type;
    }

    protected _cct: IBaseCharacterController | null = null; //lowLevel instance

    /// PRIVATE PROPERTY ///
    @serializable
    private _group: number = PhysicsSystem.PhysicsGroup.DEFAULT;
    @serializable
    private _minMoveDistance = 0.001; //[ 0, infinity ]
    @serializable
    public _stepOffset = 1.0;
    @serializable
    public _slopeLimit = 45.0; //degree[ 0, 180]
    //@serializable
    public _density = 10.0;
    //@serializable
    public _scaleCoeff = 0.8;
    //@serializable
    public _volumeGrowth = 1.5;
    @serializable
    public _contactOffset = 0.01;

    private _initialized = false;

    protected _needTriggerEvent = false;
    protected _needCollisionEvent = false;

    protected get _isInitialized (): boolean {
        if (this._cct === null || !this._initialized) {
            //error('[Physics]: This component has not been call onLoad yet, please make sure the node has been added to the scene.');
            return false;
        } else {
            return true;
        }
    }

    /// COMPONENT LIFECYCLE ///

    protected onLoad () {
        if (!selector.runInEditor) return;
        this._cct = createCharacterController(this.TYPE);
        this._initialized = this._cct.initialize(this);
        //this._cct.onLoad();
    }

    protected onEnable () {
        if (this._cct) {
            this._cct.onEnable!();
        }
    }

    protected onDisable () {
        if (this._cct) {
            this._cct.onDisable!();
        }
    }

    protected onDestroy () {
        if (this._cct) {
            this._needTriggerEvent = false;
            this._needCollisionEvent = false;
            this._cct.updateEventListener();
            this._cct.onDestroy!();
        }
    }

    /// PUBLIC METHOD ///

    /**
     * @en
     * Gets the position.
     * @zh
     * 获取位置。
     * @param out @zh 位置向量 @en The position vector
     */
    public getPosition (out: Vec3) {
        if (this._isInitialized) this._cct!.getPosition(out);
    }

    /**
     * @en
     * Sets the position.
     * @zh
     * 设置位置。
     * @param value @zh 位置向量 @en The position vector
     */
    public setPosition (value: Vec3): void {
        if (this._isInitialized) this._cct!.setPosition(value);
    }

    /**
     * @en
     * .
     * @zh
     * 。
     * @param value @zh  @en
     */
    onGround (): boolean {
        return this._cct!.onGround();
    }

    /**
     * @en
     * Move.
     * @zh
     * 。
     * @param value @zh  @en
     */
    public move (movement: Vec3): void {
        if (!this._isInitialized) { return; }

        const elapsedTime = PhysicsSystem.instance.fixedTimeStep;
        this._cct!.move(movement, this._minMoveDistance, elapsedTime);
    }

    /// EVENT INTERFACE ///
    /**
     * @en
     * Registers callbacks associated with triggered or collision events.
     * @zh
     * 注册触发或碰撞事件相关的回调。
     * @param type - The event type, onTriggerEnter|onTriggerStay|onTriggerExit|onCollisionEnter|onCollisionStay|onCollisionExit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    public on<TFunction extends (...any) => void>(type: CharacterCollisionEventType, callback: TFunction, target?, once?: boolean): any {
        const ret = super.on(type, callback, target, once);
        this._updateNeedEvent(type);
        return ret;
    }

    /**
     * @en
     * Unregisters callbacks associated with trigger or collision events that have been registered.
     * @zh
     * 取消已经注册的触发或碰撞事件相关的回调。
     * @param type - The event type, onTriggerEnter|onTriggerStay|onTriggerExit|onCollisionEnter|onCollisionStay|onCollisionExit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    public off (type: CharacterCollisionEventType, callback?: (...any) => void, target?) {
        super.off(type, callback, target);
        this._updateNeedEvent();
    }

    /**
     * @en
     * Registers a callback associated with a trigger or collision event, which is automatically unregistered once executed.
     * @zh
     * 注册触发或碰撞事件相关的回调，执行一次后会自动取消注册。
     * @param type - The event type, onTriggerEnter|onTriggerStay|onTriggerExit|onCollisionEnter|onCollisionStay|onCollisionExit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */
    public once<TFunction extends (...any) => void>(type: CharacterCollisionEventType, callback: TFunction, target?): any {
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
    public addGroup (v: number) {
        if (this._isInitialized) this._cct!.addGroup(v);
    }

    /**
     * @en
     * Subtract the grouping value to fill in the group to be removed.
     * @zh
     * 减去分组值，可填要移除的 group。
     * @param v @zh 分组值，为 32 位整数，范围为 [2^0, 2^31] @en Group value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    public removeGroup (v: number) {
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
    public setMask (v: number) {
        if (this._isInitialized) this._cct!.setMask(v);
    }

    /**
     * @en
     * Add mask values to fill in groups that need to be checked.
     * @zh
     * 添加掩码值，可填入需要检查的 group。
     * @param v @zh 掩码值，为 32 位整数，范围为 [2^0, 2^31] @en Mask value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    public addMask (v: number) {
        if (this._isInitialized) this._cct!.addMask(v);
    }

    /**
     * @en
     * Subtract the mask value to fill in the group that does not need to be checked.
     * @zh
     * 减去掩码值，可填入不需要检查的 group。
     * @param v @zh 掩码值，为 32 位整数，范围为 [2^0, 2^31] @en Mask value which is a 32-bits integer, the range is [2^0, 2^31]
     */
    public removeMask (v: number) {
        if (this._isInitialized) this._cct!.removeMask(v);
    }

    public get needTriggerEvent () {
        return this._needTriggerEvent;
    }

    public get needCollisionEvent () {
        return this._needCollisionEvent;
    }

    private _updateNeedEvent (type?: string) {
        if (this.isValid) {
            this._needTriggerEvent = false;
            this._needCollisionEvent = false;
            if (this._cct) this._cct.updateEventListener();
        }
    }
}
