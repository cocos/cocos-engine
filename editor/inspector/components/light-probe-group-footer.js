exports.template = `
<ui-prop>
    <ui-button slot="content" class="blue generate">Generate</ui-button>
</ui-prop>
`;

exports.$ = {
    generate: '.generate',
};

exports.ready = function() {
    const panel = this;

    panel.$.generate.addEventListener('confirm', () => {
        const uuid = panel.$this.dump.value.uuid.value;
        Editor.Message.send('scene', 'execute-component-method', {
            uuid: uuid,
            name: 'generateLightProbes',
            args: [],
        });
    });
};
