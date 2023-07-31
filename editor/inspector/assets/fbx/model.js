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
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.addVertexColor.name" tooltip="i18n:ENGINE.assets.fbx.addVertexColor.title"></ui-label>
        <ui-checkbox slot="content" class="addVertexColor-checkbox"></ui-checkbox>
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
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.agressiveness.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.agressiveness.title"></ui-label>
                <ui-slider slot="content" class="meshOptimizer-agressiveness-slider" min="5" max="20" step="1"></ui-slider>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.maxIterationCount.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimizer.simplify.maxIterationCount.title"></ui-label>
                <ui-slider slot="content" class="meshOptimizer-maxIterationCount-slider" min="100" max="200" step="1"></ui-slider>
            </ui-prop>
        </div>
    </ui-section>
    <ui-section class="lods config" cache-expand="fbx-mode-lods">
        <div slot="header" class="lods-header">
            <ui-checkbox class="lods-checkbox"></ui-checkbox>
            <ui-label value="LODS" tooltip="To import LODs, please make sure the LOD mesh names are ending with _LOD#"></ui-label>
        </div>
        <div class="lod-items"></div>
        <div class="not-lod-mesh-label" hidden></div>
        <div class="no-lod-label" hidden>There is no LOD group found in the source file. If you want to generate LODs for this model, please use above settings.</div>
        <div class="load-mask">
            <ui-loading></ui-loading>
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
.lods {
    margin-top: 0;
}

.lod-item .lod-item-header {
    flex: 1;
    display: flex;
    align-items: center;
}
.lod-item .lod-item-header .left {
    flex: 1;
}
.lod-item .lod-item-header .middle,
.lod-item .lod-item-header .right {
    display: flex;
    flex: 2;
    text-align: right;
}
.lod-item .lod-item-header .middle {
    margin: 0 4px;
}
.lod-item .lod-item-header .middle[hidden] {
    display: none;
}
.lod-item .lod-item-header .middle > ui-num-input {
    width: 48px;
    margin-left: 4px;
}
.lod-item .lod-item-header .middle .face-count,
.lod-item .lod-item-header .right .triangles {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 0;
}
.lod-item .lod-item-header .right .operator {
    display: none;
    margin-left: 8px;
    background: var(--color-default-fill);
    border-color: var(--color-default-border);
    border-radius: calc(var(--size-normal-radius) * 1px);
}
.lod-item .lod-item-header .right .operator > ui-icon {
    padding: 0 5px;
    transition: color 0.15s;
    color: var(--color-default-contrast-emphasis);
    position: relative;
}
.lod-item .lod-item-header .right .operator > ui-icon + ui-icon {
    margin-left: 1px;
}
.lod-item .lod-item-header .right .operator > ui-icon + ui-icon::after {
    content: '';
    display: block;
    width: 1px;
    height: 12px;
    position: absolute;
    top: 6px;
    left: -1px;
    background: var(--color-normal-fill-normal);
}
.lod-item .lod-item-header:hover .right .operator:not([hidden]) {
    display: flex;
}
.lod-item .lod-item-header .right .operator > ui-icon:hover {
    background: var(--color-hover-fill-weaker);
    color: var(--color-focus-contrast-emphasis);
}
.lods .not-lod-mesh-label,
.lods .no-lod-label {
    color: var(--color-default-fill-weakest)
}
.lods .not-lod-mesh-label[hidden],
.lods .no-lod-label[hidden] {
    display: none;
}
.lods .load-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    text-align: center;
    background-color: #1b1d1db0;
    z-index: 10;
    display: none;
}
.lods .load-mask > ui-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
    addVertexColorCheckbox: '.addVertexColor-checkbox',
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
    meshOptimizerAgressivenessSlider: '.meshOptimizer-agressiveness-slider',
    meshOptimizerMaxIterationCountSlider: '.meshOptimizer-maxIterationCount-slider',
    // lods
    lodsCheckbox: '.lods-checkbox',
    lodItems: '.lod-items',
    noLodLabel: '.no-lod-label',
    notLodMeshLabel: '.not-lod-mesh-label',
    loadMask: '.load-mask',
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
    addVertexColorCheckbox: {
        ready() {
            const panel = this;

            panel.$.addVertexColorCheckbox.addEventListener('change', panel.setProp.bind(panel, 'addVertexColor', 'boolean'));
            panel.$.addVertexColorCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let defaultValue = false;
            if (panel.meta.userData) {
                defaultValue = getPropValue.call(panel, panel.meta.userData.addVertexColor, defaultValue);
            }
            panel.$.addVertexColorCheckbox.value = defaultValue;

            updateElementInvalid.call(panel, panel.$.addVertexColorCheckbox, 'addVertexColor');
            updateElementReadonly.call(panel, panel.$.addVertexColorCheckbox);
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
    // lods start
    lods: {
        ready() {
            const panel = this;

            // Listening lod on and off
            panel.$.lodsCheckbox.addEventListener('change', panel.setProp.bind(panel, 'lods.enable', 'boolean'));
            panel.$.lodsCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
            // listening for screenRatio and faceCount changes
            panel.$.lodItems.addEventListener('change', (event) => {
                const path = event.target.getAttribute('path');
                const index = Number(event.target.getAttribute('key'));
                const value = Editor.Utils.Math.divide(event.target.value, 100);
                switch (path) {
                    case 'screenRatio':
                        // TODO: Min/max of the screenRatio for each level of LOD
                        panel.metaList.forEach((meta) => {
                            meta.userData.lods && (meta.userData.lods.options[index].screenRatio = value);
                        });
                        panel.dispatch('change');
                        break;
                    case 'faceCount':
                        // TODO: Min/max of the faceCount for each level of LOD
                        panel.metaList.forEach((meta) => {
                            meta.userData.lods && (meta.userData.lods.options[index].faceCount = value);
                        });
                        panel.dispatch('change');
                        break;
                }
            });
            panel.$.lodItems.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.lodsCheckbox.value = getPropValue.call(panel, panel.meta.userData.lods, false, 'enable');
            const lodOptions = panel.meta.userData.lods && panel.meta.userData.lods.options || [];
            const hasBuiltinLOD = panel.meta.userData.lods && panel.meta.userData.lods.hasBuiltinLOD || false;
            panel.$.lodItems.innerHTML = getLodItemHTML(lodOptions, panel.LODTriangleCounts, hasBuiltinLOD);
            hasBuiltinLOD ? panel.$.noLodLabel.setAttribute('hidden', '') : panel.$.noLodLabel.removeAttribute('hidden');
            if (panel.notLODTriangleCounts && panel.notLODTriangleCounts.length > 0) {
                const totalNotLODTriangleCounts = panel.notLODTriangleCounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                panel.$.notLodMeshLabel.innerHTML = `There are ${panel.notLODTriangleCounts.length} non-LOD mesh(es) in the FBX, and the total triangles count is ${totalNotLODTriangleCounts}.`;
                panel.$.notLodMeshLabel.removeAttribute('hidden');
            } else {
                panel.$.notLodMeshLabel.setAttribute('hidden', '');
            }
            if (panel.$.loadMask.style.display === 'block' && this.asset.imported) {
                panel.$.loadMask.style.display = 'none';
            }
            // Listening to the addition and removal of the lod hierarchy
            const uiIcons = panel.$.lodItems.querySelectorAll('ui-icon[value="add"], .lod-items ui-icon[value="reduce"]');
            uiIcons.forEach((uiIcon) => {
                uiIcon.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const path = event.target.getAttribute('path');
                    const index = Number(event.target.getAttribute('key'));
                    const lods = panel.meta.userData.lods;
                    if (!lods) {
                        return;
                    }

                    if (path === 'insertLod') {
                        if (Object.keys(lods.options).length >= 8) {
                            console.warn('Maximum 8 LOD, Can\'t add more LOD');
                            return;
                        }
                        const preScreenRatio = lods.options[index].screenRatio;
                        const nextScreenRatio = lods.options[index + 1] ? lods.options[index + 1].screenRatio : 0;
                        const preFaceCount = lods.options[index].faceCount;
                        const nextFaceCount = lods.options[index + 1] ? lods.options[index + 1].faceCount : 0;
                        const option = {
                            screenRatio: (preScreenRatio + nextScreenRatio) / 2,
                            faceCount: (preFaceCount + nextFaceCount) / 2,
                        };
                        // Insert the specified lod level
                        for (let keyIndex = Object.keys(lods.options).length - 1; keyIndex > index; keyIndex--) {
                            lods.options[keyIndex + 1] = lods.options[keyIndex];
                            panel.LODTriangleCounts[keyIndex + 1] = panel.LODTriangleCounts[keyIndex];
                        }
                        lods.options[index + 1] = option;
                        panel.LODTriangleCounts[index + 1] = 0;
                        // update panel
                        Elements.lods.update.call(panel);
                        panel.dispatch('change');
                        panel.dispatch('snapshot');
                    } else if (path === 'deleteLod') {
                        if (Object.keys(lods.options).length <= 1) {
                            console.warn('At least one LOD, Can\'t delete any more');
                            return;
                        }
                        // Delete the specified lod level
                        for (let key = index; key < Object.keys(lods.options).length; key++) {
                            lods.options[key] = lods.options[key + 1];
                            panel.LODTriangleCounts[key] = panel.LODTriangleCounts[key + 1];
                        }
                        lods.options.pop();
                        panel.LODTriangleCounts.pop();
                        // update panel
                        Elements.lods.update.call(panel);
                        panel.dispatch('change');
                        panel.dispatch('snapshot');
                    }
                });
            });

            updateElementInvalid.call(panel, panel.$.lodsCheckbox, 'lods.enable');
            updateElementReadonly.call(panel, panel.$.lodsCheckbox, hasBuiltinLOD);
        },
    },
    // lods end
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
    apply() {
        this.$.loadMask.style.display = 'block';
    },
};

exports.ready = function() {
    this.applyFun = this.apply.bind(this);
    Editor.Message.addBroadcastListener('fbx-inspector:apply', this.applyFun);

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
    const { LODTriangleCounts, notLODTriangleCounts } = handleLODTriangleCounts(this.meta);
    this.LODTriangleCounts = LODTriangleCounts;
    this.notLODTriangleCounts = notLODTriangleCounts;

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
        }
    }
};

exports.close = function() {
    Editor.Message.removeBroadcastListener('fbx-inspector:apply', this.applyFun);

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.close) {
            element.close.call(this);
        }
    }
};

function handleLODTriangleCounts(meta) {
    if (!meta.userData.lods) {
        return [];
    }
    let LODTriangleCounts = new Array(meta.userData.lods.options.length).fill(0);
    let notLODTriangleCounts = new Array();
    for (const key in meta.subMetas) {
        const subMeta = meta.subMetas[key];
        if (subMeta.importer === 'gltf-mesh') {
            const { lodOptions, triangleCount, lodLevel } = subMeta.userData;
            const index = !meta.userData.lods.hasBuiltinLOD ? (lodOptions ? lodLevel : 0) : lodLevel;
            // When an FBX comes with LOD, there may be non-LOD meshes, and the count of these meshes should be calculated separately.
            if (index === undefined) {
                notLODTriangleCounts.push(triangleCount || 0);
                continue;
            }
            LODTriangleCounts[index] = (LODTriangleCounts[index] || 0) + (triangleCount || 0);
        }
    }
    return {
        LODTriangleCounts,
        notLODTriangleCounts,
    };
}

function getLodItemHTML(lodOptions, LODTriangleCounts, hasBuiltinLOD = false) {
    let lodItemsStr = '';
    for (const index in lodOptions) {
        const lodItem = lodOptions[index];
        lodItemsStr += `
<div class="lod-item">
    <ui-section cache-expand="fbx-mode-lod-item-${index}">
        <header slot="header" class="lod-item-header">
            <div class="left">
                <span>LOD ${index}</span>
            </div>
            <div class="middle" ${ index == 0 || lodOptions[0].faceCount == 0 ? 'hidden' : '' }>
                <span class="face-count">Face count(%)</span>
                <ui-num-input path="faceCount" min="0" max="100" key="${index}"
                    value="${Editor.Utils.Math.multi(lodItem.faceCount, 100)}"
                    ${ hasBuiltinLOD ? 'disabled' : '' }>
                </ui-num-input>
            </div>
            <div class="right">
                <div class="triangles">
                    <span> ${LODTriangleCounts[index] || 0} Triangles</span>
                </div>
                <div class="operator" ${ hasBuiltinLOD ? 'hidden' : '' }>
                    <ui-icon value="add" key="${index}" path="insertLod" tooltip="insert after this LOD"></ui-icon>
                    <ui-icon value="reduce" key="${index}" path="deleteLod" tooltip="delete this LOD"></ui-icon>
                </div>
            </div>
        </header>
        <div class="lod-item-content">
            <ui-prop>
                <ui-label slot="label" value="Screen Ratio (%)"></ui-label>
                <ui-num-input slot="content" key="${index}" path="screenRatio" min="0" max="100"
                    value="${Editor.Utils.Math.multi(lodItem.screenRatio, 100)}">
                </ui-num-input>
            </ui-prop>
        </div>
    </ui-section>
</div>`;
    }

    return lodItemsStr;
}
