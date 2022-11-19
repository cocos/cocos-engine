const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

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
