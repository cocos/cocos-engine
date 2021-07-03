const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

const { setHidden } = require('../utils/prop');

exports.ready = function() {
    this.elements = {
        _asset: {
            displayOrder: 0,
            ready(element) {
                element.addEventListener('change-dump', (event) => {
                    Editor.Message.send('scene', 'snapshot');
                    Editor.Message.request('scene', 'execute-component-method', {
                        uuid: this.dump.value.uuid.value,
                        name: 'manager.addAssetToComp',
                        args: [event.target.dump.value],
                    });
                });
            },
        },
        info: {
            update(element) {
                setHidden(true, element);
            },
        },
    };
};
