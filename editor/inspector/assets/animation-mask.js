exports.template = `
<section class="asset-animation-mask">
    <div class="header">
        <ui-button class="import">
            <ui-icon value="import"></ui-icon>
            <ui-label value="i18n:ENGINE.assets.animationMask.importSkeleton"></ui-label>
        </ui-button>
    </div>
    <div class="content">
        <ui-tree class="tree"></ui-tree>
    </div>
</section>
`;

exports.methods = {
    updateReadonly(element) {
        if (this.asset.readonly) {
            element.setAttribute('disabled', true);
        } else {
            element.removeAttribute('disabled');
        }
    },
    async query(uuid) {
        this.queryData = await Editor.Message.request('scene', 'query-animation-mask', uuid);
        this.updateTree();
    },
    async apply() {
        this.reset();
        await Editor.Message.request('scene', 'apply-animation-mask', this.asset.uuid);
    },
    reset() {
        this.dirtyData.origin = this.dirtyData.realtime;
        this.dirtyData.uuid = '';
    },
    async dataChange() {
        await Editor.Message.request('scene', 'change-animation-mask', {
            method: 'change-dump',
            dump: this.queryData,
        });

        this.setDirtyData();
        this.dispatch('change');
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

    /**
     * Detection of data changes only determines the currently selected technique
     */
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
        for (const key of keys) {
            // 一级根路径
            if (key.indexOf('/') === -1) {
                treeDataFromFlatData(treeData, flatData[key].children);
            }
        }

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

    updateTree() {
        const convertData = this.convertData(this.queryData._jointMasks.value);
        this.flatData = convertData.flatData;
        this.$.tree.tree = convertData.treeData;
    },
};

exports.$ = {
    container: '.asset-animation-mask',
    import: '.import',
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
}

.content {
    flex: 1;
    margin-top: 10px;
}

.content .tree {
    height: 100%;
}

.header .import {
    display: block;
    text-align: center;
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
            droppable: 'cc.Skeleton',
            events: {
                async confirm(uuid) {
                    panel.queryData = await Editor.Message.request('scene', 'change-animation-mask', {
                        method: 'import-skeleton',
                        uuid,
                    });

                    panel.updateTree();
                    panel.setDirtyData();
                    panel.dispatch('change');
                },
            },
        });
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
        $left.$checkbox.addEventListener('click', (event) => {
            const key = $left.data.detail.key;
            const origin = panel.flatData[key].origin;
            panel.jointEnableChange(key, !origin.value.enabled.value, event.altKey);
            panel.dataChange();
            panel.$.tree.render();
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
        this.$.container.innerText = '';
        return;
    }

    if (this.dirtyData.uuid !== this.asset.uuid) {
        this.dirtyData.uuid = this.asset.uuid;
        this.dirtyData.origin = '';
    }

    await this.query(this.asset.uuid);

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
