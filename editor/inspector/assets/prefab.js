'use strict';

const { updateElementReadonly, updateElementInvalid } = require('../utils/assets');

exports.template = /* html */`
<section class="asset-scene">
    <ui-prop>
        <ui-label slot="label" value="Persistent"></ui-label>
        <ui-checkbox slot="content" class="persistent-checkbox"></ui-checkbox>
    </ui-prop>
</section>`;

exports.$ = {
    container: '.asset-scene',
    persistentCheckbox: '.persistent-checkbox',
};

exports.style = /* css */`
.asset-scene {
    padding-right: 4px;
}
`;

exports.ready = function() {
    const panel = this;

    panel.$.persistentCheckbox.addEventListener('confirm', (event) => {
        panel.metaList.forEach((meta) => {
            meta.userData.persistent = event.target.value;
        });
        panel.dispatch('change');
        panel.dispatch('snapshot');
    });
};

exports.update = function(assetList, metaList) {
    const panel = this;

    panel.assetList = assetList;
    panel.metaList = metaList;
    panel.asset = assetList[0];
    panel.meta = metaList[0];

    panel.$.persistentCheckbox.value = panel.meta.userData.persistent;

    updateElementInvalid.call(panel, panel.$.persistentCheckbox, 'persistent');
    updateElementReadonly.call(panel, panel.$.persistentCheckbox);
};
