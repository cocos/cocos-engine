'use strict';

const { materialTechniquePolyfill } = require('../utils/material');
const { setDisabled, setReadonly, setHidden, loopSetAssetDumpDataReadonly } = require('../utils/prop');
const { join, sep, normalize } = require('path');
const cacheDot = '._';

exports.style = `
ui-button.location { flex: none; margin-left: 6px; }
`;

exports.template =
/* html */`
<header class="header">
    <ui-prop>
        <ui-label slot="label">Effect</ui-label>
        <ui-select class="effect" slot="content"></ui-select>
        <ui-button class="location" slot="content">
            <ui-icon value="location"></ui-icon>
        </ui-button>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label">Technique</ui-label>
        <ui-select class="technique" slot="content"></ui-select>
    </ui-prop>
</header>
<section class="customSection">
    <ui-panel class="customPanel"></ui-panel>
</section>
<section class="section">
    <ui-prop class="useInstancing" type="dump"></ui-prop>
    <ui-prop class="useBatching" type="dump"></ui-prop>
</section>
<section class="material-dump"></section>
`;

exports.$ = {
    pass: '.pass',
    header: '.header',
    section: '.section',
    effect: '.effect',
    location: '.location',
    technique: '.technique',
    materialDump: '.material-dump',
    useInstancing: '.useInstancing',
    useBatching: '.useBatching',
    customSection: '.customSection',
    customPanel: '.customPanel',
};

exports.methods = {
    async getCustomInspector() {
        const currentEffectInfo = this._effects.find(effect => { return effect.name === this.material.effect; });
        if (currentEffectInfo && currentEffectInfo.uuid) {
            const meta = await Editor.Message.request('asset-db', 'query-asset-meta', currentEffectInfo.uuid);
            return meta && meta.userData && meta.userData.editor && meta.userData.editor.inspector;
        }
        return '';
    },
    /**
     * Custom Save
     */
    async apply() {
        this.reset();
        await Editor.Message.request('scene', 'apply-material', this.asset.uuid, this.material);
    },

    reset() {
        this.dirtyData.origin = this.dirtyData.realtime;
        this.dirtyData.uuid = '';
        this.cacheData = {};
    },
    /**
     * 
     * @param {string} inspector 
     */
    async updateCustomInspector(inspector) {
        this.$.customPanel.hidden = false;
        this.$.section.hidden = true;
        this.$.materialDump.hidden = true;
        try {
            if (inspector.startsWith('packages://')) {
                const relatePath = normalize(inspector.replace('packages://', ''));
                const name = relatePath.split(sep)[0];
                const packagePath = Editor.Package.getPackages({ name, enable: true })[0].path;
                const path = join(packagePath, relatePath.split(name)[1]);
                if (this.$.customPanel.getAttribute('src') !== path) {
                    this.$.customPanel.setAttribute('src', path);
                }
                this.$.customPanel.update(this.material, this.assetList, this.metaList);
            } else {
                throw Editor.I18n.t('ENGINE.assets.material.illegal-inspector-url');
            }
        } catch (error) {
            console.error(error);
            console.error(Editor.I18n.t('ENGINE.assets.material.fail-to-load-custom-inspector', { effect: this.material.effect }));
            this.updatePasses();
        }
    },
    /**
     * Detection of data changes only determines the currently selected technique
     */
    setDirtyData() {
        this.dirtyData.realtime = JSON.stringify({
            effect: this.material.effect,
            technique: this.material.technique,
            techniqueData: this.material.data[this.material.technique],
        });

        if (!this.dirtyData.origin) {
            this.dirtyData.origin = this.dirtyData.realtime;
        }
    },

    isDirty() {
        const isDirty = this.dirtyData.origin !== this.dirtyData.realtime;
        return isDirty;
    },

    /**
     * Update the pass data that is finally displayed in the panel
     */
    updatePasses() {
        if (this.$.customPanel.hasAttribute('src')) {
            this.$.customPanel.removeAttribute('src');
        }
        this.$.customPanel.hidden = true;
        this.$.section.hidden = false;
        this.$.materialDump.hidden = false;
        // Automatic rendering of content
        // The data in passes is not all the values that need to be rendered
        // So it's sorted here, but that doesn't make sense
        // The logical way to do it would be to return a normal dump when querying for material

        const technique = materialTechniquePolyfill(this.material.data[this.material.technique]);
        this.technique = technique;

        if (!technique || !technique.passes) {
            return;
        }

        this.useCache();

        if (technique.passes) {
            // The interface is not a regular data loop, which needs to be completely cleared and placed, but the UI-prop element is still reusable
            const $container = this.$.materialDump;
            $container.innerText = '';

            if (!$container.$children) {
                $container.$children = {};
            }

            for (let i = 0; i < technique.passes.length; i++) {
                const pass = technique.passes[i];
                // If the propertyIndex is not equal to the current pass index, then do not render
                if (pass.propertyIndex !== undefined && pass.propertyIndex.value !== i) {
                    continue;
                }

                // if asset is readonly
                if (this.asset.readonly) {
                    for (const key in pass.value) {
                        loopSetAssetDumpDataReadonly(pass.value[key]);
                    }
                }

                $container.$children[i] = document.createElement('ui-prop');
                $container.$children[i].setAttribute('type', 'dump');
                $container.$children[i].setAttribute('fold', 'false');
                $container.appendChild($container.$children[i]);
                $container.$children[i].render(pass);

                // Add the checkbox given by the switch attribute
                if (pass.switch && pass.switch.name) {
                    const $checkbox = document.createElement('ui-checkbox');
                    $checkbox.innerText = pass.switch.name;
                    $checkbox.setAttribute('slot', 'header');
                    $checkbox.addEventListener('change', (e) => {
                        pass.switch.value = e.target.value;
                    });
                    setReadonly(this.asset.readonly, $checkbox);
                    $checkbox.value = pass.switch.value;

                    const $section = $container.$children[i].querySelector('ui-section');
                    $section.appendChild($checkbox);

                    const $label = $section.querySelector('ui-label');
                    $label.style.width = 'calc(var(--left-width) - 10px)';
                }

                $container.$children[i].querySelectorAll('ui-prop').forEach(($prop) => {
                    const dump = $prop.dump;
                    if (dump && dump.childMap && dump.children.length) {
                        if (!$prop.$children) {
                            $prop.$children = document.createElement('section');
                            $prop.$children.setAttribute(
                                'style',
                                'border: 1px dashed var(--color-normal-border); padding: 10px; margin: 5px 0;',
                            );

                            for (const childName in dump.childMap) {
                                if (dump.childMap[childName].value === undefined) {
                                    continue;
                                }

                                if (this.asset.readonly) {
                                    loopSetAssetDumpDataReadonly(dump.childMap[childName]);
                                }

                                $prop.$children[childName] = document.createElement('ui-prop');
                                $prop.$children[childName].setAttribute('type', 'dump');
                                $prop.$children[childName].render(dump.childMap[childName]);
                                $prop.$children.appendChild($prop.$children[childName]);
                            }

                            if (Array.from($prop.$children.children).length) {
                                $prop.after($prop.$children);
                            }
                        }

                        if (dump.value) {
                            $prop.$children.removeAttribute('hidden');
                        } else {
                            $prop.$children.setAttribute('hidden', '');
                        }
                    }
                });
            }
        }
    },

    updateInstancing() {
        const technique = this.technique;

        const firstPass = technique.passes[0];
        if (firstPass.childMap.USE_INSTANCING) {
            technique.useInstancing.value = firstPass.childMap.USE_INSTANCING.value;

            if (firstPass.childMap.USE_BATCHING) {
                technique.useBatching.value = firstPass.childMap.USE_BATCHING.value;
                technique.useBatching.visible = !technique.useInstancing.value;
            }

            this.changeInstancing(technique.useInstancing.value);
        }

        if (technique.useInstancing) {
            this.$.useInstancing.render(technique.useInstancing);
            setHidden(technique.useInstancing && !technique.useInstancing.visible, this.$.useInstancing);
            setReadonly(this.asset.readonly, this.$.useInstancing);
        }

        if (technique.useBatching) {
            this.$.useBatching.render(technique.useBatching);
            setHidden(technique.useInstancing.value || (technique.useBatching && !technique.useBatching.visible), this.$.useBatching);
            setReadonly(this.asset.readonly, this.$.useBatching);
        }
    },

    changeInstancing(checked) {
        this.technique.passes.forEach((pass) => {
            if (pass.childMap.USE_INSTANCING) {
                pass.childMap.USE_INSTANCING.value = checked;
            }
        });

        // if Instancing show, Batching hidden
        setHidden(checked, this.$.useBatching);
        if (checked) {
            this.changeBatching(false);
            this.$.useBatching.render(this.technique.useBatching);
        }
    },
    changeBatching(checked) {
        this.technique.passes.forEach((pass) => {
            if (pass.childMap.USE_BATCHING) {
                pass.childMap.USE_BATCHING.value = checked;
            }
        });
    },
    /**
     * Update the options data in technique
     */
    updateTechniqueOptions() {
        let techniqueOption = '';
        this.material.data.forEach((technique, index) => {
            const name = technique.name ? `${index} - ${technique.name}` : index;
            techniqueOption += `<option value="${index}">${name}</option>`;
        });
        this.$.technique.innerHTML = techniqueOption;
    },
    hideAllContent(hide) {
        this.$.header.style = hide ? 'display:none' : '';
        this.$.section.style = hide ? 'display:none' : '';
        this.$.materialDump.style = hide ? 'display:none' : '';
    },

    async updatePreview() {
        await Editor.Message.request('scene', 'preview-material', this.asset.uuid, this.material);
        Editor.Message.broadcast('material-inspector:change-dump');
    },

    storeCache() {
        if (!this.technique || !this.technique.passes) {
            return;
        }

        const excludeNames = [
            'children',
            'name',
            'default',
            'defines',
            'propertyIndex',
            'extends',
            'readonly',
            'visible',
            'displayName',
            'elementTypeData',
            'isArray',
            'isMat',
            'enumList',
            'bitmaskList',
            'enumData',
            'isEnum',
            'isObject',
            'switch',
            'pipelineStates',
            'pro',
        ];

        // Obtain an independent and clear data
        const copyData = JSON.parse(JSON.stringify(this.technique.passes));

        Object.assign(this.cacheData, getKeys(copyData, ''));
        function getKeys(data, prev) {
            return Object.keys(data).reduce((rt, key) => {
                // 这些字段是基础类型或配置性的数据，不需要变动
                if (excludeNames.includes(key)) {
                    return rt;
                }

                const dot = prev.length ? cacheDot : '';
                const keyPath = prev + dot + key;

                if (typeof data[key] === 'object') {
                    Object.assign(rt, getKeys(data[key], keyPath));
                } else {
                    if (keyPath.includes('type') || keyPath.includes('value')) {
                        rt[keyPath] = data[key];
                    }
                }
                return rt;
            }, {});
        }
    },

    useCache() {
        if (!this.technique || !this.technique.passes) {
            return;
        }

        const keyPaths = Object.keys(this.cacheData).sort((a, b) => a.length - b.length);
        let typeIndex = 0;

        // First filter out data with the same field path but inconsistent types
        loopType: for (; typeIndex < keyPaths.length; typeIndex++) {
            const keyPath = keyPaths[typeIndex];

            if (!keyPath) {
                continue loopType;
            }

            const keys = keyPath.split(cacheDot);
            if (keys.length === 0) {
                deleteKeyPaths(keyPath);
                continue loopType;
            }

            let index = 0;
            let target = this.technique.passes;
            let currentKey = '';
            let currentPath = '';
            while (index <= keys.length - 1) {
                if (target === undefined) {
                    deleteKeyPaths(currentPath);
                    continue loopType;
                }

                currentKey = keys[index];
                target = target[currentKey];
                index += 1;
                currentPath = keys.slice(0, index).join(cacheDot);

                if (currentKey === 'type') {
                    deleteKeyPaths(currentPath);
                    if (this.cacheData[currentPath] !== target) {
                        index -= 1;
                        currentPath = keys.slice(0, index).join(cacheDot);
                        deleteKeyPaths(currentPath);
                    }
                    continue loopType;
                }
            }
        }

        // Delete fields that are not suitable for pasting into new data
        function deleteKeyPaths(keyPath, startIndex = typeIndex) {
            if (!keyPath) {
                return;
            }

            for (; startIndex < keyPaths.length; startIndex++) {
                if (startIndex >= 0 && keyPaths[startIndex].startsWith(keyPath)) {
                    keyPaths.splice(startIndex, 1);
                    startIndex--;
                    typeIndex--;
                }
            }
        }

        loopValue: for (const keyPath of keyPaths) {
            const keys = keyPath.split('._');
            if (keys.length === 0) {
                break;
            }

            let index = 0;
            let target = this.technique.passes;
            while (index <= keys.length - 2) {
                if (target === undefined) {
                    continue loopValue;
                }

                target = target[keys[index]];
                index += 1;
            }

            const key = keys[index++];

            if (target && target !== this.technique.passes) {
                if (typeof target === 'object') {
                    if (key in target) {
                        target[key] = this.cacheData[keyPath];
                    }
                }
            }
        }

        // Update the extracted useInstancing and useBatching
        this.updateInstancing();
    },
};

/**
 * Methods for automatic rendering of components
 * @param assetList
 * @param metaList
 */
exports.update = async function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];
    const notOnlyOne = assetList.length !== 1;
    this.hideAllContent(notOnlyOne);
    if (notOnlyOne) {
        return;
    }
    if (!this.dirtyData) {
        return;
    }
    if (this.dirtyData.uuid !== this.asset.uuid) {
        this.dirtyData.uuid = this.asset.uuid;
        this.dirtyData.origin = '';
        this.cacheData = {};
    }
    // set this.material.technique
    this.material = await Editor.Message.request('scene', 'query-material', this.asset.uuid);
    await this.updatePreview();

    // effect <select> tag
    this.$.effect.value = this.material.effect;
    setDisabled(this.asset.readonly, this.$.effect);
    // technique <select> tag
    this.$.technique.value = this.material.technique;
    setDisabled(this.asset.readonly, this.$.technique);

    this.updateTechniqueOptions();
    this.setDirtyData();
    const inspector = await this.getCustomInspector();
    if (inspector) {
        this.updateCustomInspector(inspector);
    } else {
        // optimize calculate speed when edit multiple materials in node mode
        requestIdleCallback(() => {
            this.updatePasses();
        });
    }
};

/**
 * Method of initializing the panel
 */
exports.ready = async function() {
    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };

    // Retain the previously modified data when switching pass
    this.cacheData = {};

    // The event triggered when the content of material is modified
    this.$.materialDump.addEventListener('change-dump', async (event) => {
        const dump = event.target.dump;

        // show its children
        if (dump && dump.childMap && dump.children.length && event.target.$children) {
            if (dump.value) {
                event.target.$children.removeAttribute('hidden');
            } else {
                event.target.$children.setAttribute('hidden', '');
            }
        }

        this.setDirtyData();
        this.storeCache();
        this.dispatch('change');

        await this.updatePreview();
    });

    // The event that is triggered when the effect used is modified
    this.$.effect.addEventListener('change', async (event) => {
        this.material.effect = event.target.value;
        this.material.data = await Editor.Message.request('scene', 'query-effect', this.material.effect);
        this.updateTechniqueOptions();
        if (!this.material.data[this.material.technique]) {
            this.$.technique.value = this.material.technique = 0;
        } else {
            this.$.technique.value = this.material.technique;
        }

        this.storeCache();

        const inspector = await this.getCustomInspector();
        if (inspector) {
            this.updateCustomInspector(inspector);
        } else {
            this.updatePasses();
        }
        this.setDirtyData();
        this.dispatch('change');
    });

    this.$.location.addEventListener('change', () => {
        const effect = this._effects.find((_effect) => _effect.name === this.material.effect);
        if (effect) {
            Editor.Message.send('assets', 'twinkle', effect.uuid);
        }
    });

    // Event triggered when the technique being used is changed
    this.$.technique.addEventListener('change', async (event) => {
        this.material.technique = event.target.value;

        this.storeCache();

        const inspector = await this.getCustomInspector();
        if (inspector) {
            this.updateCustomInspector(inspector);
        } else {
            this.updatePasses();
        }
        this.setDirtyData();
        this.dispatch('change');
    });

    // The event is triggered when the useInstancing is modified
    this.$.useInstancing.addEventListener('change-dump', (event) => {
        this.changeInstancing(event.target.dump.value);
        this.storeCache();
        this.setDirtyData();
        this.dispatch('change');
    });

    //  The event is triggered when the useBatching is modified
    this.$.useBatching.addEventListener('change-dump', (event) => {
        this.changeBatching(event.target.dump.value);
        this.storeCache();
        this.setDirtyData();
        this.dispatch('change');
    });

    // When the page is initialized, all effect lists are queried and then not updated again
    const effectMap = await Editor.Message.request('scene', 'query-all-effects');
    this._effects = Object.keys(effectMap)
        .sort()
        .filter((name) => {
            const effect = effectMap[name];
            return !effect.hideInEditor;
        })
        .map((name) => {
            const effect = effectMap[name];
            return {
                name,
                uuid: effect.uuid,
            };
        });
    let effectOption = '';
    for (let effect of this._effects) {
        effectOption += `<option>${effect.name}</option>`;
    }
    this.$.effect.innerHTML = effectOption;
    this.$.customPanel.addEventListener('change', () => {
        this.storeCache();
        this.setDirtyData();
        this.dispatch('change');
        this.updatePreview();
    });
};

exports.close = function() {
    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };

    this.cacheData = {};
};
