/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com

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

/**
 * @packageDocumentation
 * @module component/xr
 */

import { Vec3 } from '../../core/math';
import { Node } from '../../core/scene-graph/node';
import { Event } from '../../input/types';

export enum DeviceType {
    Other = 0,
    Left = 1,
    Right = 2
}

/**
 * @en The input event type
 * @zh 输入事件类型
 */
export enum XrControlEventType {
    SELECT_ENTERED = 'select-entered',
    SELECT_EXITED = 'select-exited',
    SELECT_CANCELED = 'select-canceled',

    ACTIVATED = 'OnActivited',
    DEACTIVITED = 'Deactivited',
    ACTIVATE_CANCELED = 'activate-canceled',

    UIPRESS_ENTERED = 'UI-press-entered',
    UIPRESS_EXITED = 'UI-press-exited',
    UIPRESS_CANCELED = 'UI-press-canceled',

    HOVER_ENTERED = 'hover-entered',
    HOVER_EXITED = 'hover-exited',
    HOVER_STAY = 'hover-stay',
    HOVER_CANCELED = 'hover-canceled'
}

/**
 * @en
 * Xr handle event.
 *
 * @zh
 * xr手柄事件。
 */
export class XrEventHandle extends Event {
    //  export class XrEventHandle {
    /**
     * @en
     * @zh 事件触发者（左右手柄等）
     */
    public deviceType = DeviceType.Other;

    /**
     * @en
     * @zh 碰撞检测点
     */
    public hitPoint = new Vec3();

    /**
     * @en
     * @zh controller模型
     */
    public model: Node | null = null;

    /**
     * @en
     * @zh 手柄事件
     */
    public eventHandle = 0;

    /**
     * @en
     * @zh 触发者Id
     */
    public triggerId: string | undefined = "";

    /**
     * @en
     * @zh 被附着者node
     */
    public attachNode: Node | null = null;

    /**
     * @en
     * @zh 是否强制抓取
     */
    public forceGrab = true;
}

/**
 * @en Xr 3DUI event type
 * @zh xr的3DUI事件类型
 */
export enum XrUIPressEventType {
    XRUI_HOVER_ENTERED = "xrui-hover-entered",
    XRUI_HOVER_EXITED = "xrui-hover-exited",
    XRUI_HOVER_STAY = "xrui-hover-stay",
    XRUI_CLICK = "xrui-click",
    XRUI_UNCLICK = "xrui-unclick"
}

/**
 * @en Xr Keyboard event type
 * @zh xr的虚拟键盘事件类型
 */
export enum XrKeyboardEventType {
    /**
     * @en
     * The event type for XR keyboard case switching event
     *
     * @zh
     * XR键盘大小写切换事件
     */
    XR_CAPS_LOCK = 'xr-caps-lock',

    /**
     * @en
     * The event type for XR keyboard initialization event
     *
     * @zh
     * XR键盘初始化事件
     */
    XR_KEYBOARD_INIT = 'xr-keyboard-init',

    /**
    * @en
    * The event type for XR keyboard input event
    *
    * @zh
    * XR键盘input事件
    */
    XR_KEYBOARD_INPUT = 'xr-keyboard-input',

    /**
    * @en
    * The event type for XR keyboard to latin
    *
    * @zh
    * 转latin
    */
    TO_LATIN = 'to-latin',

    /**
    * @en
    * The event type for XR keyboard to symbol
    *
    * @zh
    * 转symbol
    */
    TO_SYMBOL = 'to-symbol',

    /**
    * @en
    * The event type for XR keyboard to math_symbol
    *
    * @zh
    * 转math_symbol
    */
    TO_MATH_SYMBOL = 'to-math-symbol',
}

/**
 * @en Xr 3DUI event.
 *
 * @zh xr的3DUI事件。
 */
export class XrUIPressEvent extends Event {
    /**
     * @en
     * @zh 事件触发者（左右手柄等）
     */
    public deviceType = DeviceType.Other;

    /**
     * @en
     * @zh 碰撞检测点
     */
    public hitPoint = new Vec3();
}
