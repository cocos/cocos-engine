'use strict';

exports.template = `
<div class="asset-scene">
    <ui-checkbox class="asyncLoadAssets">
        <ui-label value="i18n:ENGINE.assets.scene.asyncLoadAssets"></ui-label>
    </ui-checkbox>
</div>
`;

exports.style = `
    .asset-scene { padding-left: 16px; }
`;

exports.$ = {
    container: '.asset-scene',
    asyncLoadAssets: '.asyncLoadAssets',
};

/**
 * 自动渲染组件的方法
 * @param assetList
 * @param metaList
 */
exports.update = function (assetList, metaList) {
    this._assetList = assetList;
    this._metaList = metaList;

    const asyncLoadAssets = metaList[0].userData.asyncLoadAssets;
    const asyncLoadAssetsInvalid = metaList.some((meta) => {
        return meta.userData.asyncLoadAssets !== asyncLoadAssets;
    });

    this.$.asyncLoadAssets.value = asyncLoadAssets;
    this.$.asyncLoadAssets.invalid = asyncLoadAssetsInvalid;

    if (assetList[0].readonly) {
        this.$.asyncLoadAssets.setAttribute('disabled', true);
    } else {
        this.$.asyncLoadAssets.removeAttribute('disabled');
    }
};

/**
 * 初始化界面的方法
 */
exports.ready = function () {
    this.$.asyncLoadAssets.addEventListener('change', (event) => {
        this._metaList.forEach((meta) => {
            meta.userData.asyncLoadAssets = event.target.value;
        });
        this.dispatch('change');
    });
};
