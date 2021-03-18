'use strict';

exports.template = `
<div class="asset-fbx">
    <header class="header">
        <<ui-tab class="header-tabs">
            <ui-button>
                <ui-label value="i18n:inspector.asset.fbx.model"></ui-label>
            </ui-button>
        </<ui-tab>
    </header>
    <div class="content">
       
    </div>
</div>
`;

exports.style = `
    .asset-fbx { 
        display: flex;
        flex: 1;
        flex-direction: column;
    }
    .asset-fbx > .header {
        text-align: center;
        padding-bottom: 10px;
        line-height: calc(var(--size-big-line) * 1px);
    }

   
`;

exports.$ = {
    container: '.asset-fbx',
    header: '.header',
    headerTabs: '.header-tabs',

};

/**
 * 属性对应的编辑元素
 */
const Elements = {
    headerTabs: {
        ready() {
            const panel = this;

            const headerTabs = ['model', 'animation', 'material', 'fbx'];
            headerTabs.forEach((name) => {
                const button = document.createElement('ui-button');
                panel.$.headerTabs.appendChild(button);
                
                const label = document.createElement('ui-label');
                button.appendChild(label);
                label.setAttribute('value', `i18n:inspector.asset.fbx.${name}`);
            });

        },
        update() {
            const panel = this;

            panel.$.anisotropyInput.value = panel.meta.userData.anisotropy;

            panel.updateInvalid(panel.$.anisotropyInput, 'anisotropy');
            panel.updateReadonly(panel.$.anisotropyInput);
        },
    },

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

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
        }
    }
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

exports.methods = {
    /**
     * 更新多选状态下某个数据是否可编辑
     */
    updateInvalid(element, prop) {
        const invalid = this.metaList.some((meta) => {
            return meta.userData[prop] !== this.meta.userData[prop];
        });
        element.invalid = invalid;
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
};
