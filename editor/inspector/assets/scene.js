'use strict';

exports.template = `
<ui-prop>
    <ui-label slot="label">Async Load Assets</ui-label>
    <ui-checkbox class="asyncLoadAssets" slot="content"></ui-checkbox>
</ui-prop>
`;

exports.$ = {
    'section': 'section',
    'asyncLoadAssets': '.asyncLoadAssets',
};

/**
 * 自动渲染组件的方法
 * @param assetList 
 * @param metaList 
 */
exports.update = function(assetList, metaList) {
    this._assetList = assetList;
    this._metaList = metaList;
    
    const asyncLoadAssets = metaList[0].userData.asyncLoadAssets;
    const asyncLoadAssetsInvalid = metaList.some((meta) => {
        return meta.userData.asyncLoadAssets !== asyncLoadAssets;
    });

    this.$.asyncLoadAssets.value = asyncLoadAssets;
    this.$.asyncLoadAssets.invalid = asyncLoadAssetsInvalid;
};

/**
 * 初始化界面的方法
 */
exports.ready = function() {
    this.$.asyncLoadAssets.addEventListener('change', (event) => {
        this._metaList.forEach((meta) => {
            meta.userData.asyncLoadAssets = event.target.value;
        });
        this.dispatch('change');
    });
}
