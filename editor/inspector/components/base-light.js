const { template, $, update, close } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;
exports.close = close;

const { setHidden, isMultipleInvalid } = require('../utils/prop');

exports.ready = function() {
    this.elements = {
        luminousFlux: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.term) || dump.term.value !== 0, element);
            },
        },
        luminance: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.term) || dump.term.value !== 1, element);
            },
        },
    };
};
