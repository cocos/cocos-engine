'use strict';

const { updateElementReadonly, updateElementInvalid } = require('../utils/assets');

exports.template = /* html */`
<div class="asset-sprite-frame">
    <div class="content">
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.packable" tooltip="i18n:ENGINE.assets.spriteFrame.packableTip"></ui-label>
            <ui-checkbox slot="content" class="packable-checkbox"></ui-checkbox>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.rotated" tooltip="i18n:ENGINE.assets.spriteFrame.rotatedTip"></ui-label>
            <ui-checkbox slot="content" disabled class="rotated-checkbox"></ui-checkbox>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.offsetX" tooltip="i18n:ENGINE.assets.spriteFrame.offsetXTip"></ui-label>
            <ui-num-input slot="content" disabled class="offsetX-input" step="1"></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.offsetY" tooltip="i18n:ENGINE.assets.spriteFrame.offsetYTip"></ui-label>
            <ui-num-input slot="content" disabled class="offsetY-input"></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.trimType" tooltip="i18n:ENGINE.assets.spriteFrame.trimTypeTip"></ui-label>
            <ui-select slot="content" class="trimType-select"></ui-select>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.trimThreshold" tooltip="i18n:ENGINE.assets.spriteFrame.trimThresholdTip"></ui-label>
            <ui-num-input slot="content" class="trimThreshold-input" step="1"></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.trimX" tooltip="i18n:ENGINE.assets.spriteFrame.trimXTip"></ui-label>
            <ui-num-input slot="content" class="trimX-input" step="1"></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.trimY" tooltip="i18n:ENGINE.assets.spriteFrame.trimYTip"></ui-label>
            <ui-num-input slot="content" class="trimY-input"></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.width" tooltip="i18n:ENGINE.assets.spriteFrame.widthTip"></ui-label>
            <ui-num-input slot="content" class="width-input" step="1"></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.height" tooltip="i18n:ENGINE.assets.spriteFrame.heightTip"></ui-label>
            <ui-num-input slot="content" class="height-input"step="1"></ui-num-input>
        </ui-prop>
        <ui-section expand>
            <ui-label slot="header" value="Mesh Options"></ui-label>
                <div class="mesh">
                    <ui-prop>
                        <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.meshType" tooltip="i18n:ENGINE.assets.spriteFrame.meshTypeTip"></ui-label>
                        <ui-select slot="content" class="meshType-select"></ui-select>
                    </ui-prop>
                    <ui-prop>
                        <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.pixelsToUnit" tooltip="i18n:ENGINE.assets.spriteFrame.pixelsToUnitTip"></ui-label>
                        <ui-num-input slot="content" class="pixelsToUnit-input" min="0" step="1"></ui-num-input>
                    </ui-prop>
                    <ui-prop>
                        <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.pivotX" tooltip="i18n:ENGINE.assets.spriteFrame.pivotXTip"></ui-label>
                        <ui-num-input slot="content" class="pivotX-input"></ui-num-input>
                    </ui-prop>
                    <ui-prop>
                        <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.pivotY" tooltip="i18n:ENGINE.assets.spriteFrame.pivotYTip"></ui-label>
                        <ui-num-input slot="content" class="pivotY-input"></ui-num-input>
                    </ui-prop>
                </div>
            </ui-section>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.borderTop" tooltip="i18n:ENGINE.assets.spriteFrame.borderTopTip"></ui-label>
            <ui-num-input slot="content" class="borderTop-input" min="0" step="1"></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.borderBottom" tooltip="i18n:ENGINE.assets.spriteFrame.borderBottomTip"></ui-label>
            <ui-num-input slot="content" class="borderBottom-input" min="0"step="1"></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.borderLeft" tooltip="i18n:ENGINE.assets.spriteFrame.borderLeftTip"></ui-label>
            <ui-num-input slot="content" class="borderLeft-input" min="0" step="1"></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.spriteFrame.borderRight" tooltip="i18n:ENGINE.assets.spriteFrame.borderRightTip"></ui-label>
            <ui-num-input slot="content" class="borderRight-input" min="0" step="1"></ui-num-input>
        </ui-prop>
        <div class="edit-row">
            <ui-button tabindex="0" class="edit-button" size="medium">
                <ui-label value="i18n:ENGINE.assets.spriteFrame.edit"></ui-label>
            </ui-button>
        </div>
    </div>
</div>
`;

exports.style = /* css */`
    .asset-sprite-frame {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding-right: 4px;

     }
    .asset-sprite-frame > .content {
        flex: 1;
    }
    .asset-sprite-frame > .content > .edit-row {
        text-align: center;
        margin-top: 16px;
        margin-bottom: 16px;
    }
    .asset-sprite-frame > .content > .edit-row > .edit-button {
        padding: 0 24px;
    }
`;

exports.$ = {
    container: '.asset-sprite-frame',
    packableCheckbox: '.packable-checkbox',
    rotatedCheckbox: '.rotated-checkbox',
    offsetXInput: '.offsetX-input',
    offsetYInput: '.offsetY-input',
    trimTypeSelect: '.trimType-select',
    trimThresholdInput: '.trimThreshold-input',
    trimXInput: '.trimX-input',
    trimYInput: '.trimY-input',
    widthInput: '.width-input',
    heightInput: '.height-input',
    borderTopInput: '.borderTop-input',
    borderBottomInput: '.borderBottom-input',
    borderLeftInput: '.borderLeft-input',
    borderRightInput: '.borderRight-input',
    editButton: '.edit-button',
    pixelsToUnitInput: '.pixelsToUnit-input',
    pivotXInput: '.pivotX-input',
    pivotYInput: '.pivotY-input',
    meshTypeSelect: '.meshType-select',
};


const Elements = {
    packable: {
        ready() {
            const panel = this;

            panel.$.packableCheckbox.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.packable = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.packableCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.packableCheckbox.value = panel.meta.userData.packable;

            updateElementInvalid.call(panel, panel.$.packableCheckbox, 'packable');
            updateElementReadonly.call(panel, panel.$.packableCheckbox);
        },
    },
    rotated: {
        ready() {
            const panel = this;

            panel.$.rotatedCheckbox.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.rotated = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.rotatedCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.rotatedCheckbox.value = panel.meta.userData.rotated;

            updateElementInvalid.call(panel, panel.$.rotatedCheckbox, 'rotated');
            updateElementReadonly.call(panel, panel.$.rotatedCheckbox);
        },
    },
    offsetX: {
        ready() {
            const panel = this;

            panel.$.offsetXInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.offsetX = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.offsetXInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.offsetXInput.value = panel.meta.userData.offsetX;

            updateElementInvalid.call(panel, panel.$.offsetXInput, 'offsetX');
            updateElementReadonly.call(panel, panel.$.offsetXInput);
        },
    },
    offsetY: {
        ready() {
            const panel = this;

            panel.$.offsetYInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.offsetY = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.offsetYInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.offsetYInput.value = panel.meta.userData.offsetY;

            updateElementInvalid.call(panel, panel.$.offsetYInput, 'offsetY');
            updateElementReadonly.call(panel, panel.$.offsetYInput);
        },
    },
    trimType: {
        ready() {
            const panel = this;

            panel.$.trimTypeSelect.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.trimType = event.target.value;
                });
                panel.dispatch('change');

                // Other items have a large number of updates that depend on it, so the whole update is used once
                for (const prop in Elements) {
                    const element = Elements[prop];
                    if (element.update) {
                        element.update.call(this);
                    }
                }
            });

            panel.$.trimTypeSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['auto', 'custom', 'none'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type}</option>`;
            });
            panel.$.trimTypeSelect.innerHTML = optionsHtml;

            panel.$.trimTypeSelect.value = panel.meta.userData.trimType;

            updateElementInvalid.call(panel, panel.$.trimTypeSelect, 'trimType');
            updateElementReadonly.call(panel, panel.$.trimTypeSelect);
        },
    },
    trimThreshold: {
        ready() {
            const panel = this;

            panel.$.trimThresholdInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.trimThreshold = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.trimThresholdInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.trimThresholdInput.value = panel.meta.userData.trimThreshold;

            updateElementInvalid.call(panel, panel.$.trimThresholdInput, 'trimThreshold');
            updateElementReadonly.call(panel, panel.$.trimThresholdInput);
        },
    },
    trimX: {
        ready() {
            const panel = this;

            panel.$.trimXInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.trimX = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.trimXInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.trimXInput.value = panel.meta.userData.trimX;

            updateElementInvalid.call(panel, panel.$.trimXInput, 'trimX');
            panel.updateReadonlyCustom(panel.$.trimXInput);
        },
    },
    trimY: {
        ready() {
            const panel = this;

            panel.$.trimYInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.trimY = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.trimYInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.trimYInput.value = panel.meta.userData.trimY;

            updateElementInvalid.call(panel, panel.$.trimYInput, 'trimY');
            panel.updateReadonlyCustom(panel.$.trimYInput);
        },
    },
    width: {
        ready() {
            const panel = this;

            panel.$.widthInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.width = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.widthInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.widthInput.value = panel.meta.userData.width;

            updateElementInvalid.call(panel, panel.$.widthInput, 'width');
            panel.updateReadonlyCustom(panel.$.widthInput);
        },
    },
    height: {
        ready() {
            const panel = this;

            panel.$.heightInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.height = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.heightInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.heightInput.value = panel.meta.userData.height;

            updateElementInvalid.call(panel, panel.$.heightInput, 'height');
            panel.updateReadonlyCustom(panel.$.heightInput);
        },
    },
    borderTop: {
        ready() {
            const panel = this;

            panel.$.borderTopInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.borderTop = event.target.value;
                });
                panel.dispatch('change');
                Editor.Message.send('inspector', 'sprite-keys', panel.meta);
            });

            panel.$.borderTopInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.borderTopInput.value = panel.meta.userData.borderTop;

            updateElementInvalid.call(panel, panel.$.borderTopInput, 'borderTop');
            updateElementReadonly.call(panel, panel.$.borderTopInput);

            panel.$.borderTopInput.setAttribute('max', this.meta.userData.height - this.meta.userData.borderBottom);
        },
    },
    borderBottom: {
        ready() {
            const panel = this;

            panel.$.borderBottomInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.borderBottom = event.target.value;
                });
                panel.dispatch('change');
                Editor.Message.send('inspector', 'sprite-keys', panel.meta);
            });

            panel.$.borderBottomInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.borderBottomInput.value = panel.meta.userData.borderBottom;

            updateElementInvalid.call(panel, panel.$.borderBottomInput, 'borderBottom');
            updateElementReadonly.call(panel, panel.$.borderBottomInput);

            panel.$.borderBottomInput.setAttribute('max', this.meta.userData.height - this.meta.userData.borderTop);
        },
    },
    borderLeft: {
        ready() {
            const panel = this;

            panel.$.borderLeftInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.borderLeft = event.target.value;
                });
                panel.dispatch('change');
                Editor.Message.send('inspector', 'sprite-keys', panel.meta);
            });

            panel.$.borderLeftInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.borderLeftInput.value = panel.meta.userData.borderLeft;

            updateElementInvalid.call(panel, panel.$.borderLeftInput, 'borderLeft');
            updateElementReadonly.call(panel, panel.$.borderLeftInput);

            panel.$.borderLeftInput.setAttribute('max', this.meta.userData.width - this.meta.userData.borderRight);
        },
    },
    borderRight: {
        ready() {
            const panel = this;

            panel.$.borderRightInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.borderRight = event.target.value;
                });
                panel.dispatch('change');
                Editor.Message.send('inspector', 'sprite-keys', panel.meta);
            });

            panel.$.borderRightInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.borderRightInput.value = panel.meta.userData.borderRight;

            updateElementInvalid.call(panel, panel.$.borderRightInput, 'borderRight');
            updateElementReadonly.call(panel, panel.$.borderRightInput);

            panel.$.borderRightInput.setAttribute('max', this.meta.userData.width - this.meta.userData.borderLeft);
        },
    },
    editButton: {
        ready() {
            const panel = this;

            panel.$.editButton.addEventListener('change', (event) => {
                event.stopPropagation();

                Editor.Panel.open('inspector.sprite-editor', {
                    asset: panel.asset,
                    meta: panel.meta,
                });
            });

            this.updateFromBroadcastBind = this.updateFromBroadcast.bind(panel);
            Editor.Message.addBroadcastListener('sprite-editor:changed', panel.updateFromBroadcastBind);
        },
        update() {
            const panel = this;

            updateElementReadonly.call(panel, panel.$.editButton);

            if (panel.assetList.length > 1) {
                panel.$.editButton.style.display = 'none';
            } else {
                panel.$.editButton.style.display = ''; // depends on component itself
            }

            if (panel.uuidInSpriteEditor !== panel.meta.uuid) {
                panel.uuidInSpriteEditor = panel.meta.uuid;
                Editor.Message.send('inspector', 'sprite-keys', panel.meta);
            }
        },
        close() {
            const panel = this;

            Editor.Message.removeBroadcastListener('sprite-editor:changed', panel.updateFromBroadcastBind);
        },
    },
    pixelsToUnit: {
        ready() {
            const panel = this;

            panel.$.pixelsToUnitInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.pixelsToUnit = event.target.value;
                });
                panel.dispatch('change');
                Editor.Message.send('inspector', 'sprite-keys', panel.meta);
            });

            panel.$.pixelsToUnitInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.pixelsToUnitInput.value = panel.meta.userData.pixelsToUnit;

            updateElementInvalid.call(panel, panel.$.pixelsToUnitInput, 'pixelsToUnit');
            updateElementReadonly.call(panel, panel.$.pixelsToUnitInput);
        },
    },
    pivotX: {
        ready() {
            const panel = this;

            panel.$.pivotXInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.pivotX = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.pivotXInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.pivotXInput.value = panel.meta.userData.pivotX;

            updateElementInvalid.call(panel, panel.$.pivotXInput, 'pivotX');
            updateElementReadonly.call(panel, panel.$.pivotXInput);
        },
    },
    pivotY: {
        ready() {
            const panel = this;

            panel.$.pivotYInput.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.pivotY = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.pivotYInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.pivotYInput.value = panel.meta.userData.pivotY;

            updateElementInvalid.call(panel, panel.$.pivotYInput, 'pivotY');
            updateElementReadonly.call(panel, panel.$.pivotYInput);
        },
    },
    meshType: {
        ready() {
            const panel = this;

            panel.$.meshTypeSelect.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.meshType = Number(event.target.value);
                });
                panel.dispatch('change');
            });

            panel.$.meshTypeSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            // const types = ['rect', 'polygon']; // polygon is not ready
            const types = ['rect'];
            types.forEach((name, index) => {
                optionsHtml += `<option value="${index}">${name}</option>`;
            });
            panel.$.meshTypeSelect.innerHTML = optionsHtml;

            panel.$.meshTypeSelect.value = panel.meta.userData.meshType;

            updateElementInvalid.call(panel, panel.$.meshTypeSelect, 'meshType');
            updateElementReadonly.call(panel, panel.$.meshTypeSelect);
        },
    },
};

exports.methods = {
    /**
     * Update the business-related read-only state
     */
    updateReadonlyCustom(element) {
        const isCustom = this.meta.userData.trimType === 'custom';

        updateElementReadonly.call(this, element, !isCustom || this.asset.readonly);
    },
    /**
     * Data updates from the Kyushu edit panel
     */
    updateFromBroadcast(data) {
        const panel = this;

        if (data.uuid === panel.meta.uuid) {
            for (const prop in data.userData) {
                panel.metaList.forEach((meta) => {
                    meta.userData[prop] = data.userData[prop];
                });
            }
            panel.dispatch('change');
            panel.dispatch('snapshot');
        }

        for (const prop in Elements) {
            const element = Elements[prop];
            if (element.update) {
                element.update.bind(panel)();
            }
        }
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
