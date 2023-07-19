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
            <ui-checkbox slot="content" class="meshSimplify-checkbox"></ui-checkbox>
            <ui-label value="i18n:ENGINE.assets.fbx.meshSimplify.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.title"></ui-label>
        </div>
        <div>
            <ui-prop class="algorithm">
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.algorithm.name"></ui-label>
                <ui-select slot="content" class="meshSimplify-algorithm-select"></ui-select>
            </ui-prop>
        </div>
        <div class="gltfpack-options">
            <ui-prop>
                <div class="warn-words" slot="content">
                    <ui-label value="i18n:ENGINE.assets.fbx.meshSimplify.gltfpack.warn"></ui-label>
                </div>
            </ui-prop>
            <ui-section expand cache-expand="fbx-model-mesh-optimizer-simplification">
                <ui-label slot="header" value="i18n:ENGINE.assets.fbx.meshSimplify.simplification.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.simplification.title"></ui-label>
                <ui-prop>
                    <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.simplification.si.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.simplification.si.title"></ui-label>
                    <ui-slider slot="content" class="meshSimplify-si-slider" min="0" max="1" step="0.01"></ui-slider>
                </ui-prop>
                <ui-prop>
                    <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.simplification.sa.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.simplification.sa.title"></ui-label>
                    <ui-checkbox slot="content" class="meshSimplify-sa-checkbox"></ui-checkbox>
                </ui-prop>
            </ui-section>
            <ui-section expand cache-expand="fbx-model-mesh-optimizer-scene">
                <ui-label slot="header" value="i18n:ENGINE.assets.fbx.meshSimplify.scene.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.scene.title"></ui-label>
                <ui-prop>
                    <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.scene.kn.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.scene.kn.title"></ui-label>
                    <ui-checkbox slot="content" class="meshSimplify-kn-checkbox"></ui-checkbox>
                </ui-prop>
                <ui-prop>
                    <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.scene.ke.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.scene.ke.title"></ui-label>
                    <ui-checkbox slot="content" class="meshSimplify-ke-checkbox"></ui-checkbox>
                </ui-prop>
            </ui-section>
            <ui-section expand cache-expand="fbx-model-mesh-optimizer-miscellaneous">
                <ui-label slot="header" value="i18n:ENGINE.assets.fbx.meshSimplify.miscellaneous.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.miscellaneous.title"></ui-label>
                <ui-prop>
                    <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.miscellaneous.noq.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.miscellaneous.noq.title"></ui-label>
                    <ui-checkbox slot="content" class="meshSimplify-noq-checkbox"></ui-checkbox>
                </ui-prop>
                <ui-prop>
                    <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.miscellaneous.v.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.miscellaneous.v.title"></ui-label>
                    <ui-checkbox slot="content" class="meshSimplify-v-checkbox"></ui-checkbox>
                </ui-prop>
            </ui-section>
            <div class="warn-words">
                <ui-label value="i18n:ENGINE.assets.fbx.meshSimplify.warn"></ui-label>
            </div>
        </div>
        <div class="simplify-options">
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.simplify.targetRatio.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.simplify.targetRatio.title"></ui-label>
                <ui-slider slot="content" class="meshSimplify-targetRatio-slider" min="0" max="1" step="0.01"></ui-slider>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.simplify.preserveSurfaceCurvature.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.simplify.preserveSurfaceCurvature.title"></ui-label>
                <ui-checkbox slot="content" class="meshSimplify-preserveSurfaceCurvature-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.simplify.preserveBorderEdges.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.simplify.preserveBorderEdges.title"></ui-label>
                <ui-checkbox slot="content" class="meshSimplify-preserveBorderEdges-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.simplify.preserveUVSeamEdges.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.simplify.preserveUVSeamEdges.title"></ui-label>
                <ui-checkbox slot="content" class="meshSimplify-preserveUVSeamEdges-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.simplify.preserveUVFoldoverEdges.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.simplify.preserveUVFoldoverEdges.title"></ui-label>
                <ui-checkbox slot="content" class="meshSimplify-preserveUVFoldoverEdges-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.simplify.agressiveness.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.simplify.agressiveness.title"></ui-label>
                <ui-slider slot="content" class="meshSimplify-agressiveness-slider" min="5" max="20" step="1"></ui-slider>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.simplify.maxIterationCount.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.simplify.maxIterationCount.title"></ui-label>
                <ui-slider slot="content" class="meshSimplify-maxIterationCount-slider" min="100" max="200" step="1"></ui-slider>
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
    meshSimplifyCheckbox: '.meshSimplify-checkbox',
    meshSimplifyAlgorithmSelect: '.meshSimplify-algorithm-select',
    // gltfpackOptions 
    meshSimplifyGltfpackOptions: '.gltfpack-options',
    meshSimplifySISlider: '.meshSimplify-si-slider',
    meshSimplifySACheckbox: '.meshSimplify-sa-checkbox',
    meshSimplifyKNCheckbox: '.meshSimplify-kn-checkbox',
    meshSimplifyKECheckbox: '.meshSimplify-ke-checkbox',
    meshSimplifyNOQCheckbox: '.meshSimplify-noq-checkbox',
    meshSimplifyVCheckbox: '.meshSimplify-v-checkbox',
    // simplifyOptions
    meshSimplifySimplifyOptions: '.simplify-options',
    meshSimplifyTargetRatioSlider: '.meshSimplify-targetRatio-slider',
    meshSimplifyPreserveSurfaceCurvatureCheckbox: '.meshSimplify-preserveSurfaceCurvature-checkbox',
    meshSimplifyPreserveBorderEdgesCheckbox: '.meshSimplify-preserveBorderEdges-checkbox',
    meshSimplifyPreserveUVSeamEdgesCheckbox: '.meshSimplify-preserveUVSeamEdges-checkbox',
    meshSimplifyPreserveUVFoldoverEdgesCheckbox: '.meshSimplify-preserveUVFoldoverEdges-checkbox',
    meshSimplifyAgressivenessSlider: '.meshSimplify-agressiveness-slider',
    meshSimplifyMaxIterationCountSlider: '.meshSimplify-maxIterationCount-slider',
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

    meshSimplify: {
        ready() {
            const panel = this;

            panel.$.meshSimplifyCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.enable', 'boolean'));
            panel.$.meshSimplifyCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshSimplify, false, 'enable');

            updateElementInvalid.call(panel, panel.$.meshSimplifyCheckbox, 'meshSimplify.enable');
            updateElementReadonly.call(panel, panel.$.meshSimplifyCheckbox);
        },
    },
    meshSimplifyAlgorithm: {
        ready() {
            const panel = this;

            panel.$.meshSimplifyAlgorithmSelect.addEventListener('change', (event) => {
                panel.setProp.call(panel, 'meshSimplify.algorithm', 'string', event);
                Elements.meshSimplifyAlgorithm.update.call(panel);
            });
            panel.$.meshSimplifyAlgorithmSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['simplify', 'gltfpack'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${panel.t(`meshSimplify.algorithm.${type}`)}</option>`;
            });
            panel.$.meshSimplifyAlgorithmSelect.innerHTML = optionsHtml;

            const defaultValue = 'simplify';
            panel.$.meshSimplifyAlgorithmSelect.value = getPropValue.call(panel, panel.meta.userData.meshSimplify, defaultValue, 'algorithm');

            updateElementInvalid.call(panel, panel.$.meshSimplifyAlgorithmSelect, 'meshSimplify.algorithm');
            updateElementReadonly.call(panel, panel.$.meshSimplifyAlgorithmSelect);

            if (panel.$.meshSimplifyAlgorithmSelect.value === defaultValue) {
                panel.$.meshSimplifyGltfpackOptions.setAttribute('hidden', '');
                panel.$.meshSimplifySimplifyOptions.removeAttribute('hidden');
            } else {
                panel.$.meshSimplifyGltfpackOptions.removeAttribute('hidden');
                panel.$.meshSimplifySimplifyOptions.setAttribute('hidden', '');
            }

            if (panel.$.meshSimplifyAlgorithmSelect.hasAttribute('invalid')) {
                panel.$.meshSimplifyGltfpackOptions.setAttribute('hidden', '');
                panel.$.meshSimplifySimplifyOptions.setAttribute('hidden', '');
            }
        },
    },
    // gltfpackOptions start
    si: {
        ready() {
            const panel = this;
            panel.$.meshSimplifySISlider.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.gltfpackOptions.si', 'number'));
            panel.$.meshSimplifySISlider.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifySISlider.value = getPropValue.call(panel, panel.meta.userData, 1, 'meshSimplify.gltfpackOptions.si');

            updateElementInvalid.call(panel, panel.$.meshSimplifySISlider, 'meshSimplify.gltfpackOptions.si');
            updateElementReadonly.call(panel, panel.$.meshSimplifySISlider, true);
        },
    },
    sa: {
        ready() {
            const panel = this;
            panel.$.meshSimplifySACheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.gltfpackOptions.sa', 'boolean'));
            panel.$.meshSimplifySACheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifySACheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshSimplify.gltfpackOptions.sa');

            updateElementInvalid.call(panel, panel.$.meshSimplifySACheckbox, 'meshSimplify.gltfpackOptions.sa');
            updateElementReadonly.call(panel, panel.$.meshSimplifySACheckbox, true);
        },
    },
    kn: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyKNCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.gltfpackOptions.kn', 'boolean'));
            panel.$.meshSimplifyKNCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;
 
            panel.$.meshSimplifyKNCheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshSimplify.gltfpackOptions.kn');

            updateElementInvalid.call(panel, panel.$.meshSimplifyKNCheckbox, 'meshSimplify.gltfpackOptions.kn');
            updateElementReadonly.call(panel, panel.$.meshSimplifyKNCheckbox, true);
        },
    },
    ke: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyKECheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.gltfpackOptions.ke', 'boolean'));
            panel.$.meshSimplifyKECheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyKECheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshSimplify.gltfpackOptions.ke');

            updateElementInvalid.call(panel, panel.$.meshSimplifyKECheckbox, 'meshSimplify.gltfpackOptions.ke');
            updateElementReadonly.call(panel, panel.$.meshSimplifyKECheckbox, true);
        },
    },
    noq: {
        ready() {
            const panel = this;

            panel.$.meshSimplifyNOQCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.gltfpackOptions.noq', 'boolean'));
            panel.$.meshSimplifyNOQCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyNOQCheckbox.value = getPropValue.call(panel, panel.meta.userData, true, 'meshSimplify.gltfpackOptions.noq');

            updateElementInvalid.call(panel, panel.$.meshSimplifyNOQCheckbox, 'meshSimplify.gltfpackOptions.noq');
            updateElementReadonly.call(panel, panel.$.meshSimplifyNOQCheckbox, true);
        },
    },
    v: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyVCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.gltfpackOptions.v', 'boolean'));
            panel.$.meshSimplifyVCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyVCheckbox.value = getPropValue.call(panel, panel.meta.userData, true, 'meshSimplify.gltfpackOptions.v');

            updateElementInvalid.call(panel, panel.$.meshSimplifyVCheckbox, 'meshSimplify.gltfpackOptions.v');
            updateElementReadonly.call(panel, panel.$.meshSimplifyVCheckbox, true);
        },
    },
    // gltfpackOptions end
    // simplifyOptions start
    targetRatio: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyTargetRatioSlider.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.simplifyOptions.targetRatio', 'number'));
            panel.$.meshSimplifyTargetRatioSlider.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyTargetRatioSlider.value = getPropValue.call(panel, panel.meta.userData, 1, 'meshSimplify.simplifyOptions.targetRatio');

            updateElementInvalid.call(panel, panel.$.meshSimplifyTargetRatioSlider, 'meshSimplify.simplifyOptions.targetRatio');
            updateElementReadonly.call(panel, panel.$.meshSimplifyTargetRatioSlider);
        },
    },
    preserveSurfaceCurvature: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyPreserveSurfaceCurvatureCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.simplifyOptions.preserveSurfaceCurvature', 'boolean'));
            panel.$.meshSimplifyPreserveSurfaceCurvatureCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyPreserveSurfaceCurvatureCheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshSimplify.simplifyOptions.preserveSurfaceCurvature');

            updateElementInvalid.call(panel, panel.$.meshSimplifyPreserveSurfaceCurvatureCheckbox, 'meshSimplify.simplifyOptions.preserveSurfaceCurvature');
            updateElementReadonly.call(panel, panel.$.meshSimplifyPreserveSurfaceCurvatureCheckbox);
        },
    },
    preserveBorderEdges: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyPreserveBorderEdgesCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.simplifyOptions.preserveBorderEdges', 'boolean'));
            panel.$.meshSimplifyPreserveBorderEdgesCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyPreserveBorderEdgesCheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshSimplify.simplifyOptions.preserveBorderEdges');

            updateElementInvalid.call(panel, panel.$.meshSimplifyPreserveBorderEdgesCheckbox, 'meshSimplify.simplifyOptions.preserveBorderEdges');
            updateElementReadonly.call(panel, panel.$.meshSimplifyPreserveBorderEdgesCheckbox);
        },
    },
    preserveUVSeamEdges: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyPreserveUVSeamEdgesCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.simplifyOptions.preserveUVSeamEdges', 'boolean'));
            panel.$.meshSimplifyPreserveUVSeamEdgesCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyPreserveUVSeamEdgesCheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshSimplify.simplifyOptions.preserveUVSeamEdges');

            updateElementInvalid.call(panel, panel.$.meshSimplifyPreserveUVSeamEdgesCheckbox, 'meshSimplify.simplifyOptions.preserveUVSeamEdges');
            updateElementReadonly.call(panel, panel.$.meshSimplifyPreserveUVSeamEdgesCheckbox);
        },
    },
    preserveUVFoldoverEdges: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyPreserveUVFoldoverEdgesCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.simplifyOptions.preserveUVFoldoverEdges', 'boolean'));
            panel.$.meshSimplifyPreserveUVFoldoverEdgesCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyPreserveUVFoldoverEdgesCheckbox.value = getPropValue.call(panel, panel.meta.userData, false, 'meshSimplify.simplifyOptions.preserveUVFoldoverEdges');

            updateElementInvalid.call(panel, panel.$.meshSimplifyPreserveUVFoldoverEdgesCheckbox, 'meshSimplify.simplifyOptions.preserveUVFoldoverEdges');
            updateElementReadonly.call(panel, panel.$.meshSimplifyPreserveUVFoldoverEdgesCheckbox);
        },
    },
    agressiveness: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyAgressivenessSlider.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.simplifyOptions.agressiveness', 'number'));
            panel.$.meshSimplifyAgressivenessSlider.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyAgressivenessSlider.value = getPropValue.call(panel, panel.meta.userData, 7, 'meshSimplify.simplifyOptions.agressiveness');

            updateElementInvalid.call(panel, panel.$.meshSimplifyAgressivenessSlider, 'meshSimplify.simplifyOptions.agressiveness');
            updateElementReadonly.call(panel, panel.$.meshSimplifyAgressivenessSlider);
        },
    },
    maxIterationCount: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyMaxIterationCountSlider.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.simplifyOptions.maxIterationCount', 'number'));
            panel.$.meshSimplifyMaxIterationCountSlider.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyMaxIterationCountSlider.value = getPropValue.call(panel, panel.meta.userData, 100, 'meshSimplify.simplifyOptions.maxIterationCount');

            updateElementInvalid.call(panel, panel.$.meshSimplifyMaxIterationCountSlider, 'meshSimplify.simplifyOptions.maxIterationCount');
            updateElementReadonly.call(panel, panel.$.meshSimplifyMaxIterationCountSlider);
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
    // when lang change
    i18n: {
        ready() {
            const panel = this;

            Elements.i18n.changeBind = Elements.i18n.change.bind(panel);
            Editor.Message.addBroadcastListener('i18n:change', Elements.i18n.changeBind);
        },
        close() {
            Editor.Message.removeBroadcastListener('i18n:change', Elements.i18n.changeBind);
            Elements.i18n.changeBind = undefined;
        },
        change() {
            const panel = this;

            Elements.normals.update.call(panel);
            Elements.tangents.update.call(panel);
            Elements.morphNormals.update.call(panel);
            Elements.meshOptimizerAlgorithm.update.call(panel);
        },
    },
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
