'use strict';

const texture = require('./texture');
const { readFileSync, writeFileSync } = require('fs');

exports.template = texture.template;

exports.style = texture.style;

exports.$ = texture.$;

const Elements = texture.Elements;

exports.methods = Object.assign({}, texture.methods, {
    // before save meta
    apply() {
        const file = this.asset.file;
        if (file) {
            try {
                const pacData = JSON.parse(readFileSync(file, 'utf8'));
                Object.assign(pacData, {
                    ver: this.meta.ver,
                    importer: this.meta.importer,
                    userData: this.meta.userData,
                });
                writeFileSync(file, JSON.stringify(pacData, null, 2), 'utf8');
            } catch (error) {
                console.error('Failed to save auto atlas settings!');
                return false;
            }
        }
        return;
    }
});

exports.ready = texture.ready;

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

