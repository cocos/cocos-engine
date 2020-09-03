/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

/**
 * @category event
 */

import {ccclass, type, serializable, editable} from 'cc.decorator';
import { Node } from '../scene-graph';
import { legacyCC } from '../global-exports';

/**
 * @en
 * Component will register a event to target component's handler. And it will trigger the handler when a certain event occurs.
 *
 * @zh
 * “EventHandler” 类用来设置场景中的事件回调，该类允许用户设置回调目标节点，目标组件名，组件方法名，并可通过 emit 方法调用目标函数。
 *
 * @example
 * ```ts
 * // Let's say we have a MainMenu component on newTarget
 * // file: MainMenu.ts
 * @ccclass('MainMenu')
 * export class MainMenu extends Component {
 *     // sender: the node MainMenu.ts belongs to
 *     // eventType: CustomEventData
 *     onClick (sender, eventType) {
 *         cc.log('click');
 *     }
 * }
 *
 * import { Component } from 'cc';
 * const eventHandler = new Component.EventHandler();
 * eventHandler.target = newTarget;
 * eventHandler.component = "MainMenu";
 * eventHandler.handler = "OnClick";
 * eventHandler.customEventData = "my data";
 * ```
 */
@ccclass('cc.ClickEvent')
export class EventHandler {

    get _componentName () {
        this._genCompIdIfNeeded();

        return this._compId2Name(this._componentId);
    }
    set _componentName (value) {
        this._componentId = this._compName2Id(value);
    }

    /**
     * @en
     * For component event emit
     * @zh
     * 组件事件派发。
     *
     * @param events - 需要派发的组件事件列表。
     * @param args - 派发参数数组。
     */
    public static emitEvents (events: EventHandler[], ...args: any[]) {
        for (let i = 0, l = events.length; i < l; i++) {
            const event = events[i];
            if (!(event instanceof EventHandler)) {
                continue;
            }

            event.emit(args);
        }
    }
    /**
     * @en
     * The node that contains target callback, such as the node example script belongs to
     * @zh
     * 事件响应函数所在节点 ，比如例子中脚本归属的节点本身
     */
    @type(legacyCC.Node)
    public target: Node | null = null;
    /**
     * @en
     * The name of the component(script) that contains target callback, such as the name 'MainMenu' of script in example
     * @zh
     * 事件响应函数所在组件名（脚本名）, 比如例子中的脚本名 'MainMenu'
     */
    // only for deserializing old project component field
    @serializable
    @editable
    public component = '';

    @serializable
    public _componentId = '';

    /**
     * @en
     * Event handler, such as function's name 'onClick' in example
     * @zh
     * 响应事件函数名，比如例子中的 'onClick'
     */
    @serializable
    @editable
    public handler = '';

    /**
     * @en
     * Custom Event Data, such as 'eventType' in example
     * @zh
     * 自定义事件数据，比如例子中的 eventType
     */
    @serializable
    @editable
    public customEventData = '';

    /**
     * @en
     * Emit event with params
     * @zh
     * 触发目标组件上的指定 handler 函数，该参数是回调函数的参数值（可不填）。
     *
     * @param params - 派发参数数组。
     * @example
     * ```ts
     * import { Component } from 'cc';
     * const eventHandler = new Component.EventHandler();
     * eventHandler.target = newTarget;
     * eventHandler.component = "MainMenu";
     * eventHandler.handler = "OnClick"
     * eventHandler.emit(["param1", "param2", ....]);
     * ```
     */
    public emit (params: any[]) {
        const target = this.target;
        if (!legacyCC.isValid(target)) { return; }

        this._genCompIdIfNeeded();
        const compType = legacyCC.js._getClassById(this._componentId);

        const comp = target!.getComponent(compType);
        if (!legacyCC.isValid(comp)) { return; }

        const handler = comp![this.handler];
        if (typeof(handler) !== 'function') { return; }

        if (this.customEventData != null && this.customEventData !== '') {
            params = params.slice();
            params.push(this.customEventData);
        }

        handler.apply(comp, params);
    }

    private _compName2Id (compName) {
        const comp = legacyCC.js.getClassByName(compName);
        return legacyCC.js._getClassId(comp);
    }

    private _compId2Name (compId) {
        const comp = legacyCC.js._getClassById(compId);
        return legacyCC.js.getClassName(comp);
    }

    // to be deprecated in the future
    private _genCompIdIfNeeded () {
        if (!this._componentId) {
            this._componentName = this.component;
            this.component = '';
        }
    }
}

legacyCC.Component.EventHandler = EventHandler;
