const texture = require('./texture/texture');

const insertTemplate = `
<ui-prop>
    <ui-label slot="label" value="Width"></ui-label>
    <ui-num-input slot="content" class="width-input" min="1" step="1"></ui-num-input>
</ui-prop>
<ui-prop>
    <ui-label slot="label" value="Height"></ui-label>
    <ui-num-input slot="content" class="height-input" min="1" step="1"></ui-num-input>
</ui-prop>
`;

exports.template = texture.template.replace('<!-- dont delete, for insert -->', insertTemplate);

exports.style = texture.style;

exports.$ = Object.assign({}, texture.$, {
    widthInput: '.width-input',
    heightInput: '.height-input',
});

const Elements = Object.assign({}, texture.Elements, {
    width: {
        ready() {
            const panel = this;

            panel.$.widthInput.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.width = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            panel.$.widthInput.value = panel.userData.width;

            panel.updateInvalid(panel.$.widthInput, 'width');
            panel.updateReadonly(panel.$.widthInput);
        },
    },
    height: {
        ready() {
            const panel = this;

            panel.$.heightInput.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.height = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            panel.$.heightInput.value = panel.userData.height;

            panel.updateInvalid(panel.$.heightInput, 'height');
            panel.updateReadonly(panel.$.heightInput);
        },
    },
});

exports.ready = texture.ready;

exports.methods = Object.assign({}, texture.methods, {
    async apply() {
        await Editor.Message.request('scene', 'apply-render-texture', this.asset.uuid, this.userData);
    },
});

exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = this.assetList[0];
    this.meta = this.metaList[0];

    this.userData = this.meta.userData;
    this.userDataList = this.metaList.map((item) => item.userData);

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
        }
    }
};
