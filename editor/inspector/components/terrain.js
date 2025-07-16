const { template, $, update, close } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;
exports.close = close;

const { setHidden, getMessageProtocolScene } = require('../utils/prop');

exports.ready = function() {
    this.elements = {
        _asset: {
            ready(element) {
                element.addEventListener('change-dump', async (event) => {
                    const uuid = this.dump.value.uuid.value;
                    const dump = event.target.dump;
                    const undoID = await Editor.Message.request(getMessageProtocolScene(this.$this), 'begin-recording', uuid);
                    Editor.Message.request(getMessageProtocolScene(this.$this), 'execute-component-method', {
                        uuid: this.dump.value.uuid.value,
                        name: 'manager.addAssetToComp',
                        args: [dump.value],
                    });
                    await Editor.Message.request(getMessageProtocolScene(this.$this), 'end-recording', undoID);
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
