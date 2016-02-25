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

/**
 * Emit events with params
 * @param {Array} events
 * @param {*} params
 */
cc.Component.EventHandler.emitEvents = function(events, params) {
    for (var i = 0, l = events.length; i < l; i++) {
        var event = events[i];
        if (! event instanceof cc.Component.EventHandler) continue;

        event.emit(params);
    }
};
