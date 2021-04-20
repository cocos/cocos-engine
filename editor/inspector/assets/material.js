'use strict';

// TODO Retain the previously modified data when switching pass, etc.

const { materialTechniquePolyfill } = require('../utils/material');
const { setDisabled, setReadonly, loopSetAssetDumpDataReadonly } = require('../utils/prop');

exports.style = `
ui-button.location { flex: none; margin-left: 6px; }
`;

exports.template = `
<header>
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
<section>
    <ui-prop class="useInstancing" type="dump"></ui-prop>
    <ui-prop class="useBatching" type="dump"></ui-prop>
</section>
<section class="material-dump"></section>
`;

exports.$ = {
    section: 'section',
    asyncLoadAssets: '.asyncLoadAssets',
    pass: '.pass',

    effect: '.effect',
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
        await Editor.Message.request('scene', 'apply-material', this.asset.uuid, this.material);
        this.dirtyData.origin = this.dirtyData.realtime = '';
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
            this.material.technique = 0;
        }
        const technique = materialTechniquePolyfill(this.material.data[this.material.technique]);
        this.technique = technique;

        if (technique.useInstancing) {
            this.$.useInstancing.render(technique.useInstancing);
            this.$.useInstancing.removeAttribute('hidden');
        } else {
            this.$.useInstancing.setAttribute('hidden', '');
        }
        setReadonly(this.asset.readonly, this.$.useInstancing);

        if (technique.useBatching) {
            this.$.useBatching.render(technique.useBatching);
            this.$.useBatching.removeAttribute('hidden');
        } else {
            this.$.useBatching.setAttribute('hidden', '');
        }
        setReadonly(this.asset.readonly, this.$.useBatching);

        if (technique.passes) {
            // TODO: hack
            // const $propList = Array.from(this.$.materialDump.querySelectorAll('ui-prop.pass') || []);
            this.$.materialDump.innerText = '';
            const $propList = [];

            let i = 0;
            for (i; i < technique.passes.length; i++) {
                // If the propertyIndex is not equal to the current pass index, then do not render
                if (technique.passes[i].propertyIndex !== undefined && technique.passes[i].propertyIndex.value !== i) {
                    continue;
                }

                // if asset is readonly
                if (this.asset.readonly) {
                    for (const key in technique.passes[i].value) {
                        loopSetAssetDumpDataReadonly(technique.passes[i].value[key]);
                    }
                }

                if (!$propList[i]) {
                    $propList[i] = document.createElement('ui-prop');
                    $propList[i].classList.add('pass');
                    $propList[i].setAttribute('type', 'dump');
                    $propList[i].setAttribute('fold', 'false');
                    this.$.materialDump.appendChild($propList[i]);
                }
                $propList[i].render(technique.passes[i]);

                $propList[i].querySelectorAll('ui-prop').forEach(($prop) => {
                    const dump = $prop.dump;
                    if (dump && dump.childMap && dump.children.length) {
                        if (!$prop.$children) {
                            $prop.$children = document.createElement('section');

                            for (const childName in dump.childMap) {
                                $prop.$children[childName] = document.createElement('ui-prop');
                                $prop.$children[childName].setAttribute('type', 'dump');
                                $prop.$children[childName].render(dump.childMap[childName]);

                                $prop.$children.appendChild($prop.$children[childName]);
                            }

                            $prop.after($prop.$children);
                        }

                        if (dump.value) {
                            $prop.$children.removeAttribute('hidden');
                        } else {
                            $prop.$children.setAttribute('hidden', '');
                        }
                    }
                });
            }
            for (i; i < $propList.length; i++) {
                const $prop = $propList[i];
                $prop.parentElement.removeChild($prop);
            }
        }
    },

    /**
     * Update the options data in technique
     */
    updateTechniqueOptions() {
        let techniqueOption = '';
        this.material.data.forEach((technique, index) => {
            techniqueOption += `<option value="${index}">${index} - ${technique.name}</option>`;
        });
        this.$.technique.innerHTML = techniqueOption;
    },
};

/**
 * Methods for automatic rendering of components
 * @param assetList
 * @param metaList
 */
exports.update = async function (assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

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
    this.updatePasses();
    this.setDirtyData();
};

/**
 * Method of initializing the panel
 */
exports.ready = async function () {
    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };

    // The event triggered when the content of material is modified
    this.$.materialDump.addEventListener('change-dump', (event) => {
        Editor.Message.request('scene', 'preview-material', this.asset.uuid, this.material);

        // show its children
        const dump = event.target.dump;
        if (dump && dump.childMap && dump.children.length) {
            if (dump.value) {
                event.target.$children.removeAttribute('hidden');
            } else {
                event.target.$children.setAttribute('hidden', '');
            }
        }

        this.setDirtyData();
        this.dispatch('change');
    });

    // The event that is triggered when the effect used is modified
    this.$.effect.addEventListener('change', async (event) => {
        this.material.effect = event.target.value;
        this.material.data = await Editor.Message.request('scene', 'query-effect', this.material.effect);

        this.updateTechniqueOptions();
        this.updatePasses();
        this.setDirtyData();
        this.dispatch('change');
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
        const technique = this.technique;
        // Replace the data in passes
        technique.passes.forEach((pass) => {
            if (pass.childMap.USE_INSTANCING) {
                pass.childMap.USE_INSTANCING.value = event.target.value;
            }
        });
        this.setDirtyData();
        this.dispatch('change');
    });

    //  The event is triggered when the useBatching is modified
    this.$.useBatching.addEventListener('change-dump', (event) => {
        const technique = this.technique;
        // Replace the data in passes
        technique.passes.forEach((pass) => {
            if (pass.childMap.USE_BATCHING) {
                pass.childMap.USE_BATCHING.value = event.target.value;
            }
        });
        this.setDirtyData();
        this.dispatch('change');
    });

    // When the page is initialized, all effect lists are queried and then not updated again
    const effectMap = await Editor.Message.request('scene', 'query-all-effects');
    this._effects = Object.keys(effectMap)
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

exports.close = function () {
    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };
};
