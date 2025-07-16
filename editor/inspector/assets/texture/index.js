'use strict';

const texture = require('./texture');

exports.template = texture.template;

exports.style = texture.style;

exports.$ = texture.$;

const Elements = texture.Elements;

exports.methods = texture.methods;

exports.ready = texture.ready;

exports.update = function(assetList, metaList, parentAssetList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];
    this.parentAssetList = parentAssetList;

    this.userData = this.meta.userData;
    this.userDataList = this.metaList.map((item) => item.userData);

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
        }
    }
};
