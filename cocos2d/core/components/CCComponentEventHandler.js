/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 * // Let's say we have a MainMenu component on newTarget
 * // file: MainMenu.js
 * cc.Class({
 *   extends: cc.Component,
 *   // sender: the node MainMenu.js belongs to
 *   // eventType: CustomEventData
 *   onClick (sender, eventType) {
 *     cc.log('click');
 *   }
 * })
 * // Create new EventHandler
 * var eventHandler = new cc.Component.EventHandler();
 * eventHandler.target = newTarget;
 * eventHandler.component = "MainMenu";
 * eventHandler.handler = "onClick";
 * eventHandler.customEventData = "my data";
 */
cc.Component.EventHandler = cc.Class({
    name: 'cc.ClickEvent',
    properties: {
        /**
         * !#en the node that contains target callback, such as the node example script belongs to
         * !#zh 事件响应函数所在节点 ，比如例子中脚本归属的节点本身
         * @property target
         * @type {Node}
         * @default null
         */
        target: {
            default: null,
            type: cc.Node,
        },
        /**
         * !#en name of the component(script) that contains target callback, such as the name 'MainMenu' of script in example
         * !#zh 事件响应函数所在组件名（脚本名）, 比如例子中的脚本名 'MainMenu'
         * @property component
         * @type {String}
         * @default ''
         */
        // only for deserializing old project component field
        component: '',
        _componentId: '',
        _componentName: {
            get () {
                this._genCompIdIfNeeded();

                return this._compId2Name(this._componentId);
            },
            set (value) {
                this._componentId = this._compName2Id(value);
            },
        },
        /**
         * !#en Event handler, such as function's name 'onClick' in example
         * !#zh 响应事件函数名，比如例子中的 'onClick'
         * @property handler
         * @type {String}
         * @default ''
         */
        handler: {
            default: '',
        },

        /**
         * !#en Custom Event Data, such as 'eventType' in example
         * !#zh 自定义事件数据，比如例子中的 eventType
         * @property customEventData
         * @default ''
         * @type {String}
         */
        customEventData: {
            default: ''
        }
    },

    statics: {
        /**
         * @method emitEvents
         * @param {Component.EventHandler[]} events
         * @param {any} ...params
         * @static
         */
        emitEvents: function(events) {
            'use strict';
            let args;
            if (arguments.length > 0) {
                args = new Array(arguments.length - 1);
                for (let i = 0, l = args.length; i < l; i++) {
                    args[i] = arguments[i+1];
                }
            }
            for (let i = 0, l = events.length; i < l; i++) {
                var event = events[i];
                if (!(event instanceof cc.Component.EventHandler)) continue;

                event.emit(args);
            }
        }
    },

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
    emit: function(params) {
        var target = this.target;
        if (!cc.isValid(target)) return;

        this._genCompIdIfNeeded();
        var compType = cc.js._getClassById(this._componentId);
        
        var comp = target.getComponent(compType);
        if (!cc.isValid(comp)) return;

        var handler = comp[this.handler];
        if (typeof(handler) !== 'function') return;

        if (this.customEventData != null && this.customEventData !== '') {
            params = params.slice();
            params.push(this.customEventData);
        }

        handler.apply(comp, params);
    },

    _compName2Id (compName) {
        let comp = cc.js.getClassByName(compName);
        return cc.js._getClassId(comp);
    },

    _compId2Name (compId) {
        let comp = cc.js._getClassById(compId);
        return cc.js.getClassName(comp);
    },

    // to be deprecated in the future
    _genCompIdIfNeeded () {
        if (!this._componentId) {
            this._componentName = this.component;
            this.component = '';
        }
    },
});
