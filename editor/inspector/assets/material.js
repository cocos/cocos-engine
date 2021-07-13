'use strict';

// TODO Retain the previously modified data when switching pass, etc.

const { materialTechniquePolyfill } = require('../utils/material');
const { setDisabled, setReadonly, setHidden, loopSetAssetDumpDataReadonly } = require('../utils/prop');

exports.style = `
ui-button.location { flex: none; margin-left: 6px; }
`;

exports.template = `
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
};

exports.methods = {
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
        // Automatic rendering of content
        // The data in passes is not all the values that need to be rendered
        // So it's sorted here, but that doesn't make sense
        // The logical way to do it would be to return a normal dump when querying for material
        if (!this.material.data[this.material.technique]) {
            this.$.technique.value = this.material.technique = 0;
        }
        const technique = materialTechniquePolyfill(this.material.data[this.material.technique]);
        this.technique = technique;

        if (!technique || !technique.passes) {
            return;
        }

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
    }

    this.material = await Editor.Message.request('scene', 'query-material', this.asset.uuid);

    // effect <select> tag
    this.$.effect.value = this.material.effect;
    setDisabled(this.asset.readonly, this.$.effect);

    // technique <select> tag
    this.$.technique.value = this.material.technique;
    setDisabled(this.asset.readonly, this.$.technique);

    this.updateTechniqueOptions();
    this.setDirtyData();

    // optimize calculate speed when edit multiple materials in node mode
    requestIdleCallback(() => {
        this.updatePasses();
    });
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

        await Editor.Message.request('scene', 'preview-material', this.asset.uuid, this.material);
        Editor.Message.broadcast('material-inspector:change-dump');

        this.setDirtyData();
        this.dispatch('change');
    });

    // The event that is triggered when the effect used is modified
    this.$.effect.addEventListener('change', async (event) => {
        this.material.effect = event.target.value;
        this.material.data = await Editor.Message.request('scene', 'query-effect', this.material.effect);

        this.updateTechniqueOptions();
        this.$.technique.value = 0;

        this.updatePasses();
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

        this.updatePasses();
        this.setDirtyData();
        this.dispatch('change');
    });

    // The event is triggered when the useInstancing is modified
    this.$.useInstancing.addEventListener('change-dump', (event) => {
        this.changeInstancing(event.target.dump.value);
        this.setDirtyData();
        this.dispatch('change');
    });

    //  The event is triggered when the useBatching is modified
    this.$.useBatching.addEventListener('change-dump', (event) => {
        this.changeBatching(event.target.dump.value);
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
};

exports.close = function() {
    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };
};
