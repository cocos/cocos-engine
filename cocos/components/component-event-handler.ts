import { CCClass } from '../core/data';

/****************************************************************************
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
 ****************************************************************************/

import {ccclass, property} from '../core/data/class-decorator';
import { Node } from '../scene-graph';

/**
 * !#en
 * Component will register a event to target component's handler.
 * And it will trigger the handler when a certain event occurs.
 *
 * !@zh
 * “EventHandler” 类用来设置场景中的事件回调，
 * 该类允许用户设置回调目标节点，目标组件名，组件方法名，
 * 并可通过 emit 方法调用目标函数。
 * @class Component.EventHandler
 * @example
 * // Create new EventHandler
 * var eventHandler = new cc.Component.EventHandler();
 * eventHandler.target = newTarget;
 * eventHandler.component = "MainMenu";
 * eventHandler.handler = "OnClick";
 * eventHandler.customEventData = "my data";
 */
@ccclass('cc.ClickEvent')
export class EventHandler {

    @property
    get _componentName () {
        this._genCompIdIfNeeded();

        return this._compId2Name(this._componentId);
    }
    set _componentName (value) {
        this._componentId = this._compName2Id(value);
    }

    /**
     * @method emitEvents
     * @param {Component.EventHandler[]} events
     * @param {any} ...params
     * @static
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
     * !#en Event target
     * !#zh 目标节点
     * @property target
     * @type {Node}
     * @default null
     */
    @property(cc.Node)
    public target: Node | null = null;
    /**
     * !#en Component name
     * !#zh 目标组件名
     * @property component
     * @type {String}
     * @default ''
     */
    // only for deserializing old project component field
    @property
    public component = '';

    @property
    public _componentId = '';

    /**
     * !#en Event handler
     * !#zh 响应事件函数名
     * @property handler
     * @type {String}
     * @default ''
     */
    @property
    public handler = '';

    /**
     * !#en Custom Event Data
     * !#zh 自定义事件数据
     * @property customEventData
     * @default ''
     * @type {String}
     */
    @property
    public customEventData = '';

    /**
     * !#en Emit event with params
     * !#zh 触发目标组件上的指定 handler 函数，该参数是回调函数的参数值（可不填）。
     * @method emit
     * @param {Array} params
     * @example
     * // Call Function
     * var eventHandler = new cc.Component.EventHandler();
     * eventHandler.target = newTarget;
     * eventHandler.component = "MainMenu";
     * eventHandler.handler = "OnClick"
     * eventHandler.emit(["param1", "param2", ....]);
     */
    public emit (params: any[]) {
        const target = this.target;
        if (!cc.isValid(target)) { return; }

        this._genCompIdIfNeeded();
        const compType = cc.js._getClassById(this._componentId);

        const comp = target!.getComponent(compType);
        if (!cc.isValid(comp)) { return; }

        const handler = comp![this.handler];
        if (typeof(handler) !== 'function') { return; }

        if (this.customEventData != null && this.customEventData !== '') {
            params = params.slice();
            params.push(this.customEventData);
        }

        handler.apply(comp, params);
    }

    private _compName2Id (compName) {
        const comp = cc.js.getClassByName(compName);
        return cc.js._getClassId(comp);
    }

    private _compId2Name (compId) {
        const comp = cc.js._getClassById(compId);
        return cc.js.getClassName(comp);
    }

    // to be deprecated in the future
    private _genCompIdIfNeeded () {
        if (!this._componentId) {
            this._componentName = this.component;
            this.component = '';
        }
    }
}

cc.Component.EventHandler = EventHandler;
