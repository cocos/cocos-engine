'use strict';
const path = require('path');

exports.template = `
<div class="asset-fbx">
    <header class="header">
        <ui-tab class="tabs"></ui-tab>
    </header>
    <div class="content">
        <ui-panel class="tab-panel"></ui-panel>
    </div>
</div>
`;

exports.style = `
.asset-fbx {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-top: 5px;
    overflow: hidden;
}

.asset-fbx > .header {
    text-align: center;
    padding-bottom: 10px;
    line-height: calc(var(--size-big-line) * 1px);
}
`;

exports.$ = {
    container: '.asset-fbx',
    header: '.header',
    tabs: '.tabs',
    tabPanel: '.tab-panel',
};

const Components = {
    model: path.join(__dirname, `./model.js`),
    animation: path.join(__dirname, `./animation.js`),
    material: path.join(__dirname, `./material.js`),
    fbx: path.join(__dirname, `./fbx.js`),
};

/**
 * attribute corresponds to the edit element
 */
const Elements = {
    tabs: {
        ready() {
            const panel = this;

            panel.$.tabs.addEventListener('change', () => {
                panel.activeTab = panel.tabs[panel.$.tabs.value];
                Elements.tabPanel.update.call(panel);
            });

            panel.activeTab = 'animation';
        },
        update() {
            const panel = this;

            panel.$.tabs.innerText = '';
            panel.tabs = [];

            for (const tab in Components) {
                if (panel.asset.importer === 'gltf' && tab === 'fbx') {
                    continue;
                }
                panel.tabs.push(tab);
            }

            panel.tabs.forEach((tab) => {
                const button = document.createElement('ui-button');
                panel.$.tabs.appendChild(button);

                const label = document.createElement('ui-label');
                button.appendChild(label);
                label.setAttribute('value', `i18n:inspector.asset.fbx.${tab}`);
            });

            panel.$.tabs.value = panel.tabs.indexOf(panel.activeTab);
        },
    },
    tabPanel: {
        ready() {
            const panel = this;

            panel.$.tabPanel.addEventListener('change', () => {
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;
            Editor.Message.broadcast('fbx-inspector:change-tab', panel.activeTab);
            panel.$.tabPanel.setAttribute('src', Components[panel.activeTab]);
            panel.$.tabPanel.update(panel.assetList, panel.metaList);
        },
    },
};

/**
 * Methods for automatic rendering of components
 * @param assetList
 * @param metaList
 */
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
        const invalid = this.metaList.some((meta) => meta.userData[prop] !== this.meta.userData[prop]);
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
