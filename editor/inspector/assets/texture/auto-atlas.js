'use strict';

const texture = require('./texture');

exports.template = texture.template;

exports.style = texture.style;

exports.$ = texture.$;

/**
 * attribute corresponds to the edit element
 */
const Elements = texture.Elements;

/**
 * Methods for automatic rendering of components
 * @param assetList
 * @param metaList
 */
exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    this.userData = this.meta.userData.textureSetting;
    this.userDataList = this.metaList.map((item) => item.userData.textureSetting);

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
        }
    }
};

/**
 * Method of initializing the panel
 */
exports.ready = texture.ready;

exports.methods = texture.methods;
