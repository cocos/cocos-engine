'use strict';

const { readJSONSync, existsSync } = require('fs-extra');

exports.template = `
<div class="asset-effect">
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.effect.shader" tooltip="i18n:ENGINE.assets.effect.shaderTip"></ui-label>
        <ui-select slot="content" class="shader-select"></ui-select>
    </ui-prop>

    <ui-section expand class="config">
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
 * 属性对应的编辑元素
 */
const Elements = {
    shaders: {
        ready() {
            const panel = this;

            panel.$.shaderSelect.addEventListener('change', (event) => {
                this.shadersIndex = event.target.value;

                // 有其他属性的更新依赖它的变动
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
                            // 剔除已存在，能多选
                            userCombinations.splice(userCombinations.indexOf(value), 1);
                            button.setAttribute('checked', 'false');
                        } else {
                            userCombinations.push(value);
                            button.setAttribute('checked', 'true');
                        }

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
 * 初始化界面的方法
 */
exports.ready = function () {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

/**
 * 自动渲染组件的方法
 * @param assetList
 * @param metaList
 */
exports.update = function (assetList, metaList) {
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

        // 重要：展示的数据既用到了 library ,又用到了 meta，需要保持两者一致
        if (panel.asset.uuid !== panel.meta.uuid) {
            return false;
        }

        const fileSource = panel.asset.library['.json'];

        if (fileSource && !existsSync(fileSource)) {
            console.error('Read effect json file in library failed.');
            return false;
        }

        const dataSource = readJSONSync(fileSource);

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

        // 每个 shader 里 defines 已编辑的值
        panel.combinations = [];
        if (Array.isArray(panel.meta.userData.combinations)) {
            panel.combinations = panel.meta.userData.combinations;
        }

        // 调整部分数据以用于展示
        panel.shaders.forEach((shader, index) => {
            for (const glslKey in panel.glslNames) {
                shader[glslKey].activeKey = 'vert';
            }

            if (!panel.combinations[index]) {
                panel.combinations[index] = {};
            }

            // 可配置的定义，有注入临时数据
            shader.defines.forEach((define) => {
                const { name, type } = define;
                if (name.startsWith('CC_')) {
                    // CC_ 开头的不处理
                    define._enabled = false;
                    return;
                } else {
                    define._enabled = true;
                }

                // 以下数据为显示编辑使用
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
     * 更新只读状态
     */
    updateReadonly(element) {
        if (this.asset.readonly) {
            element.setAttribute('disabled', true);
        } else {
            element.removeAttribute('disabled');
        }
    },
    apply() {
        const panel = this;

        // 需要剔除空数组，不然 scene 会报错
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
