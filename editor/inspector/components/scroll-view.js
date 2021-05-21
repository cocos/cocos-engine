const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

const { setHidden, isMultipleInvalid } = require('../utils/prop');

exports.ready = function() {
    this.elements = {
        horizontal: {
            displayOrder: 0,
        },
        horizontalScrollBar: {
            displayOrder: 1,
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.horizontal) || !dump.horizontal.value, element);
            },
        },
        vertical: {
            displayOrder: 2,
        },
        verticalScrollBar: {
            displayOrder: 3,
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.vertical) || !dump.vertical.value, element);
            },
        },
        inertia: {
            displayOrder: 4,
        },
        brake: {
            displayOrder: 5,
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.inertia) || !dump.inertia.value, element);
            },
        },
        elastic: {
            displayOrder: 6,
        },
        bounceDuration: {
            displayOrder: 7,
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.elastic) || !dump.elastic.value, element);
            },
        },
    };
};
