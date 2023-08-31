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
    <ui-section class="meshOptimize config" cache-expand="fbx-model-mesh-optimizer">
        <div slot="header" class="meshOptimize-header">
            <ui-checkbox slot="content" class="meshOptimize-checkbox"></ui-checkbox>
            <ui-label value="i18n:ENGINE.assets.fbx.meshOptimize.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimize.title"></ui-label>
        </div>
        <div class="meshOptimize-options">
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimize.vertexCache.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimize.vertexCache.title"></ui-label>
                <ui-checkbox slot="content" class="meshOptimize-vertexCache-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimize.vertexFetch.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimize.vertexFetch.title"></ui-label>
                <ui-checkbox slot="content" class="meshOptimize-vertexFetch-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshOptimize.overdraw.name" tooltip="i18n:ENGINE.assets.fbx.meshOptimize.overdraw.title"></ui-label>
                <ui-checkbox slot="content" class="meshOptimize-overdraw-checkbox"></ui-checkbox>
            </ui-prop>
        </div>
    </ui-section>
    <ui-section class="meshSimplify config" cache-expand="fbx-model-mesh-simplifier">
        <div slot="header" class="meshSimplify-header">
            <ui-checkbox slot="content" class="meshSimplify-checkbox"></ui-checkbox>
            <ui-label value="i18n:ENGINE.assets.fbx.meshSimplify.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.title"></ui-label>
        </div>
        <div class="meshSimplify-options">
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.targetRatio.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.targetRatio.title"></ui-label>
                <ui-slider slot="content" class="meshSimplify-targetRatio-slider" min="0" max="1" step="0.01"></ui-slider>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.autoErrorRate.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.autoErrorRate.title"></ui-label>
                <ui-checkbox slot="content" class="meshSimplify-autoErrorRate-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.errorRate.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.errorRate.title"></ui-label>
                <ui-slider slot="content" class="meshSimplify-errorRate-slider" min="0" max="1" step="0.01"></ui-slider>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshSimplify.lockBoundary.name" tooltip="i18n:ENGINE.assets.fbx.meshSimplify.lockBoundary.title"></ui-label>
                <ui-checkbox slot="content" class="meshSimplify-lockBoundary-checkbox"></ui-checkbox>
            </ui-prop>
        </div>
    </ui-section>
    <ui-section class="meshCluster config" cache-expand="fbx-model-mesh-cluster">
        <div slot="header" class="meshCluster-header">
            <ui-checkbox slot="content" class="meshCluster-checkbox"></ui-checkbox>
            <ui-label value="i18n:ENGINE.assets.fbx.meshCluster.name" tooltip="i18n:ENGINE.assets.fbx.meshCluster.title"></ui-label>
        </div>
        <div class="meshCluster-options">
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshCluster.generateBounding.name" tooltip="i18n:ENGINE.assets.fbx.meshCluster.generateBounding.title"></ui-label>
                <ui-checkbox slot="content" class="meshCluster-generateBounding-checkbox"></ui-checkbox>
            </ui-prop>
        </div>
    </ui-section>
    <ui-section class="meshCompress config" cache-expand="fbx-model-mesh-compressor">
        <div slot="header" class="meshCompress-header">
            <ui-checkbox slot="content" class="meshCompress-checkbox"></ui-checkbox>
            <ui-label value="i18n:ENGINE.assets.fbx.meshCompress.name" tooltip="i18n:ENGINE.assets.fbx.meshCompress.title"></ui-label>
        </div>
        <div class="meshCompress-options">
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshCompress.encode.name" tooltip="i18n:ENGINE.assets.fbx.meshCompress.encode.title"></ui-label>
                <ui-checkbox slot="content" class="meshCompress-encode-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshCompress.compress.name" tooltip="i18n:ENGINE.assets.fbx.meshCompress.compress.title"></ui-label>
                <ui-checkbox slot="content" class="meshCompress-compress-checkbox"></ui-checkbox>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.fbx.meshCompress.quantize.name" tooltip="i18n:ENGINE.assets.fbx.meshCompress.quantize.title"></ui-label>
                <ui-checkbox slot="content" class="meshCompress-quantize-checkbox"></ui-checkbox>
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

    // meshOptimizeOptions
    meshOptimizeCheckbox: '.meshOptimize-checkbox',
    meshOptimizeVertexCacheCheckbox: '.meshOptimize-vertexCache-checkbox',
    meshOptimizeVertexFetchCheckbox: '.meshOptimize-vertexFetch-checkbox',
    meshOptimizeOverdrawCheckbox: '.meshOptimize-overdraw-checkbox',

    // simplifyOptions
    meshSimplifyCheckbox: '.meshSimplify-checkbox',
    meshSimplifyTargetRatioSlider: '.meshSimplify-targetRatio-slider',
    meshSimplifyAutoErrorRateCheckbox: '.meshSimplify-autoErrorRate-checkbox',
    meshSimplifyErrorRateSlider: '.meshSimplify-errorRate-slider',
    meshSimplifyLockBoundaryCheckbox: '.meshSimplify-lockBoundary-checkbox',

    meshClusterCheckbox: '.meshCluster-checkbox',
    meshClusterGenerateBoundingCheckbox: '.meshCluster-generateBounding-checkbox',

    meshCompressCheckbox: '.meshCompress-checkbox',
    meshCompressEncodeCheckbox: '.meshCompress-encode-checkbox',
    meshCompressCompressCheckbox: '.meshCompress-compress-checkbox',
    meshCompressQuantizeCheckbox: '.meshCompress-quantize-checkbox',

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

    // meshOptimize start
    meshOptimize: {
        ready() {
            const panel = this;

            panel.$.meshOptimizeCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimize.enable', 'boolean'));
            panel.$.meshOptimizeCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizeCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshOptimize, false, 'enable');

            updateElementInvalid.call(panel, panel.$.meshOptimizeCheckbox, 'meshOptimize.enable');
            updateElementReadonly.call(panel, panel.$.meshOptimizeCheckbox);
        },
    },
    meshOptimizeVertexCache: {
        ready() {
            const panel = this;

            panel.$.meshOptimizeVertexCacheCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimize.vertexCache', 'boolean'));
            panel.$.meshOptimizeVertexCacheCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizeVertexCacheCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshOptimize, false, 'vertexCache');

            updateElementInvalid.call(panel, panel.$.meshOptimizeVertexCacheCheckbox, 'meshOptimize.vertexCache');
            updateElementReadonly.call(panel, panel.$.meshOptimizeVertexCacheCheckbox);
        },
    },
    meshOptimizeVertexFetch: {
        ready() {
            const panel = this;

            panel.$.meshOptimizeVertexFetchCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimize.vertexFetch', 'boolean'));
            panel.$.meshOptimizeVertexFetchCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizeVertexFetchCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshOptimize, false, 'vertexFetch');

            updateElementInvalid.call(panel, panel.$.meshOptimizeVertexFetchCheckbox, 'meshOptimize.vertexFetch');
            updateElementReadonly.call(panel, panel.$.meshOptimizeVertexFetchCheckbox);
        },
    },
    meshOptimizeOverdraw: {
        ready() {
            const panel = this;

            panel.$.meshOptimizeOverdrawCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshOptimize.overdraw', 'boolean'));
            panel.$.meshOptimizeOverdrawCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshOptimizeOverdrawCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshOptimize, false, 'overdraw');

            updateElementInvalid.call(panel, panel.$.meshOptimizeOverdrawCheckbox, 'meshOptimize.overdraw');
            updateElementReadonly.call(panel, panel.$.meshOptimizeOverdrawCheckbox);
        },
    },
    // meshOptimize end
    // meshSimplify start
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
    meshSimplifyTargetRatio: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyTargetRatioSlider.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.targetRatio', 'number'));
            panel.$.meshSimplifyTargetRatioSlider.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyTargetRatioSlider.value = getPropValue.call(panel, panel.meta.userData.meshSimplify, 1, 'targetRatio');

            updateElementInvalid.call(panel, panel.$.meshSimplifyTargetRatioSlider, 'meshSimplify.targetRatio');
            updateElementReadonly.call(panel, panel.$.meshSimplifyTargetRatioSlider);
        },
    },
    meshSimplifyAutoErrorRateCheckbox: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyAutoErrorRateCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.autoErrorRate', 'boolean'));
            panel.$.meshSimplifyAutoErrorRateCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyAutoErrorRateCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshSimplify, false, 'autoErrorRate');

            updateElementInvalid.call(panel, panel.$.meshSimplifyAutoErrorRateCheckbox, 'meshSimplify.autoErrorRate');
            updateElementReadonly.call(panel, panel.$.meshSimplifyAutoErrorRateCheckbox);
        },
    },
    meshSimplifyErrorRate: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyErrorRateSlider.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.errorRate', 'number'));
            panel.$.meshSimplifyErrorRateSlider.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyErrorRateSlider.value = getPropValue.call(panel, panel.meta.userData.meshSimplify, 1, 'errorRate');

            updateElementInvalid.call(panel, panel.$.meshSimplifyErrorRateSlider, 'meshSimplify.errorRate');
            updateElementReadonly.call(panel, panel.$.meshSimplifyErrorRateSlider);
        },
    },
    meshSimplifyLockBoundaryCheckbox: {
        ready() {
            const panel = this;
            panel.$.meshSimplifyLockBoundaryCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshSimplify.lockBoundary', 'boolean'));
            panel.$.meshSimplifyLockBoundaryCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshSimplifyLockBoundaryCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshSimplify, false, 'lockBoundary');

            updateElementInvalid.call(panel, panel.$.meshSimplifyLockBoundaryCheckbox, 'meshSimplify.lockBoundary');
            updateElementReadonly.call(panel, panel.$.meshSimplifyLockBoundaryCheckbox);
        },
    },
    meshClusterCheckbox: {
        ready() {
            const panel = this;

            panel.$.meshClusterCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshCluster.enable', 'boolean'));
            panel.$.meshClusterCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshClusterCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshCluster, false, 'enable');

            updateElementInvalid.call(panel, panel.$.meshClusterCheckbox, 'meshCluster.enable');
            updateElementReadonly.call(panel, panel.$.meshClusterCheckbox);
        },
    },
    meshClusterGenerateBoundingCheckbox: {
        ready() {
            const panel = this;

            panel.$.meshClusterGenerateBoundingCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshCluster.generateBounding', 'boolean'));
            panel.$.meshClusterGenerateBoundingCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshClusterGenerateBoundingCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshCluster, false, 'generateBounding');

            updateElementInvalid.call(panel, panel.$.meshClusterGenerateBoundingCheckbox, 'meshCluster.generateBounding');
            updateElementReadonly.call(panel, panel.$.meshClusterGenerateBoundingCheckbox);
        },
    },
    // meshSimplify end
    // meshCompress start
    meshCompress: {
        ready() {
            const panel = this;

            panel.$.meshCompressCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshCompress.enable', 'boolean'));
            panel.$.meshCompressCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshCompressCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshCompress, false, 'enable');

            updateElementInvalid.call(panel, panel.$.meshCompressCheckbox, 'meshCompress.enable');
            updateElementReadonly.call(panel, panel.$.meshCompressCheckbox);
        },
    },
    meshCompressEncode: {
        ready() {
            const panel = this;

            panel.$.meshCompressEncodeCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshCompress.encode', 'boolean'));
            panel.$.meshCompressEncodeCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshCompressEncodeCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshCompress, false, 'encode');

            updateElementInvalid.call(panel, panel.$.meshCompressEncodeCheckbox, 'meshCompress.encode');
            updateElementReadonly.call(panel, panel.$.meshCompressEncodeCheckbox);
        },
    },
    meshCompressCompress: {
        ready() {
            const panel = this;

            panel.$.meshCompressCompressCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshCompress.compress', 'boolean'));
            panel.$.meshCompressCompressCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshCompressCompressCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshCompress, false, 'compress');

            updateElementInvalid.call(panel, panel.$.meshCompressCompressCheckbox, 'meshCompress.compress');
            updateElementReadonly.call(panel, panel.$.meshCompressCompressCheckbox);
        },
    },
    meshCompressQuantize: {
        ready() {
            const panel = this;

            panel.$.meshCompressQuantizeCheckbox.addEventListener('change', panel.setProp.bind(panel, 'meshCompress.quantize', 'boolean'));
            panel.$.meshCompressQuantizeCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.meshCompressQuantizeCheckbox.value = getPropValue.call(panel, panel.meta.userData.meshCompress, false, 'quantize');

            updateElementInvalid.call(panel, panel.$.meshCompressQuantizeCheckbox, 'meshCompress.quantize');
            updateElementReadonly.call(panel, panel.$.meshCompressQuantizeCheckbox);
        },
    },
    // meshCompress end
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
            <div class="middle" ${index == 0 || lodOptions[0].faceCount == 0 ? 'hidden' : ''}>
                <span class="face-count">Face count(%)</span>
                <ui-num-input path="faceCount" min="0" max="100" key="${index}"
                    value="${Editor.Utils.Math.multi(lodItem.faceCount, 100)}"
                    ${hasBuiltinLOD ? 'disabled' : ''}>
                </ui-num-input>
            </div>
            <div class="right">
                <div class="triangles">
                    <span> ${LODTriangleCounts[index] || 0} Triangles</span>
                </div>
                <div class="operator" ${hasBuiltinLOD ? 'hidden' : ''}>
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
