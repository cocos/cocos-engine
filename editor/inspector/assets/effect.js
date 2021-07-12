'use strict';

const { readFileSync, existsSync } = require('fs');

exports.template = `
<div class="asset-effect">
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.effect.shader" tooltip="i18n:ENGINE.assets.effect.shaderTip"></ui-label>
        <ui-select slot="content" class="shader-select"></ui-select>
    </ui-prop>

    <ui-section expand class="config" cache-expand="effect-combinations">
        <ui-label slot="header" value="i18n:ENGINE.assets.effect.combinations" tooltip="i18n:ENGINE.assets.effect.combinationsTip"></ui-label>
        <div class="description">
            <ui-label value="i18n:ENGINE.assets.effect.choose"></ui-label>
        </div>
        <div class="combinations">
        </div>
    </ui-section>

    <div class="codes"></div>
</div>
`;

exports.style = `
    .asset-effect {  }
    .asset-effect > * {
        margin-bottom: 8px;
    }
    .asset-effect > .config > .description {
        text-align: center;
        color: var(--color-normal-border-weakest);
    }
    .asset-effect > .config > .combinations {
        padding: 10px 0;
    }
    .asset-effect > .config > .combinations .checktab {
        line-height: 20px;
        margin-left: 5px;
        margin-right: 5px;
        min-width: 60px;
    }
    .asset-effect > .config > .combinations .checktab[checked="true"] {
        border-color: var(--color-focus-contrast-weakest);
        background-color: var(--color-focus-fill-weaker);
    }
    .asset-effect > .codes > * {
        margin-bottom: 8px;
    }
    .asset-effect > .codes .tabs  {
        margin: 10px auto;
        text-align: center;
    }
    .asset-effect > .codes .tabs > .tab  {
        padding: 0;
        width: 110px;
        text-align: center;
        cursor: pointer;
        display: inline-block;
        background: var(--color-normal-fill-weakest);
    }
    .asset-effect > .codes .tabs > .tab:first-child  {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-right: 1px solid var(--color-normal-fill-emphasis);
    }
    .asset-effect > .codes .tabs > .tab:last-child  {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-left: 1px solid var(--color-normal-fill-emphasis);
    }
    .asset-effect > .codes .tabs > .tab[active="true"]  {
        background: var(--color-normal-fill-emphasis);
    }
    .asset-effect > .codes ui-code  {
        max-height: 400px;
        border: none;
        border-radius: 0;
        background-color: var(--color-normal-fill-emphasis);
    }
`;

exports.$ = {
    container: '.asset-effect',
    shaderSelect: '.shader-select',
    combinations: '.combinations',
    codes: '.codes',
};

/**
 * Property corresponds to the edit element
 */
const Elements = {
    shaders: {
        ready() {
            const panel = this;

            panel.$.shaderSelect.addEventListener('change', (event) => {
                this.shadersIndex = event.target.value;

                // There are other properties that are updated depending on its change
                Elements.combinations.update.call(panel);
                Elements.codes.update.call(panel);
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            panel.shaders.forEach((shader, index) => {
                optionsHtml += `<option value="${index}">${shader.name}</option>`;
            });
            panel.$.shaderSelect.innerHTML = optionsHtml;

            panel.$.shaderSelect.value = panel.shadersIndex;

            if (panel.shaders[panel.shadersIndex]) {
                panel.$.shaderSelect.setAttribute('tooltip', panel.shaders[panel.shadersIndex].name);
            }

            panel.updateReadonly(panel.$.shaderSelect);
        },
    },
    combinations: {
        update() {
            const panel = this;

            panel.$.combinations.innerText = '';

            panel.shaders[panel.shadersIndex].defines.forEach((define) => {
                if (!define._enabled) {
                    return;
                }

                const prop = document.createElement('ui-prop');
                panel.$.combinations.appendChild(prop);

                const label = document.createElement('ui-label');
                label.setAttribute('slot', 'label');
                label.setAttribute('value', define.name);
                prop.appendChild(label);

                const content = document.createElement('div');
                content.setAttribute('slot', 'content');
                prop.appendChild(content);

                define._values.forEach((value) => {
                    const userCombinations = panel.combinations[panel.shadersIndex][define.name];
                    const checked = userCombinations && userCombinations.includes(value) ? 'true' : 'false';
                    const name = typeof value === 'boolean' ? (value ? 'on' : 'off') : value.toString();

                    const button = document.createElement('ui-button');
                    content.appendChild(button);

                    button.setAttribute('class', 'checktab');
                    button.setAttribute('checked', checked);
                    panel.updateReadonly(button);
                    button.innerText = name;
                    button.addEventListener('click', () => {
                        if (!panel.combinations[panel.shadersIndex][define.name]) {
                            panel.combinations[panel.shadersIndex][define.name] = [];
                        }

                        const userCombinations = panel.combinations[panel.shadersIndex][define.name];

                        if (userCombinations.indexOf(value) !== -1) {
                            // Eliminate existing, can choose more
                            userCombinations.splice(userCombinations.indexOf(value), 1);
                            button.setAttribute('checked', 'false');
                        } else {
                            userCombinations.push(value);
                            button.setAttribute('checked', 'true');
                        }

                        panel.dataChange();
                        panel.dispatch('change');
                    });
                });
            });

            if (panel.$.combinations.children.length) {
                panel.$.combinations.parentElement.style.display = 'block';
            } else {
                panel.$.combinations.parentElement.style.display = 'none';
            }
        },
    },
    codes: {
        update() {
            const panel = this;

            panel.$.codes.innerText = '';

            for (const glslKey in panel.glslNames) {
                const section = document.createElement('ui-section');
                panel.$.codes.appendChild(section);
                section.setAttribute('class', 'config');
                section.setAttribute('expand', '');
                section.setAttribute('cache-expand', `effect-${glslKey}`);

                const glslName = panel.glslNames[glslKey];

                const header = document.createElement('div');
                section.appendChild(header);
                header.setAttribute('slot', 'header');
                header.innerHTML = `<span>${glslName}</span>`;

                const tabs = document.createElement('div');
                section.appendChild(tabs);
                tabs.setAttribute('class', 'tabs');

                const code = document.createElement('ui-code');
                section.appendChild(code);
                code.setAttribute('language', 'glsl');
                code.innerHTML = panel.shaders[panel.shadersIndex][glslKey][panel.shaders[panel.shadersIndex][glslKey].activeKey];

                for (const shaderKey in panel.shaderNames) {
                    const shaderName = panel.shaderNames[shaderKey];
                    const active = panel.shaders[panel.shadersIndex][glslKey].activeKey === shaderKey;

                    const tab = document.createElement('div');
                    tabs.appendChild(tab);
                    tab.setAttribute('class', 'tab');
                    tab.setAttribute('active', active);
                    tab.innerText = shaderName;

                    tab.addEventListener('click', () => {
                        if (tab.getAttribute('active') === 'true') {
                            return;
                        }

                        for (const child of tab.parentElement.children) {
                            if (child === tab) {
                                child.setAttribute('active', 'true');
                            } else {
                                child.setAttribute('active', 'false');
                            }
                        }

                        panel.shaders[panel.shadersIndex][glslKey].activeKey = shaderKey;
                        code.innerHTML = panel.shaders[panel.shadersIndex][glslKey][panel.shaders[panel.shadersIndex][glslKey].activeKey];
                    });
                }
            }
        },
    },
};

/**
 * A method to initialize the panel
 */
exports.ready = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

/**
 * Methods to automatically render components
 * @param assetList
 * @param metaList
 */
exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    if (this.assetList.length !== 1) {
        this.$.container.style.display = 'none';
        return;
    } else {
        this.$.container.style.display = 'block';
    }

    const isLegal = this.refresh();
    if (!isLegal) {
        return;
    }

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
        }
    }
};

exports.methods = {
    refresh() {
        const panel = this;

        // notice : The data displayed uses both the library and the meta, so you need to keep both consistent
        if (panel.asset.uuid !== panel.meta.uuid) {
            return false;
        }

        const fileSource = panel.asset.library['.json'];

        if (fileSource && !existsSync(fileSource)) {
            console.error('Read effect json file in library failed.');
            return false;
        }

        const dataSource = JSON.parse(readFileSync(fileSource, 'utf8'));

        if (!dataSource) {
            console.error('Read effect json file in library failed.');
            return false;
        }

        panel.shaders = dataSource.shaders;

        panel.shadersIndex = 0;
        panel.glslNames = {
            glsl3: 'GLSL 300 ES Output',
            glsl1: 'GLSL 100 Output',
        };
        panel.shaderNames = {
            vert: 'Vertex Shader',
            frag: 'Fragment Shader',
        };

        // The edited value of defines in each shader
        panel.combinations = [];
        if (Array.isArray(panel.meta.userData.combinations)) {
            panel.combinations = panel.meta.userData.combinations;
        }

        // Adjusting some data for display
        panel.shaders.forEach((shader, index) => {
            for (const glslKey in panel.glslNames) {
                shader[glslKey].activeKey = 'vert';
            }

            if (!panel.combinations[index]) {
                panel.combinations[index] = {};
            }

            // Configurable definition with injection of temporary data
            shader.defines.forEach((define) => {
                const { name, type } = define;
                if (name.startsWith('CC_')) {
                    // Prefixed with "CC_" are not processed
                    define._enabled = false;
                    return;
                } else {
                    define._enabled = true;
                }

                // The following data is used for display editing
                define._values = [];

                if (type === 'number' && define.range) {
                    const [min, max] = define.range;
                    for (let i = min; i <= max; i++) {
                        define._values.push(i);
                    }
                }

                if (type === 'boolean') {
                    define._values = [false, true];
                }

                if (type === 'string') {
                    define._values = define.options;
                }
            });
        });

        return true;
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
    dataChange() {
        const panel = this;

        // Need to exclude empty arrays, otherwise scene will report an error
        const submitData = [];
        panel.combinations.forEach((combination, index) => {
            submitData[index] = {};
            const names = Object.keys(combination);
            names.forEach((name) => {
                if (combination[name].length !== 0) {
                    submitData[index][name] = combination[name];
                }
            });
        });

        panel.meta.userData.combinations = submitData;
    },
};
