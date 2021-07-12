const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

const { setHidden, setReadonly, isMultipleInvalid } = require('../utils/prop');

exports.ready = function() {
    this.elements = {
        type: {
            displayOrder: 0,
        },
        fillType: {
            displayOrder: 1,
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value !== 3, element);
            },
        },
        fillCenter: {
            displayOrder: 2,
            update(element, dump) {
                this.elements.fillType.update.call(this, element, dump);
                setReadonly(dump.fillType.value !== 2, element);
            },
        },
        fillStart: {
            displayOrder: 3,
            update(element, dump) {
                this.elements.fillType.update.call(this, element, dump);
            },
        },
        fillRange: {
            displayOrder: 4,
            update(element, dump) {
                this.elements.fillType.update.call(this, element, dump);
            },
        },
    };
};
