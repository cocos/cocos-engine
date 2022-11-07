'use strict';

const { updateElementReadonly, updateElementInvalid } = require('../../utils/assets');

exports.template = /* html */`
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
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.allowMeshDataAccess.name" tooltip="i18n:ENGINE.assets.fbx.allowMeshDataAccess.title"></ui-label>
        <ui-checkbox slot="content" class="allowMeshDataAccess-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.promoteSingleRootNode.name" tooltip="i18n:ENGINE.assets.fbx.promoteSingleRootNode.title"></ui-label>
        <ui-checkbox slot="content" class="promoteSingleRootNode-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-section class="ins-object config" cache-expand="fbx-model-mesh-optimizer">
        <div slot="header" class="header">
            <ui-checkbox slot="content" class="meshOptimizer-checkbox"></ui-checkbox>
            <ui-label value="i18n:ENGINE.assets.fbx.meshOptimizer.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.title"></ui-label>
        </div>
        <div class="object mesh-optimizer">
            <ui-section expand cache-expand="fbx-model-mesh-optimizer-simplification">
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
            <ui-section expand cache-expand="fbx-model-mesh-optimizer-scene">
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
            <ui-section expand cache-expand="fbx-model-mesh-optimizer-miscellaneous">
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
                <ui-label value="i18n:ENGINE.assets.fbx.meshOptimizer.warn"></ui-label>
            </div>
        </div>
    </ui-section>
</div>
`;

exports.style = /* css */`
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
    allowMeshDataAccessCheckbox: '.allowMeshDataAccess-checkbox',
    promoteSingleRootNodeCheckbox: '.promoteSingleRootNode-checkbox',
    meshOptimizerCheckbox: '.meshOptimizer-checkbox',
    meshOptimizerSISlider: '.meshOptimizer-si-slider',
    meshOptimizerSACheckbox: '.meshOptimizer-sa-checkbox',
    meshOptimizerKNCheckbox: '.meshOptimizer-kn-checkbox',
    meshOptimizerKECheckbox: '.meshOptimizer-ke-checkbox',
    meshOptimizerNOQCheckbox: '.meshOptimizer-noq-checkbox',
    meshOptimizerVCheckbox: '.meshOptimizer-v-checkbox',
};

const Elements = {
    normals: {
        ready() {
            const panel = this;

            panel.$.normalsSelect.addEventListener('change', panel.setProp.bind(panel, 'normals'));
            panel.$.normalsSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
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

            updateElementInvalid.call(panel, panel.$.normalsSelect, 'normals');
            updateElementReadonly.call(panel, panel.$.normalsSelect);
        },
    },
    tangents: {
        ready() {
            const panel = this;

            panel.$.tangentsSelect.addEventListener('change', panel.setProp.bind(panel, 'tangents'));
            panel.$.tangentsSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
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

            updateElementInvalid.call(panel, panel.$.tangentsSelect, 'tangents');
            updateElementReadonly.call(panel, panel.$.tangentsSelect);
        },
    },
    morphNormals: {
        ready() {
            const panel = this;

            panel.$.morphNormalsSelect.addEventListener('change', panel.setProp.bind(panel, 'morphNormals'));
            panel.$.morphNormalsSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
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

            updateElementInvalid.call(panel, panel.$.morphNormalsSelect, 'morphNormals');
            updateElementReadonly.call(panel, panel.$.morphNormalsSelect);
        },
    },
    skipValidation: {
        ready() {
            const panel = this;

            panel.$.skipValidationCheckbox.addEventListener('change', panel.setProp.bind(panel, 'skipValidation'));
            panel.$.skipValidationCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.skipValidationCheckbox.value = panel.getDefault(panel.meta.userData.skipValidation, true);

            updateElementInvalid.call(panel, panel.$.skipValidationCheckbox, 'skipValidation');
            updateElementReadonly.call(panel, panel.$.skipValidationCheckbox);
        },
    },
    disableMeshSplit: {
        ready() {
            const panel = this;

            panel.$.disableMeshSplitCheckbox.addEventListener('change', panel.setProp.bind(panel, 'disableMeshSplit'));
            panel.$.disableMeshSplitCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.disableMeshSplitCheckbox.value = panel.getDefault(panel.meta.userData.disableMeshSplit, true);

            updateElementInvalid.call(panel, panel.$.disableMeshSplitCheckbox, 'disableMeshSplit');
            updateElementReadonly.call(panel, panel.$.disableMeshSplitCheckbox);
        },
    },
    allowMeshDataAccess: {
        ready() {
            const panel = this;

            panel.$.allowMeshDataAccessCheckbox.addEventListener('change', panel.setProp.bind(panel, 'allowMeshDataAccess'));
            panel.$.allowMeshDataAccessCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.allowMeshDataAccessCheckbox.value = panel.getDefault(panel.meta.userData.allowMeshDataAccess, true);

            updateElementInvalid.call(panel, panel.$.allowMeshDataAccessCheckbox, 'allowMeshDataAccess');
            updateElementReadonly.call(panel, panel.$.allowMeshDataAccessCheckbox);
        },
    },
    // move this from ./fbx.js in v3.6.0
    promoteSingleRootNode: {
        ready() {
            const panel = this;

            panel.$.promoteSingleRootNodeCheckbox.addEventListener('change', panel.setProp.bind(panel, 'promoteSingleRootNode'));
            panel.$.promoteSingleRootNodeCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let defaultValue = false;
            if (panel.meta.userData) {
                defaultValue = panel.getDefault(panel.meta.userData.promoteSingleRootNode, defaultValue);
            }

            panel.$.promoteSingleRootNodeCheckbox.value = defaultValue;

            updateElementInvalid.call(panel, panel.$.promoteSingleRootNodeCheckbox, 'promoteSingleRootNode');
            updateElementReadonly.call(panel, panel.$.promoteSingleRootNodeCheckbox);
        },
    },
    meshOptimizer: {
        ready() {
            const panel = this;

            panel.$.meshOptimizerCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer'));
            panel.$.meshOptimizerCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerCheckbox.value = panel.getDefault(panel.meta.userData.meshOptimizer, false);

            updateElementInvalid.call(panel, panel.$.meshOptimizerCheckbox, 'meshOptimizer');
            updateElementReadonly.call(panel, panel.$.meshOptimizerCheckbox);
        },
    },
    si: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerSISlider.addEventListener('change', panel.setMeshOptimizerOptions.bind(panel, 'si'));
            panel.$.meshOptimizerSISlider.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerSISlider.value = panel.getDefault(panel.meta.userData.meshOptimizerOptions, 1, 'si');

            panel.updateMeshOptimizerInvalid(panel.$.meshOptimizerSISlider, 'si');
            updateElementReadonly.call(panel, panel.$.meshOptimizerSISlider);
        },
    },
    sa: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerSACheckbox.addEventListener('change', panel.setMeshOptimizerOptions.bind(panel, 'sa'));
            panel.$.meshOptimizerSACheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerSACheckbox.value = panel.getDefault(panel.meta.userData.meshOptimizerOptions, false, 'sa');

            panel.updateMeshOptimizerInvalid(panel.$.meshOptimizerSACheckbox, 'sa');
            updateElementReadonly.call(panel, panel.$.meshOptimizerSACheckbox);
        },
    },
    kn: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerKNCheckbox.addEventListener('change', panel.setMeshOptimizerOptions.bind(panel, 'kn'));
            panel.$.meshOptimizerKNCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerKNCheckbox.value = panel.getDefault(panel.meta.userData.meshOptimizerOptions, false, 'kn');

            panel.updateMeshOptimizerInvalid(panel.$.meshOptimizerKNCheckbox, 'kn');
            updateElementReadonly.call(panel, panel.$.meshOptimizerKNCheckbox);
        },
    },
    ke: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerKECheckbox.addEventListener('change', panel.setMeshOptimizerOptions.bind(panel, 'ke'));
            panel.$.meshOptimizerKECheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerKECheckbox.value = panel.getDefault(panel.meta.userData.meshOptimizerOptions, false, 'ke');

            panel.updateMeshOptimizerInvalid(panel.$.meshOptimizerKECheckbox, 'ke');
            updateElementReadonly.call(panel, panel.$.meshOptimizerKECheckbox);
        },
    },
    noq: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerNOQCheckbox.addEventListener('change', panel.setMeshOptimizerOptions.bind(panel, 'noq'));
            panel.$.meshOptimizerNOQCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerNOQCheckbox.value = panel.getDefault(panel.meta.userData.meshOptimizerOptions, true, 'noq');

            panel.updateMeshOptimizerInvalid(panel.$.meshOptimizerNOQCheckbox, 'noq');
            updateElementReadonly.call(panel, panel.$.meshOptimizerNOQCheckbox);
        },
    },
    v: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerVCheckbox.addEventListener('change', panel.setMeshOptimizerOptions.bind(panel, 'v'));
            panel.$.meshOptimizerVCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerVCheckbox.value = panel.getDefault(panel.meta.userData.meshOptimizerOptions, true, 'v');

            panel.updateMeshOptimizerInvalid(panel.$.meshOptimizerVCheckbox, 'v');
            updateElementReadonly.call(panel, panel.$.meshOptimizerVCheckbox);
        },
    },
};

exports.methods = {
    t(key) {
        return Editor.I18n.t(`ENGINE.assets.fbx.${key}`);
    },
    setProp(prop, event) {
        this.metaList.forEach((meta) => {
            let value = event.target.value;
            switch (prop) {
                case 'normals': case 'tangents': case 'morphNormals':
                    value = Number(value);
                    break;
                case 'promoteSingleRootNode':
                    value = Boolean(value);
                    break;
            }

            meta.userData[prop] = value;
        });
        this.dispatch('change');
        this.dispatch('track', { tab: 'model', prop, value: event.target.value });
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

exports.ready = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
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

exports.close = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.close) {
            element.close.call(this);
        }
    }
};
