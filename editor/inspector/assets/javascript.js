const { readFileSync } = require('fs');
const { createReadStream } = require('fs-extra');
const { join } = require('path');
const ReadLine = require('readline');

const MAX_LINES = 400;
const MAX_LENGTH = 20000;

function t (key) {
    return Editor.I18n.t(`ENGINE.assets.javascript.${key}`);
}
exports.template = `
<section class="asset-javascript">

    <ui-prop class="line">
        <ui-label 
            i18n
            slot="label"
            tooltip="i18n:ENGINE.assets.javascript.pluginTip"
        >
        ENGINE.assets.javascript.plugin</ui-label>
        <ui-checkbox 
            class="content"
            id="is-plugin"
            slot="content"
        
         ></ui-checkbox>
    </ui-prop>

    <div
        class="plugin-operation"
    >
        <ui-prop >
            <ui-label
                slot="label"
                i18n
                tooltip="i18n:ENGINE.assets.javascript.dependenciesTip"
            >ENGINE.assets.javascript.dependencies</ui-label>
            <ui-num-input class="content" 
                step="1" 
                min="0" 
                max="10"
                slot="content"
                id="dependencies"
            ></ui-num-input>
        </ui-prop>
        <ui-prop >
            <ui-label slot="label"></ui-label>
            <div class="assets content"
                slot="content"
                id="dependencies-content"
            >
            </div>
        </ui-prop>
        <ui-prop >
            <ui-label i18n 
                tooltip="i18n:ENGINE.assets.javascript.executionScopeTip"
                slot="label"
            >ENGINE.assets.javascript.executionScope
            </ui-label>
            <ui-select slot="content"
                id="executionScope"
            >
            </ui-select>
        </ui-prop>

        <ui-prop 
            id="localContent"
        >
            <ui-label slot="label"></ui-label>
            <ui-input 
                id="simulateGlobalsInput"
                placeholder="self;window;global;globalThis" tooltip="i18n:ENGINE.assets.javascript.simulateGlobals"
                slot="content"
            ></ui-input>
        </ui-prop>
    </div>

    <div
        class="child plugin-operation"
    >
        <ui-prop >
            <ui-label i18n
                slot="label"
                tooltip="i18n:ENGINE.assets.javascript.loadPluginInWebTip"
            >
            ENGINE.assets.javascript.loadPluginInWeb
            </ui-label>
            <ui-checkbox
                id="load-plugin-in-web"
                slot="content"
            ></ui-checkbox>
        </ui-prop>
        <ui-prop 
        >
            <ui-label i18n
                slot="label"
                tooltip="i18n:ENGINE.assets.javascript.loadPluginInNativeTip"
            >
            ENGINE.assets.javascript.loadPluginInNative
            </ui-label>
            <ui-checkbox
                slot="content"
                id="load-plugin-in-native"
            ></ui-checkbox>
        </ui-prop>
        <ui-prop >
            <ui-label i18n
                slot="label"
                tooltip="i18n:ENGINE.assets.javascript.loadPluginInEditorTip"
            >
            ENGINE.assets.javascript.loadPluginInEditor
            </ui-label>
            <ui-checkbox
                slot="content"
                id="load-plugin-in-editor"
            ></ui-checkbox>
        </ui-prop>
    </div>

    <ui-code 
        language="javascript"
        id="code"
    >
    </ui-code>
</section>
`;

exports.$ = {
    code: '#code',
    isPluginCheckBox: '#is-plugin',
    loadPluginInEditorCheckBox: '#load-plugin-in-editor',
    loadPluginInWebCheckBox: '#load-plugin-in-web',
    loadPluginInNativeCheckBox: '#load-plugin-in-native',
    dependenciesNumInput: '#dependencies',
    dependenciesContent: '#dependencies-content',
    localContent: '#localContent',

    simulateGlobalsInput: '#simulateGlobalsInput',
    executionScope: '#executionScope',

};

exports.style = `
:host > .asset-javascript > ui-code[hidden] {
    display: none;
}
ui-prop[hidden]{
    display: none;
}
.asset-javascript {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.asset-javascript .assets > ui-asset {
    margin-top: 8px;
}
.asset-javascript ui-code {
    flex: 1;
    position: relative;
    overflow: auto;
    margin: 0;
    padding: 10px;
    font-size: 12px;
    border: 1px solid var(--color-normal-border);
    background: var(--color-normal-fill-emphasis);
    -webkit-user-select: text;
    cursor: auto;
}
`;
const uiElements = {
    executionScope: {
        ready () {
            this.$.executionScope.addEventListener('confirm', this._onPluginStateChanged.bind(this, 'executionScope'));
            for (const key of ['enclosed', 'global']) {
                const option = document.createElement('option');
                option.value = key;
                option.innerText = t(key);
                this.$.executionScope.appendChild(option);
            }
        },
        update () {
            this.$.executionScope.value = this.meta.userData.executionScope !== 'global' ? 'enclosed' : 'global';
            this.$.executionScope.invalid = this.getInvalid('executionScope');
        },
    },
    localContent: {
        update () {
            this.$.localContent.hidden = this.meta.userData.executionScope === 'global';
        },
    },
    isPluginCheckBox: {
        ready () {
            this.$.isPluginCheckBox.addEventListener('confirm', this._onPluginStateChanged.bind(this, 'isPlugin'));
        },
        update () {
            this.$.isPluginCheckBox.invalid = this.getInvalid('isPlugin');
            this.$.isPluginCheckBox.value = this.meta.userData.isPlugin;
        },
    },

    loadPluginInWebCheckBox: {
        ready () {
            this.$.loadPluginInWebCheckBox.addEventListener('confirm', this._onPluginStateChanged.bind(this, 'loadPluginInWeb'));
        },
        update () {
            this.$.loadPluginInWebCheckBox.value = this.meta && this.meta.userData.loadPluginInWeb;
            this.$.loadPluginInWebCheckBox.invalid = this.getInvalid('loadPluginInWeb');
        },
    },
    loadPluginInNativeCheckBox: {
        ready () {
            this.$.loadPluginInNativeCheckBox.addEventListener('confirm', this._onPluginStateChanged.bind(this, 'loadPluginInNative'));
        },
        update () {
            this.$.loadPluginInNativeCheckBox.value = this.meta && this.meta.userData.loadPluginInNative;
            this.$.loadPluginInNativeCheckBox.invalid = this.getInvalid('loadPluginInNative');
        },
    },
    loadPluginInEditorCheckBox: {
        ready () {
            this.$.loadPluginInEditorCheckBox.addEventListener('confirm', this._onPluginStateChanged.bind(this, 'loadPluginInEditor'));
        },
        update () {
            this.$.loadPluginInEditorCheckBox.value = this.meta && this.meta.userData.loadPluginInEditor;
            this.$.loadPluginInEditorCheckBox.invalid = this.getInvalid('loadPluginInEditor');
        },
    },
    simulateGlobalsInput: {
        ready () {
            function onSimulateGlobalsListChanged (event) {
                const value = event.target.value;
                if (typeof value === 'string') {
                    let globalNames = [];
                    if (value.length !== 0) {
                        globalNames = value.split(';')
                            .map((globalName) => globalName.trim())
                            .filter((globalName) => globalName.length !== 0);
                    }
                    this.metas.forEach((meta) => meta.userData.simulateGlobals = globalNames.length === 0 ? true : globalNames);
                    this.dispatch('change');
                }
            }
            this.$.simulateGlobalsInput.addEventListener('confirm', onSimulateGlobalsListChanged);
        },
        update () {
            const meta = this.meta;
            const simulateGlobalsInput = this.$.simulateGlobalsInput;
            simulateGlobalsInput.value = Array.isArray(meta.userData.simulateGlobals) ? meta.userData.simulateGlobals.join(';') : '';
        },
    },
    dependenciesNumInput: {
        ready () {
            function _onChangeDependenciesLength (event) {
                const meta = this.meta;
                const length = event.target.value;
                if (!Array.isArray(meta.userData.dependencies)) {
                    meta.userData.dependencies = [];
                }

                if (length < 0 || length > 10) {
                    return;
                }
                while (meta.userData.dependencies.length < length) {
                    meta.userData.dependencies.push('');
                }

                while (meta.userData.dependencies.length > length) {
                    meta.userData.dependencies.pop();
                }
                this.dispatch('change');
                uiElements.dependenciesNumInput.update.call(this);
            }
            this.$.dependenciesNumInput.addEventListener('confirm', _onChangeDependenciesLength.bind(this));
        },
        update () {
            this.$.dependenciesNumInput.value = this.meta.userData.dependencies ? this.meta.userData.dependencies.length : 0;
            const dependenciesContent = this.$.dependenciesContent;
            const childNodes = dependenciesContent.children;
            const meta = this.meta;
            const length = this.$.dependenciesNumInput.value;

            function onDependenciesChange (event) {
                const value = event.target.value;
                this.value = value;
                meta.userData.dependencies[this.getAttribute('index')] = value;
                this.dispatch('change');
            }

            for (let index = 0; index < length; index++) {
                const element = childNodes[index];
                const value = meta.userData.dependencies[index];
                if (!element) {
                    const child = document.createElement('ui-asset');
                    child.setAttribute('index', index.toString());
                    child.setAttribute('value', value);
                    child.setAttribute('droppable', 'cc.Script');
                    child.addEventListener('confirm', onDependenciesChange.bind(child));
                    dependenciesContent.appendChild(child);
                } else {
                    element.value = value;
                    element.setAttribute('index', index.toString());
                }
            }
            if (childNodes.length > length) {
                const needlessNodes = [];
                for (let index = childNodes.length - 1; index > length - 1; index--) {
                    const element = childNodes[index];
                    needlessNodes.push(element);
                }
                needlessNodes.forEach((node) => { dependenciesContent.removeChild(node); });
            }
        },
    },
    pluginOperations: {
        ready () {
            this.pluginOperations = this.$this.shadowRoot.querySelectorAll('.plugin-operation');
        },
        update () {
            const meta = this.meta;
            const pluginOperations = this.pluginOperations;
            pluginOperations.forEach((element) => { element.hidden = !meta.userData.isPlugin || this.getInvalid('isPlugin'); });
        },
    },
    code: {

        update () {
            if (this.assetInfos.length === 1) {
                const info = this.assetInfo;
                this.$.code.hidden = false;
                if (info.importer !== 'javascript') {
                    return;
                }
                const readStream = createReadStream(info.file, { encoding: 'utf-8' });
                // Displays 400 lines or 20,000 characters
                let remainLines = MAX_LINES;
                let remainLength = MAX_LENGTH;
                let text = '';
                const readLineStream = ReadLine.createInterface({ input: readStream, setEncoding: 'utf-8' });
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
                    }
                });
                readLineStream.on('close', (err) => {
                    if (err) {
                        throw err;
                    }
                    this.$.code.innerHTML = text;
                });
            } else {
                this.$.code.innerText = '';
                this.$.code.hidden = true;
            }
        },
    },
};
/**
 * Methods to automatically render components
 */
exports.update = function (assetList, metaList) {
    this.metas = metaList;
    this.meta = this.metas[0];
    this.assetInfos = assetList;
    this.assetInfo = assetList[0];
    for (const key in uiElements) {
        const element = uiElements[key];
        if (element.update) {
            element.update.call(this);
        }
    }
};

/**
 * A method to initialize the panel
 */
exports.ready = function () {
    for (const key in uiElements) {
        const element = uiElements[key];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

exports.methods = {
    /**
   * Checks whether a data is invalid in the multiple - selected state
   * @param key string
   */
    getInvalid (key) {
        const metas = this.metas;
        const source = metas[0].userData[key];
        return !metas.every((meta) => source === meta.userData[key]);
    },
    /**
    *
    * @param key key of userData
    * @param event document event
    */
    _onPluginStateChanged (key, event) {
        const value = event.target.value;
        this.metas.forEach((meta) => {
            meta.userData[key] = value;
            if (key === 'isPlugin' && value) {
                if (!('loadPluginInWeb' in meta.userData)) {
                    meta.userData.loadPluginInWeb = true;
                }
                if (!('loadPluginInNative' in meta.userData)) {
                    meta.userData.loadPluginInNative = true;
                }
                if (!('loadPluginInEditor' in meta.userData)) {
                    meta.userData.loadPluginInEditor = false;
                }
            }
        });
        exports.update.call(this, this.assetInfos, this.metas);
        this.dispatch('change');
    },

};
