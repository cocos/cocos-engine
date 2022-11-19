const { template, $, update } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;

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
                    Editor.Message.send('scene', 'snapshot');
                });

                $button.addEventListener('confirm', async (event) => {
                    event.stopPropagation();

                    const uuids = this.dump.value.uuid.values || [this.dump.value.uuid.value];
                    for (const uuid of uuids) {
                        await Editor.Message.request('scene', 'regenerate-polygon-2d-points', uuid);
                    }

                    Editor.Message.send('scene', 'snapshot');
                });
            },
        },
    };
};
