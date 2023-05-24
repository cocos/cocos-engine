const { trackEventWithTimer } = require('../utils/metrics');

exports.template = `
<div class="light-probe-group">
    <ui-button class="box">Edit Area Box</ui-button>
    <ui-button class="generate" tooltip="i18n:ENGINE.components.lightProbeGroup.generateTip">Generate Probes</ui-button>
    <ui-button class="blue edit" tooltip="i18n:ENGINE.components.lightProbeGroup.editTip">Enter Probe Edit Mode</ui-button>
</div>
`;

exports.style = `
.light-probe-group {
    display: flex;
    flex-wrap: wrap;
    margin-top: 6px;
}
.box {
    width: 48%;
    margin-right: 2%;
}
.generate {
    width: 48%;
    margin-left: 2%;
}
.edit {
    flex: 1;
    margin-top: 8px;
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

    const boxMode = await Editor.Message.request('scene', 'query-light-probe-bounding-box-edit-mode');
    panel.changeProbeBoxMode(boxMode);
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
            // 先关闭盒子模式
            if (panel.sceneProbeBoxMode) {
                await Editor.Message.request('scene', 'toggle-light-probe-bounding-box-edit-mode', !panel.sceneProbeBoxMode);
            }

            const uuidObject = panel.dump.value.uuid;
            const uuids = uuidObject.values ? uuidObject.values : [uuidObject.value];
            const undoID = await Editor.Message.request('scene', 'begin-recording', uuids);
            for (const uuid of uuids) {
                Editor.Message.send('scene', 'execute-component-method', {
                    uuid: uuid,
                    name: 'generateLightProbes',
                    args: [],
                });
            }

            trackEventWithTimer('bakingSystem', 'A100006');

            await Editor.Message.request('scene', 'end-recording', undoID);
        }
    });

    panel.$.edit.addEventListener('confirm', async () => {
        await Editor.Message.request('scene', 'toggle-light-probe-edit-mode', !panel.sceneProbeMode);
        trackEventWithTimer('bakingSystem', 'A100008');
    });

    panel.changeProbeModeBind = panel.changeProbeMode.bind(panel);
    Editor.Message.addBroadcastListener('scene:light-probe-edit-mode-changed', panel.changeProbeModeBind);

    panel.$.box.addEventListener('confirm', async () => {
        await Editor.Message.request('scene', 'toggle-light-probe-bounding-box-edit-mode', !panel.sceneProbeBoxMode);
        trackEventWithTimer('bakingSystem', 'A100007');
    });

    panel.changeProbeBoxModeBind = panel.changeProbeBoxMode.bind(panel);
    Editor.Message.addBroadcastListener('scene:light-probe-bounding-box-edit-mode-changed', panel.changeProbeBoxModeBind);
};

exports.close = function() {
    const panel = this;

    Editor.Message.removeBroadcastListener('scene:light-probe-edit-mode-changed', panel.changeProbeModeBind);
    Editor.Message.removeBroadcastListener('scene:light-probe-bounding-box-edit-mode-changed', panel.changeProbeBoxModeBind);
};

exports.methods = {
    changeProbeMode(mode) {
        const panel = this;

        panel.sceneProbeMode = mode;

        if (mode) {
            panel.$.edit.innerText = 'Exit Probe Edit Mode';
            panel.$.edit.classList.remove('blue');
            panel.$.edit.classList.add('red');
        } else {
            panel.$.edit.innerText = 'Enter Probe Edit Mode';
            panel.$.edit.classList.add('blue');
            panel.$.edit.classList.remove('red');
        }
    },
    changeProbeBoxMode(mode) {
        const panel = this;

        panel.sceneProbeBoxMode = mode;

        if (mode) {
            panel.$.box.innerText = 'Done Edit';
            panel.$.box.classList.add('red');
        } else {
            panel.$.box.innerText = 'Edit Area Box';
            panel.$.box.classList.remove('red');
        }
    },
};
