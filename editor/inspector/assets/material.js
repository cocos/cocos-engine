'use strict';

// TODO Retain the previously modified data when switching pass, etc.

const { materialTechniquePolyfill } = require('../utils/material');

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
    
        if (technique.useBatching) {
            this.$.useBatching.render(technique.useBatching);
            this.$.useBatching.removeAttribute('hidden');
        } else {
            this.$.useBatching.setAttribute('hidden', '');
        }
    
        if (technique.passes) {
            const $propList = Array.from(this.$.materialDump.querySelectorAll('ui-prop.pass') || []);
            let i = 0;
            for (i; i < technique.passes.length; i++) {
                // If the propertyIndex is not equal to the current pass index, then do not render
                if (technique.passes[i].propertyIndex !== undefined && technique.passes[i].propertyIndex.value !== i) {
                    continue;
                }
                if (!$propList[i]) {
                    $propList[i] = document.createElement('ui-prop');
                    $propList[i].classList.add('pass');
                    $propList[i].setAttribute('type', 'dump');
                    $propList[i].setAttribute('fold', 'false');
                    this.$.materialDump.appendChild($propList[i]);
                }
                $propList[i].render(technique.passes[i]);
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
exports.update = async function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    this.material = await Editor.Message.request('scene', 'query-material', this.asset.uuid);

    // effect <select> tag
    this.$.effect.value = this.material.effect;
    // technique <select> tag
    this.$.technique.value = this.material.technique;

    this.updateTechniqueOptions();
    this.updatePasses();
};

/**
 * Method of initializing the panel
 */
exports.ready = async function() {
    // The event triggered when the content of material is modified
    this.$.materialDump.addEventListener('change-dump', (event) => {
        Editor.Message.request('scene', 'preview-material', this.asset.uuid, this.material);
        this.dispatch('change');
    });

    // The event that is triggered when the effect used is modified
    this.$.effect.addEventListener('change', async (event) => {
        this.material.effect = event.target.value;
        this.material.data = await Editor.Message.request('scene', 'query-effect', this.material.effect);

        this.updateTechniqueOptions();
        this.updatePasses();
        this.dispatch('change');
    });

    // Event triggered when the technique being used is changed
    this.$.technique.addEventListener('change', async (event) => {
        this.material.technique = event.target.value;

        this.updatePasses();
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
        this.dispatch('change');
    });

    // When the page is initialized, all effect lists are queried and then not updated again
    const effectMap = await Editor.Message.request('scene', 'query-all-effects');
    this._effects = Object.keys(effectMap).filter((name) => {
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
    for (let effect of this._effects) {
        effectOption += `<option>${effect.name}</option>`;
    }
    this.$.effect.innerHTML = effectOption;
}
