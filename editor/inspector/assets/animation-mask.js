exports.template = `
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
</section>
`;

exports.methods = {
    record() {
        return JSON.stringify(this.queryData);
    },

    async restore(record) {
        record = JSON.parse(record);
        if (!record || typeof record !== 'object') {
            return false;
        }

        this.queryData = await Editor.Message.request('scene', 'change-animation-mask', {
            method: 'change-dump',
            dump: record,
        });
        await this.changed({ snapshot: false });
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
    async changed(state) {
        this.updateInterface();
        this.setDirtyData();

        this.dispatch('change', state);
    },

    updateInterface() {
        const convertData = this.convertData(this.queryData.joints.value);
        this.flatData = convertData.flatData;
        this.$.tree.tree = convertData.treeData;


        this.updateReadonly(this.$.import);
        this.updateReadonly(this.$.clear);
        this.updateReadonly(this.$.tree);
    },

    updateReadonly(element) {
        if (this.asset.readonly) {
            element.setAttribute('disabled', true);
        } else {
            element.removeAttribute('disabled');
        }
    },

    /**
     * Detection of data changes only determines the currently selected technique
     */
    setDirtyData() {
        this.dirtyData.realtime = JSON.stringify(this.queryData);

        if (!this.dirtyData.origin) {
            this.dirtyData.origin = this.dirtyData.realtime;

            this.dispatch('snapshot');
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

exports.$ = {
    container: '.asset-animation-mask',
    import: '.import',
    clear: '.clear',
    tree: '.tree',
};

exports.style = `
.asset-animation-mask {
    display: flex;
    height: 100%;
    flex-direction: column;
}

.header {
    margin-top: 10px;
    display: flex;
}

.header ui-button {
    flex: 1;
    text-align: center;
}

.header .clear {
    margin-left: 10px;
}

.content {
    flex: 1;
    margin-top: 10px;
}

.content .tree {
    height: 100%;
}
`;

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
                    panel.queryData = await Editor.Message.request('scene', 'change-animation-mask', {
                        method: 'import-skeleton',
                        uuid: info.redirect.uuid,
                    });

                    panel.changed();
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
            panel.queryData = await Editor.Message.request('scene', 'change-animation-mask', {
                method: 'clear-nodes',
                uuid: this.asset.uuid,
            });

            this.changed();
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

            panel.queryData = await Editor.Message.request('scene', 'change-animation-mask', {
                method: 'change-dump',
                dump: panel.queryData,
            });

            panel.changed();
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

    if (assetList.length !== 1) {
        this.$.container.innerText = Editor.I18n.t('ENGINE.assets.multipleWarning');
        return;
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
