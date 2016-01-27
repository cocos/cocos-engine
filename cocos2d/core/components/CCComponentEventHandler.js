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
    }
});
