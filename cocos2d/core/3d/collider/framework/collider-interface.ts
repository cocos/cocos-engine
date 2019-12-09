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

import { Collider3D } from './components/collider/collider-component';

/**
 * !#en Collider event.
 * !#zh 碰撞事件。
 */
export interface IColliderEvent {
    /**
     * !#en The type of event fired.
     * !#zh 碰撞的事件类型。
     */
    readonly type: CollisionEventType;

    /**
     * !#en Colliders its own collider in the event.
     * !#zh 碰撞事件中的自己的碰撞器。
     */
    readonly selfCollider: Collider3D;

    /**
     * !#en Colliders another collider in the event
     * !#zh 碰撞事件中的另一个碰撞器
     */
    readonly otherCollider: Collider3D;
}

/**
 * !#en The value type definition of the collider event.
 * !#zh 碰撞事件的值类型定义。
 */
export type CollisionEventType = 'onCollisionEnter' | 'onCollisionStay' | 'onCollisionExit';

/**
 * !#en The callback signature definition of the event that was fired.
 * !#zh 碰撞事件的回调函数签名定义。
 */
export type CollisionCallback = (event: IColliderEvent) => void;
