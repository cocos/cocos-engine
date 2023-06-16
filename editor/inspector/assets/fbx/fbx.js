'use strict';

const { updateElementReadonly, updateElementInvalid, getPropValue, setPropValue } = require('../../utils/assets');

exports.template = /* html */`
<div class="container">
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.animationBakeRate.name" tooltip="i18n:ENGINE.assets.fbx.animationBakeRate.title"></ui-label>
        <ui-select slot="content" class="animationBakeRate-select">
            <option value="0">0</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="60">60</option>
        </ui-select>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.preferLocalTimeSpan.name" tooltip="i18n:ENGINE.assets.fbx.preferLocalTimeSpan.title"></ui-label>
        <ui-checkbox slot="content" class="preferLocalTimeSpan-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-prop class="smart-material-prop">
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.smartMaterialEnabled.name" tooltip="i18n:ENGINE.assets.fbx.smartMaterialEnabled.title"></ui-label>
        <ui-checkbox slot="content" class="smartMaterialEnabled-checkbox"></ui-checkbox>
        <div class="warn-words">
            <ui-label value="i18n:ENGINE.assets.fbx.smartMaterialEnabled.warn"></ui-label>
        </div>
    </ui-prop>
    <ui-section class="legacy">
        <ui-label slot="header" value="i18n:ENGINE.assets.fbx.legacyOptions"></ui-label>
        <div class="legacy-importer">
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.legacyFbxImporter.name" tooltip="i18n:ENGINE.assets.fbx.legacyFbxImporter.title"></ui-label>
                <ui-checkbox slot="content" class="legacyFbxImporter-checkbox"></ui-checkbox>
            </ui-prop>
            <div class="warn-words">
                <ui-label value="i18n:ENGINE.assets.fbx.legacyFbxImporter.warn"></ui-label>
            </div>
        </div>
    </ui-section>
</div>
`;

exports.style = /* css */`
ui-prop { margin-right: 4px; }
ui-section.config { margin-right: 0; }

.warn-words {
    color: var(--color-warn-fill);
}
.legacy-importer {
    display: none;
    margin-top: 10px;
}
.smart-material-prop .warn-words {
    display: none;
}

.smart-material-prop[readonly] .warn-words {
    display: block;
    margin-top: 4px;
    line-height: 20px;
}
`;

exports.$ = {
    container: '.container',
    legacy: '.legacy',
    legacyImporter: '.legacy-importer',
    legacyFbxImporterCheckbox: '.legacyFbxImporter-checkbox',
    animationBakeRateSelect: '.animationBakeRate-select',
    preferLocalTimeSpanCheckbox: '.preferLocalTimeSpan-checkbox',
    smartMaterialEnabledCheckbox: '.smartMaterialEnabled-checkbox',
    smartMaterialEnabledProp: '.smart-material-prop',
};

/**
 * attribute corresponds to the edit element
 */
const Elements = {
    legacy: {
        async ready() {
            const panel = this;

            const legacyFbxImporter = await Editor.Profile.getProject('project', 'fbx.legacyFbxImporter.visible');
            if (legacyFbxImporter) {
                panel.$.legacyImporter.style.display = "block";
            }

            if (!legacyFbxImporter) {
                panel.$.legacy.style.display = "none";
            }
        },
    },
    legacyFbxImporter: {
        ready() {
            const panel = this;

            panel.$.animationBakeRateSelect.children[0].innerText = Editor.I18n.t('ENGINE.assets.fbx.animationBakeRate.auto');

            panel.$.legacyFbxImporterCheckbox.addEventListener('change', panel.setProp.bind(panel, 'legacyFbxImporter', 'boolean'));
            panel.$.legacyFbxImporterCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.legacyFbxImporterCheckbox.value = getPropValue.call(panel, panel.meta.userData.legacyFbxImporter, false);

            updateElementInvalid.call(panel, panel.$.legacyFbxImporterCheckbox, 'legacyFbxImporter');
            updateElementReadonly.call(panel, panel.$.legacyFbxImporterCheckbox);
        },
    },
    animationBakeRate: {
        ready() {
            const panel = this;

            panel.$.animationBakeRateSelect.addEventListener('change', panel.setProp.bind(panel, 'fbx.animationBakeRate', 'number'));
            panel.$.animationBakeRateSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let defaultValue = 0;
            if (panel.meta.userData.fbx) {
                defaultValue = getPropValue.call(panel, panel.meta.userData.fbx.animationBakeRate, defaultValue);
            }

            panel.$.animationBakeRateSelect.value = defaultValue;

            updateElementInvalid.call(panel, panel.$.animationBakeRateSelect, 'fbx.animationBakeRate');
            updateElementReadonly.call(panel, panel.$.animationBakeRateSelect);
        },
    },
    preferLocalTimeSpan: {
        ready() {
            const panel = this;

            panel.$.preferLocalTimeSpanCheckbox.addEventListener('change', panel.setProp.bind(panel, 'fbx.preferLocalTimeSpan', 'boolean'));
            panel.$.preferLocalTimeSpanCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let defaultValue = true;
            if (panel.meta.userData.fbx) {
                defaultValue = getPropValue.call(panel, panel.meta.userData.fbx.preferLocalTimeSpan, defaultValue);
            }

            panel.$.preferLocalTimeSpanCheckbox.value = defaultValue;

            updateElementInvalid.call(panel, panel.$.preferLocalTimeSpanCheckbox, 'fbx.preferLocalTimeSpan');
            updateElementReadonly.call(panel, panel.$.preferLocalTimeSpanCheckbox);
        },
    },
    smartMaterialEnabled: {
        ready() {
            const panel = this;

            panel.$.smartMaterialEnabledCheckbox.addEventListener('change', panel.setProp.bind(panel, 'fbx.smartMaterialEnabled', 'boolean'));
            panel.$.smartMaterialEnabledCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        async update() {
            const panel = this;

            const laboratoryExpectedValue = await Editor.Profile.getProject('project', 'fbx.material.smart');
            if (!laboratoryExpectedValue) {
                panel.$.smartMaterialEnabledProp.setAttribute('readonly', '');
            } else {
                panel.$.smartMaterialEnabledProp.removeAttribute('readonly');
            }

            let defaultValue = false;
            if (panel.meta.userData.fbx) {
                defaultValue = getPropValue.call(panel, panel.meta.userData.fbx.smartMaterialEnabled, defaultValue);
            }

            panel.$.smartMaterialEnabledCheckbox.value = defaultValue;

            updateElementInvalid.call(panel, panel.$.smartMaterialEnabledCheckbox, 'fbx.smartMaterialEnabled');
            updateElementReadonly.call(panel, panel.$.smartMaterialEnabledCheckbox);
        },
    },
};

exports.methods = {
    setProp(prop, type, event) {
        setPropValue.call(this, prop, type, event);

        this.dispatch('change');
        this.dispatch('track', { tab: 'fbx', prop, value: event.target.value });
    },
};

exports.ready = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

exports.update = async function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            await element.update.call(this);
        }
    }
};

exports.close = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.close) {
            element.close.call(this);
        }
    }
};
