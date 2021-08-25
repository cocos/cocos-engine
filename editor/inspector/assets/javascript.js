const { createReadStream } = require('fs');
const ReadLine = require('readline');

const MAX_LINES = 400;
const MAX_LENGTH = 20000;

exports.template = `
<section class="asset-javascript">
    <ui-prop>
        <ui-label slot="label"
            tooltip="i18n:ENGINE.assets.javascript.pluginTip"
            value="i18n:ENGINE.assets.javascript.plugin"
        ></ui-label>
        <ui-checkbox slot="content"
            class="content"
            id="is-plugin"
         ></ui-checkbox>
    </ui-prop>
    <div class="detail">
        <div class="dependencies">
            <ui-prop>
                <ui-label slot="label"
                    tooltip="i18n:ENGINE.assets.javascript.dependenciesTip"
                    value="i18n:ENGINE.assets.javascript.dependencies"
                ></ui-label>
                <ui-num-input class="content" 
                    step="1" 
                    min="0" 
                    max="10"
                    slot="content"
                    id="dependencies-input"
                ></ui-num-input>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label"></ui-label>
                <div class="assets content"
                    slot="content"
                    id="dependencies-content"
                ></div>
            </ui-prop>
        </div>
        <ui-prop >
            <ui-label 
                slot="label"
                tooltip="i18n:ENGINE.assets.javascript.executionScopeTip"
                value="i18n:ENGINE.assets.javascript.executionScope"
            ></ui-label>
            <ui-select slot="content"
                id="executionScope"
            ></ui-select>
        </ui-prop>
        <ui-prop id="executionScopeEnclosedProp">
            <ui-label slot="label"></ui-label>
            <ui-input slot="content"
                id="executionScopeEnclosedInput"
                placeholder="self;window;global;globalThis"
                tooltip="i18n:ENGINE.assets.javascript.executionScopeEnclosed"
            ></ui-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label"
                tooltip="i18n:ENGINE.assets.javascript.loadPluginInWebTip"
                value="i18n:ENGINE.assets.javascript.loadPluginInWeb"
            ></ui-label>
            <ui-checkbox slot="content"
                id="load-plugin-in-web"
            ></ui-checkbox>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label"
                tooltip="i18n:ENGINE.assets.javascript.loadPluginInNativeTip"
                value="i18n:ENGINE.assets.javascript.loadPluginInNative"
            ></ui-label>
            <ui-checkbox slot="content"
                id="load-plugin-in-native"
            ></ui-checkbox>
        </ui-prop>
        <ui-prop >
            <ui-label slot="label"
                tooltip="i18n:ENGINE.assets.javascript.loadPluginInEditorTip"
                value="i18n:ENGINE.assets.javascript.loadPluginInEditor"
            ></ui-label>
            <ui-checkbox slot="content"
                id="load-plugin-in-editor"
            ></ui-checkbox>
        </ui-prop>
    </div>
    <ui-code language="javascript"
        id="code"
    ></ui-code>
</section>
`;

exports.$ = {
    isPluginCheckBox: '#is-plugin',
    detail: '.detail',
    loadPluginInEditorCheckBox: '#load-plugin-in-editor',
    loadPluginInWebCheckBox: '#load-plugin-in-web',
    loadPluginInNativeCheckBox: '#load-plugin-in-native',
    dependencies: '.dependencies',
    dependenciesInput: '#dependencies-input',
    dependenciesContent: '#dependencies-content',
    executionScope: '#executionScope',
    executionScopeEnclosedProp: '#executionScopeEnclosedProp',
    executionScopeEnclosedInput: '#executionScopeEnclosedInput',
    code: '#code',
};

exports.style = `
.asset-javascript {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    height: 0px; // it is necessary
}
.asset-javascript ui-prop[hidden] {
    display: none;
}
.asset-javascript .assets > ui-asset {
    margin-top: 8px;
    margin-bottom: 4px;
    width: 100%;
}
.asset-javascript ui-code {
    flex: 1;
    margin-top: 8px;
}
`;

const Elements = {
    isPlugin: {
        ready() {
            this.$.isPluginCheckBox.addEventListener('confirm', (event) => {
                this.dataChange('isPlugin', event);
                Elements.detail.update.call(this);
            });
        },
        update() {
            this.$.isPluginCheckBox.value = this.meta.userData.isPlugin;
            this.updateInvalid(this.$.isPluginCheckBox, 'isPlugin');
        },
    },
    detail: {
        update() {
            let display = 'none';
            if (this.meta.userData.isPlugin) {
                display = 'block';
            }

            this.$.detail.style.display = display;
        },
    },
    dependencies: {
        ready() {
            this.$.dependenciesInput.addEventListener('confirm', (event) => {
                let length = event.target.value;

                if (length < 0) {
                    length = 0;
                }

                if (length > 10) {
                    length = 10;
                }

                if (!Array.isArray(this.meta.userData.dependencies)) {
                    this.meta.userData.dependencies = [];
                }

                while (this.meta.userData.dependencies.length < length) {
                    this.meta.userData.dependencies.push('');
                }

                while (this.meta.userData.dependencies.length > length) {
                    this.meta.userData.dependencies.pop();
                }

                if (!this.meta.userData.dependencies.length) {
                    this.meta.userData.dependencies = undefined;
                }

                this.dispatch('change');

                Elements.dependencies.update.call(this);
            });
        },
        update() {
            let display = 'none';
            if (this.metaList.length === 1) {
                display = 'block';
            }
            this.$.dependencies.style.display = display;

            if (display === 'none') {
                return;
            }

            this.$.dependenciesContent.innerText = '';

            if (!Array.isArray(this.meta.userData.dependencies)) {
                return;
            }

            const length = this.meta.userData.dependencies.length;
            this.$.dependenciesInput.value = length;

            for (let i = 0; i < length; i++) {
                const child = document.createElement('ui-asset');
                this.$.dependenciesContent.appendChild(child);

                child.setAttribute('value', this.meta.userData.dependencies[i]);
                child.setAttribute('droppable', 'cc.Script');
                child.addEventListener('confirm', (event) => {
                    this.meta.userData.dependencies[i] = event.target.value;
                    this.dispatch('change');
                });
            }
        },
    },
    executionScope: {
        ready() {
            const options = ['enclosed', 'global'];
            for (const key of options) {
                const option = document.createElement('option');
                option.value = key;
                option.innerText = this.t(key);
                this.$.executionScope.appendChild(option);
            }

            this.$.executionScope.addEventListener('confirm', (event) => {
                this.dataChange('executionScope', event);
                Elements.executionScopeEnclosed.update.call(this);
            });
        },
        update() {
            this.$.executionScope.value = this.meta.userData.executionScope !== 'global' ? 'enclosed' : 'global';
            this.updateInvalid(this.$.executionScope, 'executionScope');
        },
    },
    executionScopeEnclosed: {
        ready() {
            this.$.executionScopeEnclosedInput.addEventListener('confirm', (event) => {
                const value = event.target.value;
                if (typeof value === 'string') {
                    let globalNames = [];
                    if (value.length !== 0) {
                        globalNames = value
                            .split(';')
                            .map((globalName) => globalName.trim())
                            .filter((globalName) => globalName.length !== 0);
                    }
                    this.metaList.forEach((meta) => (meta.userData.simulateGlobals = globalNames.length === 0 ? true : globalNames));
                    this.dispatch('change');
                }
            });
        },
        update() {
            let display = 'none';
            if (this.meta.userData.executionScope !== 'global') {
                display = 'block';
            }

            this.$.executionScopeEnclosedProp.style.display = display;

            if (display === 'none') {
                return;
            }

            this.$.executionScopeEnclosedInput.value = Array.isArray(this.meta.userData.simulateGlobals)
                ? this.meta.userData.simulateGlobals.join(';')
                : '';
        },
    },
    loadPluginInWebCheckBox: {
        ready() {
            this.$.loadPluginInWebCheckBox.addEventListener('confirm', this.dataChange.bind(this, 'loadPluginInWeb'));
        },
        update() {
            this.$.loadPluginInWebCheckBox.value = this.meta.userData.loadPluginInWeb;
            this.updateInvalid(this.$.loadPluginInWebCheckBox, 'loadPluginInWeb');
        },
    },
    loadPluginInNativeCheckBox: {
        ready() {
            this.$.loadPluginInNativeCheckBox.addEventListener('confirm', this.dataChange.bind(this, 'loadPluginInNative'));
        },
        update() {
            this.$.loadPluginInNativeCheckBox.value = this.meta.userData.loadPluginInNative;
            this.updateInvalid(this.$.loadPluginInNativeCheckBox, 'loadPluginInNative');
        },
    },
    loadPluginInEditorCheckBox: {
        ready() {
            this.$.loadPluginInEditorCheckBox.addEventListener('confirm', this.dataChange.bind(this, 'loadPluginInEditor'));
        },
        update() {
            this.$.loadPluginInEditorCheckBox.value = this.meta.userData.loadPluginInEditor;
            this.updateInvalid(this.$.loadPluginInEditorCheckBox, 'loadPluginInEditor');
        },
    },
    code: {
        update() {
            let display = 'none';
            if (this.assetList.length === 1) {
                display = 'flex';
            }
            this.$.code.style.display = display;

            if (display === 'none') {
                return;
            }

            let remainLines = MAX_LINES;
            let remainLength = MAX_LENGTH;
            let text = '';

            const readStream = createReadStream(this.asset.file, {
                encoding: 'utf-8',
            });

            const readLineStream = ReadLine.createInterface({
                input: readStream,
                setEncoding: 'utf-8',
            });

            readLineStream.on('line', (line) => {
                const lineLength = line.length;
                if (lineLength > remainLength) {
                    line = line.substr(0, remainLength);
                    remainLength = 0;
                } else {
                    remainLength -= lineLength;
                }

                remainLines--;
                text += `${line}\n`;

                if (remainLines <= 0 || remainLength <= 0) {
                    text += '...\n';
                    readLineStream.close();
                    readStream.close();
                }
            });

            readLineStream.on('close', (err) => {
                if (err) {
                    throw err;
                }

                if (this.$.code) {
                    this.$.code.textContent = text;
                }
            });
        },
    },
};

exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    for (const key in Elements) {
        const element = Elements[key];
        if (element.update) {
            element.update.call(this);
        }
    }
};

exports.ready = function() {
    for (const key in Elements) {
        const element = Elements[key];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

exports.methods = {
    t(key) {
        return Editor.I18n.t(`ENGINE.assets.javascript.${key}`);
    },
    updateInvalid(element, prop) {
        const invalid = this.metaList.some((meta) => {
            return meta.userData[prop] !== this.meta.userData[prop];
        });
        element.invalid = invalid;
    },
    dataChange(key, event) {
        this.metaList.forEach((meta) => {
            meta.userData[key] = event.target.value;
        });

        this.dispatch('change');
    },
};
