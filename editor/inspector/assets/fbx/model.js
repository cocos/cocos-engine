'use strict';

exports.template = `
<div class="container">
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.GlTFUserData.normals.name" tooltip="i18n:ENGINE.assets.fbx.GlTFUserData.normals.title"></ui-label>
        <ui-select slot="content" class="normals-select"></ui-select>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.GlTFUserData.tangents.name" tooltip="i18n:ENGINE.assets.fbx.GlTFUserData.tangents.title"></ui-label>
        <ui-select slot="content" class="tangents-select"></ui-select>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.GlTFUserData.morphNormals.name" tooltip="i18n:ENGINE.assets.fbx.GlTFUserData.morphNormals.title"></ui-label>
        <ui-select slot="content" class="morphNormals-select"></ui-select>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.GlTFUserData.skipValidation.name" tooltip="i18n:ENGINE.assets.fbx.GlTFUserData.skipValidation.title"></ui-label>
        <ui-checkbox slot="content" class="skipValidation-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.disableMeshSplit.name" tooltip="i18n:ENGINE.assets.fbx.disableMeshSplit.title"></ui-label>
        <ui-checkbox slot="content" class="disableMeshSplit-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-section class="ins-object config" expand>
        <div slot="header" class="header">
            <ui-checkbox slot="content" class="meshOptimizer-checkbox"></ui-checkbox>
            <ui-label value="i18n:ENGINE.assets.fbx.meshOptimizer.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.title"></ui-label>
        </div>
        <div class="object mesh-optimizer">
            <ui-section expand>
                <ui-label slot="header" value="i18n:ENGINE.assets.fbx.meshOptimizer.simplification.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.simplification.title"></ui-label>
                <ui-prop>
                    <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.simplification.si.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.simplification.si.title"></ui-label>
                    <ui-slider slot="content" class="meshOptimizer-si-slider" min="0" max="1" step="0.01"></ui-slider>
                </ui-prop>
                <ui-prop>
                    <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.simplification.sa.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.simplification.sa.title"></ui-label>
                    <ui-checkbox slot="content" class="meshOptimizer-sa-checkbox"></ui-checkbox>
                </ui-prop>
            </ui-section>
            <ui-section expand>
                <ui-label slot="header" value="i18n:ENGINE.assets.fbx.meshOptimizer.scene.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.scene.title"></ui-label>
                <ui-prop>
                    <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.scene.kn.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.scene.kn.title"></ui-label>
                    <ui-checkbox slot="content" class="meshOptimizer-kn-checkbox"></ui-checkbox>
                </ui-prop>
                <ui-prop>
                    <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.scene.ke.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.scene.ke.title"></ui-label>
                    <ui-checkbox slot="content" class="meshOptimizer-ke-checkbox"></ui-checkbox>
                </ui-prop>
            </ui-section>
            <ui-section expand>
                <ui-label slot="header" value="i18n:ENGINE.assets.fbx.meshOptimizer.miscellaneous.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.miscellaneous.title"></ui-label>
                <ui-prop>
                    <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.miscellaneous.noq.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.miscellaneous.noq.title"></ui-label>
                    <ui-checkbox slot="content" class="meshOptimizer-noq-checkbox"></ui-checkbox>
                </ui-prop>
                <ui-prop>
                    <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.miscellaneous.v.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.miscellaneous.v.title"></ui-label>
                    <ui-checkbox slot="content" class="meshOptimizer-v-checkbox"></ui-checkbox>
                </ui-prop>
            </ui-section>
            <div class="warn-words">
                <ui-label i18n value="inspector.asset.fbx.meshOptimizer.warn"></ui-label>
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
    margin-top: 20px;
    margin-bottom: 20px;
    line-height: 1.7;
    color: var(--color-warn-fill);
}
.mesh-optimizer ui-section {
    margin-top: 10px;
}
.mesh-optimizer ui-section > ui-prop {
    padding-left: 10px;
}
`;

exports.$ = {
    container: '.container',
    normalsSelect: '.normals-select',
    tangentsSelect: '.tangents-select',
    morphNormalsSelect: '.morphNormals-select',
    skipValidationCheckbox: '.skipValidation-checkbox',
    disableMeshSplitCheckbox: '.disableMeshSplit-checkbox',
    meshOptimizerCheckbox: '.meshOptimizer-checkbox',
    meshOptimizerSISlider: '.meshOptimizer-si-slider',
    meshOptimizerSACheckbox: '.meshOptimizer-sa-checkbox',
    meshOptimizerKNCheckbox: '.meshOptimizer-kn-checkbox',
    meshOptimizerKECheckbox: '.meshOptimizer-ke-checkbox',
    meshOptimizerNOQCheckbox: '.meshOptimizer-noq-checkbox',
    meshOptimizerVCheckbox: '.meshOptimizer-v-checkbox',
};

/**
 * attribute corresponds to the edit element
 */
const Elements = {
    normals: {
        ready() {
            const panel = this;

            panel.$.normalsSelect.addEventListener('change', panel.setProp.bind(panel, 'normals'));
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['optional', 'exclude', 'require', 'recalculate'];
            types.forEach((type, index) => {
                optionsHtml += `<option value="${index}"
                    title="${panel.t(`GlTFUserData.normals.${type}.title`)}" 
                >${panel.t(`GlTFUserData.normals.${type}.name`)}</option>`;
            });
            panel.$.normalsSelect.innerHTML = optionsHtml;

            panel.$.normalsSelect.value = panel.getDefault(panel.meta.userData.normals, 2);

            panel.updateInvalid(panel.$.normalsSelect, 'normals');
            panel.updateReadonly(panel.$.normalsSelect);
        },
    },
    tangents: {
        ready() {
            const panel = this;

            panel.$.tangentsSelect.addEventListener('change', panel.setProp.bind(panel, 'tangents'));
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['optional', 'exclude', 'require', 'recalculate'];
            types.forEach((type, index) => {
                optionsHtml += `<option value="${index}"
                title="${panel.t(`GlTFUserData.tangents.${type}.title`)}"
                >${panel.t(`GlTFUserData.tangents.${type}.name`)}</option>`;
            });
            panel.$.tangentsSelect.innerHTML = optionsHtml;

            panel.$.tangentsSelect.value = panel.getDefault(panel.meta.userData.tangents, 2);

            panel.updateInvalid(panel.$.tangentsSelect, 'tangents');
            panel.updateReadonly(panel.$.tangentsSelect);
        },
    },
    morphNormals: {
        ready() {
            const panel = this;

            panel.$.morphNormalsSelect.addEventListener('change', panel.setProp.bind(panel, 'morphNormals'));
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['optional', 'exclude'];
            types.forEach((type, index) => {
                optionsHtml += `<option value="${index}"
                    title="${panel.t(`GlTFUserData.morphNormals.${type}.title`)}" 
                >${panel.t(`GlTFUserData.morphNormals.${type}.name`)}</option>`;
            });
            panel.$.morphNormalsSelect.innerHTML = optionsHtml;

            panel.$.morphNormalsSelect.value = panel.getDefault(panel.meta.userData.morphNormals, 1);

            panel.updateInvalid(panel.$.morphNormalsSelect, 'morphNormals');
            panel.updateReadonly(panel.$.morphNormalsSelect);
        },
    },
    skipValidation: {
        ready() {
            const panel = this;

            panel.$.skipValidationCheckbox.addEventListener('change', panel.setProp.bind(panel, 'skipValidation'));
        },
        update() {
            const panel = this;

            panel.$.skipValidationCheckbox.value = panel.getDefault(panel.meta.userData.skipValidation, true);

            panel.updateInvalid(panel.$.skipValidationCheckbox, 'skipValidation');
            panel.updateReadonly(panel.$.skipValidationCheckbox);
        },
    },
    disableMeshSplit: {
        ready() {
            const panel = this;

            panel.$.disableMeshSplitCheckbox.addEventListener('change', panel.setProp.bind(panel, 'disableMeshSplit'));
        },
        update() {
            const panel = this;

            panel.$.disableMeshSplitCheckbox.value = panel.getDefault(panel.meta.userData.disableMeshSplit, false);

            panel.updateInvalid(panel.$.disableMeshSplitCheckbox, 'disableMeshSplit');
            panel.updateReadonly(panel.$.disableMeshSplitCheckbox);
        },
    },
    meshOptimizer: {
        ready() {
            const panel = this;

            panel.$.meshOptimizerCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer'));
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerCheckbox.value = panel.getDefault(panel.meta.userData.meshOptimizer, false);

            panel.updateInvalid(panel.$.meshOptimizerCheckbox, 'meshOptimizer');
            panel.updateReadonly(panel.$.meshOptimizerCheckbox);
        },
    },
    si: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerSISlider.addEventListener('change', panel.setMeshOptimizerOptions.bind(panel, 'si'));
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerSISlider.value = panel.getDefault(panel.meta.userData.meshOptimizerOptions, 1, 'si');

            panel.updateMeshOptimizerInvalid(panel.$.meshOptimizerSISlider, 'si');
            panel.updateReadonly(panel.$.meshOptimizerSISlider);
        },
    },
    sa: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerSACheckbox.addEventListener('change', panel.setMeshOptimizerOptions.bind(panel, 'sa'));
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerSACheckbox.value = panel.getDefault(panel.meta.userData.meshOptimizerOptions, false, 'sa');

            panel.updateMeshOptimizerInvalid(panel.$.meshOptimizerSACheckbox, 'sa');
            panel.updateReadonly(panel.$.meshOptimizerSACheckbox);
        },
    },
    kn: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerKNCheckbox.addEventListener('change', panel.setMeshOptimizerOptions.bind(panel, 'kn'));
            panel.$.meshOptimizerKNCheckbox.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.meshOptimizerOptions.kn = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerKNCheckbox.value = panel.getDefault(panel.meta.userData.meshOptimizerOptions, false, 'kn');

            panel.updateMeshOptimizerInvalid(panel.$.meshOptimizerKNCheckbox, 'kn');
            panel.updateReadonly(panel.$.meshOptimizerKNCheckbox);
        },
    },
    ke: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerKECheckbox.addEventListener('change', panel.setMeshOptimizerOptions.bind(panel, 'ke'));
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerKECheckbox.value = panel.getDefault(panel.meta.userData.meshOptimizerOptions, false, 'ke');

            panel.updateMeshOptimizerInvalid(panel.$.meshOptimizerKECheckbox, 'ke');
            panel.updateReadonly(panel.$.meshOptimizerKECheckbox);
        },
    },
    noq: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerNOQCheckbox.addEventListener('change', panel.setMeshOptimizerOptions.bind(panel, 'noq'));
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerNOQCheckbox.value = panel.getDefault(panel.meta.userData.meshOptimizerOptions, true, 'noq');

            panel.updateMeshOptimizerInvalid(panel.$.meshOptimizerNOQCheckbox, 'noq');
            panel.updateReadonly(panel.$.meshOptimizerNOQCheckbox);
        },
    },
    v: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerVCheckbox.addEventListener('change', panel.setMeshOptimizerOptions.bind(panel, 'v'));
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerVCheckbox.value = panel.getDefault(panel.meta.userData.meshOptimizerOptions, true, 'v');

            panel.updateMeshOptimizerInvalid(panel.$.meshOptimizerVCheckbox, 'v');
            panel.updateReadonly(panel.$.meshOptimizerVCheckbox);
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
            let value = event.target.value;
            switch (prop) {
                case 'normals': case 'tangents': case 'morphNormals':
                    value = Number(value);
                    break;
            }

            meta.userData[prop] = value;
        });

        this.dispatch('change');
    },
    setMeshOptimizerOptions(prop, event) {
        this.metaList.forEach((meta) => {
            if (!meta.userData.meshOptimizerOptions) {
                meta.userData.meshOptimizerOptions = {};
            }

            meta.userData.meshOptimizerOptions[prop] = event.target.value;
        });

        this.dispatch('change');
    },
    updateMeshOptimizerInvalid(element, prop) {
        const invalid = this.metaList.some((meta) => {
            if (meta.userData.meshOptimizerOptions === undefined && this.meta.userData.meshOptimizerOptions === undefined) {
                return false;
            }
            if (meta.userData.meshOptimizerOptions && this.meta.userData.meshOptimizerOptions) {
                return meta.userData.meshOptimizerOptions[prop] !== this.meta.userData.meshOptimizerOptions[prop];
            }
            return true;
        });
        element.invalid = invalid;
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
    t(key) {
        return Editor.I18n.t(`ENGINE.assets.fbx.${key}`);
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
