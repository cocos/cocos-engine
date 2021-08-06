const { template, $, update, elements } = require('./button');

exports.template = template;
exports.$ = $;
exports.update = update;

exports.ready = function() {
    this.elements = Object.assign(elements, {
        isChecked: {
            displayOrder: 2,
        },
        checkMark: {
            displayOrder: 2,
        },
    });
};

