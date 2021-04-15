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
};

/**
 * 属性对应的编辑元素
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
};

exports.update = function (assetList, metaList) {
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

exports.ready = function () {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

exports.close = function () {
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
     * 更新多选状态下某个数据是否可编辑
     */
     updateInvalid(element, prop) {
        const invalid = this.metaList.some((meta) => {
            return meta.userData[prop] !== this.meta.userData[prop];
        });
        element.invalid = invalid;
    },
    /**
     * 更新只读状态
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
