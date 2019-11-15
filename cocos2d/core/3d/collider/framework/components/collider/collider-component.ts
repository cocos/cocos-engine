/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { ccclass, property } from '../../../../../platform/CCClassDecorator';
import CallbacksInvoker from '../../../../../platform/callbacks-invoker';
import js from '../../../../../platform/js';
import { Vec3 } from '../../../../../value-types';
import { TriggerCallback, TriggerEventType } from '../../collider-interface';
import CCComponent from '../../../../../components/CCComponent';
import { IBaseShape } from '../../../spec/i-collider-spahe';

/**
 * !#en The base class of the collider
 * !#zh 碰撞器的基类
 */
@ccclass('cc.ColliderComponent')
export class ColliderComponent extends CCComponent {

    /**
     * !#en Store the callback list of registration events. Do not modify it directly.
     * !#zh 存储注册事件的回调列表，请不要直接修改。
     */
    public _callbackTable: any = js.createMap(true);

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * !#en Gets or sets the center point of the collider.
     * !#zh 获取或设置碰撞器的中心点。
     */
    @property({
        type: Vec3,
        displayOrder: 1,
        tooltip: 'i18n:COMPONENT.collider3D.center',
    })
    public get center () {
        return this._center;
    }

    public set center (value: Vec3) {
        Vec3.copy(this._center, value);
        if (!CC_EDITOR) {
            this._shape.center = this._center;
        }
    }

    public get shape () {
        return this._shape;
    }

    /// PRIVATE PROPERTY ///

    protected _shape!: IBaseShape;

    @property
    protected readonly _center: Vec3 = new Vec3();

    protected get _assertOnload (): boolean {
        const r = this._isOnLoadCalled == 0;
        if (r) { cc.error('Physics Error: Please make sure that the node has been added to the scene'); }
        return !r;
    }

    protected constructor () { super() }

    /// EVENT INTERFACE ///

    /**
     * !#en Register callbacks related to triggering events.
     * !#zh 注册触发事件或碰撞事件相关的回调。
     * @param type The type of trigger event can be 'onTriggerEnter', 'onTriggerStay', 'onTriggerExit';
     * @param callback Registered callback function
     * @param target Optional argument that executes the target of the callback function
     * @param useCapture Optional. When set to true, the listener will fire during the capture phase or during the bubbling phase. The default is false.
     */
    public on (type: TriggerEventType, callback: TriggerCallback, target?: Object, useCapture?: any): any {
    }

    /**
     * !#en Cancels the callback associated with a registered trigger event.
     * !#zh 取消已经注册的触发事件或碰撞事件相关的回调。
     * @param type The type of trigger event can be 'onTriggerEnter', 'onTriggerStay', 'onTriggerExit';
     * @param callback Registered callback function.
     * @param target Optional argument that executes the target of the callback function.
     * @param useCapture Optional. When set to true, the listener will fire during the capture phase or during the bubbling phase. The default is false.
     */
    public off (type: TriggerEventType, callback: TriggerCallback, target?: Object, useCapture?: any) {
    }

    /**
     * !#en Registers callbacks related to triggering events, but only executes once.
     * !#zh 注册触发事件或碰撞事件相关的回调，但只会执行一次。
     ** @param type The type of trigger event can be 'onTriggerEnter', 'onTriggerStay', 'onTriggerExit';
     * @param callback Registered callback function.
     * @param target Optional argument that executes the target of the callback function.
     * @param useCapture Optional. When set to true, the listener will fire during the capture phase or during the bubbling phase. The default is false.
     */
    public once (type: TriggerEventType, callback: TriggerCallback, target?: Object, useCapture?: any): any {
    }

    /**
     * IEventTarget implementations, they will be overwrote with the same implementation in EventTarget by applyMixins
     */
    public targetOff (keyOrTarget?: TriggerEventType | Object): void {
    }

    public dispatchEvent (event: Event): void {
    }

    public hasEventListener (key: TriggerEventType, callback?: TriggerCallback, target?: Object): boolean {
        return false;
    }

    public removeAll (keyOrTarget?: TriggerEventType | Object): void {
    }

    public emit (key: TriggerEventType, ...args: any[]): void {
    }

    /// GROUP MASK ///

    /**
     * !#en Set group values.
     * !#zh 设置分组值。
     * @param v Integers, ranging from 2 to the 0 to 2 to the 31
     */
    public setGroup (v: number): void {
        this._shape!.setGroup(v);
    }

    /**
     * !#en Gets the group value.
     * !#zh 获取分组值。
     * @returns Integers, ranging from 2 to the 0 to 2 to the 31
     */
    public getGroup (): number {
        return this._shape.getGroup();
    }

    /**
     * !#en Add a group value to fill in the group you want to join.
     * !#zh 添加分组值，可填要加入的 group。
     * @param v Integers, ranging from 2 to the 0 to 2 to the 31
     */
    public addGroup (v: number) {
        this._shape.addGroup(v);
    }

    /**
     * !#en Subtract the group value to fill in the group to be removed.
     * !#zh 减去分组值，可填要移除的 group。
     * @param v Integers, ranging from 2 to the 0 to 2 to the 31
     */
    public removeGroup (v: number) {
        this._shape.removeGroup(v);
    }

    /**
     * !#en Gets the mask value.
     * !#zh 获取掩码值。
     * @returns Integers, ranging from 2 to the 0 to 2 to the 31
     */
    public getMask (): number {
        return this._shape.getMask();
    }

    /**
     * !#en Sets the mask value.
     * !#zh 设置掩码值。
     * @param v Integers, ranging from 2 to the 0 to 2 to the 31
     */
    public setMask (v: number) {
        this._shape.setMask(v);
    }

    /**
     * !#en Add mask values to fill in groups that need to be checked.
     * !#zh 添加掩码值，可填入需要检查的 group。
     * @param v Integers, ranging from 2 to the 0 to 2 to the 31
     */
    public addMask (v: number) {
        this._shape.addMask(v);
    }

    /**
     * !#en Subtract the mask value to fill in groups that do not need to be checked.
     * !#zh 减去掩码值，可填入不需要检查的 group。
     * @param v Integers, ranging from 2 to the 0 to 2 to the 31
     */
    public removeMask (v: number) {
        this._shape.removeMask(v);
    }

    /// COMPONENT LIFECYCLE ///

    protected __preload () {
        if (!CC_EDITOR) {
            this._shape.__preload!(this);
        }
    }

    protected onLoad () {
        if (!CC_EDITOR) {
            this._shape.onLoad!();
        }

    }

    protected onEnable () {
        if (!CC_EDITOR) {
            this._shape.onEnable!();
        }
    }

    protected onDisable () {
        if (!CC_EDITOR) {
            this._shape.onDisable!();
        }
    }

    protected onDestroy () {
        if (!CC_EDITOR) {
            this._shape.onDestroy!();
        }
    }
}

cc.js.mixin(ColliderComponent.prototype, CallbacksInvoker.prototype, cc.EventTarget.prototype);
cc.ColliderComponent = ColliderComponent;
