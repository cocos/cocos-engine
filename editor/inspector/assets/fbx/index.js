'use strict';
const path = require('path');
const { injectionStyle } = require('../../utils/prop');

const defaultActiveTab = 'animation';
let cacheActiveTab = defaultActiveTab;

exports.template = /* html */`
<div class="asset-fbx">
    <header class="header">
        <ui-tab class="tabs"></ui-tab>
    </header>
    <div class="content">
        <ui-panel class="tab-panel"></ui-panel>
    </div>
</div>
`;

exports.style = /* css */`
.asset-fbx {
    display: flex;
    flex: 1;
    flex-direction: column;
}

.asset-fbx > .header {
    padding: 8px 4px;
}
.asset-fbx > .header > .tabs {
    height: 24px;
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

const Elements = {
    tabs: {
        ready() {
            const panel = this;

            panel.$.tabs.addEventListener('change', () => {
                cacheActiveTab = panel.activeTab = panel.tabs[panel.$.tabs.value];
                Elements.tabPanel.update.call(panel);
            });

            panel.activeTab = cacheActiveTab;
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
                button.setAttribute('size', 'medium');
                panel.$.tabs.appendChild(button);

                const label = document.createElement('ui-label');
                button.appendChild(label);
                label.setAttribute('value', `i18n:ENGINE.assets.fbx.${tab}`);
            });

            panel.$.tabs.value = panel.tabs.indexOf(panel.activeTab);
        },
    },
    tabPanel: {
        ready() {
            const panel = this;

            panel.$.tabPanel.injectionStyle(injectionStyle);

            panel.$.tabPanel.addEventListener('change', () => {
                panel.dispatch('change');
            });
            panel.$.tabPanel.addEventListener('snapshot', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;
            panel.$.tabPanel.setAttribute('src', Components[panel.activeTab]);
            panel.$.tabPanel.update(panel.assetList, panel.metaList);

            // Delay, waiting for the fbx preview area initialization to complete
            setTimeout(() => {
                Editor.Message.broadcast('fbx-inspector:change-tab', panel.activeTab);
            });
        },
    },
};

exports.methods = {
    apply() {
        Editor.Message.broadcast('fbx-inspector:apply');
    },
};

exports.listeners = {
    track(event) {
        if (event.args?.length) {
            const { prop, value } = event.args[0];
            if (!value) { return; } // 只有被勾选的时候上报埋点

            const trackMap = {
                meshSimplify: 'A100000',
                'fbx.smartMaterialEnabled': 'A100001',
                disableMeshSplit: 'A100002',
            };
            const trackId = trackMap[prop];
            if (trackId) {
                Editor.Metrics._trackEventWithTimer({
                    category: 'importSystem',
                    id: trackId,
                    value: 1,
                });
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
