'use strict';

exports.template = `
<div class="container">
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.legacyFbxImporter.name" tooltip="i18n:ENGINE.assets.fbx.legacyFbxImporter.title"></ui-label>
        <ui-checkbox slot="content" class="legacyFbxImporter-checkbox"></ui-checkbox>
    </ui-prop>
    <div class="warn-words">
        <ui-label i18n value="ENGINE.assets.fbx.legacyFbxImporter.warn"></ui-label>
    </div>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.animationBakeRate.name" tooltip="i18n:ENGINE.assets.fbx.animationBakeRate.title"></ui-label>
        <ui-select slot="content" class="animationBakeRate-select">
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="60">60</option>
        </ui-select>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.promoteSingleRootNode.name" tooltip="i18n:ENGINE.assets.fbx.promoteSingleRootNode.title"></ui-label>
        <ui-checkbox slot="content" class="promoteSingleRootNode-checkbox"></ui-checkbox>
    </ui-prop>
</div>
`;

exports.style = `
ui-prop,
ui-section {
    margin: 4px 0;
}
.warn-words {
    margin-top: 20px;
    margin-bottom: 20px;
    line-height: 1.7;
    color: var(--color-warn-fill);
}
`;

exports.$ = {
    container: '.container',
    legacyFbxImporterCheckbox: '.legacyFbxImporter-checkbox',
    animationBakeRateSelect: '.animationBakeRate-select',
    promoteSingleRootNodeCheckbox: '.promoteSingleRootNode-checkbox',
};

/**
 * attribute corresponds to the edit element
 */
const Elements = {
    legacyFbxImporter: {
        ready() {
            const panel = this;

            panel.$.legacyFbxImporterCheckbox.addEventListener('change', panel.setProp.bind(panel, 'legacyFbxImporter'));
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

            panel.$.animationBakeRateSelect.addEventListener('change', panel.setProp.bind(panel, 'animationBakeRate'));
        },
        update() {
            const panel = this;

            panel.$.animationBakeRateSelect.value = panel.getDefault(panel.meta.userData.animationBakeRate, 60);

            panel.updateInvalid(panel.$.animationBakeRateSelect, 'animationBakeRate');
            panel.updateReadonly(panel.$.animationBakeRateSelect);
        },
    },
    promoteSingleRootNode: {
        ready() {
            const panel = this;

            panel.$.promoteSingleRootNodeCheckbox.addEventListener('change', panel.setProp.bind(panel, 'promoteSingleRootNode'));
        },
        update() {
            const panel = this;

            panel.$.promoteSingleRootNodeCheckbox.value = panel.getDefault(panel.meta.userData.promoteSingleRootNode, false);

            panel.updateInvalid(panel.$.promoteSingleRootNodeCheckbox, 'promoteSingleRootNode');
            panel.updateReadonly(panel.$.promoteSingleRootNodeCheckbox);
        },
    },
};

exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
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
    setProp(prop, event) {
        this.metaList.forEach((meta) => {
            meta.userData[prop] = event.target.value;
        });

        this.dispatch('change');
    },
    /**
     * Update whether a data is editable in multi-select state
     */
    updateInvalid(element, prop) {
        const invalid = this.metaList.some((meta) => {
            return meta.userData[prop] !== this.meta.userData[prop];
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
