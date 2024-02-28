'use strict';

const { updateElementReadonly, updateElementInvalid } = require('../utils/assets');

const { createReadStream } = require('fs');
const ReadLine = require('readline');

const MAX_LINES = 400;
const MAX_LENGTH = 20000;

exports.template = /* html */`
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
        <ui-prop id="executionScope">
            <ui-label slot="label" value="i18n:ENGINE.assets.javascript.globalThisAlias"></ui-label>
            <ui-checkbox slot="content"
                id="simulateGlobalsCheckBox"
            ></ui-checkbox>
        </ui-prop>
        <ui-prop id="simulateGlobals">
            <ui-label slot="label"></ui-label>
            <ui-input slot="content"
                id="simulateGlobalsInput"
                placeholder="self;window;global;globalThis"
                tooltip="i18n:ENGINE.assets.javascript.globalThisAliasTip"
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
        <ui-prop>
            <ui-label slot="label"
                tooltip="i18n:ENGINE.assets.javascript.loadPluginInMiniGameTip"
                value="i18n:ENGINE.assets.javascript.loadPluginInMiniGame"
            ></ui-label>
            <ui-checkbox slot="content"
                id="load-plugin-in-mini-game"
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

exports.style = /* css */`
.asset-javascript {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    /* it is necessary */
    height: 0px;
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

exports.$ = {
    isPluginCheckBox: '#is-plugin',
    detail: '.detail',
    loadPluginInEditorCheckBox: '#load-plugin-in-editor',
    loadPluginInWebCheckBox: '#load-plugin-in-web',
    loadPluginInNativeCheckBox: '#load-plugin-in-native',
    loadPluginInMiniGameCheckBox: '#load-plugin-in-mini-game',
    simulateGlobals: '#simulateGlobals',
    simulateGlobalsInput: '#simulateGlobalsInput',
    simulateGlobalsCheckBox: '#simulateGlobalsCheckBox',
    executionScope: '#executionScope',
    code: '#code',
};

const Elements = {
    isPlugin: {
        ready() {
            this.$.isPluginCheckBox.addEventListener('confirm', (event) => {
                this.change('isPlugin', event);
                if (event.target.value) {
                    this.metaList.forEach((meta) => {
                        const defaultConfig = {
                            loadPluginInEditor: false,
                            loadPluginInWeb: true,
                            loadPluginInNative: true,
                            loadPluginInMiniGame: true,
                        };
                        meta.userData = Object.assign(defaultConfig, meta.userData);
                    })
                }
                Elements.detail.update.call(this);
            });
        },
        update() {
            this.$.isPluginCheckBox.value = this.meta.userData.isPlugin;
            updateElementInvalid.call(this, this.$.isPluginCheckBox, 'isPlugin');
            updateElementReadonly.call(this, this.$.isPluginCheckBox);
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
    executionScope: {
        ready() {
            this.$.simulateGlobalsCheckBox.addEventListener('confirm', (event) => {
                const value = event.target.value ? 'enclosed' : 'global';
                this.changeUserData('executionScope', value);
                Elements.executionScope.update.call(this);
                Elements.simulateGlobals.update.call(this);
            });
        },
        update() {
            this.$.simulateGlobalsCheckBox.value = (this.meta.userData.executionScope === 'enclosed');
            updateElementInvalid.call(this, this.$.executionScope, 'executionScope');
            updateElementReadonly.call(this, this.$.executionScope);
        },
    },
    simulateGlobals: {
        ready() {
            this.$.simulateGlobalsInput.addEventListener('confirm', (event) => {
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
                    this.dispatch('snapshot');
                }
            });
        },
        update() {
            let display = 'none';
            if (this.meta.userData.executionScope === 'enclosed') {
                display = 'block';
            }

            this.$.simulateGlobals.style.display = display;

            if (display === 'none') {
                return;
            }

            updateElementReadonly.call(this, this.$.simulateGlobalsInput);

            this.$.simulateGlobalsInput.value = Array.isArray(this.meta.userData.simulateGlobals)
                ? this.meta.userData.simulateGlobals.join(';')
                : '';
        },
    },
    loadPluginInWebCheckBox: {
        ready() {
            this.$.loadPluginInWebCheckBox.addEventListener('confirm', (event) => {
                this.change('loadPluginInWeb', event);
                Elements.loadPluginInEditorCheckBox.update.call(this);
            });
        },
        update() {
            this.$.loadPluginInWebCheckBox.value = this.meta.userData.loadPluginInWeb ?? true;
            updateElementInvalid.call(this, this.$.loadPluginInWebCheckBox, 'loadPluginInWeb');
            updateElementReadonly.call(this, this.$.loadPluginInWebCheckBox);
        },
    },
    loadPluginInNativeCheckBox: {
        ready() {
            this.$.loadPluginInNativeCheckBox.addEventListener('confirm', this.change.bind(this, 'loadPluginInNative'));
        },
        update() {
            this.$.loadPluginInNativeCheckBox.value = this.meta.userData.loadPluginInNative ?? true;
            updateElementInvalid.call(this, this.$.loadPluginInNativeCheckBox, 'loadPluginInNative');
            updateElementReadonly.call(this, this.$.loadPluginInNativeCheckBox);
        },
    },
    loadPluginInMiniGameCheckBox: {
        ready() {
            this.$.loadPluginInMiniGameCheckBox.addEventListener('confirm', this.change.bind(this, 'loadPluginInMiniGame'));
        },
        update() {
            this.$.loadPluginInMiniGameCheckBox.value = this.meta.userData.loadPluginInMiniGame ?? true;
            updateElementInvalid.call(this, this.$.loadPluginInMiniGameCheckBox, 'loadPluginInMiniGame');
            updateElementReadonly.call(this, this.$.loadPluginInMiniGameCheckBox);
        },
    },
    loadPluginInEditorCheckBox: {
        ready() {
            this.$.loadPluginInEditorCheckBox.addEventListener('confirm', this.change.bind(this, 'loadPluginInEditor'));
        },
        update() {
            
            this.$.loadPluginInEditorCheckBox.value = this.meta.userData.loadPluginInWeb ? this.meta.userData.loadPluginInEditor : false;
            this.$.loadPluginInEditorCheckBox.disabled = this.meta.userData.loadPluginInWeb ? false : true;
            updateElementInvalid.call(this, this.$.loadPluginInEditorCheckBox, 'loadPluginInEditor');
            updateElementReadonly.call(this, this.$.loadPluginInEditorCheckBox);
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

exports.methods = {
    t(key) {
        return Editor.I18n.t(`ENGINE.assets.javascript.${key}`);
    },
    change(key, event) {
        this.changeUserData(key, event.target.value);
    },
    changeUserData(key, value) {
        this.metaList.forEach((meta) => {
            meta.userData[key] = value;
        });

        this.dispatch('change');
        this.dispatch('snapshot');
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
