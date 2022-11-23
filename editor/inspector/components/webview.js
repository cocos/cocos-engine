const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

exports.ready = function() {
    this.elements = {
        url: {
            ready(element) {
                element.querySelector('ui-input[slot="content"]').placeholder = 'https://www.cocos.com/';
            },
        },
    };
};
