'use strict';

exports.template = `
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

exports.style = `
ui-prop,
ui-section {
    margin: 4px 0;
}
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
    margin-top: 5px;
    line-height: 20px;
}
.smart-material-prop[readonly] .smartMaterialEnabled-checkbox {
    pointer-events: none;
    opacity: 0.3;
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
        },
        update() {
            const panel = this;

            panel.$.legacyFbxImporterCheckbox.value = panel.getDefault(panel.meta.userData.legacyFbxImporter, false);

            panel.updateInvalid(panel.$.legacyFbxImporterCheckbox, 'legacyFbxImporter');
            panel.updateReadonly(panel.$.legacyFbxImporterCheckbox);
        },
    },
    animationBakeRate: {
        ready() {
            const panel = this;

            panel.$.animationBakeRateSelect.addEventListener('change', panel.setProp.bind(panel, 'fbx.animationBakeRate', 'number'));
        },
        update() {
            const panel = this;

            let defaultValue = 0;
            if (panel.meta.userData.fbx) {
                defaultValue = panel.getDefault(panel.meta.userData.fbx.animationBakeRate, defaultValue);
            }

            panel.$.animationBakeRateSelect.value = defaultValue;

            panel.updateInvalid(panel.$.animationBakeRateSelect, 'fbx.animationBakeRate');
            panel.updateReadonly(panel.$.animationBakeRateSelect);
        },
    },
    preferLocalTimeSpan: {
        ready() {
            const panel = this;

            panel.$.preferLocalTimeSpanCheckbox.addEventListener('change', panel.setProp.bind(panel, 'fbx.preferLocalTimeSpan', 'boolean'));
        },
        update() {
            const panel = this;

            let defaultValue = true;
            if (panel.meta.userData.fbx) {
                defaultValue = panel.getDefault(panel.meta.userData.fbx.preferLocalTimeSpan, defaultValue);
            }

            panel.$.preferLocalTimeSpanCheckbox.value = defaultValue;

            panel.updateInvalid(panel.$.preferLocalTimeSpanCheckbox, 'fbx.preferLocalTimeSpan');
            panel.updateReadonly(panel.$.preferLocalTimeSpanCheckbox);
        },
    },
    smartMaterialEnabled: {
        ready() {
            const panel = this;

            panel.$.smartMaterialEnabledCheckbox.addEventListener('change', panel.setProp.bind(panel, 'fbx.smartMaterialEnabled', 'boolean'));
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
                defaultValue = panel.getDefault(panel.meta.userData.fbx.smartMaterialEnabled, defaultValue);
            }

            panel.$.smartMaterialEnabledCheckbox.value = defaultValue;

            panel.updateInvalid(panel.$.smartMaterialEnabledCheckbox, 'fbx.smartMaterialEnabled');
            panel.updateReadonly(panel.$.smartMaterialEnabledCheckbox);
        },
    },
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

exports.ready = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
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

exports.methods = {
    setProp(prop, type, event) {
        const propNames = prop.split('.');

        this.metaList.forEach((meta) => {
            let target = meta.userData;
            const lastIndex = propNames.length - 1;
            const lastPropName = propNames[lastIndex];

            if (propNames.length > 1) {
                for (let i = 0; i < lastIndex; i++) {
                    const propName = propNames[i];
                    if (!target[propName]) {
                        target[propName] = {};
                    }
                    target = target[propName];
                }
            }

            let value = event.target.value;
            if (type === 'number') {
                value = Number(value);
            } else if (type === 'boolean') {
                value = Boolean(value);
            }

            target[lastPropName] = value;
        });

        this.dispatch('change');
        this.dispatch('track', { tab: 'fbx', prop, value: event.target.value });
    },
    /**
     * Update whether a data is editable in multi-select state
     */
    updateInvalid(element, prop) {
        const propNames = prop.split('.');
        let thisPropValue = this.meta.userData;

        const invalid = this.metaList.some((meta) => {
            let target = meta.userData;
            const lastIndex = propNames.length - 1;
            const lastPropName = propNames[lastIndex];

            if (propNames.length > 1) {
                for (let i = 0; i < lastIndex; i++) {
                    const propName = propNames[i];
                    if (target[propName] !== undefined) {
                        target = target[propName];
                    }

                    if (thisPropValue[propName] !== undefined) {
                        thisPropValue = thisPropValue[propName];
                    }
                }
            }

            return target[lastPropName] !== thisPropValue[lastPropName];
        });
        element.invalid = invalid;
    },
    /**
     * Update read-only status
     */
    updateReadonly(element) {
        if (this.asset.readonly) {
            element.setAttribute('disabled', true);
        } else {
            element.removeAttribute('disabled');
        }
    },
    getDefault(value, def, prop) {
        if (value === undefined) {
            return def;
        }

        if (prop) {
            value = value[prop];
        }

        if (value === undefined) {
            return def;
        }
        return value;
    },
};
