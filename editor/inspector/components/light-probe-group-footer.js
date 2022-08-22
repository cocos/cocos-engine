exports.template = `
<div class="container">
    <ui-button class="blue generate" tooltip="i18n:ENGINE.components.lightProbeGroup.generateTip">Generate Probes</ui-button>
    <ui-button class="blue edit" tooltip="i18n:ENGINE.components.lightProbeGroup.editTip">Enable Probe Edit</ui-button>
</div>
`;

exports.style = `
.container {
    display: flex;
    margin-top: 8px;
}
ui-button {
    flex: 1;
}
.edit {
    margin-left: 8px;
}
`;

exports.$ = {
    generate: '.generate',
    edit: '.edit',
};

exports.update = async function() {
    const panel = this;

    panel.sceneProbeMode = await Editor.Message.request('scene', 'query-light-probe-edit-mode');
    if (panel.sceneProbeMode) {
        panel.$.edit.innerText = 'Disable Probe Edit';
    } else {
        panel.$.edit.innerText = 'Enable Probe Edit';
    }
};

exports.ready = function() {
    const panel = this;

    panel.$.generate.addEventListener('confirm', async () => {
        const result = await Editor.Dialog.warn(Editor.I18n.t('ENGINE.components.lightProbeGroup.generateWarnTip'), {
            buttons: [Editor.I18n.t('ENGINE.dialog.confirm'), Editor.I18n.t('ENGINE.dialog.cancel')],
            default: 0,
            cancel: 1,
        });

        if (result.response === 0) {
            const uuid = panel.$this.dump.value.uuid.value;
            Editor.Message.send('scene', 'execute-component-method', {
                uuid: uuid,
                name: 'generateLightProbes',
                args: [],
            });
        }
    });

    panel.$.edit.addEventListener('confirm', async () => {
        await Editor.Message.request('scene', 'toggle-light-probe-edit-mode', !panel.sceneProbeMode);
        panel.$this.update();
    });
};
