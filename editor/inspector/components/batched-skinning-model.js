const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

exports.ready = function () {
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
        let values = [this.dump.value];
        if (this.dump.values) {
            values = this.dump.values;
        }

        values.forEach((item) => {
            Editor.Message.send('scene', 'execute-component-method', {
                uuid: item.uuid.value,
                name: 'cook',
                args: [],
            });
        });

        values.forEach((item) => {
            Editor.Message.send('scene', 'execute-component-method', {
                uuid: item.uuid.value,
                name: 'combine',
                args: [],
            });
        });
    });
};
