'use strict';

const { updateElementReadonly, updateElementInvalid, getPropValue, setPropValue } = require('../../utils/assets');

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
    <ui-prop hidden>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.generateLightmapUVNode.name" tooltip="i18n:ENGINE.assets.fbx.generateLightmapUVNode.title"></ui-label>
        <ui-checkbox slot="content" class="generateLightmapUVNode-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-section class="mesh-optimizer config" cache-expand="fbx-model-mesh-optimizer">
        <div slot="header" class="header">
            <ui-checkbox slot="content" class="meshOptimizer-checkbox"></ui-checkbox>
            <ui-label value="i18n:ENGINE.assets.fbx.meshOptimizer.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.title"></ui-label>
        </div>
        <div>
            <ui-prop class="algorithm">
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.algorithm.name"></ui-label>
                <ui-select slot="content" class="meshOptimizer-algorithm-select"></ui-select>
            </ui-prop>
        </div>
        <div class="gltfpack-options">
            <ui-prop>
                <div class="warn-words" slot="content">
                    <ui-label value="i18n:ENGINE.assets.fbx.meshOptimizer.gltfpack.warn"></ui-label>
                </div>
            </ui-prop>
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
        <div class="simplify-options">
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.targetRatio.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.targetRatio.title"></ui-label>
                <ui-slider slot="content" class="meshOptimizer-targetRatio-slider" min="0" max="1" step="0.01"></ui-slider>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.preserveSurfaceCurvature.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.preserveSurfaceCurvature.title"></ui-label>
                <ui-checkbox slot="content" class="meshOptimizer-preserveSurfaceCurvature-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.preserveBorderEdges.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.preserveBorderEdges.title"></ui-label>
                <ui-checkbox slot="content" class="meshOptimizer-preserveBorderEdges-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.preserveUVSeamEdges.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.preserveUVSeamEdges.title"></ui-label>
                <ui-checkbox slot="content" class="meshOptimizer-preserveUVSeamEdges-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.preserveUVFoldoverEdges.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.preserveUVFoldoverEdges.title"></ui-label>
                <ui-checkbox slot="content" class="meshOptimizer-preserveUVFoldoverEdges-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.enableSmartLink.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.enableSmartLink.title"></ui-label>
                <ui-checkbox slot="content" class="meshOptimizer-enableSmartLink-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.agressiveness.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.agressiveness.title"></ui-label>
                <ui-slider slot="content" class="meshOptimizer-agressiveness-slider" min="5" max="20" step="1"></ui-slider>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.maxIterationCount.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.maxIterationCount.title"></ui-label>
                <ui-slider slot="content" class="meshOptimizer-maxIterationCount-slider" min="100" max="200" step="1"></ui-slider>
            </ui-prop>
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
.mesh-optimizer .algorithm {
    margin-top: 10px;
    padding-left: 20px;
}
.mesh-optimizer .simplify-options > ui-prop {
    padding-left: 20px;
}
.mesh-optimizer ui-section > ui-prop {
    padding-left: 10px;
}
.mesh-optimizer .warn-words {
    padding-left: 20px;
}
.mesh-optimizer .gltfpack-options .warn-words {
    padding-left: 10px;
    margin-top: 0;
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
    generateLightmapUVNodeCheckbox: '.generateLightmapUVNode-checkbox',
    meshOptimizerCheckbox: '.meshOptimizer-checkbox',
    meshOptimizerAlgorithmSelect: '.meshOptimizer-algorithm-select',
    // gltfpackOptions 
    meshOptimizerGltfpackOptions: '.gltfpack-options',
    meshOptimizerSISlider: '.meshOptimizer-si-slider',
    meshOptimizerSACheckbox: '.meshOptimizer-sa-checkbox',
    meshOptimizerKNCheckbox: '.meshOptimizer-kn-checkbox',
    meshOptimizerKECheckbox: '.meshOptimizer-ke-checkbox',
    meshOptimizerNOQCheckbox: '.meshOptimizer-noq-checkbox',
    meshOptimizerVCheckbox: '.meshOptimizer-v-checkbox',
    // simplifyOptions
    meshOptimizerSimplifyOptions: '.simplify-options',
    meshOptimizerTargetRatioSlider: '.meshOptimizer-targetRatio-slider',
    meshOptimizerPreserveSurfaceCurvatureCheckbox: '.meshOptimizer-preserveSurfaceCurvature-checkbox',
    meshOptimizerPreserveBorderEdgesCheckbox: '.meshOptimizer-preserveBorderEdges-checkbox',
    meshOptimizerPreserveUVSeamEdgesCheckbox: '.meshOptimizer-preserveUVSeamEdges-checkbox',
    meshOptimizerPreserveUVFoldoverEdgesCheckbox: '.meshOptimizer-preserveUVFoldoverEdges-checkbox',
    meshOptimizerEnableSmartLinkCheckbox: '.meshOptimizer-enableSmartLink-checkbox',
    meshOptimizerAgressivenessSlider: '.meshOptimizer-agressiveness-slider',
    meshOptimizerMaxIterationCountSlider: '.meshOptimizer-maxIterationCount-slider',
};

const Elements = {
    normals: {
        ready() {
            const panel = this;

            panel.$.normalsSelect.addEventListener('change', panel.setProp.bind(panel, 'normals', 'number'));
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

            panel.$.normalsSelect.value = getPropValue.call(panel, panel.meta.userData.normals, 2);

            updateElementInvalid.call(panel, panel.$.normalsSelect, 'normals');
            updateElementReadonly.call(panel, panel.$.normalsSelect);
        },
    },
    tangents: {
        ready() {
            const panel = this;

            panel.$.tangentsSelect.addEventListener('change', panel.setProp.bind(panel, 'tangents', 'number'));
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

            panel.$.tangentsSelect.value = getPropValue.call(panel, panel.meta.userData.tangents, 2);

            updateElementInvalid.call(panel, panel.$.tangentsSelect, 'tangents');
            updateElementReadonly.call(panel, panel.$.tangentsSelect);
        },
    },
    morphNormals: {
        ready() {
            const panel = this;

            panel.$.morphNormalsSelect.addEventListener('change', panel.setProp.bind(panel, 'morphNormals', 'number'));
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

            panel.$.morphNormalsSelect.value = getPropValue.call(panel, panel.meta.userData.morphNormals, 1);

            updateElementInvalid.call(panel, panel.$.morphNormalsSelect, 'morphNormals');
            updateElementReadonly.call(panel, panel.$.morphNormalsSelect);
        },
    },
    skipValidation: {
        ready() {
            const panel = this;

            panel.$.skipValidationCheckbox.addEventListener('change', panel.setProp.bind(panel, 'skipValidation', 'boolean'));
            panel.$.skipValidationCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.skipValidationCheckbox.value = getPropValue.call(panel, panel.meta.userData.skipValidation, true);

            updateElementInvalid.call(panel, panel.$.skipValidationCheckbox, 'skipValidation');
            updateElementReadonly.call(panel, panel.$.skipValidationCheckbox);
        },
    },
    disableMeshSplit: {
        ready() {
            const panel = this;

            panel.$.disableMeshSplitCheckbox.addEventListener('change', panel.setProp.bind(panel, 'disableMeshSplit', 'boolean'));
            panel.$.disableMeshSplitCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.disableMeshSplitCheckbox.value = getPropValue.call(panel, panel.meta.userData.disableMeshSplit, true);

            updateElementInvalid.call(panel, panel.$.disableMeshSplitCheckbox, 'disableMeshSplit');
            updateElementReadonly.call(panel, panel.$.disableMeshSplitCheckbox);
        },
    },
    allowMeshDataAccess: {
        ready() {
            const panel = this;

            panel.$.allowMeshDataAccessCheckbox.addEventListener('change', panel.setProp.bind(panel, 'allowMeshDataAccess', 'boolean'));
            panel.$.allowMeshDataAccessCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.allowMeshDataAccessCheckbox.value = getPropValue.call(panel, panel.meta.userData.allowMeshDataAccess, true);

            updateElementInvalid.call(panel, panel.$.allowMeshDataAccessCheckbox, 'allowMeshDataAccess');
            updateElementReadonly.call(panel, panel.$.allowMeshDataAccessCheckbox);
        },
    },
    // move this from ./fbx.js in v3.6.0
    promoteSingleRootNode: {
        ready() {
            const panel = this;

            panel.$.promoteSingleRootNodeCheckbox.addEventListener('change', panel.setProp.bind(panel, 'promoteSingleRootNode', 'boolean'));
            panel.$.promoteSingleRootNodeCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let defaultValue = false;
            if (panel.meta.userData) {
                defaultValue = getPropValue.call(panel, panel.meta.userData.promoteSingleRootNode, defaultValue);
            }

            panel.$.promoteSingleRootNodeCheckbox.value = defaultValue;

            updateElementInvalid.call(panel, panel.$.promoteSingleRootNodeCheckbox, 'promoteSingleRootNode');
            updateElementReadonly.call(panel, panel.$.promoteSingleRootNodeCheckbox);
        },
    },
    // move this from ./fbx.js in v3.6.0
    generateLightmapUVNode: {
        ready() {
            const panel = this;

            panel.$.generateLightmapUVNodeCheckbox.addEventListener('change', panel.setProp.bind(panel, 'generateLightmapUVNode', 'boolean'));
            panel.$.generateLightmapUVNodeCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let defaultValue = false;
            if (panel.meta.userData) {
                defaultValue = getPropValue.call(panel, panel.meta.userData.generateLightmapUVNode, defaultValue);
            }

            panel.$.generateLightmapUVNodeCheckbox.value = defaultValue;

            updateElementInvalid.call(panel, panel.$.generateLightmapUVNodeCheckbox, 'generateLightmapUVNode');
            updateElementReadonly.call(panel, panel.$.generateLightmapUVNodeCheckbox);
        },
    },

    meshOptimizer: {
        ready() {
            const panel = this;

            panel.$.meshOptimizerCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.enable', 'boolean'));
            panel.$.meshOptimizerCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshOptimizer, false, 'enable');

            updateElementInvalid.call(panel, panel.$.meshOptimizerCheckbox, 'meshOptimizer.enable');
            updateElementReadonly.call(panel, panel.$.meshOptimizerCheckbox);
        },
    },
    meshOptimizerAlgorithm: {
        ready() {
            const panel = this;

            panel.$.meshOptimizerAlgorithmSelect.addEventListener('change', (event) => {
                panel.setProp.call(panel, 'meshOptimizer.algorithm', 'string', event);
                Elements.meshOptimizerAlgorithm.update.call(panel);
            });
            panel.$.meshOptimizerAlgorithmSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['simplify', 'gltfpack'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${panel.t(`meshOptimizer.algorithm.${type}`)}</option>`;
            });
            panel.$.meshOptimizerAlgorithmSelect.innerHTML = optionsHtml;

            const defaultValue = 'simplify';
            panel.$.meshOptimizerAlgorithmSelect.value = getPropValue.call(panel, panel.meta.userData.meshOptimizer, defaultValue, 'algorithm');

            updateElementInvalid.call(panel, panel.$.meshOptimizerAlgorithmSelect, 'meshOptimizer.algorithm');
            updateElementReadonly.call(panel, panel.$.meshOptimizerAlgorithmSelect);

            if (panel.$.meshOptimizerAlgorithmSelect.value === defaultValue) {
                panel.$.meshOptimizerGltfpackOptions.setAttribute('hidden', '');
                panel.$.meshOptimizerSimplifyOptions.removeAttribute('hidden');
            } else {
                panel.$.meshOptimizerGltfpackOptions.removeAttribute('hidden');
                panel.$.meshOptimizerSimplifyOptions.setAttribute('hidden', '');
            }

            if (panel.$.meshOptimizerAlgorithmSelect.hasAttribute('invalid')) {
                panel.$.meshOptimizerGltfpackOptions.setAttribute('hidden', '');
                panel.$.meshOptimizerSimplifyOptions.setAttribute('hidden', '');
            }
        },
    },
    // gltfpackOptions start
    si: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerSISlider.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.gltfpackOptions.si', 'number'));
            panel.$.meshOptimizerSISlider.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerSISlider.value = getPropValue.call(panel, panel.meta.userData, 1, 'meshOptimizer.gltfpackOptions.si');

            updateElementInvalid.call(panel, panel.$.meshOptimizerSISlider, 'meshOptimizer.gltfpackOptions.si');
            updateElementReadonly.call(panel, panel.$.meshOptimizerSISlider, true);
        },
    },
    sa: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerSACheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.gltfpackOptions.sa', 'boolean'));
            panel.$.meshOptimizerSACheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerSACheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshOptimizer.gltfpackOptions.sa');

            updateElementInvalid.call(panel, panel.$.meshOptimizerSACheckbox, 'meshOptimizer.gltfpackOptions.sa');
            updateElementReadonly.call(panel, panel.$.meshOptimizerSACheckbox, true);
        },
    },
    kn: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerKNCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.gltfpackOptions.kn', 'boolean'));
            panel.$.meshOptimizerKNCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerKNCheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshOptimizer.gltfpackOptions.kn');

            updateElementInvalid.call(panel, panel.$.meshOptimizerKNCheckbox, 'meshOptimizer.gltfpackOptions.kn');
            updateElementReadonly.call(panel, panel.$.meshOptimizerKNCheckbox, true);
        },
    },
    ke: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerKECheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.gltfpackOptions.ke', 'boolean'));
            panel.$.meshOptimizerKECheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerKECheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshOptimizer.gltfpackOptions.ke');

            updateElementInvalid.call(panel, panel.$.meshOptimizerKECheckbox, 'meshOptimizer.gltfpackOptions.ke');
            updateElementReadonly.call(panel, panel.$.meshOptimizerKECheckbox, true);
        },
    },
    noq: {
        ready() {
            const panel = this;

            panel.$.meshOptimizerNOQCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.gltfpackOptions.noq', 'boolean'));
            panel.$.meshOptimizerNOQCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerNOQCheckbox.value = getPropValue.call(panel, panel.meta.userData, true, 'meshOptimizer.gltfpackOptions.noq');

            updateElementInvalid.call(panel, panel.$.meshOptimizerNOQCheckbox, 'meshOptimizer.gltfpackOptions.noq');
            updateElementReadonly.call(panel, panel.$.meshOptimizerNOQCheckbox, true);
        },
    },
    v: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerVCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.gltfpackOptions.v', 'boolean'));
            panel.$.meshOptimizerVCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerVCheckbox.value = getPropValue.call(panel, panel.meta.userData, true, 'meshOptimizer.gltfpackOptions.v');

            updateElementInvalid.call(panel, panel.$.meshOptimizerVCheckbox, 'meshOptimizer.gltfpackOptions.v');
            updateElementReadonly.call(panel, panel.$.meshOptimizerVCheckbox, true);
        },
    },
    // gltfpackOptions end
    // simplifyOptions start
    targetRatio: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerTargetRatioSlider.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.simplifyOptions.targetRatio', 'number'));
            panel.$.meshOptimizerTargetRatioSlider.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerTargetRatioSlider.value = getPropValue.call(panel, panel.meta.userData, 1, 'meshOptimizer.simplifyOptions.targetRatio');

            updateElementInvalid.call(panel, panel.$.meshOptimizerTargetRatioSlider, 'meshOptimizer.simplifyOptions.targetRatio');
            updateElementReadonly.call(panel, panel.$.meshOptimizerTargetRatioSlider);
        },
    },
    enableSmartLink: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerEnableSmartLinkCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.simplifyOptions.enableSmartLink', 'boolean'));
            panel.$.meshOptimizerEnableSmartLinkCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerEnableSmartLinkCheckbox.value = getPropValue.call(panel, panel.meta.userData, true, 'meshOptimizer.simplifyOptions.enableSmartLink');

            updateElementInvalid.call(panel, panel.$.meshOptimizerEnableSmartLinkCheckbox, 'meshOptimizer.simplifyOptions.enableSmartLink');
            updateElementReadonly.call(panel, panel.$.meshOptimizerEnableSmartLinkCheckbox);
        },
    },
    preserveSurfaceCurvature: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerPreserveSurfaceCurvatureCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.simplifyOptions.preserveSurfaceCurvature', 'boolean'));
            panel.$.meshOptimizerPreserveSurfaceCurvatureCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerPreserveSurfaceCurvatureCheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshOptimizer.simplifyOptions.preserveSurfaceCurvature');

            updateElementInvalid.call(panel, panel.$.meshOptimizerPreserveSurfaceCurvatureCheckbox, 'meshOptimizer.simplifyOptions.preserveSurfaceCurvature');
            updateElementReadonly.call(panel, panel.$.meshOptimizerPreserveSurfaceCurvatureCheckbox);
        },
    },
    preserveBorderEdges: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerPreserveBorderEdgesCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.simplifyOptions.preserveBorderEdges', 'boolean'));
            panel.$.meshOptimizerPreserveBorderEdgesCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerPreserveBorderEdgesCheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshOptimizer.simplifyOptions.preserveBorderEdges');

            updateElementInvalid.call(panel, panel.$.meshOptimizerPreserveBorderEdgesCheckbox, 'meshOptimizer.simplifyOptions.preserveBorderEdges');
            updateElementReadonly.call(panel, panel.$.meshOptimizerPreserveBorderEdgesCheckbox);
        },
    },
    preserveUVSeamEdges: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerPreserveUVSeamEdgesCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.simplifyOptions.preserveUVSeamEdges', 'boolean'));
            panel.$.meshOptimizerPreserveUVSeamEdgesCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerPreserveUVSeamEdgesCheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshOptimizer.simplifyOptions.preserveUVSeamEdges');

            updateElementInvalid.call(panel, panel.$.meshOptimizerPreserveUVSeamEdgesCheckbox, 'meshOptimizer.simplifyOptions.preserveUVSeamEdges');
            updateElementReadonly.call(panel, panel.$.meshOptimizerPreserveUVSeamEdgesCheckbox);
        },
    },
    preserveUVFoldoverEdges: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerPreserveUVFoldoverEdgesCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.simplifyOptions.preserveUVFoldoverEdges', 'boolean'));
            panel.$.meshOptimizerPreserveUVFoldoverEdgesCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerPreserveUVFoldoverEdgesCheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshOptimizer.simplifyOptions.preserveUVFoldoverEdges');

            updateElementInvalid.call(panel, panel.$.meshOptimizerPreserveUVFoldoverEdgesCheckbox, 'meshOptimizer.simplifyOptions.preserveUVFoldoverEdges');
            updateElementReadonly.call(panel, panel.$.meshOptimizerPreserveUVFoldoverEdgesCheckbox);
        },
    },
    agressiveness: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerAgressivenessSlider.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.simplifyOptions.agressiveness', 'number'));
            panel.$.meshOptimizerAgressivenessSlider.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerAgressivenessSlider.value = getPropValue.call(panel, panel.meta.userData, 7, 'meshOptimizer.simplifyOptions.agressiveness');

            updateElementInvalid.call(panel, panel.$.meshOptimizerAgressivenessSlider, 'meshOptimizer.simplifyOptions.agressiveness');
            updateElementReadonly.call(panel, panel.$.meshOptimizerAgressivenessSlider);
        },
    },
    maxIterationCount: {
        ready() {
            const panel = this;
            panel.$.meshOptimizerMaxIterationCountSlider.addEventListener('change', panel.setProp.bind(panel, 'meshOptimizer.simplifyOptions.maxIterationCount', 'number'));
            panel.$.meshOptimizerMaxIterationCountSlider.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizerMaxIterationCountSlider.value = getPropValue.call(panel, panel.meta.userData, 100, 'meshOptimizer.simplifyOptions.maxIterationCount');

            updateElementInvalid.call(panel, panel.$.meshOptimizerMaxIterationCountSlider, 'meshOptimizer.simplifyOptions.maxIterationCount');
            updateElementReadonly.call(panel, panel.$.meshOptimizerMaxIterationCountSlider);
        },
    },
    // simplifyOptions end

};

exports.methods = {
    t(key) {
        return Editor.I18n.t(`ENGINE.assets.fbx.${key}`);
    },
    setProp(prop, type, event) {
        setPropValue.call(this, prop, type, event);

        this.dispatch('change');
        this.dispatch('track', { tab: 'model', prop, value: event.target.value });
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
