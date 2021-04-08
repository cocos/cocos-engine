'use strict';

const texture = require('./texture');

exports.template = texture.template;

exports.style = texture.style;

exports.$ = texture.$;

/**
 * 属性对应的编辑元素
 */
const Elements = texture.Elements;

/**
 * 自动渲染组件的方法
 * @param assetList
 * @param metaList
 */
exports.update = function (assetList, metaList) {
    this.asset = assetList[0];
    this.userData = metaList[0].userData.textureSetting;
    this.userDataList = metaList.map((item) => item.userData.textureSetting);

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
exports.ready = texture.ready;

exports.methods = texture.methods;;
