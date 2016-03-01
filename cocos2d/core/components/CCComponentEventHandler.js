/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * Component will register a event to target component's handler.
 * And it will trigger the handler when a certain event occurs.
 *
 * @class Component.EventHandler
 */
cc.Component.EventHandler = cc.Class({
    name: 'cc.ClickEvent',
    properties: {
        /**
         * Event target
         * @property target
         * @type cc.Node
         * @default null
         */
        target: {
            default: null,
            type: cc.Node,
        },
        /**
         * Component name
         * @property component
         * @type {String}
         * @default ''
         */
        component: {
            default: '',
        },
        /**
         * Event handler
         * @property handler
         * @type {String}
         * @default ''
         */
        handler: {
            default: '',
        }
    },

    statics: {
        /**
         * Emit events with params
         * @method emitEvents
         * @param {Array} events
         * @param {*} params
         */
        emitEvents: function(events, params) {
            for (var i = 0, l = events.length; i < l; i++) {
                var event = events[i];
                if (! event instanceof cc.Component.EventHandler) continue;

                event.emit(params);
            }
        }
    },

    /**
     * Emit event with params
     * @method emit
     * @param {*} params
     */
    emit: function(params) {
        var target = this.target;
        if (!cc.isValid(target)) return;

        var comp = target.getComponent(this.component);
        if (!cc.isValid(comp)) return;

        var handler = comp[this.handler];
        if (typeof(handler) !== 'function') return;

        handler.call(comp, params);
    }
});
