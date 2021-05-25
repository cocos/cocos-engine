const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

const { setHidden, isMultipleInvalid } = require('../utils/prop');

exports.ready = function() {
    this.elements = {
        string: {
            displayOrder: 0,
        },
        useSystemFont: {
            displayOrder: 1,
        },
        fontFamily: {
            displayOrder: 2,
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.useSystemFont) || !dump.useSystemFont.value, element);
            },
        },
        cacheMode: {
            displayOrder: 3,
            update(element, dump) {
                this.elements.fontFamily.update.call(this, element, dump);
            },
        },
        font: {
            displayOrder: 4,
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.useSystemFont) || !!dump.useSystemFont.value, element);
            },
        },
    };
};
