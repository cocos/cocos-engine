'use strict';

exports.template = `
<div class="asset-texture">
    <div class="content">
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.texture.anisotropy" tooltip="i18n:ENGINE.assets.texture.anisotropyTip"></ui-label>
            <ui-num-input slot="content" class="anisotropy-input"></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.texture.minfilter" tooltip="i18n:ENGINE.assets.texture.minfilterTip"></ui-label>
            <ui-select slot="content" class="minfilter-select"></ui-select>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.texture.magfilter" tooltip="i18n:ENGINE.assets.texture.magfilterTip"></ui-label>
            <ui-select slot="content" class="magfilter-select"></ui-select>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.texture.mipfilter" tooltip="i18n:ENGINE.assets.texture.mipfilterTip"></ui-label>
            <ui-select slot="content" class="mipfilter-select"></ui-select>
        </ui-prop>
        <ui-prop class="wrapModeS-prop">
            <ui-label slot="label" value="i18n:ENGINE.assets.texture.wrapModeS" tooltip="i18n:ENGINE.assets.texture.wrapModeSTip"></ui-label>
            <ui-select slot="content" class="wrapModeS-select"></ui-select>
        </ui-prop>
        <ui-prop class="wrapModeT-prop">
            <ui-label slot="label" value="i18n:ENGINE.assets.texture.wrapModeT" tooltip="i18n:ENGINE.assets.texture.wrapModeTTip"></ui-label>
            <ui-select slot="content" class="wrapModeT-select"></ui-select>
        </ui-prop>
        <ui-prop class="warn-words" style="display:none;">
            <ui-label value="i18n:ENGINE.assets.texture.modeWarn"></ui-label>
        </ui-prop>
    </div>
</div>
`;

exports.style = `
    .asset-texture {
        display: flex;
        flex: 1;
        flex-direction: column;
     }
    .asset-texture > .content {
        flex: 1;
    }
    .asset-texture > .content > ui-prop {
        margin: 4px 0;
    }
    .asset-texture > .content > ui-prop.warn {
        color: var(--color-warn-fill);
    }
    .asset-texture > .content > ui-prop.warn ui-select {
        border-color: var(--color-warn-fill);
    }
    .asset-texture > .content > .warn-words {
        margin-top: 20px;
        margin-bottom: 20px;
        line-height: 1.7;
        color: var(--color-warn-fill);
    }
    .asset-texture > .preview {
        position: relative;
        height: 200px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        background: var(--color-normal-fill-emphasis);
        border: 1px solid var(--color-normal-border-emphasis);
    }
    .asset-texture > .preview:hover {
        border-color: var(--color-warn-fill);
    }
`;

exports.$ = {
    container: '.asset-texture',
    anisotropyInput: '.anisotropy-input',
    minfilterSelect: '.minfilter-select',
    magfilterSelect: '.magfilter-select',
    mipfilterSelect: '.mipfilter-select',
    wrapModeSProp: '.wrapModeS-prop',
    wrapModeSSelect: '.wrapModeS-select',
    wrapModeTProp: '.wrapModeT-prop',
    wrapModeTSelect: '.wrapModeT-select',
    warnWords: '.warn-words',
};

/**
 * attribute corresponds to the edit element
 */
const Elements = {
    anisotropy: {
        ready() {
            const panel = this;

            panel.$.anisotropyInput.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.anisotropy = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            panel.$.anisotropyInput.value = panel.userData.anisotropy;

            panel.updateInvalid(panel.$.anisotropyInput, 'anisotropy');
            panel.updateReadonly(panel.$.anisotropyInput);
        },
    },
    minfilter: {
        ready() {
            const panel = this;

            panel.$.minfilterSelect.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.minfilter = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['nearest', 'linear'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type}</option>`;
            });
            panel.$.minfilterSelect.innerHTML = optionsHtml;

            panel.$.minfilterSelect.value = panel.userData.minfilter;

            panel.updateInvalid(panel.$.minfilterSelect, 'minfilter');
            panel.updateReadonly(panel.$.minfilterSelect);
        },
    },
    magfilter: {
        ready() {
            const panel = this;

            panel.$.magfilterSelect.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.magfilter = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['nearest', 'linear'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type}</option>`;
            });
            panel.$.magfilterSelect.innerHTML = optionsHtml;

            panel.$.magfilterSelect.value = panel.userData.magfilter;

            panel.updateInvalid(panel.$.magfilterSelect, 'magfilter');
            panel.updateReadonly(panel.$.magfilterSelect);
        },
    },
    mipfilter: {
        ready() {
            const panel = this;

            panel.$.mipfilterSelect.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.mipfilter = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['nearest', 'linear', 'none'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type}</option>`;
            });
            panel.$.mipfilterSelect.innerHTML = optionsHtml;

            panel.$.mipfilterSelect.value = panel.userData.mipfilter;

            panel.updateInvalid(panel.$.mipfilterSelect, 'mipfilter');
            panel.updateReadonly(panel.$.mipfilterSelect);
        },
    },
    wrapModeS: {
        ready() {
            const panel = this;

            panel.$.wrapModeSSelect.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.wrapModeS = event.target.value;
                });
                Elements.warnWords.update.call(panel);
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['repeat', 'clamp-to-edge', 'mirrored-repeat'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type}</option>`;
            });
            panel.$.wrapModeSSelect.innerHTML = optionsHtml;

            panel.$.wrapModeSSelect.value = panel.userData.wrapModeS;

            panel.updateInvalid(panel.$.wrapModeSSelect, 'wrapModeS');
            panel.updateReadonly(panel.$.wrapModeSSelect);
        },
    },
    wrapModeT: {
        ready() {
            const panel = this;

            panel.$.wrapModeTSelect.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.wrapModeT = event.target.value;
                });
                Elements.warnWords.update.call(panel);
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['repeat', 'clamp-to-edge', 'mirrored-repeat'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type}</option>`;
            });
            panel.$.wrapModeTSelect.innerHTML = optionsHtml;

            panel.$.wrapModeTSelect.value = panel.userData.wrapModeT;

            panel.updateInvalid(panel.$.wrapModeTSelect, 'wrapModeT');
            panel.updateReadonly(panel.$.wrapModeTSelect);
        },
    },
    /**
     * Condition check: whether the width and height of the image is a power of 2
     * A warning message is required if the wrap mode value is repeat.
     */
    warnWords: {
        ready() {
            this.$.image = document.createElement('ui-image');

            this.$.image.$img.addEventListener('load', () => {
                Elements.warnWords.update.call(this);
            });
        },
        update() {
            const panel = this;

            this.$.image.value = panel.asset.uuid;

            let isUnlegalWrapModeT = false;
            let isUnlegalWrapModeS = false;

            if (panel.$.image.$img.src) {
                const { naturalWidth, naturalHeight } = panel.$.image.$img;
                const { wrapModeT, wrapModeS } = panel.userData;

                // Determine the power of 2 algorithm: (number & number - 1) === 0
                const isUnlegal = naturalWidth & (naturalWidth - 1) || naturalHeight & (naturalHeight - 1);

                isUnlegalWrapModeT = isUnlegal && wrapModeT === 'repeat';
                isUnlegalWrapModeS = isUnlegal && wrapModeS === 'repeat';
            }

            if (isUnlegalWrapModeT || isUnlegalWrapModeS) {
                this.$.warnWords.style.display = 'block';
                this.$.wrapModeSProp.classList.add('warn');
                this.$.wrapModeTProp.classList.add('warn');
            } else {
                this.$.warnWords.style.display = 'none';
                this.$.wrapModeSProp.classList.remove('warn');
                this.$.wrapModeTProp.classList.remove('warn');
            }
        },
    },
};

exports.Elements = Elements;

/**
 * Method of initializing the panel
 */
exports.ready = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

exports.methods = {
    /**
     * Update whether a data is editable in multi-select state
     */
    updateInvalid(element, prop) {
        const invalid = this.userDataList.some((userData) => {
            return userData[prop] !== this.userData[prop];
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
};
