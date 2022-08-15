'use strict';

const { materialTechniquePolyfill } = require('../utils/material');
const { setDisabled, setReadonly, setHidden, loopSetAssetDumpDataReadonly } = require('../utils/prop');
const { join, sep, normalize } = require('path');

exports.style = `
.invalid { display: none; }
.invalid[active] { display: block; }
.invalid[active] ~ * { display: none; }

.custom[src] + .default { display: none; }

ui-button.location { flex: none; margin-left: 4px; }
`;

exports.template = /* html */ `
<div class="invalid">
    <ui-label value="i18n:ENGINE.assets.multipleWarning"></ui-label>
</div>
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
<ui-panel class="custom"></ui-panel>
<div class="default">
    <section class="section">
        <ui-prop class="useInstancing" type="dump"></ui-prop>
        <ui-prop class="useBatching" type="dump"></ui-prop>
    </section>
    <section class="material-dump"></section>
</div>
`;

exports.$ = {
    invalid: '.invalid',

    header: '.header',
    effect: '.effect',
    location: '.location',
    technique: '.technique',
    useInstancing: '.useInstancing',
    useBatching: '.useBatching',
    materialDump: '.material-dump',

    custom: '.custom',
};

exports.methods = {
    record() {
        return JSON.stringify({
            material: this.material,
            cacheData: this.cacheData,
        });
    },
    async restore(record) {
        record = JSON.parse(record);
        if (!record || typeof record !== 'object' || !record.material) {
            return false;
        }

        this.material = record.material;
        this.cacheData = record.cacheData;

        await this.updateEffect();

        await this.updateInterface();

        await this.change({ snapshot: false });

        return true;
    },

    async apply() {
        this.reset();
        await Editor.Message.request('scene', 'apply-material', this.asset.uuid, this.material);
    },

    reset() {
        this.dirtyData.uuid = '';
        this.cacheData = {};
    },

    async change(state) {
        this.canUpdatePreview = true;
        await this.setDirtyData();
        this.dispatch('change', state);
    },

    async updateEffect() {
        const effectMap = await Editor.Message.request('scene', 'query-all-effects');
        this.effects = Object.keys(effectMap).sort().filter((name) => {
            const effect = effectMap[name];
            return !effect.hideInEditor;
        }).map((name) => {
            const effect = effectMap[name];
            return {
                name,
                uuid: effect.uuid,
            };
        });

        let effectOption = '';
        for (let effect of this.effects) {
            effectOption += `<option>${effect.name}</option>`;
        }
        this.$.effect.innerHTML = effectOption;

        this.$.effect.value = this.material.effect;
        setDisabled(this.asset.readonly, this.$.effect);
    },

    async updateInterface() {
        this.updateTechnique();

        const currentEffectInfo = this.effects.find((effect) => {
            return effect.name === this.material.effect;
        });

        this.customInterface = '';
        if (currentEffectInfo && currentEffectInfo.uuid) {
            const meta = await Editor.Message.request('asset-db', 'query-asset-meta', currentEffectInfo.uuid);
            if (meta && meta.userData && meta.userData.editor) {
                this.customInterface = meta.userData.editor.inspector;
            }
        }

        if (this.customInterface && this.customInterface.startsWith('packages://')) {
            try {
                const relatePath = normalize(this.customInterface.replace('packages://', ''));
                const name = relatePath.split(sep)[0];

                const packagePath = Editor.Package.getPackages({ name, enable: true })[0].path;

                const filePath = join(packagePath, relatePath.split(name)[1]);
                if (this.$.custom.getAttribute('src') !== filePath) {
                    this.$.custom.setAttribute('src', filePath);
                }

                this.$.custom.update(this.material, this.assetList, this.metaList);

            } catch (err) {
                console.error(err);
                console.error(Editor.I18n.t('ENGINE.assets.material.illegal-inspector-url'));
            }
        } else {
            this.$.custom.removeAttribute('src');
            this.updatePasses();
        }
    },

    updateTechnique() {
        let techniqueOption = '';
        this.material.data.forEach((technique, index) => {
            const name = technique.name ? `${index} - ${technique.name}` : index;
            techniqueOption += `<option value="${index}">${name}</option>`;
        });
        this.$.technique.innerHTML = techniqueOption;
        this.$.technique.value = this.material.technique;

        setDisabled(this.asset.readonly, this.$.technique);
    },

    async updatePasses() {
        const technique = materialTechniquePolyfill(this.material.data[this.material.technique]);

        this.technique = technique;
        if (!technique || !technique.passes) {
            return;
        }

        if (this.requestInitCache) {
            this.initCache();

            if (!this.canUpdatePreview) {
                await this.updatePreview(false);
            }
        } else {
            this.useCache();
            await this.updatePreview(true);
        }

        if (technique.passes) {
            // The interface is not a regular data loop, which needs to be completely cleared and placed, but the UI-prop element is still reusable
            const $container = this.$.materialDump;
            $container.innerText = '';

            if (!$container.$children) {
                $container.$children = {};
            }

            for (let i = 0; i < technique.passes.length; i++) {
                const pass = technique.passes[i];

                // if asset is readonly
                if (this.asset.readonly) {
                    for (const key in pass.value) {
                        loopSetAssetDumpDataReadonly(pass.value[key]);
                    }
                }

                $container.$children[i] = document.createElement('ui-prop');
                $container.$children[i].setAttribute('type', 'dump');
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

                            $prop.addEventListener('change-dump', (e) => {
                                if (e.target.dump.value) {
                                    $prop.$children.removeAttribute('hidden');
                                } else {
                                    $prop.$children.setAttribute('hidden', '');
                                }
                            });
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

        this.updateInstancing();
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

    async updatePreview(emit) {
        await Editor.Message.request('scene', 'preview-material', this.asset.uuid, this.material, { emit });

        Editor.Message.broadcast('material-inspector:change-dump');
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

    initCache() {
        const excludeNames = [
            'children',
            'defines',
            'extends',
            'pipelineStates',
        ];

        const cacheData = this.cacheData;
        this.technique.passes.forEach((pass, i) => {
            if (pass.propertyIndex !== undefined && pass.propertyIndex.value !== i) {
                return;
            }

            cacheProperty(pass.value);
        });

        function cacheProperty(prop) {
            for (const name in prop) {
                // 这些字段是基础类型或配置性的数据，不需要变动
                if (excludeNames.includes(name)) {
                    continue;
                }

                if (prop[name] && typeof prop[name] === 'object') {
                    if (!(name in cacheData)) {
                        const { type, value } = prop[name];
                        if (type) {
                            if (value !== undefined) {
                                cacheData[name] = { type };
                                if (value && typeof value === 'object') {
                                    cacheData[name].value = JSON.parse(JSON.stringify(value));
                                } else {
                                    cacheData[name].value = value;
                                }
                            }
                        }
                    }

                    if (prop[name].childMap && typeof prop[name].childMap === 'object') {
                        cacheProperty(prop[name].childMap);
                    }
                }
            }
        }

        this.requestInitCache = false;
        this.updateInstancing();
    },

    storeCache(dump) {
        const { name, type, value, default: defaultValue } = dump;

        if (JSON.stringify(value) === JSON.stringify(defaultValue)) {
            delete this.cacheData[name];
        } else {
            this.cacheData[name] = JSON.parse(JSON.stringify({ type, value }));
        }
    },

    useCache() {
        const cacheData = this.cacheData;
        this.technique.passes.forEach((pass, i) => {
            if (pass.propertyIndex !== undefined && pass.propertyIndex.value !== i) {
                return;
            }

            updateProperty(pass.value);
        });

        function updateProperty(prop) {
            for (const name in prop) {
                if (prop[name] && typeof prop[name] === 'object') {
                    if (name in cacheData) {
                        const { type, value } = cacheData[name];
                        if (prop[name].type === type && JSON.stringify(prop[name].value) !== JSON.stringify(value)) {
                            if (value && typeof value === 'object') {
                                prop[name].value = JSON.parse(JSON.stringify(value));
                            } else {
                                prop[name].value = value;
                            }
                        }
                    }

                    if (prop[name].childMap && typeof prop[name].childMap === 'object') {
                        updateProperty(prop[name].childMap);
                    }
                }
            }
        }
    },

    async setDirtyData() {
        if (this.canUpdatePreview) {
            await this.updatePreview(true);
        }

        this.dirtyData.realtime = JSON.stringify({
            effect: this.material.effect,
            technique: this.material.technique,
            techniqueData: this.material.data[this.material.technique],
        });

        if (!this.dirtyData.origin) {
            this.dirtyData.origin = this.dirtyData.realtime;

            this.dispatch('snapshot');
        }
    },

    isDirty() {
        const isDirty = this.dirtyData.origin !== this.dirtyData.realtime;
        return isDirty;
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

    // 增加容错
    if (!this.$this.isConnected) {
        return;
    }

    if (assetList.length !== 1) {
        this.$.invalid.setAttribute('active', '');
        return;
    } else {
        this.$.invalid.removeAttribute('active');
    }

    if (this.dirtyData.uuid !== this.asset.uuid) {
        this.dirtyData.uuid = this.asset.uuid;
        this.dirtyData.origin = '';
        this.dirtyData.realtime = '';
        this.cacheData = {};
        this.requestInitCache = true;
    }

    this.material = await Editor.Message.request('scene', 'query-material', this.asset.uuid);

    await this.updateEffect();

    await this.updateInterface();
    await this.setDirtyData();
};

/**
 * Method of initializing the panel
 */
exports.ready = function() {
    this.canUpdatePreview = false;
    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };

    // Retain the previously modified data when switching pass
    this.cacheData = {};

    // The event that is triggered when the effect used is modified
    this.$.effect.addEventListener('change', async (event) => {
        this.material.effect = event.target.value;
        this.material.data = await Editor.Message.request('scene', 'query-effect', this.material.effect);

        this.$.technique.value = this.material.technique = 0;

        await this.updateInterface();

        this.change();
    });

    this.$.location.addEventListener('change', () => {
        const effect = this.effects.find((_effect) => _effect.name === this.material.effect);
        if (effect) {
            Editor.Message.send('assets', 'twinkle', effect.uuid);
        }
    });

    // Event triggered when the technique being used is changed
    this.$.technique.addEventListener('change', async (event) => {
        this.material.technique = event.target.value;
        await this.updateInterface();
        this.change();
    });

    // The event is triggered when the useInstancing is modified
    this.$.useInstancing.addEventListener('change-dump', (event) => {
        this.changeInstancing(event.target.dump.value);
        this.storeCache(event.target.dump);
        this.change();
    });

    //  The event is triggered when the useBatching is modified
    this.$.useBatching.addEventListener('change-dump', (event) => {
        this.changeBatching(event.target.dump.value);
        this.storeCache(event.target.dump);
        this.change();
    });

    // The event triggered when the content of material is modified
    this.$.materialDump.addEventListener('change-dump', async (event) => {
        const dump = event.target.dump;

        // // show its children
        // if (dump && dump.childMap && dump.children.length && event.target.$children) {
        //     if (dump.value) {
        //         event.target.$children.removeAttribute('hidden');
        //     } else {
        //         event.target.$children.setAttribute('hidden', '');
        //     }
        // }

        this.storeCache(dump);
        this.change();
    });

    this.$.custom.addEventListener('change', () => {
        this.change();
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
