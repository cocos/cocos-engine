'use strict';

exports.template = `
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

exports.style = `

`;

exports.methods = {
    /**
     * Update whether a data is editable in multi-select state
     */
     updateInvalid(element, prop) {
        const invalid = this.metaList.some((meta) => {
            return meta.userData[prop] !== this.meta.userData[prop];
        });
        element.invalid = invalid;
    },
    /**
     * Update read-only status
     */
    updateReadonly(element) {
        if (this.asset.readonly) {
            element.setAttribute('disabled', true);
        } else {
            element.removeAttribute('disabled');
        }
    },
};

exports.update = function(assetList, metaList) {
    const panel = this;

    panel.assetList = assetList;
    panel.metaList = metaList;
    panel.asset = assetList[0];
    panel.meta = metaList[0];
    
    // persistent
    panel.updateInvalid(panel.$.persistentCheckbox, 'persistent');
    panel.updateReadonly(panel.$.persistentCheckbox);
    panel.$.persistentCheckbox.value = panel.meta.userData.persistent;
};

exports.ready = function() {
    const panel = this;

    panel.$.persistentCheckbox.addEventListener('change', (event) => {
        panel.metaList.forEach((meta) => {
            meta.userData.persistent = event.target.value;
        });
        panel.dispatch('change');
    });
};
