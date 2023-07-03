const { template, $, update, close } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;
exports.close = close;

const { setHidden, isMultipleInvalid } = require('../utils/prop');

exports.ready = function() {
    this.elements = {
        horizontalScrollBar: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.horizontal) || !dump.horizontal.value, element);
            },
        },
        verticalScrollBar: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.vertical) || !dump.vertical.value, element);
            },
        },
        brake: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.inertia) || !dump.inertia.value, element);
            },
        },
        bounceDuration: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.elastic) || !dump.elastic.value, element);
            },
        },
    };
};
