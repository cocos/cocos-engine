const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

exports.ready = function() {
    this.elements = {
        url: {
            displayOrder: 0,
            ready(element) {
                element.querySelector('ui-input[slot="content"]').placeholder = 'https://www.cocos.com/';
            },
        },
    };
};
