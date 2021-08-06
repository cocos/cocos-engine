const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

exports.ready = function() {
    const $prop = document.createElement('ui-prop');
    this.$.componentContainer.before($prop);

    const $label = document.createElement('ui-label');
    $label.setAttribute('slot', 'label');
    $label.value = 'Operation';
    $prop.appendChild($label);

    const $button = document.createElement('ui-button');
    $button.setAttribute('slot', 'content');
    $button.setAttribute('class', 'blue');
    $button.innerText = 'Cook';
    $prop.appendChild($button);

    $button.addEventListener('confirm', () => {
        Editor.Message.send('scene', 'snapshot');

        const uuids = this.dump.value.uuid.values || [this.dump.value.uuid.value];

        uuids.forEach((uuid) => {
            Editor.Message.send('scene', 'execute-component-method', {
                uuid: uuid,
                name: 'cook',
                args: [],
            });
        });

        uuids.forEach((uuid) => {
            Editor.Message.send('scene', 'execute-component-method', {
                uuid: uuid,
                name: 'combine',
                args: [],
            });
        });
    });
};
