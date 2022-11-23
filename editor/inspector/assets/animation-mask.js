'use strict';

const { updateElementReadonly } = require('../utils/assets');

exports.template = /* html */`
<section class="asset-animation-mask">
    <div class="header">
        <ui-button class="import">
            <ui-icon value="import"></ui-icon>
            <ui-label value="i18n:ENGINE.assets.animationMask.importSkeleton"></ui-label>
        </ui-button>
        <ui-button class="clear">
            <ui-icon value="del" color="true"></ui-icon>
            <ui-label value="i18n:ENGINE.assets.animationMask.clearAllNodes"></ui-label>
        </ui-button>
    </div>
    <div class="content">
        <ui-tree class="tree"></ui-tree>
    </div>
    <ui-label class="multiple-warn-tip" value="i18n:ENGINE.assets.multipleWarning"></ui-label>
</section>
`;

exports.style = /* css */`
.asset-animation-mask {
    display: flex;
    height: 100%;
    flex-direction: column;
}

.asset-animation-mask[multiple-invalid] > *:not(.multiple-warn-tip) {
    display: none!important;
 }

 .asset-animation-mask[multiple-invalid] > .multiple-warn-tip {
    display: block;
 }

.asset-animation-mask .multiple-warn-tip {
    display: none;
    text-align: center;
    color: var(--color-focus-contrast-weakest);
}

.asset-animation-mask > .header {
    margin-top: 10px;
    display: flex;
}

.asset-animation-mask > .header ui-button {
    text-align: center;
}

.asset-animation-mask > .header .import {
    flex: 1;
    margin-left: 10px;
}

.asset-animation-mask > .header .clear {
    margin-left: 10px;
}

.asset-animation-mask > .content {
    flex: 1;
    margin-top: 10px;
}

.asset-animation-mask > .content .tree {
    height: 100%;
}
`;

exports.$ = {
    container: '.asset-animation-mask',
    import: '.import',
    clear: '.clear',
    tree: '.tree',
};

exports.methods = {
    record() {
        return JSON.stringify(this.queryData);
    },

    async restore(record) {
        record = JSON.parse(record);
        if (!record || typeof record !== 'object') {
            return false;
        }

        await this.change(record);
        return true;
    },

    async query(uuid) {
        return await Editor.Message.request('scene', 'query-animation-mask', uuid);
    },

    async apply() {
        this.reset();
        await Editor.Message.request('scene', 'apply-animation-mask', this.asset.uuid);
    },

    reset() {
        this.dirtyData.uuid = '';
    },

    async clear() {
        this.queryData = await Editor.Message.request('scene', 'change-animation-mask', {
            method: 'clear-nodes',
            uuid: this.asset.uuid,
        });

        this.changed();
    },
    async import(info) {
        this.queryData = await Editor.Message.request('scene', 'change-animation-mask', {
            method: 'import-skeleton',
            uuid: info.redirect.uuid,
        });

        this.changed();
    },

    async change(dump) {
        this.queryData = await Editor.Message.request('scene', 'change-animation-mask', {
            method: 'change-dump',
            dump,
        });

        this.changed();
    },

    changed() {
        this.updateInterface();
        this.setDirtyData();

        this.dispatch('change');

        /**
         * 由于编辑项中不需要区分 change 和 confirm 的情况，
         * 所以可以在 change 后 snapshot
         */
        this.dispatch('snapshot');
    },

    updateInterface() {
        const convertData = this.convertData(this.queryData.joints.value);
        this.flatData = convertData.flatData;
        this.$.tree.tree = convertData.treeData;

        updateElementReadonly.call(this, this.$.import);
        updateElementReadonly.call(this, this.$.clear);
        updateElementReadonly.call(this, this.$.tree);
    },

    setDirtyData() {
        this.dirtyData.realtime = JSON.stringify(this.queryData);

        if (!this.dirtyData.origin) {
            this.dirtyData.origin = this.dirtyData.realtime;
        }
    },

    isDirty() {
        const isDirty = this.dirtyData.origin !== this.dirtyData.realtime;
        return isDirty;
    },

    convertData(jointArr) {
        const collator = new Intl.Collator('en', {
            numeric: true,
            sensitivity: 'base',
        });

        jointArr.sort((a, b) => {
            return collator.compare(a.value.path.value, b.value.path.value);
        });

        const flatData = {};

        for (const joint of jointArr) {
            const key = joint.value.path.value;
            if (!key) {
                continue;
            }

            let childKey = key;
            let parentKey = childKey.substr(0, childKey.lastIndexOf('/'));
            while (parentKey) {
                if (!flatData[parentKey]) {
                    flatData[parentKey] = { children: [childKey] };
                } else {
                    if (!flatData[parentKey].children.includes(childKey)) {
                        flatData[parentKey].children.push(childKey);
                    }
                }

                childKey = parentKey;
                parentKey = childKey.substr(0, childKey.lastIndexOf('/'));
            }

            if (!flatData[key]) {
                flatData[key] = { origin: joint, children: [] };
            } else {
                flatData[key].origin = joint;
            }
        }

        const treeData = [];
        const keys = Object.keys(flatData);
        keys.sort((a, b) => {
            return collator.compare(a, b);
        });

        const roots = [];
        for (const key of keys) {
            // 一级根路径
            if (key.indexOf('/') === -1) {
                roots.push(key);
            }
        }

        treeDataFromFlatData(treeData, roots);

        function treeDataFromFlatData(treeArr, keys) {
            if (!Array.isArray(keys)) {
                return;
            }

            keys.forEach((key) => {
                const { origin, children } = flatData[key];

                const treeNode = {
                    detail: {
                        key,
                        name: key.substr(key.lastIndexOf('/') + 1),
                        disabled: true,
                    },
                    children: [],
                };

                if (origin) {
                    treeNode.detail.disabled = false;
                }

                treeArr.push(treeNode);

                treeDataFromFlatData(treeNode.children, children);
            });
        }

        return { flatData, treeData };
    },

    jointEnableChange(key, checked, loop) {
        const { children, origin } = this.flatData[key];
        origin.value.enabled.value = checked;

        if (loop) {
            children.forEach((childKey) => {
                this.jointEnableChange(childKey, checked, loop);
            });
        }
    },
};

exports.ready = function() {
    const panel = this;

    panel.$.import.addEventListener('change', (event) => {
        const rawTimestamp = Date.now();
        Editor.Panel._kitControl.open({
            $kit: event.target,
            name: 'ui-kit.searcher',
            timestamp: rawTimestamp,
            type: 'asset',
            assetFilter: {
                importer: ['fbx', 'gltf'],
            },
            events: {
                async confirm(uuid) {
                    const info = await Editor.Message.request('asset-db', 'query-asset-info', uuid);
                    if (!info || !info.redirect || info.redirect.type !== 'cc.Prefab') {
                        console.error(Editor.I18n.t('ENGINE.assets.animationMask.illegalFbx') + ` {asset(${uuid})}`);
                        return;
                    }

                    await panel.import(info);
                },
            },
        });
    });

    panel.$.clear.addEventListener('change', async () => {
        const result = await Editor.Dialog.warn(Editor.I18n.t('ENGINE.assets.animationMask.clearAllNodesWarn'), {
            title: Editor.I18n.t('ENGINE.assets.animationMask.clearAllNodes'),
            buttons: [Editor.I18n.t('ENGINE.dialog.confirm'), Editor.I18n.t('ENGINE.dialog.cancel')],
            default: 0,
            cancel: 1,
        });

        if (result.response === 0) {
            await this.clear();
        }
    });

    // Used to determine whether the material has been modified in isDirty()
    panel.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };

    panel.$.tree.setTemplate('left', '<ui-checkbox tooltip="i18n:ENGINE.assets.animationMask.nodeEnableTip"></ui-checkbox>');
    panel.$.tree.setTemplateInit('left', ($left) => {
        $left.$checkbox = $left.querySelector('ui-checkbox');
        $left.$checkbox.addEventListener('click', async (event) => {
            const key = $left.data.detail.key;
            const origin = panel.flatData[key].origin;
            panel.jointEnableChange(key, !origin.value.enabled.value, !event.altKey);

            await panel.change(this.queryData);
        });
    });
    panel.$.tree.setRender('left', ($left) => {
        const { key, disabled } = $left.data.detail;

        if (disabled) {
            $left.$checkbox.setAttribute('disabled', true);
            $left.$checkbox.value = true;
        } else {
            $left.$checkbox.removeAttribute('disabled');
        }

        const origin = panel.flatData[key].origin;
        if (origin) {
            $left.$checkbox.value = origin.value.enabled.value;
        }
    });

    panel.$.tree.setTemplate('text', `<span class="name"></span>`);
    panel.$.tree.setTemplateInit('text', ($text) => {
        $text.$name = $text.querySelector('.name');
    });
    panel.$.tree.setRender('text', ($text, data) => {
        $text.$name.innerHTML = data.detail.name || data.detail.root;
    });
};

exports.update = async function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    if (assetList.length > 1) {
        this.$.container.setAttribute('multiple-invalid', '');
        return;
    } else {
        this.$.container.removeAttribute('multiple-invalid');
    }

    if (this.dirtyData.uuid !== this.asset.uuid) {
        this.dirtyData.uuid = this.asset.uuid;
        this.dirtyData.origin = '';
    }

    this.queryData = await this.query(this.asset.uuid);

    this.updateInterface();
    this.setDirtyData();
};

exports.close = function() {
    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };
};
