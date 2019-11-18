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
import { Vec3 } from '../../../../../value-types';
import { CollisionCallback, CollisionEventType } from '../../collider-interface';
import CCComponent from '../../../../../components/CCComponent';
import { IBaseShape } from '../../../spec/i-collider-shape';

/**
 * !#en The base class of the collider
 * !#zh 碰撞器的基类
 */
@ccclass('cc.ColliderComponent')
export class ColliderComponent extends CCComponent {

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

    protected constructor () { 
        super();
        cc.EventTarget.call(this);
    }

    /// EVENT INTERFACE ///

    /**
     * !#en Register callbacks related to triggering events.
     * !#zh 注册碰撞事件相关的回调。
     * @param type The type of collider event can be 'onCollisionEnter', 'onCollisionStay', 'onCollisionExit';
     * @param callback Registered callback function
     * @param target Optional argument that executes the target of the callback function
     * @param useCapture Optional. When set to true, the listener will fire during the capture phase or during the bubbling phase. The default is false.
     */
    public on (type: CollisionEventType, callback: CollisionCallback, target?: Object, useCapture?: any): any {
    }

    /**
     * !#en Cancels the callback associated with a registered collider event.
     * !#zh 取消已经注册的碰撞事件相关的回调。
     * @param type The type of collider event can be 'onCollisionEnter', 'onCollisionStay', 'onCollisionExit';
     * @param callback Registered callback function.
     * @param target Optional argument that executes the target of the callback function.
     * @param useCapture Optional. When set to true, the listener will fire during the capture phase or during the bubbling phase. The default is false.
     */
    public off (type: CollisionEventType, callback: CollisionCallback, target?: Object, useCapture?: any) {
    }

    /**
     * !#en Registers callbacks related to triggering events, but only executes once.
     * !#zh 注册碰撞事件相关的回调，但只会执行一次。
     ** @param type The type of collider event can be 'onCollisionEnter', 'onCollisionStay', 'onCollisionExit';
     * @param callback Registered callback function.
     * @param target Optional argument that executes the target of the callback function.
     * @param useCapture Optional. When set to true, the listener will fire during the capture phase or during the bubbling phase. The default is false.
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

cc.js.mixin(ColliderComponent.prototype, cc.EventTarget.prototype);
