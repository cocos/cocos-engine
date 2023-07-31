const { template, $, update, close } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;
exports.close = close;

const { setHidden, setReadonly, isMultipleInvalid } = require('../utils/prop');

exports.ready = function() {
    this.elements = {
        fillType: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value !== 3, element);
            },
        },
        fillCenter: {
            update(element, dump) {
                this.elements.fillType.update.call(this, element, dump);
                setReadonly(dump.fillType.value !== 2, element);
            },
        },
        fillStart: {
            update(element, dump) {
                this.elements.fillType.update.call(this, element, dump);
            },
        },
        fillRange: {
            update(element, dump) {
                this.elements.fillType.update.call(this, element, dump);
            },
        },
    };
};
