const { trackEventWithTimer } = require('../utils/metrics');
const { getMessageProtocolScene } = require('../utils/prop');

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

    const mode = await Editor.Message.request(getMessageProtocolScene(this.$this), 'query-light-probe-edit-mode');
    panel.changeProbeMode(mode);

    const boxMode = await Editor.Message.request(getMessageProtocolScene(this.$this), 'query-light-probe-bounding-box-edit-mode');
    panel.changeProbeBoxMode(boxMode);
};

exports.ready = function() {
    const panel = this;

    panel.onGenerateConfirmBind = panel.onGenerateConfirm.bind(panel);
    panel.$.generate.addEventListener('confirm', panel.onGenerateConfirmBind);

    panel.onEditConfirmBind = panel.onEditConfirm.bind(panel);
    panel.$.edit.addEventListener('confirm', panel.onEditConfirmBind);

    panel.changeProbeModeBind = panel.changeProbeMode.bind(panel);
    Editor.Message.addBroadcastListener('scene:light-probe-edit-mode-changed', panel.changeProbeModeBind);

    panel.onBoxConfirmBind = panel.onBoxConfirm.bind(panel);
    panel.$.box.addEventListener('confirm', panel.onBoxConfirmBind);

    panel.changeProbeBoxModeBind = panel.changeProbeBoxMode.bind(panel);
    Editor.Message.addBroadcastListener('scene:light-probe-bounding-box-edit-mode-changed', panel.changeProbeBoxModeBind);
};

exports.close = function() {
    const panel = this;

    panel.$.generate.removeEventListener('confirm', panel.onGenerateConfirmBind);
    panel.$.edit.removeEventListener('confirm', panel.onEditConfirmBind);
    panel.$.box.removeEventListener('confirm', panel.onBoxConfirmBind);
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
    async onGenerateConfirm() {
        const result = await Editor.Dialog.warn(Editor.I18n.t('ENGINE.components.lightProbeGroup.generateWarnTip'), {
            buttons: [Editor.I18n.t('ENGINE.dialog.confirm'), Editor.I18n.t('ENGINE.dialog.cancel')],
            default: 0,
            cancel: 1,
        });

        if (result.response === 0) {
            // Turn off the box mode first
            if (this.sceneProbeBoxMode) {
                await Editor.Message.request(getMessageProtocolScene(this.$this), 'toggle-light-probe-bounding-box-edit-mode', !this.sceneProbeBoxMode);
            }

            const uuidObject = this.dump.value.uuid;
            const uuids = uuidObject.values ? uuidObject.values : [uuidObject.value];
            const undoID = await Editor.Message.request(getMessageProtocolScene(this.$this), 'begin-recording', uuids);
            for (const uuid of uuids) {
                Editor.Message.send(getMessageProtocolScene(this.$this), 'execute-component-method', {
                    uuid: uuid,
                    name: 'generateLightProbes',
                    args: [],
                });
            }

            trackEventWithTimer('bakingSystem', 'A100006');

            await Editor.Message.request(getMessageProtocolScene(this.$this), 'end-recording', undoID);
        }
    },
    async onEditConfirm() {
        await Editor.Message.request(getMessageProtocolScene(this.$this), 'toggle-light-probe-edit-mode', !this.sceneProbeMode);
        trackEventWithTimer('bakingSystem', 'A100008');
        Editor.Panel.focus('scene');
    },
    async onBoxConfirm() {
        await Editor.Message.request(getMessageProtocolScene(this.$this), 'toggle-light-probe-bounding-box-edit-mode', !this.sceneProbeBoxMode);
        trackEventWithTimer('bakingSystem', 'A100007');
        Editor.Panel.focus('scene');
    },
};
