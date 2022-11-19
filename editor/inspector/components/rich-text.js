const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

const { setHidden, isMultipleInvalid } = require('../utils/prop');

exports.ready = function() {
    this.elements = {
        fontFamily: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.useSystemFont) || !dump.useSystemFont.value, element);
            },
        },
        cacheMode: {
            update(element, dump) {
                this.elements.fontFamily.update.call(this, element, dump);
            },
        },
        font: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.useSystemFont) || !!dump.useSystemFont.value, element);
            },
        },
    };
};
