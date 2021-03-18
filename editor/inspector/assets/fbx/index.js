'use strict';

const { readFileSync } = require('fs-extra');
const { join } = require('path');
const { ready } = require('../fbx');

exports.template = `
<div class="asset-fbx">
    <header class="header">
        <ui-tab class="tabs"></<ui-tab>
    </header>
    <div class="content">
       
    </div>
    <div class="preview">
        <div class="preview-info">
            <ui-label value="Vertices:0"></ui-label>
            <ui-label value="Triangles:0"></ui-label>
        </div>
        <div class="preview-image">
            <canvas class="preview-canvas"></canvas>
        </div>
    </div>
</div>
`;

exports.style = readFileSync(join(__dirname, './index.css'), 'utf8');

exports.$ = {
    container: '.asset-fbx',
    header: '.header',
    tabs: '.tabs',
    content: '.content',
    content: '.content',
};

/**
 * 属性对应的编辑元素
 */
const Elements = {
    tabs: {
        ready() {
            const panel = this;

            const tabs = ['model', 'animation', 'material', 'fbx'];
            tabs.forEach((name,index) => {
                const button = document.createElement('ui-button');
                panel.$.tabs.appendChild(button);

                button.addEventListener('click', () => {
                    this.activeTabIndex = index;
                    Elements.tabs.update();
                });

                const label = document.createElement('ui-label');
                button.appendChild(label);
                label.setAttribute('value', `i18n:inspector.asset.fbx.${name}`);
            });

            this.activeTabIndex = 0;
        },
        update() {
            const panel = this;

            panel.$.tabs.value = this.activeTabIndex;
        }
    },
    tabContent: {
        ready(){ },
        update(){ },
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
