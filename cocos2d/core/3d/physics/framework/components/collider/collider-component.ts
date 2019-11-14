/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
*/

import { ccclass, property } from '../../../../../platform/CCClassDecorator';
import CallbacksInvoker from '../../../../../platform/callbacks-invoker';
import js  from '../../../../../platform/js';
import { Vec3 } from '../../../../../value-types';
import { CollisionCallback, CollisionEventType, TriggerCallback, TriggerEventType } from '../../physics-interface';
import CCComponent from '../../../../../components/CCComponent';
import { IBaseShape } from '../../../spec/i-physics-spahe';

/**
 * @zh
 * 碰撞器的基类
 */
@ccclass('cc.ColliderComponent')
export class ColliderComponent extends CCComponent {

    /**
     * @zh
     * 存储注册事件的回调列表，请不要直接修改。
     */
    public _callbackTable: any = js.createMap(true);

    /// PUBLIC PROPERTY GETTER\SETTER ///

    /**
     * @en
     * get or set the collider is trigger, this will be always trigger if using builtin.
     * @zh
     * 获取或设置碰撞器是否为触发器，若使用 builtin ，属性值无论真假 ，此碰撞器都为触发器。
     */
    @property({
        displayOrder: 0,
        tooltip:'是否与其它碰撞器产生碰撞，并产生物理行为',
    })
    public get isTrigger () {
        return this._isTrigger;
    }

    public set isTrigger (value) {
        this._isTrigger = value;
        if (!CC_EDITOR) {
            this._shape.isTrigger = this._isTrigger;
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
        tooltip:'形状的中心点（与所在 Node 中心点的相对位置）',
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
    protected _isTrigger: boolean = false;

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

    /// GROUP MASK ///

    /**
     * @zh
     * 设置分组值。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public setGroup (v: number): void {
        this._shape!.setGroup(v);
    }

    /**
     * @zh
     * 获取分组值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getGroup (): number {
        return this._shape.getGroup();
    }

    /**
     * @zh
     * 添加分组值，可填要加入的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addGroup (v: number) {
        this._shape.addGroup(v);
    }

    /**
     * @zh
     * 减去分组值，可填要移除的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public removeGroup (v: number) {
        this._shape.removeGroup(v);
    }

    /**
     * @zh
     * 获取掩码值。
     * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public getMask (): number {
        return this._shape.getMask();
    }

    /**
     * @zh
     * 设置掩码值。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public setMask (v: number) {
        this._shape.setMask(v);
    }

    /**
     * @zh
     * 添加掩码值，可填入需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
     */
    public addMask (v: number) {
        this._shape.addMask(v);
    }

    /**
     * @zh
     * 减去掩码值，可填入不需要检查的 group。
     * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
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

    private _updateMaterial () {
        if (!CC_EDITOR) {
            this._shape.material = this._material;
        }
    }

}

function applyMixins (derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            if (name !== 'constructor') {
                // @ts-ignore
                Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
            }
        });
    });
}
applyMixins(ColliderComponent, [CallbacksInvoker, cc.EventTarget]);
