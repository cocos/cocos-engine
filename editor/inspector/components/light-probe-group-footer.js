exports.template = `
<div class="light-probe-group">
    <ui-button class="blue half box">Edit Box Mode</ui-button>
    <ui-button class="blue half generate" tooltip="i18n:ENGINE.components.lightProbeGroup.generateTip">Generate Probes</ui-button>
    <ui-button class="edit" type="success" tooltip="i18n:ENGINE.components.lightProbeGroup.editTip">Enter Probe Edit Mode</ui-button>
</div>
`;

exports.style = `
.light-probe-group {
    display: flex;
    flex-wrap: wrap;
    margin-top: 6px;
}
.half {
    width: 50%;
}
.edit {
    flex: 1;
    margin-top: 6px;
}
`;

exports.$ = {
    box: '.box',
    generate: '.generate',
    edit: '.edit',
};

exports.update = async function(dump) {
    const panel = this;

    if (dump) {
        panel.dump = dump;
    }

    const mode = await Editor.Message.request('scene', 'query-light-probe-edit-mode');
    panel.changeProbeMode(mode);
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
            const uuidObject = panel.dump.value.uuid;
            const uuids = uuidObject.values ? uuidObject.values : [uuidObject.value];
            for (const uuid of uuids) {
                Editor.Message.send('scene', 'execute-component-method', {
                    uuid: uuid,
                    name: 'generateLightProbes',
                    args: [],
                });
            }
        }
    });

    panel.$.edit.addEventListener('confirm', async () => {
        await Editor.Message.request('scene', 'toggle-light-probe-edit-mode', !panel.sceneProbeMode);
    });

    panel.changeProbeModeBind = panel.changeProbeMode.bind(panel);
    Editor.Message.addBroadcastListener('scene:light-probe-edit-mode-changed', panel.changeProbeModeBind);
};

exports.close = function() {
    const panel = this;

    Editor.Message.removeBroadcastListener('scene:light-probe-edit-mode-changed', panel.changeProbeModeBind);
};

exports.methods = {
    changeProbeMode(mode) {
        const panel = this;

        panel.sceneProbeMode = mode;

        if (mode) {
            panel.$.edit.innerText = 'Exit Probe Edit Mode';
        } else {
            panel.$.edit.innerText = 'Enter Probe Edit Mode';
        }
    },
};
