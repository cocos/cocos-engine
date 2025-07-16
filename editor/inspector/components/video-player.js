const { template, $, update, close } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;
exports.close = close;

const { setHidden, isMultipleInvalid } = require('../utils/prop');

exports.ready = function() {
    this.elements = {
        remoteURL: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.resourceType) || dump.resourceType.value !== 0, element);
            },
        },
        clip: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.resourceType) || dump.resourceType.value === 0, element);
            },
        },
    };
};
