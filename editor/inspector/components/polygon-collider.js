const { template, $, update, close } = require('./base');
const { getMessageProtocolScene } = require('../utils/prop');

exports.template = template;
exports.$ = $;
exports.update = update;
exports.close = close;

exports.ready = function() {
    this.elements = {
        threshold: {
            ready(element) {
                const $input = element.querySelector('ui-num-input[slot="content"]');
                $input.setAttribute('style', 'display: inline-block;margin-right: 10px;');

                const $button = document.createElement('ui-button');
                $button.setAttribute('style', 'white-space: nowrap;');
                $button.setAttribute('slot', 'content');
                $button.setAttribute('class', 'blue');
                $button.innerText = 'Regenerate Points';
                $input.after($button);

                $button.addEventListener('change', (event) => {
                    event.stopPropagation();
                });

                $button.addEventListener('confirm', async (event) => {
                    event.stopPropagation();

                    const uuids = this.dump.value.uuid.values || [this.dump.value.uuid.value];
                    const undoID = await Editor.Message.request(getMessageProtocolScene(this.$this), 'begin-recording', uuids);
                    for (const uuid of uuids) {
                        await Editor.Message.request(getMessageProtocolScene(this.$this), 'regenerate-polygon-2d-points', uuid);
                    }
                    await Editor.Message.request(getMessageProtocolScene(this.$this), 'end-recording', undoID);
                });
            },
        },
    };
};
