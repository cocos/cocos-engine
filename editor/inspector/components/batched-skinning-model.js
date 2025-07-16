const { template, $, update, close } = require('./base');

const { getMessageProtocolScene } = require('../utils/prop');

exports.template = template;
exports.$ = $;
exports.update = update;
exports.close = close;

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

    $button.addEventListener('confirm', async () => {
        const uuids = this.dump.value.uuid.values || [this.dump.value.uuid.value];
        const undoID = await Editor.Message.request(getMessageProtocolScene(this.$this), 'begin-recording', uuids);
        for (const uuid of uuids) {
            await Editor.Message.request(getMessageProtocolScene(this.$this), 'execute-component-method', {
                uuid: uuid,
                name: 'cook',
                args: [],
            });
        }

        for (const uuid of uuids) {
            await Editor.Message.request(getMessageProtocolScene(this.$this), 'execute-component-method', {
                uuid: uuid,
                name: 'combine',
                args: [],
            });
        }
        await Editor.Message.request(getMessageProtocolScene(this.$this), 'end-recording', undoID);
    });
};
