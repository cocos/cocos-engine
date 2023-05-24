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

import { DEV } from 'internal:constants';
import { CCClass } from '../class';
import { makeEditorClassDecoratorFn, makeSmartEditorClassDecorator, emptySmartClassDecorator } from './utils';

/**
 * @en Declare that the current component relies on another type of component.
 * If the required component doesn't exist, the engine will create a new empty instance of the required component and add it to the node.
 * @zh 为声明为 CCClass 的组件添加依赖的其它组件。当组件添加到节点上时，如果依赖的组件不存在，引擎将会自动将依赖组件添加到同一个节点，防止脚本出错。该设置在运行时同样有效。
 * @param requiredComponent The required component type
 * @example
 * ```ts
 * import {_decorator, Sprite, Component} from cc;
 * import {ccclass, requireComponent} from _decorator;
 *
 * @ccclass
 * @requireComponent(Sprite)
 * class SpriteCtrl extends Component {
 *     // ...
 * }
 * ```
 */
export const requireComponent: (requiredComponent: Function | Function[]) => ClassDecorator = makeEditorClassDecoratorFn('requireComponent');

/**
 * @en Set the component priority, it decides at which order the life cycle functions of components will be invoked. Smaller priority gets invoked before larger priority.
 * This will affect `onLoad`, `onEnable`, `start`, `update` and `lateUpdate`, but `onDisable` and `onDestroy` won't be affected.
 * @zh 设置脚本生命周期方法调用的优先级。优先级小于 0 的组件将会优先执行，优先级大于 0 的组件将会延后执行。优先级仅会影响 onLoad, onEnable, start, update 和 lateUpdate，而 onDisable 和 onDestroy 不受影响。
 * @param priority - The execution order of life cycle methods for Component. Smaller priority gets invoked before larger priority.
 * @example
 * ```ts
 * import { _decorator, Component } from 'cc';
 * const {ccclass, executionOrder} = _decorator;
 *
 * @ccclass
 * @executionOrder(1)
 * class CameraCtrl extends Component {
 *     // ...
 * }
 * ```
 */
export const executionOrder: (priority: number) => ClassDecorator = makeEditorClassDecoratorFn('executionOrder');

/**
 * @en Forbid adds multiple instances of the component to the same node.
 * @zh 防止多个相同类型（或子类型）的组件被添加到同一个节点。
 * @example
 * ```ts
 * import { _decorator, Component } from 'cc';
 * const {ccclass, disallowMultiple} = _decorator;
 *
 * @ccclass
 * @disallowMultiple
 * class CameraCtrl extends Component {
 *     // ...
 * }
 * ```
 */
export const disallowMultiple: ClassDecorator & ((yes?: boolean) => ClassDecorator) =    DEV ? makeSmartEditorClassDecorator('disallowMultiple', true) : emptySmartClassDecorator;
